import React from "react";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

import {
  AppBox,
  AppStack,
  AppGrid,
  AppCard,
  AppBadge,
  AppStatusBadge,
  AppText,
  AppHeading,
  AppTooltip,
  AppSkeleton,
  AppIconButton,
} from "@/components";

const SummaryCards = ({
  items = [],

  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },

  loading = false,
  skeletonCount = 4,

  variant = "default", // default | compact | detailed
  cardVariant = "default", // default | outlined | soft | ghost
  cardPadding = "md",
  rounded = "lg",
  shadow = "sm",
  bordered = true,
  hoverable = true,

  showTrend = true,
  showStatus = true,
  showFooter = true,

  onCardClick,

  sx = {},
  cardSx = {},
  ...props
}) => {
  const getTrendMeta = (trend) => {
    if (trend === "up" || trend === "increase" || trend === "positive") {
      return {
        icon: <TrendingUpRoundedIcon />,
        color: "success",
      };
    }

    if (trend === "down" || trend === "decrease" || trend === "negative") {
      return {
        icon: <TrendingDownRoundedIcon />,
        color: "error",
      };
    }

    return {
      icon: <RemoveRoundedIcon />,
      color: "neutral",
    };
  };

  const renderSkeleton = () => {
    return Array.from({ length: skeletonCount }).map((_, index) => (
      <AppCard
        key={index}
        variant={cardVariant}
        padding={cardPadding}
        rounded={rounded}
        shadow={shadow}
        bordered={bordered}
        sx={cardSx}
      >
        <AppStack spacing={2}>
          <AppStack direction="row" justify="space-between" align="center">
            <AppSkeleton width="45%" height={18} />
            <AppSkeleton variant="circular" width={36} height={36} />
          </AppStack>

          <AppSkeleton width="70%" height={34} />

          <AppSkeleton width={["90%", "55%"]} height={16} count={2} />
        </AppStack>
      </AppCard>
    ));
  };

  return (
    <AppGrid
      xs={columns.xs}
      sm={columns.sm}
      md={columns.md}
      lg={columns.lg}
      xl={columns.xl}
      gap={2}
      sx={sx}
      {...props}
    >
      {loading
        ? renderSkeleton()
        : items.map((item, index) => {
            const trendMeta = getTrendMeta(item.trend);

            const isClickable = Boolean(item.onClick || onCardClick);

            return (
              <AppCard
                key={item.key || item.id || item.title || index}
                variant={item.cardVariant || cardVariant}
                padding={item.padding || cardPadding}
                rounded={item.rounded || rounded}
                shadow={item.shadow || shadow}
                bordered={item.bordered ?? bordered}
                hoverable={item.hoverable ?? hoverable}
                clickable={isClickable}
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.(item, index);
                  onCardClick?.(item, index);
                }}
                sx={{
                  minHeight: variant === "compact" ? 118 : 148,
                  ...cardSx,
                  ...item.sx,
                }}
              >
                <AppStack spacing={variant === "compact" ? 1.25 : 1.75}>
                  <AppStack
                    direction="row"
                    align="flex-start"
                    justify="space-between"
                    gap={1.5}
                  >
                    <AppBox sx={{ minWidth: 0 }}>
                      {item.label || item.title ? (
                        <AppText
                          color="var(--color-text-muted)"
                          sx={{
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            textTransform: item.uppercaseLabel
                              ? "uppercase"
                              : "none",
                            letterSpacing: item.uppercaseLabel ? "0.04em" : 0,
                          }}
                        >
                          {item.label || item.title}
                        </AppText>
                      ) : null}

                      {item.value !== undefined ? (
                        <AppHeading
                          level={4}
                          weight={800}
                          sx={{
                            mt: 0.4,
                            fontSize: {
                              xs: "1.45rem",
                              sm: variant === "compact" ? "1.45rem" : "1.7rem",
                            },
                            lineHeight: 1.15,
                          }}
                        >
                          {item.value}
                        </AppHeading>
                      ) : null}
                    </AppBox>

                    {item.action ? (
                      <AppIconButton
                        icon={item.action.icon}
                        tooltip={item.action.tooltip}
                        variant={item.action.variant || "soft"}
                        colorVariant={
                          item.action.colorVariant ||
                          item.colorVariant ||
                          "primary"
                        }
                        size={item.action.size || "small"}
                        onClick={(event) => {
                          event.stopPropagation();
                          item.action.onClick?.(item, index);
                        }}
                      />
                    ) : item.icon ? (
                      <AppTooltip title={item.iconTooltip || ""}>
                        <AppBox
                          sx={{
                            width: 42,
                            height: 42,
                            minWidth: 42,
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: `var(--color-${item.colorVariant || "primary"})`,
                            backgroundColor: `var(--color-${item.colorVariant || "primary"}-soft)`,
                            "& svg": {
                              fontSize: 22,
                            },
                          }}
                        >
                          {item.icon}
                        </AppBox>
                      </AppTooltip>
                    ) : null}
                  </AppStack>

                  {item.description && variant !== "compact" ? (
                    <AppText
                      color="var(--color-text-muted)"
                      sx={{
                        fontSize: "0.84rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {item.description}
                    </AppText>
                  ) : null}

                  {(showTrend || showStatus || item.badge || item.footer) &&
                  showFooter ? (
                    <AppStack
                      direction="row"
                      align="center"
                      justify="space-between"
                      gap={1}
                      sx={{ mt: "auto", minWidth: 0 }}
                    >
                      <AppStack
                        direction="row"
                        align="center"
                        gap={1}
                        wrap="wrap"
                      >
                        {showTrend && item.change ? (
                          <AppBadge
                            label={item.change}
                            size="small"
                            variant="soft"
                            colorVariant={item.trendColor || trendMeta.color}
                            startIcon={item.trendIcon || trendMeta.icon}
                          />
                        ) : null}

                        {item.badge ? (
                          <AppBadge
                            label={item.badge}
                            size="small"
                            variant="soft"
                            colorVariant={item.badgeColor || "primary"}
                          />
                        ) : null}

                        {showStatus && item.status ? (
                          <AppStatusBadge
                            status={item.status}
                            label={item.statusLabel}
                            size="small"
                            showDot
                          />
                        ) : null}
                      </AppStack>

                      {item.footer ? (
                        <AppText
                          color="var(--color-text-muted)"
                          sx={{
                            fontSize: "0.76rem",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.footer}
                        </AppText>
                      ) : null}
                    </AppStack>
                  ) : null}
                </AppStack>
              </AppCard>
            );
          })}
    </AppGrid>
  );
};

export default SummaryCards;
