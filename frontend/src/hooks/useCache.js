import { useState, useEffect } from 'react';
import { quickFixesCache } from '../services/offlineStorage';
import { sosAPI } from '../services/api';

export function useCache() {
    const [quickFixes, setQuickFixes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromCache, setFromCache] = useState(false);

    useEffect(() => {
        loadQuickFixes();
    }, []);

    const loadQuickFixes = async () => {
        setLoading(true);

        // Try cache first
        const cached = quickFixesCache.get();
        if (cached && !quickFixesCache.isStale()) {
            setQuickFixes(cached.fixes);
            setFromCache(true);
            setLoading(false);
            return;
        }

        // Fetch from API
        try {
            const response = await sosAPI.getQuickFixes(50);
            setQuickFixes(response.fixes);
            setFromCache(false);

            // Update cache
            quickFixesCache.set(response.fixes);
        } catch (error) {
            // Fall back to stale cache if available
            if (cached) {
                setQuickFixes(cached.fixes);
                setFromCache(true);
            }
            console.error('Failed to load quick fixes:', error);
        }

        setLoading(false);
    };

    const refreshCache = () => {
        loadQuickFixes();
    };

    return {
        quickFixes,
        loading,
        fromCache,
        refreshCache,
    };
}

export default useCache;
