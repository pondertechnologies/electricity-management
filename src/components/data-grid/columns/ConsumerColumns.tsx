import { GridColDef } from '@mui/x-data-grid';
import { Tooltip, Button } from '@mui/material';
import { Consumer } from '../../../types/consumer';


interface ConsumerColumnsProps {
  onViewDetails: (row: Consumer) => void;
  onViewEBExtract: (row: Consumer) => void;
}

export const getConsumerColumns = ({
  onViewDetails,
  onViewEBExtract,
}: ConsumerColumnsProps): GridColDef[] => {
  return [
    { 
      field: 'consumerNumber', 
      headerName: 'Consumer No', 
      width: 120, 
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
      field: 'distribution', 
      headerName: 'Distribution', 
      width: 130, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'sanctionedLoad', 
      headerName: 'Sanct. Load', 
      width: 120, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'circle', 
      headerName: 'Circle', 
      width: 110, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'section', 
      headerName: 'Section', 
      width: 110, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'excessDemand', 
      headerName: 'Excess Demand', 
      width: 130, 
      headerAlign: 'center', 
      align: 'right',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'pfPenalty', 
      headerName: 'PF Penalty', 
      width: 110, 
      headerAlign: 'center', 
      align: 'right',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'dueAmount', 
      headerName: 'Due Amount', 
      width: 120, 
      headerAlign: 'center', 
      align: 'right',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'dueDate', 
      headerName: 'Due Date', 
      width: 110, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'zeroUnitMonths', 
      headerName: 'Zero Units', 
      width: 110, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'bpscAmount', 
      headerName: 'BPSC Amt', 
      width: 110, 
      headerAlign: 'center', 
      align: 'right',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'bpscSlipDate', 
      headerName: 'BPSC Date', 
      width: 110, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'serviceStatus', 
      headerName: 'Service', 
      width: 100, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'serviceType', 
      headerName: 'Type', 
      width: 90, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'billPaidBy', 
      headerName: 'Paid By', 
      width: 100, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'mobileNumber', 
      headerName: 'Mobile No', 
      width: 120, 
      headerAlign: 'center', 
      align: 'center',
      sortable: true,
      filterable: true,
    },
    { 
      field: 'address', 
      headerName: 'Address', 
      width: 180, 
      headerAlign: 'center', 
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'details',
      headerName: 'Details',
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Tooltip title="View Details">
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => onViewDetails(params.row as Consumer)}
            sx={{ minWidth: 70, py: 0.5, fontSize: '0.75rem' }}
          >
            View
          </Button>
        </Tooltip>
      ),
    },
    {
      field: 'ebExtract',
      headerName: 'EB Extract',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Tooltip title="View EB Extract">
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => onViewEBExtract(params.row as Consumer)}
            sx={{ minWidth: 70, py: 0.5, fontSize: '0.75rem' }}
          >
            View
          </Button>
        </Tooltip>
      ),
    },
  ];
};

// Export a default configuration for convenience
export const defaultConsumerColumns = getConsumerColumns({
  onViewDetails: () => {},
  onViewEBExtract: () => {},
});

export default getConsumerColumns;