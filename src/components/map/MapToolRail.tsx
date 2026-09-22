import { useState, type CSSProperties, type ReactNode } from 'react';
import { IconButton } from '../core/IconButton';

export interface MapRailTool {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface MapToolRailProps {
  tools?: MapRailTool[];
  value?: string;
  onChange?: (id: string) => void;
  side?: 'left' | 'right';
  ariaLabel?: string;
  style?: CSSProperties;
}

export function MapToolRail({ tools = [], value, onChange, side = 'left', ariaLabel = 'Map tools', style }: MapToolRailProps) {
  const [internal, setInternal] = useState(value);
  const cur = value !== undefined ? value : internal;
  const pick = (id: string) => { if (value === undefined) setInternal(id); onChange?.(id); };
  return (
    <div role="toolbar" aria-orientation="vertical" aria-label={ariaLabel} style={{
      width: 'var(--maptool-rail-width)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-5) 0',
      [side === 'left' ? 'paddingLeft' : 'paddingRight']: 'var(--space-5)', ...style,
    }}>
      {tools.map((t) => (
        <IconButton key={t.id} shape="rail" icon={t.icon} label={t.label} active={cur === t.id} onClick={() => pick(t.id)} />
      ))}
    </div>
  );
}
