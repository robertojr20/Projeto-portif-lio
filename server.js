const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configurações
app.use(cors()); // Permite requests do frontend
app.use(express.json()); // Permite receber JSON

// Rota para enviar email
app.post('/enviar-email', (req, res) => {
    try {
        const { nome, email, mensagem } = req.body;
        
        console.log('📧 Dados recebidos:');
        console.log('Nome:', nome);
        console.log('Email:', email);
        console.log('Mensagem:', mensagem);
        
        // Aqui você pode adicionar:
        // - Integração com Nodemailer
        // - Conexão com SendGrid
        // - Salvar em banco de dados
        
        // Resposta de sucesso
        res.json({ 
            success: true, 
            message: 'Mensagem recebida com sucesso!' 
        });
        
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
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