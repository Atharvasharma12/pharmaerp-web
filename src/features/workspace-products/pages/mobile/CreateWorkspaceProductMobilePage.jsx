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
  FiRefreshCw,
  FiLayers,
  FiShield,
} from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi2";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
} from "@/components";

const productTypeOptions = [
  { label: "Medicine", value: "medicine" },
  { label: "OTC (Over The Counter)", value: "otc" },
];

const CreateWorkspaceProductMobilePage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
    currentStep = 1,
    duplicateWarning = null,
    hsnOptions = [],
    selectedHsnDetail = null,

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
      <section className="relative w-full overflow-hidden bg-bg">
        <AppBox sx={containerSx}>
          {/* Section 1: Step Status Header Title Area */}
          <AppBox sx={headerTitleBlockSx}>
            <AppStack direction="row" align="center" justify="space-between">
              <AppText variant="caption" weight={700} sx={stepTrackerLabelSx}>
                Step {currentStep} of 5
              </AppText>
              <AppButton
                variant="text"
                colorVariant="neutral"
                size="small"
                startIcon={<FiRefreshCw />}
                onClick={handleResetAndRefresh}
                disabled={isLoading}
                sx={resetBtnSx}
              >
                Reset
              </AppButton>
            </AppStack>
            <AppHeading level={1} weight={800} sx={pageTitleSx}>
              {currentStep === 5 ? "Review & Deploy" : "Create Custom Product"}
            </AppHeading>
            <AppText variant="body2" weight={500} sx={pageSubtitleSx}>
              {currentStep === 5
                ? "Review custom item properties before deploying to workspace stock rosters."
                : "Add local inventory parameters when a central master entry is unavailable."}
            </AppText>
          </AppBox>

          {/* Section 2: Progress Timeline Workflow Stepper */}
          <MobileWorkflowStepper
            currentStep={currentStep}
            onStepClick={handleStepChange}
          />

          {/* Section 3: Central Step Form Switcher */}
          <AppBox sx={{ mt: 1.5 }}>
            {formErrors.submit && (
              <AppText variant="body2" sx={submitErrorTextSx}>
                {formErrors.submit}
              </AppText>
            )}

            {currentStep === 1 && (
              <MobileStepIdentity
                formData={formData}
                formErrors={formErrors}
                duplicateWarning={duplicateWarning}
                handleChange={handleChange}
                isLoading={isLoading}
                handleCancel={handleCancel}
                handleBypassWarning={handleBypassWarning}
              />
            )}

            {currentStep === 2 && (
              <MobileStepPackaging
                formData={formData}
                formErrors={formErrors}
                handleChange={handleChange}
                isLoading={isLoading}
              />
            )}

            {currentStep === 3 && (
              <MobileStepTax
                formData={formData}
                hsnOptions={hsnOptions}
                handleChange={handleChange}
                isLoading={isLoading}
              />
            )}

            {currentStep === 4 && (
              <MobileStepNotes
                formData={formData}
                formErrors={formErrors}
                handleChange={handleChange}
                isLoading={isLoading}
              />
            )}

            {currentStep === 5 && (
              <MobileStepReviewAndCreate
                formData={formData}
                selectedHsnDetail={selectedHsnDetail}
                onEditSection={handleStepChange}
              />
            )}
          </AppBox>

          {/* Section 4: Relational Master Guide Card Block */}
          <AppCard
            variant="soft"
            rounded="lg"
            bordered={false}
            shadow="none"
            padding="none"
            sx={guidelinesFooterBannerSx}
          >
            <AppStack direction="row" align="flex-start" gap={1}>
              <FiShield className="text-[15px] text-success mt-0.5 shrink-0" />
              <AppBox sx={{ minWidth: 0 }}>
                <AppText
                  variant="body2"
                  weight={750}
                  sx={guidelinesBannerTitleSx}
                >
                  Relational Catalog Integrity
                </AppText>
                <AppText
                  variant="body2"
                  weight={500}
                  sx={guidelinesBannerDescSx}
                >
                  Custom products exist only when a master catalog entry is not
                  found. Keep catalog data clean to ensure seamless ERP
                  operations.
                </AppText>
              </AppBox>
            </AppStack>
          </AppCard>

          {/* Section 5: Core Form Bottom Presentational Action Bars */}
          <AppBox sx={bottomStickyActionBarSx}>
            {currentStep === 5 ? (
              <AppStack
                direction="row"
                align="center"
                justify="space-between"
                fullWidth
              >
                <AppButton
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  startIcon={<FiArrowLeft />}
                  onClick={handleBack}
                  disabled={isLoading}
                  sx={actionButtonLeftSx}
                >
                  Back
                </AppButton>
                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  startIcon={<FiCheckCircle />}
                  onClick={handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  sx={actionButtonRightSx}
                >
                  Create Product
                </AppButton>
              </AppStack>
            ) : (
              <AppStack
                direction="row"
                gap={1.2}
                justify="space-between"
                fullWidth
              >
                <AppButton
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  onClick={handleCancel}
                  disabled={isLoading}
                  sx={actionButtonCancelSx}
                >
                  Cancel
                </AppButton>
                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  endIcon={<FiArrowRight />}
                  onClick={handleContinue}
                  disabled={isLoading}
                  sx={actionButtonContinueSx}
                >
                  Save & Continue
                </AppButton>
              </AppStack>
            )}
          </AppBox>
        </AppBox>
      </section>
    );
  },
);

