import React, { useState } from 'react';
import {
  X,
  Flame,
  Shield,
  Zap,
  AlertTriangle,
  Users,
  Wind,
  CheckCircle2,
  Droplets,
  Trees,
  Award,
  Sparkles,
  Compass,
  ArrowRight,
  LifeBuoy,
  Heart,
  ChevronRight,
  Shovel,
} from 'lucide-react';
import { sounds } from '../audio/SoundManager';
import { CAREER_RANKS, HUB_MEDALS } from '../hub/missionsCatalog';

interface InstructionsModalProps {
  onClose: () => void;
  initialTab?: TabType;
}

export type TabType = 'missions' | 'forest' | 'recharge' | 'controls' | 'career';

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose, initialTab = 'missions' }) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-3xl max-h-[95dvh] rounded-3xl border-2 border-orange-500/50 bg-slate-900/98 p-3 sm:p-5 sm:pb-6 shadow-2xl text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-2xl sm:text-3xl">🚒</span>
            <div>
              <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>Manual Operacional do Bombeiro</span>
                <span className="hidden sm:inline text-xs font-normal text-slate-400">| Hub de Missões</span>
              </h2>
              <span className="text-[10px] sm:text-xs text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <span>Corpo de Bombeiros Militar de MG (193)</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            aria-label="Fechar manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation with Horizontal Scroll for Mobile */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mt-2.5 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('missions');
            }}
            className={`py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'missions'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📋</span>
            <span>Missões</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('forest');
            }}
            className={`py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'forest'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌲</span>
            <span>Combate Florestal</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('recharge');
            }}
            className={`py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'recharge'
                ? 'bg-gradient-to-r from-cyan-600 to-sky-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🚰</span>
            <span>Recarga & Perigos</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('controls');
            }}
            className={`py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'controls'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎮</span>
            <span>Controles</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('career');
            }}
            className={`py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'career'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎖️</span>
            <span>Carreira & Dicas</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="mt-3 flex-1 overflow-y-auto overscroll-contain pr-1 space-y-3.5 text-slate-200 text-xs sm:text-sm">
          {/* TAB 1: VISÃO GERAL DAS MISSÕES DO HUB */}
          {activeTab === 'missions' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center gap-2.5 text-slate-300">
                <span className="text-xl sm:text-2xl shrink-0">🚒</span>
                <p className="leading-snug">
                  O <strong>Hub de Operações do CBMMG</strong> reúne missões oficiais em diferentes teatros de operação. Selecione a operação no painel inicial e cumpra os objetivos para subir de patente militar!
                </p>
              </div>

              {/* Missão 1: 10 Andares */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-orange-950/60 via-slate-950/90 to-amber-950/50 border border-orange-500/50 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-orange-400 uppercase tracking-wide">
                        Missão 1: Resgate nos 10 Andares
                      </h3>
                      <span className="text-[11px] text-amber-300 font-semibold">
                        Combate a Incêndio Predial Estrutural · 10 Andares (Ativa)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold text-[10px] uppercase">
                    10 Andares
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Um grave incêndio se iniciou no térreo de um edifício corporativo e residencial. Suba andar por andar contendo o fogo até a evacuação de helicóptero no heliponto da cobertura!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-orange-900/40 flex items-start gap-2">
                    <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Apagar Focos de Incêndio:</strong>
                      Extinga chamas com o esguicho pressurizado antes que se alastrem.
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-orange-900/40 flex items-start gap-2">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Resgatar Pessoas & Animais:</strong>
                      Aproxime-se dos civis e animais e aperte [AÇÃO] para salvá-los.
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-orange-900/40 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Fechar Válvulas de Gás GLP:</strong>
                      Corte o fornecimento de gás para evitar explosões e reignições.
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-orange-900/40 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Desligar Painéis Elétricos:</strong>
                      Desarme quadros de alta tensão energizados que soltam faíscas.
                    </div>
                  </div>
                </div>
              </div>

              {/* Missão 2: Incêndio Florestal */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-950/90 to-teal-950/50 border border-emerald-500/50 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌲</span>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-emerald-400 uppercase tracking-wide">
                        Missão 2: Incêndio Florestal
                      </h3>
                      <span className="text-[11px] text-teal-300 font-semibold">
                        Defesa do Parque Estadual da Serra · 10 Setores (Ativa)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] uppercase">
                    10 Setores
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Queimadas graves avançam pela vegetação do parque estadual. Assuma o combate em campo aberto utilizando as ferramentas operacionais de combate florestal do CBMMG!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-emerald-900/40 flex items-start gap-2">
                    <span className="text-base shrink-0">⛏️</span>
                    <div>
                      <strong className="text-white block text-xs">4 Ferramentas Especializadas:</strong>
                      Enxada (abrir aceiros), Abafador, Bomba Costal de água e Pá para brasas.
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-emerald-900/40 flex items-start gap-2">
                    <span className="text-base shrink-0">🐾</span>
                    <div>
                      <strong className="text-white block text-xs">Salvar Fauna Silvestre:</strong>
                      Resgate lobos-guará, tucanos, tamanduás, tatus e retire turistas ilhados.
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-emerald-900/40 flex items-start gap-2">
                    <span className="text-base shrink-0">🌊</span>
                    <div>
                      <strong className="text-white block text-xs">Recarga em Riachos:</strong>
                      Abasteça sua Bomba Costal nas nascentes e riachos do parque.
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-emerald-900/40 flex items-start gap-2">
                    <Wind className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Vento Dinâmico & Limite:</strong>
                      Monitore a direção do vento e não permita que o fogo devaste mais de 65% do parque.
                    </div>
                  </div>
                </div>
              </div>

              {/* Missão 3: Operação Enchentes */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-950/90 to-sky-950/50 border border-cyan-500/40 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚤</span>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-cyan-400 uppercase tracking-wide">
                        Missão 3: Operação Enchentes
                      </h3>
                      <span className="text-[11px] text-sky-300 font-semibold">
                        Resgate Aquático e Aéreo · 10 Setores (Em Breve no Hub)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-[10px] uppercase">
                    Em Breve
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Inundações repentinas tomaram a cidade e comunidades ribeirinhas. Pilote o bote de resgate rápido e o Helicóptero Arcanjo com guincho para salvar famílias ilhadas em telhados, carros submersos e ilhas fluviais sob forte correnteza.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: COMBATE FLORESTAL & AS 4 FERRAMENTAS */}
          {activeTab === 'forest' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-emerald-200">
                <Trees className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-black text-emerald-300 text-xs sm:text-sm">
                    Táticas do Bombeiro Florestal (Incêndio no Parque Estadual)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                    O combate a queimadas em mata aberta exige ferramentas combinadas e leitura do vento. Alterne as ferramentas com as teclas <strong>[1, 2, 3, 4]</strong> ou <strong>[Q]</strong> no PC, ou toque nos botões na tela do celular!
                  </p>
                </div>
              </div>

              {/* As 4 Ferramentas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Enxada */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm">
                      <span className="text-lg">⛏️</span> Enxada (Aceiro)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-[10px] font-bold">
                      Tecla 1
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                    <strong>Criação de Linhas de Aceiro:</strong> Raspa o capim e vegetação combustível até expor a terra nua mineral. O fogo não se propaga sobre solo limpo, isolando o foco!
                  </p>
                  <div className="bg-amber-950/40 p-1.5 rounded-lg text-[10px] text-amber-200 flex items-center gap-1.5">
                    <span>💡</span>
                    <span><strong>Tática:</strong> Abra aceiros à frente da linha de fogo, na direção em que o vento sopra!</span>
                  </div>
                </div>

                {/* 2. Abafador */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-orange-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-orange-300 flex items-center gap-1.5 text-xs sm:text-sm">
                      <span className="text-lg">🧹</span> Abafador Florestal
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-orange-400 font-mono text-[10px] font-bold">
                      Tecla 2
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                    <strong>Sufocamento Mecânico:</strong> Golpeia e abafa chamas rasteiras em capim seco e folhas caídas, cortando o oxigênio instantaneamente sem gastar nenhuma água.
                  </p>
                  <div className="bg-orange-950/40 p-1.5 rounded-lg text-[10px] text-orange-200 flex items-center gap-1.5">
                    <span>💡</span>
                    <span><strong>Tática:</strong> Perfeito para economizar água e extinguir fogo rasteiro rapidamente!</span>
                  </div>
                </div>

                {/* 3. Bomba Costal / Água */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-sky-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sky-300 flex items-center gap-1.5 text-xs sm:text-sm">
                      <span className="text-lg">💧</span> Bomba Costal (Água)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-mono text-[10px] font-bold">
                      Tecla 3
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                    <strong>Jato Pressurizado de Água:</strong> Dispara água para resfriar e extinguir labaredas intensas em árvores e arbustos densos onde ferramentas manuais não alcançam.
                  </p>
                  <div className="bg-sky-950/40 p-1.5 rounded-lg text-[10px] text-sky-200 flex items-center gap-1.5">
                    <span>💡</span>
                    <span><strong>Recarga:</strong> Quando a água acabar, reabasteça 100% nos riachos com [AÇÃO]!</span>
                  </div>
                </div>

                {/* 4. Pá */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-300 flex items-center gap-1.5 text-xs sm:text-sm">
                      <span className="text-lg">🪣</span> Pá (Terra & Brasas)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[10px] font-bold">
                      Tecla 4
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                    <strong>Enterro de Troncos e Brasas:</strong> Troncos pretos fumegantes possuem brasas profundas no miolo que reacendem com o vento. Use a pá para cobri-los de terra!
                  </p>
                  <div className="bg-emerald-950/40 p-1.5 rounded-lg text-[10px] text-emerald-200 flex items-center gap-1.5">
                    <span>💡</span>
                    <span><strong>Tática:</strong> Não deixe troncos fumegando para trás, ou o vento reacenderá o fogo!</span>
                  </div>
                </div>
              </div>

              {/* Vento, Fauna e Limite de Queima */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Dinâmica do Parque: Vento, Fauna e Limite de Área Queimada</span>
                </h4>
                <div className="space-y-1.5 text-slate-300 text-[11px] sm:text-xs">
                  <p>
                    💨 <strong>Vento Dinâmico:</strong> As partículas de ar mostram a direção do vento. Chamas propagam com o dobro de velocidade a favor do vento e podem projetar faíscas distantes.
                  </p>
                  <p>
                    🦊 <strong>Fauna Silvestre Brasileira:</strong> Resgate lobos-guará, tucanos, tamanduás e tatus encurralados pelo fogo. Aproxime-se e pressione [AÇÃO] para salvá-los e garantir medalhas especiais!
                  </p>
                  <p>
                    ⚠️ <strong>Limite de Queima da Vegetação:</strong> Cada setor possui uma tolerância máxima (ex: 65%). Se a área queimada ultrapassar o limite, a missão fracassa. Aja rápido!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RECARGA DE ÁGUA & PERIGOS */}
          {activeTab === 'recharge' && (
            <div className="space-y-3 animate-fade-in">
              {/* Card 1: Como Recarregar o Extintor e a Bomba Costal */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-950/70 via-slate-950/90 to-sky-950/60 border-2 border-cyan-500/50 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🚰</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-cyan-300 uppercase tracking-wide">
                      Recarga Instantânea de Água (Hidrantes & Riachos)
                    </h3>
                    <span className="text-[11px] text-cyan-400/90 font-bold">
                      Reabastecimento Imediato de 100% de Capacidade
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-200 mt-2">
                  <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-cyan-900/50">
                    <span className="bg-orange-500 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full shrink-0">
                      🏢 PRÉDIO
                    </span>
                    <p>
                      <strong>Hidrantes de Parede Vermelhos (🚰):</strong> Fixados nos corredores e salas com sinalização circular azul. Aproxime-se e aperte <strong>[E] / [Enter]</strong> no teclado ou <strong>[AÇÃO]</strong> no celular para encher 100% do extintor.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-cyan-900/50">
                    <span className="bg-emerald-500 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full shrink-0">
                      🌲 FLORESTA
                    </span>
                    <p>
                      <strong>Riachos e Nascentes Naturais (🌊):</strong> Cursos d'água cristalinos atravessam o parque. Aproxime-se da margem e aperte <strong>[E] / [Enter]</strong> no PC ou <strong>[AÇÃO]</strong> no celular para encher 100% da Bomba Costal.
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 bg-cyan-950/90 border border-cyan-500/40 p-2.5 rounded-xl text-[11px] sm:text-xs text-cyan-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <strong>Dica de Ouro:</strong> A recarga é instantânea e ilimitada. Não hesite em abastecer antes de enfrentar grandes focos de fogo!
                  </span>
                </div>
              </div>

              {/* Card 2: Fumaça Tóxica vs. Brasas Reincidentes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Fumaça Predial */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/70 via-slate-950/90 to-red-950/60 border border-amber-500/50 shadow-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-amber-400" />
                    <h4 className="text-xs sm:text-sm font-black text-amber-300 uppercase">
                      Fumaça Tóxica (Prédio)
                    </h4>
                  </div>
                  <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                    <p>
                      <strong>Inalação & Tosse (&gt; 50%):</strong> A fumaça acumulada escurece a visão periférica com fuligem.
                    </p>
                    <p>
                      <strong>Lentidão & Asfixia (&gt; 65%):</strong> Reduz a velocidade em 30% e drena a saúde do bombeiro.
                    </p>
                    <p className="text-cyan-300 font-semibold">
                      💧 Jogue o jato do extintor sobre as nuvens escuras para dissipar a fumaça e abrir passagem segura!
                    </p>
                  </div>
                </div>

                {/* Brasas e Vento Florestal */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/70 via-slate-950/90 to-orange-950/60 border border-red-500/50 shadow-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-400" />
                    <h4 className="text-xs sm:text-sm font-black text-red-300 uppercase">
                      Troncos em Brasa (Floresta)
                    </h4>
                  </div>
                  <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                    <p>
                      <strong>Brasas Ocultas:</strong> Troncos queimados continuam incandescentes no interior da madeira.
                    </p>
                    <p>
                      <strong>Reignição com Rajadas:</strong> Se o vento soprar forte sobre uma brasa, o fogo renasce com vigor.
                    </p>
                    <p className="text-emerald-300 font-semibold">
                      🪣 Use a pá de terra para enterrar o tronco e extinguir o foco de calor de forma permanente!
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Bombeiros Foguinho vs. Faísca */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>🧑‍🚒</span> Atributos Únicos dos Personagens
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-900/40">
                    <strong className="text-amber-300 block mb-0.5">Foguinho (Resistência Máxima):</strong>
                    135 HP, <strong>-45% de dano por calor</strong> e tanque de extintor/bomba costal ampliado em 125%. Ideal para contenção bruta no calor intenso!
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-orange-900/40">
                    <strong className="text-orange-300 block mb-0.5">Faísca (Agilidade Suprema):</strong>
                    Velocidade de 255 (<strong>+31% mais rápida</strong>) e resgate 60% mais ágil de pessoas e animais. Ideal para evacuações expressas contra o relógio!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTROLES COMPLETOS */}
          {activeTab === 'controls' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Teclado PC */}
                <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-black text-xs sm:text-sm text-orange-400 flex items-center gap-1.5">
                    <span>💻</span> Teclado (Computador):
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Movimentação:</span>
                      <strong className="text-white bg-slate-800 px-2 py-0.5 rounded font-mono">W A S D / Setas</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Correr Rápido (Sprint):</span>
                      <strong className="text-amber-400 bg-slate-800 px-2 py-0.5 rounded font-mono">Shift</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Acionar Extintor / Ferramenta:</span>
                      <strong className="text-cyan-400 bg-slate-800 px-2 py-0.5 rounded font-mono">Espaço</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Ação / Salvar / Hidrante / Riacho:</span>
                      <strong className="text-emerald-400 bg-slate-800 px-2 py-0.5 rounded font-mono">E / Enter</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Ferramentas Florestais:</span>
                      <strong className="text-yellow-300 bg-slate-800 px-2 py-0.5 rounded font-mono">1, 2, 3, 4</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Alternar Ferramenta Ciclicamente:</span>
                      <strong className="text-purple-300 bg-slate-800 px-2 py-0.5 rounded font-mono">Q</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Pausar Missão:</span>
                      <strong className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded font-mono">Esc / P</strong>
                    </li>
                  </ul>
                </div>

                {/* Toque Mobile */}
                <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-black text-xs sm:text-sm text-orange-400 flex items-center gap-1.5">
                    <span>📱</span> Toque (Celular & Tablet):
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Mover & Correr:</span>
                      <strong className="text-white">Joystick (arraste à borda)</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Acionar Extintor / Ferramenta:</span>
                      <strong className="text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded">Botão Laranja</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Ação Dinâmica (Salvar/Recarga):</span>
                      <strong className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">Botão Verde</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Troca Rápida de Ferramentas:</span>
                      <strong className="text-yellow-300">Barra de Ícones na Tela</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Elevar Botões do Rodapé:</span>
                      <strong className="text-amber-400 bg-slate-800 px-2 py-0.5 rounded font-mono">Botão ▲ Elevar</strong>
                    </li>
                    <li className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl">
                      <span>Modo Imersivo:</span>
                      <strong className="text-cyan-400 bg-slate-800 px-2 py-0.5 rounded font-mono">⛶ Tela Cheia</strong>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>
                  <strong>Ajuste no Celular:</strong> Se as barras do navegador cobrirem os botões, toque em <strong>[▲ Elevar]</strong> no rodapé ou ative a <strong>Tela Cheia (⛶)</strong> para jogar sem nenhuma interferência!
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: CARREIRA MILITAR & DICAS CBMMG */}
          {activeTab === 'career' && (
            <div className="space-y-3 animate-fade-in">
              {/* Patentes Militares */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 via-slate-950/90 to-yellow-950/50 border border-amber-500/50 shadow-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase">
                    Quadro de Progressão de Patentes do CBMMG
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  Acumule estrelas completando fases e andares com perfeição em todas as missões do Hub para ser promovido pelo comando:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {CAREER_RANKS.map((rank) => (
                    <div
                      key={rank.id}
                      className="p-2 rounded-xl bg-slate-900/90 border border-amber-900/40 flex items-center gap-2"
                    >
                      <span className="text-xl shrink-0">{rank.insignia}</span>
                      <div className="min-w-0">
                        <strong className="text-white text-xs block truncate">{rank.title}</strong>
                        <span className="text-[10px] text-amber-400 font-bold">{rank.minStars} ★ mínimas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medalhas de Mérito */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    Medalhas de Mérito por Bravura
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
                  {HUB_MEDALS.map((medal) => (
                    <div
                      key={medal.id}
                      className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2"
                    >
                      <span className="text-lg shrink-0">{medal.icon}</span>
                      <div>
                        <strong className="text-white block">{medal.title}</strong>
                        <span className="text-slate-400 text-[10px]">{medal.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regras de Ouro CBMMG 193 */}
              <div className="bg-amber-950/50 border border-amber-500/40 p-3 rounded-2xl text-xs text-amber-200 space-y-1.5">
                <span className="font-black text-amber-300 block flex items-center gap-1.5">
                  <span>🚨</span> Regras de Ouro de Segurança (CBMMG 193):
                </span>
                <p>
                  • <strong>Em Edifícios:</strong> Nunca use elevador durante incêndio. Utilize as escadas pressurizadas de emergência. Havendo fumaça espessa, rasteje rente ao piso onde o ar é mais fresco.
                </p>
                <p>
                  • <strong>Em Florestas e Serras:</strong> Nunca jogue bitucas de cigarro pela janela do veículo nem acenda fogueiras próximas à vegetação seca. Denuncie queimadas ilegais imediatamente no 193!
                </p>
                <p>
                  • <strong>Em Tempestades e Inundações:</strong> Nunca tente atravessar enxurradas ou pontes cobertas por água. Busque sempre áreas altas e seguras e acione os Bombeiros.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ENTENDIDO, VOLTAR À OPERAÇÃO! 🚒</span>
          </button>
        </div>
      </div>
    </div>
  );
};
