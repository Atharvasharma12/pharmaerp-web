// src/features/workspace-products/pages/desktop/CreateWorkspaceProductDesktopPage.jsx

import { memo } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiAlertTriangle,
  FiCheck,
  FiCheckCircle,
  FiEdit3,
  FiGrid,
  FiInfo,
  FiPlus,
  FiRefreshCw,
  FiLayers,
} from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi2";
import { BiCategory } from "react-icons/bi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
} from "@/components";

const productTypeOptions = [
  { label: "Medicine", value: "medicine" },
  { label: "OTC (Over The Counter)", value: "otc" },
];

const CreateWorkspaceProductDesktopPage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
    currentStep = 1,
    duplicateWarning = null,

    handleChange,
    handleSubmit,
    handleBack,
    handleContinue,
    handleStepChange,
    handleCancel,
    handleResetAndRefresh,
    handleBypassWarning,
  }) => {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <PageHeader
            title="Create Custom Product"
            subtitle={
              currentStep === 5
                ? "Review custom item properties before deploying to workspace stock rosters."
                : "Add local inventory parameters when a central master entry is unavailable."
            }
            extra={
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Custom Products", onClick: handleCancel },
                  { label: "Create Product", current: true },
                ]}
                sx={breadcrumbSx}
                itemSx={breadcrumbItemSx}
                currentItemSx={breadcrumbCurrentSx}
              />
            }
            actions={
              <AppStack
                direction="row"
                align="center"
                justify="flex-end"
                gap={1}
                sx={{ flexShrink: 0 }}
              >
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  startIcon={<FiArrowLeft />}
                  onClick={handleCancel}
                  sx={secondaryButtonSx}
                >
                  Back
                </AppButton>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  startIcon={<FiRefreshCw />}
                  onClick={handleResetAndRefresh}
                  loading={isLoading}
                  disabled={isLoading}
                  sx={secondaryButtonSx}
                >
                  Refresh
                </AppButton>
              </AppStack>
            }
            align="flex-start"
            justify="space-between"
            sx={pageHeaderSx}
            contentSx={pageHeaderContentSx}
          />

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_330px] items-start gap-5">
            <AppBox sx={{ minWidth: 0 }}>
              <TopStepper
                currentStep={currentStep}
                onStepChange={handleStepChange}
              />

              {formErrors.submit ? (
                <AppAlert
                  severity="error"
                  variant="soft"
                  rounded="md"
                  sx={alertSx}
                >
                  {formErrors.submit}
                </AppAlert>
              ) : null}

              <AppBox
                component="form"
                onSubmit={(e) => e.preventDefault()}
                sx={{ mt: 3.5 }}
              >
                {currentStep === 1 && (
                  <IdentityForm
                    formData={formData}
                    formErrors={formErrors}
                    duplicateWarning={duplicateWarning}
                    isLoading={isLoading}
                    handleChange={handleChange}
                    handleCancel={handleCancel}
                    handleContinue={handleContinue}
                    handleBypassWarning={handleBypassWarning}
                  />
                )}

                {currentStep === 2 && (
                  <PackagingForm
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 3 && (
                  <TaxForm
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 4 && (
                  <NotesForm
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 5 && (
                  <ReviewStep
                    formData={formData}
                    isCreating={isLoading}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    onEditSection={handleStepChange}
                  />
                )}
              </AppBox>
            </AppBox>

            <RightSidebarPanel currentStep={currentStep} formData={formData} />
          </div>
        </div>
      </section>
    );
  },
);

CreateWorkspaceProductDesktopPage.displayName =
  "CreateWorkspaceProductDesktopPage";

/* ==========================================================================
    TOP STEP PROGRESS TRACKER
   ========================================================================== */

