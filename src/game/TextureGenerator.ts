import Phaser from 'phaser';

export class TextureGenerator {
  public static generateAll(scene: Phaser.Scene) {
    this.createFloorTiles(scene);
    this.createWallTextures(scene);
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
    this.createSmokeHazardTextures(scene);
  }

  // --- 10 DIVERSE FLOOR THEMES ---
  private static createFloorTiles(scene: Phaser.Scene) {
    // Default fallback
    if (!scene.textures.exists('floor_tile')) {
      this.drawTile(scene, 'floor_tile', '#1e293b', '#334155', '#0f172a');
    }

    // Floor 1: Reception - Warm Terracotta & Beige Marble
    this.drawTile(scene, 'floor_tile_1', '#78350f', '#92400e', '#451a03');

    // Floor 2: Corporate Office - Professional Navy Blue Carpet
    this.drawTile(scene, 'floor_tile_2', '#1e3a8a', '#2563eb', '#0f172a');

    // Floor 3: Industrial Kitchen - Brick Red Quarry Tile with white grout
    this.drawTile(scene, 'floor_tile_3', '#991b1b', '#b91c1c', '#7f1d1d', true);

    // Floor 4: Datacenter - Cyber Grid Dark Slate with Cyan Accents
    this.drawTile(scene, 'floor_tile_4', '#090d16', '#0284c7', '#0369a1');

    // Floor 5: Residential - Cozy Emerald Green Carpet & Wood
    this.drawTile(scene, 'floor_tile_5', '#065f46', '#047857', '#022c22');

    // Floor 6: Construction / Renovation - Concrete Gray with Hazard Stripes
    this.drawTile(scene, 'floor_tile_6', '#3f3f46', '#52525b', '#27272a');

    // Floor 7: Library & Archives - Rich Mahogany Hardwood Planks
    this.drawTile(scene, 'floor_tile_7', '#572c05', '#713f12', '#361703');

    // Floor 8: Medical Center - Clean Clinical Mint & White Hospital Vinyl
    this.drawTile(scene, 'floor_tile_8', '#115e59', '#14b8a6', '#042f2e');

    // Floor 9: Penthouse - Luxury Royal Violet Marble
    this.drawTile(scene, 'floor_tile_9', '#4c1d95', '#6d28d9', '#2e1065');

    // Floor 10: Rooftop & Helipad - Heavy Dark Asphalt Deck
    this.drawTile(scene, 'floor_tile_10', '#18181b', '#27272a', '#09090b');
  }

