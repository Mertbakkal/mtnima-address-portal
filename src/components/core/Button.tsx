import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'warning' | 'danger' | 'success' | 'info';
type Size = 'sm' | 'md' | 'lg';

const base: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)',
  fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-semibold)', lineHeight: 1,
  borderRadius: 'var(--radius-md)', borderStyle: 'solid', borderWidth: 'var(--border-hairline)',
  cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none',
  transition: 'var(--transition-control)',
};

const sizes: Record<Size, CSSProperties> = {
  sm: { height: 'var(--control-height-sm)', padding: '0 var(--space-5)', fontSize: 'var(--text-xs)' },
  md: { height: 'var(--control-height-md)', padding: '0 var(--space-7)', fontSize: 'var(--text-sm)' },
  lg: { height: 'var(--control-height-lg)', padding: '0 var(--space-8)', fontSize: 'var(--text-md)' },
};

const variants: Record<Variant, { rest: CSSProperties; hover: CSSProperties; active: CSSProperties }> = {
  primary: {
    rest: { background: 'var(--surface-accent)', color: 'var(--text-on-accent)', borderColor: 'var(--surface-accent)' },
    hover: { background: 'var(--surface-accent-hover)', borderColor: 'var(--surface-accent-hover)' },
    active: { background: 'var(--surface-accent-press)', borderColor: 'var(--surface-accent-press)' },
  },
  secondary: {
    rest: { background: 'var(--surface-page)', color: 'var(--text-accent)', borderColor: 'var(--border-field)' },
    hover: { background: 'var(--surface-tint-weak)', borderColor: 'var(--cyan-400)' },
    active: { background: 'var(--surface-tint)', borderColor: 'var(--cyan-500)' },
  },
  ghost: {
    rest: { background: 'transparent', color: 'var(--text-accent)', borderColor: 'transparent' },
    hover: { background: 'var(--surface-tint-weak)' },
    active: { background: 'var(--surface-tint)' },
  },
  warning: {
    rest: { background: 'var(--status-pending-solid)', color: 'var(--text-on-accent)', borderColor: 'var(--status-pending-solid)' },
    hover: { background: 'var(--amber-700)', borderColor: 'var(--amber-700)' },
    active: { background: 'var(--amber-700)', borderColor: 'var(--amber-700)' },
  },
  danger: {
    rest: { background: 'var(--surface-page)', color: 'var(--status-danger-fg)', borderColor: 'var(--red-500)' },
    hover: { background: 'var(--status-danger-bg)' },
    active: { background: 'var(--status-danger-bg)', borderColor: 'var(--red-700)' },
  },
  success: {
    rest: { background: 'var(--status-success-solid)', color: 'var(--text-on-accent)', borderColor: 'var(--status-success-solid)' },
    hover: { background: 'var(--green-700)', borderColor: 'var(--green-700)' },
    active: { background: 'var(--green-700)', borderColor: 'var(--green-700)' },
  },
  info: {
    rest: { background: 'var(--status-info-solid)', color: 'var(--text-on-accent)', borderColor: 'var(--status-info-solid)' },
    hover: { background: 'var(--blue-700)', borderColor: 'var(--blue-700)' },
    active: { background: 'var(--blue-700)', borderColor: 'var(--blue-700)' },
  },
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'style'> {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  disabled?: boolean;
  block?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
}

export function Button({
  children, variant = 'primary', size = 'md', icon, iconAfter, disabled = false,
  block = false, type = 'button', onClick, style, ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const v = variants[variant] || variants.primary;
  const st: CSSProperties = {
    ...base, ...sizes[size], ...v.rest,
    ...(disabled ? {} : hover ? v.hover : null),
    ...(disabled || !press ? {} : v.active),
    ...(block ? { display: 'flex', width: '100%' } : null),
    ...(disabled ? { background: 'var(--gray-100)', color: 'var(--text-disabled)', borderColor: 'var(--gray-200)', cursor: 'not-allowed' } : null),
    ...style,
  };
  return (
    <button
      type={type} disabled={disabled} onClick={disabled ? undefined : onClick} style={st}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
      {...rest}
    >
      {icon}{children}{iconAfter}
    </button>
  );
}
