import React from 'react';
import { X, Flame, Shield, Zap, Heart, AlertTriangle, Users } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl border border-orange-500/40 bg-slate-900/95 p-6 shadow-2xl text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚒</span>
            <div>
              <h2 className="text-lg font-black text-white">Manual Operacional do Bombeiro</h2>
              <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                Instruções & Segurança CBMMG
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="mt-4 overflow-y-auto space-y-4 pr-1 text-sm text-slate-300">
          {/* Controls */}
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🎮</span> Controles do Jogo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-white block mb-1">Teclado (Computador):</span>
                <ul className="space-y-1 text-slate-300">
                  <li>• <strong>W, A, S, D</strong> ou <strong>Setas</strong>: Movimentar</li>
                  <li>• <strong>Espaço</strong>: Usar Extintor / Esguicho</li>
                  <li>• <strong>E</strong> ou <strong>Enter</strong>: Interagir / Salvar / Válvulas</li>
                  <li>• <strong>Shift</strong>: Correr rápido</li>
                </ul>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-white block mb-1">Celular / Tablet (Toque):</span>
                <ul className="space-y-1 text-slate-300">
                  <li>• <strong>Joystick Virtual (Esquerda)</strong>: Direção</li>
                  <li>• <strong>Botão EXTINGUIR (Laranja)</strong>: Jato de espuma</li>
                  <li>• <strong>Botão SALVAR (Verde)</strong>: Resgate e painéis</li>
                  <li>• <strong>Botão CORRER (Amarelo)</strong>: Sprint veloz</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Missions */}
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📋</span> As 5 Missões em Cada Andar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Resgatar Pessoas:</strong>
                  Aproxime-se dos civis e pressione Interagir para guiá-los até a escadaria.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <span className="text-base shrink-0">🐾</span>
                <div>
                  <strong className="text-white block">Resgatar Animais:</strong>
                  Cães e gatos encurralados precisam de ajuda imediata!
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Apagar Focos de Incêndio:</strong>
                  Aponte o extintor e mantenha pressionado para sufocar o fogo com água e espuma.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Fechar Registros de Gás:</strong>
                  Gás inflamável alimenta chamas. Feche as válvulas de GLP nas copas e cozinhas!
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 sm:col-span-2">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Desligar Painéis Elétricos:</strong>
                  Circuitos energizados causam arcos voltaicos fatais. Desarme os disjuntores!
                </div>
              </div>
            </div>
          </div>

          {/* Dicas dos Bombeiros */}
          <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-2xl text-xs text-amber-200">
            <span className="font-bold block text-amber-300 mb-1">
              🚒 Dica de Prevenção do CBMMG:
            </span>
            Em caso real de incêndio: Mantenha a calma, acione imediatamente o <strong>193</strong>, nunca utilize elevadores, desça sempre pelas escadas de emergência e rasteje se houver fumaça espessa.
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-4 pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-500 transition shadow-lg active:scale-95"
          >
            Entendido, Pronto para o Combate!
          </button>
        </div>
      </div>
    </div>
  );
};
