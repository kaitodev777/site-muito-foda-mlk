import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return Response.json({ error: "E-mail é obrigatório" }, { status: 400 });
    }

    // Buscar usuário
    const [user] = await sql`
      SELECT id, username, email, email_verified
      FROM users
      WHERE email = ${email}
    `;

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    if (user.email_verified) {
      return Response.json({ error: "E-mail já verificado" }, { status: 400 });
    }

    // Gerar novo código de verificação
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Atualizar código no banco
    await sql`
      UPDATE users
      SET verification_code = ${verificationCode}, verification_code_expires_at = ${expiresAt}
      WHERE id = ${user.id}
    `;

    // Enviar e-mail
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
              text-align: center;
            }
            .code-box {
              background: #000000;
              border: 2px solid #667eea;
              border-radius: 12px;
              padding: 24px;
              margin: 30px 0;
            }
            .code {
              font-size: 48px;
              font-weight: 700;
              letter-spacing: 8px;
              color: #667eea;
              font-family: 'Courier New', monospace;
            }
            .footer {
              background: rgba(0, 0, 0, 0.3);
              padding: 24px 30px;
              text-align: center;
              font-size: 14px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Novo Código de Verificação</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; color: #e0e0e0; margin-bottom: 20px;">
                Olá <strong>${user.username}</strong>!
              </p>
              <p style="color: #e0e0e0; line-height: 1.6;">
                Aqui está seu novo código de verificação:
              </p>
              
              <div class="code-box">
                <div class="code">${verificationCode}</div>
              </div>

              <p style="color: #888; font-size: 14px;">
                Este código expira em 15 minutos.
              </p>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} StreamHub. Todos os direitos reservados.
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: "🔐 Novo Código de Verificação - StreamHub",
      html: emailHtml,
      text: `Seu novo código de verificação é: ${verificationCode}. Este código expira em 15 minutos.`,
    });

    return Response.json({
      success: true,
      message: "Novo código enviado para seu e-mail!",
    });
  } catch (error) {
    console.error("Erro ao reenviar código:", error);
    return Response.json({ error: "Erro ao reenviar código" }, { status: 500 });
  }
}
