import Phaser from 'phaser';
import { CharacterId, FloorData, GameHUDState } from './types';
import { CHARACTERS } from './charactersData';
import { FLOORS_DATA } from './floorsData';
import { TextureGenerator } from './TextureGenerator';
import { sounds } from '../audio/SoundManager';

interface SceneInitData {
  characterId: CharacterId;
  floorNumber: number;
  initialScore?: number;
  onHudUpdate?: (hud: GameHUDState) => void;
  onFloorClear?: (score: number, stars: number) => void;
  onGameOver?: (reason: string) => void;
}

interface FireEntity {
  sprite: Phaser.GameObjects.Sprite;
  hp: number;
  maxHp: number;
  radius: number;
  x: number;
  y: number;
}

interface InteractiveItem {
  id: string;
  type: 'civilian' | 'pet_dog' | 'pet_cat' | 'gas_valve' | 'electric_panel' | 'refill_station' | 'exit_door';
  x: number;
  y: number;
  sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Arc;
  completed: boolean;
  name?: string;
  quote?: string;
}

export class GameScene extends Phaser.Scene {
  private characterId: CharacterId = 'foguinho';
  private floorNumber: number = 1;
  private floorData!: FloorData;

  // Player state
  private player!: Phaser.Physics.Arcade.Sprite;
  private currentHealth: number = 100;
  private maxHealth: number = 100;
  private extinguisher: number = 100;
  private maxExtinguisher: number = 100;
  private heatMeter: number = 0;
  private facingAngle: number = 0; // radians
  private isSprinting: boolean = false;
  private isSpraying: boolean = false;
  private touchMoveVector: { x: number; y: number } = { x: 0, y: 0 };
  private touchSpraying: boolean = false;
  private touchSprinting: boolean = false;

  // Level entities
  private wallsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private fires: FireEntity[] = [];
  private interactives: InteractiveItem[] = [];
  private waterParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private smokeParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private sparkParticles!: Phaser.GameObjects.Particles.ParticleEmitter;

  // Stats
  private score: number = 0;
  private timeRemaining: number = 90;
  private timerEvent!: Phaser.Time.TimerEvent;
  private rescuedCiviliansCount: number = 0;
  private rescuedPetsCount: number = 0;
  private extinguishedFiresCount: number = 0;
  private closedGasValvesCount: number = 0;
  private cutElectricPanelsCount: number = 0;
  private exitUnlocked: boolean = false;
  private promptText: string | null = null;
  private isCompleted: boolean = false;

  // Callbacks
  private onHudUpdateCallback?: (hud: GameHUDState) => void;
  private onFloorClearCallback?: (score: number, stars: number) => void;
  private onGameOverCallback?: (reason: string) => void;

