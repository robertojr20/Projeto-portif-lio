const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

// Seu e-mail (autenticação) e Senha de App
const USER_EMAIL = 'robertojr.varela22@gmail.com'; 
const APP_PASSWORD = 'aedtofjxibfxlbrp'; // Senha de App SEM ESPAÇOS

// Configuração do email (usando sua Senha de App)
const transporter = nodemailer.createTransport({
    service: 'gmail', //outlook, yahoo
    auth : {
        user: USER_EMAIL, // Seu email (REMETENTE DE AUTENTICAÇÃO)
        pass : APP_PASSWORD 
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Configurações
app.use(cors()); // Permite requests do frontend
app.use(express.json()); // Permite receber JSON

// Rota para enviar email
app.post('/enviar-email', async (req, res) => {
    try {
        const { nome, email, mensagem } = req.body;
        
        // 1. CRIA O REMETENTE EXIBIDO (Nome do cliente <Seu Email>)
        // O Gmail permite que você mude o NOME de exibição, desde que o EMAIL seja o seu.
        const fromDisplay = `"${nome} (${email})" <${USER_EMAIL}>`;

        // Configura o email
        const mailOptions = {
            // Usa o nome do cliente como remetente de exibição
            from: fromDisplay, 
            to: USER_EMAIL, // EMAIL QUE RECEBERÁ (SUA CAIXA DE ENTRADA)
            subject: `[PORTFÓLIO] Nova Mensagem de ${nome}`,
            
            // 2. O campo replyTo garante que, ao clicar em Responder, 
            // a resposta vá para o e-mail do cliente
            replyTo: email, 
            
            html: `
                <h2>Nova mensagem do portfolio</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email do Cliente:</strong> ${email}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagem}</p>
                <hr>
                <p>Enviado em: ${new Date().toLocaleString('pt-BR')}</p>
            `
        };

        // Envia o email
        await transporter.sendMail(mailOptions);
        
        console.log('📧 Email enviado com sucesso para:', USER_EMAIL);
        res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
        
    } catch (error) {
        console.error('❌ Erro ao enviar email (veja o trace abaixo):', error);
        res.status(500).json({ success: false, message: 'Erro ao enviar mensagem' });
    }
});

// Rota de teste
app.get('/teste', (req, res) => {
    res.json({ message: 'Servidor funcionando!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📧 Endpoint: http://localhost:${PORT}/enviar-email`);
});
