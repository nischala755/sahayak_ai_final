import React, { useState, useEffect } from 'react';
import {
    LogOut, TrendingUp, TrendingDown, AlertCircle, GraduationCap, BarChart3,
    Download, Share2, Printer, Lightbulb, Target, BookOpen, RefreshCw,
    CheckCircle2, ArrowRight, Calendar
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, Legend, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from 'recharts';
import { dashboardAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from '../components/common/LanguageSwitcher';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DashboardWidget } from '../components/common/Card';
import Button from '../components/common/Button';

export function DIETDashboard({ user, onLogout }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState('gaps');
    const [refreshing, setRefreshing] = useState(false);
    const { t, language } = useLanguage();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await dashboardAPI.getDIET();
            // Add enhanced mock data for demo
            setData({
                ...response,
                // Learning Gaps - Hardcoded for demo to ensure chart shows
                learning_gaps: [
                    { topic: 'Fractions', subject: 'Math', grade: 4, gap_score: 0.72, affected_schools: 18, affected_teachers: 34, trend: 'increasing' },
                    { topic: 'Addition-Subtraction', subject: 'Math', grade: 3, gap_score: 0.58, affected_schools: 14, affected_teachers: 28, trend: 'stable' },
                    { topic: 'Attention', subject: 'Classroom', grade: 3, gap_score: 0.45, affected_schools: 12, affected_teachers: 22, trend: 'decreasing' },
                    { topic: 'Fractions', subject: 'Math', grade: 5, gap_score: 0.38, affected_schools: 10, affected_teachers: 18, trend: 'increasing' },
                    { topic: 'History of India', subject: 'EVS', grade: 5, gap_score: 0.32, affected_schools: 8, affected_teachers: 15, trend: 'stable' },
                    { topic: 'Reading Comprehension', subject: 'Hindi', grade: 2, gap_score: 0.28, affected_schools: 7, affected_teachers: 12, trend: 'decreasing' }
                ],
                // Policy Recommendations
                policy_recommendations: [
                    {
                        id: 1,
                        title: language === 'hi' ? 'गणित प्रशिक्षण कार्यक्रम' : 'Math Training Program',
                        description: language === 'hi'
                            ? '68% शिक्षकों को भिन्न-दशमलव में कठिनाई है। 2-दिवसीय गहन कार्यशाला की सिफारिश।'
                            : '68% teachers struggle with Fractions-Decimals. Recommend 2-day intensive workshop.',
                        impact: 'high',
                        teachers_affected: 45,
                        estimated_improvement: '25%'
                    },
                    {
                        id: 2,
                        title: language === 'hi' ? 'पठन कौशल पहल' : 'Reading Skills Initiative',
                        description: language === 'hi'
                            ? 'कक्षा 1-2 में पठन स्तर राष्ट्रीय औसत से नीचे। FLN प्रशिक्षण आवश्यक।'
                            : 'Reading levels in Grade 1-2 below national average. FLN training required.',
                        impact: 'medium',
                        teachers_affected: 32,
                        estimated_improvement: '18%'
                    },
                    {
                        id: 3,
                        title: language === 'hi' ? 'डिजिटल संसाधन वितरण' : 'Digital Resource Distribution',
                        description: language === 'hi'
                            ? '5 क्लस्टरों में इंटरनेट कनेक्टिविटी की कमी। ऑफ़लाइन सामग्री की आवश्यकता।'
                            : '5 clusters lack internet connectivity. Offline materials needed.',
                        impact: 'low',
                        teachers_affected: 18,
                        estimated_improvement: '12%'
                    }
                ],
                // Cluster Comparison Data
                cluster_comparison: [
                    { cluster: 'Rampur', health: 0.85, sos: 124, success: 0.78, strengths: ['Math', 'Reading'] },
                    { cluster: 'Lakhanpur', health: 0.72, sos: 98, success: 0.65, strengths: ['EVS'] },
                    { cluster: 'Sundarpur', health: 0.68, sos: 87, success: 0.62, strengths: ['Hindi'] },
                    { cluster: 'Narayanpur', health: 0.91, sos: 156, success: 0.84, strengths: ['Math', 'EVS', 'Hindi'] },
                    { cluster: 'Devpur', health: 0.54, sos: 45, success: 0.48, strengths: [] }
                ],
                // Training Plan
                training_plan: [
                    {
                        id: 1,
                        module: language === 'hi' ? 'भिन्न-दशमलव महारत' : 'Fractions-Decimals Mastery',
                        duration: '2 days',
                        target_group: language === 'hi' ? 'कक्षा 3-5 शिक्षक' : 'Grade 3-5 Teachers',
                        participants: 45,
                        scheduled: '15-16 Feb 2024',
                        status: 'scheduled',
                        impact_score: 92
                    },
                    {
                        id: 2,
                        module: language === 'hi' ? 'FLN पठन कार्यशाला' : 'FLN Reading Workshop',
                        duration: '3 days',
                        target_group: language === 'hi' ? 'कक्षा 1-2 शिक्षक' : 'Grade 1-2 Teachers',
                        participants: 32,
                        scheduled: '22-24 Feb 2024',
                        status: 'pending',
                        impact_score: 88
                    },
                    {
                        id: 3,
                        module: language === 'hi' ? 'कक्षा प्रबंधन' : 'Classroom Management',
                        duration: '1 day',
                        target_group: language === 'hi' ? 'सभी शिक्षक' : 'All Teachers',
                        participants: 120,
                        scheduled: 'TBD',
                        status: 'proposed',
                        impact_score: 76
                    }
                ],
                // Best Practices
                best_practices: [
                    {
                        cluster: 'Narayanpur',
                        practice: language === 'hi'
                            ? 'दैनिक 15 मिनट का गणित खेल सत्र'
                            : 'Daily 15-min math game session',
                        result: language === 'hi' ? '84% सफलता दर' : '84% success rate'
                    },
                    {
                        cluster: 'Rampur',
                        practice: language === 'hi'
                            ? 'साप्ताहिक पीयर लर्निंग ग्रुप'
                            : 'Weekly peer learning groups',
                        result: language === 'hi' ? '78% सफलता दर' : '78% success rate'
                    }
                ],
                // Radar data for cluster comparison
                radar_data: [
                    { subject: 'Math', Narayanpur: 90, Rampur: 78, Devpur: 45 },
                    { subject: 'Hindi', Narayanpur: 85, Rampur: 72, Devpur: 52 },
                    { subject: 'EVS', Narayanpur: 82, Rampur: 68, Devpur: 48 },
                    { subject: 'Reading', Narayanpur: 88, Rampur: 80, Devpur: 40 },
                    { subject: 'Writing', Narayanpur: 75, Rampur: 70, Devpur: 55 }
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

    const handleExport = (format) => {
        alert(`Exporting as ${format}... (Demo)`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getImpactBadge = (impact) => {
        switch (impact) {
            case 'high': return { class: 'bg-red-500', label: language === 'hi' ? 'उच्च' : 'High' };
            case 'medium': return { class: 'bg-yellow-500', label: language === 'hi' ? 'मध्यम' : 'Medium' };
            case 'low': return { class: 'bg-green-500', label: language === 'hi' ? 'निम्न' : 'Low' };
            default: return { class: 'bg-slate-500', label: impact };
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'proposed': return 'bg-slate-100 text-slate-700';
            case 'completed': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-200 text-sm mb-1">
                                <span className="font-medium">{t('dietDashboard')}</span>
                                <span>•</span>
                                <span>{data?.district} {t('district')}</span>
                            </div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Export buttons */}
                            <div className="hidden md:flex items-center gap-2 mr-2">
                                <button
                                    onClick={() => handleExport('PDF')}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                    title="Download PDF"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    onClick={() => handleExport('Share')}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                    title="Share"
                                >
                                    <Share2 size={18} />
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                    title="Print"
                                >
                                    <Printer size={18} />
                                </button>
                            </div>
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
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 hover:bg-white/15 transition-colors">
                            <p className="text-3xl font-bold">{data?.stats?.total_clusters || 0}</p>
                            <p className="text-sm text-indigo-200">{t('clusters')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 hover:bg-white/15 transition-colors">
                            <p className="text-3xl font-bold">{data?.stats?.total_schools || 0}</p>
                            <p className="text-sm text-indigo-200">{t('schools')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 hover:bg-white/15 transition-colors">
                            <p className="text-3xl font-bold">{data?.stats?.total_teachers || 0}</p>
                            <p className="text-sm text-indigo-200">{t('teachers')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 hover:bg-white/15 transition-colors">
                            <p className="text-3xl font-bold">
                                {Math.round((data?.stats?.district_health_score || 0) * 100)}%
                            </p>
                            <p className="text-sm text-indigo-200">{t('healthScore')}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Navigation tabs */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {[
                        { id: 'gaps', label: `📊 ${t('learningGaps')}` },
                        { id: 'impact-predictor', label: `🔮 ${language === 'hi' ? 'प्रभाव भविष्यवक्ता' : 'Impact Predictor'}` },
                        { id: 'policy', label: `💡 ${language === 'hi' ? 'नीति सुझाव' : 'Policy Recommendations'}` },
                        { id: 'training', label: `🎓 ${language === 'hi' ? 'प्रशिक्षण योजना' : 'Training Plan'}` },
                        { id: 'compare', label: `📈 ${language === 'hi' ? 'क्लस्टर तुलना' : 'Cluster Comparison'}` },
                        { id: 'clusters', label: `🏘️ ${t('clusterPerformance')}` },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedView(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedView === tab.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Learning Gaps Tab */}
                {selectedView === 'gaps' && (
                    <div className="space-y-6">
                        <DashboardWidget title={t('learningGapAnalysis')} icon={<BarChart3 size={18} />}>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.learning_gaps || []} layout="vertical" margin={{ left: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                                        <YAxis dataKey="topic" type="category" width={100} tick={{ fontSize: 12 }} />
                                        <Tooltip formatter={(v) => `${Math.round(v * 100)}%`} />
                                        <Bar dataKey="gap_score" fill="#6366f1" radius={[0, 4, 4, 0]} name={t('gapScore')} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </DashboardWidget>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(data?.learning_gaps || []).slice(0, 6).map((gap, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-4 border border-slate-100 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{gap.topic}</h3>
                                            <p className="text-sm text-slate-500">{gap.subject} • {t('grade')} {gap.grade}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            {gap.trend === 'increasing' ?
                                                <TrendingUp size={16} className="text-red-500" /> :
                                                <TrendingDown size={16} className="text-green-500" />
                                            }
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500">{t('gapScore')}</p>
                                            <p className="text-2xl font-bold text-indigo-600">
                                                {Math.round(gap.gap_score * 100)}%
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">{t('affectedSchools')}</p>
                                            <p className="text-2xl font-bold text-slate-900">
                                                {gap.affected_schools}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Impact Predictor Tab - AI-Powered Training ROI */}
                {selectedView === 'impact-predictor' && (
                    <div className="space-y-6">
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        🔮 {language === 'hi' ? 'प्रशिक्षण प्रभाव भविष्यवक्ता' : 'Training Impact Predictor'}
                                    </h2>
                                    <p className="text-purple-200 text-sm mt-1">
                                        {language === 'hi' 
                                            ? 'AI द्वारा अनुमानित सुधार - प्रशिक्षण निवेश पर रिटर्न'
                                            : 'AI-Predicted Improvements - Return on Training Investment'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-bold">+23%</p>
                                    <p className="text-purple-200 text-xs">{language === 'hi' ? 'अनुमानित जिला सुधार' : 'Predicted District Improvement'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Training Impact Cards */}
                        <DashboardWidget
                            title={language === 'hi' ? 'प्रशिक्षण प्रभाव विश्लेषण' : 'Training Impact Analysis'}
                            icon={<Target size={18} />}
                        >
                            <div className="space-y-4">
                                {[
                                    {
                                        training: language === 'hi' ? 'भिन्न-दशमलव महारत' : 'Fractions-Decimals Mastery',
                                        duration: '2 days',
                                        cost: '₹45,000',
                                        teachers: 45,
                                        currentScore: 52,
                                        predictedScore: 78,
                                        confidence: 92,
                                        roi: '340%',
                                        impact: 'high'
                                    },
                                    {
                                        training: language === 'hi' ? 'FLN पठन कार्यशाला' : 'FLN Reading Workshop',
                                        duration: '3 days',
                                        cost: '₹60,000',
                                        teachers: 32,
                                        currentScore: 48,
                                        predictedScore: 72,
                                        confidence: 88,
                                        roi: '280%',
                                        impact: 'high'
                                    },
                                    {
                                        training: language === 'hi' ? 'कक्षा प्रबंधन' : 'Classroom Management',
                                        duration: '1 day',
                                        cost: '₹20,000',
                                        teachers: 120,
                                        currentScore: 65,
                                        predictedScore: 82,
                                        confidence: 76,
                                        roi: '420%',
                                        impact: 'medium'
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-5 border border-indigo-100">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">{item.training}</h3>
                                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                    <span>⏱️ {item.duration}</span>
                                                    <span>👨‍🏫 {item.teachers} {language === 'hi' ? 'शिक्षक' : 'teachers'}</span>
                                                    <span>💰 {item.cost}</span>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                item.impact === 'high' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                ROI: {item.roi}
                                            </div>
                                        </div>

                                        {/* Progress Visualization */}
                                        <div className="relative">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-slate-600">{language === 'hi' ? 'वर्तमान स्कोर' : 'Current Score'}</span>
                                                <span className="text-slate-600">{language === 'hi' ? 'अनुमानित स्कोर' : 'Predicted Score'}</span>
                                            </div>
                                            <div className="relative h-8 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="absolute left-0 top-0 h-full bg-red-400 rounded-l-full"
                                                    style={{ width: `${item.currentScore}%` }}
                                                />
                                                <div 
                                                    className="absolute top-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-r-full transition-all duration-1000"
                                                    style={{ left: `${item.currentScore}%`, width: `${item.predictedScore - item.currentScore}%` }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-between px-3 text-sm font-bold text-white">
                                                    <span>{item.currentScore}%</span>
                                                    <span className="flex items-center gap-1">
                                                        <ArrowRight size={14} />
                                                        {item.predictedScore}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center mt-2">
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    🎯 {language === 'hi' ? 'AI विश्वास:' : 'AI Confidence:'} {item.confidence}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Improvement Metric */}
                                        <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">
                                                    {language === 'hi' ? 'अनुमानित सुधार' : 'Predicted Improvement'}
                                                </span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    +{item.predictedScore - item.currentScore}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>

                        {/* Budget Optimization */}
                        <DashboardWidget
                            title={language === 'hi' ? '💰 बजट अनुकूलन सुझाव' : '💰 Budget Optimization Suggestion'}
                            icon={<Target size={18} />}
                        >
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl">
                                        💡
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-green-800">
                                            {language === 'hi' ? 'AI सुझाव: पहले भिन्न प्रशिक्षण करें' : 'AI Suggestion: Prioritize Fractions Training'}
                                        </h3>
                                        <p className="text-green-700 mt-2">
                                            {language === 'hi' 
                                                ? 'भिन्न-दशमलव प्रशिक्षण में सबसे अधिक ROI (340%) है। ₹45,000 के निवेश से 45 शिक्षकों में +26% सुधार होगा, जो ~2,250 छात्रों को प्रभावित करेगा।'
                                                : 'Fractions-Decimals training has the highest ROI (340%). An investment of ₹45,000 will improve 45 teachers by +26%, impacting ~2,250 students.'}
                                        </p>
                                        <div className="mt-4 flex items-center gap-4">
                                            <Button variant="primary" onClick={() => alert('Training scheduled!')}>
                                                ✅ {language === 'hi' ? 'प्रशिक्षण शेड्यूल करें' : 'Schedule Training'}
                                            </Button>
                                            <Button variant="secondary" onClick={() => alert('Report generated!')}>
                                                📊 {language === 'hi' ? 'रिपोर्ट डाउनलोड' : 'Download Report'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {/* Policy Recommendations Tab */}
                {selectedView === 'policy' && (
                    <div className="space-y-6">
                        <DashboardWidget
                            title={language === 'hi' ? 'AI नीति सुझाव' : 'AI Policy Recommendations'}
                            icon={<Lightbulb size={18} />}
                        >
                            <div className="space-y-4">
                                {(data?.policy_recommendations || []).map((rec) => {
                                    const impactBadge = getImpactBadge(rec.impact);
                                    return (
                                        <div
                                            key={rec.id}
                                            className={`p-5 rounded-xl border-2 ${getPriorityColor(rec.impact)}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-bold text-lg">{rec.title}</h3>
                                                        <span className={`px-2 py-0.5 rounded text-white text-xs font-medium ${impactBadge.class}`}>
                                                            {impactBadge.label} {language === 'hi' ? 'प्रभाव' : 'Impact'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm opacity-80">{rec.description}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center gap-6 text-sm">
                                                <div>
                                                    <span className="opacity-70">{language === 'hi' ? 'प्रभावित शिक्षक:' : 'Teachers Affected:'}</span>
                                                    <span className="font-bold ml-1">{rec.teachers_affected}</span>
                                                </div>
                                                <div>
                                                    <span className="opacity-70">{language === 'hi' ? 'अनुमानित सुधार:' : 'Est. Improvement:'}</span>
                                                    <span className="font-bold ml-1 text-green-600">{rec.estimated_improvement}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <Button size="sm" variant="primary">
                                                    {language === 'hi' ? 'कार्यवाही करें' : 'Take Action'}
                                                    <ArrowRight size={14} className="ml-1" />
                                                </Button>
                                                <Button size="sm" variant="secondary">
                                                    {language === 'hi' ? 'विस्तार देखें' : 'View Details'}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </DashboardWidget>

                        {/* Best Practices */}
                        <DashboardWidget
                            title={language === 'hi' ? 'सफल प्रथाएं' : 'Best Practices from Clusters'}
                            icon={<CheckCircle2 size={18} />}
                        >
                            <div className="grid md:grid-cols-2 gap-4">
                                {(data?.best_practices || []).map((practice, i) => (
                                    <div key={i} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">🏆</span>
                                            <span className="font-bold text-green-800">{practice.cluster}</span>
                                        </div>
                                        <p className="text-sm text-green-700">{practice.practice}</p>
                                        <p className="text-sm font-medium text-green-600 mt-2">{practice.result}</p>
                                    </div>
                                ))}
                            </div>
                        </DashboardWidget>
                    </div>
                )}

                {/* Training Plan Tab */}
                {selectedView === 'training' && (
                    <DashboardWidget
                        title={language === 'hi' ? 'प्रशिक्षण कैलेंडर' : 'Training Calendar'}
                        icon={<GraduationCap size={18} />}
                    >
                        <div className="space-y-4">
                            {(data?.training_plan || []).map((training) => (
                                <div
                                    key={training.id}
                                    className="p-5 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg">{training.module}</h3>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(training.status)}`}>
                                                    {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">{training.target_group}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-indigo-600">{training.impact_score}</div>
                                            <div className="text-xs text-slate-500">{language === 'hi' ? 'प्रभाव स्कोर' : 'Impact Score'}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-500">{language === 'hi' ? 'अवधि:' : 'Duration:'}</span>
                                            <span className="font-medium ml-1">{training.duration}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">{language === 'hi' ? 'प्रतिभागी:' : 'Participants:'}</span>
                                            <span className="font-medium ml-1">{training.participants}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">{language === 'hi' ? 'तारीख:' : 'Date:'}</span>
                                            <span className="font-medium ml-1">{training.scheduled}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        {training.status === 'proposed' && (
                                            <Button size="sm" variant="primary">
                                                <Calendar size={14} className="mr-1" />
                                                {language === 'hi' ? 'शेड्यूल करें' : 'Schedule'}
                                            </Button>
                                        )}
                                        {training.status === 'scheduled' && (
                                            <Button size="sm" variant="secondary">
                                                <BookOpen size={14} className="mr-1" />
                                                {language === 'hi' ? 'सामग्री देखें' : 'View Materials'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Generate New Training Button */}
                            <button className="w-full p-4 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                                <Target size={20} />
                                <span className="font-medium">
                                    {language === 'hi' ? 'नई प्रशिक्षण योजना बनाएं' : 'Generate New Training Plan'}
                                </span>
                            </button>
                        </div>
                    </DashboardWidget>
                )}

                {/* Cluster Comparison Tab */}
                {selectedView === 'compare' && (
                    <div className="space-y-6">
                        {/* Radar Chart Comparison */}
                        <DashboardWidget
                            title={language === 'hi' ? 'विषय-वार प्रदर्शन' : 'Subject-wise Performance'}
                            icon={<BarChart3 size={18} />}
                        >
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={data?.radar_data || []}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        <Radar name="Narayanpur" dataKey="Narayanpur" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                                        <Radar name="Rampur" dataKey="Rampur" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                        <Radar name="Devpur" dataKey="Devpur" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                                        <Legend />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </DashboardWidget>

                        {/* Cluster Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(data?.cluster_comparison || []).map((cluster, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg">{cluster.cluster}</h3>
                                        <span className={`text-2xl ${cluster.health >= 0.8 ? '🟢' :
                                                cluster.health >= 0.6 ? '🟡' : '🔴'
                                            }`}></span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">{t('healthScore')}</span>
                                            <span className="font-bold">{Math.round(cluster.health * 100)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 rounded-full">
                                            <div
                                                className={`h-full rounded-full ${cluster.health >= 0.8 ? 'bg-green-500' :
                                                        cluster.health >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${cluster.health * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">SOS</span>
                                            <span className="font-medium">{cluster.sos}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">{t('successRate')}</span>
                                            <span className="font-medium">{Math.round(cluster.success * 100)}%</span>
                                        </div>
                                        {cluster.strengths.length > 0 && (
                                            <div className="pt-2 border-t">
                                                <p className="text-xs text-slate-500 mb-1">{language === 'hi' ? 'मजबूत क्षेत्र:' : 'Strong Areas:'}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {cluster.strengths.map((s, j) => (
                                                        <span key={j} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cluster Performance Tab */}
                {selectedView === 'clusters' && (
                    <DashboardWidget title={t('clusterPerformance')} icon={<BarChart3 size={18} />}>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(data?.cluster_performance || []).map((cluster, i) => (
                                <div
                                    key={i}
                                    className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-900">{cluster.cluster}</h3>
                                        <span className={`text-2xl ${cluster.health_score >= 0.8 ? '🟢' :
                                            cluster.health_score >= 0.6 ? '🟡' : '🔴'
                                            }`}>
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm text-slate-600">
                                                <span>{t('healthScore')}</span>
                                                <span className="font-medium">
                                                    {Math.round(cluster.health_score * 100)}%
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-200 rounded-full mt-1">
                                                <div
                                                    className={`h-full rounded-full ${cluster.health_score >= 0.8 ? 'bg-green-500' :
                                                        cluster.health_score >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${cluster.health_score * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">{t('teachers')}</span>
                                            <span className="font-medium text-slate-900">{cluster.teachers}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardWidget>
                )}
            </main>
        </div>
    );
}

export default DIETDashboard;
