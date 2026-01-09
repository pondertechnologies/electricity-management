import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  alpha,
  useTheme,
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  People,
  PowerOff,
  TrendingDown,
  Receipt,
  CalendarToday,
  Assignment,
  AddCircle,
  ListAlt,
  Logout,
  Menu,
  ChevronLeft,
  // Bolt,
  Settings,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  isActive?: boolean;
  children?: MenuItem[];
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const theme = useTheme();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleExpandClick = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      isActive: true,
    },
    {
      id: 'consumer',
      label: 'Consumer',
      icon: <People />,
      path: '/consumer',
      badge: 3,
    },
    {
      id: 'disconnection',
      label: 'Disconnection Eligible',
      icon: <PowerOff />,
      path: '/disconnection-eligibility',
    },
    {
      id: 'load-reduction',
      label: 'Load Reduction',
      icon: <TrendingDown />,
      path: '/load-reduction',
    },
    {
      id: 'bpsc',
      label: 'BPSC',
      icon: <Receipt />,
      path: '/bpsc',
      badge: 5,
    },
    {
      id: 'daily-extraction',
      label: 'Daily Extraction',
      icon: <CalendarToday />,
      path: '/daily-extraction-log',
    },
    {
      id: 'extraction-request',
      label: 'Extraction Request',
      icon: <Assignment />,
      path: '/extraction-request',
    },
    {
      id: 'new-connection',
      label: 'New Connection',
      icon: <AddCircle />,
      path: '#', // Parent doesn't navigate, only children
      children: [
        {
          id: 'new-connection-form',
          label: 'New Connection Form',
          icon: <AddCircle />,
          path: '/new-connection/form',
        },
        {
          id: 'connection-list',
          label: 'Connection List',
          icon: <ListAlt />,
          path: '/new-connection-request-list',
        },
      ],
    },
  ];

  const drawerWidth = isCollapsed ? 80 : 280;

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeItem === item.id;

    // Handle click for parent items with children
    const handleItemClick = () => {
      if (item.children) {
        handleExpandClick(item.id);
      } else {
        setActiveItem(item.id);
      }
    };

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <Tooltip title={isCollapsed ? item.label : ''} placement="right">
            <ListItemButton
              component={item.children ? 'div' : NavLink}
              to={item.children ? '#' : item.path}
              onClick={handleItemClick}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 2.5 : 3,
                py: 1.5,
                borderRadius: 2,
                mx: 1,
                backgroundColor: isActive
                  ? alpha(theme.palette.primary.main, 0.12)
                  : 'transparent',
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                border: isActive
                  ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                  : '1px solid transparent',
                '&:hover': {
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.18)
                    : alpha(theme.palette.primary.main, 0.08),
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&.active': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                transition: theme.transitions.create(
                  ['background-color', 'border-color', 'color'],
                  { duration: theme.transitions.duration.shorter }
                ),
                pl: isCollapsed ? 2.5 : depth > 0 ? 4 + depth * 2 : 3,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {item.badge ? (
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -3,
                        top: -3,
                        border: `2px solid ${theme.palette.background.paper}`,
                      },
                    }}
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>

              {!isCollapsed && (
                <>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />

                  {item.children && (
                    <Box sx={{ ml: 1, color: 'inherit' }}>
                      {isExpanded ? (
                        <ExpandLess fontSize="small" />
                      ) : (
                        <ExpandMore fontSize="small" />
                      )}
                    </Box>
                  )}

                  {item.isActive && !item.children && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        ml: 1,
                        animation: 'pulse 1.5s infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 0.6 },
                          '50%': { opacity: 1 },
                          '100%': { opacity: 0.6 },
                        },
                      }}
                    />
                  )}
                </>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {item.children && !isCollapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
      }}
    >
      {/* Header with Logo and Toggle */}
      <Toolbar
        sx={{
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          px: isCollapsed ? 0 : 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          '& .MuiTypography-root': {
            color: `${theme.palette.text.primary} !important`,
          },
        }}
      >
        {!isCollapsed ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <img 
                  src="/logo.svg" 
                  alt="Coimbatore Corporation Logo" 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    objectFit: 'contain' 
                  }} 
                />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    lineHeight: 1.2,
                    color: theme.palette.text.primary,
                  }}
                >
                  Coimbatore Corporation
                </Typography>
                {/* <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Energy Management System
                </Typography> */}
              </Box>
            </Box>
            <IconButton
              onClick={toggleSidebar}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                  color: theme.palette.primary.main,
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
                color: theme.palette.primary.main,
              },
            }}
          >
            <Menu />
          </IconButton>
        )}
      </Toolbar>

      {/* User Profile Section */}
      <Box
        sx={{
          p: isCollapsed ? 2 : 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          '& .MuiTypography-root': {
            color: `${theme.palette.text.primary} !important`,
          },
          '& .MuiSvgIcon-root': {
            color: `${theme.palette.text.secondary} !important`,
          },
        }}
      >
        {!isCollapsed ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color="success"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: theme.palette.success.main,
                  border: `2px solid ${theme.palette.background.paper}`,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  bgcolor: theme.palette.primary.main,
                  fontWeight: 600,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  fontSize: '1.2rem',
                  color: 'white',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </Badge>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: theme.palette.text.primary,
                }}
              >
                {user?.name || 'User'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: theme.palette.text.secondary,
                }}
              >
                {user?.email || 'user@example.com'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  display: 'block',
                  mt: 0.5,
                  color: theme.palette.primary.main,
                }}
              >
                {user?.role || 'Administrator'}
              </Typography>
            </Box>
            <Tooltip title="Notifications">
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Tooltip title={`${user?.name} (${user?.role})`} placement="right">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color="success"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: theme.palette.success.main,
                    border: `2px solid ${theme.palette.background.paper}`,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: theme.palette.primary.main,
                    fontWeight: 600,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    color: 'white',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </Badge>
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* Navigation Menu */}
      <List
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          py: 2,
          px: 1,
          '&::-webkit-scrollbar': {
            width: 4,
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[100],
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[300],
            borderRadius: 2,
          },
        }}
      >
        {menuItems.map(item => renderMenuItem(item))}
      </List>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      {/* Footer Section with Settings and Logout */}
      <Box sx={{
        p: isCollapsed ? 1.5 : 2,
        '& .MuiTypography-root': {
          color: `${theme.palette.text.primary} !important`,
        },
        '& .MuiSvgIcon-root': {
          color: `${theme.palette.text.secondary} !important`,
        },
      }}>
        {!isCollapsed ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Logout">
              <IconButton
                onClick={logout}
                size="medium"
                sx={{
                  flex: 1,
                  backgroundColor: alpha(theme.palette.grey[100], 0.8),
                  color: theme.palette.text.secondary,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <Logout />
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: 'inherit',
                  }}
                >
                  Logout
                </Typography>
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton
                component={NavLink}
                to="/settings"
                size="medium"
                sx={{
                  backgroundColor: alpha(theme.palette.grey[100], 0.8),
                  color: theme.palette.text.secondary,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.primary.main,
                  },
                  '&.active': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Logout" placement="right">
              <IconButton
                onClick={logout}
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  backgroundColor: theme.palette.grey[50],
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.error.main,
                  },
                }}
              >
                <Logout />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings" placement="right">
              <IconButton
                component={NavLink}
                to="/settings"
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  backgroundColor: theme.palette.grey[50],
                  '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.primary.main,
                  },
                  '&.active': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Version Info */}
      {!isCollapsed && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 100%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 500,
              textAlign: 'center',
              display: 'block',
              color: theme.palette.text.secondary,
            }}
          >
            v0.1.0 • © 2026 Coimbatore Corporation
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;