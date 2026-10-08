export type Locale = 'en' | 'fr';

export interface Messages {
  lang: {
    menu: string;
    english: string;
    french: string;
  };
  common: {
    close: string;
    save: string;
    delete: string;
    edit: string;
    center: string;
    search: string;
    reset: string;
    show: string;
    back: string;
    next: string;
    continue: string;
    clear: string;
    optional: string;
    minimize: string;
    restore: string;
    select: string;
    yes: string;
    no: string;
    information: string;
    remove: (label: string) => string;
  };
  nav: {
    addresses: string;
    drawStreet: string;
    drawPoint: string;
    movePoint: string;
    quickSearch: string;
    hierarchical: string;
    tasks: string;
    dashboard: string;
    account: string;
    workspace: string;
    showMenu: string;
    hideMenu: string;
    addressDetection: string;
    addressDetectionButton: string;
  };
  rail: {
    favorites: string;
    info: string;
    pan: string;
    clear: string;
    satellite: string;
    locate: string;
    extent: string;
    measure: string;
    cloud: string;
    target: string;
    mapTools: string;
    searchGeocode: string;
    myLocation: string;
    zoomLevel: string;
    zoomIn: string;
    zoomOut: string;
    drawPolygon: string;
    drawStreet: string;
    drawPoint: string;
    addressPoint: (number: string) => string;
  };
  status: {
    crs: string;
    scale: string;
    lat: string;
    lon: string;
    copy: string;
  };
  catalog: {
    Residential: string;
    Commercial: string;
    Public: string;
    Business: string;
    Storage: string;
    MixedUse: string;
    Validated: string;
    Pending: string;
    Rejected: string;
    Official: string;
    Proposed: string;
    Unnamed: string;
    ToBeNamed: string;
    Boulevard: string;
    Avenue: string;
    Rue: string;
    Ruelle: string;
    Open: string;
    UnderConstruction: string;
    Closed: string;
    Private: string;
    Mixed: string;
    NO: string;
    leaseOrUtility: string;
    signatureCircular: string;
    idColor: string;
    typeNew: string;
    typeCorrection: string;
    typeOfficial: string;
    formIndividual: string;
    formCorporate: string;
    formProxy: string;
    number: string;
    text: string;
    boolean: string;
    date: string;
  };
  address: {
    title: string;
    location: string;
    digitalAddress: string;
    coordinates: string;
    wilaya: string;
    moughataa: string;
    commune: string;
    street: string;
    building: string;
    buildingType: string;
    useType: string;
    postalCode: string;
    validation: string;
    fieldNote: string;
    fieldNoteText: string;
    demand: string;
    identifier: string;
    date: string;
    status: string;
  };
  street: {
    road: string;
    addresses: string;
    signs: string;
    empty: string;
    addressCount: (n: number) => string;
    allCertified: string;
    numberList: string;
    certified: string;
    notCertified: string;
    centerOn: (number: string) => string;
    id: string;
    roadCode: string;
    roadType: string;
    selectRoadType: string;
    roadName: string;
    roadStatus: string;
    selectRoadStatus: string;
    roadOwnership: string;
    selectRoadOwnership: string;
    wilaya: string;
    moughataa: string;
    commune: string;
    locality: string;
    description: string;
    dataHistory: string;
  };
  demand: {
    title: string;
    close: string;
    photo1: string;
    photo2: string;
    photoAlt: (n: number) => string;
    id: string;
    fullName: string;
    phone: string;
    document: string;
    showOnMap: string;
    changeAddress: string;
    accept: string;
    reject: string;
  };
  login: {
    title: string;
    heading: string;
    hint: string;
    usernameOrEmail: string;
    password: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    selectDomain: string;
    username: string;
    remember: string;
    forgot: string;
    domainDigital: string;
  };
  detect: {
    title: string;
    intro: string;
    privacy: string;
    appType: string;
    userDetails: string;
    documents: string;
    readUnderstood: string;
    prepareDocs: string;
    docLease: string;
    docProxy: string;
    docId: string;
    requiredDocs: string;
    reqWater: string;
    reqBusiness: string;
    reqUrban: string;
    privacyAgreeBefore: string;
    privacyNotice: string;
    privacyAgreeAfter: string;
    selectDistrict: string;
    selectType: string;
    selectForm: string;
    id: string;
    birthDate: string;
    verifyPerson: string;
    enterFullName: string;
    phone: string;
    upload: string;
    accepted: (formats: string) => string;
    docLeaseLong: string;
    sendSms: string;
    wizardLead: string;
  };
  geocode: {
    title: string;
    baseGrid: string;
    abscissa: string;
    ordinate: string;
  };
  hierarchy: {
    title: string;
    selectWilaya: string;
    selectMoughataa: string;
    selectCommune: string;
    selectStreet: string;
  };
  query: {
    title: string;
    preview: string;
    locate: string;
    layers: string;
    deleteSelected: string;
    columnsShown: (n: number) => string;
    export: string;
    print: string;
    bulkUpdate: string;
    stop: string;
    selectAll: string;
    selectRow: (id: string) => string;
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
    selectPlaceholder: string;
    bulkTitle: string;
    filterColumn: (label: string) => string;
    noResults: string;
  };
  tasks: {
    title: string;
    list: string;
    newMission: string;
    task: string;
    createdAt: string;
    empty: string;
    edit: (name: string) => string;
    delete: (name: string) => string;
    actions: string;
    rowsPerPage: string;
    first: string;
    previous: string;
    next: string;
    last: string;
    range: (from: number, to: number, total: number) => string;
    details: string;
    closeDetails: string;
    newMissionBadge: string;
    mission: string;
    stepMission: string;
    stepDuty: string;
    stepColumns: string;
    stepUsers: string;
    missionInfo: string;
    taskName: string;
    taskPlaceholder: string;
    taskHint: string;
    dutyTitle: string;
    hierarchical: string;
    polygon: string;
    selectWilaya: string;
    selectMoughataa: string;
    selectCommune: string;
    polygonHelp: string;
    polygonSet: (n: number) => string;
    drawing: string;
    clearPolygon: string;
    columnsTitle: string;
    columnsHelp: (n: number) => string;
    tableName: string;
    columnName: string;
    filterTables: string;
    filterColumns: string;
    tableRoad: string;
    tablePoint: string;
    columnsCount: (n: number) => string;
    selectedColumns: (n: number) => string;
    userChoice: string;
    searchUsers: string;
    name: string;
    surname: string;
    email: string;
    noData: string;
    selectedUsers: (n: number) => string;
    back: string;
    nextStep: string;
  };
  field: {
    title: string;
    reject: string;
    revise: string;
    approve: string;
    photo: string;
    photoAlt: string;
    record: string;
    validated: string;
    rejected: string;
    reviseSent: string;
    awaiting: string;
    digitalAddress: string;
    coordinates: string;
    accuracy: string;
    buildingType: string;
    collectedBy: string;
    recordDate: string;
    note: string;
    notePlaceholder: string;
  };
  dashboard: {
    pointsByUnit: string;
    byWilaya: string;
    byMoughataa: string;
    byCommune: string;
    totalPoints: string;
    other: string;
    certStatus: string;
    approved: string;
    pending: string;
    rejected: string;
    underReview: string;
    totalApplications: string;
    pointsOverTime: string;
    monthly: string;
    quarterly: string;
    yearly: string;
    pointCountAxis: string;
    totalCertTitle: string;
    months: {
      jan: string;
      feb: string;
      mar: string;
      apr: string;
      may: string;
      jun: string;
      jul: string;
      aug: string;
      sep: string;
    };
    quarter: (n: number, year: number) => string;
  };
}

