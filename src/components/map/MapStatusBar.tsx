import { useState, type ChangeEventHandler, type CSSProperties } from 'react';
import { Select } from '../forms/Select';

export interface MapStatusBarProps {
  crs?: string;
  crsOptions?: string[];
  lat?: string;
  lon?: string;
  latLabel?: string;
  lonLabel?: string;
  scale?: string;
  scaleOptions?: string[];
  onCopy?: () => void;
  copyLabel?: string;
  crsLabel?: string;
  scaleLabel?: string;
  onCrsChange?: ChangeEventHandler<HTMLSelectElement>;
  onScaleChange?: ChangeEventHandler<HTMLSelectElement>;
  style?: CSSProperties;
}

export function MapStatusBar({
  crs = 'WGS84 (EPSG:4326)', crsOptions = [], lat, lon, latLabel = 'Lat', lonLabel = 'Lon',
  scale = '1:50,000', scaleOptions = [], onCopy, copyLabel = 'Copy coordinates',
  crsLabel = 'Coordinate system', scaleLabel = 'Scale', onCrsChange, onScaleChange, style,
}: MapStatusBarProps) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
      gap: 'var(--space-8)', minHeight: 'var(--statusbar-height)',
      padding: '0 var(--space-8)', background: 'var(--surface-page)',
      borderTop: '1px solid var(--border-panel)',
      fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-body)', ...style,
    }}>
      <div style={{ width: '190px' }}>
        <Select options={crsOptions.length ? crsOptions : [crs]} value={crs} onChange={onCrsChange} placeholder={null} aria-label={crsLabel} />
      </div>
      <span aria-hidden="true" style={{ width: '1px', height: '20px', background: 'var(--gray-200)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        <span style={{ color: 'var(--text-label)' }}>{latLabel}:</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>{lat}</span>
        <span aria-hidden="true" style={{ color: 'var(--gray-400)' }}>-</span>
        <span style={{ color: 'var(--text-label)' }}>{lonLabel}:</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>{lon}</span>
        <button type="button" title={copyLabel} aria-label={copyLabel} onClick={onCopy}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          style={{
            width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', padding: 0,
            background: hover ? 'var(--surface-tint-weak)' : 'var(--gray-0)', cursor: 'pointer',
            transition: 'var(--transition-control)',
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--icon-default)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5h10" />
          </svg>
        </button>
      </div>
      <span aria-hidden="true" style={{ width: '1px', height: '20px', background: 'var(--gray-200)' }} />
      <div style={{ width: '190px' }}>
        <Select options={scaleOptions.length ? scaleOptions : [scale]} value={scale} onChange={onScaleChange} placeholder={null} aria-label={scaleLabel} />
      </div>
    </div>
  );
}
