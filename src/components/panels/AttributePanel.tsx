import { useState, type CSSProperties, type ReactNode } from 'react';

export interface AttributePanelProps {
  title?: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  tabs?: ReactNode;
  width?: string;
  closeLabel?: string;
  style?: CSSProperties;
}

export function AttributePanel({
  title, icon, onClose, children, footer, tabs, width = 'var(--panel-width)', closeLabel = 'Close', style,
}: AttributePanelProps) {
  const [hover, setHover] = useState(false);
  return (
    <aside aria-label={typeof title === 'string' ? title : undefined} style={{
      width, maxWidth: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--surface-panel)', border: '1px solid var(--border-panel)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-panel)', overflow: 'hidden', ...style,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)',
        padding: 'var(--space-6) var(--space-7)', borderBottom: '1px solid var(--border-panel)',
      }}>
        {icon}
        <h2 style={{
          margin: 0, flex: 1, minWidth: 0, fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)',
          color: 'var(--text-heading)', lineHeight: 'var(--leading-snug)',
        }}>{title}</h2>
        {onClose ? (
          <button type="button" onClick={onClose} title={closeLabel} aria-label={closeLabel}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{
              width: '28px', height: '28px', flex: '0 0 auto', display: 'flex',
              alignItems: 'center', justifyContent: 'center', border: 'none', padding: 0,
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              background: hover ? 'var(--gray-100)' : 'transparent', transition: 'var(--transition-control)',
            }}>
            <svg width="15" height="15" viewBox="0 0 24 24" stroke="var(--gray-600)" strokeWidth="2.4" strokeLinecap="round" fill="none" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        ) : null}
      </div>
      {tabs}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--space-4) var(--space-7) var(--space-8)' }}>
        {children}
      </div>
      {footer ? (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)',
          padding: 'var(--space-6) var(--space-7)', borderTop: '1px solid var(--border-panel)',
          background: 'var(--surface-page)',
        }}>{footer}</div>
      ) : null}
    </aside>
  );
}
