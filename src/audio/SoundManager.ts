/**
 * Procedural Web Audio API Sound Synthesizer
 * Zero external audio files required, 100% offline ready and instant loading.
 * Designed with warm, playful, layered arcade tones suitable for young players.
 */

export type EmergencyAlertType =
  | 'smoke'
  | 'heat'
  | 'time_low'
  | 'fire_spread'
  | 'sinking'
  | 'low_resource'
  | 'wind_shift'
  | 'hazard';

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private isMuted: boolean = false;

  // Active continuous loops
  private sprayNodes: {
    source: AudioBufferSourceNode;
    lfo: OscillatorNode;
    gain: GainNode;
    nodes: AudioNode[];
  } | null = null;

  private turboNodes: {
    osc: OscillatorNode;
    noise: AudioBufferSourceNode;
    gain: GainNode;
    nodes: AudioNode[];
  } | null = null;

  private sirenNodes: {
    osc: OscillatorNode;
    lfo: OscillatorNode;
    gain: GainNode;
  } | null = null;

  // Cooldown registry (ms timestamps via performance.now)
  private cooldowns: Map<string, number> = new Map();

  constructor() {
    try {
      const saved = localStorage.getItem('herois_do_fogo_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();

        // Master compressor + gain prevents harsh clipping when multiple sounds layer
        try {
          const compressor = this.ctx.createDynamicsCompressor();
          compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
          compressor.knee.setValueAtTime(18, this.ctx.currentTime);
          compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
          compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
          compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.88, this.ctx.currentTime);

          this.masterGain.connect(compressor);
          compressor.connect(this.ctx.destination);
        } catch {
          this.masterGain = null;
        }
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private getOutputNode(): AudioNode | null {
    if (!this.ctx) return null;
    return this.masterGain ?? this.ctx.destination;
  }

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === this.ctx.sampleRate) {
      return this.noiseBuffer;
    }

    // 2 seconds of smooth white noise cached once
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  private canPlay(key: string, minIntervalMs: number): boolean {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const last = this.cooldowns.get(key) ?? 0;
    if (now - last < minIntervalMs) {
      return false;
    }
    this.cooldowns.set(key, now);
    return true;
  }

  private playTone(opts: {
    freq: number;
    endFreq?: number;
    type?: OscillatorType;
    startOffset?: number;
    duration: number;
    gain?: number;
    attack?: number;
  }) {
    const ctx = this.ctx;
    const dest = this.getOutputNode();
    if (!ctx || !dest) return;

    const t = ctx.currentTime + (opts.startOffset ?? 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const peak = opts.gain ?? 0.16;
    const attack = Math.min(opts.attack ?? 0.012, opts.duration * 0.4);

    osc.type = opts.type ?? 'sine';
    osc.frequency.setValueAtTime(Math.max(20, opts.freq), t);
    if (opts.endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.endFreq), t + opts.duration);
    }

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + opts.duration + 0.02);
  }

  private playFilteredNoise(opts: {
    filterType: BiquadFilterType;
    freq: number;
    endFreq?: number;
    q?: number;
    startOffset?: number;
    duration: number;
    gain?: number;
  }) {
    const ctx = this.ctx;
    const dest = this.getOutputNode();
    const buffer = this.getNoiseBuffer();
    if (!ctx || !dest || !buffer) return;

    const t = ctx.currentTime + (opts.startOffset ?? 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType;
    filter.frequency.setValueAtTime(Math.max(40, opts.freq), t);
    if (opts.endFreq !== undefined) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, opts.endFreq), t + opts.duration);
    }
    filter.Q.setValueAtTime(opts.q ?? 1.2, t);

    const gain = ctx.createGain();
    const peak = opts.gain ?? 0.14;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(peak, t + Math.min(0.015, opts.duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    source.start(t, Math.random() * 0.8);
    source.stop(t + opts.duration + 0.02);
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
      this.stopAllLoops();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public stopAllLoops() {
    this.stopSpray();
    this.stopTurbo();
    this.stopSiren();
  }

  // --- EXTINGUISHER & WATER SPRAY ---

  public startSpray() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getOutputNode();
    const buffer = this.getNoiseBuffer();
    if (!ctx || !dest || !buffer || this.sprayNodes) return;

    try {
      const now = ctx.currentTime;

      // Pressurized ignition burst ("pssh!") on engagement
      this.playFilteredNoise({
        filterType: 'bandpass',
        freq: 2600,
        endFreq: 1350,
        q: 1.5,
        duration: 0.09,
        gain: 0.15,
      });

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Core water-stream bandpass filter
      const mainFilter = ctx.createBiquadFilter();
      mainFilter.type = 'bandpass';
      mainFilter.frequency.setValueAtTime(1450, now);
      mainFilter.Q.setValueAtTime(1.3, now);

      // Subtle high mist shimmer
      const mistFilter = ctx.createBiquadFilter();
      mistFilter.type = 'highpass';
      mistFilter.frequency.setValueAtTime(3200, now);

      const mistGain = ctx.createGain();
      mistGain.gain.setValueAtTime(0.24, now);

      // LFO modulates foam/pressure texture so it feels alive
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(8.5, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(340, now);
      lfo.connect(lfoGain);
      lfoGain.connect(mainFilter.frequency);

      const masterSprayGain = ctx.createGain();
      masterSprayGain.gain.setValueAtTime(0.0001, now);
      masterSprayGain.gain.linearRampToValueAtTime(0.16, now + 0.045);

      source.connect(mainFilter);
      source.connect(mistFilter);
      mainFilter.connect(masterSprayGain);
      mistFilter.connect(mistGain);
      mistGain.connect(masterSprayGain);
      masterSprayGain.connect(dest);

      lfo.start(now);
      source.start(now);

      this.sprayNodes = {
        source,
        lfo,
        gain: masterSprayGain,
        nodes: [source, lfo, lfoGain, mainFilter, mistFilter, mistGain, masterSprayGain],
      };
    } catch {
      // Ignore audio error
    }
  }

  public stopSpray() {
    if (!this.sprayNodes) return;
    const active = this.sprayNodes;
    this.sprayNodes = null;

    try {
      const ctx = this.ctx;
      if (ctx) {
        const now = ctx.currentTime;
        active.gain.gain.cancelScheduledValues(now);
        active.gain.gain.setValueAtTime(Math.max(0.0001, active.gain.gain.value), now);
        active.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
        setTimeout(() => {
          try {
            active.source.stop();
            active.lfo.stop();
            active.nodes.forEach((n) => n.disconnect());
          } catch {
            // Ignore cleanup race
          }
        }, 55);
      } else {
        active.source.stop();
        active.lfo.stop();
        active.nodes.forEach((n) => n.disconnect());
      }
    } catch {
      // Ignore
    }
  }

  public playExtinguish() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    if (!this.canPlay('extinguish', 90)) return;

    try {
      // 1. Crisp steam sizzle
      this.playFilteredNoise({
        filterType: 'bandpass',
        freq: 2500,
        endFreq: 950,
        q: 1.4,
        duration: 0.14,
        gain: 0.16,
      });

      // 2. Playful bubbly water-drop pop + reward chime
      this.playTone({
        freq: 460,
        endFreq: 920,
        type: 'sine',
        duration: 0.11,
        gain: 0.18,
      });
      this.playTone({
        freq: 1174.66, // D6 sparkle
        type: 'triangle',
        startOffset: 0.055,
        duration: 0.14,
        gain: 0.13,
      });
    } catch {
      // Ignore
    }
  }

  public playEmptyTank() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    if (!this.canPlay('empty_tank', 350)) return;

    try {
      // Cartoon double dry valve click + brief air puff
      this.playTone({ freq: 290, endFreq: 130, type: 'triangle', duration: 0.055, gain: 0.16 });
      this.playTone({ freq: 230, endFreq: 105, type: 'triangle', startOffset: 0.075, duration: 0.06, gain: 0.14 });
      this.playFilteredNoise({
        filterType: 'highpass',
        freq: 2200,
        endFreq: 1400,
        startOffset: 0.02,
        duration: 0.08,
        gain: 0.07,
      });
    } catch {
      // Ignore
    }
  }

  public playRefill() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    if (!this.canPlay('refill', 250)) return;

    try {
      // Bubbly water-filling ascending glissando
      const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        this.playTone({
          freq: freq * 0.85,
          endFreq: freq,
          type: 'sine',
          startOffset: idx * 0.048,
          duration: 0.13,
          gain: 0.15,
        });
      });
      this.playFilteredNoise({
        filterType: 'bandpass',
        freq: 900,
        endFreq: 1900,
        duration: 0.24,
        gain: 0.08,
      });
    } catch {
      // Ignore
    }
  }

  // --- PLAYFUL RESCUE SOUNDS ---

  public playRescueCivilian() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const offset = idx * 0.07;
        this.playTone({
          freq,
          type: 'triangle',
          startOffset: offset,
          duration: idx === notes.length - 1 ? 0.28 : 0.16,
          gain: 0.16,
        });
        // Soft octave bell shimmer
        this.playTone({
          freq: freq * 2,
          type: 'sine',
          startOffset: offset,
          duration: 0.12,
          gain: 0.05,
        });
      });
    } catch {
      // Ignore
    }
  }

  public playRescuePet(petType: 'dog' | 'cat' = 'dog') {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      if (petType === 'dog') {
        // Two cheerful puppy yips + celebratory bell ding
        [0, 0.125].forEach((offset) => {
          this.playTone({
            freq: 290,
            endFreq: 470,
            type: 'triangle',
            startOffset: offset,
            duration: 0.055,
            gain: 0.18,
          });
          this.playTone({
            freq: 450,
            endFreq: 210,
            type: 'sine',
            startOffset: offset + 0.04,
            duration: 0.06,
            gain: 0.15,
          });
        });
        this.playTone({
          freq: 1046.5,
          type: 'sine',
          startOffset: 0.26,
          duration: 0.24,
          gain: 0.14,
        });
      } else {
        // Sweet melodic cat meow + happy sparkle
        this.playTone({
          freq: 560,
          endFreq: 910,
          type: 'sine',
          duration: 0.14,
          gain: 0.16,
          attack: 0.03,
        });
        this.playTone({
          freq: 910,
          endFreq: 510,
          type: 'triangle',
          startOffset: 0.13,
          duration: 0.18,
          gain: 0.11,
        });
        this.playTone({
          freq: 1174.66,
          type: 'sine',
          startOffset: 0.28,
          duration: 0.24,
          gain: 0.13,
        });
      }
    } catch {
      // Ignore
    }
  }

  public playRescueWildlife(species?: string) {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Forest marimba melody + joyful nature chirp
      const isBird = species === 'tucano' || species === 'arara';
      const notes = isBird
        ? [659.25, 830.61, 987.77, 1318.51] // E5, G#5, B5, E6
        : [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6

      notes.forEach((freq, idx) => {
        this.playTone({
          freq,
          type: 'triangle',
          startOffset: idx * 0.065,
          duration: idx === notes.length - 1 ? 0.25 : 0.14,
          gain: 0.15,
        });
      });

      // Playful bird/forest trill at the end
      this.playTone({
        freq: 1480,
        endFreq: 2093,
        type: 'sine',
        startOffset: 0.24,
        duration: 0.09,
        gain: 0.1,
      });
    } catch {
      // Ignore
    }
  }

  public playRescueWinch() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Rhythmic winch pulley zip + heroic catch chord
      this.playTone({
        freq: 280,
        endFreq: 860,
        type: 'triangle',
        duration: 0.22,
        gain: 0.17,
      });
      [0.03, 0.09, 0.15].forEach((offset, idx) => {
        this.playTone({
          freq: 620 + idx * 140,
          type: 'sine',
          startOffset: offset,
          duration: 0.04,
          gain: 0.09,
        });
      });
      this.playTone({
        freq: 987.77, // B5 safe aboard ping
        type: 'sine',
        startOffset: 0.21,
        duration: 0.22,
        gain: 0.15,
      });
    } catch {
      // Ignore
    }
  }

  public playSplashDropoff() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Gentle water splash + bright shelter-safe chord
      this.playFilteredNoise({
        filterType: 'bandpass',
        freq: 1300,
        endFreq: 520,
        duration: 0.16,
        gain: 0.12,
      });
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        this.playTone({
          freq,
          type: 'triangle',
          startOffset: idx * 0.055,
          duration: idx === notes.length - 1 ? 0.28 : 0.15,
          gain: 0.15,
        });
      });
    } catch {
      // Ignore
    }
  }

  // --- TOOLS & INTERACTIONS ---

  public playGasValve() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Mechanical valve turn clank + sealing hiss + OK ding
      this.playTone({ freq: 170, endFreq: 55, type: 'triangle', duration: 0.12, gain: 0.22 });
      this.playFilteredNoise({ filterType: 'bandpass', freq: 1800, endFreq: 700, duration: 0.11, gain: 0.09 });
      this.playTone({ freq: 783.99, type: 'sine', startOffset: 0.09, duration: 0.14, gain: 0.12 });
    } catch {
      // Ignore
    }
  }

  public playElectricCut() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Breaker snap + safe power-down sweep
      this.playTone({ freq: 720, endFreq: 90, type: 'sawtooth', duration: 0.16, gain: 0.14 });
      this.playTone({ freq: 523.25, endFreq: 659.25, type: 'sine', startOffset: 0.1, duration: 0.14, gain: 0.12 });
    } catch {
      // Ignore
    }
  }

  public playHoeDig() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    try {
      this.playTone({ freq: 170, endFreq: 58, type: 'triangle', duration: 0.11, gain: 0.2 });
      this.playFilteredNoise({ filterType: 'lowpass', freq: 650, duration: 0.09, gain: 0.12 });
    } catch {
      // Ignore
    }
  }

  public playSwatterHit() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    try {
      this.playTone({ freq: 250, endFreq: 72, type: 'sine', duration: 0.09, gain: 0.22 });
      this.playFilteredNoise({ filterType: 'bandpass', freq: 900, endFreq: 350, duration: 0.08, gain: 0.13 });
    } catch {
      // Ignore
    }
  }

  public playShovelBury() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    try {
      this.playTone({ freq: 140, endFreq: 48, type: 'triangle', duration: 0.15, gain: 0.2 });
      this.playFilteredNoise({ filterType: 'lowpass', freq: 520, duration: 0.14, gain: 0.13 });
      this.playTone({ freq: 659.25, type: 'sine', startOffset: 0.09, duration: 0.12, gain: 0.1 });
    } catch {
      // Ignore
    }
  }

  public playVehicleSwap() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    try {
      this.playTone({ freq: 340, endFreq: 680, type: 'triangle', duration: 0.14, gain: 0.16 });
      this.playTone({ freq: 880, type: 'sine', startOffset: 0.08, duration: 0.14, gain: 0.12 });
    } catch {
      // Ignore
    }
  }

  // --- TURBO THRUSTER LOOP (FLOOD BOAT / HELI) ---

  public startTurbo(isHelicopter: boolean = false) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getOutputNode();
    const buffer = this.getNoiseBuffer();
    if (!ctx || !dest || !buffer || this.turboNodes) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isHelicopter ? 110 : 78, now);

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isHelicopter ? 580 : 420, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.085, now + 0.07);

      osc.connect(filter);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(now);
      noise.start(now);

      this.turboNodes = {
        osc,
        noise,
        gain,
        nodes: [osc, noise, filter, gain],
      };
    } catch {
      // Ignore
    }
  }

  public stopTurbo() {
    if (!this.turboNodes) return;
    const active = this.turboNodes;
    this.turboNodes = null;

    try {
      const ctx = this.ctx;
      if (ctx) {
        const now = ctx.currentTime;
        active.gain.gain.cancelScheduledValues(now);
        active.gain.gain.setValueAtTime(Math.max(0.0001, active.gain.gain.value), now);
        active.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        setTimeout(() => {
          try {
            active.osc.stop();
            active.noise.stop();
            active.nodes.forEach((n) => n.disconnect());
          } catch {
            // Ignore
          }
        }, 60);
      } else {
        active.osc.stop();
        active.noise.stop();
        active.nodes.forEach((n) => n.disconnect());
      }
    } catch {
      // Ignore
    }
  }

  // --- EMERGENCY ALERTS & HAZARDS ---

  public playEmergencyAlert(type: EmergencyAlertType) {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      switch (type) {
        case 'time_low': {
          if (!this.canPlay('alert_time_low', 850)) return;
          // Crisp playful countdown pip
          this.playTone({ freq: 987.77, type: 'sine', duration: 0.07, gain: 0.14 });
          this.playTone({ freq: 783.99, type: 'triangle', startOffset: 0.085, duration: 0.08, gain: 0.11 });
          break;
        }
        case 'smoke': {
          if (!this.canPlay('alert_smoke', 2200)) return;
          // Distinct dual-tone smoke mask alert
          this.playTone({ freq: 620, endFreq: 480, type: 'triangle', duration: 0.11, gain: 0.14 });
          this.playTone({ freq: 620, endFreq: 480, type: 'triangle', startOffset: 0.14, duration: 0.11, gain: 0.14 });
          break;
        }
        case 'heat': {
          if (!this.canPlay('alert_heat', 2200)) return;
          // Rapid thermal warning chirp
          this.playTone({ freq: 784, endFreq: 988, type: 'triangle', duration: 0.09, gain: 0.13 });
          this.playTone({ freq: 988, endFreq: 784, type: 'triangle', startOffset: 0.11, duration: 0.1, gain: 0.13 });
          break;
        }
        case 'fire_spread': {
          if (!this.canPlay('alert_fire_spread', 1400)) return;
          // Brief fire crackle + alert ping
          this.playFilteredNoise({ filterType: 'bandpass', freq: 1800, endFreq: 900, duration: 0.14, gain: 0.12 });
          this.playTone({ freq: 523.25, endFreq: 698.46, type: 'triangle', startOffset: 0.03, duration: 0.12, gain: 0.11 });
          break;
        }
        case 'sinking': {
          if (!this.canPlay('alert_sinking', 2600)) return;
          // Urgent water sonar double-pulse
          this.playTone({ freq: 740, endFreq: 587, type: 'sine', duration: 0.1, gain: 0.15 });
          this.playTone({ freq: 740, endFreq: 587, type: 'sine', startOffset: 0.15, duration: 0.12, gain: 0.15 });
          break;
        }
        case 'low_resource': {
          if (!this.canPlay('alert_low_resource', 3500)) return;
          this.playTone({ freq: 587.33, type: 'sine', duration: 0.08, gain: 0.12 });
          this.playTone({ freq: 440.0, type: 'sine', startOffset: 0.1, duration: 0.11, gain: 0.12 });
          break;
        }
        case 'wind_shift': {
          if (!this.canPlay('alert_wind', 1500)) return;
          this.playFilteredNoise({ filterType: 'bandpass', freq: 450, endFreq: 1350, duration: 0.28, gain: 0.12 });
          this.playTone({ freq: 659.25, endFreq: 880, type: 'sine', startOffset: 0.06, duration: 0.16, gain: 0.1 });
          break;
        }
        case 'hazard': {
          if (!this.canPlay('alert_hazard', 550)) return;
          this.playTone({ freq: 190, endFreq: 85, type: 'triangle', duration: 0.14, gain: 0.2 });
          break;
        }
      }
    } catch {
      // Ignore
    }
  }

  public playHurt() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    if (!this.canPlay('hurt', 420)) return;

    try {
      this.playTone({ freq: 210, endFreq: 72, type: 'triangle', duration: 0.18, gain: 0.24 });
      this.playTone({ freq: 150, endFreq: 55, type: 'sawtooth', duration: 0.14, gain: 0.1 });
    } catch {
      // Ignore
    }
  }

  public playCough() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    if (!this.canPlay('cough', 1800)) return;

    try {
      this.playTone({ freq: 135, endFreq: 88, type: 'triangle', duration: 0.08, gain: 0.15 });
      this.playTone({ freq: 120, endFreq: 80, type: 'triangle', startOffset: 0.09, duration: 0.09, gain: 0.14 });
      this.playFilteredNoise({ filterType: 'bandpass', freq: 600, duration: 0.15, gain: 0.07 });
    } catch {
      // Ignore
    }
  }

  public playWarning() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    if (!this.canPlay('warning', 450)) return;

    try {
      this.playTone({ freq: 880, type: 'sine', duration: 0.075, gain: 0.14 });
      this.playTone({ freq: 659.25, type: 'sine', startOffset: 0.085, duration: 0.09, gain: 0.14 });
    } catch {
      // Ignore
    }
  }

  public playElectricZap() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    if (!this.canPlay('zap', 350)) return;

    try {
      this.playTone({ freq: 920, endFreq: 140, type: 'sawtooth', duration: 0.15, gain: 0.16 });
      this.playFilteredNoise({ filterType: 'highpass', freq: 1800, duration: 0.12, gain: 0.12 });
    } catch {
      // Ignore
    }
  }

  // --- STAGE COMPLETION, MILESTONES & UI ---

  public playMissionStart() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Walkie-talkie chirp + hero launch chord
      this.playTone({ freq: 1180, endFreq: 1560, type: 'sine', duration: 0.055, gain: 0.1 });
      this.playTone({ freq: 523.25, type: 'triangle', startOffset: 0.08, duration: 0.12, gain: 0.14 });
      this.playTone({ freq: 783.99, type: 'triangle', startOffset: 0.15, duration: 0.22, gain: 0.16 });
    } catch {
      // Ignore
    }
  }

  public playExitUnlocked() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Heroic upward beacon signaling unlocked exit
      const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
      notes.forEach((f, idx) => {
        this.playTone({
          freq: f,
          type: 'triangle',
          startOffset: idx * 0.06,
          duration: idx === notes.length - 1 ? 0.3 : 0.14,
          gain: 0.16,
        });
      });
    } catch {
      // Ignore
    }
  }

  public playFloorClear() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Multi-voice upbeat arcade victory fanfare
      const melody = [
        { f: 523.25, t: 0.0, d: 0.11 },
        { f: 659.25, t: 0.1, d: 0.11 },
        { f: 783.99, t: 0.2, d: 0.11 },
        { f: 1046.5, t: 0.31, d: 0.38 },
      ];
      melody.forEach((n) => {
        this.playTone({ freq: n.f, type: 'triangle', startOffset: n.t, duration: n.d, gain: 0.2 });
        this.playTone({ freq: n.f * 0.5, type: 'sine', startOffset: n.t, duration: n.d, gain: 0.1 });
      });
      // Sparkle third on top of final chord
      this.playTone({ freq: 1318.51, type: 'sine', startOffset: 0.34, duration: 0.32, gain: 0.11 });
    } catch {
      // Ignore
    }
  }

  public playGrandVictory() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Full heroic victory parade
      const fanfare = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.11, d: 0.12 },
        { f: 783.99, t: 0.22, d: 0.12 },
        { f: 880.0, t: 0.33, d: 0.12 },
        { f: 783.99, t: 0.45, d: 0.12 },
        { f: 1046.5, t: 0.58, d: 0.55 },
      ];
      fanfare.forEach((n) => {
        this.playTone({ freq: n.f, type: 'triangle', startOffset: n.t, duration: n.d, gain: 0.2 });
        this.playTone({ freq: n.f * 0.5, type: 'sine', startOffset: n.t, duration: n.d, gain: 0.11 });
      });
      // Celebratory high sparkle chord
      this.playTone({ freq: 1318.51, type: 'sine', startOffset: 0.6, duration: 0.48, gain: 0.11 });
      this.playTone({ freq: 1567.98, type: 'sine', startOffset: 0.65, duration: 0.45, gain: 0.09 });
    } catch {
      // Ignore
    }
  }

  public playMedalUnlock() {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    if (!this.canPlay('medal_unlock', 400)) return;

    try {
      const notes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
      notes.forEach((f, idx) => {
        this.playTone({
          freq: f,
          type: 'sine',
          startOffset: idx * 0.065,
          duration: idx === notes.length - 1 ? 0.34 : 0.15,
          gain: 0.13,
        });
      });
    } catch {
      // Ignore
    }
  }

  public playGameOver() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      // Gentle, empathetic descending tones (not grating)
      const melody = [
        { f: 392.0, t: 0.0, d: 0.22 },
        { f: 349.23, t: 0.2, d: 0.22 },
        { f: 329.63, t: 0.4, d: 0.22 },
        { f: 261.63, t: 0.6, d: 0.46 },
      ];
      melody.forEach((item) => {
        this.playTone({
          freq: item.f,
          type: 'triangle',
          startOffset: item.t,
          duration: item.d,
          gain: 0.18,
        });
      });
    } catch {
      // Ignore
    }
  }

  public playClick() {
    if (this.isMuted) return;
    if (!this.initContext()) return;

    try {
      this.playTone({ freq: 760, endFreq: 420, type: 'sine', duration: 0.045, gain: 0.11, attack: 0.005 });
    } catch {
      // Ignore
    }
  }

  public startSiren() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getOutputNode();
    if (!ctx || !dest || this.sirenNodes) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.6, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(220, now);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gain);
      gain.connect(dest);

      lfo.start(now);
      osc.start(now);
      this.sirenNodes = { osc, lfo, gain };
    } catch {
      // Ignore
    }
  }

  public stopSiren() {
    if (!this.sirenNodes) return;
    const active = this.sirenNodes;
    this.sirenNodes = null;
    try {
      active.osc.stop();
      active.lfo.stop();
      active.osc.disconnect();
      active.lfo.disconnect();
      active.gain.disconnect();
    } catch {
      // Ignore
    }
  }
}

export const sounds = new SoundManager();
