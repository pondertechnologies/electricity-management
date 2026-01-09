import { createTheme } from "@mui/material/styles";

export const lightBrandedTheme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#2C7A7B",
            light: "#4FD1C5",
            dark: "#285E61",
        },
        secondary: {
            main: "#3A7CA5",
            light: "#5BA5D6",
            dark: "#2C5A7A",
        },
        error: {
            main: "#D32F2F",
        },
        success: {
            main: "#2E7D32",
        },
        warning: {
            main: "#ED6C02",
        },
        info: {
            main: "#0288D1",
        },
        background: {
            default: "#F5F7FA",
            paper: "#FFFFFF",
        },

        text: {
            primary: "#0F172A",
            secondary: "#475569",
            disabled: "#94A3B8",
        },

        divider: "#E2E8F0",
        grey: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
        },
    },

    typography: {
        fontFamily:
            "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

        h4: {
            fontWeight: 700,
            fontSize: "2.25rem",
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            color: "#0F172A",
        },
        h5: {
            fontWeight: 600,
            fontSize: "1.75rem",
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            color: "#1E293B",
        },
        h6: {
            fontWeight: 600,
            fontSize: "1.25rem",
            lineHeight: 1.45,
            color: "#334155",
        },

        subtitle1: {
            fontWeight: 500,
            fontSize: "1.0625rem",
            lineHeight: 1.6,
            color: "#475569",
        },

        body1: {
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#1E293B",
        },

        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "#64748B",
        },

        button: {
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.02em",
            fontSize: "1rem",
        },

        caption: {
            fontSize: "0.8125rem",
            color: "#94A3B8",
        },
    },
    
    shape: {
        borderRadius: 6,
    },
    
    components: {
        MuiCssBaseline: {
            styleOverrides: (theme) => ({
                body: {
                    background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, #EAF0F7 100%)`,
                    backgroundAttachment: "fixed",
                    minHeight: "100vh",
                },
                html: {
                    scrollBehavior: "smooth",
                },
                // SweetAlert theme integration
                '.swal2-popup': {
                    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important",
                    borderRadius: "12px !important",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15) !important",
                    background: `${theme.palette.background.paper} !important`,
                },
                '.swal2-title': {
                    color: `${theme.palette.text.primary} !important`,
                    fontWeight: "600 !important",
                    fontSize: "1.5rem !important",
                },
                '.swal2-html-container': {
                    color: `${theme.palette.text.secondary} !important`,
                    fontSize: "1rem !important",
                },
                '.swal2-confirm': {
                    borderRadius: "8px !important",
                    fontWeight: "600 !important",
                    textTransform: "none !important",
                    padding: "8px 24px !important",
                },
                '.swal2-cancel': {
                    borderRadius: "8px !important",
                    fontWeight: "600 !important",
                    textTransform: "none !important",
                    padding: "8px 24px !important",
                },
                '.swal2-icon': {
                    borderColor: `${theme.palette.primary.main} !important`,
                    color: `${theme.palette.primary.main} !important`,
                },
                '.swal2-icon.swal2-error': {
                    borderColor: `${theme.palette.error.main} !important`,
                    color: `${theme.palette.error.main} !important`,
                },
                '.swal2-icon.swal2-warning': {
                    borderColor: `${theme.palette.warning.main} !important`,
                    color: `${theme.palette.warning.main} !important`,
                },
                '.swal2-icon.swal2-success': {
                    borderColor: `${theme.palette.success.main} !important`,
                    color: `${theme.palette.success.main} !important`,
                },
                '.swal2-icon.swal2-info': {
                    borderColor: `${theme.palette.info.main} !important`,
                    color: `${theme.palette.info.main} !important`,
                },
                '.swal2-icon.swal2-question': {
                    borderColor: `${theme.palette.primary.main} !important`,
                    color: `${theme.palette.primary.main} !important`,
                },
            }),
        },

        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    background: `linear-gradient(90deg, 
                        ${theme.palette.primary.dark} 0%, 
                        ${theme.palette.primary.dark} 100%, 
                        ${theme.palette.primary.light} 100%)`,
                    color: "#FFFFFF",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                    "& svg": {
                        color: "#FFFFFF !important",
                    },
                }),
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
                    color: "#F8FAFC",
                    borderRight: "none",
                    boxShadow: "3px 0 6px rgba(0,0,0,0.04)",
                }),
                root: ({ theme }) => ({
                    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    color: "#FFFFFF",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    "& svg": {
                        color: "#FFFFFF !important",
                    },
                    "& .MuiTypography-root": {
                        color: "#FFFFFF !important",
                    },
                }),
            },
        },

        MuiListSubheader: {
            styleOverrides: {
                root: ({ theme }) => ({
                    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    color: "#FFFFFF",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                }),
            },
        },

        MuiListItemButton: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                    "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.14)",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.14)",
                        },
                    },
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: ({ theme }) => ({
                    background: theme.palette.background.paper,
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    borderRadius: 12,
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: "hidden",
                }),
            },
        },

        MuiCardHeader: {
            styleOverrides: {
                root: ({ theme }) => ( {
                    padding: "24px 24px 16px",
                    borderBottom: "1px solid #F1F5F9",
                    backgroundColor: theme.palette.grey[50],
                }),
                title: {
                    fontWeight: 600,
                    fontSize: "1.125rem",
                },
                subheader: {
                    color: "#64748B",
                    fontSize: "0.875rem",
                },
            },
        },

        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 24,
                    "&:last-child": {
                        paddingBottom: 24,
                    },
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "8px 20px",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "none",
                    transition: "all 0.2s ease-in-out",
                },

                containedPrimary: ({ theme }) => ({
                    background: `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
                    color: theme.palette.common.white,
                    boxShadow: "none",
                    "&:hover": {
                        background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
                    },
                    "&:disabled": {
                        background: `linear-gradient(90deg, ${theme.palette.grey[400]} 0%, ${theme.palette.grey[300]} 100%)`,
                        color: theme.palette.common.white,
                        opacity: 0.7,
                    },
                }),

                containedSecondary: ({ theme }) => ({
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                    color: theme.palette.common.white,
                    "&:hover": {
                        background: `linear-gradient(90deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                    },
                }),

                outlinedPrimary: ({ theme }) => ({
                    borderWidth: "1.5px",
                    color: theme.palette.primary.main,
                    "&:hover": {
                        background: `${theme.palette.action.hover}`,
                    },
                }),

                textPrimary: ({ theme }) => ({
                    color: theme.palette.primary.main,
                    "&:hover": {
                        background: `${theme.palette.action.hover}`,
                    },
                }),
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        "&:hover fieldset": {
                            borderColor: "#3B82F6",
                        },
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                },
            },
        },
    },
});

export default lightBrandedTheme;