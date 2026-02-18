import sql from "@/app/api/utils/sql";
import argon2 from "argon2";
import { sendEmail } from "@/app/api/utils/send-email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return Response.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 },
      );
    }

    // Verificar se e-mail já existe
    const [existingUser] = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (existingUser) {
      return Response.json(
        { error: "Este e-mail já está cadastrado" },
        { status: 409 },
      );
    }

    // Hash da senha
    const passwordHash = await argon2.hash(password);

    // Gerar código de verificação de 6 dígitos
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Criar usuário (não verificado)
    const [newUser] = await sql`
      INSERT INTO users (username, email, password_hash, role, active, email_verified, verification_code, verification_code_expires_at)
      VALUES (
        ${name || email.split("@")[0]},
        ${email.toLowerCase()},
        ${passwordHash},
        'USER',
        true,
        false,
        ${verificationCode},
        ${expiresAt}
      )
      RETURNING id, username, email
    `;

    // Enviar e-mail com código de verificação
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: linear-gradient(135deg, #1a1a1a 0%, #2d1b3d 100%);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .code-box {
              background: #000000;
              border: 2px solid #667eea;
              border-radius: 12px;
              padding: 24px;
              margin: 30px 0;
            }
            .code {
              font-size: 48px;
              font-weight: 700;
              letter-spacing: 8px;
              color: #667eea;
              font-family: 'Courier New', monospace;
            }
            .footer {
              background: rgba(0, 0, 0, 0.3);
              padding: 24px 30px;
              text-align: center;
              font-size: 14px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Verificação de E-mail</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; color: #e0e0e0; margin-bottom: 20px;">
                Olá <strong>${newUser.username}</strong>!
              </p>
              <p style="color: #e0e0e0; line-height: 1.6;">
                Para completar seu cadastro, use o código de verificação abaixo:
              </p>
              
              <div class="code-box">
                <div class="code">${verificationCode}</div>
              </div>

              <p style="color: #888; font-size: 14px;">
                Este código expira em 15 minutos.
              </p>
              <p style="color: #888; font-size: 14px; margin-top: 20px;">
                Se você não criou uma conta, ignore este e-mail.
              </p>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} StreamHub. Todos os direitos reservados.
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await sendEmail({
        to: newUser.email,
        subject: "🔐 Código de Verificação - StreamHub",
        html: emailHtml,
        text: `Seu código de verificação é: ${verificationCode}. Este código expira em 15 minutos.`,
      });
    } catch (emailError) {
      console.error("Erro ao enviar e-mail:", emailError);
      // Deletar usuário se não conseguir enviar e-mail
      await sql`DELETE FROM users WHERE id = ${newUser.id}`;
      return Response.json(
        {
          error:
            "Não foi possível enviar o código de verificação. Por favor, configure a API Key do Resend.",
        },
        { status: 500 },
      );
    }

    return Response.json({
      success: true,
      message:
        "Conta criada! Verifique seu e-mail para o código de verificação.",
      email: newUser.email,
      needsVerification: true,
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    return Response.json(
      { error: "Erro ao criar conta", details: error.message },
      { status: 500 },
    );
  }
}
