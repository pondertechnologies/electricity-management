import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  FilterAlt as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { FilterOptions } from '../../types/consumer';
import type { ConsumerFilters } from '../../types/consumer';

interface ConsumerFiltersProps {
  filters: ConsumerFilters;
  filterOptions: FilterOptions | null;
  filtersExpanded: boolean;
  onFilterChange: (filters: ConsumerFilters) => void;
  onFiltersExpandedChange: (expanded: boolean) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const CommonFilters: React.FC<ConsumerFiltersProps> = ({
  filters,
  filterOptions,
  filtersExpanded,
  onFilterChange,
  onFiltersExpandedChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const handleFilterChange = (key: keyof ConsumerFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  // Data Filter options from the provided select element
  const dataFilterOptions = [
    { value: '', label: 'Select Filter' },
    { value: 'All Due', label: 'All Due' },
    { value: 'Due Date Passed', label: 'Due Date Passed' },
    { value: 'Due Today', label: 'Due Today' },
    { value: 'Future Due', label: 'Future Due' },
    { value: 'Due Without Date', label: 'Due Without Date' },
    { value: 'No Due', label: 'No Due' },
    { value: 'Normal Due', label: 'Normal Due' },
    { value: 'Solar Due', label: 'Solar Due' },
    { value: 'Current Excess Demand Charges', label: 'Current Excess Demand Charges' },
    { value: 'Current PF Penalty Charges', label: 'Current PF Penalty Charges' },
    { value: 'Current BPSC', label: 'Current BPSC' },
    { value: 'Last 12 Months – Total Excess Demand Charges', label: 'Last 12 Months – Total Excess Demand Charges' },
    { value: 'Last 12 Months – Normal Excess Demand Charges', label: 'Last 12 Months – Normal Excess Demand Charges' },
    { value: 'Last 12 Months – Solar Excess Demand Charges', label: 'Last 12 Months – Solar Excess Demand Charges' },
    { value: 'Last 12 Months – Total PF Penalty Charges', label: 'Last 12 Months – Total PF Penalty Charges' },
    { value: 'Last 12 Months – Normal PF Penalty Charges', label: 'Last 12 Months – Normal PF Penalty Charges' },
    { value: 'Last 12 Months – Solar PF Penalty Charges', label: 'Last 12 Months – Solar PF Penalty Charges' },
    { value: 'Last 12 Months – BPSC Charges (Total)', label: 'Last 12 Months – BPSC Charges (Total)' },
    { value: 'Last 12 Months – BPSC Charges (Normal)', label: 'Last 12 Months – BPSC Charges (Normal)' },
    { value: 'Last 12 Months – BPSC Charges (Solar)', label: 'Last 12 Months – BPSC Charges (Solar)' },
    { value: 'Service Removed', label: 'Service Removed' },
  ];

  return (
    <Card sx={{ width: '100%', flexShrink: 0 }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: 'grey.50',
          '&:hover': {
            backgroundColor: 'grey.100',
          },
        }}
        onClick={() => onFiltersExpandedChange(!filtersExpanded)}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <FilterIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={500}>
            Search Filters
          </Typography>
        </Box>
        <IconButton size="small">
          {filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={filtersExpanded}>
        <CardContent sx={{ pt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              width: '100%',
            }}
          >
            {/* Row 1 - 4 columns */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 2,
                width: '100%',
              }}
            >
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Consumer Number
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={filters.consumerNumber || ''}
                  onChange={(e) => handleFilterChange('consumerNumber', e.target.value)}
                  placeholder="Enter consumer number"
                />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Consumer Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={filters.consumerName || ''}
                  onChange={(e) => handleFilterChange('consumerName', e.target.value)}
                  placeholder="Enter consumer name"
                />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Mobile Number
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={filters.mobileNumber || ''}
                  onChange={(e) => handleFilterChange('mobileNumber', e.target.value)}
                  placeholder="Enter mobile number"
                />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Distribution
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.distribution || ''}
                  onChange={(e) => handleFilterChange('distribution', e.target.value)}
                >
                  <MenuItem value="">Select Distribution</MenuItem>
                  {filterOptions?.distributions?.map((d: string) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Row 2 - 4 columns */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 2,
                width: '100%',
              }}
            >
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Section
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.section || ''}
                  onChange={(e) => handleFilterChange('section', e.target.value)}
                >
                  <MenuItem value="">Select Section</MenuItem>
                  {filterOptions?.sections?.map((s: string) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Service Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.serviceStatus || ''}
                  onChange={(e) => handleFilterChange('serviceStatus', e.target.value)}
                >
                  <MenuItem value="">Select Status</MenuItem>
                  {filterOptions?.serviceStatus?.map((s: string) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Due From Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={filters.fromDueDate || ''}
                  onChange={(e) => handleFilterChange('fromDueDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Due To Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={filters.toDueDate || ''}
                  onChange={(e) => handleFilterChange('toDueDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>

            {/* Row 3 - 4 columns */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 2,
                width: '100%',
              }}
            >
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Circle
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.circle || ''}
                  onChange={(e) => handleFilterChange('circle', e.target.value)}
                >
                  <MenuItem value="">Select Circle</MenuItem>
                  {filterOptions?.circles?.map((c: string) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Tariff Code
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={filters.tariffCode || ''}
                  onChange={(e) => handleFilterChange('tariffCode', e.target.value)}
                  placeholder="Enter tariff code"
                />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Voltage Level
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={filters.voltageLevel || ''}
                  onChange={(e) => handleFilterChange('voltageLevel', e.target.value)}
                  placeholder="Enter voltage level"
                />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Data Filter
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.dataFilter || ''}
                  onChange={(e) => handleFilterChange('dataFilter', e.target.value)}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 300, // Limit height for better UX with many options
                        },
                      },
                    },
                  }}
                >
                  {dataFilterOptions.map((option) => (
                    <MenuItem key={option.value || 'empty'} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={onClearFilters} sx={{ minWidth: 120 }}>
              Clear Filters
            </Button>
            <Button variant="contained" onClick={onApplyFilters} sx={{ minWidth: 120 }}>
              Apply Filters
            </Button>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CommonFilters;