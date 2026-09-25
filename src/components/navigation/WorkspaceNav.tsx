import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export interface WorkspaceNavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  dropdown?: { id: string; label: string; icon?: ReactNode }[];
}

export interface WorkspaceNavProps {
  items: WorkspaceNavItem[];
  activeId?: string | null;
  dropdownValue?: string | null;
  onSelect?: (id: string) => void;
  onDropdownSelect?: (itemId: string, optionId: string) => void;
  ariaLabel?: string;
  style?: CSSProperties;
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--cyan-500)" aria-hidden="true">
      <circle cx="4" cy="4" r="2" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="4" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: up ? 'rotate(180deg)' : undefined, transition: 'transform var(--duration-fast) var(--ease-standard)' }}
    >
      <path d="M2 3.5L5 6.5L8 3.5" />
    </svg>
  );
}

export function WorkspaceNav({
  items,
  activeId = null,
  dropdownValue = null,
  onSelect,
  onDropdownSelect,
  ariaLabel = 'Workspace',
  style,
}: WorkspaceNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...style }}>
      {!collapsed && (
        <nav
          aria-label={ariaLabel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '10px 18px',
            background: 'var(--surface-page)',
            borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
            boxShadow: 'var(--shadow-md)',
            maxWidth: 'calc(100vw - 48px)',
            overflow: 'visible',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {items.map((item) => {
            const hasDropdown = Boolean(item.dropdown?.length);
            const active = activeId === item.id || (hasDropdown && item.dropdown!.some((o) => o.id === dropdownValue));
            const menuOpen = openMenu === item.id;
            return (
              <div key={item.id} style={{ position: 'relative', flex: '0 0 auto' }}>
                <button
                  type="button"
                  aria-haspopup={hasDropdown ? 'menu' : undefined}
                  aria-expanded={hasDropdown ? menuOpen : undefined}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => {
                    if (hasDropdown) {
                      setOpenMenu((cur) => (cur === item.id ? null : item.id));
                      onSelect?.(item.id);
                      return;
                    }
                    setOpenMenu(null);
                    onSelect?.(item.id);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    height: 36,
                    padding: '0 12px',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    background: active || menuOpen ? 'var(--surface-tint-weak)' : 'transparent',
                    color: 'var(--text-body)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition-control)',
                  }}
                >
                  <span style={{ display: 'flex', flex: '0 0 auto' }}>{item.icon ?? <DotsIcon />}</span>
                  <span>{item.label}</span>
                  {hasDropdown ? (
                    <span style={{ color: 'var(--text-muted)', display: 'flex' }}>
                      <Chevron up={menuOpen} />
                    </span>
                  ) : null}
                </button>

                {hasDropdown && menuOpen && (
                  <div
                    role="menu"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      minWidth: 220,
                      padding: 6,
                      background: 'var(--surface-page)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-panel)',
                      border: '1px solid var(--border-panel)',
                      zIndex: 20,
                    }}
                  >
                    {item.dropdown!.map((opt) => {
                      const on = dropdownValue === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            onDropdownSelect?.(item.id, opt.id);
                            setOpenMenu(null);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 12px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            background: on ? 'var(--surface-tint)' : 'transparent',
                            color: 'var(--text-body)',
                            fontFamily: 'var(--font-ui)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          {opt.icon}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      )}

      <button
        type="button"
        title={collapsed ? 'Show menu' : 'Hide menu'}
        aria-label={collapsed ? 'Show menu' : 'Hide menu'}
        aria-expanded={!collapsed}
        onClick={() => { setCollapsed((c) => !c); setOpenMenu(null); }}
        style={{
          width: 44,
          height: 18,
          marginTop: collapsed ? 0 : -1,
          border: 'none',
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          background: 'var(--cyan-500)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          zIndex: 0,
        }}
      >
        <Chevron up={!collapsed} />
      </button>
    </div>
  );
}

export { DotsIcon };
