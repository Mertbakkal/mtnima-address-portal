import { useState } from 'react';
import { Button } from '../components/core/Button';
import { FormRow } from '../components/forms/FormRow';
import { Select } from '../components/forms/Select';
import {
  BULK_BUILDING_TYPE,
  BULK_NAMING_STATUS,
  BULK_POSTAL_CODE,
  BULK_USE_TYPE,
  BULK_VALIDATION,
  BULK_WILAYA,
  type BulkUpdatePatch,
} from '../data/dynamicQuery';

export interface BulkUpdateModalProps {
  onClose: () => void;
  onSave?: (patch: BulkUpdatePatch) => void;
}

export function BulkUpdateModal({ onClose, onSave }: BulkUpdateModalProps) {
  const [namingStatus, setNamingStatus] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [useType, setUseType] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [validation, setValidation] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSave = () => {
    const patch: BulkUpdatePatch = {};
    if (namingStatus) patch.namingStatus = namingStatus;
    if (buildingType) patch.buildingType = buildingType;
    if (useType) patch.useType = useType;
    if (wilaya) patch.wilaya = wilaya;
    if (validation) patch.validationStatus = validation;
    if (postalCode) patch.postalCode = postalCode;
    onSave?.(patch);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label="Bulk Address Update"
      style={{
        width: 340,
        maxWidth: 'calc(100vw - 32px)',
        background: 'var(--surface-page)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-panel)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: '12px 14px',
        background: 'var(--surface-accent)',
        color: 'var(--text-on-accent)',
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
          Bulk Address Update
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

      <div style={{ padding: 'var(--space-5) var(--space-7) var(--space-4)' }}>
        <FormRow label="Naming status" layout="stacked" colon={false}>
          <Select
            options={[...BULK_NAMING_STATUS]}
            value={namingStatus}
            placeholder="Select…"
            onChange={(e) => setNamingStatus(e.target.value)}
          />
        </FormRow>
        <FormRow label="Building type" layout="stacked" colon={false}>
          <Select
            options={[...BULK_BUILDING_TYPE]}
            value={buildingType}
            placeholder="Select…"
            onChange={(e) => setBuildingType(e.target.value)}
          />
        </FormRow>
        <FormRow label="Use type" layout="stacked" colon={false}>
          <Select
            options={[...BULK_USE_TYPE]}
            value={useType}
            placeholder="Select…"
            onChange={(e) => setUseType(e.target.value)}
          />
        </FormRow>
        <FormRow label="Wilaya" layout="stacked" colon={false}>
          <Select
            options={[...BULK_WILAYA]}
            value={wilaya}
            placeholder="Select…"
            onChange={(e) => setWilaya(e.target.value)}
          />
        </FormRow>
        <FormRow label="Validation status" layout="stacked" colon={false}>
          <Select
            options={[...BULK_VALIDATION]}
            value={validation}
            placeholder="Select…"
            onChange={(e) => setValidation(e.target.value)}
          />
        </FormRow>
        <FormRow label="Postal code" layout="stacked" colon={false}>
          <Select
            options={[...BULK_POSTAL_CODE]}
            value={postalCode}
            placeholder="Select…"
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </FormRow>
      </div>

      <div style={{ padding: 'var(--space-4) var(--space-7) var(--space-6)' }}>
        <Button variant="success" block onClick={handleSave} icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12l5 5L20 7" />
          </svg>
        }>
          Save
        </Button>
      </div>
    </div>
  );
}
