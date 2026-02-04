// API service for SAHAYAK AI
// Use environment variable for production, fallback to /api for local development with Vite proxy
const API_BASE = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : '/api';

console.log('🔗 API Base URL:', API_BASE);

// Auth token management
let authToken = localStorage.getItem('sahayak_token');

export const setAuthToken = (token) => {
    authToken = token;
    if (token) {
        localStorage.setItem('sahayak_token', token);
    } else {
        localStorage.removeItem('sahayak_token');
    }
};

export const getAuthToken = () => authToken;

// Fetch wrapper with auth
const apiFetch = async (endpoint, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(error.detail || 'Request failed');
    }

    return response.json();
};

// Auth API
export const authAPI = {
    login: (username, password) =>
        apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),

    getMe: () => apiFetch('/auth/me'),

    getDemoUsers: () => apiFetch('/auth/users'),
};

// SOS API
export const sosAPI = {
    submit: (text, context = null, language = 'en') =>
        apiFetch('/sos/submit', {
            method: 'POST',
            body: JSON.stringify({
                text,
                context: context ? { ...context, language } : { language }
            }),
        }),

    getQuickFixes: (limit = 50) =>
        apiFetch(`/sos/quick-fixes?limit=${limit}`),

    markSuccess: (sosId, success, feedback = null) =>
        apiFetch('/sos/mark-success', {
            method: 'POST',
            body: JSON.stringify({ sos_id: sosId, success, feedback }),
        }),

    getHistory: (limit = 10) =>
        apiFetch(`/sos/history?limit=${limit}`),

    // SMS functionality
    sendSMS: (phoneNumber, playbookSummary, activityName = null, steps = null, language = 'hi') =>
        apiFetch('/sos/send-sms', {
            method: 'POST',
            body: JSON.stringify({
                phone_number: phoneNumber,
                playbook_summary: playbookSummary,
                activity_name: activityName,
                steps: steps,
                language: language
            }),
        }),

    getSMSHistory: () => apiFetch('/sos/sms-history'),
};

// Dashboard API
export const dashboardAPI = {
    getTeacher: () => apiFetch('/dashboard/teacher'),
    getCRP: () => apiFetch('/dashboard/crp'),
    getDIET: () => apiFetch('/dashboard/diet'),
};

// Resources API
export const resourcesAPI = {
    searchVideos: (query, grade = null, language = 'hi') =>
        apiFetch(`/videos/search?query=${encodeURIComponent(query)}&grade=${grade || ''}&language=${language}`),

    getNcertRefs: (topic, grade = null, subject = null) =>
        apiFetch(`/references/ncert?topic=${encodeURIComponent(topic)}&grade=${grade || ''}&subject=${subject || ''}`),
};

// Collective Intelligence API
export const collectiveAPI = {
    shareSolution: (data) =>
        apiFetch('/collective/share', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getSolutions: (topic = '', grade = null, limit = 10) =>
        apiFetch(`/collective/solutions?topic=${encodeURIComponent(topic)}&grade=${grade || ''}&limit=${limit}`),

    useSolution: (solutionId) =>
        apiFetch(`/collective/use/${solutionId}`, { method: 'POST' }),

    provideFeedback: (solutionId, success) =>
        apiFetch(`/collective/feedback/${solutionId}?success=${success}`, { method: 'POST' }),
};

export default {
    auth: authAPI,
    sos: sosAPI,
    dashboard: dashboardAPI,
    resources: resourcesAPI,
    collective: collectiveAPI,
};
