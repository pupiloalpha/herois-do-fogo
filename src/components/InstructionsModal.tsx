import React, { useState } from 'react';
import { X, Flame, Trees, Waves, ShieldAlert, Keyboard, Smartphone } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface InstructionsModalProps {
  onClose: () => void;
  initialTab?: TabType;
}

export type TabType = 'missions' | 'tactics' | 'controls';

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  onClose,
  initialTab = 'missions',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="w-full max-w-2xl max-h-[92dvh] rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-amber-300">
              Corpo de Bombeiros Militar de MG · 193
            </p>
            <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
              Manual Operacional
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Fechar manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Clean Segmented Tabs */}
        <div className="px-5 pt-3 shrink-0">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('missions');
              }}
              className={`min-h-[38px] px-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap truncate ${
                activeTab === 'missions'
                  ? 'bg-orange-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Missões
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('tactics');
              }}
              className={`min-h-[38px] px-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap truncate ${
                activeTab === 'tactics'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Táticas e Riscos
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('controls');
              }}
              className={`min-h-[38px] px-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap truncate ${
                activeTab === 'controls'
                  ? 'bg-sky-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Controles
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 flex-1 overflow-y-auto overscroll-contain space-y-4 text-xs sm:text-sm text-slate-300">
          {/* TAB 1: AS 3 MISSÕES */}
          {activeTab === 'missions' && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
                  <Flame className="w-4 h-4 shrink-0" />
                  <span>1. Resgate nos 10 Andares</span>
                </div>
                <p className="leading-relaxed">
                  Suba 10 andares em chamas até o heliponto. Apague focos com o extintor, dissipe nuvens de fumaça tóxica, feche válvulas de gás GLP, desligue quadros elétricos e evacue pessoas e animais.
                </p>
              </div>

              <div className="pb-4 border-b border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm sm:text-base">
                  <Trees className="w-4 h-4 shrink-0" />
                  <span>2. Incêndio Florestal</span>
                </div>
                <p className="leading-relaxed">
                  Contenha queimadas em 10 setores do parque estadual observando o vento. Alterne entre enxada (aceiros), abafador, bomba costal de água e pá (para enterrar troncos em brasa), além de salvar fauna silvestre e trilheiros.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-sm sm:text-base">
                  <Waves className="w-4 h-4 shrink-0" />
                  <span>3. Operação Enchentes</span>
                </div>
                <p className="leading-relaxed">
                  Navegue por 10 setores alagados com o Bote CBMMG (até 3 resgates por viagem) e o Helicóptero Arcanjo (guincho). Resgate pessoas e animais em carros afundando, telhados e ilhas, desembarcando no Abrigo Seguro (H).
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-1.5">
                <h3 className="text-xs font-semibold text-white">Especialidades dos bombeiros</h3>
                <p>
                  <strong className="text-amber-300">Foguinho:</strong> 135 HP, -45% de dano térmico e tanque ampliado (125%).
                </p>
                <p>
                  <strong className="text-orange-300">Faísca:</strong> +31% de velocidade e resgate 60% mais rápido.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TÁTICAS E RISCOS */}
          {activeTab === 'tactics' && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-white">Recarga de água e combustível</h3>
                <p>
                  <strong className="text-amber-300">Hidrantes (Prédio) e Riachos (Floresta):</strong> aproxime-se e pressione <strong>[E]</strong> ou <strong>[Ação]</strong> para recarga instantânea e ilimitada de 100%.
                </p>
                <p>
                  <strong className="text-sky-300">Abrigo Seguro H (Enchentes):</strong> desembarca resgatados, repara o veículo e reabastece combustível.
                </p>
              </div>

              <div className="pb-4 border-b border-white/10 space-y-2">
                <h3 className="text-sm font-bold text-emerald-300">Ferramentas florestais (Teclas 1 a 4)</h3>
                <ul className="space-y-1.5">
                  <li><strong>[1] Enxada (Aceiro):</strong> raspa a vegetação à frente do fogo para bloquear a passagem.</li>
                  <li><strong>[2] Abafador:</strong> apaga chamas rasteiras sem gastar água.</li>
                  <li><strong>[3] Bomba Costal:</strong> jato de água para focos altos e intensos.</li>
                  <li><strong>[4] Pá:</strong> cobre troncos em brasa com terra para evitar reignição pelo vento.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Principais perigos</span>
                </h3>
                <ul className="space-y-1.5">
                  <li><strong>Fumaça densa (Prédio):</strong> reduz velocidade e drena saúde; disperse com o jato.</li>
                  <li><strong>Limite de queima (Floresta):</strong> não deixe o incêndio consumir mais que a cota do setor.</li>
                  <li><strong>Postes energizados e correnteza (Enchentes):</strong> desvie dos halos amarelos e use Turbo para vencer a correnteza.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CONTROLES E DICAS CBMMG */}
          {activeTab === 'controls' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/10">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <Keyboard className="w-4 h-4" />
                    <span>Computador</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Mover</span>
                      <span className="font-mono text-white">WASD / Setas</span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Correr</span>
                      <span className="font-mono text-white">Shift</span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Jato / Ferramenta / Turbo</span>
                      <span className="font-mono text-white">Espaço</span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Ação / Resgate / Recarga</span>
                      <span className="font-mono text-white">E / Enter</span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Trocar ferramenta / veículo</span>
                      <span className="font-mono text-white">1–4 / Q</span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Pausar</span>
                      <span className="font-mono text-white">Esc / P</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-sky-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" />
                    <span>Celular e Tablet</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Mover e correr</span>
                      <span className="font-medium text-white">Joystick à esquerda</span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Jato / Ferramenta / Turbo</span>
                      <span className="font-medium text-white">Botão laranja</span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Salvar / Recarga</span>
                      <span className="font-medium text-white">Botão contextual</span>
                    </li>
                    <li className="flex justify-between gap-2">
                      <span className="text-slate-400">Ajuste de altura</span>
                      <span className="font-medium text-white">Menu Pausa · Elevar</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-amber-300">Prevenção CBMMG 193</h3>
                <p><strong>Em edifícios:</strong> nunca use elevadores durante incêndio; use escadas de emergência.</p>
                <p><strong>Em matas:</strong> não acenda fogueiras nem descarte bitucas; denuncie queimadas no 193.</p>
                <p><strong>Em enxurradas:</strong> não atravesse áreas alagadas a pé ou de carro; busque lugar alto.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-4 border-t border-white/10 bg-slate-950/40 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm active:scale-[0.98] transition cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
