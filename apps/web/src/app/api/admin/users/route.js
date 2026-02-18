import sql from "@/app/api/utils/sql";
import { hash } from "argon2";

// Função auxiliar para extrair dados do token
function getUserFromToken(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  const [userId, role] = token.split(":");
  return { userId: parseInt(userId), role };
}

// Listar usuários (apenas OWNER)
export async function GET(request) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "OWNER") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const users = await sql`
      SELECT id, username, email, role, created_at, last_login, active
      FROM users
      ORDER BY created_at DESC
    `;

    return Response.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}

// Criar novo usuário (apenas OWNER)
export async function POST(request) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "OWNER") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, password, role } = body;

    // Validações
    if (!username || !email || !password || !role) {
      return Response.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    if (!["USER", "ADMIN", "OWNER"].includes(role)) {
      return Response.json({ error: "Role inválido" }, { status: 400 });
    }

    // Hash da senha
    const passwordHash = await hash(password);

    // Criar usuário
    const [newUser] = await sql`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (${username}, ${email}, ${passwordHash}, ${role})
      RETURNING id, username, email, role, created_at
    `;

    // Log da ação
    const [owner] =
      await sql`SELECT username FROM users WHERE id = ${user.userId}`;
    await sql`
      INSERT INTO audit_logs (user_id, username, action, details)
      VALUES (
        ${user.userId}, 
        ${owner.username}, 
        'CREATE_USER', 
        ${`Criou usuário ${username} com role ${role}`}
      )
    `;

    return Response.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.message?.includes("unique")) {
      return Response.json(
        { error: "Username ou email já existe" },
        { status: 400 },
      );
    }

    return Response.json({ error: "Erro ao criar usuário" }, { status: 500 });
  }
}

// Atualizar usuário (apenas OWNER)
export async function PUT(request) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "OWNER") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, password, active, role } = body;

    if (!userId) {
      return Response.json({ error: "userId é obrigatório" }, { status: 400 });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (password) {
      const passwordHash = await hash(password);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(passwordHash);
    }

    if (active !== undefined) {
      updates.push(`active = $${paramCount++}`);
      values.push(active);
    }

    if (role && ["USER", "ADMIN", "OWNER"].includes(role)) {
      updates.push(`role = $${paramCount++}`);
      values.push(role);
    }

    if (updates.length === 0) {
      return Response.json(
        { error: "Nenhum campo para atualizar" },
        { status: 400 },
      );
    }

    values.push(userId);
    const query = `
      UPDATE users 
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, username, email, role, active
    `;

    const [updatedUser] = await sql(query, values);

    // Log da ação
    const [owner] =
      await sql`SELECT username FROM users WHERE id = ${user.userId}`;
    await sql`
      INSERT INTO audit_logs (user_id, username, action, details)
      VALUES (
        ${user.userId}, 
        ${owner.username}, 
        'UPDATE_USER', 
        ${`Atualizou usuário ${updatedUser.username}`}
      )
    `;

    return Response.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 },
    );
  }
}

// Deletar usuário (apenas OWNER)
export async function DELETE(request) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "OWNER") {
      return Response.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId é obrigatório" }, { status: 400 });
    }

    // Não permitir deletar a si mesmo
    if (parseInt(userId) === user.userId) {
      return Response.json(
        { error: "Você não pode deletar sua própria conta" },
        { status: 400 },
      );
    }

    const [deletedUser] = await sql`
      DELETE FROM users 
      WHERE id = ${userId}
      RETURNING username
    `;

    if (!deletedUser) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Log da ação
    const [owner] =
      await sql`SELECT username FROM users WHERE id = ${user.userId}`;
    await sql`
      INSERT INTO audit_logs (user_id, username, action, details)
      VALUES (
        ${user.userId}, 
        ${owner.username}, 
        'DELETE_USER', 
        ${`Deletou usuário ${deletedUser.username}`}
      )
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return Response.json({ error: "Erro ao deletar usuário" }, { status: 500 });
  }
}
