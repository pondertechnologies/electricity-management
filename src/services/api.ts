const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('electricity_token');
};

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const decoded = JSON.parse(jsonPayload);

        if (decoded.exp) {
            // Convert exp from seconds to milliseconds
            const expirationTime = decoded.exp * 1000;
            const currentTime = Date.now();
            return expirationTime < currentTime;
        }
        return false;
    } catch (error) {
        return true;
    }
};

// Check and handle token expiration
const checkAndHandleTokenExpiration = (): boolean => {
    const token = getAuthToken();

    if (!token) {
        // No token, redirect to login
        redirectToLogin();
        return true;
    }

    if (isTokenExpired(token)) {
        // Token expired, clear and redirect
        localStorage.removeItem('electricity_token');
        localStorage.removeItem('electricity_user');
        redirectToLogin();
        return true;
    }

    return false;
};

// Redirect to login
const redirectToLogin = () => {
    // Save current location for redirect after login
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/login') {
        localStorage.setItem('returnUrl', currentPath);
    }

    // Use window.location for API functions (outside React components)
    window.location.href = '/login';
};

// Main API request function
export const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<any> => {
    // Check token before making request
    if (checkAndHandleTokenExpiration()) {
        throw new Error('Authentication required. Redirecting to login.');
    }

    const token = getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
            console.log('API returned 401, clearing auth data');
            localStorage.removeItem('electricity_token');
            localStorage.removeItem('electricity_user');
            redirectToLogin();
            throw new Error('Session expired. Please login again.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
};

// Add timeout wrapper for better error handling
export const apiRequestWithTimeout = async (
    endpoint: string,
    options: RequestInit = {},
    timeout = 10000
): Promise<any> => {
    // Check token before making request
    if (checkAndHandleTokenExpiration()) {
        throw new Error('Authentication required. Redirecting to login.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await apiRequest(endpoint, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
    }
};

export const apiRequestWithoutTimeout = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<any> => {
    // Check token before making request
    if (checkAndHandleTokenExpiration()) {
        throw new Error('Authentication required. Redirecting to login.');
    }

    try {
        const response = await apiRequest(endpoint, {
            ...options
        });
        return response;
    } catch (error) {
        throw error;
    }
};


// Auth specific API calls
export const authAPI = {
    login: async (username: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Username: username,
                password: password
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Login failed');
        }

        return response.json();
    },

    logout: () => {
        const isConfirmed = window.confirm('Are you sure you want to logout?');
        if (isConfirmed) {
            localStorage.removeItem('electricity_token');
            localStorage.removeItem('electricity_user');
            window.location.href = '/login';
        }
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('electricity_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        const token = getAuthToken();
        if (!token) return false;
        return !isTokenExpired(token);
    },
};

// Dashboard API
export const dashboardAPI = {
    // Get dashboard overview data
    getDashboardData: async (): Promise<DashboardData> => {
        return apiRequestWithoutTimeout('/ConsumerDashboard/GetConnectionCount');
    },
};

// Consumer Management API
export const consumerAPI = {
    getConsumers: async (payload: {
        page: number;
        pageSize: number;
        SortBy?: string;
        sortOrder?: string;
        consumerNumber?: string;
        consumerName?: string;
        region?: string;
        circle?: string;
        section?: string;
        serviceStatus?: string;
        tariffCodes?: string;
        distribution?: string;
        voltageLevel?: string;
        dataFilter?: string;
    }) => {
        return apiRequest("/Consumers/GetConsumers", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    getFilterOptions: async () => {
        return apiRequest("/Consumers/GetFilterOptions", {
            method: "GET",
        });
    },

    getConsumerDetails: async (consumerId: string) => {
        return apiRequest(`/Consumers/${consumerId}`);
    },

    getConsumerEBExtractDetails: async (consumerId: string) => {
        return apiRequest(`/Consumers/${consumerId}/latest-extract`);
    },
};

// Disconnection Eligible API
export const disconnectionEligibleAPI = {
    getDisconnectionEligible: async (payload: {
        page: number;
        pageSize: number;
        SortBy?: string;
        sortOrder?: string;
        consumerNumber?: string;
        consumerName?: string;
        region?: string;
        circle?: string;
        section?: string;
        serviceStatus?: string;
        tariffCodes?: string;
        distribution?: string;
        voltageLevel?: string;
        dataFilter?: string;
    }) => {
        return apiRequest("/DisconnectionEligible/GetDisconnectionEligible", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    getFilterOptions: async () => {
        return apiRequest("/DisconnectionEligible/GetFilterOptions", {
            method: "GET",
        });
    },
};

// Load Reduction API
export const loadReductionAPI = {
    getLoadReductionList: async (payload: {
        page: number;
        pageSize: number;
        SortBy?: string;
        sortOrder?: string;
        consumerNumber?: string;
        consumerName?: string;
        region?: string;
        circle?: string;
        section?: string;
        serviceStatus?: string;
        tariffCodes?: string;
        distribution?: string;
        voltageLevel?: string;
        dataFilter?: string;
    }) => {
        return apiRequest("/LoadReduction/GetLoadReductionList", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    getFilterOptions: async () => {
        return apiRequest("/LoadReduction/GetFilterOptions", {
            method: "GET",
        });
    },
};

// Misc Collection BPSC API
export const miscCollectionBPSCAPI = {
    getBPSCMiscCollection: async (payload: {
        page: number;
        pageSize: number;
        SortBy?: string;
        sortOrder?: string;
        consumerNumber?: string;
        consumerName?: string;
        region?: string;
        circle?: string;
        section?: string;
        serviceStatus?: string;
        tariffCodes?: string;
        distribution?: string;
        voltageLevel?: string;
        dataFilter?: string;
    }) => {
        return apiRequest("/MiscCollection/GetBpscList", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    getFilterOptions: async () => {
        return apiRequest("/MiscCollection/GetFilterOptions", {
            method: "GET",
        });
    },
};

// Consumer Daily Extract API
export const consumerDailyExtractAPI = {
    getConsumerDailyExtract: async (payload: {
        page: number;
        pageSize: number;
        SortBy?: string;
        sortOrder?: string;
        consumerNumber?: string;
        consumerName?: string;
        region?: string;
        circle?: string;
        section?: string;
        serviceStatus?: string;
        tariffCodes?: string;
        distribution?: string;
        voltageLevel?: string;
        dataFilter?: string;
    }) => {
        return apiRequest("/ConsumerDailyExtract/GetExtractLogs", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};

// Consumer Extraction Request API
export const consumerExtractionRequestAPI = {
    getConsumerExtractionRequest: async (payload: {
        page: number;
        pageSize: number;
        SortBy?: string;
        sortOrder?: string;
        consumerNumber?: string;
        consumerName?: string;
        region?: string;
        circle?: string;
        section?: string;
        status?:string;
        serviceStatus?: string;
        tariffCodes?: string;
        distribution?: string;
        voltageLevel?: string;
        dataFilter?: string;
    }) => {
        return apiRequest("/ConsumerExtractionRequest/GetRequests", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};

// New Connection API
export const newConnectionAPI = {
  getFilterOptions: async () => {
    return apiRequest("/NewConnection/GetFilterOptions", {
      method: "GET",
    });
  },

  createRequest: async (payload: {
    requesterDesignation: string;
    requesterName: string;
    connectionName: string;
    address: string;
    ward: string;
    loadDemand: number;
    serviceCategory: string;
    serviceType: string;
    otherComments?: string;
    tariffCode?: string;
    solarCapacity?: number;
  }) => {
    return apiRequest("/NewConnection/CreateRequest", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// New Connection Request API
export const newConnectionRequestAPI = {
    getFilterOptions: async () => {
        return apiRequest("/NewConnection/GetFilterOptions", {
            method: "GET",
        });
    },

    getNewConnectionList: async (payload: {
        page: number;
        pageSize: number;
        sortBy?: string;
        sortOrder?: string;
        applicationNumber?: string;
        createdBy?: string;
        serviceCategory?: string;
        serviceType?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        return apiRequest("/NewConnection/GetRequests", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};

// ============================================================================
// FORMATTING UTILITY FUNCTIONS
// ============================================================================

/**
 * Format a number with Indian numbering system
 * @param num - Number to format
 * @returns Formatted string with Indian number format, or '-' if null/undefined
 */
export const formatNumber = (num: number | null | undefined): string => {
    if (num == null || isNaN(num)) return '-';
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

/**
 * Format a number as Indian currency (INR)
 * @param amount - Amount to format
 * @returns Formatted currency string, or '-' if null/undefined
 */
export const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null || isNaN(amount)) return '-';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format a date with Indian format (DD MMM YYYY, HH:MM)
 * @param date - Date to format (Date object, string, or null)
 * @returns Formatted date string, or '-' if null/undefined
 */
export const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return '-';
    
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        return '-';
    }
};

/**
 * Format a date without time (DD MMM YYYY)
 * @param date - Date to format
 * @returns Formatted date string without time
 */
export const formatDateOnly = (date: Date | string | null | undefined): string => {
    if (!date) return '-';
    
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch (error) {
        return '-';
    }
};

/**
 * Format a date with full month name
 * @param date - Date to format
 * @returns Formatted date with full month name
 */
export const formatDateFullMonth = (date: Date | string | null | undefined): string => {
    if (!date) return '-';
    
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    } catch (error) {
        return '-';
    }
};

/**
 * Format a number as percentage
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number | null | undefined, decimals: number = 2): string => {
    if (value == null || isNaN(value)) return '-';
    return `${value.toFixed(decimals)}%`;
};

/**
 * Format file size in KB, MB, GB
 * @param bytes - Size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
    if (bytes == null || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format load in KW with appropriate unit
 * @param load - Load value in KW
 * @returns Formatted load string with unit
 */
export const formatLoad = (load: number | null | undefined): string => {
    if (load == null || isNaN(load)) return '-';
    return `${formatNumber(load)} KW`;
};

/**
 * Format solar capacity
 * @param capacity - Solar capacity in KW
 * @returns Formatted capacity string
 */
export const formatSolarCapacity = (capacity: number | null | undefined): string => {
    if (capacity == null || isNaN(capacity)) return '-';
    return `${formatNumber(capacity)} KW`;
};

/**
 * Format phone number in Indian format
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return '-';
    
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return `${cleaned.slice(1, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    
    return phone;
};

// ============================================================================
// DASHBOARD AND API INTERFACES
// ============================================================================

// Dashboard data interface
export interface DashboardData {
    sanctionedLoadSummary: {
        totalSanctionedLoad: number;
        htSanctionedLoad: number;
        ltSanctionedLoad: number;
    };
    consumerSummary: {
        totalConsumers: number;
        htConsumers: number;
        ltConsumers: number;
        removedServiceConsumers: number;
    };
    totalSanctionedLoad: number;
    disconnectionEligibleSummary: {
        totalDisconnectionEligibleCount: number;
        totalMonthlySaving: number;
        totalYearlySaving: number;
        totalExpectedRefund: number;
    };
    loadReductionSummary: {
        totalConsumers: number;
        totalCurrentSanctionedLoad: number;
        totalLoadReductionKw: number;
        totalSuggestedLoadAfterReduction: number;
        totalMonthlySaving: number;
        totalYearlySaving: number;
    };
    billingLT: any;
    billingHT: any;
    dueStatusSummary: Array<{
        dueStatus: string;
        count: number;
        totalDueAmountSum: number;
    }>;
    yearWiseBillingSummary: Array<{
        year: number;
        totalBilledAmount: number;
        totalPaidAmount: number;
    }>;
    htYearMonthBillingSummary: Array<{
        year: number;
        month: number;
        totalBilledAmount: number;
    }>;
    serviceStatusCounts: Array<{ name: string; count: number }>;
    serviceTypeCounts: Array<{ name: string; count: number }>;
    circleCounts: Array<{ name: string; count: number }>;
    distributionCounts: Array<{ name: string; count: number }>;
    sectionCounts: Array<{ name: string; count: number }>;
}

// Type for API response wrapper
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
    timestamp: string;
}

// Error handling interceptor (optional)
let apiInterceptor: ((error: Error) => void) | null = null;

export const setApiInterceptor = (interceptor: (error: Error) => void) => {
    apiInterceptor = interceptor;
};

// Enhanced apiRequest with interceptor
export const apiRequestWithInterceptor = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<any> => {
    try {
        return await apiRequest(endpoint, options);
    } catch (error) {
        if (apiInterceptor) {
            apiInterceptor(error as Error);
        }
        throw error;
    }
};