import React, { createContext, useContext, useState, useEffect } from 'react';

// Translation strings
const translations = {
    en: {
        // Common
        appName: 'SAHAYAK AI',
        appTagline: 'Classroom Coaching',
        login: 'Login',
        logout: 'Logout',
        loading: 'Loading...',
        online: 'Online',
        offline: 'Offline',
        submit: 'Submit',
        cancel: 'Cancel',
        success: 'Success',
        error: 'Error',
        search: 'Search',
        all: 'All',

        // Login
        loginTitle: 'Login',
        demoAccounts: 'Demo Accounts:',
        teacher: 'Teacher',
        enterUsername: 'Enter username',
        enterPassword: 'Enter password',
        username: 'Username',
        password: 'Password',
        demoPassword: 'Demo password',

        // Teacher Dashboard
        sosHelp: 'SOS Help',
        quickFixes: 'Quick Fixes',
        history: 'History',
        scan: 'Scan',
        describeProblem: 'Describe Problem',
        speakOrType: 'Speak or type your problem...',
        sendSOS: 'Send SOS',
        listening: 'Listening... keep speaking',
        aiThinking: 'AI is thinking...',
        totalSOS: 'Total SOS',
        successRate: 'Success Rate',
        thisWeek: 'This Week',
        noResults: 'No results found',
        quickSolutionsAvailable: 'quick solutions available • works offline too',
        atRisk: 'At Risk',

        // Action Plan
        actionPlan: 'Action Plan',
        fromCache: 'From Cache',
        whatToSay: 'What to Say',
        activity: 'Activity',
        steps: 'Steps',
        materials: 'Materials',
        duration: 'Duration',
        minutes: 'minutes',
        classManagement: 'Class Management',
        quickCheck: 'Quick Check',
        ask: 'Ask',
        successIndicators: 'Success Indicators',
        ncertReferences: 'NCERT References',
        videoResources: 'Video Resources',
        viewAllVideos: '← View all videos',
        wasSuccessful: 'Was Successful',
        needMoreHelp: 'Need More Help',

        // Readiness Signal
        readyForClass: 'Ready for Class',
        needsSupport: 'Needs Support',

        // Scanner
        textbookScanner: 'Textbook Scanner',
        scanTextbookPage: 'Scan textbook page',
        camera: 'Camera',
        upload: 'Upload',
        scanNow: 'Scan Now',
        scanResult: 'Scan Result',
        topic: 'Topic',
        class: 'Class',
        chapter: 'Chapter',
        summary: 'Summary',
        sendSOSOnTopic: 'Send SOS on this topic',
        mockOCR: 'Demo: Mock OCR - Real OCR in production',

        // CRP Dashboard
        crpDashboard: 'CRP Dashboard',
        cluster: 'Cluster',
        overview: 'Overview',
        teachers: 'Teachers',
        issues: 'Issues',
        teacherEngagement: 'Teacher Engagement',
        categoryDistribution: 'Category Distribution',
        topIssues: 'Top Issues',
        trend: 'Trend',
        changeFromLastMonth: 'change from last month',
        school: 'School',
        status: 'Status',

        // DIET Dashboard
        dietDashboard: 'DIET Dashboard',
        district: 'District',
        learningGaps: 'Learning Gaps',
        trainingNeeds: 'Training Needs',
        difficultyTrends: 'Difficulty Trends',
        clusterPerformance: 'Cluster Performance',
        learningGapAnalysis: 'Learning Gap Analysis',
        gapScore: 'Gap Score',
        affectedSchools: 'Affected Schools',
        priority: 'Priority',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        healthScore: 'Health Score',
        clusters: 'Clusters',
        schools: 'Schools',
        failureRate: 'Failure Rate',
        recommendedTraining: 'Recommended Training',

        // Misc
        recentHistory: 'Recent History',
        noHistory: 'No history',
        scanTextbook: 'Scan Textbook',
        grade: 'Grade',
        subject: 'Subject',

        // SDK Demo
        sdkDemo: 'SDK Demo',
        trySDK: 'Try SDK',
        sdkShowcase: 'SDK Showcase',
    },
    hi: {
        // Common
        appName: 'सहायक AI',
        appTagline: 'कक्षा सहायता',
        login: 'लॉगिन',
        logout: 'लॉगआउट',
        loading: 'लोड हो रहा है...',
        online: 'ऑनलाइन',
        offline: 'ऑफ़लाइन',
        submit: 'भेजें',
        cancel: 'रद्द करें',
        success: 'सफल',
        error: 'त्रुटि',
        search: 'खोजें',
        all: 'सभी',

        // Login
        loginTitle: 'लॉगिन करें',
        demoAccounts: 'डेमो अकाउंट:',
        teacher: 'शिक्षक',
        enterUsername: 'यूज़रनेम दर्ज करें',
        enterPassword: 'पासवर्ड दर्ज करें',
        username: 'यूज़रनेम',
        password: 'पासवर्ड',
        demoPassword: 'डेमो पासवर्ड',

        // Teacher Dashboard
        sosHelp: 'SOS सहायता',
        quickFixes: 'त्वरित समाधान',
        history: 'इतिहास',
        scan: 'स्कैन',
        describeProblem: 'समस्या बताएं',
        speakOrType: 'समस्या टाइप करें या माइक बटन दबाकर बोलें...',
        sendSOS: 'SOS भेजें',
        listening: 'सुन रहा है... बोलते रहें',
        aiThinking: 'AI सोच रहा है...',
        totalSOS: 'कुल SOS',
        successRate: 'सफलता',
        thisWeek: 'इस हफ्ते',
        noResults: 'कोई परिणाम नहीं मिला',
        quickSolutionsAvailable: 'त्वरित समाधान उपलब्ध • ऑफ़लाइन भी काम करता है',
        atRisk: 'विशेष ध्यान',

        // Action Plan
        actionPlan: 'कार्य योजना',
        fromCache: 'कैश से',
        whatToSay: 'क्या बोलें',
        activity: 'गतिविधि',
        steps: 'कदम',
        materials: 'सामग्री',
        duration: 'समय',
        minutes: 'मिनट',
        classManagement: 'कक्षा प्रबंधन',
        quickCheck: 'जल्दी जांच',
        ask: 'पूछें',
        successIndicators: 'सफलता के संकेत',
        ncertReferences: 'NCERT संदर्भ',
        videoResources: 'वीडियो संसाधन',
        viewAllVideos: '← सभी वीडियो देखें',
        wasSuccessful: 'सफल रहा',
        needMoreHelp: 'और मदद चाहिए',

        // Readiness Signal
        readyForClass: 'कक्षा के लिए तैयार',
        needsSupport: 'सहायता चाहिए',

        // Scanner
        textbookScanner: 'पाठ्यपुस्तक स्कैनर',
        scanTextbookPage: 'पाठ्यपुस्तक का पृष्ठ स्कैन करें',
        camera: 'कैमरा',
        upload: 'अपलोड',
        scanNow: 'स्कैन करें',
        scanResult: 'स्कैन परिणाम',
        topic: 'विषय',
        class: 'कक्षा',
        chapter: 'अध्याय',
        summary: 'सारांश',
        sendSOSOnTopic: 'इस विषय पर SOS भेजें',
        mockOCR: 'Demo: Mock OCR - वास्तविक OCR प्रोडक्शन में',

        // CRP Dashboard
        crpDashboard: 'CRP डैशबोर्ड',
        cluster: 'क्लस्टर',
        overview: 'अवलोकन',
        teachers: 'शिक्षक',
        issues: 'मुद्दे',
        teacherEngagement: 'शिक्षक सहभागिता',
        categoryDistribution: 'विषय वितरण',
        topIssues: 'प्रमुख मुद्दे',
        trend: 'रुझान',
        changeFromLastMonth: 'पिछले महीने से बदलाव',
        school: 'विद्यालय',
        status: 'स्थिति',

        // DIET Dashboard
        dietDashboard: 'DIET डैशबोर्ड',
        district: 'जिला',
        learningGaps: 'सीखने की खामियां',
        trainingNeeds: 'प्रशिक्षण आवश्यकता',
        difficultyTrends: 'कठिनाई रुझान',
        clusterPerformance: 'क्लस्टर प्रदर्शन',
        learningGapAnalysis: 'सीखने की खामियां विश्लेषण',
        gapScore: 'Gap Score',
        affectedSchools: 'प्रभावित विद्यालय',
        priority: 'प्राथमिकता',
        high: 'उच्च',
        medium: 'मध्यम',
        low: 'निम्न',
        healthScore: 'स्वास्थ्य स्कोर',
        clusters: 'क्लस्टर',
        schools: 'विद्यालय',
        failureRate: 'विफलता दर',
        recommendedTraining: 'अनुशंसित प्रशिक्षण',

        // Misc
        recentHistory: 'हाल का इतिहास',
        noHistory: 'कोई इतिहास नहीं',
        scanTextbook: 'पुस्तक स्कैन',
        grade: 'कक्षा',
        subject: 'विषय',

        // SDK Demo
        sdkDemo: 'SDK डेमो',
        trySDK: 'SDK आज़माएं',
        sdkShowcase: 'SDK प्रदर्शन',
    },
    kn: {
        // Common - Kannada
        appName: 'ಸಹಾಯಕ AI',
        appTagline: 'ತರಗತಿ ಕೋಚಿಂಗ್',
        login: 'ಲಾಗಿನ್',
        logout: 'ಲಾಗ್ಔಟ್',
        loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        online: 'ಆನ್‌ಲೈನ್',
        offline: 'ಆಫ್‌ಲೈನ್',
        submit: 'ಸಲ್ಲಿಸು',
        cancel: 'ರದ್ದುಮಾಡು',
        success: 'ಯಶಸ್ಸು',
        error: 'ದೋಷ',
        search: 'ಹುಡುಕು',
        all: 'ಎಲ್ಲಾ',

        // Login
        loginTitle: 'ಲಾಗಿನ್ ಮಾಡಿ',
        demoAccounts: 'ಡೆಮೊ ಖಾತೆಗಳು:',
        teacher: 'ಶಿಕ್ಷಕರು',
        enterUsername: 'ಬಳಕೆದಾರ ಹೆಸರು ನಮೂದಿಸಿ',
        enterPassword: 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
        username: 'ಬಳಕೆದಾರ ಹೆಸರು',
        password: 'ಪಾಸ್‌ವರ್ಡ್',
        demoPassword: 'ಡೆಮೊ ಪಾಸ್‌ವರ್ಡ್',

        // Teacher Dashboard
        sosHelp: 'SOS ಸಹಾಯ',
        quickFixes: 'ತ್ವರಿತ ಪರಿಹಾರಗಳು',
        history: 'ಇತಿಹಾಸ',
        scan: 'ಸ್ಕ್ಯಾನ್',
        describeProblem: 'ಸಮಸ್ಯೆ ವಿವರಿಸಿ',
        speakOrType: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ...',
        sendSOS: 'SOS ಕಳುಹಿಸಿ',
        listening: 'ಕೇಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡುತ್ತಿರಿ',
        aiThinking: 'AI ಯೋಚಿಸುತ್ತಿದೆ...',
        totalSOS: 'ಒಟ್ಟು SOS',
        successRate: 'ಯಶಸ್ಸಿನ ದರ',
        thisWeek: 'ಈ ವಾರ',
        noResults: 'ಯಾವುದೇ ಫಲಿತಾಂಶ ಸಿಗಲಿಲ್ಲ',
        quickSolutionsAvailable: 'ತ್ವರಿತ ಪರಿಹಾರಗಳು ಲಭ್ಯ • ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
        atRisk: 'ಅಪಾಯದಲ್ಲಿದೆ',

        // Action Plan
        actionPlan: 'ಕ್ರಿಯಾ ಯೋಜನೆ',
        fromCache: 'ಕ್ಯಾಶ್‌ನಿಂದ',
        whatToSay: 'ಏನು ಹೇಳಬೇಕು',
        activity: 'ಚಟುವಟಿಕೆ',
        steps: 'ಹಂತಗಳು',
        materials: 'ವಸ್ತುಗಳು',
        duration: 'ಅವಧಿ',
        minutes: 'ನಿಮಿಷಗಳು',
        classManagement: 'ತರಗತಿ ನಿರ್ವಹಣೆ',
        quickCheck: 'ತ್ವರಿತ ಪರಿಶೀಲನೆ',
        ask: 'ಕೇಳಿ',
        successIndicators: 'ಯಶಸ್ಸಿನ ಸೂಚಕಗಳು',
        ncertReferences: 'NCERT ಉಲ್ಲೇಖಗಳು',
        videoResources: 'ವೀಡಿಯೊ ಸಂಪನ್ಮೂಲಗಳು',
        viewAllVideos: '← ಎಲ್ಲಾ ವೀಡಿಯೊಗಳನ್ನು ನೋಡಿ',
        wasSuccessful: 'ಯಶಸ್ವಿಯಾಗಿತ್ತು',
        needMoreHelp: 'ಹೆಚ್ಚಿನ ಸಹಾಯ ಬೇಕು',

        // Readiness Signal
        readyForClass: 'ತರಗತಿಗೆ ಸಿದ್ಧ',
        needsSupport: 'ಬೆಂಬಲ ಬೇಕು',

        // Scanner
        textbookScanner: 'ಪಠ್ಯಪುಸ್ತಕ ಸ್ಕ್ಯಾನರ್',
        scanTextbookPage: 'ಪಠ್ಯಪುಸ್ತಕ ಪುಟವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
        camera: 'ಕ್ಯಾಮೆರಾ',
        upload: 'ಅಪ್‌ಲೋಡ್',
        scanNow: 'ಈಗ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
        scanResult: 'ಸ್ಕ್ಯಾನ್ ಫಲಿತಾಂಶ',
        topic: 'ವಿಷಯ',
        class: 'ತರಗತಿ',
        chapter: 'ಅಧ್ಯಾಯ',
        summary: 'ಸಾರಾಂಶ',
        sendSOSOnTopic: 'ಈ ವಿಷಯದ ಮೇಲೆ SOS ಕಳುಹಿಸಿ',
        mockOCR: 'ಡೆಮೊ: Mock OCR - ನಿಜವಾದ OCR ಉತ್ಪಾದನೆಯಲ್ಲಿ',

        // CRP Dashboard
        crpDashboard: 'CRP ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        cluster: 'ಕ್ಲಸ್ಟರ್',
        overview: 'ಅವಲೋಕನ',
        teachers: 'ಶಿಕ್ಷಕರು',
        issues: 'ಸಮಸ್ಯೆಗಳು',
        teacherEngagement: 'ಶಿಕ್ಷಕರ ತೊಡಗುವಿಕೆ',
        categoryDistribution: 'ವರ್ಗ ವಿತರಣೆ',
        topIssues: 'ಪ್ರಮುಖ ಸಮಸ್ಯೆಗಳು',
        trend: 'ಪ್ರವೃತ್ತಿ',
        changeFromLastMonth: 'ಕಳೆದ ತಿಂಗಳಿನಿಂದ ಬದಲಾವಣೆ',
        school: 'ಶಾಲೆ',
        status: 'ಸ್ಥಿತಿ',

        // DIET Dashboard
        dietDashboard: 'DIET ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        district: 'ಜಿಲ್ಲೆ',
        learningGaps: 'ಕಲಿಕೆಯ ಅಂತರಗಳು',
        trainingNeeds: 'ತರಬೇತಿ ಅಗತ್ಯಗಳು',
        difficultyTrends: 'ಕಷ್ಟದ ಪ್ರವೃತ್ತಿಗಳು',
        clusterPerformance: 'ಕ್ಲಸ್ಟರ್ ಕಾರ್ಯಕ್ಷಮತೆ',
        learningGapAnalysis: 'ಕಲಿಕೆಯ ಅಂತರ ವಿಶ್ಲೇಷಣೆ',
        gapScore: 'ಅಂತರ ಸ್ಕೋರ್',
        affectedSchools: 'ಪ್ರಭಾವಿತ ಶಾಲೆಗಳು',
        priority: 'ಆದ್ಯತೆ',
        high: 'ಹೆಚ್ಚು',
        medium: 'ಮಧ್ಯಮ',
        low: 'ಕಡಿಮೆ',
        healthScore: 'ಆರೋಗ್ಯ ಸ್ಕೋರ್',
        clusters: 'ಕ್ಲಸ್ಟರ್‌ಗಳು',
        schools: 'ಶಾಲೆಗಳು',
        failureRate: 'ವಿಫಲತೆ ದರ',
        recommendedTraining: 'ಶಿಫಾರಸು ಮಾಡಿದ ತರಬೇತಿ',

        // Misc
        recentHistory: 'ಇತ್ತೀಚಿನ ಇತಿಹಾಸ',
        noHistory: 'ಯಾವುದೇ ಇತಿಹಾಸವಿಲ್ಲ',
        scanTextbook: 'ಪಠ್ಯಪುಸ್ತಕ ಸ್ಕ್ಯಾನ್',
        grade: 'ತರಗತಿ',
        subject: 'ವಿಷಯ',

        // SDK Demo
        sdkDemo: 'SDK ಡೆಮೊ',
        trySDK: 'SDK ಪ್ರಯತ್ನಿಸಿ',
        sdkShowcase: 'SDK ಪ್ರದರ್ಶನ',
    }
};

// Language names for display
const languageNames = {
    en: 'English',
    hi: 'हिंदी',
    kn: 'ಕನ್ನಡ'
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        // Get saved language or default to English
        const saved = localStorage.getItem('sahayak_language');
        return saved || 'en';
    });

    useEffect(() => {
        localStorage.setItem('sahayak_language', language);
    }, [language]);

    const t = (key) => {
        return translations[language]?.[key] || translations.en[key] || key;
    };

    const toggleLanguage = () => {
        // Cycle through: en -> hi -> kn -> en
        setLanguage(prev => {
            if (prev === 'en') return 'hi';
            if (prev === 'hi') return 'kn';
            return 'en';
        });
    };

    const getLanguageName = (code) => languageNames[code] || code;

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t,
        isEnglish: language === 'en',
        isHindi: language === 'hi',
        isKannada: language === 'kn',
        languageNames,
        getLanguageName,
        availableLanguages: ['en', 'hi', 'kn'],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export default LanguageContext;
