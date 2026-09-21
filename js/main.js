/**
 * Ashikur Rahman Shaon — Personal Profile & CV Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Typewriter Animation ---
  const typewriterEl = document.getElementById('typewriter');
  const words = [
    'Creative & Positive Mind',
    'Curious & Lifelong Learner',
    'Friendly & Approachable',
    'Organized & Dedicated Leader',
    'Passionate Explorer'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typewriterEl) return;

    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      isDeleting = true;
      typingSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // --- 2. Theme Switcher (Dark / Light) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('theme-icon-moon');
  const sunIcon = document.getElementById('theme-icon-sun');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or default to dark
  const savedTheme = localStorage.getItem('arshaon_theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('arshaon_theme', theme);

    if (theme === 'light') {
      if (moonIcon) moonIcon.style.display = 'none';
      if (sunIcon) sunIcon.style.display = 'block';
    } else {
      if (moonIcon) moonIcon.style.display = 'block';
      if (sunIcon) sunIcon.style.display = 'none';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }

  // --- 3. Navbar Scroll State & Scrollspy ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Glass effect on scroll
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scrollspy active class
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });

  // --- 4. Mobile Menu Drawer Handling ---
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (mobileDrawer && mobileBackdrop && hamburgerBtn) {
      mobileDrawer.classList.add('open');
      mobileBackdrop.classList.add('open');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && mobileBackdrop && hamburgerBtn) {
      mobileDrawer.classList.remove('open');
      mobileBackdrop.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- 5. Interactive CV Modal ---
  const cvModalBackdrop = document.getElementById('cv-modal-backdrop');
  const closeCvModalBtn = document.getElementById('close-cv-modal-btn');
  const openCvButtons = document.querySelectorAll('.open-cv-btn');
  const printCvBtn = document.getElementById('print-cv-btn');

  function openCvModal() {
    if (cvModalBackdrop) {
      cvModalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeMobileMenu();
    }
  }

  function closeCvModal() {
    if (cvModalBackdrop) {
      cvModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openCvButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCvModal();
    });
  });

  if (closeCvModalBtn) {
    closeCvModalBtn.addEventListener('click', closeCvModal);
  }

  if (cvModalBackdrop) {
    cvModalBackdrop.addEventListener('click', (e) => {
      if (e.target === cvModalBackdrop) {
        closeCvModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModalBackdrop && cvModalBackdrop.classList.contains('open')) {
      closeCvModal();
    }
  });

  // Print CV trigger
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- 6. 1-Click Email Copy to Clipboard ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailTextEl = document.getElementById('email-text');
  const copyBtnText = document.getElementById('copy-btn-text');

  if (copyEmailBtn && emailTextEl) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = emailTextEl.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        if (copyBtnText) copyBtnText.textContent = 'Copied!';
        copyEmailBtn.style.background = '#10b981';
        copyEmailBtn.style.color = '#ffffff';

        showToast(`Email copied: ${email}`);

        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy';
          copyEmailBtn.style.background = '';
          copyEmailBtn.style.color = '';
        }, 2200);
      } catch (err) {
        showToast('Direct email: ashikurrahmanshaon@gmail.com');
      }
    });
  }

  // --- 7. Interactive Contact Form ---
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value.trim() || 'Friend';
      const email = document.getElementById('form-email')?.value.trim();
      const subject = document.getElementById('form-subject')?.value.trim();
      const message = document.getElementById('form-message')?.value.trim();

      if (!email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spin-animation" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          </svg>
          <span>Sending...</span>
        `;
      }

      // Simulate instantaneous client-side processing
      setTimeout(() => {
        showToast(`Thank you, ${name}! Your message has been prepared.`);
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Message Sent!</span>
          `;

          setTimeout(() => {
            submitBtn.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Send Message</span>
            `;
          }, 3000);
        }
      }, 700);
    });
  }

  // --- 8. Back to Top Button ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 9. Toast Notification Engine ---
  const toastEl = document.getElementById('toast-notification');
  const toastMessageEl = document.getElementById('toast-message');
  let toastTimeout = null;

  function showToast(message) {
    if (!toastEl || !toastMessageEl) return;

    toastMessageEl.textContent = message;
    toastEl.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  // Expose toast globally for console inspection or test utilities
  window.showToast = showToast;
});
