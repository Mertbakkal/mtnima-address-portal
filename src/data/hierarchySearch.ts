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

export const HIERARCHY_TREE: HierarchyWilaya[] = [
  {
    name: 'Nouakchott',
    focus: { lat: 18.0895, lon: -15.9755, zoom: 11 },
    moughataas: [
      {
        name: 'Tevragh Zeina',
        focus: { lat: 18.1, lon: -15.99, zoom: 13 },
        communes: [
          {
            name: 'Tevragh Zeina',
            focus: { lat: 18.102, lon: -15.988, zoom: 14 },
            streets: [
              { name: "Rue de l'Amitié", focus: { lat: 18.1035, lon: -15.9865, zoom: 17 } },
              { name: 'Avenue Gamal Abdel Nasser', focus: { lat: 18.101, lon: -15.991, zoom: 16 } },
              { name: 'Rue Mamadou Konaté', focus: { lat: 18.1045, lon: -15.984, zoom: 17 } },
            ],
          },
          {
            name: 'Ksar',
            focus: { lat: 18.095, lon: -15.97, zoom: 14 },
            streets: [
              { name: 'Boulevard Général de Gaulle', focus: { lat: 18.096, lon: -15.968, zoom: 16 } },
              { name: 'Rue de la Corniche', focus: { lat: 18.093, lon: -15.972, zoom: 17 } },
            ],
          },
        ],
      },
      {
        name: 'Ksar',
        focus: { lat: 18.085, lon: -15.96, zoom: 13 },
        communes: [
          {
            name: 'Ksar',
            focus: { lat: 18.086, lon: -15.958, zoom: 14 },
            streets: [
              { name: 'Avenue Mokhtar Ould Daddah', focus: { lat: 18.087, lon: -15.956, zoom: 16 } },
              { name: 'Rue 42-150', focus: { lat: 18.084, lon: -15.961, zoom: 17 } },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Nouakchott Ouest',
    focus: { lat: 18.07, lon: -16.0, zoom: 11 },
    moughataas: [
      {
        name: 'Tevragh Zeina',
        focus: { lat: 18.075, lon: -16.005, zoom: 13 },
        communes: [
          {
            name: 'Commune 1',
            focus: { lat: 18.076, lon: -16.003, zoom: 14 },
            streets: [
              { name: 'Rue Principale', focus: { lat: 18.077, lon: -16.002, zoom: 17 } },
              { name: 'Avenue de la Plage', focus: { lat: 18.074, lon: -16.008, zoom: 16 } },
            ],
          },
          {
            name: 'Commune 2',
            focus: { lat: 18.072, lon: -15.998, zoom: 14 },
            streets: [
              { name: 'Rue du Marché', focus: { lat: 18.073, lon: -15.997, zoom: 17 } },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Nouakchott Nord',
    focus: { lat: 18.12, lon: -15.95, zoom: 11 },
    moughataas: [
      {
        name: 'Dar Naim',
        focus: { lat: 18.125, lon: -15.945, zoom: 13 },
        communes: [
          {
            name: 'Dar Naim 1',
            focus: { lat: 18.126, lon: -15.944, zoom: 14 },
            streets: [
              { name: 'Avenue Dar Naim', focus: { lat: 18.127, lon: -15.943, zoom: 16 } },
              { name: 'Rue 12-050', focus: { lat: 18.124, lon: -15.946, zoom: 17 } },
            ],
          },
        ],
      },
      {
        name: 'Teyaret',
        focus: { lat: 18.115, lon: -15.955, zoom: 13 },
        communes: [
          {
            name: 'Teyaret',
            focus: { lat: 18.116, lon: -15.954, zoom: 14 },
            streets: [
              { name: 'Boulevard Teyaret', focus: { lat: 18.117, lon: -15.953, zoom: 16 } },
            ],
          },
        ],
      },
    ],
  },
];

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
