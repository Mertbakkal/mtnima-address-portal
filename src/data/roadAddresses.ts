export interface RoadAddress {
  number: string;
  certified: boolean;
  lat: number;
  lon: number;
}

function hashSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function polylineLength(pts: [number, number][]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return len;
}

function pointAt(pts: [number, number][], t: number): [number, number] {
  if (pts.length === 0) return [0, 0];
  if (pts.length === 1 || t <= 0) return pts[0];
  if (t >= 1) return pts[pts.length - 1];
  const total = polylineLength(pts);
  if (total === 0) return pts[0];
  let dist = t * total;
  for (let i = 1; i < pts.length; i++) {
    const dy = pts[i][0] - pts[i - 1][0];
    const dx = pts[i][1] - pts[i - 1][1];
    const seg = Math.hypot(dy, dx);
    if (dist <= seg || i === pts.length - 1) {
      const u = seg === 0 ? 0 : dist / seg;
      return [pts[i - 1][0] + dy * u, pts[i - 1][1] + dx * u];
    }
    dist -= seg;
  }
  return pts[pts.length - 1];
}

/** Stable irregular door numbers placed evenly along a drawn road. */
export function buildRoadAddresses(id: string, latlngs: [number, number][]): RoadAddress[] {
  const rand = mulberry32(hashSeed(id));
  const count = 10 + Math.floor(rand() * 5);
  let number = 10 + Math.floor(rand() * 31);
  const addresses: RoadAddress[] = [];
  for (let i = 0; i < count; i++) {
    if (i > 0) number += 7 + Math.floor(rand() * 19);
    const [lat, lon] = pointAt(latlngs, (i + 1) / (count + 1));
    addresses.push({ number: String(number), certified: false, lat, lon });
  }
  return addresses;
}
