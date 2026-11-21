import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle, RotateCcw, Home } from 'lucide-react';
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

  useEffect(() => {
    // Multi-stage confetti celebration
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-fade-in select-none overflow-y-auto">
      <div className="w-full max-w-lg max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl border-3 border-amber-400 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-8 shadow-2xl text-center text-white relative">
        {/* CBMMG Ribbon Badge */}
        <div className="relative inline-block mb-4">
          <img
            src={hero.avatarUrl}
            alt={hero.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mx-auto border-4 border-amber-400 shadow-2xl ring-8 ring-amber-400/20"
          />
          <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md">
            HERÓI DE MINAS GERAIS
          </div>
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mt-2">
          {isForest ? 'OPERAÇÃO INCÊNDIO FLORESTAL CONCLUÍDA!' : 'OPERAÇÃO 10 ANDARES CONCLUÍDA!'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          {isForest ? 'PARQUE ESTADUAL SALVO!' : 'VITÓRIA TOTAL & RESGATE AÉREO!'}
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          {isForest
            ? <>Todas as frentes de incêndio e brasas foram contidas nos 10 setores e os animais silvestres foram protegidos graças à sua bravura com <strong>{hero.name}</strong>!</>
            : <>O helicóptero decolou com segurança levando todas as vítimas e animais salvos! O incêndio foi completamente controlado graças à sua bravura com <strong>{hero.name}</strong>!</>}
        </p>

        {/* Medalha Card */}
        <div className="my-5 bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 text-left flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Award className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300">
              {isForest ? 'Medalha Guardião da Serra CBMMG' : 'Medalha de Honra e Bravura CBMMG'}
            </h3>
            <p className="text-xs text-slate-400">
              {isForest
                ? 'Concedida pelo Corpo de Bombeiros Militar pela preservação ambiental e resgate da fauna silvestre.'
                : 'Concedida pelo Corpo de Bombeiros Militar por salvar vidas humanas, animais e proteger o patrimônio coletivo.'}
            </p>
            {newlyUnlockedMedals.length > 0 && (
              <p className="text-xs text-emerald-300 font-semibold mt-1">
                +{newlyUnlockedMedals.length} medalha(s) adicionada(s) ao Hub!
              </p>
            )}
          </div>
        </div>

        {/* Score & Rescues */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              PONTUAÇÃO FINAL
            </span>
            <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black text-amber-400 font-mono mt-0.5">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>{totalScore.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              {isForest ? 'STATUS DO PARQUE' : 'STATUS DO EDIFÍCIO'}
            </span>
            <div className="flex items-center justify-center gap-1.5 text-base sm:text-lg font-black text-emerald-400 mt-1">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>{isForest ? 'FAUNA SALVA!' : '100% SALVO!'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {onReturnHub && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onReturnHub();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 font-black text-base shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span>VOLTAR AO HUB DE OPERAÇÕES</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isForest ? 'JOGAR NOVAMENTE DO 1º SETOR' : 'JOGAR NOVAMENTE DO 1º ANDAR'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
