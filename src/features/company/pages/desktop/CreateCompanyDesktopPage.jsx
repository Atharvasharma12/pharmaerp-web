// src/features/company/pages/desktop/CreateCompanyDesktopPage.jsx

import { memo } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiEdit3,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiInfo,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

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

const CreateCompanyDesktopPage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
    currentStep = 1,

    companyTypeOptions = [],
    industryOptions = [],
    licenseStatusOptions = [],

    handleChange,
    handleSubmit,
    handleBack,
    handleContinue,
    handleStepChange,
    handleSaveDraft,
    handleCancel,
    handleResetAndRefresh,
  }) => {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <PageHeader
            title="Create New Company"
            subtitle={
              currentStep === 5
                ? "Review all details before creating your company."
                : "Add your company details and set up your business profile."
            }
            extra={
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Companies", onClick: handleCancel },
                  { label: "Create Company", current: true },
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
                  <CompanyDetailsForm
                    formData={formData}
                    formErrors={formErrors}
                    companyTypeOptions={companyTypeOptions}
                    industryOptions={industryOptions}
                    handleChange={handleChange}
                    handleCancel={handleCancel}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 2 && (
                  <OwnerDetailsForm
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 3 && (
                  <AddressForm
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 4 && (
                  <LicenseAndIdentityForm
                    formData={formData}
                    formErrors={formErrors}
                    licenseStatusOptions={licenseStatusOptions}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 5 && (
                  <ReviewAndCreateStep
                    formData={formData}
                    companyTypeOptions={companyTypeOptions}
                    industryOptions={industryOptions}
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
            <RightSidebarPanel
              currentStep={currentStep}
              formData={formData}
              onResetDraft={handleCancel}
            />
          </div>
        </div>
      </section>
    );
  },
);

CreateCompanyDesktopPage.displayName = "CreateCompanyDesktopPage";

/* ==========================================================================
   TOP WORKFLOW PROGRESS STEPPER (Tight layout with visual overflow mask)
   ========================================================================== */

const TopStepper = memo(({ currentStep, onStepChange }) => {
  const steps = [
    { id: 1, title: "Company Details", label: "Basic information" },
    { id: 2, title: "Owner Info", label: "Business ownership" },
    { id: 3, title: "Address", label: "Registered office" },
    { id: 4, title: "Licenses & Tax", label: "Statutory parameters" },
    { id: 5, title: "Review & Create", label: "Final confirmation" },
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
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${completed
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

const CompanyDetailsForm = ({
  formData,
  formErrors,
  companyTypeOptions,
  industryOptions,
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
        Company Details
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Enter core identifiers and communication channels mapping your root
        business profile.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Company Name"
        name="companyName"
        value={formData.companyName || ""}
        onChange={handleChange}
        placeholder="Enter company name"
        required
        error={Boolean(formErrors.companyName)}
        helperText={formErrors.companyName}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppSelect
        label="Company Type"
        name="companyType"
        value={formData.companyType || ""}
        onChange={handleChange}
        options={companyTypeOptions}
        required
        error={Boolean(formErrors.companyType)}
        helperText={formErrors.companyType}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Email Address"
        name="companyEmail"
        value={formData.companyEmail || ""}
        onChange={handleChange}
        placeholder="Enter company email address"
        required
        error={Boolean(formErrors.companyEmail)}
        helperText={formErrors.companyEmail}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <div className="flex flex-col">
        <label className="mb-1 text-[12.5px] font-bold text-text">
          Phone Number <span className="text-error">*</span>
        </label>
        <div className="flex gap-2">
          <div className="w-[95px]">
            <AppSelect
              name="countryCode"
              value="India (+91)"
              options={[{ label: "🇮🇳 +91", value: "India (+91)" }]}
              disabled
              inputSx={inputSx}
            />
          </div>
          <div className="flex-1">
            <AppInput
              name="companyPhone"
              value={formData.companyPhone || ""}
              onChange={handleChange}
              placeholder="Enter phone number"
              error={Boolean(formErrors.companyPhone)}
              helperText={formErrors.companyPhone}
              inputSx={inputSx}
            />
          </div>
        </div>
      </div>
      <AppInput
        label="Website (Optional)"
        name="website"
        value={formData.website || ""}
        onChange={handleChange}
        placeholder="https://www.company.com"
        startIcon={<FiGlobe className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppSelect
        label="Industry"
        name="industry"
        value={formData.industry || ""}
        onChange={handleChange}
        options={industryOptions}
        required
        error={Boolean(formErrors.industry)}
        helperText={formErrors.industry}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <div className="col-span-2">
        <AppInput
          label="Company Description (Optional)"
          name="companyDescription"
          value={formData.companyDescription || ""}
          onChange={handleChange}
          placeholder="Enter a brief description about your company"
          labelSx={labelSx}
          inputSx={inputSx}
          multiline
          rows={3}
        />
      </div>
    </div>

    <div className="mt-5">
      <label className="block text-[12.5px] font-bold text-text mb-1">
        Company Logo (Optional)
      </label>
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-alt py-5 text-center cursor-pointer hover:bg-surface-hover">
          <FiUploadCloud className="text-[20px] text-primary" />
          <AppText variant="body2" sx={{ fontSize: "12px" }}>
            <span className="font-bold text-primary">
              Drag and drop your logo here,
            </span>{" "}
            or click to browse
            <span className="block mt-0.5 text-[10.5px] text-text-muted">
              PNG, JPG or SVG (Max. 2MB)
            </span>
          </AppText>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-primary-soft text-primary text-[24px]">
          <HiOutlineBuildingOffice2 />
        </div>
        <AppButton
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          sx={{ height: 34, fontSize: "11.5px" }}
        >
          Remove
        </AppButton>
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

const OwnerDetailsForm = ({
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
        Owner Details
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Configure accountability parameters mapping individual person entities
        to database records.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Owner Name"
        name="ownerName"
        value={formData.ownerName || ""}
        onChange={handleChange}
        placeholder="Enter operator/owner full name"
        startIcon={<FiUser className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Owner Email"
        name="ownerEmail"
        value={formData.ownerEmail || ""}
        onChange={handleChange}
        placeholder="owner@company.com"
        error={Boolean(formErrors.ownerEmail)}
        helperText={formErrors.ownerEmail}
        startIcon={<FiMail className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Owner Mobile"
        name="ownerMobile"
        value={formData.ownerMobile || ""}
        onChange={handleChange}
        placeholder="Enter 10-digit mobile number"
        error={Boolean(formErrors.ownerMobile)}
        helperText={formErrors.ownerMobile}
        startIcon={<FiPhone className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Owner Aadhaar"
        name="ownerAadhaar"
        value={formData.ownerAadhaar || ""}
        onChange={handleChange}
        placeholder="Enter 12-digit UIDAI record"
        error={Boolean(formErrors.ownerAadhaar)}
        helperText={formErrors.ownerAadhaar}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <div className="col-span-2">
        <AppInput
          label="Owner PAN"
          name="ownerPan"
          value={formData.ownerPan || ""}
          onChange={handleChange}
          placeholder="Enter uppercase permanent account number"
          error={Boolean(formErrors.ownerPan)}
          helperText={formErrors.ownerPan}
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
        Registered Office Address
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Define structural location details directly required for invoice
        printing templates.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Address Line 1"
        name="addressLine1"
        value={formData.addressLine1 || ""}
        onChange={handleChange}
        placeholder="Flat/Plot, Building, Street name"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Address Line 2"
        name="addressLine2"
        value={formData.addressLine2 || ""}
        onChange={handleChange}
        placeholder="Locality, Sector, Landmark (Optional)"
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
        placeholder="Enter 6-digit postal index"
        error={Boolean(formErrors.pincode)}
        helperText={formErrors.pincode}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <div className="col-span-2">
        <AppInput
          label="Country"
          name="country"
          value={formData.country || ""}
          onChange={handleChange}
          placeholder="India"
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
        Save & Continue
      </AppButton>
    </div>
  </AppCard>
);

const LicenseAndIdentityForm = ({
  formData,
  formErrors,
  licenseStatusOptions,
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
        Licenses & Identity Information
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Configure state tracking compliance, industry regulatory numbers, and
        tax properties.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="GSTIN"
        name="gstNumber"
        value={formData.gstNumber || ""}
        onChange={handleChange}
        placeholder="Enter 15-digit corporate GSTIN"
        error={Boolean(formErrors.gstNumber)}
        helperText={formErrors.gstNumber}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="PAN Number"
        name="panNumber"
        value={formData.panNumber || ""}
        onChange={handleChange}
        placeholder="Enter 10-character root PAN"
        error={Boolean(formErrors.panNumber)}
        helperText={formErrors.panNumber}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="License Type"
        name="licenseType"
        value={formData.licenseType || ""}
        onChange={handleChange}
        placeholder="e.g. Drug License"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="FSSAI Number"
        name="fssaiNumber"
        value={formData.fssaiNumber || ""}
        onChange={handleChange}
        placeholder="Enter 14-digit FSSAI authority record"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Retail License Number"
        name="retailLicenseNumber"
        value={formData.retailLicenseNumber || ""}
        onChange={handleChange}
        placeholder="Form 20 / Form 21 identifiers"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Wholesale License Number"
        name="wholesaleLicenseNumber"
        value={formData.wholesaleLicenseNumber || ""}
        onChange={handleChange}
        placeholder="Form 20B / Form 21B identifiers"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Issued At"
        name="licenseIssuedAt"
        value={formData.licenseIssuedAt || ""}
        onChange={handleChange}
        placeholder="YYYY-MM-DD"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Expires At"
        name="licenseExpiresAt"
        value={formData.licenseExpiresAt || ""}
        onChange={handleChange}
        placeholder="YYYY-MM-DD"
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <div className="col-span-2">
        <AppSelect
          label="License Status"
          name="licenseStatus"
          value={formData.licenseStatus || ""}
          onChange={handleChange}
          options={licenseStatusOptions}
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
  companyTypeOptions,
  industryOptions,
  isCreating,
  onBack,
  onSaveDraft,
  onSubmit,
  onEditSection,
}) => {
  const resolvedTypeLabel =
    companyTypeOptions.find((opt) => opt.value === formData.companyType)
      ?.label || formData.companyType;
  const resolvedIndustryLabel =
    industryOptions.find((opt) => opt.value === formData.industry)?.label ||
    formData.industry ||
    "Not provided";

  return (
    <div className="space-y-4">
      {/* 1. Company Overview Summary Card */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="sm"
        padding="none"
        sx={reviewCardSx}
      >
        <ReviewSectionHeader
          title="Company Overview"
          stepId={1}
          onEdit={onEditSection}
        />

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4 min-w-[320px]">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-primary-soft text-primary text-[28px]">
              <HiOutlineBuildingOffice2 />
            </div>
            <div className="min-w-0">
              <AppStack direction="row" align="center" gap={1}>
                <AppHeading level={3} weight={700} sx={reviewCompNameSx}>
                  {formData.companyName || "MedPlus Healthcare Pvt. Ltd."}
                </AppHeading>
                <AppTag
                  label={resolvedIndustryLabel}
                  variant="soft"
                  colorVariant="success"
                  rounded="md"
                  sx={smallReviewTagSx}
                />
              </AppStack>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-2 text-[12px] text-text-muted">
                  <FiMail className="shrink-0" />{" "}
                  <span>
                    {formData.companyEmail || "contact@medplushealthcare.com"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-text-muted">
                  <FiPhone className="shrink-0" />{" "}
                  <span>
                    {formData.companyPhone
                      ? `+91 ${formData.companyPhone}`
                      : "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-text-muted">
                  <FiGlobe className="shrink-0" />{" "}
                  <span>{formData.website || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 grid grid-cols-2 gap-x-4 gap-y-2.5 max-w-[480px]">
            <ReviewItem label="Company Type" value={resolvedTypeLabel} />
            <ReviewItem
              label="Operational Status"
              value={<span className="capitalize">{formData.status}</span>}
            />
            {formData.companyDescription && (
              <div className="col-span-2">
                <ReviewItem
                  label="Description"
                  value={formData.companyDescription}
                />
              </div>
            )}
          </div>
        </div>
      </AppCard>

      {/* 2. Owner & Address Layout Grid Card Row */}
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
            title="Ownership Identity Details"
            stepId={2}
            onEdit={onEditSection}
          />
          <div className="mt-4 space-y-2">
            <ReviewRowData
              label="Owner Full Name"
              value={formData.ownerName || "-"}
            />
            <ReviewRowData
              label="Owner Email"
              value={formData.ownerEmail || "-"}
            />
            <ReviewRowData
              label="Owner Mobile"
              value={formData.ownerMobile || "-"}
            />
            <ReviewRowData
              label="Owner Aadhaar"
              value={formData.ownerAadhaar || "-"}
            />
            <ReviewRowData label="Owner PAN" value={formData.ownerPan || "-"} />
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
            title="Registered Address"
            stepId={3}
            onEdit={onEditSection}
          />
          <div className="mt-4 space-y-2">
            <ReviewRowData
              label="Address"
              value={`${formData.addressLine1 || "-"} ${formData.addressLine2 || ""}`}
            />
            <ReviewRowData label="City" value={formData.city || "-"} />
            <ReviewRowData label="District" value={formData.district || "-"} />
            <ReviewRowData label="State" value={formData.state || "-"} />
            <ReviewRowData label="PIN Code" value={formData.pincode || "-"} />
            <ReviewRowData
              label="Country"
              value={formData.country || "India"}
            />
          </div>
        </AppCard>
      </div>

      {/* 3. Statutory Licenses & Corporate Identifiers */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="sm"
        padding="none"
        sx={reviewCardSx}
      >
        <ReviewSectionHeader
          title="Licenses & Tax Parameters"
          stepId={4}
          onEdit={onEditSection}
        />
        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
          <ReviewRowData label="GSTIN" value={formData.gstNumber || "-"} />
          <ReviewRowData
            label="Root PAN Card"
            value={formData.panNumber || "-"}
          />
          <ReviewRowData
            label="License Type"
            value={formData.licenseType || "-"}
          />
          <ReviewRowData
            label="FSSAI Code"
            value={formData.fssaiNumber || "-"}
          />
          <ReviewRowData
            label="Retail License"
            value={formData.retailLicenseNumber || "-"}
          />
          <ReviewRowData
            label="Wholesale License"
            value={formData.wholesaleLicenseNumber || "-"}
          />
          <ReviewRowData
            label="Issued At Date"
            value={formData.licenseIssuedAt || "-"}
          />
          <ReviewRowData
            label="Expires At Date"
            value={formData.licenseExpiresAt || "-"}
          />
          <div className="col-span-2 border-t border-border pt-1.5 mt-1">
            <ReviewRowData
              label="License Status Flag"
              value={
                <span className="uppercase font-bold text-primary">
                  {formData.licenseStatus}
                </span>
              }
            />
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
            Create Company
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
      title: "Company Details",
      text: "Basic company profile core metrics",
    },
    { id: 2, title: "Owner Info", text: "Individual governance entity links" },
    {
      id: 3,
      title: "Address",
      text: "Registered workplace spatial boundaries",
    },
    {
      id: 4,
      title: "Licenses & Tax",
      text: "Statutory parameters and tracking flag properties",
    },
    {
      id: 5,
      title: "Review & Create",
      text: "Final operational schema audit confirmation",
    },
  ];

  const cards = [
    {
      title: "Step Progress",
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
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${completed
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
        "Providing true, validated licensing parameters ensures seamless operations configuration setups.",
      points: [
        "Automatic company code mapping",
        "Unique partial-index tracking",
        "Encrypted statutory logging structures",
        "Unified workspace dashboard auditing",
      ],
      pointIcon: <FiCheckCircle />,
    });
  } else {
    cards.push(
      {
        title: "Company Summary",
        icon: <HiOutlineBuildingOffice2 />,
        colorVariant: "success",
        variant: "default",
        custom: (
          <div className="mt-3 space-y-2.5 border-t border-border pt-3">
            <AppStack direction="row" align="center" gap={1}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success text-[18px]">
                <HiOutlineBuildingOffice2 />
              </div>
              <div className="min-w-0">
                <AppHeading
                  level={4}
                  weight={700}
                  sx={{ m: 0, fontSize: "12.5px" }}
                >
                  {formData.companyName || "MedPlus Healthcare"}
                </AppHeading>
                <AppTag
                  label="Active Setup"
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
                  {formData.companyType?.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiUser />{" "}
                <span>{formData.ownerName || "Owner not declared"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiFileText />{" "}
                <span>{formData.gstNumber || "No GSTIN attached"}</span>
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
        title: "Database Commit Action",
        icon: <FiCheckCircle />,
        colorVariant: "primary",
        variant: "soft",
        soft: true,
        points: [
          "Unique model slugs compile on validation hook fires.",
          "Pre-validate sequences generate missing parameters.",
          "Partial index configurations flag duplicated entries.",
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
   STYLE THEME OBJECT MAPS (SX TOKENS Synchronized with Roles Layout)
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

export default CreateCompanyDesktopPage;
