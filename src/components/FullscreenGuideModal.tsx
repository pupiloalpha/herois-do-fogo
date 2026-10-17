import React from 'react';
import { Smartphone, Maximize, Share2, PlusSquare, X, CheckCircle, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl border border-orange-500/40 bg-slate-900/98 p-5 sm:p-6 shadow-2xl text-left text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Maximize className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Jogar Sem Barras do Navegador
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro */}
        <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Quando jogado em abas normais do navegador sem instalar, barras de endereço e guias podem ocupar parte da tela. Veja as formas fáceis de resolver:
        </p>

        <div className="mt-4 space-y-3.5">
          {/* Solution 1: Fullscreen Button (Android & PC) */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-3 sm:p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Maximize className="w-4 h-4 text-amber-400" /> Opção 1: Modo Tela Cheia
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                Android / PC
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              Oculte instantaneamente todas as barras e guias com um único toque usando a API nativa de Fullscreen:
            </p>
            {onEnterFullscreen && (
              <button
                onClick={() => {
                  onEnterFullscreen();
                  onClose();
                }}
                className="w-full mt-1 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Maximize className="w-4 h-4" />
                <span>{isFullscreen ? 'VOCÊ JÁ ESTÁ EM TELA CHEIA' : 'ATIVAR TELA CHEIA AGORA'}</span>
              </button>
            )}
          </div>

          {/* Solution 2: iOS Safari / Add to Home Screen */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-3 sm:p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-cyan-400" /> Opção 2: Tela de Início (PWA)
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full">
                iPhone / iPad / Todos
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              No Safari da Apple, o sistema não permite Fullscreen em abas comuns. Mas adicionando à tela de início, ele abre como app autônomo sem nenhuma barra:
            </p>
            <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-200 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                <span>Toque no ícone de <strong>Compartilhar</strong> <Share2 className="w-3 h-3 inline text-cyan-400" /> no Safari</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <span>Escolha <strong>Adicionar à Tela de Início</strong> <PlusSquare className="w-3 h-3 inline text-cyan-400" /></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <span>Abra pelo novo ícone criado: 100% de tela cheia definitiva!</span>
              </div>
            </div>
          </div>

          {/* Solution 3: In-game Controls Elevation Button */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-3 sm:p-4 space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Opção 3: Botão [▲ Elevar Controles]
            </span>
            <p className="text-xs text-slate-300 leading-normal">
              Se preferir continuar no navegador, implementamos uma <strong>área de segurança inteligente</strong> e o botão <strong>[▲ Elevar]</strong> no centro inferior, que levanta o joystick e botões para ficarem acima de qualquer barra do seu celular.
            </p>
          </div>
        </div>

        {/* Footer close button */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-xl active:scale-95 transition"
        >
          Entendi, vamos jogar!
        </button>
      </div>
    </div>
  );
};
