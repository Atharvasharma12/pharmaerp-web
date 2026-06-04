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
  severity = "info",
  variant = "soft",
  showIcon = true,
  closable = false,
  onClose,
  icon,
  actions,
  fullWidth = true,
  rounded = "md",
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
      icon: <CheckCircleOutlineRoundedIcon fontSize="small" />,
    },
    error: {
      main: t.error,
      soft: t.errorSoft,
      contrast: t.errorContrast,
      icon: <ErrorOutlineRoundedIcon fontSize="small" />,
    },
    warning: {
      main: t.warning,
      soft: t.warningSoft,
      contrast: t.warningContrast,
      icon: <WarningAmberRoundedIcon fontSize="small" />,
    },
    info: {
      main: t.info,
      soft: t.infoSoft,
      contrast: t.infoContrast,
      icon: <InfoOutlinedIcon fontSize="small" />,
    },
  };

  const active = severityMap[severity] || severityMap.info;

  const radiusMap = {
    sm: "8px",
    md: "12px",
    lg: "16px",
  };

  const paddingY = dense ? 0.75 : 1;
  const paddingX = dense ? 1.25 : 1.5;

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
          alignItems: "center",
          gap: 1.25,
          position: "relative",
          minHeight: dense ? 36 : 42,
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
              justifyContent: "center",
              color: variant === "filled" ? active.contrast : active.main,
              flexShrink: 0,
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
            justifyContent: "center",
            gap: title && children ? 0.25 : 0,
            minWidth: 0,
            ...contentSx,
          }}
        >
          {title && (
            <Typography
              sx={{
                fontSize: dense ? "0.78rem" : "0.82rem",
                fontWeight: 700,
                lineHeight: 1.25,
                color: variant === "filled" ? active.contrast : active.main,
              }}
            >
              {title}
            </Typography>
          )}

          {children && (
            <Typography
              sx={{
                fontSize: dense ? "0.74rem" : "0.78rem",
                lineHeight: 1.35,
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
            icon={<CloseRoundedIcon fontSize="small" />}
            size="small"
            variant="text"
            onClick={onClose}
            sx={{
              color: variant === "filled" ? active.contrast : t.textMuted,
              flexShrink: 0,
            }}
          />
        )}
      </Box>
    </Collapse>
  );
};

export default AppAlert;
