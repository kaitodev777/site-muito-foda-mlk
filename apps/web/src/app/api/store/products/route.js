import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    return Response.json(products);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, image_url, gallery, category, stock } =
      body;

    const result = await sql`
      INSERT INTO products (name, description, price, image_url, gallery, category, stock)
      VALUES (${name}, ${description}, ${price}, ${image_url}, ${gallery || []}, ${category}, ${stock || 10})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
