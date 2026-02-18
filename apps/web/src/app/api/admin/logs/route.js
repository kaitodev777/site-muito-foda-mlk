import sql from "@/app/api/utils/sql";

// Função auxiliar para extrair dados do token
function getUserFromToken(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  const [userId, role] = token.split(":");
  return { userId: parseInt(userId), role };
}

// Buscar logs (apenas OWNER)
export async function GET(request) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "OWNER") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const logs = await sql`
      SELECT 
        al.*,
        u.username as user_username,
        u.role as user_role
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const [{ count }] = await sql`SELECT COUNT(*) as count FROM audit_logs`;

    return Response.json({
      logs,
      total: parseInt(count),
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return Response.json({ error: "Erro ao buscar logs" }, { status: 500 });
  }
}

// Criar log manual
export async function POST(request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { action, details } = body;

    if (!action) {
      return Response.json({ error: "Action é obrigatório" }, { status: 400 });
    }

    const [userInfo] =
      await sql`SELECT username FROM users WHERE id = ${user.userId}`;

    const [log] = await sql`
      INSERT INTO audit_logs (user_id, username, action, details, ip_address)
      VALUES (${user.userId}, ${userInfo.username}, ${action}, ${details || ""}, ${request.headers.get("x-forwarded-for") || "unknown"})
      RETURNING *
    `;

    return Response.json(log);
  } catch (error) {
    console.error("Error creating log:", error);
    return Response.json({ error: "Erro ao criar log" }, { status: 500 });
  }
}
