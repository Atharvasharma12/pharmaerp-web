import { createTheme } from "@mui/material/styles";
import { DEFAULT_COLOR_THEME } from "./tokens";
import { DEFAULT_THEME_MODE, getThemeTokens } from "./getThemeTokens";

export const createAppTheme = (
  mode = DEFAULT_THEME_MODE,
  colorTheme = DEFAULT_COLOR_THEME,
) => {
  const t = getThemeTokens(mode, colorTheme);

  return createTheme({
    palette: {
      mode,

      primary: {
        main: t.primary,
        contrastText: t.primaryContrast,
      },

      success: {
        main: t.success,
        contrastText: t.successContrast,
      },

      error: {
        main: t.error,
        contrastText: t.errorContrast,
      },

      warning: {
        main: t.warning,
        contrastText: t.warningContrast,
      },

      info: {
        main: t.info,
        contrastText: t.infoContrast,
      },

      background: {
        default: t.bg,
        paper: t.surface,
      },

      text: {
        primary: t.text,
        secondary: t.textMuted,
        disabled: t.textDisabled,
      },

      divider: t.border,
    },

    shape: {
      borderRadius: 10,
    },

    typography: {
      fontFamily: `"Inter", sans-serif`,
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: t.bg,
            color: t.text,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: t.surface,
            color: t.text,
            backgroundImage: "none",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: t.surface,
            color: t.text,
            border: `1px solid ${t.border}`,
            boxShadow: t.shadowSm,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            textTransform: "none",
            "&:hover": {
              boxShadow: "none",
            },
            "&:focus-visible": {
              boxShadow: t.focusRing,
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: t.text,
            backgroundColor: t.surfaceAlt,
            borderRadius: 12,

            "& fieldset": {
              borderColor: t.border,
            },

            "&:hover fieldset": {
              borderColor: t.primaryHover,
            },

            "&.Mui-focused fieldset": {
              borderColor: t.primary,
              borderWidth: "1.5px",
            },

            "&.Mui-disabled": {
              backgroundColor: t.disabledBg,
              color: t.disabledText,
            },
          },

          input: {
            color: t.text,
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: t.textMuted,
            "&.Mui-focused": {
              color: t.primary,
            },
          },
        },
      },

      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: t.textMuted,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: t.border,
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: t.surface,
            color: t.text,
            borderRadius: 16,
            boxShadow: t.shadowXl,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: t.surface,
            color: t.text,
            borderRight: `1px solid ${t.border}`,
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: t.border,
            color: t.text,
          },

          head: {
            color: t.text,
            backgroundColor: t.surfaceAlt,
            fontWeight: 700,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: t.neutral[900],
            color: t.textInverse,
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: t.surface,
            color: t.text,
            border: `1px solid ${t.border}`,
            boxShadow: t.shadowLg,
          },
        },
      },
    },
  });
};