const catalogEn: Messages['catalog'] = {
  Residential: 'Residential',
  Commercial: 'Commercial',
  Public: 'Public',
  Business: 'Business',
  Storage: 'Storage',
  MixedUse: 'Mixed use',
  Validated: 'Validated',
  Pending: 'Pending',
  Rejected: 'Rejected',
  Official: 'Official',
  Proposed: 'Proposed',
  Unnamed: 'Unnamed',
  ToBeNamed: 'To be named',
  Boulevard: 'Boulevard',
  Avenue: 'Avenue',
  Rue: 'Rue',
  Ruelle: 'Ruelle',
  Open: 'Open',
  UnderConstruction: 'Under construction',
  Closed: 'Closed',
  Private: 'Private',
  Mixed: 'Mixed',
  NO: 'NO',
  leaseOrUtility: 'Lease agreement, title deed, or utility bill',
  signatureCircular: 'Signature circular / power of attorney',
  idColor: 'ID front and back (color)',
  typeNew: 'New address detection',
  typeCorrection: 'Address correction',
  typeOfficial: 'Detection for official document',
  formIndividual: 'Individual',
  formCorporate: 'Corporate',
  formProxy: 'Via proxy',
  number: 'number',
  text: 'text',
  boolean: 'boolean',
  date: 'date',
};

