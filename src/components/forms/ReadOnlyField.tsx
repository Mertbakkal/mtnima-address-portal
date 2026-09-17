import type { CSSProperties, ReactNode } from 'react';

export interface ReadOnlyFieldProps {
  value?: ReactNode;
  id?: string;
  mono?: boolean;
  placeholder?: ReactNode;
  align?: 'start' | 'end';
  style?: CSSProperties;
}

export function ReadOnlyField({ value, id, mono = false, placeholder, align = 'start', style }: ReadOnlyFieldProps) {
  const empty = value === undefined || value === null || value === '';
  return (
    <div id={id} role="textbox" aria-readonly="true" tabIndex={0} style={{
      minHeight: 'var(--control-height-md)', display: 'flex', alignItems: 'center',
      justifyContent: align === 'end' ? 'flex-end' : 'flex-start',
      padding: 'var(--space-3) var(--space-5)', borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-sunken)', border: '1px solid var(--gray-200)',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)', fontSize: 'var(--text-sm)',
      color: empty ? 'var(--text-placeholder)' : 'var(--text-body)',
      lineHeight: 'var(--leading-snug)', wordBreak: 'break-word', ...style,
    }}>{empty ? placeholder : value}</div>
  );
}
