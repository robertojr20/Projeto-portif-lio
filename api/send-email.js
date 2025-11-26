import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { assunto, nome, email, mensagem } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // com gmail precisa ser true na porta 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // PRECISA SER App Password
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,   // nunca use o email do cliente
      replyTo: email,
      to: process.env.TO_EMAIL,
      subject: assunto || "Nova mensagem do formulário",
      text: `Assunto: ${assunto}\nNome: ${nome}\nEmail: ${email}\nMensagem:\n${mensagem}`,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Erro ao enviar email" });
  }
}
