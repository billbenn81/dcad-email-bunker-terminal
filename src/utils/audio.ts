// Web Audio API Synthesizer for Bunker Environment

import caveDroneUrl from '../assets/cave drone.mp3';

class BunkerAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;

  // Custom Audio File
  private customAudio: HTMLAudioElement | null = null;
  private isUsingCustomAudio = false;
  private customAudioName: string | null = null;
  private hasInitializedDefaultAsset = false;

  // Audio Preset
  private currentPreset: 'cavern' | 'bunker' = 'cavern';

  // Drone Nodes
  private droneGain: GainNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;

  // Cavern Specific Filter & Wind LFO
  private cavernWindGain: GainNode | null = null;
  private cavernFilter: BiquadFilterNode | null = null;
  private cavernLfo: OscillatorNode | null = null;

  // Electricity Nodes
  private elecGain: GainNode | null = null;
  private mainsHumOsc: OscillatorNode | null = null;
  private mainsHarmonicOsc: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;

  // Master Gain
  private masterGain: GainNode | null = null;

  private droneVol = 0.35;
  private elecVol = 0.0;
  private masterVol = 0.6;

  public init(): boolean {
    if (!this.hasInitializedDefaultAsset && !this.isUsingCustomAudio) {
      this.hasInitializedDefaultAsset = true;
      this.loadCustomAudioFile(caveDroneUrl, 'cave drone.mp3');
    } else if (this.customAudio) {
      this.customAudio.play().catch(() => {});
      this.isPlaying = true;
    }

    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      if (!this.isUsingCustomAudio) {
        this.startDrone();
      }
      this.isPlaying = true;
      return true;
    } catch (e) {
      console.warn('Web Audio API initialized failed', e);
      return false;
    }
  }

  public loadCustomAudioFile(file: File | string, fileName?: string) {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }

    const src = typeof file === 'string' ? file : URL.createObjectURL(file);
    this.customAudioName = fileName || (typeof file === 'string' ? file.split('/').pop() || 'custom-audio.mp3' : file.name);

    this.customAudio = new Audio(src);
    this.customAudio.loop = true;
    this.customAudio.volume = this.masterVol;
    this.isUsingCustomAudio = true;

    // Silence synth drone & electricity when playing custom audio
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    if (this.elecGain && this.ctx) {
      this.elecGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }

    this.customAudio.play().then(() => {
      this.isPlaying = true;
    }).catch((err) => {
      console.log('Autoplay blocked or waiting for user gesture:', err);
    });
  }

  public clearCustomAudio() {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    this.isUsingCustomAudio = false;
    this.customAudioName = null;

    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(this.droneVol, now, 0.05);
      if (this.elecGain) this.elecGain.gain.setTargetAtTime(this.elecVol, now, 0.05);
    }
  }

  public getCustomAudioName(): string | null {
    return this.customAudioName;
  }

  public getIsUsingCustomAudio(): boolean {
    return this.isUsingCustomAudio;
  }

  public setPreset(preset: 'cavern' | 'bunker') {
    this.currentPreset = preset;
    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (preset === 'cavern') {
        if (this.subOsc) this.subOsc.frequency.setTargetAtTime(38, now, 0.2);
        if (this.droneOsc2) this.droneOsc2.frequency.setTargetAtTime(44, now, 0.2);
        if (this.cavernFilter) this.cavernFilter.frequency.setTargetAtTime(85, now, 0.2);
      } else {
        if (this.subOsc) this.subOsc.frequency.setTargetAtTime(52, now, 0.2);
        if (this.droneOsc2) this.droneOsc2.frequency.setTargetAtTime(58.5, now, 0.2);
        if (this.cavernFilter) this.cavernFilter.frequency.setTargetAtTime(140, now, 0.2);
      }
    }
  }

  public getPreset(): 'cavern' | 'bunker' {
    return this.currentPreset;
  }

  private startDrone() {
    if (!this.ctx || !this.masterGain) return;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(this.droneVol, this.ctx.currentTime);

    const isCavern = this.currentPreset === 'cavern';

    // Deep sub bass sine wave (38Hz for Cavern, 52Hz for Bunker)
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(isCavern ? 38 : 52, this.ctx.currentTime);

    // Subtle low frequency rumble (44Hz for Cavern, 58.5Hz for Bunker)
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(isCavern ? 44 : 58.5, this.ctx.currentTime);

    // LFO for slow breathing rumble oscillation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // ~12 sec cavern breathe wave
    lfoGain.gain.setValueAtTime(4.0, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.subOsc.frequency);
    lfo.start();

    // Lowpass filter to ensure sub-bass cavern acoustics
    this.cavernFilter = this.ctx.createBiquadFilter();
    this.cavernFilter.type = 'lowpass';
    this.cavernFilter.frequency.setValueAtTime(isCavern ? 85 : 140, this.ctx.currentTime);
    this.cavernFilter.Q.setValueAtTime(isCavern ? 2.5 : 1.0, this.ctx.currentTime);

    this.subOsc.connect(this.cavernFilter);
    this.droneOsc2.connect(this.cavernFilter);
    this.cavernFilter.connect(this.droneGain);

    // Subterranean Cavern Wind / Echo Resonance Generator
    const windBufferSize = this.ctx.sampleRate * 4;
    const windBuffer = this.ctx.createBuffer(1, windBufferSize, this.ctx.sampleRate);
    const windData = windBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < windBufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise algorithm
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      windData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      windData[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const windNoise = this.ctx.createBufferSource();
    windNoise.buffer = windBuffer;
    windNoise.loop = true;

    // Resonant sweeping bandpass filter for cavern resonance
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    // LFO for cavern wind sweep modulation
    const windLfo = this.ctx.createOscillator();
    const windLfoGain = this.ctx.createGain();
    windLfo.type = 'sine';
    windLfo.frequency.setValueAtTime(0.04, this.ctx.currentTime); // ~25 sec sweep
    windLfoGain.gain.setValueAtTime(90, this.ctx.currentTime); // sweep between 50Hz and 230Hz

    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);
    windLfo.start();

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

    // Lowpass filter on wind to remove any high-frequency clicks, pops, or drip-like noise
    const windLowpass = this.ctx.createBiquadFilter();
    windLowpass.type = 'lowpass';
    windLowpass.frequency.setValueAtTime(320, this.ctx.currentTime);

    windNoise.connect(windFilter);
    windFilter.connect(windLowpass);
    windLowpass.connect(windGain);
    windGain.connect(this.droneGain);
    windNoise.start();

    this.droneGain.connect(this.masterGain);

    this.subOsc.start();
    this.droneOsc2.start();
  }

  private startElectricity() {
    // Disabled - electricity buzz and hum removed
  }

  public setVolumes(master: number, drone: number, electricity: number) {
    this.masterVol = master;
    if (this.customAudio) {
      this.customAudio.volume = master;
    }
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) this.masterGain.gain.setTargetAtTime(master, now, 0.05);
    if (!this.isUsingCustomAudio) {
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(drone * this.droneVol, now, 0.05);
      if (this.elecGain) this.elecGain.gain.setTargetAtTime(electricity * this.elecVol, now, 0.05);
    }
  }

  public playTerminalClick(type: 'retro' | 'futuristic') {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'retro') {
      // Vintage mechanical CRT click & beep
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    } else {
      // Futuristic glass touch pulse
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playSitDownSfx() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Heavy mechanical chair movement rumble + servo whir
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playStandUpSfx() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  public toggleMute(): boolean {
    if (this.customAudio) {
      if (this.customAudio.paused) {
        this.customAudio.play().catch(() => {});
        this.isPlaying = true;
      } else {
        this.customAudio.pause();
        this.isPlaying = false;
      }
    }

    if (!this.ctx) {
      return this.init();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
      this.isPlaying = true;
      return true;
    } else if (this.ctx.state === 'running') {
      this.ctx.suspend();
      this.isPlaying = false;
      return false;
    }
    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying && this.ctx?.state === 'running';
  }
}

export const bunkerAudio = new BunkerAudioEngine();
