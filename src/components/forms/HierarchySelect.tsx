import { useState, type CSSProperties } from 'react';
import { Select } from './Select';
import { FormRow } from './FormRow';

export interface HierarchyValue {
  wilaya?: string;
  moughataa?: string;
  commune?: string;
}

export type HierarchyData = Record<string, Record<string, string[]>>;

const LABELS: Record<string, { wilaya: string; moughataa: string; commune: string }> = {
  en: { wilaya: 'Wilaya', moughataa: 'Moughataa', commune: 'Commune' },
  fr: { wilaya: 'Wilaya', moughataa: 'Moughataa', commune: 'Commune' },
  tr: { wilaya: 'Wilaya', moughataa: 'Moughataa', commune: 'Commune' },
};

export interface HierarchySelectProps {
  data?: HierarchyData;
  value?: HierarchyValue;
  onChange?: (value: HierarchyValue) => void;
  labelWidth?: string;
  readOnly?: boolean;
  locale?: string;
  style?: CSSProperties;
}

export function HierarchySelect({
  data = {}, value = {}, onChange, labelWidth = '132px', readOnly = false, locale = 'fr', style,
}: HierarchySelectProps) {
  const [internal, setInternal] = useState<HierarchyValue>(value);
  const cur = { ...internal, ...value };
  const L = LABELS[locale] || LABELS.fr;
  const set = (level: keyof HierarchyValue, v: string) => {
    const next: HierarchyValue =
      level === 'wilaya' ? { wilaya: v } :
      level === 'moughataa' ? { ...cur, moughataa: v, commune: '' } :
      { ...cur, commune: v };
    setInternal(next);
    onChange?.(next);
  };
  const wilayas = Object.keys(data);
  const moughataas = cur.wilaya && data[cur.wilaya] ? Object.keys(data[cur.wilaya]) : [];
  const communes = cur.wilaya && cur.moughataa && data[cur.wilaya] ? (data[cur.wilaya][cur.moughataa] || []) : [];
  return (
    <div style={style}>
      <FormRow label={L.wilaya} labelWidth={labelWidth}>
        <Select options={wilayas} value={cur.wilaya || ''} readOnlyLook={readOnly} disabled={readOnly} onChange={(e) => set('wilaya', e.target.value)} />
      </FormRow>
      <FormRow label={L.moughataa} labelWidth={labelWidth}>
        <Select options={moughataas} value={cur.moughataa || ''} readOnlyLook={readOnly} disabled={readOnly || !cur.wilaya} onChange={(e) => set('moughataa', e.target.value)} />
      </FormRow>
      <FormRow label={L.commune} labelWidth={labelWidth}>
        <Select options={communes} value={cur.commune || ''} readOnlyLook={readOnly} disabled={readOnly || !cur.moughataa} onChange={(e) => set('commune', e.target.value)} />
      </FormRow>
    </div>
  );
}
