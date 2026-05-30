// ============================================
// CODEFORGE X — Settings Page
// ============================================

const SettingsPage = {
  async onEnter() {
    this.loadValues();
    this.updateStorage();
    this.renderPermissions();
    // Theme picker render
    ThemeSystem.renderThemePicker('theme-picker-container');
  },

  loadValues() {
    const s = App.settings;
    const theme = document.getElementById('theme-select');
    const lang = document.getElementById('lang-select');
    const haptics = document.getElementById('haptics-toggle');
    const sounds = document.getElementById('sounds-toggle');
    const autosave = document.getElementById('autosave-toggle');
    const format = document.getElementById('format-select');
    const wm = document.getElementById('watermark-input');

    if (theme) theme.value = s.theme;
    if (lang) lang.value = s.language;
    if (haptics) haptics.checked = s.haptics;
    if (sounds) sounds.checked = s.sounds;
    if (autosave) autosave.checked = s.autoSave;
    if (format) format.value = s.exportFormat;
    if (wm) wm.value = s.watermark;
  },

  async changeTheme(val) {
    App.settings.theme = val;
    App.applyTheme(val);
    await App.saveSettings();
    Utils.vibrate([30]);
    Utils.showToast('Theme changed!', 'success');
  },

  async changeLang(val) {
    App.settings.language = val;
    await App.saveSettings();
    Utils.showToast('Language updated!', 'info');
  },

  async toggleHaptics(val) {
    App.settings.haptics = val;
    await App.saveSettings();
    if (val) Utils.vibrate([50, 30, 50]);
  },

  async toggleSounds(val) {
    App.settings.sounds = val;
    await App.saveSettings();
  },

  async toggleAutoSave(val) {
    App.settings.autoSave = val;
    await App.saveSettings();
  },

  async changeFormat(val) {
    App.settings.exportFormat = val;
    await App.saveSettings();
  },

  async changeWatermark(val) {
    App.settings.watermark = val;
    await App.saveSettings();
  },

  async updateStorage() {
    const info = await Utils.checkStorageQuota();
    if (info) {
      const fill = document.getElementById('storage-fill');
      const text = document.getElementById('storage-text');
      if (fill) fill.style.width = info.percent;
      if (text) text.textContent = `${info.used} / ${info.total}`;
    }
  },

  async exportData() {
    const library = await DB.getAll('library');
    const history = await DB.getAll('history');
    const data = { library, history, exportedAt: new Date().toISOString(), app: 'CODEFORGE X' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    Utils.downloadFile(url, `codeforge-backup-${Date.now()}.json`);
  },

  async clearHistory() {
    if (!confirm('Clear all history? This cannot be undone.')) return;
    await DB.clearStore('history');
    Utils.showToast('History cleared!', 'success');
  },

  async clearAll() {
    if (!confirm('Reset everything? All data will be deleted!')) return;
    await DB.clearStore('library');
    await DB.clearStore('history');
    await DB.clearStore('settings');
    App.stats = { totalGenerated: 0, qrGenerated: 0, barcodeGenerated: 0, codeGenerated: 0, totalExported: 0 };
    Utils.showToast('App reset complete!', 'success');
    Router.navigate('home');
  }
};
