// pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  CircularProgress,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import {
  LockOutlined,
  PersonOutline,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const { login, error: authError, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsLocalLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'An error occurred during login');
    } finally {
      setIsLocalLoading(false);
    }
  };

  // Use either local error or auth context error
  const error = localError || authError;
  const isLoading = isLocalLoading || authLoading;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        py: 3,
      }}
    >
      <Container maxWidth="xs">
        {/* Gradient top border */}
        <Box
          sx={{
            height: 6,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            mx: 'auto',
            width: '100%',
          }}
        />

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.2),
            borderTop: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            width: '100%',
            mx: 'auto',
          }}
        >
          {/* Logo and Title Section - Clean and Professional */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            {/* Logo Container - Clean, no borders, no effects */}
            <Box
              sx={{
                width: 100,
                height: 100,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              {/* Logo Image */}
              <Box
                component="img"
                src="/logo.svg"
                alt="Company Logo"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.grey[900],
                mb: 0.50,
                letterSpacing: '-0.3px',
              }}
            >
              Coimbatore Corporation
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.grey[600],
                textAlign: 'center',
                mb: 1,
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              Electricity Management System
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.grey[500],
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              Secure access to your energy dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 1.5,
                fontSize: '0.875rem',
                '& .MuiAlert-icon': {
                  fontSize: 20,
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Username Field */}
            <TextField
              fullWidth
              required
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline
                      sx={{
                        color: theme.palette.grey[500],
                        fontSize: 20,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: theme.palette.grey[50],
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.grey[600],
                  fontSize: '0.9rem',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: theme.palette.primary.main,
                },
                mb: 1.5,
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              required
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      sx={{
                        color: theme.palette.grey[500],
                        fontSize: 20,
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{
                        color: theme.palette.grey[500],
                        '&:hover': {
                          color: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: theme.palette.grey[50],
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.grey[600],
                  fontSize: '0.9rem',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: theme.palette.primary.main,
                },
                mb: 3,
              }}
            />

            {/* Sign In Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                letterSpacing: '0.2px',
                backgroundColor: theme.palette.primary.main,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.grey[300],
                  color: theme.palette.grey[500],
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;