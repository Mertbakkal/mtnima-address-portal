import { useState, type CSSProperties } from 'react';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs?: (string | TabItem)[];
  value?: string;
  onChange?: (id: string) => void;
  style?: CSSProperties;
}

export function Tabs({ tabs = [], value, onChange, style }: TabsProps) {
  const firstId = typeof tabs[0] === 'string' ? tabs[0] : (tabs[0] as TabItem | undefined)?.id;
  const [internal, setInternal] = useState(value ?? firstId);
  const [hover, setHover] = useState<string | null>(null);
  const cur = value !== undefined ? value : internal;
  const pick = (id: string) => { if (value === undefined) setInternal(id); onChange?.(id); };
  return (
    <div role="tablist" style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      borderBottom: '1px solid var(--border-panel)', padding: '0 var(--space-4)', ...style,
    }}>
      {tabs.map((t) => {
        const tab = typeof t === 'string' ? { id: t, label: t } : t;
        const on = cur === tab.id;
        return (
          <button key={tab.id} type="button" role="tab" aria-selected={on} onClick={() => pick(tab.id)}
            onMouseEnter={() => setHover(tab.id)} onMouseLeave={() => setHover(null)}
            style={{
              height: '34px', padding: '0 var(--space-8)', border: 'none',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              background: on ? 'var(--surface-accent)' : hover === tab.id ? 'var(--surface-tint-weak)' : 'transparent',
              color: on ? 'var(--text-on-accent)' : 'var(--text-body)',
              fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)',
              fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition-control)',
            }}>{tab.label}</button>
        );
      })}
    </div>
  );
}
