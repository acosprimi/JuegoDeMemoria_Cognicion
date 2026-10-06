/**
 * Tiny synth built on the Web Audio API. No audio files.
 * Every call is wrapped so audio problems can never break the game.
 */

type AudioContextConstructor = typeof AudioContext;

interface ToneOptions {
  freq: number;
  endFreq?: number;
  /** Delay in seconds from now. */
  start?: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  attack?: number;
}

/** C major pentatonic across two octaves: one pitch per node. */
const NODE_FREQUENCIES = [
  261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99,
] as const;

let context: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
let unavailable = false;

function getContext(): AudioContext | null {
  if (muted || unavailable || typeof window === 'undefined') return null;

  if (context === null) {
    try {
      const legacy = window as unknown as { webkitAudioContext?: AudioContextConstructor };
      const Ctor: AudioContextConstructor | undefined = window.AudioContext ?? legacy.webkitAudioContext;
      if (!Ctor) {
        unavailable = true;
        return null;
      }
      context = new Ctor();
      master = context.createGain();
      master.gain.value = 0.55;
      master.connect(context.destination);
    } catch {
      unavailable = true;
      context = null;
      master = null;
      return null;
    }
  }

  if (context.state === 'suspended') {
    try {
      void context.resume().catch(() => undefined);
    } catch {
      // Ignored: the browser will resume on the next user gesture.
    }
  }
  return context;
}

function tone(options: ToneOptions): void {
  const ctx = getContext();
  if (!ctx || !master) return;

  try {
    const t0 = ctx.currentTime + (options.start ?? 0);
    const peak = options.gain ?? 0.18;
    const attack = options.attack ?? 0.008;

    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();

    oscillator.type = options.type ?? 'sine';
    oscillator.frequency.setValueAtTime(options.freq, t0);
    if (options.endFreq) {
      oscillator.frequency.exponentialRampToValueAtTime(options.endFreq, t0 + options.duration);
    }

    envelope.gain.setValueAtTime(0.0001, t0);
    envelope.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, t0 + options.duration);

    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(t0);
    oscillator.stop(t0 + options.duration + 0.05);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  } catch {
    // Sound is optional.
  }
}

/** Call from a user gesture so browsers allow audio to start. */
export function unlockAudio(): void {
  getContext();
}

export function setAudioMuted(value: boolean): void {
  muted = value;
}

export function playClick(): void {
  tone({ freq: 1500, endFreq: 900, duration: 0.05, gain: 0.07 });
}

export function playNode(index: number): void {
  const freq = NODE_FREQUENCIES[index] ?? NODE_FREQUENCIES[0];
  tone({ freq, duration: 0.24, type: 'triangle', gain: 0.16 });
  tone({ freq: freq * 2, duration: 0.14, type: 'sine', gain: 0.04 });
}

export function playSuccess(): void {
  tone({ freq: 523.25, duration: 0.12, gain: 0.11 });
  tone({ freq: 783.99, start: 0.09, duration: 0.2, gain: 0.11 });
}

export function playLevelUp(): void {
  [392.0, 523.25, 659.25, 783.99].forEach((freq, i) => {
    tone({ freq, start: i * 0.085, duration: 0.18, type: 'triangle', gain: 0.1 });
  });
  tone({ freq: 1046.5, start: 0.34, duration: 0.35, gain: 0.05 });
}

export function playError(): void {
  tone({ freq: 160, endFreq: 70, duration: 0.34, type: 'sawtooth', gain: 0.1 });
}

export function playGameOver(): void {
  tone({ freq: 329.63, endFreq: 293.66, duration: 0.45, gain: 0.09 });
  tone({ freq: 246.94, start: 0.22, endFreq: 196, duration: 0.6, gain: 0.09 });
}

export function playStart(): void {
  tone({ freq: 220, endFreq: 880, duration: 0.45, gain: 0.1 });
  tone({ freq: 1320, start: 0.3, duration: 0.3, gain: 0.04 });
}
