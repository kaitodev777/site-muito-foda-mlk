import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
    return Response.json(orders);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_name, customer_email, total_amount, items } = body;

    const result = await sql`
      INSERT INTO orders (customer_name, customer_email, total_amount, items)
      VALUES (${customer_name}, ${customer_email}, ${total_amount}, ${JSON.stringify(items)})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