const catalogFr: Messages['catalog'] = {
  Residential: 'Résidentiel',
  Commercial: 'Commercial',
  Public: 'Public',
  Business: 'Activité',
  Storage: 'Stockage',
  MixedUse: 'Usage mixte',
  Validated: 'Validé',
  Pending: 'En attente',
  Rejected: 'Rejeté',
  Official: 'Officiel',
  Proposed: 'Proposé',
  Unnamed: 'Sans nom',
  ToBeNamed: 'À nommer',
  Boulevard: 'Boulevard',
  Avenue: 'Avenue',
  Rue: 'Rue',
  Ruelle: 'Ruelle',
  Open: 'Ouvert',
  UnderConstruction: 'En construction',
  Closed: 'Fermé',
  Private: 'Privé',
  Mixed: 'Mixte',
  NO: 'NON',
  leaseOrUtility: 'Contrat de bail, titre de propriété ou facture de service',
  signatureCircular: 'Signature circulaire / procuration',
  idColor: 'Recto et verso de la pièce d’identité (couleur)',
  typeNew: 'Nouvelle détection d’adresse',
  typeCorrection: 'Correction d’adresse',
  typeOfficial: 'Détection pour document officiel',
  formIndividual: 'Particulier',
  formCorporate: 'Entreprise',
  formProxy: 'Par procuration',
  number: 'nombre',
  text: 'texte',
  boolean: 'booléen',
  date: 'date',
};

