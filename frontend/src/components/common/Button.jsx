import React from 'react';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    ...props
}) {
    const baseClasses = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-lg',
        secondary: 'bg-white text-primary-700 border-2 border-primary-200 hover:bg-primary-50',
        sos: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-xl active:scale-95',
        ghost: 'text-primary-600 hover:bg-primary-50',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm min-h-[40px]',
        md: 'px-6 py-4 text-base min-h-[56px]',
        lg: 'px-8 py-5 text-lg min-h-[64px]',
        xl: 'px-10 py-6 text-xl min-h-[80px]',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
}

export default Button;
