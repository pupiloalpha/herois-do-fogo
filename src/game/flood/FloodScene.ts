import Phaser from 'phaser';
import { CharacterId, ContextualActionType, GameHUDState, HUDObjectiveItem } from '../types';
import { CHARACTERS } from '../charactersData';
import { TextureGenerator } from '../TextureGenerator';
import { sounds } from '../../audio/SoundManager';
import { FLOOD_SECTORS } from './floodData';
import { FloodTextureGenerator } from './FloodTextureGenerator';
import { FloodRescueSpawn, FloodSectorData, FloodVehicleMode } from './floodTypes';

interface FloodSceneInitData {
  characterId: CharacterId;
  floorNumber: number; // sectorNumber 1..10
  initialScore?: number;
  fireSpreadSpeed?: number; // reused as Cabeça d'Água multiplier
  onHudUpdate?: (hud: GameHUDState) => void;
  onFloorClear?: (score: number, stars: number, remainingHealth: number, maxHealth: number) => void;
  onGameOver?: (reason: string) => void;
}

interface ShelterZone {
  x: number;
  y: number;
  label: string;
  sprite: Phaser.GameObjects.Image;
}

interface ElectricPoleNode {
  x: number;
  y: number;
  sprite: Phaser.GameObjects.Image;
  halo: Phaser.GameObjects.Arc;
}

interface FloodSpotState {
  spawn: FloodRescueSpawn;
  x: number;
  y: number;
  remainingVictims: number;
  remainingPet: boolean;
  totalPeople: number;
  sinkRemaining: number;
  sinkTotal: number;
  cleared: boolean;
  landmarkSprite: Phaser.GameObjects.Image;
  aura: Phaser.GameObjects.Arc;
  victimSprites: Phaser.GameObjects.Sprite[];
  badgeText: Phaser.GameObjects.Text;
  sinkBarBg?: Phaser.GameObjects.Rectangle;
  sinkBarFill?: Phaser.GameObjects.Rectangle;
}

export class FloodScene extends Phaser.Scene {
  private characterId: CharacterId = 'foguinho';
  private sectorNumber: number = 1;
  private sectorData!: FloodSectorData;

  private activeVehicle: FloodVehicleMode = 'boat';
  private player!: Phaser.Physics.Arcade.Sprite;
  private heliShadow?: Phaser.GameObjects.Ellipse;
  private heliRotor?: Phaser.GameObjects.Image;
  private nightSpotlight?: Phaser.GameObjects.Arc;
  private guideArrow?: Phaser.GameObjects.Triangle;

  private boatObstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;
  private boatCollider?: Phaser.Physics.Arcade.Collider;

  private currentHealth: number = 100;
  private maxHealth: number = 100;
  private fuelLevel: number = 100;
  private maxFuelLevel: number = 100;
  private facingAngle: number = 0;

  private touchMoveVector: { x: number; y: number } = { x: 0, y: 0 };
  private touchTurboActive: boolean = false;
  private touchSprinting: boolean = false;

  private shelters: ShelterZone[] = [];
  private electricPoles: ElectricPoleNode[] = [];
  private rescueSpots: FloodSpotState[] = [];

  private aboardPeople: number = 0;
  private aboardPets: number = 0;
  private deliveredPeople: number = 0;
  private deliveredPets: number = 0;
  private totalPeopleInSector: number = 0;
  private totalPetsInSector: number = 0;
  private clearedSpotsCount: number = 0;

  private score: number = 0;
  private timeRemaining: number = 120;
  private timerEvent!: Phaser.Time.TimerEvent;
  private currentMultiplier: number = 1.0;
  private hazardCooldownMs: number = 0;
  private nearestHazardStrain: number = 0;
  private isCompleted: boolean = false;

  private promptText: string | null = null;
  private contextualAction: ContextualActionType = null;

  private waterWakeParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private rainParticles?: Phaser.GameObjects.Particles.ParticleEmitter;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  private keyEnter!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;
  private key1!: Phaser.Input.Keyboard.Key;
  private key2!: Phaser.Input.Keyboard.Key;

  private onHudUpdateCallback?: (hud: GameHUDState) => void;
  private onFloorClearCallback?: (score: number, stars: number, remainingHealth: number, maxHealth: number) => void;
  private onGameOverCallback?: (reason: string) => void;

  constructor() {
    super({ key: 'FloodScene' });
  }

