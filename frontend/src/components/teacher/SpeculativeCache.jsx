/**
 * Speculative Cache Dashboard Component
 * 
 * Shows pre-loaded content for tomorrow's lessons
 * "We anticipated the challenge before you asked"
 */

import React, { useState, useEffect } from 'react';
import { 
    Sparkles, Calendar, Zap, RefreshCw, BookOpen, 
    CheckCircle, Clock, Brain, TrendingUp, Download,
    X, Play, Volume2, ChevronRight, Eye
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import speculativeCache from '../../services/speculativeCache';

// Full Day View Modal
function FullDayModal({ lessons, onClose, onTopicClick, language }) {
    const labels = {
        hi: {
            title: '📅 आज का पूरा पाठ्यक्रम',
            subtitle: 'सभी विषय और तैयारी',
            period: 'पीरियड',
            topics: 'विषय',
            clickToPrep: 'तैयारी के लिए क्लिक करें',
            materials: 'आवश्यक सामग्री',
            close: 'बंद करें'
        },
        kn: {
            title: '📅 ಇಂದಿನ ಪೂರ್ಣ ಪಠ್ಯಕ್ರಮ',
            subtitle: 'ಎಲ್ಲಾ ವಿಷಯಗಳು ಮತ್ತು ತಯಾರಿ',
            period: 'ಅವಧಿ',
            topics: 'ವಿಷಯಗಳು',
            clickToPrep: 'ತಯಾರಿಗಾಗಿ ಕ್ಲಿಕ್ ಮಾಡಿ',
            materials: 'ಅಗತ್ಯ ಸಾಮಗ್ರಿಗಳು',
            close: 'ಮುಚ್ಚಿ'
        },
        en: {
            title: '📅 Today\'s Full Curriculum',
            subtitle: 'All subjects and preparation',
            period: 'Period',
            topics: 'Topics',
            clickToPrep: 'Click to prepare',
            materials: 'Required Materials',
            close: 'Close'
        }
    };
    const t = labels[language] || labels.en;

    const getSubjectEmoji = (subject) => {
        const emojis = { maths: '🔢', science: '🔬', hindi: '📝', english: '📖', evs: '🌿' };
        return emojis[subject] || '📚';
    };

    const getMaterials = (subject) => {
        const materials = {
            maths: ['चॉक', 'पत्थर/गोलियां', 'नोटबुक'],
            science: ['चार्ट', 'मॉडल', 'प्रयोग सामग्री'],
            hindi: ['कहानी की किताब', 'चित्र कार्ड'],
            english: ['फ्लैश कार्ड', 'चित्र']
        };
        return materials[subject] || ['किताब', 'नोटबुक'];
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">{t.title}</h2>
                            <p className="text-purple-200 text-sm">{t.subtitle}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
                    {lessons.filter(l => l.isToday).map((lesson, i) => (
                        <div 
                            key={i}
                            className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl p-4 border border-purple-100"
                        >
                            {/* Subject Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-2xl">
                                    {getSubjectEmoji(lesson.subject)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-slate-800 capitalize">
                                        {lesson.subject}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Chapter {lesson.chapterNumber}: {lesson.chapter}
                                    </p>
                                </div>
                                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {t.period} {i + 1}
                                </div>
                            </div>

                            {/* Topics - Clickable */}
                            <div className="mb-3">
                                <p className="text-xs text-slate-500 mb-2">{t.topics} ({t.clickToPrep}):</p>
                                <div className="flex flex-wrap gap-2">
                                    {lesson.topics.map((topic, j) => (
                                        <button
                                            key={j}
                                            onClick={() => onTopicClick({ ...lesson, selectedTopic: topic })}
                                            className="group flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-purple-200 
                                                hover:border-purple-500 hover:bg-purple-50 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <Play size={14} className="text-purple-500 group-hover:text-purple-700" />
                                            <span className="text-sm font-medium text-slate-700">{topic}</span>
                                            <ChevronRight size={14} className="text-slate-400 group-hover:text-purple-500" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Materials */}
                            <div className="bg-white/50 rounded-lg p-2">
                                <p className="text-xs text-slate-500 mb-1">📦 {t.materials}:</p>
                                <div className="flex flex-wrap gap-1">
                                    {getMaterials(lesson.subject).map((m, j) => (
                                        <span key={j} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function SpeculativeCacheWidget({ grade = 6, onTopicSelect }) {
    const [tomorrowsLessons, setTomorrowsLessons] = useState([]);
    const [cacheStats, setCacheStats] = useState(null);
    const [prefetchedTopics, setPrefetchedTopics] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState(null);
    const [showFullDay, setShowFullDay] = useState(false);
    const { language } = useLanguage();

    const handleTopicClick = (lessonWithTopic) => {
        setShowFullDay(false);
        if (onTopicSelect) {
            onTopicSelect(lessonWithTopic);
        }
    };

    const labels = {
        hi: {
            title: '🔮 पूर्वानुमानित सामग्री',
            subtitle: 'कल के पाठ के लिए पहले से तैयार',
            tomorrowLessons: 'कल के पाठ',
            viewFullDay: '📅 पूरा दिन देखें',
            preloaded: 'पहले से लोड',
            syncNow: 'अभी सिंक करें',
            syncing: 'सिंक हो रहा है...',
            lastSynced: 'अंतिम सिंक',
            topics: 'विषय',
            confidence: 'संभावना',
            readyForClass: 'कक्षा के लिए तैयार',
            cached: 'कैश में',
            knowledgeSeeds: 'ज्ञान बीज',
            anticipatedChallenges: 'अनुमानित चुनौतियां'
        },
        kn: {
            title: '🔮 ಊಹಾತ್ಮಕ ವಿಷಯ',
            subtitle: 'ನಾಳಿನ ಪಾಠಕ್ಕೆ ಮೊದಲೇ ಸಿದ್ಧ',
            tomorrowLessons: 'ನಾಳಿನ ಪಾಠಗಳು',
            viewFullDay: '📅 ಪೂರ್ಣ ದಿನ ನೋಡಿ',
            preloaded: 'ಮೊದಲೇ ಲೋಡ್',
            syncNow: 'ಈಗ ಸಿಂಕ್ ಮಾಡಿ',
            syncing: 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...',
            lastSynced: 'ಕೊನೆಯ ಸಿಂಕ್',
            topics: 'ವಿಷಯಗಳು',
            confidence: 'ಸಂಭವನೀಯತೆ',
            readyForClass: 'ತರಗತಿಗೆ ಸಿದ್ಧ',
            cached: 'ಕ್ಯಾಶ್‌ನಲ್ಲಿ',
            knowledgeSeeds: 'ಜ್ಞಾನ ಬೀಜಗಳು',
            anticipatedChallenges: 'ನಿರೀಕ್ಷಿತ ಸವಾಲುಗಳು'
        },
        en: {
            title: '🔮 Anticipatory Content',
            subtitle: 'Pre-loaded for tomorrow\'s lessons',
            tomorrowLessons: 'Tomorrow\'s Lessons',
            viewFullDay: '📅 View Full Day',
            preloaded: 'Pre-loaded',
            syncNow: 'Sync Now',
            syncing: 'Syncing...',
            lastSynced: 'Last synced',
            topics: 'Topics',
            confidence: 'Confidence',
            readyForClass: 'Ready for class',
            cached: 'Cached',
            knowledgeSeeds: 'Knowledge Seeds',
            anticipatedChallenges: 'Anticipated Challenges'
        }
    };

    const t = labels[language] || labels.en;

    useEffect(() => {
        loadCacheData();
    }, [grade]);

    const loadCacheData = async () => {
        try {
            // Get tomorrow's lessons from curriculum
            const lessons = speculativeCache.getTomorrowsLessons(grade);
            setTomorrowsLessons(lessons);

            // Get cache statistics
            const stats = await speculativeCache.getCacheStats();
            setCacheStats(stats);

            // Get prefetched topics
            const prefetched = await speculativeCache.getPrefetchedTopics();
            setPrefetchedTopics(prefetched.topics || []);
            setLastSync(prefetched.lastSync);
        } catch (error) {
            console.error('Error loading cache data:', error);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await speculativeCache.runSpeculativePrefetch(grade, language);
            await loadCacheData();
        } catch (error) {
            console.error('Sync error:', error);
        }
        setIsSyncing(false);
    };

    const formatTime = (isoString) => {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleTimeString(language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSubjectEmoji = (subject) => {
        const emojis = {
            maths: '🔢',
            science: '🔬',
            hindi: '📝',
            english: '📖',
            evs: '🌿'
        };
        return emojis[subject] || '📚';
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8) return 'text-green-600 bg-green-100';
        if (confidence >= 0.5) return 'text-yellow-600 bg-yellow-100';
        return 'text-slate-600 bg-slate-100';
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-5 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-purple-900">{t.title}</h3>
                        <p className="text-sm text-purple-600">{t.subtitle}</p>
                    </div>
                </div>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        isSyncing 
                            ? 'bg-purple-200 text-purple-400 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                    }`}
                >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? t.syncing : t.syncNow}
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/70 rounded-xl p-3 text-center border border-purple-100">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                        <Brain className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-bold text-purple-700">{cacheStats?.totalPlaybooks || 0}</p>
                    <p className="text-xs text-purple-500">{t.preloaded}</p>
                </div>
                <div className="bg-white/70 rounded-xl p-3 text-center border border-purple-100">
                    <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
                        <Zap className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-bold text-indigo-700">{cacheStats?.totalSeeds || 0}</p>
                    <p className="text-xs text-indigo-500">{t.knowledgeSeeds}</p>
                </div>
                <div className="bg-white/70 rounded-xl p-3 text-center border border-purple-100">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-bold text-blue-700">{formatTime(lastSync)}</p>
                    <p className="text-xs text-blue-500">{t.lastSynced}</p>
                </div>
            </div>

            {/* Tomorrow's Lessons */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="flex items-center gap-2 font-semibold text-purple-800">
                        <Calendar className="w-4 h-4" />
                        {t.tomorrowLessons}
                    </h4>
                    <button
                        onClick={() => setShowFullDay(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 
                            text-white text-sm font-medium rounded-lg shadow hover:shadow-md transition-all"
                    >
                        <Eye className="w-4 h-4" />
                        {t.viewFullDay || '📅 View Full Day'}
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {tomorrowsLessons.filter(l => l.isToday).slice(0, 4).map((lesson, i) => (
                        <div 
                            key={i}
                            onClick={() => handleTopicClick({ ...lesson, selectedTopic: lesson.topics[0] })}
                            className="bg-white rounded-xl p-3 border border-purple-100 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{getSubjectEmoji(lesson.subject)}</span>
                                <span className="font-medium text-slate-800 capitalize text-sm">
                                    {lesson.subject}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mb-2 line-clamp-1">
                                Ch {lesson.chapterNumber}: {lesson.chapter}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {lesson.topics.slice(0, 2).map((topic, j) => (
                                    <span 
                                        key={j}
                                        className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full"
                                    >
                                        {topic}
                                    </span>
                                ))}
                                {lesson.topics.length > 2 && (
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                                        +{lesson.topics.length - 2}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pre-fetched Topics */}
            {prefetchedTopics.length > 0 && (
                <div>
                    <h4 className="flex items-center gap-2 font-semibold text-purple-800 mb-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {t.anticipatedChallenges}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {prefetchedTopics.slice(0, 8).map((topic, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${getConfidenceColor(topic.confidence)}`}
                            >
                                <CheckCircle className="w-3 h-3" />
                                <span className="font-medium">{topic.topic}</span>
                                <span className="opacity-60 text-xs">
                                    {Math.round((topic.confidence || 0.7) * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pitch Line */}
            <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-center text-sm text-purple-600 italic flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {language === 'hi' 
                        ? '"हम शिक्षक के असफल होने का इंतज़ार नहीं करते; हम पाठ्यक्रम के आधार पर चुनौती का अनुमान लगाते हैं।"'
                        : language === 'kn'
                        ? '"ನಾವು ಶಿಕ್ಷಕರು ವಿಫಲರಾಗಲು ಕಾಯುವುದಿಲ್ಲ; ಪಠ್ಯಕ್ರಮದ ಆಧಾರದ ಮೇಲೆ ಸವಾಲನ್ನು ನಿರೀಕ್ಷಿಸುತ್ತೇವೆ."'
                        : '"We don\'t wait for the teacher to fail; we anticipate the challenge based on the curriculum."'
                    }
                </p>
            </div>

            {/* Full Day Modal */}
            {showFullDay && (
                <FullDayModal
                    lessons={tomorrowsLessons}
                    onClose={() => setShowFullDay(false)}
                    onTopicClick={handleTopicClick}
                    language={language}
                />
            )}
        </div>
    );
}

/**
 * Compact version for sidebar/quick view
 */
export function SpeculativeCacheBadge({ onClick }) {
    const [cached, setCached] = useState(0);
    const { language } = useLanguage();

    useEffect(() => {
        speculativeCache.getCacheStats().then(stats => {
            setCached(stats?.totalPlaybooks || 0);
        });
    }, []);

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl hover:from-purple-200 hover:to-indigo-200 transition-all border border-purple-200"
        >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
                {cached} {language === 'hi' ? 'पूर्व-लोड' : language === 'kn' ? 'ಪೂರ್ವ-ಲೋಡ್' : 'Pre-loaded'}
            </span>
        </button>
    );
}

export default SpeculativeCacheWidget;
