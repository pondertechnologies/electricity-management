// types/disconnection-eligible.ts
export interface DisconnectionEligible {
  id: number;
  consumerNumber: string;
  consumerName: string;
  section: string;
  circle: string;
  phase: string;
  sanctionedLoad: number;
  recordsCount: number;
  billingZeroUnitMonths: number;
  totalUnits: number;
  totalDemand: number;
  totalCcCharges: number;
  fixedRate: number;
  monthlySavings: number;
  yearlySavings: number;
  expectedRefund: number;
}

export interface DisconnectionEligiblilityFilters {
  consumerNumber?: string;
  consumerName?: string;
  region?: string;
  circle?: string;
  section?: string;
  serviceStatus?: string;
  tariffCodes?: string;
  distribution?: string;
  voltageLevel?: string;
  dataFilter?: string;
  phase?: string;
  serviceType?: string;
  category?: string;
  billingZeroUnitMonths?: number | string;
}

export interface DisconnectionEligibleFilterOptions {
  regions: string[];
  circles: string[];
  sections: string[];
  phases: string[];
  serviceTypes: string[];
  categories: string[];
  billingZeroUnitMonths: number[];
}

export interface DisconnectionEligibleResponse {
  success: boolean;
  message: string | null;
  data: DisconnectionEligible[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  errors: any;
}