import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import limitesAdminJson from './limitesAdmin.json';
import { GRID_MIN_ZOOM } from './geocodeSearch';

export interface LimitesAdminProps {
  ADM1_EN: string;
  ADM1_PCODE: string;
  ADM2_EN: string;
  ADM2_PCODE: string;
  ADM3_EN: string;
  ADM3_PCODE: string;
  AREA_SQKM: number | null;
}

/** Commune polygons from Limites_admin, one color per wilaya (ADM1). */
export const WILAYA_FILL: Record<string, string> = {
  MR01: '#c23b22',
  MR02: '#e07a2f',
  MR03: '#d4a017',
  MR04: '#2f9e44',
  MR05: '#1c7c54',
  MR06: '#1f7a8c',
  MR07: '#2f6fad',
  MR08: '#3d4fa3',
  MR09: '#6b4c9a',
  MR10: '#a33b6b',
  MR11: '#8a5a2b',
  MR12: '#5c6b2f',
  MR13: '#123a7a',
  MR14: '#e4572e',
  MR15: '#7b2d8e',
};

export const limitesAdmin = limitesAdminJson as FeatureCollection<Polygon | MultiPolygon, LimitesAdminProps>;

export function wilayaFill(pcode: string): string {
  return WILAYA_FILL[pcode] ?? '#7a879b';
}

export function wilayaStroke(pcode: string): string {
  const hex = wilayaFill(pcode).slice(1);
  const n = Number.parseInt(hex, 16);
  const channel = (shift: number) => Math.round(((n >> shift) & 255) * 0.72).toString(16).padStart(2, '0');
  return `#${channel(16)}${channel(8)}${channel(0)}`;
}

export const WILAYA_LEGEND = [...new Map(
  limitesAdmin.features.map((feature) => [feature.properties.ADM1_PCODE, feature.properties.ADM1_EN]),
).entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([pcode, name]) => ({ pcode, name, color: wilayaFill(pcode) }));

export type AdminPlaceLevel = 'wilaya' | 'moughataa' | 'commune';

export interface AdminPlaceHit {
  id: string;
  level: AdminPlaceLevel;
  name: string;
  wilaya: string;
  moughataa: string;
  pcode: string;
  lat: number;
  lon: number;
  zoom: number;
}

interface PlaceBounds {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

function emptyBounds(): PlaceBounds {
  return { minLon: Infinity, minLat: Infinity, maxLon: -Infinity, maxLat: -Infinity };
}

function includePoint(bounds: PlaceBounds, lon: number, lat: number) {
  if (lon < bounds.minLon) bounds.minLon = lon;
  if (lat < bounds.minLat) bounds.minLat = lat;
  if (lon > bounds.maxLon) bounds.maxLon = lon;
  if (lat > bounds.maxLat) bounds.maxLat = lat;
}

function visitGeometry(geometry: Polygon | MultiPolygon, bounds: PlaceBounds) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const [lon, lat] of ring) includePoint(bounds, lon, lat);
    }
  }
}

function focusFromBounds(bounds: PlaceBounds): { lat: number; lon: number; zoom: number } {
  const span = Math.max(bounds.maxLat - bounds.minLat, bounds.maxLon - bounds.minLon);
  const zoom = span > 5 ? 6 : span > 2.5 ? 7 : span > 1.2 ? 8 : 9;
  return {
    lat: (bounds.minLat + bounds.maxLat) / 2,
    lon: (bounds.minLon + bounds.maxLon) / 2,
    zoom: Math.min(zoom, GRID_MIN_ZOOM - 1),
  };
}

function foldName(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

const LEVEL_ORDER: Record<AdminPlaceLevel, number> = { wilaya: 0, moughataa: 1, commune: 2 };

function buildAdminPlaces(): AdminPlaceHit[] {
  const groups = new Map<string, { code: string; level: AdminPlaceLevel; name: string; wilaya: string; moughataa: string; pcode: string; bounds: PlaceBounds }>();
  for (const feature of limitesAdmin.features) {
    const props = feature.properties;
    const keys = [
      { id: props.ADM1_PCODE, level: 'wilaya' as const, name: props.ADM1_EN, wilaya: props.ADM1_EN, moughataa: '', pcode: props.ADM1_PCODE },
      { id: props.ADM2_PCODE, level: 'moughataa' as const, name: props.ADM2_EN, wilaya: props.ADM1_EN, moughataa: props.ADM2_EN, pcode: props.ADM1_PCODE },
      { id: props.ADM3_PCODE, level: 'commune' as const, name: props.ADM3_EN, wilaya: props.ADM1_EN, moughataa: props.ADM2_EN, pcode: props.ADM1_PCODE },
    ];
    for (const key of keys) {
      let group = groups.get(key.id);
      if (!group) {
        group = { code: key.id, ...key, bounds: emptyBounds() };
        groups.set(key.id, group);
      }
      visitGeometry(feature.geometry, group.bounds);
    }
  }
  return [...groups.values()].map((group) => ({
    id: group.level + ':' + group.code,
    level: group.level,
    name: group.name,
    wilaya: group.wilaya,
    moughataa: group.moughataa,
    pcode: group.pcode,
    ...focusFromBounds(group.bounds),
  }));
}

export const ADMIN_PLACES = buildAdminPlaces();

export function searchAdminPlaces(query: string, limit = 8): AdminPlaceHit[] {
  const needle = foldName(query.trim());
  if (needle.length < 2) return [];
  return ADMIN_PLACES
    .filter((place) => foldName(place.name).includes(needle))
    .sort((a, b) => {
      const aStart = foldName(a.name).startsWith(needle) ? 0 : 1;
      const bStart = foldName(b.name).startsWith(needle) ? 0 : 1;
      if (aStart !== bStart) return aStart - bStart;
      if (LEVEL_ORDER[a.level] !== LEVEL_ORDER[b.level]) return LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function communeTooltip(props: LimitesAdminProps): string {
  const text = (value: string) => value.replace(/[&<>]/g, (ch) => (
    ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : '&gt;'
  ));
  return `${text(props.ADM3_EN)} · ${text(props.ADM2_EN)}<br>${text(props.ADM1_EN)}`;
}
