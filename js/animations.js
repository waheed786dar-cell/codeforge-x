// ============================================
// CODEFORGE X — Micro-Animations & Skeletons
// GSAP powered + CSS fallback
// ============================================

const AnimSystem = {

  gsap: null,

  init() {
    this.gsap = window.gsap || null;
    this.initRipples();
    this.initCardPressEffects();
    this.initScrollReveal();
    console.log('[Anim] System ready, GSAP:', !!this.gsap);
  },

  // ============================================
  // PAGE TRANSITIONS
  // ============================================
  pageEnter(pageId, direction = 'right') {
    const el = document.getElementById('page-' + pageId);
    if (!el) return;

    if (this.gsap) {
      gsap.fromTo(el,
        {
          x: direction === 'right' ? 60 : -60,
          opacity: 0,
          scale: 0.97
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: 'power3.out'
        }
      );
    } else {
      el.style.animation = 'fadeInUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards';
    }
  },

  pageExit(pageId, direction = 'left') {
    const el = document.getElementById('page-' + pageId);
    if (!el || !this.gsap) return;

    return new Promise(resolve => {
      gsap.to(el, {
        x: direction === 'left' ? -40 : 40,
        opacity: 0,
        scale: 0.97,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: resolve
      });
    });
  },

  // ============================================
  // ELEMENT ANIMATIONS
  // ============================================
  fadeIn(el, delay = 0) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;

    if (this.gsap) {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay, ease: 'power3.out' }
      );
    } else {
      el.style.animationDelay = delay + 's';
      el.classList.add('animate-fade-in-up');
    }
  },

  scaleIn(el, delay = 0) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;

    if (this.gsap) {
      gsap.fromTo(el,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, delay, ease: 'back.out(1.7)' }
      );
    } else {
      el.classList.add('animate-scale-in');
    }
  },

  staggerFadeIn(selector, stagger = 0.06) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (this.gsap) {
      gsap.fromTo(els,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger,
          ease: 'power3.out'
        }
      );
    } else {
      els.forEach((el, i) => {
        el.style.animationDelay = (i * stagger) + 's';
        el.classList.add('animate-fade-in-up');
      });
    }
  },

  bounceIn(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el || !this.gsap) return;

    gsap.fromTo(el,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
    );
  },

  // Number counter animation
  countUp(el, target, duration = 1000) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;

    if (this.gsap) {
      gsap.to({ val: 0 }, {
        val: target,
        duration: duration / 1000,
        ease: 'power2.out',
        onUpdate: function() {
          el.textContent = Math.floor(this.targets()[0].val).toLocaleString();
        }
      });
    } else {
      let current = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current >= target) clearInterval(timer);
      }, 16);
    }
  },

  // Shake (error)
  shake(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;

    if (this.gsap) {
      gsap.to(el, {
        x: [-8, 8, -6, 6, -4, 4, 0],
        duration: 0.5,
        ease: 'none'
      });
    } else {
      el.classList.add('animate-shake');
      setTimeout(() => el.classList.remove('animate-shake'), 500);
    }
  },

  // Pulse glow
  pulseGlow(el, color = null) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el || !this.gsap) return;

    const glowColor = color || getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim();

    gsap.to(el, {
      boxShadow: [
        `0 0 5px ${glowColor}40`,
        `0 0 30px ${glowColor}80`,
        `0 0 5px ${glowColor}40`
      ],
      duration: 1.5,
      repeat: 2,
      ease: 'sine.inOut'
    });
  },

  // ============================================
  // RIPPLE EFFECT
  // ============================================
  initRipples() {
    document.addEventListener('touchstart', (e) => {
      const target = e.target.closest('.quick-card, .feature-item, .cf-btn, .export-btn, .nav-item, .filter-btn, .style-btn, .tab-btn');
      if (target) this.createRipple(target, e.touches[0]);
    }, { passive: true });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('.quick-card, .feature-item, .cf-btn, .export-btn');
      if (target) this.createRipple(target, e);
    });
  },

  createRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX || event.pageX) - rect.left;
    const y = (event.clientY || event.pageY) - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      background: var(--accent-glow, rgba(201,168,76,0.3));
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 100;
      animation: rippleExpand 0.5s ease-out forwards;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  },

  // ============================================
  // PRESS EFFECTS ON CARDS
  // ============================================
  initCardPressEffects() {
    const addPressEffect = (selector, scaleDown = 0.96) => {
      document.addEventListener('touchstart', (e) => {
        const el = e.target.closest(selector);
        if (el) {
          el.style.transition = 'transform 0.1s ease';
          el.style.transform = `scale(${scaleDown})`;
        }
      }, { passive: true });

      document.addEventListener('touchend', (e) => {
        const el = e.target.closest(selector);
        if (el) {
          el.style.transform = 'scale(1)';
        }
      }, { passive: true });
    };

    addPressEffect('.quick-card', 0.95);
    addPressEffect('.feature-item', 0.93);
    addPressEffect('.library-card', 0.96);
    addPressEffect('.history-item', 0.98);
    addPressEffect('.recent-item', 0.98);
    addPressEffect('.cf-btn', 0.95);
    addPressEffect('.export-btn', 0.93);
    addPressEffect('.nav-item', 0.88);
  },

  // ============================================
  // SCROLL REVEAL
  // ============================================
  initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay || 0;
          setTimeout(() => {
            el.classList.add('scroll-revealed');
            if (this.gsap) {
              gsap.fromTo(el,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
              );
            }
          }, parseInt(delay));
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    // Cards observe karo
    document.querySelectorAll('.glass-card, .quick-card, .feature-item, .library-card').forEach(el => {
      observer.observe(el);
    });
  },

  // ============================================
  // SKELETON LOADERS
  // ============================================
  showSkeleton(containerId, type = 'card', count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const skeletons = {
      card: `
        <div class="skeleton-card-wrap">
          <div class="skeleton skeleton-preview"></div>
          <div style="padding:12px">
            <div class="skeleton skeleton-text" style="width:70%"></div>
            <div class="skeleton skeleton-text" style="width:45%;margin-top:6px"></div>
          </div>
        </div>`,

      list: `
        <div class="skeleton-list-item">
          <div class="skeleton skeleton-avatar"></div>
          <div style="flex:1">
            <div class="skeleton skeleton-text" style="width:60%"></div>
            <div class="skeleton skeleton-text" style="width:40%;margin-top:6px"></div>
          </div>
        </div>`,

      stat: `
        <div class="skeleton-stat">
          <div class="skeleton" style="height:28px;width:50px;border-radius:4px"></div>
          <div class="skeleton skeleton-text" style="width:60px;margin-top:6px"></div>
        </div>`,

      qr: `
        <div class="skeleton-qr">
          <div class="skeleton" style="width:200px;height:200px;border-radius:12px"></div>
        </div>`
    };

    const template = skeletons[type] || skeletons.card;
    container.innerHTML = Array(count).fill(template).join('');
  },

  hideSkeleton(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.querySelectorAll('[class*="skeleton"]').forEach(el => {
        el.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => el.remove(), 300);
      });
    }
  },

  // ============================================
  // LOADING STATES
  // ============================================
  setLoading(btnEl, loading = true) {
    if (typeof btnEl === 'string') btnEl = document.getElementById(btnEl);
    if (!btnEl) return;

    if (loading) {
      btnEl.dataset.originalText = btnEl.innerHTML;
      btnEl.innerHTML = `<span class="cf-spinner cf-spinner-sm"></span>`;
      btnEl.disabled = true;
      btnEl.style.opacity = '0.7';
    } else {
      btnEl.innerHTML = btnEl.dataset.originalText || btnEl.innerHTML;
      btnEl.disabled = false;
      btnEl.style.opacity = '1';
    }
  }
};
