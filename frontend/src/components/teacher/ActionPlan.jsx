import React, { useState } from 'react';
import { CheckCircle, XCircle, BookOpen, Play, ExternalLink, ThumbsUp, ThumbsDown, Brain, Eye, EyeOff } from 'lucide-react';
import Button from '../common/Button';
import { InteractiveMindMap, MindMapBadge } from './MindMap';

export function ActionPlan({ playbook, onSuccess, onClose, fromCache }) {
    const [showVideos, setShowVideos] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showMindMap, setShowMindMap] = useState(true); // Show by default for impact

    if (!playbook) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">कार्य योजना</h2>
                <div className="flex items-center gap-2">
                    {fromCache && (
                        <span className="badge-cached">⚡ कैश से</span>
                    )}
                    <button
                        onClick={() => setShowMindMap(!showMindMap)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            showMindMap 
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        <Brain size={16} />
                        {showMindMap ? 'Hide Map' : 'Mind Map'}
                    </button>
                </div>
            </div>

            {/* Interactive Mind Map - Show at top for maximum visibility */}
            {showMindMap && (
                <InteractiveMindMap playbook={playbook} />
            )}

            {/* What to Say */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    💬 क्या बोलें
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
                    🎯 गतिविधि: {playbook.activity?.name}
                </h3>

                <div className="space-y-4">
                    {/* Steps */}
                    <div>
                        <h4 className="text-sm font-medium text-green-700 mb-2">कदम:</h4>
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
                        <h4 className="text-sm font-medium text-green-700 mb-2">सामग्री:</h4>
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
                        ⏱️ समय: {playbook.activity?.duration_minutes} मिनट
                    </div>
                </div>
            </div>

            {/* Class Management */}
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                    👥 कक्षा प्रबंधन
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
                    ✅ जल्दी जांच
                </h3>
                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-medium text-purple-700 mb-2">पूछें:</h4>
                        <ul className="space-y-1">
                            {playbook.quick_check?.questions?.map((q, i) => (
                                <li key={i} className="text-purple-800">• {q}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-purple-700 mb-2">सफलता के संकेत:</h4>
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
                        NCERT संदर्भ
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
                                        कक्षा {ref.grade} • {ref.subject} • पृष्ठ {ref.page_range}
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
                        वीडियो संसाधन
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
                                ← सभी वीडियो देखें
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
                    सफल रहा
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => onSuccess && onSuccess(false)}
                >
                    <ThumbsDown size={20} />
                    और मदद चाहिए
                </Button>
            </div>
        </div>
    );
}

export default ActionPlan;
