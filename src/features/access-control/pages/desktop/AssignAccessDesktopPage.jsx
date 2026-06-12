// src/features/access-control/pages/desktop/AssignAccessDesktopPage.jsx

import { memo, useCallback } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiInfo,
  FiRefreshCw,
  FiSave,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppCheckbox,
  AppHeading,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
} from "@/components";

const AssignAccessDesktopPage = memo(
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
    handleSaveDraft,
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
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <PageHeader
            title="Assign Access"
            subtitle="Configure company and branch access parameters securely."
            extra={
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Access Control", onClick: handleCancel },
                  { label: "Member Access", onClick: handleCancel },
                  { label: "Assign Access", current: true },
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
                  disabled={isSubmitting}
                  sx={secondaryButtonSx}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  startIcon={<FiRefreshCw />}
                  onClick={handleReset}
                  disabled={isSubmitting}
                  sx={secondaryButtonSx}
                >
                  Reset
                </AppButton>
              </AppStack>
            }
            sx={pageHeaderSx}
            contentSx={pageHeaderContentSx}
          />

          {error && !formErrors.submit && (
            <AppAlert severity="error" variant="soft" rounded="md" sx={alertSx}>
              {error}
            </AppAlert>
          )}

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_330px] items-start gap-5">
            <AppBox sx={{ minWidth: 0 }}>
              <WorkflowStepper
                currentStep={currentStep}
                onStepChange={handleStepChange}
              />

              <AppBox sx={{ mt: 4 }}>
                {currentStep === 1 && (
                  <Step1Form
                    memberOptions={memberOptions}
                    selectedMember={selectedMember}
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleCancel={handleCancel}
                    handleContinue={handleContinue}
                    isLoading={isLoading}
                  />
                )}

                {currentStep === 2 && (
                  <Step2Form
                    companyOptions={companyOptions}
                    formData={formData}
                    onCompanyCheck={handleCompanyCheckboxChange}
                    onToggleAll={handleToggleAllCompanies}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                    isLoading={isLoading}
                  />
                )}

                {currentStep === 3 && (
                  <Step3Form
                    filteredBranchOptions={filteredBranchOptions}
                    formData={formData}
                    onBranchCheck={handleBranchCheckboxChange}
                    onToggleAll={handleToggleAllBranches}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                    isLoading={isLoading}
                  />
                )}

                {currentStep === 4 && (
                  <Step4Form
                    selectedMember={selectedMember}
                    accessSummary={accessSummary}
                    formErrors={formErrors}
                    isSubmitting={isSubmitting}
                    handleBack={handleBack}
                    handleSaveDraft={handleSaveDraft}
                    handleSubmit={handleSubmit}
                    onEditStep={handleStepChange}
                  />
                )}
              </AppBox>
            </AppBox>

            <RightSidebarPanel
              currentStep={currentStep}
              selectedMember={selectedMember}
              accessSummary={accessSummary}
            />
          </div>
        </div>
      </section>
    );
  },
);

AssignAccessDesktopPage.displayName = "AssignAccessDesktopPage";

/* ==========================================================================
   HORIZONTAL PROGRESS STEPS STEPPER
   ========================================================================== */