const TopStepper = memo(({ currentStep, onStepChange }) => {
  const steps = [
    { id: 1, title: "Product Identity", label: "Typology & Identity Guard" },
    { id: 2, title: "Packaging Metrics", label: "Simple stock descriptions" },
    { id: 3, title: "Tax Reference", label: "Statutory parameters" },
    { id: 4, title: "Operational Notes", label: "Custom system fields" },
    { id: 5, title: "Review & Deploy", label: "Final commit audit" },
  ];

  return (
    <AppCard
      variant="default"
      rounded="lg"
      bordered={false}
      shadow="none"
      padding="none"
      sx={stepperCardSx}
    >
      <div className="relative w-full after:pointer-events-none after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-8 after:bg-gradient-to-l after:from-surface after:to-transparent">
        <div className="flex items-center justify-between px-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((step, idx) => {
            const active = currentStep === step.id;
            const completed = currentStep > step.id;

            return (
              <div
                key={step.id}
                className="flex flex-1 items-center last:flex-none"
              >
                <button
                  type="button"
                  onClick={() => onStepChange?.(step.id)}
                  className="flex shrink-0 items-center gap-1.5 text-left transition outline-none"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      completed
                        ? "bg-primary-soft text-primary"
                        : active
                          ? "bg-primary text-text-inverse"
                          : "border border-border bg-surface-alt text-text-muted"
                    }`}
                  >
                    {completed ? <FiCheck className="text-[13px]" /> : step.id}
                  </span>

                  <span className="min-w-0 pr-1.5">
                    <span
                      className={`block text-[11.5px] font-bold ${active || completed ? "text-text" : "text-text-muted"}`}
                    >
                      {step.title}
                    </span>
                    <span className="block text-[10.5px] text-text-muted whitespace-nowrap">
                      {step.label}
                    </span>
                  </span>
                </button>

                {idx < steps.length - 1 && (
                  <div className="mx-2 h-px min-w-[16px] flex-1 bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppCard>
  );
});
TopStepper.displayName = "TopStepper";

/* ==========================================================================
    ACTIVE STEP WIZARD FORM MODULES
   ========================================================================== */

const IdentityForm = ({
  formData,
  formErrors,
  duplicateWarning,
  isLoading,
  handleChange,
  handleCancel,
  handleContinue,
  handleBypassWarning,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={formMainCardSx}
  >
    <div className="border-b border-border pb-3">
      <AppHeading level={2} weight={700} sx={sectionTitleSx}>
        Product Identity
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Define the custom catalog item profile. System automated checks screen
        the master list to block duplicates.
      </AppText>
    </div>

    {duplicateWarning && (
      <AppCard
        variant="default"
        rounded="md"
        bordered={false}
        shadow="none"
        padding="none"
        sx={warningPanelSx}
      >
        <AppStack direction="row" align="flex-start" gap={1.5}>
          <FiAlertTriangle className="text-[20px] text-warning shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <AppHeading
              level={4}
              weight={750}
              sx={{ m: 0, fontSize: "13px", color: "var(--app-color-warning)" }}
            >
              Central Catalog Match Detected
            </AppHeading>
            <AppText
              variant="body2"
              sx={{
                mt: 0.5,
                fontSize: "12px",
                lineHeight: "1.6",
                color: "var(--app-color-text)",
              }}
            >
              {duplicateWarning.message}
            </AppText>

            <div className="mt-3 flex gap-2">
              <AppButton
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                onClick={handleBypassWarning}
                sx={{ height: 28, fontSize: "11px", fontWeight: 700 }}
              >
                Bypass & Create Custom Item
              </AppButton>
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                onClick={handleCancel}
                sx={{
                  height: 28,
                  fontSize: "11px",
                  fontWeight: 650,
                  bgcolor: "var(--app-color-surface)",
                }}
              >
                Cancel & Use Master
              </AppButton>
            </div>
          </div>
        </AppStack>
      </AppCard>
    )}

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Product Core Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        placeholder="e.g. Paracetamol Local Brand Mix"
        required
        disabled={Boolean(duplicateWarning)}
        error={Boolean(formErrors.name)}
        helperText={formErrors.name}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppSelect
        label="Product Typology Classification"
        name="productType"
        value={formData.productType || "medicine"}
        onChange={handleChange}
        options={productTypeOptions}
        required
        disabled={Boolean(duplicateWarning)}
        error={Boolean(formErrors.productType)}
        helperText={formErrors.productType}
        labelSx={labelSx}
        inputSx={inputSx}
      />
    </div>

    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        onClick={handleCancel}
        sx={secondaryActionBtnSx}
      >
        Cancel
      </AppButton>
      {!duplicateWarning && (
        <AppButton
          variant="contained"
          colorVariant="primary"
          rounded="md"
          size="small"
          endIcon={<FiArrowRight />}
          onClick={handleContinue}
          loading={isLoading}
          disabled={isLoading}
          sx={primaryActionBtnSx}
        >
          Check Catalog & Continue
        </AppButton>
      )}
    </div>
  </AppCard>
);

const PackagingForm = ({
  formData,
  formErrors,
  handleChange,
  handleBack,
  handleContinue,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={formMainCardSx}
  >
    <div className="border-b border-border pb-3">
      <AppHeading level={2} weight={700} sx={sectionTitleSx}>
        Packaging Metrics
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Configure fundamental structural dimensions and brand markers required
        for downstream tracking setup layers.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Manufacturer / Marketer Name (Optional)"
        name="manufacturer"
        value={formData.manufacturer || ""}
        onChange={handleChange}
        placeholder="Enter manufacturer brand path"
        error={Boolean(formErrors.manufacturer)}
        helperText={formErrors.manufacturer}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Pack Configuration (Optional)"
        name="pack"
        value={formData.pack || ""}
        onChange={handleChange}
        placeholder="e.g. 10 Tablets / 1 Bottle"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Quantity / Measure Strength (Optional)"
        name="qty"
        value={formData.qty || ""}
        onChange={handleChange}
        placeholder="e.g. 650 mg / 500 ml"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Dosage Form Unit (Optional)"
        name="productForm"
        value={formData.productForm || ""}
        onChange={handleChange}
        placeholder="e.g. Tablet, Capsule, Syrup"
        labelSx={labelSx}
        inputSx={inputSx}
      />
    </div>

    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiArrowLeft />}
        onClick={handleBack}
        sx={secondaryActionBtnSx}
      >
        Back
      </AppButton>
      <AppButton
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        endIcon={<FiArrowRight />}
        onClick={handleContinue}
        sx={primaryActionBtnSx}
      >
        Save & Continue
      </AppButton>
    </div>
  </AppCard>
);

const TaxForm = ({ formData, handleChange, handleBack, handleContinue }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={formMainCardSx}
  >
    <div className="border-b border-border pb-3">
      <AppHeading level={2} weight={700} sx={sectionTitleSx}>
        Statutory Parameters
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Link the statutory identification key reference. Never hardcode inline
        parameters; rely strictly on the system relational database.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-1">
      <AppInput
        label="HsnMaster Object ID Reference (Optional)"
        name="HsnMaster"
        value={formData.HsnMaster || ""}
        onChange={handleChange}
        placeholder="Enter valid 24-character hex MongoDB ID string"
        labelSx={labelSx}
        inputSx={inputSx}
      />
    </div>

    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiArrowLeft />}
        onClick={handleBack}
        sx={secondaryActionBtnSx}
      >
        Back
      </AppButton>
      <AppButton
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        endIcon={<FiArrowRight />}
        onClick={handleContinue}
        sx={primaryActionBtnSx}
      >
        Save & Continue
      </AppButton>
    </div>
  </AppCard>
);

const NotesForm = ({
  formData,
  formErrors,
  handleChange,
  handleBack,
  handleContinue,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={formMainCardSx}
  >
    <div className="border-b border-border pb-3">
      <AppHeading level={2} weight={700} sx={sectionTitleSx}>
        Operational Notes
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Provide basic descriptive details or workspace comments. Regulatory
        descriptions, safety criteria, or descriptive fields are strictly
        excluded.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-1">
      <AppInput
        label="Workspace System Notes (Optional)"
        name="notes"
        value={formData.notes || ""}
        onChange={handleChange}
        placeholder="Enter custom comments or workspace remarks here..."
        error={Boolean(formErrors.notes)}
        helperText={formErrors.notes}
        multiline
        rows={4}
        labelSx={labelSx}
        inputSx={inputSx}
      />
    </div>

    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiArrowLeft />}
        onClick={handleBack}
        sx={secondaryActionBtnSx}
      >
        Back
      </AppButton>
      <AppButton
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        endIcon={<FiArrowRight />}
        onClick={handleContinue}
        sx={primaryActionBtnSx}
      >
        Continue to Review
      </AppButton>
    </div>
  </AppCard>
);

/* ==========================================================================
    FINAL REVIEW STEP
   ========================================================================== */

const ReviewStep = ({
  formData,
  isCreating,
  onBack,
  onSubmit,
  onEditSection,
}) => (
  <div className="space-y-4">
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={reviewCardSx}
    >
      <ReviewSectionHeader
        title="Core Identity Parameters"
        stepId={1}
        onEdit={onEditSection}
      />
      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4 min-w-[320px]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-primary-soft text-primary text-[24px]">
            <HiOutlineCube />
          </div>
          <div className="min-w-0">
            <AppStack direction="row" align="center" gap={1}>
              <AppHeading level={3} weight={700} sx={reviewCompNameSx}>
                {formData.name || "Untitled Custom Product"}
              </AppHeading>
              <AppTag
                label={formData.productType === "medicine" ? "Medicine" : "OTC"}
                variant="soft"
                colorVariant="purple"
                rounded="md"
                sx={smallReviewTagSx}
              />
            </AppStack>
            {formData.force && (
              <AppTag
                label="Bypassed Duplicate Check"
                variant="soft"
                colorVariant="warning"
                rounded="md"
                sx={{ height: 16, fontSize: "9px", mt: 0.6 }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-1 grid grid-cols-2 gap-x-4 gap-y-2.5 max-w-[480px]">
          <ReviewItem
            label="Item Typology"
            value={<span className="capitalize">{formData.productType}</span>}
          />
          <ReviewItem
            label="Operational Status"
            value={<span className="capitalize">{formData.status}</span>}
          />
        </div>
      </div>
    </AppCard>

    <div className="grid grid-cols-2 gap-4">
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="sm"
        padding="none"
        sx={reviewCardSx}
      >
        <ReviewSectionHeader
          title="Packaging Metrics"
          stepId={2}
          onEdit={onEditSection}
        />
        <div className="mt-4 space-y-2">
          <ReviewRowData
            label="Manufacturer Marketer"
            value={formData.manufacturer || "-"}
          />
          <ReviewRowData label="Pack Form" value={formData.pack || "-"} />
          <ReviewRowData label="Measure Strength" value={formData.qty || "-"} />
          <ReviewRowData
            label="Dosage Unit Form"
            value={formData.productForm || "-"}
          />
        </div>
      </AppCard>

      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="sm"
        padding="none"
        sx={reviewCardSx}
      >
        <ReviewSectionHeader
          title="Statutory Specifications"
          stepId={3}
          onEdit={onEditSection}
        />
        <div className="mt-4 space-y-2">
          <ReviewRowData
            label="HsnMaster ID Link"
            value={formData.HsnMaster || "Not linked"}
          />
        </div>
      </AppCard>
    </div>

    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={reviewCardSx}
    >
      <ReviewSectionHeader
        title="Workspace Notes"
        stepId={4}
        onEdit={onEditSection}
      />
      <div className="mt-3 text-[12px] leading-relaxed text-text">
        {formData.notes || (
          <span className="text-text-muted italic">
            No operational custom comments added.
          </span>
        )}
      </div>
    </AppCard>

    <div className="mt-6 flex items-center justify-between border-t border-border bg-surface rounded-xl border p-3 shadow-xs">
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiArrowLeft />}
        onClick={onBack}
        disabled={isCreating}
        sx={secondaryActionBtnSx}
      >
        Back
      </AppButton>
      <AppButton
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiCheckCircle />}
        onClick={onSubmit}
        loading={isCreating}
        disabled={isCreating}
        sx={primaryActionBtnSx}
      >
        Create Product Entry
      </AppButton>
    </div>
  </div>
);

const ReviewSectionHeader = ({ title, stepId, onEdit }) => (
  <div className="flex items-center justify-between border-b border-border pb-2.5">
    <AppHeading
      level={4}
      weight={700}
      sx={{ m: 0, fontSize: "13.5px", color: "var(--app-color-text)" }}
    >
      {title}
    </AppHeading>
    <AppButton
      variant="outlined"
      colorVariant="neutral"
      rounded="md"
      size="small"
      startIcon={<FiEdit3 />}
      onClick={() => onEdit(stepId)}
      sx={{
        height: 28,
        px: 1,
        fontSize: "11px",
        fontWeight: 650,
        bg: "var(--app-color-surface-alt)",
      }}
    >
      Edit
    </AppButton>
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div>
    <span className="block text-[11px] text-text-muted font-semibold">
      {label}
    </span>
    <span className="block mt-0.5 text-[12px] font-medium text-text">
      {value}
    </span>
  </div>
);

const ReviewRowData = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 text-[12px]">
    <span className="text-text-muted font-medium whitespace-nowrap">
      {label}
    </span>
    <div className="text-right font-bold text-text max-w-[280px] truncate">
      {value}
    </div>
  </div>
);

/* ==========================================================================
    RIGHT PANEL ASSISTANT COMPONENT
   ========================================================================== */

const RightSidebarPanel = memo(({ currentStep }) => {
  const stepsMeta = [
    {
      id: 1,
      title: "Identity Guard",
      text: "Name parameters and duplicate screening configurations",
    },
    {
      id: 2,
      title: "Packaging Data",
      text: "Physical metrics and manufacturer brand maps",
    },
    {
      id: 3,
      title: "Tax Reference",
      text: "HSN master key data structural link",
    },
    {
      id: 4,
      title: "System Notes",
      text: "Simple custom operational workspace remarks",
    },
    {
      id: 5,
      title: "Review Deploy",
      text: "Commit validation and compilation checks",
    },
  ];

  const cards = [
    {
      title: "Wizard Step Matrix",
      icon: <FiLayers />,
      colorVariant: "primary",
      variant: "default",
      custom: (
        <div className="mt-4 space-y-3.5">
          {stepsMeta.map((s) => {
            const active = currentStep === s.id;
            const completed = currentStep > s.id;
            return (
              <AppStack key={s.id} direction="row" align="flex-start" gap={1.2}>
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                    completed
                      ? "bg-success text-text-inverse"
                      : active
                        ? "bg-primary text-text-inverse"
                        : "border border-border text-text-muted"
                  }`}
                >
                  {completed ? <FiCheck className="text-[10px]" /> : s.id}
                </span>
                <div>
                  <span
                    className={`block text-[12px] font-bold leading-none ${active ? "text-primary" : completed ? "text-text" : "text-text-muted"}`}
                  >
                    {s.title}
                  </span>
                  <span className="block mt-1 text-[10.5px] leading-tight text-text-muted">
                    {s.text}
                  </span>
                </div>
              </AppStack>
            );
          })}
        </div>
      ),
    },
    {
      title: "Architectural Guidelines",
      icon: <FiInfo />,
      colorVariant: "success",
      variant: "default",
      description:
        "Custom products exist only when a master entry cannot be found. Pricing and quantities belong strictly to Batch and Inventory.",
      points: [
        "Enforces local uniqueness maps",
        "Tightly binds relational tax records",
        "Blocks redundant catalog copies",
        "Maintains clean downstream decoupling",
      ],
      pointIcon: <FiCheckCircle />,
    },
    HELP_SUPPORT_CARD,
  ];

  return <PageRightSidebar spacing={4} cards={cards} />;
});
RightSidebarPanel.displayName = "RightSidebarPanel";

