// ============================================
// CODEFORGE X — Advanced Haptics System
// Platform-aware vibration patterns
// ============================================

const HapticSystem = {

  enabled: true,
  supported: 'vibrate' in navigator,

  // ============================================
  // ALL PATTERNS
  // ============================================
  patterns: {
    // Basic
    tap:          [15],
    doubleTap:    [15, 30, 15],
    longPress:    [60],
    heavyTap:     [40],

    // Navigation
    navigate:     [12],
    back:         [20, 20, 10],
    tabSwitch:    [10],

    // Actions
    generate:     [10, 10, 10, 10, 80],
    save:         [30, 15, 30, 15, 80],
    exportDone:   [20, 10, 20, 10, 20, 10, 100],
    copy:         [25, 15, 50],
    share:        [20, 20, 60],
    delete:       [80, 40, 80],
    clear:        [100, 50, 100, 50, 100],

    // Feedback
    success:      [30, 20, 80],
    error:        [100, 50, 100, 50, 100],
    warning:      [50, 30, 50],

    // Scanner
    scanDetect:   [50, 30, 100],
    scanSuccess:  [30, 20, 30, 20, 120],

    // Toggle
    toggleOn:     [20, 10, 40],
    toggleOff:    [40, 10, 20],

    // Special
    heartbeat:    [30, 100, 30, 600, 30, 100, 30],
    drumroll:     [10, 10, 10, 10, 10, 10, 10, 10, 20, 20, 40, 80],
    celebration:  [50, 30, 50, 30, 80, 50, 80, 30, 50, 30, 100],
    notification: [20, 80, 20],
    themeChange:  [15, 30, 60],
    upload:       [20, 15, 20, 15, 60]
  },

  // ============================================
  // PLAY PATTERN
  // ============================================
  play(patternName) {
    if (!this.enabled || !this.supported || !App?.settings?.haptics) return;
    const pattern = this.patterns[patternName];
    if (pattern) {
      try {
        navigator.vibrate(pattern);
      } catch(e) {}
    }
  },

  // Custom pattern
  custom(pattern) {
    if (!this.enabled || !this.supported || !App?.settings?.haptics) return;
    try { navigator.vibrate(pattern); } catch(e) {}
  },

  // Stop all vibration
  stop() {
    if (this.supported) {
      try { navigator.vibrate(0); } catch(e) {}
    }
  },

  // Test all patterns (settings mein)
  async testAll(display = true) {
    const names = Object.keys(this.patterns);
    for (let i = 0; i < names.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      this.play(names[i]);
      if (display) console.log(`[Haptics] Testing: ${names[i]}`);
    }
  }
};