CreateWorkspaceProductMobilePage.displayName =
  "CreateWorkspaceProductMobilePage";

/* ==========================================================================
    PRESENTATIONAL STEPPER COMPONENT WITH VERY SHORT LINES (NO-TOUCH DESIGN)
   ========================================================================== */

const MobileWorkflowStepper = ({ currentStep, onStepClick }) => {
  const stepsMeta = [
    { id: 1, title: "Identity" },
    { id: 2, title: "Packaging" },
    { id: 3, title: "Tax Ref" },
    { id: 4, title: "Notes" },
    { id: 5, title: "Review" },
  ];

  return (
    <AppBox sx={stepperOuterBoundarySx}>
      <AppBox sx={stepperInnerTrackSx}>
        <AppStack
          direction="row"
          align="center"
          justify="space-between"
          sx={{ width: "100%" }}
        >
          {stepsMeta.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center flex-1 relative"
              >
                {/* Micro Independent Horizontal Connector Line Rails */}
                {idx > 0 && (
                  <div
                    className="absolute"
                    style={{
                      height: "2px",
                      width: "35%",
                      left: "-17.5%",
                      top: "13px",
                      zIndex: 1,
                      backgroundColor:
                        isCompleted || isActive
                          ? "var(--app-color-primary, #3b82f6)"
                          : "var(--app-color-border, #e2e8f0)",
                    }}
                  />
                )}

                <button
                  type="button"
                  onClick={() => onStepClick?.(step.id)}
                  className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all outline-none border-0"
                  style={{
                    backgroundColor: isActive
                      ? "var(--app-color-primary, #3b82f6)"
                      : isCompleted
                        ? "var(--app-color-primary-soft, #e6f0fa)"
                        : "var(--app-color-surface-alt, #f8fafc)",
                    color: isActive
                      ? "var(--app-color-text-inverse, #ffffff)"
                      : isCompleted || isActive
                        ? "var(--app-color-primary, #3b82f6)"
                        : "var(--app-color-text-muted, #94a3b8)",
                    border:
                      isCompleted || isActive
                        ? "none"
                        : "1px solid var(--app-color-border, #e2e8f0)",
                  }}
                >
                  {isCompleted ? <FiCheck className="text-[13px]" /> : step.id}
                </button>

                <AppText
                  variant="caption"
                  weight={isActive ? 750 : 550}
                  sx={{
                    ...stepperTitleTextSx,
                    color: isActive
                      ? "var(--app-color-text)"
                      : "var(--app-color-text-muted)",
                  }}
                >
                  {step.title}
                </AppText>
              </div>
            );
          })}
        </AppStack>
      </AppBox>
    </AppBox>
  );
};

