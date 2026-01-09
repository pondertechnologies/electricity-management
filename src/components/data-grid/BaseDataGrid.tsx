import {
  Box,
  Paper,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Pagination,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid/models';
import {
  PictureAsPdf as PdfIcon,
  Description as ExcelIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BaseDataGridProps<T> {
  rows: T[];
  loading: boolean;
  rowCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  columns: GridColDef[];
  // Optional callbacks for actions
  onViewDetails?: (row: T) => void;
  onViewEBExtract?: (row: T) => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  // Optional custom title
  title?: string;
  // Optional export button label
  exportButtonLabel?: string;
  // Optional show/hide export button
  showExportButton?: boolean;
  // Show individual export icons (PDF, Excel)
  showExportIcons?: boolean;
  // Custom filename for exports
  exportFileName?: string;
  // Fields to exclude from export
  excludeFieldsFromExport?: string[];
}

const BaseDataGrid = <T extends Record<string, any>>({
  rows,
  loading,
  rowCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  columns,
  onExportPDF,
  onExportExcel,
  title = 'Data Grid',
  exportButtonLabel = 'Export PDF',
  showExportButton = true,
  showExportIcons = true,
  exportFileName = 'export',
  excludeFieldsFromExport = ['details', 'ebExtract', 'id', 'actions'],
}: BaseDataGridProps<T>) => {
  // Filter out action columns for export
  const getExportableColumns = () => {
    return columns.filter(col =>
      !excludeFieldsFromExport.includes(col.field)
    );
  };

  // Get exportable data
  const getExportableData = () => {
    const exportColumns = getExportableColumns();
    return rows.map(row => {
      const exportRow: Record<string, any> = {};
      exportColumns.forEach(col => {
        const value = row[col.field];
        // Handle nested objects
        exportRow[col.headerName || col.field] = value?.toString() || '';
      });
      return exportRow;
    });
  };

  // Handle PDF Export
  const handleExportPDF = () => {
    if (onExportPDF) {
      onExportPDF();
      return;
    }

    const doc = new jsPDF('landscape');
    doc.setFontSize(14);
    doc.text(`${title} - Report`, 14, 15);

    const exportColumns = getExportableColumns();
    const tableColumn = exportColumns.map(col => col.headerName || col.field);

    const tableRows = rows.map(row =>
      exportColumns.map(col => {
        const value = row[col.field];
        // Format value if needed
        if (col.valueFormatter) {
          return (col.valueFormatter as (value: any) => string)(value) ?? '';
        }

        return value?.toString() || '';
      })
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [44, 122, 123],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`${exportFileName}.pdf`);
  };

  // Handle Excel Export
  const handleExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
      return;
    }

    const exportColumns = getExportableColumns();
    const excelData = getExportableData();

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const colWidths = exportColumns.map(col => ({
      wch: Math.max(
        col.headerName?.length || col.field.length,
        ...excelData.map(row => row[col.headerName || col.field]?.toString().length || 0)
      ) + 2
    }));
    worksheet['!cols'] = colWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(data, `${exportFileName}.xlsx`);
  };

  // Handle combined export (if needed)
  const handleExport = () => {
    handleExportPDF();
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        overflow: 'hidden',
        height: 'calc(100vh - 260px)',
        minHeight: 550,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <Typography variant="subtitle1" fontWeight={500}>
          {title}
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          {showExportIcons && (
            <>
              <Tooltip title="Export to Excel">
                <span>
                  <IconButton
                    color="success"
                    onClick={handleExportExcel}
                    disabled={rows.length === 0}
                    size="small"
                  >
                    <ExcelIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Export to PDF">
                <span>
                  <IconButton
                    color="error"
                    onClick={handleExportPDF}
                    disabled={rows.length === 0}
                    size="small"
                  >
                    <PdfIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          )}

          {showExportButton && (
            <Tooltip title={exportButtonLabel}>
              <IconButton
                color="primary"
                onClick={handleExport}
                disabled={rows.length === 0}
                size="small"
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* DataGrid */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          overflow: 'auto',
          minHeight: 0,
          '& .MuiDataGrid-virtualScroller': {
            overflow: 'auto',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(m) => {
            onPageChange(m.page);
            onPageSizeChange(m.pageSize);
          }}
          hideFooterPagination
          hideFooter
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            height: 400,
            width: '100%',
            '& .MuiDataGrid-main': {
              overflow: 'auto',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#2c7a7b',
              color: 'black',
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                fontSize: '0.8rem',
              },
              '& .MuiDataGrid-iconButtonContainer': {
                color: 'black',
              },
              '& .MuiDataGrid-sortIcon': {
                color: 'black',
              },
              '& .MuiDataGrid-menuIcon': {
                color: 'black',
              },
            },
            '& .MuiDataGrid-columnHeader': {
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
              '&:last-of-type': {
                borderRight: 'none',
              },
            },
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid rgba(224, 224, 224, 1)',
              fontSize: '0.8rem',
              '&:last-of-type': {
                borderRight: 'none',
              },
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(even)': {
                backgroundColor: '#f8f9fa',
              },
              '&:hover': {
                backgroundColor: '#e3f2fd !important',
              },
            },
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              justifyContent: 'center',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              whiteSpace: 'normal',
              lineHeight: 1.3,
              textAlign: 'center',
            },
          }}
        />
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          width: '100%',
          backgroundColor: 'white',
          flexShrink: 0,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing <strong>{rows.length > 0 ? page * pageSize + 1 : 0}</strong> to{' '}
          <strong>{Math.min((page + 1) * pageSize, rowCount)}</strong> of{' '}
          <strong>{rowCount.toLocaleString()}</strong> records
        </Typography>

        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Rows per page:
            </Typography>
            <Select
              size="small"
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(0);
              }}
            >
              {[25, 50, 100].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Pagination
            page={page + 1}
            count={Math.ceil(rowCount / pageSize)}
            onChange={(_, v) => onPageChange(v - 1)}
            color="primary"
            shape="rounded"
            size="small"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default BaseDataGrid;