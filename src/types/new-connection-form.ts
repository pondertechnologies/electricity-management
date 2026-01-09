export interface NewConnectionFormData {
  requesterDesignation: 'JE' | 'AE' | '';
  requesterName: string;
  connectionName: string;
  address: string;
  ward: string;
  loadDemand: number | '';
  serviceCategory: string;
  serviceType: string;
  otherComments?: string;
  tariffCode?: string;
  solarCapacity?: any;
}

export interface ServiceCategoryOption {
  value: string;
  label: string;
}

export interface ServiceTypeOption {
  value: string;
  label: string;
}

export interface DesignationOption {
  value: 'JE' | 'AE';
  label: string;
}

// Form validation schema
export interface NewConnectionFormErrors {
  solarCapacity?: string;
  requesterDesignation?: string;
  requesterName?: string;
  connectionName?: string;
  address?: string;
  ward?: string;
  loadDemand?: string;
  serviceCategory?: string;
  serviceType?: string;
}