export const messages: Record<Locale, Messages> = {
  en: {
    lang: { menu: 'Language', english: 'English', french: 'Français' },
    common: {
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      center: 'Center',
      search: 'Search',
      reset: 'Reset',
      show: 'Show',
      back: 'Back',
      next: 'Next',
      continue: 'Continue',
      clear: 'Clear',
      optional: 'Optional',
      minimize: 'Minimize',
      restore: 'Restore',
      select: 'Select...',
      yes: 'YES',
      no: 'NO',
      information: 'Information',
      remove: (label) => `Remove ${label}`,
    },
    nav: {
      addresses: 'Addresses',
      drawStreet: 'Draw Street',
      drawPoint: 'Draw Address Point',
      movePoint: 'Move Point',
      quickSearch: 'Quick Search',
      hierarchical: 'Hierarchical Address Search',
      tasks: 'Task Management',
      dashboard: 'Dashboard',
      account: 'Account',
      workspace: 'Workspace',
      showMenu: 'Show menu',
      hideMenu: 'Hide menu',
      addressDetection: 'Address Detection',
      addressDetectionButton: 'ADDRESS DETECTION',
    },
    rail: {
      favorites: 'Favorites',
      info: 'Info',
      pan: 'Pan',
      clear: 'Clear',
      satellite: 'Satellite',
      locate: 'Locate',
      extent: 'Extent',
      measure: 'Measure',
      cloud: 'Cloud',
      target: 'Target',
      mapTools: 'Map tools',
      searchGeocode: 'Search Geocode',
      myLocation: 'My location',
      zoomLevel: 'Zoom level',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      drawPolygon: 'Click on the map to add polygon vertices — double-click to finish',
      drawStreet: 'Click on the map to add vertices — double-click to finish the street',
      drawPoint: 'Click on the map to place an address point',
      addressPoint: (number) => `Address point ${number}`,
    },
    status: {
      crs: 'Coordinate system',
      scale: 'Scale',
      lat: 'Lat',
      lon: 'Lon',
      copy: 'Copy coordinates',
    },
    catalog: catalogEn,
    address: {
      title: 'Address Point',
      location: 'Location',
      digitalAddress: 'Digital address',
      coordinates: 'Coordinates',
      wilaya: 'Wilaya',
      moughataa: 'Moughataa',
      commune: 'Commune',
      street: 'Street',
      building: 'Building',
      buildingType: 'Building type',
      useType: 'Use type',
      postalCode: 'Postal code',
      validation: 'Validation',
      fieldNote: 'Field note',
      fieldNoteText: 'Single-storey house with a wall and iron gate on the street frontage.',
      demand: 'Demand',
      identifier: 'Identifier',
      date: 'Date',
      status: 'Status',
    },
    street: {
      road: 'Road',
      addresses: 'Addresses',
      signs: 'Street signs',
      empty: 'No records found.',
      addressCount: (n) => `Number of addresses on the road : ${n}`,
      allCertified: 'All road addresses are certified : NO',
      numberList: 'List of numbers',
      certified: 'Certified',
      notCertified: 'Not certified',
      centerOn: (number) => `Center on address ${number}`,
      id: 'ID',
      roadCode: 'Road code',
      roadType: 'Road type',
      selectRoadType: 'Select road type',
      roadName: 'Road name',
      roadStatus: 'Road status',
      selectRoadStatus: 'Select road status',
      roadOwnership: 'Road ownership',
      selectRoadOwnership: 'Select road ownership',
      wilaya: 'Wilaya',
      moughataa: 'Moughataa',
      commune: 'Commune',
      locality: 'Locality',
      description: 'Description',
      dataHistory: 'Data history',
    },
    demand: {
      title: 'Demand verification',
      close: 'Close demand',
      photo1: 'Photo 1',
      photo2: 'Photo 2',
      photoAlt: (n) => `Demand photo ${n}`,
      id: 'ID',
      fullName: 'Full name',
      phone: 'Phone number',
      document: 'Document',
      showOnMap: 'Show demand on the map',
      changeAddress: 'Change the demand address',
      accept: 'Accept the demand (and certify the address)',
      reject: 'Do not accept',
    },
    login: {
      title: 'Login',
      heading: 'Log into your account',
      hint: 'You can log in with your username and password.',
      usernameOrEmail: 'Username or Email',
      password: 'Password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      submit: 'Login',
      selectDomain: 'Select domain',
      username: 'Username',
      remember: 'Remember me',
      forgot: 'I forgot my password',
      domainDigital: 'Mauritania Digital Addressing',
    },
    detect: {
      title: 'Address Detection Application',
      intro: 'Privacy',
      privacy: 'Privacy',
      appType: 'Application type',
      userDetails: 'User details',
      documents: 'Documents',
      readUnderstood: 'I have read and understood',
      prepareDocs: 'To complete your application, please prepare the following documents electronically before you begin.',
      docLease: 'Lease agreement or title deed, utility bill (electricity, water, gas), insurance policy, or another document showing the address',
      docProxy: 'Signature circular / power of attorney',
      docId: 'Color photo of ID front and back',
      requiredDocs: 'Required documents',
      reqWater: 'Water, electricity, and gas subscription procedures',
      reqBusiness: 'Business opening license procedures',
      reqUrban: 'Urban renewal (rent support), civil registry declaration procedures',
      privacyAgreeBefore: 'I have read, understood, and agree to the',
      privacyNotice: 'Privacy Notice',
      privacyAgreeAfter: 'regarding the processing of my personal data.',
      selectDistrict: 'Select district',
      selectType: 'Select application type',
      selectForm: 'Select application form',
      id: 'ID',
      birthDate: 'Date of birth',
      verifyPerson: 'Verify person',
      enterFullName: 'Enter full name',
      phone: 'Phone number',
      upload: 'Click to upload or drag and drop',
      accepted: (formats) => `Accepted formats: ${formats}`,
      docLeaseLong: 'Lease agreement, title deed, utility bill (electricity, water, gas, insurance), or another document showing the address',
      sendSms: 'Send application for SMS approval',
      wizardLead: 'Complete your application easily by filling in the required information step by step for your address detection process.',
    },
    geocode: {
      title: 'Search Geocode',
      baseGrid: 'Base Grid',
      abscissa: 'Abscissa :',
      ordinate: 'Ordinate :',
    },
    hierarchy: {
      title: 'Hierarchical Address Search',
      selectWilaya: 'Select a wilaya',
      selectMoughataa: 'Select a moughataa',
      selectCommune: 'Select a commune',
      selectStreet: 'Select a street',
    },
    query: {
      title: 'Quick Search',
      preview: 'Query Preview',
      locate: 'Locate on map',
      layers: 'Layers',
      deleteSelected: 'Delete selected',
      columnsShown: (n) => `${n} columns shown`,
      export: 'Export',
      print: 'Print',
      bulkUpdate: 'Bulk Update',
      stop: 'Stop',
      selectAll: 'Select all',
      selectRow: (id) => `Select ${id}`,
      digitalAddress: 'Digital address',
      streetName: 'Street name',
      streetCode: 'Street code',
      wilaya: 'Wilaya',
      moughataa: 'Moughataa',
      commune: 'Commune',
      buildingType: 'Building type',
      useType: 'Use type',
      namingStatus: 'Naming status',
      validationStatus: 'Validation status',
      postalCode: 'Postal code',
      recordDate: 'Record date',
      selectPlaceholder: 'Select…',
      bulkTitle: 'Bulk Address Update',
      filterColumn: (label) => `Filter ${label}`,
      noResults: 'No matching rows',
    },
    tasks: {
      title: 'Task Management',
      list: 'Task List',
      newMission: '+ New Mission',
      task: 'Task',
      createdAt: 'Creation Date',
      empty: 'No missions found',
      edit: (name) => `Edit ${name}`,
      delete: (name) => `Delete ${name}`,
      actions: 'Actions',
      rowsPerPage: 'Rows per page',
      first: 'First page',
      previous: 'Previous page',
      next: 'Next page',
      last: 'Last page',
      range: (from, to, total) => `${from} to ${to} of ${total}`,
      details: 'Task Details',
      closeDetails: 'Close details',
      newMissionBadge: 'New mission',
      mission: 'Mission',
      stepMission: 'Mission Information',
      stepDuty: 'Selection of Duty Place',
      stepColumns: 'Table and Column Selection',
      stepUsers: 'User Information',
      missionInfo: 'Mission Information',
      taskName: 'Task Name/Description',
      taskPlaceholder: 'Enter a task name or short description',
      taskHint: 'The task name or a short description can be entered.',
      dutyTitle: 'Selection of Duty Place',
      hierarchical: 'Hierarchical Selection',
      polygon: 'Polygon Drawing',
      selectWilaya: 'Select wilaya...',
      selectMoughataa: 'Select moughataa...',
      selectCommune: 'Select commune...',
      polygonHelp: 'Click on the map to add polygon vertices. Double-click to finish. Only features inside the polygon stay highlighted.',
      polygonSet: (n) => `Polygon set (${n} vertices)`,
      drawing: 'Drawing… click the map behind this panel.',
      clearPolygon: 'Clear polygon',
      columnsTitle: 'Table and Column Selection',
      columnsHelp: (n) => `Select columns from Road and Point tables. (${n} column${n === 1 ? '' : 's'} selected)`,
      tableName: 'Table Name...',
      columnName: 'Column Name...',
      filterTables: 'Filter tables',
      filterColumns: 'Filter columns',
      tableRoad: 'Road',
      tablePoint: 'Point',
      columnsCount: (n) => `${n} columns`,
      selectedColumns: (n) => `Selected Columns (${n}):`,
      userChoice: 'User Choice',
      searchUsers: 'Search users',
      name: 'Name',
      surname: 'Surname',
      email: 'E-mail',
      noData: 'No Data Found',
      selectedUsers: (n) => `Selected Users (${n}):`,
      back: '← Back',
      nextStep: 'Next →',
    },
    field: {
      title: 'Field Record Validation',
      reject: 'Reject',
      revise: 'Revise',
      approve: 'Approve',
      photo: 'Field photo',
      photoAlt: 'Single-storey house with iron gate',
      record: 'Record',
      validated: 'Validated',
      rejected: 'Rejected',
      reviseSent: 'Sent for revision',
      awaiting: 'Awaiting validation',
      digitalAddress: 'Digital address',
      coordinates: 'Coordinates',
      accuracy: 'Accuracy',
      buildingType: 'Building type',
      collectedBy: 'Collected by',
      recordDate: 'Record date',
      note: 'Validator note',
      notePlaceholder: 'Enter a note...',
    },
    dashboard: {
      pointsByUnit: 'Address Point Count by Administrative Unit',
      byWilaya: 'By Wilaya',
      byMoughataa: 'By Moughataa',
      byCommune: 'By Commune',
      totalPoints: 'TOTAL ADDRESS POINTS',
      other: 'Other',
      certStatus: 'Address Certificate Application Status',
      approved: 'Approved',
      pending: 'Pending',
      rejected: 'Rejected',
      underReview: 'Under Review',
      totalApplications: 'TOTAL APPLICATIONS',
      pointsOverTime: 'Address Point Count Over Time',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly',
      pointCountAxis: 'Address Point Count',
      totalCertTitle: 'Total Address Certificate Applications',
      months: {
        jan: 'January',
        feb: 'February',
        mar: 'March',
        apr: 'April',
        may: 'May',
        jun: 'June',
        jul: 'July',
        aug: 'August',
        sep: 'September',
      },
      quarter: (n, year) => `Q${n} ${year}`,
    },
  },
  fr: {
    lang: { menu: 'Langue', english: 'English', french: 'Français' },
    common: {
      close: 'Fermer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      center: 'Centrer',
      search: 'Rechercher',
      reset: 'Réinitialiser',
      show: 'Afficher',
      back: 'Retour',
      next: 'Suivant',
      continue: 'Continuer',
      clear: 'Effacer',
      optional: 'Facultatif',
      minimize: 'Réduire',
      restore: 'Restaurer',
      select: 'Sélectionner...',
      yes: 'OUI',
      no: 'NON',
      information: 'Informations',
      remove: (label) => `Retirer ${label}`,
    },
    nav: {
      addresses: 'Adresses',
      drawStreet: 'Tracer une rue',
      drawPoint: 'Tracer un point d’adresse',
      movePoint: 'Déplacer le point',
      quickSearch: 'Recherche rapide',
      hierarchical: 'Recherche d’adresse hiérarchique',
      tasks: 'Gestion des tâches',
      dashboard: 'Tableau de bord',
      account: 'Compte',
      workspace: 'Espace de travail',
      showMenu: 'Afficher le menu',
      hideMenu: 'Masquer le menu',
      addressDetection: 'Détection d’adresse',
      addressDetectionButton: 'DÉTECTION D’ADRESSE',
    },
    rail: {
      favorites: 'Favoris',
      info: 'Info',
      pan: 'Déplacer',
      clear: 'Effacer',
      satellite: 'Satellite',
      locate: 'Localiser',
      extent: 'Étendue',
      measure: 'Mesurer',
      cloud: 'Nuage',
      target: 'Cible',
      mapTools: 'Outils de la carte',
      searchGeocode: 'Rechercher un géocode',
      myLocation: 'Ma position',
      zoomLevel: 'Niveau de zoom',
      zoomIn: 'Zoom avant',
      zoomOut: 'Zoom arrière',
      drawPolygon: 'Cliquez sur la carte pour ajouter des sommets — double-cliquez pour terminer',
      drawStreet: 'Cliquez sur la carte pour ajouter des sommets — double-cliquez pour terminer la rue',
      drawPoint: 'Cliquez sur la carte pour placer un point d’adresse',
      addressPoint: (number) => `Point d’adresse ${number}`,
    },
    status: {
      crs: 'Système de coordonnées',
      scale: 'Échelle',
      lat: 'Lat',
      lon: 'Lon',
      copy: 'Copier les coordonnées',
    },
    catalog: catalogFr,
    address: {
      title: 'Point d’adresse',
      location: 'Localisation',
      digitalAddress: 'Adresse numérique',
      coordinates: 'Coordonnées',
      wilaya: 'Wilaya',
      moughataa: 'Moughataa',
      commune: 'Commune',
      street: 'Rue',
      building: 'Bâtiment',
      buildingType: 'Type de bâtiment',
      useType: 'Type d’usage',
      postalCode: 'Code postal',
      validation: 'Validation',
      fieldNote: 'Note de terrain',
      fieldNoteText: 'Maison de plain-pied avec un mur et un portail en fer sur la façade.',
      demand: 'Demande',
      identifier: 'Identifiant',
      date: 'Date',
      status: 'Statut',
    },
    street: {
      road: 'Route',
      addresses: 'Adresses',
      signs: 'Plaques de rue',
      empty: 'Aucun enregistrement.',
      addressCount: (n) => `Nombre d’adresses sur la route : ${n}`,
      allCertified: 'Toutes les adresses de la route sont certifiées : NON',
      numberList: 'Liste des numéros',
      certified: 'Certifié',
      notCertified: 'Non certifié',
      centerOn: (number) => `Centrer sur l’adresse ${number}`,
      id: 'ID',
      roadCode: 'Code de route',
      roadType: 'Type de route',
      selectRoadType: 'Sélectionner le type de route',
      roadName: 'Nom de la route',
      roadStatus: 'Statut de la route',
      selectRoadStatus: 'Sélectionner le statut de la route',
      roadOwnership: 'Propriété de la route',
      selectRoadOwnership: 'Sélectionner la propriété de la route',
      wilaya: 'Wilaya',
      moughataa: 'Moughataa',
      commune: 'Commune',
      locality: 'Localité',
      description: 'Description',
      dataHistory: 'Historique des données',
    },
    demand: {
      title: 'Vérification de la demande',
      close: 'Fermer la demande',
      photo1: 'Photo 1',
      photo2: 'Photo 2',
      photoAlt: (n) => `Photo de la demande ${n}`,
      id: 'ID',
      fullName: 'Nom complet',
      phone: 'Numéro de téléphone',
      document: 'Document',
      showOnMap: 'Afficher la demande sur la carte',
      changeAddress: 'Modifier l’adresse de la demande',
      accept: 'Accepter la demande (et certifier l’adresse)',
      reject: 'Ne pas accepter',
    },
    login: {
      title: 'Connexion',
      heading: 'Connectez-vous à votre compte',
      hint: 'Vous pouvez vous connecter avec votre nom d’utilisateur et votre mot de passe.',
      usernameOrEmail: 'Nom d’utilisateur ou e-mail',
      password: 'Mot de passe',
      showPassword: 'Afficher le mot de passe',
      hidePassword: 'Masquer le mot de passe',
      submit: 'Connexion',
      selectDomain: 'Sélectionner le domaine',
      username: 'Nom d’utilisateur',
      remember: 'Se souvenir de moi',
      forgot: 'J’ai oublié mon mot de passe',
      domainDigital: 'Adressage numérique de la Mauritanie',
    },
    detect: {
      title: 'Demande de détection d’adresse',
      intro: 'Confidentialité',
      privacy: 'Confidentialité',
      appType: 'Type de demande',
      userDetails: 'Coordonnées',
      documents: 'Documents',
      readUnderstood: 'J’ai lu et compris',
      prepareDocs: 'Pour compléter votre demande, préparez les documents suivants au format électronique avant de commencer.',
      docLease: 'Contrat de bail ou titre de propriété, facture (électricité, eau, gaz), police d’assurance ou un autre document indiquant l’adresse',
      docProxy: 'Signature circulaire / procuration',
      docId: 'Photo couleur du recto et du verso de la pièce d’identité',
      requiredDocs: 'Documents requis',
      reqWater: 'Procédures d’abonnement à l’eau, à l’électricité et au gaz',
      reqBusiness: 'Procédures de licence d’ouverture d’établissement',
      reqUrban: 'Rénovation urbaine (aide au loyer), procédures de déclaration à l’état civil',
      privacyAgreeBefore: 'J’ai lu, compris et j’accepte l’',
      privacyNotice: 'avis de confidentialité',
      privacyAgreeAfter: 'relatif au traitement de mes données personnelles.',
      selectDistrict: 'Sélectionner le district',
      selectType: 'Sélectionner le type de demande',
      selectForm: 'Sélectionner la forme de demande',
      id: 'Identifiant',
      birthDate: 'Date de naissance',
      verifyPerson: 'Vérifier la personne',
      enterFullName: 'Saisir le nom complet',
      phone: 'Numéro de téléphone',
      upload: 'Cliquez pour téléverser ou glissez-déposez',
      accepted: (formats) => `Formats acceptés : ${formats}`,
      docLeaseLong: 'Contrat de bail, titre de propriété, facture (électricité, eau, gaz, assurance) ou un autre document indiquant l’adresse',
      sendSms: 'Envoyer la demande pour approbation par SMS',
      wizardLead: 'Complétez facilement votre demande en remplissant les informations requises, étape par étape, pour la détection de votre adresse.',
    },
    geocode: {
      title: 'Rechercher un géocode',
      baseGrid: 'Grille de base',
      abscissa: 'Abscisse :',
      ordinate: 'Ordonnée :',
    },
    hierarchy: {
      title: 'Recherche d’adresse hiérarchique',
      selectWilaya: 'Sélectionner une wilaya',
      selectMoughataa: 'Sélectionner une moughataa',
      selectCommune: 'Sélectionner une commune',
      selectStreet: 'Sélectionner une rue',
    },
    query: {
      title: 'Recherche rapide',
      preview: 'Aperçu de la requête',
      locate: 'Localiser sur la carte',
      layers: 'Couches',
      deleteSelected: 'Supprimer la sélection',
      columnsShown: (n) => `${n} colonnes affichées`,
      export: 'Exporter',
      print: 'Imprimer',
      bulkUpdate: 'Mise à jour groupée',
      stop: 'Arrêter',
      selectAll: 'Tout sélectionner',
      selectRow: (id) => `Sélectionner ${id}`,
      digitalAddress: 'Adresse numérique',
      streetName: 'Nom de la rue',
      streetCode: 'Code de la rue',
      wilaya: 'Wilaya',
      moughataa: 'Moughataa',
      commune: 'Commune',
      buildingType: 'Type de bâtiment',
      useType: 'Type d’usage',
      namingStatus: 'Statut de dénomination',
      validationStatus: 'Statut de validation',
      postalCode: 'Code postal',
      recordDate: 'Date d’enregistrement',
      selectPlaceholder: 'Sélectionner…',
      bulkTitle: 'Mise à jour groupée des adresses',
      filterColumn: (label) => `Filtrer ${label}`,
      noResults: 'Aucun résultat',
    },
    tasks: {
      title: 'Gestion des tâches',
      list: 'Liste des tâches',
      newMission: '+ Nouvelle mission',
      task: 'Tâche',
      createdAt: 'Date de création',
      empty: 'Aucune mission trouvée',
      edit: (name) => `Modifier ${name}`,
      delete: (name) => `Supprimer ${name}`,
      actions: 'Actions',
      rowsPerPage: 'Lignes par page',
      first: 'Première page',
      previous: 'Page précédente',
      next: 'Page suivante',
      last: 'Dernière page',
      range: (from, to, total) => `${from} à ${to} sur ${total}`,
      details: 'Détails de la tâche',
      closeDetails: 'Fermer les détails',
      newMissionBadge: 'Nouvelle mission',
      mission: 'Mission',
      stepMission: 'Informations de la mission',
      stepDuty: 'Choix du lieu de mission',
      stepColumns: 'Sélection des tables et colonnes',
      stepUsers: 'Informations utilisateur',
      missionInfo: 'Informations de la mission',
      taskName: 'Nom / description de la tâche',
      taskPlaceholder: 'Saisir un nom de tâche ou une courte description',
      taskHint: 'Le nom de la tâche ou une courte description peut être saisi.',
      dutyTitle: 'Choix du lieu de mission',
      hierarchical: 'Sélection hiérarchique',
      polygon: 'Tracé de polygone',
      selectWilaya: 'Sélectionner une wilaya...',
      selectMoughataa: 'Sélectionner une moughataa...',
      selectCommune: 'Sélectionner une commune...',
      polygonHelp: 'Cliquez sur la carte pour ajouter des sommets. Double-cliquez pour terminer. Seuls les éléments à l’intérieur du polygone restent mis en évidence.',
      polygonSet: (n) => `Polygone défini (${n} sommets)`,
      drawing: 'Tracé… cliquez sur la carte derrière ce panneau.',
      clearPolygon: 'Effacer le polygone',
      columnsTitle: 'Sélection des tables et colonnes',
      columnsHelp: (n) => `Sélectionnez des colonnes dans les tables Route et Point. (${n} colonne${n === 1 ? '' : 's'} sélectionnée${n === 1 ? '' : 's'})`,
      tableName: 'Nom de la table...',
      columnName: 'Nom de la colonne...',
      filterTables: 'Filtrer les tables',
      filterColumns: 'Filtrer les colonnes',
      tableRoad: 'Route',
      tablePoint: 'Point',
      columnsCount: (n) => `${n} colonnes`,
      selectedColumns: (n) => `Colonnes sélectionnées (${n}) :`,
      userChoice: 'Choix des utilisateurs',
      searchUsers: 'Rechercher des utilisateurs',
      name: 'Prénom',
      surname: 'Nom',
      email: 'E-mail',
      noData: 'Aucune donnée',
      selectedUsers: (n) => `Utilisateurs sélectionnés (${n}) :`,
      back: '← Retour',
      nextStep: 'Suivant →',
    },
    field: {
      title: 'Validation de l’enregistrement terrain',
      reject: 'Rejeter',
      revise: 'Réviser',
      approve: 'Approuver',
      photo: 'Photo de terrain',
      photoAlt: 'Maison de plain-pied avec portail en fer',
      record: 'Enregistrement',
      validated: 'Validé',
      rejected: 'Rejeté',
      reviseSent: 'Envoyé pour révision',
      awaiting: 'En attente de validation',
      digitalAddress: 'Adresse numérique',
      coordinates: 'Coordonnées',
      accuracy: 'Précision',
      buildingType: 'Type de bâtiment',
      collectedBy: 'Collecté par',
      recordDate: 'Date d’enregistrement',
      note: 'Note du validateur',
      notePlaceholder: 'Saisir une note...',
    },
    dashboard: {
      pointsByUnit: 'Nombre de points d’adresse par unité administrative',
      byWilaya: 'Par wilaya',
      byMoughataa: 'Par moughataa',
      byCommune: 'Par commune',
      totalPoints: 'TOTAL DES POINTS D’ADRESSE',
      other: 'Autres',
      certStatus: 'Statut des demandes de certificat d’adresse',
      approved: 'Approuvé',
      pending: 'En attente',
      rejected: 'Rejeté',
      underReview: 'En cours d’examen',
      totalApplications: 'TOTAL DES DEMANDES',
      pointsOverTime: 'Nombre de points d’adresse dans le temps',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      yearly: 'Annuel',
      pointCountAxis: 'Nombre de points d’adresse',
      totalCertTitle: 'Total des demandes de certificat d’adresse',
      months: {
        jan: 'Janvier',
        feb: 'Février',
        mar: 'Mars',
        apr: 'Avril',
        may: 'Mai',
        jun: 'Juin',
        jul: 'Juillet',
        aug: 'Août',
        sep: 'Septembre',
      },
      quarter: (n, year) => `T${n} ${year}`,
    },
  },
};

