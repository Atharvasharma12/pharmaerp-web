// src/features/access-control/pages/mobile/EditRoleMobilePage.jsx

import { memo } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiEdit3,
  FiFilter,
  FiGrid,
  FiRefreshCw,
  FiSearch,
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
  AppInput,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
} from "@/components";

const actionKeys = ["view", "create", "update", "delete"];

const actionLabels = {
  view: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
};

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const EditRoleMobilePage = memo(
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
    isUpdating = false,
    isLoadingRole = false,
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
              {currentStep === 3
                ? "Review Access Scope"
                : "Edit Workspace Role"}
            </AppHeading>
            <AppText variant="body2" weight={500} sx={pageSubtitleSx}>
              {currentStep === 3
                ? "Verify newly mapped workspace permission matrices before deploying code rules."
                : "Configure governance scopes, assign status flags, and update system identifiers."}
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
                setPermissionSearch={setPermissionSearch}
                setModuleFilter={setModuleFilter}
                handleTogglePermission={handleTogglePermission}
                handleToggleModule={handleToggleModule}
                handleSelectAllPermissions={handleSelectAllPermissions}
                handleClearPermissions={handleClearPermissions}
                handleRefreshPermissions={handleRefreshPermissions}
              />
            )}

            {currentStep === 3 && (
              <MobileStepReviewAndDeploy
                formData={formData}
                previewRole={previewRole}
                permissionModules={permissionModules}
                permissionSummary={permissionSummary}
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
                  Encrypted System Access Rules
                </AppText>
                <AppText variant="body2" weight={500} sx={securityBannerDescSx}>
                  Altering ACL definitions applies updates instantly across all
                  active member sessions.
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
                  disabled={isUpdating}
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
                  loading={isUpdating}
                  disabled={isUpdating}
                  sx={actionButtonRightSx}
                >
                  Save Changes
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

EditRoleMobilePage.displayName = "EditRoleMobilePage";

/* ==========================================================================
   PRESENTATIONAL STEPPER COMPONENT WITH VERY SHORT LINES (NO-TOUCH DESIGN)
   ========================================================================== */

const MobileWorkflowStepper = ({ currentStep, onStepClick }) => {
  const stepsMeta = [
    { id: 1, title: "Role Details" },
    { id: 2, title: "Set Permissions" },
    { id: 3, title: "Review & Save" },
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
   SUB-MODULE FORMS STEPS (1 - 3 COMPACT RENDER VIEWS)
   ========================================================================== */

const MobileStepRoleDetails = ({
  formData,
  formErrors,
  isLoading,
  handleChange,
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
      Role Meta Definition
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Update display nomenclature and lifecycle properties.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Role Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="e.g. Pharmacy Store Manager"
        required
        error={Boolean(formErrors.name)}
        helperText={formErrors.name}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Role Code (Immutable)"
        name="code"
        value={formData.code || ""}
        disabled
        placeholder="system_role_identifier"
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Description (Optional)"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter purpose or operational guidelines"
        labelSx={mobileLabelSx}
        inputSx={mobileTextareaSx}
        multiline
        rows={3}
      />

      <AppSelect
        label="Operational Status"
        name="status"
        value={formData.status || "active"}
        onChange={handleChange}
        disabled={isLoading}
        options={statusOptions}
        required
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
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
  setPermissionSearch,
  setModuleFilter,
  handleTogglePermission,
  handleToggleModule,
  handleSelectAllPermissions,
  handleClearPermissions,
  handleRefreshPermissions,
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
          Access Matrix Blocks
        </AppHeading>
        <AppText variant="body2" sx={formCardSectionDescSx}>
          Toggle explicit operation tracks.
        </AppText>
      </AppBox>
      <AppText
        variant="caption"
        weight={700}
        sx={{ color: "var(--app-color-success)", fontSize: "11px" }}
      >
        Selected: {formData.permissions?.length || 0}
      </AppText>
    </AppStack>

    {/* Micro Utility Action Buttons */}
    <AppStack direction="row" gap={0.6} sx={{ mt: 1.2 }}>
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        onClick={handleSelectAllPermissions}
        disabled={isLoading}
        sx={microActionButtonSx}
      >
        Select All
      </AppButton>
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        onClick={handleClearPermissions}
        disabled={isLoading || !formData.permissions?.length}
        sx={microActionButtonSx}
      >
        Clear
      </AppButton>
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        startIcon={<FiRefreshCw />}
        onClick={handleRefreshPermissions}
        loading={isLoadingPermissions}
        disabled={isLoadingPermissions}
        sx={microActionButtonSx}
      >
        Sync
      </AppButton>
    </AppStack>

    {/* Filter Inputs Grid */}
    <div className="mt-3 grid grid-cols-[1fr_120px] gap-2">
      <AppInput
        value={permissionSearch}
        onChange={(e) => setPermissionSearch(e.target.value)}
        placeholder="Filter rules..."
        size="small"
        variant="bordered"
        rounded="md"
        startIcon={<FiSearch className="text-[12px]" />}
        inputSx={mobileSearchInputSx}
      />
      <AppSelect
        value={moduleFilter}
        onChange={(e) => setModuleFilter(e.target.value)}
        options={moduleOptions}
        size="small"
        variant="bordered"
        rounded="md"
        inputSx={mobileSearchInputSx}
      />
    </div>

    {hasPermissionError && (
      <AppText
        variant="caption"
        sx={{ ...submitErrorTextSx, mt: 1, display: "block" }}
      >
        Error mapping permission lists from directory lines.
      </AppText>
    )}

    {/* High-Density Row Grid Switcher */}
    <AppStack
      direction="column"
      gap={1}
      sx={{ mt: 2, maxHeight: 380, overflowY: "auto", pr: 0.2 }}
    >
      {permissionModules.map((module) => {
        const totalInModule = module.permissions.length;
        const selectedInModule = module.permissions.filter((p) =>
          formData.permissions.includes(p.value),
        ).length;
        const isAllChecked =
          totalInModule > 0 && selectedInModule === totalInModule;

        return (
          <div
            key={module.id}
            className="rounded-lg border border-border p-2 bg-surface-alt transition-colors"
          >
            <AppStack
              direction="row"
              align="center"
              justify="space-between"
              fullWidth
              sx={{ mb: 1.2 }}
            >
              <AppStack direction="row" align="center" gap={0.6}>
                <button
                  type="button"
                  onClick={() => handleToggleModule(module)}
                  className="flex h-5 w-5 items-center justify-center rounded border-0 bg-transparent p-0 outline-none text-text"
                >
                  <AppCheckbox
                    checked={isAllChecked}
                    indeterminate={
                      selectedInModule > 0 && selectedInModule < totalInModule
                    }
                    onChange={() => handleToggleModule(module)}
                    size="small"
                    colorVariant="primary"
                    checkboxSx={{ p: 0 }}
                  />
                </button>
                <AppText
                  weight={800}
                  sx={{ fontSize: "12px", color: "var(--app-color-text)" }}
                >
                  {module.title}
                </AppText>
              </AppStack>
              <AppText
                variant="caption"
                sx={{
                  fontSize: "10.5px",
                  color: "var(--app-color-text-muted)",
                }}
              >
                {selectedInModule}/{totalInModule}
              </AppText>
            </AppStack>

            {/* Sub Action Grid Blocks */}
            <div className="grid grid-cols-2 gap-1.5 pt-0.5 border-t border-dashed border-border">
              {actionKeys.map((action) => {
                const permission = module.actions?.[action];
                if (!permission) return null;
                const checked = formData.permissions.includes(permission.value);

                return (
                  <button
                    key={action}
                    type="button"
                    onClick={() => handleTogglePermission(permission.value)}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-1.5 py-1 text-left outline-none"
                  >
                    <AppCheckbox
                      checked={checked}
                      onChange={() => handleTogglePermission(permission.value)}
                      size="small"
                      colorVariant="primary"
                      checkboxSx={{ p: 0 }}
                    />
                    <span className="text-[11px] font-bold text-text capitalize">
                      {actionLabels[action]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </AppStack>

    {formErrors.permissions && (
      <AppText variant="body2" sx={{ ...errorTextSx, mt: 1 }}>
        {formErrors.permissions}
      </AppText>
    )}
  </AppCard>
);

const MobileStepReviewAndDeploy = ({
  formData,
  previewRole,
  permissionModules,
  permissionSummary,
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
        Review Access Parameters
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

    {/* Review Item Block 1: Basic Identifiers */}
    <AppBox sx={reviewBlockContainerSx}>
      <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
        <AppBox sx={reviewHeaderIconTrackSx}>
          <FiShield />
        </AppBox>
        <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
          Role Parameters
        </AppText>
        <AppTag
          label={previewRole?.status || "active"}
          variant="soft"
          colorVariant={
            previewRole?.status === "active" ? "success" : "warning"
          }
          rounded="md"
          sx={{
            height: 16,
            fontSize: "9px",
            px: 0.5,
            ml: "auto",
            textTransform: "uppercase",
          }}
        />
      </AppStack>
      <AppStack direction="column" gap={0.8}>
        <ReviewGridRow label="Role Name" value={previewRole?.name} />
        <ReviewGridRow label="Role System Code" value={previewRole?.code} />
        <ReviewGridRow label="Role Classification" value={previewRole?.type} />
        <ReviewGridRow
          label="Description Log"
          value={formData.description || previewRole?.description}
        />
      </AppStack>
    </AppBox>

    {/* Review Item Block 2: Rule Count Matrix */}
    <AppBox sx={reviewBlockContainerSx}>
      <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
        <AppBox sx={reviewHeaderIconTrackSx}>
          <FiUsers />
        </AppBox>
        <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
          Active Security Vectors
        </AppText>
      </AppStack>
      <AppStack direction="column" gap={0.8}>
        <ReviewGridRow
          label="Selected Rules Count"
          value={`${permissionSummary?.selected || 0} Elements`}
        />
        <ReviewGridRow
          label="Total Available Rules"
          value={`${permissionSummary?.total || 0} Contexts`}
        />
        <ReviewGridRow
          label="Mapped Module Sub-groups"
          value={`${permissionSummary?.groups || 0} Categories`}
        />
      </AppStack>
    </AppBox>

    {/* Review Item Block 3: Static Isolation Scope Boundaries */}
    <AppBox sx={{ pt: 1.25 }}>
      <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
        <AppBox sx={reviewHeaderIconTrackSx}>
          <FiGrid />
        </AppBox>
        <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
          ACL Isolation Scope
        </AppText>
      </AppStack>
      <div className="grid grid-cols-3 gap-1.5 mt-2">
        <ScopeIconBadge icon={<FiGrid />} label="Workspace" />
        <ScopeIconBadge
          icon={<HiOutlineBuildingOffice2 />}
          label="All Companies"
        />
        <ScopeIconBadge icon={<LuStore />} label="All Branches" />
      </div>
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

const ScopeIconBadge = ({ icon, label }) => (
  <AppStack
    direction="column"
    align="center"
    justify="center"
    gap={0.4}
    sx={scopeBadgeContainerSx}
  >
    <div className="text-[14px] text-primary">{icon}</div>
    <span className="text-[9.5px] font-bold text-text-muted text-center leading-tight whitespace-nowrap">
      {label}
    </span>
  </AppStack>
);

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

const microActionButtonSx = {
  height: 24,
  px: 0.8,
  fontSize: "10px",
  fontWeight: 700,
  borderColor: "var(--app-color-border)",
};

const mobileSearchInputSx = {
  height: 32,
  fontSize: "11px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
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

const scopeBadgeContainerSx = {
  p: 0.8,
  borderRadius: "6px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
  flex: 1,
};

const errorTextSx = {
  fontSize: "11.5px",
  color: "var(--app-color-error)",
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

export default EditRoleMobilePage;
