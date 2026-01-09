import { GridColDef } from '@mui/x-data-grid';
import { Tooltip, Button, Chip } from '@mui/material';
import { NewConnectionRequest } from '../../../types/new-connection';
import { formatDate, formatNumber } from '../../../services/api';

interface NewConnectionColumnsProps {
  onViewDetails?: (row: NewConnectionRequest) => void;
  onApprove?: (row: NewConnectionRequest) => void;
  onReject?: (row: NewConnectionRequest) => void;
}

export const getNewConnectionColumns = ({
  onViewDetails,
  onApprove,
  onReject,
}: NewConnectionColumnsProps): GridColDef[] => {
  return [
    {
      field: 'applicationNumber',
      headerName: 'Application No',
      width: 180,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'connectionName',
      headerName: 'Connection Name',
      width: 180,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 250,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ''}>
          <span style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.2em',
            maxHeight: '2.4em',
          }}>
            {params.value || '-'}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'ward',
      headerName: 'Ward',
      width: 80,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'serviceCategory',
      headerName: 'Service Category',
      width: 180,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'serviceType',
      headerName: 'Service Type',
      width: 180,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'loadDemand',
      headerName: 'Load (KW)',
      width: 100,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value == null ? '-' : formatNumber(Number(value)),
    },
    {
      field: 'solarCapacity',
      headerName: 'Solar Capacity (KW)',
      width: 150,
      headerAlign: 'center',
      align: 'right',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value == null ? '-' : formatNumber(Number(value)),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        const status = params.value;
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
        
        switch (status) {
          case 'PENDING':
            color = 'warning';
            break;
          case 'APPROVED':
            color = 'success';
            break;
          case 'REJECTED':
            color = 'error';
            break;
          default:
            color = 'default';
        }
        
        return (
          <Chip
            label={status}
            color={color}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'requesterName',
      headerName: 'Requester Name',
      width: 150,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'requesterDesignation',
      headerName: 'Requester Designation',
      width: 150,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value ? formatDate(new Date(value as string)) : '-',
    },
    {
      field: 'approvedBy',
      headerName: 'Approved By',
      width: 140,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value || '-',
    },
    {
      field: 'approvedAt',
      headerName: 'Approved At',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value ? formatDate(new Date(value as string)) : '-',
    },
    {
      field: 'rejectedBy',
      headerName: 'Rejected By',
      width: 140,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value || '-',
    },
    {
      field: 'rejectedAt',
      headerName: 'Rejected At',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value ? formatDate(new Date(value as string)) : '-',
    },
    {
      field: 'rejectionReason',
      headerName: 'Rejection Reason',
      width: 200,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ''}>
          <span style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.2em',
            maxHeight: '2.4em',
          }}>
            {params.value || '-'}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const row = params.row as NewConnectionRequest;
        
        return (
          <div style={{ display: 'flex', gap: '4px' }}>
            <Tooltip title="View Details">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => onViewDetails?.(row)}
                sx={{ minWidth: 60, py: 0.5, fontSize: '0.75rem' }}
              >
                View
              </Button>
            </Tooltip>
            
            {row.status === 'PENDING' && (
              <>
                <Tooltip title="Approve">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => onApprove?.(row)}
                    sx={{ minWidth: 60, py: 0.5, fontSize: '0.75rem' }}
                  >
                    Approve
                  </Button>
                </Tooltip>
                <Tooltip title="Reject">
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => onReject?.(row)}
                    sx={{ minWidth: 60, py: 0.5, fontSize: '0.75rem' }}
                  >
                    Reject
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
  ];
};

export const defaultNewConnectionColumns = getNewConnectionColumns({});
export default getNewConnectionColumns;