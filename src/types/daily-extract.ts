export interface DailyExtract {
  id: number;
  consumerNumber: string;
  extractDate: string;
  extractTime: string;
  parseStatus: string;
  remarks: string | null;
  createdAt: string;
  parsedAt: string;
}

export interface DailyExtractFiltersType {
  consumerNumber?: string;
  parseStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface DailyExtractFilterOptions {
  // We don't need filter options for this page, but keeping the structure consistent
}

export interface DailyExtractResponse {
  success: boolean;
  message?: string;
  data: DailyExtract[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  errors?: any;
}

export interface DailyExtractSummary {
  totalRecords: number;
  totalParsed: number;
  totalRaw: number;
  latestExtraction: string;
  earliestExtraction: string;
}