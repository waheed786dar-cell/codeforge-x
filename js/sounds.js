// ============================================
// CODEFORGE X — Sound Effects System
// Web Audio API based — no external files needed
// ============================================

const SoundSystem = {
  ctx: null,
  enabled: true,
  volume: 0.4,

  init() {
    // AudioContext lazy init (user gesture ke baad)
    document.addEventListener('touchstart', () => this.initCtx(), { once: true });
    document.addEventListener('click', () => this.initCtx(), { once: true });
  },

  initCtx() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      console.log('[Sound] AudioContext ready');
    } catch(e) {
      console.log('[Sound] Audio not supported');
    }
  },

  // ============================================
  // CORE SOUND GENERATOR
  // ============================================
  play(type, frequency, duration, waveType = 'sine', vol = null) {
    if (!this.enabled || !this.ctx || !App.settings.sounds) return;

    try {
      const oscillator = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      const v = vol !== null ? vol : this.volume;
      gainNode.gain.setValueAtTime(v, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      oscillator.start(this.ctx.currentTime);
      oscillator.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  },

  // Multiple notes sequence
  playSequence(notes) {
    if (!this.enabled || !this.ctx || !App.settings.sounds) return;
    let time = this.ctx.currentTime;
    notes.forEach(({ freq, dur, wave = 'sine', vol = this.volume }) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.start(time);
        osc.stop(time + dur);
        time += dur * 0.8;
      } catch(e) {}
    });
  },

  // ============================================
  // NAMED SOUNDS
  // ============================================

  // QR/Barcode generate success
  generate() {
    this.playSequence([
      { freq: 440, dur: 0.06, wave: 'square', vol: 0.15 },
      { freq: 660, dur: 0.06, wave: 'square', vol: 0.15 },
      { freq: 880, dur: 0.1, wave: 'sine', vol: 0.2 }
    ]);
  },

  // Save to library
  save() {
    this.playSequence([
      { freq: 523, dur: 0.08, wave: 'sine' },
      { freq: 659, dur: 0.08, wave: 'sine' },
      { freq: 784, dur: 0.12, wave: 'sine' }
    ]);
  },

  // Export success
  exportDone() {
    this.playSequence([
      { freq: 392, dur: 0.05, wave: 'square', vol: 0.1 },
      { freq: 523, dur: 0.05, wave: 'square', vol: 0.12 },
      { freq: 659, dur: 0.05, wave: 'square', vol: 0.14 },
      { freq: 784, dur: 0.12, wave: 'sine', vol: 0.2 }
    ]);
  },

  // Navigation tap
  tap() {
    this.play('tap', 800, 0.05, 'sine', 0.08);
  },

  // Back button
  back() {
    this.playSequence([
      { freq: 600, dur: 0.05, wave: 'sine', vol: 0.1 },
      { freq: 400, dur: 0.08, wave: 'sine', vol: 0.1 }
    ]);
  },

  // Error
  error() {
    this.playSequence([
      { freq: 220, dur: 0.1, wave: 'sawtooth', vol: 0.15 },
      { freq: 180, dur: 0.15, wave: 'sawtooth', vol: 0.1 }
    ]);
  },

  // Warning
  warning() {
    this.playSequence([
      { freq: 440, dur: 0.08, wave: 'triangle', vol: 0.12 },
      { freq: 440, dur: 0.08, wave: 'triangle', vol: 0.12 }
    ]);
  },

  // Scanner beep (QR detected)
  scanSuccess() {
    this.playSequence([
      { freq: 1047, dur: 0.06, wave: 'square', vol: 0.2 },
      { freq: 1319, dur: 0.1, wave: 'sine', vol: 0.25 }
    ]);
  },

  // Delete / remove
  deleteSound() {
    this.playSequence([
      { freq: 300, dur: 0.06, wave: 'sawtooth', vol: 0.12 },
      { freq: 200, dur: 0.1, wave: 'sawtooth', vol: 0.08 }
    ]);
  },

  // Toggle switch
  toggle() {
    this.play('toggle', 1200, 0.04, 'square', 0.07);
  },

  // Copy to clipboard
  copy() {
    this.playSequence([
      { freq: 880, dur: 0.04, wave: 'square', vol: 0.1 },
      { freq: 1100, dur: 0.06, wave: 'sine', vol: 0.12 }
    ]);
  },

  // App startup chime
  startup() {
    this.playSequence([
      { freq: 262, dur: 0.1, wave: 'sine', vol: 0.15 },
      { freq: 330, dur: 0.1, wave: 'sine', vol: 0.15 },
      { freq: 392, dur: 0.1, wave: 'sine', vol: 0.15 },
      { freq: 523, dur: 0.2, wave: 'sine', vol: 0.2 }
    ]);
  },

  // Theme change
  themeChange() {
    this.playSequence([
      { freq: 600, dur: 0.06, wave: 'triangle', vol: 0.1 },
      { freq: 800, dur: 0.06, wave: 'triangle', vol: 0.12 },
      { freq: 1000, dur: 0.08, wave: 'sine', vol: 0.14 }
    ]);
  },

  // Long press
  longPress() {
    this.play('lp', 200, 0.08, 'triangle', 0.08);
  }
};
