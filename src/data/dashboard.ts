export type UnitGroup = 'wilaya' | 'moughataa' | 'commune';
export type TimeGrain = 'monthly' | 'quarterly' | 'yearly';
export type CertStatus = 'approved' | 'pending' | 'rejected' | 'underReview';
export type MonthId = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep';

export interface CountSlice {
  id: string;
  name?: string;
  value: number;
  color: string;
}

export interface TimePoint {
  id: string;
  value: number;
  year?: number;
  quarter?: number;
}

const PALETTE = ['#2F6FE0', '#34C759', '#F5A524', '#7C6BD6', '#2EC4C6', '#F0C43A', '#A8B0BE'];

function slices(rows: Array<[string, number, string?]>): CountSlice[] {
  return rows.map(([id, value, name], index) => ({
    id,
    name,
    value,
    color: PALETTE[index % PALETTE.length],
  }));
}

export const UNIT_SLICES: Record<UnitGroup, CountSlice[]> = {
  wilaya: slices([
    ['nouakchott-ouest', 36520, 'Nouakchott Ouest'],
    ['nouakchott-nord', 28380, 'Nouakchott Nord'],
    ['nouakchott-sud', 24050, 'Nouakchott Sud'],
    ['trarza', 16180, 'Trarza'],
    ['brakna', 10760, 'Brakna'],
    ['gorgol', 7810, 'Gorgol'],
    ['other', 17750],
  ]),
  moughataa: slices([
    ['tevragh-zeina', 34200, 'Tevragh Zeina'],
    ['ksar', 26840, 'Ksar'],
    ['dar-naim', 22150, 'Dar Naim'],
    ['teyaret', 18620, 'Teyaret'],
    ['sebkha', 15480, 'Sebkha'],
    ['toujounine', 12890, 'Toujounine'],
    ['other', 11270],
  ]),
  commune: slices([
    ['tevragh-zeina', 31240, 'Tevragh Zeina'],
    ['ksar', 24680, 'Ksar'],
    ['dar-naim', 21350, 'Dar Naim'],
    ['teyaret', 18720, 'Teyaret'],
    ['sebkha', 16240, 'Sebkha'],
    ['arafat', 14880, 'Arafat'],
    ['other', 14340],
  ]),
};

export const CERT_SLICES: Array<CountSlice & { id: CertStatus }> = [
  { id: 'approved', value: 7800, color: '#34C759' },
  { id: 'pending', value: 2300, color: '#F5B400' },
  { id: 'rejected', value: 1010, color: '#E5484B' },
  { id: 'underReview', value: 1370, color: '#3B82F6' },
];

export const TIME_SERIES: Record<TimeGrain, TimePoint[]> = {
  monthly: [
    { id: 'jan', value: 8450, year: 2026 },
    { id: 'feb', value: 10230, year: 2026 },
    { id: 'mar', value: 12480, year: 2026 },
    { id: 'apr', value: 14320, year: 2026 },
    { id: 'may', value: 16180, year: 2026 },
    { id: 'jun', value: 15760, year: 2026 },
    { id: 'jul', value: 14980, year: 2026 },
    { id: 'aug', value: 13950, year: 2026 },
    { id: 'sep', value: 12120, year: 2026 },
  ],
  quarterly: [
    { id: 'q1', value: 31160, quarter: 1, year: 2026 },
    { id: 'q2', value: 46260, quarter: 2, year: 2026 },
    { id: 'q3', value: 41050, quarter: 3, year: 2026 },
  ],
  yearly: [
    { id: '2022', value: 84200, year: 2022 },
    { id: '2023', value: 96340, year: 2023 },
    { id: '2024', value: 110580, year: 2024 },
    { id: '2025', value: 121900, year: 2025 },
    { id: '2026', value: 118470, year: 2026 },
  ],
};

export function sliceTotal(rows: Array<{ value: number }>): number {
  return rows.reduce((sum, row) => sum + row.value, 0);
}
