// pages/Consumers.tsx
import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { Consumer, ConsumerFilters, FilterOptions } from '../types/consumer';
import { consumerAPI } from '../services/api';
import { formatCurrency, formatNumber } from '../services/api';
import ConsumerModal from '../components/modals/ConsumerModal';
import BaseDataGrid from '../components/data-grid/BaseDataGrid';
import CommonFilters from '../components/filters/ConsumerFilters';
import { getConsumerColumns } from '../components/data-grid/columns/ConsumerColumns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Consumers: React.FC = () => {
  const [rows, setRows] = useState<Consumer[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState<ConsumerFilters>({});

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<'details' | 'eb'>('details');
  const [selectedRow, setSelectedRow] = useState<Consumer | null>(null);

  // Fetch consumers
  const fetchConsumers = useCallback(async (pageNo = 0, size = 25, filterParams: ConsumerFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        page: pageNo + 1,
        pageSize: size,
        SortBy: 'consumerNumber',
        sortOrder: 'asc',
        consumerNumber: filterParams.consumerNumber || '',
        consumerName: filterParams.consumerName || '',
        mobileNumber: filterParams.mobileNumber || '',
        distribution: filterParams.distribution || '',
        circle: filterParams.circle || '',
        section: filterParams.section || '',
        serviceStatus: filterParams.serviceStatus || '',
        tariffCode: filterParams.tariffCode || '',
        voltageLevel: filterParams.voltageLevel || '',
        dataFilter: filterParams.dataFilter || '',
        fromDueDate: filterParams.fromDueDate || '',
        toDueDate: filterParams.toDueDate || '',
      };

      console.log('Fetching consumers with payload:', payload);

      const response = await consumerAPI.getConsumers(payload);
      console.log('Consumers API Response:', response);

      const list = response?.data ?? [];
      const total = response?.totalCount ?? 0;

      // Validate and transform the data
      const validatedList = list.map((item: any, index: number) => {
        return {
          id: pageNo * size + index + 1,
          consumerNumber: item.consumerNumber?.toString() || '-',
          consumerName: item.consumerName?.toString() || '-',
          distribution: item.distribution?.toString() || '-',
          sanctionedLoad: typeof item.sanctionedLoad === 'number' ? item.sanctionedLoad :
            item.sanctionedLoad ? parseFloat(item.sanctionedLoad) : 0,
          circle: item.circle?.toString() || '-',
          section: item.section?.toString() || '-',
          excessDemand: typeof item.excessDemand === 'number' ? item.excessDemand :
            item.excessDemand ? parseFloat(item.excessDemand) : 0,
          pfPenalty: typeof item.pfPenalty === 'number' ? item.pfPenalty :
            item.pfPenalty ? parseFloat(item.pfPenalty) : 0,
          dueAmount: typeof item.dueAmount === 'number' ? item.dueAmount :
            item.dueAmount ? parseFloat(item.dueAmount) : 0,
          dueDate: item.dueDate?.toString() || '-',
          zeroUnitMonths: typeof item.zeroUnitMonths === 'number' ? item.zeroUnitMonths :
            item.zeroUnitMonths ? parseInt(item.zeroUnitMonths) : 0,
          bpscAmount: typeof item.bpscAmount === 'number' ? item.bpscAmount :
            item.bpscAmount ? parseFloat(item.bpscAmount) : 0,
          bpscSlipDate: item.bpscSlipDate?.toString() || '-',
          serviceStatus: item.serviceStatus?.toString() || '-',
          serviceType: item.serviceType?.toString() || '-',
          billPaidBy: item.billPaidBy?.toString() || '-',
          mobileNumber: item.mobileNumber?.toString() || '-',
          address: item.address?.toString() || '-',
          details: item.details?.toString() || '-',
          ebExtract: item.ebExtract?.toString() || '-',
        };
      });

      setRows(validatedList);
      setRowCount(total);

      console.log('Transformed consumer rows:', validatedList);

    } catch (error: any) {
      console.error('Failed to fetch consumers', error);
      setError(error.message || 'Failed to fetch consumer data');
      setRows([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const res = await consumerAPI.getFilterOptions();
        console.log('Consumer filter options:', res);
        setFilterOptions(res);
      } catch (error) {
        console.error('Error loading filter options', error);
        setError('Failed to load filter options');
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch consumers on page or pageSize change
  useEffect(() => {
    fetchConsumers(page, pageSize, filters);
  }, [page, pageSize, fetchConsumers]);

  // Apply filters
  const applyFilters = () => {
    setPage(0);
    setFiltersExpanded(false);
    fetchConsumers(0, pageSize, filters);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setPage(0);
    fetchConsumers(0, pageSize, {});
  };

  // Handle view details
  const handleViewDetails = (row: Consumer) => {
    setSelectedRow(row);
    setModalType('details');
    setOpenModal(true);
  };

  // Handle view EB extract
  const handleViewEBExtract = (row: Consumer) => {
    setSelectedRow(row);
    setModalType('eb');
    setOpenModal(true);
  };

  // Export PDF
  const handleExportPDF = useCallback(() => {
    try {
      const doc = new jsPDF('landscape');
      doc.setFontSize(16);
      doc.text('Consumer Information Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

      // Summary section
      doc.setFontSize(12);
      doc.text('Summary', 14, 40);

      const summaryData = [
        ['Total Records', rowCount.toString()],
        [
          'Total Due Amount',
          formatCurrency(
            rows.reduce(
              (sum, row) => sum + Number(row.dueAmount ?? 0),
              0
            )
          ),
        ],
        [
          'Total BPSC Amount',
          formatCurrency(
            rows.reduce(
              (sum, row) => sum + Number(row.bpscAmount ?? 0),
              0
            )
          ),
        ],
      ];


      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: summaryData,
        startY: 45,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [44, 122, 123] },
      });

      // Main data table
      const columns = getConsumerColumns({ onViewDetails: () => { }, onViewEBExtract: () => { } });
      const exportColumns = columns.filter(col =>
        !['id', 'details', 'ebExtract'].includes(col.field)
      );

      const tableColumn = exportColumns.map(col => col.headerName || col.field);
      const tableRows = rows.map(row =>
        exportColumns.map(col => {
          const value = row[col.field as keyof Consumer];
          if (col.valueFormatter) {
            const formatter = col.valueFormatter as (
              value: any,
              row: any,
              column: any,
              apiRef: any
            ) => any;

            return formatter(value, row, col, null) ?? '';
          }
          // Special formatting for specific fields
          if (col.field === 'dueAmount' || col.field === 'bpscAmount' ||
            col.field === 'excessDemand' || col.field === 'pfPenalty') {
            return formatCurrency(value as number);
          }
          if (col.field === 'sanctionedLoad') {
            return `${formatNumber(value as number)} kW`;
          }
          return value?.toString() || '';
        })
      );

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: (doc as any).lastAutoTable.finalY + 10,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [44, 122, 123] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
      });

      doc.save(`consumer-information-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      setError('Failed to generate PDF');
    }
  }, [rows, rowCount]);

  // Export to Excel
  const handleExportExcel = useCallback(() => {
    try {
      const columns = getConsumerColumns({ onViewDetails: () => { }, onViewEBExtract: () => { } });
      const exportColumns = columns.filter(col =>
        !['id', 'details', 'ebExtract'].includes(col.field)
      );

      const exportData = rows.map(row => {
        const rowData: Record<string, any> = {};
        exportColumns.forEach(col => {
          const value = row[col.field as keyof Consumer];
          // Special formatting for specific fields
          if (col.field === 'dueAmount' || col.field === 'bpscAmount' ||
            col.field === 'excessDemand' || col.field === 'pfPenalty') {
            rowData[col.headerName || col.field] = formatCurrency(value as number);
          } else if (col.field === 'sanctionedLoad') {
            rowData[col.headerName || col.field] = `${formatNumber(value as number)} kW`;
          } else if (col.valueFormatter) {
            rowData[col.headerName || col.field] = col.valueFormatter as (
              value: any,
              row: any,
              column: any,
              apiRef: any
            ) => any;;
          } else {
            rowData[col.headerName || col.field] = value?.toString() || '';
          }
        });
        return rowData;
      });

      // Add summary sheet
      const summarySheet = XLSX.utils.json_to_sheet([
        { Metric: 'Total Records', Value: rowCount },

        {
          Metric: 'Total Due Amount',
          Value: formatCurrency(
            rows.reduce(
              (sum, row) => sum + Number(row.dueAmount ?? 0),
              0
            )
          ),
        },

        {
          Metric: 'Total BPSC Amount',
          Value: formatCurrency(
            rows.reduce(
              (sum, row) => sum + Number(row.bpscAmount ?? 0),
              0
            )
          ),
        },

        {
          Metric: 'Average Zero Unit Months',
          Value:
            rows.length > 0
              ? (
                rows.reduce(
                  (sum, row) => sum + Number(row.zeroUnitMonths ?? 0),
                  0
                ) / rows.length
              ).toFixed(1)
              : '0.0',
        },
      ]);


      const dataSheet = XLSX.utils.json_to_sheet(exportData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      XLSX.utils.book_append_sheet(workbook, dataSheet, 'Consumer Data');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(data, `consumer-information-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      setError('Failed to generate Excel file');
    }
  }, [rows, rowCount]);

  const handleCloseError = () => {
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
          '&': {
            width: { xs: '100%', sm: '76%', md: '100%' },
            margin: { xs: 0, sm: '0 auto' },
          },
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
                Consumer Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Records: <strong>{rowCount.toLocaleString()}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Filters Component */}
        <CommonFilters
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
          <BaseDataGrid<Consumer>
            rows={rows}
            loading={loading}
            rowCount={rowCount}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            columns={getConsumerColumns({
              onViewDetails: handleViewDetails,
              onViewEBExtract: handleViewEBExtract,
            })}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            title="Consumer Information"
            exportFileName="consumer-information"
            showExportButton={false}
            showExportIcons={true}
            excludeFieldsFromExport={['id', 'details', 'ebExtract']}
          />
        </Box>

        {/* Modal Component */}
        <ConsumerModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          viewType={modalType}
          selectedRow={selectedRow}
        />
      </Box>
    </>
  );
};

export default Consumers;