import React, { useState } from 'react';
import {
    Code2, Play, CheckCircle, Copy, Terminal,
    Book, Zap, ArrowRight, X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './common/Button';

// SDK Demo Modal Component
export function SDKDemoModal({ isOpen, onClose }) {
    const { language, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('python');
    const [demoResult, setDemoResult] = useState(null);
    const [running, setRunning] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const pythonCode = `from sahayak_sdk import SahayakAI

# Create client
client = SahayakAI(api_key="demo-key")

# Get a teaching playbook
playbook = client.get_playbook(
    "Students not understanding fractions"
)

# Use the playbook
print(playbook.what_to_say)
print(playbook.activity.name)`;

    const jsCode = `import { SahayakAI } from './sahayak-sdk.js';

// Create client
const client = new SahayakAI({ 
    apiKey: 'demo-key' 
});

// Get a teaching playbook
const playbook = await client.getPlaybook(
    'Students not understanding fractions'
);

// Use the playbook
console.log(playbook.whatToSay);
console.log(playbook.activity.name);`;

    const mockPlaybook = {
        id: 'pb_fractions_001',
        problem: 'Students not understanding fractions',
        whatToSay: [
            language === 'hi' ? "चलो इस रोटी को बराबर भागों में बांटते हैं" :
                language === 'kn' ? "ಈ ರೊಟ್ಟಿಯನ್ನು ಸಮಾನ ಭಾಗಗಳಾಗಿ ಬೇರ್ಪಡಿಸೋಣ" :
                    "Let's divide this roti into equal parts",
            language === 'hi' ? "कागज़ को आधा मोड़ो - ये है 1/2" :
                language === 'kn' ? "ಕಾಗದವನ್ನು ಅರ್ಧವಾಗಿ ಮಡಿಸಿ - ಇದು 1/2" :
                    "Fold the paper in half - that's 1/2"
        ],
        activity: {
            name: language === 'hi' ? 'कागज़ मोड़कर भिन्न सीखना' :
                language === 'kn' ? 'ಕಾಗದ ಮಡಿಸುವ ಭಿನ್ನ ಚಟುವಟಿಕೆ' :
                    'Paper Folding Fractions',
            steps: [
                language === 'hi' ? 'प्रत्येक छात्र को कागज़ दें' :
                    language === 'kn' ? 'ಪ್ರತಿ ವಿದ್ಯಾರ್ಥಿಗೆ ಕಾಗದ ನೀಡಿ' :
                        'Give each student a piece of paper',
                language === 'hi' ? 'आधा मोड़ें - 1/2 लिखें' :
                    language === 'kn' ? 'ಅರ್ಧವಾಗಿ ಮಡಿಸಿ - 1/2 ಎಂದು ಬರೆಯಿರಿ' :
                        'Fold in half - label as 1/2'
            ],
            materials: ['Paper', 'Crayons', 'Scissors'],
            durationMinutes: 15
        },
        trustScore: 0.92
    };

    const runDemo = () => {
        setRunning(true);
        setDemoResult(null);

        setTimeout(() => {
            setDemoResult(mockPlaybook);
            setRunning(false);
        }, 1500);
    };

    const copyCode = () => {
        const code = activeTab === 'python' ? pythonCode : jsCode;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Code2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{t('sdkShowcase')}</h2>
                            <p className="text-indigo-200 text-sm">
                                {language === 'hi' ? 'SAHAYAK AI SDK का लाइव डेमो' :
                                    language === 'kn' ? 'SAHAYAK AI SDK ಲೈವ್ ಡೆಮೊ' :
                                        'Live Demo of SAHAYAK AI SDK'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Features */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <Zap size={20} className="text-blue-600 mb-2" />
                            <h4 className="font-semibold text-slate-800">
                                {language === 'hi' ? 'त्वरित एकीकरण' :
                                    language === 'kn' ? 'ತ್ವರಿತ ಏಕೀಕರಣ' :
                                        'Quick Integration'}
                            </h4>
                            <p className="text-sm text-slate-600">
                                {language === 'hi' ? '5 मिनट में सेटअप' :
                                    language === 'kn' ? '5 ನಿಮಿಷದಲ್ಲಿ ಸೆಟಪ್' :
                                        '5 min setup'}
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                            <Book size={20} className="text-green-600 mb-2" />
                            <h4 className="font-semibold text-slate-800">
                                {language === 'hi' ? 'पूर्ण दस्तावेज़' :
                                    language === 'kn' ? 'ಸಂಪೂರ್ಣ ದಾಖಲೆ' :
                                        'Full Docs'}
                            </h4>
                            <p className="text-sm text-slate-600">
                                {language === 'hi' ? 'विस्तृत API संदर्भ' :
                                    language === 'kn' ? 'ವಿವರವಾದ API ಉಲ್ಲೇಖ' :
                                        'Detailed API ref'}
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                            <Terminal size={20} className="text-purple-600 mb-2" />
                            <h4 className="font-semibold text-slate-800">
                                {language === 'hi' ? 'डेमो मोड' :
                                    language === 'kn' ? 'ಡೆಮೊ ಮೋಡ್' :
                                        'Demo Mode'}
                            </h4>
                            <p className="text-sm text-slate-600">
                                {language === 'hi' ? 'API कुंजी के बिना परीक्षण' :
                                    language === 'kn' ? 'API ಕೀ ಇಲ್ಲದೆ ಪರೀಕ್ಷೆ' :
                                        'Test without API key'}
                            </p>
                        </div>
                    </div>

                    {/* Code Tabs */}
                    <div>
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setActiveTab('python')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'python'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                🐍 Python
                            </button>
                            <button
                                onClick={() => setActiveTab('javascript')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'javascript'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                ⚡ JavaScript
                            </button>
                        </div>

                        <div className="relative">
                            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-sm">
                                <code>{activeTab === 'python' ? pythonCode : jsCode}</code>
                            </pre>
                            <button
                                onClick={copyCode}
                                className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} className="text-white" />}
                            </button>
                        </div>
                    </div>

                    {/* Run Demo */}
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={runDemo}
                            disabled={running}
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            <Play size={18} />
                            {running ? (
                                language === 'hi' ? 'चल रहा है...' :
                                    language === 'kn' ? 'ಚಾಲನೆಯಲ್ಲಿದೆ...' :
                                        'Running...'
                            ) : (
                                language === 'hi' ? 'डेमो चलाएं' :
                                    language === 'kn' ? 'ಡೆಮೊ ಚಾಲನೆ' :
                                        'Run Demo'
                            )}
                        </Button>
                        <span className="text-sm text-slate-500">
                            {language === 'hi' ? 'क्लिक करें और API प्रतिक्रिया देखें' :
                                language === 'kn' ? 'ಕ್ಲಿಕ್ ಮಾಡಿ ಮತ್ತು API ಪ್ರತಿಕ್ರಿಯೆ ನೋಡಿ' :
                                    'Click to see API response'}
                        </span>
                    </div>

                    {/* Demo Result */}
                    {demoResult && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle size={20} className="text-green-600" />
                                <h4 className="font-bold text-green-800">
                                    {language === 'hi' ? 'API प्रतिक्रिया' :
                                        language === 'kn' ? 'API ಪ್ರತಿಕ್ರಿಯೆ' :
                                            'API Response'}
                                </h4>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">playbook.whatToSay:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {demoResult.whatToSay.map((phrase, i) => (
                                            <span key={i} className="px-3 py-1 bg-white rounded-full text-sm border border-green-200">
                                                "{phrase}"
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-2">
                                    <div>
                                        <p className="text-sm text-slate-500">activity.name</p>
                                        <p className="font-medium text-slate-800">{demoResult.activity.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">trustScore</p>
                                        <p className="font-medium text-green-600">{Math.round(demoResult.trustScore * 100)}%</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">duration</p>
                                        <p className="font-medium text-slate-800">{demoResult.activity.durationMinutes} min</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-sm text-slate-500">
                            {language === 'hi' ? 'पूर्ण SDK कोड sdk/ फ़ोल्डर में उपलब्ध' :
                                language === 'kn' ? 'ಪೂರ್ಣ SDK ಕೋಡ್ sdk/ ಫೋಲ್ಡರ್‌ನಲ್ಲಿ ಲಭ್ಯ' :
                                    'Full SDK code available in sdk/ folder'}
                        </p>
                        <Button variant="secondary" onClick={onClose}>
                            {language === 'hi' ? 'बंद करें' :
                                language === 'kn' ? 'ಮುಚ್ಚು' :
                                    'Close'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// SDK Demo Button Component
export function SDKDemoButton({ className = '' }) {
    const [showModal, setShowModal] = useState(false);
    const { t } = useLanguage();

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium ${className}`}
            >
                <Code2 size={18} />
                <span>{t('trySDK')}</span>
                <ArrowRight size={16} />
            </button>
            <SDKDemoModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}

export default SDKDemoButton;
