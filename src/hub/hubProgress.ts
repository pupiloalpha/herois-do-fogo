import { CharacterId } from '../game/types';
import { CAREER_RANKS, HUB_MEDALS, MISSIONS_BY_ID, MISSIONS_CATALOG } from './missionsCatalog';
import {
  CareerRank,
  HubLifetimeStats,
  HubSaveState,
  MedalDefinition,
  MissionId,
  MissionProgress,
  MissionProgressSummary,
} from './types';

const HUB_STORAGE_KEY = 'cbmmg_hub_save_v1';

function createDefaultMissionProgress(): MissionProgress {
  return {
    unlockedStage: 1,
    stages: {},
  };
}

export function createDefaultHubSaveState(): HubSaveState {
  return {
    version: 1,
    selectedCharacter: 'foguinho',
    missions: {
      vertical_10: createDefaultMissionProgress(),
      flood_rescue: createDefaultMissionProgress(),
      forest_fire: createDefaultMissionProgress(),
    },
    stats: {
      totalCiviliansSaved: 0,
      totalPetsSaved: 0,
      totalFiresExtinguished: 0,
      totalStagesCleared: 0,
      totalOperationsCompleted: 0,
      highestStageScore: 0,
    },
    unlockedMedals: [],
  };
}

export function loadHubSaveState(): HubSaveState {
  const defaults = createDefaultHubSaveState();
  try {
    const raw = localStorage.getItem(HUB_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<HubSaveState>;
    if (!parsed || typeof parsed !== 'object') return defaults;

    const selectedCharacter: CharacterId =
      parsed.selectedCharacter === 'faisca' || parsed.selectedCharacter === 'foguinho'
        ? parsed.selectedCharacter
        : 'foguinho';

    const missions: Record<MissionId, MissionProgress> = {
      vertical_10: {
        unlockedStage: Math.max(1, Math.min(10, Number(parsed.missions?.vertical_10?.unlockedStage) || 1)),
        stages: parsed.missions?.vertical_10?.stages ?? {},
      },
      flood_rescue: {
        unlockedStage: Math.max(1, Math.min(10, Number(parsed.missions?.flood_rescue?.unlockedStage) || 1)),
        stages: parsed.missions?.flood_rescue?.stages ?? {},
      },
      forest_fire: {
        unlockedStage: Math.max(1, Math.min(10, Number(parsed.missions?.forest_fire?.unlockedStage) || 1)),
        stages: parsed.missions?.forest_fire?.stages ?? {},
      },
    };

    return {
      version: 1,
      selectedCharacter,
      missions,
      stats: {
        totalCiviliansSaved: Number(parsed.stats?.totalCiviliansSaved) || 0,
        totalPetsSaved: Number(parsed.stats?.totalPetsSaved) || 0,
        totalFiresExtinguished: Number(parsed.stats?.totalFiresExtinguished) || 0,
        totalStagesCleared: Number(parsed.stats?.totalStagesCleared) || 0,
        totalOperationsCompleted: Number(parsed.stats?.totalOperationsCompleted) || 0,
        highestStageScore: Number(parsed.stats?.highestStageScore) || 0,
      },
      unlockedMedals: Array.isArray(parsed.unlockedMedals) ? parsed.unlockedMedals : [],
    };
  } catch {
    return defaults;
  }
}

export function saveHubState(state: HubSaveState): void {
  try {
    localStorage.setItem(HUB_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

export function resetHubSaveState(): HubSaveState {
  const fresh = createDefaultHubSaveState();
  saveHubState(fresh);
  return fresh;
}

export function getMissionProgressSummary(
  save: HubSaveState,
  missionId: MissionId
): MissionProgressSummary {
  const catalog = MISSIONS_BY_ID[missionId];
  const progress = save.missions[missionId] ?? createDefaultMissionProgress();
  const totalStages = catalog.totalStages;

  let completedStages = 0;
  let earnedStars = 0;
  let totalBestScore = 0;

  for (let stage = 1; stage <= totalStages; stage++) {
    const rec = progress.stages[stage];
    if (rec?.completed) {
      completedStages++;
      earnedStars += Math.max(0, Math.min(3, rec.stars || 0));
      totalBestScore += rec.bestScore || 0;
    }
  }

  const unlockedStage = Math.max(1, Math.min(totalStages, progress.unlockedStage || 1));
  const nextStageToPlay = completedStages >= totalStages ? 1 : unlockedStage;

  return {
    completedStages,
    totalStages,
    earnedStars,
    maxStars: totalStages * 3,
    totalBestScore,
    nextStageToPlay,
    unlockedStage,
  };
}

export function getTotalHubStars(save: HubSaveState): { earned: number; max: number } {
  let earned = 0;
  let max = 0;
  for (const mission of MISSIONS_CATALOG) {
    const summary = getMissionProgressSummary(save, mission.id);
    earned += summary.earnedStars;
    max += summary.maxStars;
  }
  return { earned, max };
}

export function getCareerRank(totalStars: number): {
  current: CareerRank;
  next: CareerRank | null;
  progressPercent: number;
} {
  let current = CAREER_RANKS[0];
  let next: CareerRank | null = CAREER_RANKS[1] ?? null;

  for (let i = 0; i < CAREER_RANKS.length; i++) {
    if (totalStars >= CAREER_RANKS[i].minStars) {
      current = CAREER_RANKS[i];
      next = CAREER_RANKS[i + 1] ?? null;
    }
  }

  if (!next) {
    return { current, next: null, progressPercent: 100 };
  }

  const span = Math.max(1, next.minStars - current.minStars);
  const gained = Math.max(0, totalStars - current.minStars);
  const progressPercent = Math.min(100, Math.round((gained / span) * 100));

  return { current, next, progressPercent };
}

export interface RecordStageClearParams {
  missionId: MissionId;
  stageNumber: number;
  score: number;
  stars: number;
  civiliansSaved?: number;
  petsSaved?: number;
  firesExtinguished?: number;
}

export function recordStageClear(
  save: HubSaveState,
  params: RecordStageClearParams
): { nextSave: HubSaveState; newlyUnlockedMedals: MedalDefinition[] } {
  const {
    missionId,
    stageNumber,
    score,
    stars,
    civiliansSaved = 0,
    petsSaved = 0,
    firesExtinguished = 0,
  } = params;

  const catalog = MISSIONS_BY_ID[missionId];
  const prevMission = save.missions[missionId] ?? createDefaultMissionProgress();
  const prevRecord = prevMission.stages[stageNumber];

  const clampedStars = Math.max(1, Math.min(3, Math.round(stars)));
  const wasStageCompletedBefore = Boolean(prevRecord?.completed);

  const nextStages = {
    ...prevMission.stages,
    [stageNumber]: {
      completed: true,
      stars: Math.max(prevRecord?.stars ?? 0, clampedStars),
      bestScore: Math.max(prevRecord?.bestScore ?? 0, score),
    },
  };

  const nextUnlockedStage = Math.min(
    catalog.totalStages,
    Math.max(prevMission.unlockedStage, stageNumber + 1)
  );

  const nextStats: HubLifetimeStats = {
    totalCiviliansSaved: save.stats.totalCiviliansSaved + civiliansSaved,
    totalPetsSaved: save.stats.totalPetsSaved + petsSaved,
    totalFiresExtinguished: save.stats.totalFiresExtinguished + firesExtinguished,
    totalStagesCleared: save.stats.totalStagesCleared + 1,
    totalOperationsCompleted:
      save.stats.totalOperationsCompleted +
      (stageNumber >= catalog.totalStages && !wasStageCompletedBefore ? 1 : 0),
    highestStageScore: Math.max(save.stats.highestStageScore, score),
  };

  const candidateSave: HubSaveState = {
    ...save,
    missions: {
      ...save.missions,
      [missionId]: {
        unlockedStage: nextUnlockedStage,
        stages: nextStages,
      },
    },
    stats: nextStats,
  };

  const newlyUnlockedMedals: MedalDefinition[] = [];
  const nextMedalSet = new Set(save.unlockedMedals);

  const unlock = (medalId: string) => {
    if (!nextMedalSet.has(medalId)) {
      nextMedalSet.add(medalId);
      const found = HUB_MEDALS.find(m => m.id === medalId);
      if (found) newlyUnlockedMedals.push(found);
    }
  };

  if (nextStats.totalStagesCleared >= 1) unlock('first_floor_clear');
  if (clampedStars >= 3) unlock('perfection_three_stars');
  if (nextStats.totalCiviliansSaved >= 10) unlock('lifesaver_10');
  if (nextStats.totalPetsSaved >= 5) unlock('pet_protector_5');
  if (nextStats.totalPetsSaved >= 10) unlock('wildlife_guardian');
  if (nextStats.totalFiresExtinguished >= 25) unlock('fire_suppressor_25');
  if (missionId === 'vertical_10' && stageNumber >= catalog.totalStages) {
    unlock('vertical_10_hero');
  }
  if (missionId === 'forest_fire' && stageNumber >= catalog.totalStages) {
    unlock('forest_park_hero');
  }

  const nextSave: HubSaveState = {
    ...candidateSave,
    unlockedMedals: Array.from(nextMedalSet),
  };

  saveHubState(nextSave);
  return { nextSave, newlyUnlockedMedals };
}
