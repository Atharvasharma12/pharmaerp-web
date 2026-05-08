import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Box,
  Typography,
} from "@mui/material";

import { AppButton, AppIconButton } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppCard = ({
  children,
  title,
  subtitle,
  header,
  footer,
  actions,
  primaryAction,
  secondaryAction,
  iconAction,
  variant = "default",
  padding = "md",
  rounded = "lg",
  shadow = "sm",
  bordered = true,
  hoverable = false,
  clickable = false,
  disabled = false,
  fullHeight = false,
  divider = false,
  onClick,
  contentSx = {},
  headerSx = {},
  footerSx = {},
  sx = {},
  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const radiusMap = {
    sm: "8px",
    md: "10px",
    lg: "14px",
    xl: "18px",
  };

  const paddingMap = {
    none: 0,
    sm: 1.5,
    md: 2,
    lg: 3,
  };

  const shadowMap = {
    none: "none",
    xs: t.shadowXs,
    sm: t.shadowSm,
    md: t.shadowMd,
    lg: t.shadowLg,
    xl: t.shadowXl,
  };

  const activePadding = paddingMap[padding] ?? paddingMap.md;

  const variantStyles = {
    default: {
      backgroundColor: t.surface,
      border: bordered ? `1px solid ${t.border}` : "1px solid transparent",
    },
    outlined: {
      backgroundColor: t.surface,
      border: `1px solid ${t.borderStrong}`,
    },
    soft: {
      backgroundColor: t.surfaceAlt,
      border: bordered ? `1px solid ${t.border}` : "1px solid transparent",
    },
    ghost: {
      backgroundColor: "transparent",
      border: bordered ? `1px solid ${t.border}` : "1px solid transparent",
    },
  };

  const activeVariant = variantStyles[variant] || variantStyles.default;

  const interactiveStyles =
    hoverable || clickable || onClick
      ? {
          cursor: disabled ? "not-allowed" : "pointer",
          transition:
            "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
          "&:hover": disabled
            ? {}
            : {
                backgroundColor:
                  variant === "ghost"
                    ? t.surfaceHover
                    : variant === "soft"
                      ? t.surface
                      : t.surfaceHover,
                borderColor: t.borderStrong,
                boxShadow:
                  shadowMap[shadow] === "none" ? t.shadowSm : shadowMap[shadow],
                transform: "translateY(-1px)",
              },
          "&:active": disabled
            ? {}
            : {
                transform: "translateY(0)",
                backgroundColor: t.surfaceActive,
              },
          "&:focus-visible": {
            outline: "none",
            boxShadow: t.focusRing,
          },
        }
      : {};

  const renderActionButton = (action, fallbackVariant = "contained") => {
    if (!action) return null;

    return (
      <AppButton
        key={action.label}
        variant={action.variant || fallbackVariant}
        colorVariant={action.colorVariant || "primary"}
        size={action.size || "small"}
        disabled={disabled || action.disabled}
        loading={action.loading}
        startIcon={action.startIcon}
        endIcon={action.endIcon}
        onClick={(event) => {
          event.stopPropagation();
          action.onClick?.(event);
        }}
        sx={action.sx}
      >
        {action.label}
      </AppButton>
    );
  };

  const renderIconAction = () => {
    if (!iconAction) return null;

    return (
      <AppIconButton
        icon={iconAction.icon}
        variant={iconAction.variant || "text"}
        colorVariant={iconAction.colorVariant || "primary"}
        size={iconAction.size || "small"}
        rounded={iconAction.rounded || "md"}
        disabled={disabled || iconAction.disabled}
        loading={iconAction.loading}
        tooltip={iconAction.tooltip}
        onClick={(event) => {
          event.stopPropagation();
          iconAction.onClick?.(event);
        }}
        sx={iconAction.sx}
      />
    );
  };

  const generatedActions =
    primaryAction || secondaryAction || iconAction ? (
      <>
        {renderIconAction()}
        {renderActionButton(secondaryAction, "outlined")}
        {renderActionButton(primaryAction, "contained")}
      </>
    ) : null;

  const finalActions = actions || generatedActions;
  const hasHeader = header || title || subtitle || iconAction;
  const hasFooter = footer || finalActions;

  return (
    <Card
      onClick={disabled ? undefined : onClick}
      {...props}
      sx={{
        borderRadius: radiusMap[rounded] || radiusMap.lg,
        color: t.text,
        backgroundImage: "none",
        boxShadow: disabled ? "none" : shadowMap[shadow] || shadowMap.sm,
        opacity: disabled ? 0.72 : 1,
        overflow: "hidden",
        height: fullHeight ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        ...activeVariant,
        ...interactiveStyles,
        ...sx,
      }}
    >
      {hasHeader && (
        <>
          <Box
            sx={{
              px: activePadding,
              pt: activePadding,
              pb: divider ? 1.5 : 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1.5,
              ...headerSx,
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              {header || (
                <>
                  {title && (
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        lineHeight: 1.25,
                        color: t.text,
                      }}
                    >
                      {title}
                    </Typography>
                  )}

                  {subtitle && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        lineHeight: 1.45,
                        color: t.textMuted,
                      }}
                    >
                      {subtitle}
                    </Typography>
                  )}
                </>
              )}
            </Box>

            {renderIconAction()}
          </Box>

          {divider && <Divider sx={{ borderColor: t.border }} />}
        </>
      )}

      <CardContent
        sx={{
          flex: 1,
          p: activePadding,
          "&:last-child": {
            pb: activePadding,
          },
          color: t.text,
          ...contentSx,
        }}
      >
        {children}
      </CardContent>

      {hasFooter && (
        <>
          {divider && <Divider sx={{ borderColor: t.border }} />}

          {footer ? (
            <Box
              sx={{
                px: activePadding,
                py: 1.5,
                color: t.text,
                ...footerSx,
              }}
            >
              {footer}
            </Box>
          ) : (
            <CardActions
              sx={{
                px: activePadding,
                py: 1.25,
                gap: 1,
                justifyContent: "flex-end",
                color: t.text,
                ...footerSx,
              }}
            >
              {finalActions}
            </CardActions>
          )}
        </>
      )}
    </Card>
  );
};

export default AppCard;
