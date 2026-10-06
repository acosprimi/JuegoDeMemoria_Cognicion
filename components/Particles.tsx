import { createRng } from '@/lib/seeded-random';

interface Particle {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const PARTICLE_COUNT = 18;
const round1 = (value: number) => Math.round(value * 10) / 10;

function buildParticles(): Particle[] {
  const rng = createRng(4242);
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    left: round1(rng() * 100),
    top: round1(rng() * 100),
    size: round1(1.5 + rng() * 1.8),
    duration: round1(16 + rng() * 14),
    delay: -round1(rng() * 20),
    opacity: Math.round((0.25 + rng() * 0.4) * 100) / 100,
  }));
}

const PARTICLES = buildParticles();

export function Particles() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="particle absolute rounded-full bg-ice"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
