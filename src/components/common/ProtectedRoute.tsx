// components/routes/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure auth context is ready
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  if (requireAuth && !isAuthenticated()) {
    // Save the attempted URL for redirect after login
    const returnUrl = location.pathname + location.search;
    localStorage.setItem('returnUrl', returnUrl);
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated()) {
    // If user is authenticated and trying to access login page, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;