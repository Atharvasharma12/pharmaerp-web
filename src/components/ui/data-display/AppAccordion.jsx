import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import AppBadge from "./AppBadge";

const AppAccordion = ({
  items = [],
  expanded,
  onChange,
  variant = "default", // default | soft | outlined | ghost
  size = "medium", // small | medium | large
  colorVariant = "primary", // primary | success | error | warning | info
  allowMultiple = false,
  defaultExpanded = false,
  disableGutters = true,
  sx = {},
  itemSx = {},
  summarySx = {},
  detailsSx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const [internalExpanded, setInternalExpanded] = React.useState(() => {
    if (allowMultiple) return [];
    return defaultExpanded ? 0 : false;
  });

  const activeExpanded = expanded !== undefined ? expanded : internalExpanded;

  const colorMap = {
    primary: {
      main: t.primary,
      soft: t.primarySoft,
      border: t.primary,
    },
    success: {
      main: t.success,
      soft: t.successSoft,
      border: t.success,
    },
    error: {
      main: t.error,
      soft: t.errorSoft,
      border: t.error,
    },
    warning: {
      main: t.warning,
      soft: t.warningSoft,
      border: t.warning,
    },
    info: {
      main: t.info,
      soft: t.infoSoft,
      border: t.info,
    },
  };

  const active = colorMap[colorVariant] || colorMap.primary;

  const sizeMap = {
    small: {
      py: 0.75,
      px: 1.25,
      title: "0.82rem",
      desc: "0.74rem",
      icon: 18,
    },
    medium: {
      py: 1,
      px: 1.5,
      title: "0.9rem",
      desc: "0.8rem",
      icon: 20,
    },
    large: {
      py: 1.25,
      px: 1.75,
      title: "0.98rem",
      desc: "0.86rem",
      icon: 22,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const isItemExpanded = (index) => {
    if (allowMultiple) {
      return Array.isArray(activeExpanded) && activeExpanded.includes(index);
    }

    return activeExpanded === index;
  };

  const handleChange = (index, item) => (_, isExpanded) => {
    let nextExpanded;

    if (allowMultiple) {
      const current = Array.isArray(activeExpanded) ? activeExpanded : [];

      nextExpanded = isExpanded
        ? [...current, index]
        : current.filter((itemIndex) => itemIndex !== index);
    } else {
      nextExpanded = isExpanded ? index : false;
    }

    if (expanded === undefined) {
      setInternalExpanded(nextExpanded);
    }

    onChange?.(nextExpanded, item, index);
  };

  const getVariantStyles = (selected) => {
    if (variant === "soft") {
      return {
        backgroundColor: selected ? active.soft : t.surfaceAlt,
        border: `1px solid ${selected ? active.border : t.border}`,
      };
    }

    if (variant === "outlined") {
      return {
        backgroundColor: t.surface,
        border: `1px solid ${selected ? active.border : t.borderStrong}`,
      };
    }

    if (variant === "ghost") {
      return {
        backgroundColor: selected ? t.surfaceHover : "transparent",
        border: "1px solid transparent",
      };
    }

    return {
      backgroundColor: t.surface,
      border: `1px solid ${selected ? active.border : t.border}`,
    };
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        ...sx,
      }}
    >
      {items.map((item, index) => {
        const selected = isItemExpanded(index);

        return (
          <Accordion
            key={item.key || item.title || index}
            expanded={selected}
            disabled={item.disabled}
            onChange={handleChange(index, item)}
            disableGutters={disableGutters}
            elevation={0}
            square={false}
            sx={{
              borderRadius: "14px !important",
              overflow: "hidden",
              color: t.text,
              boxShadow: "none",
              opacity: item.disabled ? 0.55 : 1,
              transition:
                "background-color 0.18s ease, border-color 0.18s ease",
              ...getVariantStyles(selected),

              "&::before": {
                display: "none",
              },

              ...itemSx,
              ...item.sx,
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreRoundedIcon
                  sx={{
                    fontSize: activeSize.icon,
                    color: selected ? active.main : t.textMuted,
                  }}
                />
              }
              sx={{
                minHeight: "unset",
                px: activeSize.px,
                py: activeSize.py,

                "& .MuiAccordionSummary-content": {
                  my: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  minWidth: 0,
                },

                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  transform: "rotate(180deg)",
                },

                ...summarySx,
                ...item.summarySx,
              }}
            >
              {item.icon ? (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    color: selected ? active.main : t.textMuted,
                    "& svg": {
                      fontSize: activeSize.icon,
                    },
                  }}
                >
                  {item.icon}
                </Box>
              ) : null}

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: activeSize.title,
                    fontWeight: 800,
                    color: selected ? active.main : t.text,
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </Typography>

                {item.description ? (
                  <Typography
                    sx={{
                      fontSize: activeSize.desc,
                      color: t.textMuted,
                      lineHeight: 1.45,
                      mt: 0.25,
                    }}
                  >
                    {item.description}
                  </Typography>
                ) : null}
              </Box>

              {item.badge ? (
                <AppBadge
                  label={item.badge}
                  size="small"
                  variant="soft"
                  colorVariant={item.badgeColor || colorVariant}
                />
              ) : null}
            </AccordionSummary>

            <AccordionDetails
              sx={{
                px: activeSize.px,
                pt: 0,
                pb: activeSize.py,
                color: t.text,
                ...detailsSx,
                ...item.detailsSx,
              }}
            >
              {item.content}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default AppAccordion;
