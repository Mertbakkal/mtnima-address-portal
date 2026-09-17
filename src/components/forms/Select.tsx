import { useState, type CSSProperties, type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'style'> {
  options?: (string | SelectOption)[];
  placeholder?: string | null;
  readOnlyLook?: boolean;
  style?: CSSProperties;
}

export function Select({
  options = [], placeholder = 'Select...', disabled = false, readOnlyLook = false, style, ...rest
}: SelectProps) {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%', minWidth: 0 }}>
      <select
        disabled={disabled}
        onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
        onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          appearance: 'none', WebkitAppearance: 'none', width: '100%',
          height: 'var(--control-height-md)', padding: '0 26px 0 var(--space-5)',
          fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)',
          color: disabled ? 'var(--text-disabled)' : 'var(--text-body)',
          background: disabled || readOnlyLook ? 'var(--surface-sunken)' : 'var(--surface-page)',
          border: '1px solid var(--border-field)', borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-inset-field)', outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'var(--transition-control)',
          ...(hover && !disabled ? { borderColor: 'var(--border-field-hover)' } : null),
          ...(focus ? { borderColor: 'var(--border-field-focus)', boxShadow: 'var(--focus-ring)' } : null),
          ...style,
        }}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
      <span aria-hidden="true" style={{
        position: 'absolute', top: '50%', right: '9px', transform: 'translateY(-60%) rotate(45deg)',
        width: '6px', height: '6px', borderRight: '1.5px solid var(--gray-500)',
        borderBottom: '1.5px solid var(--gray-500)', pointerEvents: 'none',
      }} />
    </div>
  );
}
