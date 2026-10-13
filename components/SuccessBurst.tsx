import { motion } from 'motion/react';

const PARTICLE_COUNT = 16;
const COLORS = ['#FF8CB5', '#FFD54D', '#B597F2', '#7ED6AB', '#7CC4F2'];
const HEART = 'M0 7C-6 2.5 -8 -0.5 -8 -3C-8 -5.5 -6.2 -7 -4.2 -7C-2.4 -7 -0.9 -6 0 -4.4C0.9 -6 2.4 -7 4.2 -7C6.2 -7 8 -5.5 8 -3C8 -0.5 6 2.5 0 7Z';
const STAR = 'M0 -8L2.3 -2.6L8 -2.2L3.7 1.6L5 7.2L0 4.2L-5 7.2L-3.7 1.6L-8 -2.2L-2.3 -2.6Z';

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
  const distance = 28 + (i % 3) * 8;
  return {
    id: i,
    dx: Math.round(Math.cos(angle) * distance * 100) / 100,
    dy: Math.round(Math.sin(angle) * distance * 100) / 100,
    scale: i % 2 === 0 ? 0.55 : 0.4,
    shape: i % 2 === 0 ? HEART : STAR,
    color: COLORS[i % COLORS.length],
  };
});

/** Short shower of hearts and stars played when a sequence is confirmed. */
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
        stroke="#FFB7D2"
        strokeWidth={1}
        strokeDasharray="0.1 3"
        strokeLinecap="round"
        initial={{ r: 8, opacity: 0.9 }}
        animate={{ r: 48, opacity: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      {PARTICLES.map((particle) => (
        <g key={particle.id} transform="translate(50 50)">
          <motion.g
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: 0, x: particle.dx, y: particle.dy, scale: 1 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
          >
            <path d={particle.shape} fill={particle.color} transform={`scale(${particle.scale})`} />
          </motion.g>
        </g>
      ))}
    </svg>
  );
}
