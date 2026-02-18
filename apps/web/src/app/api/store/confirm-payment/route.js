import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, paymentMethod } = body;

    if (!orderId) {
      return Response.json(
        { error: "ID do pedido não fornecido" },
        { status: 400 },
      );
    }

    // Buscar pedido
    const [order] = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `;

    if (!order) {
      return Response.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    if (order.status === "completed") {
      return Response.json({ error: "Pedido já foi pago" }, { status: 400 });
    }

    const items = JSON.parse(order.items);

    // Buscar e reservar credenciais disponíveis para cada produto
    const credentialsByProduct = [];

    for (const item of items) {
      const [product] = await sql`
        SELECT id, name, credentials 
        FROM products 
        WHERE id = ${item.id}
      `;

      if (!product) {
        return Response.json(
          { error: `Produto ${item.id} não encontrado` },
          { status: 404 },
        );
      }

      const credentials = product.credentials || [];
      const availableCredentials = credentials.filter((c) => c.available);

      if (availableCredentials.length < item.quantity) {
        return Response.json(
          { error: `Estoque insuficiente para ${product.name}` },
          { status: 400 },
        );
      }

      // Reservar as credenciais necessárias
      const selectedCredentials = availableCredentials.slice(0, item.quantity);

      credentialsByProduct.push({
        productId: product.id,
        productName: product.name,
        credentials: selectedCredentials,
        quantity: item.quantity,
      });

      // Marcar credenciais como não disponíveis
      const updatedCredentials = credentials.map((cred) => {
        const isSelected = selectedCredentials.some(
          (sel) => sel.email === cred.email,
        );
        return isSelected ? { ...cred, available: false } : cred;
      });

      await sql`
        UPDATE products 
        SET credentials = ${JSON.stringify(updatedCredentials)}
        WHERE id = ${product.id}
      `;
    }

    // Atualizar pedido para completed
    await sql`
      UPDATE orders 
      SET status = 'completed', credentials_sent = ${JSON.stringify(credentialsByProduct)}
      WHERE id = ${orderId}
    `;

    // Montar e-mail com as credenciais
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: linear-gradient(135deg, #1a1a1a 0%, #2d1b3d 100%);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #e0e0e0;
            }
            .product-block {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              padding: 24px;
              margin: 20px 0;
            }
            .product-name {
              font-size: 20px;
              font-weight: 600;
              color: #667eea;
              margin-bottom: 16px;
            }
            .credentials {
              background: #000000;
              border-radius: 8px;
              padding: 16px;
              margin: 12px 0;
              border-left: 4px solid #667eea;
            }
            .cred-label {
              font-size: 12px;
              color: #888;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 4px;
            }
            .cred-value {
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              font-family: 'Courier New', monospace;
            }
            .footer {
              background: rgba(0, 0, 0, 0.3);
              padding: 24px 30px;
              text-align: center;
              font-size: 14px;
              color: #888;
            }
            .divider {
              height: 1px;
              background: rgba(255, 255, 255, 0.1);
              margin: 24px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Pagamento Confirmado!</h1>
            </div>
            <div class="content">
              <p class="greeting">Olá <strong>${order.customer_name}</strong>,</p>
              <p style="color: #e0e0e0; line-height: 1.6;">
                Seu pagamento foi confirmado com sucesso! Abaixo estão os dados de acesso para seus streamings:
              </p>
              
              ${credentialsByProduct
                .map(
                  (item) => `
                <div class="product-block">
                  <div class="product-name">${item.productName}</div>
                  ${item.credentials
                    .map(
                      (cred) => `
                    <div class="credentials">
                      <div style="margin-bottom: 12px;">
                        <div class="cred-label">E-mail / Usuário</div>
                        <div class="cred-value">${cred.email}</div>
                      </div>
                      <div>
                        <div class="cred-label">Senha</div>
                        <div class="cred-value">${cred.password}</div>
                      </div>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              `,
                )
                .join("")}

              <div class="divider"></div>
              
              <p style="color: #e0e0e0; line-height: 1.6;">
                <strong>💡 Dicas importantes:</strong><br>
                • Guarde esses dados em um local seguro<br>
                • Não compartilhe suas credenciais com terceiros<br>
                • Em caso de dúvidas, entre em contato conosco<br>
              </p>

              <div style="text-align: center;">
                <p style="color: #888; margin-top: 30px;">
                  Pedido #${orderId} | Total: R$ ${parseFloat(order.total_amount).toFixed(2)}
                </p>
              </div>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} StreamHub. Todos os direitos reservados.
            </div>
          </div>
        </body>
      </html>
    `;

    // Enviar e-mail
    try {
      await sendEmail({
        to: order.customer_email,
        subject: `🎬 Seus Acessos de Streaming - Pedido #${orderId}`,
        html: emailHtml,
        text: `Olá ${order.customer_name}, seu pagamento foi confirmado! Confira seus dados de acesso no e-mail HTML.`,
      });
    } catch (emailError) {
      console.error("Erro ao enviar e-mail:", emailError);
      return Response.json({
        success: true,
        warning: "Pedido confirmado, mas houve um problema ao enviar o e-mail.",
      });
    }

    return Response.json({
      success: true,
      message:
        "Pagamento confirmado! Verifique seu e-mail para as credenciais de acesso.",
    });
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    return Response.json(
      { error: "Erro ao processar pagamento", details: error.message },
      { status: 500 },
    );
  }
}
