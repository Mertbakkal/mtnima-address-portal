import { useState } from 'react';
import { AttributePanel } from '../components/panels/AttributePanel';
import { Tabs } from '../components/navigation/Tabs';
import { FormRow } from '../components/forms/FormRow';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { Textarea } from '../components/forms/Textarea';
import { ReadOnlyField } from '../components/forms/ReadOnlyField';
import { Button } from '../components/core/Button';
import { Icon } from '../components/core/Icon';
import type { RoadAddress } from '../data/roadAddresses';
import { useI18n } from '../i18n/LocaleProvider';
import { catalogOptions } from '../i18n/messages';

export interface StreetPanelProps {
  onClose: () => void;
  onDelete?: () => void;
  addresses?: RoadAddress[];
  onCenterAddress?: (address: RoadAddress) => void;
}

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

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8.2 3.1a4.9 4.9 0 1 1-4.4 2.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M3.1 2.8v3.1h3.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 5.2V8.2L9.9 9.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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
        <Button variant="ghost" icon={<HistoryIcon />}>{m.street.dataHistory}</Button>
        <Button variant="danger" onClick={onDelete} style={{ marginLeft: 'auto' }}>{m.common.delete}</Button>
        <Button>{m.common.save}</Button>
      </>}>
      {tab === 'road' && (
        <div>
          <FormRow labelWidth="148px" label={m.street.id}><ReadOnlyField mono value="1002456789" /></FormRow>
          <FormRow labelWidth="148px" label={m.street.roadCode}><ReadOnlyField mono value="RDC-00128" /></FormRow>
          <FormRow labelWidth="148px" label={m.street.roadType}>
            <Select placeholder={m.street.selectRoadType} options={catalogOptions(m.catalog, ['Boulevard', 'Avenue', 'Rue', 'Ruelle'])} />
          </FormRow>
          <FormRow labelWidth="148px" label={m.street.roadName}><Input defaultValue="Avenue des Palmiers" /></FormRow>
          <FormRow labelWidth="148px" label={m.street.roadStatus}>
            <Select placeholder={m.street.selectRoadStatus} options={catalogOptions(m.catalog, ['Open', 'Under construction', 'Closed'])} />
          </FormRow>
          <FormRow labelWidth="148px" label={m.street.roadOwnership}>
            <Select placeholder={m.street.selectRoadOwnership} options={catalogOptions(m.catalog, ['Public', 'Private', 'Mixed'])} />
          </FormRow>
          <FormRow labelWidth="148px" label={m.street.wilaya}><ReadOnlyField value="Nouakchott" /></FormRow>
          <FormRow labelWidth="148px" label={m.street.moughataa}><ReadOnlyField value="Tevragh-Zeina" /></FormRow>
          <FormRow labelWidth="148px" label={m.street.commune}><ReadOnlyField value="Tevragh-Zeina" /></FormRow>
          <FormRow labelWidth="148px" label={m.street.locality}><Input defaultValue="Ilot K" /></FormRow>
          <FormRow labelWidth="148px" align="top" label={m.street.description}>
            <Textarea rows={3} defaultValue="Main residential street." />
          </FormRow>
        </div>
      )}
      {tab === 'addresses' && <AddressesTab addresses={addresses} onCenterAddress={onCenterAddress} />}
      {tab === 'signs' && <div style={{ padding: 16, fontSize: 13, color: 'var(--label-500)' }}>{m.street.empty}</div>}
    </AttributePanel>
  );
}
