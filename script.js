/**
 * SV OmniPoint Realty & Lending - Interactive Features
 * File: script.js
 * 
 * Features Included:
 * 1. Mobile Hamburger Menu Toggle with ARIA state management
 * 2. Dark / Light Mode Theme Switcher with localStorage persistence
 * 3. Interactive FAQ Accordion with smooth toggle & ARIA accessibility
 * 4. Interactive Consultation Modal & Form Submission Alert
 * 5. Smooth Scroll & Active Navigation Link Highlighter
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initMobileNav();
  initFaqAccordion();
  initBookingModal();
  initScrollSpy();
});

/* ==========================================================================
   1. Dark / Light Mode Switcher
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('sv_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme based on local storage or system preference
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeToggleIcon(true);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeToggleIcon(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('sv_theme', targetTheme);
      updateThemeToggleIcon(targetTheme === 'dark');
    });
  }
}

function updateThemeToggleIcon(isDark) {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.textContent = isDark ? 'Light' : 'Dark';
    themeIcon.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

/* ==========================================================================
   2. Mobile Hamburger Menu Toggle
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('primaryNav');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('nav-open');
    document.body.classList.toggle('no-scroll', !isExpanded);
  });

  // Close nav when clicking on navigation links
  const navLinks = navMenu.querySelectorAll('a, button');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('nav-open');
      document.body.classList.remove('no-scroll');
    });
  });
}

/* ==========================================================================
   3. Interactive FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const headerBtn = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-answer');

    if (!headerBtn || !content) return;

    headerBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other accordion items for clean accordion UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherContent = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        headerBtn.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        headerBtn.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   4. Consultation Booking Modal & Alert Handling
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openButtons = document.querySelectorAll('[data-open-modal="bookingModal"]');
  const closeButton = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');

  if (!modal) return;

  window.openBookingModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookingModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openBookingModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', window.closeBookingModal);
  }

  // Backdrop click closes modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      window.closeBookingModal();
    }
  });

  // ESC key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      window.closeBookingModal();
    }
  });

  // Form submission handler with structured feedback
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value || 'Client';
      const serviceType = document.getElementById('serviceType');
      const selectedService = serviceType ? serviceType.options[serviceType.selectedIndex].text : 'Real Estate & Lending Advisory';

      window.closeBookingModal();
      bookingForm.reset();

      // Modern notification alert banner
      showNotification(`Thank you, ${fullName}! Your confidential request for "${selectedService}" has been submitted. Jasmine Lin will contact you within 24 business hours.`);
    });
  }
}

function showNotification(message) {
  let toast = document.getElementById('appNotificationToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appNotificationToast';
    toast.className = 'notification-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5500);
}

/* ==========================================================================
   5. Active Section Scroll Spy
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-nav');
          } else {
            link.classList.remove('active-nav');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}
