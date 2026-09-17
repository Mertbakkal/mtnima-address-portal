import type { CSSProperties } from 'react';

export type MarkerTone = 'default' | 'selected' | 'certified' | 'pending';

const tones: Record<MarkerTone, { fill: string; label: string; labelBg: string }> = {
  default: { fill: 'var(--cyan-500)', label: 'var(--gray-0)', labelBg: 'var(--cyan-500)' },
  selected: { fill: 'var(--red-500)', label: 'var(--gray-0)', labelBg: 'var(--red-500)' },
  certified: { fill: 'var(--green-500)', label: 'var(--gray-0)', labelBg: 'var(--green-500)' },
  pending: { fill: 'var(--amber-500)', label: 'var(--gray-0)', labelBg: 'var(--amber-500)' },
};

export interface AddressMarkerProps {
  number?: string | number;
  tone?: MarkerTone;
  showDot?: boolean;
  style?: CSSProperties;
}

export function AddressMarker({ number, tone = 'default', showDot = true, style }: AddressMarkerProps) {
  const t = tones[tone] || tones.default;
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '2px', ...style }}>
      {number !== undefined && number !== null ? (
        <span style={{
          display: 'inline-flex', alignItems: 'center', height: '17px', padding: '0 var(--space-3)',
          borderRadius: 'var(--radius-xs)', background: t.labelBg, color: t.label,
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
          fontWeight: 'var(--weight-medium)', lineHeight: 1,
          boxShadow: '0 0 0 1.5px var(--gray-0)',
        }}>{number}</span>
      ) : null}
      {showDot ? (
        <span aria-hidden="true" style={{
          width: '9px', height: '9px', borderRadius: 'var(--radius-full)',
          background: t.fill, boxShadow: '0 0 0 2px var(--gray-0)',
        }} />
      ) : null}
    </span>
  );
}
