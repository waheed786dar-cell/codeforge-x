// ============================================
// CODEFORGE X — Database System (IndexedDB)
// Sab kuch local mein save hoga — no server needed
// ============================================

const DB = {
  name: 'CodeForgeXDB',
  version: 1,
  instance: null,

  // Stores (tables) ki list
  stores: {
    library: 'library',       // saved codes
    history: 'history',       // recent activity
    collections: 'collections', // folders
    settings: 'settings'      // user preferences
  },

  // DB open karo
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('[DB] Creating stores...');

        // Library store
        if (!db.objectStoreNames.contains('library')) {
          const libStore = db.createObjectStore('library', {
            keyPath: 'id',
            autoIncrement: true
          });
          libStore.createIndex('type', 'type', { unique: false });
          libStore.createIndex('date', 'createdAt', { unique: false });
          libStore.createIndex('favorite', 'favorite', { unique: false });
          libStore.createIndex('collection', 'collectionId', { unique: false });
        }

        // History store
        if (!db.objectStoreNames.contains('history')) {
          const histStore = db.createObjectStore('history', {
            keyPath: 'id',
            autoIncrement: true
          });
          histStore.createIndex('type', 'type', { unique: false });
          histStore.createIndex('date', 'createdAt', { unique: false });
        }

        // Collections store
        if (!db.objectStoreNames.contains('collections')) {
          const colStore = db.createObjectStore('collections', {
            keyPath: 'id',
            autoIncrement: true
          });
          colStore.createIndex('name', 'name', { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        console.log('[DB] All stores created!');
      };

      request.onsuccess = (event) => {
        this.instance = event.target.result;
        console.log('[DB] Database ready!');
        resolve(this.instance);
      };

      request.onerror = (event) => {
        console.error('[DB] Error:', event.target.error);
        reject(event.target.error);
      };
    });
  },

  // Item add karo
  async add(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const item = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const request = store.add(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Sab items lo
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Ek item lo by ID
  async get(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Item update karo
  async update(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const item = { ...data, updatedAt: new Date().toISOString() };
      const request = store.put(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Item delete karo
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  },

  // Setting save karo
  async setSetting(key, value) {
    return this.update('settings', { key, value });
  },

  // Setting lo
  async getSetting(key, defaultValue = null) {
    const result = await this.get('settings', key);
    return result ? result.value : defaultValue;
  },

  // History add karo (max 500 items)
  async addHistory(data) {
    const all = await this.getAll('history');
    if (all.length >= 500) {
      // Purana delete karo
      const oldest = all.sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
      )[0];
      await this.delete('history', oldest.id);
    }
    return this.add('history', data);
  },

  // Sab clear karo
  async clearStore(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.instance.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
};
