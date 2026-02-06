import React, { useState, useEffect } from 'react';
import {
    LogOut, Users, TrendingUp, AlertTriangle, ChevronRight,
    Calendar, Send, Flag, Eye, Clock, CheckCircle2,
    Lightbulb, Bell, XCircle, RefreshCw
} from 'lucide-react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid
} from 'recharts';
import { dashboardAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from '../components/common/LanguageSwitcher';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card, DashboardWidget } from '../components/common/Card';
import Button from '../components/common/Button';
import { READINESS_CONFIG } from '../utils/constants';

export function CRPDashboard({ user, onLogout }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState('overview');
    const [refreshing, setRefreshing] = useState(false);
    const { t, language } = useLanguage();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await dashboardAPI.getCRP();
            // Add enhanced mock data for demo
            setData({
                ...response,
                // AI-generated insights
                ai_insights: {
                    weekly_summary: language === 'hi'
                        ? "इस सप्ताह भिन्न और गिनती में सबसे अधिक समस्याएं देखी गईं। 3 शिक्षकों को तत्काल सहायता की आवश्यकता है।"
                        : "This week, Fractions and Counting had the most issues. 3 teachers need immediate support.",
                    focus_areas: [
                        { topic: 'Fractions', urgency: 'high', teachers: 4 },
                        { topic: 'Place Value', urgency: 'medium', teachers: 3 },
                        { topic: 'Reading Comprehension', urgency: 'low', teachers: 2 }
                    ],
                    success_story: language === 'hi'
                        ? "प्रिया शर्मा ने पिछले सप्ताह 100% सफलता दर हासिल की!"
                        : "Priya Sharma achieved 100% success rate last week!"
                },
                // Alerts
                alerts: [
                    {
                        type: 'inactive',
                        teacher: 'Anita Kumari',
                        school: 'GPS Rampur',
                        days: 5,
                        message: language === 'hi' ? '5 दिनों से निष्क्रिय' : 'Inactive for 5 days'
                    },
                    {
                        type: 'struggling',
                        teacher: 'Rajesh Singh',
                        school: 'GPS Lakhanpur',
                        message: language === 'hi' ? 'भिन्न में बार-बार असफलता' : 'Repeated failures in Fractions'
                    },
                    {
                        type: 'low_rate',
                        teacher: 'Meena Devi',
                        school: 'GPS Sundarpur',
                        rate: 45,
                        message: language === 'hi' ? 'सफलता दर 45% से कम' : 'Success rate below 45%'
                    }
                ],
                // Interventions
                interventions: [
                    { id: 1, teacher: 'Anita Kumari', school: 'GPS Rampur', issue: 'Fractions', priority: 'high', lastVisit: '3 days ago', status: 'pending' },
                    { id: 2, teacher: 'Rajesh Singh', school: 'GPS Lakhanpur', issue: 'Place Value', priority: 'medium', lastVisit: '1 week ago', status: 'scheduled' },
                    { id: 3, teacher: 'Meena Devi', school: 'GPS Sundarpur', issue: 'Reading', priority: 'low', lastVisit: '2 weeks ago', status: 'completed' }
                ],
                // Weekly trend data
                weekly_trend: [
                    { day: 'Mon', sos: 12, success: 9 },
                    { day: 'Tue', sos: 15, success: 12 },
                    { day: 'Wed', sos: 8, success: 7 },
                    { day: 'Thu', sos: 18, success: 14 },
                    { day: 'Fri', sos: 22, success: 18 },
                    { day: 'Sat', sos: 5, success: 4 }
                ]
            });
        } catch (error) {
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadDashboard();
        setRefreshing(false);
    };

    const handleAction = (action, teacher) => {
        // Mock action handling
        alert(`${action} for ${teacher}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-yellow-600" />;
            case 'scheduled': return <Calendar size={16} className="text-blue-600" />;
            case 'completed': return <CheckCircle2 size={16} className="text-green-600" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white shadow-lg">
                <div className="max-w-5xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-primary-200 text-sm mb-1">
                                <span className="font-medium">{t('crpDashboard')}</span>
                                <span>•</span>
                                <span>{data?.cluster} {t('cluster')}</span>
                            </div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                className={`p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all ${refreshing ? 'animate-spin' : ''}`}
                                disabled={refreshing}
                            >
                                <RefreshCw size={18} />
                            </button>
                            <LanguageToggle />
                            <button
                                onClick={onLogout}
                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                title={t('logout')}
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Stats overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
                            <p className="text-3xl font-bold">{data?.stats?.total_teachers || 0}</p>
                            <p className="text-sm text-primary-200">{t('teachers')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
                            <p className="text-3xl font-bold">{data?.stats?.total_sos || 0}</p>
                            <p className="text-sm text-primary-200">{t('totalSOS')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
                            <p className="text-3xl font-bold">
                                {Math.round((data?.stats?.overall_success_rate || 0) * 100)}%
                            </p>
                            <p className="text-sm text-primary-200">{t('successRate')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
                            <p className="text-3xl font-bold text-red-300">
                                {data?.stats?.at_risk_teachers || 0}
                            </p>
                            <p className="text-sm text-primary-200">{t('atRisk')}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                {/* Navigation tabs */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {[
                        { id: 'overview', label: `📊 ${t('overview')}`, icon: <TrendingUp size={16} /> },
                        { id: 'interventions', label: `🎯 ${language === 'hi' ? 'हस्तक्षेप' : 'Interventions'}` },
                        { id: 'teachers', label: `👨‍🏫 ${t('teachers')}` },
                        { id: 'visit-planner', label: `🗺️ ${language === 'hi' ? 'विज़िट प्लानर' : 'Visit Planner'}` },
                        { id: 'insights', label: `💡 ${language === 'hi' ? 'AI अंतर्दृष्टि' : 'AI Insights'}` },
                        { id: 'alerts', label: `🔔 ${language === 'hi' ? 'अलर्ट' : 'Alerts'} (${data?.alerts?.length || 0})` },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedView(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedView === tab.id
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {selectedView === 'overview' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Weekly Trend */}
                        <DashboardWidget
                            title={language === 'hi' ? 'साप्ताहिक रुझान' : 'Weekly Trend'}
                            icon={<TrendingUp size={18} />}
                        >
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data?.weekly_trend || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="sos" stroke="#3b82f6" strokeWidth={2} name="SOS" />
                                        <Line type="monotone" dataKey="success" stroke="#22c55e" strokeWidth={2} name={t('success')} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </DashboardWidget>

                        {/* Category Distribution */}
                        <DashboardWidget title={t('categoryDistribution')} icon={<TrendingUp size={18} />}>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data?.category_distribution || []}
                                            dataKey="count"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label={({ category, percentage }) => `${category} ${percentage}%`}
                                        >
                                            {(data?.category_distribution || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </DashboardWidget>

                        {/* Top Issues */}
                        <DashboardWidget title={t('topIssues')} icon={<AlertTriangle size={18} />} className="md:col-span-2">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={(data?.top_issues || []).slice(0, 5)}
                                        layout="vertical"
                                        margin={{ left: 100 }}
                                    >
                                        <XAxis type="number" />
                                        <YAxis dataKey="topic" type="category" width={100} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {/* Interventions Tab */}
                {selectedView === 'interventions' && (
                    <DashboardWidget
                        title={language === 'hi' ? 'शिक्षक हस्तक्षेप' : 'Teacher Interventions'}
                        icon={<Flag size={18} />}
                    >
                        <div className="space-y-4">
                            {(data?.interventions || []).map((intervention) => (
                                <div
                                    key={intervention.id}
                                    className={`p-4 rounded-xl border-2 ${getPriorityStyle(intervention.priority)}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold">{intervention.teacher}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${intervention.priority === 'high' ? 'bg-red-200' :
                                                        intervention.priority === 'medium' ? 'bg-yellow-200' : 'bg-green-200'
                                                    }`}>
                                                    {intervention.priority.toUpperCase()}
                                                </span>
                                                {getStatusIcon(intervention.status)}
                                            </div>
                                            <p className="text-sm opacity-80">{intervention.school}</p>
                                            <p className="text-sm mt-2">
                                                <strong>{language === 'hi' ? 'समस्या:' : 'Issue:'}</strong> {intervention.issue}
                                            </p>
                                            <p className="text-xs opacity-70 mt-1">
                                                {language === 'hi' ? 'अंतिम विज़िट:' : 'Last Visit:'} {intervention.lastVisit}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => handleAction('Schedule Visit', intervention.teacher)}
                                            >
                                                <Calendar size={14} className="mr-1" />
                                                {language === 'hi' ? 'विज़िट' : 'Visit'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleAction('Send Resource', intervention.teacher)}
                                            >
                                                <Send size={14} className="mr-1" />
                                                {language === 'hi' ? 'संसाधन' : 'Resource'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleAction('Flag for DIET', intervention.teacher)}
                                            >
                                                <Flag size={14} className="mr-1" />
                                                DIET
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardWidget>
                )}

                {/* Teachers Tab */}
                {selectedView === 'teachers' && (
                    <DashboardWidget title={t('teacherEngagement')} icon={<Users size={18} />}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-slate-500 border-b">
                                        <th className="pb-3 font-medium">{t('teacher')}</th>
                                        <th className="pb-3 font-medium">{t('school')}</th>
                                        <th className="pb-3 font-medium text-center">SOS</th>
                                        <th className="pb-3 font-medium text-center">{t('successRate')}</th>
                                        <th className="pb-3 font-medium text-center">{t('status')}</th>
                                        <th className="pb-3 font-medium text-center">{language === 'hi' ? 'कार्रवाई' : 'Action'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(data?.teacher_engagement || []).map((teacher, i) => {
                                        const readinessConfig = READINESS_CONFIG[teacher.readiness] || READINESS_CONFIG.ready;
                                        return (
                                            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="py-3 font-medium">{teacher.teacher_name}</td>
                                                <td className="py-3 text-sm text-slate-500">{teacher.school}</td>
                                                <td className="py-3 text-center">{teacher.sos_count}</td>
                                                <td className="py-3 text-center">
                                                    <span className={`font-medium ${teacher.success_rate >= 0.7 ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {Math.round(teacher.success_rate * 100)}%
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${readinessConfig.bgClass} ${readinessConfig.textClass}`}>
                                                        {readinessConfig.icon}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <button
                                                        className="text-primary-600 hover:text-primary-700"
                                                        onClick={() => handleAction('View', teacher.teacher_name)}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </DashboardWidget>
                )}

                {/* Smart Visit Planner Tab - AI-Optimized Field Visit Schedule */}
                {selectedView === 'visit-planner' && (
                    <div className="space-y-6">
                        {/* AI Route Recommendation */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        🗺️ {language === 'hi' ? 'AI-अनुशंसित विज़िट प्लान' : 'AI-Recommended Visit Plan'}
                                    </h3>
                                    <p className="text-emerald-100 text-sm mt-1">
                                        {language === 'hi' 
                                            ? 'आज के लिए अनुकूलित मार्ग - 3 स्कूल, ~18 km'
                                            : 'Optimized route for today - 3 schools, ~18 km'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold">3</p>
                                    <p className="text-emerald-200 text-xs">{language === 'hi' ? 'प्राथमिक विज़िट' : 'Priority Visits'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Visit Schedule */}
                        <DashboardWidget
                            title={language === 'hi' ? 'आज का विज़िट शेड्यूल' : "Today's Visit Schedule"}
                            icon={<Calendar size={18} />}
                        >
                            <div className="space-y-4">
                                {[
                                    {
                                        time: '9:00 AM',
                                        school: 'GPS Rampur',
                                        teacher: 'Anita Kumari',
                                        issue: language === 'hi' ? 'भिन्न पढ़ाने में कठिनाई' : 'Difficulty teaching fractions',
                                        priority: 'high',
                                        distance: '5 km',
                                        aiReason: language === 'hi' 
                                            ? '5 दिनों से निष्क्रिय + सबसे नज़दीक' 
                                            : '5 days inactive + nearest location'
                                    },
                                    {
                                        time: '11:30 AM',
                                        school: 'GPS Lakhanpur',
                                        teacher: 'Rajesh Singh',
                                        issue: language === 'hi' ? 'स्थानीय मान में बार-बार असफलता' : 'Repeated failures in Place Value',
                                        priority: 'high',
                                        distance: '7 km',
                                        aiReason: language === 'hi' 
                                            ? '4 SOS भिन्न विषय पर + रास्ते में' 
                                            : '4 SOS on same topic + on route'
                                    },
                                    {
                                        time: '2:00 PM',
                                        school: 'GPS Sundarpur',
                                        teacher: 'Meena Devi',
                                        issue: language === 'hi' ? 'सफलता दर 45% से कम' : 'Success rate below 45%',
                                        priority: 'medium',
                                        distance: '6 km',
                                        aiReason: language === 'hi' 
                                            ? 'लंबे समय से विज़िट नहीं + सुधार संभव' 
                                            : 'Long overdue visit + improvement potential'
                                    }
                                ].map((visit, i) => (
                                    <div key={i} className={`p-4 rounded-xl border-2 ${
                                        visit.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                                    }`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="text-center">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                                        visit.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                                                    }`}>
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">{visit.distance}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-slate-500">{visit.time}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span className="font-bold text-slate-800">{visit.school}</span>
                                                    </div>
                                                    <p className="font-semibold text-lg">{visit.teacher}</p>
                                                    <p className="text-sm text-slate-600 mt-1">{visit.issue}</p>
                                                    <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                                                        <Lightbulb size={12} />
                                                        <span>AI: {visit.aiReason}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Button size="sm" variant="primary" onClick={() => handleAction('Navigate', visit.school)}>
                                                    🧭 {language === 'hi' ? 'नेविगेट' : 'Navigate'}
                                                </Button>
                                                <Button size="sm" variant="secondary" onClick={() => handleAction('Reschedule', visit.teacher)}>
                                                    📅 {language === 'hi' ? 'बदलें' : 'Reschedule'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600">~18 km</p>
                                        <p className="text-xs text-slate-500">{language === 'hi' ? 'कुल दूरी' : 'Total Distance'}</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">~5 hrs</p>
                                        <p className="text-xs text-slate-500">{language === 'hi' ? 'अनुमानित समय' : 'Estimated Time'}</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-purple-600">₹45</p>
                                        <p className="text-xs text-slate-500">{language === 'hi' ? 'यात्रा खर्च' : 'Travel Cost'}</p>
                                    </div>
                                </div>
                            </div>
                        </DashboardWidget>

                        {/* What to Carry */}
                        <DashboardWidget
                            title={language === 'hi' ? '📦 साथ ले जाएं' : '📦 What to Carry'}
                            icon={<CheckCircle2 size={18} />}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { item: language === 'hi' ? 'भिन्न TLM किट' : 'Fractions TLM Kit', for: 'Anita' },
                                    { item: language === 'hi' ? 'स्थानीय मान चार्ट' : 'Place Value Chart', for: 'Rajesh' },
                                    { item: language === 'hi' ? 'पठन कार्ड' : 'Reading Cards', for: 'Meena' },
                                    { item: language === 'hi' ? 'प्रशंसा प्रमाणपत्र' : 'Appreciation Cert', for: 'Top Teacher' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                        <p className="font-medium text-slate-800">{item.item}</p>
                                        <p className="text-xs text-slate-500">{language === 'hi' ? 'के लिए:' : 'For:'} {item.for}</p>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {/* AI Insights Tab */}
                {selectedView === 'insights' && (
                    <div className="space-y-6">
                        {/* Weekly Summary */}
                        <DashboardWidget
                            title={language === 'hi' ? 'साप्ताहिक सारांश' : 'Weekly Summary'}
                            icon={<Lightbulb size={18} />}
                        >
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                                <p className="text-slate-700">{data?.ai_insights?.weekly_summary}</p>
                            </div>
                        </DashboardWidget>

                        {/* Focus Areas */}
                        <DashboardWidget
                            title={language === 'hi' ? 'फोकस क्षेत्र' : 'Focus Areas'}
                            icon={<Eye size={18} />}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(data?.ai_insights?.focus_areas || []).map((area, i) => (
                                    <div key={i} className={`p-4 rounded-xl border-2 ${getPriorityStyle(area.urgency)}`}>
                                        <h3 className="font-bold text-lg">{area.topic}</h3>
                                        <p className="text-sm opacity-80">
                                            {area.teachers} {t('teachers')}
                                        </p>
                                        <div className={`mt-2 inline-block px-2 py-1 rounded text-xs font-medium ${area.urgency === 'high' ? 'bg-red-200' :
                                                area.urgency === 'medium' ? 'bg-yellow-200' : 'bg-green-200'
                                            }`}>
                                            {area.urgency.toUpperCase()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>

                        {/* Success Story */}
                        <DashboardWidget
                            title={language === 'hi' ? 'सफलता की कहानी' : 'Success Story'}
                            icon={<CheckCircle2 size={18} />}
                        >
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 flex items-center gap-4">
                                <span className="text-4xl">🎉</span>
                                <p className="text-green-800 font-medium">{data?.ai_insights?.success_story}</p>
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {/* Alerts Tab */}
                {selectedView === 'alerts' && (
                    <DashboardWidget
                        title={language === 'hi' ? 'अलर्ट' : 'Alerts'}
                        icon={<Bell size={18} />}
                    >
                        <div className="space-y-3">
                            {(data?.alerts || []).map((alert, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-xl border-l-4 ${alert.type === 'inactive' ? 'border-yellow-500 bg-yellow-50' :
                                            alert.type === 'struggling' ? 'border-red-500 bg-red-50' :
                                                'border-orange-500 bg-orange-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                {alert.type === 'inactive' ? <Clock size={18} className="text-yellow-600" /> :
                                                    alert.type === 'struggling' ? <XCircle size={18} className="text-red-600" /> :
                                                        <AlertTriangle size={18} className="text-orange-600" />}
                                                <h3 className="font-bold">{alert.teacher}</h3>
                                            </div>
                                            <p className="text-sm text-slate-600">{alert.school}</p>
                                            <p className="text-sm font-medium mt-1">{alert.message}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => handleAction('Take Action', alert.teacher)}
                                        >
                                            {language === 'hi' ? 'कार्रवाई' : 'Action'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {(!data?.alerts || data.alerts.length === 0) && (
                                <div className="text-center py-8 text-slate-500">
                                    <CheckCircle2 size={48} className="mx-auto text-green-400 mb-2" />
                                    <p>{language === 'hi' ? 'कोई अलर्ट नहीं!' : 'No alerts!'}</p>
                                </div>
                            )}
                        </div>
                    </DashboardWidget>
                )}
            </main>
        </div>
    );
}

export default CRPDashboard;
