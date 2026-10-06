export interface NodeShape {
  id: string;
  /** Path in a 100x100 box, centered on (50, 50). */
  d: string;
  /** Adds a dashed orbit ring around the shape. */
  orbit?: boolean;
}

export const NODE_SHAPES: readonly NodeShape[] = [
  { id: 'sphere', d: 'M16 50a34 34 0 1 0 68 0a34 34 0 1 0 -68 0Z' },
  { id: 'hexagon', d: 'M50 14L81 32L81 68L50 86L19 68L19 32Z' },
  { id: 'prism', d: 'M50 16L85 76L15 76Z' },
  { id: 'rhombus', d: 'M50 12L88 50L50 88L12 50Z' },
  {
    id: 'core',
    d: 'M50 8C50 36 64 50 92 50C64 50 50 64 50 92C50 64 36 50 8 50C36 50 50 36 50 8Z',
  },
  { id: 'pentagon', d: 'M50 13L85 39L72 80L28 80L15 39Z' },
  {
    id: 'cell',
    d: 'M30 16H70A14 14 0 0 1 84 30V70A14 14 0 0 1 70 84H30A14 14 0 0 1 16 70V30A14 14 0 0 1 30 16Z',
  },
  { id: 'facet', d: 'M30 16L70 16L90 50L70 84L30 84L10 50Z' },
  { id: 'orbit', d: 'M18 50a32 32 0 1 0 64 0a32 32 0 1 0 -64 0Z', orbit: true },
];
