/**
 * Shared geometry for the 3x3 board. Everything is expressed in percent of
 * the (square) board, so SVG overlays and HTML nodes line up exactly.
 */
export const BOARD_COLUMNS = [20, 50, 80] as const;
export const NODE_SIZE_PERCENT = 22;
export const NODE_COUNT = 9;

export interface Point {
  x: number;
  y: number;
}

/** Numeric-keypad layout: 7 8 9 on top, 4 5 6 in the middle, 1 2 3 at the bottom. */
export function getNodeCenter(index: number): Point {
  return {
    x: BOARD_COLUMNS[index % 3],
    y: BOARD_COLUMNS[2 - Math.floor(index / 3)],
  };
}

function buildLatticeLinks(): ReadonlyArray<readonly [number, number]> {
  const links: Array<readonly [number, number]> = [];
  for (let i = 0; i < NODE_COUNT; i += 1) {
    const column = i % 3;
    const row = Math.floor(i / 3);
    if (column < 2) links.push([i, i + 1]);
    if (row < 2) links.push([i, i + 3]);
  }
  links.push([0, 4], [2, 4], [6, 4], [8, 4]);
  return links;
}

export const LATTICE_LINKS = buildLatticeLinks();
