// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { authAPI } from '../services/api';
import { ShowConfirm } from '../components/ui/ShowAlert';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  checkTokenExpiration: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded = parseJwt(token);
      // Check if token has expiration time
      if (decoded.exp) {
        // Convert exp from seconds to milliseconds
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        return expirationTime < currentTime;
      }
      return false; // Token doesn't have expiration
    } catch (error) {
      return true; // Invalid token
    }
  }, []);

  // Clear auth data
  const clearAuthData = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('electricity_token');
    localStorage.removeItem('electricity_user');
    localStorage.removeItem('token_expiry_check');
  }, []);

  // Redirect to login with current location
  const redirectToLogin = useCallback(() => {
    // Save current location for redirect after login
    const returnUrl = location.pathname + location.search;
    if (returnUrl !== '/login') {
      localStorage.setItem('returnUrl', returnUrl);
    }
    navigate('/login', { replace: true });
  }, [navigate, location]);

  // Check token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('electricity_token');
        const storedUser = localStorage.getItem('electricity_user');

        if (storedToken && storedUser) {
          // Check if token is expired
          if (isTokenExpired(storedToken)) {
            console.log('Token expired, clearing auth data');
            clearAuthData();
            redirectToLogin();
          } else {
            try {
              const userData = JSON.parse(storedUser);
              setToken(storedToken);
              setUser(userData);
              
              // Set up periodic token check (every minute)
              const expiryCheckInterval = setInterval(() => {
                if (isTokenExpired(storedToken)) {
                  console.log('Token expired during session');
                  clearAuthData();
                  redirectToLogin();
                  clearInterval(expiryCheckInterval);
                }
              }, 60000); // Check every minute
              
              // Store interval ID for cleanup
              localStorage.setItem('token_expiry_check', expiryCheckInterval.toString());
            } catch (err) {
              console.error('Error parsing user data:', err);
              clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Cleanup interval on unmount
    return () => {
      const intervalId = localStorage.getItem('token_expiry_check');
      if (intervalId) {
        clearInterval(parseInt(intervalId));
        localStorage.removeItem('token_expiry_check');
      }
    };
  }, [isTokenExpired, clearAuthData, redirectToLogin]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(username, password);

      if (!response) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response;

      if (!data.token) {
        throw new Error('Invalid response from server');
      }

      // Decode the JWT token to extract user info
      const tokenData = parseJwt(data.token);
      const loggedInUser: User = {
        id: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '1',
        name: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || username,
        email: tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || `${username}@electricity.com`,
        role: tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user',
      };

      // Store in state and localStorage
      setToken(data.token);
      setUser(loggedInUser);
      localStorage.setItem('electricity_token', data.token);
      localStorage.setItem('electricity_user', JSON.stringify(loggedInUser));

      // Set up token expiry check
      const expiryCheckInterval = setInterval(() => {
        if (isTokenExpired(data.token)) {
          console.log('Token expired during session');
          clearAuthData();
          redirectToLogin();
          clearInterval(expiryCheckInterval);
        }
      }, 60000);

      localStorage.setItem('token_expiry_check', expiryCheckInterval.toString());

      // Redirect to saved return URL or dashboard
      const returnUrl = localStorage.getItem('returnUrl') || '/dashboard';
      localStorage.removeItem('returnUrl');
      navigate(returnUrl, { replace: true });

    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Use ShowConfirm instead of window.confirm
    const confirmed = await ShowConfirm(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      'question',
      {
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        allowOutsideClick: true,
        allowEscapeKey: true,
      }
    );

    if (!confirmed) return;

    // Clear state and localStorage if user confirms
    clearAuthData();
    
    // Clear any interval
    const intervalId = localStorage.getItem('token_expiry_check');
    if (intervalId) {
      clearInterval(parseInt(intervalId));
    }
    
    // Navigate to login page
    navigate('/login', { replace: true });
  };

  // Check if token is expired
  const checkTokenExpiration = (): boolean => {
    if (!token) return true;
    return isTokenExpired(token);
  };

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    return !!token && !isTokenExpired(token);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isLoading,
      error,
      checkTokenExpiration,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to parse JWT token
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return {};
  }
};