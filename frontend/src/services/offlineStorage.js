// Offline storage service using localStorage and IndexedDB

const CACHE_PREFIX = 'sahayak_';

// LocalStorage helpers
export const localStore = {
    get: (key) => {
        try {
            const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },

    remove: (key) => {
        localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    },
};

// Offline queue for SOS requests
const QUEUE_KEY = 'offline_sos_queue';

export const offlineQueue = {
    add: (sosRequest) => {
        const queue = localStore.get(QUEUE_KEY) || [];
        queue.push({
            ...sosRequest,
            queuedAt: new Date().toISOString(),
            id: `offline_${Date.now()}`,
        });
        localStore.set(QUEUE_KEY, queue);
    },

    getAll: () => localStore.get(QUEUE_KEY) || [],

    remove: (id) => {
        const queue = localStore.get(QUEUE_KEY) || [];
        localStore.set(QUEUE_KEY, queue.filter(item => item.id !== id));
    },

    clear: () => localStore.remove(QUEUE_KEY),

    count: () => (localStore.get(QUEUE_KEY) || []).length,
};

// Quick fixes cache
const QUICK_FIXES_KEY = 'quick_fixes';

export const quickFixesCache = {
    get: () => localStore.get(QUICK_FIXES_KEY),

    set: (fixes) => localStore.set(QUICK_FIXES_KEY, {
        fixes,
        cachedAt: new Date().toISOString(),
    }),

    isStale: (maxAgeMinutes = 60) => {
        const cached = localStore.get(QUICK_FIXES_KEY);
        if (!cached) return true;

        const cachedAt = new Date(cached.cachedAt);
        const now = new Date();
        const ageMinutes = (now - cachedAt) / 1000 / 60;

        return ageMinutes > maxAgeMinutes;
    },
};

// User session cache
export const userCache = {
    get: () => localStore.get('user'),
    set: (user) => localStore.set('user', user),
    clear: () => localStore.remove('user'),
};

// Check if online
export const isOnline = () => navigator.onLine;

// Listen for online/offline events
export const onConnectivityChange = (callback) => {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));

    return () => {
        window.removeEventListener('online', () => callback(true));
        window.removeEventListener('offline', () => callback(false));
    };
};

export default {
    localStore,
    offlineQueue,
    quickFixesCache,
    userCache,
    isOnline,
    onConnectivityChange,
};
