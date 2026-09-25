export interface TaskMission {
  id: string;
  name: string;
  createdAt: string;
  recordId: string;
  digitalAddress: string;
  coordinates: string;
  accuracy: string;
  buildingType: string;
  collectedBy: string;
  recordDate: string;
}

export const SEED_MISSIONS: TaskMission[] = [
  {
    id: 'mission-1',
    name: 'Nouakchott field validation',
    createdAt: '26.12.2025 10:56',
    recordId: 'MOB-2026-00157',
    digitalAddress: 'Nouakchott, Tevragh Zeina',
    coordinates: '18.102000, -15.988000',
    accuracy: '5 m',
    buildingType: 'Residential',
    collectedBy: 'ahmed.mohamed',
    recordDate: '12.11.2025 10:24',
  },
  {
    id: 'mission-2',
    name: 'Teyaret address survey',
    createdAt: '24.12.2025 14:32',
    recordId: 'MOB-2026-00182',
    digitalAddress: 'Nouakchott, Teyaret',
    coordinates: '18.083512, -15.978451',
    accuracy: '4 m',
    buildingType: 'Residential',
    collectedBy: 'fatima.sidi',
    recordDate: '18.11.2025 09:15',
  },
  {
    id: 'mission-3',
    name: 'Tevragh Zeina building check',
    createdAt: '22.12.2025 09:18',
    recordId: 'MOB-2026-00201',
    digitalAddress: 'Nouakchott, Tevragh Zeina, Ksar',
    coordinates: '18.095000, -15.970000',
    accuracy: '6 m',
    buildingType: 'Commercial',
    collectedBy: 'mohamed.ould',
    recordDate: '20.11.2025 16:40',
  },
  {
    id: 'mission-4',
    name: 'Arafat street numbering',
    createdAt: '20.12.2025 11:05',
    recordId: 'MOB-2026-00214',
    digitalAddress: 'Nouakchott, Arafat',
    coordinates: '18.070000, -15.950000',
    accuracy: '5 m',
    buildingType: 'Residential',
    collectedBy: 'aicha.salem',
    recordDate: '22.11.2025 08:50',
  },
  {
    id: 'mission-5',
    name: 'Sebkha digital address review',
    createdAt: '18.12.2025 16:44',
    recordId: 'MOB-2026-00230',
    digitalAddress: 'Nouakchott, Sebkha',
    coordinates: '18.078000, -15.965000',
    accuracy: '7 m',
    buildingType: 'Mixed use',
    collectedBy: 'ibrahim.kane',
    recordDate: '25.11.2025 13:12',
  },
];

const EXTRA_NAMES = [
  'Dar Naim cadastral update',
  'Toujounine field capture',
  'Riyadh address reconciliation',
];

export function createMission(index: number): TaskMission {
  const n = index + 1;
  const name = EXTRA_NAMES[index % EXTRA_NAMES.length] ?? `Mauritania mission ${n}`;
  const now = new Date();
  const pad = (v: number) => String(v).padStart(2, '0');
  const stamp = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return {
    id: `mission-${Date.now()}-${n}`,
    name,
    createdAt: stamp,
    recordId: `MOB-2026-${String(240 + n).padStart(5, '0')}`,
    digitalAddress: 'Nouakchott, Mauritania',
    coordinates: '18.089500, -15.975500',
    accuracy: '5 m',
    buildingType: 'Residential',
    collectedBy: 'field.agent',
    recordDate: stamp,
  };
}
