// ============================================
// CODEFORGE X — Onboarding v2.0 Ultra Pro
// 4 slides, permission request, theme pick
// ============================================

const OnboardingPage = {
  currentSlide: 0,
  totalSlides: 4,
  touchStartX: 0,
  autoPlayTimer: null,

  onEnter() {
    this.currentSlide = 0;
    this.render();
    this.initGestures();
    this.startProgress();
  },

  onLeave() {
    clearInterval(this.autoPlayTimer);
    DB.setSetting('onboarding_done', true);
  },

  // ============================================
  // SLIDES DATA
  // ============================================
  slides: [
    {
      id: 'welcome',
      icon: '⬡',
      iconClass: 'ob-icon-hex',
      title: 'CODEFORGE X',
      subtitle: 'World\'s Most Advanced\nCode Generator',
      desc: 'QR codes, Barcodes, Code snippets — everything in one ultra-powerful app.',
      action: null,
      bg: 'ob-bg-gold',
      particles: true
    },
    {
      id: 'features',
      icon: null,
      title: 'What Can You Do?',
      subtitle: null,
      desc: null,
      features: [
        { icon: '▦', label: '15+ QR Styles', color: '#c9a84c' },
        { icon: '▐▌', label: '12 Barcode Types', color: '#4cc9f0' },
        { icon: '{ }', label: '60+ Code Templates', color: '#06d6a0' },
        { icon: '◎', label: 'Camera Scanner', color: '#ef233c' },
        { icon: '📤', label: 'PNG SVG PDF Export', color: '#c084fc' },
        { icon: '📴', label: 'Works Offline', color: '#ffd700' }
      ],
      bg: 'ob-bg-dark',
      particles: false
    },
    {
      id: 'permissions',
      icon: '🔐',
      title: 'Quick Permissions',
      subtitle: 'Enable for best experience',
      desc: null,
      permissions: [
        { key: 'camera', icon: '📷', label: 'Camera', desc: 'QR Scanner + logo upload', required: false },
        { key: 'notifications', icon: '🔔', label: 'Notifications', desc: 'Generation alerts', required: false },
        { key: 'location', icon: '📍', label: 'Location', desc: 'Location QR instantly', required: false }
      ],
      bg: 'ob-bg-dark',
      particles: false
    },
    {
      id: 'theme',
      icon: '🎨',
      title: 'Pick Your Style',
      subtitle: 'You can change anytime',
      desc: null,
      themes: [
        { key: 'dark-luxury', name: 'Dark Luxury', colors: ['#0a0a0f', '#c9a84c'] },
        { key: 'cyberpunk', name: 'Cyberpunk', colors: ['#0d0015', '#ff006e'] },
        { key: 'neon-blue', name: 'Neon Blue', colors: ['#000814', '#00b4d8'] },
        { key: 'neon-green', name: 'Matrix', colors: ['#000a00', '#00ff41'] },
        { key: 'amoled', name: 'AMOLED', colors: ['#000000', '#c9a84c'] },
        { key: 'purple-dark', name: 'Purple', colors: ['#0a000f', '#c084fc'] }
      ],
      bg: 'ob-bg-dark',
      particles: false
    }
  ],

  // ============================================
  // RENDER
  // ============================================
  render() {
    const page = document.getElementById('page-onboarding');
    if (!page) return;

    page.innerHTML = `
      <div class="ob-container">

        <!-- Progress dots -->
        <div class="ob-progress">
          ${this.slides.map((_, i) => `
            <div class="ob-dot ${i === this.currentSlide ? 'ob-dot-active' : i < this.currentSlide ? 'ob-dot-done' : ''}"></div>
          `).join('')}
        </div>

        <!-- Skip button -->
        <button class="ob-skip" onclick="OnboardingPage.finish()">
          Skip
        </button>

        <!-- Slides container -->
        <div class="ob-slides-wrap">
          <div class="ob-slides" id="ob-slides" style="transform:translateX(-${this.currentSlide * 100}%)">
            ${this.slides.map((slide, i) => this.renderSlide(slide, i)).join('')}
          </div>
        </div>

        <!-- Bottom controls -->
        <div class="ob-controls">
          <button class="ob-btn-back ${this.currentSlide === 0 ? 'ob-hidden' : ''}"
            onclick="OnboardingPage.prev()">←</button>

          <div class="ob-step-label">
            ${this.currentSlide + 1} / ${this.totalSlides}
          </div>

          <button class="ob-btn-next" onclick="OnboardingPage.next()">
            ${this.currentSlide === this.totalSlides - 1 ? 'Start App 🚀' : 'Next →'}
          </button>
        </div>
      </div>
    `;

    this.initSlideAnimations();
  },

  renderSlide(slide, index) {
    if (slide.id === 'welcome') return this.renderWelcome(slide);
    if (slide.id === 'features') return this.renderFeatures(slide);
    if (slide.id === 'permissions') return this.renderPermissions(slide);
    if (slide.id === 'theme') return this.renderThemeSelect(slide);
    return '';
  },

  renderWelcome(slide) {
    return `
      <div class="ob-slide ob-slide-welcome">
        <canvas class="ob-particles" id="ob-particles"></canvas>
        <div class="ob-slide-content">
          <div class="ob-hex-wrap">
            <div class="ob-hex">
              <div class="ob-hex-inner">
                <span class="ob-hex-icon">⬡</span>
              </div>
            </div>
            <div class="ob-hex-ring ob-ring-1"></div>
            <div class="ob-hex-ring ob-ring-2"></div>
            <div class="ob-hex-ring ob-ring-3"></div>
          </div>
          <div class="ob-welcome-title">
            <span class="ob-t-code">CODE</span><span class="ob-t-forge">FORGE</span><span class="ob-t-x">X</span>
          </div>
          <div class="ob-welcome-sub">World's Most Advanced Generator</div>
          <div class="ob-welcome-desc">
            Create stunning QR codes, professional barcodes, and beautiful code snippets — all in one app.
          </div>
          <div class="ob-welcome-badges">
            <span class="ob-badge">📴 Offline</span>
            <span class="ob-badge">🔒 Private</span>
            <span class="ob-badge">⚡ Fast</span>
          </div>
        </div>
      </div>
    `;
  },

  renderFeatures(slide) {
    return `
      <div class="ob-slide ob-slide-features">
        <div class="ob-slide-content">
          <div class="ob-slide-title">${slide.title}</div>
          <div class="ob-features-grid">
            ${slide.features.map((f, i) => `
              <div class="ob-feature-card" style="animation-delay:${i * 0.08}s">
                <div class="ob-feature-icon" style="color:${f.color};filter:drop-shadow(0 0 8px ${f.color})">${f.icon}</div>
                <div class="ob-feature-label">${f.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderPermissions(slide) {
    return `
      <div class="ob-slide ob-slide-perms">
        <div class="ob-slide-content">
          <div class="ob-slide-icon">${slide.icon}</div>
          <div class="ob-slide-title">${slide.title}</div>
          <div class="ob-slide-sub">${slide.subtitle}</div>
          <div class="ob-perms-list">
            ${slide.permissions.map(p => `
              <div class="ob-perm-item" id="ob-perm-${p.key}">
                <div class="ob-perm-left">
                  <span class="ob-perm-icon">${p.icon}</span>
                  <div class="ob-perm-info">
                    <div class="ob-perm-label">${p.label}</div>
                    <div class="ob-perm-desc">${p.desc}</div>
                  </div>
                </div>
                <button class="ob-perm-btn" onclick="OnboardingPage.requestPerm('${p.key}')">
                  Allow
                </button>
              </div>
            `).join('')}
          </div>
          <div class="ob-perm-note">All optional — skip if you prefer</div>
        </div>
      </div>
    `;
  },

  renderThemeSelect(slide) {
    return `
      <div class="ob-slide ob-slide-theme">
        <div class="ob-slide-content">
          <div class="ob-slide-icon">${slide.icon}</div>
          <div class="ob-slide-title">${slide.title}</div>
          <div class="ob-slide-sub">${slide.subtitle}</div>
          <div class="ob-themes-grid">
            ${slide.themes.map(t => `
              <button
                class="ob-theme-card ${ThemeSystem.currentTheme === t.key ? 'ob-theme-active' : ''}"
                id="ob-theme-${t.key}"
                onclick="OnboardingPage.selectTheme('${t.key}')"
              >
                <div class="ob-theme-preview" style="background:linear-gradient(135deg, ${t.colors[0]} 50%, ${t.colors[1]})">
                  <div class="ob-theme-dot" style="background:${t.colors[1]};box-shadow:0 0 8px ${t.colors[1]}"></div>
                </div>
                <div class="ob-theme-name">${t.name}</div>
                <div class="ob-theme-check ${ThemeSystem.currentTheme === t.key ? '' : 'hidden'}">✓</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // ============================================
  // NAVIGATION
  // ============================================
  next() {
    if (this.currentSlide >= this.totalSlides - 1) {
      this.finish();
      return;
    }
    this.goTo(this.currentSlide + 1);
    HapticSystem.play('navigate');
    SoundSystem.tap();
  },

  prev() {
    if (this.currentSlide <= 0) return;
    this.goTo(this.currentSlide - 1);
    HapticSystem.play('back');
  },

  goTo(index) {
    this.currentSlide = index;
    const slides = document.getElementById('ob-slides');
    if (slides) {
      slides.style.transform = `translateX(-${index * 100}%)`;
    }
    this.updateDots();
    this.updateControls();

    // Slide-specific init
    if (index === 0) this.initParticles();
    if (index === 1) this.animateFeatures();
  },

  updateDots() {
    document.querySelectorAll('.ob-dot').forEach((dot, i) => {
      dot.className = 'ob-dot' +
        (i === this.currentSlide ? ' ob-dot-active' :
         i < this.currentSlide ? ' ob-dot-done' : '');
    });
  },

  updateControls() {
    const backBtn = document.querySelector('.ob-btn-back');
    const nextBtn = document.querySelector('.ob-btn-next');
    const stepLabel = document.querySelector('.ob-step-label');

    if (backBtn) backBtn.classList.toggle('ob-hidden', this.currentSlide === 0);
    if (nextBtn) nextBtn.textContent = this.currentSlide === this.totalSlides - 1 ? 'Start App 🚀' : 'Next →';
    if (stepLabel) stepLabel.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
  },

  // ============================================
  // ACTIONS
  // ============================================
  async requestPerm(key) {
    const btn = document.querySelector(`#ob-perm-${key} .ob-perm-btn`);
    if (btn) {
      btn.textContent = '...';
      btn.disabled = true;
    }

    const granted = await Permissions.request(key);

    if (btn) {
      btn.textContent = granted ? '✅' : '❌';
      btn.style.background = granted ? 'rgba(6,214,160,0.2)' : 'rgba(239,35,60,0.2)';
      btn.style.borderColor = granted ? '#06d6a0' : '#ef233c';
    }

    HapticSystem.play(granted ? 'success' : 'error');
  },

  selectTheme(themeKey) {
    ThemeSystem.apply(themeKey);
    HapticSystem.play('themeChange');
    SoundSystem.themeChange();

    // Update UI
    document.querySelectorAll('.ob-theme-card').forEach(card => {
      card.classList.remove('ob-theme-active');
      const check = card.querySelector('.ob-theme-check');
      if (check) check.classList.add('hidden');
    });

    const selected = document.getElementById('ob-theme-' + themeKey);
    if (selected) {
      selected.classList.add('ob-theme-active');
      const check = selected.querySelector('.ob-theme-check');
      if (check) check.classList.remove('hidden');
    }
  },

  finish() {
    HapticSystem.play('celebration');
    SoundSystem.exportDone();
    DB.setSetting('onboarding_done', true);
    App.showPage('home');
  },

  // ============================================
  // PARTICLES (slide 1)
  // ============================================
  initParticles() {
    const canvas = document.getElementById('ob-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2
    }));

    let animFrame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x = (p.x + p.speedX + canvas.width) % canvas.width;
        p.y = (p.y + p.speedY + canvas.height) % canvas.height;
        p.pulse += 0.02;
        ctx.save();
        ctx.globalAlpha = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
        ctx.fillStyle = '#c9a84c';
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#c9a84c';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    // Cleanup when leaving slide
    this._particlesFrame = animFrame;
  },

  animateFeatures() {
    setTimeout(() => {
      document.querySelectorAll('.ob-feature-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
      });
    }, 100);
  },

  // ============================================
  // GESTURE CONTROL (swipe)
  // ============================================
  initGestures() {
    const container = document.getElementById('page-onboarding');
    if (!container) return;

    let startX = 0;
    container.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 60) {
        diff < 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  },

  startProgress() {
    // Auto progress bar animation
    let width = 0;
    const bar = document.querySelector('.ob-progress-bar-fill');
    if (bar) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = setInterval(() => {
        width += 2;
        if (bar) bar.style.width = width + '%';
        if (width >= 100) {
          width = 0;
        }
      }, 60);
    }
  },

  initSlideAnimations() {
    if (this.currentSlide === 0) {
      setTimeout(() => this.initParticles(), 100);
    }
  }
};
