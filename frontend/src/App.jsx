import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { getAuthToken, setAuthToken, authAPI } from './services/api';
import { userCache } from './services/offlineStorage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LoadingScreen } from './components/common/LoadingSpinner';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import CRPDashboard from './pages/CRPDashboard';
import DIETDashboard from './pages/DIETDashboard';

function AppContent() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        // Check for existing session
        const checkAuth = async () => {
            const token = getAuthToken();
            const cachedUser = userCache.get();

            if (token && cachedUser) {
                // Verify token is still valid
                try {
                    const userData = await authAPI.getMe();
                    setUser(userData);
                } catch {
                    // Token invalid, use cached user for offline
                    if (cachedUser) {
                        setUser(cachedUser);
                    } else {
                        setAuthToken(null);
                    }
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        userCache.set(userData);
    };

    const handleLogout = () => {
        setAuthToken(null);
        userCache.clear();
        setUser(null);
    };

    if (loading) {
        return <LoadingScreen message={`${t('appName')} ${t('loading')}`} />;
    }

    // Not logged in
    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    // Role-based dashboard routing
    const getDashboard = () => {
        switch (user.role) {
            case 'teacher':
                return <TeacherDashboard user={user} onLogout={handleLogout} />;
            case 'crp':
                return <CRPDashboard user={user} onLogout={handleLogout} />;
            case 'diet':
                return <DIETDashboard user={user} onLogout={handleLogout} />;
            default:
                return <TeacherDashboard user={user} onLogout={handleLogout} />;
        }
    };

    const router = createBrowserRouter(
        [
            { path: "/", element: getDashboard() },
            { path: "*", element: <Navigate to="/" replace /> }
        ],
        {
            future: {
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }
        }
    );

    return <RouterProvider router={router} />;
}

function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;
