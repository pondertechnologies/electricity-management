import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  ExtractionRequest,
  ExtractionRequestFiltersType,
  ExtractionRequestResponse
} from '../types/extraction-request';
import { consumerExtractionRequestAPI } from '../services/api';
import BaseDataGrid from '../components/data-grid/BaseDataGrid';
import ExtractionRequestFilters from '../components/filters/ExtractionRequestFilters';
import { getExtractionRequestColumns } from '../components/data-grid/columns/ExtractionRequestColumns';
import ConsumerModal from '../components/modals/ConsumerModal';
import { Consumer } from '../types/consumer';

const ExtractionRequestPage: React.FC = () => {
  const [rows, setRows] = useState<ExtractionRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [rowCount, setRowCount] = useState<number>(0);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state for consumer details
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);

  // Helper function to get yesterday's date
  const getYesterdayDate = (): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  // Helper function to get today's date
  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  // Filter states - default start date is yesterday, end date is today
  const [filters, setFilters] = useState<ExtractionRequestFiltersType>({
    startDate: getYesterdayDate(),
    endDate: getTodayDate(),
  });

  // Fetch extraction request data
  const fetchExtractionRequestData = useCallback(async (pageNo: number = 0, size: number = 25, filterParams: ExtractionRequestFiltersType = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build payload
      const payload = {
        page: pageNo + 1,
        pageSize: size,
        SortBy: 'requestedAt' as const,
        SortOrder: 'desc' as const,
        consumerNumber: filterParams.consumerNumber || '',
        // For status filter - adjust parameter name based on actual API
        status: filterParams.status || '',
        // For error text - we might need to adjust based on API
        // startDate and endDate for requestedAt field
        startDate: filterParams.startDate || getYesterdayDate(),
        endDate: filterParams.endDate || getTodayDate(),
      };

      console.log('Fetching extraction request data with payload:', payload);

      const response: ExtractionRequestResponse = await consumerExtractionRequestAPI.getConsumerExtractionRequest(payload);
      console.log('Extraction Request API Response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch data');
      }

      const list = response?.data ?? [];
      const total = response?.totalCount ?? 0;

      // Transform the data to match our interface
      const transformedList: ExtractionRequest[] = list.map((item, index: number) => ({
        id: pageNo * size + index + 1,
        consumerNumber: item.consumerNumber?.toString() || '-',
        requestedAt: item.requestedAt?.toString() || '-',
        status: item.status?.toString() || '-',
        lockedBy: item.lockedBy,
        lockedAt: item.lockedAt,
        lockExpiresAt: item.lockExpiresAt,
        retryCount: typeof item.retryCount === 'number' ? item.retryCount : Number(item.retryCount) || 0,
        lastError: item.lastError,
        updatedAt: item.updatedAt?.toString() || '-',
        parsingTime: item.parsingTime?.toString() || '-',
        totalProcessingTime: item.totalProcessingTime?.toString() || '-',
      }));

      // REMOVED: Summary calculations

      setRows(transformedList);
      setRowCount(total);

      console.log('Transformed rows:', transformedList);

    } catch (error: any) {
      console.error('Failed to fetch extraction request data', error);
      setError(error.message || 'Failed to fetch data');
      setRows([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on page or pageSize change
  useEffect(() => {
    fetchExtractionRequestData(page, pageSize, filters);
  }, [page, pageSize, fetchExtractionRequestData, filters]);

  // Apply filters
  const applyFilters = (): void => {
    setPage(0);
    setFiltersExpanded(false);
    fetchExtractionRequestData(0, pageSize, filters);
  };

  // Clear filters
  const clearFilters = (): void => {
    const yesterday = getYesterdayDate();
    const today = getTodayDate();
    
    const newFilters = {
      consumerNumber: '',
      status: '',
      errorText: '',
      startDate: yesterday,
      endDate: today,
    };
    
    setFilters(newFilters);
    setPage(0);
    fetchExtractionRequestData(0, pageSize, newFilters);
  };

  // Handle view details - Open Consumer Information modal
  const handleViewDetails = (row: ExtractionRequest): void => {
    console.log('Opening extraction request details for:', row);

    // Transform extraction request data to Consumer type for the modal
    const consumerData: Consumer = {
      id: row.id,
      consumerNumber: row.consumerNumber,
      consumerName: '', // Not available in request data
      distribution: '', // Not available in request data
      sanctionedLoad: 0, // Not available in request data
      circle: '', // Not available in request data
      section: '', // Not available in request data
      excessDemand: 0, // Not available in request data
      pfPenalty: 0, // Not available in request data
      dueAmount: 0, // Not available in request data
      dueDate: '', // Not available in request data
      zeroUnitMonths: 0, // Not available in request data
      bpscAmount: 0, // Not available in request data
      bpscSlipDate: '', // Not available in request data
      serviceStatus: '', // Not available in request data
      serviceType: '', // Not available in request data
      billPaidBy: '', // Not available in request data
      mobileNumber: '', // Not available in request data
      address: '', // Not available in request data
      details: `Status: ${row.status} | Requested: ${new Date(row.requestedAt).toLocaleString('en-IN')} | Retries: ${row.retryCount} | Processing Time: ${row.totalProcessingTime}`,
      ebExtract: '', // Not available in request data
    };

    setSelectedConsumer(consumerData);
    setOpenModal(true);
  };

  // Export PDF
  const handleExportPDF = useCallback((): void => {
    try {
      const doc = new jsPDF('landscape');
      doc.setFontSize(16);
      doc.text('Extraction Request Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

      // REMOVED: Summary section from PDF

      // Main data table (limited columns for PDF readability)
      const columns = getExtractionRequestColumns({});
      const exportColumns = columns.filter(col =>
        !['id', 'actions', 'lockExpiresAt', 'parsingTime'].includes(col.field)
      );

      const tableColumn = exportColumns.map(col => col.headerName || col.field);
      const tableRows = rows.map(row =>
        exportColumns.map(col => {
          const value = row[col.field as keyof ExtractionRequest];
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
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [44, 122, 123] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        pageBreak: 'auto',
      });

      doc.save(`extraction-requests-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      setError('Failed to generate PDF');
    }
  }, [rows]); // Removed summaryData dependency

  // Export to Excel
  const handleExportExcel = useCallback((): void => {
    try {
      const columns = getExtractionRequestColumns({});
      const exportColumns = columns.filter(col =>
        !['id', 'actions'].includes(col.field)
      );

      const exportData = rows.map(row => {
        const rowData: Record<string, any> = {};
        exportColumns.forEach(col => {
          const value = row[col.field as keyof ExtractionRequest];
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

      // REMOVED: Summary sheet creation

      const dataSheet = XLSX.utils.json_to_sheet(exportData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, dataSheet, 'Extraction Requests');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(data, `extraction-requests-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      setError('Failed to generate Excel file');
    }
  }, [rows]); // Removed summaryData dependency

  const handleCloseError = (): void => {
    setError(null);
  };

  // Format date range display
  const formatDateRange = () => {
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate).toLocaleDateString('en-IN');
      const end = new Date(filters.endDate).toLocaleDateString('en-IN');
      return `${start} - ${end}`;
    }
    return 'Yesterday - Today';
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
                Data Extraction Requests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Requests: <strong>{rowCount.toLocaleString()}</strong> | 
                Date Range: <strong>{formatDateRange()}</strong> {/* Kept date range, removed success rate */}
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

          {/* REMOVED: Additional Stats Row */}

        </Box>

        {/* Filters Component */}
        <ExtractionRequestFilters
          filters={filters}
          filtersExpanded={filtersExpanded}
          onFilterChange={setFilters}
          onFiltersExpandedChange={setFiltersExpanded}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />

        {/* DataGrid Component */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <BaseDataGrid<ExtractionRequest>
            rows={rows}
            loading={loading}
            rowCount={rowCount}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            columns={getExtractionRequestColumns({ onViewDetails: handleViewDetails })}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            title="Extraction Requests"
            exportFileName="extraction-requests"
            showExportButton={false}
            showExportIcons={true}
            excludeFieldsFromExport={['id', 'actions']}
          />
        </Box>

        {/* Consumer Information Modal */}
        <ConsumerModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          viewType="details"
          selectedRow={selectedConsumer}
        />
      </Box>
    </>
  );
};

export default ExtractionRequestPage;