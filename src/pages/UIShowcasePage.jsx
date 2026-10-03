import React, { useState } from "react";
import {
  UIAlert,
  UIToastContainer,
  uiToast,
  UITooltip,
  UIDrawer,
  UIFileUpload,
  UIPageHeader,
  UISectionHeader,
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
  UIButton,
  UIIconButton,
  UIBadge,
  UIInput,
  UISelect,
} from "@/components/ui";
import {
  Sparkles,
  Layers,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  SlidersHorizontal,
  UploadCloud,
  FileText,
  FileCheck,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Download,
  Share2,
  Eye,
  Settings,
  HelpCircle,
  Building2,
  Calendar,
  CreditCard,
  Hash,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

/**
 * UIShowcasePage - Dedicated Showcase for Batch 8 Components (#36 to #40)
 *
 * Exclusively displays and tests:
 * 1. #36 `UIAlert` (Warning, error, info, success, purple banners with details)
 * 2. #37 `UIToast` & `uiToast` (Global toast notification system with countdown & promise toasts)
 * 3. #38 `UITooltip` (Contextual floating tooltips with hotkey shortcut badges)
 * 4. #39 `UIDrawer` (Slide-over side panel for fast forms and batch audits)
 * 5. #40 `UIFileUpload` (Drag-and-drop file upload zone with validation and file cards)
 */
export default function UIShowcasePage() {
  // #36 Alert States
  const [alertVariant, setAlertVariant] = useState("soft"); // "soft" | "accent" | "solid" | "outlined"

  // #38 Tooltip States
  const [tooltipPlacement, setTooltipPlacement] = useState("top");

  // #39 Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState("right");
  const [drawerSize, setDrawerSize] = useState("md");

  // #40 File Upload States
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: "sample-1",
      name: "COA_Certificate_Batch_BT9912.pdf",
      size: 1024 * 1024 * 2.4, // 2.4 MB
      type: "application/pdf",
    },
    {
      id: "sample-2",
      name: "GST_Invoice_Cipla_INV8891.pdf",
      size: 1024 * 720, // 720 KB
      type: "application/pdf",
    },
  ]);

  // Toast Promise Simulator
  const handleTriggerPromiseToast = () => {
    const fakeAsyncApi = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.2
          ? resolve({ invoiceId: "INV-2026-AUG-99" })
          : reject(new Error("Network timeout while contacting GST portal"));
      }, 2000);
    });

    uiToast.promise(fakeAsyncApi, {
      loading: {
        title: "Generating GST E-Way Bill...",
        description: "Validating HSN codes and calculating statutory tax breakdown",
      },
      success: {
        title: (res) => `E-Way Bill ${res.invoiceId} Generated!`,
        description: "Document signed and ready for transit dispatch",
      },
      error: {
        title: "E-Way Bill Generation Failed",
        description: (err) => err.message,
      },
    });
  };

  return (
    <div className="min-h-screen bg-surface-alt/20 text-text font-sans pb-24 selection:bg-primary selection:text-primary-contrast">
      {/* Global Toast Container */}
      <UIToastContainer position="bottom-right" />

      {/* Top Banner Header */}
      <div className="border-b border-border/80 bg-surface shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <UIPageHeader
            title="Batch 8 UI Primitives Showroom"
            subtitle="Interactive live preview of components #36 to #40 (Alert, Toast, Tooltip, Drawer, FileUpload)"
            badge={<UIBadge label="Batch #8 Primitives" color="primary" variant="solid" />}
            breadcrumbs={[
              { label: "Design System", href: "#" },
              { label: "Component Catalog", href: "#" },
              { label: "Batch 8 Components (#36 – #40)" },
            ]}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* ========================================================================= */}
        {/* COMPONENT 36: UIAlert (#36)                                               */}
        {/* ========================================================================= */}
        <section id="alert" className="space-y-4">
          <UISectionHeader
            title="#36 UIAlert"
            subtitle="System message banners for warnings, error callouts, success confirmations, and regulatory notices"
            badge={<UIBadge label="#36" color="primary" size="xs" />}
            actions={
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted font-medium">Style:</span>
                <div className="flex p-0.5 bg-surface-alt rounded-lg border border-border">
                  {["soft", "accent", "solid", "outlined"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAlertVariant(v)}
                      className={`px-2.5 py-1 rounded capitalize font-semibold text-xs cursor-pointer ${
                        alertVariant === v
                          ? "bg-surface text-primary shadow-2xs font-bold"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Warning Alert */}
            <UIAlert
              type="warning"
              variant={alertVariant}
              title="Schedule H1 Drug Compliance Reminder"
              description="Dispensing this formulation requires recording patient prescription number and prescribing doctor's registration code."
              dismissible
              action={
                <UIButton size="xs" variant="warning">
                  Open Dispenser Log
                </UIButton>
              }
            />

            {/* Error Alert with Details */}
            <UIAlert
              type="error"
              variant={alertVariant}
              title="Cold Chain Temperature Excursion Detected"
              description="Refrigerator Unit #3 recorded +11.8°C (allowed limit: 2°C to 8°C) for 42 minutes."
              details="Sensor IoT-3091: Alert threshold exceeded at 14:32:10 IST. 12 batches affected including Insulin Glargine."
              dismissible
              action={
                <UIButton size="xs" variant="danger">
                  Quarantine Batches
                </UIButton>
              }
            />

            {/* Success Alert */}
            <UIAlert
              type="success"
              variant={alertVariant}
              title="GST ITC Reconciliation Complete"
              description="Matched 148 purchase invoices against GSTR-2B. ₹ 4,82,900.00 eligible tax credit confirmed."
              dismissible
            />

            {/* Info / Purple Alert */}
            <UIAlert
              type="purple"
              variant={alertVariant}
              title="Automatic Pharmacopoeia Database Sync"
              description="Updated 45 new generic salt interactions from CDSCO Gazette notification."
              dismissible
            />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COMPONENT 37: UIToast (#37)                                               */}
        {/* ========================================================================= */}
        <section id="toast" className="space-y-4">
          <UISectionHeader
            title="#37 UIToast & uiToast Dispatcher"
            subtitle="Global notification toast system with animated progress countdowns and async promise support"
            badge={<UIBadge label="#37" color="primary" size="xs" />}
            actions={
              <UIButton
                size="sm"
                variant="outline"
                onClick={() => uiToast.clearAll()}
                startIcon={<RotateCcw className="size-3.5" />}
              >
                Clear All Toasts
              </UIButton>
            }
          />

          <UICard className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 1. Success Toast */}
              <div className="p-4 rounded-xl border border-success/30 bg-success/5 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-success flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    <span>Success Toast</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Triggers <code>uiToast.success()</code> with auto-dismiss timer.
                  </p>
                </div>
                <UIButton
                  size="sm"
                  variant="success"
                  onClick={() =>
                    uiToast.success(
                      "Stock Inward Verified",
                      "500 strips of Augmentin 625 added to Main Warehouse."
                    )
                  }
                >
                  Trigger Success
                </UIButton>
              </div>

              {/* 2. Error Toast */}
              <div className="p-4 rounded-xl border border-error/30 bg-error/5 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-error flex items-center gap-1.5">
                    <AlertCircle className="size-4" />
                    <span>Error Toast</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Displays critical error toast with persistent styling.
                  </p>
                </div>
                <UIButton
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    uiToast.error(
                      "Invoice Payment Failed",
                      "Bank gateway reported insufficient credit balance."
                    )
                  }
                >
                  Trigger Error
                </UIButton>
              </div>

              {/* 3. Warning Toast */}
              <div className="p-4 rounded-xl border border-warning/30 bg-warning/5 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-warning flex items-center gap-1.5">
                    <AlertTriangle className="size-4" />
                    <span>Warning Toast</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Alerts user of near-expiry inventory thresholds.
                  </p>
                </div>
                <UIButton
                  size="sm"
                  variant="warning"
                  onClick={() =>
                    uiToast.warning(
                      "Near Expiry Alert",
                      "Batch BT-8812 has only 28 days remaining."
                    )
                  }
                >
                  Trigger Warning
                </UIButton>
              </div>

              {/* 4. Info Toast */}
              <div className="p-4 rounded-xl border border-info/30 bg-info/5 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-info flex items-center gap-1.5">
                    <Info className="size-4" />
                    <span>Info Toast</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    General informational notification.
                  </p>
                </div>
                <UIButton
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    uiToast.info(
                      "Backup Completed",
                      "Nightly ledger snapshot saved to secure cloud."
                    )
                  }
                >
                  Trigger Info
                </UIButton>
              </div>

              {/* 5. Async Promise Toast */}
              <div className="p-4 rounded-xl border border-primary/30 bg-primary-soft/30 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="size-4" />
                    <span>Async Promise</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Simulates async API loading → auto success/error.
                  </p>
                </div>
                <UIButton
                  size="sm"
                  variant="primary"
                  onClick={handleTriggerPromiseToast}
                >
                  Simulate API Call
                </UIButton>
              </div>
            </div>
          </UICard>
        </section>

        {/* ========================================================================= */}
        {/* COMPONENT 38: UITooltip (#38)                                             */}
        {/* ========================================================================= */}
        <section id="tooltip" className="space-y-4">
          <UISectionHeader
            title="#38 UITooltip"
            subtitle="Lightweight floating micro-interaction tooltips with 4-way collision auto-flipping and hotkey badges"
            badge={<UIBadge label="#38" color="primary" size="xs" />}
            actions={
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted font-medium">Placement:</span>
                <div className="flex p-0.5 bg-surface-alt rounded-lg border border-border">
                  {["top", "bottom", "left", "right"].map((pl) => (
                    <button
                      key={pl}
                      type="button"
                      onClick={() => setTooltipPlacement(pl)}
                      className={`px-2.5 py-1 rounded capitalize font-semibold text-xs cursor-pointer ${
                        tooltipPlacement === pl
                          ? "bg-surface text-primary shadow-2xs font-bold"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      {pl}
                    </button>
                  ))}
                </div>
              </div>
            }
          />

          <UICard className="p-8">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <UITooltip
                content="Search medicines & batches"
                shortcut="⌘K"
                placement={tooltipPlacement}
              >
                <UIButton variant="outline" size="md">
                  Search Catalogs (⌘K)
                </UIButton>
              </UITooltip>

              <UITooltip
                content="Save current purchase invoice"
                shortcut="⌘S"
                placement={tooltipPlacement}
              >
                <UIButton variant="primary" size="md">
                  Save Invoice (⌘S)
                </UIButton>
              </UITooltip>

              <UITooltip
                content="Permanently delete selected record"
                shortcut="Del"
                placement={tooltipPlacement}
              >
                <UIIconButton
                  variant="ghost"
                  aria-label="Delete"
                  className="hover:text-error"
                >
                  <Trash2 className="size-4.5" />
                </UIIconButton>
              </UITooltip>

              <UITooltip
                content="Download GST Tax Invoice PDF"
                placement={tooltipPlacement}
              >
                <UIIconButton variant="outline" aria-label="Download Invoice">
                  <Download className="size-4.5" />
                </UIIconButton>
              </UITooltip>

              <UITooltip
                content="Drug Schedule H1: Dual-signature verification mandated by law"
                placement={tooltipPlacement}
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-alt border border-border text-xs font-semibold cursor-help">
                  <ShieldCheck className="size-4 text-purple-500" />
                  <span>Schedule H1 Rx</span>
                  <HelpCircle className="size-3.5 text-text-muted" />
                </div>
              </UITooltip>
            </div>
          </UICard>
        </section>

        {/* ========================================================================= */}
        {/* COMPONENT 39: UIDrawer (#39)                                              */}
        {/* ========================================================================= */}
        <section id="drawer" className="space-y-4">
          <UISectionHeader
            title="#39 UIDrawer (Slide-Over Sheet)"
            subtitle="Slide-over side panels for fast batch audits, detail inspections, and multi-field editing"
            badge={<UIBadge label="#39" color="primary" size="xs" />}
            actions={
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span>Position:</span>
                  <div className="flex p-0.5 bg-surface-alt rounded-lg border border-border">
                    {["right", "left", "bottom"].map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setDrawerPosition(pos)}
                        className={`px-2.5 py-1 rounded capitalize font-semibold text-xs cursor-pointer ${
                          drawerPosition === pos
                            ? "bg-surface text-primary shadow-2xs font-bold"
                            : "text-text-muted hover:text-text"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span>Size:</span>
                  <div className="flex p-0.5 bg-surface-alt rounded-lg border border-border">
                    {["sm", "md", "lg"].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setDrawerSize(sz)}
                        className={`px-2 py-0.5 rounded uppercase font-semibold text-[11px] cursor-pointer ${
                          drawerSize === sz
                            ? "bg-surface text-primary shadow-2xs font-bold"
                            : "text-text-muted hover:text-text"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            }
          />

          <UICard className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-alt/40 border border-border/80">
              <div className="space-y-1">
                <div className="text-sm sm:text-base font-bold text-text flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-primary" />
                  <span>Batch Inspection & QA Sign-off Drawer</span>
                </div>
                <p className="text-xs text-text-muted">
                  Test opening the slide-over sheet with realistic pharmacy audit inputs, scrollable body, and sticky actions.
                </p>
              </div>

              <UIButton
                variant="primary"
                size="md"
                onClick={() => setIsDrawerOpen(true)}
              >
                Open Audit Drawer
              </UIButton>
            </div>
          </UICard>

          {/* Actual UIDrawer Component */}
          <UIDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            position={drawerPosition}
            size={drawerSize}
            title="Batch QA Audit & Sign-off"
            description="Batch BT-2026-AUG-9912 (Augmentin 625 Duo)"
            badge={<UIBadge label="Inspection Pending" color="warning" size="xs" />}
            footer={
              <>
                <UIButton
                  variant="outline"
                  size="md"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Cancel
                </UIButton>
                <UIButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    uiToast.success("QA Audit Signed", "Batch approved for commercial distribution.");
                  }}
                >
                  Approve & Release Batch
                </UIButton>
              </>
            }
          >
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-surface-alt/70 border border-border/80 text-xs space-y-1">
                <div className="font-bold text-text">Sun Pharma Industries Ltd</div>
                <div className="text-text-muted font-mono">License: DL-20B/21B-4921 | Total Qty: 10,000 Strips</div>
              </div>

              <UIInput
                label="Physical Seal Verification"
                placeholder="Inspected By (Pharmacist Name)"
                defaultValue="Devansh Upadhyay (Reg: PH-89102)"
              />

              <UISelect
                label="Assay Purity Rating"
                defaultValue="pass"
                options={[
                  { value: "pass", label: "99.8% Purity (Pass USP Standard)" },
                  { value: "marginal", label: "96.5% Purity (Marginal Review)" },
                  { value: "fail", label: "Failed Assay (<95% Active Salt)" },
                ]}
              />

              <UIInput
                label="Disintegration Time (Minutes)"
                type="number"
                defaultValue={4.5}
                suffix="mins"
              />

              <UIInput
                label="Cold Chain Data Logger ID"
                placeholder="Logger Serial No."
                defaultValue="LOG-IOT-8812-OK"
                mono
              />
            </div>
          </UIDrawer>
        </section>

        {/* ========================================================================= */}
        {/* COMPONENT 40: UIFileUpload (#40)                                          */}
        {/* ========================================================================= */}
        <section id="file-upload" className="space-y-4">
          <UISectionHeader
            title="#40 UIFileUpload"
            subtitle="Drag-and-drop file upload zone and attachment manager for invoices, COA certificates, and prescription scans"
            badge={<UIBadge label="#40" color="primary" size="xs" />}
          />

          <UICard className="p-6">
            <UIFileUpload
              value={uploadedFiles}
              onChange={setUploadedFiles}
              accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
              maxSize={10}
              maxFiles={5}
              title="Upload Inward Invoices or COA Lab Reports"
              description="Drag and drop scanned PDF bills or images, or click to browse files from your computer"
            />
          </UICard>
        </section>
      </div>
    </div>
  );
}
