import sql from "@/app/api/utils/sql";
import argon2 from "argon2";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 },
      );
    }

    // Buscar usuário
    const [user] = await sql`
      SELECT id, username, email, password_hash, role, active, email_verified
      FROM users
      WHERE email = ${email.toLowerCase()} AND role = 'USER'
    `;

    if (!user) {
      return Response.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 },
      );
    }

    if (!user.active) {
      return Response.json(
        { error: "Sua conta está desativada. Entre em contato com o suporte." },
        { status: 403 },
      );
    }

    // Verificar se o e-mail foi verificado
    if (!user.email_verified) {
      return Response.json(
        {
          error: "E-mail não verificado. Verifique sua caixa de entrada.",
          needsVerification: true,
          email: user.email,
        },
        { status: 403 },
      );
    }

    // Verificar senha
    const isPasswordValid = await argon2.verify(user.password_hash, password);

    if (!isPasswordValid) {
      return Response.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 },
      );
    }

    // Atualizar último login
    await sql`
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `;

    // Criar token (formato: userId:role:timestamp)
    const token = `${user.id}:USER:${Date.now()}`;

    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return Response.json(
      { error: "Erro ao processar login", details: error.message },
      { status: 500 },
    );
  }
}
