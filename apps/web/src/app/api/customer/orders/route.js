import sql from "@/app/api/utils/sql";

// Buscar pedidos do cliente por email
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const orders = await sql`
      SELECT 
        id,
        customer_name,
        customer_email,
        total_amount,
        status,
        items,
        credentials_sent,
        created_at
      FROM orders
      WHERE customer_email = ${email}
      ORDER BY created_at DESC
    `;

    return Response.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return Response.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}
