// ============================================
// CODEFORGE X — Utility Functions
// Reusable helper functions poori app ke liye
// ============================================

const Utils = {

  // Unique ID generate karo
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Date format karo
  formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-PK');
  },

  // Vibration (haptic feedback)
  vibrate(pattern = [50]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },

  // Toast notification
  showToast(message, type = 'info', duration = 3000) {
    // Purana toast remove karo
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${this.getToastIcon(type)}</span>
      <span class="toast-msg">${message}</span>
    `;
    document.body.appendChild(toast);

    // Animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
      this.vibrate([30]);
    });

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  getToastIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      copy: '📋'
    };
    return icons[type] || 'ℹ️';
  },

  // Clipboard copy
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Copied to clipboard!', 'copy');
      return true;
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.showToast('Copied!', 'copy');
      return true;
    }
  },

  // File download karo
  downloadFile(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.vibrate([50, 30, 50]);
    this.showToast(`${filename} downloaded!`, 'success');
  },

  // Canvas to PNG
  canvasToPNG(canvas, filename = 'codeforge-export.png') {
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    this.downloadFile(dataUrl, filename);
  },

  // Canvas to high-res PNG
  canvasToHighResPNG(canvas, scale = 3, filename = 'codeforge-hd.png') {
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width * scale;
    offscreen.height = canvas.height * scale;
    const ctx = offscreen.getContext('2d');
    ctx.scale(scale, scale);
    ctx.drawImage(canvas, 0, 0);
    const dataUrl = offscreen.toDataURL('image/png', 1.0);
    this.downloadFile(dataUrl, filename);
  },

  // Share API
  async shareContent(data) {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (err) {
        console.log('Share cancelled');
        return false;
      }
    } else {
      this.showToast('Share not supported on this browser', 'warning');
      return false;
    }
  },

  // Debounce function
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Color hex to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // RGB to hex
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },

  // Random color generate karo
  randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  },

  // Number format (Pakistani style)
  formatNumber(num) {
    return new Intl.NumberFormat('en-PK').format(num);
  },

  // Storage size check
  async checkStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const { usage, quota } = await navigator.storage.estimate();
      return {
        used: (usage / 1024 / 1024).toFixed(2) + ' MB',
        total: (quota / 1024 / 1024).toFixed(2) + ' MB',
        percent: ((usage / quota) * 100).toFixed(1) + '%'
      };
    }
    return null;
  },

  // Scroll to element smoothly
  scrollTo(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  // Element show/hide with animation
  show(el, display = 'flex') {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) {
      el.style.display = display;
      requestAnimationFrame(() => el.classList.add('visible'));
    }
  },

  hide(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) {
      el.classList.remove('visible');
      setTimeout(() => el.style.display = 'none', 300);
    }
  },

  // Image file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Deep clone object
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};
