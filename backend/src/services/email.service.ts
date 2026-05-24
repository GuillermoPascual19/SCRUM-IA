export async function sendActivationEmail(to: string, name: string, token: string) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const activationUrl = `${frontendUrl}/activate?token=${token}`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "SCRUM-IA", email: process.env.SMTP_USER },
      to: [{ email: to, name }],
      subject: "Activa tu cuenta en SCRUM-IA",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0a0f0a; color: #fff; padding: 40px; border-radius: 12px;">
          <div style="margin-bottom: 32px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #22c55e; display: inline-flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-size: 14px;">S</div>
            <span style="font-weight: 600; font-size: 14px; margin-left: 8px;">SCRUM-IA</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Hola, ${name}</h1>
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 28px;">
            Gracias por registrarte en SCRUM-IA. Haz clic en el botón para activar tu cuenta. El enlace expira en 24 horas.
          </p>
          <a href="${activationUrl}" style="display: inline-block; background: #22c55e; color: #000; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
            Activar mi cuenta
          </a>
          <p style="color: #4b5563; font-size: 12px; margin-top: 32px;">
            Si no te has registrado en SCRUM-IA, ignora este correo.<br/>
            © 2026 SCRUM-IA · Trabajo Fin de Grado
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${error}`);
  }
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "SCRUM-IA", email: process.env.SMTP_USER },
      to: [{ email: to, name }],
      subject: "Recupera tu contraseña en SCRUM-IA",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0a0f0a; color: #fff; padding: 40px; border-radius: 12px;">
          <div style="margin-bottom: 32px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: #22c55e; display: inline-flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-size: 14px;">S</div>
            <span style="font-weight: 600; font-size: 14px; margin-left: 8px;">SCRUM-IA</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Recuperar contraseña</h1>
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 28px;">
            Hola ${name}, recibimos una solicitud para restablecer tu contraseña. El enlace expira en 1 hora.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #22c55e; color: #000; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
            Restablecer contraseña
          </a>
          <p style="color: #4b5563; font-size: 12px; margin-top: 32px;">
            Si no solicitaste esto, ignora este correo. Tu contraseña no cambiará.<br/>
            © 2026 SCRUM-IA · Trabajo Fin de Grado
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${error}`);
  }
}
