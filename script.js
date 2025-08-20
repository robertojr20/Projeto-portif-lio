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
      const response = await fetch("http://localhost:3000/enviar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.value,
          email: form.email.value,
          mensagem: form.mensagem.value,
        }),
      });

      const data = await response.json();

      if (data.success) {
        mensagemDiv.textContent = "Mensagem enviada com sucesso!";
        mensagemDiv.style.color = "var(--primary-color)";
        form.reset();

        //faz a mensagem desaparecer em 5 segundos 
        setTimeout (() => {
          mensagemDiv.textContent = '';
          mensagemDiv.style.color = 'inherit';
        }, 5000);

      } else {
        throw new Error("Falha no servidor");
      }
    } catch (error) {
      console.error("Erro:", error);
      mensagemDiv.textContent = "Erro ao enviar mensagem. Tente novamente.";
      mensagemDiv.style.color = "red";
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar Mensagem";
    }
  });
});
