import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../components/core/Icon';
import {
  MOCK_PREVIEW_ROWS,
  PREVIEW_COLUMNS,
  type BulkUpdatePatch,
  type QueryPreviewRow,
} from '../data/dynamicQuery';
import { BulkUpdateModal } from './BulkUpdateModal';

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
  const [minimized, setMinimized] = useState(false);
  const [rows, setRows] = useState<QueryPreviewRow[]>(() => MOCK_PREVIEW_ROWS.map((r) => ({ ...r })));
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(MOCK_PREVIEW_ROWS.map((r) => [r.id, true])),
  );
  const [bulkOpen, setBulkOpen] = useState(false);

  const handleBulkSave = (patch: BulkUpdatePatch) => {
    if (Object.keys(patch).length === 0) return;
    setRows((prev) => prev.map((r) => (selected[r.id] ? { ...r, ...patch } : r)));
  };

  const allSelected = rows.length > 0 && rows.every((r) => selected[r.id]);
  const toggleAll = () => {
    if (allSelected) {
      setSelected({});
    } else {
      setSelected(Object.fromEntries(rows.map((r) => [r.id, true])));
    }
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
      aria-label="Quick Search"
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
          Quick Search
        </h2>
        <button type="button" title={minimized ? 'Restore' : 'Minimize'} aria-label={minimized ? 'Restore' : 'Minimize'}
          onClick={() => setMinimized((m) => !m)} style={headerBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button type="button" title="Close" aria-label="Close" onClick={onClose} style={headerBtn}>
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
              Query Preview
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
                  <ToolIconButton label="Locate on map" bg="var(--blue-500)">
                    <Icon name="map-pin" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label="Layers" bg="var(--amber-500)">
                    <Icon name="map-layers" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label="Delete selected" bg="var(--red-500)" onClick={handleDeleteSelected}>
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
                    {PREVIEW_COLUMNS.length} columns shown
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <ToolIconButton label="Export" bg="var(--green-500)">
                    <Icon name="section-network" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label="Print" bg="var(--green-500)">
                    <Icon name="map-print" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label="Bulk Update" bg="var(--green-500)" onClick={() => setBulkOpen(true)}>
                    <Icon name="section-basic-info" size={16} style={{ filter: 'brightness(10)' }} />
                  </ToolIconButton>
                  <ToolIconButton label="Stop" bg="var(--blue-500)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                      <rect x="6" y="6" width="12" height="12" rx="1" />
                    </svg>
                  </ToolIconButton>
                </div>
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
                        <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
                      </th>
                      {PREVIEW_COLUMNS.map((col) => (
                        <th key={col.key} style={{
                          padding: '8px 10px',
                          textAlign: 'left',
                          borderBottom: '1px solid var(--border-panel)',
                          color: 'var(--text-heading)',
                          fontWeight: 'var(--weight-semibold)',
                          whiteSpace: 'nowrap',
                        }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {col.label}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2" aria-hidden="true">
                              <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                            </svg>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2" aria-hidden="true">
                              <path d="M4 6h16M7 12h10M10 18h4" />
                            </svg>
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.id} style={{ background: i % 2 === 0 ? 'var(--surface-page)' : 'var(--blue-100)' }}>
                        <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--border-panel)' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(selected[row.id])}
                            onChange={() => setSelected((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}
                            aria-label={`Select ${row.digitalAddress}`}
                          />
                        </td>
                        {PREVIEW_COLUMNS.map((col) => (
                          <td key={col.key} style={{
                            padding: '7px 10px',
                            borderBottom: '1px solid var(--border-panel)',
                            color: 'var(--navy-700)',
                            whiteSpace: 'nowrap',
                          }}>
                            {row[col.key]}
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
