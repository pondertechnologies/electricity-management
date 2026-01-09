import { GridColDef } from '@mui/x-data-grid';
import { Tooltip, Button } from '@mui/material';
import { LoadReduction } from '../../../types/load-reduction';
import { formatCurrency, formatNumber } from '../../../services/api';

interface LoadReductionColumnsProps {
  onViewDetails?: (row: LoadReduction) => void;
}

export const getLoadReductionColumns = ({
  onViewDetails,
}: LoadReductionColumnsProps): GridColDef[] => {
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
      width: 220,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'circle',
      headerName: 'Circle',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'section',
      headerName: 'Section',
      width: 140,
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
      width: 130,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatNumber(Number(value)),
    },
    {
      field: 'maxRecordedDemand',
      headerName: 'Max Recorded Demand (kW)',
      width: 140,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatNumber(Number(value)),
    },
    {
      field: 'loadReductionKw',
      headerName: 'Load Reduction (kW)',
      width: 120,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatNumber(Number(value)),
      cellClassName: (params) => {
        const value = params.value as number;
        return value > 0 ? 'load-reduction-positive' : '';
      },
    },
    {
      field: 'suggestedLoadAfterReduction',
      headerName: 'Suggested Load (kW)',
      width: 130,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatNumber(Number(value)),
    },
    {
      field: 'monthlySaving',
      headerName: 'Monthly Saving (₹)',
      width: 140,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatCurrency(Number(value)),
    },
    {
      field: 'yearlySaving',
      headerName: 'Yearly Saving (₹)',
      width: 140,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) =>
        value == null ? '-' : formatCurrency(Number(value)),
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
            onClick={() => onViewDetails?.(params.row as LoadReduction)}
            sx={{ minWidth: 70, py: 0.5, fontSize: '0.75rem' }}
          >
            View
          </Button>
        </Tooltip>
      ),
    },
  ];
};

export const defaultLoadReductionColumns = getLoadReductionColumns({});
export default getLoadReductionColumns;