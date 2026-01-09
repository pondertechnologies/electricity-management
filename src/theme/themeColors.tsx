import lightBrandedTheme from "./theme";


// Initialize with theme colors
let themeColors = {
  primary: lightBrandedTheme.palette.primary.main,
  secondary: lightBrandedTheme.palette.secondary.main,
  error: lightBrandedTheme.palette.error.main,
  success: lightBrandedTheme.palette.success?.main || "#2E7D32",
  warning: lightBrandedTheme.palette.warning?.main || "#ED6C02",
  info: lightBrandedTheme.palette.info?.main || "#0288D1",
  background: lightBrandedTheme.palette.background.default,
  paper: lightBrandedTheme.palette.background.paper,
  text: lightBrandedTheme.palette.text.primary,
  textSecondary: lightBrandedTheme.palette.text.secondary,
};

// Accept ANY subset of these keys safely
export function setThemeColors(colors: Partial<typeof themeColors>) {
  themeColors = {
    ...themeColors,
    ...colors,
  };
}

export function getThemeColors() {
  return themeColors;
}

// React hook for components
export function useThemeColors() {
  return themeColors;
}