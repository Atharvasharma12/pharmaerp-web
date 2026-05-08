import React from "react";
import { Box, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import AppCard from "./AppCard";
import AppBadge from "./AppBadge";

const AppInfoCard = ({
  title,
  description,
  icon = <InfoOutlinedIcon />,
  badge,
  badgeColor = "info",
  colorVariant = "info", // primary | success | error | warning | info
  action,
  children,
  variant = "soft", // default | outlined | soft | ghost
  sx = {},
  iconSx = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const colorMap = {
    primary: {
      main: t.primary,
      soft: t.primarySoft,
    },
    success: {
      main: t.success,
      soft: t.successSoft,
    },
    error: {
      main: t.error,
      soft: t.errorSoft,
    },
    warning: {
      main: t.warning,
      soft: t.warningSoft,
    },
    info: {
      main: t.info,
      soft: t.infoSoft,
    },
  };

  const active = colorMap[colorVariant] || colorMap.info;

  return (
    <AppCard variant={variant} shadow="xs" padding="md" rounded="lg" sx={sx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        {icon ? (
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              backgroundColor: active.soft,
              color: active.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,

              "& svg": {
                fontSize: 22,
              },

              ...iconSx,
            }}
          >
            {icon}
          </Box>
        ) : null}

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: description ? 0.5 : 0,
            }}
          >
            {title ? (
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: t.text,
                  lineHeight: 1.3,
                }}
              >
                {title}
              </Typography>
            ) : null}

            {badge ? (
              <AppBadge
                label={badge}
                size="small"
                variant="soft"
                colorVariant={badgeColor}
              />
            ) : null}
          </Box>

          {description ? (
            <Typography
              sx={{
                fontSize: "0.84rem",
                color: t.textMuted,
                lineHeight: 1.55,
              }}
            >
              {description}
            </Typography>
          ) : null}

          {children ? <Box sx={{ mt: 1.5 }}>{children}</Box> : null}

          {action ? <Box sx={{ mt: 1.5 }}>{action}</Box> : null}
        </Box>
      </Box>
    </AppCard>
  );
};

export default AppInfoCard;
