// src/features/access-control/pages/mobile/CreateRoleMobilePage.jsx

import { memo } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiEdit3,
  FiFileText, // Fixed: Added missing import here
  FiFilter,
  FiGrid,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUser,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppCheckbox,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
} from "@/components";

const actionKeys = ["view", "create", "update", "delete"];

const CreateRoleMobilePage = memo(
  ({
    formData,
    formErrors = {},
    permissionModules = [],
    moduleOptions = [],
    moduleFilter = "all",
    permissionSearch = "",
    permissionSummary,
    previewRole,
    currentStep = 1,

    isLoading = false,
    isLoadingPermissions = false,
    hasPermissionError = false,

    handleChange,
    handleTogglePermission,
    handleToggleModule,
    handleSelectAllPermissions,
    handleClearPermissions,
    handleSubmit,
    handleBack,
    handleCancel,
    handleContinue,
    handleStepChange,
    handleRefreshPermissions,

    setPermissionSearch,
    setModuleFilter,
  }) => {
    return (
      <section className="relative w-full overflow-hidden bg-bg">
        <AppBox sx={containerSx}>
          {/* Section 1: Step Status Header Title Area */}
          <AppBox sx={headerTitleBlockSx}>
            <AppText variant="caption" weight={700} sx={stepTrackerLabelSx}>
              Step {currentStep} of 3
            </AppText>
            <AppHeading level={1} weight={800} sx={pageTitleSx}>
              {currentStep === 3 ? "Review & Create" : "Create New Role"}
            </AppHeading>
            <AppText variant="body2" weight={500} sx={pageSubtitleSx}>
              {currentStep === 3
                ? "Please review all configuration rules before creating this role."
                : "Define role details, set system permissions and configure scope properties."}
            </AppText>
          </AppBox>

          {/* Section 2: Progress Timeline Workflow Stepper */}
          <MobileWorkflowStepper
            currentStep={currentStep}
            onStepClick={handleStepChange}
          />

          {/* Section 3: Central High-Density Step Form Switcher */}
          <AppBox sx={{ mt: 1.5 }}>
            {formErrors.submit && (
              <AppText variant="body2" sx={submitErrorTextSx}>
                {formErrors.submit}
              </AppText>
            )}

            {currentStep === 1 && (
              <MobileStepRoleDetails
                formData={formData}
                formErrors={formErrors}
                isLoading={isLoading}
                handleChange={handleChange}
              />
            )}

            {currentStep === 2 && (
              <MobileStepPermissions
                formData={formData}
                formErrors={formErrors}
                permissionModules={permissionModules}
                moduleOptions={moduleOptions}
                moduleFilter={moduleFilter}
                permissionSearch={permissionSearch}
                isLoading={isLoading}
                isLoadingPermissions={isLoadingPermissions}
                hasPermissionError={hasPermissionError}
                onSearchChange={setPermissionSearch}
                onModuleChange={setModuleFilter}
                onTogglePermission={handleTogglePermission}
                onToggleModule={handleToggleModule}
                onSelectAll={handleSelectAllPermissions}
                onClear={handleClearPermissions}
                onRefresh={handleRefreshPermissions}
              />
            )}

            {currentStep === 3 && (
              <MobileStepReviewAndCreate
                formData={formData}
                previewRole={previewRole}
                permissionModules={permissionModules}
                permissionSummary={permissionSummary}
                onEditSection={handleStepChange}
              />
            )}
          </AppBox>

          {/* Section 4: Data Security Privacy Advice Block */}
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
                  Workspace Access Protection
                </AppText>
                <AppText variant="body2" weight={500} sx={securityBannerDescSx}>
                  Role configurations mandate exact data security tracking
                  controls internally.
                </AppText>
              </AppBox>
            </AppStack>
          </AppCard>

          {/* Section 5: Core Form Bottom Presentational Action Bars */}
          <AppBox sx={bottomStickyActionBarSx}>
            {currentStep === 3 ? (
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
                  colorVariant="success"
                  rounded="md"
                  startIcon={<FiCheckCircle />}
                  onClick={handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  sx={actionButtonRightSx}
                >
                  Create Role
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
                  colorVariant="success"
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

CreateRoleMobilePage.displayName = "CreateRoleMobilePage";

/* ==========================================================================
   PRESENTATIONAL STEPPER COMPONENT WITH CONDENSED VISUAL HORIZONTAL LINE
   ========================================================================== */

const MobileWorkflowStepper = ({ currentStep, onStepClick }) => {
  const stepsMeta = [
    { id: 1, title: "Role Details" },
    { id: 2, title: "Set Permissions" },
    { id: 3, title: "Review & Create" },
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
                {/* Micro Horizontal Connector Line Rails (No-Touch Blueprint) */}
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
   SUB-MODULE FORMS STEPS (STEPS 1 & 2 COMPACT VIEWS)
   ========================================================================== */

const MobileStepRoleDetails = ({
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
      Role Details
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Enter core identifiers mapping custom roles inside access metrics.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Role Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter role name"
        required
        error={Boolean(formErrors.name)}
        helperText={
          formErrors.name || "Use a clear name that describes the role"
        }
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
        helperTextSx={mobileHelperTextSx}
      />

      <AppInput
        label="Role Code"
        name="code"
        value={formData.code || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Auto-generated role code"
        error={Boolean(formErrors.code)}
        helperText={
          formErrors.code || "Lowercase letters, numbers and underscores only"
        }
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
        helperTextSx={mobileHelperTextSx}
      />

      <AppInput
        label="Description (Optional)"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter role description"
        error={Boolean(formErrors.description)}
        helperText={
          formErrors.description ||
          "Describe the purpose and responsibilities of this role"
        }
        labelSx={mobileLabelSx}
        inputSx={mobileTextareaSx}
        multiline
        rows={3}
        helperTextSx={mobileHelperTextSx}
      />
    </AppStack>
  </AppCard>
);

const MobileStepPermissions = ({
  formData,
  formErrors,
  permissionModules,
  moduleOptions,
  moduleFilter,
  permissionSearch,
  isLoading,
  isLoadingPermissions,
  hasPermissionError,
  onSearchChange,
  onModuleChange,
  onTogglePermission,
  onToggleModule,
  onSelectAll,
  onClear,
  onRefresh,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={formCardContainerSx}
  >
    <AppStack direction="row" align="center" justify="space-between" fullWidth>
      <AppBox>
        <AppHeading level={3} weight={800} sx={formCardSectionHeaderSx}>
          Set Permissions
        </AppHeading>
        <AppText variant="body2" sx={formCardSectionDescSx}>
          Choose structural access nodes for this target custom scope profile.
        </AppText>
      </AppBox>
    </AppStack>

    {/* Tiny High Density Filter Rows Stack */}
    <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
      <AppInput
        value={permissionSearch}
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder="Search permissions..."
        size="small"
        variant="bordered"
        rounded="md"
        startIcon={<FiSearch />}
        inputSx={mobileInputSx}
      />
      <AppSelect
        value={moduleFilter}
        onChange={(event) => onModuleChange?.(event.target.value)}
        options={moduleOptions}
        size="small"
        variant="bordered"
        rounded="md"
        inputSx={{ ...mobileInputSx, width: 120 }}
      />
    </div>

    <AppStack direction="row" gap={0.8} sx={{ mt: 1.2, mb: 1 }}>
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        onClick={onSelectAll}
        disabled={isLoading}
        sx={bulkActionBtnSx}
      >
        Select All
      </AppButton>
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        onClick={onClear}
        disabled={isLoading || !formData.permissions?.length}
        sx={bulkActionBtnSx}
      >
        Clear All
      </AppButton>
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        startIcon={<FiRefreshCw />}
        onClick={onRefresh}
        loading={isLoadingPermissions}
        disabled={isLoadingPermissions}
        sx={bulkActionBtnSx}
      >
        Refresh
      </AppButton>
    </AppStack>

    {hasPermissionError && (
      <AppText
        variant="body2"
        sx={{ color: "var(--app-color-error)", fontSize: "11px", my: 1 }}
      >
        Unable to load permissions list. Please refresh and try again.
      </AppText>
    )}

    {formErrors.permissions && (
      <AppText
        variant="body2"
        sx={{ color: "var(--app-color-error)", fontSize: "11px", my: 1 }}
      >
        {formErrors.permissions}
      </AppText>
    )}

    {/* Compact Mobile Permission Matrix Accordion/Rows Loop */}
    <AppStack
      direction="column"
      gap={0.8}
      sx={{ mt: 1.5, maxHeight: 380, overflowY: "auto", pr: 0.2 }}
    >
      {permissionModules.map((module) => {
        const checkedCount = module.permissions.filter((p) =>
          formData.permissions.includes(p.value),
        ).length;
        const isAllSelected =
          checkedCount === module.permissions.length &&
          module.permissions.length > 0;

        return (
          <AppBox key={module.id} sx={mobilePermissionModuleRowSx}>
            <AppStack
              direction="row"
              align="center"
              justify="space-between"
              fullWidth
              sx={{
                borderBottom: "1px solid var(--app-color-border)",
                pb: 0.6,
                mb: 0.8,
              }}
            >
              <AppStack direction="row" align="center" gap={0.6}>
                <FiShield className="text-primary text-sm shrink-0" />
                <AppText
                  variant="body2"
                  weight={800}
                  sx={{ fontSize: "12px", color: "var(--app-color-text)" }}
                >
                  {module.title}
                </AppText>
              </AppStack>
              <AppButton
                variant="text"
                size="small"
                rounded="sm"
                onClick={() => onToggleModule?.(module)}
                sx={moduleSelectAllTextBtnSx}
              >
                {isAllSelected ? "Deselect Module" : "Select Module"}
              </AppButton>
            </AppStack>

            {/* Individual Action Toggles Grid Cell Wrapper layout */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-0.5">
              {actionKeys.map((action) => {
                const item = module.actions?.[action];
                if (!item) return <div key={action} />;
                const isChecked = formData.permissions.includes(item.value);

                return (
                  <AppStack
                    key={action}
                    direction="row"
                    align="center"
                    gap={0.4}
                    onClick={() => onTogglePermission?.(item.value)}
                    sx={{ cursor: "pointer" }}
                  >
                    <AppCheckbox
                      checked={isChecked}
                      size="small"
                      colorVariant="primary"
                      checkboxSx={{ p: 0 }}
                    />
                    <AppText
                      variant="caption"
                      weight={isChecked ? 750 : 550}
                      sx={{ fontSize: "11px", color: "var(--app-color-text)" }}
                    >
                      {item.actionLabel}
                    </AppText>
                  </AppStack>
                );
              })}
            </div>
          </AppBox>
        );
      })}
    </AppStack>
  </AppCard>
);

/* ==========================================================================
   STEP 3: HIGH-DENSITY AUDIT REVIEW MODULE (PERSISTENT METADATA ROWS)
   ========================================================================== */

const MobileStepReviewAndCreate = ({
  formData,
  previewRole,
  permissionModules,
  permissionSummary,
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

      {/* Review Block 1: Role Base Indicators */}
      <AppBox sx={reviewBlockContainerSx}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiUser />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Role Information
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow label="Role Name" value={previewRole.name} />
          <ReviewGridRow label="Role Code" value={previewRole.code} />
          <ReviewGridRow
            label="Status"
            value={
              <AppTag
                label="Active"
                variant="soft"
                colorVariant="success"
                rounded="md"
                sx={{ height: 18, fontSize: "10px", fontWeight: 700, px: 0.6 }}
              />
            }
          />
          <ReviewGridRow
            label="Description"
            value={formData.description || previewRole.description}
          />
        </AppStack>
      </AppBox>

      {/* Review Block 2: Permissions Aggregation Counts Summary */}
      <AppBox sx={reviewBlockContainerSx}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiFileText />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Permissions Aggregation
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow
            label="Total Groups"
            value={permissionSummary?.groups}
          />
          <ReviewGridRow
            label="Selected Rules"
            value={`${permissionSummary?.selected || 0} / ${permissionSummary?.total || 0}`}
          />
        </AppStack>
      </AppBox>

      {/* Review Block 3: Access Scope Bounds */}
      <AppBox sx={{ pt: 1.25 }}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiGrid />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Access Scope Boundaries
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow label="Workspace Scope" value="Entire Workspace" />
          <ReviewGridRow label="Companies Allowed" value="All Companies" />
          <ReviewGridRow label="Branches Allowed" value="All Branches" />
        </AppStack>
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

const mobileTextareaSx = {
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const mobileHelperTextSx = {
  mt: 0.4,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const bulkActionBtnSx = {
  height: 28,
  fontSize: "11px",
  px: 1.1,
  fontWeight: 650,
  borderColor: "var(--app-color-border)",
};

const mobilePermissionModuleRowSx = {
  p: 1,
  borderRadius: "8px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const moduleSelectAllTextBtnSx = {
  height: 20,
  fontSize: "10px",
  fontWeight: 700,
  p: 0,
  color: "var(--app-color-primary)",
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

export default CreateRoleMobilePage;
