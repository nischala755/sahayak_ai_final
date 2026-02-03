import React, { useState } from 'react';
import { Search, Zap } from 'lucide-react';

export function QuickFixes({ fixes, onSelect, loading }) {
    const [search, setSearch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');

    const subjects = ['all', ...new Set(fixes.map(f => f.subject))];

    const filteredFixes = fixes.filter(fix => {
        const matchesSearch = search === '' ||
            fix.problem.toLowerCase().includes(search.toLowerCase()) ||
            fix.problem_hi?.toLowerCase().includes(search.toLowerCase()) ||
            fix.topic.toLowerCase().includes(search.toLowerCase());

        const matchesSubject = selectedSubject === 'all' || fix.subject === selectedSubject;

        return matchesSearch && matchesSubject;
    });

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and filter */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="समस्या खोजें..."
                        className="input-field pl-12"
                    />
                </div>

                {/* Subject filter pills */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {subjects.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedSubject === subject
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {subject === 'all' ? 'सभी' : subject}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick fix list */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                {filteredFixes.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        कोई परिणाम नहीं मिला
                    </div>
                ) : (
                    filteredFixes.map(fix => (
                        <button
                            key={fix.id}
                            onClick={() => onSelect(fix)}
                            className="w-full text-left p-4 bg-white rounded-xl border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 group-hover:text-primary-700 line-clamp-2">
                                        {fix.problem}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded">
                                            कक्षा {fix.grade}
                                        </span>
                                        <span className="bg-slate-100 px-2 py-0.5 rounded">
                                            {fix.subject}
                                        </span>
                                        <span className="text-green-600 flex items-center gap-1">
                                            <Zap size={12} />
                                            {Math.round(fix.success_rate * 100)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="text-primary-500 group-hover:translate-x-1 transition-transform">
                                    →
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Cache indicator */}
            <div className="text-center text-xs text-slate-400">
                {fixes.length} त्वरित समाधान उपलब्ध • ऑफ़लाइन भी काम करता है
            </div>
        </div>
    );
}

export default QuickFixes;
