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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { DailyExtractFiltersType } from '../../types/daily-extract';

interface DailyExtractFiltersProps {
  filters: DailyExtractFiltersType;
  filtersExpanded: boolean;
  onFilterChange: (filters: DailyExtractFiltersType) => void;
  onFiltersExpandedChange: (expanded: boolean) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const DailyExtractFilters: React.FC<DailyExtractFiltersProps> = ({
  filters,
  filtersExpanded,
  onFilterChange,
  onFiltersExpandedChange,
  onApplyFilters,
  onClearFilters,
}) => {
  // Helper function to get yesterday's date
  const getYesterdayDate = (): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  // Helper function to get today's date
  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const handleFilterChange = (key: keyof DailyExtractFiltersType, value: string | Date | null) => {
    if (value instanceof Date) {
      onFilterChange({ ...filters, [key]: value.toISOString().split('T')[0] });
    } else {
      onFilterChange({ ...filters, [key]: value || '' });
    }
  };

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  // Handle clear filters to set start date to yesterday and end date to today
  const handleClearFilters = () => {
    const yesterday = getYesterdayDate();
    const today = getTodayDate();
    
    onFilterChange({
      consumerNumber: '',
      parseStatus: '',
      startDate: yesterday,
      endDate: today,
    });
    
    // Call the parent's clear filters function
    onClearFilters();
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
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2.5,
                width: '100%',
              }}
            >
              {/* Consumer Number */}
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

              {/* Parse Status */}
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Parse Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={filters.parseStatus || ''}
                  onChange={(e) => handleFilterChange('parseStatus', e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="RAW">RAW</MenuItem>
                  <MenuItem value="PARSED">PARSED</MenuItem>
                </TextField>
              </Box>

              {/* Start Date */}
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  Start Date
                </Typography>
                <DatePicker
                  value={formatDateForDisplay(filters.startDate)}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Box>

              {/* End Date */}
              <Box>
                <Typography variant="caption" fontWeight={500} display="block" mb={0.5} color="text.secondary">
                  End Date
                </Typography>
                <DatePicker
                  value={formatDateForDisplay(filters.endDate)}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button variant="outlined" onClick={handleClearFilters} sx={{ minWidth: 120 }}>
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

export default DailyExtractFilters;