import { useState, type CSSProperties } from 'react';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name: string;
  options?: (string | RadioOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: 'row' | 'column';
  disabled?: boolean;
  style?: CSSProperties;
}

export function RadioGroup({
  name, options = [], value, defaultValue, onChange, direction = 'row', disabled = false, style,
}: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const pick = (v: string) => { if (value === undefined) setInternal(v); onChange?.(v); };
  return (
    <div role="radiogroup" style={{
      display: 'flex', flexDirection: direction === 'column' ? 'column' : 'row',
      flexWrap: 'wrap', gap: direction === 'column' ? 'var(--space-4)' : 'var(--space-6)',
      alignItems: direction === 'column' ? 'flex-start' : 'center', ...style,
    }}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        const on = current === opt.value;
        return (
          <label key={opt.value} style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)',
            fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)',
            color: disabled ? 'var(--text-disabled)' : 'var(--text-body)',
            cursor: disabled ? 'not-allowed' : 'pointer', minHeight: '22px',
          }}>
            <input type="radio" name={name} value={opt.value} checked={on} disabled={disabled}
              onChange={() => pick(opt.value)}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
            <span aria-hidden="true" style={{
              width: '16px', height: '16px', flex: '0 0 auto', borderRadius: 'var(--radius-full)',
              borderWidth: on ? '5px' : '1.5px', borderStyle: 'solid',
              borderColor: disabled ? 'var(--gray-300)' : on ? 'var(--cyan-500)' : 'var(--gray-400)',
              background: 'var(--surface-page)', boxSizing: 'border-box',
              transition: 'var(--transition-control)',
            }} />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}
