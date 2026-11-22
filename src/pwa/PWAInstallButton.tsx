import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface PWAInstallButtonProps {
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => {
          sounds.playClick();
          install();
        }}
        className={`h-10 px-2.5 sm:px-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition shrink-0 whitespace-nowrap cursor-pointer ${className}`}
        title="Instalar App Offline"
        aria-label="Instalar aplicativo"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">Instalar</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setShowIOSGuide(true);
          }}
          className={`h-10 px-2.5 sm:px-3 rounded-xl bg-slate-900/75 hover:bg-slate-800 border border-white/15 text-amber-200 font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition shrink-0 whitespace-nowrap cursor-pointer backdrop-blur-md ${className}`}
          title="Instalar no iPhone ou iPad"
          aria-label="Instalar no iOS"
        >
          <Smartphone className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="hidden sm:inline">Instalar</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl text-left text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="min-w-[40px] min-h-[40px] rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Para jogar offline em tela cheia no iOS:
              </p>
              <ol className="mt-3 space-y-2 text-xs text-slate-200 border-y border-white/10 py-3">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">1.</span>
                  <span>Toque em <strong>Compartilhar</strong> na barra do Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">2.</span>
                  <span>Toque em <strong>Adicionar à Tela de Início</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">3.</span>
                  <span>Confirme em <strong>Adicionar</strong> no canto superior direito.</span>
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full min-h-[44px] rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm transition cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
