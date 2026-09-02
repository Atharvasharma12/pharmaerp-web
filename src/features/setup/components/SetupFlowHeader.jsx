// src/features/setup/components/SetupFlowHeader.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap 
} from "lucide-react";
import { 
  UIButton, 
  UIIconButton, 
  UIBadge, 
  UISwitch, 
  UITooltip 
} from "@/components/ui";

export default function SetupFlowHeader({
  title = "Setup Flow — Business Onboarding",
  subtitle = "Configure your core pharmacy business entities to activate full ERP operations.",
  completedCount = 0,
  totalCount = 2,
  progress = 0,
  isLiveMode = false,
  onToggleLiveMode,
  onRunDiagnostics,
  isRunningDiagnostics = false,
  onGoLive,
  canGoLive = false,
  nextStep = null,
}) {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:px-6 py-3.5 bg-surface border-b border-border transition-colors">
      {/* Left: Back Navigation & Flow Title */}
      <div className="flex items-center gap-3 min-w-0">
        <UITooltip content="Back to Dashboard">
          <UIIconButton
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to Dashboard"
            className="shrink-0 text-text-muted hover:text-text"
          >
            <ArrowLeft className="w-4 h-4" />
          </UIIconButton>
        </UITooltip>

        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold text-text tracking-tight truncate">
              {title}
            </h1>

            {canGoLive ? (
              <UIBadge variant="soft" color="success" className="font-semibold text-xs py-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                100% Ready — Go Live
              </UIBadge>
            ) : (
              <UIBadge variant="soft" color="primary" className="font-semibold text-xs py-0.5">
                <span className="font-mono tabular-nums">{completedCount}</span> of{" "}
                <span className="font-mono tabular-nums">{totalCount}</span> steps completed
              </UIBadge>
            )}
          </div>
          <p className="text-xs text-text-muted hidden md:block truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions Toolbar */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0 flex-wrap">
        {/* Diagnostics Button */}
        {onRunDiagnostics && (
          <UITooltip content="Verify workspace prerequisites and connection health">
            <UIButton
              variant="outline"
              size="sm"
              onClick={onRunDiagnostics}
              disabled={isRunningDiagnostics}
              startIcon={<Activity className={`w-3.5 h-3.5 ${isRunningDiagnostics ? "animate-spin text-primary" : "text-text-muted"}`} />}
              className="text-xs font-semibold h-8"
            >
              {isRunningDiagnostics ? "Checking..." : "Diagnostics"}
            </UIButton>
          </UITooltip>
        )}

        {/* Live Mode Toggle Switch */}
        {onToggleLiveMode && (
          <div className="hidden lg:flex items-center gap-2 pl-1 pr-2 py-1 rounded-md bg-surface-alt/70 border border-border/80">
            <UISwitch
              id="live-mode-toggle"
              checked={isLiveMode}
              onChange={onToggleLiveMode}
              size="sm"
            />
            <label
              htmlFor="live-mode-toggle"
              className="text-xs font-medium text-text cursor-pointer select-none flex items-center gap-1"
            >
              <Zap className={`w-3 h-3 ${isLiveMode ? "text-warning fill-warning" : "text-text-muted"}`} />
              Live
            </label>
          </div>
        )}

        {/* Primary CTA (Go Live or Continue) */}
        {canGoLive ? (
          <UIButton
            variant="primary"
            size="sm"
            onClick={onGoLive}
            startIcon={<Sparkles className="w-3.5 h-3.5" />}
            className="text-xs font-bold h-8 bg-success hover:bg-success/90 text-white shadow-sm"
          >
            Launch ERP
          </UIButton>
        ) : nextStep ? (
          <UIButton
            variant="primary"
            size="sm"
            onClick={nextStep.onClick}
            endIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-bold h-8 shadow-sm"
          >
            Continue Setup
          </UIButton>
        ) : null}
      </div>
    </header>
  );
}
