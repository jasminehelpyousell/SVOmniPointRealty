/**
 * SV OmniPoint Realty & Lending — Interactive Frontend Script (script.js)
 * Features:
 *  1. Mobile Hamburger Navigation Menu Toggle
 *  2. Dark / Light Mode Theme Switcher (with localStorage persistence)
 *  3. Interactive FAQ Accordion
 *  4. Consultation CTA Modal & Form Submission Alert
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. Mobile Hamburger Menu Toggle
     ======================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));
      hamburgerBtn.classList.toggle('active');
      mainNav.classList.toggle('open');
    });

    // Close mobile menu when any navigation link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.classList.remove('active');
        mainNav.classList.remove('open');
      });
    });
  }

  /* ========================================================================
     2. Dark / Light Mode Theme Switcher
     ======================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const rootElement = document.documentElement;

  const applyTheme = (theme) => {
    rootElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      // Sun icon when in dark mode (to switch to light), Crescent moon when in light mode
      themeIcon.innerHTML = theme === 'dark' ? '&#9728;' : '&#9789;';
    }
    try {
      localStorage.setItem('sv-omnipoint-theme', theme);
    } catch (e) {
      // Ignore storage errors in restricted environments
    }
  };

  // Load saved theme preference if available
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('sv-omnipoint-theme') || 'light';
  } catch (e) {
    savedTheme = 'light';
  }
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  /* ========================================================================
     3. Interactive FAQ Accordion
     ======================================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    const headerBtn = item.querySelector('.accordion-header');
    const bodyPanel = item.querySelector('.accordion-body');

    if (headerBtn && bodyPanel) {
      headerBtn.addEventListener('click', () => {
        const isCurrentlyOpen = headerBtn.getAttribute('aria-expanded') === 'true';

        // Close other open accordion items for a clean layout
        accordionItems.forEach((otherItem) => {
          const otherBtn = otherItem.querySelector('.accordion-header');
          const otherPanel = otherItem.querySelector('.accordion-body');
          if (otherBtn && otherPanel) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherPanel.hidden = true;
            otherItem.classList.remove('open');
          }
        });

        // Toggle current item
        if (!isCurrentlyOpen) {
          headerBtn.setAttribute('aria-expanded', 'true');
          bodyPanel.hidden = false;
          item.classList.add('open');
        }
      });
    }
  });

  /* ========================================================================
     4. Consultation CTA Modal & Form Submission Alert
     ======================================================================== */
  const modal = document.getElementById('consultation-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const consultationForm = document.getElementById('consultation-form');
  const formFeedback = document.getElementById('form-feedback');

  const openModal = () => {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (formFeedback) {
      formFeedback.hidden = true;
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';
    }
  };

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
      closeModal();
    }
  });

  if (consultationForm && formFeedback) {
    consultationForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const clientName = document.getElementById('client-name')?.value.trim();
      const clientEmail = document.getElementById('client-email')?.value.trim();
      const clientPhone = document.getElementById('client-phone')?.value.trim();
      const serviceInterest = document.getElementById('service-interest')?.value;

      if (!clientName || !clientEmail || !clientPhone) {
        formFeedback.hidden = false;
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please provide your full name, email address, and phone number so our advisory desk can reach you.';
        return;
      }

      formFeedback.hidden = false;
      formFeedback.className = 'form-feedback success';
      formFeedback.textContent = `Thank you, ${clientName}! Your request for "${serviceInterest}" has been routed to Jasmine Lin's Dual-License Advisory Desk (DRE# 01823608 | NMLS# 321799). We will contact you at ${clientPhone} or ${clientEmail} within 1 business day.`;

      consultationForm.reset();
    });
  }
});

