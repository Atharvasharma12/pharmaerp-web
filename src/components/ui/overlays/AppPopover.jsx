import React, { useState } from "react";
import { Box, Popover, Typography, Divider } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import { AppIconButton } from "@/components";

const AppPopover = ({
  trigger,
  triggerIcon = <MoreVertRoundedIcon />,
  triggerTooltip = "Open",
  triggerProps = {},

  open: controlledOpen,
  anchorEl: controlledAnchorEl,
  onOpen,
  onClose,

  title,
  subtitle,
  children,

  showHeader = false,
  showClose = false,
  footer,

  anchorOrigin = {
    vertical: "bottom",
    horizontal: "right",
  },
  transformOrigin = {
    vertical: "top",
    horizontal: "right",
  },

  width = 320,
  maxWidth = 380,
  maxHeight = 420,

  closeOnBackdrop = true,
  disabled = false,

  paperSx = {},
  headerSx = {},
  bodySx = {},
  footerSx = {},
  titleSx = {},
  subtitleSx = {},

  ...props
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const [internalAnchorEl, setInternalAnchorEl] = useState(null);

  const isControlled = controlledOpen !== undefined;
  const anchorEl = controlledAnchorEl || internalAnchorEl;
  const open = isControlled ? controlledOpen : Boolean(anchorEl);

  const handleOpen = (event) => {
    if (disabled) return;

    if (!isControlled) {
      setInternalAnchorEl(event.currentTarget);
    }

    onOpen?.(event);
  };

  const handleClose = (event, reason) => {
    if (!closeOnBackdrop && reason === "backdropClick") return;

    if (!isControlled) {
      setInternalAnchorEl(null);
    }

    onClose?.(event, reason);
  };

  const renderTrigger = () => {
    if (typeof trigger === "function") {
      return trigger({
        open,
        anchorEl,
        onClick: handleOpen,
        disabled,
      });
    }

    if (React.isValidElement(trigger)) {
      return React.cloneElement(trigger, {
        onClick: handleOpen,
        disabled: disabled || trigger.props?.disabled,
      });
    }

    return (
      <AppIconButton
        icon={triggerIcon}
        variant="soft"
        colorVariant="primary"
        size="medium"
        rounded="full"
        tooltip={triggerTooltip}
        onClick={handleOpen}
        disabled={disabled}
        {...triggerProps}
      />
    );
  };

  return (
    <>
      {renderTrigger()}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        slotProps={{
          paper: {
            sx: {
              width,
              maxWidth,
              maxHeight,
              mt: 1,
              borderRadius: "16px",
              backgroundColor: t.surface,
              color: t.text,
              backgroundImage: "none",
              border: `1px solid ${t.border}`,
              boxShadow: t.shadowXl,
              overflow: "hidden",
              ...paperSx,
            },
          },
        }}
        {...props}
      >
        {showHeader && (
          <>
            <Box
              sx={{
                px: 2,
                py: 1.6,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1.5,
                ...headerSx,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                {title && (
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: t.text,
                      lineHeight: 1.3,
                      ...titleSx,
                    }}
                  >
                    {title}
                  </Typography>
                )}

                {subtitle && (
                  <Typography
                    sx={{
                      mt: 0.35,
                      fontSize: "0.78rem",
                      color: t.textMuted,
                      lineHeight: 1.45,
                      ...subtitleSx,
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>

              {showClose && (
                <AppIconButton
                  icon={<CloseRoundedIcon />}
                  variant="text"
                  colorVariant="dark"
                  size="small"
                  rounded="full"
                  tooltip="Close"
                  onClick={handleClose}
                />
              )}
            </Box>

            <Divider sx={{ borderColor: t.border }} />
          </>
        )}

        <Box
          sx={{
            p: 2,
            overflowY: "auto",
            maxHeight:
              showHeader || footer ? `calc(${maxHeight}px - 120px)` : maxHeight,
            ...bodySx,
          }}
        >
          {children}
        </Box>

        {footer && (
          <>
            <Divider sx={{ borderColor: t.border }} />

            <Box
              sx={{
                px: 2,
                py: 1.4,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1,
                backgroundColor: t.surface,
                ...footerSx,
              }}
            >
              {footer}
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default AppPopover;
