import React, { useState, useEffect } from 'react';
import {
    LogOut, BookOpen, Scan, Share2, History,
    ChevronRight, Zap, Clock
} from 'lucide-react';
import { sosAPI, dashboardAPI } from '../services/api';
import { quickFixesCache } from '../services/offlineStorage';
import useOffline from '../hooks/useOffline';
import useCache from '../hooks/useCache';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from '../components/common/LanguageSwitcher';
import { OfflineBadge, OnlineIndicator } from '../components/common/OfflineBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Card, DashboardWidget } from '../components/common/Card';
import VoiceInput from '../components/common/VoiceInput';
import { ReadinessCard } from '../components/teacher/ReadinessSignal';
import QuickFixes from '../components/teacher/QuickFixes';
import ActionPlan from '../components/teacher/ActionPlan';
import TextbookScanner from '../components/teacher/TextbookScanner';
import { SpeculativeCacheWidget } from '../components/teacher/SpeculativeCache';

export function TeacherDashboard({ user, onLogout }) {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sos');
    const [sosResponse, setSosResponse] = useState(null);
    const [processingsos, setProcessingSos] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const { isOffline } = useOffline();
    const { quickFixes, loading: fixesLoading, fromCache: fixesFromCache } = useCache();
    const { t, language } = useLanguage();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await dashboardAPI.getTeacher();
            setDashboardData(data);
        } catch (error) {
            console.error('Dashboard load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSosSubmit = async (text) => {
        setProcessingSos(true);
        setSosResponse(null);

        try {
            // Pass the selected language to ensure response is in correct language
            const response = await sosAPI.submit(text, null, language);
            setSosResponse(response);
        } catch (error) {
            console.error('SOS error:', error);
            alert(t('error') + ': ' + (error.message || 'SOS submission failed'));
        } finally {
            setProcessingSos(false);
        }
    };

    const handleQuickFixSelect = (fix) => {
        setSosResponse({
            sos_id: `qf_${fix.id}`,
            extracted_context: {
                grade: fix.grade,
                subject: fix.subject,
                topic: fix.topic,
                language: language
            },
            playbook: {
                problem: fix.problem,
                what_to_say: fix.what_to_say || [],
                activity: {
                    name: fix.activity || 'Quick Fix Activity',
                    steps: ['Apply the quick fix', 'Observe student response', 'Adjust as needed'],
                    materials: ['Available materials'],
                    duration_minutes: 10
                },
                class_management: ['Use attention signals', 'Praise participation'],
                quick_check: {
                    questions: ['Did students understand?'],
                    expected_responses: ['Yes'],
                    success_indicators: ['Active participation']
                },
                trust_score: fix.success_rate,
                from_quick_fix: true
            },
            from_cache: true
        });
        setActiveTab('sos');
    };

    const handleScanResult = (result) => {
        handleSosSubmit(`${result.topic} - ${result.summary}`);
    };

    const handleFeedback = async (success) => {
        if (sosResponse?.sos_id) {
            try {
                await sosAPI.markSuccess(sosResponse.sos_id, success);
                loadDashboard();
            } catch (error) {
                console.error('Feedback error:', error);
            }
        }
        setSosResponse(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
                <div className="max-w-lg mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-xl">👩‍🏫</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-slate-900">{user.name}</h1>
                                <p className="text-xs text-slate-500">{user.school}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageToggle />
                            <OfflineBadge />
                            <button
                                onClick={onLogout}
                                className="p-2 text-slate-400 hover:text-slate-600"
                                title={t('logout')}
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
                {/* Readiness Signal */}
                {dashboardData && (
                    <ReadinessCard
                        status={dashboardData.readiness_signal}
                        message={dashboardData.readiness_message}
                    />
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <Card className="text-center">
                        <p className="text-2xl font-bold text-primary-600">
                            {dashboardData?.stats?.total_sos || 0}
                        </p>
                        <p className="text-xs text-slate-500">{t('totalSOS')}</p>
                    </Card>
                    <Card className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {Math.round((dashboardData?.stats?.success_rate || 0) * 100)}%
                        </p>
                        <p className="text-xs text-slate-500">{t('successRate')}</p>
                    </Card>
                    <Card className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                            {dashboardData?.stats?.this_week || 0}
                        </p>
                        <p className="text-xs text-slate-500">{t('thisWeek')}</p>
                    </Card>
                </div>

                {/* Speculative Knowledge Distillation - Pre-loaded Content */}
                <SpeculativeCacheWidget 
                    grade={user?.grade || 6} 
                    onTopicSelect={(topic) => handleSosSubmit(`Help with ${topic.topic} for class ${topic.grade}`)}
                />

                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-200 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'sos', label: `🆘 ${t('sosHelp')}` },
                        { id: 'fixes', label: `⚡ ${t('quickFixes')}` },
                        { id: 'history', label: `📜 ${t('history')}` },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'sos' && (
                    <div className="space-y-6">
                        {sosResponse ? (
                            <ActionPlan
                                playbook={sosResponse.playbook}
                                fromCache={sosResponse.from_cache}
                                onSuccess={handleFeedback}
                                onClose={() => setSosResponse(null)}
                            />
                        ) : processingsos ? (
                            <div className="py-12 text-center">
                                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                                <p className="text-slate-600">{t('aiThinking')}</p>
                            </div>
                        ) : (
                            <>
                                <DashboardWidget title={t('describeProblem')} icon={<span>🗣️</span>}>
                                    <VoiceInput
                                        onTranscript={handleSosSubmit}
                                        placeholder={t('speakOrType')}
                                        language={language === 'hi' ? 'hi-IN' : 'en-US'}
                                    />
                                </DashboardWidget>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        onClick={() => setShowScanner(true)}
                                        className="flex-col h-auto py-4"
                                    >
                                        <Scan size={24} className="mb-2" />
                                        <span>{t('scanTextbook')}</span>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        onClick={() => setActiveTab('fixes')}
                                        className="flex-col h-auto py-4"
                                    >
                                        <Zap size={24} className="mb-2" />
                                        <span>{t('quickFixes')}</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'fixes' && (
                    <DashboardWidget
                        title={t('quickFixes')}
                        icon={<Zap size={18} />}
                        action={
                            fixesFromCache && (
                                <span className="badge-cached">{t('offline')}</span>
                            )
                        }
                    >
                        <QuickFixes
                            fixes={quickFixes}
                            loading={fixesLoading}
                            onSelect={handleQuickFixSelect}
                        />
                    </DashboardWidget>
                )}

                {activeTab === 'history' && (
                    <DashboardWidget title={t('recentHistory')} icon={<History size={18} />}>
                        <div className="space-y-3">
                            {dashboardData?.recent_sos?.length > 0 ? (
                                dashboardData.recent_sos.map((sos, i) => (
                                    <div
                                        key={i}
                                        className="p-3 bg-slate-50 rounded-xl flex items-center justify-between"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {sos.request_text}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                <Clock size={12} />
                                                <span>{new Date(sos.created_at).toLocaleDateString()}</span>
                                                {sos.from_cache && <span className="badge-cached">{t('fromCache')}</span>}
                                                {sos.success === true && (
                                                    <span className="text-green-600">✓ {t('success')}</span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-400" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-500 py-8">
                                    {t('noHistory')}
                                </p>
                            )}
                        </div>
                    </DashboardWidget>
                )}
            </main>

            {showScanner && (
                <TextbookScanner
                    onScan={handleScanResult}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40">
                <div className="max-w-lg mx-auto flex justify-around">
                    <button
                        onClick={() => setActiveTab('sos')}
                        className={`nav-item flex-1 ${activeTab === 'sos' ? 'active' : ''}`}
                    >
                        <span className="text-2xl">🆘</span>
                        <span className="text-xs mt-1">SOS</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('fixes')}
                        className={`nav-item flex-1 ${activeTab === 'fixes' ? 'active' : ''}`}
                    >
                        <Zap size={24} />
                        <span className="text-xs mt-1">{t('quickFixes')}</span>
                    </button>
                    <button
                        onClick={() => setShowScanner(true)}
                        className="nav-item flex-1"
                    >
                        <Scan size={24} />
                        <span className="text-xs mt-1">{t('scan')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`nav-item flex-1 ${activeTab === 'history' ? 'active' : ''}`}
                    >
                        <History size={24} />
                        <span className="text-xs mt-1">{t('history')}</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default TeacherDashboard;
