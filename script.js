/**
 * Captain Neptune — Underwater Basket Weaving
 * Main JavaScript — Wave Animation, Nav, Form Validation, Scroll Effects
 */

'use strict';

/* ============================================================
   1. WAVE CANVAS ANIMATION
   ============================================================ */
(function initWaveCanvas() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, animId;
  let time = 0;

  // Wave configuration
  const waves = [
    { amplitude: 60,  period: 0.018, speed: 0.012, yOffset: 0.55, color: 'rgba(0, 245, 255, 0.06)',  lineWidth: 2 },
    { amplitude: 45,  period: 0.022, speed: 0.018, yOffset: 0.58, color: 'rgba(0, 245, 255, 0.09)',  lineWidth: 1.5 },
    { amplitude: 80,  period: 0.014, speed: 0.008, yOffset: 0.62, color: 'rgba(0, 168, 255, 0.05)',  lineWidth: 3 },
    { amplitude: 35,  period: 0.028, speed: 0.022, yOffset: 0.50, color: 'rgba(0, 245, 255, 0.04)',  lineWidth: 1 },
    { amplitude: 100, period: 0.010, speed: 0.005, yOffset: 0.70, color: 'rgba(13, 32, 64, 0.8)',    lineWidth: 0 },
    { amplitude: 55,  period: 0.020, speed: 0.015, yOffset: 0.75, color: 'rgba(0, 245, 255, 0.03)',  lineWidth: 1 },
    { amplitude: 30,  period: 0.032, speed: 0.025, yOffset: 0.45, color: 'rgba(0, 100, 200, 0.04)', lineWidth: 1 },
  ];

  function resize() {
    width  = canvas.width  = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function drawWave(wave) {
    ctx.beginPath();
    const yBase = height * wave.yOffset;

    ctx.moveTo(0, yBase + Math.sin(time * wave.speed) * wave.amplitude);

    for (let x = 0; x <= width; x += 4) {
      const y = yBase +
        Math.sin(x * wave.period + time * wave.speed) * wave.amplitude +
        Math.sin(x * wave.period * 1.7 + time * wave.speed * 1.3) * (wave.amplitude * 0.3);
      ctx.lineTo(x, y);
    }

    if (wave.lineWidth > 0) {
      ctx.strokeStyle = wave.color;
      ctx.lineWidth   = wave.lineWidth;
      ctx.stroke();
    }

    // Fill below wave for solid waves
    if (wave.amplitude > 70) {
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    }
  }

  function drawDepthGlow() {
    // Subtle radial glow from center
    const grd = ctx.createRadialGradient(
      width * 0.5, height * 0.4, 0,
      width * 0.5, height * 0.4, Math.min(width, height) * 0.6
    );
    grd.addColorStop(0,   'rgba(0, 60, 120, 0.18)');
    grd.addColorStop(0.5, 'rgba(0, 30, 80, 0.08)');
    grd.addColorStop(1,   'rgba(4, 13, 26, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  }

  function drawParticles() {
    // Floating light particles — bioluminescence
    const particleData = [
      { x: 0.12, y: 0.3,  size: 1.5, phase: 0 },
      { x: 0.25, y: 0.65, size: 1,   phase: 1.2 },
      { x: 0.38, y: 0.2,  size: 2,   phase: 2.4 },
      { x: 0.5,  y: 0.5,  size: 1.5, phase: 0.8 },
      { x: 0.62, y: 0.75, size: 1,   phase: 3.1 },
      { x: 0.75, y: 0.35, size: 2,   phase: 1.5 },
      { x: 0.88, y: 0.6,  size: 1.5, phase: 2.0 },
      { x: 0.45, y: 0.85, size: 1,   phase: 0.4 },
      { x: 0.7,  y: 0.15, size: 1.5, phase: 2.8 },
    ];

    particleData.forEach(p => {
      const alpha = (Math.sin(time * 0.02 + p.phase) + 1) / 2 * 0.7 + 0.1;
      const floatY = Math.sin(time * 0.015 + p.phase) * 8;
      ctx.beginPath();
      ctx.arc(width * p.x, height * p.y + floatY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 245, 255, ${alpha * 0.4})`;
      ctx.fill();
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    drawDepthGlow();

    waves.forEach(wave => drawWave(wave));

    drawParticles();

    time++;
    animId = requestAnimationFrame(render);
  }

  function init() {
    resize();
    render();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    render();
  });

  init();
})();


/* ============================================================
   2. NAVIGATION — SCROLL BEHAVIOR + MOBILE MENU
   ============================================================ */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const burger    = document.getElementById('navBurger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = navLinks ? navLinks.querySelectorAll('.nav__link') : [];

  // Scroll: add .scrolled class
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile burger toggle
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    allLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Active link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    allLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightActiveLink, { passive: true });
})();


/* ============================================================
   3. SCROLL REVEAL ANIMATION
   ============================================================ */
(function initScrollReveal() {
  // Add reveal class to elements we want to animate
  const targets = [
    '.about__grid',
    '.class-card',
    '.gallery__item',
    '.testimonial-card',
    '.contact__info',
    '.contact__form-wrapper',
    '.section__header',
    '.classes__private',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger delay for grid children
      const delay = Math.min(i * 0.1, 0.5);
      el.style.transitionDelay = delay + 's';
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ============================================================
   4. CONTACT FORM VALIDATION & SUBMISSION
   ============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  if (!form) return;

  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const successMsg   = document.getElementById('formSuccess');

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function setError(input, errorEl, msg) {
    input.classList.add('error');
    if (errorEl) errorEl.textContent = msg;
    return false;
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  function validateField(input, errorEl, rules) {
    const val = input.value.trim();
    for (const rule of rules) {
      if (!rule.test(val)) {
        return setError(input, errorEl, rule.message);
      }
    }
    return clearError(input, errorEl);
  }

  // Live validation
  if (nameInput) {
    nameInput.addEventListener('blur', () =>
      validateField(nameInput, nameError, [
        { test: v => v.length > 0,  message: 'Please enter your name.' },
        { test: v => v.length >= 2, message: 'Name must be at least 2 characters.' },
      ])
    );
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () =>
      validateField(emailInput, emailError, [
        { test: v => v.length > 0,    message: 'Please enter your email address.' },
        { test: v => validateEmail(v), message: 'Please enter a valid email address.' },
      ])
    );
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () =>
      validateField(messageInput, messageError, [
        { test: v => v.length > 0,   message: 'Please write a message for the Captain.' },
        { test: v => v.length >= 10, message: 'Message must be at least 10 characters long.' },
      ])
    );
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameOk = validateField(nameInput, nameError, [
      { test: v => v.length > 0,  message: 'Please enter your name.' },
      { test: v => v.length >= 2, message: 'Name must be at least 2 characters.' },
    ]);

    const emailOk = validateField(emailInput, emailError, [
      { test: v => v.length > 0,    message: 'Please enter your email address.' },
      { test: v => validateEmail(v), message: 'Please enter a valid email address.' },
    ]);

    const msgOk = validateField(messageInput, messageError, [
      { test: v => v.length > 0,   message: 'Please write a message for the Captain.' },
      { test: v => v.length >= 10, message: 'Message must be at least 10 characters long.' },
    ]);

    if (!nameOk || !emailOk || !msgOk) {
      // Scroll to first error
      const firstError = form.querySelector('.form__input.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Simulate successful submission
    const submitBtn = form.querySelector('[type="submit"]');
    const btnText   = submitBtn.querySelector('.btn__text');

    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'CASTING MESSAGE...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'CAST YOUR MESSAGE';

      if (successMsg) {
        successMsg.classList.add('visible');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide after 8 seconds
        setTimeout(() => {
          successMsg.classList.remove('visible');
        }, 8000);
      }
    }, 1600);
  });
})();


/* ============================================================
   5. SMOOTH ANCHOR SCROLL (extra padding for fixed nav)
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   6. GALLERY — LIGHTBOX EFFECT
   ============================================================ */
(function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery__item');
  if (!items.length) return;

  // Create lightbox DOM
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Gallery lightbox');
  overlay.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" aria-label="Close lightbox">✕</button>
      <div class="lightbox-img-wrap"></div>
      <p class="lightbox-caption"></p>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .lightbox-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(4, 13, 26, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(10px);
    }
    .lightbox-overlay.visible {
      opacity: 1;
      pointer-events: all;
    }
    .lightbox-inner {
      position: relative;
      max-width: 900px;
      width: 100%;
      border: 1px solid #1a3a6b;
      background: #040d1a;
      box-shadow: 0 0 60px rgba(0,245,255,0.15);
    }
    .lightbox-img-wrap {
      width: 100%;
    }
    .lightbox-img-wrap svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .lightbox-caption {
      padding: 1rem 1.5rem;
      font-family: 'Space Mono', monospace;
      font-size: 0.75rem;
      color: #7a9ab8;
      border-top: 1px solid #1a3a6b;
      letter-spacing: 0.05em;
    }
    .lightbox-close {
      position: absolute;
      top: -44px;
      right: 0;
      background: none;
      border: 1px solid #1a3a6b;
      color: #00f5ff;
      width: 36px;
      height: 36px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lightbox-close:hover {
      background: #00f5ff;
      color: #040d1a;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);

  const imgWrap   = overlay.querySelector('.lightbox-img-wrap');
  const caption   = overlay.querySelector('.lightbox-caption');
  const closeBtn  = overlay.querySelector('.lightbox-close');

  function openLightbox(item) {
    const svgEl  = item.querySelector('.gallery__svg');
    const capEl  = item.querySelector('.gallery__caption');
    if (!svgEl) return;

    imgWrap.innerHTML  = '';
    const clone = svgEl.cloneNode(true);
    imgWrap.appendChild(clone);
    caption.innerHTML  = capEl ? capEl.innerHTML : '';

    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View ' + (item.querySelector('strong')?.textContent || 'artwork') + ' in lightbox');
  });

  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) {
      closeLightbox();
    }
  });
})();


/* ============================================================
   7. NUMBER COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const stats = document.querySelectorAll('.about__stat-number');
  if (!stats.length) return;

  function animateCounter(el) {
    const text     = el.textContent;
    const numMatch = text.match(/[\d,]+/);
    if (!numMatch) return;

    const target   = parseInt(numMatch[0].replace(/,/g, ''), 10);
    const suffix   = text.replace(numMatch[0], '').trim();
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(stat => observer.observe(stat));
})();


/* ============================================================
   8. CURSOR GLOW EFFECT (desktop only)
   ============================================================ */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let mouseX = -1000, mouseY = -1000;
  let currentX = -1000, currentY = -1000;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });

  function animateGlow() {
    // Lerp for smooth follow
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    glow.style.left = currentX + 'px';
    glow.style.top  = currentY + 'px';

    requestAnimationFrame(animateGlow);
  }

  animateGlow();
})();


/* ============================================================
   9. PAGE LOAD — Remove preload flicker prevention
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');

  // Add subtle entrance animation to hero content
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
      heroContent.style.opacity = '1';
    });
  }
});
