import { Fragment, type CSSProperties, type ReactNode } from 'react';

export interface KeyValueItem {
  icon?: ReactNode;
  label: ReactNode;
  value: ReactNode;
  mono?: boolean;
}

export interface KeyValueListProps {
  items?: KeyValueItem[];
  monoValues?: boolean;
  style?: CSSProperties;
}

export function KeyValueList({ items = [], monoValues = false, style }: KeyValueListProps) {
  return (
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto auto minmax(0,1fr)', ...style }}>
      {items.map((it, i) => (
        <Fragment key={i}>
          <dt style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-5)',
            padding: 'var(--space-3) var(--space-4) var(--space-3) 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--gray-100)',
            fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-label)',
          }}>
            {it.icon}{it.label}
          </dt>
          <span aria-hidden="true" style={{
            padding: 'var(--space-3) var(--space-6)', color: 'var(--gray-400)',
            borderTop: i === 0 ? 'none' : '1px solid var(--gray-100)', fontSize: 'var(--text-sm)',
          }}>:</span>
          <dd style={{
            margin: 0, padding: 'var(--space-3) 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--gray-100)',
            fontFamily: monoValues || it.mono ? 'var(--font-mono)' : 'var(--font-ui)',
            fontSize: 'var(--text-sm)', color: 'var(--text-body)', wordBreak: 'break-word',
          }}>{it.value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
