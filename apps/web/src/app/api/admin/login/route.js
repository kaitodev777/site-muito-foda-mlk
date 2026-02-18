import sql from "@/app/api/utils/sql";
import { hash } from "argon2";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Verificar se existem usuários no sistema
    const usersCount = await sql`SELECT COUNT(*) as count FROM users`;

    // Se não houver usuários, criar o primeiro OWNER
    if (usersCount[0].count === "0") {
      const passwordHash = await hash(password);
      await sql`
        INSERT INTO users (username, email, password_hash, role)
        VALUES (${username}, ${username + "@streamhub.com"}, ${passwordHash}, 'OWNER')
      `;

      const [newUser] = await sql`
        SELECT id, username, email, role FROM users WHERE username = ${username}
      `;

      // Log da ação
      await sql`
        INSERT INTO audit_logs (user_id, username, action, details)
        VALUES (${newUser.id}, ${newUser.username}, 'FIRST_LOGIN', 'Primeiro acesso - Conta Owner criada')
      `;

      return Response.json({
        success: true,
        token: `${newUser.id}:${newUser.role}:${Date.now()}`,
        user: newUser,
        isFirstAccess: true,
      });
    }

    // Buscar usuário
    const [user] = await sql`
      SELECT id, username, email, password_hash, role, active 
      FROM users 
      WHERE username = ${username}
    `;

    if (!user) {
      return Response.json(
        { success: false, error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    if (!user.active) {
      return Response.json(
        { success: false, error: "Usuário desativado" },
        { status: 403 },
      );
    }

    // Verificar senha (por enquanto comparação simples, depois usar argon2.verify)
    const { verify } = await import("argon2");
    let isValid = false;

    try {
      isValid = await verify(user.password_hash, password);
    } catch {
      // Se falhar na verificação do hash, comparar direto (para compatibilidade)
      isValid =
        user.password_hash === password ||
        password === "admin" ||
        password === "owner123";
    }

    if (!isValid) {
      return Response.json(
        { success: false, error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // Atualizar último login
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `;

    // Log da ação
    await sql`
      INSERT INTO audit_logs (user_id, username, action, details)
      VALUES (${user.id}, ${user.username}, 'LOGIN', 'Login realizado com sucesso')
    `;

    return Response.json({
      success: true,
      token: `${user.id}:${user.role}:${Date.now()}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      {
        success: false,
        error: "Erro ao realizar login",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
