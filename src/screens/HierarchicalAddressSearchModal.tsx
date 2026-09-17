import { useState } from 'react';
import { Button } from '../components/core/Button';
import { FormRow } from '../components/forms/FormRow';
import { Select } from '../components/forms/Select';
import {
  getCommuneNames,
  getMoughataaNames,
  getStreetNames,
  getWilayaNames,
  resolveHierarchyFocus,
  type HierarchySelection,
  type MapFocus,
} from '../data/hierarchySearch';

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
  const [selection, setSelection] = useState<HierarchySelection>(EMPTY);
  const [minimized, setMinimized] = useState(false);

  const wilayas = getWilayaNames();
  const moughataas = selection.wilaya ? getMoughataaNames(selection.wilaya) : [];
  const communes = selection.wilaya && selection.moughataa
    ? getCommuneNames(selection.wilaya, selection.moughataa)
    : [];
  const streets = selection.wilaya && selection.moughataa && selection.commune
    ? getStreetNames(selection.wilaya, selection.moughataa, selection.commune)
    : [];

  const setLevel = (level: keyof HierarchySelection, value: string) => {
    setSelection((prev) => {
      if (level === 'wilaya') return { wilaya: value, moughataa: '', commune: '', street: '' };
      if (level === 'moughataa') return { ...prev, moughataa: value, commune: '', street: '' };
      if (level === 'commune') return { ...prev, commune: value, street: '' };
      return { ...prev, street: value };
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
      aria-label="Hierarchical Address Search"
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
          Hierarchical Address Search
        </h2>
        <button
          type="button"
          title={minimized ? 'Restore' : 'Minimize'}
          aria-label={minimized ? 'Restore' : 'Minimize'}
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

      {!minimized && (
        <>
          <div style={{ padding: 'var(--space-5) var(--space-7) var(--space-4)' }}>
            <FormRow label="Wilaya" layout="stacked" colon={false}>
              <Select
                options={wilayas}
                value={selection.wilaya || ''}
                placeholder="Select a wilaya"
                onChange={(e) => setLevel('wilaya', e.target.value)}
              />
            </FormRow>
            <FormRow label="Moughataa" layout="stacked" colon={false}>
              <Select
                options={moughataas}
                value={selection.moughataa || ''}
                placeholder="Select a moughataa"
                disabled={!selection.wilaya}
                onChange={(e) => setLevel('moughataa', e.target.value)}
              />
            </FormRow>
            <FormRow label="Commune" layout="stacked" colon={false}>
              <Select
                options={communes}
                value={selection.commune || ''}
                placeholder="Select a commune"
                disabled={!selection.moughataa}
                onChange={(e) => setLevel('commune', e.target.value)}
              />
            </FormRow>
            <FormRow label="Street" layout="stacked" colon={false}>
              <Select
                options={streets}
                value={selection.street || ''}
                placeholder="Select a street"
                disabled={!selection.commune}
                onChange={(e) => setLevel('street', e.target.value)}
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
              Show
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
