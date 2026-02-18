import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const product = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (product.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json(product[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { name, description, price, image_url, gallery, category, stock } =
      body;

    const result = await sql`
      UPDATE products
      SET 
        name = ${name},
        description = ${description},
        price = ${price},
        image_url = ${image_url},
        gallery = ${gallery || []},
        category = ${category},
        stock = ${stock}
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    return Response.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
