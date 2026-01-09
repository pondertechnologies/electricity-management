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
  DisconnectionEligible,
  DisconnectionEligiblilityFilters,
  DisconnectionEligibleFilterOptions,
  DisconnectionEligibleResponse
} from '../types/disconnection-eligible';
import { disconnectionEligibleAPI } from '../services/api';
import BaseDataGrid from '../components/data-grid/BaseDataGrid';
import DisconnectionEligibleFilters from '../components/filters/DisconnectionEligibleFilters';
import { getDisconnectionEligibleColumns } from '../components/data-grid/columns/DisconnectionEligibleColumns';
import ConsumerModal from '../components/modals/ConsumerModal';
import { Consumer } from '../types/consumer';

const DisconnectionEligibility: React.FC = () => {
  const [rows, setRows] = useState<DisconnectionEligible[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<DisconnectionEligibleFilterOptions | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [rowCount, setRowCount] = useState<number>(0);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state for consumer details
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);

  // Filter states - only the required filters
  const [filters, setFilters] = useState<DisconnectionEligiblilityFilters>({});

  // Fetch disconnection eligible consumers
  const fetchDisconnectionEligible = useCallback(async (pageNo: number = 0, size: number = 25, filterParams: DisconnectionEligiblilityFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build payload with only the required filters
      const payload = {
        page: pageNo + 1,
        pageSize: size,
        SortBy: 'consumerNumber' as const,
        sortOrder: 'asc' as const,
        consumerNumber: filterParams.consumerNumber || '',
        consumerName: filterParams.consumerName || '',
        circle: filterParams.circle || '',
        section: filterParams.section || '',
        billingZeroUnitMonths: filterParams.billingZeroUnitMonths || '',
      };

      console.log('Fetching disconnection eligible with payload:', payload);

      const response: DisconnectionEligibleResponse = await disconnectionEligibleAPI.getDisconnectionEligible(payload);
      console.log('Disconnection Eligible API Response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch data');
      }

      const list = response?.data ?? [];
      const total = response?.totalCount ?? 0;

      // Transform the data to match our interface
      const transformedList: DisconnectionEligible[] = list.map((item, index: number) => ({
        id: pageNo * size + index + 1,
        consumerNumber: item.consumerNumber?.toString() || '-',
        consumerName: item.consumerName?.toString() || '-',
        section: item.section?.toString() || '-',
        circle: item.circle?.toString() || '-',
        phase: item.phase?.toString() || '-',
        sanctionedLoad: typeof item.sanctionedLoad === 'number' ? item.sanctionedLoad : Number(item.sanctionedLoad) || 0,
        recordsCount: typeof item.recordsCount === 'number' ? item.recordsCount : Number(item.recordsCount) || 0,
        billingZeroUnitMonths: typeof item.billingZeroUnitMonths === 'number' ? item.billingZeroUnitMonths : Number(item.billingZeroUnitMonths) || 0,
        totalUnits: typeof item.totalUnits === 'number' ? item.totalUnits : Number(item.totalUnits) || 0,
        totalDemand: typeof item.totalDemand === 'number' ? item.totalDemand : Number(item.totalDemand) || 0,
        totalCcCharges: typeof item.totalCcCharges === 'number' ? item.totalCcCharges : Number(item.totalCcCharges) || 0,
        fixedRate: typeof item.fixedRate === 'number' ? item.fixedRate : Number(item.fixedRate) || 0,
        monthlySavings: typeof item.monthlySavings === 'number' ? item.monthlySavings : Number(item.monthlySavings) || 0,
        yearlySavings: typeof item.yearlySavings === 'number' ? item.yearlySavings : Number(item.yearlySavings) || 0,
        expectedRefund: typeof item.expectedRefund === 'number' ? item.expectedRefund : Number(item.expectedRefund) || 0,
      }));

      // REMOVED: Summary calculations

      setRows(transformedList);
      setRowCount(total);

      console.log('Transformed rows:', transformedList);

    } catch (error: any) {
      console.error('Failed to fetch disconnection eligible consumers', error);
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
        const res = await disconnectionEligibleAPI.getFilterOptions();
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
    fetchDisconnectionEligible(page, pageSize, filters);
  }, [page, pageSize, fetchDisconnectionEligible, filters]);

  // Apply filters
  const applyFilters = (): void => {
    setPage(0);
    setFiltersExpanded(false);
    fetchDisconnectionEligible(0, pageSize, filters);
  };

  // Clear filters
  const clearFilters = (): void => {
    setFilters({});
    setPage(0);
    fetchDisconnectionEligible(0, pageSize, {});
  };

  // Handle view details - Open Consumer Information modal
  const handleViewDetails = (row: DisconnectionEligible): void => {
    console.log('Opening consumer details for:', row);

    // Transform disconnection eligible data to Consumer type for the modal
    const consumerData: Consumer = {
      id: row.id,
      consumerNumber: row.consumerNumber,
      consumerName: row.consumerName,
      distribution: '', // Not available in disconnection eligible response
      sanctionedLoad: row.sanctionedLoad,
      circle: row.circle,
      section: row.section,
      excessDemand: 0, // Not available in disconnection eligible response
      pfPenalty: 0, // Not available in disconnection eligible response
      dueAmount: 0, // Not available in disconnection eligible response
      dueDate: '', // Not available in disconnection eligible response
      zeroUnitMonths: row.billingZeroUnitMonths,
      bpscAmount: 0, // Not available in disconnection eligible response
      bpscSlipDate: '', // Not available in disconnection eligible response
      serviceStatus: '', // Not available in disconnection eligible response
      serviceType: '', // Not available in disconnection eligible response
      billPaidBy: '', // Not available in disconnection eligible response
      mobileNumber: '', // Not available in disconnection eligible response
      address: '', // Not available in disconnection eligible response
      details: 'Disconnection Eligible', // Custom field
      ebExtract: '', // Not available in disconnection eligible response
    };

    setSelectedConsumer(consumerData);
    setOpenModal(true);
  };

  // Export PDF
  const handleExportPDF = useCallback((): void => {
    try {
      const doc = new jsPDF('landscape');
      doc.setFontSize(16);
      doc.text('Disconnection Eligibility Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

      // REMOVED: Summary section from PDF

      // Main data table
      const columns = getDisconnectionEligibleColumns({});
      const exportColumns = columns.filter(col =>
        !['id', 'actions'].includes(col.field)
      );

      const tableColumn = exportColumns.map(col => col.headerName || col.field);
      const tableRows = rows.map(row =>
        exportColumns.map(col => {
          const value = row[col.field as keyof DisconnectionEligible];
          if (col.valueFormatter) {
            // Create proper params for valueFormatter
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

      doc.save(`disconnection-eligibility-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      setError('Failed to generate PDF');
    }
  }, [rows]); // Removed summaryData dependency

  // Export to Excel
  const handleExportExcel = useCallback((): void => {
    try {
      const columns = getDisconnectionEligibleColumns({});
      const exportColumns = columns.filter(col =>
        !['id', 'actions'].includes(col.field)
      );

      const exportData = rows.map(row => {
        const rowData: Record<string, any> = {};
        exportColumns.forEach(col => {
          const value = row[col.field as keyof DisconnectionEligible];
          if (col.valueFormatter) {
            // Create proper params for valueFormatter
            const formatter = col.valueFormatter as (
              value: any,
              row: any,
              column: any,
              apiRef: any
            ) => any;

            return formatter(value, row, col, null) ?? '';
          } else {
            rowData[col.headerName || col.field] = value?.toString() || '';
          }
        });
        return rowData;
      });

      // REMOVED: Summary sheet creation

      const dataSheet = XLSX.utils.json_to_sheet(exportData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, dataSheet, 'Disconnection Eligible');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(data, `disconnection-eligibility-${new Date().toISOString().split('T')[0]}.xlsx`);
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
                Disconnection Eligibility
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Eligible Consumers: <strong>{rowCount.toLocaleString()}</strong>
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

        {/* Filters Component - Only the required filters */}
        <DisconnectionEligibleFilters
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
          <BaseDataGrid<DisconnectionEligible>
            rows={rows}
            loading={loading}
            rowCount={rowCount}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            columns={getDisconnectionEligibleColumns({ onViewDetails: handleViewDetails })}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            title="Disconnection Eligible Consumers"
            exportFileName="disconnection-eligibility"
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

export default DisconnectionEligibility;