// ============================================
// CODEFORGE X — QR Generator Page
// Ultra Advanced QR with 8 Styles
// ============================================

const QRPage = {
  currentQR: null,
  currentStyle: 'square',
  logo: null,

  onEnter() {
    this.initTabs();
    this.initStyleBtns();
    this.initColorPickers();
    this.initRanges();
    this.initLogoUpload();
    this.initGradientToggle();
    this.initLivePreview();
  },

  onLeave() {},

  // ===== TABS =====
  initTabs() {
    document.querySelectorAll('#page-qr-generator .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#page-qr-generator .tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('#page-qr-generator .tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tab = document.getElementById('tab-' + btn.dataset.tab);
        if (tab) tab.classList.add('active');
        Utils.vibrate([20]);
        this.debounceGenerate();
      });
    });
  },

  // ===== STYLE BUTTONS =====
  initStyleBtns() {
    document.querySelectorAll('#page-qr-generator .style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#page-qr-generator .style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentStyle = btn.dataset.style;
        Utils.vibrate([20]);
        this.generate();
      });
    });
  },

  // ===== COLOR PICKERS =====
  initColorPickers() {
    ['qr-fg-color', 'qr-bg-color', 'qr-eye-color', 'grad-color1', 'grad-color2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => this.debounceGenerate());
    });
  },

  // ===== RANGES =====
  initRanges() {
    const ranges = [
      { id: 'qr-size', valId: 'qr-size-val', suffix: 'px' },
      { id: 'qr-margin', valId: 'qr-margin-val', suffix: '' },
      { id: 'logo-size', valId: 'logo-size-val', suffix: '%' }
    ];
    ranges.forEach(({ id, valId, suffix }) => {
      const range = document.getElementById(id);
      const val = document.getElementById(valId);
      if (range && val) {
        range.addEventListener('input', () => {
          val.textContent = range.value + suffix;
          this.debounceGenerate();
        });
      }
    });
  },

  // ===== LOGO UPLOAD =====
  initLogoUpload() {
    const dropZone = document.getElementById('logo-drop-zone');
    const input = document.getElementById('qr-logo');
    const preview = document.getElementById('logo-preview');
    const previewImg = document.getElementById('logo-preview-img');
    const removeBtn = document.getElementById('remove-logo');

    if (dropZone && input) {
      dropZone.addEventListener('click', () => input.click());
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const base64 = await Utils.fileToBase64(file);
        this.logo = base64;
        if (previewImg) previewImg.src = base64;
        if (preview) preview.style.display = 'flex';
        if (dropZone) dropZone.style.display = 'none';
        this.generate();
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.logo = null;
        if (preview) preview.style.display = 'none';
        if (dropZone) dropZone.style.display = 'flex';
        if (input) input.value = '';
        this.generate();
      });
    }
  },

  // ===== GRADIENT TOGGLE =====
  initGradientToggle() {
    const toggle = document.getElementById('qr-gradient');
    const gradColors = document.getElementById('gradient-colors');
    if (toggle && gradColors) {
      toggle.addEventListener('change', () => {
        gradColors.style.display = toggle.checked ? 'flex' : 'none';
        this.generate();
      });
    }
  },

  // ===== LIVE PREVIEW — input se auto generate =====
  initLivePreview() {
    const inputs = [
      'qr-url', 'qr-text', 'wifi-ssid', 'wifi-pass', 'wifi-type',
      'vcard-name', 'vcard-phone', 'vcard-email', 'vcard-org',
      'email-to', 'email-subject', 'email-body',
      'sms-number', 'sms-message', 'qr-ecl'
    ];
    const debouncedGenerate = Utils.debounce(() => this.generate(), 500);
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', debouncedGenerate);
    });
  },

  debounceGenerate: Utils.debounce(function() { QRPage.generate(); }, 400),

  // ===== GET DATA FROM ACTIVE TAB =====
  getData() {
    const activeTab = document.querySelector('#page-qr-generator .tab-btn.active');
    if (!activeTab) return '';
    const tab = activeTab.dataset.tab;

    switch(tab) {
      case 'url': return document.getElementById('qr-url')?.value || '';
      case 'text': return document.getElementById('qr-text')?.value || '';
      case 'wifi': {
        const ssid = document.getElementById('wifi-ssid')?.value || '';
        const pass = document.getElementById('wifi-pass')?.value || '';
        const type = document.getElementById('wifi-type')?.value || 'WPA';
        return ssid ? `WIFI:T:${type};S:${ssid};P:${pass};;` : '';
      }
      case 'vcard': {
        const name = document.getElementById('vcard-name')?.value || '';
        const phone = document.getElementById('vcard-phone')?.value || '';
        const email = document.getElementById('vcard-email')?.value || '';
        const org = document.getElementById('vcard-org')?.value || '';
        return name ? `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${org}\nEND:VCARD` : '';
      }
      case 'email': {
        const to = document.getElementById('email-to')?.value || '';
        const sub = document.getElementById('email-subject')?.value || '';
        const body = document.getElementById('email-body')?.value || '';
        return to ? `mailto:${to}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}` : '';
      }
      case 'sms': {
        const num = document.getElementById('sms-number')?.value || '';
        const msg = document.getElementById('sms-message')?.value || '';
        return num ? `smsto:${num}:${msg}` : '';
      }
      default: return '';
    }
  },

  // ===== GENERATE QR =====
  generate() {
    const data = this.getData();
    if (!data.trim()) {
      this.showPlaceholder();
      return;
    }

    const container = document.getElementById('qr-preview-container');
    if (!container) return;
    container.innerHTML = '';

    const fgColor = document.getElementById('qr-fg-color')?.value || '#c9a84c';
    const bgColor = document.getElementById('qr-bg-color')?.value || '#0a0a0f';
    const size = parseInt(document.getElementById('qr-size')?.value || 300);
    const ecl = document.getElementById('qr-ecl')?.value || 'M';
    const margin = parseInt(document.getElementById('qr-margin')?.value || 4);

    try {
      const qr = new QRCode(container, {
        text: data,
        width: Math.min(size, window.innerWidth - 80),
        height: Math.min(size, window.innerWidth - 80),
        colorDark: fgColor,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel[ecl] || QRCode.CorrectLevel.M
      });

      // Style apply karo after generation
      setTimeout(() => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
          this.applyStyle(canvas, fgColor, bgColor);
          if (this.logo) this.embedLogo(canvas);
          canvas.classList.add('qr-generated');
        }
      }, 100);

      this.currentQR = { data, fgColor, bgColor, size, ecl, style: this.currentStyle };

      // Auto save to history
      DB.addHistory({
        type: 'qr',
        title: data.substring(0, 40),
        data,
        style: this.currentStyle
      });

      App.incrementStat('qr');

    } catch(e) {
      Utils.showToast('QR generation failed: ' + e.message, 'error');
    }
  },

  // ===== STYLE EFFECTS =====
  applyStyle(canvas, fgColor, bgColor) {
    if (this.currentStyle === 'square') return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const fg = Utils.hexToRgb(fgColor);
    const bg = Utils.hexToRgb(bgColor);

    // Detect dark pixels (QR modules)
    const isDark = (i) => data[i] < 128 && data[i+1] < 128 && data[i+2] < 128;

    if (this.currentStyle === 'dots') {
      // Clear and redraw as dots
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tCtx = tempCanvas.getContext('2d');

      // Bg fill
      tCtx.fillStyle = bgColor;
      tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw dots
      const moduleSize = canvas.width / 33; // approx module count
      tCtx.fillStyle = fgColor;
      tCtx.shadowBlur = 4;
      tCtx.shadowColor = fgColor;

      for(let x = 0; x < canvas.width; x += moduleSize) {
        for(let y = 0; y < canvas.height; y += moduleSize) {
          const idx = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
          if(isDark(idx)) {
            tCtx.beginPath();
            tCtx.arc(x + moduleSize/2, y + moduleSize/2, moduleSize/2 * 0.8, 0, Math.PI*2);
            tCtx.fill();
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
    }

    // Gradient mode
    const gradToggle = document.getElementById('qr-gradient');
    if (gradToggle?.checked) {
      const c1 = document.getElementById('grad-color1')?.value || '#c9a84c';
      const c2 = document.getElementById('grad-color2')?.value || '#f0c66a';
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }
  },

  // ===== LOGO EMBED =====
  embedLogo(canvas) {
    const logoSizePct = parseInt(document.getElementById('logo-size')?.value || 20) / 100;
    const logoSize = canvas.width * logoSizePct;
    const x = (canvas.width - logoSize) / 2;
    const y = (canvas.height - logoSize) / 2;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      // White background behind logo
      ctx.fillStyle = 'white';
      ctx.fillRect(x - 8, y - 8, logoSize + 16, logoSize + 16);
      ctx.drawImage(img, x, y, logoSize, logoSize);
    };
    img.src = this.logo;
  },

  showPlaceholder() {
    const container = document.getElementById('qr-preview-container');
    if (container) {
      container.innerHTML = `
        <div class="qr-placeholder">
          <div class="qr-placeholder-icon">▦</div>
          <div class="qr-placeholder-text">Enter data above to generate</div>
        </div>`;
    }
  },

  // ===== EXPORT =====
  async exportAs(format) {
    const canvas = document.querySelector('#qr-preview-container canvas');
    if (!canvas) { Utils.showToast('Generate QR first!', 'warning'); return; }

    const timestamp = Date.now();

    if (format === 'png') {
      Utils.canvasToPNG(canvas, `qr-codeforge-${timestamp}.png`);
    } else if (format === 'svg') {
      Utils.showToast('SVG export coming soon!', 'info');
    } else if (format === 'pdf') {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const dataUrl = canvas.toDataURL('image/png');
      const size = 100;
      const x = (210 - size) / 2;
      const y = (297 - size) / 2;
      pdf.addImage(dataUrl, 'PNG', x, y, size, size);
      pdf.save(`qr-codeforge-${timestamp}.pdf`);
      Utils.showToast('PDF exported!', 'success');
    } else if (format === 'share') {
      this.share();
    }

    App.stats.totalExported++;
    App.saveStats();
  },

  async share() {
    const canvas = document.querySelector('#qr-preview-container canvas');
    if (!canvas) { Utils.showToast('Generate QR first!', 'warning'); return; }
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'qr-codeforge.png', { type: 'image/png' });
      await Utils.shareContent({ title: 'QR Code by CODEFORGE X', files: [file] });
    });
  },

  async saveToLibrary() {
    const canvas = document.querySelector('#qr-preview-container canvas');
    if (!canvas) { Utils.showToast('Generate QR first!', 'warning'); return; }
    const dataUrl = canvas.toDataURL('image/png');
    await DB.add('library', {
      type: 'qr',
      title: (this.getData() || 'QR Code').substring(0, 40),
      data: this.getData(),
      image: dataUrl,
      style: this.currentStyle,
      favorite: false
    });
    Utils.showToast('Saved to library! 📚', 'success');
    Utils.vibrate([30, 20, 30]);
  }
};
