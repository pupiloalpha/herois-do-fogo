import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle2, RotateCcw, Home } from 'lucide-react';
import { sounds } from '../audio/SoundManager';
import { CharacterId } from '../game/types';
import { CHARACTERS } from '../game/charactersData';
import { MedalDefinition, MissionId } from '../hub/types';

interface GrandVictoryModalProps {
  characterId: CharacterId;
  totalScore: number;
  missionId?: MissionId;
  newlyUnlockedMedals?: MedalDefinition[];
  onPlayAgain: () => void;
  onReturnHub?: () => void;
}

export const GrandVictoryModal: React.FC<GrandVictoryModalProps> = ({
  characterId,
  totalScore,
  missionId = 'vertical_10',
  newlyUnlockedMedals = [],
  onPlayAgain,
  onReturnHub,
}) => {
  const hero = CHARACTERS[characterId];
  const isForest = missionId === 'forest_fire';
  const isFlood = missionId === 'flood_rescue';

  useEffect(() => {
    const duration = 2.8 * 1000;
    const animationEnd = Date.now() + duration;

    const medalTimer =
      newlyUnlockedMedals.length > 0
        ? window.setTimeout(() => {
            sounds.playMedalUnlock();
          }, 820)
        : undefined;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      if (medalTimer !== undefined) window.clearTimeout(medalTimer);
    };
  }, [newlyUnlockedMedals.length]);

  const topAccentBarClass = isFlood
    ? 'from-sky-400 via-cyan-400 to-blue-500'
    : isForest
      ? 'from-emerald-400 via-teal-400 to-green-500'
      : 'from-amber-400 via-orange-500 to-red-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 select-none overflow-y-auto">
      <div className="animate-modal-enter w-full max-w-lg max-h-[92dvh] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl text-center text-slate-100">
        <div className={`h-1.5 w-full shrink-0 bg-gradient-to-r ${topAccentBarClass}`} />
        <div className="p-5 sm:p-7 overflow-y-auto overscroll-contain">
        {/* Hero Portrait */}
        <img
          src={hero.avatarUrl}
          alt={hero.name}
          referrerPolicy="no-referrer"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto border-2 border-amber-400/80 shadow-lg mb-3"
        />

        <p className="text-xs font-semibold text-amber-300">
          Herói de Minas Gerais ·{' '}
          {isFlood
            ? 'Operação Enchentes Concluída'
            : isForest
              ? 'Incêndio Florestal Concluído'
              : 'Resgate nos 10 Andares Concluído'}
        </p>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1 text-balance">
          {isFlood
            ? 'Cidade Evacuada com Sucesso'
            : isForest
              ? 'Parque Estadual Salvo'
              : 'Resgate Aéreo Concluído'}
        </h1>

        <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          {isFlood
            ? <>Famílias e animais dos 10 setores alagados foram resgatados por bote e helicóptero com <strong>{hero.name}</strong>.</>
            : isForest
              ? <>As frentes de fogo e brasas foram contidas nos 10 setores e a fauna protegida com <strong>{hero.name}</strong>.</>
              : <>O helicóptero decolou com segurança levando todas as vítimas e animais salvos com <strong>{hero.name}</strong>.</>}
        </p>

        {/* Medal Highlight */}
        <div className="my-5 rounded-xl bg-amber-500/10 border border-amber-500/25 p-4 text-left flex items-start gap-3.5">
          <Award className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-amber-300">
              {isFlood
                ? 'Medalha Herói das Enchentes CBMMG'
                : isForest
                  ? 'Medalha Protetor da Serra CBMMG'
                  : 'Medalha de Honra e Bravura CBMMG'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {isFlood
                ? 'Pelo salvamento aquático e aeromédico de famílias durante grandes enchentes.'
                : isForest
                  ? 'Pela preservação ambiental e resgate da fauna silvestre nos 10 setores.'
                  : 'Por salvar vidas humanas, animais e proteger o patrimônio coletivo.'}
            </p>
            {newlyUnlockedMedals.length > 0 && (
              <p className="text-xs text-emerald-300 font-medium mt-1.5">
                +{newlyUnlockedMedals.length} condecoração(ões) adicionada(s) à carreira
              </p>
            )}
          </div>
        </div>

        {/* Hairline Score & Status */}
        <div className="grid grid-cols-2 border-y border-white/10 py-3 mb-5 divide-x divide-white/10">
          <div className="px-2">
            <span className="text-xs text-slate-400 block">Pontuação final</span>
            <div className="flex items-center justify-center gap-1.5 text-lg sm:text-xl font-bold text-amber-300 font-mono tabular-nums mt-0.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{totalScore.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="px-2">
            <span className="text-xs text-slate-400 block">
              {isFlood ? 'Cidade' : isForest ? 'Parque' : 'Edifício'}
            </span>
            <div className="flex items-center justify-center gap-1.5 text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>100% Salvo</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {onReturnHub && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onReturnHub();
              }}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Voltar ao Hub de Operações</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onPlayAgain();
            }}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isFlood || isForest ? 'Jogar Novamente do 1º Setor' : 'Jogar Novamente do 1º Andar'}</span>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
