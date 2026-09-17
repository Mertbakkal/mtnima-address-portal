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

export interface StreetPanelProps {
  onClose: () => void;
}

const emptyTab = (
  <div style={{ padding: 16, fontSize: 13, color: 'var(--label-500)' }}>No records found.</div>
);

const readOnlyValueStyle = { background: 'transparent', border: 'none', paddingLeft: 0 } as const;

export function StreetPanel({ onClose }: StreetPanelProps) {
  const [tab, setTab] = useState('Road');
  return (
    <AttributePanel title="Road" icon={<Icon name="tool-street-info" size={22} />} onClose={onClose}
      tabs={<Tabs value={tab} onChange={setTab} tabs={['Road', 'Addresses', 'Street signs']} />}
      footer={<Button style={{ marginLeft: 'auto' }}>Save</Button>}>
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
            <ReadOnlyField mono value="0" style={readOnlyValueStyle} />
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
      {tab === 'Addresses' && emptyTab}
      {tab === 'Street signs' && emptyTab}
    </AttributePanel>
  );
}
