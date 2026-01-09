import { GridColDef } from '@mui/x-data-grid';
import { Tooltip, Button } from '@mui/material';
import { BPSC } from '../../../types/bpsc';
import { formatCurrency, formatNumber } from '../../../services/api';

interface BpscColumnsProps {
  onViewDetails?: (row: BPSC) => void;
}

export const getBpscColumns = ({
  onViewDetails,
}: BpscColumnsProps): GridColDef[] => {
  return [
    {
      field: 'consumerNumber',
      headerName: 'Consumer Number',
      width: 140,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'consumerName',
      headerName: 'Consumer Name',
      width: 180,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'slipDate',
      headerName: 'Slip Date',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleDateString('en-IN');
      },
    },
    {
      field: 'slipReason',
      headerName: 'Slip Reason',
      width: 110,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'slipPeriod',
      headerName: 'Slip Period',
      width: 110,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'totalSlipAmount',
      headerName: 'Slip Amount (₹)',
      width: 110,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatCurrency(Number(value)),
    },
    {
      field: 'installDetails',
      headerName: 'Install Details',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'installAmount',
      headerName: 'Install Amount (₹)',
      width: 120,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatCurrency(Number(value)),
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleDateString('en-IN');
      },
    },
    {
      field: 'receiptNo',
      headerName: 'Receipt No',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'collectionDate',
      headerName: 'Collection Date',
      width: 110,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleDateString('en-IN');
      },
    },
    {
      field: 'accountDescription',
      headerName: 'Account Description',
      width: 130,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'accountWiseAmount',
      headerName: 'Account Wise Amount (₹)',
      width: 150,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatCurrency(Number(value)),
    },
    {
      field: 'region',
      headerName: 'Region',
      width: 110,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'circle',
      headerName: 'Circle',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'section',
      headerName: 'Section',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'distribution',
      headerName: 'Distribution',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'phase',
      headerName: 'Phase',
      width: 80,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'sanctionedLoad',
      headerName: 'Sanctioned Load (kW)',
      width: 120,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatNumber(Number(value)),
    },
    {
      field: 'serviceStatus',
      headerName: 'Service Status',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'serviceType',
      headerName: 'Service Type',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 200,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Tooltip title="View Consumer Details">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onViewDetails?.(params.row as BPSC)}
            sx={{ minWidth: 70, py: 0.5, fontSize: '0.75rem' }}
          >
            View
          </Button>
        </Tooltip>
      ),
    },
  ];
};

export const defaultBpscColumns = getBpscColumns({});
export default getBpscColumns;