  // Input keys
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'GameScene' });
  }

  public init(data: SceneInitData) {
    this.characterId = data.characterId || 'foguinho';
    this.floorNumber = data.floorNumber || 1;
    this.score = data.initialScore || 0;
    this.onHudUpdateCallback = data.onHudUpdate;
    this.onFloorClearCallback = data.onFloorClear;
    this.onGameOverCallback = data.onGameOver;

    const floor = FLOORS_DATA.find(f => f.floorNumber === this.floorNumber);
    this.floorData = floor || FLOORS_DATA[0];

    const stats = CHARACTERS[this.characterId] || CHARACTERS.foguinho;
    this.maxHealth = stats.maxHealth;
    this.currentHealth = stats.maxHealth;
    this.maxExtinguisher = stats.maxExtinguisher;
    this.extinguisher = stats.maxExtinguisher;
    this.heatMeter = 0;
    this.timeRemaining = this.floorData.timeLimitSeconds;
    this.rescuedCiviliansCount = 0;
    this.rescuedPetsCount = 0;
    this.extinguishedFiresCount = 0;
    this.closedGasValvesCount = 0;
    this.cutElectricPanelsCount = 0;
    this.exitUnlocked = false;
    this.isCompleted = false;
    this.isSpraying = false;
    this.touchMoveVector = { x: 0, y: 0 };
  }

  public preload() {
    // Generate all vector canvas textures
    TextureGenerator.generateAll(this);
  }

  public create() {
    this.cameras.main.setBackgroundColor('#090d16');
    this.physics.world.setBounds(0, 0, this.floorData.width, this.floorData.height);

    // 1. Floor background grid
    const cols = Math.ceil(this.floorData.width / 64);
    const rows = Math.ceil(this.floorData.height / 64);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        this.add.image(c * 64 + 32, r * 64 + 32, 'floor_tile').setDepth(0);
      }
    }

    // Special Heliport circle on Floor 10
    if (this.floorNumber === 10) {
      const helipad = this.add.graphics();
      helipad.lineStyle(6, 0xfacc15, 0.8);
      helipad.strokeCircle(600, 360, 110);
      helipad.lineStyle(2, 0xffffff, 0.5);
      helipad.strokeCircle(600, 360, 130);
      // Large 'H'
      const hText = this.add.text(600, 360, 'H', {
        fontSize: '90px',
        color: '#facc15',
        fontStyle: 'bold',
        fontFamily: 'Arial Black'
      }).setOrigin(0.5).setAlpha(0.7);
      helipad.setDepth(1);
      hText.setDepth(1);
    }

    // 2. Build Walls
    this.wallsGroup = this.physics.add.staticGroup();
    this.floorData.walls.forEach(w => {
      const wall = this.add.tileSprite(w.x + w.w / 2, w.y + w.h / 2, w.w, w.h, 'wall_tile');
      wall.setDepth(2);
      this.physics.add.existing(wall, true);
      this.wallsGroup.add(wall);
    });

    // 3. Particles
    this.waterParticles = this.add.particles(0, 0, 'water_particle', {
      speed: { min: 220, max: 320 },
      scale: { start: 0.9, end: 0.1 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 350,
      blendMode: 'ADD',
      emitting: false
    }).setDepth(15);

    this.smokeParticles = this.add.particles(0, 0, 'smoke_particle', {
      speed: { min: 20, max: 60 },
      scale: { start: 0.5, end: 1.6 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 1200,
      emitting: false
    }).setDepth(16);

    this.sparkParticles = this.add.particles(0, 0, 'spark_particle', {
      speed: { min: 40, max: 120 },
      scale: { start: 0.8, end: 0 },
      lifespan: 250,
      emitting: false
    }).setDepth(15);

    // 4. Create Interacting Objects
    this.interactives = [];

    // Exit Door / Helicopter
    if (this.floorNumber === 10) {
      const heli = this.add.sprite(this.floorData.exitDoor.x, this.floorData.exitDoor.y, 'helicopter').setDepth(5);
      this.interactives.push({
        id: 'exit',
        type: 'exit_door',
        x: this.floorData.exitDoor.x,
        y: this.floorData.exitDoor.y,
        sprite: heli,
        completed: false,
        name: 'Helicóptero CBMMG Águia'
      });
    } else {
      const door = this.add.sprite(this.floorData.exitDoor.x, this.floorData.exitDoor.y, 'exit_door').setDepth(3);
      this.interactives.push({
        id: 'exit',
        type: 'exit_door',
        x: this.floorData.exitDoor.x,
        y: this.floorData.exitDoor.y,
        sprite: door,
        completed: false,
        name: 'Escadaria de Emergência'
      });
    }

    // Refill Hydrants
    this.floorData.refillStations.forEach(r => {
      const hyd = this.add.sprite(r.x, r.y, 'refill_station').setDepth(3);
      this.interactives.push({
        id: r.id,
        type: 'refill_station',
        x: r.x,
        y: r.y,
        sprite: hyd,
        completed: false,
        name: 'Hidrante / Estação de Extintor'
      });
    });

    // Gas Valves
    this.floorData.gasValves.forEach(g => {
      const valve = this.add.sprite(g.x, g.y, 'gas_valve').setDepth(3);
      this.interactives.push({
        id: g.id,
        type: 'gas_valve',
        x: g.x,
        y: g.y,
        sprite: valve,
        completed: false,
        name: 'Registro de Gás GLP'
      });
    });

    // Electric Panels
    this.floorData.electricPanels.forEach(e => {
      const panel = this.add.sprite(e.x, e.y, 'electric_panel').setDepth(3);
      this.interactives.push({
        id: e.id,
        type: 'electric_panel',
        x: e.x,
        y: e.y,
        sprite: panel,
        completed: false,
        name: 'Quadro Elétrico Energizado'
      });
    });

    // Civilians
    this.floorData.civilians.forEach(c => {
      const civ = this.add.sprite(c.x, c.y, 'civilian').setDepth(4);
      // Gentle bobbing tween
      this.tweens.add({
        targets: civ,
        y: c.y - 4,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.interactives.push({
        id: c.id,
        type: 'civilian',
        x: c.x,
        y: c.y,
        sprite: civ,
        completed: false,
        name: c.name,
        quote: c.quote
      });
    });

    // Pets
    this.floorData.pets.forEach(p => {
      const petKey = p.type === 'dog' ? 'pet_dog' : 'pet_cat';
      const petSprite = this.add.sprite(p.x, p.y, petKey).setDepth(4);
      this.tweens.add({
        targets: petSprite,
        angle: { from: -4, to: 4 },
        duration: 300,
        yoyo: true,
        repeat: -1
      });
      this.interactives.push({
        id: p.id,
        type: p.type === 'dog' ? 'pet_dog' : 'pet_cat',
        x: p.x,
        y: p.y,
        sprite: petSprite,
        completed: false,
        name: p.name
      });
    });

    // 5. Spawn Fires
    this.fires = [];
    this.floorData.fires.forEach(f => {
      let hp = 45;
      let radius = 24;
      let scale = 1.0;
      if (f.size === 'medium') {
        hp = 80;
        radius = 32;
        scale = 1.35;
      } else if (f.size === 'large') {
        hp = 135;
        radius = 44;
        scale = 1.75;
      }

      const fireSprite = this.add.sprite(f.x, f.y, 'fire_flame', 0).setDepth(6);
      fireSprite.setScale(scale);

      // Flame flicker tween
      this.tweens.add({
        targets: fireSprite,
        scaleX: scale * 1.15,
        scaleY: scale * 0.9,
        duration: 180 + Math.random() * 80,
        yoyo: true,
        repeat: -1
      });

      this.fires.push({
        sprite: fireSprite,
        hp,
        maxHp: hp,
        radius,
        x: f.x,
        y: f.y
      });
    });

    // 6. Spawn Player
    const playerKey = this.characterId === 'faisca' ? 'faisca_player' : 'foguinho_player';
    this.player = this.physics.add.sprite(this.floorData.playerStart.x, this.floorData.playerStart.y, playerKey);
    this.player.setCollideWorldBounds(true);
    this.player.setCircle(16, 8, 16);
    this.player.setDepth(10);
    this.physics.add.collider(this.player, this.wallsGroup);

    // Setup camera follow with smooth deadzone
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, this.floorData.width, this.floorData.height);

    // 7. Keyboard Inputs
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }

    // 8. Countdown Timer
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true
    });

    // Trigger initial HUD sync
    this.syncHUD();
  }

  // --- External Input bridges for Mobile Virtual Controls ---
  public setMovement(vx: number, vy: number) {
    this.touchMoveVector = { x: vx, y: vy };
  }

  public setSpraying(spraying: boolean) {
    this.touchSpraying = spraying;
  }

  public setSprinting(sprinting: boolean) {
    this.touchSprinting = sprinting;
  }

  public triggerInteract() {
    this.performInteraction();
  }

  private onTimerTick() {
    if (this.isCompleted) return;
    this.timeRemaining--;

    // Emit environmental hazards / smoke / sparks
    this.interactives.forEach(it => {
      if (!it.completed) {
        if (it.type === 'gas_valve') {
          // Leaking gas fumes
          this.smokeParticles.emitParticleAt(it.x, it.y, 2);
        } else if (it.type === 'electric_panel') {
          // Sparking
          if (Math.random() < 0.4) {
            this.sparkParticles.emitParticleAt(it.x, it.y, 3);
          }
        }
      }
    });

    if (this.timeRemaining <= 0) {
      this.handleGameOver('Tempo esgotado! O edifício foi tomado pelas chamas.');
    }

    this.syncHUD();
  }

  public update(time: number, delta: number) {
    if (this.isCompleted) return;

    const stats = CHARACTERS[this.characterId];
    const dt = Math.min(delta / 1000, 0.05);

    // 1. Movement logic
    let moveX = 0;
    let moveY = 0;

    if (this.cursors) {
      if (this.cursors.left?.isDown || this.keyA?.isDown) moveX -= 1;
      if (this.cursors.right?.isDown || this.keyD?.isDown) moveX += 1;
      if (this.cursors.up?.isDown || this.keyW?.isDown) moveY -= 1;
      if (this.cursors.down?.isDown || this.keyS?.isDown) moveY += 1;
    }

    // Touch joystick takes precedence if present
    if (Math.abs(this.touchMoveVector.x) > 0.05 || Math.abs(this.touchMoveVector.y) > 0.05) {
      moveX = this.touchMoveVector.x;
      moveY = this.touchMoveVector.y;
    }

    this.isSprinting = (this.keyShift?.isDown || this.touchSprinting);
    const speedMult = this.isSprinting ? 1.4 : 1.0;
    const baseSpeed = stats.speed * speedMult;

    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY);
      const normX = moveX / len;
      const normY = moveY / len;
      this.player.setVelocity(normX * baseSpeed, normY * baseSpeed);
      this.facingAngle = Math.atan2(normY, normX);

      // Rotate player sprite slightly or flip
      this.player.setFlipX(normX < 0);
    } else {
      this.player.setVelocity(0, 0);
    }

    // 2. Extinguisher Spraying
    const wantSpray = (this.keySpace?.isDown || this.touchSpraying);
    if (wantSpray && this.extinguisher > 0) {
      this.isSpraying = true;
      this.extinguisher = Math.max(0, this.extinguisher - 18 * dt);

      // Emit water particles
      const sprayAngle = this.facingAngle;
      const sprayOriginX = this.player.x + Math.cos(sprayAngle) * 20;
      const sprayOriginY = this.player.y + Math.sin(sprayAngle) * 20;

      this.waterParticles.emitParticleAt(sprayOriginX, sprayOriginY, 2);
      sounds.startSpray();

      // Check hits against fires
      this.checkSprayAgainstFires(sprayOriginX, sprayOriginY, sprayAngle, dt * stats.extinguishPower);
    } else {
      if (this.isSpraying) {
        sounds.stopSpray();
        this.isSpraying = false;
      }
      // Slowly regenerate 4% tank if idle
      this.extinguisher = Math.min(this.maxExtinguisher, this.extinguisher + 2.5 * dt);
    }

    // 3. Proximity and Heat Check
    this.checkHeatAndDamage(dt);

    // 4. Proximity prompt for interaction
    this.checkInteractionPrompt();

    // 5. Check if 'E' or action pressed
    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
      this.performInteraction();
    }

    this.syncHUD();
  }

  private checkSprayAgainstFires(ox: number, oy: number, angle: number, power: number) {
    const sprayDist = 110;
    const sprayArc = 0.65; // ~37 degrees cone

    for (let i = this.fires.length - 1; i >= 0; i--) {
      const f = this.fires[i];
      const dx = f.x - ox;
      const dy = f.y - oy;
      const dist = Math.hypot(dx, dy);

      if (dist < sprayDist + f.radius) {
        const fireAngle = Math.atan2(dy, dx);
        let diff = Math.abs(sprayAngleDifference(angle, fireAngle));
        if (diff < sprayArc) {
          // Damaging fire!
          f.hp -= 42 * power;
          this.smokeParticles.emitParticleAt(f.x, f.y, 1);

          // Fire shrinks as HP decreases
          const ratio = Math.max(0.2, f.hp / f.maxHp);
          f.sprite.setScale(ratio * (f.radius / 24));

          if (f.hp <= 0) {
            // Extinguished!
            sounds.playExtinguish();
            this.smokeParticles.emitParticleAt(f.x, f.y, 8);
            f.sprite.destroy();
            this.fires.splice(i, 1);
            this.extinguishedFiresCount++;
            this.score += 150;
            this.showFloatingText(f.x, f.y, '+150 FOGO APAGADO!', '#38bdf8');
            this.checkExitConditions();
          }
        }
      }
    }
  }

  private checkHeatAndDamage(dt: number) {
    const stats = CHARACTERS[this.characterId];
    let ambientHeat = 0;

    // Check distance to active fires
    for (const f of this.fires) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, f.x, f.y);
      if (dist < f.radius + 18) {
        // Direct contact with fire flames!
        const dmg = (30 * (1 - stats.heatResistance)) * dt;
        this.currentHealth -= dmg;
        this.cameras.main.shake(80, 0.004);
        if (Math.random() < 0.1) sounds.playHurt();
      } else if (dist < f.radius + 80) {
        // Radiant heat
        ambientHeat += (1 - dist / (f.radius + 80)) * 25;
      }
    }

    // Leaking gas increases heat/hazard level
    this.interactives.forEach(it => {
      if (!it.completed && it.type === 'gas_valve') {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, it.x, it.y);
        if (dist < 90) ambientHeat += 15;
      }
    });

    if (ambientHeat > 0) {
      this.heatMeter = Math.min(100, this.heatMeter + ambientHeat * dt);
    } else {
      this.heatMeter = Math.max(0, this.heatMeter - 18 * dt);
    }

    // If heat meter is critical, take suffocating damage
    if (this.heatMeter >= 90) {
      const suffocateDmg = (14 * (1 - stats.heatResistance)) * dt;
      this.currentHealth -= suffocateDmg;
      if (Math.random() < 0.05) sounds.playHurt();
    }

    if (this.currentHealth <= 0) {
      this.handleGameOver('O bombeiro sucumbiu ao calor e fumaça extrema!');
    }
  }

  private checkInteractionPrompt() {
    let nearest: InteractiveItem | null = null;
    let minDist = 65;

    for (const item of this.interactives) {
      if (item.completed && item.type !== 'refill_station' && item.type !== 'exit_door') continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
      if (d < minDist) {
        minDist = d;
        nearest = item;
      }
    }

    if (nearest) {
      switch (nearest.type) {
        case 'civilian':
          this.promptText = `[INTERAGIR] Salvar ${nearest.name}`;
          break;
        case 'pet_dog':
          this.promptText = `[INTERAGIR] Resgatar Cãozinho ${nearest.name} 🐶`;
          break;
        case 'pet_cat':
          this.promptText = `[INTERAGIR] Resgatar Gatinho ${nearest.name} 🐱`;
          break;
        case 'gas_valve':
          this.promptText = `[INTERAGIR] Fechar Válvula de Gás GLP ⚠️`;
          break;
        case 'electric_panel':
          this.promptText = `[INTERAGIR] Desligar Quadro Energizado ⚡`;
          break;
        case 'refill_station':
          this.promptText = `[INTERAGIR] Recarregar Extintor de Incêndio 🧯`;
          break;
        case 'exit_door':
          if (this.exitUnlocked) {
            this.promptText = this.floorNumber === 10 ? `[INTERAGIR] Embarcar no Helicóptero! 🚁` : `[INTERAGIR] Subir para o Próximo Andar 🚪`;
          } else {
            this.promptText = `Porta Trancada: Conclua os resgates e apague os focos!`;
          }
          break;
      }
    } else {
      this.promptText = null;
    }
  }

  private performInteraction() {
    let nearest: InteractiveItem | null = null;
    let minDist = 75;

    for (const item of this.interactives) {
      if (item.completed && item.type !== 'refill_station' && item.type !== 'exit_door') continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
      if (d < minDist) {
        minDist = d;
        nearest = item;
      }
    }

    if (!nearest) return;

    if (nearest.type === 'civilian' && !nearest.completed) {
      nearest.completed = true;
      sounds.playRescueCivilian();
      this.rescuedCiviliansCount++;
      this.score += 500;
      this.showFloatingText(nearest.x, nearest.y, '+500 PESSOA SALVA!', '#22c55e');

      // Speech bubble quote
      if (nearest.quote) {
        this.showSpeechBubble(nearest.x, nearest.y - 30, nearest.quote);
      }

      // Tween civilian to follow player towards exit
      this.tweens.add({
        targets: nearest.sprite,
        x: this.floorData.exitDoor.x,
        y: this.floorData.exitDoor.y,
        alpha: 0.3,
        duration: 1800,
        onComplete: () => {
          nearest.sprite.destroy();
        }
      });
      this.checkExitConditions();
    } else if ((nearest.type === 'pet_dog' || nearest.type === 'pet_cat') && !nearest.completed) {
      nearest.completed = true;
      sounds.playRescuePet(nearest.type === 'pet_dog' ? 'dog' : 'cat');
      this.rescuedPetsCount++;
      this.score += 400;
      const petLabel = nearest.type === 'pet_dog' ? '+400 CÃOZINHO SALVO! 🐶' : '+400 GATINHO SALVO! 🐱';
      this.showFloatingText(nearest.x, nearest.y, petLabel, '#facc15');

      this.tweens.add({
        targets: nearest.sprite,
        x: this.floorData.exitDoor.x,
        y: this.floorData.exitDoor.y,
        alpha: 0.3,
        duration: 1500,
        onComplete: () => {
          nearest.sprite.destroy();
        }
      });
      this.checkExitConditions();
    } else if (nearest.type === 'gas_valve' && !nearest.completed) {
      nearest.completed = true;
      sounds.playGasValve();
      this.closedGasValvesCount++;
      this.score += 300;
      this.showFloatingText(nearest.x, nearest.y, '+300 GÁS FECHADO!', '#a855f7');
      // Tint valve to green
      (nearest.sprite as Phaser.GameObjects.Sprite).setTint(0x22c55e);
      this.checkExitConditions();
    } else if (nearest.type === 'electric_panel' && !nearest.completed) {
      nearest.completed = true;
      sounds.playElectricCut();
      this.cutElectricPanelsCount++;
      this.score += 300;
      this.showFloatingText(nearest.x, nearest.y, '+300 ENERGIA CORTADA!', '#38bdf8');
      (nearest.sprite as Phaser.GameObjects.Sprite).setTint(0x22c55e);
      this.checkExitConditions();
    } else if (nearest.type === 'refill_station') {
      sounds.playRefill();
      this.extinguisher = this.maxExtinguisher;
      this.showFloatingText(nearest.x, nearest.y, 'EXTINTOR 100% RECARREGADO!', '#38bdf8');
    } else if (nearest.type === 'exit_door') {
      if (this.exitUnlocked) {
        this.handleFloorClear();
      } else {
        this.showFloatingText(this.player.x, this.player.y, 'MISSÕES PENDENTES!', '#ef4444');
      }
    }
  }

  private checkExitConditions() {
    const allCivilians = this.floorData.civilians.length;
    const allPets = this.floorData.pets.length;
    const allGas = this.floorData.gasValves.length;
    const allElectric = this.floorData.electricPanels.length;

    const civiliansDone = this.rescuedCiviliansCount >= allCivilians;
    const petsDone = this.rescuedPetsCount >= allPets;
    const gasDone = this.closedGasValvesCount >= allGas;
    const electricDone = this.cutElectricPanelsCount >= allElectric;
    const firesDone = this.fires.length === 0;

    if (civiliansDone && petsDone && gasDone && electricDone && firesDone) {
      if (!this.exitUnlocked) {
        this.exitUnlocked = true;
        sounds.playClick();
        this.showFloatingText(this.floorData.exitDoor.x, this.floorData.exitDoor.y, 'SAÍDA LIBERADA! AVANCE!', '#22c55e');

        // Flash exit door
        const exit = this.interactives.find(i => i.type === 'exit_door');
        if (exit && exit.sprite) {
          this.tweens.add({
            targets: exit.sprite,
            scale: 1.25,
            duration: 350,
            yoyo: true,
            repeat: 4
          });
        }
      }
    }
  }

  private handleFloorClear() {
    if (this.isCompleted) return;
    this.isCompleted = true;
    sounds.stopSpray();
    sounds.playFloorClear();

    // Time bonus
    const timeBonus = Math.max(0, this.timeRemaining * 15);
    this.score += timeBonus;

    // Stars calculation:
    // 3 stars: Health > 60% and timeRemaining > 20%
    // 2 stars: Completed
    let stars = 2;
    if (this.currentHealth > this.maxHealth * 0.6 && this.timeRemaining > this.floorData.timeLimitSeconds * 0.25) {
      stars = 3;
    } else if (this.currentHealth < this.maxHealth * 0.3) {
      stars = 1;
    }

    if (this.onFloorClearCallback) {
      this.onFloorClearCallback(this.score, stars);
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
    const label = this.add.text(x, y - 10, text, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '14px',
      color,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(30);

    this.tweens.add({
      targets: label,
      y: y - 45,
      alpha: 0,
      duration: 1100,
      ease: 'Cubic.easeOut',
      onComplete: () => label.destroy()
    });
  }

  private showSpeechBubble(x: number, y: number, text: string) {
    const bubble = this.add.text(x, y, `"${text}"`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#ffffff',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 8, y: 5 },
      stroke: '#22c55e',
      strokeThickness: 1.5,
      wordWrap: { width: 220 }
    }).setOrigin(0.5).setDepth(35);

    this.tweens.add({
      targets: bubble,
      y: y - 25,
      alpha: 0,
      duration: 3200,
      delay: 800,
      ease: 'Quad.easeOut',
      onComplete: () => bubble.destroy()
    });
  }

  private syncHUD() {
    if (!this.onHudUpdateCallback) return;

    const totalCiv = this.floorData.civilians.length;
    const totalPet = this.floorData.pets.length;
    const totalFire = this.floorData.fires.length;
    const totalGas = this.floorData.gasValves.length;
    const totalElec = this.floorData.electricPanels.length;

    this.onHudUpdateCallback({
      currentFloor: this.floorNumber,
      health: Math.max(0, Math.round(this.currentHealth)),
      maxHealth: this.maxHealth,
      extinguisher: Math.max(0, Math.round(this.extinguisher)),
      maxExtinguisher: this.maxExtinguisher,
      heatMeter: Math.round(this.heatMeter),
      timeRemaining: Math.max(0, this.timeRemaining),
      score: this.score,
      stars: 3,
      rescuedCivilians: this.rescuedCiviliansCount,
      totalCivilians: totalCiv,
      rescuedPets: this.rescuedPetsCount,
      totalPets: totalPet,
      extinguishedFires: this.extinguishedFiresCount,
      totalFires: totalFire,
      closedGasValves: this.closedGasValvesCount,
      totalGasValves: totalGas,
      cutElectricPanels: this.cutElectricPanelsCount,
      totalElectricPanels: totalElec,
      exitUnlocked: this.exitUnlocked,
      promptActionText: this.promptText
    });
  }

  public shutdown() {
    sounds.stopSpray();
    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }
  }
}

function sprayAngleDifference(a: number, b: number): number {
  let diff = (b - a) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return diff;
}
