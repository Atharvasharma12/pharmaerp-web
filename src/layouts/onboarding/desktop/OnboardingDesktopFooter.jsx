// src/layouts/onboarding/desktop/OnboardingDesktopFooter.jsx

import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiLock } from "react-icons/fi";

import { AppButton, AppStack, AppText } from "@/components";
import { ROUTES } from "@/constants";

const footerConfig = {
  [ROUTES.REGISTER]: {
    backLabel: "Back",
    backTo: ROUTES.LOGIN,
    continueLabel: "Continue",
    continueTo: ROUTES.CREATE_WORKSPACE,
  },
  [ROUTES.CREATE_WORKSPACE]: {
    backLabel: "Back",
    backTo: ROUTES.REGISTER,
    continueLabel: "Complete Onboarding",
    continueTo: ROUTES.DASHBOARD,
  },
};

const OnboardingDesktopFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const config = useMemo(
    () =>
      footerConfig[location.pathname] || {
        backLabel: "Back",
        backTo: ROUTES.HOME,
        continueLabel: "Continue",
        continueTo: ROUTES.SETUP_CENTER,
      },
    [location.pathname],
  );

  return (
    <footer className="sticky bottom-0 z-50 w-full border-t border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] w-full max-w-7xl items-center justify-between px-5 lg:px-6">
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          startIcon={<FiArrowLeft />}
          onClick={() => navigate(config.backTo)}
          sx={backButtonSx}
        >
          {config.backLabel}
        </AppButton>

        <AppStack direction="row" align="center" gap={0.8}>
          <FiLock className="text-[15px] text-text-muted" />
          <AppText variant="body2" sx={secureTextSx}>
            Your data is secure and encrypted
          </AppText>
        </AppStack>

        <AppButton
          type="button"
          variant="contained"
          colorVariant="primary"
          rounded="md"
          endIcon={<FiArrowRight />}
          onClick={() => navigate(config.continueTo)}
          sx={continueButtonSx}
        >
          {config.continueLabel}
        </AppButton>
      </div>
    </footer>
  );
};

const backButtonSx = {
  height: 38,
  px: 1.8,
  fontSize: "12.5px",
  fontWeight: 650,
};

const secureTextSx = {
  fontSize: "11.8px",
  color: "var(--app-color-text-muted)",
};

const continueButtonSx = {
  height: 40,
  px: 2.2,
  fontSize: "13px",
  fontWeight: 700,
};

export default OnboardingDesktopFooter;
