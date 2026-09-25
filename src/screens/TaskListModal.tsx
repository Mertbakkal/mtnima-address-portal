import { useMemo, useState, type ReactNode } from 'react';
import { Button } from '../components/core/Button';
import { Input } from '../components/forms/Input';
import { createMission, SEED_MISSIONS, type TaskMission } from '../data/taskMissions';
import type { MapFocus } from '../data/hierarchySearch';
import { TaskDetailsWizard, type DutyPlaceMode } from './TaskDetailsWizard';

export interface TaskListModalProps {
  onClose: () => void;
  onDutyModeChange?: (mode: DutyPlaceMode) => void;
  dutyPolygon?: [number, number][] | null;
  onClearPolygon?: () => void;
  onHierarchyFocus?: (focus: MapFocus) => void;
  mapDrawMode?: boolean;
}

type SortKey = 'name' | 'createdAt';
type SortDir = 'asc' | 'desc';

type EditSession =
  | { mode: 'edit'; mission: TaskMission }
  | { mode: 'new' }
  | null;

function ActionCircle({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28,
        height: 28,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: '1.5px solid var(--cyan-400)',
        background: hover ? 'var(--surface-tint)' : 'var(--surface-page)',
        cursor: 'pointer',
        padding: 0,
        color: 'var(--text-accent)',
        transition: 'var(--transition-control)',
      }}
    >
      {children}
    </button>
  );
}

function SortFilterIcons() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2" aria-hidden="true">
        <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
      </svg>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2" aria-hidden="true">
        <path d="M4 6h16M7 12h10M10 18h4" />
      </svg>
    </span>
  );
}

