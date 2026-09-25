import { useState } from 'react';
import { AttributePanel } from '../components/panels/AttributePanel';
import { PanelSectionHeader } from '../components/panels/PanelSectionHeader';
import { Tabs } from '../components/navigation/Tabs';
import { FormRow } from '../components/forms/FormRow';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { Textarea } from '../components/forms/Textarea';
import { SearchField } from '../components/forms/SearchField';
import { ReadOnlyField } from '../components/forms/ReadOnlyField';
import { Button } from '../components/core/Button';
import { Icon } from '../components/core/Icon';
import type { RoadAddress } from '../data/roadAddresses';

export interface StreetPanelProps {
  onClose: () => void;
  onDelete?: () => void;
  addresses?: RoadAddress[];
  onCenterAddress?: (address: RoadAddress) => void;
}

const emptyTab = (
  <div style={{ padding: 16, fontSize: 13, color: 'var(--label-500)' }}>No records found.</div>
);

const readOnlyValueStyle = { background: 'transparent', border: 'none', paddingLeft: 0 } as const;

const thStyle = {
  padding: '8px 12px',
  textAlign: 'left' as const,
  fontWeight: 600,
  color: 'var(--gray-800)',
  borderBottom: '1px solid var(--gray-200)',
};

function CertifiedMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="7" fill="none" stroke="var(--gray-800)" strokeWidth="1.4" />
      <path d="M6.2 6.2l5.6 5.6M11.8 6.2l-5.6 5.6" stroke="var(--gray-800)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CenterMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.2" fill="none" stroke="var(--gray-800)" strokeWidth="1.4" />
      <path d="M10.2 10.2L13.2 13.2" stroke="var(--gray-800)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AddressesTab({
  addresses,
  onCenterAddress,
}: {
  addresses: RoadAddress[];
  onCenterAddress?: (address: RoadAddress) => void;
}) {
  if (addresses.length === 0) return emptyTab;
  return (
    <div style={{ margin: 'calc(var(--space-4) * -1) calc(var(--space-7) * -1) calc(var(--space-8) * -1)' }}>
      <div style={{ padding: '12px 14px 10px', fontSize: 13, lineHeight: 1.7, color: 'var(--gray-800)' }}>
        <div>Number of addresses on the road : {addresses.length}</div>
        <div>All road addresses are certified : NO</div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-ui)' }}>
        <thead>
          <tr style={{ background: 'var(--gray-100)' }}>
            <th style={thStyle}>List of numbers</th>
            <th style={{ ...thStyle, width: 92, textAlign: 'center' }}>Certified</th>
            <th style={{ ...thStyle, width: 76, textAlign: 'center' }}>Center</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address, index) => (
            <tr key={`${address.number}-${index}`} style={{ background: index % 2 === 0 ? 'var(--gray-50)' : 'var(--gray-0)' }}>
              <td style={{ padding: '7px 12px', color: 'var(--gray-800)' }}>{address.number}</td>
              <td style={{ padding: '7px 12px' }}>
                <span style={{ display: 'flex', justifyContent: 'center' }} title="Not certified">
                  <CertifiedMark />
                </span>
              </td>
              <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                <button
                  type="button"
                  title="Center"
                  aria-label={`Center on address ${address.number}`}
                  onClick={() => onCenterAddress?.(address)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <CenterMark />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StreetPanel({ onClose, onDelete, addresses = [], onCenterAddress }: StreetPanelProps) {
  const [tab, setTab] = useState('Road');
  return (
    <AttributePanel title="Road" icon={<Icon name="tool-street-info" size={22} />} onClose={onClose}
      tabs={<Tabs value={tab} onChange={setTab} tabs={['Road', 'Addresses', 'Street signs']} />}
      footer={<>
        <Button variant="danger" onClick={onDelete}>Delete</Button>
        <Button style={{ marginLeft: 'auto' }}>Save</Button>
      </>}>
      {tab === 'Road' && <>
        <div style={{ display: 'grid', gap: 10, padding: '14px 14px 4px' }}>
          <FormRow layout="stacked" label="Road type"><Select placeholder="—" options={['Boulevard', 'Avenue', 'Rue', 'Ruelle']} /></FormRow>
          <FormRow layout="stacked" label="Road name"><SearchField placeholder="Enter a name..." /></FormRow>
        </div>
        <PanelSectionHeader>Road</PanelSectionHeader>
        <div style={{ padding: '10px 14px 14px' }}>
          <FormRow labelWidth="200px" label="Code"><Input mono defaultValue="11.TKS" /></FormRow>
          <FormRow labelWidth="200px" label="Naming status">
            <Select placeholder={null} defaultValue="To be named" options={['To be named', 'Proposed', 'Official']} />
          </FormRow>
          <FormRow labelWidth="200px" label="Number of addresses on the road">
            <ReadOnlyField mono value={String(addresses.length)} style={readOnlyValueStyle} />
          </FormRow>
          <FormRow labelWidth="200px" label="All road addresses are certified">
            <ReadOnlyField mono value="NO" style={readOnlyValueStyle} />
          </FormRow>
          <FormRow labelWidth="200px" label="Number of street signs">
            <ReadOnlyField mono value="0" style={readOnlyValueStyle} />
          </FormRow>
          <FormRow labelWidth="200px" label="All street signs are placed">
            <ReadOnlyField mono value="NO" style={readOnlyValueStyle} />
          </FormRow>
          <FormRow layout="stacked" label="Comment"><Textarea rows={3} /></FormRow>
          <FormRow layout="stacked" label="Road name history"><Textarea rows={3} /></FormRow>
        </div>
      </>}
      {tab === 'Addresses' && <AddressesTab addresses={addresses} onCenterAddress={onCenterAddress} />}
      {tab === 'Street signs' && emptyTab}
    </AttributePanel>
  );
}
