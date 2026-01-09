import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  // Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Snackbar,
  // CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  // Send as SendIcon,
  // Clear as ClearIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Bolt as BoltIcon,
  SolarPower as SolarPowerIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { NewConnectionFormData } from '../types/new-connection-form';
// import { validateNewConnectionForm, formatFormDataForAPI } from '../utils/validation';
import { newConnectionAPI } from '../services/api';

// Requester designations
const DESIGNATIONS = [
  { value: '', label: 'Select' },
  { value: 'JE', label: 'JE (Junior Engineer)' },
  { value: 'AE', label: 'AE (Assistant Engineer)' },
];

interface FilterOptions {
  service_categories: string[];
  service_types: string[];
}

const NewConnectionRequestForm: React.FC = () => {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    service_categories: [],
    service_types: [],
  });

  // Form state
  const [formData, setFormData] = useState<NewConnectionFormData>({
    requesterDesignation: '',
    requesterName: '',
    connectionName: '',
    address: '',
    ward: '',
    loadDemand: '',
    serviceCategory: '',
    serviceType: '',
    otherComments: '',
    tariffCode: '',
    solarCapacity: '',
  });

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch filter options from API
  const fetchFilterOptions = async () => {
    try {
      setOptionsLoading(true);
      const data = await newConnectionAPI.getFilterOptions();
      console.log('Filter options from API:', data);
      
      // Add "Other" option to both categories and types
      const serviceCategories = [...(data.service_categories || []), 'Other'];
      const serviceTypes = [...(data.service_types || []), 'Other'];
      
      setFilterOptions({
        service_categories: serviceCategories,
        service_types: serviceTypes,
      });
    } catch (error: any) {
      console.error('Failed to fetch filter options:', error);
      setErrorMessage('Failed to load service options. Please refresh the page.');
      
      // Fallback to default options if API fails
      setFilterOptions({
        service_categories: [
          'Head Works',
          'LOCAL BODY / CORPORATION',
          'MLCP',
          'OTHERS',
          'Pumping Station',
          'STATE GOVERNMENT',
          'STP',
          'STP Vellalore',
          'WTP',
          'Other'
        ],
        service_types: [
          'NORMAL',
          'SOLAR NET FEED IN SERVICE',
          'SOLAR NET METERING SERVICE',
          'Other'
        ],
      });
    } finally {
      setOptionsLoading(false);
    }
  };

  // Refresh options
  const handleRefreshOptions = () => {
    fetchFilterOptions();
  };

  // Handle input changes
  const handleInputChange = (field: keyof NewConnectionFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    
    if (field === 'loadDemand' || field === 'solarCapacity') {
      // Handle numeric fields
      const numValue = value === '' ? '' : Number(value);
      if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
        setFormData(prev => ({
          ...prev,
          [field]: numValue,
        }));
        // Clear error for this field
        if (errors[field]) {
          setErrors(prev => ({ ...prev, [field]: '' }));
        }
      }
    } else {
      // Handle text fields
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
      // Clear error for this field
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  // Handle select changes
  const handleSelectChange = (field: keyof NewConnectionFormData) => (
    event: { target: { value: any } }
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Clear form
  // const handleClearForm = () => {
  //   setFormData({
  //     requesterDesignation: '',
  //     requesterName: '',
  //     connectionName: '',
  //     address: '',
  //     ward: '',
  //     loadDemand: '',
  //     serviceCategory: '',
  //     serviceType: '',
  //     otherComments: '',
  //     tariffCode: '',
  //     solarCapacity: '',
  //   });
  //   setErrors({});
  //   setSuccessMessage('');
  //   setErrorMessage('');
  // };

  // Validate form
  // const validateForm = (): boolean => {
  //   const validationErrors = validateNewConnectionForm(formData);
  //   setErrors(validationErrors);
  //   return Object.keys(validationErrors).length === 0;
  // };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // // Validate form
    // if (!validateForm()) {
    //   setErrorMessage('Please fix the errors in the form');
    //   return;
    // }

    // setLoading(true);
    // setErrorMessage('');
    // setSuccessMessage('');

    // try {
    //   // Format data for API
    //   const apiData = formatFormDataForAPI(formData);
      
    //   console.log('Submitting form data:', apiData);
      
    //   // Call API
    //   const response = await newConnectionAPI.createRequest(apiData);
      
    //   console.log('API Response:', response);
      
    //   if (response.success) {
    //     setSuccessMessage('New connection request submitted successfully!');
        
    //     // Reset form after successful submission
    //     setTimeout(() => {
    //       handleClearForm();
    //     }, 2000);
    //   } else {
    //     setErrorMessage(response.message || 'Failed to submit request. Please try again.');
    //   }
    // } catch (error: any) {
    //   console.error('Form submission error:', error);
    //   setErrorMessage(error.message || 'An error occurred. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
  };

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Check if solar-related fields should be shown
  const showSolarFields = formData.serviceType === 'SOLAR NET FEED IN SERVICE' || 
                         formData.serviceType === 'SOLAR NET METERING SERVICE';

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: 1200,
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Tooltip title="Go Back">
            <IconButton onClick={handleGoBack} color="primary">
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" fontWeight={600} color="primary">
            New Connection Request Form
          </Typography>
          
          {/* Refresh Options Button */}
          <Tooltip title="Refresh Service Options">
            <IconButton 
              onClick={handleRefreshOptions} 
              color="primary"
              size="small"
              disabled={optionsLoading}
              sx={{ ml: 'auto' }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Fill in all required fields to submit a new electricity connection request.
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Fields marked with <span style={{ color: '#d32f2f' }}>*</span> are mandatory.
          </Typography>
        </Alert>

        {/* Loading indicator for options */}
        {optionsLoading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Loading service options...
            </Typography>
            <LinearProgress />
          </Box>
        )}
      </Box>

      {/* Main Form */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: 'background.paper',
          opacity: optionsLoading ? 0.7 : 1,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6} {...({} as any)}>
              {/* Requester Information Card */}
              <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Requester Information
                    </Typography>
                  </Box>
                  
                  {/* Requester Designation */}
                  <FormControl 
                    fullWidth 
                    error={!!errors.requesterDesignation}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    disabled={optionsLoading}
                  >
                    <InputLabel id="requester-designation-label">
                      Requester Designation <span style={{ color: '#d32f2f' }}>*</span>
                    </InputLabel>
                    <Select
                      labelId="requester-designation-label"
                      value={formData.requesterDesignation}
                      onChange={handleSelectChange('requesterDesignation')}
                      label="Requester Designation *"
                      startAdornment={<PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                      {DESIGNATIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.requesterDesignation && (
                      <FormHelperText>{errors.requesterDesignation}</FormHelperText>
                    )}
                  </FormControl>

                  {/* Requester Name */}
                  <TextField
                    fullWidth
                    label="Requester Name *"
                    value={formData.requesterName}
                    onChange={handleInputChange('requesterName')}
                    error={!!errors.requesterName}
                    helperText={errors.requesterName}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    disabled={optionsLoading}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </CardContent>
              </Card>

              {/* Connection Details Card */}
              <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <BusinessIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Connection Details
                    </Typography>
                  </Box>
                  
                  {/* Connection Name */}
                  <TextField
                    fullWidth
                    label="Connection Name *"
                    value={formData.connectionName}
                    onChange={handleInputChange('connectionName')}
                    error={!!errors.connectionName}
                    helperText={errors.connectionName}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    disabled={optionsLoading}
                    InputProps={{
                      startAdornment: <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />

                  {/* Address */}
                  <TextField
                    fullWidth
                    label="Address *"
                    value={formData.address}
                    onChange={handleInputChange('address')}
                    error={!!errors.address}
                    helperText={errors.address}
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    disabled={optionsLoading}
                    InputProps={{
                      startAdornment: <HomeIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                  />

                  {/* Ward */}
                  <TextField
                    fullWidth
                    label="Ward Number *"
                    value={formData.ward}
                    onChange={handleInputChange('ward')}
                    error={!!errors.ward}
                    helperText={errors.ward || 'Enter ward number'}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    type="text"
                    disabled={optionsLoading}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />

                  {/* Load Demand */}
                  <TextField
                    fullWidth
                    label="Load Demand (KW) *"
                    value={formData.loadDemand}
                    onChange={handleInputChange('loadDemand')}
                    error={!!errors.loadDemand}
                    helperText={errors.loadDemand || 'Enter load demand in Kilowatts'}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    disabled={optionsLoading}
                    InputProps={{
                      startAdornment: <BoltIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      endAdornment: <Typography color="text.secondary">KW</Typography>,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6} {...({} as any)}>
              {/* Service Information Card */}
              <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <CategoryIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Service Information
                    </Typography>
                  </Box>
                  
                  {/* Service Category */}
                  <FormControl 
                    fullWidth 
                    error={!!errors.serviceCategory}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    disabled={optionsLoading || filterOptions.service_categories.length === 0}
                  >
                    <InputLabel id="service-category-label">
                      Service Category <span style={{ color: '#d32f2f' }}>*</span>
                    </InputLabel>
                    <Select
                      labelId="service-category-label"
                      value={formData.serviceCategory}
                      onChange={handleSelectChange('serviceCategory')}
                      label="Service Category *"
                      startAdornment={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {filterOptions.service_categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.serviceCategory && (
                      <FormHelperText>{errors.serviceCategory}</FormHelperText>
                    )}
                    {filterOptions.service_categories.length === 0 && !optionsLoading && (
                      <FormHelperText error>
                        No service categories available. Please refresh options.
                      </FormHelperText>
                    )}
                  </FormControl>

                  {/* Service Type */}
                  <FormControl 
                    fullWidth 
                    error={!!errors.serviceType}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    disabled={optionsLoading || filterOptions.service_types.length === 0}
                  >
                    <InputLabel id="service-type-label">
                      Service Type <span style={{ color: '#d32f2f' }}>*</span>
                    </InputLabel>
                    <Select
                      labelId="service-type-label"
                      value={formData.serviceType}
                      onChange={handleSelectChange('serviceType')}
                      label="Service Type *"
                      startAdornment={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {filterOptions.service_types.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.serviceType && (
                      <FormHelperText>{errors.serviceType}</FormHelperText>
                    )}
                    {filterOptions.service_types.length === 0 && !optionsLoading && (
                      <FormHelperText error>
                        No service types available. Please refresh options.
                      </FormHelperText>
                    )}
                  </FormControl>

                  {/* Solar Capacity (Conditional) */}
                  {showSolarFields && (
                    <TextField
                      fullWidth
                      label="Solar Capacity (KW)"
                      value={formData.solarCapacity}
                      onChange={handleInputChange('solarCapacity')}
                      error={!!errors.solarCapacity}
                      helperText={errors.solarCapacity || 'Enter solar capacity in Kilowatts'}
                      sx={{ mb: 2 }}
                      variant="outlined"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      disabled={optionsLoading}
                      InputProps={{
                        startAdornment: <SolarPowerIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        endAdornment: <Typography color="text.secondary">KW</Typography>,
                      }}
                    />
                  )}

                  {/* Tariff Code (Optional) */}
                  <TextField
                    fullWidth
                    label="Tariff Code (Optional)"
                    value={formData.tariffCode}
                    onChange={handleInputChange('tariffCode')}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    helperText="If applicable, enter the tariff code"
                    disabled={optionsLoading}
                  />
                </CardContent>
              </Card>

              {/* Additional Information Card */}
              <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <InfoIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Additional Information
                    </Typography>
                  </Box>
                  
                  {/* Other Comments */}
                  <TextField
                    fullWidth
                    label="Other Comments (Optional)"
                    value={formData.otherComments}
                    onChange={handleInputChange('otherComments')}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    variant="outlined"
                    helperText="Any additional information or special requirements"
                    disabled={optionsLoading}
                    InputProps={{
                      startAdornment: <InfoIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                  />

                  {/* Form Submission Info */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Note:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      • All mandatory fields must be completed
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      • Application number will be generated automatically
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Request will be processed within 3-5 working days
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Form Actions */}
          {/* <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item {...({} as any)}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={handleClearForm}
                  disabled={loading || optionsLoading}
                  sx={{ minWidth: 120 }}
                >
                  Clear All
                </Button>
              </Grid>
              <Grid item {...({} as any)}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={loading || optionsLoading || filterOptions.service_categories.length === 0 || filterOptions.service_types.length === 0}
                  sx={{ minWidth: 150, py: 1 }}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Grid>
            </Grid>
          </Box> */}
        </form>
      </Paper>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewConnectionRequestForm;