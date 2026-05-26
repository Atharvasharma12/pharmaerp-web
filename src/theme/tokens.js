export const THEME_NAMES = {
  EMERALD: "emerald",
  CLASSIC_BLUE: "classicBlue",
  SLATE: "slate",
  WARM: "warm",
  INDIGO: "indigo",
};

export const DEFAULT_COLOR_THEME = THEME_NAMES.EMERALD;

export const colorThemeOptions = [
  {
    value: THEME_NAMES.EMERALD,
    label: "Emerald Care",
    description: "Clean healthcare green theme for daily pharmacy billing.",
  },
  {
    value: THEME_NAMES.CLASSIC_BLUE,
    label: "Classic Blue",
    description: "Traditional medical ERP theme with trusted blue tones.",
  },
  {
    value: THEME_NAMES.SLATE,
    label: "Slate Office",
    description: "Minimal neutral theme for admin, reports, and finance.",
  },
  {
    value: THEME_NAMES.WARM,
    label: "Warm Care",
    description: "Soft warm theme for long POS and billing sessions.",
  },
  {
    value: THEME_NAMES.INDIGO,
    label: "Indigo Pro",
    description: "Premium SaaS theme for dashboards and analytics.",
  },
];

const semanticLight = {
  success: "#16a34a",
  successHover: "#15803d",
  successSoft: "rgba(22, 163, 74, 0.12)",
  successContrast: "#ffffff",

  error: "#dc2626",
  errorHover: "#b91c1c",
  errorSoft: "rgba(220, 38, 38, 0.12)",
  errorContrast: "#ffffff",

  warning: "#f59e0b",
  warningHover: "#d97706",
  warningSoft: "rgba(245, 158, 11, 0.14)",
  warningContrast: "#ffffff",

  info: "#2563eb",
  infoHover: "#1d4ed8",
  infoSoft: "rgba(37, 99, 235, 0.12)",
  infoContrast: "#ffffff",
};

const semanticDark = {
  success: "#4ade80",
  successHover: "#22c55e",
  successSoft: "rgba(74, 222, 128, 0.16)",
  successContrast: "#07150d",

  error: "#f87171",
  errorHover: "#ef4444",
  errorSoft: "rgba(248, 113, 113, 0.16)",
  errorContrast: "#ffffff",

  warning: "#fbbf24",
  warningHover: "#f59e0b",
  warningSoft: "rgba(251, 191, 36, 0.16)",
  warningContrast: "#07150d",

  info: "#60a5fa",
  infoHover: "#3b82f6",
  infoSoft: "rgba(96, 165, 250, 0.16)",
  infoContrast: "#ffffff",
};

const lightBase = {
  surface: "#ffffff",
  text: "#0f172a",
  textMuted: "rgba(15, 23, 42, 0.62)",
  textDisabled: "rgba(15, 23, 42, 0.38)",
  textInverse: "#ffffff",

  borderStrong: "rgba(15, 23, 42, 0.22)",
  divider: "rgba(15, 23, 42, 0.08)",

  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  disabledBg: "rgba(15, 23, 42, 0.03)",
  disabledText: "rgba(15, 23, 42, 0.4)",
  disabledBorder: "rgba(15, 23, 42, 0.08)",

  overlay: "rgba(0, 0, 0, 0.5)",

  shadowXs: "0 1px 2px rgba(15, 23, 42, 0.04)",
  shadowSm: "0 2px 8px rgba(15, 23, 42, 0.06)",
  shadowMd: "0 8px 20px rgba(15, 23, 42, 0.1)",
  shadowLg: "0 18px 45px rgba(15, 23, 42, 0.12)",
  shadowXl: "0 28px 70px rgba(15, 23, 42, 0.18)",

  ...semanticLight,
};

const darkBase = {
  text: "#f8fafc",
  textMuted: "rgba(248, 250, 252, 0.68)",
  textDisabled: "rgba(248, 250, 252, 0.4)",
  textInverse: "#0f172a",

  borderStrong: "rgba(255, 255, 255, 0.24)",
  divider: "rgba(255, 255, 255, 0.08)",

  disabledBg: "rgba(255, 255, 255, 0.04)",
  disabledText: "rgba(255, 255, 255, 0.4)",
  disabledBorder: "rgba(255, 255, 255, 0.08)",

  readOnlyBg: "rgba(255, 255, 255, 0.03)",

  overlay: "rgba(0, 0, 0, 0.65)",

  shadowXs: "0 1px 2px rgba(0, 0, 0, 0.24)",
  shadowSm: "0 2px 8px rgba(0, 0, 0, 0.3)",
  shadowMd: "0 8px 20px rgba(0, 0, 0, 0.35)",
  shadowLg: "0 18px 45px rgba(0, 0, 0, 0.45)",
  shadowXl: "0 28px 70px rgba(0, 0, 0, 0.55)",

  ...semanticDark,
};

