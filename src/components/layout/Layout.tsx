import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, alpha, useTheme } from '@mui/material';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: '100%' },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          ml: { sm: 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* <Toolbar /> */}
        <Box
          sx={{
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <Outlet />
        </Box>
        
        {/* Optional: Add a subtle background pattern */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(${alpha(theme.palette.primary.main, 0.05)} 1px, transparent 1px),
              radial-gradient(${alpha(theme.palette.secondary.main, 0.05)} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />
      </Box>
    </Box>
  );
};

export default Layout;