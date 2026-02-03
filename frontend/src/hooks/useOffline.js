import { useState, useEffect } from 'react';
import { isOnline, onConnectivityChange } from '../services/offlineStorage';

export function useOffline() {
    const [online, setOnline] = useState(isOnline());

    useEffect(() => {
        const cleanup = onConnectivityChange(setOnline);
        return cleanup;
    }, []);

    return {
        isOnline: online,
        isOffline: !online,
    };
}

export default useOffline;
