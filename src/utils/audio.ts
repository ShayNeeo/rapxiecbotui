// Web Audio API Synthesizer for authentic Circus Fanfare, Drums, and Game SFX

class CircusAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isPlayingBgm: boolean = false;
  private bgmTimeoutId: number | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isPlayingBgm) {
      this.stopBgm();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play circus fanfare (Entrance of the Gladiators / circus intro flourish)
  public playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [
      { freq: 392, dur: 0.12 }, // G4
      { freq: 440, dur: 0.12 }, // A4
      { freq: 493.88, dur: 0.12 }, // B4
      { freq: 523.25, dur: 0.2 }, // C5
      { freq: 659.25, dur: 0.18 }, // E5
      { freq: 783.99, dur: 0.4 }, // G5 high
    ];

    let startTime = this.ctx.currentTime + 0.05;
    notes.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.freq, startTime);

      // Warm brass filter
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + note.dur);

      startTime += note.dur + 0.04;
    });
  }

  // Drum roll for suspense
  public playDrumRoll(durationSeconds: number = 1.2) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const steps = Math.floor(durationSeconds * 25);
    for (let i = 0; i < steps; i++) {
      const time = this.ctx.currentTime + (i * (durationSeconds / steps));
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110 + (Math.random() * 20), time);

      gain.gain.setValueAtTime(0.08 + (i / steps) * 0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.04);
    }

    // Final cymbal crash at the end
    setTimeout(() => {
      this.playCymbalCrash();
    }, durationSeconds * 1000);
  }

  // Cymbal crash
  public playCymbalCrash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4500, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Juggling catch whoosh / plink
  public playCatch(pitchMultiplier: number = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440 * pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(880 * pitchMultiplier, now + 0.1);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Stilt step sound (bamboo wood tap - "cốc cốc")
  public playBambooStep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 40, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Tightrope wobble warning sound
  public playWobble() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.07);
    osc.frequency.linearRampToValueAtTime(190, now + 0.14);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Magic sparkle chime
  public playMagicChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  // Cheering audience / applause synthesis
  public playApplause() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 1.4;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Clapping spikes
      const clapPulse = Math.random() > 0.96 ? 1 : 0;
      data[i] = (Math.random() * 0.4 - 0.2) + (clapPulse * (Math.random() * 0.8 - 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Interactive BGM: Circus Carousel Tune (Light looping brass-accordion vibe)
  public startCircusBgm() {
    if (this.isMuted || this.isPlayingBgm) return;
    this.initContext();
    if (!this.ctx) return;

    this.isPlayingBgm = true;

    // Classic upbeat circus melody loop (Fucik / Circus Waltz motif)
    const melody = [
      { note: 523.25, len: 0.25 }, // C5
      { note: 587.33, len: 0.25 }, // D5
      { note: 659.25, len: 0.25 }, // E5
      { note: 698.46, len: 0.25 }, // F5
      { note: 783.99, len: 0.5 },  // G5
      { note: 659.25, len: 0.5 },  // E5
      { note: 523.25, len: 0.5 },  // C5
      { note: 587.33, len: 0.25 }, // D5
      { note: 659.25, len: 0.25 }, // E5
      { note: 587.33, len: 0.5 },  // D5
      { note: 392.00, len: 0.5 },  // G4
      { note: 523.25, len: 0.75 }, // C5
    ];

    let step = 0;
    const playNext = () => {
      if (!this.isPlayingBgm || this.isMuted || !this.ctx) return;

      const item = melody[step % melody.length];
      const now = this.ctx.currentTime;

      // Melody note
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.note, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.len * 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + item.len);

      // Bass oom-pah
      if (step % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(step % 4 === 0 ? 130.81 : 196.00, now); // C3 / G3
        bassGain.gain.setValueAtTime(0.06, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.2);
      }

      step++;
      this.bgmTimeoutId = window.setTimeout(playNext, item.len * 1000);
    };

    playNext();
  }

  public stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimeoutId) {
      clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  public isBgmActive(): boolean {
    return this.isPlayingBgm;
  }
}

export const circusAudio = new CircusAudioEngine();
