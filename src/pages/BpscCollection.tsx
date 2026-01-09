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
  BPSC,
  BPSCFiltersType,
  BPSCFilterOptions,
  BPSCResponse
} from '../types/bpsc';
import { miscCollectionBPSCAPI } from '../services/api';
import BaseDataGrid from '../components/data-grid/BaseDataGrid';
import BpscFilters from '../components/filters/BpscFilters';
import { getBpscColumns } from '../components/data-grid/columns/BpscColumns';
import ConsumerModal from '../components/modals/ConsumerModal';
import { Consumer } from '../types/consumer';

const BpscCollection: React.FC = () => {
  const [rows, setRows] = useState<BPSC[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<BPSCFilterOptions | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [rowCount, setRowCount] = useState<number>(0);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state for consumer details
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);

  // Filter states
  const [filters, setFilters] = useState<BPSCFiltersType>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetch BPSC data
  const fetchBpscData = useCallback(async (pageNo: number = 0, size: number = 25, filterParams: BPSCFiltersType = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Build payload
      const today = new Date();

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      const payload = {
        page: pageNo + 1,
        pageSize: size,
        SortBy: 'slipDate' as const,
        SortOrder: 'desc' as const,
        consumerNumber: filterParams.consumerNumber || '',
        consumerName: filterParams.consumerName || '',
        circle: filterParams.circle || '',
        section: filterParams.section || '',
        startDate:
          filterParams.startDate ||
          oneYearAgo.toISOString().split('T')[0],
        endDate:
          filterParams.endDate ||
          today.toISOString().split('T')[0],
      };


      console.log('Fetching BPSC data with payload:', payload);

      const response: BPSCResponse = await miscCollectionBPSCAPI.getBPSCMiscCollection(payload);
      console.log('BPSC API Response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch data');
      }

      const list = response?.data ?? [];
      const total = response?.totalCount ?? 0;

      // Transform the data to match our interface
      const transformedList: BPSC[] = list.map((item, index: number) => ({
        id: pageNo * size + index + 1,
        consumerNumber: item.consumerNumber?.toString() || '-',
        consumerName: item.consumerName?.toString() || '-',
        slipDate: item.slipDate?.toString() || '-',
        slipReason: item.slipReason?.toString() || '-',
        slipPeriod: item.slipPeriod?.toString() || '-',
        totalSlipAmount: typeof item.totalSlipAmount === 'number' ? item.totalSlipAmount : Number(item.totalSlipAmount) || 0,
        installDetails: item.installDetails?.toString() || '-',
        installAmount: typeof item.installAmount === 'number' ? item.installAmount : Number(item.installAmount) || 0,
        dueDate: item.dueDate,
        receiptNo: item.receiptNo,
        collectionDate: item.collectionDate,
        accountDescription: item.accountDescription?.toString() || '-',
        accountWiseAmount: typeof item.accountWiseAmount === 'number' ? item.accountWiseAmount : Number(item.accountWiseAmount) || 0,
        region: item.region?.toString() || '-',
        circle: item.circle?.toString() || '-',
        section: item.section?.toString() || '-',
        distribution: item.distribution?.toString() || '-',
        phase: item.phase?.toString() || '-',
        sanctionedLoad: typeof item.sanctionedLoad === 'number' ? item.sanctionedLoad : Number(item.sanctionedLoad) || 0,
        serviceStatus: item.serviceStatus?.toString() || '-',
        serviceType: item.serviceType?.toString() || '-',
        address: item.address?.toString() || '-',
      }));

      // REMOVED: Summary calculations

      setRows(transformedList);
      setRowCount(total);

      console.log('Transformed rows:', transformedList);

    } catch (error: any) {
      console.error('Failed to fetch BPSC data', error);
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
        const res = await miscCollectionBPSCAPI.getFilterOptions();
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
    fetchBpscData(page, pageSize, filters);
  }, [page, pageSize, fetchBpscData, filters]);

  // Apply filters
  const applyFilters = (): void => {
    setPage(0);
    setFiltersExpanded(false);
    fetchBpscData(0, pageSize, filters);
  };

  // Clear filters
  const clearFilters = (): void => {
    const today = new Date().toISOString().split('T')[0];
    setFilters({
      startDate: today,
      endDate: today,
    });
    setPage(0);
    fetchBpscData(0, pageSize, {
      startDate: today,
      endDate: today,
    });
  };

  // Handle view details - Open Consumer Information modal
  const handleViewDetails = (row: BPSC): void => {
    console.log('Opening consumer details for:', row);

    // Transform BPSC data to Consumer type for the modal
    const consumerData: Consumer = {
      id: row.id,
      consumerNumber: row.consumerNumber,
      consumerName: row.consumerName,
      distribution: row.distribution,
      sanctionedLoad: row.sanctionedLoad,
      circle: row.circle,
      section: row.section,
      excessDemand: 0,
      pfPenalty: 0,
      dueAmount: row.totalSlipAmount,
      dueDate: row.dueDate || '',
      zeroUnitMonths: 0,
      bpscAmount: row.totalSlipAmount,
      bpscSlipDate: row.slipDate,
      serviceStatus: row.serviceStatus,
      serviceType: row.serviceType,
      billPaidBy: '',
      mobileNumber: '',
      address: row.address,
      details: `BPSC: ${row.slipReason} - Period: ${row.slipPeriod}`,
      ebExtract: '',
    };

    setSelectedConsumer(consumerData);
    setOpenModal(true);
  };

  // Export PDF
  const handleExportPDF = useCallback((): void => {
    try {
      const doc = new jsPDF('landscape');
      doc.setFontSize(16);
      doc.text('BPSC Collection Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

      // REMOVED: Summary section from PDF

      // Main data table (limited columns for PDF readability)
      const columns = getBpscColumns({});
      const exportColumns = columns.filter(col =>
        !['id', 'actions', 'address', 'installDetails', 'distribution'].includes(col.field)
      );

      const tableColumn = exportColumns.map(col => col.headerName || col.field);
      const tableRows = rows.map(row =>
        exportColumns.map(col => {
          const value = row[col.field as keyof BPSC];
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

      doc.save(`bpsc-collection-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      setError('Failed to generate PDF');
    }
  }, [rows]); // Removed summaryData dependency

  // Export to Excel
  const handleExportExcel = useCallback((): void => {
    try {
      const columns = getBpscColumns({});
      const exportColumns = columns.filter(col =>
        !['id', 'actions'].includes(col.field)
      );

      const exportData = rows.map(row => {
        const rowData: Record<string, any> = {};
        exportColumns.forEach(col => {
          const value = row[col.field as keyof BPSC];
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
      XLSX.utils.book_append_sheet(workbook, dataSheet, 'BPSC Collection');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(data, `bpsc-collection-${new Date().toISOString().split('T')[0]}.xlsx`);
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
    return 'Today';
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
                BPSC Collection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Records: <strong>{rowCount.toLocaleString()}</strong> | {/* Kept row count */}
                Date Range: <strong>{formatDateRange()}</strong> {/* Kept date range */}
              </Typography>
              {/* REMOVED: Total Amount from subtitle */}
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
        <BpscFilters
          filters={filters}
          filterOptions={filterOptions}
          filtersExpanded={filtersExpanded}
          onFilterChange={setFilters}
          onFiltersExpandedChange={setFiltersExpanded}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />

        {/* DataGrid Component */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <BaseDataGrid<BPSC>
            rows={rows}
            loading={loading}
            rowCount={rowCount}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            columns={getBpscColumns({ onViewDetails: handleViewDetails })}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            title="BPSC Collection Records"
            exportFileName="bpsc-collection"
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

export default BpscCollection;