import type { CSSProperties, ReactNode } from 'react';

export interface FormRowProps {
  label: ReactNode;
  children?: ReactNode;
  htmlFor?: string;
  colon?: boolean;
  align?: 'center' | 'top';
  labelWidth?: string;
  layout?: 'row' | 'stacked';
  required?: boolean;
  hint?: ReactNode;
  style?: CSSProperties;
}

export function FormRow({
  label, children, htmlFor, colon = true, align = 'center', labelWidth = '132px',
  layout = 'row', required = false, hint, style,
}: FormRowProps) {
  const isRow = layout === 'row';
  return (
    <div style={{
      display: isRow ? 'grid' : 'block',
      gridTemplateColumns: isRow ? labelWidth + ' minmax(0,1fr)' : undefined,
      alignItems: align === 'top' ? 'start' : 'center',
      gap: isRow ? 'var(--space-4)' : 'var(--space-2)',
      padding: 'var(--space-3) 0', ...style,
    }}>
      <label htmlFor={htmlFor} style={{
        fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
        color: 'var(--text-label)', lineHeight: 'var(--leading-snug)',
        paddingTop: align === 'top' ? 'var(--space-3)' : 0,
        marginBottom: isRow ? 0 : 'var(--space-2)', display: 'block',
      }}>
        {label}{required ? <span style={{ color: 'var(--status-danger-fg)' }}> *</span> : null}{colon ? ' :' : ''}
      </label>
      <div style={{ minWidth: 0 }}>
        {children}
        {hint ? <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>{hint}</div> : null}
      </div>
    </div>
  );
}
