import React, { useState } from 'react';
import { X, Flame, Shield, Zap, AlertTriangle, Users, Wind, CheckCircle2 } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface InstructionsModalProps {
  onClose: () => void;
}

type TabType = 'recharge' | 'controls' | 'missions';

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('recharge');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-2xl max-h-[94dvh] rounded-3xl border-2 border-orange-500/50 bg-slate-900/98 p-3.5 sm:p-6 shadow-2xl text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-2xl sm:text-3xl">🚒</span>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white">Manual Operacional do Bombeiro</h2>
              <span className="text-[11px] sm:text-xs text-orange-400 font-bold uppercase tracking-wider">
                Corpo de Bombeiros Militar de MG (193)
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation for fast, readable mobile browsing */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mt-3 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('recharge');
            }}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'recharge'
                ? 'bg-gradient-to-r from-cyan-600 to-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🚰</span>
            <span>Hidrante & Fumaça</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('controls');
            }}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'controls'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎮</span>
            <span>Controles</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('missions');
            }}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'missions'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📋</span>
            <span>Missões</span>
          </button>
        </div>

        {/* Scrollable Content Body with Large Readable Text */}
        <div className="mt-3 flex-1 overflow-y-auto overscroll-contain pr-1 space-y-3.5 text-slate-200">
          {/* TAB 1: HIDRANTE & FUMAÇA (HIGH PRIORITY IMPROVEMENTS) */}
          {activeTab === 'recharge' && (
            <div className="space-y-3 animate-fade-in">
              {/* Card 1: Como Recarregar o Extintor */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-950/70 via-slate-950/90 to-sky-950/60 border-2 border-cyan-500/50 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🚰</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-cyan-300 uppercase tracking-wide">
                      Como Recarregar o Extintor no Hidrante
                    </h3>
                    <span className="text-[11px] text-cyan-400/90 font-bold">
                      Reabastecimento Instantâneo de 100% de Água / Espuma
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-200 mt-2">
                  <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-cyan-900/50">
                    <span className="bg-cyan-500 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full shrink-0">
                      PASSO 1
                    </span>
                    <p>
                      Quando o extintor estiver vazio (0%) ou baixo, procure os <strong>Hidrantes Vermelhos (🚰)</strong> fixados nas paredes do andar com sinalização azul.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-cyan-900/50">
                    <span className="bg-cyan-500 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full shrink-0">
                      PASSO 2
                    </span>
                    <p>
                      Aproxime o bombeiro do hidrante até aparecer o aviso <strong>[AÇÃO: Recarregar]</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-cyan-900/50">
                    <span className="bg-cyan-500 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full shrink-0">
                      PASSO 3
                    </span>
                    <p>
                      Pressione a tecla <strong>[E]</strong> ou <strong>[ENTER]</strong> no computador, ou toque no botão verde <strong>[SALVAR / INTERAGIR]</strong> no celular.
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 bg-cyan-950/90 border border-cyan-500/40 p-2.5 rounded-xl text-[11px] sm:text-xs text-cyan-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <strong>Dica de Sobrevivência:</strong> O extintor é recarregado instantaneamente em <strong>100%</strong> para que você continue avançando sem parar!
                  </span>
                </div>
              </div>

              {/* Card 2: O Perigo da Fumaça & Gases Tóxicos */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-950/70 via-slate-950/90 to-red-950/60 border-2 border-amber-500/50 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-6 h-6 text-amber-400" />
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wide">
                      O Perigo da Fumaça Tóxica
                    </h3>
                    <span className="text-[11px] text-amber-400/90 font-bold">
                      A Principal Causa de Vítimas em Incêndios
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-200">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-900/40">
                    <strong className="text-amber-300 block mb-0.5">⚠️ Inalação e Tosse (&gt; 50% de fumaça):</strong>
                    Ficar próximo a chamas e vazamentos de gás acumula calor e fumaça tóxica. O bombeiro começa a tossir e a visão periférica escurece com fuligem.
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-900/40">
                    <strong className="text-rose-300 block mb-0.5">⚠️ Lentidão e Asfixia (&gt; 65% de fumaça):</strong>
                    A fumaça densa <strong>reduz a velocidade de movimento em até 30%</strong> e provoca sufocamento contínuo se você não sair a tempo!
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-900/40">
                    <strong className="text-cyan-300 block mb-0.5">💧 Como Combater a Fumaça:</strong>
                    Acione o jato do extintor sobre a fumaça para <strong>dissipar as nuvens tóxicas</strong>, resfriar a área e criar um corredor de ar puro para você e os reféns!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTROLES DO JOGO */}
          {activeTab === 'controls' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Teclado */}
                <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-black text-sm text-orange-400 flex items-center gap-1.5">
                    <span>💻</span> Teclado (Computador):
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Movimentação:</span>
                      <strong className="text-white bg-slate-800 px-2 py-0.5 rounded font-mono">W A S D / Setas</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Usar Extintor:</span>
                      <strong className="text-cyan-400 bg-slate-800 px-2 py-0.5 rounded font-mono">Espaço</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Interagir / Hidrante:</span>
                      <strong className="text-emerald-400 bg-slate-800 px-2 py-0.5 rounded font-mono">E / Enter</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Correr Rápido:</span>
                      <strong className="text-amber-400 bg-slate-800 px-2 py-0.5 rounded font-mono">Shift</strong>
                    </li>
                  </ul>
                </div>

                {/* Celular / Toque */}
                <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-black text-sm text-orange-400 flex items-center gap-1.5">
                    <span>📱</span> Toque (Celular / Tablet):
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Direção:</span>
                      <strong className="text-white">Joystick Virtual (Esquerda)</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Extinguir Fogo / Fumaça:</span>
                      <strong className="text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded">Botão Laranja</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Salvar / Recarregar:</span>
                      <strong className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">Botão Verde</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Ajustar Altura:</span>
                      <strong className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded">Botão ↕ Altura</strong>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>
                  <strong>Ajuste no Celular:</strong> Se as barras do navegador cobrirem os botões, toque no botão <strong>↕ Altura</strong> no canto da tela para elevar os controles ou ative a <strong>Tela Cheia [⛶]</strong>.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: AS 5 MISSÕES */}
          {activeTab === 'missions' && (
            <div className="space-y-2.5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <Users className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">1. Resgatar Pessoas:</strong>
                    Aproxime-se dos civis em perigo e aperte [AÇÃO] para guiá-los até a escadaria.
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-xl shrink-0">🐾</span>
                  <div>
                    <strong className="text-white block text-sm">2. Resgatar Animais:</strong>
                    Cães, gatos e aves assustados aguardam socorro em cada andar!
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <Flame className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">3. Apagar Focos de Incêndio:</strong>
                    Mantenha o extintor direcionado para resfriar e extinguir as chamas.
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">4. Fechar Válvulas de Gás:</strong>
                    Gás inflamável alimenta chamas e fumaça tóxica. Feche os registros!
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 sm:col-span-2">
                  <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">5. Desligar Quadros Elétricos:</strong>
                    Circuitos elétricos energizados soltam faíscas perigosas. Desarme os disjuntores!
                  </div>
                </div>
              </div>

              {/* Dica CBMMG */}
              <div className="bg-amber-950/50 border border-amber-500/40 p-3 rounded-2xl text-xs sm:text-sm text-amber-200">
                <span className="font-black block text-amber-300 mb-1">
                  🚒 Regra de Ouro do Bombeiro Militar (CBMMG 193):
                </span>
                Nunca utilize elevadores durante incêndio. Havendo fumaça espessa, rasteje rente ao piso onde o ar é mais limpo e fresco!
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-3 pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-slate-950 font-black text-sm sm:text-base hover:brightness-110 active:scale-95 transition shadow-xl flex items-center justify-center gap-2"
          >
            <span>ENTENDIDO, VOLTAR AO COMBATE! 🚒</span>
          </button>
        </div>
      </div>
    </div>
  );
};
