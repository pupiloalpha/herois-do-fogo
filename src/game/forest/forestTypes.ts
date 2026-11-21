export type ForestToolId = 'hoe' | 'swatter' | 'water' | 'shovel';

export type CellKind =
  | 'grass'
  | 'dense_bush'
  | 'tree'
  | 'firebreak'
  | 'water_stream'
  | 'rock'
  | 'ash';

export type WindDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export type WildlifeSpecies = 'lobo_guara' | 'tucano' | 'tatu' | 'tamandua';

export interface ForestWildlifeSpawn {
  id: string;
  species: WildlifeSpecies;
  name: string;
  col: number;
  row: number;
}

export interface ForestHikerSpawn {
  id: string;
  name: string;
  col: number;
  row: number;
  quote: string;
}

export interface ForestFireSpawn {
  col: number;
  row: number;
  intensity?: number; // 1 = normal, 2 = strong
}

export interface ForestSectorData {
  sectorNumber: number; // 1..10
  name: string;
  subtitle: string;
  description: string;
  radioDispatch: string;
  cols: number;
  rows: number;
  tileSize: number;
  playerStart: { col: number; row: number };
  windDirection: WindDirection;
  windStrength: number; // 1.0..1.8
  windShiftAfterSec?: number;
  shiftedWindDirection?: WindDirection;
  timeLimitSeconds: number;
  maxBurnPercent: number; // e.g., 65 means if >65% of park burns, defeat
  spreadIntervalMs: number; // lower = faster base fire spread
  streams: { col: number; row: number; w?: number; h?: number }[];
  rocks: { col: number; row: number; w?: number; h?: number }[];
  treeZones: { col: number; row: number; w: number; h: number }[];
  bushZones: { col: number; row: number; w: number; h: number }[];
  initialFires: ForestFireSpawn[];
  wildlife: ForestWildlifeSpawn[];
  hikers: ForestHikerSpawn[];
}

export const FOREST_TOOLS: { id: ForestToolId; icon: string; label: string; keyHint: string }[] = [
  { id: 'hoe', icon: '⛏️', label: 'Aceiro', keyHint: '1' },
  { id: 'swatter', icon: '🧹', label: 'Abafar', keyHint: '2' },
  { id: 'water', icon: '💧', label: 'Água', keyHint: '3' },
  { id: 'shovel', icon: '🪣', label: 'Pá', keyHint: '4' },
];
