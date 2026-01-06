/**
 * INDEXEDDB MANAGER
 * Scalable storage for large datasets
 */

class IndexedDBManager {
    constructor() {
        this.dbName = 'PerformanceLabDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                if (!db.objectStoreNames.contains('scores')) {
                    db.createObjectStore('scores', { keyPath: 'date' });
                }
                if (!db.objectStoreNames.contains('logs')) {
                    db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('backups')) {
                    db.createObjectStore('backups', { keyPath: 'timestamp' });
                }
            };
        });
    }

    async saveScore(date, scoreData) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['scores'], 'readwrite');
            const store = transaction.objectStore('scores');
            const request = store.put({ date, ...scoreData });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getScores(days = 30) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['scores'], 'readonly');
            const store = transaction.objectStore('scores');
            const request = store.getAll();

            request.onsuccess = () => {
                const scores = request.result.sort((a, b) => b.date.localeCompare(a.date)).slice(0, days);
                resolve(scores);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async createBackup() {
        if (!this.db) await this.init();

        const scores = await this.getScores(365); // Full year
        const backup = {
            timestamp: Date.now(),
            date: new Date().toISOString(),
            scores,
            version: this.version
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['backups'], 'readwrite');
            const store = transaction.objectStore('backups');
            const request = store.put(backup);

            request.onsuccess = () => resolve(backup);
            request.onerror = () => reject(request.error);
        });
    }

    async migrateFromLocalStorage() {
        const history = JSON.parse(localStorage.getItem('pl_score_history') || '{}');

        for (const [date, data] of Object.entries(history)) {
            await this.saveScore(date, data);
        }

        return Object.keys(history).length;
    }
}

export default new IndexedDBManager();
