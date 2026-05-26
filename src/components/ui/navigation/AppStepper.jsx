import React from "react";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import {
  AppBox,
  AppStack,
  AppText,
  AppCaption,
  AppTooltip,
} from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppStepper = ({
  steps = [],
  activeStep = 0,
  orientation = "horizontal", // horizontal | vertical
  clickable = false,
  showDescription = true,
  showStepNumber = true,
  onStepClick,
  size = "medium", // small | medium | large
  sx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const isVertical = orientation === "vertical";

  const sizeMap = {
    small: { icon: 28, font: "0.78rem", gap: 1 },
    medium: { icon: 34, font: "0.86rem", gap: 1.25 },
    large: { icon: 42, font: "0.95rem", gap: 1.5 },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const getStatus = (step, index) => {
    if (step.status) return step.status;
    if (index < activeStep) return "completed";
    if (index === activeStep) return "active";
    return "pending";
  };

  const getColor = (status) => {
    if (status === "completed") return t.success;
    if (status === "error") return t.error;
    if (status === "active") return t.primary;
    return t.borderStrong;
  };

  const renderIcon = (status, index) => {
    if (status === "completed") {
      return <CheckRoundedIcon sx={{ fontSize: activeSize.icon * 0.58 }} />;
    }

    if (status === "error") {
      return <ErrorRoundedIcon sx={{ fontSize: activeSize.icon * 0.58 }} />;
    }

    return showStepNumber ? index + 1 : null;
  };

  return (
    <AppStack
      direction={isVertical ? "column" : "row"}
      spacing={isVertical ? 1.5 : 0}
      fullWidth
      sx={{
        width: "100%",
        ...sx,
      }}
    >
      {steps.map((step, index) => {
        const status = getStatus(step, index);
        const color = getColor(status);
        const isClickable = clickable && !step.disabled;

        return (
          <React.Fragment key={step.id || step.label || index}>
            <AppTooltip
              title={!showDescription ? step.description : ""}
              disabled={!step.description || showDescription}
            >
              <AppBox
                onClick={() => {
                  if (isClickable) onStepClick?.(index, step);
                }}
                sx={{
                  display: "flex",
                  alignItems: isVertical ? "flex-start" : "center",
                  gap: activeSize.gap,
                  flex: isVertical ? "unset" : 1,
                  minWidth: 0,
                  cursor: isClickable ? "pointer" : "default",
                  opacity: step.disabled ? 0.55 : 1,
                }}
              >
                <AppBox
                  sx={{
                    width: activeSize.icon,
                    height: activeSize.icon,
                    minWidth: activeSize.icon,
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      status === "active" ||
                      status === "completed" ||
                      status === "error"
                        ? color
                        : "var(--color-surface-alt)",
                    color:
                      status === "pending"
                        ? "var(--color-text-muted)"
                        : "#ffffff",
                    border: `1px solid ${color}`,
                    fontSize: activeSize.font,
                    fontWeight: 800,
                    transition: "all 0.2s ease",
                  }}
                >
                  {renderIcon(status, index)}
                </AppBox>

                <AppBox sx={{ minWidth: 0 }}>
                  <AppText
                    variant="body2"
                    weight={700}
                    sx={{
                      fontSize: activeSize.font,
                      color:
                        status === "active"
                          ? t.primary
                          : status === "error"
                            ? t.error
                            : "var(--color-text)",
                    }}
                  >
                    {step.label}
                  </AppText>

                  {showDescription && step.description && (
                    <AppCaption
                      sx={{
                        display: "block",
                        lineHeight: 1.35,
                        mt: 0.2,
                      }}
                    >
                      {step.description}
                    </AppCaption>
                  )}
                </AppBox>
              </AppBox>
            </AppTooltip>

            {index < steps.length - 1 && (
              <AppBox
                sx={{
                  flex: isVertical ? "unset" : 0.7,
                  width: isVertical ? "1px" : "auto",
                  height: isVertical ? 24 : "1px",
                  ml: isVertical ? `${activeSize.icon / 2}px` : 1,
                  mr: isVertical ? 0 : 1,
                  backgroundColor:
                    getStatus(steps[index + 1], index + 1) === "completed" ||
                    status === "completed"
                      ? t.success
                      : t.border,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </AppStack>
  );
};

export default AppStepper;
