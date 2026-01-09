export interface ExtractionRequest {
  id: number;
  consumerNumber: string;
  requestedAt: string;
  status: string;
  lockedBy: string | null;
  lockedAt: string | null;
  lockExpiresAt: string | null;
  retryCount: number;
  lastError: string | null;
  updatedAt: string;
  parsingTime: string;
  totalProcessingTime: string;
}

export interface ExtractionRequestFiltersType {
  consumerNumber?: string;
  status?: string;
  errorText?: string;
  startDate?: string;
  endDate?: string;
}

export interface ExtractionRequestFilterOptions {
  // We don't need filter options for this page, but keeping the structure consistent
}

export interface ExtractionRequestResponse {
  success: boolean;
  message?: string;
  data: ExtractionRequest[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  errors?: any;
}

export interface ExtractionRequestSummary {
  totalRecords: number;
  successCount: number;
  failedCount: number;
  pendingCount: number;
  inProgressCount: number;
  averageRetryCount: number;
  averageProcessingTime: string;
}