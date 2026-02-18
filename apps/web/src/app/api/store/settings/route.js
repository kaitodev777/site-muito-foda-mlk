import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const settings = await sql`SELECT * FROM store_settings WHERE id = 1`;
    return Response.json(settings[0] || {});
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      store_name,
      primary_color,
      banner_url,
      whatsapp_number,
      facebook_pixel_id,
      google_analytics_id,
      stripe_public_key,
      stripe_secret_key,
      mercado_pago_public_key,
      mercado_pago_access_token,
    } = body;

    const result = await sql`
      UPDATE store_settings
      SET 
        store_name = ${store_name},
        primary_color = ${primary_color},
        banner_url = ${banner_url},
        whatsapp_number = ${whatsapp_number},
        facebook_pixel_id = ${facebook_pixel_id},
        google_analytics_id = ${google_analytics_id},
        stripe_public_key = ${stripe_public_key},
        stripe_secret_key = ${stripe_secret_key},
        mercado_pago_public_key = ${mercado_pago_public_key},
        mercado_pago_access_token = ${mercado_pago_access_token}
      WHERE id = 1
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
