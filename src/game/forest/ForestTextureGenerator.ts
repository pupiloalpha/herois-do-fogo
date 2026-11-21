import Phaser from 'phaser';

export class ForestTextureGenerator {
  public static generateAll(scene: Phaser.Scene) {
    this.createTerrainTiles(scene);
    this.createSmolderingLog(scene);
    this.createWildlifeSprites(scene);
    this.createHikerSprite(scene);
  }

  private static createTerrainTiles(scene: Phaser.Scene) {
    // Grass tile
    if (!scene.textures.exists('forest_grass')) {
      const canvas = scene.textures.createCanvas('forest_grass', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#3f6212'; // rich olive green
        ctx.fillRect(0, 0, 48, 48);
        ctx.fillStyle = '#4d7c0f';
        ctx.fillRect(0, 0, 24, 24);
        ctx.fillRect(24, 24, 24, 24);
        // Dry grass tufts (cerrado feel)
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 1.5;
        const tufts = [
          [10, 14],
          [34, 12],
          [16, 36],
          [38, 38],
        ];
        for (const [x, y] of tufts) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 3, y - 6);
          ctx.moveTo(x, y);
          ctx.lineTo(x + 2, y - 7);
          ctx.stroke();
        }
        canvas.refresh();
      }
    }

    // Dense bush tile
    if (!scene.textures.exists('forest_bush')) {
      const canvas = scene.textures.createCanvas('forest_bush', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#365314';
        ctx.fillRect(0, 0, 48, 48);
        // Leaf clusters
        const blobs = [
          { x: 16, y: 18, r: 12, c: '#15803d' },
          { x: 32, y: 18, r: 11, c: '#166534' },
          { x: 24, y: 30, r: 13, c: '#22c55e' },
          { x: 16, y: 32, r: 9, c: '#15803d' },
          { x: 33, y: 31, r: 9, c: '#16a34a' },
        ];
        for (const b of blobs) {
          ctx.fillStyle = b.c;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        }
        canvas.refresh();
      }
    }

    // Tree tile
    if (!scene.textures.exists('forest_tree')) {
      const canvas = scene.textures.createCanvas('forest_tree', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#365314';
        ctx.fillRect(0, 0, 48, 48);
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(26, 38, 17, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Trunk
        ctx.fillStyle = '#78350f';
        ctx.fillRect(20, 26, 8, 14);
        // Canopy
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.arc(24, 21, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(21, 18, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(20, 15, 7, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Firebreak (Aceiro de terra raspada)
    if (!scene.textures.exists('forest_firebreak')) {
      const canvas = scene.textures.createCanvas('forest_firebreak', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 0, 48, 48);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(3, 3, 42, 42);
        // Hoe scrape stripes
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        for (let y = 10; y <= 38; y += 9) {
          ctx.beginPath();
          ctx.moveTo(6, y);
          ctx.lineTo(42, y + 2);
          ctx.stroke();
        }
        // Highlight border so aceiro reads clearly
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(1, 1, 46, 46);
        canvas.refresh();
      }
    }

    // Mountain water stream (Refill station)
    if (!scene.textures.exists('forest_stream')) {
      const canvas = scene.textures.createCanvas('forest_stream', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(0, 0, 48, 48);
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(4, 4, 40, 40);
        // Water ripples
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(8, 16);
        ctx.quadraticCurveTo(24, 11, 40, 16);
        ctx.moveTo(8, 32);
        ctx.quadraticCurveTo(24, 27, 40, 32);
        ctx.stroke();
        canvas.refresh();
      }
    }

    // Granite rock obstacle
    if (!scene.textures.exists('forest_rock')) {
      const canvas = scene.textures.createCanvas('forest_rock', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#365314';
        ctx.fillRect(0, 0, 48, 48);
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(4, 6, 40, 36, 10);
        ctx.fill();
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.roundRect(8, 9, 28, 22, 8);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(16, 16, 5, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // Charred Ash (after fire extinguished/buried)
    if (!scene.textures.exists('forest_ash')) {
      const canvas = scene.textures.createCanvas('forest_ash', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, 48, 48);
        ctx.fillStyle = '#292524';
        ctx.fillRect(6, 6, 16, 14);
        ctx.fillRect(26, 26, 16, 14);
        ctx.fillStyle = '#44403c';
        ctx.beginPath();
        ctx.arc(24, 24, 6, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }
  }

  private static createSmolderingLog(scene: Phaser.Scene) {
    if (scene.textures.exists('forest_smoldering_log')) return;
    const canvas = scene.textures.createCanvas('forest_smoldering_log', 48, 48);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Charred base
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, 48, 48);

    // Fallen log body
    ctx.fillStyle = '#292524';
    ctx.beginPath();
    ctx.roundRect(6, 16, 36, 16, 6);
    ctx.fill();

    // Glowing red-orange embers inside cracks
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(16, 24, 5, 0, Math.PI * 2);
    ctx.arc(28, 23, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(16, 24, 2.5, 0, Math.PI * 2);
    ctx.arc(28, 23, 3, 0, Math.PI * 2);
    ctx.arc(36, 25, 2, 0, Math.PI * 2);
    ctx.fill();

    // Shovel hint ring
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, 42, 42);

    canvas.refresh();
  }

  private static createWildlifeSprites(scene: Phaser.Scene) {
    // 1. Lobo-Guará (Maned Wolf - golden-red fur, black legs/mane)
    if (!scene.textures.exists('animal_lobo_guara')) {
      const canvas = scene.textures.createCanvas('animal_lobo_guara', 44, 44);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(22, 38, 14, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Black legs
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(12, 27, 4, 10);
        ctx.fillRect(26, 27, 4, 10);
        // Tail
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.ellipse(9, 25, 6, 3.5, -0.4, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(11, 18, 20, 12, 5);
        ctx.fill();
        // Dark mane
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(20, 16, 8, 5);
        // Head & snout
        ctx.fillStyle = '#fb923c';
        ctx.beginPath();
        ctx.arc(31, 16, 7, 0, Math.PI * 2);
        ctx.fill();
        // Tall ears
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(26, 11);
        ctx.lineTo(28, 3);
        ctx.lineTo(31, 10);
        ctx.moveTo(31, 10);
        ctx.lineTo(35, 3);
        ctx.lineTo(36, 11);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(32, 14, 2, 2);
        canvas.refresh();
      }
    }

    // 2. Tucano (Black body, white throat, vibrant orange beak)
    if (!scene.textures.exists('animal_tucano')) {
      const canvas = scene.textures.createCanvas('animal_tucano', 44, 44);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(20, 38, 11, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(18, 25, 10, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        // White/yellow chest
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(21, 22, 5.5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Big orange-yellow beak
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(24, 13);
        ctx.quadraticCurveTo(40, 13, 39, 21);
        ctx.lineTo(24, 20);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(37, 18, 2, 0, Math.PI * 2);
        ctx.fill();
        // Eye
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(21, 15, 2.2, 0, Math.PI * 2);
        ctx.fill();
        canvas.refresh();
      }
    }

    // 3. Tatu (Armadillo - segmented armored shell)
    if (!scene.textures.exists('animal_tatu')) {
      const canvas = scene.textures.createCanvas('animal_tatu', 44, 44);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(22, 37, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Shell dome
        ctx.fillStyle = '#a8a29e';
        ctx.beginPath();
        ctx.arc(20, 27, 13, Math.PI, 0);
        ctx.lineTo(33, 32);
        ctx.lineTo(7, 32);
        ctx.closePath();
        ctx.fill();
        // Bands
        ctx.strokeStyle = '#57534e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15, 16);
        ctx.lineTo(15, 32);
        ctx.moveTo(21, 14);
        ctx.lineTo(21, 32);
        ctx.moveTo(27, 16);
        ctx.lineTo(27, 32);
        ctx.stroke();
        // Head & ears
        ctx.fillStyle = '#d6d3d1';
        ctx.beginPath();
        ctx.ellipse(35, 27, 6, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(36, 25, 2, 2);
        canvas.refresh();
      }
    }

    // 4. Tamanduá (Giant Anteater - bushy tail & dark stripe)
    if (!scene.textures.exists('animal_tamandua')) {
      const canvas = scene.textures.createCanvas('animal_tamandua', 44, 44);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(22, 38, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Bushy tail
        ctx.fillStyle = '#57534e';
        ctx.beginPath();
        ctx.ellipse(10, 24, 8, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillStyle = '#a8a29e';
        ctx.beginPath();
        ctx.roundRect(13, 20, 18, 11, 5);
        ctx.fill();
        // Signature black/white shoulder stripe
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.moveTo(21, 20);
        ctx.lineTo(28, 31);
        ctx.lineTo(23, 31);
        ctx.lineTo(17, 20);
        ctx.closePath();
        ctx.fill();
        // Long snout
        ctx.fillStyle = '#78716c';
        ctx.beginPath();
        ctx.moveTo(29, 21);
        ctx.lineTo(42, 26);
        ctx.lineTo(29, 27);
        ctx.closePath();
        ctx.fill();
        // Eye
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(31, 22, 2, 2);
        canvas.refresh();
      }
    }
  }

  private static createHikerSprite(scene: Phaser.Scene) {
    if (scene.textures.exists('forest_hiker')) return;
    const canvas = scene.textures.createCanvas('forest_hiker', 44, 44);
    if (!canvas) return;
    const ctx = canvas.getContext();

    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(22, 39, 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Backpack
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(9, 18, 9, 14, 3);
    ctx.fill();

    // High-vis vest
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.roundRect(14, 17, 18, 16, 4);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#334155';
    ctx.fillRect(16, 33, 5, 6);
    ctx.fillRect(24, 33, 5, 6);

    // Head + Sun hat
    ctx.fillStyle = '#f6d5b8';
    ctx.beginPath();
    ctx.arc(23, 13, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(23, 8, 11, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 12, 2, 2);
    ctx.fillRect(25, 12, 2, 2);

    canvas.refresh();
  }
}
