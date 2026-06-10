// src/features/branch/pages/desktop/CreateBranchDesktopPage.jsx

import { memo, useCallback } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiEdit3,
  FiFileText,
  FiGrid,
  FiInfo,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";

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
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
  AppText,
} from "@/components";

const CreateBranchDesktopPage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
    currentStep = 1,

    branchTypeOptions = [],
    booleanOptions = [],

    handleChange,
    handleSubmit,
    handleBack,
    handleContinue,
    handleStepChange,
    handleSaveDraft,
    handleCancel,
  }) => {
    // Function triggered when the header Refresh button is clicked
    const handleResetAndRefresh = useCallback(() => {
      handleStepChange?.(1);

      if (formData) {
        Object.keys(formData).forEach((key) => {
          let defaultValue = "";
          if (Array.isArray(formData[key])) defaultValue = [];
          if (typeof formData[key] === "boolean") defaultValue = false;
          if (key === "isPrimary") defaultValue = "false";
          if (key === "branchType") defaultValue = "retail";
          if (key === "country") defaultValue = "India";

          handleChange?.({
            target: {
              name: key,
              value: defaultValue,
            },
          });
        });
      }
    }, [formData, handleChange, handleStepChange]);

    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <PageHeader
            title="Create New Branch"
            subtitle={
              currentStep === 5
                ? "Review all legal parameters and locations before deploying your branch."
                : "Configure operational parameters, addresses, compliance targets, and licenses."
            }
            extra={
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Branches", onClick: handleCancel },
                  { label: "Create Branch", current: true },
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
              {/* Top Step Progress Tracker */}
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
                  <BranchDetailsForm
                    formData={formData}
                    formErrors={formErrors}
                    branchTypeOptions={branchTypeOptions}
                    booleanOptions={booleanOptions}
                    handleChange={handleChange}
                    handleCancel={handleCancel}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 2 && (
                  <AddressForm
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 3 && (
                  <LicenseForm
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 4 && (
                  <ComplianceContactsForm
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 5 && (
                  <ReviewAndCreateStep
                    formData={formData}
                    isCreating={isLoading}
                    onBack={handleBack}
                    onSaveDraft={handleSaveDraft}
                    onSubmit={handleSubmit}
                    onEditSection={handleStepChange}
                  />
                )}
              </AppBox>
            </AppBox>

            {/* Right Sidebar Utility Panels */}
            <RightSidebarPanel currentStep={currentStep} formData={formData} />
          </div>
        </div>
      </section>
    );
  },
);

CreateBranchDesktopPage.displayName = "CreateBranchDesktopPage";

/* ==========================================================================
   TOP WORKFLOW PROGRESS STEPPER
   ========================================================================== */

const TopStepper = memo(({ currentStep, onStepChange }) => {
  const steps = [
    { id: 1, title: "Branch Details", label: "Profile parameters" },
    { id: 2, title: "Address Details", label: "Registered location" },
    { id: 3, title: "Statutory Licenses", label: "Drug & FSSAI tags" },
    { id: 4, title: "Compliance Contacts", label: "Accountability links" },
    { id: 5, title: "Review & Create", label: "Final verification" },
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
   ACTIVE STEPS FORM MODULES (STEPS 1 - 4)
   ========================================================================== */

const BranchDetailsForm = ({
  formData,
  formErrors,
  branchTypeOptions,
  booleanOptions,
  handleChange,
  handleCancel,
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
        Branch Core Profile
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Provide core naming structures, communications routing endpoints, and
        infrastructure modes.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Branch Name"
        name="branchName"
        value={formData.branchName || ""}
        onChange={handleChange}
        placeholder="Enter branch name"
        required
        error={Boolean(formErrors.branchName)}
        helperText={formErrors.branchName}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppSelect
        label="Branch Type"
        name="branchType"
        value={formData.branchType || ""}
        onChange={handleChange}
        options={branchTypeOptions}
        required
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppSelect
        label="Primary Location Flag"
        name="isPrimary"
        value={formData.isPrimary || "false"}
        onChange={handleChange}
        options={booleanOptions}
        required
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Branch Email Address"
        name="branchEmail"
        value={formData.branchEmail || ""}
        onChange={handleChange}
        placeholder="branch@company.com"
        error={Boolean(formErrors.branchEmail)}
        helperText={formErrors.branchEmail}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Mobile Number"
        name="mobile"
        value={formData.mobile || ""}
        onChange={handleChange}
        placeholder="Enter 10-digit mobile number"
        error={Boolean(formErrors.mobile)}
        helperText={formErrors.mobile}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="WhatsApp Number"
        name="whatsapp"
        value={formData.whatsapp || ""}
        onChange={handleChange}
        placeholder="Enter WhatsApp communication link"
        error={Boolean(formErrors.whatsapp)}
        helperText={formErrors.whatsapp}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <div className="col-span-2">
        <AppInput
          label="Landline Number (Optional)"
          name="landline"
          value={formData.landline || ""}
          onChange={handleChange}
          placeholder="Enter area code and landline number"
          labelSx={labelSx}
          inputSx={inputSx}
        />
      </div>
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
        Save & Continue
      </AppButton>
    </div>
  </AppCard>
);

const AddressForm = ({
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
        Registered Branch Address
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Physical spatial mapping directly bound to tax reporting setups and
        invoice templates.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Address Line 1"
        name="addressLine1"
        value={formData.addressLine1 || ""}
        onChange={handleChange}
        placeholder="Plot, Building, Commercial complex unit"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Address Line 2"
        name="addressLine2"
        value={formData.addressLine2 || ""}
        onChange={handleChange}
        placeholder="Locality, Sector, Landmark parameters"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="City"
        name="city"
        value={formData.city || ""}
        onChange={handleChange}
        placeholder="Enter City"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="District"
        name="district"
        value={formData.district || ""}
        onChange={handleChange}
        placeholder="Enter District"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="State"
        name="state"
        value={formData.state || ""}
        onChange={handleChange}
        placeholder="Enter State"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Pincode"
        name="pincode"
        value={formData.pincode || ""}
        onChange={handleChange}
        placeholder="6-digit PIN code map index"
        error={Boolean(formErrors.pincode)}
        helperText={formErrors.pincode}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Country"
        name="country"
        value={formData.country || ""}
        onChange={handleChange}
        placeholder="India"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Google Map Location Link"
        name="googleMapLocation"
        value={formData.googleMapLocation || ""}
        onChange={handleChange}
        placeholder="https://maps.google.com/?q=..."
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

const LicenseForm = ({
  formData,
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
        Statutory Compliance Licenses
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Configure trackable pharmacy compliance logs and operational parameters.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Drug License Number"
        name="drugLicenseNumber"
        value={formData.drugLicenseNumber || ""}
        onChange={handleChange}
        placeholder="Form 20 / Form 21 identifiers"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Drug License Type"
        name="drugLicenseType"
        value={formData.drugLicenseType || ""}
        onChange={handleChange}
        placeholder="e.g., Retail / Wholesale mapping parameters"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="FSSAI Number"
        name="fssaiNumber"
        value={formData.fssaiNumber || ""}
        onChange={handleChange}
        placeholder="Enter 14-digit food compliance token"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="License Expiry Date"
        name="licenseExpiresAt"
        type="date"
        value={formData.licenseExpiresAt || ""}
        onChange={handleChange}
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

const ComplianceContactsForm = ({
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
        Compliance Contacts & Pharmacist Links
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Link technical operators, pharmacy practitioners, and emergency contacts
        to records.
      </AppText>
    </div>

    <div className="mt-4">
      <AppHeading
        level={3}
        weight={700}
        sx={{ fontSize: "13px", mb: 2, color: "var(--app-color-primary)" }}
      >
        Pharmacist Parameters
      </AppHeading>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <AppInput
          label="Registered Pharmacist Name"
          name="pharmacistName"
          value={formData.pharmacistName || ""}
          onChange={handleChange}
          placeholder="Full name matching council logs"
          labelSx={labelSx}
          inputSx={inputSx}
        />
        <AppInput
          label="Pharmacy Registration Number"
          name="pharmacistRegistrationNumber"
          value={formData.pharmacistRegistrationNumber || ""}
          onChange={handleChange}
          placeholder="State council registration index"
          labelSx={labelSx}
          inputSx={inputSx}
        />
        <AppInput
          label="Pharmacist Mobile"
          name="pharmacistMobile"
          value={formData.pharmacistMobile || ""}
          onChange={handleChange}
          placeholder="Pharmacist phone contact record"
          error={Boolean(formErrors.pharmacistMobile)}
          helperText={formErrors.pharmacistMobile}
          labelSx={labelSx}
          inputSx={inputSx}
        />
        <AppInput
          label="Pharmacist Email"
          name="pharmacistEmail"
          value={formData.pharmacistEmail || ""}
          onChange={handleChange}
          placeholder="pharmacist@company.com"
          error={Boolean(formErrors.pharmacistEmail)}
          helperText={formErrors.pharmacistEmail}
          labelSx={labelSx}
          inputSx={inputSx}
        />
      </div>
    </div>

    <div className="mt-6 border-t border-border pt-4">
      <AppHeading
        level={3}
        weight={700}
        sx={{ fontSize: "13px", mb: 2, color: "var(--app-color-primary)" }}
      >
        Emergency Contact Link
      </AppHeading>
      <div className="grid grid-cols-3 gap-x-4 gap-y-4">
        <AppInput
          label="Contact Name"
          name="emergencyContactName"
          value={formData.emergencyContactName || ""}
          onChange={handleChange}
          placeholder="Full name"
          labelSx={labelSx}
          inputSx={inputSx}
        />
        <AppInput
          label="Contact Mobile"
          name="emergencyContactMobile"
          value={formData.emergencyContactMobile || ""}
          onChange={handleChange}
          placeholder="10-digit number"
          error={Boolean(formErrors.emergencyContactMobile)}
          helperText={formErrors.emergencyContactMobile}
          labelSx={labelSx}
          inputSx={inputSx}
        />
        <AppInput
          label="Relationship Mapping"
          name="emergencyContactRelationship"
          value={formData.emergencyContactRelationship || ""}
          onChange={handleChange}
          placeholder="e.g., Manager / Director"
          labelSx={labelSx}
          inputSx={inputSx}
        />
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
        Continue to Review
      </AppButton>
    </div>
  </AppCard>
);

/* ==========================================================================
   STEP 5: SCREEN REVIEW SECTIONS
   ========================================================================== */

const ReviewAndCreateStep = ({
  formData,
  isCreating,
  onBack,
  onSaveDraft,
  onSubmit,
  onEditSection,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Branch Overview Summary Card */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="sm"
        padding="none"
        sx={reviewCardSx}
      >
        <ReviewSectionHeader
          title="Branch Profile Overview"
          stepId={1}
          onEdit={onEditSection}
        />

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4 min-w-[320px]">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-primary-soft text-primary text-[28px]">
              <FiBriefcase />
            </div>
            <div className="min-w-0">
              <AppStack direction="row" align="center" gap={1}>
                <AppHeading level={3} weight={700} sx={reviewCompNameSx}>
                  {formData.branchName || "Main Retail Pharmacy Hub"}
                </AppHeading>
                {formData.isPrimary === "true" && (
                  <AppTag
                    label="Primary Branch"
                    variant="soft"
                    colorVariant="success"
                    rounded="md"
                    sx={smallReviewTagSx}
                  />
                )}
              </AppStack>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-2 text-[12px] text-text-muted">
                  <FiMail className="shrink-0" />{" "}
                  <span>{formData.branchEmail || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-text-muted">
                  <FiPhone className="shrink-0" />{" "}
                  <span>
                    {formData.mobile
                      ? `+91 ${formData.mobile}`
                      : "No mobile linked"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 grid grid-cols-2 gap-x-4 gap-y-2.5 max-w-[480px]">
            <ReviewItem
              label="Branch Infrastructure Type"
              value={
                <span className="capitalize">
                  {formData.branchType?.replace("_", " ")}
                </span>
              }
            />
            <ReviewItem
              label="WhatsApp Alert Comms"
              value={formData.whatsapp ? `+91 ${formData.whatsapp}` : "-"}
            />
          </div>
        </div>
      </AppCard>

      {/* 2. Address & Statutory Licenses Row */}
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
            title="Spatial Address Properties"
            stepId={2}
            onEdit={onEditSection}
          />
          <div className="mt-4 space-y-2">
            <ReviewRowData
              label="Address"
              value={`${formData.addressLine1 || "-"} ${formData.addressLine2 || ""}`}
            />
            <ReviewRowData
              label="City Workspace"
              value={formData.city || "-"}
            />
            <ReviewRowData
              label="District Boundary"
              value={formData.district || "-"}
            />
            <ReviewRowData label="State Record" value={formData.state || "-"} />
            <ReviewRowData
              label="Postal PIN Index"
              value={formData.pincode || "-"}
            />
            <ReviewRowData
              label="Country Identity"
              value={formData.country || "India"}
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
            title="Compliance Tracking Log"
            stepId={3}
            onEdit={onEditSection}
          />
          <div className="mt-4 space-y-2">
            <ReviewRowData
              label="Drug License Number"
              value={formData.drugLicenseNumber || "-"}
            />
            <ReviewRowData
              label="Drug License Classification"
              value={formData.drugLicenseType || "-"}
            />
            <ReviewRowData
              label="Food Authority FSSAI"
              value={formData.fssaiNumber || "-"}
            />
            <ReviewRowData
              label="Statutory Expiration Term"
              value={formData.licenseExpiresAt || "-"}
            />
          </div>
        </AppCard>
      </div>

      {/* 3. Practitioner & Emergency Entities */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="sm"
        padding="none"
        sx={reviewCardSx}
      >
        <ReviewSectionHeader
          title="Practitioner Registry & Points of Contact"
          stepId={4}
          onEdit={onEditSection}
        />
        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
          <ReviewRowData
            label="Pharmacist Practitioner"
            value={formData.pharmacistName || "-"}
          />
          <ReviewRowData
            label="Council Log Index"
            value={formData.pharmacistRegistrationNumber || "-"}
          />
          <ReviewRowData
            label="Pharmacist Mobile"
            value={formData.pharmacistMobile || "-"}
          />
          <ReviewRowData
            label="Pharmacist Email"
            value={formData.pharmacistEmail || "-"}
          />
          <div className="col-span-2 border-t border-border pt-2 mt-1">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <ReviewRowData
                label="Emergency Contact Person"
                value={formData.emergencyContactName || "-"}
              />
              <ReviewRowData
                label="Emergency Mobile"
                value={formData.emergencyContactMobile || "-"}
              />
              <ReviewRowData
                label="Relationship Flag"
                value={formData.emergencyContactRelationship || "-"}
              />
            </div>
          </div>
        </div>
      </AppCard>

      {/* 4. Action Bars Strip */}
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
        <AppStack direction="row" align="center" gap={1}>
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            onClick={onSaveDraft}
            disabled={isCreating}
            sx={secondaryActionBtnSx}
          >
            Save as Draft
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
            Create Branch
          </AppButton>
        </AppStack>
      </div>
    </div>
  );
};

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
    <div className="text-right font-bold text-text max-w-[300px] truncate">
      {value}
    </div>
  </div>
);

/* ==========================================================================
   RIGHT ASSISTANT PANEL COMPONENT
   ========================================================================== */

const RightSidebarPanel = memo(({ currentStep, formData }) => {
  const stepsMeta = [
    {
      id: 1,
      title: "Branch Parameters",
      text: "Name, communication types, and status fields",
    },
    {
      id: 2,
      title: "Spatial Location",
      text: "Workplace office geographical coordinates",
    },
    {
      id: 3,
      title: "Licenses & Trackers",
      text: "Drug registrations and food certification numbers",
    },
    {
      id: 4,
      title: "Technical Supervision",
      text: "Linked pharmacist practitioners and backup profiles",
    },
    {
      id: 5,
      title: "Review & Deploy",
      text: "Final operational audit sequence",
    },
  ];

  const cards = [
    {
      title: "Wizard Workflow Progress",
      icon: <FiGrid />,
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
  ];

  if (currentStep !== 5) {
    cards.push({
      title: "Statutory Guidelines",
      icon: <FiInfo />,
      colorVariant: "success",
      variant: "default",
      description:
        "Providing certified licensing records guarantees smooth operation validation procedures.",
      points: [
        "Automated index tracker generation",
        "Encrypted database slug verification",
        "Unique address pattern logging",
        "Direct point-of-contact schema tracking",
      ],
      pointIcon: <FiCheckCircle />,
    });
  } else {
    cards.push(
      {
        title: "Branch Configuration Summary",
        icon: <FiBriefcase />,
        colorVariant: "success",
        variant: "default",
        custom: (
          <div className="mt-3 space-y-2.5 border-t border-border pt-3">
            <AppStack direction="row" align="center" gap={1}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success text-[18px]">
                <FiBriefcase />
              </div>
              <div className="min-w-0">
                <AppHeading
                  level={4}
                  weight={700}
                  sx={{ m: 0, fontSize: "12.5px" }}
                >
                  {formData.branchName || "Retail Node"}
                </AppHeading>
                <AppTag
                  label={
                    formData.isPrimary === "true"
                      ? "Primary Core"
                      : "Sub Location Node"
                  }
                  variant="soft"
                  colorVariant="success"
                  rounded="md"
                  sx={{ height: 16, fontSize: "9px", px: 0.5, mt: 0.2 }}
                />
              </div>
            </AppStack>
            <div className="space-y-1.5 pt-1 text-[11.5px] text-text-muted">
              <div className="flex items-center gap-2">
                <FiBriefcase />{" "}
                <span className="capitalize">
                  {formData.branchType?.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiUser />{" "}
                <span>
                  {formData.pharmacistName || "No technical operator linked"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiFileText />{" "}
                <span>
                  {formData.drugLicenseNumber || "No drug license logged"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin />{" "}
                <span>
                  {formData.city || "No City declared"},{" "}
                  {formData.state || "No State"}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Database Index Actions",
        icon: <FiCheckCircle />,
        colorVariant: "primary",
        variant: "soft",
        soft: true,
        points: [
          "Unique branchCode prefix codes compile dynamically.",
          "Pre-validation schemas map automated lowertext slugs.",
          "Partial tracking constraints block duplicating entries.",
        ],
        pointIcon: <FiCheckCircle />,
      },
    );
  }

  cards.push(HELP_SUPPORT_CARD);

  return <PageRightSidebar spacing={4} cards={cards} />;
});
RightSidebarPanel.displayName = "RightSidebarPanel";

/* ==========================================================================
   STYLE THEME OBJECT MAPS (SX TOKENS)
   ========================================================================== */

const pageHeaderSx = {
  width: "100%",
};

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

const breadcrumbSx = {
  mt: 1,
};

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

export default CreateBranchDesktopPage;
