export interface AddressDemand {
  identifier: string;
  date: string;
  status: 'Pending';
  fullName: string;
  phone: string;
  documents: [string, string];
  photos: [string | null, string | null];
}

const NAMES = [
  'Mohamed Fall',
  'Aminetou Mint Salem',
  'Cheikh Ould Ahmed',
  'Fatimetou Diallo',
  'Sidi Mohamed',
  'Mariem Bint Khattar',
];

const DOCUMENTS = [
  'Lease agreement, title deed, or utility bill',
  'Signature circular / power of attorney',
  'ID front and back (color)',
];

const PHOTO_SRC = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="110" viewBox="0 0 160 110">
    <rect width="160" height="110" fill="#d7c4a3"/>
    <rect y="62" width="160" height="48" fill="#c4a574"/>
    <rect x="18" y="28" width="78" height="62" fill="#8d8f86"/>
    <rect x="28" y="40" width="16" height="14" fill="#6f8f9a"/>
    <rect x="52" y="40" width="16" height="14" fill="#6f8f9a"/>
    <rect x="40" y="64" width="18" height="26" fill="#5c4632"/>
    <rect x="108" y="46" width="28" height="18" fill="#6a8f4e"/>
  </svg>`,
)}`;

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

function pickIdentifier(rand: () => number): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) id += alphabet[Math.floor(rand() * alphabet.length)];
  return id;
}

function pickDate(rand: () => number): string {
  const start = Date.UTC(2025, 0, 1);
  const end = Date.UTC(2026, 8, 1);
  const ms = start + Math.floor(rand() * (end - start));
  return new Date(ms).toISOString().slice(0, 10);
}

function pickPhone(rand: () => number): string {
  const digits = Array.from({ length: 8 }, () => Math.floor(rand() * 10)).join('');
  return `+222 ${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
}

/** Stable visual demand for one address point, using Address Detection fields. */
export function buildAddressDemand(pointId: string): AddressDemand {
  const rand = mulberry32(hashSeed(pointId || 'address'));
  const docs = [...DOCUMENTS];
  for (let i = docs.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [docs[i], docs[j]] = [docs[j], docs[i]];
  }
  const secondPhoto = rand() < 0.45 ? PHOTO_SRC : null;
  return {
    identifier: pickIdentifier(rand),
    date: pickDate(rand),
    status: 'Pending',
    fullName: NAMES[Math.floor(rand() * NAMES.length)],
    phone: pickPhone(rand),
    documents: [docs[0], docs[1]],
    photos: [PHOTO_SRC, secondPhoto],
  };
}
