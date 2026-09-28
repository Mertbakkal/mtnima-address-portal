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
import { useI18n } from '../i18n/LocaleProvider';
import { catalogLabel, catalogOptions } from '../i18n/messages';

export interface StreetPanelProps {
  onClose: () => void;
  onDelete?: () => void;
  addresses?: RoadAddress[];
  onCenterAddress?: (address: RoadAddress) => void;
}

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
  const { m } = useI18n();
  if (addresses.length === 0) {
    return <div style={{ padding: 16, fontSize: 13, color: 'var(--label-500)' }}>{m.street.empty}</div>;
  }
  return (
    <div style={{ margin: 'calc(var(--space-4) * -1) calc(var(--space-7) * -1) calc(var(--space-8) * -1)' }}>
      <div style={{ padding: '12px 14px 10px', fontSize: 13, lineHeight: 1.7, color: 'var(--gray-800)' }}>
        <div>{m.street.addressCount(addresses.length)}</div>
        <div>{m.street.allCertified}</div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-ui)' }}>
        <thead>
          <tr style={{ background: 'var(--gray-100)' }}>
            <th style={thStyle}>{m.street.numberList}</th>
            <th style={{ ...thStyle, width: 92, textAlign: 'center' }}>{m.street.certified}</th>
            <th style={{ ...thStyle, width: 76, textAlign: 'center' }}>{m.common.center}</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address, index) => (
            <tr key={`${address.number}-${index}`} style={{ background: index % 2 === 0 ? 'var(--gray-50)' : 'var(--gray-0)' }}>
              <td style={{ padding: '7px 12px', color: 'var(--gray-800)' }}>{address.number}</td>
              <td style={{ padding: '7px 12px' }}>
                <span style={{ display: 'flex', justifyContent: 'center' }} title={m.street.notCertified}>
                  <CertifiedMark />
                </span>
              </td>
              <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                <button
                  type="button"
                  title={m.common.center}
                  aria-label={m.street.centerOn(address.number)}
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
  const { m } = useI18n();
  const [tab, setTab] = useState('road');
  return (
    <AttributePanel title={m.street.road} icon={<Icon name="tool-street-info" size={22} />} onClose={onClose}
      tabs={<Tabs value={tab} onChange={setTab} tabs={[
        { id: 'road', label: m.street.road },
        { id: 'addresses', label: m.street.addresses },
        { id: 'signs', label: m.street.signs },
      ]} />}
      footer={<>
        <Button variant="danger" onClick={onDelete}>{m.common.delete}</Button>
        <Button style={{ marginLeft: 'auto' }}>{m.common.save}</Button>
      </>}>
      {tab === 'road' && <>
        <div style={{ display: 'grid', gap: 10, padding: '14px 14px 4px' }}>
          <FormRow layout="stacked" label={m.street.roadType}><Select placeholder="—" options={catalogOptions(m.catalog, ['Boulevard', 'Avenue', 'Rue', 'Ruelle'])} /></FormRow>
          <FormRow layout="stacked" label={m.street.roadName}><SearchField placeholder={m.street.enterName} /></FormRow>
        </div>
        <PanelSectionHeader>{m.street.road}</PanelSectionHeader>
        <div style={{ padding: '10px 14px 14px' }}>
          <FormRow labelWidth="200px" label={m.street.code}><Input mono defaultValue="11.TKS" /></FormRow>
          <FormRow labelWidth="200px" label={m.street.namingStatus}>
            <Select placeholder={null} defaultValue="To be named" options={catalogOptions(m.catalog, ['To be named', 'Proposed', 'Official'])} />
          </FormRow>
          <FormRow labelWidth="200px" label={m.street.addressCountLabel}>
            <ReadOnlyField mono value={String(addresses.length)} style={readOnlyValueStyle} />
          </FormRow>
          <FormRow labelWidth="200px" label={m.street.allCertifiedLabel}>
            <ReadOnlyField mono value={catalogLabel(m.catalog, 'NO')} style={readOnlyValueStyle} />
          </FormRow>
          <FormRow labelWidth="200px" label={m.street.signCount}>
            <ReadOnlyField mono value="0" style={readOnlyValueStyle} />
          </FormRow>
          <FormRow labelWidth="200px" label={m.street.allSignsPlaced}>
            <ReadOnlyField mono value={catalogLabel(m.catalog, 'NO')} style={readOnlyValueStyle} />
          </FormRow>
          <FormRow layout="stacked" label={m.street.comment}><Textarea rows={3} /></FormRow>
          <FormRow layout="stacked" label={m.street.nameHistory}><Textarea rows={3} /></FormRow>
        </div>
      </>}
      {tab === 'addresses' && <AddressesTab addresses={addresses} onCenterAddress={onCenterAddress} />}
      {tab === 'signs' && <div style={{ padding: 16, fontSize: 13, color: 'var(--label-500)' }}>{m.street.empty}</div>}
    </AttributePanel>
  );
}
