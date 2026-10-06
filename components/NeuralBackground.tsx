import { cn } from '@/lib/cn';
import { NeuralNetwork } from './NeuralNetwork';
import { Particles } from './Particles';

interface NeuralBackgroundProps {
  /** Softens the network during play so it never competes with the board. */
  calm: boolean;
}

export function NeuralBackground({ calm }: NeuralBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void"
    >
      <div
        className="ambient-glow absolute -left-[18%] -top-[28%] h-[75vmax] w-[75vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(139,92,246,0.2), transparent)' }}
      />
      <div
        className="ambient-glow-alt absolute -bottom-[34%] -right-[20%] h-[80vmax] w-[80vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(34,211,238,0.14), transparent)' }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(56,189,248,0.07), transparent)' }}
      />

      <div className="bg-lab-grid absolute inset-0" />

      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          calm ? 'opacity-50' : 'opacity-100',
        )}
      >
        <NeuralNetwork />
        <Particles />
      </div>

      <div className="scanline" />
      <div className="vignette absolute inset-0" />
    </div>
  );
}
