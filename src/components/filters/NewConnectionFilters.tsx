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
  Stack,
} from '@mui/material';
import {
  FilterAlt as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { NewConnectionFilterOptions, NewConnectionFiltersType } from '../../types/new-connection';

interface NewConnectionFiltersProps {
  filters: NewConnectionFiltersType;
  filterOptions: NewConnectionFilterOptions | null;
  filtersExpanded: boolean;
  onFilterChange: (filters: NewConnectionFiltersType) => void;
  onFiltersExpandedChange: (expanded: boolean) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const NewConnectionFilters: React.FC<NewConnectionFiltersProps> = ({
  filters,
  filterOptions,
  filtersExpanded,
  onFilterChange,
  onFiltersExpandedChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const handleFilterChange = (key: keyof NewConnectionFiltersType, value: string | null) => {
    onFilterChange({ ...filters, [key]: value || '' });
  };

  const handleDateChange = (key: 'startDate' | 'endDate', date: Date | null) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    onFilterChange({ ...filters, [key]: formattedDate });
  };

  // Set default dates (one week ago and today)
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2.5,
                width: '100%',
              }}
            >
              {/* Application Number */}
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Application Number
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={filters.applicationNumber || ''}
                  onChange={(e) => handleFilterChange('applicationNumber', e.target.value)}
                  placeholder="Enter application number"
                  InputProps={{
                    startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>

              {/* Status */}
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </TextField>
              </Box>

              {/* Created By */}
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Created By
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={filters.createdBy || ''}
                  onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                  placeholder="Enter creator username"
                />
              </Box>

              {/* Service Category */}
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Service Category
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.serviceCategory || ''}
                  onChange={(e) => handleFilterChange('serviceCategory', e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {filterOptions?.service_categories?.map((category: string) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Service Type */}
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Service Type
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.serviceType || ''}
                  onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {filterOptions?.service_types?.map((type: string) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Created Date Range */}
              <Stack spacing={1}>
                <Typography variant="caption" fontWeight={500} display="block" color="text.secondary">
                  Created Date Range
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <DatePicker
                      label="Start Date"
                      value={filters.startDate ? new Date(filters.startDate) : getDefaultStartDate()}
                      onChange={(date) => handleDateChange('startDate', date)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <DatePicker
                      label="End Date"
                      value={filters.endDate ? new Date(filters.endDate) : new Date()}
                      onChange={(date) => handleDateChange('endDate', date)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Stack>
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
    </LocalizationProvider>
  );
};

export default NewConnectionFilters;