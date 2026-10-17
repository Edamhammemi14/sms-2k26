// Authentic Marvel Studios / Avengers Cosmic Sound & Voice Engine
class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private voiceEnabled: boolean = true;
  private bgThemeAudio: HTMLAudioElement | null = null;
  private isThemePlaying: boolean = false;

  constructor() {
    // Ensure any speech synthesis is canceled and disabled
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  // Initialize the Official Marvel Studios Opening Theme Audio (Michael Giacchino Fanfare)
  private initOfficialTheme() {
    if (typeof window !== 'undefined' && !this.bgThemeAudio) {
      this.bgThemeAudio = new Audio('/audio/marvel_opening_theme.mp3');
      this.bgThemeAudio.loop = true;
      this.bgThemeAudio.volume = 0.8;
      this.bgThemeAudio.preload = 'auto';
    }
  }

  public playOfficialAvengersTheme(fromStart: boolean = false) {
    this.initOfficialTheme();
    if (this.bgThemeAudio) {
      if (fromStart) {
        this.bgThemeAudio.currentTime = 0;
      }
      this.bgThemeAudio.volume = 0.8;
      const playPromise = this.bgThemeAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isThemePlaying = true;
            this.isMuted = false;
          })
          .catch(() => {
            // Autoplay policy fallback
          });
      }
    }
  }

  public pauseOfficialAvengersTheme() {
    if (this.bgThemeAudio) {
      this.bgThemeAudio.pause();
      this.isThemePlaying = false;
    }
  }

  public toggleOfficialAvengersTheme(): boolean {
    if (this.isThemePlaying) {
      this.pauseOfficialAvengersTheme();
      return false;
    } else {
      this.playOfficialAvengersTheme();
      return true;
    }
  }

  public isOfficialThemeActive(): boolean {
    return this.isThemePlaying;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.init();
    if (this.ctx && this.masterGain) {
      if (this.ctx.state === 'suspended' && !muted) {
        this.ctx.resume();
      }
      const targetGain = muted ? 0 : 0.8;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.03);
    }

    if (!muted) {
      // Play the official Marvel opening theme song
      this.playOfficialAvengersTheme();
    } else {
      this.pauseOfficialAvengersTheme();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleVoice(enabled?: boolean) {
    this.voiceEnabled = enabled !== undefined ? enabled : !this.voiceEnabled;
    return this.voiceEnabled;
  }

  public isVoiceActive(): boolean {
    return this.voiceEnabled;
  }

  // S.H.I.E.L.D. Radio Comm Chirp (Tactical Walkie-Talkie squeak)
  public playRadioChirp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;

      // Dual frequency high-tech military burst
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1760, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.05);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(2640, now);
      osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.05);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.06);
      osc2.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  // Avengers Character Voice Synthesizer - Silenced per user request
  public speakAvengersVoice(_text?: string, _character?: 'cap' | 'thanos' | 'jarvis' | 'fury') {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }

  // The Iconic Avengers Silvestri Fanfare (synthesized brass motif)
  public playAvengersThemeFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;

      // Chord: D minor / Power Brass (Audible frequencies 220Hz - 660Hz)
      const notes = [
        { freq: 220.0, time: 0, dur: 0.35, vol: 0.35 },    // A3
        { freq: 293.66, time: 0.32, dur: 0.35, vol: 0.4 },  // D4
        { freq: 329.63, time: 0.65, dur: 0.4, vol: 0.45 },  // E4
        { freq: 440.0, time: 1.0, dur: 0.85, vol: 0.55 },   // A4 (Climax brass)
      ];

      notes.forEach(({ freq, time, dur, vol }) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 3, now + time);
        filter.Q.setValueAtTime(4.0, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.linearRampToValueAtTime(vol, now + time + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // Ignore
    }
  }

  // Cinematic Trailer Horn of Doom (Hans Zimmer / Marvel Braaam)
  public playCinematicBraaam() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const duration = 2.2;

      // Mid-Range Horn (Rich sawtooth audible on laptop speakers at 220Hz dropping to 110Hz)
      const horn = this.ctx.createOscillator();
      const hornFilter = this.ctx.createBiquadFilter();
      const hornGain = this.ctx.createGain();

      horn.type = 'sawtooth';
      horn.frequency.setValueAtTime(220, now); // A3
      horn.frequency.exponentialRampToValueAtTime(110, now + duration); // A2 drop

      hornFilter.type = 'lowpass';
      hornFilter.frequency.setValueAtTime(800, now);
      hornFilter.frequency.linearRampToValueAtTime(1400, now + 0.25);
      hornFilter.frequency.exponentialRampToValueAtTime(250, now + duration);
      hornFilter.Q.setValueAtTime(5.0, now);

      hornGain.gain.setValueAtTime(0.001, now);
      hornGain.gain.linearRampToValueAtTime(0.85, now + 0.08);
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      horn.connect(hornFilter);
      hornFilter.connect(hornGain);
      hornGain.connect(this.masterGain);

      horn.start(now);
      horn.stop(now + duration);

      // Sub harmonic for depth
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(110, now);
      sub.frequency.exponentialRampToValueAtTime(55, now + duration);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.75, now + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      sub.connect(subGain);
      subGain.connect(this.masterGain);

      sub.start(now);
      sub.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  // Stone activation harmonic resonance + Voice Lore Announce
  public playStoneResonance(baseFreq: number, stoneName?: string, stoneAttribute?: string) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const harmonics = [1, 1.5, 2, 2.5];
      const duration = 1.2;

      harmonics.forEach((mult, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq * mult, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.25 / (i + 1), now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch {
      // Ignore
    }
  }

  // HUD Beep (Audible 880Hz - 1320Hz chirp)
  public playHudBeep(freq = 880, duration = 0.08) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + duration);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  public playTacticalClick() {
    this.playHudBeep(980, 0.04);
  }

  public playQuantumWarp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(1750, now + 0.4);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }

  public playGauntletSnap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;

      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(1600, now);
      snapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

      snapGain.gain.setValueAtTime(0.6, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      snapOsc.connect(snapGain);
      snapGain.connect(this.masterGain);
      snapOsc.start(now);
      snapOsc.stop(now + 0.3);
    } catch {
      // Ignore
    }
  }
}

export const audioEngine = new CosmicAudioEngine();
