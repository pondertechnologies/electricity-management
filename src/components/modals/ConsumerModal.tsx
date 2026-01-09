import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  ElectricBolt as ElectricBoltIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
  Paid as PaidIcon,
  SwapHoriz as SwapHorizIcon,
  SolarPower as SolarPowerIcon,
} from '@mui/icons-material';
import { Consumer, ConsumerDetails } from '../../types/consumer';
import { consumerAPI } from '../../services/api';


interface ConsumerModalProps {
  open: boolean;
  onClose: () => void;
  viewType: 'details' | 'eb';
  selectedRow: Consumer | null;
}

const ConsumerModal: React.FC<ConsumerModalProps> = ({
  open,
  onClose,
  viewType,
  selectedRow,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [consumerDetails, setConsumerDetails] = useState<ConsumerDetails | null>(null);
  const [ebExtractData, setEbExtractData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format date utility
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format currency utility
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get service status chip
  const getServiceStatusChip = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'LIVE':
        return <Chip label="LIVE" color="success" size="small" />;
      case 'DISCONNECTED':
        return <Chip label="DISCONNECTED" color="error" size="small" />;
      case 'TEMPORARY':
        return <Chip label="TEMPORARY" color="warning" size="small" />;
      default:
        return <Chip label={status || 'N/A'} size="small" />;
    }
  };

  // Fetch data based on view type
  useEffect(() => {
    if (open && selectedRow) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          if (viewType === 'details') {
            const response = await consumerAPI.getConsumerDetails(selectedRow.consumerNumber);
            setConsumerDetails(response);
            setEbExtractData(null);
          } else {
            const response = await consumerAPI.getConsumerEBExtractDetails(selectedRow.consumerNumber);
            setEbExtractData(response);
            setConsumerDetails(null);
          }
        } catch (err: any) {
          setError(err.message || `Failed to load ${viewType === 'details' ? 'consumer details' : 'EB extract'}`);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [open, selectedRow, viewType]);

  // Reset state on close
  const handleClose = () => {
    setTabValue(0);
    setConsumerDetails(null);
    setEbExtractData(null);
    setError(null);
    onClose();
  };

  // Render HTML content for EB extract
  const renderHtmlContent = (html: string) => {
    const sanitizedHtml = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ''
    );

    return (
      <Box
        sx={{
          maxHeight: '70vh',
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: 1,
          p: 2,
          backgroundColor: '#e9f5db',
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.8em',
            marginBottom: '1rem',
          },
          '& th, & td': {
            border: '1px solid #000',
            padding: '4px',
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: '#c4c0b5',
            fontWeight: 'bold',
          },
          '& .style17': {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '15px',
            color: '#0061C1',
          },
          '& .style19': {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '12px',
          },
          '& .ccbills': {
            border: '1px solid #000',
            borderCollapse: 'collapse',
            fontSize: '0.8em',
            fontFamily: 'Cambria, "Hoefler Text", "Liberation Serif", Times, "Times New Roman", serif',
          },
          '& .shead': {
            fontFamily: 'georgia',
            fontSize: '14px',
            color: '#000',
            backgroundColor: '#fac473',
          },
          '& .mth': {
            backgroundColor: '#cbc6bc',
            fontWeight: 'bold',
            color: '#000',
            fontSize: '12px',
          },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </Box>
    );
  };

  if (!selectedRow) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={viewType === 'eb' ? 'lg' : 'lg'}
      fullWidth
      fullScreen={viewType === 'eb'}
      PaperProps={{
        sx: viewType === 'eb' ? {
          height: '95vh',
          margin: '2vh',
          width: '96vw',
          maxWidth: '96vw !important',
        } : { maxHeight: '90vh' },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pr: 2,
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {viewType === 'details' ? (
            <>
              <Avatar sx={{ bgcolor: '#2c7a7b' }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Consumer Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consumer: {selectedRow.consumerNumber} - {selectedRow.consumerName}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Avatar sx={{ bgcolor: '#1976d2' }}>
                <ReceiptIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  EB Extract
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consumer: {selectedRow.consumerNumber} - {selectedRow.consumerName}
                </Typography>
              </Box>
            </>
          )}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: viewType === 'eb' ? 0 : 2,
          overflow: viewType === 'eb' ? 'hidden' : 'auto',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>
              Loading {viewType === 'details' ? 'Consumer Details' : 'EB Extract'}...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : viewType === 'details' ? (
          consumerDetails ? (
            <Box>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<PersonIcon />} iconPosition="start" label="Basic Info" />
                <Tab icon={<ElectricBoltIcon />} iconPosition="start" label="Consumption" />
                <Tab icon={<PaidIcon />} iconPosition="start" label="Misc Collections" />
                <Tab icon={<HistoryIcon />} iconPosition="start" label="Extraction Logs" />
                <Tab icon={<AccountBalanceIcon />} iconPosition="start" label="Due Details" />
                <Tab icon={<SwapHorizIcon />} iconPosition="start" label="Meter Changes" />
                <Tab icon={<SolarPowerIcon />} iconPosition="start" label="Solar Details" />
              </Tabs>

              {/* Basic Info Tab */}
              {tabValue === 0 && (
                <Box>
                  <Grid container spacing={3}>
                    {/* Consumer Basic Info */}
                    <Grid item xs={12} {...({} as any)}>
                      <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon /> Consumer Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Consumer Number
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {consumerDetails.info.consumerNumber}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Consumer Name
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {consumerDetails.info.consumerName}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Address
                            </Typography>
                            <Typography variant="body1">
                              {consumerDetails.info.address}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Mobile Number
                            </Typography>
                            <Typography variant="body1">
                              {consumerDetails.info.mobileNumber || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Service Status
                            </Typography>
                            {getServiceStatusChip(consumerDetails.info.serviceStatus)}
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    {/* Service Details */}
                    <Grid item xs={12} sm={6} {...({} as any)}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ElectricBoltIcon /> Service Details
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Distribution
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.distribution}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Circle
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.circle}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Section
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.section}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Region
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.region}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Service Category
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.serviceCategory}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Service Type
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.serviceType}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Tariff Code
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.tariffCode}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    {/* Technical Details */}
                    <Grid item xs={12} sm={6} {...({} as any)}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimelineIcon /> Technical Details
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Sanctioned Load
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.sanctionedLoad} kW
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Meter Number
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.meterNumber}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Phase
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.phase}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Voltage Level
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.voltageLevel}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Bill Paid By
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.billPaidBy}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Corporation Ward
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.corporationWard}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Excess Demand
                            </Typography>
                            <Typography variant="body2">
                              {formatCurrency(consumerDetails.info.excessDemand)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              PF Penalty
                            </Typography>
                            <Typography variant="body2">
                              {formatCurrency(consumerDetails.info.pfPenalty)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    {/* Financial Details */}
                    <Grid item xs={12} sm={6} {...({} as any)}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccountBalanceIcon /> Financial Details
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Total Due Amount
                            </Typography>
                            <Typography variant="body2" color="error.main" fontWeight={500}>
                              {formatCurrency(consumerDetails.info.totalDueAmount)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Due Date
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(consumerDetails.info.dueDate)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Fixed Cost
                            </Typography>
                            <Typography variant="body2">
                              {formatCurrency(consumerDetails.info.fixedCost)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Minimum Charge
                            </Typography>
                            <Typography variant="body2">
                              {formatCurrency(consumerDetails.info.minCharge)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              BPSC
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.bpsc}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Welding Charge
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.weldingCharge}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Electricity Tax
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.electricityTax}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    {/* Additional Info */}
                    <Grid item xs={12} sm={6} {...({} as any)}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HomeIcon /> Additional Information
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Aadhar Status
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.aadharStatus}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              PAN Number
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.panNumber}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              GST Number
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.gstNumber || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Consumer Rating
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.consumerRating || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Zero Unit Months
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.zeroUnitConsumptionInMonths || '0'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              ACCD As On Date
                            </Typography>
                            <Typography variant="body2">
                              {consumerDetails.info.accdAsOnDate}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} {...({} as any)}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Last Updated
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(consumerDetails.info.modifiedAt)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Consumption Tab */}
              {tabValue === 1 && consumerDetails.consumption && consumerDetails.consumption.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ElectricBoltIcon /> Consumption History
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Assessment Date</TableCell>
                          <TableCell align="right">Units (kWh)</TableCell>
                          <TableCell align="right">Recorded Demand</TableCell>
                          <TableCell align="right">Power Factor</TableCell>
                          <TableCell align="right">CC Charges</TableCell>
                          <TableCell align="right">Fixed Charges</TableCell>
                          <TableCell align="right">Total Charges</TableCell>
                          <TableCell align="right">Amount Paid</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {consumerDetails.consumption.map((consumption, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatDate(consumption.assessmentDate)}</TableCell>
                            <TableCell align="right">{consumption.consumptionUnits.toFixed(2)}</TableCell>
                            <TableCell align="right">{consumption.readingRecordedDemand.toFixed(2)}</TableCell>
                            <TableCell align="right">{consumption.readingPowerFactor.toFixed(2)}</TableCell>
                            <TableCell align="right">{formatCurrency(consumption.chargesCc)}</TableCell>
                            <TableCell align="right">{formatCurrency(consumption.chargesFixed)}</TableCell>
                            <TableCell align="right">{formatCurrency(consumption.chargesTotal)}</TableCell>
                            <TableCell align="right">{formatCurrency(consumption.collectionAmountPaid)}</TableCell>
                            <TableCell>{formatDate(consumption.finalbillDueDate)}</TableCell>
                            <TableCell>
                              <Chip
                                label={consumption.assessmentStatus}
                                size="small"
                                color={consumption.assessmentStatus === 'NORMAL' ? 'success' : 'warning'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Showing {consumerDetails.consumption.length} consumption records
                  </Typography>
                </Box>
              )}

              {/* Misc Collections Tab */}
              {tabValue === 2 && consumerDetails.miscCollection && consumerDetails.miscCollection.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaidIcon /> Miscellaneous Collections
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Slip Date</TableCell>
                          <TableCell>Reason</TableCell>
                          <TableCell>Period</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Receipt No</TableCell>
                          <TableCell>Account Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {consumerDetails.miscCollection.map((collection, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatDate(collection.slipDate)}</TableCell>
                            <TableCell>{collection.slipReason}</TableCell>
                            <TableCell>{collection.slipPeriod}</TableCell>
                            <TableCell align="right">{formatCurrency(collection.totalSlipAmount)}</TableCell>
                            <TableCell>{formatDate(collection.dueDate)}</TableCell>
                            <TableCell>{collection.receiptNo}</TableCell>
                            <TableCell>{collection.accountDescription}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Extraction Logs Tab */}
              {tabValue === 3 && consumerDetails.extractionLogs && consumerDetails.extractionLogs.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon /> Extraction Logs
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Remarks</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {consumerDetails.extractionLogs.map((log, index) => (
                          <TableRow key={index}>
                            <TableCell>{formatDate(log.createdAt)}</TableCell>
                            <TableCell>
                              <Chip
                                label={log.parseStatus}
                                size="small"
                                color={log.parseStatus === 'PARSED' ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell>{log.remarks || 'No remarks'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Last extraction: {formatDate(consumerDetails.extractionLogs[0]?.createdAt)}
                  </Typography>
                </Box>
              )}

              {/* Other Tabs - Placeholder for empty data */}
              {(tabValue === 4 || tabValue === 5 || tabValue === 6) && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">
                    {tabValue === 4 && 'No due details available'}
                    {tabValue === 5 && 'No meter change records available'}
                    {tabValue === 6 && 'No solar consumption data available'}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Alert severity="info" sx={{ m: 2 }}>
              No consumer details available.
            </Alert>
          )
        ) : ebExtractData ? (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="HTML View" />
              <Tab label="Raw Data" />
            </Tabs>

            <Box sx={{ flex: 1, overflow: 'auto', p: tabValue === 0 ? 0 : 2 }}>
              {tabValue === 0 ? (
                renderHtmlContent(ebExtractData.htmlContent || '')
              ) : (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    API Response Data
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', overflow: 'auto' }}>
                    <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                      {JSON.stringify(ebExtractData, null, 2)}
                    </pre>
                  </Paper>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Retrieved: {new Date(ebExtractData.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Alert severity="info" sx={{ m: 2 }}>
            No EB Extract data available for this consumer.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
        {viewType === 'eb' && ebExtractData && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(ebExtractData.htmlContent);
                printWindow.document.close();
                printWindow.print();
              }
            }}
          >
            Print
          </Button>
        )}
        {viewType === 'details' && consumerDetails && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              const dataStr = JSON.stringify(consumerDetails, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
              const exportFileDefaultName = `consumer-${consumerDetails.info.consumerNumber}-details.json`;
              const linkElement = document.createElement('a');
              linkElement.setAttribute('href', dataUri);
              linkElement.setAttribute('download', exportFileDefaultName);
              linkElement.click();
            }}
          >
            Download JSON
          </Button>
        )}
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsumerModal;