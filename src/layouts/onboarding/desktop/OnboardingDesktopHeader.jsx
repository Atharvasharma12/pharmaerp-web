// src/layouts/onboarding/desktop/OnboardingDesktopHeader.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FiCheck, FiHelpCircle } from "react-icons/fi";

import ThemeSwitcher from "@/components/shared/theme/ThemeSwitcher";
import { ROUTES } from "@/constants";

import { ONBOARDING_STEPS } from "../onboardingConstants";

const routeStepMap = {
  [ROUTES.CREATE_WORKSPACE]: 0,
  [ROUTES.CHOOSE_PLAN]: 1,
  [ROUTES.TRIAL_ACTIVATED]: 2,
  [ROUTES.SUBSCRIPTION_SUCCESS]: 2,
};

const OnboardingDesktopHeader = ({ helpTo = "/help-center" }) => {
  const location = useLocation();

  const activeStep = routeStepMap[location.pathname] ?? 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-[58px] w-full max-w-7xl items-center justify-between px-5 lg:px-6">
        <Link
          to={ROUTES.HOME}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface shadow-sm">
            <img
              src="/erp-mini-logo.png"
              alt="PharmaERP Logo"
              className="h-5 w-5 object-contain"
            />
          </div>

          <div>
            <div className="text-[18px] font-semibold leading-none tracking-tight text-text">
              <span className="text-primary">Pharma</span>ERP
            </div>
            <div className="mt-1 text-[11px] font-normal leading-none text-text-muted">
              Retail Pharmacy ERP
            </div>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-center px-5">
          <div className="flex w-full max-w-[420px] items-start justify-center">
            {ONBOARDING_STEPS.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex min-w-[104px] flex-col items-center">
                    <div
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-full border text-[12px] font-semibold transition",
                        isActive || isCompleted
                          ? "border-primary bg-primary text-primary-contrast"
                          : "border-border-strong bg-surface text-text-muted",
                      ].join(" ")}
                    >
                      {isCompleted ? (
                        <FiCheck className="text-[13px]" />
                      ) : (
                        step.id
                      )}
                    </div>

                    <span
                      className={[
                        "mt-1.5 whitespace-nowrap text-center text-[11px] leading-none",
                        isActive
                          ? "font-semibold text-text"
                          : "font-normal text-text-muted",
                      ].join(" ")}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < ONBOARDING_STEPS.length - 1 && (
                    <div className="mt-[13px] h-px flex-1 min-w-[42px] rounded-full bg-border-strong">
                      <div
                        className={[
                          "h-full rounded-full bg-primary transition-all",
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

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to={helpTo}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] font-medium text-text-muted transition hover:bg-surface-hover hover:text-primary"
          >
            <FiHelpCircle className="text-[15px] text-primary" />
            <span>Help</span>
          </Link>

          <ThemeSwitcher size="small" />
        </div>
      </div>
    </header>
  );
};

export default OnboardingDesktopHeader;
