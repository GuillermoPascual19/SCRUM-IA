import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendActivationEmail(to: string, name: string, token: string) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const activationUrl = `${frontendUrl}/activate?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"SCRUM-IA" <${process.env.SMTP_USER}>`,
    to,
    subject: "Activa tu cuenta en SCRUM-IA",
    html: `
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
  });
}
