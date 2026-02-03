import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, BookOpen, Play, ExternalLink, ThumbsUp, ThumbsDown, Volume2, VolumeX, Pause, MessageSquare, Phone, Send, X } from 'lucide-react';
import Button from '../common/Button';
import { useSpeech } from '../../hooks/useSpeech';
import { sosAPI } from '../../services/api';

// SMS Modal Component
function SMSModal({ isOpen, onClose, playbook, language }) {
    const [phoneNumber, setPhoneNumber] = useState('+91');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);
    const [smsResult, setSmsResult] = useState(null);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        setSending(true);
        setError(null);

        try {
            const result = await sosAPI.sendSMS(
                phoneNumber,
                playbook.what_to_say?.join(' ') || playbook.problem || 'Teaching guidance',
                playbook.activity?.name,
                playbook.activity?.steps,
                language
            );

            setSmsResult(result);
            setSent(true);
        } catch (err) {
            setError(err.message || 'Failed to send SMS');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare size={20} className="text-green-600" />
                        {language === 'hi' ? 'SMS भेजें' : language === 'kn' ? 'SMS ಕಳುಹಿಸಿ' : 'Send SMS'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {sent ? (
                    <div className="text-center py-6 space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-green-700">
                                {language === 'hi' ? 'SMS भेज दिया गया!' : language === 'kn' ? 'SMS ಕಳುಹಿಸಲಾಗಿದೆ!' : 'SMS Sent!'}
                            </h4>
                            <p className="text-sm text-slate-600 mt-2">
                                {language === 'hi' ? 'फोन नंबर:' : language === 'kn' ? 'ಫೋನ್ ಸಂಖ್ಯೆ:' : 'Phone:'} {phoneNumber}
                            </p>
                            {smsResult && (
                                <p className="text-xs text-slate-500 mt-1">
                                    Message ID: {smsResult.message_id}
                                </p>
                            )}
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 text-left">
                            <p className="text-xs text-slate-500 mb-1">
                                {language === 'hi' ? 'संदेश पूर्वावलोकन:' : language === 'kn' ? 'ಸಂದೇಶ ಮುನ್ನೋಟ:' : 'Message Preview:'}
                            </p>
                            <p className="text-sm text-slate-700">{smsResult?.message_preview}</p>
                        </div>
                        <Button variant="primary" onClick={onClose} className="w-full">
                            {language === 'hi' ? 'बंद करें' : language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-slate-600">
                            {language === 'hi' 
                                ? 'यह कार्य योजना आपके फोन पर SMS के रूप में भेजी जाएगी।'
                                : language === 'kn'
                                ? 'ಈ ಕ್ರಿಯಾ ಯೋಜನೆಯನ್ನು ನಿಮ್ಮ ಫೋನ್‌ಗೆ SMS ಆಗಿ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.'
                                : 'This action plan will be sent to your phone as an SMS.'}
                        </p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {language === 'hi' ? 'फोन नंबर' : language === 'kn' ? 'ಫೋನ್ ಸಂಖ್ಯೆ' : 'Phone Number'}
                            </label>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-3">
                                <Phone size={20} className="text-slate-400" />
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="flex-1 outline-none text-lg"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                            <p className="text-xs text-slate-500 font-medium">
                                {language === 'hi' ? 'SMS में शामिल होगा:' : language === 'kn' ? 'SMS ಒಳಗೊಂಡಿದೆ:' : 'SMS will include:'}
                            </p>
                            <p className="text-sm text-slate-700">
                                📚 <strong>{playbook.activity?.name || 'Teaching Plan'}</strong>
                            </p>
                            {playbook.activity?.steps?.slice(0, 2).map((step, i) => (
                                <p key={i} className="text-xs text-slate-600 pl-4">
                                    {i + 1}. {step.substring(0, 40)}...
                                </p>
                            ))}
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={onClose} className="flex-1">
                                {language === 'hi' ? 'रद्द करें' : language === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleSend} 
                                className="flex-1"
                                disabled={sending}
                            >
                                {sending ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        {language === 'hi' ? 'भेज रहा है...' : 'Sending...'}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send size={18} />
                                        {language === 'hi' ? 'SMS भेजें' : language === 'kn' ? 'SMS ಕಳುಹಿಸಿ' : 'Send SMS'}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export function ActionPlan({ playbook, onSuccess, onClose, fromCache, language = 'hi' }) {
    const [showVideos, setShowVideos] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showSMSModal, setShowSMSModal] = useState(false);
    
    // Text-to-Speech hook
    const { speak, speakPlaybook, stop, isSpeaking, isPaused, togglePause, isSupported } = useSpeech(
        language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US'
    );

    // Auto-speak when playbook loads (optional - can be disabled)
    useEffect(() => {
        // Small delay to let the UI render first
        const timer = setTimeout(() => {
            if (playbook && isSupported) {
                speakPlaybook(playbook, language);
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            stop();
        };
    }, [playbook]);

    if (!playbook) return null;

    const handleSpeak = () => {
        if (isSpeaking) {
            stop();
        } else {
            speakPlaybook(playbook, language);
        }
    };

    // Language-specific labels
    const labels = {
        hi: {
            actionPlan: 'कार्य योजना',
            fromCache: '⚡ कैश से',
            whatToSay: '💬 क्या बोलें',
            activity: '🎯 गतिविधि',
            steps: 'कदम:',
            materials: 'सामग्री:',
            duration: 'समय:',
            minutes: 'मिनट',
            classManagement: '👥 कक्षा प्रबंधन',
            quickCheck: '✅ जल्दी जांच',
            ask: 'पूछें:',
            successIndicators: 'सफलता के संकेत:',
            ncertRefs: 'NCERT संदर्भ',
            videos: 'वीडियो संसाधन',
            backToVideos: '← सभी वीडियो देखें',
            success: 'सफल रहा',
            needMore: 'और मदद चाहिए',
            speakResponse: 'बोलें',
            stopSpeaking: 'रोकें',
            sendSMS: 'SMS भेजें',
            class: 'कक्षा',
            page: 'पृष्ठ'
        },
        kn: {
            actionPlan: 'ಕ್ರಿಯಾ ಯೋಜನೆ',
            fromCache: '⚡ ಕ್ಯಾಶ್‌ನಿಂದ',
            whatToSay: '💬 ಏನು ಹೇಳಬೇಕು',
            activity: '🎯 ಚಟುವಟಿಕೆ',
            steps: 'ಹಂತಗಳು:',
            materials: 'ಸಾಮಗ್ರಿಗಳು:',
            duration: 'ಸಮಯ:',
            minutes: 'ನಿಮಿಷಗಳು',
            classManagement: '👥 ತರಗತಿ ನಿರ್ವಹಣೆ',
            quickCheck: '✅ ತ್ವರಿತ ಪರಿಶೀಲನೆ',
            ask: 'ಕೇಳಿ:',
            successIndicators: 'ಯಶಸ್ಸಿನ ಸೂಚಕಗಳು:',
            ncertRefs: 'NCERT ಉಲ್ಲೇಖಗಳು',
            videos: 'ವೀಡಿಯೊ ಸಂಪನ್ಮೂಲಗಳು',
            backToVideos: '← ಎಲ್ಲಾ ವೀಡಿಯೊಗಳನ್ನು ನೋಡಿ',
            success: 'ಯಶಸ್ವಿಯಾಯಿತು',
            needMore: 'ಇನ್ನಷ್ಟು ಸಹಾಯ ಬೇಕು',
            speakResponse: 'ಹೇಳಿ',
            stopSpeaking: 'ನಿಲ್ಲಿಸಿ',
            sendSMS: 'SMS ಕಳುಹಿಸಿ',
            class: 'ತರಗತಿ',
            page: 'ಪುಟ'
        },
        en: {
            actionPlan: 'Action Plan',
            fromCache: '⚡ From Cache',
            whatToSay: '💬 What to Say',
            activity: '🎯 Activity',
            steps: 'Steps:',
            materials: 'Materials:',
            duration: 'Duration:',
            minutes: 'minutes',
            classManagement: '👥 Class Management',
            quickCheck: '✅ Quick Check',
            ask: 'Ask:',
            successIndicators: 'Success Indicators:',
            ncertRefs: 'NCERT References',
            videos: 'Video Resources',
            backToVideos: '← View all videos',
            success: 'It worked!',
            needMore: 'Need more help',
            speakResponse: 'Speak',
            stopSpeaking: 'Stop',
            sendSMS: 'Send SMS',
            class: 'Class',
            page: 'Page'
        }
    };

    const t = labels[language] || labels.en;

    return (
        <div className="space-y-6">
            {/* Header with Voice & SMS Controls */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl font-bold text-slate-900">{t.actionPlan}</h2>
                <div className="flex items-center gap-2">
                    {fromCache && (
                        <span className="badge-cached">{t.fromCache}</span>
                    )}
                    
                    {/* Text-to-Speech Button */}
                    {isSupported && (
                        <button
                            onClick={handleSpeak}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                                isSpeaking 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                        >
                            {isSpeaking ? (
                                <>
                                    <VolumeX size={18} />
                                    {t.stopSpeaking}
                                </>
                            ) : (
                                <>
                                    <Volume2 size={18} />
                                    {t.speakResponse}
                                </>
                            )}
                        </button>
                    )}
                    
                    {/* SMS Button */}
                    <button
                        onClick={() => setShowSMSModal(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                        <MessageSquare size={18} />
                        {t.sendSMS}
                    </button>
                </div>
            </div>

            {/* Speaking indicator */}
            {isSpeaking && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-4 bg-blue-500 rounded animate-pulse"></span>
                        <span className="w-2 h-6 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-2 h-4 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-5 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.3s'}}></span>
                    </div>
                    <span className="text-blue-700 text-sm font-medium">
                        {language === 'hi' ? 'बोल रहा है...' : language === 'kn' ? 'ಮಾತನಾಡುತ್ತಿದೆ...' : 'Speaking...'}
                    </span>
                    <button 
                        onClick={togglePause}
                        className="ml-auto p-2 hover:bg-blue-100 rounded-full"
                    >
                        {isPaused ? <Play size={18} /> : <Pause size={18} />}
                    </button>
                </div>
            )}

            {/* What to Say */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    {t.whatToSay}
                </h3>
                <ul className="space-y-2">
                    {playbook.what_to_say?.map((phrase, i) => (
                        <li key={i} className="flex items-start gap-2 text-blue-800">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-lg">"{phrase}"</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Activity */}
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    {t.activity}: {playbook.activity?.name}
                </h3>

                <div className="space-y-4">
                    {/* Steps */}
                    <div>
                        <h4 className="text-sm font-medium text-green-700 mb-2">{t.steps}</h4>
                        <ol className="space-y-2">
                            {playbook.activity?.steps?.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-green-800">
                                    <span className="w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Materials */}
                    <div>
                        <h4 className="text-sm font-medium text-green-700 mb-2">{t.materials}</h4>
                        <div className="flex flex-wrap gap-2">
                            {playbook.activity?.materials?.map((material, i) => (
                                <span key={i} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                                    {material}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="text-sm text-green-700">
                        ⏱️ {t.duration} {playbook.activity?.duration_minutes} {t.minutes}
                    </div>
                </div>
            </div>

            {/* Class Management */}
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                    {t.classManagement}
                </h3>
                <ul className="space-y-2">
                    {playbook.class_management?.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-yellow-800">
                            <span className="text-yellow-500">✓</span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Quick Check */}
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    {t.quickCheck}
                </h3>
                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-medium text-purple-700 mb-2">{t.ask}</h4>
                        <ul className="space-y-1">
                            {playbook.quick_check?.questions?.map((q, i) => (
                                <li key={i} className="text-purple-800">• {q}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-purple-700 mb-2">{t.successIndicators}</h4>
                        <ul className="space-y-1">
                            {playbook.quick_check?.success_indicators?.map((s, i) => (
                                <li key={i} className="text-purple-800 text-sm">✓ {s}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* NCERT References */}
            {playbook.ncert_refs?.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <BookOpen size={18} />
                        {t.ncertRefs}
                    </h3>
                    <div className="space-y-2">
                        {playbook.ncert_refs.map((ref, i) => (
                            <a
                                key={i}
                                href={ref.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-slate-900">{ref.chapter}</p>
                                    <p className="text-sm text-slate-500">
                                        {t.class} {ref.grade} • {ref.subject} • {t.page} {ref.page_range}
                                    </p>
                                </div>
                                <ExternalLink size={16} className="text-slate-400" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Videos */}
            {playbook.videos?.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Play size={18} />
                        {t.videos}
                    </h3>

                    {selectedVideo ? (
                        <div className="space-y-3">
                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <iframe
                                    src={selectedVideo.embed_url}
                                    title={selectedVideo.title}
                                    className="w-full h-full"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="text-sm text-primary-600 hover:underline"
                            >
                                {t.backToVideos}
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {playbook.videos.map((video, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedVideo(video)}
                                    className="flex items-center gap-4 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors text-left"
                                >
                                    <div className="w-24 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = '/placeholder-video.png'}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 line-clamp-2">{video.title}</p>
                                        <p className="text-sm text-slate-500">{video.channel} • {video.duration}</p>
                                    </div>
                                    <Play size={20} className="text-primary-500 flex-shrink-0" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Feedback Buttons */}
            <div className="flex gap-3 pt-4 border-t">
                <Button
                    variant="success"
                    size="lg"
                    className="flex-1"
                    onClick={() => onSuccess && onSuccess(true)}
                >
                    <ThumbsUp size={20} />
                    {t.success}
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => onSuccess && onSuccess(false)}
                >
                    <ThumbsDown size={20} />
                    {t.needMore}
                </Button>
            </div>

            {/* SMS Modal */}
            <SMSModal
                isOpen={showSMSModal}
                onClose={() => setShowSMSModal(false)}
                playbook={playbook}
                language={language}
            />
        </div>
    );
}

export default ActionPlan;
