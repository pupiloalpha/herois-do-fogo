import Phaser from 'phaser';
import { CharacterId, ContextualActionType, GameHUDState, HUDObjectiveItem } from '../types';
import { CHARACTERS } from '../charactersData';
import { TextureGenerator } from '../TextureGenerator';
import { sounds } from '../../audio/SoundManager';
import { FOREST_SECTORS } from './forestData';
import { ForestTextureGenerator } from './ForestTextureGenerator';
import {
  CellKind,
  ForestSectorData,
  ForestToolId,
  WildlifeSpecies,
  WindDirection,
} from './forestTypes';

interface ForestSceneInitData {
  characterId: CharacterId;
  floorNumber: number; // sectorNumber 1..10
  initialScore?: number;
  fireSpreadSpeed?: number;
  onHudUpdate?: (hud: GameHUDState) => void;
  onFloorClear?: (score: number, stars: number, remainingHealth: number, maxHealth: number) => void;
  onGameOver?: (reason: string) => void;
}

interface ForestCell {
  col: number;
  row: number;
  x: number;
  y: number;
  kind: CellKind;
  terrainSprite: Phaser.GameObjects.Image;
  burning: boolean;
  fireHp: number;
  maxFireHp: number;
  fireSprite?: Phaser.GameObjects.Sprite;
  smoldering: boolean;
  reigniteProgress: number;
  emberSprite?: Phaser.GameObjects.Image;
}

interface RescueTarget {
  id: string;
  kind: 'wildlife' | 'hiker';
  species?: WildlifeSpecies;
  name: string;
  quote?: string;
  x: number;
  y: number;
  sprite: Phaser.GameObjects.Sprite;
  aura: Phaser.GameObjects.Arc;
  label: Phaser.GameObjects.Text;
  rescued: boolean;
}

const WIND_VECTORS: Record<WindDirection, { x: number; y: number; arrow: string; label: string }> = {
  N: { x: 0, y: -1, arrow: '⬆️', label: 'Norte' },
  NE: { x: 0.71, y: -0.71, arrow: '↗️', label: 'Nordeste' },
  E: { x: 1, y: 0, arrow: '➡️', label: 'Leste' },
  SE: { x: 0.71, y: 0.71, arrow: '↘️', label: 'Sudeste' },
  S: { x: 0, y: 1, arrow: '⬇️', label: 'Sul' },
  SW: { x: -0.71, y: 0.71, arrow: '↙️', label: 'Sudoeste' },
  W: { x: -1, y: 0, arrow: '⬅️', label: 'Oeste' },
  NW: { x: -0.71, y: -0.71, arrow: '↖️', label: 'Noroeste' },
};

export class ForestScene extends Phaser.Scene {
  private characterId: CharacterId = 'foguinho';
  private sectorNumber: number = 1;
  private sectorData!: ForestSectorData;

  private player!: Phaser.Physics.Arcade.Sprite;
  private currentHealth: number = 100;
  private maxHealth: number = 100;
  private waterLevel: number = 100;
  private maxWaterLevel: number = 100;
  private heatMeter: number = 0;
  private facingAngle: number = 0;
  private activeTool: ForestToolId = 'water';

  private touchMoveVector: { x: number; y: number } = { x: 0, y: 0 };
  private touchActionActive: boolean = false;
  private touchSprinting: boolean = false;

  private grid: ForestCell[][] = [];
  private obstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;
  private rescueTargets: RescueTarget[] = [];
  private streamPositions: { x: number; y: number }[] = [];

  private waterParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private windParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private targetHighlight!: Phaser.GameObjects.Rectangle;

  private currentWind: WindDirection = 'E';
  private windShifted: boolean = false;
  private elapsedSeconds: number = 0;

  private score: number = 0;
  private timeRemaining: number = 120;
  private timerEvent!: Phaser.Time.TimerEvent;
  private fireSpreadSpeed: number = 1.0;
  private spreadTimerMs: number = 0;
  private toolCooldownMs: number = 0;

  private totalFlammableCells: number = 1;
  private burnedCellsCount: number = 0;
  private firebreaksCount: number = 0;
  private extinguishedCount: number = 0;
  private buriedEmbersCount: number = 0;
  private rescuedWildlifeCount: number = 0;
  private rescuedHikersCount: number = 0;
  private isCompleted: boolean = false;

  private promptText: string | null = null;
  private contextualAction: ContextualActionType = null;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  private keyQ!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;
  private key1!: Phaser.Input.Keyboard.Key;
  private key2!: Phaser.Input.Keyboard.Key;
  private key3!: Phaser.Input.Keyboard.Key;
  private key4!: Phaser.Input.Keyboard.Key;

  private onHudUpdateCallback?: (hud: GameHUDState) => void;
  private onFloorClearCallback?: (score: number, stars: number, remainingHealth: number, maxHealth: number) => void;
  private onGameOverCallback?: (reason: string) => void;

  constructor() {
    super({ key: 'ForestScene' });
  }

