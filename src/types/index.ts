export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  subItems?: MenuItem[];
}

export interface ElectricityData {
  timestamp: string;
  consumption: number;
  cost: number;
  peakDemand: number;
  voltage: number;
}