  private static drawTile(scene: Phaser.Scene, key: string, baseColor: string, borderColor: string, accentColor: string, isQuarry: boolean = false) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 64, 64);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Tile base
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 64, 64);

    // Grout / Border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = isQuarry ? 2 : 1.5;
    ctx.strokeRect(0, 0, 64, 64);

    // Inner patterned texture
    ctx.fillStyle = accentColor;
    ctx.fillRect(4, 4, 26, 26);
    ctx.fillRect(34, 34, 26, 26);

    // Specific floor motifs:
    if (key === 'floor_tile_4') {
      // Datacenter: Glowing cyan cyber circuit grid lines & solder nodes
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 32);
      ctx.lineTo(64, 32);
      ctx.moveTo(32, 0);
      ctx.lineTo(32, 64);
      ctx.stroke();

      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(31, 31, 3, 3);
      ctx.fillRect(15, 15, 2, 2);
      ctx.fillRect(47, 47, 2, 2);
    } else if (key === 'floor_tile_6') {
      // Construction: Hazard diagonal caution stripes on top and bottom borders
      ctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
      for (let x = -16; x < 64; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 8, 0);
        ctx.lineTo(x + 2, 8);
        ctx.lineTo(x - 6, 8);
        ctx.closePath();
        ctx.fill();
      }
    } else if (key === 'floor_tile_7') {
      // Library: Wooden parquet plank grain lines
      ctx.strokeStyle = 'rgba(113, 63, 18, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(4, 12); ctx.lineTo(30, 12);
      ctx.moveTo(4, 20); ctx.lineTo(30, 20);
      ctx.moveTo(34, 42); ctx.lineTo(60, 42);
      ctx.moveTo(34, 50); ctx.lineTo(60, 50);
      ctx.stroke();
    } else if (key === 'floor_tile_8') {
      // Medical: Clean medical green/white cross motif in corner
      ctx.fillStyle = 'rgba(20, 184, 166, 0.35)';
      ctx.fillRect(15, 13, 4, 10);
      ctx.fillRect(12, 16, 10, 4);
      ctx.fillRect(45, 43, 4, 10);
      ctx.fillRect(42, 46, 10, 4);
    } else if (key === 'floor_tile_9') {
      // Penthouse: Golden marble inlays
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(6, 6, 22, 22);
      ctx.strokeRect(36, 36, 22, 22);
    } else if (key === 'floor_tile_10') {
      // Rooftop: Heavy industrial asphalt with grip specks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(10, 10, 3, 3);
      ctx.fillRect(40, 22, 2, 2);
      ctx.fillRect(24, 48, 3, 3);
      ctx.fillRect(52, 54, 2, 2);
    } else {
      // Subtle gloss / texture speckle
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(8, 8, 18, 2);
      ctx.fillRect(38, 38, 18, 2);
    }

    canvas.refresh();
  }

  // --- WALL TEXTURES PER THEME ---
  private static createWallTextures(scene: Phaser.Scene) {
    if (!scene.textures.exists('wall_tile')) {
      this.drawWall(scene, 'wall_tile', '#475569', '#334155', '#64748b');
    }

    this.drawWall(scene, 'wall_tile_1', '#7c2d12', '#431407', '#9a3412');
    this.drawWall(scene, 'wall_tile_2', '#334155', '#1e293b', '#475569');
    this.drawWall(scene, 'wall_tile_3', '#7f1d1d', '#450a0a', '#991b1b');
    this.drawWall(scene, 'wall_tile_4', '#0f172a', '#020617', '#0369a1');
    this.drawWall(scene, 'wall_tile_5', '#14532d', '#052e16', '#166534');
    this.drawWall(scene, 'wall_tile_6', '#52525b', '#27272a', '#71717a');
    this.drawWall(scene, 'wall_tile_7', '#581c87', '#3b0764', '#6b21a8');
    this.drawWall(scene, 'wall_tile_8', '#134e4a', '#042f2e', '#0f766e');
    this.drawWall(scene, 'wall_tile_9', '#3b0764', '#1e0538', '#581c87');
    this.drawWall(scene, 'wall_tile_10', '#27272a', '#09090b', '#3f3f46');
  }

  private static drawWall(scene: Phaser.Scene, key: string, baseColor: string, darkColor: string, lightColor: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 32, 32);

    ctx.fillStyle = darkColor;
    ctx.fillRect(0, 0, 32, 6);
    ctx.fillRect(0, 26, 32, 6);

    ctx.strokeStyle = lightColor;
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
    ctx.fillStyle = '#d4a373';
    ctx.beginPath();
    ctx.roundRect(12, 18, 24, 20, 6);
    ctx.fill();

    // Dark shoulder pads
    ctx.fillStyle = '#334155';
    ctx.fillRect(12, 18, 24, 5);

    // Reflective yellow & silver strips
    ctx.fillStyle = '#eab308';
    ctx.fillRect(12, 28, 24, 3);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(12, 31, 24, 1.5);

    // Legs / Boots
    ctx.fillStyle = '#b08968';
    ctx.fillRect(14, 38, 7, 7);
    ctx.fillRect(27, 38, 7, 7);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(13, 42, 8, 4);
    ctx.fillRect(27, 42, 8, 4);

    // Extinguisher tank carried on back
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(33, 20, 10, 16, 3);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(35, 14, 6, 6);

    // Head / Face
    ctx.fillStyle = '#f6d5b8';
    ctx.beginPath();
    ctx.arc(24, 15, 8.5, 0, Math.PI * 2);
    ctx.fill();

    // Yellow Firefighter Helmet
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(24, 11, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    // Helmet rim
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.roundRect(11, 12, 26, 4, 2);
    ctx.fill();

    // CBMMG Red Crest Badge on Helmet
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(24, 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(24, 8, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Face features: eyes & kind smile
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(21, 15, 2, 2);
    ctx.fillRect(27, 15, 2, 2);
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 1.2;
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
    ctx.ellipse(24, 44, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Braided Ponytail
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(14, 23, 4, 9, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(12, 27, 4, 2);

    // Body (Vibrant Orange Firefighter Uniform)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.roundRect(13, 19, 22, 18, 5);
    ctx.fill();

    // Silver Reflective Stripes
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(13, 27, 22, 2.5);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(13, 29.5, 22, 1);

    // Legs & Kneepads
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(15, 38, 6, 7);
    ctx.fillRect(27, 38, 6, 7);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(14, 35, 7, 4);
    ctx.fillRect(27, 35, 7, 4);
    ctx.fillRect(14, 42, 8, 4);
    ctx.fillRect(26, 42, 8, 4);

    // Extinguisher tank
    ctx.fillStyle = '#dc2626';
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

  // --- DIVERSE CIVILIANS ---
  private static createCivilianSprites(scene: Phaser.Scene) {
    // Default fallback
    this.drawCivilian(scene, 'civilian', '#3b82f6', '#fed7aa', '#78350f');

    // Floor 1: Receptionist (Dona Vera - Pink cardigan, blonde/gray bun, glasses)
    this.drawCivilian(scene, 'civilian_receptionist', '#ec4899', '#fce7f3', '#fef08a', 'Dona Vera', true);

    // Floor 2: Office Analyst (Carlos - Sky blue shirt, dark tie)
    this.drawCivilian(scene, 'civilian_analyst', '#0284c7', '#fed7aa', '#1e293b', 'Carlos');

    // Floor 3: Chef (Chef Jean - Double-breasted white coat with tall chef hat)
    this.drawCivilianChef(scene, 'civilian_chef');

    // Floor 4: IT Tech Engineer (Mariana - Yellow hoodie, headphones)
    this.drawCivilianIT(scene, 'civilian_it');

    // Floor 5: Family Mother with Baby (Dona Helena - Lavender dress & baby wrap)
    this.drawCivilianFamily(scene, 'civilian_family');

    // Floor 6: Construction Worker (Mestre Tonho - Orange safety vest, yellow hardhat)
    this.drawCivilianBuilder(scene, 'civilian_builder');

    // Floor 7: Librarian (Profª Lúcia - Emerald sweater, glasses, book)
    this.drawCivilian(scene, 'civilian_librarian', '#059669', '#fde68a', '#451a03', 'Profª Lúcia', true);

    // Floor 8: Medical Doctor (Dr. Marcos - White lab coat with medical red cross)
    this.drawCivilianDoctor(scene, 'civilian_doctor');

    // Floor 9: Corporate Executive (Diretor Roberto - Charcoal tuxedo, crimson tie)
    this.drawCivilian(scene, 'civilian_vip', '#1e293b', '#fed7aa', '#94a3b8', 'Diretor Roberto');

    // Additional Diverse Civilians:
    // Floor 5 / 7: Elderly Resident with Walking Cane (Vovô Silveira)
    this.drawCivilianElderly(scene, 'civilian_elderly');

    // Floor 2 / 9: Student / Intern with Backpack (Pedro)
    this.drawCivilianStudent(scene, 'civilian_student');
  }

  private static drawCivilian(scene: Phaser.Scene, key: string, shirtColor: string, skinColor: string, hairColor: string, _label?: string, hasGlasses: boolean = false) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 40, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Red distress alert icon
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 20, 9);

    // Shirt / Body
    ctx.fillStyle = shirtColor;
    ctx.beginPath();
    ctx.roundRect(11, 22, 18, 16, 4);
    ctx.fill();

    // Legs / Trousers
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(13, 38, 5, 8);
    ctx.fillRect(22, 38, 5, 8);

    // Head
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(20, 16, 7, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(20, 14, 7, Math.PI, Math.PI * 2);
    ctx.fill();

    // Glasses if applicable
    if (hasGlasses) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(15, 14, 4, 3);
      ctx.strokeRect(21, 14, 4, 3);
    }

    // Waving hands in distress
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(6, 20, 3.5, 0, Math.PI * 2);
    ctx.arc(34, 20, 3.5, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  private static drawCivilianChef(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 40, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Distress beacon
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 20, 8);

    // White chef toque (tall hat)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(14, 9, 12, 8, 2);
    ctx.fill();
    ctx.arc(20, 9, 6, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(20, 18, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Chef double-breasted coat
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(11, 23, 18, 15, 4);
    ctx.fill();
    // Black buttons
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(18, 26, 1.5, 1.5);
    ctx.fillRect(21, 26, 1.5, 1.5);
    ctx.fillRect(18, 30, 1.5, 1.5);
    ctx.fillRect(21, 30, 1.5, 1.5);

    // Pants
    ctx.fillStyle = '#334155';
    ctx.fillRect(13, 38, 5, 8);
    ctx.fillRect(22, 38, 5, 8);

    canvas.refresh();
  }

  private static drawCivilianIT(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 40, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Beacon
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 20, 9);

    // Head & dark hair
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(20, 16, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(20, 14, 7, Math.PI, Math.PI * 2);
    ctx.fill();

    // Headset
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(20, 15, 8, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    // Yellow Hoodie
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.roundRect(11, 22, 18, 16, 4);
    ctx.fill();

    // Jeans
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(13, 38, 5, 8);
    ctx.fillRect(22, 38, 5, 8);

    canvas.refresh();
  }

  private static drawCivilianFamily(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 40, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Alert beacon
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 20, 9);

    // Mother head & hair
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(20, 16, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(20, 14, 7.5, Math.PI, Math.PI * 2);
    ctx.fill();

    // Lavender dress
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.roundRect(11, 22, 18, 18, 4);
    ctx.fill();

    // Baby wrap held in arms
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.ellipse(22, 28, 6, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(24, 25, 3, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  private static drawCivilianBuilder(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 40, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Beacon
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 7px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 20, 8);

    // Yellow Construction Hardhat
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(20, 12, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(11, 14, 18, 3);

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(20, 18, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Orange Safety Vest
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.roundRect(11, 23, 18, 15, 3);
    ctx.fill();
    // Silver reflective strips
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(14, 24, 3, 14);
    ctx.fillRect(23, 24, 3, 14);

    // Work pants
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(13, 38, 5, 8);
    ctx.fillRect(22, 38, 5, 8);

    canvas.refresh();
  }

  private static drawCivilianDoctor(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 40, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Beacon
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 20, 9);

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(20, 16, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(20, 14, 7, Math.PI, Math.PI * 2);
    ctx.fill();

    // White Medical Lab Coat
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(11, 22, 18, 16, 4);
    ctx.fill();

    // Red Cross on Chest
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(19, 25, 2, 6);
    ctx.fillRect(17, 27, 6, 2);

    // Pants
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(13, 38, 5, 8);
    ctx.fillRect(22, 38, 5, 8);

    canvas.refresh();
  }

  private static drawCivilianElderly(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 40, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Alert beacon
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 20, 9);

    // Head with silver white hair & glasses
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(20, 16, 7, 0, Math.PI * 2);
    ctx.fill();

    // Silver wavy hair
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(20, 14, 7.5, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    // Eyeglasses
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, 4, 3);
    ctx.strokeRect(21, 15, 4, 3);

    // Warm knit burgundy/brown cardigan
    ctx.fillStyle = '#831843';
    ctx.beginPath();
    ctx.roundRect(11, 22, 18, 16, 4);
    ctx.fill();

    // Gray pants
    ctx.fillStyle = '#475569';
    ctx.fillRect(13, 38, 5, 8);
    ctx.fillRect(22, 38, 5, 8);

    // Wooden walking cane in hand
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(33, 26, 3, Math.PI, 0);
    ctx.lineTo(36, 44);
    ctx.stroke();

    canvas.refresh();
  }

  private static drawCivilianStudent(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 40, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Alert beacon
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(20, 6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 20, 9);

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(20, 16, 7, 0, Math.PI * 2);
    ctx.fill();

    // Backwards red baseball cap
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(20, 13, 8, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(13, 11, 6, 2.5);

    // Striped teal t-shirt
    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.roundRect(11, 22, 18, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(11, 26, 18, 2);
    ctx.fillRect(11, 31, 18, 2);

    // Denim jeans & sneakers
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(13, 38, 5, 8);
    ctx.fillRect(22, 38, 5, 8);

    // Blue student backpack on side
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(5, 23, 6, 13, 2);
    ctx.fill();

    canvas.refresh();
  }

  // --- DIVERSE PETS ---
  private static createPetSprites(scene: Phaser.Scene) {
    // 1. Brazilian Caramel Street Dog (Caramelo)
    this.drawDog(scene, 'pet_dog', '#d97706', '#b45309', '#ef4444');
    this.drawDog(scene, 'pet_dog_caramelo', '#d97706', '#b45309', '#ef4444');

    // 2. Dalmatian Firehouse Companion (White with black spots)
    this.drawDalmatian(scene, 'pet_dog_dalmatian');

    // 3. Fluffy Poodle (Soft silver/white with blue bow)
    this.drawDog(scene, 'pet_dog_poodle', '#e2e8f0', '#94a3b8', '#0284c7');

    // 4. Cute Fawn Pug (Wrinkled snout & curly tail)
    this.drawPug(scene, 'pet_dog_pug');

    // 5. Cats: Ginger Tabby, Black Cat, Siamese Cat, Calico Tricolor
    this.drawCat(scene, 'pet_cat', '#f97316', '#c2410c', '#22c55e');
    this.drawCat(scene, 'pet_cat_ginger', '#f97316', '#c2410c', '#22c55e');
    this.drawCat(scene, 'pet_cat_black', '#18181b', '#09090b', '#eab308');
    this.drawCat(scene, 'pet_cat_siamese', '#fef3c7', '#78350f', '#0284c7');
    this.drawCalicoCat(scene, 'pet_cat_calico');

    // 6. Brazilian Pet Bird / Arara in perch
    this.drawBird(scene, 'pet_bird_arara');

    // 7. Fluffy White Bunny / Pet Rabbit
    this.drawBunny(scene, 'pet_bunny');
  }

  private static drawDog(scene: Phaser.Scene, key: string, bodyColor: string, earColor: string, collarColor: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 36, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(18, 20, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillRect(10, 24, 4, 7);
    ctx.fillRect(22, 24, 4, 7);

    // Head
    ctx.beginPath();
    ctx.arc(28, 14, 7, 0, Math.PI * 2);
    ctx.fill();

    // Floppy Ear
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(26, 12, 3, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Collar
    ctx.fillStyle = collarColor;
    ctx.fillRect(23, 17, 3, 5);

    // Tail
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(6, 20);
    ctx.quadraticCurveTo(2, 12, 5, 8);
    ctx.stroke();

    // Eye and snout
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(31, 13, 2, 2);
    ctx.fillRect(34, 15, 2, 2);

    canvas.refresh();
  }

  private static drawDalmatian(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 36, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // White body
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(18, 20, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Black dalmatian spots
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(15, 18, 2.5, 0, Math.PI * 2);
    ctx.arc(22, 21, 2, 0, Math.PI * 2);
    ctx.arc(12, 22, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(10, 24, 4, 7);
    ctx.fillRect(22, 24, 4, 7);

    // Head
    ctx.beginPath();
    ctx.arc(28, 14, 7, 0, Math.PI * 2);
    ctx.fill();

    // Black ear
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(26, 12, 3, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Red firefighter collar
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(23, 17, 3, 5);

    // Tail
    ctx.strokeStyle = '#f8fafc';
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

  private static drawCat(scene: Phaser.Scene, key: string, bodyColor: string, earColor: string, eyeColor: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 32, 30);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Body
    ctx.fillStyle = bodyColor;
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
    ctx.fillStyle = earColor;
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

    // Upright curled tail
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(6, 19);
    ctx.quadraticCurveTo(2, 12, 3, 6);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = eyeColor;
    ctx.fillRect(25, 12, 1.5, 1.5);

    canvas.refresh();
  }

  private static drawBird(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Perch cage base
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, 8, 20, 22);

    // Vibrant green body
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(16, 20, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blue wing
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(14, 21, 3, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Head & Yellow beak
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(16, 13, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(19, 13);
    ctx.lineTo(23, 15);
    ctx.lineTo(19, 17);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(17, 12, 1.5, 1.5);

    canvas.refresh();
  }

  private static drawPug(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 36, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Body (Fawn tan)
    ctx.fillStyle = '#d6b896';
    ctx.beginPath();
    ctx.ellipse(17, 20, 11, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sturdy little legs
    ctx.fillRect(10, 24, 4, 7);
    ctx.fillRect(20, 24, 4, 7);

    // Large rounded pug head
    ctx.beginPath();
    ctx.arc(26, 14, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Black pug mask & snout
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(28, 16, 4.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Black floppy ears
    ctx.beginPath();
    ctx.ellipse(23, 10, 3, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Red cute collar
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(22, 18, 3, 4);

    // Big shiny dark eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(26, 12.5, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(26, 12, 1, 1);

    // Curly cinnamon tail
    ctx.strokeStyle = '#d6b896';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(7, 16, 4, 0, Math.PI * 1.5);
    ctx.stroke();

    canvas.refresh();
  }

  private static drawCalicoCat(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 32, 30);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // White base body
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(15, 19, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Calico patches (Orange & Black)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(12, 16, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(18, 21, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(9, 23, 3, 6);
    ctx.fillRect(18, 23, 3, 6);

    // Head
    ctx.beginPath();
    ctx.arc(23, 13, 6, 0, Math.PI * 2);
    ctx.fill();

    // Orange ear and Black ear
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(20, 9);
    ctx.lineTo(22, 4);
    ctx.lineTo(24, 9);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(25, 9);
    ctx.lineTo(27, 4);
    ctx.lineTo(29, 9);
    ctx.closePath();
    ctx.fill();

    // Tail (Striped)
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(6, 19);
    ctx.quadraticCurveTo(2, 12, 3, 6);
    ctx.stroke();

    // Emerald eyes
    ctx.fillStyle = '#10b981';
    ctx.fillRect(25, 12, 1.5, 1.5);

    canvas.refresh();
  }

  private static drawBunny(scene: Phaser.Scene, key: string) {
    if (scene.textures.exists(key)) return;
    const canvas = scene.textures.createCanvas(key, 32, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Fluffy white body
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(14, 21, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(21, 17, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Long upright bunny ears with pink insides
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(19, 8, 2.5, 7, -0.15, 0, Math.PI * 2);
    ctx.ellipse(24, 8, 2.5, 7, 0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.ellipse(19, 8, 1.2, 5, -0.15, 0, Math.PI * 2);
    ctx.ellipse(24, 8, 1.2, 5, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Paws & round cotton tail
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(12, 26, 3, 4);
    ctx.fillRect(17, 26, 3, 4);
    ctx.beginPath();
    ctx.arc(5, 20, 3, 0, Math.PI * 2);
    ctx.fill();

    // Pink twitchy nose & ruby eye
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(25, 18, 1.5, 1.5);
    ctx.fillStyle = '#be123c';
    ctx.fillRect(23, 15, 1.5, 1.5);

    canvas.refresh();
  }

  // --- REFILL STATION: FIRE HYDRANT ---
  private static createRefillStationTexture(scene: Phaser.Scene) {
    if (scene.textures.exists('refill_station')) return;
    const canvas = scene.textures.createCanvas('refill_station', 44, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(22, 45, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main Hydrant Base (Cast iron red)
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.roundRect(14, 18, 16, 26, 3);
    ctx.fill();

    // Flange ring
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(12, 40, 20, 4);

    // Domed Bonnet & Brass Operating Nut
    ctx.beginPath();
    ctx.arc(22, 18, 8, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.fillRect(19, 8, 6, 5);

    // Side discharge couplings / nozzles
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(8, 24, 7, 6);
    ctx.fillRect(29, 24, 7, 6);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(6, 25, 2, 4);
    ctx.fillRect(36, 25, 2, 4);

    // Water Droplet Symbol
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(22, 30, 4, 0, Math.PI * 2);
    ctx.fill();

    // Text "ÁGUA"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ÁGUA', 22, 38);

    canvas.refresh();
  }

  // --- GAS VALVE ---
  private static createGasValveTexture(scene: Phaser.Scene) {
    if (scene.textures.exists('gas_valve')) return;
    const canvas = scene.textures.createCanvas('gas_valve', 40, 40);
    if (!canvas) return;
    const ctx = canvas.getContext();

    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(4, 16, 32, 8);
    ctx.fillStyle = '#854d0e';
    ctx.strokeRect(4, 16, 32, 8);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(20, 20, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(20, 6);
    ctx.lineTo(20, 34);
    ctx.moveTo(6, 20);
    ctx.lineTo(34, 20);
    ctx.stroke();

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

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(2, 2, 32, 40, 4);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(18, 8);
    ctx.lineTo(28, 24);
    ctx.lineTo(8, 24);
    ctx.closePath();
    ctx.fill();

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

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(12, 28, 12, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 30, 4, 4);

    canvas.refresh();
  }

  // --- FIRE FRAMES ---
  private static createFireFrames(scene: Phaser.Scene) {
    if (scene.textures.exists('fire_flame')) return;
    const canvas = scene.textures.createCanvas('fire_flame', 96, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    for (let f = 0; f < 3; f++) {
      const ox = f * 32;
      const wobble = (f % 2 === 0 ? 2 : -2);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.beginPath();
      ctx.ellipse(ox + 16, 26, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(ox + 8, 28);
      ctx.quadraticCurveTo(ox + 4, 16, ox + 14 + wobble, 6);
      ctx.quadraticCurveTo(ox + 18, 14, ox + 20, 10);
      ctx.quadraticCurveTo(ox + 26, 16, ox + 24, 28);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(ox + 10, 28);
      ctx.quadraticCurveTo(ox + 8, 18, ox + 15 + wobble, 10);
      ctx.quadraticCurveTo(ox + 22, 18, ox + 22, 28);
      ctx.closePath();
      ctx.fill();

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

  // --- EXIT DOOR ---
  private static createExitDoorTexture(scene: Phaser.Scene) {
    if (scene.textures.exists('exit_door')) return;
    const canvas = scene.textures.createCanvas('exit_door', 48, 64);
    if (!canvas) return;
    const ctx = canvas.getContext();

    ctx.fillStyle = '#475569';
    ctx.fillRect(4, 4, 40, 56);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(4, 4, 40, 56);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(10, 8, 28, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SAÍDA', 24, 17);

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

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(60, 65, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(35, 62);
    ctx.lineTo(85, 62);
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(55, 42, 28, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(38, 38, 10, Math.PI * 0.5, Math.PI * 1.5);
    ctx.fill();

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(80, 38, 30, 7);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(88, 38, 8, 7);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CBMMG', 60, 44);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(53, 20, 6, 8);
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

    if (!scene.textures.exists('smoke_particle')) {
      const canvas = scene.textures.createCanvas('smoke_particle', 28, 28);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(14, 14, 2, 14, 14, 14);
        grad.addColorStop(0, 'rgba(80, 95, 115, 0.8)');
        grad.addColorStop(0.6, 'rgba(45, 55, 70, 0.45)');
        grad.addColorStop(1, 'rgba(20, 25, 35, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(14, 14, 13, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

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

  // --- SMOKE HAZARD TEXTURES ---
  private static createSmokeHazardTextures(scene: Phaser.Scene) {
    // Volumetric smoke cloud for environmental drifting fog
    if (!scene.textures.exists('smoke_cloud')) {
      const canvas = scene.textures.createCanvas('smoke_cloud', 96, 96);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(48, 48, 8, 48, 48, 46);
        grad.addColorStop(0, 'rgba(30, 41, 59, 0.7)');
        grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.45)');
        grad.addColorStop(0.8, 'rgba(15, 23, 42, 0.2)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(48, 48, 46, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Dense acrid toxic smoke (dark gray-green with orange embers reflection)
    if (!scene.textures.exists('smoke_toxic')) {
      const canvas = scene.textures.createCanvas('smoke_toxic', 110, 110);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(55, 55, 10, 55, 55, 54);
        grad.addColorStop(0, 'rgba(10, 15, 25, 0.85)');
        grad.addColorStop(0.4, 'rgba(20, 30, 35, 0.65)');
        grad.addColorStop(0.75, 'rgba(40, 25, 15, 0.35)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(55, 55, 52, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Drifting corridor smoke haze
    if (!scene.textures.exists('smoke_haze')) {
      const canvas = scene.textures.createCanvas('smoke_haze', 128, 128);
      if (canvas) {
        const ctx = canvas.getContext();
        const grad = ctx.createRadialGradient(64, 64, 12, 64, 64, 62);
        grad.addColorStop(0, 'rgba(51, 65, 85, 0.4)');
        grad.addColorStop(0.6, 'rgba(30, 41, 59, 0.2)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(64, 64, 60, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }
  }
}
