import React from 'react';
import { READINESS_CONFIG } from '../../utils/constants';

export function ReadinessSignal({ status, showLabel = true, size = 'md' }) {
    const config = READINESS_CONFIG[status] || READINESS_CONFIG.ready;

    const sizeClasses = {
        sm: 'text-sm px-2 py-1',
        md: 'text-base px-3 py-2',
        lg: 'text-lg px-4 py-3',
    };

    return (
        <div className={`inline-flex items-center gap-2 rounded-full ${config.bgClass} ${config.textClass} ${sizeClasses[size]}`}>
            <span className="text-xl">{config.icon}</span>
            {showLabel && (
                <span className="font-medium">{config.label}</span>
            )}
        </div>
    );
}

export function ReadinessCard({ status, message }) {
    const config = READINESS_CONFIG[status] || READINESS_CONFIG.ready;

    return (
        <div className={`rounded-2xl p-5 ${config.bgClass} border border-${config.color}-200`}>
            <div className="flex items-start gap-4">
                <span className="text-4xl">{config.icon}</span>
                <div>
                    <h3 className={`font-bold text-lg ${config.textClass}`}>
                        {config.label}
                    </h3>
                    {message && (
                        <p className={`text-sm mt-1 ${config.textClass} opacity-80`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReadinessSignal;
