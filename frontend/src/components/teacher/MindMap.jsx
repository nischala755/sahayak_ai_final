/**
 * Interactive Mind Map Component
 * 
 * Generates visual mind maps from SOS playbook responses
 * Makes learning concepts visually connected and interactive
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
    Brain, Zap, BookOpen, Users, CheckCircle, 
    ChevronDown, ChevronUp, Sparkles, Target,
    Lightbulb, ArrowRight, Play, Volume2
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Generate mind map data from playbook
function generateMindMapFromPlaybook(playbook, language = 'hi') {
    if (!playbook) return null;

    const labels = {
        hi: {
            problem: 'समस्या',
            solution: 'समाधान',
            activity: 'गतिविधि',
            steps: 'कदम',
            materials: 'सामग्री',
            whatToSay: 'क्या कहें',
            classManagement: 'कक्षा प्रबंधन',
            quickCheck: 'त्वरित जांच',
            tips: 'सुझाव'
        },
        kn: {
            problem: 'ಸಮಸ್ಯೆ',
            solution: 'ಪರಿಹಾರ',
            activity: 'ಚಟುವಟಿಕೆ',
            steps: 'ಹಂತಗಳು',
            materials: 'ಸಾಮಗ್ರಿಗಳು',
            whatToSay: 'ಏನು ಹೇಳಬೇಕು',
            classManagement: 'ತರಗತಿ ನಿರ್ವಹಣೆ',
            quickCheck: 'ತ್ವರಿತ ಪರಿಶೀಲನೆ',
            tips: 'ಸಲಹೆಗಳು'
        },
        en: {
            problem: 'Problem',
            solution: 'Solution',
            activity: 'Activity',
            steps: 'Steps',
            materials: 'Materials',
            whatToSay: 'What to Say',
            classManagement: 'Class Management',
            quickCheck: 'Quick Check',
            tips: 'Tips'
        }
    };

    const l = labels[language] || labels.en;

    return {
        center: {
            label: playbook.problem || 'Teaching Challenge',
            icon: '🎯',
            color: 'bg-red-500'
        },
        branches: [
            {
                id: 'what-to-say',
                label: l.whatToSay,
                icon: '💬',
                color: 'bg-blue-500',
                items: playbook.what_to_say || [],
                expanded: true
            },
            {
                id: 'activity',
                label: l.activity,
                icon: '🎮',
                color: 'bg-green-500',
                items: playbook.activity?.steps || [],
                subInfo: {
                    name: playbook.activity?.name,
                    duration: playbook.activity?.duration_minutes,
                    materials: playbook.activity?.materials || []
                },
                expanded: false
            },
            {
                id: 'class-management',
                label: l.classManagement,
                icon: '👥',
                color: 'bg-purple-500',
                items: playbook.class_management || [],
                expanded: false
            },
            {
                id: 'quick-check',
                label: l.quickCheck,
                icon: '✅',
                color: 'bg-orange-500',
                items: playbook.quick_check?.questions || [],
                subInfo: {
                    indicators: playbook.quick_check?.success_indicators || []
                },
                expanded: false
            }
        ]
    };
}

// Animated connection line
function ConnectionLine({ from, to, color, animated = true }) {
    return (
        <div className={`absolute h-0.5 ${color} origin-left transition-all duration-500 ${animated ? 'animate-pulse' : ''}`}
            style={{
                left: from.x,
                top: from.y,
                width: Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)),
                transform: `rotate(${Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI}deg)`
            }}
        />
    );
}

// Mind Map Branch Component
function MindMapBranch({ branch, index, onToggle, onSpeak }) {
    const [isHovered, setIsHovered] = useState(false);
    const angle = (index * 90) - 45; // Distribute around center
    
    return (
        <div 
            className={`relative transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Branch Header */}
            <button
                onClick={() => onToggle(branch.id)}
                className={`${branch.color} text-white px-4 py-2 rounded-full shadow-lg 
                    flex items-center gap-2 hover:shadow-xl transition-all duration-300
                    ${branch.expanded ? 'ring-4 ring-white ring-opacity-50' : ''}`}
            >
                <span className="text-lg">{branch.icon}</span>
                <span className="font-medium text-sm">{branch.label}</span>
                {branch.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Expanded Items */}
            {branch.expanded && branch.items.length > 0 && (
                <div className="mt-2 ml-4 space-y-2 animate-fadeIn">
                    {branch.items.map((item, i) => (
                        <div 
                            key={i}
                            className="flex items-start gap-2 bg-white rounded-lg p-3 shadow-md 
                                border-l-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                            style={{ borderColor: branch.color.replace('bg-', '').includes('500') ? 
                                `var(--${branch.color.replace('bg-', '').replace('-500', '')})` : '#3b82f6' }}
                            onClick={() => onSpeak(item)}
                        >
                            <ArrowRight size={14} className="mt-1 text-gray-400 group-hover:text-gray-600" />
                            <p className="text-sm text-gray-700 flex-1">{item}</p>
                            <Volume2 size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                    ))}
                    
                    {/* Sub-info for activity */}
                    {branch.subInfo?.materials?.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-2">
                            <p className="text-xs text-gray-500 font-medium mb-1">📦 Materials:</p>
                            <div className="flex flex-wrap gap-1">
                                {branch.subInfo.materials.map((m, i) => (
                                    <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Success indicators for quick check */}
                    {branch.subInfo?.indicators?.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-3 mt-2">
                            <p className="text-xs text-green-600 font-medium mb-1">✨ Success Signs:</p>
                            {branch.subInfo.indicators.map((ind, i) => (
                                <p key={i} className="text-xs text-green-700 flex items-center gap-1">
                                    <CheckCircle size={12} /> {ind}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Main Interactive Mind Map Component
export function InteractiveMindMap({ playbook, onClose }) {
    const [mindMapData, setMindMapData] = useState(null);
    const [expandedBranches, setExpandedBranches] = useState({ 'what-to-say': true });
    const [speaking, setSpeaking] = useState(false);
    const { language, t } = useLanguage();

    const labels = {
        hi: {
            title: '🧠 इंटरैक्टिव माइंड मैप',
            subtitle: 'विषय को देखें और समझें',
            tapToExpand: 'विस्तार के लिए टैप करें',
            tapToSpeak: 'सुनने के लिए टैप करें',
            close: 'बंद करें',
            trustScore: 'विश्वास स्कोर'
        },
        kn: {
            title: '🧠 ಸಂವಾದಾತ್ಮಕ ಮೈಂಡ್ ಮ್ಯಾಪ್',
            subtitle: 'ವಿಷಯವನ್ನು ನೋಡಿ ಮತ್ತು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',
            tapToExpand: 'ವಿಸ್ತರಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
            tapToSpeak: 'ಕೇಳಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
            close: 'ಮುಚ್ಚಿ',
            trustScore: 'ವಿಶ್ವಾಸ ಸ್ಕೋರ್'
        },
        en: {
            title: '🧠 Interactive Mind Map',
            subtitle: 'Visualize and understand the topic',
            tapToExpand: 'Tap to expand',
            tapToSpeak: 'Tap to listen',
            close: 'Close',
            trustScore: 'Trust Score'
        }
    };

    const l = labels[language] || labels.en;

    useEffect(() => {
        if (playbook) {
            setMindMapData(generateMindMapFromPlaybook(playbook, language));
        }
    }, [playbook, language]);

    const toggleBranch = (branchId) => {
        setExpandedBranches(prev => ({
            ...prev,
            [branchId]: !prev[branchId]
        }));
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US';
            utterance.rate = 0.9;
            setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    if (!mindMapData) return null;

    // Update expanded state in branches
    const branchesWithState = mindMapData.branches.map(b => ({
        ...b,
        expanded: expandedBranches[b.id] || false
    }));

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 shadow-xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Brain className="text-purple-500" size={24} />
                        {l.title}
                    </h3>
                    <p className="text-sm text-slate-500">{l.tapToExpand} • {l.tapToSpeak}</p>
                </div>
                {playbook.trust_score && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        <Target size={16} />
                        <span className="text-sm font-medium">
                            {l.trustScore}: {Math.round(playbook.trust_score * 100)}%
                        </span>
                    </div>
                )}
            </div>

            {/* Center Problem Node */}
            <div className="flex justify-center mb-8">
                <div className={`${mindMapData.center.color} text-white px-6 py-4 rounded-2xl shadow-lg 
                    max-w-md text-center transform hover:scale-105 transition-all duration-300`}>
                    <span className="text-2xl mb-2 block">{mindMapData.center.icon}</span>
                    <p className="font-bold text-lg">{mindMapData.center.label}</p>
                </div>
            </div>

            {/* Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branchesWithState.map((branch, index) => (
                    <MindMapBranch
                        key={branch.id}
                        branch={branch}
                        index={index}
                        onToggle={toggleBranch}
                        onSpeak={speakText}
                    />
                ))}
            </div>

            {/* Speaking indicator */}
            {speaking && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 
                    bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50">
                    <Volume2 size={18} className="animate-pulse" />
                    <span className="text-sm">Speaking...</span>
                </div>
            )}
        </div>
    );
}

// Compact Mind Map Badge for showing in results
export function MindMapBadge({ onClick }) {
    const { language } = useLanguage();
    
    const labels = {
        hi: 'माइंड मैप देखें',
        kn: 'ಮೈಂಡ್ ಮ್ಯಾಪ್ ನೋಡಿ',
        en: 'View Mind Map'
    };

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 
                text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl 
                transform hover:scale-105 transition-all duration-300"
        >
            <Brain size={18} />
            <span className="font-medium text-sm">{labels[language] || labels.en}</span>
            <Sparkles size={14} className="animate-pulse" />
        </button>
    );
}

export default InteractiveMindMap;
