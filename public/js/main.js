document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────────────
     PHONE INPUT
  ────────────────────────────────────────────────────── */
  const phoneInputField = document.getElementById('number');
  const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: 'mx',
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
  });

  /* ──────────────────────────────────────────────────────
     CONTACT FORM SUBMIT
  ────────────────────────────────────────────────────── */
  document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('confirmationMessage').style.color = 'var(--color-muted, #64748b)';

    var name   = document.getElementById('name').value;
    var mail   = document.getElementById('mail').value;
    var number = phoneInput.getNumber();

    // WhatsApp notification
    fetch('https://stormy-shore-91268-66b247c96421.herokuapp.com/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: number,
        body: `Hola ${name}, pronto alguno de nuestros asesores se comunicará contigo al ${number}. Crea tu cuenta en https://teamdiplotech.github.io/public/home.html. Saludos de parte del team DiploTech.`
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          console.log('WhatsApp enviado:', data.status, data.text);
        } else {
          console.error('Error WhatsApp');
        }
      })
      .catch(err => console.error('Error:', err));

    // Email notification
    fetch('https://stormy-shore-91268-66b247c96421.herokuapp.com/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to_name: name, to_mail: mail })
    })
      .then(r => r.json())
      .then(data => {
        var msg = document.getElementById('confirmationMessage');
        if (data.success) {
          console.log('Correo enviado:', data.status, data.text);
          ['name', 'lastName', 'mail', 'number'].forEach(id => {
            document.getElementById(id).value = '';
          });
          msg.innerText = '¡Gracias! Tus datos se han enviado con éxito.';
          msg.style.color = '#16a34a';
        } else {
          console.warn('Fallo en envío de correo.');
          msg.innerText = 'Ha ocurrido un problema. Intenta más tarde.';
          msg.style.color = '#dc2626';
        }
        setTimeout(() => { msg.style.color = 'transparent'; }, 10000);
      })
      .catch(err => console.error('Error:', err));
  });

  /* ──────────────────────────────────────────────────────
     HAMBURGER MENU TOGGLE
  ────────────────────────────────────────────────────── */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click (mobile)
    navLinks.querySelectorAll('.linkMenu').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ──────────────────────────────────────────────────────
     SCROLL REVEAL ANIMATIONS
  ────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ──────────────────────────────────────────────────────
     STAGGERED REVEAL FOR GRIDS
     Add incremental delay to siblings inside reveal containers
  ────────────────────────────────────────────────────── */
  ['.featuresMethodology', '.bodyEgress', '.bodyEntry'].forEach(function (selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  /* ──────────────────────────────────────────────────────
     NAV ACTIVE LINK ON SCROLL
  ────────────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.linkMenu');

  function setActiveLink() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollY && section.offsetTop + section.offsetHeight > scrollY) {
        navLinkEls.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

});
