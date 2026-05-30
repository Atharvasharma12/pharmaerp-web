import { FiCheck } from "react-icons/fi";

import { AppBox, AppStack, AppText } from "@/components";
import { ONBOARDING_STEPS } from "../onboardingConstants";

const OnboardingDesktopProgress = ({
  activeStep = 1,
  steps = ONBOARDING_STEPS,
  showLabels = true,
  sx,
}) => {
  const totalSteps = steps.length;
  const safeActiveStep = Math.max(1, Math.min(activeStep, totalSteps));

  return (
    <AppStack
      direction="row"
      align="flex-start"
      justify="center"
      gap={0}
      sx={{ ...progressSx, ...sx }}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === safeActiveStep;
        const isCompleted = stepNumber < safeActiveStep;
        const isLast = index === steps.length - 1;

        return (
          <AppStack
            key={step.id || step.label || stepNumber}
            direction="row"
            align="flex-start"
            gap={0}
            sx={stepWrapSx}
          >
            <AppStack align="center" gap={0.55} sx={stepContentSx}>
              <AppBox
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  ...circleSx,
                  ...(isCompleted ? completedCircleSx : {}),
                  ...(isActive ? activeCircleSx : {}),
                }}
              >
                {isCompleted ? <FiCheck /> : stepNumber}
              </AppBox>

              {showLabels && (
                <AppText
                  variant="body2"
                  weight={isActive ? 750 : 500}
                  sx={{
                    ...labelSx,
                    ...(isActive ? activeLabelSx : {}),
                    ...(isCompleted ? completedLabelSx : {}),
                  }}
                >
                  {step.label || step.title}
                </AppText>
              )}
            </AppStack>

            {!isLast && (
              <AppBox
                sx={{
                  ...connectorSx,
                  ...(isCompleted ? completedConnectorSx : {}),
                }}
              />
            )}
          </AppStack>
        );
      })}
    </AppStack>
  );
};

const progressSx = {
  flexShrink: 0,
};

const stepWrapSx = {
  position: "relative",
  alignItems: "flex-start",
};

const stepContentSx = {
  position: "relative",
  zIndex: 2,
  width: 82,
};

const circleSx = {
  width: 30,
  height: 30,
  minWidth: 30,
  borderRadius: "999px",
  border: "1.5px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text-muted)",
  fontSize: "13px",
  fontWeight: 700,
  lineHeight: 1,
  transition: "all 0.2s ease",

  "& svg": {
    display: "block",
    fontSize: "16px",
    strokeWidth: 3,
  },
};

const activeCircleSx = {
  borderColor: "var(--app-color-primary)",
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
  boxShadow: "0 0 0 4px var(--app-color-primary-soft)",
};

const completedCircleSx = {
  borderColor: "var(--app-color-primary)",
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
};

const labelSx = {
  fontSize: "12.4px",
  lineHeight: "17px",
  textAlign: "center",
  color: "var(--app-color-text-muted)",
  whiteSpace: "nowrap",
};

const activeLabelSx = {
  color: "var(--app-color-primary)",
};

const completedLabelSx = {
  color: "var(--app-color-text)",
};

const connectorSx = {
  width: 74,
  height: 2,
  mt: "14px",
  mx: -2,
  bgcolor: "var(--app-color-border)",
  transition: "background-color 0.2s ease",
};

const completedConnectorSx = {
  bgcolor: "var(--app-color-primary)",
};

export default OnboardingDesktopProgress;
