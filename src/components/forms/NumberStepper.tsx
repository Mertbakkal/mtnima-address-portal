import { useState, type CSSProperties } from 'react';

export interface NumberStepperProps {
  value?: number | string;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  width?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function NumberStepper({ value, onChange, min, max, step = 1, id, width = '74px', disabled = false, style }: NumberStepperProps) {
  const [internal, setInternal] = useState(value ?? '');
  const val = value !== undefined ? value : internal;
  const set = (n: number | string) => { if (value === undefined) setInternal(n); onChange?.(Number(n)); };
  const bump = (d: number) => {
    const n = Number(val || 0) + d * step;
    if (min !== undefined && n < min) return;
    if (max !== undefined && n > max) return;
    set(n);
  };
  const arrow = (dir: 'up' | 'down') => (
    <button type="button" tabIndex={-1} aria-hidden="true" disabled={disabled}
      onClick={() => bump(dir === 'up' ? 1 : -1)}
      style={{
        width: '16px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer', padding: 0,
        color: 'var(--gray-500)', fontSize: '8px', lineHeight: 1,
      }}>
      {dir === 'up' ? '▲' : '▼'}
    </button>
  );
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'stretch', width, height: 'var(--control-height-md)',
      border: '1px solid var(--border-field)', borderRadius: 'var(--radius-sm)',
      background: disabled ? 'var(--gray-100)' : 'var(--surface-page)',
      boxShadow: 'var(--shadow-inset-field)', overflow: 'hidden', ...style,
    }}>
      <input id={id} type="text" inputMode="numeric" value={val} disabled={disabled}
        onChange={(e) => set(e.target.value.replace(/[^0-9-]/g, ''))}
        style={{
          flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none',
          padding: '0 var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
          color: disabled ? 'var(--text-disabled)' : 'var(--text-body)',
        }} />
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        borderLeft: '1px solid var(--gray-200)', background: 'var(--gray-50)',
      }}>
        {arrow('up')}{arrow('down')}
      </div>
    </div>
  );
}
