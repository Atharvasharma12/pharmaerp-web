import React from "react";
import { Box, Typography, Collapse } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import { AppIconButton } from "@/components";

const AppAlert = ({
  title,
  children,
  severity = "info", // success | error | warning | info
  variant = "soft", // soft | outlined | filled
  showIcon = true,
  closable = false,
  onClose,
  icon,
  actions,
  fullWidth = true,
  rounded = "md", // sm | md | lg
  dense = false,
  visible = true,
  sx = {},
  contentSx = {},
  ...props
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const severityMap = {
    success: {
      main: t.success,
      soft: t.successSoft,
      contrast: t.successContrast,
      icon: <CheckCircleOutlineRoundedIcon />,
    },
    error: {
      main: t.error,
      soft: t.errorSoft,
      contrast: t.errorContrast,
      icon: <ErrorOutlineRoundedIcon />,
    },
    warning: {
      main: t.warning,
      soft: t.warningSoft,
      contrast: t.warningContrast,
      icon: <WarningAmberRoundedIcon />,
    },
    info: {
      main: t.info,
      soft: t.infoSoft,
      contrast: t.infoContrast,
      icon: <InfoOutlinedIcon />,
    },
  };

  const active = severityMap[severity] || severityMap.info;

  const radiusMap = {
    sm: "8px",
    md: "12px",
    lg: "16px",
  };

  const paddingY = dense ? 1 : 1.5;
  const paddingX = dense ? 1.5 : 2;

  const variantStyles = {
    soft: {
      backgroundColor: active.soft,
      color: active.main,
      border: `1px solid transparent`,
    },
    outlined: {
      backgroundColor: "transparent",
      color: active.main,
      border: `1px solid ${active.main}`,
    },
    filled: {
      backgroundColor: active.main,
      color: active.contrast,
      border: `1px solid ${active.main}`,
    },
  };

  const appliedVariant = variantStyles[variant] || variantStyles.soft;

  return (
    <Collapse in={visible}>
      <Box
        role="alert"
        sx={{
          width: fullWidth ? "100%" : "auto",
          borderRadius: radiusMap[rounded] || radiusMap.md,
          px: paddingX,
          py: paddingY,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          position: "relative",
          ...appliedVariant,
          ...sx,
        }}
        {...props}
      >
        {/* ICON */}
        {showIcon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: "2px",
              color: variant === "filled" ? active.contrast : active.main,
            }}
          >
            {icon || active.icon}
          </Box>
        )}

        {/* CONTENT */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.4,
            ...contentSx,
          }}
        >
          {title && (
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: 800,
                color: variant === "filled" ? active.contrast : active.main,
              }}
            >
              {title}
            </Typography>
          )}

          {children && (
            <Typography
              sx={{
                fontSize: "0.82rem",
                lineHeight: 1.5,
                color: variant === "filled" ? active.contrast : t.textMuted,
              }}
            >
              {children}
            </Typography>
          )}

          {/* ACTIONS */}
          {actions && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 0.5,
                flexWrap: "wrap",
              }}
            >
              {actions}
            </Box>
          )}
        </Box>

        {/* CLOSE BUTTON */}
        {closable && (
          <AppIconButton
            icon={<CloseRoundedIcon />}
            size="small"
            variant="text"
            onClick={onClose}
            sx={{
              color: variant === "filled" ? active.contrast : t.textMuted,
            }}
          />
        )}
      </Box>
    </Collapse>
  );
};

export default AppAlert;
