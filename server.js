const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

//configuração do email 
// Usando a senha de app que o Gmail gerou, mas removendo os espaços.
const transporter = nodemailer.createTransport({
    service: 'gmail', //outlook, yahoo
    auth : {
        user: 'robertojr.varela22@gmail.com', // email pessoal 
        pass : 'aedtofjxibfxlbrp' // SENHA DE APP DE 16 CARACTERES SEM ESPAÇOS
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
        
        // Configura o email
        const mailOptions = {
            from: email,
            to: 'robertojr.varela22@gmail.com', // EMAIL QUE RECEBERÁ
            subject: `Nova mensagem de ${nome} - Portfolio`,
            html: `
                <h2>Nova mensagem do portfolio</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagem}</p>
                <hr>
                <p>Enviado em: ${new Date().toLocaleString('pt-BR')}</p>
            `
        };

        // Envia o email
        await transporter.sendMail(mailOptions);
        
        console.log('📧 Email enviado para:', 'robertojr.varela22@gmail.com');
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
