import { useState } from 'react';
import { Button } from '../components/core/Button';
import { FormRow } from '../components/forms/FormRow';
import { Select } from '../components/forms/Select';
import {
  getCommuneNames,
  getMoughataaNames,
  getWilayaNames,
  resolveHierarchyFocus,
  type HierarchySelection,
  type MapFocus,
} from '../data/hierarchySearch';
import { useI18n } from '../i18n/LocaleProvider';

export interface HierarchicalAddressSearchModalProps {
  onClose: () => void;
  onShow: (focus: MapFocus) => void;
}

const EMPTY: HierarchySelection = {
  wilaya: '',
  moughataa: '',
  commune: '',
  street: '',
};

export function HierarchicalAddressSearchModal({ onClose, onShow }: HierarchicalAddressSearchModalProps) {
  const { m } = useI18n();
  const [selection, setSelection] = useState<HierarchySelection>(EMPTY);
  const [minimized, setMinimized] = useState(false);

  const wilayas = getWilayaNames();
  const moughataas = selection.wilaya ? getMoughataaNames(selection.wilaya) : [];
  const communes = selection.wilaya && selection.moughataa
    ? getCommuneNames(selection.wilaya, selection.moughataa)
    : [];

  const setLevel = (level: Exclude<keyof HierarchySelection, 'street'>, value: string) => {
    setSelection((prev) => {
      if (level === 'wilaya') return { wilaya: value, moughataa: '', commune: '', street: '' };
      if (level === 'moughataa') return { ...prev, moughataa: value, commune: '', street: '' };
      return { ...prev, commune: value, street: '' };
    });
  };

  const handleShow = () => {
    const focus = resolveHierarchyFocus(selection);
    if (focus) onShow(focus);
  };

  const handleReset = () => setSelection(EMPTY);

  const canShow = Boolean(selection.wilaya);

  return (
    <div
      role="dialog"
      aria-label={m.hierarchy.title}
      style={{
        width: minimized ? 320 : 360,
        maxWidth: 'calc(100vw - 24px)',
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
          {m.hierarchy.title}
        </h2>
        <button
          type="button"
          title={minimized ? m.common.restore : m.common.minimize}
          aria-label={minimized ? m.common.restore : m.common.minimize}
          onClick={() => setMinimized((m) => !m)}
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
            <path d="M5 12h14" />
          </svg>
        </button>
        <button
          type="button"
          title={m.common.close}
          aria-label={m.common.close}
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

      {!minimized && (
        <>
          <div style={{ padding: 'var(--space-5) var(--space-7) var(--space-4)' }}>
            <FormRow label={m.address.wilaya} layout="stacked" colon={false}>
              <Select
                options={wilayas}
                value={selection.wilaya || ''}
                placeholder={m.hierarchy.selectWilaya}
                onChange={(e) => setLevel('wilaya', e.target.value)}
              />
            </FormRow>
            <FormRow label={m.address.moughataa} layout="stacked" colon={false}>
              <Select
                options={moughataas}
                value={selection.moughataa || ''}
                placeholder={m.hierarchy.selectMoughataa}
                disabled={!selection.wilaya}
                onChange={(e) => setLevel('moughataa', e.target.value)}
              />
            </FormRow>
            <FormRow label={m.address.commune} layout="stacked" colon={false}>
              <Select
                options={communes}
                value={selection.commune || ''}
                placeholder={m.hierarchy.selectCommune}
                disabled={!selection.moughataa}
                onChange={(e) => setLevel('commune', e.target.value)}
              />
            </FormRow>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-4)',
              padding: 'var(--space-5) var(--space-7)',
              borderTop: '1px solid var(--border-panel)',
            }}
          >
            <Button variant="primary" onClick={handleShow} disabled={!canShow}>
              {m.common.show}
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              {m.common.reset}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
