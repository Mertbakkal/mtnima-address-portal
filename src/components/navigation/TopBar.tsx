import type { CSSProperties, ReactNode } from 'react';

export interface TopBarProps {
  children?: ReactNode;
  actions?: ReactNode;
  navLabel?: string;
  style?: CSSProperties;
}

export function TopBar({ children, actions, navLabel = 'Modules', style }: TopBarProps) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 'var(--space-8)', height: 'var(--topbar-height)',
      padding: '0 var(--space-8)', background: 'var(--surface-page)',
      borderBottom: '1px solid var(--border-panel)', ...style,
    }}>
      <nav aria-label={navLabel} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', minWidth: 0 }}>
        {children}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: '0 0 auto' }}>
        {actions}
      </div>
    </header>
  );
}
