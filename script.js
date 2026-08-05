document.addEventListener("DOMContentLoaded", function () {
  /* ========================================================
     1. Efeito de Digitação (Typewriter Effect)
     ======================================================== */
  const typewriterElement = document.getElementById("typewriter");
  if (typewriterElement) {
    const phrases = [
      "Desenvolvedor Fullstack",
      "Ciência da Computação (FAM)",
      "Assistente de TI",
      "Apaixonado por Web & Inovação"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pausa no final da frase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  /* ========================================================
     2. Seletor de Tema (Accent Color Switcher)
     ======================================================== */
  const themeDots = document.querySelectorAll(".theme-dot");
  const htmlDoc = document.documentElement;

  // Carrega tema salvo
  const savedTheme = localStorage.getItem("portfolio-accent-theme") || "cyan";
  setTheme(savedTheme);

  themeDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const theme = dot.getAttribute("data-set-theme");
      setTheme(theme);
    });
  });

  function setTheme(themeName) {
    htmlDoc.setAttribute("data-theme", themeName);
    localStorage.setItem("portfolio-accent-theme", themeName);

    themeDots.forEach((dot) => {
      if (dot.getAttribute("data-set-theme") === themeName) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  /* ========================================================
     3. Filtro de Projetos por Categoria
     ======================================================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
          card.style.animation = "fadeIn 0.4s ease forwards";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* ========================================================
     4. Modal de Detalhes dos Projetos
     ======================================================== */
  const modalOverlay = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalTitle = document.getElementById("modal-title");
  const modalTags = document.getElementById("modal-tags");
  const modalImg = document.getElementById("modal-img");
  const modalDesc = document.getElementById("modal-desc");
  const modalLinks = document.getElementById("modal-links");

  document.querySelectorAll(".btn-details").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".project-card");
      if (!card) return;

      const title = card.getAttribute("data-title") || "";
      const desc = card.getAttribute("data-description") || "";
      const techs = (card.getAttribute("data-techs") || "").split(",");
      const demo = card.getAttribute("data-demo") || "#";
      const github = card.getAttribute("data-github") || "#";
      const imgSrc = card.getAttribute("data-img") || "";

      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalImg.src = imgSrc;
      modalImg.alt = title;

      // Render tags
      modalTags.innerHTML = techs
        .map((t) => `<span class="tech-tag">${t.trim()}</span>`)
        .join("");

      // Render links
      modalLinks.innerHTML = `
        <a href="${demo}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Ver Demo</a>
        <a href="${github}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Ver Código no GitHub</a>
      `;

      modalOverlay.classList.add("active");
      modalOverlay.setAttribute("aria-hidden", "false");
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove("active");
      modalOverlay.setAttribute("aria-hidden", "true");
    }
  }

  /* ========================================================
     5. Notificações Toast
     ======================================================== */
  const toastContainer = document.getElementById("toast-container");

  function showToast(message, type = "success") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "error" : ""}`;
    toast.innerHTML = `
      <i class="fas ${type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}" style="color: ${type === "error" ? "#ef4444" : "var(--primary-color)"}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-30px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* ========================================================
     6. Envio e Validação do Formulário de Contato
     ======================================================== */
  const form = document.getElementById("contato-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      const assunto = form.assunto.value.trim();
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const mensagem = form.mensagem.value.trim();

      if (!assunto || !nome || !email || !mensagem) {
        showToast("Por favor, preencha todos os campos do formulário.", "error");
        return;
      }

      btn.disabled = true;
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Enviando...`;

      try {
        let sent = false;

        // 1. Tenta o endpoint serverless /api/send-email se disponível
        try {
          const apiRes = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assunto, nome, email, mensagem }),
          });
          if (apiRes.ok) {
            sent = true;
          }
        } catch (err) {
          console.log("Servidor local não encontrado, direcionando para FormSubmit...");
        }

        // 2. Fallback para hospedagem estática (GitHub Pages) via FormSubmit
        if (!sent) {
          const formSubmitRes = await fetch("https://formsubmit.co/ajax/robertojr.varela22@gmail.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              _subject: `[Portfólio Web] ${assunto} - De: ${nome}`,
              Nome: nome,
              Email: email,
              Assunto: assunto,
              Mensagem: mensagem,
              _template: "table"
            })
          });

          if (formSubmitRes.ok) {
            sent = true;
          } else {
            throw new Error("Erro de comunicação com o servidor de e-mail");
          }
        }

        if (sent) {
          showToast("Mensagem enviada com sucesso! Em breve entrarei em contato.");
          form.reset();
        }
      } catch (error) {
        console.error("Erro no envio:", error);
        showToast("Erro ao enviar. Por favor, envie diretamente para robertojr.varela22@gmail.com", "error");
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  }

  /* ========================================================
     7. Botão Voltar ao Topo & Anel de Progresso de Rolagem
     ======================================================== */
  const backToTopBtn = document.getElementById("backToTop");
  const progressCircle = document.querySelector(".scroll-progress-circle");

  if (backToTopBtn && progressCircle) {
    const circleLength = 157; // Circumference (2 * PI * r) where r = 25 approx -> 144..157

    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      if (scrollTop > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }

      const drawLength = circleLength * (1 - scrollPercent);
      progressCircle.style.strokeDashoffset = Math.max(0, drawLength);
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ========================================================
     8. Destaque de Link de Navegação Ativo ao Rolar
     ======================================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navegation ul li a");

  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
});
