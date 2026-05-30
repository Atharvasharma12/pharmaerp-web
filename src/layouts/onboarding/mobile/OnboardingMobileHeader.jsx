// src/layouts/onboarding/mobile/OnboardingMobileHeader.jsx

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";

import LanguageSelector from "@/components/shared/language/LanguageSelector";
import ThemeSwitcher from "@/components/shared/theme/ThemeSwitcher";
import { ROUTES } from "@/constants";

import { ONBOARDING_STEPS } from "../onboardingConstants";

const routeStepMap = {
  [ROUTES.CREATE_WORKSPACE]: 0,
  [ROUTES.CHOOSE_PLAN]: 1,
  [ROUTES.TRIAL_ACTIVATED]: 2,
  [ROUTES.SUBSCRIPTION_SUCCESS]: 2,
};

const OnboardingMobileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeStep = routeStepMap[location.pathname] ?? 0;

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(ROUTES.HOME);
      return;
    }

    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-md">
      <div className="px-4 pb-2 pt-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text shadow-sm transition hover:border-primary hover:text-primary"
          >
            <FiArrowLeft className="text-[18px]" />
          </button>

          <Link to={ROUTES.HOME} className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
              <img
                src="/erp-mini-logo.png"
                alt="PharmaERP Logo"
                className="h-5 w-5 object-contain"
              />
            </div>

            <span className="text-[20px] font-bold leading-none tracking-tight text-text">
              Pharma<span className="text-primary">ERP</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <ThemeSwitcher compact size="small" align="right" />

            <div className="origin-right scale-90">
              <LanguageSelector size="small" align="right" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start">
          {ONBOARDING_STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const isReached = index <= activeStep;

            return (
              <React.Fragment key={step.id}>
                <div className="flex min-w-[48px] flex-col items-center">
                  <div
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition",
                      isReached
                        ? "border-primary bg-primary text-primary-contrast"
                        : "border-border-strong bg-surface text-text-muted",
                    ].join(" ")}
                  >
                    {isCompleted ? (
                      <FiCheck className="text-[12px]" />
                    ) : (
                      step.id
                    )}
                  </div>

                  <span
                    className={[
                      "mt-1 text-center text-[10px] leading-none",
                      isActive
                        ? "font-semibold text-text"
                        : "font-medium text-text-muted",
                    ].join(" ")}
                  >
                    {step.label}
                  </span>
                </div>

                {index < ONBOARDING_STEPS.length - 1 && (
                  <div className="mt-[14px] h-[2px] flex-1 rounded-full bg-border-strong">
                    <div
                      className={[
                        "h-full rounded-full bg-primary transition-all duration-300",
                        index < activeStep ? "w-full" : "w-0",
                      ].join(" ")}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default OnboardingMobileHeader;
