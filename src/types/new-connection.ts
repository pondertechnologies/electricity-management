export interface NewConnectionRequest {
  id: number;
  connectionName: string;
  applicationNumber: string;
  ward: string;
  address: string;
  loadDemand: number;
  tariffCode: string;
  serviceCategory: string;
  serviceType: string;
  solarCapacity: number | null;
  otherComments: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdBy: string;
  createdAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectedBy: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  currentApproverRole: string | null;
  requesterName: string;
  requesterDesignation: string;
}

export interface NewConnectionFilterOptions {
  service_categories: string[];
  service_types: string[];
}

export interface NewConnectionFiltersType {
  applicationNumber?: string;
  status?: string;
  createdBy?: string;
  serviceCategory?: string;
  serviceType?: string;
  startDate?: string;
  endDate?: string;
}

export interface NewConnectionResponse {
  data: NewConnectionRequest[];
  totalCount: number;
  page: number;
  pageSize: number;
}