  public init(data: ForestSceneInitData) {
    this.characterId = data.characterId || 'foguinho';
    this.sectorNumber = data.floorNumber || 1;
    this.score = data.initialScore || 0;
    this.fireSpreadSpeed = data.fireSpreadSpeed || 1.0;
    this.onHudUpdateCallback = data.onHudUpdate;
    this.onFloorClearCallback = data.onFloorClear;
    this.onGameOverCallback = data.onGameOver;

    const found = FOREST_SECTORS.find(s => s.sectorNumber === this.sectorNumber);
    this.sectorData = found || FOREST_SECTORS[0];

    const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
    this.maxHealth = stats.maxHealth;
    this.currentHealth = stats.maxHealth;
    this.maxWaterLevel = stats.maxExtinguisher;
    this.waterLevel = stats.maxExtinguisher;
    this.heatMeter = 0;
    this.activeTool = 'water';

    this.currentWind = this.sectorData.windDirection;
    this.windShifted = false;
    this.elapsedSeconds = 0;
    this.timeRemaining = this.sectorData.timeLimitSeconds;
    this.spreadTimerMs = 0;
    this.toolCooldownMs = 0;

    this.grid = [];
    this.rescueTargets = [];
    this.streamPositions = [];
    this.totalFlammableCells = 1;
    this.burnedCellsCount = 0;
    this.firebreaksCount = 0;
    this.extinguishedCount = 0;
    this.buriedEmbersCount = 0;
    this.rescuedWildlifeCount = 0;
    this.rescuedHikersCount = 0;
    this.isCompleted = false;
    this.promptText = null;
    this.contextualAction = null;
  }

  public create() {
    TextureGenerator.generateAll(this);
    ForestTextureGenerator.generateAll(this);

    const ts = this.sectorData.tileSize;
    const worldW = this.sectorData.cols * ts;
    const worldH = this.sectorData.rows * ts;

    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBackgroundColor('#1a2e05');

    this.obstaclesGroup = this.physics.add.staticGroup();

    this.buildForestGrid();
    this.createPlayer();
    this.spawnRescueTargets();
    this.setupParticles();
    this.setupInputs();

    // Target tile highlight reticle
    this.targetHighlight = this.add.rectangle(0, 0, ts - 4, ts - 4)
      .setStrokeStyle(2, 0xfacc15, 0.7)
      .setFillStyle(0xfacc15, 0.08)
      .setDepth(8);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.isCompleted) return;
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
        this.elapsedSeconds++;

        // Handle dynamic wind shift in upper sectors
        if (
          !this.windShifted &&
          this.sectorData.windShiftAfterSec &&
          this.sectorData.shiftedWindDirection &&
          this.elapsedSeconds >= this.sectorData.windShiftAfterSec
        ) {
          this.windShifted = true;
          this.currentWind = this.sectorData.shiftedWindDirection;
          const wInfo = WIND_VECTORS[this.currentWind];
          sounds.playClick();
          this.showFloatingText(this.player.x, this.player.y - 30, `🌬️ VENTO VIROU PARA ${wInfo.label.toUpperCase()}!`, '#38bdf8');
        }

