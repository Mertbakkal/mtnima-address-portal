import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Button } from '../components/core/Button';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { Textarea } from '../components/forms/Textarea';
import { Switch } from '../components/forms/Switch';
import {
  getCommuneNames,
  getMoughataaNames,
  getWilayaNames,
  resolveHierarchyFocus,
  type HierarchySelection,
  type MapFocus,
} from '../data/hierarchySearch';
import {
  TASK_USERS,
  WIZARD_TABLES,
  type TaskUser,
} from '../data/taskMissionWizard';
import type { TaskMission } from '../data/taskMissions';
import { useI18n } from '../i18n/LocaleProvider';
import { catalogLabel } from '../i18n/messages';

export type DutyPlaceMode = 'hierarchical' | 'polygon';

export interface TaskDetailsWizardProps {
  mission: TaskMission | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (payload: { id: string | null; name: string }) => void;
  onDutyModeChange: (mode: DutyPlaceMode) => void;
  onHierarchyFocus: (focus: MapFocus) => void;
  dutyPolygon: [number, number][] | null;
  onClearPolygon: () => void;
}

const STEPS = [
  { id: 0, label: 'Mission Information', icon: 'list' },
  { id: 1, label: 'Selection of Duty Place', icon: 'pin' },
  { id: 2, label: 'Table and Column Selection', icon: 'grid' },
  { id: 3, label: 'User Information', icon: 'users' },
] as const;

const EMPTY_HIER: HierarchySelection = { wilaya: '', moughataa: '', commune: '', street: '' };

function StepIcon({ kind, active }: { kind: string; active: boolean }) {
  const stroke = active ? '#fff' : 'var(--cyan-600)';
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (kind === 'list') {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    );
  }
  if (kind === 'pin') {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  if (kind === 'grid') {
    return (
      <svg {...common} aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  const { m } = useI18n();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 8px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--cyan-500)',
        color: '#fff',
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
      }}
    >
      {label}
      <button
        type="button"
        aria-label={m.common.remove(label)}
        onClick={onRemove}
        style={{
          border: 'none',
          background: 'transparent',
          color: '#fff',
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
          fontSize: 14,
        }}
      >
        ×
      </button>
    </span>
  );
}

