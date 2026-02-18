import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      items,
      totalAmount,
      discount = 0,
    } = body;

    if (!customerName || !customerEmail || !items || items.length === 0) {
      return Response.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Verificar se há credenciais disponíveis para cada produto
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
    }

    // Criar pedido com status PENDING (aguardando pagamento)
    const [order] = await sql`
      INSERT INTO orders (
        customer_name, 
        customer_email, 
        items, 
        total_amount, 
        status
      )
      VALUES (
        ${customerName},
        ${customerEmail},
        ${JSON.stringify(items)},
        ${totalAmount},
        'pending'
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      orderId: order.id,
      message: "Pedido criado. Redirecionando para pagamento...",
    });
  } catch (error) {
    console.error("Erro ao processar checkout:", error);
    return Response.json(
      { error: "Erro ao processar pedido", details: error.message },
      { status: 500 },
    );
  }
}