        if (this.timeRemaining <= 0) {
          this.handleGameOver('Tempo esgotado! O incêndio florestal fugiu do controle no parque.');
        }
      },
      loop: true,
    });

    this.syncHUD();
  }

  private buildForestGrid() {
    const { cols, rows, tileSize } = this.sectorData;
    const isInRectList = (c: number, r: number, list: { col: number; row: number; w?: number; h?: number }[]) =>
      list.some(item => c >= item.col && c < item.col + (item.w ?? 1) && r >= item.row && r < item.row + (item.h ?? 1));

    let flammableCount = 0;

    for (let r = 0; r < rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < cols; c++) {
        const x = c * tileSize + tileSize / 2;
        const y = r * tileSize + tileSize / 2;

        let kind: CellKind = 'grass';
        if (isInRectList(c, r, this.sectorData.streams)) {
          kind = 'water_stream';
        } else if (isInRectList(c, r, this.sectorData.rocks)) {
          kind = 'rock';
        } else if (isInRectList(c, r, this.sectorData.treeZones)) {
          kind = 'tree';
        } else if (isInRectList(c, r, this.sectorData.bushZones)) {
          kind = 'dense_bush';
        }

        // Keep player start clear of obstacles
        if (c === this.sectorData.playerStart.col && r === this.sectorData.playerStart.row) {
          kind = 'grass';
        }

        const textureKey = this.getTextureForKind(kind);
        const sprite = this.add.image(x, y, textureKey).setDepth(1);

        if (kind === 'rock' || kind === 'water_stream') {
          const blocker = this.obstaclesGroup.create(x, y, textureKey) as Phaser.Physics.Arcade.Sprite;
          blocker.setVisible(false);
          blocker.setBodySize(tileSize - 6, tileSize - 6);
          blocker.refreshBody();
        }

        if (kind === 'water_stream') {
          this.streamPositions.push({ x, y });
        }

        if (kind === 'grass' || kind === 'dense_bush' || kind === 'tree') {
          flammableCount++;
        }

        this.grid[r][c] = {
          col: c,
          row: r,
          x,
          y,
          kind,
          terrainSprite: sprite,
          burning: false,
          fireHp: 0,
          maxFireHp: 0,
          smoldering: false,
          reigniteProgress: 0,
        };
      }
    }

    this.totalFlammableCells = Math.max(1, flammableCount);

    // Ignite initial fires
    for (const f of this.sectorData.initialFires) {
      const cell = this.getCell(f.col, f.row);
      if (cell && cell.kind !== 'rock' && cell.kind !== 'water_stream') {
        this.igniteCell(cell, f.intensity ?? 1);
      }
    }
  }

  private getTextureForKind(kind: CellKind): string {
    switch (kind) {
      case 'tree': return 'forest_tree';
      case 'dense_bush': return 'forest_bush';
      case 'firebreak': return 'forest_firebreak';
      case 'water_stream': return 'forest_stream';
      case 'rock': return 'forest_rock';
      case 'ash': return 'forest_ash';
      default: return 'forest_grass';
    }
  }

  private createPlayer() {
    const ts = this.sectorData.tileSize;
    const startX = this.sectorData.playerStart.col * ts + ts / 2;
    const startY = this.sectorData.playerStart.row * ts + ts / 2;
    const textureKey = this.characterId === 'faisca' ? 'faisca_player' : 'foguinho_player';

    this.player = this.physics.add.sprite(startX, startY, textureKey);
    this.player.setDepth(15);
    this.player.setCollideWorldBounds(true);
    this.player.setBodySize(26, 26);
    this.player.setOffset(11, 16);

    this.physics.add.collider(this.player, this.obstaclesGroup);
  }

  private spawnRescueTargets() {
    const ts = this.sectorData.tileSize;

    // Wild animals
    for (const w of this.sectorData.wildlife) {
      const x = w.col * ts + ts / 2;
      const y = w.row * ts + ts / 2;

      // Ensure cell under animal isn't burning initially
      const cell = this.getCell(w.col, w.row);
      if (cell && (cell.kind === 'rock' || cell.kind === 'water_stream')) {
        cell.kind = 'grass';
        cell.terrainSprite.setTexture('forest_grass');
      }

      const aura = this.add.circle(x, y, 22, 0xfacc15, 0.2).setStrokeStyle(2, 0xfacc15, 0.8).setDepth(11);
      const sprite = this.add.sprite(x, y, `animal_${w.species}`).setDepth(12);
      const label = this.add.text(x, y - 28, w.name, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#fef08a',
        backgroundColor: 'rgba(15,23,42,0.85)',
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5).setDepth(13);

      this.tweens.add({
        targets: sprite,
        y: y - 4,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.rescueTargets.push({
        id: w.id,
        kind: 'wildlife',
        species: w.species,
        name: w.name,
        x,
        y,
        sprite,
        aura,
        label,
        rescued: false,
      });
    }

    // Stranded hikers
    for (const h of this.sectorData.hikers) {
      const x = h.col * ts + ts / 2;
      const y = h.row * ts + ts / 2;

      const aura = this.add.circle(x, y, 22, 0x22c55e, 0.22).setStrokeStyle(2, 0x4ade80, 0.85).setDepth(11);
      const sprite = this.add.sprite(x, y, 'forest_hiker').setDepth(12);
      const label = this.add.text(x, y - 28, h.name, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#bbf7d0',
        backgroundColor: 'rgba(15,23,42,0.85)',
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5).setDepth(13);

      this.rescueTargets.push({
        id: h.id,
        kind: 'hiker',
        name: h.name,
        quote: h.quote,
        x,
        y,
        sprite,
        aura,
        label,
        rescued: false,
      });
    }
  }

  private setupParticles() {
    this.waterParticles = this.add.particles(0, 0, 'water_particle', {
      speed: { min: 210, max: 320 },
      scale: { start: 1.1, end: 0.3 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 360,
      frequency: 24,
      emitting: false,
    }).setDepth(18);

    const worldW = this.sectorData.cols * this.sectorData.tileSize;
    const worldH = this.sectorData.rows * this.sectorData.tileSize;

    this.windParticles = this.add.particles(0, 0, 'smoke_particle', {
      x: { min: 0, max: worldW },
      y: { min: 0, max: worldH },
      scale: { start: 0.25, end: 0.6 },
      alpha: { start: 0.2, end: 0 },
      lifespan: 1800,
      frequency: 240,
      speedX: 60,
      speedY: 0,
    }).setDepth(19);
  }

  private setupInputs() {
    if (!this.input.keyboard) return;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);

    this.keyE.on('down', () => this.performInteraction());
    this.key1.on('down', () => this.setTool('hoe'));
    this.key2.on('down', () => this.setTool('swatter'));
    this.key3.on('down', () => this.setTool('water'));
    this.key4.on('down', () => this.setTool('shovel'));
    this.keyQ.on('down', () => {
      const order: ForestToolId[] = ['hoe', 'swatter', 'water', 'shovel'];
      const next = order[(order.indexOf(this.activeTool) + 1) % order.length];
      this.setTool(next);
    });
  }

  // Imperative bridge for React TouchControls
  public setMovement(vx: number, vy: number) {
    this.touchMoveVector = { x: vx, y: vy };
    this.touchSprinting = Math.hypot(vx, vy) >= 0.85;
  }

  public setSpraying(active: boolean) {
    this.touchActionActive = active;
  }

  public setSprinting(sprinting: boolean) {
    this.touchSprinting = sprinting;
  }

  public triggerInteract() {
    if (!this.isCompleted) {
      this.performInteraction();
    }
  }

  public setTool(toolId: string) {
    if (toolId === 'hoe' || toolId === 'swatter' || toolId === 'water' || toolId === 'shovel') {
      this.activeTool = toolId;
      sounds.stopSpray();
      const labels: Record<ForestToolId, string> = {
        hoe: '⛏️ ENXADA (ACEIRO)',
        swatter: '🧹 ABAFADOR',
        water: '💧 BOMBA COSTAL',
        shovel: '🪣 PÁ (ENTERRAR BRASA)',
      };
      if (this.player) {
        this.showFloatingText(this.player.x, this.player.y - 16, labels[toolId], '#fef08a');
      }
      this.syncHUD();
    }
  }

  public update(_time: number, delta: number) {
    if (this.isCompleted) return;

    this.toolCooldownMs = Math.max(0, this.toolCooldownMs - delta);
    this.handleMovement();
    this.updateTargetHighlight();
    this.handleActiveTool(delta);
    this.updateFireAndEmbers(delta);
    this.updateWindParticles();
    this.updatePlayerHeatAndDamage(delta);
    this.updateProximityPrompts();
    this.checkVictoryOrEcoDefeat();
    this.syncHUD();
  }

  private handleMovement() {
    const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
    let vx = this.touchMoveVector.x;
    let vy = this.touchMoveVector.y;

    if (this.cursors) {
      if (this.cursors.left.isDown || this.keyA?.isDown) vx -= 1;
      if (this.cursors.right.isDown || this.keyD?.isDown) vx += 1;
      if (this.cursors.up.isDown || this.keyW?.isDown) vy -= 1;
      if (this.cursors.down.isDown || this.keyS?.isDown) vy += 1;
    }

    const mag = Math.hypot(vx, vy);
    if (mag > 1) {
      vx /= mag;
      vy /= mag;
    }

    const sprinting = this.touchSprinting || this.keyShift?.isDown;
    const heatSlow = this.heatMeter >= 70 ? 0.72 : 1.0;
    const speed = stats.speed * (sprinting ? 1.32 : 1.0) * heatSlow;

    this.player.setVelocity(vx * speed, vy * speed);
    if (mag > 0.12) {
      this.facingAngle = Math.atan2(vy, vx);
      this.player.setFlipX(vx < -0.1);
    }
  }

  private getTargetCellInFront(): ForestCell | null {
    const ts = this.sectorData.tileSize;
    const lookDist = ts * 0.78;
    const tx = this.player.x + Math.cos(this.facingAngle) * lookDist;
    const ty = this.player.y + Math.sin(this.facingAngle) * lookDist;

    const col = Phaser.Math.Clamp(Math.floor(tx / ts), 0, this.sectorData.cols - 1);
    const row = Phaser.Math.Clamp(Math.floor(ty / ts), 0, this.sectorData.rows - 1);
    return this.getCell(col, row);
  }

  private getCell(col: number, row: number): ForestCell | null {
    if (row < 0 || row >= this.sectorData.rows || col < 0 || col >= this.sectorData.cols) {
      return null;
    }
    return this.grid[row][col];
  }

  private updateTargetHighlight() {
    const cell = this.getTargetCellInFront();
    if (cell) {
      this.targetHighlight.setPosition(cell.x, cell.y).setVisible(true);
      const color =
        this.activeTool === 'hoe'
          ? 0xf59e0b
          : this.activeTool === 'swatter'
            ? 0xf97316
            : this.activeTool === 'water'
              ? 0x38bdf8
              : 0x22c55e;
      this.targetHighlight.setStrokeStyle(2, color, 0.8);
    }
  }

  private handleActiveTool(delta: number) {
    const isUsing = this.touchActionActive || Boolean(this.keySpace?.isDown);

    if (!isUsing) {
      this.waterParticles.emitting = false;
      sounds.stopSpray();
      return;
    }

    if (this.activeTool === 'water') {
      if (this.waterLevel <= 0) {
        this.waterParticles.emitting = false;
        sounds.stopSpray();
        return;
      }

      this.waterParticles.emitting = true;
      sounds.startSpray();

      const nozzleX = this.player.x + Math.cos(this.facingAngle) * 18;
      const nozzleY = this.player.y + Math.sin(this.facingAngle) * 18;
      this.waterParticles.setPosition(nozzleX, nozzleY);

      const deg = Phaser.Math.RadToDeg(this.facingAngle);
      this.waterParticles.particleAngle = { min: deg - 18, max: deg + 18 };

      this.waterLevel = Math.max(0, this.waterLevel - (delta / 1000) * 14);
      this.heatMeter = Math.max(0, this.heatMeter - (delta / 1000) * 14);

      const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
      const sprayReach = 120;

      for (let r = 0; r < this.sectorData.rows; r++) {
        for (let c = 0; c < this.sectorData.cols; c++) {
          const cell = this.grid[r][c];
          if (!cell.burning && !cell.smoldering) continue;
          const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, cell.x, cell.y);
          if (dist > sprayReach) continue;

          const angleTo = Math.atan2(cell.y - this.player.y, cell.x - this.player.x);
          const diff = Math.abs(Phaser.Math.Angle.Wrap(angleTo - this.facingAngle));
          if (diff <= 0.65 || dist < 44) {
            if (cell.burning) {
              this.damageFireCell(cell, (delta / 1000) * 58 * stats.extinguishPower);
            } else if (cell.smoldering) {
              cell.reigniteProgress = Math.max(0, cell.reigniteProgress - (delta / 1000) * 35);
            }
          }
        }
      }
      return;
    }

    // Non-water tools: discrete cooldown actions
    this.waterParticles.emitting = false;
    sounds.stopSpray();

    if (this.toolCooldownMs > 0) return;

    if (this.activeTool === 'hoe') {
      this.useHoe();
    } else if (this.activeTool === 'swatter') {
      this.useSwatter();
    } else if (this.activeTool === 'shovel') {
      this.useShovel();
    }
  }

  private useHoe() {
    const target = this.getTargetCellInFront();
    const playerCol = Math.floor(this.player.x / this.sectorData.tileSize);
    const playerRow = Math.floor(this.player.y / this.sectorData.tileSize);
    const current = this.getCell(playerCol, playerRow);
    const cell =
      target && !target.burning && (target.kind === 'grass' || target.kind === 'dense_bush' || target.kind === 'tree')
        ? target
        : current && !current.burning && (current.kind === 'grass' || current.kind === 'dense_bush' || current.kind === 'tree')
          ? current
          : null;

    if (!cell) return;

    const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
    this.toolCooldownMs = Math.round(280 / stats.rescueSpeedMultiplier);
    sounds.playHoeDig();

    cell.kind = 'firebreak';
    cell.terrainSprite.setTexture('forest_firebreak');
    this.firebreaksCount++;

    // Bonus points if aceiro is adjacent to fire
    const nearFire = this.getNeighbors(cell.col, cell.row).some(n => n.burning);
    const pts = nearFire ? 45 : 15;
    this.score += pts;
    this.showFloatingText(cell.x, cell.y - 10, nearFire ? `+${pts} ACEIRO TÁTICO!` : `+${pts} ACEIRO`, '#f59e0b');
  }

  private useSwatter() {
    this.toolCooldownMs = 260;
    sounds.playSwatterHit();

    // Small visual sweep pulse
    const hitX = this.player.x + Math.cos(this.facingAngle) * 32;
    const hitY = this.player.y + Math.sin(this.facingAngle) * 32;
    const wave = this.add.circle(hitX, hitY, 26, 0xf97316, 0.25).setDepth(17);
    this.tweens.add({
      targets: wave,
      scale: 1.4,
      alpha: 0,
      duration: 180,
      onComplete: () => wave.destroy(),
    });

    let hitAny = false;
    for (let r = 0; r < this.sectorData.rows; r++) {
      for (let c = 0; c < this.sectorData.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.burning) continue;
        const d = Phaser.Math.Distance.Between(hitX, hitY, cell.x, cell.y);
        if (d <= 54) {
          this.damageFireCell(cell, 48);
          hitAny = true;
        }
      }
    }

    if (hitAny) {
      this.heatMeter = Math.min(100, this.heatMeter + 3);
    }
  }

  private useShovel() {
    const nearest = this.findNearestSmolderingCell(72);
    if (!nearest) return;

    this.toolCooldownMs = 300;
    this.burySmolderingCell(nearest);
  }

  private burySmolderingCell(cell: ForestCell) {
    cell.smoldering = false;
    cell.reigniteProgress = 0;
    if (cell.emberSprite) {
      cell.emberSprite.destroy();
      cell.emberSprite = undefined;
    }
    cell.kind = 'ash';
    cell.terrainSprite.setTexture('forest_ash');
    this.buriedEmbersCount++;
    this.score += 120;
    sounds.playShovelBury();
    this.showFloatingText(cell.x, cell.y - 12, '+120 BRASA ENTERRADA!', '#22c55e');
  }

  private igniteCell(cell: ForestCell, intensity: number = 1) {
    if (cell.burning || cell.kind === 'rock' || cell.kind === 'water_stream' || cell.kind === 'firebreak' || cell.kind === 'ash') {
      return;
    }

    const wasUnburned = cell.kind === 'grass' || cell.kind === 'dense_bush' || cell.kind === 'tree';
    if (wasUnburned) {
      this.burnedCellsCount++;
    }

    cell.burning = true;
    cell.smoldering = false;
    if (cell.emberSprite) {
      cell.emberSprite.destroy();
      cell.emberSprite = undefined;
    }

    const baseHp = cell.kind === 'tree' ? 95 : cell.kind === 'dense_bush' ? 70 : 45;
    cell.maxFireHp = baseHp * intensity;
    cell.fireHp = cell.maxFireHp;

    const fireScale = cell.kind === 'tree' ? 1.15 : cell.kind === 'dense_bush' ? 0.95 : 0.78;
    const fireSprite = this.add.sprite(cell.x, cell.y - 4, 'fire_flame', 0).setDepth(10);
    fireSprite.setScale(fireScale);
    this.tweens.add({
      targets: fireSprite,
      scaleX: fireScale * 1.14,
      scaleY: fireScale * 0.88,
      duration: 180 + Math.random() * 80,
      yoyo: true,
      repeat: -1,
    });
    cell.fireSprite = fireSprite;
  }

  private damageFireCell(cell: ForestCell, amount: number) {
    if (!cell.burning) return;
    cell.fireHp -= amount;
    if (cell.fireSprite) {
      const ratio = Math.max(0.4, cell.fireHp / cell.maxFireHp);
      cell.fireSprite.setScale(ratio * (cell.kind === 'tree' ? 1.25 : 0.95));
    }

    if (cell.fireHp <= 0) {
      cell.burning = false;
      cell.fireHp = 0;
      if (cell.fireSprite) {
        cell.fireSprite.destroy();
        cell.fireSprite = undefined;
      }

      this.extinguishedCount++;
      sounds.playExtinguish();
      this.score += 100;

      // Trees and dense bushes leave smoldering logs that can reignite if not buried!
      const leavesEmber = cell.kind === 'tree' || (cell.kind === 'dense_bush' && Math.random() < 0.55);
      if (leavesEmber) {
        cell.smoldering = true;
        cell.reigniteProgress = 0;
        cell.kind = 'ash';
        cell.terrainSprite.setTexture('forest_ash');
        cell.emberSprite = this.add.image(cell.x, cell.y, 'forest_smoldering_log').setDepth(9);
        this.showFloatingText(cell.x, cell.y - 10, '🔥 BRASA! ENTERRE COM PÁ', '#fb923c');
      } else {
        cell.kind = 'ash';
        cell.terrainSprite.setTexture('forest_ash');
        this.showFloatingText(cell.x, cell.y - 10, '+100 APAGADO', '#38bdf8');
      }
    }
  }

  private updateFireAndEmbers(delta: number) {
    // 1. Update smoldering logs reignition timer
    for (let r = 0; r < this.sectorData.rows; r++) {
      for (let c = 0; c < this.sectorData.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.smoldering) continue;

        cell.reigniteProgress += (delta / 1000) * (7.5 * this.sectorData.windStrength * this.fireSpreadSpeed);
        if (cell.emberSprite) {
          const pulse = 0.92 + Math.sin(this.time.now * 0.008) * 0.08;
          cell.emberSprite.setScale(pulse);
        }

        if (cell.reigniteProgress >= 100) {
          // Re-ignite an adjacent flammable tile (or self if none)
          const flammableNeighbors = this.getNeighbors(cell.col, cell.row).filter(
            n => !n.burning && (n.kind === 'grass' || n.kind === 'dense_bush' || n.kind === 'tree')
          );
          if (flammableNeighbors.length > 0) {
            const pick = flammableNeighbors[Math.floor(Math.random() * flammableNeighbors.length)];
            this.igniteCell(pick, 1);
            this.showFloatingText(pick.x, pick.y - 10, '⚠️ BRASA REACENDEU!', '#ef4444');
            cell.reigniteProgress = 25;
          } else {
            cell.reigniteProgress = 0;
          }
        }
      }
    }

    // 2. Wind-driven fire spread tick
    const effectiveInterval = Math.max(
      900,
      this.sectorData.spreadIntervalMs / (this.sectorData.windStrength * this.fireSpreadSpeed)
    );
    this.spreadTimerMs += delta;
    if (this.spreadTimerMs < effectiveInterval) return;
    this.spreadTimerMs = 0;

    const wind = WIND_VECTORS[this.currentWind];
    const burningCells: ForestCell[] = [];
    for (let r = 0; r < this.sectorData.rows; r++) {
      for (let c = 0; c < this.sectorData.cols; c++) {
        if (this.grid[r][c].burning) burningCells.push(this.grid[r][c]);
      }
    }

    if (burningCells.length === 0) return;

    // Pick up to 2 burning fronts per spread tick so growth feels tactical and readable
    const attempts = Math.min(2, burningCells.length);
    for (let i = 0; i < attempts; i++) {
      const source = burningCells[Math.floor(Math.random() * burningCells.length)];
      const candidates = this.getNeighbors(source.col, source.row).filter(
        n => !n.burning && (n.kind === 'grass' || n.kind === 'dense_bush' || n.kind === 'tree')
      );

      if (candidates.length === 0) {
        // Strong winds can occasionally spot sparks 1 tile over a thin aceiro!
        if (this.sectorData.windStrength >= 1.4 && Math.random() < 0.25) {
          const jumpCol = source.col + Math.round(wind.x * 2);
          const jumpRow = source.row + Math.round(wind.y * 2);
          const jumpCell = this.getCell(jumpCol, jumpRow);
          if (jumpCell && !jumpCell.burning && (jumpCell.kind === 'grass' || jumpCell.kind === 'dense_bush' || jumpCell.kind === 'tree')) {
            this.igniteCell(jumpCell, 1);
          }
        }
        continue;
      }

      // Weight candidates by alignment with wind direction
      let best = candidates[0];
      let bestScore = -999;
      for (const cand of candidates) {
        const dx = cand.col - source.col;
        const dy = cand.row - source.row;
        const align = dx * wind.x + dy * wind.y;
        const noise = Math.random() * 0.85;
        const score = align * 1.6 + noise;
        if (score > bestScore) {
          bestScore = score;
          best = cand;
        }
      }
      this.igniteCell(best, 1);
    }
  }

  private getNeighbors(col: number, row: number): ForestCell[] {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const result: ForestCell[] = [];
    for (const [dc, dr] of dirs) {
      const cell = this.getCell(col + dc, row + dr);
      if (cell) result.push(cell);
    }
    return result;
  }

  private updateWindParticles() {
    const w = WIND_VECTORS[this.currentWind];
    const speed = 75 * this.sectorData.windStrength;
    this.windParticles.speedX = w.x * speed;
    this.windParticles.speedY = w.y * speed;
  }

  private updatePlayerHeatAndDamage(delta: number) {
    const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
    let inFire = false;
    let nearFire = false;

    for (let r = 0; r < this.sectorData.rows; r++) {
      for (let c = 0; c < this.sectorData.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.burning) continue;
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, cell.x, cell.y);
        if (d < 34) inFire = true;
        else if (d < 85) nearFire = true;
      }
    }

    if (inFire) {
      this.heatMeter = Math.min(100, this.heatMeter + (delta / 1000) * 26);
      const dmg = (delta / 1000) * 18 * (1 - stats.heatResistance);
      this.currentHealth = Math.max(0, this.currentHealth - dmg);
    } else if (nearFire) {
      this.heatMeter = Math.min(100, this.heatMeter + (delta / 1000) * 9);
    } else {
      this.heatMeter = Math.max(0, this.heatMeter - (delta / 1000) * 12);
    }

    if (this.heatMeter >= 88) {
      const smokeDmg = (delta / 1000) * 6 * (1 - stats.heatResistance * 0.5);
      this.currentHealth = Math.max(0, this.currentHealth - smokeDmg);
    }

    if (this.currentHealth <= 0) {
      this.handleGameOver('Exaustão térmica! A fumaça e o calor intenso superaram o bombeiro.');
    }
  }

  private findNearestSmolderingCell(maxDist: number): ForestCell | null {
    let best: ForestCell | null = null;
    let minDist = maxDist;
    for (let r = 0; r < this.sectorData.rows; r++) {
      for (let c = 0; c < this.sectorData.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.smoldering) continue;
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, cell.x, cell.y);
        if (d < minDist) {
          minDist = d;
          best = cell;
        }
      }
    }
    return best;
  }

  private findNearestStream(maxDist: number): { x: number; y: number } | null {
    let best: { x: number; y: number } | null = null;
    let minDist = maxDist;
    for (const s of this.streamPositions) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
      if (d < minDist) {
        minDist = d;
        best = s;
      }
    }
    return best;
  }

  private findNearestRescueTarget(maxDist: number): RescueTarget | null {
    let best: RescueTarget | null = null;
    let minDist = maxDist;
    for (const t of this.rescueTargets) {
      if (t.rescued) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, t.x, t.y);
      if (d < minDist) {
        minDist = d;
        best = t;
      }
    }
    return best;
  }

  private updateProximityPrompts() {
    const rescue = this.findNearestRescueTarget(72);
    if (rescue) {
      this.contextualAction = rescue.kind === 'wildlife' ? 'wildlife' : 'hiker';
      this.promptText =
        rescue.kind === 'wildlife'
          ? `🐾 Pressione [AÇÃO] para salvar ${rescue.name}!`
          : `🤝 Pressione [AÇÃO] para resgatar ${rescue.name}!`;
      return;
    }

    const stream = this.findNearestStream(80);
    if (stream && this.waterLevel < this.maxWaterLevel) {
      this.contextualAction = 'refill_station';
      this.promptText = '🚰 Riacho próximo! Pressione [AÇÃO] para encher a Bomba Costal!';
      return;
    }

    const ember = this.findNearestSmolderingCell(70);
    if (ember) {
      this.contextualAction = 'smoldering_log';
      this.promptText = '🪣 Tronco em brasa! Use a Pá (4) ou [AÇÃO] para enterrar!';
      return;
    }

    if (this.waterLevel <= 0 && this.activeTool === 'water') {
      this.contextualAction = null;
      this.promptText = '💧 Bomba Costal vazia! Use o Abafador (2) ou reabasteça no Riacho!';
      return;
    }

    this.contextualAction = null;
    this.promptText = null;
  }

  private performInteraction() {
    const rescue = this.findNearestRescueTarget(76);
    if (rescue) {
      rescue.rescued = true;
      rescue.aura.destroy();
      rescue.label.destroy();

      if (rescue.kind === 'wildlife') {
        this.rescuedWildlifeCount++;
        this.score += 400;
        sounds.playRescueWildlife();
        this.showFloatingText(rescue.x, rescue.y - 12, `+400 ${rescue.name.toUpperCase()} SALVO!`, '#facc15');
      } else {
        this.rescuedHikersCount++;
        this.score += 500;
        sounds.playRescueCivilian();
        this.showFloatingText(rescue.x, rescue.y - 12, `+500 ${rescue.name.toUpperCase()} SALVO!`, '#22c55e');
      }

      this.tweens.add({
        targets: rescue.sprite,
        y: rescue.y - 40,
        alpha: 0,
        duration: 850,
        onComplete: () => rescue.sprite.destroy(),
      });
      return;
    }

    const stream = this.findNearestStream(84);
    if (stream) {
      sounds.playRefill();
      this.waterLevel = this.maxWaterLevel;
      this.heatMeter = Math.max(0, this.heatMeter - 30);
      this.showFloatingText(stream.x, stream.y - 16, '💧 BOMBA COSTAL 100% REABASTECIDA!', '#38bdf8');
      return;
    }

    const ember = this.findNearestSmolderingCell(72);
    if (ember) {
      this.burySmolderingCell(ember);
    }
  }

  private checkVictoryOrEcoDefeat() {
    const preservedPercent = Math.max(
      0,
      Math.round(((this.totalFlammableCells - this.burnedCellsCount) / this.totalFlammableCells) * 100)
    );
    const burnedPercent = 100 - preservedPercent;
    if (burnedPercent > this.sectorData.maxBurnPercent) {
      this.handleGameOver(
        `Mais de ${this.sectorData.maxBurnPercent}% da mata do setor foi queimada! Abra aceiros mais rápido na próxima tentativa.`
      );
      return;
    }

    let activeFires = 0;
    let activeEmbers = 0;
    for (let r = 0; r < this.sectorData.rows; r++) {
      for (let c = 0; c < this.sectorData.cols; c++) {
        if (this.grid[r][c].burning) activeFires++;
        if (this.grid[r][c].smoldering) activeEmbers++;
      }
    }

    const allWildlifeSafe = this.rescuedWildlifeCount >= this.sectorData.wildlife.length;
    const allHikersSafe = this.rescuedHikersCount >= this.sectorData.hikers.length;

    if (activeFires === 0 && activeEmbers === 0 && allWildlifeSafe && allHikersSafe) {
      this.handleSectorClear(preservedPercent);
    }
  }

  private handleSectorClear(preservedPercent: number) {
    if (this.isCompleted) return;
    this.isCompleted = true;
    sounds.stopSpray();
    sounds.playFloorClear();

    const timeBonus = Math.max(0, this.timeRemaining * 12);
    const preservationBonus = preservedPercent * 10;
    this.score += timeBonus + preservationBonus;

    let stars = 2;
    if (
      this.currentHealth > this.maxHealth * 0.55 &&
      preservedPercent >= 60 &&
      this.timeRemaining > this.sectorData.timeLimitSeconds * 0.2
    ) {
      stars = 3;
    } else if (this.currentHealth < this.maxHealth * 0.3 || preservedPercent < 45) {
      stars = 1;
    }

    if (this.onFloorClearCallback) {
      this.onFloorClearCallback(this.score, stars, this.currentHealth, this.maxHealth);
    }
  }

  private handleGameOver(reason: string) {
    if (this.isCompleted) return;
    this.isCompleted = true;
    sounds.stopSpray();
    sounds.playGameOver();
    this.player.setTint(0xef4444);

    if (this.onGameOverCallback) {
      this.onGameOverCallback(reason);
    }
  }

  private showFloatingText(x: number, y: number, text: string, color: string) {
    const label = this.add.text(x, y, text, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '13px',
      color,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(30);

    this.tweens.add({
      targets: label,
      y: y - 36,
      alpha: 0,
      duration: 1050,
      ease: 'Cubic.easeOut',
      onComplete: () => label.destroy(),
    });
  }

  private syncHUD() {
    if (!this.onHudUpdateCallback) return;

    let activeFires = 0;
    let activeEmbers = 0;
    for (let r = 0; r < this.sectorData.rows; r++) {
      for (let c = 0; c < this.sectorData.cols; c++) {
        if (this.grid[r][c].burning) activeFires++;
        if (this.grid[r][c].smoldering) activeEmbers++;
      }
    }

    const preservedPercent = Math.max(
      0,
      Math.round(((this.totalFlammableCells - this.burnedCellsCount) / this.totalFlammableCells) * 100)
    );

    const wInfo = WIND_VECTORS[this.currentWind];
    const windLabel = `${wInfo.arrow} Vento ${wInfo.label}`;

    const objectives: HUDObjectiveItem[] = [];
    if (this.sectorData.wildlife.length > 0) {
      objectives.push({
        id: 'wildlife',
        icon: '🦊',
        label: 'Animais Silvestres',
        current: this.rescuedWildlifeCount,
        target: this.sectorData.wildlife.length,
        pendingTextClass: 'text-amber-300',
      });
    }
    if (this.sectorData.hikers.length > 0) {
      objectives.push({
        id: 'hikers',
        icon: '🥾',
        label: 'Trilheiros',
        current: this.rescuedHikersCount,
        target: this.sectorData.hikers.length,
        pendingTextClass: 'text-emerald-300',
      });
    }

    const totalFiresTarget = Math.max(1, this.extinguishedCount + activeFires);
    objectives.push({
      id: 'forest_fires',
      icon: '🔥',
      label: 'Focos Extintos',
      current: this.extinguishedCount,
      target: totalFiresTarget,
      pendingTextClass: 'text-orange-400',
    });

    const totalEmbersTarget = this.buriedEmbersCount + activeEmbers;
    if (totalEmbersTarget > 0) {
      objectives.push({
        id: 'embers',
        icon: '🪵',
        label: 'Brasas Enterradas',
        current: this.buriedEmbersCount,
        target: totalEmbersTarget,
        pendingTextClass: 'text-amber-400',
      });
    }

    this.onHudUpdateCallback({
      missionId: 'forest_fire',
      currentFloor: this.sectorNumber,
      health: Math.max(0, Math.round(this.currentHealth)),
      maxHealth: this.maxHealth,
      extinguisher: Math.max(0, Math.round(this.waterLevel)),
      maxExtinguisher: this.maxWaterLevel,
      heatMeter: Math.round(this.heatMeter),
      timeRemaining: Math.max(0, this.timeRemaining),
      score: this.score,
      stars: 3,
      rescuedCivilians: this.rescuedHikersCount,
      totalCivilians: this.sectorData.hikers.length,
      rescuedPets: this.rescuedWildlifeCount,
      totalPets: this.sectorData.wildlife.length,
      extinguishedFires: this.extinguishedCount,
      totalFires: totalFiresTarget,
      closedGasValves: this.buriedEmbersCount,
      totalGasValves: totalEmbersTarget,
      cutElectricPanels: this.firebreaksCount,
      totalElectricPanels: 0,
      exitUnlocked: activeFires === 0 && activeEmbers === 0 && this.rescuedWildlifeCount >= this.sectorData.wildlife.length && this.rescuedHikersCount >= this.sectorData.hikers.length,
      promptActionText: this.promptText,
      contextualAction: this.contextualAction,
      smokeAlert: this.heatMeter >= 70,
      refillNeeded: this.waterLevel <= 15,
      objectives,
      vitalsLabels: {
        healthLabel: 'VIDA',
        resourceLabel: 'BOMBA ÁGUA',
        resourceEmoji: '💧',
        hazardLabel: 'CALOR / FUMAÇA',
        hazardAlertText: 'Calor Extremo!',
        emptyResourceAlertText: 'BOMBA VAZIA! REABASTEÇA NO RIACHO',
        refillTipText: 'Encha no Riacho!',
      },
      windLabel,
      preservedPercent,
      activeToolId: this.activeTool,
    });
  }

  public shutdown() {
    sounds.stopSpray();
    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }
  }
}
