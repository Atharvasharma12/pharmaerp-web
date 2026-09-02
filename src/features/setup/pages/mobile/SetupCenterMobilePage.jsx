// src/features/setup/pages/mobile/SetupCenterMobilePage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Building2, 
  Store, 
  CheckCircle2, 
  Lock, 
  Plus, 
  Sparkles, 
  ArrowRight,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { 
  UIButton, 
  UIIconButton, 
  UIBadge, 
  UIDrawer 
} from "@/components/ui";
import { SetupStepInspector } from "../../components";

const stepIcons = {
  company: <Building2 className="w-5 h-5" />,
  branch: <Store className="w-5 h-5" />,
};

const SetupCenterMobilePage = ({
  mappedSetupSteps = [],
  selectedStep = null,
  onSelectStep = () => {},
  completedStepsCount = 0,
  progress = 0,
  nextStep = null,
  canGoLive = false,
  onGoLive = () => {},
  onTestStep = () => {},
  isTestingStep = false,
}) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const handleOpenInspector = (step) => {
    setActiveStep(step);
    onSelectStep(step);
    setDrawerOpen(true);
  };

  const remainingSteps = mappedSetupSteps.length - completedStepsCount;

  return (
    <section className="relative w-full min-h-[calc(100dvh-60px)] flex flex-col bg-bg text-text pb-16 overflow-x-hidden">
      {/* 1. Mobile App Top Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 p-3.5 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2.5 min-w-0">
          <UIIconButton
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to Dashboard"
            className="text-text-muted hover:text-text shrink-0 size-9"
          >
            <ArrowLeft className="w-4 h-4" />
          </UIIconButton>

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-text truncate">
              Setup Center
            </h1>
            <p className="text-[11px] font-mono text-text-muted">
              {completedStepsCount}/{mappedSetupSteps.length} Steps Done ({progress}%)
            </p>
          </div>
        </div>

        <div>
          {canGoLive ? (
            <UIButton
              size="sm"
              variant="primary"
              onClick={onGoLive}
              startIcon={<Sparkles className="w-3.5 h-3.5" />}
              className="text-xs font-bold h-8 bg-success hover:bg-success/90 text-white shadow-xs px-2.5"
            >
              Go Live
            </UIButton>
          ) : nextStep ? (
            <UIButton
              size="sm"
              variant="primary"
              onClick={nextStep.onClick}
              endIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs font-bold h-8 shadow-xs px-2.5"
            >
              Continue
            </UIButton>
          ) : null}
        </div>
      </header>

      {/* 2. Stepped Flow Canvas Container */}
      <div className="relative flex-1 p-4 sm:p-6 flex flex-col items-center">
        {/* Subtle Dot Grid Canvas Backdrop */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, var(--app-color-border-strong) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Top Progress Capsule */}
        <div className="relative z-10 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 text-[11.5px] font-bold tracking-tight shadow-sm">
            {canGoLive ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-success" />
                All steps completed — Ready to launch
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Complete {remainingSteps} {remainingSteps === 1 ? "step" : "steps"} to activate
              </>
            )}
          </span>
        </div>

        {/* Vertical Stepped Flow Cards */}
        <div className="relative z-10 w-full max-w-[420px] space-y-0">
          {mappedSetupSteps.map((step, index) => {
            const isLast = index === mappedSetupSteps.length - 1;
            const Icon = stepIcons[step.id] || <Building2 className="w-5 h-5" />;

            return (
              <React.Fragment key={step.id}>
                {/* Step Card */}
                <div
                  onClick={() => handleOpenInspector(step)}
                  className={`w-full p-4 rounded-2xl bg-surface border transition-all duration-150 active:scale-[0.98] shadow-xs cursor-pointer ${
                    step.completed
                      ? "border-border hover:border-success/50"
                      : step.locked
                        ? "border-border/60 opacity-75"
                        : "border-primary/50 ring-1 ring-primary/20 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        step.completed
                          ? "bg-success-soft text-success"
                          : step.locked
                            ? "bg-surface-alt text-text-muted"
                            : "bg-primary-soft text-primary"
                      }`}>
                        {Icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-bold text-text truncate">
                            {step.title}
                          </h2>
                        </div>
                        <p className="text-[11.5px] text-text-muted truncate mt-0.5">
                          {step.id === "company" ? "Business Profile & Registration" : "Store & Pharmacy Location"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {step.completed ? (
                        <UIBadge variant="soft" color="success" size="sm">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Done
                        </UIBadge>
                      ) : step.locked ? (
                        <UIBadge variant="soft" color="neutral" size="sm">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </UIBadge>
                      ) : (
                        <UIBadge variant="soft" color="primary" size="sm">
                          Active
                        </UIBadge>
                      )}
                      <ChevronRight className="w-4 h-4 text-text-muted" />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-text-muted">
                      Prerequisites: {step.locked ? "Complete Step 1" : "Ready"}
                    </span>

                    <UIButton
                      size="sm"
                      variant={step.completed ? "outline" : "primary"}
                      disabled={step.locked}
                      onClick={(e) => {
                        e.stopPropagation();
                        step.onClick();
                      }}
                      className="text-xs font-semibold h-7 px-3"
                    >
                      {step.completed ? "Manage" : step.actionText || "Start"}
                    </UIButton>
                  </div>
                </div>

                {/* Stepped Connector */}
                <div className="flex flex-col items-center my-1.5">
                  <div className={`w-0.5 h-5 ${step.completed ? "bg-primary" : "bg-border-strong border-dashed"}`} />
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold z-10 ${
                    step.completed 
                      ? "bg-primary text-white border-primary" 
                      : "bg-surface text-text-muted border-border"
                  }`}>
                    <Plus className="w-2.5 h-2.5" />
                  </div>
                  <div className={`w-0.5 h-5 ${step.completed ? "bg-primary" : "bg-border-strong border-dashed"}`} />
                </div>
              </React.Fragment>
            );
          })}

          {/* Go Live Terminal Node */}
          <div
            onClick={canGoLive ? onGoLive : undefined}
            className={`w-full p-3.5 rounded-2xl border text-center transition-all duration-150 flex items-center justify-center gap-2 ${
              canGoLive
                ? "bg-success text-white border-success shadow-md cursor-pointer active:scale-95 font-bold text-xs"
                : "bg-surface-alt text-text-muted border-border cursor-default font-semibold text-xs"
            }`}
          >
            {canGoLive ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Go Live — Launch ERP Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-text-muted/40" />
                <span>Go Live Milestone</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Slide-up Inspector Bottom Sheet */}
      <UIDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="bottom"
        size="lg"
        className="max-h-[85vh] p-0"
      >
        <div className="h-full flex flex-col">
          <SetupStepInspector
            step={activeStep || selectedStep}
            allSteps={mappedSetupSteps}
            onClose={() => setDrawerOpen(false)}
            onTestStep={onTestStep}
            isTesting={isTestingStep}
          />
        </div>
      </UIDrawer>
    </section>
  );
};

export default SetupCenterMobilePage;
