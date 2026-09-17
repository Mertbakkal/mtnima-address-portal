import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

export interface ModuleTabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  icon?: ReactNode;
  children?: ReactNode;
  active?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  style?: CSSProperties;
}

export function ModuleTab({ icon, children, active = false, expandable = false, expanded = false, onClick, style, ...rest }: ModuleTabProps) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" aria-current={active ? 'page' : undefined} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-5)',
        height: active ? '46px' : '36px', padding: active ? '0 var(--space-8)' : '0 var(--space-6)',
        border: 'none', borderRadius: active ? 'var(--radius-xl)' : 'var(--radius-md)',
        background: active ? 'var(--surface-accent)' : hover ? 'var(--surface-tint-weak)' : 'transparent',
        color: active ? 'var(--text-on-accent)' : 'var(--text-body)',
        fontFamily: 'var(--font-ui)', fontSize: 'var(--text-md)',
        fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition-control)', ...style,
      }} {...rest}>
      {icon}
      <span>{children}</span>
      {expandable ? (
        <span aria-hidden="true" style={{
          width: '7px', height: '7px', marginLeft: 'var(--space-2)',
          borderRight: '2px solid currentColor', borderBottom: '2px solid currentColor',
          transform: expanded ? 'rotate(-135deg) translate(-1px,-1px)' : 'rotate(45deg)',
          transition: 'transform var(--duration-fast) var(--ease-standard)',
        }} />
      ) : null}
    </button>
  );
}
