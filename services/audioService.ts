class AudioService {
  private ctx: AudioContext | null = null;
  private isUnlocked: boolean = false;
  private sfxEnabled: boolean = true;
  private voiceMode: 'chiptune' | 'tts' | 'off' = 'chiptune';
  private dialogueGainNode: GainNode | null = null;
  private speakTimeouts: any[] = [];

  constructor() {
    try {
      const storedSfx = localStorage.getItem('steve_sfx_enabled');
      if (storedSfx !== null) {
        this.sfxEnabled = storedSfx === 'true';
      }
      const storedVoice = localStorage.getItem('steve_voice_mode');
      if (storedVoice !== null) {
        this.voiceMode = storedVoice as 'chiptune' | 'tts' | 'off';
      }
    } catch (e) {}
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return this.ctx;
  }

  public async unlock() {
    if (this.isUnlocked) return;
    const context = this.init();
    if (context && context.state === 'suspended') {
      try {
        await context.resume();
        this.isUnlocked = true;
      } catch (e) {}
    } else if (context) {
      this.isUnlocked = true;
    }
  }

  public getSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setSfxEnabled(val: boolean) {
    this.sfxEnabled = val;
    try {
      localStorage.setItem('steve_sfx_enabled', String(val));
    } catch (e) {}
  }

  public getVoiceMode(): 'chiptune' | 'tts' | 'off' {
    return this.voiceMode;
  }

  public setVoiceMode(mode: 'chiptune' | 'tts' | 'off') {
    this.voiceMode = mode;
    try {
      localStorage.setItem('steve_voice_mode', mode);
    } catch (e) {}
    if (mode === 'off' || mode === 'chiptune') {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.sfxEnabled) return;
    try {
      const context = this.init();
      if (!context) return;
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, context.currentTime);
      gain.gain.setValueAtTime(volume, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + duration);
    } catch (e) {}
  }

  playClick() {
    try {
      const context = this.init();
      if (!context || !this.sfxEnabled) return;
      
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      
      osc.connect(gain);
      gain.connect(context.destination);
      
      osc.start();
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  playNegative() {
    try {
      const context = this.init();
      if (!context || !this.sfxEnabled) return;
      
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      
      osc.start();
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  playLevelUp() {
    if (!this.sfxEnabled) return;
    try {
      const context = this.init();
      if (!context) return;

      const now = context.currentTime;
      // Energetic, sparkly major arpeggio "bling" sound
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      
      notes.forEach((freq, idx) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        
        const noteVol = idx === notes.length - 1 ? 0.06 : 0.03;
        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(noteVol, now + idx * 0.05 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.15);

        osc.connect(gain);
        gain.connect(context.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.16);
      });

      // Shimmery sliding square wave overlay to perfect the retro "bling!" chime
      setTimeout(() => {
        if (!this.sfxEnabled) return;
        try {
          const oscSparkle = context.createOscillator();
          const gainSparkle = context.createGain();
          oscSparkle.type = 'square';
          oscSparkle.frequency.setValueAtTime(1567.98, context.currentTime);
          oscSparkle.frequency.linearRampToValueAtTime(1975.53, context.currentTime + 0.2); // slide up to B6

          gainSparkle.gain.setValueAtTime(0.015, context.currentTime);
          gainSparkle.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);

          oscSparkle.connect(gainSparkle);
          gainSparkle.connect(context.destination);
          oscSparkle.start();
          oscSparkle.stop(context.currentTime + 0.35);
        } catch(e) {}
      }, 250);

    } catch (e) {}
  }

  playDeath() {
    try {
      const context = this.init();
      if (!context || !this.sfxEnabled) return;

      const now = context.currentTime;
      // Dramatic, slow, sad minor Game Over progression
      const pitches = [220, 174.61, 138.59, 103.83];
      
      pitches.forEach((freq, idx) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);
        
        const filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now + idx * 0.18);

        gain.gain.setValueAtTime(0.05, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(context.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.45);
      });
    } catch (e) {}
  }

  playGameOver() {
    this.playDeath();
  }

  playVictory() {
    this.playLevelUp();
    setTimeout(() => this.playLevelUp(), 400);
  }

  playPowerUp() {
    this.playTone(800, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(1200, 'sine', 0.15, 0.05), 100);
  }

  stopBgm() {
    // Placeholder for BGM
  }

  playNarrator() { 
    this.playTone(150 + Math.random() * 50, 'sine', 0.05, 0.02); 
  }

  playBlip() {
    try {
      const context = this.init();
      if (!context || !this.sfxEnabled) return;
      
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
      
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      
      osc.start();
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  private playChiptuneSpeech(text: string, lang: string) {
    const context = this.init();
    if (!context) return;

    // Fast-fade out and disconnect the previous dialogue gain node
    if (this.dialogueGainNode) {
      try {
        const prevGain = this.dialogueGainNode;
        prevGain.gain.setValueAtTime(prevGain.gain.value, context.currentTime);
        prevGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.05);
        setTimeout(() => {
          try { prevGain.disconnect(); } catch(e) {}
        }, 60);
      } catch (e) {}
    }

    // Set up a new clean dialogue group node
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(0.06, context.currentTime); // Soft volume for bearable background chatter beeps
    masterGain.connect(context.destination);
    this.dialogueGainNode = masterGain;

    // Terminate any previous word timer events
    this.speakTimeouts.forEach(t => clearTimeout(t));
    this.speakTimeouts = [];

    // Speak rhythmically based on terms/syllables and scale to avoid long grating sounds
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const maxBeeps = Math.min(words.length, 12);

    const l = lang.toLowerCase();

    for (let i = 0; i < maxBeeps; i++) {
      const delay = i * 110; // Comfortable dialogue typewriter pace

      const t = setTimeout(() => {
        if (!this.sfxEnabled || this.voiceMode !== 'chiptune') return;
        
        try {
          const osc = context.createOscillator();
          const pGain = context.createGain();
          
          let baseFreq = 220; 
          let type: OscillatorType = 'triangle';
          let duration = 0.07;
          let slide = 0;

          // Highly stylized retro country voices!
          if (l.includes('spanish') || l.includes('italian')) {
            baseFreq = 260 + Math.random() * 80; // High, rapid, bouncy Romance language pitch
            type = 'triangle';
          } else if (l.includes('german') || l.includes('swedish') || l.includes('swedish')) {
            baseFreq = 160 + Math.random() * 50; // Deep, solid, resonant Scandinavian/Germanic voice
            type = 'sine';
            duration = 0.09;
          } else if (l.includes('romanian')) {
            baseFreq = 200 + Math.random() * 50; // Mysterious, sliding gothic tones
            type = 'triangle';
            slide = -30;
          } else {
            // Jersey Shore or generic english - energetic square blips with bandpass to make it super pleasant
            baseFreq = 190 + Math.random() * 110;
            type = 'square';
          }

          osc.type = type;
          osc.frequency.setValueAtTime(baseFreq, context.currentTime);
          if (slide !== 0) {
            osc.frequency.exponentialRampToValueAtTime(baseFreq + slide, context.currentTime + duration);
          }

          pGain.gain.setValueAtTime(0.35, context.currentTime);
          pGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

          // Add clean bandpass filtering to block painful ultra-high/low noise
          const vocalFilter = context.createBiquadFilter();
          vocalFilter.type = 'bandpass';
          vocalFilter.frequency.setValueAtTime(baseFreq * 1.5, context.currentTime);

          osc.connect(vocalFilter);
          vocalFilter.connect(pGain);
          pGain.connect(masterGain);
          
          osc.start();
          osc.stop(context.currentTime + duration + 0.01);
        } catch (e) {}
      }, delay);

      this.speakTimeouts.push(t);
    }
  }

  async speak(text: string, lang: string = 'en-US') {
    if (this.voiceMode === 'off') {
      return Promise.resolve(true);
    }

    if (this.voiceMode === 'chiptune') {
      this.playChiptuneSpeech(text, lang);
      return Promise.resolve(true);
    }

    // Standard Speech Synthesis (TTS). Can be toggled on by user if they like real voices.
    // We strictly cancel any lingering Speech backlogs to guarantee it is "bearable" and never piles up.
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}

    return new Promise((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        
        let code = 'en-US';
        const l = lang.toLowerCase();
        if (l.includes('spanish')) {
          code = 'es-ES';
        } else if (l.includes('italian')) {
          code = 'it-IT';
        } else if (l.includes('german')) {
          code = 'de-DE';
        } else if (l.includes('swedish')) {
          code = 'sv-SE';
        } else if (l.includes('romanian')) {
          code = 'ro-RO';
        }

        utterance.lang = code;
        utterance.rate = 0.95;
        utterance.pitch = 0.95;
        
        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(true);
        
        window.speechSynthesis.speak(utterance);
        
        // Timeout backup so it never blocks gameplay
        setTimeout(() => resolve(true), 5000);
      } catch (e) {
        resolve(true);
      }
    });
  }
}

export const audioService = new AudioService();
