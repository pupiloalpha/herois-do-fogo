export type CharacterId = 'faisca' | 'foguinho';

export interface CharacterStats {
  id: CharacterId;
  name: string;
  role: string;
  gender: string;
  description: string;
  avatarUrl: string;
  badge: string;
  speed: number;
  maxHealth: number;
  maxExtinguisher: number;
  extinguishPower: number;
  heatResistance: number; // 0 to 1 damage reduction
  rescueSpeedMultiplier: number;
  specialTrait: string;
}

export type HazardType = 'fire' | 'gas_valve' | 'electric_panel' | 'smoke_vent';

export type EntityType = 
  | 'civilian' 
  | 'pet_dog' 
  | 'pet_cat' 
  | 'fire' 
  | 'gas_valve' 
  | 'electric_panel' 
  | 'refill_station' 
  | 'exit_door'
  | 'helicopter';

export interface LevelEntity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  name?: string;
  completed?: boolean;
  health?: number;
  maxHealth?: number;
}

export interface WallSegment {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FloorData {
  floorNumber: number; // 1 to 10
  name: string;
  subtitle: string;
  themeColor: string;
  floorTileColor?: string;
  floorGroutColor?: string;
  wallColor?: string;
  wallBorderColor?: string;
  description: string;
  radioDispatch: string;
  width: number;
  height: number;
  playerStart: { x: number; y: number };
  exitDoor: { x: number; y: number };
  timeLimitSeconds: number;
  walls: WallSegment[];
  civilians: { id: string; name: string; x: number; y: number; quote: string; spriteType?: string }[];
  pets: { id: string; type: 'dog' | 'cat' | 'bird'; name: string; x: number; y: number; spriteType?: string }[];
  fires: { id: string; x: number; y: number; size: 'small' | 'medium' | 'large' }[];
  gasValves: { id: string; x: number; y: number }[];
  electricPanels: { id: string; x: number; y: number }[];
  refillStations: { id: string; x: number; y: number }[];
}

export type ContextualActionType =
  | 'civilian'
  | 'pet_dog'
  | 'pet_cat'
  | 'wildlife'
  | 'hiker'
  | 'smoldering_log'
  | 'flood_victim'
  | 'flood_shelter'
  | 'flood_swap_vehicle'
  | 'gas_valve'
  | 'electric_panel'
  | 'refill_station'
  | 'exit_door'
  | 'exit_locked'
  | null;

export interface HUDObjectiveItem {
  id: string;
  icon: string;
  label: string;
  current: number;
  target: number;
  pendingTextClass?: string;
}

export interface HUDVitalsLabels {
  healthLabel?: string;
  resourceLabel?: string;
  resourceEmoji?: string;
  hazardLabel?: string;
  hazardAlertText?: string;
  emptyResourceAlertText?: string;
  refillTipText?: string;
}

export interface GameHUDState {
  missionId?: string;
  currentFloor: number;
  stageLabel?: string;
  health: number;
  maxHealth: number;
  extinguisher: number;
  maxExtinguisher: number;
  heatMeter: number; // 0 to 100 (Smoke & Thermal Exposure)
  timeRemaining: number;
  score: number;
  stars: number;
  rescuedCivilians: number;
  totalCivilians: number;
  rescuedPets: number;
  totalPets: number;
  extinguishedFires: number;
  totalFires: number;
  closedGasValves: number;
  totalGasValves: number;
  cutElectricPanels: number;
  totalElectricPanels: number;
  exitUnlocked: boolean;
  promptActionText: string | null;
  contextualAction?: ContextualActionType;
  smokeAlert?: boolean;
  refillNeeded?: boolean;
  objectives?: HUDObjectiveItem[];
  vitalsLabels?: HUDVitalsLabels;
  windLabel?: string;
  preservedPercent?: number;
  activeToolId?: string;
  vehicleLabel?: string;
  aboardCount?: number;
  maxAboard?: number;
  currentLabel?: string;
}