const WorkflowStepper = memo(({ currentStep, onStepChange }) => {
  const steps = [
    { id: 1, title: "Select Member", label: "Identity matching" },
    { id: 2, title: "Company Access", label: "Configure corporate nodes" },
    { id: 3, title: "Branch Access", label: "Configure outlet boundaries" },
    { id: 4, title: "Review & Confirm", label: "Commit data safely" },
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
                className="flex shrink-0 items-center gap-2 text-left transition outline-none"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${completed ? "bg-primary-soft text-primary" : active ? "bg-primary text-text-inverse" : "border border-border bg-surface-alt text-text-muted"}`}
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
                <div className="mx-3 h-px min-w-[16px] flex-1 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </AppCard>
  );
});
WorkflowStepper.displayName = "WorkflowStepper";

/* ==========================================================================
   WIZARD SEGREGATED FORMS MODULE STEP PIECES
   ========================================================================== */

const Step1Form = ({
  memberOptions,
  selectedMember,
  formData,
  formErrors,
  handleChange,
  handleCancel,
  handleContinue,
  isLoading,
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
        1. Select Workspace Member
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Specify an active team operator from the workspace profile registries
        list.
      </AppText>
    </div>
    <div className="mt-5 grid grid-cols-[1fr_260px] gap-6 items-start">
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
        placeholder="Select user full name..."
        labelSx={labelSx}
        inputSx={inputSx}
      />
      {selectedMember && (
        <div className="rounded-xl border border-border bg-surface-alt p-3 space-y-2 mt-5 text-[12px]">
          <div className="flex justify-between">
            <span className="text-text-muted">Role:</span>
            <span className="font-bold text-primary">
              {selectedMember.displayRole}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Email:</span>
            <span className="font-medium text-text truncate max-w-[130px]">
              {selectedMember.displayEmail}
            </span>
          </div>
        </div>
      )}
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
      <AppButton
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        endIcon={<FiArrowRight />}
        onClick={handleContinue}
        sx={primaryActionBtnSx}
      >
        Continue to Companies
      </AppButton>
    </div>
  </AppCard>
);

const Step2Form = ({
  companyOptions,
  formData,
  onCompanyCheck,
  onToggleAll,
  handleBack,
  handleContinue,
  isLoading,
}) => {
  const isAllChecked =
    companyOptions.length > 0 &&
    companyOptions.every((c) => (formData.companyIds || []).includes(c.value));
  return (
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={formMainCardSx}
    >
      <div className="border-b border-border pb-3 flex items-center justify-between">
        <div>
          <AppHeading level={2} weight={700} sx={sectionTitleSx}>
            2. Corporate Company Access
          </AppHeading>
          <AppText variant="body2" sx={sectionSubtitleSx}>
            Check desired company rows. Leave completely blank to clear out all
            enterprise records.
          </AppText>
        </div>
        {companyOptions.length > 0 && (
          <AppStack direction="row" align="center" gap={1}>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              sx={{ height: 26, fontSize: "11px" }}
              onClick={() => onToggleAll(true)}
            >
              Select All
            </AppButton>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              sx={{ height: 26, fontSize: "11px" }}
              onClick={() => onToggleAll(false)}
            >
              Clear All
            </AppButton>
          </AppStack>
        )}
      </div>

      <div className="mt-4 border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[46px_minmax(200px,1fr)_minmax(200px,1.2fr)] border-b border-border bg-surface-alt px-4 py-2 text-[11.5px] font-bold text-text-muted">
          <div className="flex items-center">
            <AppCheckbox
              size="small"
              colorVariant="primary"
              checked={isAllChecked}
              onChange={(e) => onToggleAll(e.target.checked)}
              checkboxSx={checkboxSx}
            />
          </div>
          <div>Company Legal Identity</div>
          <div>Description Scope Parameters</div>
        </div>
        <div className="divide-y divide-border bg-surface">
          {companyOptions.length ? (
            companyOptions.map((company) => (
              <div
                key={company.value}
                className="grid grid-cols-[46px_minmax(200px,1fr)_minmax(200px,1.2fr)] items-center px-4 py-2.5 text-[12.5px]"
              >
                <div className="flex items-center">
                  <AppCheckbox
                    size="small"
                    colorVariant="primary"
                    checked={(formData.companyIds || []).includes(
                      company.value,
                    )}
                    onChange={(e) =>
                      onCompanyCheck(company.value, e.target.checked)
                    }
                    checkboxSx={checkboxSx}
                  />
                </div>
                <div className="flex items-center gap-2 font-bold text-text">
                  <HiOutlineBuildingOffice2 className="text-text-muted text-[15px]" />
                  <span>{company.label}</span>
                </div>
                <div className="text-text-muted truncate pr-4">
                  {company.description}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-text-muted text-[12px] bg-surface">
              No workspace company profiles loaded in account.
            </div>
          )}
        </div>
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
          Continue to Branches
        </AppButton>
      </div>
    </AppCard>
  );
};

const Step3Form = ({
  filteredBranchOptions,
  formData,
  onBranchCheck,
  onToggleAll,
  handleBack,
  handleContinue,
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
      shadow="sm"
      padding="none"
      sx={formMainCardSx}
    >
      <div className="border-b border-border pb-3 flex items-center justify-between">
        <div>
          <AppHeading level={2} weight={700} sx={sectionTitleSx}>
            3. Physical Store Branch Access
          </AppHeading>
          <AppText variant="body2" sx={sectionSubtitleSx}>
            Select specific physical locations. Uncheck everything to assign
            zero child branch rows safely.
          </AppText>
        </div>
        {filteredBranchOptions.length > 0 && (
          <AppStack direction="row" align="center" gap={1}>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              sx={{ height: 26, fontSize: "11px" }}
              onClick={() => onToggleAll(true)}
            >
              Select All
            </AppButton>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              sx={{ height: 26, fontSize: "11px" }}
              onClick={() => onToggleAll(false)}
            >
              Clear All
            </AppButton>
          </AppStack>
        )}
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-alt py-8 text-center text-text-muted text-[12px]">
            <FiRefreshCw className="animate-spin mx-auto text-[20px] mb-2 text-primary" />
            Loading filtered database outlets parameters matrix...
          </div>
        ) : filteredBranchOptions.length > 0 ? (
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-[46px_1fr_1fr_1fr] border-b border-border bg-surface-alt px-4 py-2 text-[11.5px] font-bold text-text-muted">
              <div className="flex items-center">
                <AppCheckbox
                  size="small"
                  colorVariant="primary"
                  checked={isAllChecked}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  checkboxSx={checkboxSx}
                />
              </div>
              <div>Branch Name</div>
              <div>Parent Corporate Group</div>
              <div>Location Address</div>
            </div>
            <div className="divide-y divide-border bg-surface">
              {filteredBranchOptions.map((branch) => (
                <div
                  key={branch.value}
                  className="grid grid-cols-[46px_1fr_1fr_1fr] items-center px-4 py-2.5 text-[12.5px]"
                >
                  <div className="flex items-center">
                    <AppCheckbox
                      size="small"
                      colorVariant="primary"
                      checked={(formData.branchIds || []).includes(
                        branch.value,
                      )}
                      onChange={(e) =>
                        onBranchCheck(branch.value, e.target.checked)
                      }
                      checkboxSx={checkboxSx}
                    />
                  </div>
                  <div className="flex items-center gap-2 font-bold text-text">
                    <LuStore className="text-text-muted text-[15px]" />
                    <span>{branch.label}</span>
                  </div>
                  <div className="text-text-muted text-[12px] font-medium">
                    {branch.companyName}
                  </div>
                  <div className="text-text-muted truncate pr-2 text-[12px]">
                    {branch.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface-alt py-8 px-4 text-center">
            <FiInfo className="mx-auto text-[24px] text-text-muted mb-1.5" />
            <AppHeading level={4} weight={700} sx={{ m: 0, fontSize: "13px" }}>
              No Eligible Child Outlets Loaded
            </AppHeading>
            <AppText
              variant="body2"
              sx={{
                mt: 0.5,
                fontSize: "11.5px",
                color: "var(--app-color-text-muted)",
              }}
            >
              No child branch options loaded because no company scopes were
              checked in Step 2. You can freely continue forward to save clean
              zero-access configurations.
            </AppText>
          </div>
        )}
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
          Review Access Summary
        </AppButton>
      </div>
    </AppCard>
  );
};

const Step4Form = ({
  selectedMember,
  accessSummary,
  formErrors,
  isSubmitting,
  handleBack,
  handleSaveDraft,
  handleSubmit,
  onEditStep,
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
        title="4. Final Verification Summary"
        stepId={1}
        onEdit={onEditStep}
        labelText="Change Operator"
      />
      <div className="mt-4 flex items-center justify-between text-[12.5px]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">
            {selectedMember?.displayName ? selectedMember.displayName[0] : "S"}
          </div>
          <div>
            <span className="block font-bold text-text">
              {selectedMember?.displayName || "Operator Target"}
            </span>
            <span className="block text-[11px] text-text-muted mt-0.5">
              {selectedMember?.displayEmail}
            </span>
          </div>
        </div>
        <div className="text-right pr-1">
          <span className="text-text-muted">Assigned System Role:</span>{" "}
          <strong className="text-primary">
            {selectedMember?.displayRole || "-"}
          </strong>
        </div>
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
        title="Access Mapping Scope Authorization Matrix"
        stepId={2}
        onEdit={onEditStep}
        labelText="Modify Node Rules"
      />
      <div className="mt-4 grid grid-cols-2 gap-4 text-[12px]">
        <div className="border border-border rounded-xl p-3 bg-surface-alt">
          <span className="block font-bold text-text-muted mb-2 uppercase tracking-wide text-[10.5px]">
            Companies Assigned ({accessSummary.selectedCompanies.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
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
              <span className="text-text-muted text-[11px] font-medium">
                No company records assigned (Clear Access)
              </span>
            )}
          </div>
        </div>
        <div className="border border-border rounded-xl p-3 bg-surface-alt">
          <span className="block font-bold text-text-muted mb-2 uppercase tracking-wide text-[10.5px]">
            Branches Enabled Outlets ({accessSummary.selectedBranches.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
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
              <span className="text-text-muted text-[11px] font-medium">
                No store branches assigned (Clear Access)
              </span>
            )}
          </div>
        </div>
      </div>
    </AppCard>

    {formErrors.submit && (
      <AppAlert severity="error" variant="soft" rounded="md" sx={{ mt: 2 }}>
        {formErrors.submit}
      </AppAlert>
    )}

    <div className="mt-6 flex items-center justify-between border-t border-border bg-surface rounded-xl border p-3 shadow-xs">
      <AppButton
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiArrowLeft />}
        onClick={handleBack}
        disabled={isSubmitting}
        sx={secondaryActionBtnSx}
      >
        Back
      </AppButton>
      <AppStack direction="row" align="center" gap={1}>
        <AppButton
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
          sx={secondaryActionBtnSx}
        >
          Save Draft
        </AppButton>
        <AppButton
          variant="contained"
          colorVariant="primary"
          rounded="md"
          size="small"
          startIcon={<FiCheckCircle />}
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          sx={primaryActionBtnSx}
        >
          Confirm & Assign Access
        </AppButton>
      </AppStack>
    </div>
  </div>
);

const ReviewSectionHeader = ({ title, stepId, onEdit, labelText }) => (
  <div className="flex items-center justify-between border-b border-border pb-2">
    <AppHeading level={4} weight={700} sx={{ m: 0, fontSize: "13px" }}>
      {title}
    </AppHeading>
    <AppButton
      variant="outlined"
      colorVariant="neutral"
      rounded="md"
      size="small"
      onClick={() => onEdit(stepId)}
      sx={{
        height: 24,
        fontSize: "10.5px",
        px: 1,
        bgcolor: "var(--app-color-surface-alt)",
      }}
    >
      {labelText}
    </AppButton>
  </div>
);

/* ==========================================================================
   SIDEBAR COMPONENT
   ========================================================================== */

const RightSidebarPanel = memo(
  ({ currentStep, selectedMember, accessSummary }) => {
    const sidebarCards = [
      {
        title: "Assignment Summary",
        icon: <FiUsers />,
        colorVariant: "primary",
        variant: "default",
        custom: (
          <div className="mt-3 space-y-3 border-t border-border pt-3 text-[12px]">
            <div>
              <span className="block text-[10.5px] font-bold text-text-muted uppercase">
                Target Employee
              </span>
              <span className="block font-bold text-text mt-0.5">
                {selectedMember?.displayName || "Not Selected"}
              </span>
            </div>
            <div>
              <span className="block text-[10.5px] font-bold text-text-muted uppercase">
                Companies Scope
              </span>
              <span className="block font-semibold text-text mt-0.5">
                {accessSummary.companyAccessLabel}
              </span>
            </div>
            <div>
              <span className="block text-[10.5px] font-bold text-text-muted uppercase">
                Branches Scope
              </span>
              <span className="block font-semibold text-text mt-0.5">
                {accessSummary.branchAccessLabel}
              </span>
            </div>
          </div>
        ),
      },
      HELP_SUPPORT_CARD,
    ];
    return <PageRightSidebar spacing={4} cards={sidebarCards} />;
  },
);
RightSidebarPanel.displayName = "RightSidebarPanel";

/* ==========================================================================
   FIXED STYLES TOKENS MAP MAPS (ADDED ALERTSX VARIABLE)
   ========================================================================== */

const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1": {
    m: 0,
    fontSize: "24px",
    color: "var(--app-color-text)",
    fontWeight: 750,
  },
};
const breadcrumbSx = { mt: 0.5 };
const breadcrumbItemSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "11.5px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};
const secondaryButtonSx = {
  height: 34,
  px: 1.2,
  fontSize: "11.5px",
  fontWeight: 650,
};
const stepperCardSx = {
  px: 2,
  py: 1.8,
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
  fontSize: "14.5px",
  color: "var(--app-color-text)",
};
const sectionSubtitleSx = {
  mt: 0.5,
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const labelSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  mb: 0.5,
};
const inputSx = {
  minHeight: 38,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface-alt)",
};
const primaryActionBtnSx = {
  height: 36,
  px: 1.8,
  fontSize: "12.5px",
  fontWeight: 700,
};
const secondaryActionBtnSx = {
  height: 36,
  px: 1.5,
  fontSize: "12.5px",
  fontWeight: 650,
};
const checkboxSx = { p: 0 };
const errorTextSx = {
  mt: 1,
  fontSize: "11.5px",
  color: "var(--app-color-error)",
};
const reviewCardSx = {
  p: 2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

// FIXED: Defined missing styling variable layer mapping token parameters
const alertSx = { mt: 2, fontSize: "12.5px" };

export default AssignAccessDesktopPage;
