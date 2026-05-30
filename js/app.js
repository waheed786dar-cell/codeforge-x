const App = {
  version: '2.0.0',
  name: 'CODEFORGE X',
  isLoaded: false,

  settings: {
    theme: 'dark-luxury',
    language: 'en',
    haptics: true,
    sounds: true,
    autoSave: true,
    exportFormat: 'png',
    watermark: '',
    gridView: true,
    reducedMotion: false
  },

  stats: {
    totalGenerated: 0,
    qrGenerated: 0,
    barcodeGenerated: 0,
    codeGenerated: 0,
    totalExported: 0
  },

  async init() {
    console.log(`🚀 ${this.name} v${this.version}`);

    // Phase 1 — Critical (blocking)
    try {
      await DB.init();
      await this.loadSettings();
      await this.loadStats();
    } catch(e) {
      console.error('DB init failed:', e);
    }

    // Phase 2 — UI (non-blocking, parallel)
    this.registerPages();
    Router.initHashListener();
    Router.initBackGesture();

    // Theme apply karo instantly (before paint)
    await ThemeSystem.loadSaved();

    // Phase 3 — Show splash immediately
    this.showPage('splash');
    this.runSplash();

    // Phase 4 — Background init (after paint)
    requestIdleCallback ? requestIdleCallback(() => this.bgInit()) : setTimeout(() => this.bgInit(), 500);
  },

  // Background initialization (non-critical)
  async bgInit() {
    try {
      Perf.init();
      SoundSystem.init();
      AnimSystem.init();
      await Permissions.init();
      await this.registerSW();
      this.initInstallPrompt();

      // Preload next likely pages
      Perf.preload(['js/pages/qr-generator.js']);

      this.isLoaded = true;
      console.log('✅ Background init complete');
    } catch(e) {
      console.error('BG init error:', e);
    }
  },

  showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => {
      if (p.id !== 'page-' + pageId) {
        p.style.display = 'none';
        p.classList.remove('page-active');
      }
    });

    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.style.display = 'flex';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.classList.add('page-active');
        });
      });
    }

    Router.currentPage = pageId;
    Router.updateBottomNav(pageId);

    const pageObj = Router.pages[pageId];
    if (pageObj?.onEnter) {
      setTimeout(() => pageObj.onEnter(), 80);
    }
  },

  runSplash() {
    const fill = document.getElementById('splash-loader-fill');
    const text = document.getElementById('splash-loader-text');

    if (typeof SplashPage !== 'undefined') {
      SplashPage.initParticles();
    }

    const steps = [
      { w: 20, msg: 'Initializing engine...' },
      { w: 45, msg: 'Loading QR systems...' },
      { w: 65, msg: 'Setting up database...' },
      { w: 85, msg: 'Applying theme...' },
      { w: 100, msg: 'Ready! 🔥' }
    ];

    let i = 0;
    const run = () => {
      if (i >= steps.length) {
        setTimeout(() => {
          this.showPage('home');
          SoundSystem.startup();
          HapticSystem.play('success');
        }, 400);
        return;
      }
      if (fill) fill.style.width = steps[i].w + '%';
      if (text) text.textContent = steps[i].msg;
      i++;
      setTimeout(run, 480);
    };
    run();
  },

  async loadSettings() {
    try {
      const saved = await DB.getSetting('app_settings');
      if (saved) this.settings = { ...this.settings, ...saved };
      else await DB.setSetting('app_settings', this.settings);
    } catch(e) {}
  },

  async saveSettings() {
    await DB.setSetting('app_settings', this.settings);
  },

  async loadStats() {
    try {
      const saved = await DB.getSetting('app_stats');
      if (saved) this.stats = { ...this.stats, ...saved };
    } catch(e) {}
  },

  async saveStats() {
    await DB.setSetting('app_stats', this.stats);
  },

  async incrementStat(type) {
    this.stats.totalGenerated++;
    if (type === 'qr') this.stats.qrGenerated++;
    else if (type === 'barcode') this.stats.barcodeGenerated++;
    else if (type === 'code') this.stats.codeGenerated++;
    // Debounced save
    clearTimeout(this._statSaveTimer);
    this._statSaveTimer = setTimeout(() => this.saveStats(), 2000);
  },

  async registerSW() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch(e) {}
    }
  },

  initInstallPrompt() {
    let prompt;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      prompt = e;
      const btn = document.getElementById('install-btn');
      if (btn) {
        btn.style.display = 'flex';
        btn.onclick = async () => {
          prompt.prompt();
          await prompt.userChoice;
          prompt = null;
          btn.style.display = 'none';
        };
      }
    });
  },

  registerPages() {
    const safeReg = (name, obj) => {
      Router.register(name, obj || { onEnter(){}, onLeave(){} });
    };
    safeReg('splash', typeof SplashPage !== 'undefined' ? SplashPage : null);
    safeReg('home', typeof HomePage !== 'undefined' ? HomePage : null);
    safeReg('qr-generator', typeof QRPage !== 'undefined' ? QRPage : null);
    safeReg('barcode-generator', typeof BarcodePage !== 'undefined' ? BarcodePage : null);
    safeReg('code-generator', typeof CodePage !== 'undefined' ? CodePage : null);
    safeReg('scanner', typeof ScannerPage !== 'undefined' ? ScannerPage : null);
    safeReg('library', typeof LibraryPage !== 'undefined' ? LibraryPage : null);
    safeReg('history', typeof HistoryPage !== 'undefined' ? HistoryPage : null);
    safeReg('settings', typeof SettingsPage !== 'undefined' ? SettingsPage : null);
    safeReg('about', typeof AboutPage !== 'undefined' ? AboutPage : null);
    safeReg('export-studio', typeof ExportPage !== 'undefined' ? ExportPage : null);
    safeReg('collections', typeof CollectionsPage !== 'undefined' ? CollectionsPage : null);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
