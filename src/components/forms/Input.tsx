import { useState, type CSSProperties, type InputHTMLAttributes } from 'react';

const fieldStyle = (o: CSSProperties = {}): CSSProperties => ({
  fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-body)',
  height: 'var(--control-height-md)', width: '100%', minWidth: 0,
  padding: '0 var(--space-5)', borderRadius: 'var(--radius-sm)',
  borderWidth: 'var(--border-hairline)', borderStyle: 'solid', borderColor: 'var(--border-field)',
  background: 'var(--surface-page)', boxShadow: 'var(--shadow-inset-field)',
  transition: 'var(--transition-control)', outline: 'none', ...o,
});

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> {
  invalid?: boolean;
  mono?: boolean;
  style?: CSSProperties;
}

export function Input({ disabled = false, invalid = false, mono = false, style, ...rest }: InputProps) {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <input
      disabled={disabled}
      aria-invalid={invalid || undefined}
      onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={fieldStyle({
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
        ...(hover && !disabled ? { borderColor: 'var(--border-field-hover)' } : null),
        ...(focus ? { borderColor: 'var(--border-field-focus)', borderWidth: 'var(--border-strong)', padding: '0 9px', boxShadow: 'var(--focus-ring)' } : null),
        ...(invalid ? { borderColor: 'var(--red-500)', boxShadow: focus ? 'var(--focus-ring-danger)' : 'var(--shadow-inset-field)' } : null),
        ...(disabled ? { background: 'var(--gray-100)', color: 'var(--text-disabled)', cursor: 'not-allowed' } : null),
        ...style,
      })}
      {...rest}
    />
  );
}
