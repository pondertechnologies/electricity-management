import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  Avatar,
} from '@mui/material';
import {
  Person,
  Notifications,
  Security,
  Language,
  CloudUpload,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Person />} label="Profile" />
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Security />} label="Security" />
          <Tab icon={<Language />} label="Preferences" />
        </Tabs>

        <Divider />

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} {...({} as any)}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2.5rem',
                        bgcolor: 'primary.main',
                      }}
                    >
                      JD
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      Babu
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Administrator
                    </Typography>
                    <Button variant="outlined" startIcon={<CloudUpload />}>
                      Change Photo
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={8} {...({} as any)}>
                <Grid container spacing={3} {...({} as any)}>
                  <Grid item xs={12} sm={6} {...({} as any)}>
                    <TextField
                      fullWidth
                      label="First Name"
                      defaultValue="Babu"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} {...({} as any)}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      defaultValue=""
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} {...({} as any)}>
                    <TextField
                      fullWidth
                      label="Email"
                      defaultValue="bubu@gmail.com"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} {...({} as any)}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      defaultValue="+91 9876543210"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} {...({} as any)}>
                    <TextField
                      fullWidth
                      label="Department"
                      defaultValue="Operations"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} {...({} as any)}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button variant="contained" color="primary">
                        Save Changes
                      </Button>
                      <Button variant="outlined">
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Configure how you want to receive notifications.
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} {...({} as any)}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                  }
                  label="Email Notifications"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Receive notifications via email
                </Typography>
              </Grid>
              
              <Grid item xs={12} {...({} as any)}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.push}
                      onChange={() => handleNotificationChange('push')}
                    />
                  }
                  label="Push Notifications"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Receive push notifications in the browser
                </Typography>
              </Grid>
              
              <Grid item xs={12} {...({} as any)}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.sms}
                      onChange={() => handleNotificationChange('sms')}
                    />
                  }
                  label="SMS Notifications"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Receive notifications via SMS (charges may apply)
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Grid container spacing={3} {...({} as any)}>
              <Grid item xs={12} {...({} as any)}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} {...({} as any)}>
                <Button variant="contained" color="primary">
                  Change Password
                </Button>
              </Grid>
              <Grid item xs={12} {...({} as any)}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Two-Factor Authentication
                </Typography>
                <FormControlLabel
                  control={<Switch />}
                  label="Enable Two-Factor Authentication"
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Application Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} {...({} as any)}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Dark Mode"
                />
              </Grid>
              <Grid item xs={12} {...({} as any)}>
                <TextField
                  select
                  fullWidth
                  label="Language"
                  defaultValue="en"
                  SelectProps={{ native: true }}
                  variant="outlined"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </TextField>
              </Grid>
              <Grid item xs={12} {...({} as any)}>
                <TextField
                  select
                  fullWidth
                  label="Time Zone"
                  defaultValue="est"
                  SelectProps={{ native: true }}
                  variant="outlined"
                >
                  <option value="est">Eastern Time (EST)</option>
                  <option value="cst">Central Time (CST)</option>
                  <option value="pst">Pacific Time (PST)</option>
                </TextField>
              </Grid>
              <Grid item xs={12} {...({} as any)}>
                <TextField
                  select
                  fullWidth
                  label="Date Format"
                  defaultValue="mm-dd-yyyy"
                  SelectProps={{ native: true }}
                  variant="outlined"
                >
                  <option value="mm-dd-yyyy">MM-DD-YYYY</option>
                  <option value="dd-mm-yyyy">DD-MM-YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </TextField>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;