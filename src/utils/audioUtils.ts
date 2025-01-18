class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private currentOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;

  private constructor() {
    try {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    } catch (error) {
      console.warn('Web Audio API is not supported in this browser');
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private stopCurrentSound() {
    if (this.currentOscillator) {
      try {
        this.currentOscillator.stop();
        this.currentOscillator.disconnect();
      } catch (error) {
        console.warn('Error stopping oscillator:', error);
      }
      this.currentOscillator = null;
    }
  }

  playSound(type: 'inhale' | 'exhale'): void {
    if (!this.audioContext || !this.gainNode || this.isMuted) return;

    this.stopCurrentSound();

    try {
      this.currentOscillator = this.audioContext.createOscillator();
      
      // Enhanced frequencies for better audibility of both sounds
      switch (type) {
        case 'inhale':
          this.currentOscillator.frequency.setValueAtTime(261.63, this.audioContext.currentTime); // C4 note - clear and distinct
          break;
        case 'exhale':
          this.currentOscillator.frequency.setValueAtTime(196.00, this.audioContext.currentTime); // G3 note - complementary to inhale
          break;
      }

      // Use sine wave for a smoother, more meditative sound
      this.currentOscillator.type = 'sine';
      
      // Increased base volume and faster attack for better audibility
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(
        this.volume * 0.3, // Increased volume for better audibility
        this.audioContext.currentTime + 0.05 // Faster attack time
      );

      this.currentOscillator.connect(this.gainNode);
      this.currentOscillator.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  stopSound(): void {
    if (!this.gainNode) return;

    // Smooth fade out
    try {
      this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
      setTimeout(() => this.stopCurrentSound(), 100);
    } catch (error) {
      console.warn('Error stopping sound:', error);
      this.stopCurrentSound();
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode && this.currentOscillator) {
      this.gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopSound();
    }
  }

  getVolume(): number {
    return this.volume;
  }

  getMuted(): boolean {
    return this.isMuted;
  }
}

export const audioManager = AudioManager.getInstance();