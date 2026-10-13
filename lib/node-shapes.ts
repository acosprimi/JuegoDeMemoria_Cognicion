export interface NodePalette {
  /** Pale fill while resting. */
  soft: string;
  /** Resting outline. */
  mid: string;
  /** Fill while lit. */
  strong: string;
  /** Outline while lit. */
  deep: string;
}

export interface NodeShape {
  id: string;
  /** Path in a 100x100 box. Sub-paths may overlap: the outline is drawn under the fill. */
  d: string;
  /** Where the little face sits, and how big it is. */
  face: { x: number; y: number; scale: number };
  palette: NodePalette;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

function circle(cx: number, cy: number, r: number): string {
  return `M${r2(cx - r)} ${r2(cy)}a${r} ${r} 0 1 0 ${r2(r * 2)} 0a${r} ${r} 0 1 0 ${r2(-r * 2)} 0Z`;
}

function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${r2(cx - rx)} ${r2(cy)}a${rx} ${ry} 0 1 0 ${r2(rx * 2)} 0a${rx} ${ry} 0 1 0 ${r2(-rx * 2)} 0Z`;
}

function star(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${r2(cx + radius * Math.cos(angle))} ${r2(cy + radius * Math.sin(angle))}`);
  }
  return `M${pts.join('L')}Z`;
}

function petals(cx: number, cy: number, count: number, ring: number, size: number): string {
  const parts: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = ((Math.PI * 2) / count) * i - Math.PI / 2;
    parts.push(circle(cx + ring * Math.cos(angle), cy + ring * Math.sin(angle), size));
  }
  return parts.join('');
}

export const NODE_SHAPES: readonly NodeShape[] = [
  {
    id: 'heart',
    d: 'M50 87C18 63 11 45 11 33C11 21 20 12 32 12C40 12 46 17 50 24C54 17 60 12 68 12C80 12 89 21 89 33C89 45 82 63 50 87Z',
    face: { x: 50, y: 47, scale: 1 },
    palette: { soft: '#FFD9E7', mid: '#FFB3CF', strong: '#FF8CB5', deep: '#E8639A' },
  },
  {
    id: 'star',
    d: `${star(50, 54, 44, 25)}`,
    face: { x: 50, y: 57, scale: 0.85 },
    palette: { soft: '#FFF3B8', mid: '#FFE27A', strong: '#FFD13F', deep: '#E8AE1F' },
  },
  {
    id: 'flower',
    d: `${petals(50, 50, 6, 26, 17)}${circle(50, 50, 24)}`,
    face: { x: 50, y: 51, scale: 1 },
    palette: { soft: '#E9DEFF', mid: '#CDB8FA', strong: '#B597F2', deep: '#8F6FD6' },
  },
  {
    id: 'cloud',
    d: `${circle(29, 56, 18)}${circle(51, 41, 25)}${circle(73, 56, 18)}${ellipse(51, 67, 40, 15)}`,
    face: { x: 51, y: 60, scale: 1.05 },
    palette: { soft: '#D8F0FF', mid: '#A9DBF7', strong: '#7CC4F2', deep: '#4FA3D9' },
  },
  {
    id: 'cat',
    d: `M16 52L45 28L19 12Q15 10 15 14ZM84 52L85 14Q85 10 81 12L55 28Z${ellipse(50, 57, 37, 30)}`,
    face: { x: 50, y: 59, scale: 1 },
    palette: { soft: '#FFE3D0', mid: '#FFC6A3', strong: '#FFA877', deep: '#E58650' },
  },
  {
    id: 'bear',
    d: `${circle(23, 29, 13)}${circle(77, 29, 13)}${circle(50, 57, 34)}`,
    face: { x: 50, y: 60, scale: 1 },
    palette: { soft: '#F4E0CE', mid: '#E6C3A2', strong: '#D9A67A', deep: '#B98558' },
  },
  {
    id: 'bunny',
    d: `${ellipse(35, 27, 10, 22)}${ellipse(65, 27, 10, 22)}${ellipse(50, 64, 33, 28)}`,
    face: { x: 50, y: 66, scale: 1 },
    palette: { soft: '#D9F6E8', mid: '#B0EACF', strong: '#7ED6AB', deep: '#4FB886' },
  },
  {
    id: 'mochi',
    d: 'M20 82C8 82 6 62 12 48C19 30 34 18 50 18C66 18 81 30 88 48C94 62 92 82 80 82Z',
    face: { x: 50, y: 58, scale: 1.05 },
    palette: { soft: '#E4E8FF', mid: '#C3CBFA', strong: '#9FAAF5', deep: '#7783DB' },
  },
  {
    id: 'sun',
    d: `${petals(50, 50, 10, 33, 9)}${circle(50, 50, 30)}`,
    face: { x: 50, y: 51, scale: 1.05 },
    palette: { soft: '#FFEDC2', mid: '#FFD791', strong: '#FFBE5C', deep: '#EE9A2B' },
  },
];
