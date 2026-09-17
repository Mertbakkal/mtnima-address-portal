import { useState, type CSSProperties } from 'react';

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedToggleProps {
  options?: (string | SegmentedOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
}

export function SegmentedToggle({
  options = [], value, defaultValue, onChange, size = 'md', disabled = false, ariaLabel, style,
}: SegmentedToggleProps) {
  const firstDefault = typeof options[0] === 'string' ? options[0] : (options[0] as SegmentedOption | undefined)?.value;
  const [internal, setInternal] = useState(defaultValue ?? firstDefault);
  const current = value !== undefined ? value : internal;
  const pick = (v: string) => { if (disabled) return; if (value === undefined) setInternal(v); onChange?.(v); };
  const h = size === 'sm' ? '22px' : '26px';
  return (
    <div role="group" aria-label={ariaLabel} style={{
      display: 'inline-flex', height: h, padding: '2px', gap: '2px',
      background: 'var(--navy-900)', borderRadius: 'var(--radius-sm)', ...style,
    }}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        const on = current === opt.value;
        return (
          <button key={opt.value} type="button" aria-pressed={on} disabled={disabled} onClick={() => pick(opt.value)}
            style={{
              border: 'none', borderRadius: 'var(--radius-xs)', padding: '0 var(--space-5)',
              fontFamily: 'var(--font-ui)', fontSize: size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)', letterSpacing: 'var(--tracking-wide)',
              background: on ? 'var(--cyan-500)' : 'transparent',
              color: on ? 'var(--text-on-accent)' : 'var(--gray-300)',
              cursor: disabled ? 'not-allowed' : 'pointer', transition: 'var(--transition-control)',
            }}>{opt.label}</button>
        );
      })}
    </div>
  );
}