  public init(data: FloodSceneInitData) {
    this.characterId = data.characterId || 'foguinho';
    this.sectorNumber = data.floorNumber || 1;
    this.score = data.initialScore || 0;
    this.currentMultiplier = Math.min(1.4, data.fireSpreadSpeed || 1.0);
    this.onHudUpdateCallback = data.onHudUpdate;
    this.onFloorClearCallback = data.onFloorClear;
    this.onGameOverCallback = data.onGameOver;

    const found = FLOOD_SECTORS.find(s => s.sectorNumber === this.sectorNumber);
    this.sectorData = found || FLOOD_SECTORS[0];

    const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
    this.maxHealth = stats.maxHealth;
    this.currentHealth = stats.maxHealth;
    this.maxFuelLevel = stats.maxExtinguisher;
    this.fuelLevel = stats.maxExtinguisher;
    this.activeVehicle = this.sectorData.initialVehicle;
    this.timeRemaining = this.sectorData.timeLimitSeconds;

    this.shelters = [];
    this.electricPoles = [];
    this.rescueSpots = [];
    this.aboardPeople = 0;
    this.aboardPets = 0;
    this.deliveredPeople = 0;
    this.deliveredPets = 0;
    this.totalPeopleInSector = 0;
    this.totalPetsInSector = 0;
    this.clearedSpotsCount = 0;
    this.hazardCooldownMs = 0;
    this.nearestHazardStrain = 0;
    this.isCompleted = false;
    this.promptText = null;
    this.contextualAction = null;
  }