const CATALOG_FROM_VALUE: Record<string, keyof Messages['catalog']> = {
  Residential: 'Residential',
  Commercial: 'Commercial',
  Public: 'Public',
  Business: 'Business',
  Storage: 'Storage',
  'Mixed use': 'MixedUse',
  Validated: 'Validated',
  Pending: 'Pending',
  Rejected: 'Rejected',
  Official: 'Official',
  Proposed: 'Proposed',
  Unnamed: 'Unnamed',
  'To be named': 'ToBeNamed',
  Boulevard: 'Boulevard',
  Avenue: 'Avenue',
  Rue: 'Rue',
  Ruelle: 'Ruelle',
  Open: 'Open',
  'Under construction': 'UnderConstruction',
  Closed: 'Closed',
  Private: 'Private',
  Mixed: 'Mixed',
  NO: 'NO',
  'Lease agreement, title deed, or utility bill': 'leaseOrUtility',
  'Signature circular / power of attorney': 'signatureCircular',
  'ID front and back (color)': 'idColor',
  'New address detection': 'typeNew',
  'Address correction': 'typeCorrection',
  'Detection for official document': 'typeOfficial',
  Individual: 'formIndividual',
  Corporate: 'formCorporate',
  'Via proxy': 'formProxy',
  number: 'number',
  text: 'text',
  boolean: 'boolean',
  date: 'date',
};

export function catalogLabel(catalog: Messages['catalog'], value: string): string {
  const key = CATALOG_FROM_VALUE[value];
  return key ? catalog[key] : value;
}

export function catalogOptions(catalog: Messages['catalog'], values: readonly string[]) {
  return values.map((value) => ({ value, label: catalogLabel(catalog, value) }));
}
