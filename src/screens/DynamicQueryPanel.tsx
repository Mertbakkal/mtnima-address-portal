import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../components/core/Icon';
import {
  MOCK_PREVIEW_ROWS,
  PREVIEW_COLUMNS,
  type BulkUpdatePatch,
  type PreviewColumnKey,
  type QueryPreviewRow,
} from '../data/dynamicQuery';
import { BulkUpdateModal } from './BulkUpdateModal';
import { useI18n } from '../i18n/LocaleProvider';
import { catalogLabel } from '../i18n/messages';

const VALUE_COLUMNS = new Set<PreviewColumnKey>(['buildingType', 'useType', 'namingStatus', 'validationStatus']);

export interface DynamicQueryPanelProps {
  onClose: () => void;
}

function ToolIconButton({
  label,
  bg,
  onClick,
  children,
}: {
  label: string;
  bg: string;
  onClick?: () => void;
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
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        background: bg,
        opacity: hover ? 0.88 : 1,
        cursor: onClick ? 'pointer' : 'default',
        color: '#fff',
        padding: 0,
        flex: '0 0 auto',
      }}
    >
      {children}
    </button>
  );
}

export function DynamicQueryPanel({ onClose }: DynamicQueryPanelProps) {
  const { m } = useI18n();
  const columnLabels: Record<PreviewColumnKey, string> = {
    digitalAddress: m.query.digitalAddress,
    streetName: m.query.streetName,
    streetCode: m.query.streetCode,
    wilaya: m.query.wilaya,
    moughataa: m.query.moughataa,
    commune: m.query.commune,
    buildingType: m.query.buildingType,
    useType: m.query.useType,
    namingStatus: m.query.namingStatus,
    validationStatus: m.query.validationStatus,
    postalCode: m.query.postalCode,
    recordDate: m.query.recordDate,
  };
  const [minimized, setMinimized] = useState(false);
  const [rows, setRows] = useState<QueryPreviewRow[]>(() => MOCK_PREVIEW_ROWS.map((r) => ({ ...r })));
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MOCK_PREVIEW_ROWS.map((r) => [r.id, true])),
  );
  const [bulkOpen, setBulkOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<Partial<Record<PreviewColumnKey, string>>>({});
  const [openFilter, setOpenFilter] = useState<PreviewColumnKey | null>(null);

  const cellText = (row: QueryPreviewRow, key: PreviewColumnKey) => {
    const raw = row[key];
    return VALUE_COLUMNS.has(key) ? catalogLabel(m.catalog, raw) : raw;
  };

  const visibleRows = rows.filter((row) => {
    const query = search.trim().toLowerCase();
    if (query && !PREVIEW_COLUMNS.some((col) => cellText(row, col.key).toLowerCase().includes(query))) {
      return false;
    }
    return PREVIEW_COLUMNS.every((col) => {
      const filter = (columnFilters[col.key] ?? '').trim().toLowerCase();
      return !filter || cellText(row, col.key).toLowerCase().includes(filter);
    });
  });

  const clearFilters = () => {
    setSearch('');
    setColumnFilters({});
    setOpenFilter(null);
  };

  const handleBulkSave = (patch: BulkUpdatePatch) => {
    if (Object.keys(patch).length === 0) return;
    setRows((prev) => prev.map((r) => (selected[r.id] ? { ...r, ...patch } : r)));
  };

  const allSelected = visibleRows.length > 0 && visibleRows.every((r) => selected[r.id]);
  const toggleAll = () => {
    if (visibleRows.length === 0) return;
    setSelected((prev) => {
      const next = { ...prev };
      if (allSelected) {
        visibleRows.forEach((row) => { delete next[row.id]; });
      } else {
        visibleRows.forEach((row) => { next[row.id] = true; });
      }
      return next;
    });
  };

  const handleDeleteSelected = () => {
    setRows((prev) => prev.filter((r) => !selected[r.id]));
    setSelected({});
  };

  const headerBtn: CSSProperties = {
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
  };

  return (
    <div
      role="dialog"
      aria-label={m.query.title}
      style={{
        width: minimized ? 360 : '100%',
        height: minimized ? 'auto' : '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-page)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-panel)',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: '12px 14px',
        background: 'var(--surface-accent)',
        color: 'var(--text-on-accent)',
        flex: '0 0 auto',
      }}>
        <h2 style={{
          margin: 0,
          flex: 1,
          minWidth: 0,
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--weight-semibold)',
          lineHeight: 'var(--leading-snug)',
          color: 'var(--text-on-accent)',
        }}>
          {m.query.title}
        </h2>
        <button type="button" title={minimized ? m.common.restore : m.common.minimize} aria-label={minimized ? m.common.restore : m.common.minimize}
          onClick={() => setMinimized((m) => !m)} style={headerBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button type="button" title={m.common.close} aria-label={m.common.close} onClick={onClose} style={headerBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      {!minimized && (
        <div style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowY: 'scroll',
          overflowX: 'hidden',
          padding: 'var(--space-5) var(--space-6)',
          WebkitOverflowScrolling: 'touch',
        }}>
          <div style={{
            border: '1px solid var(--border-panel)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--surface-page)',
            minWidth: 0,
          }}>
            <div style={{
              padding: '10px 14px',
              background: 'var(--surface-tint-weak)',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--green-700)',
            }}>
              {m.query.preview}
            </div>
            <div style={{ padding: 'var(--space-5) var(--space-6)', minWidth: 0, overflow: 'hidden' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
                marginBottom: 'var(--space-4)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <ToolIconButton label={m.query.locate} bg="var(--blue-500)">
                    <Icon name="map-pin" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label={m.query.layers} bg="var(--amber-500)">
                    <Icon name="map-layers" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label={m.query.deleteSelected} bg="var(--red-500)" onClick={handleDeleteSelected}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true">
                      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                    </svg>
                  </ToolIconButton>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-body)',
                    border: '1px solid var(--border-field)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 10px',
                    background: 'var(--surface-page)',
                  }}>
                    {m.query.columnsShown(PREVIEW_COLUMNS.length)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <ToolIconButton label={m.query.export} bg="var(--green-500)">
                    <Icon name="section-network" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label={m.query.print} bg="var(--green-500)">
                    <Icon name="map-print" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label={m.query.bulkUpdate} bg="var(--green-500)" onClick={() => setBulkOpen(true)}>
                    <Icon name="section-basic-info" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label={m.query.stop} bg="var(--blue-500)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <rect x="6" y="6" width="12" height="12" rx="1" />
                    </svg>
                  </ToolIconButton>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 10,
                marginBottom: 'var(--space-4)',
              }}>
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    height: 34,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '0 12px',
                    borderRadius: 8,
                    border: '1px solid var(--cyan-400)',
                    background: 'var(--surface-page)',
                    color: 'var(--cyan-700)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
                    <path d="M5 19L19 5" />
                  </svg>
                  {m.common.clear}
                </button>
                <label style={{ position: 'relative', display: 'block' }}>
                  <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{m.common.search}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2" aria-hidden="true" style={{ position: 'absolute', left: 10, top: 10 }}>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={m.common.search}
                    aria-label={m.common.search}
                    style={{
                      height: 34,
                      width: 220,
                      padding: '0 12px 0 32px',
                      borderRadius: 8,
                      border: '1px solid var(--border-field)',
                      background: 'var(--surface-page)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: 13,
                      color: 'var(--text-body)',
                      outline: 'none',
                    }}
                  />
                </label>
              </div>

              <div style={{
                width: '100%',
                maxWidth: '100%',
                overflowX: 'auto',
                border: '1px solid var(--border-panel)',
                borderRadius: 'var(--radius-md)',
                WebkitOverflowScrolling: 'touch',
              }}>
                <table style={{
                  width: 'max-content',
                  minWidth: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-xs)',
                }}>
                  <thead>
                    <tr style={{ background: 'var(--gray-100)' }}>
                      <th style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '1px solid var(--border-panel)', width: 36 }}>
                        <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label={m.query.selectAll} />
                      </th>
                      {PREVIEW_COLUMNS.map((col) => {
                        const filterValue = columnFilters[col.key] ?? '';
                        const filterOpen = openFilter === col.key || filterValue.length > 0;
                        const active = filterValue.trim().length > 0;
                        return (
                          <th key={col.key} style={{
                            padding: '8px 10px',
                            textAlign: 'left',
                            borderBottom: '1px solid var(--border-panel)',
                            color: 'var(--text-heading)',
                            fontWeight: 'var(--weight-semibold)',
                            whiteSpace: 'nowrap',
                            verticalAlign: 'top',
                          }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              {columnLabels[col.key]}
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2" aria-hidden="true">
                                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                              </svg>
                              <button
                                type="button"
                                title={m.query.filterColumn(columnLabels[col.key])}
                                aria-label={m.query.filterColumn(columnLabels[col.key])}
                                aria-expanded={filterOpen}
                                onClick={() => setOpenFilter((current) => current === col.key ? null : col.key)}
                                style={{
                                  width: 18,
                                  height: 18,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: 'none',
                                  padding: 0,
                                  background: 'transparent',
                                  cursor: 'pointer',
                                  color: active ? 'var(--cyan-700)' : 'var(--gray-500)',
                                }}
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                  <path d="M4 6h16l-6 7v6l-4 2v-8L4 6z" />
                                </svg>
                              </button>
                            </span>
                            {filterOpen && (
                              <input
                                value={filterValue}
                                autoFocus={openFilter === col.key}
                                onChange={(event) => setColumnFilters((prev) => ({ ...prev, [col.key]: event.target.value }))}
                                placeholder={m.common.search}
                                aria-label={m.query.filterColumn(columnLabels[col.key])}
                                style={{
                                  display: 'block',
                                  marginTop: 6,
                                  width: '100%',
                                  minWidth: 110,
                                  height: 26,
                                  padding: '0 8px',
                                  borderRadius: 6,
                                  border: '1px solid var(--border-field)',
                                  fontFamily: 'var(--font-ui)',
                                  fontSize: 12,
                                  fontWeight: 400,
                                  color: 'var(--text-body)',
                                  outline: 'none',
                                }}
                              />
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={PREVIEW_COLUMNS.length + 1}
                          style={{ padding: '16px 10px', textAlign: 'center', color: 'var(--text-muted)' }}
                        >
                          {m.query.noResults}
                        </td>
                      </tr>
                    ) : visibleRows.map((row, i) => (
                      <tr key={row.id} style={{ background: i % 2 === 0 ? 'var(--surface-page)' : 'var(--blue-100)' }}>
                        <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--border-panel)' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(selected[row.id])}
                            onChange={() => setSelected((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}
                            aria-label={m.query.selectRow(row.digitalAddress)}
                          />
                        </td>
                        {PREVIEW_COLUMNS.map((col) => (
                          <td key={col.key} style={{
                            padding: '7px 10px',
                            borderBottom: '1px solid var(--border-panel)',
                            color: 'var(--navy-700)',
                            whiteSpace: 'nowrap',
                          }}>
                            {cellText(row, col.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {bulkOpen && (
        <div style={{
          position: 'fixed',
          top: 100,
          left: 40,
          zIndex: 740,
          pointerEvents: 'auto',
        }}>
          <BulkUpdateModal
            onClose={() => setBulkOpen(false)}
            onSave={handleBulkSave}
          />
        </div>
      )}
    </div>
  );
}
