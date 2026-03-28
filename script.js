/* =====================================================
   Kora Hub — Scripts principais
   ===================================================== */

/* --- Sticky nav --- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Scroll-reveal --- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

  /* Immediately reveal hero content */
  setTimeout(() => {
    document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), i * 120);
    });
  }, 200);

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* --- Mobile hamburger menu --- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav__links');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.setAttribute('aria-expanded', menuOpen);
    if (menuOpen) {
      navLinks.style.cssText = `
        display: flex; flex-direction: column; gap: 6px;
        position: fixed; top: 62px; left: 0; right: 0;
        background: rgba(11,10,23,.98); backdrop-filter: blur(20px);
        padding: 20px 28px 28px; border-bottom: 1px solid rgba(255,255,255,.07);
        z-index: 199;
      `;
    } else {
      navLinks.style.cssText = 'display: none;';
    }
  });

  /* Close mobile menu when link clicked */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      hamburger.setAttribute('aria-expanded', false);
      navLinks.style.cssText = 'display: none;';
    });
  });

  /* =========================================
     FAQ ACCORDION
  ========================================= */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      // Open clicked (if it wasn't open)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =========================================
     SCARCITY COUNTER
     Simulates 3 of 5 spots taken (adjust as needed)
  ========================================= */
  (function() {
    const totalSpots = 5;
    const takenSpots = 2; // update this number to reflect real taken spots
    const available = totalSpots - takenSpots;

    document.getElementById('spotsLeft').textContent = available;

    const dots = document.querySelectorAll('.scarcity-dot');
    dots.forEach((dot, i) => {
      if (i < takenSpots) dot.classList.add('taken');
    });
  })();

  /* =========================================
     EXIT INTENT POPUP
  ========================================= */
  (function() {
    const popup  = document.getElementById('exitPopup');
    const close  = document.getElementById('popupClose');
    const dismiss = document.getElementById('popupDismiss');
    let shown = false;

    const KEY = 'kora_exit_popup_shown';
    // Only show once per session
    if (sessionStorage.getItem(KEY)) return;

    function showPopup() {
      if (shown) return;
      shown = true;
      popup.classList.add('visible');
      sessionStorage.setItem(KEY, '1');
    }

    function hidePopup() {
      popup.classList.remove('visible');
    }

    // Desktop: mouse leaves the viewport toward the top
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0) showPopup();
    });

    // Mobile: show after 40s of inactivity or on scroll back to top
    let mobileTimer = setTimeout(() => showPopup(), 40000);
    window.addEventListener('scroll', () => {
      if (window.scrollY < 200) {
        clearTimeout(mobileTimer);
        showPopup();
      }
    }, { passive: true, once: true });

    close.addEventListener('click', hidePopup);
    dismiss.addEventListener('click', hidePopup);
    popup.addEventListener('click', (e) => {
      if (e.target === popup) hidePopup();
    });

    // Keyboard: close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hidePopup();
    });
  })();