/* ==========================================================================
    SUB-MODULE FORMS STEPS (1 - 4 COMPACT RENDER VIEWS)
   ========================================================================== */

const MobileStepIdentity = ({
  formData,
  formErrors,
  duplicateWarning,
  handleChange,
  isLoading,
  handleCancel,
  handleBypassWarning,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={formCardContainerSx}
  >
    <AppHeading level={3} weight={800} sx={formCardSectionHeaderSx}>
      Product Identity
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Define the custom catalog item profile. System checks the master catalog
      to block duplicates.
    </AppText>

    {duplicateWarning && (
      <AppCard
        variant="default"
        rounded="md"
        bordered={false}
        shadow="none"
        padding="none"
        sx={warningPanelSx}
      >
        <AppStack direction="row" align="flex-start" gap={1.2}>
          <FiAlertTriangle className="text-[18px] text-warning shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <AppHeading
              level={4}
              weight={750}
              sx={{
                m: 0,
                fontSize: "12.5px",
                color: "var(--app-color-warning)",
              }}
            >
              Central Catalog Match Detected
            </AppHeading>
            <AppText
              variant="body2"
              sx={{
                mt: 0.5,
                fontSize: "11.5px",
                lineHeight: "1.5",
                color: "var(--app-color-text)",
              }}
            >
              {duplicateWarning.message}
            </AppText>

            <div className="mt-3 flex flex-col gap-2">
              <AppButton
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                onClick={handleBypassWarning}
                sx={{ height: 32, fontSize: "11px", fontWeight: 700 }}
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
                  height: 32,
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

    <AppStack
      direction="column"
      gap={1.4}
      sx={{ mt: duplicateWarning ? 1.2 : 1.8 }}
    >
      <AppInput
        label="Product Core Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        disabled={isLoading || Boolean(duplicateWarning)}
        placeholder="e.g. Paracetamol Local Brand Mix"
        required
        error={Boolean(formErrors.name)}
        helperText={formErrors.name}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppSelect
        label="Product Typology Classification"
        name="productType"
        value={formData.productType || "medicine"}
        onChange={handleChange}
        disabled={isLoading || Boolean(duplicateWarning)}
        options={productTypeOptions}
        required
        error={Boolean(formErrors.productType)}
        helperText={formErrors.productType}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />
    </AppStack>
  </AppCard>
);

const MobileStepPackaging = ({
  formData,
  formErrors,
  handleChange,
  isLoading,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={formCardContainerSx}
  >
    <AppHeading level={3} weight={800} sx={formCardSectionHeaderSx}>
      Packaging Metrics
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Configure fundamental physical dimensions and brand markers required for
      downstream tracking.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Manufacturer / Marketer Name (Optional)"
        name="manufacturer"
        value={formData.manufacturer || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter manufacturer brand path"
        error={Boolean(formErrors.manufacturer)}
        helperText={formErrors.manufacturer}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Pack Configuration (Optional)"
        name="pack"
        value={formData.pack || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="e.g. 10 Tablets / 1 Bottle"
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Quantity / Measure Strength (Optional)"
        name="qty"
        value={formData.qty || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="e.g. 650 mg / 500 ml"
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Dosage Form Unit (Optional)"
        name="productForm"
        value={formData.productForm || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="e.g. Tablet, Capsule, Syrup"
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />
    </AppStack>
  </AppCard>
);

const MobileStepTax = ({
  formData,
  hsnOptions = [],
  handleChange,
  isLoading,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={formCardContainerSx}
  >
    <AppHeading level={3} weight={800} sx={formCardSectionHeaderSx}>
      Statutory Parameters
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Link the statutory tax identification classification key. Select a mapped
      template option below.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppSelect
        label="Relational HSN / SAC Code (Optional)"
        name="HsnMaster"
        value={formData.HsnMaster || ""}
        onChange={handleChange}
        options={hsnOptions}
        disabled={isLoading}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />
    </AppStack>
  </AppCard>
);

const MobileStepNotes = ({ formData, formErrors, handleChange, isLoading }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={formCardContainerSx}
  >
    <AppHeading level={3} weight={800} sx={formCardSectionHeaderSx}>
      Operational Notes
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Provide basic descriptive details or workspace comments.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Workspace System Notes (Optional)"
        name="notes"
        value={formData.notes || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter custom comments or workspace remarks here..."
        error={Boolean(formErrors.notes)}
        helperText={formErrors.notes}
        multiline
        rows={4}
        labelSx={mobileLabelSx}
        inputSx={mobileTextareaSx}
      />
    </AppStack>
  </AppCard>
);

/* ==========================================================================
    STEP 5: HIGH-DENSITY AUDIT REVIEW MODULE
   ========================================================================== */

const MobileStepReviewAndCreate = ({
  formData,
  selectedHsnDetail,
  onEditSection,
}) => {
  return (
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="none"
      padding="none"
      sx={formCardContainerSx}
    >
      <AppStack
        direction="row"
        align="center"
        justify="space-between"
        fullWidth
        sx={{ borderBottom: "1px solid var(--app-color-border)", pb: 1 }}
      >
        <AppHeading
          level={3}
          weight={800}
          sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}
        >
          Review Your Details
        </AppHeading>
        <AppButton
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          startIcon={<FiEdit3 />}
          onClick={() => onEditSection?.(1)}
          sx={editReviewSectionBtnSx}
        >
          Edit
        </AppButton>
      </AppStack>

      {/* Review Block 1: Identity */}
      <AppBox sx={reviewBlockContainerSx}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <HiOutlineCube />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Product Identity
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow
            label="Product Name"
            value={formData.name || "Untitled Custom Product"}
          />
          <ReviewGridRow
            label="Typology"
            value={formData.productType === "medicine" ? "Medicine" : "OTC"}
          />
          <ReviewGridRow label="Status" value={formData.status || "active"} />
          {formData.force && (
            <ReviewGridRow
              label="Warning Check"
              value={
                <AppTag
                  label="Bypassed Duplicate Check"
                  variant="soft"
                  colorVariant="warning"
                  rounded="md"
                  sx={{
                    height: 18,
                    fontSize: "10px",
                    fontWeight: 700,
                    px: 0.6,
                  }}
                />
              }
            />
          )}
        </AppStack>
      </AppBox>

      {/* Review Block 2: Packaging */}
      <AppBox sx={reviewBlockContainerSx}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiLayers />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Packaging Metrics
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow
            label="Manufacturer"
            value={formData.manufacturer || "-"}
          />
          <ReviewGridRow label="Pack Form" value={formData.pack || "-"} />
          <ReviewGridRow label="Measure Strength" value={formData.qty || "-"} />
          <ReviewGridRow
            label="Dosage Form"
            value={formData.productForm || "-"}
          />
        </AppStack>
      </AppBox>

      {/* Review Block 3: Statutory Specifications */}
      <AppBox sx={reviewBlockContainerSx}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiGrid />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Statutory Specifications
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow
            label="HSN / SAC Code"
            value={
              selectedHsnDetail?.code
                ? `HSN ${selectedHsnDetail.code}`
                : "Not Linked"
            }
          />
          <ReviewGridRow
            label="Tax Rate Slab"
            value={
              selectedHsnDetail?.gstRate !== undefined &&
              selectedHsnDetail?.gstRate !== null
                ? `${selectedHsnDetail.gstRate}% GST`
                : "-"
            }
          />
        </AppStack>
      </AppBox>

      {/* Review Block 4: Workspace Notes */}
      <AppBox sx={{ pt: 1.25 }}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiInfo />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Workspace Notes
          </AppText>
        </AppStack>
        <AppText
          variant="body2"
          sx={{
            fontSize: "11.5px",
            color: formData.notes
              ? "var(--app-color-text)"
              : "var(--app-color-text-muted)",
            fontStyle: formData.notes ? "normal" : "italic",
            lineHeight: "1.4",
            pl: 0.5,
          }}
        >
          {formData.notes || "No operational custom comments added."}
        </AppText>
      </AppBox>
    </AppCard>
  );
};

const ReviewGridRow = ({ label, value }) => {
  const resolvedValue =
    value === undefined || value === null ? "" : String(value);
  return (
    <div className="grid grid-cols-[135px_1fr] items-start gap-1 text-[11.8px] leading-normal">
      <span className="text-text-muted font-semibold whitespace-nowrap">
        {label}
      </span>
      <span className="text-text font-bold text-left px-0.5 break-words">
        {resolvedValue}
      </span>
    </div>
  );
};

/* ==========================================================================
    STYLE TOKEN DICTIONARY DEFINITIONS
   ========================================================================== */

const containerSx = {
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const headerTitleBlockSx = {
  pb: 0.5,
};

const stepTrackerLabelSx = {
  fontSize: "11px",
  color: "var(--app-color-primary, #3b82f6)",
  textTransform: "uppercase",
  letterSpacing: "0.2px",
};

const resetBtnSx = {
  p: 0,
  minWidth: 0,
  fontSize: "11px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
  "& .MuiButton-startIcon": {
    marginRight: "4px",
  },
};

const pageTitleSx = {
  m: 0,
  mt: 0.25,
  fontSize: "21px",
  fontWeight: 800,
  lineHeight: 1.2,
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.4,
  fontSize: "11.5px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const stepperOuterBoundarySx = {
  mt: 1.6,
  mb: 1.4,
  width: "100%",
  display: "flex",
  justifyContent: "center",
};

const stepperInnerTrackSx = {
  width: "100%",
};

const stepperTitleTextSx = {
  mt: 0.6,
  fontSize: "8.5px",
  textAlign: "center",
  lineHeight: 1.1,
  whiteSpace: "nowrap",
};

const submitErrorTextSx = {
  mb: 1,
  fontSize: "11.5px",
  fontWeight: 700,
  color: "var(--app-color-error)",
};

const formCardContainerSx = {
  p: 1.4,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
};

const formCardSectionHeaderSx = {
  m: 0,
  fontSize: "13.5px",
  color: "var(--app-color-text)",
};

const formCardSectionDescSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const mobileLabelSx = {
  mb: 0.45,
  fontSize: "11.8px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const mobileInputSx = {
  height: 40,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
  "& input::placeholder": {
    fontSize: "12px",
  },
};

const mobileTextareaSx = {
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const warningPanelSx = {
  p: 1.5,
  mt: 1.5,
  bgcolor: "var(--app-color-warning-soft)",
  border: "1px solid var(--app-color-warning)",
  borderRadius: "8px",
};

const guidelinesFooterBannerSx = {
  mt: 1.5,
  p: 1,
  bgcolor: "var(--app-color-readonly-bg, #f8fafc)",
  border: "1px dashed var(--app-color-border)",
};

const guidelinesBannerTitleSx = {
  fontSize: "11px",
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const guidelinesBannerDescSx = {
  mt: 0.15,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.3,
};

const reviewBlockContainerSx = {
  borderBottom: "1px solid var(--app-color-divider)",
  py: 1.25,
};

const editReviewSectionBtnSx = {
  height: 25,
  fontSize: "10.5px",
  px: 1,
  fontWeight: 700,
  borderColor: "var(--app-color-border)",
};

const reviewHeaderIconTrackSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 25,
  height: 25,
  borderRadius: "50%",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "12px",
};

const reviewBlockHeaderTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const bottomStickyActionBarSx = {
  mt: 2.2,
  mb: 1.5,
  width: "100%",
};

const actionButtonCancelSx = {
  height: 40,
  flex: 0.3,
  fontSize: "12px",
  fontWeight: 700,
};

const actionButtonContinueSx = {
  height: 40,
  flex: 0.7,
  fontSize: "12px",
  fontWeight: 750,
  boxShadow: "none",
};

const actionButtonLeftSx = {
  height: 40,
  width: "auto",
  px: 2.2,
  fontSize: "12px",
  fontWeight: 700,
};

const actionButtonRightSx = {
  height: 40,
  width: "auto",
  px: 2.2,
  fontSize: "12px",
  fontWeight: 750,
  boxShadow: "none",
};

export default CreateWorkspaceProductMobilePage;
