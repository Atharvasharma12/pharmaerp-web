// src/features/access-control/pages/mobile/AssignAccessMobilePage.jsx

import { memo, useCallback } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiEdit3,
  FiInfo,
  FiRefreshCw,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

import {
  AppBox,
  AppButton,
  AppCard,
  AppCheckbox,
  AppHeading,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
} from "@/components";

const AssignAccessMobilePage = memo(
  ({
    formData,
    formErrors = {},
    currentStep = 1,
    isLoading = false,
    isSubmitting = false,
    error,
    memberOptions = [],
    companyOptions = [],
    filteredBranchOptions = [],
    selectedMember,
    accessSummary,
    handleChange,
    handleStepChange,
    handleContinue,
    handleBack,
    handleCancel,
    handleReset,
    handleSubmit,
  }) => {
    const handleCompanyCheckboxChange = useCallback(
      (companyId, checked) => {
        const currentIds = formData.companyIds || [];
        const nextIds = checked
          ? [...currentIds, companyId]
          : currentIds.filter((id) => id !== companyId);
        handleChange("companyIds", nextIds);
      },
      [formData.companyIds, handleChange],
    );

    const handleBranchCheckboxChange = useCallback(
      (branchId, checked) => {
        const currentIds = formData.branchIds || [];
        const nextIds = checked
          ? [...currentIds, branchId]
          : currentIds.filter((id) => id !== branchId);
        handleChange("branchIds", nextIds);
      },
      [formData.branchIds, handleChange],
    );

    const handleToggleAllCompanies = useCallback(
      (checked) => {
        const nextIds = checked ? companyOptions.map((c) => c.value) : [];
        handleChange("companyIds", nextIds);
      },
      [companyOptions, handleChange],
    );

    const handleToggleAllBranches = useCallback(
      (checked) => {
        const nextIds = checked
          ? filteredBranchOptions.map((b) => b.value)
          : [];
        handleChange("branchIds", nextIds);
      },
      [filteredBranchOptions, handleChange],
    );

    return (
      <section className="relative w-full overflow-hidden bg-bg">
        <AppBox sx={containerSx}>
          {/* Section 1: Step Status Header Title Area */}
          <AppBox sx={headerTitleBlockSx}>
            <AppText variant="caption" weight={700} sx={stepTrackerLabelSx}>
              Step {currentStep} of 4
            </AppText>
            <AppHeading level={1} weight={800} sx={pageTitleSx}>
              {currentStep === 4 ? "Verify Matrix" : "Assign Access"}
            </AppHeading>
            <AppText variant="body2" weight={500} sx={pageSubtitleSx}>
              {currentStep === 4
                ? "Verify newly mapped workspace isolation scopes before deploying rules."
                : "Configure data routing boundaries and toggle explicit location properties."}
            </AppText>
          </AppBox>

          {/* Section 2: Progress Timeline Workflow Stepper */}
          <MobileWorkflowStepper
            currentStep={currentStep}
            onStepClick={handleStepChange}
          />

          {/* Section 3: Central High-Density Step Form Switcher */}
          <AppBox sx={{ mt: 1.5 }}>
            {(error || formErrors.submit) && (
              <AppText variant="body2" sx={submitErrorTextSx}>
                {formErrors.submit || error}
              </AppText>
            )}

            {currentStep === 1 && (
              <MobileStepSelectMember
                formData={formData}
                formErrors={formErrors}
                memberOptions={memberOptions}
                selectedMember={selectedMember}
                handleChange={handleChange}
                isLoading={isLoading}
              />
            )}

            {currentStep === 2 && (
              <MobileStepCompanyAccess
                formData={formData}
                companyOptions={companyOptions}
                onCompanyCheck={handleCompanyCheckboxChange}
                onToggleAll={handleToggleAllCompanies}
              />
            )}

            {currentStep === 3 && (
              <MobileStepBranchAccess
                formData={formData}
                filteredBranchOptions={filteredBranchOptions}
                onBranchCheck={handleBranchCheckboxChange}
                onToggleAll={handleToggleAllBranches}
                isLoading={isLoading}
              />
            )}

            {currentStep === 4 && (
              <MobileStepReviewAndConfirm
                selectedMember={selectedMember}
                accessSummary={accessSummary}
                onEditSection={handleStepChange}
              />
            )}
          </AppBox>

          {/* Section 4: Data Security Privacy Advice Card Block */}
          <AppCard
            variant="soft"
            rounded="lg"
            bordered={false}
            shadow="none"
            padding="none"
            sx={securityFooterBannerSx}
          >
            <AppStack direction="row" align="flex-start" gap={1}>
              <FiShield className="text-[15px] text-success mt-0.5 shrink-0" />
              <AppBox sx={{ minWidth: 0 }}>
                <AppText
                  variant="body2"
                  weight={750}
                  sx={securityBannerTitleSx}
                >
                  Encrypted Boundary Mapping
                </AppText>
                <AppText variant="body2" weight={500} sx={securityBannerDescSx}>
                  Altering data scopes restricts row visibility filters mapping
                  downstream ledger queries.
                </AppText>
              </AppBox>
            </AppStack>
          </AppCard>

          {/* Section 5: Core Form Bottom Presentational Action Bars */}
          <AppBox sx={bottomStickyActionBarSx}>
            {currentStep === 4 ? (
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
                  disabled={isSubmitting}
                  sx={actionButtonLeftSx}
                >
                  Back
                </AppButton>
                <AppButton
                  variant="contained"
                  colorVariant="success"
                  rounded="md"
                  startIcon={<FiCheckCircle />}
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting || isLoading}
                  sx={actionButtonRightSx}
                >
                  Assign Access
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
                  disabled={isSubmitting}
                  sx={actionButtonCancelSx}
                >
                  Cancel
                </AppButton>
                <AppButton
                  variant="contained"
                  colorVariant="success"
                  rounded="md"
                  endIcon={<FiArrowRight />}
                  onClick={handleContinue}
                  disabled={isSubmitting || isLoading}
                  sx={actionButtonContinueSx}
                >
                  Continue
                </AppButton>
              </AppStack>
            )}
          </AppBox>
        </AppBox>
      </section>
    );
  },
);

