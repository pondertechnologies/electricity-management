import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import theme from './theme/theme';

// Import actual page components
import Consumer from './pages/Consumer';
import Settings from './pages/Settings';
import DisconnectionEligibility from './pages/DisconnectionEligibility';
import LoadReduction from './pages/LoadReduction';
import BpscCollection from './pages/BpscCollection';
import DailyExtractionLog from './pages/DailyExtractionLog';
import ExtractionRequest from './pages/ExtractionRequest';
import NewConnectionForm from './pages/NewConnectionRequestForm';
import NewConnectionRequestList from './pages/NewConnectionRequestList';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Main Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Consumer Management */}
                <Route path="/consumer" element={<Consumer />} />
                
                {/* Disconnection Management */}
                <Route path="/disconnection-eligibility" element={<DisconnectionEligibility />} />
                
                {/* Load Reduction */}
                <Route path="/load-reduction" element={<LoadReduction />} />
                
                {/* BPSC (Billing & Payment Service Center) */}
                <Route path="/bpsc" element={<BpscCollection />} />
                
                {/* Daily Extraction Log */}
                <Route path="/daily-extraction-log" element={<DailyExtractionLog />} />
                
                {/* Extraction Request */}
                <Route path="/extraction-request" element={<ExtractionRequest />} />
                
                {/* New Connection Management */}
                <Route path="/new-connection/form" element={<NewConnectionForm />} />
                <Route path="/new-connection-request-list" element={<NewConnectionRequestList />} />
                
                {/* Settings & Users */}
                <Route path="/settings" element={<Settings />} />

              </Route>
              
              {/* Default redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;