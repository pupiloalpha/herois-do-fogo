import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [offlineReadyToast, setOfflineReadyToast] = useState(false);

  useEffect(() => {
    const handleReady = () => {
      setOfflineReadyToast(true);
      window.setTimeout(() => setOfflineReadyToast(false), 4500);
    };
    window.addEventListener('cbmmg-pwa-offline-ready', handleReady);
    return () => window.removeEventListener('cbmmg-pwa-offline-ready', handleReady);
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/50 animate-fade-in pointer-events-auto">
        <WifiOff className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
        <span>Modo Offline — As 3 missões estão prontas no cache local!</span>
      </div>
    );
  }

  if (offlineReadyToast) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-emerald-400/50 animate-fade-in pointer-events-none">
        <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
        <span>PWA pronto offline: 10 Andares, Enchentes e Florestal em cache!</span>
      </div>
    );
  }

  return null;
};
