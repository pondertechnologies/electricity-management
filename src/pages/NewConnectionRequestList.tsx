import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  NewConnectionRequest,
  NewConnectionFiltersType,
  NewConnectionFilterOptions,
  NewConnectionResponse
} from '../types/new-connection';
import { newConnectionRequestAPI } from '../services/api';
import BaseDataGrid from '../components/data-grid/BaseDataGrid';
import NewConnectionFilters from '../components/filters/NewConnectionFilters';
import { getNewConnectionColumns } from '../components/data-grid/columns/NewConnectionColumns';

const NewConnectionRequests: React.FC = () => {
  const [rows, setRows] = useState<NewConnectionRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<NewConnectionFilterOptions | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [rowCount, setRowCount] = useState<number>(0);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state for connection details
  const [, setOpenModal] = useState<boolean>(false);
  const [, setSelectedConnection] = useState<NewConnectionRequest | null>(null);

  // Filter states
  const [filters, setFilters] = useState<NewConnectionFiltersType>({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetch new connection requests
  const fetchNewConnectionRequests = useCallback(async (pageNo: number = 0, size: number = 25, filterParams: NewConnectionFiltersType = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build payload with default dates if not provided
      const payload = {
        page: pageNo + 1,
        pageSize: size,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
        applicationNumber: filterParams.applicationNumber || '',
        status: filterParams.status || '',
        createdBy: filterParams.createdBy || '',
        serviceCategory: filterParams.serviceCategory || '',
        serviceType: filterParams.serviceType || '',
        startDate: filterParams.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: filterParams.endDate || new Date().toISOString().split('T')[0],
      };

      console.log('Fetching new connection requests with payload:', payload);

      const response: NewConnectionResponse = await newConnectionRequestAPI.getNewConnectionList(payload);
      console.log('New Connection API Response:', response);

      const list = response?.data ?? [];
      const total = response?.totalCount ?? 0;

      // REMOVED: Summary calculations

      setRows(list);
      setRowCount(total);

    } catch (error: any) {
      console.error('Failed to fetch new connection requests', error);
      setError(error.message || 'Failed to fetch data');
      setRows([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async (): Promise<void> => {
      try {
        const res = await newConnectionRequestAPI.getFilterOptions();
        console.log('Filter options:', res);
        setFilterOptions(res);
      } catch (error) {
        console.error('Error loading filter options', error);
        setError('Failed to load filter options');
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch data on page or pageSize change
  useEffect(() => {
    fetchNewConnectionRequests(page, pageSize, filters);
  }, [page, pageSize, fetchNewConnectionRequests, filters]);

  // Apply filters
  const applyFilters = (): void => {
    setPage(0);
    setFiltersExpanded(false);
    fetchNewConnectionRequests(0, pageSize, filters);
  };

  // Clear filters
  const clearFilters = (): void => {
    const defaultFilters = {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    };
    setFilters(defaultFilters);
    setPage(0);
    fetchNewConnectionRequests(0, pageSize, defaultFilters);
  };

  // Handle view details
  const handleViewDetails = (row: NewConnectionRequest): void => {
    console.log('Opening connection details for:', row);
    setSelectedConnection(row);
    setOpenModal(true);
  };

  // Handle approve
  const handleApprove = (row: NewConnectionRequest): void => {
    // TODO: Implement approve functionality
    console.log('Approve connection:', row);
    // You would typically open a modal for approval comments
  };

  // Handle reject
  const handleReject = (row: NewConnectionRequest): void => {
    // TODO: Implement reject functionality
    console.log('Reject connection:', row);
    // You would typically open a modal for rejection reason
  };

  // Export PDF
  const handleExportPDF = useCallback((): void => {
    try {
      const doc = new jsPDF('landscape');
      doc.setFontSize(16);
      doc.text('New Connection Requests Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

      // REMOVED: Summary section from PDF

      // Main data table
      const columns = getNewConnectionColumns({});
      const exportColumns = columns.filter(col =>
        !['actions'].includes(col.field)
      );

      const tableColumn = exportColumns.map(col => col.headerName || col.field);
      const tableRows = rows.map(row =>
        exportColumns.map(col => {
          const value = row[col.field as keyof NewConnectionRequest];
          if (col.valueFormatter) {
            const formatter = col.valueFormatter as (
              value: any,
              row: any,
              column: any,
              apiRef: any
            ) => any;
            return formatter(value, row, col, null) ?? '';
          }
          return value?.toString() || '';
        })
      );

      // Start the table directly without summary section
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40, // Adjusted startY since we removed summary section
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [44, 122, 123] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
      });

      doc.save(`new-connection-requests-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      setError('Failed to generate PDF');
    }
  }, [rows]); // Removed summaryData dependency

  // Export to Excel
  const handleExportExcel = useCallback((): void => {
    try {
      const columns = getNewConnectionColumns({});
      const exportColumns = columns.filter(col =>
        !['actions'].includes(col.field)
      );

      const exportData = rows.map(row => {
        const rowData: Record<string, any> = {};
        exportColumns.forEach(col => {
          const value = row[col.field as keyof NewConnectionRequest];
          if (col.valueFormatter) {
            const formatter = col.valueFormatter as (
              value: any,
              row: any,
              column: any,
              apiRef: any
            ) => any;
            rowData[col.headerName || col.field] = formatter(value, row, col, null) ?? '';
          } else {
            rowData[col.headerName || col.field] = value?.toString() || '';
          }
        });
        return rowData;
      });

      const dataSheet = XLSX.utils.json_to_sheet(exportData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, dataSheet, 'Connection Requests');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(data, `new-connection-requests-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      setError('Failed to generate Excel file');
    }
  }, [rows]); // Removed summaryData dependency

  const handleCloseError = (): void => {
    setError(null);
  };

  return (
    <>
      <style>
        {`
          @media (min-width: 600px) {
            .css-ywimq6 {
              padding: 24px;
              width: 76%;
              margin-left: 0px;
            }
          }
        `}
      </style>
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: { xs: '100%', sm: '76%', md: '100%' },
          margin: { xs: 0, sm: '0 auto' },
          overflowX: 'hidden',
          flexGrow: 1,
          boxSizing: 'border-box',
          maxWidth: { sm: '100%' },
          height: '100%',
        }}
      >
        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Header Section */}
        <Box sx={{ flexShrink: 0 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
                New Connection Requests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Requests: <strong>{rowCount.toLocaleString()}</strong>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Export to Excel">
                <IconButton onClick={handleExportExcel} color="success" disabled={rows.length === 0}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export to PDF">
                <IconButton onClick={handleExportPDF} color="error" disabled={rows.length === 0}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* REMOVED: Entire Summary Cards Grid component */}

        </Box>

        {/* Filters Component */}
        <NewConnectionFilters
          filters={filters}
          filterOptions={filterOptions}
          filtersExpanded={filtersExpanded}
          onFilterChange={setFilters}
          onFiltersExpandedChange={setFiltersExpanded}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />

        {/* DataGrid Component */}
        <Box sx={{ flexGrow: 1 }}>
          <BaseDataGrid<NewConnectionRequest>
            rows={rows}
            loading={loading}
            rowCount={rowCount}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            columns={getNewConnectionColumns({ 
              onViewDetails: handleViewDetails,
              onApprove: handleApprove,
              onReject: handleReject,
            })}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            title="New Connection Requests"
            exportFileName="new-connection-requests"
            showExportButton={false}
            showExportIcons={true}
            excludeFieldsFromExport={['actions']}
          />
        </Box>

        {/* Connection Information Modal - You can create this later */}
        {/* <ConnectionModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          connection={selectedConnection}
        /> */}
      </Box>
    </>
  );
};

export default NewConnectionRequests;