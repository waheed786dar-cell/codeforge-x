// ============================================
// CODEFORGE X — Splash Screen Page
// Particles + Loader Animation
// ============================================

const SplashPage = {
  canvas: null,
  ctx: null,
  particles: [],
  animFrame: null,

  onEnter() {
    this.initParticles();
    this.runLoader();
  },

  onLeave() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  },

  initParticles() {
    this.canvas = document.getElementById('splash-particles');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.particles = [];

    // 60 particles create karo
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.6 + 0.1,
        color: Math.random() > 0.5 ? '#c9a84c' : '#ffffff',
        pulse: Math.random() * Math.PI * 2
      });
    }
    this.drawParticles();
  },

  drawParticles() {
    const { ctx, canvas } = this;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.8
    );
    grad.addColorStop(0, 'rgba(26,26,46,0.3)');
    grad.addColorStop(1, 'rgba(10,10,15,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.02;
      const opacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.15;
          ctx.strokeStyle = '#c9a84c';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    });

    this.animFrame = requestAnimationFrame(() => this.drawParticles());
  },

  runLoader() {
    const fill = document.getElementById('splash-loader-fill');
    const text = document.getElementById('splash-loader-text');
    if (!fill || !text) return;

    const steps = [
      { width: 15, msg: 'Initializing engine...' },
      { width: 35, msg: 'Loading QR library...' },
      { width: 55, msg: 'Setting up database...' },
      { width: 75, msg: 'Applying dark luxury...' },
      { width: 90, msg: 'Almost ready...' },
      { width: 100, msg: 'Welcome to CODEFORGE X!' }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step >= steps.length) { clearInterval(interval); return; }
      fill.style.width = steps[step].width + '%';
      text.textContent = steps[step].msg;
      step++;
    }, 450);
  }
};
