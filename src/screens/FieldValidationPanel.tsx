import { AttributePanel } from '../components/panels/AttributePanel';
import { KeyValueList } from '../components/panels/KeyValueList';
import { PhotoThumb } from '../components/panels/PhotoThumb';
import { Textarea } from '../components/forms/Textarea';
import { FormRow } from '../components/forms/FormRow';
import { Button } from '../components/core/Button';
import { Icon } from '../components/core/Icon';
import { StatusBadge, type StatusTone } from '../components/core/StatusBadge';
import type { TaskMission } from '../data/taskMissions';
import { useI18n } from '../i18n/LocaleProvider';
import { catalogLabel } from '../i18n/messages';

export type ValidationDecision = 'approve' | 'reject' | 'revise' | null;

export interface FieldValidationPanelProps {
  onClose: () => void;
  onDecision: (decision: ValidationDecision) => void;
  decision: ValidationDecision;
  mission?: TaskMission | null;
}

const DEFAULTS = {
  recordId: 'MOB-2026-00157',
  digitalAddress: 'Nouakchott, Teyaret',
  coordinates: '18.083512, -15.978451',
  accuracy: '5 m',
  buildingType: 'Residential',
  collectedBy: 'ahmed.mohamed',
  recordDate: '12.11.2025 10:24',
};

export function FieldValidationPanel({ onClose, onDecision, decision, mission }: FieldValidationPanelProps) {
  const { m } = useI18n();
  const tone: StatusTone = decision === 'approve' ? 'success' : decision === 'reject' ? 'danger' : 'pending';
  const word = decision === 'approve' ? m.field.validated : decision === 'reject' ? m.field.rejected : decision === 'revise' ? m.field.reviseSent : m.field.awaiting;
  const recordId = mission?.recordId ?? DEFAULTS.recordId;
  const digitalAddress = mission?.digitalAddress ?? DEFAULTS.digitalAddress;
  const coordinates = mission?.coordinates ?? DEFAULTS.coordinates;
  const accuracy = mission?.accuracy ?? DEFAULTS.accuracy;
  const buildingType = mission?.buildingType ?? DEFAULTS.buildingType;
  const collectedBy = mission?.collectedBy ?? DEFAULTS.collectedBy;
  const recordDate = mission?.recordDate ?? DEFAULTS.recordDate;

  return (
    <AttributePanel width="420px" title={m.field.title} icon={<Icon name="section-field-record" size={22} />} onClose={onClose}
      footer={<div style={{ display: 'flex', gap: 8, width: '100%' }}>
        <Button variant="danger" style={{ flex: 1 }} onClick={() => onDecision('reject')}>{m.field.reject}</Button>
        <Button variant="warning" style={{ flex: 1 }} onClick={() => onDecision('revise')}>{m.field.revise}</Button>
        <Button style={{ flex: 1 }} onClick={() => onDecision('approve')}>{m.field.approve}</Button>
      </div>}>
      <div style={{ display: 'flex', gap: 12, padding: '12px 14px 10px', alignItems: 'flex-start' }}>
        <PhotoThumb src="/assets/photo-field-house.png" width={150} height={96} caption={m.field.photo} alt={m.field.photoAlt} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', paddingTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-700)' }}>
            {m.field.record} <span style={{ fontFamily: 'var(--font-mono)' }}>{recordId}</span>
          </div>
          {mission?.name ? (
            <div style={{ fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.3 }}>{mission.name}</div>
          ) : null}
          <StatusBadge solid tone={tone}>{word}</StatusBadge>
        </div>
      </div>
      <div style={{ padding: '0 14px' }}>
        <KeyValueList items={[
          { icon: <Icon name="nav-home" size={16} />, label: m.field.digitalAddress, value: digitalAddress },
          { icon: <Icon name="section-location" size={16} />, label: m.field.coordinates, value: coordinates, mono: true },
          { icon: <Icon name="map-measure" size={16} />, label: m.field.accuracy, value: accuracy, mono: true },
          { icon: <Icon name="section-basic-info" size={16} />, label: m.field.buildingType, value: catalogLabel(m.catalog, buildingType) },
          { icon: <Icon name="nav-user" size={16} />, label: m.field.collectedBy, value: collectedBy },
          { icon: <Icon name="nav-tasks" size={16} />, label: m.field.recordDate, value: recordDate, mono: true },
        ]} />
      </div>
      <div style={{ padding: '10px 14px 14px' }}>
        <FormRow layout="stacked" label={m.field.note} colon={false}><Textarea rows={2} placeholder={m.field.notePlaceholder} /></FormRow>
      </div>
    </AttributePanel>
  );
}
