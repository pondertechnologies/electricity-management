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
import type { LoadReductionFilterOptions, LoadReductionFiltersType } from '../../types/load-reduction';

interface LoadReductionFiltersProps {
  filters: LoadReductionFiltersType;
  filterOptions: LoadReductionFilterOptions | null;
  filtersExpanded: boolean;
  onFilterChange: (filters: LoadReductionFiltersType) => void;
  onFiltersExpandedChange: (expanded: boolean) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const LoadReductionFilters: React.FC<LoadReductionFiltersProps> = ({
  filters,
  filterOptions,
  filtersExpanded,
  onFilterChange,
  onFiltersExpandedChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const handleFilterChange = (key: keyof LoadReductionFiltersType, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

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

            {/* Consumer Name */}
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

            {/* Circle */}
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
                <MenuItem value="">All Circles</MenuItem>
                {filterOptions?.circles?.map((circle: string) => (
                  <MenuItem key={circle} value={circle}>
                    {circle}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Section */}
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
                <MenuItem value="">All Sections</MenuItem>
                {filterOptions?.sections?.map((section: string) => (
                  <MenuItem key={section} value={section}>
                    {section}
                  </MenuItem>
                ))}
              </TextField>
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

export default LoadReductionFilters;