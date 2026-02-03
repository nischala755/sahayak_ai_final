import React, { useState } from 'react';
import { User, Shield, Building2 } from 'lucide-react';
import { authAPI, setAuthToken } from '../services/api';
import { userCache } from '../services/offlineStorage';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from '../components/common/LanguageSwitcher';
import { SDKDemoButton } from '../components/SDKDemo';
import { DEMO_USERS } from '../utils/constants';
import Button from '../components/common/Button';

export function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { t } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(username, password);
            setAuthToken(response.access_token);
            userCache.set(response.user);
            onLogin(response.user);
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = async (user) => {
        setUsername(user.username);
        setPassword(user.password);
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(user.username, user.password);
            setAuthToken(response.access_token);
            userCache.set(response.user);
            onLogin(response.user);
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const roleIcons = {
        teacher: <User size={24} />,
        crp: <Shield size={24} />,
        diet: <Building2 size={24} />,
    };

    const roleLabels = {
        teacher: t('teacher'),
        crp: 'CRP',
        diet: 'DIET',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Language Toggle & SDK Demo */}
                <div className="flex justify-center items-center gap-4 mb-6">
                    <LanguageToggle />
                    <SDKDemoButton />
                </div>

                {/* Logo and title */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-xl mx-auto flex items-center justify-center mb-4">
                        <span className="text-4xl">🎓</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">{t('appName')}</h1>
                    <p className="text-primary-200 mt-2">{t('appTagline')}</p>
                </div>

                {/* Login card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
                        {t('loginTitle')}
                    </h2>

                    {/* Quick login buttons */}
                    <div className="mb-6">
                        <p className="text-sm text-slate-500 mb-3 text-center">{t('demoAccounts')}</p>
                        <div className="grid grid-cols-3 gap-2">
                            {DEMO_USERS.map((user) => (
                                <button
                                    key={user.username}
                                    onClick={() => quickLogin(user)}
                                    disabled={loading}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-slate-100 hover:border-primary-300 hover:bg-primary-50 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                        {roleIcons[user.role]}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-medium text-slate-900">{user.name.split(' ')[0]}</p>
                                        <p className="text-xs text-slate-500">{roleLabels[user.role]}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-3 text-sm text-slate-500">or</span>
                        </div>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t('username')}
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder={t('enterUsername')}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t('password')}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder={t('enterPassword')}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            loading={loading}
                        >
                            {t('login')}
                        </Button>
                    </form>

                    {/* Demo hint */}
                    <p className="mt-6 text-xs text-slate-400 text-center">
                        {t('demoPassword')}: <code className="bg-slate-100 px-1 rounded">demo123</code>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-primary-200 text-sm mt-6">
                    Shikshalokam Hackathon 2024 Finals
                </p>
            </div>
        </div>
    );
}

export default Login;
