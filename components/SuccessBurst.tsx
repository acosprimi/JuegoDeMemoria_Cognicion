import { motion } from 'motion/react';

const PARTICLE_COUNT = 16;

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
  const distance = 26 + (i % 3) * 7;
  return {
    id: i,
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    r: 0.7 + (i % 2) * 0.45,
  };
});

/** Short particle burst played when a sequence is confirmed. */
export function SuccessBurst() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      <motion.circle
        cx={50}
        cy={50}
        fill="none"
        stroke="#67E8F9"
        strokeWidth={0.4}
        initial={{ r: 8, opacity: 0.7 }}
        animate={{ r: 48, opacity: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      {PARTICLES.map((particle) => (
        <motion.circle
          key={particle.id}
          cx={50}
          cy={50}
          r={particle.r}
          fill="#A5F3FC"
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{ opacity: 0, x: particle.dx, y: particle.dy }}
          transition={{ duration: 0.95, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}
