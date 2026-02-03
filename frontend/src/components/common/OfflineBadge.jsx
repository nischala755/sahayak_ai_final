import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import useOffline from '../../hooks/useOffline';

export function OfflineBadge() {
    const { isOffline } = useOffline();

    if (!isOffline) return null;

    return (
        <div className="badge-offline animate-pulse">
            <WifiOff size={14} />
            <span>ऑफ़लाइन</span>
        </div>
    );
}

export function OnlineIndicator() {
    const { isOnline } = useOffline();

    return (
        <div className={`flex items-center gap-1.5 text-sm ${isOnline ? 'text-green-600' : 'text-slate-500'}`}>
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isOnline ? 'ऑनलाइन' : 'ऑफ़लाइन'}</span>
        </div>
    );
}

export default OfflineBadge;
