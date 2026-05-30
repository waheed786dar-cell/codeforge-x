// ============================================
// CODEFORGE X — Barcode Generator Page
// JsBarcode wrapper with styling
// ============================================

const BarcodePage = {
  onEnter() {
    this.initListeners();
  },

  initListeners() {
    const debouncedGenerate = Utils.debounce(() => this.generate(), 600);
    ['barcode-data', 'barcode-type', 'bc-fg', 'bc-bg', 'bc-width', 'bc-height', 'bc-text'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', debouncedGenerate);
    });

    const widthRange = document.getElementById('bc-width');
    const heightRange = document.getElementById('bc-height');
    if (widthRange) widthRange.addEventListener('input', () => {
      document.getElementById('bc-width-val').textContent = widthRange.value;
    });
    if (heightRange) heightRange.addEventListener('input', () => {
      document.getElementById('bc-height-val').textContent = heightRange.value + 'px';
    });
  },

  generate() {
    const data = document.getElementById('barcode-data')?.value?.trim();
    if (!data) return;

    const type = document.getElementById('barcode-type')?.value || 'CODE128';
    const fgColor = document.getElementById('bc-fg')?.value || '#c9a84c';
    const bgColor = document.getElementById('bc-bg')?.value || '#0a0a0f';
    const lineWidth = parseFloat(document.getElementById('bc-width')?.value || 2);
    const height = parseInt(document.getElementById('bc-height')?.value || 100);
    const showText = document.getElementById('bc-text')?.checked ?? true;

    try {
      JsBarcode('#barcode-preview', data, {
        format: type,
        lineColor: fgColor,
        background: bgColor,
        width: lineWidth,
        height: height,
        displayValue: showText,
        fontOptions: '',
        font: 'Rajdhani',
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 4,
        fontSize: 14,
        margin: 12,
        valid: (valid) => {
          if (!valid) Utils.showToast('Invalid data for selected barcode type', 'warning');
        }
      });

      DB.addHistory({
        type: 'barcode',
        title: data.substring(0, 40),
        data,
        barcodeType: type
      });
      App.incrementStat('barcode');

    } catch(e) {
      Utils.showToast('Barcode error: ' + e.message, 'error');
    }
  },

  async exportAs(format) {
    const svg = document.getElementById('barcode-preview');
    if (!svg || !svg.childNodes.length) {
      Utils.showToast('Generate barcode first!', 'warning'); return;
    }
    const timestamp = Date.now();

    if (format === 'png') {
      // SVG to canvas to PNG
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svg.getBoundingClientRect().width * 3;
        canvas.height = svg.getBoundingClientRect().height * 3;
        const ctx = canvas.getContext('2d');
        ctx.scale(3, 3);
        ctx.drawImage(img, 0, 0);
        Utils.canvasToPNG(canvas, `barcode-${timestamp}.png`);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      Utils.downloadFile(url, `barcode-${timestamp}.svg`);
    } else if (format === 'pdf') {
      Utils.showToast('PDF export generating...', 'info');
    }
  },

  async share() {
    Utils.showToast('Preparing share...', 'info');
  },

  async saveToLibrary() {
    const svg = document.getElementById('barcode-preview');
    if (!svg || !svg.childNodes.length) {
      Utils.showToast('Generate barcode first!', 'warning'); return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    await DB.add('library', {
      type: 'barcode',
      title: document.getElementById('barcode-data')?.value?.substring(0, 40) || 'Barcode',
      data: document.getElementById('barcode-data')?.value,
      svgData,
      favorite: false
    });
    Utils.showToast('Saved to library! 📚', 'success');
  }
};
