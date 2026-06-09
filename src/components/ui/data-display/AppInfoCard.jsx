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
  iconPlacement = "column", // column | heading
  badge,
  badgeColor = "info",
  colorVariant = "info", // primary | success | error | warning | info
  action,
  children,
  variant = "soft", // default | outlined | soft | ghost
  sx = {},
  iconSx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

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
    neutral: {
      main: t.textMuted,
      soft: t.surfaceHover,
    },
  };

  const active = colorMap[colorVariant] || colorMap.info;
  const isHeadingIcon = iconPlacement === "heading";

  const iconNode = icon ? (
    <Box
      sx={{
        width: isHeadingIcon ? 32 : 42,
        height: isHeadingIcon ? 32 : 42,
        borderRadius: isHeadingIcon ? "10px" : "12px",
        backgroundColor: active.soft,
        color: active.main,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,

        "& svg": {
          fontSize: isHeadingIcon ? 18 : 22,
        },

        ...iconSx,
      }}
    >
      {icon}
    </Box>
  ) : null;

  const titleNode = title ? (
    <Typography
      sx={{
        minWidth: 0,
        fontSize: "0.95rem",
        fontWeight: 800,
        color: t.text,
        lineHeight: 1.3,
      }}
    >
      {title}
    </Typography>
  ) : null;

  const badgeNode = badge ? (
    <AppBadge
      label={badge}
      size="small"
      variant="soft"
      colorVariant={badgeColor}
    />
  ) : null;

  const descriptionNode = description ? (
    <Typography
      sx={{
        fontSize: "0.84rem",
        color: t.textMuted,
        lineHeight: 1.55,
      }}
    >
      {description}
    </Typography>
  ) : null;

  const bodyNode = (
    <>
      {descriptionNode}

      {children ? <Box sx={{ mt: 1.5 }}>{children}</Box> : null}

      {action ? <Box sx={{ mt: 1.5 }}>{action}</Box> : null}
    </>
  );

  if (isHeadingIcon) {
    return (
      <AppCard variant={variant} shadow="xs" padding="md" rounded="lg" sx={sx}>
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: description ? 0.5 : 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
                flex: 1,
              }}
            >
              {iconNode}
              {titleNode}
            </Box>

            {badgeNode}
          </Box>

          {bodyNode}
        </Box>
      </AppCard>
    );
  }

  return (
    <AppCard variant={variant} shadow="xs" padding="md" rounded="lg" sx={sx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        {iconNode}

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
            {titleNode}
            {badgeNode}
          </Box>

          {bodyNode}
        </Box>
      </Box>
    </AppCard>
  );
};

export default AppInfoCard;
