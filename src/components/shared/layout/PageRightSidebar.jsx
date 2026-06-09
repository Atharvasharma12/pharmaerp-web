import React from "react";
import { FiArrowRight, FiCheckCircle, FiZap } from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppInfoCard,
  AppStack,
  AppText,
} from "@/components";

const PageRightSidebar = ({
  cards = [],
  children,
  spacing = 4,
  sx = {},
  cardSx = {},
}) => {
  return (
    <AppBox sx={{ minWidth: 0, ...sx }}>
      <AppStack direction="column" gap={spacing}>
        {cards.map((card, index) => (
          <SidebarInfoCard
            key={card.id || card.title || index}
            card={card}
            cardSx={cardSx}
          />
        ))}

        {children}
      </AppStack>
    </AppBox>
  );
};

const SidebarInfoCard = ({ card, cardSx = {} }) => {
  const {
    title,
    description,
    icon,
    iconPlacement = "heading",
    badge,
    badgeColor = "info",
    colorVariant = "info",

    points = [],
    pointIcon,
    pointIconVariant = "check",

    action,
    actionLabel,
    actionIcon,
    onAction,
    actionVariant = "text",
    actionColorVariant = "primary",

    custom,
    children,

    variant = "soft",
    soft = false,
    sx = {},
    iconSx = {},
  } = card;

  const content = custom || children;

  return (
    <AppInfoCard
      title={title}
      description={description}
      icon={icon}
      iconPlacement={iconPlacement}
      badge={badge}
      badgeColor={badgeColor}
      colorVariant={colorVariant}
      variant={soft ? "soft" : variant}
      sx={{
        ...baseCardSx,
        ...cardSx,
        ...sx,
      }}
      iconSx={iconSx}
      action={
        action ||
        (actionLabel ? (
          <AppButton
            type="button"
            variant={actionVariant}
            colorVariant={actionColorVariant}
            rounded="md"
            size="small"
            onClick={onAction}
            endIcon={actionIcon || <FiArrowRight />}
            sx={actionButtonSx}
          >
            {actionLabel}
          </AppButton>
        ) : null)
      }
    >
      {content ? content : null}

      {points.length ? (
        <AppStack direction="column" gap={1.1} sx={content ? { mt: 1.5 } : {}}>
          {points.map((point, index) => (
            <PointRow
              key={getPointKey(point, index)}
              point={point}
              icon={pointIcon}
              iconVariant={pointIconVariant}
              colorVariant={colorVariant}
            />
          ))}
        </AppStack>
      ) : null}
    </AppInfoCard>
  );
};

const PointRow = ({
  point,
  icon,
  iconVariant = "check",
  colorVariant = "primary",
}) => {
  const label = typeof point === "string" ? point : point?.label;
  const resolvedIcon =
    icon ||
    point?.icon ||
    (iconVariant === "zap" ? <FiZap /> : <FiCheckCircle />);

  return (
    <AppStack direction="row" align="center" gap={1}>
      <AppBox
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color:
            point?.color ||
            `var(--app-color-${point?.colorVariant || colorVariant}, var(--app-color-primary))`,

          "& svg": {
            fontSize: 15,
          },
        }}
      >
        {resolvedIcon}
      </AppBox>

      <AppText variant="body2" sx={pointTextSx}>
        {label}
      </AppText>
    </AppStack>
  );
};

const getPointKey = (point, index) => {
  if (typeof point === "string") return `${point}-${index}`;
  return point?.id || point?.label || index;
};

const baseCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const pointTextSx = {
  fontSize: "12.5px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const actionButtonSx = {
  px: 0,
  minWidth: 0,
  height: 30,
  fontSize: "12px",
  fontWeight: 700,
};

export default PageRightSidebar;