export function TaskDetailsWizard({
  mission,
  isNew,
  onClose,
  onSave,
  onDutyModeChange,
  onHierarchyFocus,
  dutyPolygon,
  onClearPolygon,
}: TaskDetailsWizardProps) {
  const { m } = useI18n();
  const [step, setStep] = useState(0);
  const [taskName, setTaskName] = useState(mission?.name ?? '');
  const [dutyMode, setDutyMode] = useState<DutyPlaceMode>('hierarchical');
  const [hier, setHier] = useState<HierarchySelection>(EMPTY_HIER);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ road: true, point: false });
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [tableQuery, setTableQuery] = useState('');
  const [colQuery, setColQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<TaskUser[]>([]);

  const badge = taskName.trim() || (isNew ? m.tasks.newMissionBadge : mission?.name || m.tasks.mission);
  const stepLabels = [m.tasks.stepMission, m.tasks.stepDuty, m.tasks.stepColumns, m.tasks.stepUsers];
  const tableTitle = (id: string) => (id === 'road' ? m.tasks.tableRoad : m.tasks.tablePoint);

  const setDuty = (mode: DutyPlaceMode) => {
    setDutyMode(mode);
    onDutyModeChange(mode);
    if (mode === 'polygon') {
      onHierarchyFocus({ lat: 18.0895, lon: -15.9755, zoom: 13 });
    }
  };

  const setHierLevel = (level: keyof HierarchySelection, value: string) => {
    setHier((prev) => {
      let next: HierarchySelection;
      if (level === 'wilaya') next = { wilaya: value, moughataa: '', commune: '', street: '' };
      else if (level === 'moughataa') next = { ...prev, moughataa: value, commune: '', street: '' };
      else if (level === 'commune') next = { ...prev, commune: value, street: '' };
      else next = { ...prev, street: value };
      const focus = resolveHierarchyFocus(next);
      if (focus) onHierarchyFocus(focus);
      return next;
    });
  };

  const wilayas = getWilayaNames();
  const moughataas = hier.wilaya ? getMoughataaNames(hier.wilaya) : [];
  const communes = hier.wilaya && hier.moughataa ? getCommuneNames(hier.wilaya, hier.moughataa) : [];

  const filteredTables = useMemo(() => {
    const tq = tableQuery.trim().toLowerCase();
    const cq = colQuery.trim().toLowerCase();
    return WIZARD_TABLES.map((t) => {
      const label = (t.id === 'road' ? m.tasks.tableRoad : m.tasks.tablePoint).toLowerCase();
      return {
        ...t,
        columns: t.columns.filter((c) => {
          if (tq && !label.includes(tq) && !t.id.includes(tq) && !t.label.toLowerCase().includes(tq)) return false;
          if (cq && !c.name.toLowerCase().includes(cq)) return false;
          return true;
        }),
      };
    }).filter((t) => {
      const label = (t.id === 'road' ? m.tasks.tableRoad : m.tasks.tablePoint).toLowerCase();
      return !tq || label.includes(tq) || t.id.includes(tq) || t.label.toLowerCase().includes(tq) || t.columns.length > 0;
    });
  }, [tableQuery, colQuery, m]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return TASK_USERS;
    return TASK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q)
        || u.surname.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q),
    );
  }, [userQuery]);

  const toggleCol = (tableId: string, colId: string) => {
    const key = `${tableId}.${colId}`;
    setSelectedCols((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const toggleUser = (user: TaskUser) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user],
    );
  };

  const canNext = step === 0 ? taskName.trim().length > 0 : true;

  const goNext = () => {
    if (step < 3 && canNext) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSave = () => {
    onSave({ id: isNew ? null : mission?.id ?? null, name: taskName.trim() });
  };

  let body: ReactNode = null;

  if (step === 0) {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={sectionTitle}>{m.tasks.missionInfo}</h4>
        <label style={fieldLabel}>
          {m.tasks.taskName} <span style={{ color: 'var(--red-500)' }}>*</span>
        </label>
        <Textarea
          rows={4}
          maxLength={500}
          value={taskName}
          onChange={(e) => setTaskName(e.target.value.slice(0, 500))}
          placeholder={m.tasks.taskPlaceholder}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12, color: 'var(--gray-600)' }}>
          <span>{m.tasks.taskHint}</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{taskName.length}/500</span>
        </div>
      </div>
    );
  } else if (step === 1) {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h4 style={sectionTitle}>{m.tasks.dutyTitle}</h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: dutyMode === 'hierarchical' ? 'var(--text-accent)' : 'var(--gray-500)' }}>
            {m.tasks.hierarchical}
          </span>
          <Switch
            checked={dutyMode === 'polygon'}
            onChange={(on) => setDuty(on ? 'polygon' : 'hierarchical')}
            id="duty-place-mode"
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: dutyMode === 'polygon' ? 'var(--text-accent)' : 'var(--gray-500)' }}>
            {m.tasks.polygon}
          </span>
        </div>

        {dutyMode === 'hierarchical' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Select
              aria-label={m.address.wilaya}
              value={hier.wilaya || ''}
              onChange={(e) => setHierLevel('wilaya', e.target.value)}
              options={wilayas}
              placeholder={m.tasks.selectWilaya}
            />
            <Select
              aria-label={m.address.moughataa}
              value={hier.moughataa || ''}
              onChange={(e) => setHierLevel('moughataa', e.target.value)}
              options={moughataas}
              placeholder={m.tasks.selectMoughataa}
              disabled={!hier.wilaya}
            />
            <Select
              aria-label={m.address.commune}
              value={hier.commune || ''}
              onChange={(e) => setHierLevel('commune', e.target.value)}
              options={communes}
              placeholder={m.tasks.selectCommune}
              disabled={!hier.moughataa}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.4 }}>
              {m.tasks.polygonHelp}
            </p>
            {dutyPolygon && dutyPolygon.length >= 3 ? (
              <div style={{ fontSize: 12, color: 'var(--navy-700)' }}>
                {m.tasks.polygonSet(dutyPolygon.length)}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--amber-700)' }}>{m.tasks.drawing}</div>
            )}
            <Button variant="secondary" size="sm" onClick={onClearPolygon} disabled={!dutyPolygon}>
              {m.tasks.clearPolygon}
            </Button>
          </div>
        )}
      </div>
    );
  } else if (step === 2) {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0, flex: 1 }}>
        <div>
          <h4 style={{ ...sectionTitle, marginBottom: 4 }}>{m.tasks.columnsTitle}</h4>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--gray-600)' }}>
            {m.tasks.columnsHelp(selectedCols.length)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Input
            value={tableQuery}
            onChange={(e) => setTableQuery(e.target.value)}
            placeholder={m.tasks.tableName}
            aria-label={m.tasks.filterTables}
            style={{ flex: 1, minWidth: 120 }}
          />
          <Input
            value={colQuery}
            onChange={(e) => setColQuery(e.target.value)}
            placeholder={m.tasks.columnName}
            aria-label={m.tasks.filterColumns}
            style={{ flex: 1, minWidth: 120 }}
          />
        </div>
        <div style={{ flex: 1, minHeight: 120, overflow: 'auto', border: '1px solid var(--border-panel)', borderRadius: 'var(--radius-md)' }}>
          {filteredTables.map((table) => {
            const open = expanded[table.id];
            return (
              <div key={table.id} style={{ borderBottom: '1px solid var(--border-panel)' }}>
                <button
                  type="button"
                  onClick={() => setExpanded((p) => ({ ...p, [table.id]: !p[table.id] }))}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    border: 'none',
                    background: 'var(--gray-100)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text-heading)',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>›</span>
                  {tableTitle(table.id)}
                  <span style={{ marginLeft: 'auto', fontWeight: 500, color: 'var(--gray-500)', fontSize: 11 }}>
                    {m.tasks.columnsCount(table.columns.length)}
                  </span>
                </button>
                {open && (
                  <div style={{ padding: '6px 12px 10px 28px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {table.columns.map((col) => {
                      const key = `${table.id}.${col.id}`;
                      const checked = selectedCols.includes(key);
                      return (
                        <label
                          key={col.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 12,
                            color: 'var(--navy-700)',
                            cursor: 'pointer',
                            padding: '3px 0',
                          }}
                        >
                          <input type="checkbox" checked={checked} onChange={() => toggleCol(table.id, col.id)} />
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{col.name}</span>
                          <span style={{ color: 'var(--gray-500)' }}>({catalogLabel(m.catalog, col.type)})</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-heading)' }}>
            {m.tasks.selectedColumns(selectedCols.length)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 28 }}>
            {selectedCols.map((key) => {
              const [tableId, colId] = key.split('.');
              const table = WIZARD_TABLES.find((t) => t.id === tableId);
              const col = table?.columns.find((c) => c.id === colId);
              const label = `${tableId}.${colId} (${col ? catalogLabel(m.catalog, col.type) : '?'})`;
              return <Chip key={key} label={label} onRemove={() => setSelectedCols((p) => p.filter((k) => k !== key))} />;
            })}
          </div>
        </div>
      </div>
    );
  } else {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0, flex: 1 }}>
        <h4 style={sectionTitle}>{m.tasks.userChoice}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" size="sm" onClick={() => setUserQuery('')}>{m.common.clear}</Button>
          <Input
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder={m.common.search}
            aria-label={m.tasks.searchUsers}
            style={{ flex: 1, minWidth: 140 }}
          />
        </div>
        <div style={{ flex: 1, minHeight: 120, overflow: 'auto', border: '1px solid var(--border-panel)', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-ui)' }}>
            <thead>
              <tr style={{ background: 'var(--gray-100)' }}>
                {[m.tasks.name, m.tasks.surname, m.tasks.email].map((h) => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', borderBottom: '1px solid var(--border-panel)', color: 'var(--text-heading)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: 16, textAlign: 'center', color: 'var(--gray-500)' }}>{m.tasks.noData}</td>
                </tr>
              ) : (
                filteredUsers.map((u, i) => {
                  const on = selectedUsers.some((s) => s.id === u.id);
                  return (
                    <tr
                      key={u.id}
                      onClick={() => toggleUser(u)}
                      style={{
                        background: on ? 'var(--surface-tint)' : i % 2 === 0 ? 'var(--surface-page)' : 'var(--blue-100)',
                        cursor: 'pointer',
                      }}
                    >
                      <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--border-panel)' }}>{u.name}</td>
                      <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--border-panel)' }}>{u.surname}</td>
                      <td style={{ padding: '7px 10px', borderBottom: '1px solid var(--border-panel)' }}>{u.email}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{m.tasks.selectedUsers(selectedUsers.length)}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 28 }}>
            {selectedUsers.map((u) => (
              <Chip
                key={u.id}
                label={`${u.name} ${u.surname}`.trim()}
                onRemove={() => setSelectedUsers((p) => p.filter((x) => x.id !== u.id))}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label={m.tasks.details}
      style={{
        width: 420,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-panel)',
        borderLeft: '1px solid var(--border-panel)',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px',
          borderBottom: '1px solid var(--border-panel)',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-heading)', fontFamily: 'var(--font-ui)' }}>
          {m.tasks.details}
        </h3>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-tint)',
            color: 'var(--text-accent)',
            fontSize: 11,
            fontWeight: 600,
            maxWidth: 160,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={badge}
        >
          {badge}
        </span>
        <button
          type="button"
          title={m.tasks.closeDetails}
          aria-label={m.tasks.closeDetails}
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            width: 28,
            height: 28,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-600)" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 4,
          padding: '12px 10px 8px',
          borderBottom: '1px solid var(--border-panel)',
        }}
      >
        {STEPS.map((s, i) => {
          const active = step === i;
          const done = step > i;
          return (
            <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: active || done ? 'var(--cyan-500)' : 'var(--surface-page)',
                  border: active || done ? 'none' : '1.5px solid var(--cyan-300)',
                }}
              >
                <StepIcon kind={s.icon} active={active || done} />
              </div>
              <span
                style={{
                  fontSize: 9,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  color: active ? 'var(--text-accent)' : 'var(--gray-500)',
                  fontWeight: active ? 700 : 500,
                }}
              >
                {stepLabels[i]}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '14px 14px 10px', display: 'flex', flexDirection: 'column' }}>
        {body}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '12px 14px',
          borderTop: '1px solid var(--border-panel)',
          background: 'var(--surface-page)',
        }}
      >
        {step > 0 ? (
          <Button variant="secondary" size="sm" onClick={goBack}>
            {m.tasks.back}
          </Button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <Button size="sm" onClick={goNext} disabled={!canNext}>
            {m.tasks.nextStep}
          </Button>
        ) : (
          <Button variant="success" size="sm" onClick={handleSave} disabled={!taskName.trim()}>
            {m.common.save}
          </Button>
        )}
      </div>
    </aside>
  );
}

const sectionTitle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-ui)',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text-heading)',
};

const fieldLabel: CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-heading)',
};
