import React from 'react';
import { Smartphone, Maximize, Share2, PlusSquare, X, ShieldCheck } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface FullscreenGuideModalProps {
  onClose: () => void;
  onEnterFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const FullscreenGuideModal: React.FC<FullscreenGuideModalProps> = ({
  onClose,
  onEnterFullscreen,
  isFullscreen = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="w-full max-w-md max-h-[92dvh] rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Maximize className="w-5 h-5 text-amber-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-white truncate">
              Jogar em Tela Cheia
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            aria-label="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto overscroll-contain space-y-4 text-xs sm:text-sm text-slate-300">
          <p className="leading-relaxed">
            Para evitar que as barras do navegador ocupem espaço de jogo, escolha uma das opções abaixo:
          </p>

          <div className="pb-4 border-b border-white/10 space-y-2">
            <p className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Maximize className="w-4 h-4" />
              <span>Android e Computador · Tela Cheia</span>
            </p>
            <p className="text-xs leading-relaxed">
              Oculta as barras e guias imediatamente com um toque.
            </p>
            {onEnterFullscreen && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onEnterFullscreen();
                  onClose();
                }}
                className="w-full min-h-[44px] mt-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer"
              >
                <Maximize className="w-4 h-4" />
                <span>{isFullscreen ? 'Tela Cheia já Ativa' : 'Ativar Tela Cheia'}</span>
              </button>
            )}
          </div>

          <div className="pb-4 border-b border-white/10 space-y-2">
            <p className="font-semibold text-sky-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>iPhone e iPad · Tela de Início</span>
            </p>
            <ol className="space-y-1.5 text-xs text-slate-200">
              <li>1. Toque em <strong>Compartilhar</strong> <Share2 className="w-3 h-3 inline text-sky-400" /> no Safari.</li>
              <li>2. Escolha <strong>Adicionar à Tela de Início</strong> <PlusSquare className="w-3 h-3 inline text-sky-400" />.</li>
              <li>3. Abra pelo ícone instalado para jogar offline e sem barras.</li>
            </ol>
          </div>

          <div className="space-y-1.5">
            <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Ajuste manual de controles</span>
            </p>
            <p className="text-xs leading-relaxed">
              No menu de Pausa no celular, você também pode alternar <strong>Elevar Controles</strong> para manter os botões acima da barra inferior.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 bg-slate-950/40 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
