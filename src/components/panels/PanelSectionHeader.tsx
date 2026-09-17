import type { CSSProperties, ReactNode } from 'react';

export interface PanelSectionHeaderProps {
  icon?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  style?: CSSProperties;
}

export function PanelSectionHeader({ icon, children, action, style }: PanelSectionHeaderProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-5)',
      minHeight: '34px', padding: 'var(--space-3) var(--space-6)',
      background: 'var(--surface-tint)', borderRadius: 'var(--radius-md)',
      margin: 'var(--space-6) 0 var(--space-4)', ...style,
    }}>
      {icon}
      <h3 style={{
        margin: 0, flex: 1, minWidth: 0, fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)',
        color: 'var(--text-heading)', lineHeight: 'var(--leading-snug)',
      }}>{children}</h3>
      {action}
    </div>
  );
}
