import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

type Shape = 'rail' | 'square' | 'round';
type Tone = 'tint' | 'solid' | 'plain';

const shapes: Record<Shape, { size: string; radius: string }> = {
  rail: { size: 'var(--maptool-button-size)', radius: 'var(--radius-lg)' },
  square: { size: '32px', radius: 'var(--radius-md)' },
  round: { size: '32px', radius: 'var(--radius-full)' },
};

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  icon: ReactNode;
  label: string;
  shape?: Shape;
  tone?: Tone;
  active?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

export function IconButton({
  icon, label, shape = 'square', tone = 'tint', active = false, disabled = false, onClick, style, ...rest
}: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const s = shapes[shape] || shapes.square;
  const solid = tone === 'solid' || active;
  const st: CSSProperties = {
    width: s.size, height: s.size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: s.radius, borderWidth: 'var(--border-hairline)', borderStyle: 'solid',
    background: solid ? 'var(--surface-accent)' : tone === 'plain' ? 'transparent' : 'var(--surface-tint-weak)',
    borderColor: solid ? 'var(--surface-accent)' : tone === 'plain' ? 'transparent' : 'var(--cyan-100)',
    boxShadow: shape === 'rail' ? 'var(--shadow-sm)' : 'none',
    cursor: 'pointer', padding: 0, transition: 'var(--transition-control)',
    ...(hover && !disabled && !solid ? { background: 'var(--surface-tint)', borderColor: 'var(--cyan-300)' } : null),
    ...(hover && !disabled && solid ? { background: 'var(--surface-accent-hover)', borderColor: 'var(--surface-accent-hover)' } : null),
    ...(disabled ? { background: 'var(--gray-100)', borderColor: 'var(--gray-200)', cursor: 'not-allowed', opacity: 1 } : null),
    ...style,
  };
  return (
    <button
      type="button" title={label} aria-label={label} aria-pressed={active || undefined}
      disabled={disabled} onClick={disabled ? undefined : onClick} style={st}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...rest}
    >
      {icon}
    </button>
  );
}
