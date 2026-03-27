/* ==============================================
   KC Rabbinical Association — main.js
   ============================================== */

(function () {
  'use strict';

  // --- Elements ---
  const logoSection = document.getElementById('logo-section');
  const logoImg = document.getElementById('logo-img');
  const navBar = document.getElementById('nav-bar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const scrolledMenuBtn = document.getElementById('scrolled-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  let isScrolled = false;
  let menuOpen = false;

  // --- Scroll handler: shrink header ---
  function handleScroll() {
    const scrolled = window.scrollY > 100;
    if (scrolled === isScrolled) return;
    isScrolled = scrolled;

    if (isScrolled) {
      logoSection.classList.add('scrolled');
      logoImg.classList.add('scrolled');
      navBar.classList.add('hidden');
      scrolledMenuBtn.classList.add('visible');
    } else {
      logoSection.classList.remove('scrolled');
      logoImg.classList.remove('scrolled');
      navBar.classList.remove('hidden');
      scrolledMenuBtn.classList.remove('visible');
      // Close menu when scrolling back up
      menuOpen = false;
      mobileMenu.classList.remove('open');
      updateMenuIcon(scrolledMenuBtn, false);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Menu toggle ---
  function toggleMenu(btn) {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu.classList.add('open');
    } else {
      mobileMenu.classList.remove('open');
    }
    updateMenuIcon(btn, menuOpen);
  }

  function updateMenuIcon(btn, open) {
    if (!btn) return;
    if (open) {
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';
    } else {
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      toggleMenu(mobileMenuBtn);
    });
  }

  if (scrolledMenuBtn) {
    scrolledMenuBtn.addEventListener('click', function () {
      toggleMenu(scrolledMenuBtn);
    });
  }

  // --- Contact form handling ---
  const contactForm = document.getElementById('contact-form');
  const formError = document.getElementById('form-error');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      // Clear previous errors
      if (formError) {
        formError.style.display = 'none';
        formError.textContent = '';
      }

      // Validate required fields
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();
      const acknowledged = document.getElementById('acknowledged').checked;

      if (!name || !email || !subject || !message) {
        e.preventDefault();
        showError('Please fill in all required fields.');
        return;
      }

      if (!acknowledged) {
        e.preventDefault();
        showError('Please acknowledge that this form is for inquiries and not for emergencies.');
        return;
      }

      // If using Formspree, let the form submit naturally
      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // For Formspree AJAX submission
      e.preventDefault();
      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            contactForm.style.display = 'none';
            if (formSuccess) formSuccess.style.display = 'block';
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          showError('Failed to submit form. Please try again.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
        });
    });
  }

  function showError(msg) {
    if (formError) {
      formError.textContent = msg;
      formError.style.display = 'block';
    }
  }
})();
