import { memo } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiEdit3,
  FiGrid,
  FiInfo,
  FiRefreshCw,
  FiLayers,
  FiShield,
  FiFileText,
  FiCheck,
  FiTrash2,
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

const EditWorkspaceProductMobilePage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
    isFetching = false,
    currentStep = 1,
    hsnOptions = [],
    selectedHsnDetail = null,
    manufacturerOptions = [],
    categoryOptions = [],
    uomOptions = [],
    productFormOptions = [],
    selectedManufacturerDetail = null,
    selectedCategoryDetail = null,
    selectedUomDetail = null,
    selectedProductFormDetail = null,
    saltOptions = [],
    selectedCompositionDetails = [],

    handleChange,
    handleSubmit,
    handleBack,
    handleContinue,
    handleStepChange,
    handleSaveDraft,
    handleCancel,
    handleReload,
  }) => {
    return (
      <section className="relative w-full overflow-hidden bg-bg">
        <AppBox sx={containerSx}>
          {/* Section 1: Header Status Block */}
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
                onClick={handleReload}
                disabled={isFetching || isLoading}
                sx={resetBtnSx}
              >
                Reset
              </AppButton>
            </AppStack>
            <AppHeading level={1} weight={800} sx={pageTitleSx}>
              {currentStep === 5 ? "Review & Save" : "Edit Custom Product"}
            </AppHeading>
            <AppText variant="body2" weight={500} sx={pageSubtitleSx}>
              {currentStep === 5
                ? "Review modified properties before committing updates to workspace stock rosters."
                : "Modify local inventory parameters and statutory tags for this custom product."}
            </AppText>
          </AppBox>

          {/* Section 2: Progress timeline workflow tracker */}
          <MobileWorkflowStepper
            currentStep={currentStep}
            onStepClick={handleStepChange}
          />

          {/* Section 3: Central Wizard Switcher Form Blocks */}
          <AppBox sx={{ mt: 1.5 }}>
            {formErrors.submit && (
              <AppText variant="body2" sx={submitErrorTextSx}>
                {formErrors.submit}
              </AppText>
            )}

            {isFetching ? (
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                padding="none"
                sx={formCardContainerSx}
              >
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <FiRefreshCw className="animate-spin text-[28px] text-primary mb-2" />
                  <AppText
                    variant="body2"
                    sx={{
                      fontSize: "11.5px",
                      color: "var(--app-color-text-muted)",
                    }}
                  >
                    Retrieving product parameters from database models...
                  </AppText>
                </div>
              </AppCard>
            ) : (
              <>
                {currentStep === 1 && (
                  <MobileStepIdentity
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    isLoading={isLoading}
                    handleCancel={handleCancel}
                  />
                )}

                {currentStep === 2 && (
                  <MobileStepPackaging
                    formData={formData}
                    formErrors={formErrors}
                    manufacturerOptions={manufacturerOptions}
                    categoryOptions={categoryOptions}
                    uomOptions={uomOptions}
                    productFormOptions={productFormOptions}
                    saltOptions={saltOptions}
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
                  <MobileStepReviewAndSave
                    formData={formData}
                    selectedHsnDetail={selectedHsnDetail}
                    selectedManufacturerDetail={selectedManufacturerDetail}
                    selectedCategoryDetail={selectedCategoryDetail}
                    selectedUomDetail={selectedUomDetail}
                    selectedProductFormDetail={selectedProductFormDetail}
                    selectedCompositionDetails={selectedCompositionDetails}
                    onEditSection={handleStepChange}
                  />
                )}
              </>
            )}
          </AppBox>

          {/* Section 4: Relational Informational Sticky Banner */}
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
                  Changes affect local inventory catalog scopes. Ensure accurate
                  synchronization parameter selection to bypass downstream
                  accounting blocks.
                </AppText>
              </AppBox>
            </AppStack>
          </AppCard>

          {/* Section 5: Bottom Sticky Action Toolbars */}
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
                  disabled={isLoading || isFetching}
                  sx={actionButtonLeftSx}
                >
                  Back
                </AppButton>
                <AppStack direction="row" gap={1}>
                  <AppButton
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    onClick={handleSaveDraft}
                    disabled={isLoading || isFetching}
                    sx={actionButtonLeftSx}
                  >
                    Exit
                  </AppButton>
                  <AppButton
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={<FiCheckCircle />}
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading || isFetching}
                    sx={actionButtonRightSx}
                  >
                    Save Changes
                  </AppButton>
                </AppStack>
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
                  disabled={isLoading || isFetching}
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
                  disabled={isLoading || isFetching}
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

EditWorkspaceProductMobilePage.displayName = "EditWorkspaceProductMobilePage";

/* ==========================================================================
    PRESENTATIONAL WORKFLOW TRACKER STEPPER
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
    SUB-FORM ACTIVE MULTI-STEP CONTENT PANELS (STEPS 1 - 4)
   ========================================================================== */
const MobileStepIdentity = ({
  formData,
  formErrors,
  handleChange,
  isLoading,
  handleCancel,
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
      Configure product designation profiles. Core classifications cannot be
      modified after initial creation.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Product Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Modify custom name parameters"
        required
        error={Boolean(formErrors.name)}
        helperText={formErrors.name}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppSelect
        label="Product Typology (Immutable)"
        name="productType"
        value={formData.productType || "medicine"}
        onChange={handleChange}
        disabled
        options={[
          { label: "Medicine", value: "medicine" },
          { label: "OTC", value: "otc" },
        ]}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />
    </AppStack>
  </AppCard>
);

const MobileStepPackaging = ({
  formData,
  formErrors,
  manufacturerOptions = [],
  categoryOptions = [],
  uomOptions = [],
  productFormOptions = [],
  saltOptions = [],
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
      Configure active physical tracking parameters and core manufacturer
      indicators.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppSelect
        label="Product Category (Optional)"
        name="category"
        value={formData.category || ""}
        onChange={handleChange}
        options={categoryOptions}
        disabled={isLoading}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppSelect
        label="Manufacturer / Marketer (Optional)"
        name="manufacturer"
        value={formData.manufacturer || ""}
        onChange={handleChange}
        options={manufacturerOptions}
        disabled={isLoading}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Pack Configuration (Optional)"
        name="pack"
        value={formData.pack || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="e.g. 10 x 10 Strip"
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppSelect
        label="Unit of Measure (UOM) (Optional)"
        name="uom"
        value={formData.uom || ""}
        onChange={handleChange}
        options={uomOptions}
        disabled={isLoading}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppSelect
        label="Dosage Form Unit (Optional)"
        name="productForm"
        value={formData.productForm || ""}
        onChange={handleChange}
        options={productFormOptions}
        disabled={isLoading}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      {/* Composition / Active Salts Section */}
      <div className="border-t border-border pt-4 mt-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="block text-[13px] font-bold text-text">Composition / Salts</span>
            <span className="block text-[11px] text-text-muted">Specify active salts, strength and unit.</span>
          </div>
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="primary"
            rounded="md"
            size="small"
            onClick={() => {
              const currentComposition = formData.composition || [];
              handleChange("composition", [...currentComposition, { salt: "", strength: "", unit: "mg" }]);
            }}
            sx={{ height: 28, fontSize: "11px", fontWeight: 700 }}
          >
            + Add Salt
          </AppButton>
        </div>

        {(!formData.composition || formData.composition.length === 0) ? (
          <div className="text-center py-4 bg-surface-alt rounded-lg border border-dashed border-border">
            <span className="text-[11.5px] text-text-muted italic">No active salts configured.</span>
          </div>
        ) : (
          <div className="space-y-3.5">
            {formData.composition.map((item, idx) => (
              <div key={idx} className="bg-surface-alt p-3 rounded-lg border border-border space-y-3">
                <AppSelect
                  label="Active Salt"
                  name={`composition.${idx}.salt`}
                  value={item.salt || ""}
                  onChange={(e) => {
                    const newComposition = [...formData.composition];
                    newComposition[idx] = { ...newComposition[idx], salt: e.target.value };
                    handleChange("composition", newComposition);
                  }}
                  options={saltOptions}
                  labelSx={mobileLabelSx}
                  inputSx={mobileInputSx}
                />
                <div className="grid grid-cols-2 gap-3">
                  <AppInput
                    label="Strength"
                    type="number"
                    name={`composition.${idx}.strength`}
                    value={item.strength === 0 ? "0" : item.strength || ""}
                    onChange={(e) => {
                      const newComposition = [...formData.composition];
                      newComposition[idx] = {
                        ...newComposition[idx],
                        strength: e.target.value === "" ? "" : Number(e.target.value),
                      };
                      handleChange("composition", newComposition);
                    }}
                    placeholder="e.g. 500"
                    labelSx={mobileLabelSx}
                    inputSx={mobileInputSx}
                  />
                  <AppSelect
                    label="Unit"
                    name={`composition.${idx}.unit`}
                    value={item.unit || "mg"}
                    onChange={(e) => {
                      const newComposition = [...formData.composition];
                      newComposition[idx] = { ...newComposition[idx], unit: e.target.value };
                      handleChange("composition", newComposition);
                    }}
                    options={[
                      { label: "mg", value: "mg" },
                      { label: "g", value: "g" },
                      { label: "mcg", value: "mcg" },
                      { label: "ml", value: "ml" },
                      { label: "%", value: "%" },
                      { label: "IU", value: "IU" },
                    ]}
                    labelSx={mobileLabelSx}
                    inputSx={mobileInputSx}
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <AppButton
                    type="button"
                    variant="outlined"
                    colorVariant="danger"
                    rounded="md"
                    size="small"
                    startIcon={<FiTrash2 />}
                    onClick={() => {
                      const newComposition = formData.composition.filter((_, i) => i !== idx);
                      handleChange("composition", newComposition);
                    }}
                    sx={{ height: 28, fontSize: "11px", fontWeight: 700 }}
                  >
                    Delete
                  </AppButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
      Map statutory billing and tax criteria flags. Select a replacement code
      parameter option below.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppSelect
        label="Relational HSN / SAC Code Ledger (Optional)"
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
      Add system references, internal workspace documentation logs, or
      descriptive logs.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Workspace System Notes (Optional)"
        name="notes"
        value={formData.notes || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter custom modifications remarks..."
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
    STEP 5: AUDIT SUMMARY COMPILATION PREVIEW CARD
   ========================================================================== */
const MobileStepReviewAndSave = ({
  formData,
  selectedHsnDetail,
  selectedManufacturerDetail,
  selectedCategoryDetail,
  selectedUomDetail,
  selectedProductFormDetail,
  selectedCompositionDetails = [],
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
          Audit Summary Compilation
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

      {/* Block 1: Identity */}
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
            value={formData.name || "Untitled Product"}
          />
          <ReviewGridRow
            label="Classification"
            value={formData.productType === "medicine" ? "Medicine" : "OTC"}
          />
          <ReviewGridRow
            label="Active Status"
            value={formData.status || "active"}
          />
          {formData.workspaceProductCode && (
            <ReviewGridRow
              label="SKU Reference"
              value={
                <span className="font-mono tracking-tight text-[11px] text-text-muted">
                  {formData.workspaceProductCode}
                </span>
              }
            />
          )}
        </AppStack>
      </AppBox>

      {/* Block 2: Packaging */}
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
            label="Category"
            value={selectedCategoryDetail?.name || "-"}
          />
          <ReviewGridRow
            label="Manufacturer"
            value={selectedManufacturerDetail?.name || "-"}
          />
          <ReviewGridRow label="Pack Format" value={formData.pack || "-"} />
          <ReviewGridRow
            label="Composition"
            value={
              selectedCompositionDetails && selectedCompositionDetails.length > 0
                ? selectedCompositionDetails.map((c) => `${c.saltName} ${c.strength}${c.unit}`).join(", ")
                : "-"
            }
          />
          <ReviewGridRow
            label="Unit of Measure (UOM)"
            value={selectedUomDetail?.name || "-"}
          />
          <ReviewGridRow
            label="Dosage Form"
            value={selectedProductFormDetail?.name || "-"}
          />
        </AppStack>
      </AppBox>

      {/* Block 3: Statutory Specifications */}
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
            label="Assigned Slab Rate"
            value={
              selectedHsnDetail?.gstRate !== undefined &&
              selectedHsnDetail?.gstRate !== null
                ? `${selectedHsnDetail.gstRate}% GST`
                : "-"
            }
          />
        </AppStack>
      </AppBox>

      {/* Block 4: System Notes */}
      <AppBox sx={{ pt: 1.25 }}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiInfo />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Internal Notes
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

const ReviewGridRow = ({ label, value }) => (
  <div className="grid grid-cols-[135px_1fr] items-start gap-1 text-[11.8px] leading-normal">
    <span className="text-text-muted font-semibold whitespace-nowrap">
      {label}
    </span>
    <span className="text-text font-bold text-left px-0.5 break-words">
      {value}
    </span>
  </div>
);

/* ==========================================================================
    DESIGN STYLE TOKENS DICTIONARY (COMPACT HIGH-DENSITY INTERFACES)
   ========================================================================== */
const containerSx = {
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const headerTitleBlockSx = { pb: 0.5 };

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
  "& .MuiButton-startIcon": { marginRight: "4px" },
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

const stepperInnerTrackSx = { width: "100%" };

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
};

const mobileTextareaSx = {
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
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
  px: 1.5,
  fontSize: "11.5px",
  fontWeight: 700,
};

const actionButtonRightSx = {
  height: 40,
  width: "auto",
  px: 2,
  fontSize: "11.5px",
  fontWeight: 750,
  boxShadow: "none",
};

export default EditWorkspaceProductMobilePage;
