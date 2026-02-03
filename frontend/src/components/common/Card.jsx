import React from 'react';

export function Card({ children, className = '', onClick, ...props }) {
    return (
        <div
            className={`card ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardElevated({ children, className = '', ...props }) {
    return (
        <div className={`card-elevated ${className}`} {...props}>
            {children}
        </div>
    );
}

export function DashboardWidget({ title, icon, children, className = '', action, ...props }) {
    return (
        <div className={`dashboard-widget ${className}`} {...props}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-primary-600">{icon}</span>}
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

export default Card;
