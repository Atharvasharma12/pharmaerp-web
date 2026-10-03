import { FiCheck } from "react-icons/fi";

import { AppBox, AppStack, AppText } from "@/components";

const OnboardingStepItem = ({
  step,
  title,
  description,
  active = false,
  completed = false,
  isLast = false,
  clickable = false,
  onClick,
  sx,
}) => {
  const stepNumber = step?.id || step;
  const stepTitle = title || step?.title || step?.label;
  const stepDescription = description || step?.description;

  return (
    <AppBox sx={{ ...itemWrapSx, ...sx }}>
      {!isLast && (
        <AppBox
          sx={{
            ...connectorSx,
            ...(completed ? completedConnectorSx : {}),
          }}
        />
      )}

      <AppStack
        component={clickable ? "button" : "div"}
        type={clickable ? "button" : undefined}
        direction="row"
        align="flex-start"
        gap={1}
        onClick={clickable ? onClick : undefined}
        sx={{
          ...itemSx,
          ...(active ? activeItemSx : {}),
          ...(clickable ? clickableItemSx : {}),
        }}
      >
        <AppBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            ...circleSx,
            ...(completed ? completedCircleSx : {}),
            ...(active ? activeCircleSx : {}),
          }}
        >
          {completed ? <FiCheck /> : stepNumber}
        </AppBox>

        <AppBox sx={{ minWidth: 0, pt: 0.05 }}>
          <AppText
            variant="body2"
            weight={active ? 700 : 650}
            sx={{
              ...titleSx,
              ...(active ? activeTitleSx : {}),
              ...(completed ? completedTitleSx : {}),
            }}
          >
            {stepTitle}
          </AppText>

          {stepDescription && (
            <AppText variant="body2" sx={descriptionSx}>
              {stepDescription}
            </AppText>
          )}
        </AppBox>
      </AppStack>
    </AppBox>
  );
};

const itemWrapSx = {
  position: "relative",
  minHeight: 52,
};

const connectorSx = {
  position: "absolute",
  left: 13,
  top: 28,
  bottom: -18,
  width: "1px",
  bgcolor: "var(--app-color-border)",
  transition: "background-color 0.2s ease",
};

const completedConnectorSx = {
  bgcolor: "var(--app-color-primary)",
};

const itemSx = {
  width: "100%",
  position: "relative",
  zIndex: 1,
  px: 0.9,
  py: 0.65,
  borderRadius: "9px",
  border: "1px solid transparent",
  bgcolor: "transparent",
  textAlign: "left",
  transition: "all 0.2s ease",
};

const activeItemSx = {
  mx: -0.9,
  px: 0.9,
  py: 0.7,
  bgcolor: "color-mix(in srgb, var(--app-color-surface) 94%, transparent)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-sm)",
};

const clickableItemSx = {
  cursor: "pointer",

  "&:hover": {
    bgcolor: "color-mix(in srgb, var(--app-color-surface) 88%, transparent)",
    borderColor: "var(--app-color-border)",
  },
};

const circleSx = {
  width: 26,
  height: 26,
  minWidth: 26,
  borderRadius: "999px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text-muted)",
  fontSize: "11px",
  fontWeight: 700,
  lineHeight: 1,
  transition: "all 0.2s ease",

  "& svg": {
    display: "block",
    fontSize: "13px",
    strokeWidth: 3,
  },
};

const completedCircleSx = {
  borderColor: "var(--app-color-primary)",
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
};

const activeCircleSx = {
  borderColor: "var(--app-color-primary)",
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
  boxShadow: "0 0 0 3px var(--app-color-primary-soft)",
};

const titleSx = {
  fontSize: "12px",
  lineHeight: "16px",
  color: "var(--app-color-text)",
};

const activeTitleSx = {
  color: "var(--app-color-primary)",
};

const completedTitleSx = {
  color: "var(--app-color-text)",
};

const descriptionSx = {
  mt: 0.15,
  fontSize: "11.3px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

export default OnboardingStepItem;
