import { CharacterId } from '../game/types';

export type MissionId = 'vertical_10' | 'flood_rescue' | 'forest_fire';

export type MissionStatus = 'playable' | 'coming_soon';

export type MissionAccent = 'orange' | 'cyan' | 'emerald';

export interface PrimaryControlMeta {
  icon: string;
  activeIcon?: string;
  label: string;
  activeLabel?: string;
  emptyLabel?: string;
}

export interface MissionCatalogEntry {
  id: MissionId;
  title: string;
  subtitle: string;
  badgeEmoji: string;
  status: MissionStatus;
  totalStages: number;
  stageTermSingular: string;
  stageTermPlural: string;
  accent: MissionAccent;
  shortDescription: string;
  mechanicsHighlight: string[];
  characterPerks: Record<CharacterId, string>;
  primaryControl: PrimaryControlMeta;
  plannedSectorsPreview: string[];
}

export interface StageProgressRecord {
  completed: boolean;
  stars: number; // 0 to 3
  bestScore: number;
}

export interface MissionProgress {
  unlockedStage: number; // 1..totalStages
  stages: Record<number, StageProgressRecord>;
}

export interface HubLifetimeStats {
  totalCiviliansSaved: number;
  totalPetsSaved: number;
  totalFiresExtinguished: number;
  totalStagesCleared: number;
  totalOperationsCompleted: number;
  highestStageScore: number;
}

export interface HubSaveState {
  version: 1;
  selectedCharacter: CharacterId;
  missions: Record<MissionId, MissionProgress>;
  stats: HubLifetimeStats;
  unlockedMedals: string[];
}

export interface CareerRank {
  id: string;
  title: string;
  minStars: number;
  insignia: string;
}

export interface MedalDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  missionId?: MissionId;
}

export interface MissionProgressSummary {
  completedStages: number;
  totalStages: number;
  earnedStars: number;
  maxStars: number;
  totalBestScore: number;
  nextStageToPlay: number;
  unlockedStage: number;
}