export function TaskListModal({
  onClose,
  onDutyModeChange,
  dutyPolygon = null,
  onClearPolygon,
  onHierarchyFocus,
  mapDrawMode = false,
}: TaskListModalProps) {
  const [missions, setMissions] = useState<TaskMission[]>(() => [...SEED_MISSIONS]);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [session, setSession] = useState<EditSession>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = missions;
    if (q) {
      rows = rows.filter((m) => m.name.toLowerCase().includes(q) || m.createdAt.includes(q));
    }
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = av.localeCompare(bv, undefined, { sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [missions, query, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);
  const from = filtered.length === 0 ? 0 : start + 1;
  const to = Math.min(start + pageSize, filtered.length);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const closeDetails = () => {
    setSession(null);
    onDutyModeChange?.('hierarchical');
    onClearPolygon?.();
  };

  const handleEdit = (mission: TaskMission) => {
    setSession({ mode: 'edit', mission });
    onDutyModeChange?.('hierarchical');
    onClearPolygon?.();
  };

  const handleNewMission = () => {
    setSession({ mode: 'new' });
    onDutyModeChange?.('hierarchical');
    onClearPolygon?.();
  };

  const handleDelete = (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    if (session?.mode === 'edit' && session.mission.id === id) closeDetails();
  };

  const handleSave = (payload: { id: string | null; name: string }) => {
    if (payload.id) {
      setMissions((prev) => prev.map((m) => (m.id === payload.id ? { ...m, name: payload.name } : m)));
    } else {
      const created = createMission(missions.length);
      setMissions((prev) => [{ ...created, name: payload.name }, ...prev]);
      setPage(0);
    }
    closeDetails();
  };

  const showDetails = session !== null;
  const shellWidth = mapDrawMode
    ? 'min(440px, calc(100vw - 48px))'
    : showDetails
      ? 'min(1100px, calc(100vw - 48px))'
      : 'min(720px, calc(100vw - 48px))';

  return (
    <div
      role="dialog"
      aria-label="Task Management"
      style={{
        width: shellWidth,
        maxHeight: 'calc(100vh - 100px)',
        height: showDetails ? 'min(640px, calc(100vh - 100px))' : undefined,
        background: 'var(--surface-page)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-panel)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: '12px 14px',
          background: 'var(--surface-accent)',
          color: 'var(--text-on-accent)',
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            margin: 0,
            flex: 1,
            minWidth: 0,
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--weight-semibold)',
            lineHeight: 'var(--leading-snug)',
            color: 'var(--text-on-accent)',
          }}
        >
          Task Management
        </h2>
        <button
          type="button"
          title="Close"
          aria-label="Close"
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            padding: 0,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            background: 'transparent',
            color: 'var(--text-on-accent)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {!mapDrawMode && (
        <div style={{ flex: 1, minWidth: 0, padding: '16px 18px 12px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <h3
              style={{
                margin: 0,
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-heading)',
              }}
            >
              Task List
            </h3>
            <Button variant="success" size="sm" onClick={handleNewMission}>
              + New Mission
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" size="sm" onClick={() => { setQuery(''); setPage(0); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Clear
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 200 }}>
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(0); }}
                placeholder="Search"
                aria-label="Search"
                style={{ flex: 1 }}
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--icon-default)" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="M15.5 15.5 21 21" />
              </svg>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              border: '1px solid var(--border-panel)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <thead>
                <tr style={{ background: 'var(--gray-100)' }}>
                  <th style={{ padding: '8px 10px', width: 72, borderBottom: '1px solid var(--border-panel)' }} aria-label="Actions" />
                  <th
                    style={{
                      padding: '8px 10px',
                      textAlign: 'left',
                      borderBottom: '1px solid var(--border-panel)',
                      color: 'var(--text-heading)',
                      fontWeight: 'var(--weight-semibold)',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    onClick={() => toggleSort('name')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Task
                      <SortFilterIcons />
                    </span>
                  </th>
                  <th
                    style={{
                      padding: '8px 10px',
                      textAlign: 'left',
                      borderBottom: '1px solid var(--border-panel)',
                      color: 'var(--text-heading)',
                      fontWeight: 'var(--weight-semibold)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => toggleSort('createdAt')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Creation Date
                      <SortFilterIcons />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--gray-500)' }}>
                      No missions found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row, i) => (
                    <tr key={row.id} style={{ background: i % 2 === 0 ? 'var(--surface-page)' : 'var(--blue-100)' }}>
                      <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--border-panel)' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <ActionCircle label={`Edit ${row.name}`} onClick={() => handleEdit(row)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                          </ActionCircle>
                          <ActionCircle label={`Delete ${row.name}`} onClick={() => handleDelete(row.id)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6M14 11v6" />
                            </svg>
                          </ActionCircle>
                        </div>
                      </td>
                      <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--border-panel)', color: 'var(--navy-700)' }}>
                        {row.name}
                      </td>
                      <td
                        style={{
                          padding: '7px 10px',
                          borderBottom: '1px solid var(--border-panel)',
                          color: 'var(--navy-700)',
                          fontFamily: 'var(--font-mono)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {row.createdAt}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              paddingTop: 4,
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-xs)',
              color: 'var(--navy-700)',
            }}
          >
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
              style={{
                height: 28,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-field)',
                background: 'var(--surface-page)',
                padding: '0 6px',
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-xs)',
              }}
            >
              {[5, 10, 20].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PageNavButton label="First page" disabled={safePage === 0} onClick={() => setPage(0)}>«</PageNavButton>
              <PageNavButton label="Previous page" disabled={safePage === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>‹</PageNavButton>
              <PageNavButton label="Next page" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>›</PageNavButton>
              <PageNavButton label="Last page" disabled={safePage >= pageCount - 1} onClick={() => setPage(pageCount - 1)}>»</PageNavButton>
            </div>
            <span>
              {from} to {to} of {filtered.length}
            </span>
          </div>
        </div>
        )}

        {showDetails && (
          <TaskDetailsWizard
            key={session.mode === 'edit' ? session.mission.id : 'new'}
            mission={session.mode === 'edit' ? session.mission : null}
            isNew={session.mode === 'new'}
            onClose={closeDetails}
            onSave={handleSave}
            onDutyModeChange={(mode) => onDutyModeChange?.(mode)}
            onHierarchyFocus={(focus) => onHierarchyFocus?.(focus)}
            dutyPolygon={dutyPolygon}
            onClearPolygon={() => onClearPolygon?.()}
          />
        )}
      </div>
    </div>
  );
}

function PageNavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-field)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface-page)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        color: 'var(--navy-700)',
        fontSize: 14,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}
