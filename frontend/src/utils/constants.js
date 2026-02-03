// App constants
export const ROLES = {
    TEACHER: 'teacher',
    CRP: 'crp',
    DIET: 'diet',
};

export const READINESS_SIGNALS = {
    READY: 'ready',
    NEEDS_SUPPORT: 'needs_support',
    AT_RISK: 'at_risk',
};

export const READINESS_CONFIG = {
    [READINESS_SIGNALS.READY]: {
        label: 'कक्षा के लिए तैयार',
        labelEn: 'Ready for Class',
        color: 'green',
        bgClass: 'bg-green-100',
        textClass: 'text-green-700',
        icon: '✅',
    },
    [READINESS_SIGNALS.NEEDS_SUPPORT]: {
        label: 'सहायता चाहिए',
        labelEn: 'Needs Support',
        color: 'yellow',
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-700',
        icon: '📚',
    },
    [READINESS_SIGNALS.AT_RISK]: {
        label: 'विशेष ध्यान',
        labelEn: 'At Risk',
        color: 'red',
        bgClass: 'bg-red-100',
        textClass: 'text-red-700',
        icon: '🤝',
    },
};

export const SUBJECTS = [
    { id: 'Math', label: 'गणित', labelEn: 'Math' },
    { id: 'Hindi', label: 'हिंदी', labelEn: 'Hindi' },
    { id: 'English', label: 'अंग्रेजी', labelEn: 'English' },
    { id: 'EVS', label: 'पर्यावरण', labelEn: 'EVS' },
    { id: 'Science', label: 'विज्ञान', labelEn: 'Science' },
    { id: 'General', label: 'सामान्य', labelEn: 'General' },
];

export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8];

export const LANGUAGES = [
    { id: 'hi', label: 'हिंदी', labelEn: 'Hindi' },
    { id: 'en', label: 'English', labelEn: 'English' },
];

// Demo credentials
export const DEMO_USERS = [
    { username: 'priya', password: 'demo123', role: 'teacher', name: 'Priya Sharma' },
    { username: 'amit', password: 'demo123', role: 'crp', name: 'Amit Verma' },
    { username: 'rekha', password: 'demo123', role: 'diet', name: 'Dr. Rekha Singh' },
];
