import React, { useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import { AppIconButton } from "@/components";

const AppMenu = ({
  trigger,
  triggerIcon = <MoreVertRoundedIcon />,
  triggerTooltip = "More options",
  triggerProps = {},

  items = [],
  children,

  anchorOrigin = {
    vertical: "bottom",
    horizontal: "right",
  },
  transformOrigin = {
    vertical: "top",
    horizontal: "right",
  },

  minWidth = 190,
  maxWidth = 280,
  dense = false,
  closeOnItemClick = true,

  disabled = false,

  menuSx = {},
  paperSx = {},
  itemSx = {},

  onOpen,
  onClose,

  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
    onOpen?.(event);
  };

  const handleClose = (event, reason) => {
    setAnchorEl(null);
    onClose?.(event, reason);
  };

  const handleItemClick = (item, event) => {
    if (item.disabled) return;

    item.onClick?.(event, item);

    if (closeOnItemClick && item.closeOnClick !== false) {
      handleClose(event, "itemClick");
    }
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
        sx={{
          color: t.primary,
          backgroundColor: t.primarySoft,
          border: `1px solid ${t.border}`,
          "&:hover": {
            backgroundColor: t.surfaceHover,
            borderColor: t.primary,
          },
        }}
        {...triggerProps}
      />
    );
  };

  return (
    <>
      {renderTrigger()}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        slotProps={{
          paper: {
            sx: {
              minWidth,
              maxWidth,
              mt: 1,
              borderRadius: "14px",
              backgroundColor: t.surface,
              color: t.text,
              border: `1px solid ${t.border}`,
              boxShadow: t.shadowLg,
              backgroundImage: "none",
              overflow: "hidden",
              ...paperSx,
            },
          },
          list: {
            dense,
            sx: {
              py: 0.7,
              backgroundColor: t.surface,
            },
          },
        }}
        sx={menuSx}
        {...props}
      >
        {children
          ? children
          : items.map((item, index) => {
              if (item.type === "divider") {
                return (
                  <Divider
                    key={item.id || index}
                    sx={{
                      my: 0.7,
                      borderColor: t.border,
                    }}
                  />
                );
              }

              if (item.type === "label") {
                return (
                  <Typography
                    key={item.id || index}
                    sx={{
                      px: 1.6,
                      py: 0.8,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: t.textMuted,
                    }}
                  >
                    {item.label}
                  </Typography>
                );
              }

              return (
                <MenuItem
                  key={item.id || item.label || index}
                  disabled={item.disabled}
                  selected={item.selected}
                  onClick={(event) => handleItemClick(item, event)}
                  sx={{
                    mx: 0.7,
                    my: 0.2,
                    px: 1.2,
                    py: dense ? 0.75 : 1,
                    gap: 1,
                    borderRadius: "10px",
                    color: item.danger ? t.error : t.text,
                    backgroundColor: "transparent",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    transition: "background-color 0.18s ease, color 0.18s ease",

                    "&:hover": {
                      backgroundColor: item.danger
                        ? t.errorSoft
                        : t.surfaceHover,
                    },

                    "&.Mui-selected": {
                      backgroundColor: item.danger
                        ? t.errorSoft
                        : t.primarySoft,
                      color: item.danger ? t.error : t.primary,

                      "&:hover": {
                        backgroundColor: item.danger
                          ? t.errorSoft
                          : t.primarySoft,
                      },
                    },

                    "&.Mui-disabled": {
                      color: t.disabledText,
                      opacity: 1,
                    },

                    ...itemSx,
                    ...item.sx,
                  }}
                >
                  {item.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 30,
                        color: item.danger ? t.error : "inherit",

                        "& svg": {
                          fontSize: 19,
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  )}

                  <ListItemText
                    primary={item.label}
                    secondary={item.description}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: "0.86rem",
                        fontWeight: 700,
                        color: "inherit",
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        fontSize: "0.74rem",
                        color: t.textMuted,
                        mt: 0.2,
                      },
                    }}
                  />

                  {item.endIcon && (
                    <Box
                      sx={{
                        ml: 1,
                        display: "flex",
                        alignItems: "center",
                        color: t.textMuted,

                        "& svg": {
                          fontSize: 18,
                        },
                      }}
                    >
                      {item.endIcon}
                    </Box>
                  )}
                </MenuItem>
              );
            })}
      </Menu>
    </>
  );
};

export default AppMenu;