/* ==========================================================================
    STYLE THEME STRINGS (SX DICTIONARY TOKENS)
   ========================================================================== */

const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "25px",
    lineHeight: 1.15,
    letterSpacing: "-0.45px",
    color: "var(--app-color-text)",
  },
};

const breadcrumbSx = { mt: 1 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const stepperCardSx = {
  px: 2,
  py: 2,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  borderRadius: "12px",
};
const formMainCardSx = {
  p: 2.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "15px",
  lineHeight: 1.3,
  color: "var(--app-color-text)",
};
const sectionSubtitleSx = {
  mt: 0.7,
  fontSize: "12.5px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const warningPanelSx = {
  p: 2,
  mb: 4,
  bgcolor: "var(--app-color-warning-soft)",
  border: "1px solid var(--app-color-warning)",
  borderRadius: "8px",
};

const labelSx = {
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};
const inputSx = {
  minHeight: 38,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface-alt)",
};

const primaryActionBtnSx = {
  height: 36,
  px: 2,
  fontSize: "12.5px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-xs)",
};
const secondaryActionBtnSx = {
  height: 36,
  px: 1.8,
  fontSize: "12.5px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const alertSx = { mt: 2 };
const reviewCardSx = {
  p: 2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const reviewCompNameSx = {
  m: 0,
  fontSize: "15px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
  maxWidth: "260px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
const smallReviewTagSx = {
  height: 18,
  fontSize: "9.5px",
  px: 0.6,
  fontWeight: 700,
};

export default CreateWorkspaceProductDesktopPage;
