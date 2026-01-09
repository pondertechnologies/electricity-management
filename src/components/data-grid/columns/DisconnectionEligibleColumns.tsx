// components/data-grid/columns/DisconnectionEligibleColumns.tsx
import { GridColDef } from '@mui/x-data-grid';
import { Tooltip, Button } from '@mui/material';
import { DisconnectionEligible } from '../../../types/disconnection-eligible';
import { formatCurrency, formatNumber } from '../../../services/api';

interface DisconnectionEligibleColumnsProps {
    onViewDetails?: (row: DisconnectionEligible) => void;
}

export const getDisconnectionEligibleColumns = ({
    onViewDetails,
}: DisconnectionEligibleColumnsProps): GridColDef[] => {
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
            field: 'consumerName',
            headerName: 'Consumer Name',
            width: 220,
            headerAlign: 'center',
            align: 'left',
            sortable: true,
            filterable: true,
        },
        {
            field: 'circle',
            headerName: 'Circle',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            filterable: true,
        },
        {
            field: 'section',
            headerName: 'Section',
            width: 140,
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            filterable: true,
        },
        {
            field: 'phase',
            headerName: 'Phase',
            width: 80,
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            filterable: true,
        },
        {
            field: 'sanctionedLoad',
            headerName: 'Sanctioned Load (kW)',
            width: 130,
            headerAlign: 'center',
            align: 'right',
            sortable: true,
            filterable: true,
            valueFormatter: (value) =>
                value == null ? '-' : formatNumber(Number(value)),
        },
        {
            field: 'recordsCount',
            headerName: 'Records Count',
            width: 110,
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            filterable: true,
            valueFormatter: (value) => value ?? '-',
        },
        {
            field: 'billingZeroUnitMonths',
            headerName: 'Zero Unit Months',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            filterable: true,
            valueFormatter: (value) => value ?? '-',
        },
        {
            field: 'totalUnits',
            headerName: 'Total Units',
            width: 100,
            headerAlign: 'center',
            align: 'right',
            sortable: true,
            filterable: true,
            valueFormatter: (value) =>
                value == null ? '-' : formatNumber(Number(value)),
        },
        {
            field: 'totalDemand',
            headerName: 'Total Demand (kW)',
            width: 120,
            headerAlign: 'center',
            align: 'right',
            sortable: true,
            filterable: true,
            valueFormatter: (value) =>
                value == null ? '-' : formatNumber(Number(value)),
        },
        {
            field: 'totalCcCharges',
            headerName: 'Total CC Charges (₹)',
            width: 140,
            headerAlign: 'center',
            align: 'right',
            sortable: true,
            filterable: true,
            valueFormatter: (value) =>
                value == null ? '-' : formatCurrency(Number(value)),
        },
        {
            field: 'fixedRate',
            headerName: 'Fixed Rate (₹)',
            width: 120,
            headerAlign: 'center',
            align: 'right',
            sortable: true,
            filterable: true,
            valueFormatter: (value) =>
                value == null ? '-' : formatCurrency(Number(value)),
        },
        {
            field: 'monthlySavings',
            headerName: 'Monthly Savings (₹)',
            width: 140,
            headerAlign: 'center',
            align: 'right',
            sortable: true,
            filterable: true,
            valueFormatter: (value) =>
                value == null ? '-' : formatCurrency(Number(value)),
        },
        {
            field: 'yearlySavings',
            headerName: 'Yearly Savings (₹)',
            width: 140,
            headerAlign: 'center',
            align: 'right',
            sortable: true,
            filterable: true,
            valueFormatter: (value) =>
                value == null ? '-' : formatCurrency(Number(value)),
        },
        {
            field: 'expectedRefund',
            headerName: 'Expected Refund (₹)',
            width: 140,
            headerAlign: 'center',
            align: 'right',
            sortable: true,
            filterable: true,
            valueFormatter: (value) =>
                value == null ? '-' : formatCurrency(Number(value)),
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
                <Tooltip title="View Consumer Details">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => onViewDetails?.(params.row as DisconnectionEligible)}
                        sx={{ minWidth: 70, py: 0.5, fontSize: '0.75rem' }}
                    >
                        View
                    </Button>
                </Tooltip>
            ),
        },
    ];
};

export const defaultDisconnectionEligibleColumns = getDisconnectionEligibleColumns({});
export default getDisconnectionEligibleColumns;