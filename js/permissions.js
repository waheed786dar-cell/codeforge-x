// ============================================
// CODEFORGE X — Permissions Manager
// Sab device permissions ek jagah handle hongi
// ============================================

const Permissions = {

  // Permission states store
  state: {
    camera: 'unknown',      // granted / denied / prompt / unknown
    microphone: 'unknown',
    location: 'unknown',
    notifications: 'unknown',
    clipboard: 'unknown',
    vibration: false,
    deviceOrientation: false
  },

  // ============================================
  // INIT — App start pe sab check karo
  // ============================================
  async init() {
    console.log('[Permissions] Initializing...');
    await this.checkAll();
    this.initClipboardWatcher();
    this.initOrientationListener();
    console.log('[Permissions] State:', this.state);
  },

  // ============================================
  // CHECK ALL PERMISSIONS
  // ============================================
  async checkAll() {
    // Permissions API se check karo (jo support karte hain)
    const toCheck = ['camera', 'microphone', 'geolocation', 'notifications'];

    for (const name of toCheck) {
      try {
        if (navigator.permissions) {
          const result = await navigator.permissions.query({
            name: name === 'location' ? 'geolocation' : name
          });
          const key = name === 'geolocation' ? 'location' : name;
          this.state[key] = result.state;

          // Change listener
          result.onchange = () => {
            this.state[key] = result.state;
            console.log(`[Permissions] ${key} changed to:`, result.state);
            this.onPermissionChange(key, result.state);
          };
        }
      } catch(e) {
        console.log(`[Permissions] Cannot query ${name}:`, e.message);
      }
    }

    // Vibration check
    this.state.vibration = 'vibrate' in navigator;

    // Clipboard check
    this.state.clipboard = 'clipboard' in navigator;

    // Device orientation check
    this.state.deviceOrientation = 'DeviceOrientationEvent' in window;
  },

  // ============================================
  // CAMERA PERMISSION
  // ============================================
  async requestCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      // Permission mili — stream band karo (sirf test tha)
      stream.getTracks().forEach(t => t.stop());
      this.state.camera = 'granted';
      this.saveState();
      Utils.showToast('Camera access granted! 📷', 'success');
      Utils.vibrate([30, 20, 30]);
      return true;
    } catch(err) {
      if (err.name === 'NotAllowedError') {
        this.state.camera = 'denied';
        Utils.showToast('Camera access denied', 'error');
      } else if (err.name === 'NotFoundError') {
        Utils.showToast('No camera found on this device', 'warning');
      } else {
        Utils.showToast('Camera error: ' + err.message, 'error');
      }
      this.saveState();
      return false;
    }
  },

  async getCameraStream(facingMode = 'environment') {
    if (this.state.camera === 'denied') {
      this.showPermissionDeniedModal('camera');
      return null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      this.state.camera = 'granted';
      return stream;
    } catch(err) {
      if (err.name === 'NotAllowedError') {
        this.state.camera = 'denied';
        this.showPermissionDeniedModal('camera');
      }
      return null;
    }
  },

  // ============================================
  // MICROPHONE PERMISSION
  // ============================================
  async requestMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      this.state.microphone = 'granted';
      this.saveState();
      Utils.showToast('Microphone access granted! 🎤', 'success');
      Utils.vibrate([30, 20, 30]);
      return true;
    } catch(err) {
      if (err.name === 'NotAllowedError') {
        this.state.microphone = 'denied';
        Utils.showToast('Microphone access denied', 'error');
      } else {
        Utils.showToast('Microphone not available', 'warning');
      }
      this.saveState();
      return false;
    }
  },

  async getMicStream() {
    if (this.state.microphone === 'denied') {
      this.showPermissionDeniedModal('microphone');
      return null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      this.state.microphone = 'granted';
      return stream;
    } catch(err) {
      this.state.microphone = 'denied';
      this.showPermissionDeniedModal('microphone');
      return null;
    }
  },

  // ============================================
  // LOCATION PERMISSION
  // ============================================
  async requestLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        Utils.showToast('Location not supported on this device', 'warning');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.state.location = 'granted';
          this.saveState();
          Utils.showToast('Location access granted! 📍', 'success');
          Utils.vibrate([30, 20, 30]);
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude
          });
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            this.state.location = 'denied';
            this.showPermissionDeniedModal('location');
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            Utils.showToast('Location unavailable', 'warning');
          } else {
            Utils.showToast('Location timeout', 'warning');
          }
          this.saveState();
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  },

  async getLocationForQR() {
    const loc = await this.requestLocation();
    if (!loc) return null;

    // Google Maps URL banao
    const mapsUrl = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
    const geoUri = `geo:${loc.lat},${loc.lng}`;

    return {
      lat: loc.lat,
      lng: loc.lng,
      accuracy: loc.accuracy,
      mapsUrl,
      geoUri
    };
  },

  // ============================================
  // NOTIFICATIONS PERMISSION
  // ============================================
  async requestNotifications() {
    if (!('Notification' in window)) {
      Utils.showToast('Notifications not supported', 'warning');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.state.notifications = 'granted';
      return true;
    }

    if (Notification.permission === 'denied') {
      this.state.notifications = 'denied';
      this.showPermissionDeniedModal('notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    this.state.notifications = result;
    this.saveState();

    if (result === 'granted') {
      Utils.showToast('Notifications enabled! 🔔', 'success');
      // Test notification
      this.sendNotification('CODEFORGE X', 'Notifications are now active!', '📲');
      return true;
    } else {
      Utils.showToast('Notifications denied', 'warning');
      return false;
    }
  },

  sendNotification(title, body, icon = '⬡') {
    if (Notification.permission !== 'granted') return;
    new Notification(title, {
      body,
      icon: '/assets/icons/icon-192.png',
      badge: '/assets/icons/icon-72.png',
      vibrate: [200, 100, 200],
      tag: 'codeforge-notification'
    });
  },

  // ============================================
  // CLIPBOARD PERMISSION + AUTO DETECT
  // ============================================
  async requestClipboard() {
    try {
      // Clipboard read permission
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'clipboard-read' });
        this.state.clipboard = result.state;
      }
      // Test read
      const text = await navigator.clipboard.readText();
      this.state.clipboard = 'granted';
      this.saveState();
      Utils.showToast('Clipboard access granted! 📋', 'success');
      return text;
    } catch(err) {
      if (err.name === 'NotAllowedError') {
        this.state.clipboard = 'denied';
        Utils.showToast('Clipboard access denied', 'warning');
      }
      return null;
    }
  },

  async readClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      return text || null;
    } catch(err) {
      return null;
    }
  },

  // Auto clipboard watcher — app focus pe check karo
  initClipboardWatcher() {
    let lastClipboard = '';

    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        const text = await this.readClipboard();
        if (text && text !== lastClipboard && text.length > 0) {
          lastClipboard = text;
          this.onClipboardDetected(text);
        }
      }
    });

    // Focus event bhi
    window.addEventListener('focus', async () => {
      const text = await this.readClipboard();
      if (text && text !== lastClipboard && text.length > 0) {
        lastClipboard = text;
        this.onClipboardDetected(text);
      }
    });
  },

  onClipboardDetected(text) {
    const type = this.detectDataType(text);
    if (!type) return;

    // Smart banner show karo
    this.showClipboardBanner(text, type);
  },

  // ============================================
  // SMART DATA TYPE DETECTION
  // ============================================
  detectDataType(text) {
    if (!text || text.length > 2000) return null;

    // URL
    if (/^https?:\/\/.+/.test(text)) return 'url';

    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'email';

    // Phone number (Pakistani + international)
    if (/^(\+92|0092|0)?[3][0-9]{9}$/.test(text.replace(/\s/g, ''))) return 'phone';
    if (/^\+?[1-9]\d{6,14}$/.test(text.replace(/[\s\-\(\)]/g, ''))) return 'phone';

    // WiFi
    if (/^WIFI:/.test(text)) return 'wifi';

    // vCard
    if (/^BEGIN:VCARD/.test(text)) return 'vcard';

    // Location coordinates
    if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(text.trim())) return 'location';

    // UPI / Payment
    if (/^upi:\/\//.test(text)) return 'upi';

    // Plain text (min 3 chars)
    if (text.trim().length >= 3) return 'text';

    return null;
  },

  getTypeIcon(type) {
    const icons = {
      url: '🌐', email: '📧', phone: '📞',
      wifi: '📶', vcard: '👤', location: '📍',
      upi: '💳', text: '📝'
    };
    return icons[type] || '📋';
  },

  getTypeLabel(type) {
    const labels = {
      url: 'Website URL', email: 'Email Address',
      phone: 'Phone Number', wifi: 'WiFi Config',
      vcard: 'Contact Card', location: 'Location',
      upi: 'Payment ID', text: 'Text'
    };
    return labels[type] || 'Text';
  },

  // ============================================
  // CLIPBOARD BANNER UI
  // ============================================
  showClipboardBanner(text, type) {
    // Purana banner remove karo
    const existing = document.getElementById('clipboard-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'clipboard-banner';
    banner.className = 'clipboard-banner';
    banner.innerHTML = `
      <div class="cb-left">
        <span class="cb-icon">${this.getTypeIcon(type)}</span>
        <div class="cb-info">
          <div class="cb-label">${this.getTypeLabel(type)} detected</div>
          <div class="cb-value">${text.substring(0, 35)}${text.length > 35 ? '...' : ''}</div>
        </div>
      </div>
      <div class="cb-right">
        <button class="cb-btn-use" onclick="Permissions.useClipboardForQR('${text.replace(/'/g, "\\'")}', '${type}')">
          Make QR
        </button>
        <button class="cb-btn-close" onclick="Permissions.dismissClipboardBanner()">✕</button>
      </div>
    `;

    document.body.appendChild(banner);

    // Animate in
    requestAnimationFrame(() => banner.classList.add('cb-show'));

    // 8 seconds baad auto dismiss
    setTimeout(() => this.dismissClipboardBanner(), 8000);

    Utils.vibrate([20, 10, 20]);
  },

  dismissClipboardBanner() {
    const banner = document.getElementById('clipboard-banner');
    if (banner) {
      banner.classList.remove('cb-show');
      setTimeout(() => banner.remove(), 300);
    }
  },

  useClipboardForQR(text, type) {
    this.dismissClipboardBanner();
    Router.navigate('qr-generator');

    setTimeout(() => {
      // Tab set karo
      const tabMap = {
        url: 'url', email: 'email', phone: 'text',
        text: 'text', wifi: 'wifi', vcard: 'vcard'
      };
      const tab = tabMap[type] || 'text';

      const tabBtn = document.querySelector(`#page-qr-generator .tab-btn[data-tab="${tab}"]`);
      if (tabBtn) tabBtn.click();

      // Input fill karo
      const inputMap = {
        url: 'qr-url', text: 'qr-text',
        email: 'email-to', phone: 'qr-text'
      };
      const inputId = inputMap[type];
      if (inputId) {
        const input = document.getElementById(inputId);
        if (input) {
          input.value = text;
          input.dispatchEvent(new Event('input'));
        }
      }

      Utils.showToast(`${this.getTypeLabel(type)} loaded from clipboard!`, 'success');
    }, 400);
  },

  // ============================================
  // DEVICE ORIENTATION (3D tilt)
  // ============================================
  initOrientationListener() {
    if (!('DeviceOrientationEvent' in window)) return;

    // iOS 13+ mein permission maangni padti hai
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      this.state.deviceOrientation = 'prompt';
    } else {
      this.state.deviceOrientation = 'granted';
      this.startOrientationTracking();
    }
  },

  async requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result === 'granted') {
          this.state.deviceOrientation = 'granted';
          this.startOrientationTracking();
          Utils.showToast('Motion sensor enabled! 📱', 'success');
          return true;
        }
      } catch(e) {
        console.log('Orientation permission error:', e);
      }
      return false;
    }
    return true;
  },

  startOrientationTracking() {
    window.addEventListener('deviceorientation', (e) => {
      this.orientation = {
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0
      };
      this.onOrientationChange(this.orientation);
    }, { passive: true });
  },

  onOrientationChange(orientation) {
    // QR preview 3D tilt effect
    const qrContainer = document.getElementById('qr-preview-container');
    if (qrContainer && Router.currentPage === 'qr-generator') {
      const rotX = Math.min(Math.max(orientation.beta * 0.3, -15), 15);
      const rotY = Math.min(Math.max(orientation.gamma * 0.3, -15), 15);
      qrContainer.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  },

  // ============================================
  // VIBRATION PATTERNS
  // ============================================
  vibrate(pattern) {
    if (!this.state.vibration || !App.settings.haptics) return;
    navigator.vibrate(pattern);
  },

  vibratePattern(type) {
    const patterns = {
      success: [30, 20, 60],
      error: [100, 50, 100, 50, 100],
      warning: [50, 30, 50],
      tap: [20],
      doubleTap: [20, 30, 20],
      generate: [10, 10, 10, 10, 60],
      save: [30, 20, 30, 20, 80],
      export: [20, 10, 20, 10, 20, 10, 80],
      delete: [80, 40, 80],
      scan: [50, 30, 100],
      navigate: [15],
      longPress: [60]
    };

    const pattern = patterns[type] || patterns.tap;
    this.vibrate(pattern);
  },

  // ============================================
  // PERMISSION DENIED MODAL
  // ============================================
  showPermissionDeniedModal(permType) {
    const existing = document.getElementById('perm-denied-modal');
    if (existing) existing.remove();

    const info = {
      camera: {
        icon: '📷',
        title: 'Camera Access Needed',
        desc: 'QR Scanner aur logo upload ke liye camera permission chahiye.',
        steps: 'Settings → Site Settings → Camera → Allow'
      },
      microphone: {
        icon: '🎤',
        title: 'Microphone Access Needed',
        desc: 'Voice to QR feature ke liye microphone permission chahiye.',
        steps: 'Settings → Site Settings → Microphone → Allow'
      },
      location: {
        icon: '📍',
        title: 'Location Access Needed',
        desc: 'Location QR generate karne ke liye location permission chahiye.',
        steps: 'Settings → Site Settings → Location → Allow'
      },
      notifications: {
        icon: '🔔',
        title: 'Notifications Blocked',
        desc: 'Generation alerts ke liye notification permission chahiye.',
        steps: 'Settings → Site Settings → Notifications → Allow'
      }
    };

    const data = info[permType] || info.camera;

    const modal = document.createElement('div');
    modal.id = 'perm-denied-modal';
    modal.className = 'perm-modal-overlay';
    modal.innerHTML = `
      <div class="perm-modal-card">
        <div class="perm-modal-icon">${data.icon}</div>
        <div class="perm-modal-title">${data.title}</div>
        <div class="perm-modal-desc">${data.desc}</div>
        <div class="perm-modal-steps">
          <div class="perm-steps-title">Kaise enable karein:</div>
          <div class="perm-steps-text">${data.steps}</div>
        </div>
        <div class="perm-modal-btns">
          <button class="cf-btn cf-btn-outline" onclick="Permissions.closeModal()">Later</button>
          <button class="cf-btn cf-btn-gold" onclick="Permissions.openBrowserSettings()">Open Settings</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('perm-modal-show'));
    this.vibratePattern('warning');
  },

  closeModal() {
    const modal = document.getElementById('perm-denied-modal');
    if (modal) {
      modal.classList.remove('perm-modal-show');
      setTimeout(() => modal.remove(), 300);
    }
  },

  openBrowserSettings() {
    // Android Chrome mein settings open karne ka attempt
    window.open('chrome://settings/content', '_blank');
    this.closeModal();
    Utils.showToast('Browser settings mein Camera/Location allow karein', 'info');
  },

  // ============================================
  // PERMISSION CHANGE HANDLER
  // ============================================
  onPermissionChange(key, state) {
    if (state === 'granted') {
      Utils.showToast(`${key} permission granted! ✅`, 'success');
      this.vibratePattern('success');
    } else if (state === 'denied') {
      Utils.showToast(`${key} permission denied`, 'warning');
    }
  },

  // ============================================
  // SAVE / LOAD STATE
  // ============================================
  async saveState() {
    try {
      await DB.setSetting('permissions_state', this.state);
    } catch(e) {}
  },

  async loadState() {
    try {
      const saved = await DB.getSetting('permissions_state');
      if (saved) this.state = { ...this.state, ...saved };
    } catch(e) {}
  },

  // ============================================
  // PERMISSION STATUS CHECK (for UI)
  // ============================================
  isGranted(permission) {
    return this.state[permission] === 'granted' || this.state[permission] === true;
  },

  getStatusIcon(permission) {
    const s = this.state[permission];
    if (s === 'granted' || s === true) return '✅';
    if (s === 'denied') return '❌';
    return '⏳';
  },

  getStatusColor(permission) {
    const s = this.state[permission];
    if (s === 'granted' || s === true) return '#06d6a0';
    if (s === 'denied') return '#ef233c';
    return '#c9a84c';
  },

  // ============================================
  // FULL PERMISSIONS STATUS PAGE DATA
  // ============================================
  getAllStatus() {
    return [
      { key: 'camera', label: 'Camera', icon: '📷', desc: 'Scanner & logo upload' },
      { key: 'microphone', label: 'Microphone', icon: '🎤', desc: 'Voice to QR' },
      { key: 'location', label: 'Location', icon: '📍', desc: 'Location QR' },
      { key: 'notifications', label: 'Notifications', icon: '🔔', desc: 'Alerts & reminders' },
      { key: 'clipboard', label: 'Clipboard', icon: '📋', desc: 'Auto-detect content' },
      { key: 'vibration', label: 'Vibration', icon: '📳', desc: 'Haptic feedback' },
      { key: 'deviceOrientation', label: 'Motion Sensor', icon: '📱', desc: '3D tilt effect' }
    ];
  }
};
