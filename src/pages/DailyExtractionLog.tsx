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
  DailyExtract,
  DailyExtractFiltersType,
  DailyExtractResponse
} from '../types/daily-extract';
import { consumerDailyExtractAPI } from '../services/api';
import BaseDataGrid from '../components/data-grid/BaseDataGrid';
import DailyExtractFilters from '../components/filters/DailyExtractFilters';
import { getDailyExtractColumns } from '../components/data-grid/columns/DailyExtractColumns';
import ConsumerModal from '../components/modals/ConsumerModal';
import { Consumer } from '../types/consumer';

const DailyExtractionLog: React.FC = () => {
  const [rows, setRows] = useState<DailyExtract[]>([]);
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
  const [filters, setFilters] = useState<DailyExtractFiltersType>({
    startDate: getYesterdayDate(),
    endDate: getTodayDate(),
  });

  // Fetch daily extraction data
  const fetchDailyExtractData = useCallback(async (pageNo: number = 0, size: number = 25, filterParams: DailyExtractFiltersType = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build payload
      const payload = {
        page: pageNo + 1,
        pageSize: size,
        SortBy: 'extractDate' as const,
        sortOrder: 'desc' as const,
        consumerNumber: filterParams.consumerNumber || '',
        // For parseStatus, we might need to map to the API parameter if different
        // Based on API response, the field is "parseStatus" but API might expect different name
        dataFilter: filterParams.parseStatus || '', // Adjust based on actual API parameter
        // Date filters - adjust parameter names based on API
        startDate: filterParams.startDate || getYesterdayDate(),
        endDate: filterParams.endDate || getTodayDate(),
        // Include other filter parameters as needed
        consumerName: '',
        region: '',
        circle: '',
        section: '',
        serviceStatus: '',
        tariffCodes: '',
        distribution: '',
        voltageLevel: '',
      };

      console.log('Fetching daily extract data with payload:', payload);

      const response: DailyExtractResponse = await consumerDailyExtractAPI.getConsumerDailyExtract(payload);
      console.log('Daily Extract API Response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch data');
      }

      const list = response?.data ?? [];
      const total = response?.totalCount ?? 0;

      // Transform the data to match our interface
      const transformedList: DailyExtract[] = list.map((item, index: number) => ({
        id: pageNo * size + index + 1,
        consumerNumber: item.consumerNumber?.toString() || '-',
        extractDate: item.extractDate?.toString() || '-',
        extractTime: item.extractTime?.toString() || '-',
        parseStatus: item.parseStatus?.toString() || '-',
        remarks: item.remarks,
        createdAt: item.createdAt?.toString() || '-',
        parsedAt: item.parsedAt?.toString() || '-',
      }));

      // REMOVED: Summary calculations

      setRows(transformedList);
      setRowCount(total);

      console.log('Transformed rows:', transformedList);

    } catch (error: any) {
      console.error('Failed to fetch daily extract data', error);
      setError(error.message || 'Failed to fetch data');
      setRows([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on page or pageSize change
  useEffect(() => {
    fetchDailyExtractData(page, pageSize, filters);
  }, [page, pageSize, fetchDailyExtractData, filters]);

  // Apply filters
  const applyFilters = (): void => {
    setPage(0);
    setFiltersExpanded(false);
    fetchDailyExtractData(0, pageSize, filters);
  };

  // Clear filters
  const clearFilters = (): void => {
    const yesterday = getYesterdayDate();
    const today = getTodayDate();
    
    const newFilters = {
      consumerNumber: '',
      parseStatus: '',
      startDate: yesterday,
      endDate: today,
    };
    
    setFilters(newFilters);
    setPage(0);
    fetchDailyExtractData(0, pageSize, newFilters);
  };

  // Handle view details - Open Consumer Information modal
  const handleViewDetails = (row: DailyExtract): void => {
    console.log('Opening extract details for:', row);

    // Transform daily extract data to Consumer type for the modal
    const consumerData: Consumer = {
      id: row.id,
      consumerNumber: row.consumerNumber,
      consumerName: '', // Not available in extract data
      distribution: '', // Not available in extract data
      sanctionedLoad: 0, // Not available in extract data
      circle: '', // Not available in extract data
      section: '', // Not available in extract data
      excessDemand: 0, // Not available in extract data
      pfPenalty: 0, // Not available in extract data
      dueAmount: 0, // Not available in extract data
      dueDate: '', // Not available in extract data
      zeroUnitMonths: 0, // Not available in extract data
      bpscAmount: 0, // Not available in extract data
      bpscSlipDate: '', // Not available in extract data
      serviceStatus: '', // Not available in extract data
      serviceType: '', // Not available in extract data
      billPaidBy: '', // Not available in extract data
      mobileNumber: '', // Not available in extract data
      address: '', // Not available in extract data
      details: `Extract Status: ${row.parseStatus} | Date: ${new Date(row.extractDate).toLocaleDateString('en-IN')} | Time: ${new Date(row.extractTime).toLocaleTimeString('en-IN')}`,
      ebExtract: '', // Not available in extract data
    };

    setSelectedConsumer(consumerData);
    setOpenModal(true);
  };

  // Export PDF
  const handleExportPDF = useCallback((): void => {
    try {
      const doc = new jsPDF('landscape');
      doc.setFontSize(16);
      doc.text('Daily Extraction Log Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

      // REMOVED: Summary section from PDF

      // Main data table
      const columns = getDailyExtractColumns({});
      const exportColumns = columns.filter(col =>
        !['id', 'actions'].includes(col.field)
      );

      const tableColumn = exportColumns.map(col => col.headerName || col.field);
      const tableRows = rows.map(row =>
        exportColumns.map(col => {
          const value = row[col.field as keyof DailyExtract];
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

      doc.save(`daily-extraction-log-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      setError('Failed to generate PDF');
    }
  }, [rows]); // Removed summaryData dependency

  // Export to Excel
  const handleExportExcel = useCallback((): void => {
    try {
      const columns = getDailyExtractColumns({});
      const exportColumns = columns.filter(col =>
        !['id', 'actions'].includes(col.field)
      );

      const exportData = rows.map(row => {
        const rowData: Record<string, any> = {};
        exportColumns.forEach(col => {
          const value = row[col.field as keyof DailyExtract];
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
      XLSX.utils.book_append_sheet(workbook, dataSheet, 'Daily Extraction Log');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(data, `daily-extraction-log-${new Date().toISOString().split('T')[0]}.xlsx`);
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
                Daily Extraction Log
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Extracts: <strong>{rowCount.toLocaleString()}</strong> | 
                Date Range: <strong>{formatDateRange()}</strong> {/* Kept date range, removed parse success rate */}
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
        <DailyExtractFilters
          filters={filters}
          filtersExpanded={filtersExpanded}
          onFilterChange={setFilters}
          onFiltersExpandedChange={setFiltersExpanded}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />

        {/* DataGrid Component */}
        <Box sx={{ flexGrow: 1 }}>
          <BaseDataGrid<DailyExtract>
            rows={rows}
            loading={loading}
            rowCount={rowCount}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            columns={getDailyExtractColumns({ onViewDetails: handleViewDetails })}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            title="Daily Extraction Log"
            exportFileName="daily-extraction-log"
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

export default DailyExtractionLog;