AssignAccessMobilePage.displayName = "AssignAccessMobilePage";

/* ==========================================================================
   PRESENTATIONAL STEPPER COMPONENT WITH VERY SHORT LINES (NO-TOUCH DESIGN)
   ========================================================================== */

const MobileWorkflowStepper = ({ currentStep, onStepClick }) => {
  const stepsMeta = [
    { id: 1, title: "Member" },
    { id: 2, title: "Companies" },
    { id: 3, title: "Branches" },
    { id: 4, title: "Verify Matrix" },
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
                          ? "var(--app-color-success, #10b981)"
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
                      ? "var(--app-color-success, #10b981)"
                      : isCompleted
                        ? "var(--app-color-success-soft, #e6f4ea)"
                        : "var(--app-color-surface-alt, #f8fafc)",
                    color: isActive
                      ? "var(--app-color-text-inverse, #ffffff)"
                      : isCompleted || isActive
                        ? "var(--app-color-success, #10b981)"
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

const MobileStepSelectMember = ({
  formData,
  formErrors,
  memberOptions,
  selectedMember,
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
      Select Workspace Operator
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Specify a team operator from active workspace logs.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppSelect
        label="Workspace Member Target"
        name="memberUserId"
        value={formData.memberUserId || ""}
        onChange={(e) => handleChange("memberUserId", e.target.value)}
        options={memberOptions}
        required
        loading={isLoading}
        error={Boolean(formErrors.memberUserId)}
        helperText={formErrors.memberUserId}
        placeholder="Select workspace user..."
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      {selectedMember && (
        <AppBox sx={memberMetaCompactCardSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            fullWidth
          >
            <span className="text-text-muted font-semibold">Assigned Role</span>
            <span className="font-bold text-primary">
              {selectedMember.displayRole}
            </span>
          </AppStack>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            fullWidth
            sx={{ mt: 0.6 }}
          >
            <span className="text-text-muted font-semibold">Comms routing</span>
            <span className="font-bold text-text truncate max-w-[180px]">
              {selectedMember.displayEmail}
            </span>
          </AppStack>
        </AppBox>
      )}
    </AppStack>
  </AppCard>
);

const MobileStepCompanyAccess = ({
  companyOptions,
  formData,
  onCompanyCheck,
  onToggleAll,
}) => {
  const isAllChecked =
    companyOptions.length > 0 &&
    companyOptions.every((c) => (formData.companyIds || []).includes(c.value));

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
      >
        <AppBox>
          <AppHeading level={3} weight={800} sx={formCardSectionHeaderSx}>
            Corporate Scopes Selection
          </AppHeading>
          <AppText variant="body2" sx={formCardSectionDescSx}>
            Toggle company access permissions.
          </AppText>
        </AppBox>
        <AppCheckbox
          size="small"
          colorVariant="primary"
          checked={isAllChecked}
          onChange={(e) => onToggleAll(e.target.checked)}
          checkboxSx={checkboxSx}
        />
      </AppStack>

      <AppStack
        direction="column"
        gap={0.8}
        sx={{ mt: 1.6, maxHeight: 320, overflowY: "auto", pr: 0.1 }}
      >
        {companyOptions.length ? (
          companyOptions.map((company) => {
            const isChecked = (formData.companyIds || []).includes(
              company.value,
            );
            return (
              <button
                key={company.value}
                type="button"
                onClick={() => onCompanyCheck(company.value, !isChecked)}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-alt px-2.5 py-2 text-left outline-none"
              >
                <AppCheckbox
                  size="small"
                  colorVariant="primary"
                  checked={isChecked}
                  onChange={() => onCompanyCheck(company.value, !isChecked)}
                  checkboxSx={checkboxSx}
                />
                <HiOutlineBuildingOffice2 className="text-text-muted text-[15px] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="block text-[12px] font-bold text-text truncate">
                    {company.label}
                  </span>
                  <span className="block text-[10px] text-text-muted truncate mt-0.5">
                    {company.description}
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <span className="text-[11.5px] font-medium text-text-muted text-center py-4">
            No workspace company records available.
          </span>
        )}
      </AppStack>
    </AppCard>
  );
};

const MobileStepBranchAccess = ({
  filteredBranchOptions,
  formData,
  onBranchCheck,
  onToggleAll,
  isLoading,
}) => {
  const isAllChecked =
    filteredBranchOptions.length > 0 &&
    filteredBranchOptions.every((b) =>
      (formData.branchIds || []).includes(b.value),
    );

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
      >
        <AppBox>
          <AppHeading level={3} weight={800} sx={formCardSectionHeaderSx}>
            Physical Outlets Boundaries
          </AppHeading>
          <AppText variant="body2" sx={formCardSectionDescSx}>
            Map child branch row coordinates.
          </AppText>
        </AppBox>
        {filteredBranchOptions.length > 0 && (
          <AppCheckbox
            size="small"
            colorVariant="primary"
            checked={isAllChecked}
            onChange={(e) => onToggleAll(e.target.checked)}
            checkboxSx={checkboxSx}
          />
        )}
      </AppStack>

      <AppBox sx={{ mt: 1.6 }}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <FiRefreshCw className="animate-spin text-[20px] text-success mb-1.5" />
            <span className="text-[11px] text-text-muted font-semibold">
              Filtering local branches...
            </span>
          </div>
        ) : filteredBranchOptions.length > 0 ? (
          <AppStack
            direction="column"
            gap={0.8}
            sx={{ maxHeight: 300, overflowY: "auto", pr: 0.1 }}
          >
            {filteredBranchOptions.map((branch) => {
              const isChecked = (formData.branchIds || []).includes(
                branch.value,
              );
              return (
                <button
                  key={branch.value}
                  type="button"
                  onClick={() => onBranchCheck(branch.value, !isChecked)}
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-alt px-2.5 py-2 text-left outline-none"
                >
                  <AppCheckbox
                    size="small"
                    colorVariant="primary"
                    checked={isChecked}
                    onChange={() => onBranchCheck(branch.value, !isChecked)}
                    checkboxSx={checkboxSx}
                  />
                  <LuStore className="text-text-muted text-[14px] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[12px] font-bold text-text truncate">
                      {branch.label}
                    </span>
                    <div className="flex items-center justify-between mt-0.5 text-[10px] text-text-muted font-medium">
                      <span className="truncate max-w-[100px] text-primary">
                        {branch.companyName}
                      </span>
                      <span className="truncate max-w-[110px]">
                        {branch.location}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </AppStack>
        ) : (
          <AppBox sx={emptyBranchBannerSx}>
            <FiInfo className="text-[18px] text-text-muted shrink-0 mt-0.5" />
            <AppBox sx={{ minWidth: 0 }}>
              <AppText
                variant="body2"
                weight={750}
                sx={{ fontSize: "11.5px", color: "var(--app-color-text)" }}
              >
                No outlets loaded
              </AppText>
              <AppText
                variant="caption"
                sx={{
                  fontSize: "10.5px",
                  color: "var(--app-color-text-muted)",
                  mt: 0.1,
                  display: "block",
                }}
              >
                No active branches map because no parent companies were checked
                in Step 2.
              </AppText>
            </AppBox>
          </AppBox>
        )}
      </AppBox>
    </AppCard>
  );
};

const MobileStepReviewAndConfirm = ({
  selectedMember,
  accessSummary,
  onEditSection,
}) => (
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
      <AppHeading level={3} weight={800} sx={{ m: 0, fontSize: "14px" }}>
        Verify Scope Matrix
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

    {/* Review Core Block 1: Target Operator Profile */}
    <AppBox sx={reviewBlockContainerSx}>
      <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
        <AppBox sx={reviewHeaderIconTrackSx}>
          <FiUsers />
        </AppBox>
        <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
          Target Employee Identity
        </AppText>
      </AppStack>
      <AppStack direction="column" gap={0.8}>
        <ReviewGridRow label="Full Name" value={selectedMember?.displayName} />
        <ReviewGridRow
          label="Comms Channel"
          value={selectedMember?.displayEmail}
        />
        <ReviewGridRow
          label="Assigned System Role"
          value={
            <span className="text-primary font-bold">
              {selectedMember?.displayRole}
            </span>
          }
        />
      </AppStack>
    </AppBox>

    {/* Review Core Block 2: Matrix Scope Summaries */}
    <AppBox sx={{ pt: 1.25 }}>
      <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1.2 }}>
        <AppBox sx={reviewHeaderIconTrackSx}>
          <FiBriefcase />
        </AppBox>
        <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
          Authorization Mappings
        </AppText>
      </AppStack>

      <AppStack direction="column" gap={1.2}>
        {/* Company tags block */}
        <AppBox sx={reviewRowSubBlockContainerSx}>
          <span className="block text-[10.5px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
            Companies Scope ({accessSummary.selectedCompanies.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {accessSummary.selectedCompanies.length ? (
              accessSummary.selectedCompanies.map((c) => (
                <AppTag
                  key={c.value}
                  label={c.label}
                  variant="soft"
                  colorVariant="primary"
                  rounded="md"
                />
              ))
            ) : (
              <span className="text-[10.5px] text-text-muted font-semibold">
                Zero Companies (Clear Access)
              </span>
            )}
          </div>
        </AppBox>

        {/* Branch tags block */}
        <AppBox sx={reviewRowSubBlockContainerSx}>
          <span className="block text-[10.5px] font-bold text-text-muted uppercase tracking-wider mb-1.5">
            Branches Enabled Outlets ({accessSummary.selectedBranches.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {accessSummary.selectedBranches.length ? (
              accessSummary.selectedBranches.map((b) => (
                <AppTag
                  key={b.value}
                  label={b.label}
                  variant="soft"
                  colorVariant="success"
                  rounded="md"
                />
              ))
            ) : (
              <span className="text-[10.5px] text-text-muted font-semibold">
                Zero Outlets (Clear Access)
              </span>
            )}
          </div>
        </AppBox>
      </AppStack>
    </AppBox>
  </AppCard>
);

const ReviewGridRow = ({ label, value }) => {
  const resolvedValue =
    value === undefined || value === null ? "" : String(value);
  return (
    <div className="grid grid-cols-[130px_1fr] items-start gap-1 text-[11.8px] leading-normal">
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
   STYLE TOKEN DICTIONARY DEFINITIONS (HIGH-DENSITY COMPACT BLUEPRINT)
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
  pt: 1.2,
  pb: 0.5,
};

const stepTrackerLabelSx = {
  fontSize: "11px",
  color: "var(--app-color-success, #10b981)",
  textTransform: "uppercase",
  letterSpacing: "0.2px",
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

const memberMetaCompactCardSx = {
  p: 1.2,
  borderRadius: "8px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
  fontSize: "11.5px",
};

const checkboxSx = { p: 0 };

const emptyBranchBannerSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1,
  p: 1.2,
  borderRadius: "8px",
  border: "1px dashed var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const securityFooterBannerSx = {
  mt: 1.5,
  p: 1,
  bgcolor: "var(--app-color-readonly-bg, #f8fafc)",
  border: "1px dashed var(--app-color-border)",
};

const securityBannerTitleSx = {
  fontSize: "11px",
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const securityBannerDescSx = {
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

const reviewRowSubBlockContainerSx = {
  p: 1,
  borderRadius: "8px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
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

export default AssignAccessMobilePage;
