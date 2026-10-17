import React from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-fade-in pointer-events-auto">
      <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
      <span>Modo Offline — Jogo carregado do cache local!</span>
    </div>
  );
};
