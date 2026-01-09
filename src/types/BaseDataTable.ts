import type { TableProps } from "react-data-table-component";

export interface RowWithFundingRequests {
  fundingRequests?: any[];
}

export interface BaseDataTableProps<T = RowWithFundingRequests> extends TableProps<T> {
  paginationTotalRows?: number;
  getRowId?: (row: T) => string;
  loading?: boolean;
  paginationResetDefaultPage?: boolean;
  expandableRowsComponent?: React.ComponentType<{ data: T }>;
  onRowExpandToggled?: (expanded: boolean, row: T) => void;
  onStatusChange?: () => void;
  setMinheight?: boolean;
}