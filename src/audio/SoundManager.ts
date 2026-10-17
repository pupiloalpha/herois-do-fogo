/**
 * Procedural Web Audio API Sound Synthesizer
 * Zero external audio files required, 100% offline ready and instant loading.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sprayNode: { osc: AudioNode; gain: GainNode } | null = null;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;

  constructor() {
    // Read mute preference from localStorage
    try {
      const saved = localStorage.getItem('herois_do_fogo_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('herois_do_fogo_muted', String(muted));
    } catch {
      // Ignore
    }
    if (muted) {
      this.stopSpray();
      this.stopSiren();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- SOUND EFFECTS ---

  public startSpray() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.sprayNode) return;

    try {
      // White noise buffer for water spray
      const bufferSize = this.ctx.sampleRate * 1;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      // Bandpass filter to sound like pressurized water/foam spray
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      this.sprayNode = { osc: whiteNoise, gain };
    } catch {
      // Ignore audio error
    }
  }

  public stopSpray() {
    if (this.sprayNode) {
      try {
        (this.sprayNode.osc as AudioBufferSourceNode).stop();
        this.sprayNode.osc.disconnect();
      } catch {
        // Ignore
      }
      this.sprayNode = null;
    }
  }

  public playExtinguish() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Steam sizzle burst
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore
    }
  }

  public playRescueCivilian() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = this.ctx!.currentTime + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  public playRescuePet(petType: 'dog' | 'cat' = 'dog') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (petType === 'dog') {
        // Friendly dog bark synth (two short cheerful woofs)
        [0, 0.12].forEach((offset) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const t = now + offset;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, t);
          osc.frequency.exponentialRampToValueAtTime(160, t + 0.09);

          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(t);
          osc.stop(t + 0.09);
        });
      } else {
        // Gentle cat meow synth
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.linearRampToValueAtTime(920, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {
      // Ignore
    }
  }

  public playGasValve() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Mechanical clank
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  public playElectricCut() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Circuit breaker snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  }

  public playHurt() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }

  public playRefill() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [300, 450, 600, 750];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = this.ctx!.currentTime + idx * 0.05;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch {
      // Ignore
    }
  }

  public playFloorClear() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Triumphant fanfare
      const melody = [
        { f: 523.25, d: 0.12 },
        { f: 659.25, d: 0.12 },
        { f: 783.99, d: 0.12 },
        { f: 1046.5, d: 0.35 },
      ];
      let cur = this.ctx.currentTime;
      melody.forEach(item => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, cur);
        gain.gain.setValueAtTime(0.28, cur);
        gain.gain.exponentialRampToValueAtTime(0.001, cur + item.d);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(cur);
        osc.stop(cur + item.d);
        cur += item.d * 0.9;
      });
    } catch {
      // Ignore
    }
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const melody = [
        { f: 392.0, d: 0.25 },
        { f: 369.99, d: 0.25 },
        { f: 329.63, d: 0.25 },
        { f: 293.66, d: 0.5 },
      ];
      let cur = this.ctx.currentTime;
      melody.forEach(item => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(item.f, cur);
        gain.gain.setValueAtTime(0.22, cur);
        gain.gain.exponentialRampToValueAtTime(0.001, cur + item.d);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(cur);
        osc.stop(cur + item.d);
        cur += item.d * 0.9;
      });
    } catch {
      // Ignore
    }
  }

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }

  public startSiren() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.sirenOsc) return;

    try {
      this.sirenOsc = this.ctx.createOscillator();
      this.sirenGain = this.ctx.createGain();
      this.sirenGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.sirenOsc.type = 'sine';
      this.sirenOsc.frequency.setValueAtTime(650, this.ctx.currentTime);

      // Low frequency oscillator for siren pitch modulation
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.6, this.ctx.currentTime); // ~1 siren cycle per 1.5s
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(this.sirenOsc.frequency);

      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(this.ctx.destination);

      lfo.start();
      this.sirenOsc.start();
    } catch {
      // Ignore
    }
  }

  public stopSiren() {
    if (this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch {
        // Ignore
      }
      this.sirenOsc = null;
      this.sirenGain = null;
    }
  }
}

export const sounds = new SoundManager();
