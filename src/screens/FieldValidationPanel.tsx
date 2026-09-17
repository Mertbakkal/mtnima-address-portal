import { AttributePanel } from '../components/panels/AttributePanel';
import { KeyValueList } from '../components/panels/KeyValueList';
import { PhotoThumb } from '../components/panels/PhotoThumb';
import { Textarea } from '../components/forms/Textarea';
import { FormRow } from '../components/forms/FormRow';
import { Button } from '../components/core/Button';
import { Icon } from '../components/core/Icon';
import { StatusBadge, type StatusTone } from '../components/core/StatusBadge';

export type ValidationDecision = 'approve' | 'reject' | 'revise' | null;

export interface FieldValidationPanelProps {
  onClose: () => void;
  onDecision: (decision: ValidationDecision) => void;
  decision: ValidationDecision;
}

export function FieldValidationPanel({ onClose, onDecision, decision }: FieldValidationPanelProps) {
  const tone: StatusTone = decision === 'approve' ? 'success' : decision === 'reject' ? 'danger' : 'pending';
  const word = decision === 'approve' ? 'Validated' : decision === 'reject' ? 'Rejected' : decision === 'revise' ? 'Sent for revision' : 'Awaiting validation';
  return (
    <AttributePanel width="420px" title="Field Record Validation" icon={<Icon name="section-field-record" size={22} />} onClose={onClose}
      footer={<div style={{ display: 'flex', gap: 8, width: '100%' }}>
        <Button variant="danger" style={{ flex: 1 }} onClick={() => onDecision('reject')}>Reject</Button>
        <Button variant="warning" style={{ flex: 1 }} onClick={() => onDecision('revise')}>Revise</Button>
        <Button style={{ flex: 1 }} onClick={() => onDecision('approve')}>Approve</Button>
      </div>}>
      <div style={{ display: 'flex', gap: 12, padding: '12px 14px 10px', alignItems: 'flex-start' }}>
        <PhotoThumb src="/assets/photo-field-house.png" width={150} height={96} caption="Field photo" alt="Single-storey house with iron gate" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', paddingTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-700)' }}>
            Record <span style={{ fontFamily: 'var(--font-mono)' }}>MOB-2026-00157</span>
          </div>
          <StatusBadge solid tone={tone}>{word}</StatusBadge>
        </div>
      </div>
      <div style={{ padding: '0 14px' }}>
        <KeyValueList items={[
          { icon: <Icon name="nav-home" size={16} />, label: 'Digital address', value: 'Nouakchott, Teyaret' },
          { icon: <Icon name="section-location" size={16} />, label: 'Coordinates', value: '18.083512, -15.978451', mono: true },
          { icon: <Icon name="map-measure" size={16} />, label: 'Accuracy', value: '5 m', mono: true },
          { icon: <Icon name="section-basic-info" size={16} />, label: 'Building type', value: 'Residential' },
          { icon: <Icon name="nav-user" size={16} />, label: 'Collected by', value: 'ahmed.mohamed' },
          { icon: <Icon name="nav-tasks" size={16} />, label: 'Record date', value: '12.11.2025 10:24', mono: true },
        ]} />
      </div>
      <div style={{ padding: '10px 14px 14px' }}>
        <FormRow layout="stacked" label="Validator note" colon={false}><Textarea rows={2} placeholder="Enter a note..." /></FormRow>
      </div>
    </AttributePanel>
  );
}
