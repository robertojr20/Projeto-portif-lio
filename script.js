document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contato-form");

  if (!form) {
    console.error("Formulário não encontrado! Verifique o ID.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Formulário enviado (preventDefault funcionou)");

    const btn = form.querySelector('button[type="submit"]');
    const mensagemDiv = document.getElementById("form-mensagem");

    // Mostra feedback visual
    btn.disabled = true;
    btn.textContent = "Enviando...";
    mensagemDiv.textContent = "";
    mensagemDiv.style.color = "inherit";

    try {
      // Garante que o elemento de mensagem existe
      if (!mensagemDiv) {
        console.warn('#form-mensagem não encontrado no DOM');
      }

      const response = await fetch("https://api-envio-email-sigma.vercel.app/envio-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.value,
          email: form.email.value,
          mensagem: form.mensagem.value,
        }),
      });

      // Sempre pegue o texto bruto para evitar erro de parse quando o servidor responde com HTML (ex.: página 404)
      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        // corpo não é JSON — registrar para depuração
        console.warn('Resposta não-JSON do servidor:', text);
      }

      if (!response.ok) {
        console.error('Erro no servidor', response.status, text);
        mensagemDiv.textContent = 'Erro ao enviar mensagem. Erro do servidor: ' + response.status;
        mensagemDiv.style.color = 'red';
        return;
      }

      if (data && data.success) {
        if (mensagemDiv) {
          mensagemDiv.textContent = "Mensagem enviada com sucesso!";
          mensagemDiv.style.color = "var(--primary-color)";
        }
        form.reset();

        // faz a mensagem desaparecer em 5 segundos
        setTimeout(() => {
          if (mensagemDiv) {
            mensagemDiv.textContent = '';
            mensagemDiv.style.color = 'inherit';
          }
        }, 5000);
      } else {
        // resposta válida mas sem success=true
        console.error('Resposta inesperada do servidor:', data || text);
        if (mensagemDiv) {
          mensagemDiv.textContent = "Erro ao enviar mensagem. Tente novamente.";
          mensagemDiv.style.color = "red";
        }
      }
    } catch (error) {
      console.error("Erro de rede ou no envio:", error);
      if (mensagemDiv) {
        mensagemDiv.textContent = "Erro ao enviar mensagem. Tente novamente.";
        mensagemDiv.style.color = "red";
      }
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar Mensagem";
    }
  });
});
