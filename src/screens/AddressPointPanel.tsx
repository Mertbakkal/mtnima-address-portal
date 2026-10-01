import { useState, type ReactNode } from 'react';
import { AttributePanel } from '../components/panels/AttributePanel';
import { FormRow } from '../components/forms/FormRow';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { Textarea } from '../components/forms/Textarea';
import { ReadOnlyField } from '../components/forms/ReadOnlyField';
import { SearchField } from '../components/forms/SearchField';
import { Button } from '../components/core/Button';
import { Icon } from '../components/core/Icon';
import { StatusBadge } from '../components/core/StatusBadge';
import { buildAddressDemand, type AddressDemand } from '../data/addressDemand';
import { useI18n } from '../i18n/LocaleProvider';
import { catalogOptions } from '../i18n/messages';

export interface AddressPointPanelProps {
  pointId?: string | null;
  demandOpen?: boolean;
  onOpenDemand?: (demand: AddressDemand) => void;
  onClose: () => void;
  onDelete?: () => void;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', flex: '0 0 auto' }}>
      <path d="M6 9l6 6 6-6" stroke="var(--gray-600)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AccordionSection({
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon?: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-5)',
          width: '100%',
          minHeight: '34px',
          padding: 'var(--space-3) var(--space-6)',
          background: 'var(--surface-tint)',
          borderRadius: 'var(--radius-md)',
          margin: 'var(--space-6) 0 var(--space-4)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {icon}
        <span style={{
          flex: 1,
          minWidth: 0,
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--weight-semibold)',
          color: 'var(--text-heading)',
          lineHeight: 'var(--leading-snug)',
        }}>{title}</span>
        <Chevron open={open} />
      </button>
      {open ? children : null}
    </section>
  );
}

export function AddressPointPanel({
  pointId, demandOpen = false, onOpenDemand, onClose, onDelete,
}: AddressPointPanelProps) {
  const { m } = useI18n();
  const [locationOpen, setLocationOpen] = useState(false);
  const [buildingOpen, setBuildingOpen] = useState(false);
  const [demandSectionOpen, setDemandSectionOpen] = useState(false);
  const demand = buildAddressDemand(pointId || 'address');

  return (
    <AttributePanel width="420px" title={m.address.title} onClose={onClose}
      footer={<>
        <Button variant="danger" onClick={onDelete}>{m.common.delete}</Button>
        <Button variant="secondary" icon={<Icon name="map-pin" size={16} />}>{m.common.center}</Button>
        <Button style={{ marginLeft: 'auto' }}>{m.common.edit}</Button>
      </>}>
      <AccordionSection
        title={m.address.location}
        icon={<Icon name="section-location" size={20} />}
        open={locationOpen}
        onToggle={() => setLocationOpen((v) => !v)}
      >
        <div style={{ padding: '10px 14px' }}>
          <FormRow labelWidth="124px" label={m.address.digitalAddress}><ReadOnlyField mono value="NC02-A05-082916" /></FormRow>
          <FormRow labelWidth="124px" label={m.address.postalCode}><Input mono defaultValue="NC02-A05" /></FormRow>
          <FormRow labelWidth="124px" label={m.address.coordinates}><ReadOnlyField mono value="18.085312, -15.978451" /></FormRow>
          <FormRow labelWidth="124px" label={m.address.wilaya}><ReadOnlyField value="Nouakchott" /></FormRow>
          <FormRow labelWidth="124px" label={m.address.moughataa}><ReadOnlyField value="Tevragh Zeina" /></FormRow>
          <FormRow labelWidth="124px" label={m.address.street}><SearchField value="Rue de l'Amitié" onChange={() => {}} /></FormRow>
        </div>
      </AccordionSection>
      <AccordionSection
        title={m.address.building}
        icon={<Icon name="section-basic-info" size={20} />}
        open={buildingOpen}
        onToggle={() => setBuildingOpen((v) => !v)}
      >
        <div style={{ padding: '10px 14px' }}>
          <FormRow labelWidth="124px" label={m.address.buildingType}><Select defaultValue="Residential" placeholder={null} options={catalogOptions(m.catalog, ['Residential', 'Commercial', 'Public'])} /></FormRow>
          <FormRow labelWidth="124px" label={m.address.useType}><Select defaultValue="Residential" placeholder={null} options={catalogOptions(m.catalog, ['Residential', 'Business', 'Storage'])} /></FormRow>
          <FormRow labelWidth="124px" label={m.address.validation}><StatusBadge tone="success">{m.catalog.Validated}</StatusBadge></FormRow>
          <FormRow layout="stacked" label={m.address.fieldNote}><Textarea rows={2} readOnlyLook defaultValue={m.address.fieldNoteText} /></FormRow>
        </div>
      </AccordionSection>
      <AccordionSection
        title={m.address.demand}
        open={demandSectionOpen}
        onToggle={() => setDemandSectionOpen((v) => !v)}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-ui)' }}>
          <thead>
            <tr style={{ background: 'var(--gray-100)' }}>
              <th style={th}>{m.address.identifier}</th>
              <th style={th}>{m.address.date}</th>
              <th style={th}>{m.address.status}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              onClick={() => onOpenDemand?.(demand)}
              style={{
                cursor: 'pointer',
                background: demandOpen ? 'var(--cyan-50)' : 'var(--gray-0)',
              }}
            >
              <td style={td}>{demand.identifier}</td>
              <td style={td}>{demand.date}</td>
              <td style={td}><StatusBadge tone="pending" size="sm">{m.catalog.Pending}</StatusBadge></td>
            </tr>
          </tbody>
        </table>
      </AccordionSection>
    </AttributePanel>
  );
}

const th = {
  padding: '8px 10px',
  textAlign: 'left' as const,
  fontWeight: 600,
  color: 'var(--gray-800)',
  borderBottom: '1px solid var(--gray-200)',
};

const td = {
  padding: '8px 10px',
  color: 'var(--gray-800)',
  fontSize: 12,
};
