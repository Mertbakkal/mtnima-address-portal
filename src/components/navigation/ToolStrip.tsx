import { useState, type CSSProperties, type ReactNode } from 'react';

export interface ToolStripTool {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface ToolStripProps {
  tools?: ToolStripTool[];
  value?: string | null;
  onChange?: (id: string) => void;
  stripLabel?: string;
  style?: CSSProperties;
}

export function ToolStrip({ tools = [], value, onChange, stripLabel = 'Tools', style }: ToolStripProps) {
  const [internal, setInternal] = useState<string | null | undefined>(value);
  const [hover, setHover] = useState<string | null>(null);
  const cur = value !== undefined ? value : internal;
  const pick = (id: string) => { if (value === undefined) setInternal(id); onChange?.(id); };
  return (
    <div role="toolbar" aria-label={stripLabel} style={{
      display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '1fr',
      height: 'var(--toolstrip-height)', background: 'var(--surface-page)', ...style,
    }}>
      {tools.map((t, i) => {
        const on = cur === t.id;
        return (
          <button key={t.id} type="button" aria-pressed={on} onClick={() => pick(t.id)}
            onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 'var(--space-3)', minWidth: 0, padding: 'var(--space-4) var(--space-3)',
              border: 'none', borderLeft: i === 0 ? 'none' : '1px solid var(--border-panel)',
              borderRadius: on ? 'var(--radius-md) var(--radius-md) 0 0' : 0,
              background: on ? 'var(--surface-tint)' : hover === t.id ? 'var(--surface-tint-weak)' : 'transparent',
              color: 'var(--text-body)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)',
              fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
              cursor: 'pointer', transition: 'var(--transition-control)',
            }}>
            {t.icon}
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
