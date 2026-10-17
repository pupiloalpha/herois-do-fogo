import Phaser from 'phaser';

export class TextureGenerator {
  public static generateAll(scene: Phaser.Scene) {
    this.createFloorTiles(scene);
    this.createWallTexture(scene);
    this.createFoguinhoSprite(scene);
    this.createFaiscaSprite(scene);
    this.createCivilianSprites(scene);
    this.createPetSprites(scene);
    this.createFireFrames(scene);
    this.createGasValveTexture(scene);
    this.createElectricPanelTexture(scene);
    this.createRefillStationTexture(scene);
    this.createExitDoorTexture(scene);
    this.createHelicopterTexture(scene);
    this.createParticleTextures(scene);
  }

  // --- FLOOR & WALLS ---
  private static createFloorTiles(scene: Phaser.Scene) {
    if (scene.textures.exists('floor_tile')) return;
    const canvas = scene.textures.createCanvas('floor_tile', 64, 64);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Tile base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 64, 64);

    // Subtle tile grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, 64, 64);

    // Inner subtle pattern
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, 4, 26, 26);
    ctx.fillRect(34, 34, 26, 26);

    canvas.refresh();
  }

  private static createWallTexture(scene: Phaser.Scene) {
    if (scene.textures.exists('wall_tile')) return;
    const canvas = scene.textures.createCanvas('wall_tile', 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, 32, 32);

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, 32, 6);
    ctx.fillRect(0, 26, 32, 6);

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 32, 32);

    canvas.refresh();
  }

  // --- FOGUINHO SPRITE ---
  private static createFoguinhoSprite(scene: Phaser.Scene) {
    if (scene.textures.exists('foguinho_player')) return;
    const canvas = scene.textures.createCanvas('foguinho_player', 48, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(24, 44, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (Khaki/Beige Firefighter Coat)
    ctx.fillStyle = '#d4a373'; // Khaki beige
    ctx.beginPath();
    ctx.roundRect(12, 18, 24, 20, 6);
    ctx.fill();

    // Dark shoulder pads
    ctx.fillStyle = '#334155';
    ctx.fillRect(12, 18, 24, 5);

    // Reflective yellow & silver strips
    ctx.fillStyle = '#eab308'; // High-vis yellow
    ctx.fillRect(12, 28, 24, 3);
    ctx.fillStyle = '#f8fafc'; // Silver reflective
    ctx.fillRect(12, 31, 24, 1.5);

    // Legs / Boots
    ctx.fillStyle = '#b08968';
    ctx.fillRect(14, 38, 7, 7);
    ctx.fillRect(27, 38, 7, 7);
    ctx.fillStyle = '#1e293b'; // Boots
    ctx.fillRect(13, 42, 8, 4);
    ctx.fillRect(27, 42, 8, 4);

    // Extinguisher / Hose held in hands
    ctx.fillStyle = '#dc2626'; // Extinguisher tank
    ctx.beginPath();
    ctx.roundRect(34, 20, 10, 16, 3);
    ctx.fill();
    ctx.fillStyle = '#0f172a'; // Hose nozzle
    ctx.fillRect(36, 14, 6, 6);

    // Head / Face
    ctx.fillStyle = '#e29578'; // Skin
    ctx.beginPath();
    ctx.arc(24, 16, 9, 0, Math.PI * 2);
    ctx.fill();

    // Orange/Reddish hair fringe
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.arc(24, 13, 9, Math.PI, Math.PI * 2);
    ctx.fill();

    // Yellow Firefighter Helmet
    ctx.fillStyle = '#eab308'; // Bright yellow
    ctx.beginPath();
    ctx.ellipse(24, 11, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Helmet brim
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.roundRect(10, 13, 28, 4, 2);
    ctx.fill();

    // Helmet badge shield (CBMMG red shield)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(24, 6);
    ctx.lineTo(27, 9);
    ctx.lineTo(24, 12);
    ctx.lineTo(21, 9);
    ctx.closePath();
    ctx.fill();

    // Friendly Eyes & Smile
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 15, 2, 2);
    ctx.fillRect(26, 15, 2, 2);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(24, 18, 3, 0, Math.PI);
    ctx.stroke();

    canvas.refresh();
  }

  // --- FAÍSCA SPRITE ---
  private static createFaiscaSprite(scene: Phaser.Scene) {
    if (scene.textures.exists('faisca_player')) return;
    const canvas = scene.textures.createCanvas('faisca_player', 48, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(24, 44, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark braid ponytail hanging down right/back
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(12, 24, 4, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, 31, 3.5, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Body (Vibrant Orange Firefighter Uniform)
    ctx.fillStyle = '#f97316'; // Vibrant CBMMG orange
    ctx.beginPath();
    ctx.roundRect(13, 18, 22, 20, 5);
    ctx.fill();

    // Silver and yellow reflective bands
    ctx.fillStyle = '#f8fafc'; // Silver
    ctx.fillRect(13, 26, 22, 2);
    ctx.fillStyle = '#fde047'; // Yellow
    ctx.fillRect(13, 28, 22, 2);

    // Legs & Kneepads
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(15, 38, 6, 7);
    ctx.fillRect(27, 38, 6, 7);
    // Black knee pads
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(14, 35, 7, 4);
    ctx.fillRect(27, 35, 7, 4);
    // Black boots
    ctx.fillRect(14, 42, 8, 4);
    ctx.fillRect(26, 42, 8, 4);

    // Extinguisher nozzle held in hands
    ctx.fillStyle = '#dc2626'; // Red tank
    ctx.beginPath();
    ctx.roundRect(33, 21, 10, 15, 3);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(35, 15, 6, 6);

    // Face / Skin
    ctx.fillStyle = '#f0a58a';
    ctx.beginPath();
    ctx.arc(24, 16, 8.5, 0, Math.PI * 2);
    ctx.fill();

    // Dark hair visible under cap
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(24, 14, 8.5, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    // Orange CBMMG Cap
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.ellipse(24, 11, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cap visor/brim
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.roundRect(14, 11, 20, 3.5, 1.5);
    ctx.fill();

    // Cap badge (CBMMG circle crest)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(24, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(24, 9, 2, 0, Math.PI * 2);
    ctx.fill();

    // Expressive cheerful eyes & smile
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(21, 16, 2, 2);
    ctx.fillRect(27, 16, 2, 2);
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(24, 19, 3, 0, Math.PI);
    ctx.stroke();

    canvas.refresh();
  }

  // --- CIVILIANS ---
  private static createCivilianSprites(scene: Phaser.Scene) {
    if (scene.textures.exists('civilian')) return;
    const canvas = scene.textures.createCanvas('civilian', 40, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Distress beacon / exclamation above head
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 20, 9);

    // Body
    ctx.fillStyle = '#3b82f6'; // Blue shirt
    ctx.beginPath();
    ctx.roundRect(11, 22, 18, 16, 4);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(13, 38, 5, 8);
    ctx.fillRect(22, 38, 5, 8);

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(20, 16, 7, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(20, 14, 7, Math.PI, Math.PI * 2);
    ctx.fill();

    // Waving hands in distress
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(6, 20, 3.5, 0, Math.PI * 2);
    ctx.arc(34, 20, 3.5, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  // --- PETS (DOG & CAT) ---
  private static createPetSprites(scene: Phaser.Scene) {
    // Dog (Caramelo / Golden)
    if (!scene.textures.exists('pet_dog')) {
      const canvas = scene.textures.createCanvas('pet_dog', 36, 32);
      if (canvas) {
        const ctx = canvas.getContext();
        // Dog body
        ctx.fillStyle = '#d97706'; // Golden caramel
        ctx.beginPath();
        ctx.ellipse(18, 20, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillRect(10, 24, 4, 7);
        ctx.fillRect(22, 24, 4, 7);

        // Head & floppy ears
        ctx.beginPath();
        ctx.arc(28, 14, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b45309'; // Ear
        ctx.beginPath();
        ctx.ellipse(26, 12, 3, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Red collar
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(23, 17, 3, 5);

        // Wagging tail
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(6, 20);
        ctx.quadraticCurveTo(2, 12, 5, 8);
        ctx.stroke();

        // Eye and nose
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(31, 13, 2, 2);
        ctx.fillRect(34, 15, 2, 2);

        canvas.refresh();
      }
    }

    // Cat (Ginger / White)
    if (!scene.textures.exists('pet_cat')) {
      const canvas = scene.textures.createCanvas('pet_cat', 32, 30);
      if (canvas) {
        const ctx = canvas.getContext();
        // Cat body
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.ellipse(15, 19, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillRect(9, 23, 3, 6);
        ctx.fillRect(18, 23, 3, 6);

        // Head
        ctx.beginPath();
        ctx.arc(23, 13, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pointy ears
        ctx.fillStyle = '#c2410c';
        ctx.beginPath();
        ctx.moveTo(20, 9);
        ctx.lineTo(22, 4);
        ctx.lineTo(24, 9);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(25, 9);
        ctx.lineTo(27, 4);
        ctx.lineTo(29, 9);
        ctx.closePath();
        ctx.fill();

        // Upright tail
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(6, 19);
        ctx.quadraticCurveTo(2, 12, 3, 6);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#22c55e'; // Green cat eyes
        ctx.fillRect(25, 12, 1.5, 1.5);

        canvas.refresh();
      }
    }
  }

  // --- FIRE FRAMES ---
  private static createFireFrames(scene: Phaser.Scene) {
    if (scene.textures.exists('fire_flame')) return;
    // 3 frames in a single spritesheet: 32x32 each -> 96x32
    const canvas = scene.textures.createCanvas('fire_flame', 96, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    for (let f = 0; f < 3; f++) {
      const ox = f * 32;
      const wobble = (f % 2 === 0 ? 2 : -2);

      // Base glowing heat
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.ellipse(ox + 16, 26, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer Red flame
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(ox + 8, 28);
      ctx.quadraticCurveTo(ox + 4, 16, ox + 14 + wobble, 6);
      ctx.quadraticCurveTo(ox + 18, 14, ox + 20, 10);
      ctx.quadraticCurveTo(ox + 26, 16, ox + 24, 28);
      ctx.closePath();
      ctx.fill();

      // Middle Orange flame
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(ox + 10, 28);
      ctx.quadraticCurveTo(ox + 8, 18, ox + 15 + wobble, 10);
      ctx.quadraticCurveTo(ox + 22, 18, ox + 22, 28);
      ctx.closePath();
      ctx.fill();

      // Inner Yellow core
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(ox + 13, 28);
      ctx.quadraticCurveTo(ox + 12, 22, ox + 16, 14);
      ctx.quadraticCurveTo(ox + 19, 22, ox + 19, 28);
      ctx.closePath();
      ctx.fill();
    }

    canvas.refresh();
  }

  // --- GAS VALVE ---
  private static createGasValveTexture(scene: Phaser.Scene) {
    if (scene.textures.exists('gas_valve')) return;
    const canvas = scene.textures.createCanvas('gas_valve', 40, 40);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Pipe base
    ctx.fillStyle = '#ca8a04'; // Brass pipe
    ctx.fillRect(4, 16, 32, 8);
    ctx.fillStyle = '#854d0e';
    ctx.strokeRect(4, 16, 32, 8);

    // Valve wheel (Red circular wheel)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(20, 20, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Wheel spokes
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(20, 6);
    ctx.lineTo(20, 34);
    ctx.moveTo(6, 20);
    ctx.lineTo(34, 20);
    ctx.stroke();

    // Center nut
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(20, 20, 4, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  // --- ELECTRIC PANEL ---
  private static createElectricPanelTexture(scene: Phaser.Scene) {
    if (scene.textures.exists('electric_panel')) return;
    const canvas = scene.textures.createCanvas('electric_panel', 36, 44);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Metal cabinet
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(2, 2, 32, 40, 4);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Yellow warning triangle
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(18, 8);
    ctx.lineTo(28, 24);
    ctx.lineTo(8, 24);
    ctx.closePath();
    ctx.fill();

    // Lightning bolt in triangle
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(18, 11);
    ctx.lineTo(15, 17);
    ctx.lineTo(18, 17);
    ctx.lineTo(16, 22);
    ctx.lineTo(21, 16);
    ctx.lineTo(18, 16);
    ctx.closePath();
    ctx.fill();

    // Safety Breaker lever
    ctx.fillStyle = '#ef4444'; // Red ON state
    ctx.fillRect(12, 28, 12, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 30, 4, 4);

    canvas.refresh();
  }

  // --- REFILL STATION ---
  private static createRefillStationTexture(scene: Phaser.Scene) {
    if (scene.textures.exists('refill_station')) return;
    const canvas = scene.textures.createCanvas('refill_station', 36, 42);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Fire extinguisher cabinet
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(4, 4, 28, 34, 4);
    ctx.fill();

    // Glass window showing foam / extinguisher
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(8, 8, 20, 24);

    // Water/Foam icon
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(18, 20, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 28, 34);

    canvas.refresh();
  }

  // --- EXIT DOOR ---
  private static createExitDoorTexture(scene: Phaser.Scene) {
    if (scene.textures.exists('exit_door')) return;
    const canvas = scene.textures.createCanvas('exit_door', 48, 64);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Steel fire door
    ctx.fillStyle = '#475569';
    ctx.fillRect(4, 4, 40, 56);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(4, 4, 40, 56);

    // Illuminated Green Emergency Exit Sign
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(10, 8, 28, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SAÍDA', 24, 17);

    // Push bar handle
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(8, 36, 32, 6);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(12, 38, 24, 2);

    canvas.refresh();
  }

  // --- HELICOPTER ---
  private static createHelicopterTexture(scene: Phaser.Scene) {
    if (scene.textures.exists('helicopter')) return;
    const canvas = scene.textures.createCanvas('helicopter', 120, 80);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(60, 65, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Landing skids
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(35, 62);
    ctx.lineTo(85, 62);
    ctx.stroke();

    // Main fuselage (Red & White CBMMG Rescue Chopper)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(55, 42, 28, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cockpit windshield
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(38, 38, 10, Math.PI * 0.5, Math.PI * 1.5);
    ctx.fill();

    // Tail boom
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(80, 38, 30, 7);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(88, 38, 8, 7);

    // Text "BOMBEIROS"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CBMMG', 60, 44);

    // Top Rotor Hub & Blades
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(53, 20, 6, 8);
    // Rotor blades
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, 20);
    ctx.lineTo(105, 20);
    ctx.stroke();

    canvas.refresh();
  }

  // --- PARTICLES ---
  private static createParticleTextures(scene: Phaser.Scene) {
    // Water drop
    if (!scene.textures.exists('water_particle')) {
      const canvas = scene.textures.createCanvas('water_particle', 12, 12);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(6, 6, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(4, 4, 2, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Smoke particle
    if (!scene.textures.exists('smoke_particle')) {
      const canvas = scene.textures.createCanvas('smoke_particle', 24, 24);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(12, 12, 2, 12, 12, 12);
        grad.addColorStop(0, 'rgba(100, 116, 139, 0.7)');
        grad.addColorStop(1, 'rgba(51, 65, 85, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(12, 12, 11, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Electric spark
    if (!scene.textures.exists('spark_particle')) {
      const canvas = scene.textures.createCanvas('spark_particle', 10, 10);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#fde047';
        ctx.fillRect(4, 0, 2, 10);
        ctx.fillRect(0, 4, 10, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(4, 4, 2, 2);
        canvas.refresh();
      }
    }
  }
}
