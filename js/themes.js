// ============================================
// CODEFORGE X — Ultra Theme System v2.0
// 12 Themes + Custom + Auto + Animated
// ============================================

const ThemeSystem = {

  currentTheme: 'dark-luxury',
  customAccent: '#c9a84c',
  animatedGradient: false,
  autoTheme: false,
  gradientInterval: null,

  // ============================================
  // ALL 12 THEMES
  // ============================================
  themes: {

    'dark-luxury': {
      name: 'Dark Luxury',
      category: 'dark',
      icon: '👑',
      preview: ['#0a0a0f', '#c9a84c', '#1a1a2e'],
      vars: {
        '--bg-primary': '#0a0a0f',
        '--bg-secondary': '#12121a',
        '--bg-card': '#1a1a2e',
        '--bg-elevated': '#22223a',
        '--accent': '#c9a84c',
        '--accent-light': '#f0c66a',
        '--accent-dark': '#a07830',
        '--accent-glow': 'rgba(201,168,76,0.4)',
        '--accent-subtle': 'rgba(201,168,76,0.08)',
        '--text-primary': '#ffffff',
        '--text-secondary': '#a0a0b0',
        '--text-muted': '#606070',
        '--border': '#2a2a3a',
        '--border-accent': 'rgba(201,168,76,0.3)',
        '--glass': 'rgba(255,255,255,0.04)',
        '--glass-hover': 'rgba(255,255,255,0.08)',
        '--glass-border': 'rgba(201,168,76,0.15)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.6)',
        '--glow-sm': '0 0 10px rgba(201,168,76,0.3)',
        '--glow-md': '0 0 20px rgba(201,168,76,0.4)',
        '--glow-lg': '0 0 40px rgba(201,168,76,0.5)',
        '--nav-bg': 'rgba(10,10,15,0.97)',
        '--header-bg': 'rgba(10,10,15,0.95)',
        '--scrollbar': '#a07830',
        '--selection': 'rgba(201,168,76,0.3)',
        '--gradient-1': '#c9a84c',
        '--gradient-2': '#f0c66a',
        '--gradient-3': '#a07830'
      }
    },

    'amoled': {
      name: 'AMOLED Black',
      category: 'dark',
      icon: '⬛',
      preview: ['#000000', '#c9a84c', '#111111'],
      vars: {
        '--bg-primary': '#000000',
        '--bg-secondary': '#080808',
        '--bg-card': '#101010',
        '--bg-elevated': '#181818',
        '--accent': '#c9a84c',
        '--accent-light': '#f0c66a',
        '--accent-dark': '#a07830',
        '--accent-glow': 'rgba(201,168,76,0.5)',
        '--accent-subtle': 'rgba(201,168,76,0.06)',
        '--text-primary': '#ffffff',
        '--text-secondary': '#888888',
        '--text-muted': '#404040',
        '--border': '#1a1a1a',
        '--border-accent': 'rgba(201,168,76,0.25)',
        '--glass': 'rgba(255,255,255,0.03)',
        '--glass-hover': 'rgba(255,255,255,0.06)',
        '--glass-border': 'rgba(201,168,76,0.12)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.95)',
        '--glow-sm': '0 0 12px rgba(201,168,76,0.4)',
        '--glow-md': '0 0 24px rgba(201,168,76,0.5)',
        '--glow-lg': '0 0 48px rgba(201,168,76,0.6)',
        '--nav-bg': 'rgba(0,0,0,0.99)',
        '--header-bg': 'rgba(0,0,0,0.99)',
        '--scrollbar': '#a07830',
        '--selection': 'rgba(201,168,76,0.3)',
        '--gradient-1': '#c9a84c',
        '--gradient-2': '#f0c66a',
        '--gradient-3': '#a07830'
      }
    },

    'cyberpunk': {
      name: 'Cyberpunk',
      category: 'neon',
      icon: '🌆',
      preview: ['#0d0015', '#ff006e', '#00f5ff'],
      vars: {
        '--bg-primary': '#0d0015',
        '--bg-secondary': '#120020',
        '--bg-card': '#1a0030',
        '--bg-elevated': '#220040',
        '--accent': '#ff006e',
        '--accent-light': '#ff4da6',
        '--accent-dark': '#cc0057',
        '--accent-glow': 'rgba(255,0,110,0.5)',
        '--accent-subtle': 'rgba(255,0,110,0.08)',
        '--text-primary': '#ffffff',
        '--text-secondary': '#cc99ff',
        '--text-muted': '#7744aa',
        '--border': '#2d0050',
        '--border-accent': 'rgba(255,0,110,0.4)',
        '--glass': 'rgba(255,0,110,0.04)',
        '--glass-hover': 'rgba(255,0,110,0.08)',
        '--glass-border': 'rgba(255,0,110,0.2)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.8)',
        '--glow-sm': '0 0 10px rgba(255,0,110,0.4)',
        '--glow-md': '0 0 25px rgba(255,0,110,0.5)',
        '--glow-lg': '0 0 50px rgba(255,0,110,0.6)',
        '--nav-bg': 'rgba(13,0,21,0.97)',
        '--header-bg': 'rgba(13,0,21,0.95)',
        '--scrollbar': '#cc0057',
        '--selection': 'rgba(255,0,110,0.3)',
        '--gradient-1': '#ff006e',
        '--gradient-2': '#00f5ff',
        '--gradient-3': '#7b2ff7'
      }
    },

    'neon-blue': {
      name: 'Neon Blue',
      category: 'neon',
      icon: '💙',
      preview: ['#000814', '#00b4d8', '#0077b6'],
      vars: {
        '--bg-primary': '#000814',
        '--bg-secondary': '#001220',
        '--bg-card': '#001f3f',
        '--bg-elevated': '#002855',
        '--accent': '#00b4d8',
        '--accent-light': '#48cae4',
        '--accent-dark': '#0077b6',
        '--accent-glow': 'rgba(0,180,216,0.5)',
        '--accent-subtle': 'rgba(0,180,216,0.08)',
        '--text-primary': '#e0f4ff',
        '--text-secondary': '#90c8e0',
        '--text-muted': '#456070',
        '--border': '#003050',
        '--border-accent': 'rgba(0,180,216,0.4)',
        '--glass': 'rgba(0,180,216,0.04)',
        '--glass-hover': 'rgba(0,180,216,0.08)',
        '--glass-border': 'rgba(0,180,216,0.2)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.8)',
        '--glow-sm': '0 0 10px rgba(0,180,216,0.4)',
        '--glow-md': '0 0 25px rgba(0,180,216,0.5)',
        '--glow-lg': '0 0 50px rgba(0,180,216,0.6)',
        '--nav-bg': 'rgba(0,8,20,0.97)',
        '--header-bg': 'rgba(0,8,20,0.95)',
        '--scrollbar': '#0077b6',
        '--selection': 'rgba(0,180,216,0.3)',
        '--gradient-1': '#00b4d8',
        '--gradient-2': '#48cae4',
        '--gradient-3': '#0077b6'
      }
    },

    'neon-green': {
      name: 'Matrix Green',
      category: 'neon',
      icon: '💚',
      preview: ['#000a00', '#00ff41', '#008f11'],
      vars: {
        '--bg-primary': '#000a00',
        '--bg-secondary': '#001200',
        '--bg-card': '#001f00',
        '--bg-elevated': '#002800',
        '--accent': '#00ff41',
        '--accent-light': '#69ff8a',
        '--accent-dark': '#00cc33',
        '--accent-glow': 'rgba(0,255,65,0.5)',
        '--accent-subtle': 'rgba(0,255,65,0.06)',
        '--text-primary': '#ccffcc',
        '--text-secondary': '#80cc80',
        '--text-muted': '#306030',
        '--border': '#003300',
        '--border-accent': 'rgba(0,255,65,0.3)',
        '--glass': 'rgba(0,255,65,0.03)',
        '--glass-hover': 'rgba(0,255,65,0.06)',
        '--glass-border': 'rgba(0,255,65,0.15)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.9)',
        '--glow-sm': '0 0 10px rgba(0,255,65,0.4)',
        '--glow-md': '0 0 25px rgba(0,255,65,0.5)',
        '--glow-lg': '0 0 60px rgba(0,255,65,0.6)',
        '--nav-bg': 'rgba(0,10,0,0.98)',
        '--header-bg': 'rgba(0,10,0,0.97)',
        '--scrollbar': '#00cc33',
        '--selection': 'rgba(0,255,65,0.25)',
        '--gradient-1': '#00ff41',
        '--gradient-2': '#69ff8a',
        '--gradient-3': '#008f11'
      }
    },

    'purple-dark': {
      name: 'Purple Dark',
      category: 'dark',
      icon: '💜',
      preview: ['#0a000f', '#c084fc', '#7c3aed'],
      vars: {
        '--bg-primary': '#0a000f',
        '--bg-secondary': '#12001a',
        '--bg-card': '#1a002e',
        '--bg-elevated': '#220040',
        '--accent': '#c084fc',
        '--accent-light': '#d8a4ff',
        '--accent-dark': '#9050d0',
        '--accent-glow': 'rgba(192,132,252,0.5)',
        '--accent-subtle': 'rgba(192,132,252,0.07)',
        '--text-primary': '#f5eeff',
        '--text-secondary': '#c0a0d0',
        '--text-muted': '#705080',
        '--border': '#2a003a',
        '--border-accent': 'rgba(192,132,252,0.3)',
        '--glass': 'rgba(192,132,252,0.04)',
        '--glass-hover': 'rgba(192,132,252,0.08)',
        '--glass-border': 'rgba(192,132,252,0.15)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.8)',
        '--glow-sm': '0 0 10px rgba(192,132,252,0.4)',
        '--glow-md': '0 0 25px rgba(192,132,252,0.5)',
        '--glow-lg': '0 0 50px rgba(192,132,252,0.6)',
        '--nav-bg': 'rgba(10,0,15,0.97)',
        '--header-bg': 'rgba(10,0,15,0.95)',
        '--scrollbar': '#9050d0',
        '--selection': 'rgba(192,132,252,0.3)',
        '--gradient-1': '#c084fc',
        '--gradient-2': '#d8a4ff',
        '--gradient-3': '#7c3aed'
      }
    },

    'gold-luxury': {
      name: 'Gold Luxury',
      category: 'luxury',
      icon: '✨',
      preview: ['#0f0a00', '#ffd700', '#b8860b'],
      vars: {
        '--bg-primary': '#0f0a00',
        '--bg-secondary': '#1a1200',
        '--bg-card': '#252000',
        '--bg-elevated': '#302800',
        '--accent': '#ffd700',
        '--accent-light': '#ffe84d',
        '--accent-dark': '#b8860b',
        '--accent-glow': 'rgba(255,215,0,0.5)',
        '--accent-subtle': 'rgba(255,215,0,0.07)',
        '--text-primary': '#fff8e1',
        '--text-secondary': '#d4a843',
        '--text-muted': '#806020',
        '--border': '#3a2800',
        '--border-accent': 'rgba(255,215,0,0.35)',
        '--glass': 'rgba(255,215,0,0.04)',
        '--glass-hover': 'rgba(255,215,0,0.08)',
        '--glass-border': 'rgba(255,215,0,0.2)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.7)',
        '--glow-sm': '0 0 12px rgba(255,215,0,0.4)',
        '--glow-md': '0 0 28px rgba(255,215,0,0.5)',
        '--glow-lg': '0 0 55px rgba(255,215,0,0.6)',
        '--nav-bg': 'rgba(15,10,0,0.97)',
        '--header-bg': 'rgba(15,10,0,0.95)',
        '--scrollbar': '#b8860b',
        '--selection': 'rgba(255,215,0,0.3)',
        '--gradient-1': '#ffd700',
        '--gradient-2': '#ffe84d',
        '--gradient-3': '#b8860b'
      }
    },

    'rose-gold': {
      name: 'Rose Gold',
      category: 'luxury',
      icon: '🌹',
      preview: ['#0f0008', '#f4a5b8', '#c2185b'],
      vars: {
        '--bg-primary': '#0f0008',
        '--bg-secondary': '#180010',
        '--bg-card': '#220018',
        '--bg-elevated': '#2c0022',
        '--accent': '#f48fb1',
        '--accent-light': '#ffc1d0',
        '--accent-dark': '#c2185b',
        '--accent-glow': 'rgba(244,143,177,0.5)',
        '--accent-subtle': 'rgba(244,143,177,0.07)',
        '--text-primary': '#fff0f5',
        '--text-secondary': '#e8a0b8',
        '--text-muted': '#8a4060',
        '--border': '#3a0028',
        '--border-accent': 'rgba(244,143,177,0.3)',
        '--glass': 'rgba(244,143,177,0.04)',
        '--glass-hover': 'rgba(244,143,177,0.08)',
        '--glass-border': 'rgba(244,143,177,0.15)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.7)',
        '--glow-sm': '0 0 10px rgba(244,143,177,0.4)',
        '--glow-md': '0 0 25px rgba(244,143,177,0.5)',
        '--glow-lg': '0 0 50px rgba(244,143,177,0.6)',
        '--nav-bg': 'rgba(15,0,8,0.97)',
        '--header-bg': 'rgba(15,0,8,0.95)',
        '--scrollbar': '#c2185b',
        '--selection': 'rgba(244,143,177,0.3)',
        '--gradient-1': '#f48fb1',
        '--gradient-2': '#ffc1d0',
        '--gradient-3': '#c2185b'
      }
    },

    'ocean-deep': {
      name: 'Ocean Deep',
      category: 'dark',
      icon: '🌊',
      preview: ['#000d1a', '#00d4ff', '#0066cc'],
      vars: {
        '--bg-primary': '#000d1a',
        '--bg-secondary': '#001428',
        '--bg-card': '#001e3c',
        '--bg-elevated': '#002850',
        '--accent': '#00d4ff',
        '--accent-light': '#66e8ff',
        '--accent-dark': '#0099cc',
        '--accent-glow': 'rgba(0,212,255,0.5)',
        '--accent-subtle': 'rgba(0,212,255,0.07)',
        '--text-primary': '#e0f8ff',
        '--text-secondary': '#80c8e0',
        '--text-muted': '#305870',
        '--border': '#002840',
        '--border-accent': 'rgba(0,212,255,0.3)',
        '--glass': 'rgba(0,212,255,0.04)',
        '--glass-hover': 'rgba(0,212,255,0.08)',
        '--glass-border': 'rgba(0,212,255,0.15)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.85)',
        '--glow-sm': '0 0 10px rgba(0,212,255,0.4)',
        '--glow-md': '0 0 25px rgba(0,212,255,0.5)',
        '--glow-lg': '0 0 50px rgba(0,212,255,0.6)',
        '--nav-bg': 'rgba(0,13,26,0.97)',
        '--header-bg': 'rgba(0,13,26,0.95)',
        '--scrollbar': '#0099cc',
        '--selection': 'rgba(0,212,255,0.3)',
        '--gradient-1': '#00d4ff',
        '--gradient-2': '#66e8ff',
        '--gradient-3': '#0066cc'
      }
    },

    'ember': {
      name: 'Ember Red',
      category: 'neon',
      icon: '🔥',
      preview: ['#0f0000', '#ff4500', '#ff8c00'],
      vars: {
        '--bg-primary': '#0f0000',
        '--bg-secondary': '#180000',
        '--bg-card': '#220000',
        '--bg-elevated': '#2c0000',
        '--accent': '#ff4500',
        '--accent-light': '#ff7043',
        '--accent-dark': '#cc3700',
        '--accent-glow': 'rgba(255,69,0,0.5)',
        '--accent-subtle': 'rgba(255,69,0,0.07)',
        '--text-primary': '#fff5f0',
        '--text-secondary': '#ff9970',
        '--text-muted': '#803020',
        '--border': '#3a0000',
        '--border-accent': 'rgba(255,69,0,0.35)',
        '--glass': 'rgba(255,69,0,0.04)',
        '--glass-hover': 'rgba(255,69,0,0.08)',
        '--glass-border': 'rgba(255,69,0,0.18)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.85)',
        '--glow-sm': '0 0 10px rgba(255,69,0,0.4)',
        '--glow-md': '0 0 25px rgba(255,69,0,0.5)',
        '--glow-lg': '0 0 55px rgba(255,69,0,0.6)',
        '--nav-bg': 'rgba(15,0,0,0.97)',
        '--header-bg': 'rgba(15,0,0,0.95)',
        '--scrollbar': '#cc3700',
        '--selection': 'rgba(255,69,0,0.3)',
        '--gradient-1': '#ff4500',
        '--gradient-2': '#ff8c00',
        '--gradient-3': '#cc3700'
      }
    },

    'mint-dark': {
      name: 'Mint Dark',
      category: 'dark',
      icon: '🍃',
      preview: ['#000f0a', '#00e5a0', '#00b377'],
      vars: {
        '--bg-primary': '#000f0a',
        '--bg-secondary': '#001a12',
        '--bg-card': '#00261a',
        '--bg-elevated': '#003022',
        '--accent': '#00e5a0',
        '--accent-light': '#66f5c8',
        '--accent-dark': '#00b377',
        '--accent-glow': 'rgba(0,229,160,0.5)',
        '--accent-subtle': 'rgba(0,229,160,0.07)',
        '--text-primary': '#e0fff5',
        '--text-secondary': '#80d4b0',
        '--text-muted': '#306050',
        '--border': '#003828',
        '--border-accent': 'rgba(0,229,160,0.3)',
        '--glass': 'rgba(0,229,160,0.04)',
        '--glass-hover': 'rgba(0,229,160,0.08)',
        '--glass-border': 'rgba(0,229,160,0.15)',
        '--shadow': '0 8px 32px rgba(0,0,0,0.85)',
        '--glow-sm': '0 0 10px rgba(0,229,160,0.4)',
        '--glow-md': '0 0 25px rgba(0,229,160,0.5)',
        '--glow-lg': '0 0 50px rgba(0,229,160,0.6)',
        '--nav-bg': 'rgba(0,15,10,0.97)',
        '--header-bg': 'rgba(0,15,10,0.95)',
        '--scrollbar': '#00b377',
        '--selection': 'rgba(0,229,160,0.3)',
        '--gradient-1': '#00e5a0',
        '--gradient-2': '#66f5c8',
        '--gradient-3': '#00b377'
      }
    },

    'light': {
      name: 'Pure Light',
      category: 'light',
      icon: '☀️',
      preview: ['#f8f9ff', '#5c6bc0', '#ffffff'],
      vars: {
        '--bg-primary': '#f0f2ff',
        '--bg-secondary': '#e8eaff',
        '--bg-card': '#ffffff',
        '--bg-elevated': '#f5f5ff',
        '--accent': '#5c6bc0',
        '--accent-light': '#7986cb',
        '--accent-dark': '#3949ab',
        '--accent-glow': 'rgba(92,107,192,0.3)',
        '--accent-subtle': 'rgba(92,107,192,0.08)',
        '--text-primary': '#1a1a2e',
        '--text-secondary': '#4a4a6a',
        '--text-muted': '#8888aa',
        '--border': '#d0d4f0',
        '--border-accent': 'rgba(92,107,192,0.3)',
        '--glass': 'rgba(92,107,192,0.05)',
        '--glass-hover': 'rgba(92,107,192,0.1)',
        '--glass-border': 'rgba(92,107,192,0.2)',
        '--shadow': '0 4px 16px rgba(92,107,192,0.15)',
        '--glow-sm': '0 0 10px rgba(92,107,192,0.2)',
        '--glow-md': '0 0 20px rgba(92,107,192,0.3)',
        '--glow-lg': '0 0 40px rgba(92,107,192,0.4)',
        '--nav-bg': 'rgba(240,242,255,0.97)',
        '--header-bg': 'rgba(240,242,255,0.95)',
        '--scrollbar': '#3949ab',
        '--selection': 'rgba(92,107,192,0.2)',
        '--gradient-1': '#5c6bc0',
        '--gradient-2': '#7986cb',
        '--gradient-3': '#3949ab'
      }
    }
  },

  // ============================================
  // ANIMATED GRADIENT THEMES
  // ============================================
  gradientThemes: {
    'aurora': {
      name: 'Aurora',
      icon: '🌌',
      colors: ['#0d001a', '#1a0033', '#000d1a', '#0a1a00'],
      accentColors: ['#c084fc', '#00d4ff', '#00e5a0', '#ff006e'],
      speed: 8000
    },
    'sunset': {
      name: 'Sunset',
      icon: '🌅',
      colors: ['#1a0a00', '#2d0a00', '#1a0015', '#0d0015'],
      accentColors: ['#ff8c00', '#ff4500', '#ff006e', '#c084fc'],
      speed: 10000
    },
    'ocean-wave': {
      name: 'Ocean Wave',
      icon: '🌊',
      colors: ['#000d1a', '#001428', '#000a0f', '#001a14'],
      accentColors: ['#00d4ff', '#0066cc', '#00e5a0', '#00b4d8'],
      speed: 7000
    },
    'neon-city': {
      name: 'Neon City',
      icon: '🏙️',
      colors: ['#0d0015', '#000d1a', '#0f0000', '#000a00'],
      accentColors: ['#ff006e', '#00d4ff', '#ff4500', '#00ff41'],
      speed: 5000
    }
  },

  // ============================================
  // APPLY THEME
  // ============================================
  apply(themeName, customVars = null) {
    this.currentTheme = themeName;

    const theme = this.themes[themeName];
    if (!theme && !customVars) return;

    const vars = customVars || theme.vars;

    // CSS variables apply karo
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    // Legacy variable mapping (existing code ke liye)
    const legacyMap = {
      '--accent-gold': vars['--accent'],
      '--accent-gold-light': vars['--accent-light'],
      '--accent-gold-dark': vars['--accent-dark'],
      '--accent-gold-glow': vars['--accent-glow'],
      '--border-gold': vars['--border-accent']
    };
    Object.entries(legacyMap).forEach(([k, v]) => {
      if (v) document.documentElement.style.setProperty(k, v);
    });

    // Scrollbar color
    const style = document.getElementById('dynamic-scrollbar') || document.createElement('style');
    style.id = 'dynamic-scrollbar';
    style.textContent = `
      ::-webkit-scrollbar-thumb { background: ${vars['--scrollbar'] || vars['--accent']}; }
      ::selection { background: ${vars['--selection'] || vars['--accent-glow']}; }
    `;
    document.head.appendChild(style);

    // Body class update
    document.body.className = document.body.className
      .replace(/theme-\S+/g, '')
      .trim();
    document.body.classList.add(`theme-${themeName}`);

    // Meta theme color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = vars['--bg-primary'];

    // Save karo
    this.saveTheme(themeName);
    console.log(`[Theme] Applied: ${themeName}`);
  },

  // ============================================
  // ANIMATED GRADIENT THEME
  // ============================================
  applyGradientTheme(gradientName) {
    const gt = this.gradientThemes[gradientName];
    if (!gt) return;

    this.stopGradientAnimation();
    this.currentTheme = 'gradient-' + gradientName;

    let colorIndex = 0;
    let accentIndex = 0;

    const animate = () => {
      const bg = gt.colors[colorIndex % gt.colors.length];
      const accent = gt.accentColors[accentIndex % gt.accentColors.length];

      document.documentElement.style.setProperty('--bg-primary', bg);
      document.documentElement.style.setProperty('--accent', accent);
      document.documentElement.style.setProperty('--accent-gold', accent);

      // Derived colors
      document.documentElement.style.setProperty('--bg-secondary', this.lightenColor(bg, 8));
      document.documentElement.style.setProperty('--bg-card', this.lightenColor(bg, 15));

      colorIndex++;
      accentIndex++;
    };

    animate();
    this.gradientInterval = setInterval(animate, gt.speed);
    this.animatedGradient = true;

    // CSS transition for smooth change
    document.documentElement.style.setProperty(
      'transition',
      'background-color 2s ease, color 0.3s ease'
    );
  },

  stopGradientAnimation() {
    if (this.gradientInterval) {
      clearInterval(this.gradientInterval);
      this.gradientInterval = null;
    }
    this.animatedGradient = false;
    document.documentElement.style.removeProperty('transition');
  },

  // ============================================
  // CUSTOM ACCENT COLOR
  // ============================================
  applyCustomAccent(hexColor) {
    this.customAccent = hexColor;

    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return;

    const light = this.lightenHex(hexColor, 30);
    const dark = this.darkenHex(hexColor, 20);
    const glow = `rgba(${rgb.r},${rgb.g},${rgb.b},0.45)`;
    const subtle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.08)`;
    const border = `rgba(${rgb.r},${rgb.g},${rgb.b},0.3)`;
    const glass = `rgba(${rgb.r},${rgb.g},${rgb.b},0.05)`;
    const selection = `rgba(${rgb.r},${rgb.g},${rgb.b},0.3)`;

    const accentVars = {
      '--accent': hexColor,
      '--accent-gold': hexColor,
      '--accent-light': light,
      '--accent-gold-light': light,
      '--accent-dark': dark,
      '--accent-gold-dark': dark,
      '--accent-glow': glow,
      '--accent-gold-glow': glow,
      '--accent-subtle': subtle,
      '--border-accent': border,
      '--border-gold': border,
      '--glass': glass,
      '--glass-border': `rgba(${rgb.r},${rgb.g},${rgb.b},0.15)`,
      '--glow-sm': `0 0 10px ${glow}`,
      '--glow-md': `0 0 20px rgba(${rgb.r},${rgb.g},${rgb.b},0.5)`,
      '--glow-lg': `0 0 40px rgba(${rgb.r},${rgb.g},${rgb.b},0.6)`,
      '--scrollbar': dark,
      '--selection': selection,
      '--gradient-1': hexColor,
      '--gradient-2': light,
      '--gradient-3': dark
    };

    Object.entries(accentVars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });

    // Save
    DB.setSetting('custom_accent', hexColor);
    Utils.showToast('Accent color updated! 🎨', 'success');
  },

  // ============================================
  // AUTO THEME (System sync)
  // ============================================
  initAutoTheme() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applySystemTheme = (isDark) => {
      if (this.autoTheme) {
        this.apply(isDark ? 'dark-luxury' : 'light');
        Utils.showToast(
          `System theme: ${isDark ? '🌙 Dark' : '☀️ Light'}`,
          'info'
        );
      }
    };

    // Initial apply
    applySystemTheme(mediaQuery.matches);

    // Change listener
    mediaQuery.addEventListener('change', (e) => {
      applySystemTheme(e.matches);
    });
  },

  toggleAutoTheme(enabled) {
    this.autoTheme = enabled;
    DB.setSetting('auto_theme', enabled);
    if (enabled) {
      this.initAutoTheme();
      Utils.showToast('Auto theme enabled — syncing with system! 🔄', 'success');
    }
  },

  // ============================================
  // THEME PICKER UI
  // ============================================
  renderThemePicker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const categories = {
      dark: { label: 'Dark', icon: '🌙' },
      neon: { label: 'Neon', icon: '⚡' },
      luxury: { label: 'Luxury', icon: '👑' },
      light: { label: 'Light', icon: '☀️' }
    };

    let html = '';

    // Category sections
    Object.entries(categories).forEach(([cat, info]) => {
      const catThemes = Object.entries(this.themes)
        .filter(([, t]) => t.category === cat);
      if (!catThemes.length) return;

      html += `
        <div class="theme-category">
          <div class="theme-cat-label">${info.icon} ${info.label}</div>
          <div class="theme-row">
            ${catThemes.map(([key, theme]) => `
              <button
                class="theme-chip ${this.currentTheme === key ? 'theme-chip-active' : ''}"
                onclick="ThemeSystem.apply('${key}'); ThemeSystem.renderThemePicker('${containerId}')"
                title="${theme.name}"
              >
                <div class="theme-chip-preview">
                  <div style="background:${theme.preview[0]};flex:1"></div>
                  <div style="background:${theme.preview[1]};flex:1"></div>
                  <div style="background:${theme.preview[2]};flex:1"></div>
                </div>
                <div class="theme-chip-icon">${theme.icon}</div>
                <div class="theme-chip-name">${theme.name}</div>
                ${this.currentTheme === key ? '<div class="theme-chip-check">✓</div>' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    });

    // Animated gradient section
    html += `
      <div class="theme-category">
        <div class="theme-cat-label">🌈 Animated</div>
        <div class="theme-row">
          ${Object.entries(this.gradientThemes).map(([key, gt]) => `
            <button
              class="theme-chip ${this.currentTheme === 'gradient-' + key ? 'theme-chip-active' : ''}"
              onclick="ThemeSystem.applyGradientTheme('${key}'); ThemeSystem.renderThemePicker('${containerId}')"
            >
              <div class="theme-chip-preview animated-preview"></div>
              <div class="theme-chip-icon">${gt.icon}</div>
              <div class="theme-chip-name">${gt.name}</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Custom accent picker
    html += `
      <div class="theme-category">
        <div class="theme-cat-label">🎨 Custom Accent</div>
        <div class="custom-accent-wrap">
          <div class="accent-presets">
            ${['#c9a84c','#ff006e','#00d4ff','#00ff41','#c084fc','#ff4500','#00e5a0','#f48fb1','#ffd700','#00b4d8'].map(color => `
              <button
                class="accent-preset-dot"
                style="background:${color};box-shadow:0 0 8px ${color}"
                onclick="ThemeSystem.applyCustomAccent('${color}')"
              ></button>
            `).join('')}
          </div>
          <div class="accent-custom-row">
            <input
              type="color"
              class="color-picker accent-color-input"
              value="${this.customAccent}"
              id="custom-accent-picker"
              onchange="ThemeSystem.applyCustomAccent(this.value)"
            >
            <span class="accent-custom-label">Pick any color</span>
          </div>
        </div>
      </div>
    `;

    // Auto theme toggle
    html += `
      <div class="theme-category">
        <div class="glass-card" style="padding:16px">
          <div class="setting-item" style="padding:0">
            <div class="setting-info">
              <div class="setting-name">🔄 Auto Theme</div>
              <div class="setting-desc">Sync with system dark/light mode</div>
            </div>
            <label class="toggle-label">
              <input type="checkbox" class="toggle-input" id="auto-theme-toggle"
                ${this.autoTheme ? 'checked' : ''}
                onchange="ThemeSystem.toggleAutoTheme(this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // ============================================
  // SAVE / LOAD
  // ============================================
  async saveTheme(themeName) {
    try {
      await DB.setSetting('current_theme', themeName);
    } catch(e) {}
  },

  async loadSaved() {
    try {
      const saved = await DB.getSetting('current_theme');
      const accent = await DB.getSetting('custom_accent');
      const autoT = await DB.getSetting('auto_theme');

      if (autoT) {
        this.autoTheme = true;
        this.initAutoTheme();
        return;
      }

      if (saved) {
        if (saved.startsWith('gradient-')) {
          this.applyGradientTheme(saved.replace('gradient-', ''));
        } else {
          this.apply(saved);
        }
      }

      if (accent) {
        this.customAccent = accent;
        this.applyCustomAccent(accent);
      }
    } catch(e) {
      this.apply('dark-luxury');
    }
  },

  // ============================================
  // COLOR HELPERS
  // ============================================
  hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? {
      r: parseInt(r[1], 16),
      g: parseInt(r[2], 16),
      b: parseInt(r[3], 16)
    } : null;
  },

  lightenHex(hex, amount) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    const r = Math.min(255, rgb.r + amount);
    const g = Math.min(255, rgb.g + amount);
    const b = Math.min(255, rgb.b + amount);
    return `#${[r,g,b].map(x => x.toString(16).padStart(2,'0')).join('')}`;
  },

  darkenHex(hex, amount) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    const r = Math.max(0, rgb.r - amount);
    const g = Math.max(0, rgb.g - amount);
    const b = Math.max(0, rgb.b - amount);
    return `#${[r,g,b].map(x => x.toString(16).padStart(2,'0')).join('')}`;
  },

  lightenColor(hex, percent) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent / 100));
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent / 100));
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent / 100));
    return `#${[r,g,b].map(x => x.toString(16).padStart(2,'0')).join('')}`;
  }
};
