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
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `${nome} <${process.env.MAIL_USER || "robertojr.varela22@gmail.com"}>`,
      replyTo: email,
      to: process.env.TO_EMAIL || "robertojr.varela22@gmail.com",
      subject: assunto || "Nova mensagem do formulário do Portfólio",
      text: `Assunto: ${assunto}\nNome: ${nome}\nEmail: ${email}\nMensagem:\n${mensagem}`,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return res.status(500).json({ error: "Erro ao enviar email" });
  }
}
