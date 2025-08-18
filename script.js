 const hamburguerButton = document.querySelector('.hamburguer-menu');
      const navigationMenu = document.querySelector('.navegation');
      const navLinks = document.querySelectorAll('.navegation a');

      hamburguerButton.addEventListener('click', () => {
      navigationMenu.classList.toggle('active');
      hamburguerButton.classList.toggle('active');
     });

// Fecha o menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
    navigationMenu.classList.remove('active');
    hamburguerButton.classList.remove('active');
  });
});