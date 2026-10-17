import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'badge' | 'button';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:from-orange-500 hover:to-amber-500 active:scale-95 transition ${className}`}
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>Instalar App PWA</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 active:scale-95 transition ${className}`}
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl border border-orange-500/30 bg-slate-900 p-6 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-white">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Para jogar offline em tela cheia no iOS:
              </p>
              <ol className="mt-3 space-y-2 text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-orange-400">1.</span>
                  <span>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta) na barra do Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-orange-400">2.</span>
                  <span>Role para baixo e toque em <strong>Adicionar à Tela de Início</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-orange-400">3.</span>
                  <span>Toque em <strong>Adicionar</strong> no canto superior direito.</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition"
              >
                Entendi, continuar
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
