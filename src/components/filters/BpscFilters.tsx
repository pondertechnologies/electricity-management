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
import type { BPSCFilterOptions, BPSCFiltersType } from '../../types/bpsc';

interface BpscFiltersProps {
    filters: BPSCFiltersType;
    filterOptions: BPSCFilterOptions | null;
    filtersExpanded: boolean;
    onFilterChange: (filters: BPSCFiltersType) => void;
    onFiltersExpandedChange: (expanded: boolean) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

const BpscFilters: React.FC<BpscFiltersProps> = ({
    filters,
    filterOptions,
    filtersExpanded,
    onFilterChange,
    onFiltersExpandedChange,
    onApplyFilters,
    onClearFilters,
}) => {
    // Helper function to get date one year ago from today
    const getOneYearAgoDate = (): string => {
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        return oneYearAgo.toISOString().split('T')[0];
    };

    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayDate = (): string => {
        return new Date().toISOString().split('T')[0];
    };

    // Initialize dates on component mount
    React.useEffect(() => {
        // Only initialize if both dates are empty
        const oneYearAgo = getOneYearAgoDate();
        const today = getTodayDate();

        onFilterChange({
            ...filters,
            startDate: oneYearAgo,
            endDate: today,
        });

        // if (!filters.startDate || !filters.endDate) {
        //   const oneYearAgo = getOneYearAgoDate();
        //   const today = getTodayDate();

        //   onFilterChange({
        //     ...filters,
        //     startDate: filters.startDate || oneYearAgo,
        //     endDate: filters.endDate || today,
        //   });
        // }
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleFilterChange = (key: keyof BPSCFiltersType, value: string | Date | null) => {
        if (value instanceof Date) {
            onFilterChange({ ...filters, [key]: value.toISOString().split('T')[0] });
        } else {
            onFilterChange({ ...filters, [key]: value || '' });
        }
    };

    const formatDateForDisplay = (dateString?: string) => {
        if (!dateString) {
            // Return default dates if no date is set
            if (dateString === undefined) {
                return null;
            }
            return null;
        }

        // Parse the date string
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // month is 0-indexed in Date
    };

    // Handle clear filters to set start date to one year ago and end date to today
    const handleClearFilters = () => {
        const today = getTodayDate();
        const oneYearAgo = getOneYearAgoDate();

        onFilterChange({
            consumerNumber: '',
            consumerName: '',
            circle: '',
            section: '',
            startDate: oneYearAgo,
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

export default BpscFilters;