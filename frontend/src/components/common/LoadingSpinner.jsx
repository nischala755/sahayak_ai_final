import React from 'react';

export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
            />
        </div>
    );
}

export function LoadingScreen({ message = 'लोड हो रहा है...' }) {
    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-4">
            <LoadingSpinner size="xl" />
            <p className="text-lg text-slate-600">{message}</p>
        </div>
    );
}

export default LoadingSpinner;
