import Phaser from 'phaser';

export class FloodTextureGenerator {
  public static generateAll(scene: Phaser.Scene) {
    this.createWaterTiles(scene);
    this.createRoadAndShelterTiles(scene);
    this.createRescueLandmarks(scene);
    this.createHazards(scene);
    this.createVehicles(scene);
    this.createVictims(scene);
  }

  private static createWaterTiles(scene: Phaser.Scene) {
    if (!scene.textures.exists('flood_water')) {
      const canvas = scene.textures.createCanvas('flood_water', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#0c4a6e';
        ctx.fillRect(0, 0, 48, 48);

        // Subtle muddy floodwater tint & wave highlights
        ctx.fillStyle = 'rgba(14, 116, 144, 0.45)';
        ctx.fillRect(0, 0, 48, 24);

        ctx.strokeStyle = 'rgba(125, 211, 252, 0.28)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(4, 14);
        ctx.quadraticCurveTo(14, 10, 22, 14);
        ctx.moveTo(24, 34);
        ctx.quadraticCurveTo(34, 30, 44, 34);
        ctx.stroke();

        canvas.refresh();
      }
    }

    if (!scene.textures.exists('flood_rapid')) {
      const canvas = scene.textures.createCanvas('flood_rapid', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = '#075985';
        ctx.fillRect(0, 0, 48, 48);

        ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(6, 12);
        ctx.lineTo(26, 12);
        ctx.moveTo(16, 24);
        ctx.lineTo(42, 24);
        ctx.moveTo(6, 36);
        ctx.lineTo(30, 36);
        ctx.stroke();

        canvas.refresh();
      }
    }
  }

