export interface QueryPreviewRow {
  id: string;
  digitalAddress: string;
  streetName: string;
  streetCode: string;
  wilaya: string;
  moughataa: string;
  commune: string;
  buildingType: string;
  useType: string;
  namingStatus: string;
  validationStatus: string;
  postalCode: string;
  recordDate: string;
}

export type BulkUpdatePatch = Partial<
  Pick<QueryPreviewRow, 'namingStatus' | 'buildingType' | 'useType' | 'wilaya' | 'validationStatus' | 'postalCode'>
>;

export const QUERY_SOURCES = ['Streets', 'Address Points'] as const;

export const COLUMN_FILTER_OPTIONS = [
  'Street name contains…',
  'Wilaya equals…',
  'Naming status equals…',
  'Building type equals…',
  'Validation status equals…',
] as const;

export const SUMMARY_TYPE_OPTIONS = [
  'None',
  'Count',
  'Count by Wilaya',
  'Count by Naming status',
] as const;

export const GROUP_BY_OPTIONS = [
  'None',
  'Wilaya',
  'Moughataa',
  'Commune',
  'Building type',
  'Naming status',
] as const;

export const SAVED_QUERIES = [
  'Unnamed streets in Tevragh Zeina',
  'Validated address points — Nouakchott',
  'Proposed names pending review',
] as const;

export const PREVIEW_COLUMNS = [
  { key: 'digitalAddress', label: 'Digital address' },
  { key: 'streetName', label: 'Street name' },
  { key: 'streetCode', label: 'Street code' },
  { key: 'wilaya', label: 'Wilaya' },
  { key: 'moughataa', label: 'Moughataa' },
  { key: 'commune', label: 'Commune' },
  { key: 'buildingType', label: 'Building type' },
  { key: 'useType', label: 'Use type' },
  { key: 'namingStatus', label: 'Naming status' },
  { key: 'validationStatus', label: 'Validation status' },
  { key: 'postalCode', label: 'Postal code' },
  { key: 'recordDate', label: 'Record date' },
] as const;

export type PreviewColumnKey = (typeof PREVIEW_COLUMNS)[number]['key'];

export const MOCK_PREVIEW_ROWS: QueryPreviewRow[] = [
  {
    id: 'r1',
    digitalAddress: 'MR-NKC-001-0157',
    streetName: "Rue de l'Amitié",
    streetCode: 'ST-0157',
    wilaya: 'Nouakchott',
    moughataa: 'Tevragh Zeina',
    commune: 'Tevragh Zeina',
    buildingType: 'Residential',
    useType: 'Residential',
    namingStatus: 'Official',
    validationStatus: 'Validated',
    postalCode: '1000',
    recordDate: '12.11.2025',
  },
  {
    id: 'r2',
    digitalAddress: 'MR-NKC-001-0162',
    streetName: 'Avenue Gamal Abdel Nasser',
    streetCode: 'ST-0162',
    wilaya: 'Nouakchott',
    moughataa: 'Tevragh Zeina',
    commune: 'Tevragh Zeina',
    buildingType: 'Commercial',
    useType: 'Business',
    namingStatus: 'Official',
    validationStatus: 'Validated',
    postalCode: '1000',
    recordDate: '08.10.2025',
  },
  {
    id: 'r3',
    digitalAddress: 'MR-NKC-002-0041',
    streetName: 'Rue Mamadou Konaté',
    streetCode: 'ST-0041',
    wilaya: 'Nouakchott',
    moughataa: 'Tevragh Zeina',
    commune: 'Ksar',
    buildingType: 'Residential',
    useType: 'Residential',
    namingStatus: 'Proposed',
    validationStatus: 'Pending',
    postalCode: '1001',
    recordDate: '22.09.2025',
  },
  {
    id: 'r4',
    digitalAddress: 'MR-NKC-003-0088',
    streetName: 'Boulevard Général de Gaulle',
    streetCode: 'ST-0088',
    wilaya: 'Nouakchott',
    moughataa: 'Ksar',
    commune: 'Ksar',
    buildingType: 'Public',
    useType: 'Storage',
    namingStatus: 'Official',
    validationStatus: 'Validated',
    postalCode: '1001',
    recordDate: '01.01.2003',
  },
  {
    id: 'r5',
    digitalAddress: 'MR-NKC-004-0210',
    streetName: 'Avenue Mokhtar Ould Daddah',
    streetCode: 'ST-0210',
    wilaya: 'Nouakchott Nord',
    moughataa: 'Dar Naim',
    commune: 'Dar Naim 1',
    buildingType: 'Residential',
    useType: 'Residential',
    namingStatus: 'Unnamed',
    validationStatus: 'Pending',
    postalCode: '2000',
    recordDate: '15.08.2025',
  },
  {
    id: 'r6',
    digitalAddress: 'MR-NKC-005-0033',
    streetName: 'Boulevard Teyaret',
    streetCode: 'ST-0033',
    wilaya: 'Nouakchott Nord',
    moughataa: 'Teyaret',
    commune: 'Teyaret',
    buildingType: 'Commercial',
    useType: 'Business',
    namingStatus: 'Proposed',
    validationStatus: 'Rejected',
    postalCode: '2000',
    recordDate: '03.07.2025',
  },
  {
    id: 'r7',
    digitalAddress: 'MR-NKC-006-0119',
    streetName: 'Rue de la Corniche',
    streetCode: 'ST-0119',
    wilaya: 'Nouakchott',
    moughataa: 'Tevragh Zeina',
    commune: 'Ksar',
    buildingType: 'Residential',
    useType: 'Residential',
    namingStatus: 'Official',
    validationStatus: 'Validated',
    postalCode: '1002',
    recordDate: '19.06.2025',
  },
  {
    id: 'r8',
    digitalAddress: 'MR-NKC-007-0075',
    streetName: 'Avenue de la Plage',
    streetCode: 'ST-0075',
    wilaya: 'Nouakchott Ouest',
    moughataa: 'Tevragh Zeina',
    commune: 'Commune 1',
    buildingType: 'Public',
    useType: 'Storage',
    namingStatus: 'Proposed',
    validationStatus: 'Pending',
    postalCode: '1002',
    recordDate: '28.05.2025',
  },
];

export const BULK_NAMING_STATUS = ['Unnamed', 'Proposed', 'Official'] as const;
export const BULK_BUILDING_TYPE = ['Residential', 'Commercial', 'Public'] as const;
export const BULK_USE_TYPE = ['Residential', 'Business', 'Storage'] as const;
export const BULK_WILAYA = ['Nouakchott', 'Nouakchott Ouest', 'Nouakchott Nord'] as const;
export const BULK_VALIDATION = ['Pending', 'Validated', 'Rejected'] as const;
export const BULK_POSTAL_CODE = ['1000', '1001', '1002', '2000'] as const;