  public create() {
    TextureGenerator.generateAll(this);
    FloodTextureGenerator.generateAll(this);

    const ts = this.sectorData.tileSize;
    const worldW = this.sectorData.cols * ts;
    const worldH = this.sectorData.rows * ts;

    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.setBackgroundColor('#082f49');

    this.boatObstaclesGroup = this.physics.add.staticGroup();

    this.buildFloodWorld();
    this.spawnShelters();
    this.spawnHazards();
    this.spawnRescueSpots();
    this.createPlayerVehicle();
    this.setupParticlesAndAtmosphere(worldW, worldH);
    this.setupInputs();

    // Navigation arrow orbiting player
    this.guideArrow = this.add.triangle(0, 0, 0, -10, 8, 8, -8, 8, 0xfacc15, 0.9)
      .setStrokeStyle(1.5, 0x0f172a, 1)
      .setDepth(28);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.isCompleted) return;
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
        if (this.timeRemaining <= 0) {
          this.handleGameOver('O nível das águas subiu além do limite antes da evacuação total!');
        }
      },
      loop: true,
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sounds.stopSpray();
    });

    this.syncHUD();
  }

  private buildFloodWorld() {
    const { cols, rows, tileSize } = this.sectorData;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * tileSize + tileSize / 2;
        const y = r * tileSize + tileSize / 2;
        const isRapidBand = (r + c) % 5 === 0 || (r % 4 === 2 && c % 2 === 1);
        const tile = this.add.image(x, y, isRapidBand ? 'flood_rapid' : 'flood_water').setDepth(1);
        tile.setDisplaySize(tileSize + 1, tileSize + 1);
      }
    }
  }

  private spawnShelters() {
    const ts = this.sectorData.tileSize;
    for (const s of this.sectorData.shelters) {
      const x = s.col * ts + ts / 2;
      const y = s.row * ts + ts / 2;
      const sprite = this.add.image(x, y, 'flood_shelter').setDepth(4);
      const label = s.label || 'ABRIGO SEGURO';

      this.add.circle(x, y, 42, 0x22c55e, 0.14)
        .setStrokeStyle(2, 0x4ade80, 0.65)
        .setDepth(3);

      this.add.text(x, y + 38, `🏥 ${label}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#bbf7d0',
        backgroundColor: 'rgba(15,23,42,0.88)',
        padding: { x: 5, y: 2 },
      }).setOrigin(0.5).setDepth(14);

      this.shelters.push({ x, y, label, sprite });
    }
  }

  private spawnHazards() {
    const ts = this.sectorData.tileSize;

    // Floating debris (blocks boat, overflown by helicopter)
    for (const d of this.sectorData.debris) {
      const w = d.w ?? 1;
      const h = d.h ?? 1;
      for (let dr = 0; dr < h; dr++) {
        for (let dc = 0; dc < w; dc++) {
          const x = (d.col + dc) * ts + ts / 2;
          const y = (d.row + dr) * ts + ts / 2;
          const debrisImg = this.boatObstaclesGroup.create(x, y, 'flood_debris') as Phaser.Physics.Arcade.Sprite;
          debrisImg.setDepth(6);
          debrisImg.setBodySize(34, 34);
          debrisImg.refreshBody();
        }
      }
    }

    // Energized utility poles
    for (const p of this.sectorData.electricPoles) {
      const x = p.col * ts + ts / 2;
      const y = p.row * ts + ts / 2;
      const halo = this.add.circle(x, y, 36, 0xfacc15, 0.15)
        .setStrokeStyle(2, 0xfacc15, 0.75)
        .setDepth(5);
      const sprite = this.add.image(x, y, 'flood_pole').setDepth(9);

      this.tweens.add({
        targets: halo,
        scale: 1.18,
        alpha: 0.45,
        duration: 550,
        yoyo: true,
        repeat: -1,
      });

      this.electricPoles.push({ x, y, sprite, halo });
    }
  }

  private spawnRescueSpots() {
    const ts = this.sectorData.tileSize;

    for (const spawn of this.sectorData.rescueSpots) {
      const x = spawn.col * ts + ts / 2;
      const y = spawn.row * ts + ts / 2;

      const textureKey =
        spawn.kind === 'sinking_car'
          ? 'flood_sinking_car'
          : spawn.kind === 'car'
            ? 'flood_car'
            : spawn.kind === 'house'
              ? 'flood_house'
              : spawn.kind === 'rooftop'
                ? 'flood_rooftop'
                : 'flood_island';

      const auraColor =
        spawn.kind === 'sinking_car'
          ? 0xef4444
          : spawn.requiresHelicopter
            ? 0x38bdf8
            : 0xfacc15;

      const aura = this.add.circle(x, y, 32, auraColor, 0.18)
        .setStrokeStyle(2, auraColor, 0.85)
        .setDepth(4);

      this.tweens.add({
        targets: aura,
        scale: 1.15,
        duration: spawn.kind === 'sinking_car' ? 420 : 800,
        yoyo: true,
        repeat: -1,
      });

      const landmarkSprite = this.add.image(x, y, textureKey).setDepth(7);

      // Tall rooftops block boat passage so players know helicopter winch is needed
      if (spawn.kind === 'rooftop') {
        const blocker = this.boatObstaclesGroup.create(x, y, textureKey) as Phaser.Physics.Arcade.Sprite;
        blocker.setVisible(false);
        blocker.setBodySize(42, 42);
        blocker.refreshBody();
      }

      // Visual victim & optional pet sprites on top of spot
      const victimSprites: Phaser.GameObjects.Sprite[] = [];
      for (let i = 0; i < spawn.victims; i++) {
        const ox = spawn.victims === 1 ? 0 : i === 0 ? -10 : 10;
        const vSprite = this.add.sprite(x + ox, y - 16, 'flood_victim').setDepth(11).setScale(0.85);
        this.tweens.add({
          targets: vSprite,
          y: y - 20,
          duration: 500 + i * 120,
          yoyo: true,
          repeat: -1,
        });
        victimSprites.push(vSprite);
      }

      if (spawn.hasPet) {
        const petKey = spawn.petType === 'cat' ? 'pet_cat' : 'pet_dog';
        const pSprite = this.add.sprite(x + 15, y - 6, petKey).setDepth(12).setScale(0.75);
        victimSprites.push(pSprite);
      }

      const heliPrefix = spawn.requiresHelicopter ? '🚁 ' : '';
      const petSuffix = spawn.hasPet ? '+🐾' : '';
      const badgeText = this.add.text(x, y + 32, `${heliPrefix}${spawn.name} (${spawn.victims}👥${petSuffix})`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: spawn.requiresHelicopter ? '#bae6fd' : '#fef08a',
        backgroundColor: 'rgba(15,23,42,0.86)',
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5).setDepth(14);

      let sinkBarBg: Phaser.GameObjects.Rectangle | undefined;
      let sinkBarFill: Phaser.GameObjects.Rectangle | undefined;
      const sinkTotal = spawn.sinkTimeSeconds || 75;

      if (spawn.kind === 'sinking_car') {
        sinkBarBg = this.add.rectangle(x, y - 34, 42, 6, 0x0f172a, 0.9)
          .setStrokeStyle(1, 0xf87171, 0.8)
          .setDepth(15);
        sinkBarFill = this.add.rectangle(x - 20, y - 34, 40, 4, 0xef4444, 1)
          .setOrigin(0, 0.5)
          .setDepth(16);
      }

      this.totalPeopleInSector += spawn.victims;
      if (spawn.hasPet) this.totalPetsInSector += 1;

      this.rescueSpots.push({
        spawn,
        x,
        y,
        remainingVictims: spawn.victims,
        remainingPet: Boolean(spawn.hasPet),
        totalPeople: spawn.victims,
        sinkRemaining: sinkTotal,
        sinkTotal,
        cleared: false,
        landmarkSprite,
        aura,
        victimSprites,
        badgeText,
        sinkBarBg,
        sinkBarFill,
      });
    }
  }

  private createPlayerVehicle() {
    const ts = this.sectorData.tileSize;
    const startX = this.sectorData.playerStart.col * ts + ts / 2;
    const startY = this.sectorData.playerStart.row * ts + ts / 2;

    this.heliShadow = this.add.ellipse(startX + 8, startY + 14, 44, 24, 0x020617, 0.4).setDepth(15);
    this.player = this.physics.add.sprite(startX, startY, this.getVehicleTextureKey());
    this.player.setDepth(18);
    this.player.setCollideWorldBounds(true);
    this.player.setBodySize(28, 28);
    this.player.setDrag(280);

    this.heliRotor = this.add.image(startX, startY, 'vehicle_heli_rotor').setDepth(20);

    this.boatCollider = this.physics.add.collider(this.player, this.boatObstaclesGroup, () => {
      if (this.activeVehicle === 'boat' && this.hazardCooldownMs <= 0) {
        this.hazardCooldownMs = 750;
        const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
        const dmg = Math.max(2, Math.round(5 * (1 - stats.heatResistance * 0.5)));
        this.currentHealth = Math.max(0, this.currentHealth - dmg);
        sounds.playClick();
      }
    });

    this.applyVehicleVisualState();
  }

  private getVehicleTextureKey(): string {
    if (this.activeVehicle === 'helicopter') return 'vehicle_heli';
    return this.characterId === 'faisca' ? 'vehicle_boat_faisca' : 'vehicle_boat_foguinho';
  }

  private applyVehicleVisualState() {
    const isHeli = this.activeVehicle === 'helicopter';
    this.player.setTexture(this.getVehicleTextureKey());
    this.heliShadow?.setVisible(isHeli);
    this.heliRotor?.setVisible(isHeli);
    if (this.boatCollider) {
      this.boatCollider.active = !isHeli;
    }
    this.player.setDepth(isHeli ? 19 : 16);
  }

  private getMaxCapacity(): number {
    return this.activeVehicle === 'helicopter' ? 4 : 3;
  }

  private setupParticlesAndAtmosphere(worldW: number, worldH: number) {
    this.waterWakeParticles = this.add.particles(0, 0, 'water_particle', {
      speed: { min: 45, max: 110 },
      scale: { start: 0.9, end: 0.2 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 340,
      frequency: 45,
      emitting: false,
    }).setDepth(14);

    if (this.sectorData.isNightStorm) {
      this.add.rectangle(worldW / 2, worldH / 2, worldW, worldH, 0x020617, 0.34).setDepth(22);

      this.nightSpotlight = this.add.circle(this.player.x, this.player.y, 138, 0xfef08a, 0.14)
        .setDepth(23);

      this.rainParticles = this.add.particles(0, 0, 'water_particle', {
        x: { min: 0, max: worldW },
        y: { min: -20, max: worldH },
        speedX: -75,
        speedY: 260,
        scale: { start: 0.5, end: 0.2 },
        alpha: { start: 0.38, end: 0.05 },
        lifespan: 1100,
        frequency: 30,
      }).setDepth(24);
    } else {
      // Gentle current shimmer streaks
      this.rainParticles = this.add.particles(0, 0, 'water_particle', {
        x: { min: 0, max: worldW },
        y: { min: 0, max: worldH },
        speedX: this.sectorData.currentVector.x * this.sectorData.currentSpeed * 1.4,
        speedY: this.sectorData.currentVector.y * this.sectorData.currentSpeed * 1.4,
        scale: { start: 0.45, end: 0.1 },
        alpha: { start: 0.25, end: 0 },
        lifespan: 1400,
        frequency: 140,
      }).setDepth(3);
    }
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
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);

    this.keyE.on('down', () => this.performInteraction());
    this.keyEnter.on('down', () => this.performInteraction());
    this.key1.on('down', () => this.setTool('boat'));
    this.key2.on('down', () => this.setTool('helicopter'));
  }

  // Imperative bridge for React TouchControls
  public setMovement(vx: number, vy: number) {
    this.touchMoveVector = { x: vx, y: vy };
    this.touchSprinting = Math.hypot(vx, vy) >= 0.85;
  }

  public setSpraying(active: boolean) {
    this.touchTurboActive = active;
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
    if (toolId !== 'boat' && toolId !== 'helicopter') return;
    if (this.sectorData.vehiclePolicy !== 'mixed') return;
    if (toolId === this.activeVehicle) return;

    const aboardTotal = this.aboardPeople + this.aboardPets;
    if (aboardTotal > 0) {
      this.showFloatingText(this.player.x, this.player.y - 26, '⚠️ Desembarque no Abrigo antes de trocar!', '#fbbf24');
      return;
    }

    const nearShelter = this.findNearestShelter(105);
    if (!nearShelter) {
      this.showFloatingText(this.player.x, this.player.y - 26, '🔄 Aproxime-se de um Abrigo (H) para trocar!', '#38bdf8');
      return;
    }

    this.activeVehicle = toolId;
    this.applyVehicleVisualState();
    sounds.playVehicleSwap();
    this.showFloatingText(
      this.player.x,
      this.player.y - 28,
      toolId === 'helicopter' ? '🚁 HELICÓPTERO ARCANJO ATIVO!' : '🚤 BOTE INFLÁVEL ATIVO!',
      '#38bdf8'
    );
    this.syncHUD();
  }

  public update(_time: number, delta: number) {
    if (this.isCompleted) return;

    this.hazardCooldownMs = Math.max(0, this.hazardCooldownMs - delta);

    this.handleMovement(delta);
    this.updateHelicopterVisuals(delta);
    this.updateSinkingCars(delta);
    this.updateElectricHazards(delta);
    this.checkAutoShelterDropoff();
    this.updateGuideArrow();
    this.updateProximityPrompts();
    this.checkVictory();
    this.syncHUD();
  }

  private handleMovement(delta: number) {
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

    const turboRequested = this.touchTurboActive || Boolean(this.keySpace?.isDown) || Boolean(this.keyShift?.isDown);
    const usingTurbo = turboRequested && this.fuelLevel > 0 && mag > 0.08;

    const isHeli = this.activeVehicle === 'helicopter';
    const baseSpeed = stats.speed * (isHeli ? 1.18 : 1.0);
    const lowFuelPenalty = this.fuelLevel <= 0 ? 0.85 : 1.0;
    const sprintFactor = usingTurbo ? 1.48 : this.touchSprinting ? 1.15 : 1.0;
    const driveSpeed = baseSpeed * lowFuelPenalty * sprintFactor;

    // Fuel consumption & reserve protection
    const dt = delta / 1000;
    if (usingTurbo) {
      this.fuelLevel = Math.max(0, this.fuelLevel - dt * 16);
    } else if (mag > 0.1) {
      this.fuelLevel = Math.max(0, this.fuelLevel - dt * 1.4);
    } else if (this.fuelLevel < 18) {
      // Reserve emergency trickle recovery when drifting idle so player never gets stranded
      this.fuelLevel = Math.min(18, this.fuelLevel + dt * 3.5);
    }

    // Current / Wind push
    const currentFactor = isHeli ? 0.45 : 1.0;
    const pushX = this.sectorData.currentVector.x * this.sectorData.currentSpeed * this.currentMultiplier * currentFactor;
    const pushY = this.sectorData.currentVector.y * this.sectorData.currentSpeed * this.currentMultiplier * currentFactor;

    this.player.setVelocity(vx * driveSpeed + pushX, vy * driveSpeed + pushY);

    if (mag > 0.12) {
      this.facingAngle = Math.atan2(vy, vx);
      this.player.setRotation(this.facingAngle);
    }

    // Wake / Thruster particles
    if (usingTurbo || (mag > 0.25 && !isHeli)) {
      this.waterWakeParticles.emitting = true;
      const tailX = this.player.x - Math.cos(this.facingAngle) * 24;
      const tailY = this.player.y - Math.sin(this.facingAngle) * 24;
      this.waterWakeParticles.setPosition(tailX, tailY);
      const backDeg = Phaser.Math.RadToDeg(this.facingAngle + Math.PI);
      this.waterWakeParticles.particleAngle = { min: backDeg - 22, max: backDeg + 22 };
    } else {
      this.waterWakeParticles.emitting = false;
    }
  }

  private updateHelicopterVisuals(delta: number) {
    if (this.nightSpotlight) {
      this.nightSpotlight.setPosition(this.player.x, this.player.y);
    }
    if (this.activeVehicle === 'helicopter') {
      this.heliShadow?.setPosition(this.player.x + 8, this.player.y + 15);
      this.heliRotor?.setPosition(this.player.x, this.player.y);
      if (this.heliRotor) {
        this.heliRotor.angle = (this.heliRotor.angle + delta * 0.95) % 360;
      }
    }
  }

  private updateSinkingCars(delta: number) {
    const dt = delta / 1000;
    const sinkRate = 1 + (this.currentMultiplier - 1) * 0.35;

    for (const spot of this.rescueSpots) {
      if (spot.cleared || spot.spawn.kind !== 'sinking_car') continue;

      spot.sinkRemaining = Math.max(0, spot.sinkRemaining - dt * sinkRate);
      const ratio = spot.sinkRemaining / spot.sinkTotal;

      if (spot.sinkBarFill) {
        spot.sinkBarFill.width = Math.max(2, 40 * ratio);
        spot.sinkBarFill.setFillStyle(ratio < 0.3 ? 0xef4444 : ratio < 0.6 ? 0xf97316 : 0x38bdf8);
      }

      if (spot.sinkRemaining <= 0) {
        this.handleGameOver(`O veículo "${spot.spawn.name}" submergiu antes da equipe concluir o resgate!`);
        return;
      }
    }
  }

  private updateElectricHazards(delta: number) {
    const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
    const isHeli = this.activeVehicle === 'helicopter';
    const shockRadius = isHeli ? 28 : 44;
    let closestStrain = 0;

    for (const pole of this.electricPoles) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, pole.x, pole.y);
      if (dist < 110) {
        closestStrain = Math.max(closestStrain, Math.round(((110 - dist) / 110) * 100));
      }

      if (dist < shockRadius && this.hazardCooldownMs <= 0) {
        this.hazardCooldownMs = 1050;
        const baseDmg = isHeli ? 14 : 22;
        const dmg = Math.max(4, Math.round(baseDmg * (1 - stats.heatResistance)));
        this.currentHealth = Math.max(0, this.currentHealth - dmg);
        sounds.playElectricZap();
        this.cameras.main.shake(180, 0.008);
        this.player.setTint(0xfacc15);
        this.time.delayedCall(220, () => {
          if (this.player && this.player.active) this.player.clearTint();
        });

        // Push gently away from pole
        const pushAngle = Math.atan2(this.player.y - pole.y, this.player.x - pole.x);
        this.player.setVelocity(Math.cos(pushAngle) * 190, Math.sin(pushAngle) * 190);
        this.showFloatingText(this.player.x, this.player.y - 24, `⚡ CHOQUE! -${dmg}`, '#facc15');

        if (this.currentHealth <= 0) {
          this.handleGameOver('Descarga elétrica de poste danificou o veículo de resgate!');
          return;
        }
      }
    }

    const baseCurrentStrain = Math.min(72, Math.round(this.sectorData.currentSpeed * this.currentMultiplier * 1.1));
    this.nearestHazardStrain = Math.max(baseCurrentStrain, closestStrain);
    void delta;
  }

  private checkAutoShelterDropoff() {
    const shelter = this.findNearestShelter(66);
    if (!shelter) return;

    const aboardTotal = this.aboardPeople + this.aboardPets;
    if (aboardTotal > 0) {
      this.disembarkAtShelter(shelter);
    } else if (this.fuelLevel < this.maxFuelLevel * 0.96) {
      this.fuelLevel = this.maxFuelLevel;
      this.currentHealth = Math.min(this.maxHealth, this.currentHealth + 10);
      sounds.playRefill();
      this.showFloatingText(shelter.x, shelter.y - 24, '⛽ ABASTECIDO!', '#38bdf8');
    }
  }

  private disembarkAtShelter(shelter: ShelterZone) {
    const peopleNow = this.aboardPeople;
    const petsNow = this.aboardPets;
    const totalNow = peopleNow + petsNow;
    if (totalNow <= 0) return;

    this.deliveredPeople += peopleNow;
    this.deliveredPets += petsNow;
    this.aboardPeople = 0;
    this.aboardPets = 0;

    const comboBonus = totalNow >= 3 ? 250 : 0;
    const points = peopleNow * 350 + petsNow * 300 + comboBonus;
    this.score += points;

    this.fuelLevel = this.maxFuelLevel;
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + 18);

    sounds.playSplashDropoff();
    this.showFloatingText(
      shelter.x,
      shelter.y - 28,
      `🏥 +${points} (${totalNow} SALVO${totalNow > 1 ? 'S' : ''})!`,
      '#4ade80'
    );
  }

  private findNearestShelter(maxDist: number): ShelterZone | null {
    let best: ShelterZone | null = null;
    let bestDist = maxDist;
    for (const s of this.shelters) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    }
    return best;
  }

  private findNearestSpot(maxDist: number): FloodSpotState | null {
    let best: FloodSpotState | null = null;
    let bestDist = maxDist;
    for (const spot of this.rescueSpots) {
      if (spot.cleared) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, spot.x, spot.y);
      if (d < bestDist) {
        bestDist = d;
        best = spot;
      }
    }
    return best;
  }

  private performInteraction() {
    const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
    const reachBonus = stats.rescueSpeedMultiplier > 1.2 ? 12 : 0;

    // 1. Check Shelter interaction (dropoff / swap / refuel)
    const shelter = this.findNearestShelter(92);
    if (shelter) {
      const aboardTotal = this.aboardPeople + this.aboardPets;
      if (aboardTotal > 0) {
        this.disembarkAtShelter(shelter);
        return;
      }
      if (this.sectorData.vehiclePolicy === 'mixed') {
        const nextVehicle: FloodVehicleMode = this.activeVehicle === 'boat' ? 'helicopter' : 'boat';
        this.setTool(nextVehicle);
        return;
      }
      this.fuelLevel = this.maxFuelLevel;
      this.currentHealth = Math.min(this.maxHealth, this.currentHealth + 18);
      sounds.playRefill();
      this.showFloatingText(shelter.x, shelter.y - 24, '⛽ 100% REABASTECIDO!', '#38bdf8');
      return;
    }

    // 2. Check Rescue Spot pickup
    const spot = this.findNearestSpot(82 + reachBonus);
    if (!spot) return;

    if (spot.spawn.requiresHelicopter && this.activeVehicle !== 'helicopter') {
      sounds.playWarning();
      this.showFloatingText(spot.x, spot.y - 26, '🚁 TELHADO ALTO! Use o Helicóptero Arcanjo!', '#38bdf8');
      return;
    }

    const maxCap = this.getMaxCapacity();
    const aboardTotal = this.aboardPeople + this.aboardPets;
    const freeSpace = maxCap - aboardTotal;

    if (freeSpace <= 0) {
      sounds.playWarning();
      this.showFloatingText(this.player.x, this.player.y - 24, '⚠️ LOTADO! Vá ao Abrigo (H)!', '#fbbf24');
      return;
    }

    const takePeople = Math.min(spot.remainingVictims, freeSpace);
    spot.remainingVictims -= takePeople;
    this.aboardPeople += takePeople;

    let takePet = 0;
    const spaceAfterPeople = maxCap - (this.aboardPeople + this.aboardPets);
    if (spot.remainingPet && spaceAfterPeople > 0) {
      spot.remainingPet = false;
      this.aboardPets += 1;
      takePet = 1;
    }

    const totalPicked = takePeople + takePet;
    if (totalPicked <= 0) return;

    if (this.activeVehicle === 'helicopter') {
      sounds.playRescueWinch();
    } else {
      sounds.playRescueCivilian();
    }

    if (spot.remainingVictims <= 0 && !spot.remainingPet) {
      spot.cleared = true;
      this.clearedSpotsCount++;
      this.score += 180;
      spot.aura.destroy();
      spot.badgeText.destroy();
      spot.sinkBarBg?.destroy();
      spot.sinkBarFill?.destroy();
      for (const vs of spot.victimSprites) vs.destroy();
      spot.landmarkSprite.setTint(0x64748b);
      this.showFloatingText(
        spot.x,
        spot.y - 22,
        this.activeVehicle === 'helicopter' ? `🚁 IÇADO (+${totalPicked})!` : `🚤 EMBARCADO (+${totalPicked})!`,
        '#fde047'
      );
    } else {
      const petStr = spot.remainingPet ? '+🐾' : '';
      spot.badgeText.setText(`${spot.spawn.name} (${spot.remainingVictims}👥${petStr})`);
      this.showFloatingText(spot.x, spot.y - 22, `🚤 +${totalPicked} A BORDO! VOLTE P/ RESTANTE`, '#fbbf24');
    }
  }

  private updateProximityPrompts() {
    const shelter = this.findNearestShelter(92);
    const aboardTotal = this.aboardPeople + this.aboardPets;
    const maxCap = this.getMaxCapacity();

    if (shelter) {
      if (aboardTotal > 0) {
        this.contextualAction = 'flood_shelter';
        this.promptText = `🏥 ${shelter.label}: Aperte [AÇÃO] para desembarcar ${aboardTotal} resgatado(s)!`;
        return;
      }
      if (this.sectorData.vehiclePolicy === 'mixed') {
        this.contextualAction = 'flood_swap_vehicle';
        const targetLabel = this.activeVehicle === 'boat' ? 'Helicóptero Arcanjo' : 'Bote Inflável';
        this.promptText = `🔄 ${shelter.label}: Aperte [AÇÃO] ou [1/2] para trocar para ${targetLabel}!`;
        return;
      }
      if (this.fuelLevel < this.maxFuelLevel * 0.9) {
        this.contextualAction = 'flood_shelter';
        this.promptText = `⛽ ${shelter.label}: Aperte [AÇÃO] para reabastecer e reparar!`;
        return;
      }
    }

    const spot = this.findNearestSpot(88);
    if (spot) {
      if (spot.spawn.requiresHelicopter && this.activeVehicle !== 'helicopter') {
        this.contextualAction = 'exit_locked';
        this.promptText = `🚁 Telhado alto! Troque para o Helicóptero Arcanjo no Abrigo (H)!`;
        return;
      }
      if (aboardTotal >= maxCap) {
        this.contextualAction = 'exit_locked';
        this.promptText = `⚠️ Lotado (${aboardTotal}/${maxCap})! Leve os resgatados ao Abrigo Seguro!`;
        return;
      }
      this.contextualAction = 'flood_victim';
      this.promptText =
        this.activeVehicle === 'helicopter'
          ? `🚁 Aperte [AÇÃO] para içar ${spot.spawn.name} com o guincho!`
          : `🚤 Aperte [AÇÃO] para embarcar ${spot.spawn.name}!`;
      return;
    }

    if (this.fuelLevel <= 15) {
      this.contextualAction = null;
      this.promptText = '⛽ Combustível baixo! Aproxime-se do Abrigo Seguro (H) para reabastecer.';
      return;
    }

    this.contextualAction = null;
    this.promptText = null;
  }

  private updateGuideArrow() {
    if (!this.guideArrow) return;

    const aboardTotal = this.aboardPeople + this.aboardPets;
    const maxCap = this.getMaxCapacity();
    const pendingSpots = this.rescueSpots.filter(s => !s.cleared);

    let targetX: number | null = null;
    let targetY: number | null = null;
    let color = 0xfacc15;

    if (aboardTotal >= maxCap || (pendingSpots.length === 0 && aboardTotal > 0)) {
      // Point to nearest shelter
      let minDist = Infinity;
      for (const s of this.shelters) {
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
        if (d < minDist) {
          minDist = d;
          targetX = s.x;
          targetY = s.y;
        }
      }
      color = 0x4ade80;
    } else if (pendingSpots.length > 0) {
      // Prioritize urgent sinking cars first, then nearest reachable spot
      const urgentSinking = pendingSpots
        .filter(s => s.spawn.kind === 'sinking_car' && s.sinkRemaining < 35)
        .sort((a, b) => a.sinkRemaining - b.sinkRemaining);

      if (urgentSinking.length > 0) {
        targetX = urgentSinking[0].x;
        targetY = urgentSinking[0].y;
        color = 0xef4444;
      } else {
        let minDist = Infinity;
        for (const spot of pendingSpots) {
          const penalty = spot.spawn.requiresHelicopter && this.activeVehicle === 'boat' ? 350 : 0;
          const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, spot.x, spot.y) + penalty;
          if (d < minDist) {
            minDist = d;
            targetX = spot.x;
            targetY = spot.y;
          }
        }
        color = 0x38bdf8;
      }
    }

    if (targetX === null || targetY === null) {
      this.guideArrow.setVisible(false);
      return;
    }

    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY);
    if (dist < 64) {
      this.guideArrow.setVisible(false);
      return;
    }

    const angle = Math.atan2(targetY - this.player.y, targetX - this.player.x);
    this.guideArrow
      .setVisible(true)
      .setFillStyle(color, 0.95)
      .setPosition(this.player.x + Math.cos(angle) * 44, this.player.y + Math.sin(angle) * 44)
      .setRotation(angle + Math.PI / 2);
  }

  private checkVictory() {
    const allPickedUp = this.rescueSpots.every(s => s.cleared);
    const aboardTotal = this.aboardPeople + this.aboardPets;
    if (allPickedUp && aboardTotal === 0) {
      this.handleSectorClear();
    }
  }

  private handleSectorClear() {
    if (this.isCompleted) return;
    this.isCompleted = true;
    sounds.stopSpray();
    sounds.playFloorClear();

    const timeBonus = Math.max(0, this.timeRemaining * 14);
    this.score += timeBonus;

    let stars = 2;
    if (this.currentHealth > this.maxHealth * 0.55 && this.timeRemaining > this.sectorData.timeLimitSeconds * 0.2) {
      stars = 3;
    } else if (this.currentHealth < this.maxHealth * 0.3) {
      stars = 1;
    }

    this.syncHUD();

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
      fontSize: '12px',
      color,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(32);

    this.tweens.add({
      targets: label,
      y: y - 34,
      alpha: 0,
      duration: 1050,
      ease: 'Cubic.easeOut',
      onComplete: () => label.destroy(),
    });
  }

  private syncHUD() {
    if (!this.onHudUpdateCallback) return;

    const aboardTotal = this.aboardPeople + this.aboardPets;
    const maxCap = this.getMaxCapacity();
    const pendingSinking = this.rescueSpots.filter(s => s.spawn.kind === 'sinking_car');
    const clearedSinking = pendingSinking.filter(s => s.cleared).length;

    const objectives: HUDObjectiveItem[] = [
      {
        id: 'flood_people',
        icon: '👥',
        label: 'Pessoas no Abrigo',
        current: this.deliveredPeople,
        target: Math.max(1, this.totalPeopleInSector),
        pendingTextClass: 'text-cyan-300',
      },
    ];

    if (this.totalPetsInSector > 0) {
      objectives.push({
        id: 'flood_pets',
        icon: '🐾',
        label: 'Animais Salvos',
        current: this.deliveredPets,
        target: this.totalPetsInSector,
        pendingTextClass: 'text-amber-300',
      });
    }

    if (pendingSinking.length > 0) {
      objectives.push({
        id: 'sinking_cars',
        icon: '🚗',
        label: 'Carros Afundando',
        current: clearedSinking,
        target: pendingSinking.length,
        pendingTextClass: 'text-rose-400',
      });
    }

    objectives.push({
      id: 'flood_spots',
      icon: '📍',
      label: 'Pontos Evacuados',
      current: this.clearedSpotsCount,
      target: Math.max(1, this.rescueSpots.length),
      pendingTextClass: 'text-sky-300',
    });

    this.onHudUpdateCallback({
      missionId: 'flood_rescue',
      currentFloor: this.sectorNumber,
      health: Math.max(0, Math.round(this.currentHealth)),
      maxHealth: this.maxHealth,
      extinguisher: Math.max(0, Math.round((this.fuelLevel / this.maxFuelLevel) * 100)),
      maxExtinguisher: 100,
      heatMeter: Math.min(100, Math.round(this.nearestHazardStrain)),
      timeRemaining: Math.max(0, this.timeRemaining),
      score: this.score,
      stars: 3,
      rescuedCivilians: this.deliveredPeople,
      totalCivilians: this.totalPeopleInSector,
      rescuedPets: this.deliveredPets,
      totalPets: this.totalPetsInSector,
      extinguishedFires: this.clearedSpotsCount,
      totalFires: this.rescueSpots.length,
      closedGasValves: 0,
      totalGasValves: 0,
      cutElectricPanels: 0,
      totalElectricPanels: 0,
      exitUnlocked: this.rescueSpots.every(s => s.cleared) && aboardTotal === 0,
      promptActionText: this.promptText,
      contextualAction: this.contextualAction,
      smokeAlert: this.nearestHazardStrain >= 70,
      refillNeeded: this.fuelLevel <= 15,
      objectives,
      vitalsLabels: {
        healthLabel: this.activeVehicle === 'helicopter' ? 'FUSELAGEM' : 'CASCO',
        resourceLabel: 'COMBUSTÍVEL',
        resourceEmoji: '⛽',
        hazardLabel: 'CORRENTEZA',
        hazardAlertText: 'Risco Elétrico / Correnteza!',
        emptyResourceAlertText: 'COMBUSTÍVEL BAIXO! Vá ao Abrigo (H)',
        refillTipText: 'Abasteça no Abrigo (H)!',
      },
      vehicleLabel: this.activeVehicle === 'helicopter' ? '🚁 Arcanjo' : '🚤 Bote CBMMG',
      aboardCount: aboardTotal,
      maxAboard: maxCap,
      currentLabel: this.sectorData.currentLabel,
      activeToolId: this.activeVehicle,
    });
  }
}
