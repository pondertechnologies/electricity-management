import { GridColDef } from '@mui/x-data-grid';
import { Tooltip, Button, Chip } from '@mui/material';
import { ExtractionRequest } from '../../../types/extraction-request';
import { CheckCircle, Error, Schedule, Lock, LockOpen, HourglassEmpty } from '@mui/icons-material';

interface ExtractionRequestColumnsProps {
  onViewDetails?: (row: ExtractionRequest) => void;
}

export const getExtractionRequestColumns = ({
  onViewDetails,
}: ExtractionRequestColumnsProps): GridColDef[] => {
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
      field: 'requestedAt',
      headerName: 'Requested At',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      },
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
        const status = params.value as string;
        if (status === 'SUCCESS') {
          return (
            <Chip
              icon={<CheckCircle />}
              label="SUCCESS"
              color="success"
              size="small"
              variant="outlined"
            />
          );
        } else if (status === 'FAILED') {
          return (
            <Chip
              icon={<Error />}
              label="FAILED"
              color="error"
              size="small"
              variant="outlined"
            />
          );
        } else if (status === 'IN_PROGRESS') {
          return (
            <Chip
              icon={<HourglassEmpty />}
              label="IN PROGRESS"
              color="warning"
              size="small"
              variant="outlined"
            />
          );
        } else if (status === 'PENDING') {
          return (
            <Chip
              icon={<Schedule />}
              label="PENDING"
              color="info"
              size="small"
              variant="outlined"
            />
          );
        }
        return (
          <Chip
            label={status}
            color="default"
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'lockedBy',
      headerName: 'Locked By',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value || '-',
      renderCell: (params) => {
        const value = params.value as string | null;
        if (value) {
          return (
            <Chip
              icon={<Lock />}
              label={value}
              color="secondary"
              size="small"
              variant="outlined"
            />
          );
        }
        return (
          <Chip
            icon={<LockOpen />}
            label="Not Locked"
            color="default"
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'lockedAt',
      headerName: 'Locked At',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      },
    },
    {
      field: 'lockExpiresAt',
      headerName: 'Lock Expires At',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      },
    },
    {
      field: 'retryCount',
      headerName: 'Retry Count',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        const count = params.value as number;
        return (
          <Chip
            label={count}
            color={count > 0 ? "warning" : "default"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'lastError',
      headerName: 'Last Error',
      width: 180,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value || '-',
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      },
    },
    {
      field: 'parsingTime',
      headerName: 'Parsing Time',
      width: 110,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
    },
    {
      field: 'totalProcessingTime',
      headerName: 'Total Processing Time',
      width: 160,
      headerAlign: 'center',
      align: 'center',
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
        <Tooltip title="View Request Details">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onViewDetails?.(params.row as ExtractionRequest)}
            sx={{ minWidth: 70, py: 0.5, fontSize: '0.75rem' }}
          >
            View
          </Button>
        </Tooltip>
      ),
    },
  ];
};

export const defaultExtractionRequestColumns = getExtractionRequestColumns({});
export default getExtractionRequestColumns;