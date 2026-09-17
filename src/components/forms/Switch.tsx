import { useState, type CSSProperties } from 'react';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Switch({ checked, defaultChecked = false, onChange, label, id, disabled = false, style }: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(!on);
    onChange?.(!on);
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-5)', ...style }}>
      <button
        type="button" role="switch" aria-checked={on} aria-labelledby={id ? id + '-label' : undefined}
        id={id} disabled={disabled} onClick={toggle}
        style={{
          width: '38px', height: '20px', flex: '0 0 auto', padding: '2px',
          borderRadius: 'var(--radius-full)', border: 'none',
          background: disabled ? 'var(--gray-200)' : on ? 'var(--cyan-500)' : 'var(--gray-300)',
          cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex',
          justifyContent: on ? 'flex-end' : 'flex-start', alignItems: 'center',
          transition: 'background-color var(--duration-fast) var(--ease-standard)',
        }}
      >
        <span aria-hidden="true" style={{
          width: '16px', height: '16px', borderRadius: 'var(--radius-full)',
          background: 'var(--gray-0)', boxShadow: 'var(--shadow-xs)',
        }} />
      </button>
      {label ? (
        <span id={id ? id + '-label' : undefined} style={{
          fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
          color: disabled ? 'var(--text-disabled)' : 'var(--text-body)',
        }}>{label}</span>
      ) : null}
    </span>
  );
}