  private static createRoadAndShelterTiles(scene: Phaser.Scene) {
    if (!scene.textures.exists('flood_shelter')) {
      const canvas = scene.textures.createCanvas('flood_shelter', 64, 64);
      if (canvas) {
        const ctx = canvas.getContext();
        // Raised concrete pier / helipad platform
        ctx.fillStyle = '#334155';
        ctx.fillRect(2, 2, 60, 60);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.strokeRect(4, 4, 56, 56);

        // Helipad + Rescue Base H & orange ring
        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(32, 32, 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(22, 20, 5, 24);
        ctx.fillRect(37, 20, 5, 24);
        ctx.fillRect(22, 30, 20, 4);

        canvas.refresh();
      }
    }
  }

  private static createRescueLandmarks(scene: Phaser.Scene) {
    // Partially flooded car
    if (!scene.textures.exists('flood_car')) {
      const canvas = scene.textures.createCanvas('flood_car', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        // Water ripple ring
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(24, 28, 20, 13, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Car body
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.roundRect(8, 16, 32, 18, 5);
        ctx.fill();
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Car roof & windshield
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(14, 19, 20, 10);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(16, 21, 16, 6);

        canvas.refresh();
      }
    }

    // Sinking car (tilted and deeper in water)
    if (!scene.textures.exists('flood_sinking_car')) {
      const canvas = scene.textures.createCanvas('flood_sinking_car', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.strokeStyle = 'rgba(248, 113, 113, 0.75)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(24, 28, 21, 14, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.translate(24, 26);
        ctx.rotate(-0.22);
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.roundRect(-15, -8, 30, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#93c5fd';
        ctx.fillRect(-9, -6, 17, 9);
        // Submerging water over front hood
        ctx.fillStyle = 'rgba(12, 74, 110, 0.68)';
        ctx.fillRect(2, -10, 16, 20);
        ctx.restore();

        canvas.refresh();
      }
    }

    // Flooded house (water around foundation)
    if (!scene.textures.exists('flood_house')) {
      const canvas = scene.textures.createCanvas('flood_house', 56, 56);
      if (canvas) {
        const ctx = canvas.getContext();
        // Water foam around walls
        ctx.fillStyle = 'rgba(186, 230, 253, 0.35)';
        ctx.fillRect(4, 38, 48, 14);

        // Walls
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(10, 22, 36, 24);
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 22, 36, 24);

        // Red tiled roof
        ctx.fillStyle = '#c2410c';
        ctx.beginPath();
        ctx.moveTo(5, 25);
        ctx.lineTo(28, 6);
        ctx.lineTo(51, 25);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#7c2d12';
        ctx.stroke();

        // Warm lit window
        ctx.fillStyle = '#fde047';
        ctx.fillRect(22, 29, 12, 10);
        ctx.strokeStyle = '#78350f';
        ctx.strokeRect(22, 29, 12, 10);

        canvas.refresh();
      }
    }

    // Tall Rooftop building (for Helicopter rescue)
    if (!scene.textures.exists('flood_rooftop')) {
      const canvas = scene.textures.createCanvas('flood_rooftop', 60, 60);
      if (canvas) {
        const ctx = canvas.getContext();
        // Lower building facade submerged
        ctx.fillStyle = '#475569';
        ctx.fillRect(8, 22, 44, 34);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.strokeRect(8, 22, 44, 34);

        // Windows
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(14, 34, 8, 8);
        ctx.fillRect(26, 34, 8, 8);
        ctx.fillRect(38, 34, 8, 8);

        // Elevated dry concrete roof deck
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(6, 6, 48, 22);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(6, 6, 48, 22);

        // Orange rescue tarp / SOS cross on roof
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(25, 11, 10, 12);

        canvas.refresh();
      }
    }

    // Elevated Island
    if (!scene.textures.exists('flood_island')) {
      const canvas = scene.textures.createCanvas('flood_island', 56, 56);
      if (canvas) {
        const ctx = canvas.getContext();
        // Shallow sand rim
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.ellipse(28, 30, 24, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Grassy high patch
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.ellipse(28, 28, 19, 13, 0, 0, Math.PI * 2);
        ctx.fill();

        // Small palm/bush
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.arc(18, 24, 6, 0, Math.PI * 2);
        ctx.fill();

        canvas.refresh();
      }
    }
  }

  private static createHazards(scene: Phaser.Scene) {
    // Energized utility pole with crackling hazard
    if (!scene.textures.exists('flood_pole')) {
      const canvas = scene.textures.createCanvas('flood_pole', 44, 44);
      if (canvas) {
        const ctx = canvas.getContext();
        // Danger yellow water halo
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(22, 28, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Concrete pole tilted
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(19, 6, 6, 30);
        ctx.fillStyle = '#475569';
        ctx.fillRect(10, 12, 24, 4);

        // Insulators & spark bolts
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(12, 11, 3, 0, Math.PI * 2);
        ctx.arc(32, 11, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(12, 14);
        ctx.lineTo(8, 22);
        ctx.lineTo(13, 25);
        ctx.moveTo(32, 14);
        ctx.lineTo(36, 22);
        ctx.lineTo(31, 25);
        ctx.stroke();

        canvas.refresh();
      }
    }

    // Floating flood debris / logs / cars wreck obstacle
    if (!scene.textures.exists('flood_debris')) {
      const canvas = scene.textures.createCanvas('flood_debris', 48, 48);
      if (canvas) {
        const ctx = canvas.getContext();
        // Swirling foam
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(24, 26, 20, 13, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Driftwood / debris planks
        ctx.save();
        ctx.translate(24, 24);
        ctx.rotate(0.28);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-18, -7, 36, 10);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(-12, 1, 28, 8);
        ctx.restore();

        canvas.refresh();
      }
    }
  }

  private static createVehicles(scene: Phaser.Scene) {
    // Inflatable CBMMG Rescue Boat (pointing RIGHT at angle 0)
    const drawBoat = (key: string, helmetColor: string, suitColor: string) => {
      if (scene.textures.exists(key)) return;
      const canvas = scene.textures.createCanvas(key, 56, 40);
      if (!canvas) return;
      const ctx = canvas.getContext();

      // Wake foam behind boat
      ctx.fillStyle = 'rgba(224, 242, 254, 0.5)';
      ctx.fillRect(1, 14, 10, 12);

      // Hull outer inflatable tube (bright CBMMG rescue orange)
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(10, 6);
      ctx.lineTo(40, 6);
      ctx.quadraticCurveTo(54, 20, 40, 34);
      ctx.lineTo(10, 34);
      ctx.quadraticCurveTo(6, 20, 10, 6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#9a3412';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner boat deck
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(14, 12, 26, 16, 4);
      ctx.fill();

      // Reflective yellow safety band
      ctx.fillStyle = '#facc15';
      ctx.fillRect(36, 9, 4, 22);

      // Pilot inside
      ctx.fillStyle = suitColor;
      ctx.beginPath();
      ctx.arc(24, 20, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = helmetColor;
      ctx.beginPath();
      ctx.arc(25, 20, 4.5, 0, Math.PI * 2);
      ctx.fill();

      canvas.refresh();
    };

    drawBoat('vehicle_boat_foguinho', '#facc15', '#b45309');
    drawBoat('vehicle_boat_faisca', '#ffffff', '#f97316');

    // CBMMG Arcanjo Rescue Helicopter (pointing RIGHT at angle 0)
    if (!scene.textures.exists('vehicle_heli')) {
      const canvas = scene.textures.createCanvas('vehicle_heli', 68, 46);
      if (canvas) {
        const ctx = canvas.getContext();

        // Tail boom (left)
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(4, 20, 26, 6);
        // Tail stabilizer
        ctx.fillStyle = '#facc15';
        ctx.fillRect(4, 12, 5, 22);

        // Skids
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(24, 9);
        ctx.lineTo(52, 9);
        ctx.moveTo(24, 37);
        ctx.lineTo(52, 37);
        ctx.stroke();

        // Main fuselage (CBMMG Red + Yellow stripe)
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.ellipse(42, 23, 20, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Yellow CBMMG stripe
        ctx.fillStyle = '#facc15';
        ctx.fillRect(28, 20, 18, 6);

        // Cockpit glass
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(52, 23, 8, 8, 0, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.fill();

        canvas.refresh();
      }
    }

    // Spinning Helicopter Rotor Blades
    if (!scene.textures.exists('vehicle_heli_rotor')) {
      const canvas = scene.textures.createCanvas('vehicle_heli_rotor', 76, 76);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.beginPath();
        ctx.arc(38, 38, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(248, 250, 252, 0.85)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(4, 38);
        ctx.lineTo(72, 38);
        ctx.moveTo(38, 4);
        ctx.lineTo(38, 72);
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(38, 38, 5, 0, Math.PI * 2);
        ctx.fill();

        canvas.refresh();
      }
    }
  }

  private static createVictims(scene: Phaser.Scene) {
    if (!scene.textures.exists('flood_victim')) {
      const canvas = scene.textures.createCanvas('flood_victim', 28, 28);
      if (canvas) {
        const ctx = canvas.getContext();
        // Orange life vest body
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(7, 11, 14, 13, 4);
        ctx.fill();
        ctx.strokeStyle = '#7c2d12';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Waving arms
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(8, 14);
        ctx.lineTo(3, 7);
        ctx.moveTo(20, 14);
        ctx.lineTo(25, 7);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(14, 7, 4.5, 0, Math.PI * 2);
        ctx.fill();

        canvas.refresh();
      }
    }
  }
}
