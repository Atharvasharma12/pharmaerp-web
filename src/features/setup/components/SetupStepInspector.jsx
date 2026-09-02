// src/features/setup/components/SetupStepInspector.jsx

import React, { useState } from "react";
import { 
  Building2, 
  Store, 
  CheckCircle2, 
  Lock, 
  ExternalLink, 
  Copy, 
  Check, 
  Info, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  X
} from "lucide-react";
import { 
  UIButton, 
  UIIconButton, 
  UIBadge, 
  UITooltip, 
  UIAlert 
} from "@/components/ui";

const stepDetailsMeta = {
  company: {
    category: "Business Entity",
    icon: <Building2 className="w-5 h-5" />,
    urlPath: "/companies/create",
    completedUrlPath: "/companies",
    helpTip: "Registers your legal business entity, tax registrations (GSTIN/PAN), and pharmaceutical drug licenses.",
    checklist: [
      { label: "Workspace initialized", done: true },
      { label: "Administrator privileges assigned", done: true },
      { label: "GSTIN & Drug License ready", done: false, note: "Required for invoicing" },
    ],
    calloutText: "Completing company creation unlocks branch management and establishes your default billing profile.",
  },
  branch: {
    category: "Store & Branch",
    icon: <Store className="w-5 h-5" />,
    urlPath: "/branches/create",
    completedUrlPath: "/branches",
    helpTip: "Sets up your first physical store or warehouse outlet to manage local stock and POS counters.",
    checklist: [
      { label: "Company profile created", done: false, checkKey: "company" },
      { label: "Store physical address & pincode", done: false },
      { label: "Default POS counter initialized", done: false },
    ],
    calloutText: "Branches inherit tax slabs and drug licenses from your primary company profile.",
  },
};

export default function SetupStepInspector({
  step = null,
  allSteps = [],
  onClose = null,
  onTestStep = null,
  isTesting = false,
}) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!step) {
    return (
      <aside className="w-full lg:w-[380px] p-6 bg-surface border-l border-border flex flex-col items-center justify-center text-center text-text-muted">
        <HelpCircle className="w-10 h-10 mb-2 opacity-40 text-primary" />
        <p className="text-sm font-medium text-text">Select a step</p>
        <p className="text-xs text-text-muted mt-1 max-w-[240px]">
          Click any step in the workflow to inspect its configuration and action items.
        </p>
      </aside>
    );
  }

  const meta = stepDetailsMeta[step.id] || {
    category: "Setup Step",
    icon: <Building2 className="w-5 h-5" />,
    urlPath: step.route || "#",
    completedUrlPath: step.completedRoute || step.route || "#",
    helpTip: step.description,
    checklist: [],
    calloutText: "Complete this step to proceed with the business setup.",
  };

  const currentRoute = step.completed ? meta.completedUrlPath : meta.urlPath;
  const fullUrl = `${window.location.origin}${currentRoute}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Resolve dynamic prerequisite check
  const resolvedChecklist = meta.checklist.map((item) => {
    if (item.checkKey) {
      const depStep = allSteps.find((s) => s.id === item.checkKey);
      return { ...item, done: Boolean(depStep?.completed) };
    }
    if (step.completed) {
      return { ...item, done: true };
    }
    return item;
  });

  return (
    <aside className="w-full lg:w-[380px] flex flex-col justify-between bg-surface border-l border-border h-full overflow-y-auto">
      {/* Step Header & Meta */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Title Bar with Icon and Close Button (Mobile/Drawer) */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              step.completed
                ? "bg-success-soft text-success"
                : step.locked
                  ? "bg-surface-alt text-text-muted"
                  : "bg-primary-soft text-primary"
            }`}>
              {meta.icon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  {meta.category}
                </span>
                {step.completed ? (
                  <UIBadge variant="soft" color="success" size="sm">Completed</UIBadge>
                ) : step.locked ? (
                  <UIBadge variant="soft" color="neutral" size="sm">Locked</UIBadge>
                ) : (
                  <UIBadge variant="soft" color="primary" size="sm">In Progress</UIBadge>
                )}
              </div>
              <h2 className="text-base font-bold text-text mt-0.5 leading-snug">
                {step.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <UITooltip content="Open direct route">
              <UIIconButton
                variant="ghost"
                size="sm"
                onClick={step.locked ? undefined : step.onClick}
                disabled={step.locked}
                aria-label="Open step"
                className="text-text-muted hover:text-text"
              >
                <ExternalLink className="w-4 h-4" />
              </UIIconButton>
            </UITooltip>

            {onClose && (
              <UIIconButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close inspector"
                className="lg:hidden text-text-muted"
              >
                <X className="w-4 h-4" />
              </UIIconButton>
            )}
          </div>
        </div>

        {/* Step Description */}
        <div className="text-xs text-text-muted leading-relaxed">
          {meta.helpTip}
        </div>

        {/* Route URL Box with Copy */}
        <div className="space-y-1.5">
          <label className="text-[11.5px] font-semibold text-text uppercase tracking-wide">
            {step.completed ? "Configured Resource URL:" : "Target Setup Route:"}
          </label>
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-alt border border-border">
            <span className="text-xs font-mono text-text truncate max-w-[240px]">
              {currentRoute}
            </span>
            <UITooltip content={copiedUrl ? "Copied!" : "Copy route path"}>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="p-1 rounded text-text-muted hover:text-text hover:bg-surface transition-colors"
                aria-label="Copy URL"
              >
                {copiedUrl ? (
                  <Check className="w-3.5 h-3.5 text-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </UITooltip>
          </div>
          <p className="text-[11px] text-text-muted">
            {step.completed
              ? "View and manage records for this entity."
              : "Direct link to submit required information."}
          </p>
        </div>

        {/* Requirements Checklist */}
        <div className="space-y-2">
          <label className="text-[11.5px] font-semibold text-text uppercase tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Prerequisites & Readiness
          </label>
          <div className="space-y-2 p-3 rounded-xl bg-surface-alt/50 border border-border">
            {resolvedChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs">
                <div className="mt-0.5 shrink-0">
                  {item.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-border-strong bg-surface" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-medium ${item.done ? "text-text line-through opacity-80" : "text-text"}`}>
                    {item.label}
                  </p>
                  {item.note && (
                    <p className="text-[10.5px] text-text-muted mt-0.5">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Callout */}
        <div className="p-3 rounded-xl bg-primary-soft/50 border border-primary/20 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            {meta.calloutText}
          </p>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-5 sm:p-6 border-t border-border bg-surface sticky bottom-0 space-y-2.5">
        <UIButton
          variant={step.completed ? "outline" : "primary"}
          size="lg"
          fullWidth
          disabled={step.locked}
          onClick={step.onClick}
          endIcon={step.completed ? <ExternalLink className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          className="font-bold text-sm shadow-sm"
        >
          {step.completed
            ? "View & Manage Records"
            : step.locked
              ? "Locked — Complete Previous Step"
              : step.actionText || "Open Setup Form"}
        </UIButton>

        {onTestStep && (
          <UIButton
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => onTestStep(step)}
            disabled={isTesting || step.locked}
            startIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
            className="text-xs text-text-muted hover:text-text"
          >
            {isTesting ? "Validating..." : "Test & Verify Step"}
          </UIButton>
        )}
      </div>
    </aside>
  );
}
