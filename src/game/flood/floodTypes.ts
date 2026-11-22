export type FloodVehicleMode = 'boat' | 'helicopter';

export type FloodSectorVehiclePolicy = 'boat' | 'helicopter' | 'mixed';

export type FloodTargetKind =
  | 'car'
  | 'sinking_car'
  | 'house'
  | 'rooftop'
  | 'island';

export interface FloodRescueSpawn {
  id: string;
  kind: FloodTargetKind;
  name: string;
  col: number;
  row: number;
  victims: number; // 1 or 2 people waiting
  hasPet?: boolean;
  petType?: 'dog' | 'cat';
  sinkTimeSeconds?: number; // only for sinking_car
  requiresHelicopter?: boolean; // true for tall rooftops
}

export interface FloodPoleSpawn {
  col: number;
  row: number;
}

export interface FloodDebrisSpawn {
  col: number;
  row: number;
  w?: number;
  h?: number;
}

export interface FloodSectorData {
  sectorNumber: number; // 1..10
  name: string;
  subtitle: string;
  description: string;
  radioDispatch: string;
  vehiclePolicy: FloodSectorVehiclePolicy;
  initialVehicle: FloodVehicleMode;
  cols: number;
  rows: number;
  tileSize: number;
  playerStart: { col: number; row: number };
  shelters: { col: number; row: number; label?: string }[];
  currentVector: { x: number; y: number }; // normalized river/wind push direction
  currentSpeed: number; // px/sec push on boat (and wind drift on heli)
  currentLabel: string;
  isNightStorm?: boolean;
  timeLimitSeconds: number;
  debris: FloodDebrisSpawn[];
  electricPoles: FloodPoleSpawn[];
  rescueSpots: FloodRescueSpawn[];
}

export const FLOOD_VEHICLES: { id: FloodVehicleMode; icon: string; label: string; keyHint: string }[] = [
  { id: 'boat', icon: '🚤', label: 'Bote', keyHint: '1' },
  { id: 'helicopter', icon: '🚁', label: 'Arcanjo', keyHint: '2' },
];
