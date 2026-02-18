import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const coupons = await sql`SELECT * FROM coupons ORDER BY id DESC`;
    return Response.json(coupons);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, discount_percentage, active } = body;

    const result = await sql`
      INSERT INTO coupons (code, discount_percentage, active)
      VALUES (${code}, ${discount_percentage}, ${active !== undefined ? active : true})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
