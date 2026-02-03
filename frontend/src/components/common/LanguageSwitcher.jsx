import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function LanguageSwitcher({ className = '' }) {
    const { language, setLanguage, availableLanguages, getLanguageName } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const getNextLanguage = () => {
        const currentIndex = availableLanguages.indexOf(language);
        const nextIndex = (currentIndex + 1) % availableLanguages.length;
        return availableLanguages[nextIndex];
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium ${className}`}
                title="Switch language"
            >
                <Globe size={16} className="text-primary-600" />
                <span className="text-slate-700">
                    {getLanguageName(language)}
                </span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 py-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setLanguage(lang);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors ${language === lang ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-700'
                                    }`}
                            >
                                {getLanguageName(lang)}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export function LanguageToggle({ className = '' }) {
    const { language, setLanguage, isEnglish, isHindi, isKannada } = useLanguage();

    return (
        <div className={`flex items-center bg-white/20 rounded-full p-1 backdrop-blur ${className}`}>
            <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${isEnglish
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-white/90 hover:text-white'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${isHindi
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-white/90 hover:text-white'
                    }`}
            >
                हि
            </button>
            <button
                onClick={() => setLanguage('kn')}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${isKannada
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-white/90 hover:text-white'
                    }`}
            >
                ಕ
            </button>
        </div>
    );
}

export default LanguageSwitcher;
