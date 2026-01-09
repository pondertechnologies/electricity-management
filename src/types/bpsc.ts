export interface BPSC {
  id: number;
  consumerNumber: string;
  consumerName: string;
  slipDate: string;
  slipReason: string;
  slipPeriod: string;
  totalSlipAmount: number;
  installDetails: string;
  installAmount: number;
  dueDate: string | null;
  receiptNo: string | null;
  collectionDate: string | null;
  accountDescription: string;
  accountWiseAmount: number;
  region: string;
  circle: string;
  section: string;
  distribution: string;
  phase: string;
  sanctionedLoad: number;
  serviceStatus: string;
  serviceType: string;
  address: string;
}

export interface BPSCFiltersType {
  consumerNumber?: string;
  consumerName?: string;
  circle?: string;
  section?: string;
  startDate?: string;
  endDate?: string;
}

export interface BPSCFilterOptions {
  circles: string[];
  sections: string[];
}

export interface BPSCResponse {
  success: boolean;
  message?: string;
  data: BPSC[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  errors?: any;
}

export interface BPSCCountSummary {
  totalRecords: number;
  totalSlipAmount: number;
  totalAccountWiseAmount: number;
  totalInstallAmount: number;
  averageSlipAmount: number;
}