export interface BaseGridCell {
  id: string;
  label: string;
  /** South edge (min lat) */
  south: number;
  /** West edge (min lon) */
  west: number;
  /** North edge (max lat) */
  north: number;
  /** East edge (max lon) */
  east: number;
  cellSizeDeg: number;
  row: number;
  col: number;
}

export type BaseGrid = BaseGridCell & {
  originLat: number;
  originLon: number;
};

export interface GeocodeResult {
  lat: number;
  lon: number;
  zoom: number;
}

export interface LatLonBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

/** Full Mauritania extent for the base grid lattice. */
export const GRID_WORLD_BOUNDS: LatLonBounds = {
  south: 14.5,
  west: -17.5,
  north: 27.5,
  east: -4.5,
};

export const CELL_SIZE_DEG = 0.25;

export const GEOCODE_ZOOM = 17;

/** Show grid lines from this zoom (inclusive). */
export const GRID_MIN_ZOOM = 10;

/** Max labeled cells in view (above this, draw lines only). */
export const GRID_MAX_LABELS = 80;

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Columns per letter bank in the second segment (A01–A99, B01–…). */
const COLS_PER_LETTER = 99;

/**
 * Base-grid cell id, e.g. NC02-A05
 * NC{row:02}-{ColLetter}{colWithinLetter:02}
 */
function cellLabel(row: number, col: number): string {
  const zone = String(row + 1).padStart(2, '0');
  const letterIdx = Math.min(Math.floor(col / COLS_PER_LETTER), 25);
  const letter = ROW_LETTERS[letterIdx] ?? 'A';
  const num = String((col % COLS_PER_LETTER) + 1).padStart(2, '0');
  return `NC${zone}-${letter}${num}`;
}

export function rowColFromLatLon(lat: number, lon: number): { row: number; col: number } {
  const row = Math.floor((lat - GRID_WORLD_BOUNDS.south) / CELL_SIZE_DEG);
  const col = Math.floor((lon - GRID_WORLD_BOUNDS.west) / CELL_SIZE_DEG);
  return { row, col };
}

export function getCellAt(row: number, col: number): BaseGridCell | null {
  const maxRow = Math.floor((GRID_WORLD_BOUNDS.north - GRID_WORLD_BOUNDS.south) / CELL_SIZE_DEG) - 1;
  const maxCol = Math.floor((GRID_WORLD_BOUNDS.east - GRID_WORLD_BOUNDS.west) / CELL_SIZE_DEG) - 1;
  if (row < 0 || col < 0 || row > maxRow || col > maxCol) return null;

  const south = GRID_WORLD_BOUNDS.south + row * CELL_SIZE_DEG;
  const west = GRID_WORLD_BOUNDS.west + col * CELL_SIZE_DEG;
  const label = cellLabel(row, col);
  return {
    id: label,
    label,
    south,
    west,
    north: south + CELL_SIZE_DEG,
    east: west + CELL_SIZE_DEG,
    cellSizeDeg: CELL_SIZE_DEG,
    row,
    col,
  };
}

export function parseCellLabel(label: string): { row: number; col: number } | null {
  const normalized = label.trim().toUpperCase();
  const m = /^NC(\d{2})-([A-Z])(\d{2})$/.exec(normalized);
  if (!m) return null;
  const row = Number(m[1]) - 1;
  const letterIdx = ROW_LETTERS.indexOf(m[2]);
  const colInBank = Number(m[3]) - 1;
  if (row < 0 || letterIdx < 0 || colInBank < 0 || colInBank >= COLS_PER_LETTER) return null;
  const col = letterIdx * COLS_PER_LETTER + colInBank;
  const cell = getCellAt(row, col);
  if (!cell || cell.label !== normalized) return null;
  return { row, col };
}

