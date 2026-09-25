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
  const [locationOpen, setLocationOpen] = useState(false);
  const [buildingOpen, setBuildingOpen] = useState(false);
  const [demandSectionOpen, setDemandSectionOpen] = useState(false);
  const demand = buildAddressDemand(pointId || 'address');

  return (
    <AttributePanel width="420px" title="Address Point" onClose={onClose}
      footer={<>
        <Button variant="danger" onClick={onDelete}>Delete</Button>
        <Button variant="secondary" icon={<Icon name="map-pin" size={16} />}>Center</Button>
        <Button style={{ marginLeft: 'auto' }}>Edit</Button>
      </>}>
      <AccordionSection
        title="Location"
        icon={<Icon name="section-location" size={20} />}
        open={locationOpen}
        onToggle={() => setLocationOpen((v) => !v)}
      >
        <div style={{ padding: '10px 14px' }}>
          <FormRow labelWidth="124px" label="Digital address"><ReadOnlyField mono value="NC02-A05-082916" /></FormRow>
          <FormRow labelWidth="124px" label="Coordinates"><ReadOnlyField mono value="18.085312, -15.978451" /></FormRow>
          <FormRow labelWidth="124px" label="Wilaya"><ReadOnlyField value="Nouakchott" /></FormRow>
          <FormRow labelWidth="124px" label="Moughataa"><ReadOnlyField value="Tevragh Zeina" /></FormRow>
          <FormRow labelWidth="124px" label="Street"><SearchField value="Rue de l'Amitié" onChange={() => {}} /></FormRow>
        </div>
      </AccordionSection>
      <AccordionSection
        title="Building"
        icon={<Icon name="section-basic-info" size={20} />}
        open={buildingOpen}
        onToggle={() => setBuildingOpen((v) => !v)}
      >
        <div style={{ padding: '10px 14px' }}>
          <FormRow labelWidth="124px" label="Building type"><Select defaultValue="Residential" placeholder={null} options={['Residential', 'Commercial', 'Public']} /></FormRow>
          <FormRow labelWidth="124px" label="Use type"><Select defaultValue="Residential" placeholder={null} options={['Residential', 'Business', 'Storage']} /></FormRow>
          <FormRow labelWidth="124px" label="Postal code"><Input mono defaultValue="1000" /></FormRow>
          <FormRow labelWidth="124px" label="Validation"><StatusBadge tone="success">Validated</StatusBadge></FormRow>
          <FormRow layout="stacked" label="Field note"><Textarea rows={2} readOnlyLook defaultValue="Single-storey house with a wall and iron gate on the street frontage." /></FormRow>
        </div>
      </AccordionSection>
      <AccordionSection
        title="Demand"
        open={demandSectionOpen}
        onToggle={() => setDemandSectionOpen((v) => !v)}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-ui)' }}>
          <thead>
            <tr style={{ background: 'var(--gray-100)' }}>
              <th style={th}>Identifier</th>
              <th style={th}>Date</th>
              <th style={th}>Status</th>
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
              <td style={td}><StatusBadge tone="pending" size="sm">Pending</StatusBadge></td>
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
