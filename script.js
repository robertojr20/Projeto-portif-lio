document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contato-form");

  // Endpoint da API de envio de e-mail (com a rota '/enviar-email' incluída)
  const API_ENDPOINT = "https://api-envio-email-sigma.vercel.app/enviar-email";

  if (!form) {
    console.error("Formulário não encontrado! Verifique o ID.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Formulário enviado (preventDefault funcionou)");
    console.log(`Tentando enviar para: ${API_ENDPOINT}`); // Log para debug

    const btn = form.querySelector('button[type="submit"]');
    const mensagemDiv = document.getElementById("form-mensagem");

    // Mostra feedback visual
    btn.disabled = true;
    btn.textContent = "Enviando...";
    mensagemDiv.textContent = "";
    mensagemDiv.style.color = "inherit";

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.value,
          email: form.email.value,
          mensagem: form.mensagem.value,
        }),
      });

      // 1. Verifica se a resposta HTTP é 2xx (Sucesso)
      if (!response.ok) {
        // Se a resposta NÃO for OK (ex: 403 Forbidden, 500 Internal Server Error)
        // Isso captura erros de CORS (embora o console mostre mais detalhes) ou erros de servidor.
        const errorText = await response.text(); // Tenta pegar o texto do erro
        console.error(`Erro HTTP ${response.status}:`, errorText);
        throw new Error(`Falha de conexão. Status: ${response.status}.`);
      }

      // 2. Tenta parsear o JSON
      const data = await response.json();

      // 3. Verifica se o corpo da resposta JSON contém 'success: true'
      if (data.success) {
        mensagemDiv.textContent = "Mensagem enviada com sucesso!";
        mensagemDiv.style.color = "var(--primary-color, #34d399)"; // Adicionei um fallback de cor
        form.reset();

        // Faz a mensagem desaparecer em 5 segundos
        setTimeout (() => {
          mensagemDiv.textContent = '';
          mensagemDiv.style.color = 'inherit';
        }, 5000);

      } else {
        // Se a resposta HTTP for OK (200), mas a API retornar { success: false }
        const apiErrorMessage = data.message || "A API negou o envio (Credenciais/SMTP erradas?).";
        console.error("Erro da API:", apiErrorMessage);
        throw new Error(apiErrorMessage);
      }
    } catch (error) {
      console.error("Erro Final:", error.message);
      mensagemDiv.textContent = `Erro ao enviar mensagem. Tente novamente. (${error.message.substring(0, 40)}...)`;
      mensagemDiv.style.color = "red";
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar Mensagem";
    }
  });
});