/** Cells intersecting the given bounds (clamped to world grid). */
export function getCellsInBounds(bounds: LatLonBounds): BaseGridCell[] {
  const south = Math.max(bounds.south, GRID_WORLD_BOUNDS.south);
  const west = Math.max(bounds.west, GRID_WORLD_BOUNDS.west);
  const north = Math.min(bounds.north, GRID_WORLD_BOUNDS.north);
  const east = Math.min(bounds.east, GRID_WORLD_BOUNDS.east);
  if (south >= north || west >= east) return [];

  const row0 = Math.max(0, Math.floor((south - GRID_WORLD_BOUNDS.south) / CELL_SIZE_DEG));
  const col0 = Math.max(0, Math.floor((west - GRID_WORLD_BOUNDS.west) / CELL_SIZE_DEG));
  const row1 = Math.floor((north - GRID_WORLD_BOUNDS.south) / CELL_SIZE_DEG);
  const col1 = Math.floor((east - GRID_WORLD_BOUNDS.west) / CELL_SIZE_DEG);

  const cells: BaseGridCell[] = [];
  for (let r = row0; r <= row1; r++) {
    for (let c = col0; c <= col1; c++) {
      const cell = getCellAt(r, c);
      if (cell) cells.push(cell);
    }
  }
  return cells;
}

/** Lon/lat line positions for drawing a mesh over bounds. */
export function getGridLineCoords(bounds: LatLonBounds): { vertical: number[]; horizontal: number[] } {
  const south = Math.max(bounds.south, GRID_WORLD_BOUNDS.south);
  const west = Math.max(bounds.west, GRID_WORLD_BOUNDS.west);
  const north = Math.min(bounds.north, GRID_WORLD_BOUNDS.north);
  const east = Math.min(bounds.east, GRID_WORLD_BOUNDS.east);
  if (south >= north || west >= east) return { vertical: [], horizontal: [] };

  const col0 = Math.ceil((west - GRID_WORLD_BOUNDS.west) / CELL_SIZE_DEG);
  const col1 = Math.floor((east - GRID_WORLD_BOUNDS.west) / CELL_SIZE_DEG);
  const row0 = Math.ceil((south - GRID_WORLD_BOUNDS.south) / CELL_SIZE_DEG);
  const row1 = Math.floor((north - GRID_WORLD_BOUNDS.south) / CELL_SIZE_DEG);

  const vertical: number[] = [];
  for (let c = col0; c <= col1; c++) {
    vertical.push(GRID_WORLD_BOUNDS.west + c * CELL_SIZE_DEG);
  }
  const horizontal: number[] = [];
  for (let r = row0; r <= row1; r++) {
    horizontal.push(GRID_WORLD_BOUNDS.south + r * CELL_SIZE_DEG);
  }
  return { vertical, horizontal };
}

/** Curated dropdown options near Nouakchott + a few country samples. */
function buildDropdownCells(): BaseGridCell[] {
  const samples: BaseGridCell[] = [];
  const centers = [
    [18.08, -15.98],
    [18.2, -15.9],
    [20.0, -12.0],
    [16.0, -13.0],
    [25.0, -8.0],
  ] as const;
  for (const [lat, lon] of centers) {
    const { row, col } = rowColFromLatLon(lat, lon);
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        const cell = getCellAt(row + dr, col + dc);
        if (cell && !samples.some((s) => s.id === cell.id)) samples.push(cell);
      }
    }
  }
  return samples;
}

export const BASE_GRID_CELLS: BaseGridCell[] = buildDropdownCells();

export const BASE_GRIDS: BaseGrid[] = BASE_GRID_CELLS.map((cell) => ({
  ...cell,
  originLat: cell.south,
  originLon: cell.west,
}));

export const DEFAULT_BASE_GRID = BASE_GRID_CELLS[0]?.label ?? 'NC01-A01';

export function getBaseGridOptions(): string[] {
  return BASE_GRID_CELLS.map((g) => g.label);
}

export function resolveGeocode(
  gridId: string,
  abscissa: string,
  ordinate: string,
): GeocodeResult | null {
  if (!/^\d{3}$/.test(abscissa) || !/^\d{3}$/.test(ordinate)) return null;

  let cell = BASE_GRID_CELLS.find((g) => g.id === gridId || g.label === gridId) ?? null;
  if (!cell) {
    const parsed = parseCellLabel(gridId);
    if (parsed) cell = getCellAt(parsed.row, parsed.col);
  }
  if (!cell) return null;

  const x = Number(abscissa);
  const y = Number(ordinate);
  return {
    lat: cell.south + (y / 999) * cell.cellSizeDeg,
    lon: cell.west + (x / 999) * cell.cellSizeDeg,
    zoom: GEOCODE_ZOOM,
  };
}
