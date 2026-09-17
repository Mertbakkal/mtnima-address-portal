import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export interface MapZoomControlProps {
  level?: number;
  onZoomIn?: MouseEventHandler<HTMLButtonElement>;
  onZoomOut?: MouseEventHandler<HTMLButtonElement>;
  extras?: ReactNode;
  levelLabel?: string;
  zoomInLabel?: string;
  zoomOutLabel?: string;
  style?: CSSProperties;
}

export function MapZoomControl({
  level = 12, onZoomIn, onZoomOut, extras, levelLabel = 'Zoom level',
  zoomInLabel = 'Zoom in', zoomOutLabel = 'Zoom out', style,
}: MapZoomControlProps) {
  const btn = (child: ReactNode, label: string, onClick: MouseEventHandler<HTMLButtonElement> | undefined, radius: string) => (
    <button type="button" title={label} aria-label={label} onClick={onClick}
      style={{
        width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', borderRadius: radius, background: 'var(--surface-accent)',
        color: 'var(--text-on-accent)', cursor: 'pointer', padding: 0, transition: 'var(--transition-control)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-accent-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-accent)'; }}>
      {child}
    </button>
  );
  const bar = (
    <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" aria-hidden="true"><path d="M5 12h14" /></svg>
  );
  const cross = (
    <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', ...style }}>
      {extras}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', boxShadow: 'var(--shadow-sm)', borderRadius: 'var(--radius-sm)' }}>
        {btn(cross, zoomInLabel, onZoomIn, 'var(--radius-sm) var(--radius-sm) 0 0')}
        <output aria-label={levelLabel} style={{
          width: '30px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--gray-0)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-medium)', color: 'var(--text-body)',
        }}>{level}</output>
        {btn(bar, zoomOutLabel, onZoomOut, '0 0 var(--radius-sm) var(--radius-sm)')}
      </div>
    </div>
  );
}
