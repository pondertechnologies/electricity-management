import { GridColDef } from '@mui/x-data-grid';
import { Tooltip, Button, Chip } from '@mui/material';
import { DailyExtract } from '../../../types/daily-extract';
import { CheckCircle, Error, Schedule } from '@mui/icons-material';

interface DailyExtractColumnsProps {
  onViewDetails?: (row: DailyExtract) => void;
}

export const getDailyExtractColumns = ({
  onViewDetails,
}: DailyExtractColumnsProps): GridColDef[] => {
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
      field: 'extractDate',
      headerName: 'Extract Date',
      width: 120,
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
      field: 'extractTime',
      headerName: 'Extract Time',
      width: 120,
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
          second: '2-digit',
          hour12: false 
        });
      },
    },
    {
      field: 'parseStatus',
      headerName: 'Status',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        const status = params.value as string;
        if (status === 'PARSED') {
          return (
            <Chip
              icon={<CheckCircle />}
              label="PARSED"
              color="success"
              size="small"
              variant="outlined"
            />
          );
        } else if (status === 'RAW') {
          return (
            <Chip
              icon={<Error />}
              label="RAW"
              color="warning"
              size="small"
              variant="outlined"
            />
          );
        }
        return (
          <Chip
            icon={<Schedule />}
            label={status}
            color="default"
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'parsedAt',
      headerName: 'Parsed At',
      width: 120,
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
      field: 'createdAt',
      headerName: 'Created At',
      width: 120,
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
      field: 'remarks',
      headerName: 'Remarks',
      width: 150,
      headerAlign: 'center',
      align: 'left',
      sortable: true,
      filterable: true,
      valueFormatter: (value) => value || '-',
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
        <Tooltip title="View Extract Details">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onViewDetails?.(params.row as DailyExtract)}
            sx={{ minWidth: 70, py: 0.5, fontSize: '0.75rem' }}
          >
            View
          </Button>
        </Tooltip>
      ),
    },
  ];
};

export const defaultDailyExtractColumns = getDailyExtractColumns({});
export default getDailyExtractColumns;