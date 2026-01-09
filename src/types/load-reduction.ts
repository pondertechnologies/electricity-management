export interface LoadReduction {
  id: number;
  consumerNumber: string;
  consumerName: string;
  section: string;
  circle: string;
  phase: string;
  sanctionedLoad: number;
  maxRecordedDemand: number;
  loadReductionKw: number;
  suggestedLoadAfterReduction: number;
  monthlySaving: number;
  yearlySaving: number;
}

export interface LoadReductionFiltersType {
  consumerNumber?: string;
  consumerName?: string;
  circle?: string;
  section?: string;
}

export interface LoadReductionFilterOptions {
  circles: string[];
  sections: string[];
}

export interface LoadReductionResponse {
  success: boolean;
  message?: string;
  data: LoadReduction[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  errors?: any;
}

export interface LoadReductionSummary {
  totalConsumers: number;
  totalCurrentSanctionedLoad: number;
  totalLoadReductionKw: number;
  totalSuggestedLoadAfterReduction: number;
  totalMonthlySaving: number;
  totalYearlySaving: number;
}