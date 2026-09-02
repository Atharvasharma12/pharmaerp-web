// src/features/setup/components/SetupFlowCanvas.jsx

import React, { useState } from "react";
import { 
  Building2, 
  Store, 
  CheckCircle2, 
  Lock, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw,
  Hand, 
  MousePointer2,
  Sparkles,
  Info,
  ArrowRight
} from "lucide-react";
import { 
  UIButton, 
  UIIconButton, 
  UIBadge, 
  UITooltip 
} from "@/components/ui";

const stepIcons = {
  company: <Building2 className="w-5 h-5" />,
  branch: <Store className="w-5 h-5" />,
};

export default function SetupFlowCanvas({
  steps = [],
  selectedStep = null,
  onSelectStep = () => {},
  completedStepsCount = 0,
  progress = 0,
  canGoLive = false,
  onGoLive = () => {},
}) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTool, setActiveTool] = useState("select"); // 'select' | 'pan'
  const [expandedNodes, setExpandedNodes] = useState({
    company: true,
    branch: true,
  });

  const toggleExpand = (stepId, e) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 10, 140));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 10, 70));
  const handleResetZoom = () => setZoomLevel(100);

  const remainingSteps = steps.length - completedStepsCount;

  return (
    <div className="relative flex-1 flex flex-col items-center justify-between min-h-[560px] lg:min-h-[640px] p-4 sm:p-8 bg-bg overflow-hidden select-none">
      {/* Subtle Dot Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, var(--app-color-border-strong) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main Stepped Node Hierarchy Container */}
      <div 
        className="relative z-10 my-auto flex flex-col items-center w-full max-w-[540px] transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        {/* Top Floating Badge Pill */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 text-xs font-bold tracking-tight shadow-md">
            {canGoLive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                All {steps.length} steps completed
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Complete {remainingSteps} {remainingSteps === 1 ? "step" : "steps"} to activate
              </>
            )}
          </span>
        </div>

        {/* Stepped Nodes Sequence */}
        {steps.map((step, index) => {
          const isSelected = selectedStep?.id === step.id;
          const isLast = index === steps.length - 1;
          const isExpanded = expandedNodes[step.id] ?? true;
          const Icon = stepIcons[step.id] || <Building2 className="w-5 h-5" />;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node Card */}
              <div
                onClick={() => onSelectStep(step)}
                className={`w-full rounded-2xl bg-surface border transition-all duration-200 cursor-pointer shadow-sm relative ${
                  isSelected
                    ? "ring-2 ring-primary border-primary shadow-md"
                    : "border-border hover:border-border-strong hover:shadow"
                } ${step.locked ? "opacity-75" : ""}`}
              >
                {/* Node Top Row */}
                <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Step Icon Badge */}
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
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-text truncate">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs text-text-muted truncate mt-0.5">
                        {step.id === "company" ? "Business Profile & Registration" : "Store & Pharmacy Location"}
                      </p>
                    </div>
                  </div>

                  {/* Right Status & Expand Toggle */}
                  <div className="flex items-center gap-2 shrink-0">
                    {step.completed ? (
                      <UIBadge variant="soft" color="success" size="sm">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Completed
                      </UIBadge>
                    ) : step.locked ? (
                      <UIBadge variant="soft" color="neutral" size="sm">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </UIBadge>
                    ) : (
                      <UIBadge variant="soft" color="primary" size="sm">
                        In Progress
                      </UIBadge>
                    )}

                    <button
                      type="button"
                      onClick={(e) => toggleExpand(step.id, e)}
                      className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Node Expanded Details */}
                {isExpanded && (
                  <div className="px-4.5 pb-4 pt-1 border-t border-border/60 bg-surface-alt/25 rounded-b-2xl">
                    <p className="text-xs text-text-muted leading-relaxed">
                      {step.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3 pt-2">
                      <span className="text-[11px] font-mono text-text-muted">
                        Route: <span className="font-semibold text-text">{step.route}</span>
                      </span>

                      <UIButton
                        size="sm"
                        variant={step.completed ? "outline" : "primary"}
                        disabled={step.locked}
                        onClick={(e) => {
                          e.stopPropagation();
                          step.onClick();
                        }}
                        className="text-xs font-semibold h-7 px-2.5"
                      >
                        {step.completed ? "Manage" : step.actionText || "Start"}
                      </UIButton>
                    </div>
                  </div>
                )}
              </div>

              {/* Stepped Vertical Connector Line with Inline '+' */}
              <div className="relative flex flex-col items-center my-2">
                <div className={`w-0.5 h-8 ${
                  step.completed ? "bg-primary" : "bg-border-strong border-dashed"
                }`} />

                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold my-[-4px] z-10 ${
                  step.completed 
                    ? "bg-primary text-white border-primary shadow-xs" 
                    : "bg-surface text-text-muted border-border"
                }`}>
                  <Plus className="w-3 h-3" />
                </div>

                <div className={`w-0.5 h-8 ${
                  step.completed ? "bg-primary" : "bg-border-strong border-dashed"
                }`} />
              </div>
            </React.Fragment>
          );
        })}

        {/* Terminal Go Live Milestone Badge */}
        <div 
          onClick={canGoLive ? onGoLive : undefined}
          className={`px-6 py-2.5 rounded-full border text-xs font-bold tracking-tight transition-all duration-200 flex items-center gap-2 shadow-sm ${
            canGoLive
              ? "bg-success text-white border-success hover:bg-success/90 cursor-pointer shadow-md hover:scale-105"
              : "bg-surface-alt text-text-muted border-border cursor-default"
          }`}
        >
          {canGoLive ? (
            <>
              <Sparkles className="w-4 h-4 animate-bounce" />
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

      {/* Floating Canvas Navigation & Zoom Controls (Bottom) */}
      <div className="w-full flex items-center justify-between gap-4 mt-6 z-20">
        {/* Left: Interaction Tool Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface/90 backdrop-blur-sm border border-border shadow-xs">
          <UITooltip content="Select Mode">
            <button
              type="button"
              onClick={() => setActiveTool("select")}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTool === "select"
                  ? "bg-primary-soft text-primary font-bold"
                  : "text-text-muted hover:text-text"
              }`}
              aria-label="Select mode"
            >
              <MousePointer2 className="w-4 h-4" />
            </button>
          </UITooltip>

          <UITooltip content="Pan Canvas">
            <button
              type="button"
              onClick={() => setActiveTool("pan")}
              className={`p-1.5 rounded-lg transition-colors ${
                activeTool === "pan"
                  ? "bg-primary-soft text-primary font-bold"
                  : "text-text-muted hover:text-text"
              }`}
              aria-label="Pan canvas"
            >
              <Hand className="w-4 h-4" />
            </button>
          </UITooltip>
        </div>

        {/* Right: Zoom & Reset Controls */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface/90 backdrop-blur-sm border border-border shadow-xs">
          <UITooltip content="Reset View">
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </UITooltip>

          <UITooltip content="Zoom Out">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </UITooltip>

          <span className="text-[11px] font-mono font-semibold text-text px-1.5 min-w-[40px] text-center">
            {zoomLevel}%
          </span>

          <UITooltip content="Zoom In">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </UITooltip>

          <UITooltip content="Fit to Screen">
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-text-muted hover:text-text transition-colors"
              aria-label="Fit to screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </UITooltip>
        </div>
      </div>
    </div>
  );
}
