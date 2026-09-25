export interface WizardColumn {
  id: string;
  name: string;
  type: string;
}

export interface WizardTableDef {
  id: 'road' | 'point';
  label: string;
  columns: WizardColumn[];
}

export const WIZARD_TABLES: WizardTableDef[] = [
  {
    id: 'road',
    label: 'Road (yol)',
    columns: [
      { id: 'road_id', name: 'road_id', type: 'number' },
      { id: 'name', name: 'name', type: 'text' },
      { id: 'length_m', name: 'length_m', type: 'number' },
      { id: 'surface', name: 'surface', type: 'text' },
      { id: 'status', name: 'status', type: 'text' },
      { id: 'width_m', name: 'width_m', type: 'number' },
      { id: 'one_way', name: 'one_way', type: 'boolean' },
      { id: 'created_at', name: 'created_at', type: 'date' },
    ],
  },
  {
    id: 'point',
    label: 'Point',
    columns: [
      { id: 'point_id', name: 'point_id', type: 'number' },
      { id: 'digital_address', name: 'digital_address', type: 'text' },
      { id: 'building_type', name: 'building_type', type: 'text' },
      { id: 'lat', name: 'lat', type: 'number' },
      { id: 'lon', name: 'lon', type: 'number' },
      { id: 'accuracy_m', name: 'accuracy_m', type: 'number' },
      { id: 'collected_by', name: 'collected_by', type: 'text' },
      { id: 'record_date', name: 'record_date', type: 'date' },
    ],
  },
];

export interface TaskUser {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export const TASK_USERS: TaskUser[] = [
  { id: 'u1', name: 'Ahmed', surname: 'Mohamed', email: 'ahmed.mohamed@mtnima.mr' },
  { id: 'u2', name: 'Fatima', surname: 'Sidi', email: 'fatima.sidi@mtnima.mr' },
  { id: 'u3', name: 'Mohamed', surname: 'Ould Bidah', email: 'm.ouldbidah@mtnima.mr' },
  { id: 'u4', name: 'Aicha', surname: 'Salem', email: 'aicha.salem@mtnima.mr' },
  { id: 'u5', name: 'Ibrahim', surname: 'Kane', email: 'ibrahim.kane@mtnima.mr' },
  { id: 'u6', name: 'Mariem', surname: 'Mint Abdallahi', email: 'mariem.abdallahi@mtnima.mr' },
  { id: 'u7', name: 'Sidi', surname: 'Baba', email: 'sidi.baba@mtnima.mr' },
  { id: 'u8', name: 'Khady', surname: 'Diop', email: 'khady.diop@mtnima.mr' },
];

/** Ray-casting point-in-polygon. Ring is [lat, lon][]. */
export function pointInPolygon(lat: number, lon: number, ring: [number, number][]): boolean {
  if (ring.length < 3) return false;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i][0];
    const xi = ring[i][1];
    const yj = ring[j][0];
    const xj = ring[j][1];
    const intersect = ((yi > lat) !== (yj > lat))
      && (lon < ((xj - xi) * (lat - yi)) / (yj - yi + Number.EPSILON) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