export const colorTokens = {
  emerald: {
    light: {
      ...lightBase,

      bg: "#f8fffb",
      surface: "#ffffff",
      surfaceAlt: "#f2fbf6",
      surfaceHover: "rgba(0, 153, 74, 0.04)",
      surfaceActive: "rgba(0, 153, 74, 0.08)",

      border: "rgba(0, 153, 74, 0.16)",

      primary: "#00994a",
      primaryHover: "#00833f",
      primarySoft: "rgba(0, 153, 74, 0.12)",
      primaryContrast: "#ffffff",

      readOnlyBg: "rgba(0, 153, 74, 0.035)",

      hoverOverlay: "rgba(0, 153, 74, 0.06)",
      activeOverlay: "rgba(0, 153, 74, 0.1)",

      focusRing: "0 0 0 2px rgba(0, 153, 74, 0.35)",
    },

    dark: {
      ...darkBase,

      bg: "#07150d",
      surface: "#0f2418",
      surfaceAlt: "#132c1f",
      surfaceHover: "rgba(255, 255, 255, 0.04)",
      surfaceActive: "rgba(255, 255, 255, 0.08)",

      border: "rgba(74, 222, 128, 0.18)",

      primary: "#22c55e",
      primaryHover: "#16a34a",
      primarySoft: "rgba(34, 197, 94, 0.16)",
      primaryContrast: "#ffffff",

      hoverOverlay: "rgba(34, 197, 94, 0.08)",
      activeOverlay: "rgba(34, 197, 94, 0.12)",

      focusRing: "0 0 0 2px rgba(34, 197, 94, 0.45)",

      neutral: {
        50: "#07150d",
        100: "#0f2418",
        200: "#163524",
        300: "#23543a",
        400: "#3f7558",
        500: "#7aa891",
        600: "#b7d3c4",
        700: "#d9e8df",
        800: "#eef7f1",
        900: "#f8fafc",
      },
    },
  },

  classicBlue: {
    light: {
      ...lightBase,

      bg: "#f6fbff",
      surface: "#ffffff",
      surfaceAlt: "#eef7ff",
      surfaceHover: "rgba(2, 132, 199, 0.04)",
      surfaceActive: "rgba(2, 132, 199, 0.08)",

      border: "rgba(2, 132, 199, 0.16)",

      primary: "#0284c7",
      primaryHover: "#0369a1",
      primarySoft: "rgba(2, 132, 199, 0.12)",
      primaryContrast: "#ffffff",

      readOnlyBg: "rgba(2, 132, 199, 0.035)",

      hoverOverlay: "rgba(2, 132, 199, 0.06)",
      activeOverlay: "rgba(2, 132, 199, 0.1)",

      focusRing: "0 0 0 2px rgba(2, 132, 199, 0.35)",
    },

    dark: {
      ...darkBase,

      bg: "#06131f",
      surface: "#0d2233",
      surfaceAlt: "#12304a",
      surfaceHover: "rgba(255, 255, 255, 0.04)",
      surfaceActive: "rgba(255, 255, 255, 0.08)",

      border: "rgba(56, 189, 248, 0.2)",

      primary: "#38bdf8",
      primaryHover: "#0ea5e9",
      primarySoft: "rgba(56, 189, 248, 0.16)",
      primaryContrast: "#06131f",

      hoverOverlay: "rgba(56, 189, 248, 0.08)",
      activeOverlay: "rgba(56, 189, 248, 0.12)",

      focusRing: "0 0 0 2px rgba(56, 189, 248, 0.45)",

      neutral: {
        50: "#06131f",
        100: "#0d2233",
        200: "#12304a",
        300: "#1c4a6b",
        400: "#367192",
        500: "#78a6bf",
        600: "#b6d3e3",
        700: "#d7eaf2",
        800: "#edf7fb",
        900: "#f8fafc",
      },
    },
  },

  slate: {
    light: {
      ...lightBase,

      bg: "#f8fafc",
      surface: "#ffffff",
      surfaceAlt: "#f1f5f9",
      surfaceHover: "rgba(71, 85, 105, 0.04)",
      surfaceActive: "rgba(71, 85, 105, 0.08)",

      border: "rgba(71, 85, 105, 0.16)",

      primary: "#475569",
      primaryHover: "#334155",
      primarySoft: "rgba(71, 85, 105, 0.12)",
      primaryContrast: "#ffffff",

      readOnlyBg: "rgba(71, 85, 105, 0.035)",

      hoverOverlay: "rgba(71, 85, 105, 0.06)",
      activeOverlay: "rgba(71, 85, 105, 0.1)",

      focusRing: "0 0 0 2px rgba(71, 85, 105, 0.35)",
    },

    dark: {
      ...darkBase,

      bg: "#0f172a",
      surface: "#111827",
      surfaceAlt: "#1e293b",
      surfaceHover: "rgba(255, 255, 255, 0.04)",
      surfaceActive: "rgba(255, 255, 255, 0.08)",

      border: "rgba(148, 163, 184, 0.2)",

      primary: "#94a3b8",
      primaryHover: "#cbd5e1",
      primarySoft: "rgba(148, 163, 184, 0.16)",
      primaryContrast: "#0f172a",

      hoverOverlay: "rgba(148, 163, 184, 0.08)",
      activeOverlay: "rgba(148, 163, 184, 0.12)",

      focusRing: "0 0 0 2px rgba(148, 163, 184, 0.45)",

      neutral: {
        50: "#0f172a",
        100: "#111827",
        200: "#1e293b",
        300: "#334155",
        400: "#475569",
        500: "#64748b",
        600: "#94a3b8",
        700: "#cbd5e1",
        800: "#e2e8f0",
        900: "#f8fafc",
      },
    },
  },

  warm: {
    light: {
      ...lightBase,

      bg: "#fffaf3",
      surface: "#ffffff",
      surfaceAlt: "#fff3df",
      surfaceHover: "rgba(217, 119, 6, 0.04)",
      surfaceActive: "rgba(217, 119, 6, 0.08)",

      border: "rgba(217, 119, 6, 0.16)",

      primary: "#d97706",
      primaryHover: "#b45309",
      primarySoft: "rgba(217, 119, 6, 0.12)",
      primaryContrast: "#ffffff",

      readOnlyBg: "rgba(217, 119, 6, 0.035)",

      hoverOverlay: "rgba(217, 119, 6, 0.06)",
      activeOverlay: "rgba(217, 119, 6, 0.1)",

      focusRing: "0 0 0 2px rgba(217, 119, 6, 0.35)",
    },

    dark: {
      ...darkBase,

      bg: "#1c1208",
      surface: "#2a1a0c",
      surfaceAlt: "#3a250f",
      surfaceHover: "rgba(255, 255, 255, 0.04)",
      surfaceActive: "rgba(255, 255, 255, 0.08)",

      border: "rgba(245, 158, 11, 0.2)",

      primary: "#f59e0b",
      primaryHover: "#fbbf24",
      primarySoft: "rgba(245, 158, 11, 0.16)",
      primaryContrast: "#1c1208",

      hoverOverlay: "rgba(245, 158, 11, 0.08)",
      activeOverlay: "rgba(245, 158, 11, 0.12)",

      focusRing: "0 0 0 2px rgba(245, 158, 11, 0.45)",

      neutral: {
        50: "#1c1208",
        100: "#2a1a0c",
        200: "#3a250f",
        300: "#5c3a16",
        400: "#8a5a21",
        500: "#b8863b",
        600: "#d9b56f",
        700: "#ead2a4",
        800: "#f7ead0",
        900: "#fffaf3",
      },
    },
  },

  indigo: {
    light: {
      ...lightBase,

      bg: "#f8f7ff",
      surface: "#ffffff",
      surfaceAlt: "#f1efff",
      surfaceHover: "rgba(79, 70, 229, 0.04)",
      surfaceActive: "rgba(79, 70, 229, 0.08)",

      border: "rgba(79, 70, 229, 0.16)",

      primary: "#4f46e5",
      primaryHover: "#4338ca",
      primarySoft: "rgba(79, 70, 229, 0.12)",
      primaryContrast: "#ffffff",

      readOnlyBg: "rgba(79, 70, 229, 0.035)",

      hoverOverlay: "rgba(79, 70, 229, 0.06)",
      activeOverlay: "rgba(79, 70, 229, 0.1)",

      focusRing: "0 0 0 2px rgba(79, 70, 229, 0.35)",
    },

    dark: {
      ...darkBase,

      bg: "#100f24",
      surface: "#191736",
      surfaceAlt: "#211f46",
      surfaceHover: "rgba(255, 255, 255, 0.04)",
      surfaceActive: "rgba(255, 255, 255, 0.08)",

      border: "rgba(129, 140, 248, 0.22)",

      primary: "#818cf8",
      primaryHover: "#a5b4fc",
      primarySoft: "rgba(129, 140, 248, 0.16)",
      primaryContrast: "#100f24",

      hoverOverlay: "rgba(129, 140, 248, 0.08)",
      activeOverlay: "rgba(129, 140, 248, 0.12)",

      focusRing: "0 0 0 2px rgba(129, 140, 248, 0.45)",

      neutral: {
        50: "#100f24",
        100: "#191736",
        200: "#211f46",
        300: "#312e67",
        400: "#4f4b8f",
        500: "#817dbd",
        600: "#b6b3df",
        700: "#d8d6ef",
        800: "#efeffb",
        900: "#f8fafc",
      },
    },
  },
};
