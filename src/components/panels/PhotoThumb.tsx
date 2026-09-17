import type { CSSProperties } from 'react';

export interface PhotoThumbProps {
  src?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  emptyLabel?: string;
  style?: CSSProperties;
}

export function PhotoThumb({ src, alt = '', caption, width = 143, height = 102, emptyLabel = 'No photo', style }: PhotoThumbProps) {
  return (
    <figure style={{ margin: 0, display: 'inline-flex', flexDirection: 'column', gap: 'var(--space-3)', ...style }}>
      <div style={{
        width, height, borderRadius: 'var(--radius-md)', overflow: 'hidden',
        border: '1px solid var(--gray-200)', background: 'var(--gray-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {src ? (
          <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="1.6" strokeLinecap="round" role="img" aria-label={emptyLabel}>
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 16l5-4 4 3 3-2 6 4" /><circle cx="8.5" cy="9.5" r="1.4" />
          </svg>
        )}
      </div>
      {caption ? (
        <figcaption style={{
          fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)',
          color: 'var(--text-label)', textAlign: 'center', maxWidth: width,
        }}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
