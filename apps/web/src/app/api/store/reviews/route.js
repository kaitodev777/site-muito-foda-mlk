import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const all = searchParams.get("all");

  try {
    let reviews;
    if (all === "true") {
      reviews = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;
    } else if (productId) {
      reviews =
        await sql`SELECT * FROM reviews WHERE product_id = ${productId} AND approved = true ORDER BY created_at DESC`;
    } else {
      reviews =
        await sql`SELECT * FROM reviews WHERE approved = true ORDER BY created_at DESC`;
    }
    return Response.json(reviews);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { product_id, author, rating, comment } = body;

    const result = await sql`
      INSERT INTO reviews (product_id, author, rating, comment)
      VALUES (${product_id}, ${author}, ${rating}, ${comment})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, approved } = body;

    const result = await sql`
      UPDATE reviews
      SET approved = ${approved}
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update review" }, { status: 500 });
  }
}
