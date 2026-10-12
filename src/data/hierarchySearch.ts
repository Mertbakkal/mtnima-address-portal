import { ADMIN_PLACES } from './adminBoundaries';

export interface MapFocus {
  lat: number;
  lon: number;
  zoom: number;
}

export interface HierarchyStreet {
  name: string;
  focus: MapFocus;
}

export interface HierarchyCommune {
  name: string;
  focus: MapFocus;
  streets: HierarchyStreet[];
}

export interface HierarchyMoughataa {
  name: string;
  focus: MapFocus;
  communes: HierarchyCommune[];
}

export interface HierarchyWilaya {
  name: string;
  focus: MapFocus;
  moughataas: HierarchyMoughataa[];
}

export interface HierarchySelection {
  wilaya?: string;
  moughataa?: string;
  commune?: string;
  street?: string;
}

function focusOf(place: { lat: number; lon: number; zoom: number }): MapFocus {
  return { lat: place.lat, lon: place.lon, zoom: place.zoom };
}

function buildHierarchy(): HierarchyWilaya[] {
  const wilayas = new Map<string, HierarchyWilaya>();
  for (const place of ADMIN_PLACES) {
    if (place.level !== 'wilaya') continue;
    wilayas.set(place.name, { name: place.name, focus: focusOf(place), moughataas: [] });
  }

  const moughataas = new Map<string, HierarchyMoughataa>();
  for (const place of ADMIN_PLACES) {
    if (place.level !== 'moughataa') continue;
    const parent = wilayas.get(place.wilaya);
    if (!parent) continue;
    const node: HierarchyMoughataa = { name: place.name, focus: focusOf(place), communes: [] };
    parent.moughataas.push(node);
    moughataas.set(place.wilaya + '\0' + place.name, node);
  }

  for (const place of ADMIN_PLACES) {
    if (place.level !== 'commune') continue;
    const parent = moughataas.get(place.wilaya + '\0' + place.moughataa);
    if (!parent) continue;
    parent.communes.push({ name: place.name, focus: focusOf(place), streets: [] });
  }

  for (const wilaya of wilayas.values()) {
    wilaya.moughataas.sort((a, b) => a.name.localeCompare(b.name));
    for (const moughataa of wilaya.moughataas) {
      moughataa.communes.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  return [...wilayas.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Wilaya, moughataa, and commune lists from the Limites_admin boundaries. */
export const HIERARCHY_TREE: HierarchyWilaya[] = buildHierarchy();

export function resolveHierarchyFocus(selection: HierarchySelection): MapFocus | null {
  if (!selection.wilaya) return null;

  const wilaya = HIERARCHY_TREE.find((w) => w.name === selection.wilaya);
  if (!wilaya) return null;
  if (!selection.moughataa) return wilaya.focus;

  const moughataa = wilaya.moughataas.find((m) => m.name === selection.moughataa);
  if (!moughataa) return wilaya.focus;
  if (!selection.commune) return moughataa.focus;

  const commune = moughataa.communes.find((c) => c.name === selection.commune);
  if (!commune) return moughataa.focus;
  if (!selection.street) return commune.focus;

  const street = commune.streets.find((s) => s.name === selection.street);
  return street?.focus ?? commune.focus;
}

export function getWilayaNames(): string[] {
  return HIERARCHY_TREE.map((w) => w.name);
}

export function getMoughataaNames(wilayaName: string): string[] {
  const wilaya = HIERARCHY_TREE.find((w) => w.name === wilayaName);
  return wilaya ? wilaya.moughataas.map((m) => m.name) : [];
}

export function getCommuneNames(wilayaName: string, moughataaName: string): string[] {
  const wilaya = HIERARCHY_TREE.find((w) => w.name === wilayaName);
  const moughataa = wilaya?.moughataas.find((m) => m.name === moughataaName);
  return moughataa ? moughataa.communes.map((c) => c.name) : [];
}

export function getStreetNames(wilayaName: string, moughataaName: string, communeName: string): string[] {
  const wilaya = HIERARCHY_TREE.find((w) => w.name === wilayaName);
  const moughataa = wilaya?.moughataas.find((m) => m.name === moughataaName);
  const commune = moughataa?.communes.find((c) => c.name === communeName);
  return commune ? commune.streets.map((s) => s.name) : [];
}
