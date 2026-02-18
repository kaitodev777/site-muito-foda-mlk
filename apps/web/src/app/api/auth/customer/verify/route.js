import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return Response.json(
        { error: "E-mail e código são obrigatórios" },
        { status: 400 },
      );
    }

    // Buscar usuário
    const [user] = await sql`
      SELECT id, username, email, verification_code, verification_code_expires_at, email_verified
      FROM users
      WHERE email = ${email}
    `;

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    if (user.email_verified) {
      return Response.json({ error: "E-mail já verificado" }, { status: 400 });
    }

    // Verificar se o código expirou
    const now = new Date();
    const expiresAt = new Date(user.verification_code_expires_at);

    if (now > expiresAt) {
      return Response.json(
        { error: "Código expirado. Solicite um novo código." },
        { status: 400 },
      );
    }

    // Verificar se o código está correto
    if (user.verification_code !== code) {
      return Response.json({ error: "Código incorreto" }, { status: 400 });
    }

    // Marcar e-mail como verificado
    await sql`
      UPDATE users
      SET email_verified = true, verification_code = NULL, verification_code_expires_at = NULL
      WHERE id = ${user.id}
    `;

    // Gerar token de autenticação
    const token = `customer_${user.id}_${Date.now()}`;

    return Response.json({
      success: true,
      message: "E-mail verificado com sucesso!",
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro na verificação:", error);
    return Response.json(
      { error: "Erro ao verificar código" },
      { status: 500 },
    );
  }
}
