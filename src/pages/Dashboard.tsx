import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  LinearProgress,
  Button,
  Divider,
  alpha,
  useTheme,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Bolt,
  People,
  AttachMoney,
  ShowChart,
  CalendarToday,
  PowerOff,
  TrendingFlat,
  Refresh,
  Error as ErrorIcon,
  ExpandMore,
  Speed,
  MonetizationOn,
} from '@mui/icons-material';
import DataTable from 'react-data-table-component';

// Import API service
import {
  dashboardAPI,
  formatCurrency,
  formatNumber,
  DashboardData as DashboardDataType,
  setApiInterceptor
} from '../services/api';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Use the interface from API service
type DashboardData = DashboardDataType;

// DataTable custom styles
const getDataTableStyles = (theme: any) => ({
  table: {
    style: {
      backgroundColor: 'transparent',
    },
  },
  headRow: {
    style: {
      backgroundColor: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.divider}`,
      minHeight: '52px',
    },
  },
  headCells: {
    style: {
      paddingLeft: '16px',
      paddingRight: '16px',
      fontWeight: 600,
      fontSize: '0.875rem',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
    },
  },
  rows: {
    style: {
      minHeight: '48px',
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
      },
    },
  },
  cells: {
    style: {
      paddingLeft: '16px',
      paddingRight: '16px',
      fontSize: '0.875rem',
      color: theme.palette.text.secondary,
    },
  },
  pagination: {
    style: {
      borderTop: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.default,
    },
  },
});

// Define color constants for consistent usage
const COLORS = {
  PRIMARY: '#4C51BF',
  SECONDARY: '#805AD5',
  SUCCESS: '#38A169',
  WARNING: '#D69E2E',
  ERROR: '#E53E3E',
  INFO: '#3182CE',
  TEAL: '#38B2AC',
  ORANGE: '#DD6B20',
  PURPLE: '#667EEA',
  PINK: '#764BA2',
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'charts',
    'tables',
    'additionalStats'
  ]);

  // Set up API interceptor for global error handling
  useEffect(() => {
    setApiInterceptor((error: Error) => {
      console.error('API Error:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        setSnackbar({
          open: true,
          message: 'Session expired. Please login again.',
          severity: 'error'
        });
      }
    });
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardAPI.getDashboardData();
      setDashboardData(data);

      if (!loading) {
        setSnackbar({
          open: true,
          message: 'Dashboard data refreshed successfully',
          severity: 'success'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });

      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAccordionChange = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Calculate percentage
  const calculatePercentage = (part: number, total: number): string => {
    return total > 0 ? ((part / total) * 100).toFixed(1) : '0';
  };

  if (loading && !dashboardData) {
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading dashboard data...
          </Typography>
        </Box>
        );
  }

        if (error && !dashboardData) {
    return (
        <Box sx={{ p: 3 }}>
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            icon={<ErrorIcon />}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={fetchDashboardData}
              >
                Retry
              </Button>
            }
          >
            <Typography variant="h6" gutterBottom>
              Failed to Load Dashboard
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchDashboardData}
            fullWidth
          >
            Try Again
          </Button>
        </Box>
        );
  }

        if (!dashboardData) {
    return null;
  }

        const {
          sanctionedLoadSummary,
          consumerSummary,
          disconnectionEligibleSummary,
          loadReductionSummary,
          billingLT,
          billingHT,
          dueStatusSummary,
          yearWiseBillingSummary,
          htYearMonthBillingSummary,
          serviceStatusCounts,
          serviceTypeCounts,
          circleCounts,
          distributionCounts,
          sectionCounts,
  } = dashboardData;

        // Prepare data for Chart.js charts
        const yearWiseChartData = {
          labels: yearWiseBillingSummary
      .filter(item => item.year >= 2020)
      .map(item => item.year.toString()),
        datasets: [
        {
          label: 'Billed Amount',
        data: yearWiseBillingSummary
          .filter(item => item.year >= 2020)
          .map(item => item.totalBilledAmount / 1000000),
        borderColor: COLORS.PRIMARY,
        backgroundColor: alpha(COLORS.PRIMARY, 0.1),
        fill: true,
        tension: 0.3,
        borderWidth: 2,
      },
        {
          label: 'Paid Amount',
        data: yearWiseBillingSummary
          .filter(item => item.year >= 2020)
          .map(item => item.totalPaidAmount / 1000000),
        borderColor: COLORS.SUCCESS,
        backgroundColor: alpha(COLORS.SUCCESS, 0.1),
        fill: true,
        tension: 0.3,
        borderWidth: 2,
      },
        ],
  };

        const dueStatusPieData = {
          labels: dueStatusSummary.map(item => item.dueStatus),
        datasets: [
        {
          data: dueStatusSummary.map(item => item.count),
        backgroundColor: [
        COLORS.ERROR,
        COLORS.ORANGE,
        COLORS.INFO,
        '#718096',
        COLORS.SUCCESS,
        ],
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
        hoverOffset: 15,
      },
        ],
  };

        const htMonthlyChartData = {
          labels: htYearMonthBillingSummary.slice(-12).map(item =>
        `${item.year}-${item.month.toString().padStart(2, '0')}`
        ),
        datasets: [
        {
          label: 'Billed Amount (₹ Millions)',
        data: htYearMonthBillingSummary.slice(-12).map(item => item.totalBilledAmount / 1000000),
        backgroundColor: alpha(COLORS.SECONDARY, 0.7),
        borderColor: COLORS.SECONDARY,
        borderWidth: 1,
        borderRadius: 6,
      },
        ],
  };

        // Chart.js options with 100% width
        const lineChartOptions = {
          responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
          position: 'top' as const,
        labels: {
          color: theme.palette.text.secondary,
        font: {
          size: 12,
          },
        padding: 15,
        usePointStyle: true,
        },
      },
        tooltip: {
          mode: 'index' as const,
        intersect: false,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxPadding: 5,
      },
    },
        scales: {
          x: {
          grid: {
          color: alpha(theme.palette.divider, 0.2),
        drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        font: {
          size: 11,
          },
        },
      },
        y: {
          grid: {
          color: alpha(theme.palette.divider, 0.2),
        drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        font: {
          size: 11,
          },
        callback: function (value: any) {
            return '₹' + value + 'M';
          },
        },
      },
    },
  };

        const pieChartOptions = {
          responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
          position: 'right' as const,
        labels: {
          color: theme.palette.text.secondary,
        font: {
          size: 11,
          },
        padding: 15,
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
        },
      },
        tooltip: {
          backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
      },
    },
  };

        const barChartOptions = {
          responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
          display: false,
      },
        tooltip: {
          backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `₹${context.raw}M`;
          },
        },
      },
    },
        scales: {
          x: {
          grid: {
          color: alpha(theme.palette.divider, 0.2),
        display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        font: {
          size: 11,
          },
        maxRotation: 45,
        },
      },
        y: {
          grid: {
          color: alpha(theme.palette.divider, 0.2),
        },
        ticks: {
          color: theme.palette.text.secondary,
        font: {
          size: 11,
          },
        callback: function (value: any) {
            return '₹' + value + 'M';
          },
        },
      },
    },
  };

        // DataTable columns for Due Status
        const dueStatusColumns = [
        {
          name: 'Due Status',
      selector: (row: any) => row.dueStatus,
      cell: (row: any) => (
        <Chip
          label={row.dueStatus}
          size="small"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor:
              row.dueStatus === 'Due Date Passed' ? alpha(COLORS.ERROR, 0.1) :
                row.dueStatus === 'Due Today' ? alpha(COLORS.ORANGE, 0.1) :
                  row.dueStatus === 'Future Due' ? alpha(COLORS.INFO, 0.1) :
                    row.dueStatus === 'No Due' ? alpha(COLORS.SUCCESS, 0.1) :
                      alpha('#718096', 0.1),
            color:
              row.dueStatus === 'Due Date Passed' ? COLORS.ERROR :
                row.dueStatus === 'Due Today' ? COLORS.ORANGE :
                  row.dueStatus === 'Future Due' ? COLORS.INFO :
                    row.dueStatus === 'No Due' ? COLORS.SUCCESS :
                      theme.palette.text.secondary,
          }}
        />
        ),
        minWidth: '180px',
    },
        {
          name: 'Connections',
      selector: (row: any) => row.count,
      format: (row: any) => formatNumber(row.count),
        right: true,
        minWidth: '120px',
    },
        {
          name: 'Total Due Amount',
      selector: (row: any) => row.totalDueAmountSum,
      format: (row: any) => formatCurrency(row.totalDueAmountSum),
        right: true,
        minWidth: '150px',
    },
        {
          name: 'Avg per Connection',
      selector: (row: any) => row.count > 0 ? row.totalDueAmountSum / row.count : 0,
      format: (row: any) => formatCurrency(row.count > 0 ? row.totalDueAmountSum / row.count : 0),
        right: true,
        minWidth: '150px',
    },
        ];

  // Prepare service status data for DataTable
  const totalServiceStatus = serviceStatusCounts.reduce((sum, item) => sum + item.count, 0);
  const serviceStatusData = serviceStatusCounts.map(item => ({
          ...item,
          percentage: calculatePercentage(item.count, totalServiceStatus),
  }));

        const serviceStatusColumns = [
        {
          name: 'Status',
      selector: (row: any) => row.name,
      cell: (row: any) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: '240px' }}>
          {row.name}
        </Typography>
        ),
        minWidth: '240px',
    },
        {
          name: 'Count',
      selector: (row: any) => row.count,
      format: (row: any) => formatNumber(row.count),
        right: true,
        minWidth: '100px',
    },
        {
          name: 'Percentage',
      selector: (row: any) => row.percentage,
      format: (row: any) => `${row.percentage}%`,
        right: true,
        minWidth: '100px',
    }
        ];

        // Column definitions for Distribution Wise Consumers
        const distributionColumns = [
        {
          name: 'Distribution Name',
      selector: (row: any) => row.name,
        sortable: true,
        minWidth: '160px',
      cell: (row: any) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
          {row.name}
        </Typography>
        ),
    },
        {
          name: 'Count',
      selector: (row: any) => row.count,
      format: (row: any) => formatNumber(row.count),
        sortable: true,
        right: true,
        minWidth: '50px',
    },
        {
          name: 'Percentage',
      selector: (row: any) => {
        const total = distributionCounts.reduce((sum: any, item: any) => sum + item.count, 0);
        return calculatePercentage(row.count, total);
      },
      format: (row: any) => {
        const total = distributionCounts.reduce((sum: any, item: any) => sum + item.count, 0);
        return `${calculatePercentage(row.count, total)}%`;
      },
        right: true,
        minWidth: '50px',
    },
        ];

        // Column definitions for Area Wise Consumers
        const areaColumns = [
        {
          name: 'Area Name',
      selector: (row: any) => row.name,
        sortable: true,
        minWidth: '160px',
      cell: (row: any) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
          {row.name}
        </Typography>
        ),
    },
        {
          name: 'Count',
      selector: (row: any) => row.count,
      format: (row: any) => formatNumber(row.count),
        sortable: true,
        right: true,
        minWidth: '50px',
    },
        {
          name: 'Percentage',
      selector: (row: any) => {
        const total = sectionCounts.reduce((sum: any, item: any) => sum + item.count, 0);
        return calculatePercentage(row.count, total);
      },
      format: (row: any) => {
        const total = sectionCounts.reduce((sum: any, item: any) => sum + item.count, 0);
        return `${calculatePercentage(row.count, total)}%`;
      },
        right: true,
        minWidth: '50px',
    },
        ];

        // Main stats cards with colorful solid colors
        const statsCards = [
        {
          title: 'TOTAL SANCTIONED LOAD',
        value: `${formatNumber(sanctionedLoadSummary.totalSanctionedLoad)} kW`,
        subValue: `HT: ${formatNumber(sanctionedLoadSummary.htSanctionedLoad)} kW • LT: ${formatNumber(sanctionedLoadSummary.ltSanctionedLoad)} kW`,
        icon: <Bolt sx={{ color: 'white' }} />,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        solidColor: COLORS.PURPLE,
        trend: 'up',
        change: '2.5%',
    },
        {
          title: 'TOTAL CONSUMERS',
        value: formatNumber(consumerSummary.totalConsumers),
        subValue: `HT: ${consumerSummary.htConsumers} • LT: ${formatNumber(consumerSummary.ltConsumers)}`,
        icon: <People sx={{ color: 'white' }} />,
        gradient: 'linear-gradient(135deg, #4c51bf 0%, #805ad5 100%)',
        solidColor: COLORS.PRIMARY,
        trend: 'up',
        change: '1.2%',
    },
        {
          title: 'DISCONNECTION ELIGIBLE',
        value: formatNumber(disconnectionEligibleSummary.totalDisconnectionEligibleCount),
        subValue: `Monthly Saving: ${formatCurrency(disconnectionEligibleSummary.totalMonthlySaving)}`,
        icon: <PowerOff sx={{ color: 'white' }} />,
        gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
        solidColor: COLORS.ORANGE,
        trend: 'down',
        change: '5.3%',
    },
        {
          title: 'LOAD REDUCTION CONSUMERS',
        value: formatNumber(loadReductionSummary.totalConsumers),
        subValue: `Load Reduction: ${formatNumber(loadReductionSummary.totalLoadReductionKw)} kW`,
        icon: <TrendingDown sx={{ color: 'white' }} />,
        gradient: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
        solidColor: COLORS.TEAL,
        trend: 'flat',
        change: '0.8%',
    },
        {
          title: 'LT DUE AMOUNT',
        value: formatCurrency(billingLT.liveTotalPaymentDueAmount),
        subValue: `${formatNumber(billingLT.liveTotalPaymentDueConnection)} connections`,
        icon: <AttachMoney sx={{ color: 'white' }} />,
        gradient: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
        solidColor: COLORS.ERROR,
        trend: 'up',
        change: '3.7%',
    },
        {
          title: 'HT BILLING (LAST MONTH)',
        value: formatCurrency(billingHT.totalFullAmountLastMonth),
        subValue: `${billingHT.latestPaidConnection} paid / ${billingHT.latestTotalConnection} total`,
        icon: <ShowChart sx={{ color: 'white' }} />,
        gradient: 'linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)',
        solidColor: COLORS.WARNING,
        trend: 'up',
        change: '8.2%',
    },
        ];

        return (
        <Box sx={{ flexGrow: 1 }}>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Header - Reduced space */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5, color: theme.palette.text.primary }}>
                Dashboard Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time electricity management and analytics
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                icon={<CalendarToday fontSize="small" />}
                label={new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 1,
                  borderColor: alpha(theme.palette.divider, 0.5),
                  fontWeight: 500,
                }}
              />

              <Tooltip title="Refresh data">
                <IconButton
                  onClick={fetchDashboardData}
                  disabled={loading}
                  size="small"
                  sx={{
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    borderRadius: 1,
                    backgroundColor: loading ? alpha(theme.palette.action.disabled, 0.1) : 'transparent',
                  }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Stats Grid - 3 cards per row (30% each with 5% gap) */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3, // 24px gap
            mb: 4,
            justifyContent: { xs: 'center', sm: 'space-between' }
          }}>
            {statsCards.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  width: {
                    xs: '100%',      // Full width on mobile
                    sm: '48%',       // 48% on small screens (2 per row)
                    md: '30%',       // Exactly 30% on medium screens
                    lg: '30%'        // Exactly 30% on large screens
                  },
                  minWidth: { xs: '100%', sm: '48%', md: '31%', lg: '31%' },
                  maxWidth: { xs: '100%', sm: '48%', md: '31%', lg: '31%' },
                  flexShrink: 0,
                }}
              >
                <Card sx={{
                  height: '180px', // Fixed height for all cards
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  },
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {/* Top accent bar */}
                  <Box sx={{
                    height: 4,
                    width: '100%',
                    background: stat.gradient,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }} />

                  <CardContent sx={{
                    p: 2.5,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flex: 1 }}>
                      <Box sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        pr: 1
                      }}>
                        {/* Title - fixed line */}
                        <Typography
                          color="text.secondary"
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontSize: '0.7rem',
                            mb: 1,
                            display: 'block',
                            lineHeight: 1.2,
                            height: '26px', // Fixed 2 lines height
                            overflow: 'hidden',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {stat.title}
                        </Typography>

                        {/* Main Value - single line */}
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            mb: 1,
                            lineHeight: 1.2,
                            color: theme.palette.text.primary,
                            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                            height: '20px', // Fixed height for value
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {stat.value}
                        </Typography>

                        {/* Sub Value - fixed 2 lines */}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.3,
                            mb: 1,
                            height: '18px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontSize: '0.75rem',
                            flexShrink: 0,
                          }}
                        >
                          {stat.subValue}
                        </Typography>

                        {/* Trend indicator - fixed at bottom */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mt: 'auto',
                          pt: 1,
                          flexShrink: 0,
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            background: alpha(
                              stat.trend === 'up' ? COLORS.SUCCESS :
                                stat.trend === 'down' ? COLORS.ERROR : COLORS.WARNING,
                              0.1
                            )
                          }}>
                            {stat.trend === 'up' ? (
                              <TrendingUp sx={{ color: COLORS.SUCCESS, mr: 0.5, fontSize: 14 }} />
                            ) : stat.trend === 'down' ? (
                              <TrendingDown sx={{ color: COLORS.ERROR, mr: 0.5, fontSize: 14 }} />
                            ) : (
                              <TrendingFlat sx={{ color: COLORS.WARNING, mr: 0.5, fontSize: 14 }} />
                            )}
                            <Typography
                              variant="caption"
                              sx={{
                                color: stat.trend === 'up' ? COLORS.SUCCESS :
                                  stat.trend === 'down' ? COLORS.ERROR : COLORS.WARNING,
                                fontWeight: 800,
                                fontSize: '0.75rem'
                              }}
                            >
                              {stat.change}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Avatar - fixed position */}
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        ml: 1,
                        flexShrink: 0,
                      }}>
                        <Avatar
                          sx={{
                            background: stat.gradient,
                            color: 'white',
                            width: 48,
                            height: 48,
                            boxShadow: `0 4px 12px ${alpha(stat.solidColor, 0.4)}`,
                          }}
                        >
                          {stat.icon}
                        </Avatar>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {/* Charts Section - Collapsible */}
          <Accordion
            expanded={expandedSections.includes('charts')}
            onChange={() => handleAccordionChange('charts')}
            sx={{
              mb: 3,
              borderRadius: '12px !important',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                borderBottom: expandedSections.includes('charts') ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                borderRadius: '12px 12px 0 0',
                minHeight: '60px',
                '&.Mui-expanded': {
                  minHeight: '60px',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${COLORS.PRIMARY} 0%, ${COLORS.SECONDARY} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShowChart sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    Analytics & Trends
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Visual insights and performance metrics
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              {/* First Row: Year-wise and Due Status side by side (45%-45% with 10% gap) */}
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3, // 24px gap (approx 10% of container)
                mb: 3,
                justifyContent: { xs: 'center', sm: 'space-between' }
              }}>
                {/* Year-wise Billing Trend - 45% */}
                <Box sx={{
                  width: {
                    xs: '100%',      // Full width on mobile
                    sm: '48%',       // 48% on small screens
                    md: '48%',       // Exactly 45% on medium screens
                    lg: '48%'        // Exactly 45% on large screens
                  },
                  minWidth: { xs: '100%', sm: '48%', md: '48%', lg: '48%' },
                  maxWidth: { xs: '100%', sm: '48%', md: '48%', lg: '48%' },
                  flexShrink: 0,
                }}>
                  <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: '380px', // Fixed height for consistent sizing
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <CardContent sx={{
                      p: 3,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3,
                        flexShrink: 0,
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                          Year-wise Billing Trend
                        </Typography>
                        <Chip
                          label="Line Chart"
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: alpha(COLORS.PRIMARY, 0.1),
                            color: COLORS.PRIMARY
                          }}
                        />
                      </Box>
                      <Box sx={{
                        flex: 1,
                        width: '100%',
                        minHeight: '280px',
                      }}>
                        <Line
                          data={yearWiseChartData}
                          options={lineChartOptions}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Due Status Distribution - 45% */}
                <Box sx={{
                  width: {
                    xs: '100%',      // Full width on mobile
                    sm: '48%',       // 48% on small screens
                    md: '48%',       // Exactly 45% on medium screens
                    lg: '48%'        // Exactly 45% on large screens
                  },
                  minWidth: { xs: '100%', sm: '48%', md: '48%', lg: '48%' },
                  maxWidth: { xs: '100%', sm: '48%', md: '48%', lg: '48%' },
                  flexShrink: 0,
                }}>
                  <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: '380px', // Same fixed height as the other card
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <CardContent sx={{
                      p: 3,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3,
                        flexShrink: 0,
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                          Due Status Distribution
                        </Typography>
                        <Chip
                          label="Pie Chart"
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: alpha(COLORS.SECONDARY, 0.1),
                            color: COLORS.SECONDARY
                          }}
                        />
                      </Box>
                      <Box sx={{
                        flex: 1,
                        width: '100%',
                        minHeight: '280px',
                      }}>
                        <Pie
                          data={dueStatusPieData}
                          options={pieChartOptions}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* HT Monthly Billing - Full width but reduced height */}
              <Card sx={{
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      HT Monthly Billing Trend
                    </Typography>
                    <Chip
                      label="Bar Chart"
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: alpha(COLORS.SUCCESS, 0.1),
                        color: COLORS.SUCCESS
                      }}
                    />
                  </Box>
                  <Box sx={{ height: 280, width: '100%' }}>
                    <Bar
                      data={htMonthlyChartData}
                      options={barChartOptions}
                    />
                  </Box>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* Tables Section - Side by Side */}
          <Accordion
            expanded={expandedSections.includes('tables')}
            onChange={() => handleAccordionChange('tables')}
            sx={{
              mb: 3,
              borderRadius: '12px !important',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                borderBottom: expandedSections.includes('tables') ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                borderRadius: '12px 12px 0 0',
                minHeight: '60px',
                '&.Mui-expanded': {
                  minHeight: '60px',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${COLORS.ORANGE} 0%, #DD6B20 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ListIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    Detailed Reports
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Connection and service status details
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              {/* First Row: Due Status and Service Status - Stacked vertically */}
              <Box sx={{ mb: 4 }}>
                {/* Due Status Details - 100% width */}
                <Box sx={{ mb: 3 }}>
                  <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    width: '100%',
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                          Due Status Details
                        </Typography>
                      </Box>
                      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        <DataTable
                          columns={dueStatusColumns}
                          data={dueStatusSummary}
                          customStyles={getDataTableStyles(theme)}
                          dense
                          highlightOnHover
                          noHeader
                          responsive
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Service Status Summary - 100% width */}
                <Box>
                  <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    width: '100%',
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                          Service Status Summary
                        </Typography>
                      </Box>
                      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        <DataTable
                          columns={serviceStatusColumns}
                          data={serviceStatusData}
                          customStyles={getDataTableStyles(theme)}
                          dense
                          highlightOnHover
                          noHeader
                          responsive
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* NEW: Distribution Wise and Area Wise Consumers - Side by Side (45%-45%) */}
              <Typography variant="h6" sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 3,
                mt: 4,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                pt: 3
              }}>
                Consumer Distribution Analysis
              </Typography>

              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3, // 24px gap (approx 10% of container)
                mb: 3,
                justifyContent: { xs: 'center', sm: 'space-between' }
              }}>
                {/* Distribution Wise Consumers - 48% */}
                <Box sx={{
                  width: {
                    xs: '100%',      // Full width on mobile
                    sm: '48%',       // 48% on small screens
                    md: '48%',       // 48% on medium screens
                    lg: '48%'        // 48% on large screens
                  },
                  minWidth: { xs: '100%', sm: '48%', md: '48%', lg: '48%' },
                  maxWidth: { xs: '100%', sm: '48%', md: '48%', lg: '48%' },
                  flexShrink: 0,
                }}>
                  <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: '500px', // Fixed height for scrolling
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <CardContent sx={{
                      p: 0,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{
                        p: 3,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        flexShrink: 0
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                          Distribution Wise Consumers ({distributionCounts.length})
                        </Typography>
                      </Box>
                      <Box sx={{
                        flex: 1,
                        overflow: 'auto',
                        maxHeight: '400px'
                      }}>
                        <DataTable
                          columns={distributionColumns}
                          data={distributionCounts}
                          customStyles={getDataTableStyles(theme)}
                          dense
                          highlightOnHover
                          noHeader
                          responsive
                          defaultSortFieldId={1}
                          defaultSortAsc={false}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Area Wise Consumers - 48% */}
                <Box sx={{
                  width: {
                    xs: '100%',      // Full width on mobile
                    sm: '48%',       // 48% on small screens
                    md: '48%',       // 48% on medium screens
                    lg: '48%'        // 48% on large screens
                  },
                  minWidth: { xs: '100%', sm: '48%', md: '48%', lg: '48%' },
                  maxWidth: { xs: '100%', sm: '48%', md: '48%', lg: '48%' },
                  flexShrink: 0,
                }}>
                  <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: '500px', // Fixed height for scrolling
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <CardContent sx={{
                      p: 0,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{
                        p: 3,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        flexShrink: 0
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                          Area Wise Consumers ({sectionCounts.length})
                        </Typography>
                      </Box>
                      <Box sx={{
                        flex: 1,
                        overflow: 'auto',
                        maxHeight: '400px'
                      }}>
                        <DataTable
                          columns={areaColumns}
                          data={sectionCounts}
                          customStyles={getDataTableStyles(theme)}
                          dense
                          highlightOnHover
                          noHeader
                          responsive
                          defaultSortFieldId={1}
                          defaultSortAsc={false}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Additional Stats Cards - Equal 3 column split */}
          <Accordion
            expanded={expandedSections.includes('additionalStats')}
            onChange={() => handleAccordionChange('additionalStats')}
            sx={{
              mb: 3,
              borderRadius: '12px !important',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                borderBottom: expandedSections.includes('additionalStats') ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                borderRadius: '12px 12px 0 0',
                minHeight: '60px',
                '&.Mui-expanded': {
                  minHeight: '60px',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${COLORS.TEAL} 0%, #319795 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Speed sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    Performance Metrics
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Key insights and distribution statistics
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              {/* First Row: Load Reduction and Consumer Distribution - 45% each */}
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2, // Reduced gap (16px instead of 24px)
                mb: 2, // Reduced bottom margin
                justifyContent: { xs: 'center', sm: 'space-between' }
              }}>
                {/* Load Reduction Summary - 45% */}
                <Box sx={{
                  width: {
                    xs: '100%',      // Full width on mobile
                    sm: '48%',       // 48% on small screens
                    md: '45%',       // Exactly 45% on medium screens
                    lg: '45%'        // Exactly 45% on medium screens
                  },
                  minWidth: { xs: '100%', sm: '48%', md: '45%', lg: '45%' },
                  maxWidth: { xs: '100%', sm: '48%', md: '45%', lg: '45%' },
                  flexShrink: 0,
                }}>
                  <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(COLORS.TEAL, 0.1),
                            color: COLORS.TEAL,
                            width: 44,
                            height: 44,
                          }}
                        >
                          <TrendingDown fontSize="medium" />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: theme.palette.text.primary }}>
                            Load Reduction
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Energy optimization metrics
                          </Typography>
                        </Box>
                      </Box>

                      <Stack spacing={1.5}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                            Total Load Reduction
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: '#2D3748' }}>
                            {formatNumber(loadReductionSummary.totalLoadReductionKw)} kW
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {calculatePercentage(loadReductionSummary.totalLoadReductionKw, loadReductionSummary.totalCurrentSanctionedLoad)}% reduction
                          </Typography>
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                            Monthly Savings
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.SUCCESS }}>
                            {formatCurrency(loadReductionSummary.totalMonthlySaving)}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                            Yearly Savings
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.SUCCESS }}>
                            {formatCurrency(loadReductionSummary.totalYearlySaving)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                {/* Consumer Distribution - 45% */}
                <Box sx={{
                  width: {
                    xs: '100%',      // Full width on mobile
                    sm: '48%',       // 48% on small screens
                    md: '45%',       // Exactly 45% on medium screens
                    lg: '45%'        // Exactly 45% on medium screens
                  },
                  minWidth: { xs: '100%', sm: '48%', md: '45%', lg: '45%' },
                  maxWidth: { xs: '100%', sm: '48%', md: '45%', lg: '45%' },
                  flexShrink: 0,
                }}>
                  <Card sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(COLORS.PRIMARY, 0.1),
                            color: COLORS.PRIMARY,
                            width: 44,
                            height: 44,
                          }}
                        >
                          <People fontSize="medium" />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: theme.palette.text.primary }}>
                            Consumer Distribution
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            By circle and type
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
                          Service Type Distribution
                        </Typography>
                        {serviceTypeCounts.slice(0, 3).map((type, index) => {
                          const total = serviceTypeCounts.reduce((sum, item) => sum + item.count, 0);
                          const percentage = calculatePercentage(type.count, total);

                          return (
                            <Box key={index} sx={{ mb: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  {type.name}
                                </Typography>
                                <Typography variant="caption" fontWeight={700}>
                                  {formatNumber(type.count)} ({percentage}%)
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={parseFloat(percentage)}
                                sx={{
                                  height: 5,
                                  borderRadius: 3,
                                  backgroundColor: alpha(theme.palette.grey[300], 0.5),
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: index === 0 ? COLORS.PRIMARY : index === 1 ? COLORS.SECONDARY : COLORS.TEAL,
                                  }
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
                          Circle Distribution
                        </Typography>
                        {circleCounts.slice(0, 3).map((circle, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 1,
                              p: 1,
                              borderRadius: 1.5,
                              backgroundColor: alpha(
                                index === 0 ? COLORS.PRIMARY :
                                  index === 1 ? COLORS.SECONDARY : COLORS.TEAL,
                                0.05
                              ),
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {circle.name}
                            </Typography>
                            <Typography variant="caption" fontWeight={700}>
                              {formatNumber(circle.count)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* Second Row: Quick Stats - 100% */}
              <Box sx={{ width: '100%', mt: 2 }}>
                <Card sx={{
                  borderRadius: 2,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(COLORS.WARNING, 0.1),
                          color: COLORS.WARNING,
                          width: 44,
                          height: 44,
                        }}
                      >
                        <MonetizationOn fontSize="medium" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: theme.palette.text.primary }}>
                          Quick Stats
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Key performance indicators
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1%', // 1% gap between items (4 gaps × 1% = 4%)
                      justifyContent: { xs: 'center', sm: 'space-between' },
                      width: '100%',
                    }}>
                      {/* HT Consumers - 24% */}
                      <Box sx={{
                        width: {
                          xs: '48%',       // 2 per row on mobile
                          sm: '48%',       // 2 per row on small screens
                          md: '24%',       // 24% on medium screens
                          lg: '24%'        // 24% on large screens
                        },
                        minWidth: { xs: '48%', sm: '48%', md: '24%', lg: '24%' },
                        flexShrink: 0,
                        mb: { xs: 1.5, sm: 0 }, // Add bottom margin on mobile for stacking
                      }}>
                        <Box sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: alpha(COLORS.PRIMARY, 0.05),
                          borderRadius: 2,
                          border: `1px solid ${alpha(COLORS.PRIMARY, 0.1)}`,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, fontWeight: 600 }}>
                            HT Consumers
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.PRIMARY }}>
                            {consumerSummary.htConsumers}
                          </Typography>
                        </Box>
                      </Box>

                      {/* LT Consumers - 24% */}
                      <Box sx={{
                        width: {
                          xs: '48%',       // 2 per row on mobile
                          sm: '48%',       // 2 per row on small screens
                          md: '24%',       // 24% on medium screens
                          lg: '24%'        // 24% on large screens
                        },
                        minWidth: { xs: '48%', sm: '48%', md: '24%', lg: '24%' },
                        flexShrink: 0,
                        mb: { xs: 1.5, sm: 0 }, // Add bottom margin on mobile for stacking
                      }}>
                        <Box sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: alpha(COLORS.SUCCESS, 0.05),
                          borderRadius: 2,
                          border: `1px solid ${alpha(COLORS.SUCCESS, 0.1)}`,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, fontWeight: 600 }}>
                            LT Consumers
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.SUCCESS }}>
                            {formatNumber(consumerSummary.ltConsumers)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Disconnection Eligible - 24% */}
                      <Box sx={{
                        width: {
                          xs: '48%',       // 2 per row on mobile
                          sm: '48%',       // 2 per row on small screens
                          md: '24%',       // 24% on medium screens
                          lg: '24%'        // 24% on large screens
                        },
                        minWidth: { xs: '48%', sm: '48%', md: '24%', lg: '24%' },
                        flexShrink: 0,
                        mb: { xs: 1.5, sm: 0 }, // Add bottom margin on mobile for stacking
                      }}>
                        <Box sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: alpha(COLORS.ORANGE, 0.05),
                          borderRadius: 2,
                          border: `1px solid ${alpha(COLORS.ORANGE, 0.1)}`,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, fontWeight: 600 }}>
                            Disconnection Eligible
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.ORANGE }}>
                            {formatNumber(disconnectionEligibleSummary.totalDisconnectionEligibleCount)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* LT Due Connections - 24% */}
                      <Box sx={{
                        width: {
                          xs: '48%',       // 2 per row on mobile
                          sm: '48%',       // 2 per row on small screens
                          md: '24%',       // 24% on medium screens
                          lg: '24%'        // 24% on large screens
                        },
                        minWidth: { xs: '48%', sm: '48%', md: '24%', lg: '24%' },
                        flexShrink: 0,
                        mb: { xs: 1.5, sm: 0 }, // Add bottom margin on mobile for stacking
                      }}>
                        <Box sx={{
                          textAlign: 'center',
                          p: 1.5,
                          bgcolor: alpha(COLORS.ERROR, 0.05),
                          borderRadius: 2,
                          border: `1px solid ${alpha(COLORS.ERROR, 0.1)}`,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, fontWeight: 600 }}>
                            LT Due Connections
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.ERROR }}>
                            {formatNumber(billingLT.liveTotalPaymentDueConnection)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Footer */}
          <Box sx={{
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Data refreshes automatically every 15 minutes
            </Typography>
          </Box>
        </Box>
      </>
    );
  };

  // Custom List icon for tables section
  const ListIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );

  export default Dashboard;