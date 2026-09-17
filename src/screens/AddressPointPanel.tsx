import { AttributePanel } from '../components/panels/AttributePanel';
import { PanelSectionHeader } from '../components/panels/PanelSectionHeader';
import { FormRow } from '../components/forms/FormRow';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { Textarea } from '../components/forms/Textarea';
import { ReadOnlyField } from '../components/forms/ReadOnlyField';
import { SearchField } from '../components/forms/SearchField';
import { Button } from '../components/core/Button';
import { Icon } from '../components/core/Icon';
import { StatusBadge } from '../components/core/StatusBadge';

export interface AddressPointPanelProps {
  onClose: () => void;
}

export function AddressPointPanel({ onClose }: AddressPointPanelProps) {
  return (
    <AttributePanel width="420px" title="Address Point" onClose={onClose}
      footer={<>
        <Button variant="secondary" icon={<Icon name="map-pin" size={16} />}>Center</Button>
        <Button style={{ marginLeft: 'auto' }}>Edit</Button>
      </>}>
      <PanelSectionHeader icon={<Icon name="section-location" size={20} />}>Location</PanelSectionHeader>
      <div style={{ padding: '10px 14px' }}>
        <FormRow labelWidth="124px" label="Digital address"><ReadOnlyField mono value="MR-NKC-001-0157" /></FormRow>
        <FormRow labelWidth="124px" label="Coordinates"><ReadOnlyField mono value="18.085312, -15.978451" /></FormRow>
        <FormRow labelWidth="124px" label="Wilaya"><ReadOnlyField value="Nouakchott" /></FormRow>
        <FormRow labelWidth="124px" label="Moughataa"><ReadOnlyField value="Tevragh Zeina" /></FormRow>
        <FormRow labelWidth="124px" label="Street"><SearchField value="Rue de l'Amitié" onChange={() => {}} /></FormRow>
      </div>
      <PanelSectionHeader icon={<Icon name="section-basic-info" size={20} />}>Building</PanelSectionHeader>
      <div style={{ padding: '10px 14px' }}>
        <FormRow labelWidth="124px" label="Building type"><Select defaultValue="Residential" placeholder={null} options={['Residential', 'Commercial', 'Public']} /></FormRow>
        <FormRow labelWidth="124px" label="Use type"><Select defaultValue="Residential" placeholder={null} options={['Residential', 'Business', 'Storage']} /></FormRow>
        <FormRow labelWidth="124px" label="Postal code"><Input mono defaultValue="1000" /></FormRow>
        <FormRow labelWidth="124px" label="Validation"><StatusBadge tone="success">Validated</StatusBadge></FormRow>
        <FormRow layout="stacked" label="Field note"><Textarea rows={2} readOnlyLook defaultValue="Single-storey house with a wall and iron gate on the street frontage." /></FormRow>
      </div>
    </AttributePanel>
  );
}
