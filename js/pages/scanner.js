// ============================================
// CODEFORGE X — QR Scanner Page
// Camera-based QR scanning with jsQR fallback
// ============================================

const ScannerPage = {
  stream: null,
  scanning: false,
  animFrame: null,

  async onEnter() {
    await this.startCamera();
  },

  async onLeave() {
    this.stopCamera();
  },

  async startCamera() {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = document.getElementById('scanner-video');
      if (video) {
        video.srcObject = this.stream;
        video.play();
        this.scanning = true;
        this.scanFrame();
      }
    } catch(e) {
      Utils.showToast('Camera access denied. Check permissions.', 'error');
      console.error('Camera error:', e);
    }
  },

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.scanning = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  },

  scanFrame() {
    if (!this.scanning) return;
    const video = document.getElementById('scanner-video');
    const canvas = document.getElementById('scanner-canvas');
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      this.animFrame = requestAnimationFrame(() => this.scanFrame());
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // jsQR-based scanning (if library loaded)
    if (window.jsQR) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        this.onScanSuccess(code.data);
        return;
      }
    }

    this.animFrame = requestAnimationFrame(() => this.scanFrame());
  },

  onScanSuccess(result) {
    this.scanning = false;
    Utils.vibrate([100, 50, 100]);

    const resultCard = document.getElementById('scan-result');
    const resultValue = document.getElementById('scan-result-value');
    if (resultCard) resultCard.style.display = 'block';
    if (resultValue) resultValue.textContent = result;

    DB.addHistory({ type: 'scan', title: result.substring(0, 40), data: result });
    Utils.showToast('QR Code scanned! ✅', 'success');
  },

  copyResult() {
    const val = document.getElementById('scan-result-value')?.textContent;
    if (val) Utils.copyToClipboard(val);
  },

  openResult() {
    const val = document.getElementById('scan-result-value')?.textContent;
    if (val && (val.startsWith('http') || val.startsWith('https'))) {
      window.open(val, '_blank');
    } else {
      Utils.copyToClipboard(val || '');
    }
  },

  toggleFlash() {
    const track = this.stream?.getVideoTracks()[0];
    if (track) {
      const caps = track.getCapabilities();
      if (caps.torch) {
        const settings = track.getSettings();
        track.applyConstraints({ advanced: [{ torch: !settings.torch }] });
      } else {
        Utils.showToast('Flash not supported on this device', 'warning');
      }
    }
  }
};
