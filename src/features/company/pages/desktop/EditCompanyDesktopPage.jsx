// src/features/company/pages/desktop/EditCompanyDesktopPage.jsx

import React, { memo, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle,
  Edit3,
  FileText,
  Globe,
  Grid,
  Info,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  CloudUpload,
  User,
  Building2,
  AlertTriangle,
  Scale,
} from "lucide-react";

import {
  UIAlert,
  UIButton,
  UICard,
  UIInput,
  UISelect,
  UIBadge,
} from "@/components/ui";

const EditCompanyDesktopPage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
    isFetching = false,
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
    handleReload,
  }) => {
    const handleResetAndRefresh = React.useCallback(() => {
      handleStepChange?.(1);
      if (handleReload) handleReload();
    }, [handleReload, handleStepChange]);

    // Auto-scroll to the top of the page when navigating between steps
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentStep]);

    return (
      <section className="min-h-[100dvh] bg-bg px-4 sm:px-6 lg:px-0 py-6 sm:py-0 flex flex-col">
        <div className="mx-auto w-full max-w-7xl my-auto">
          {/* Top Section with Full Width Stepper and Reset Button */}
          <div className="mb-8 flex w-full flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 min-w-0">
              <TopStepper
                currentStep={currentStep}
                onStepChange={handleStepChange}
              />
            </div>
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetAndRefresh}
              loading={isLoading}
              disabled={isLoading}
              startIcon={<RotateCcw className="size-3.5" />}
              className="shrink-0 h-9 px-4 text-xs font-bold bg-surface"
            >
              Reset Form
            </UIButton>
          </div>

          <div className="w-full">
            {formErrors.submit && (
              <div className="mb-8">
                <UIAlert
                  intent="danger"
                  title="Submission Error"
                  description={formErrors.submit}
                />
              </div>
            )}

            {isFetching ? (
              <UICard className="p-12 flex flex-col items-center justify-center text-center bg-surface border-border shadow-sm">
                <RotateCcw className="animate-spin size-8 text-primary mb-3" />
                <p className="text-sm text-text-muted m-0">Retrieving corporate index models from database records...</p>
              </UICard>
            ) : (
            <form onSubmit={(e) => e.preventDefault()} className="w-full">
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
                  isUpdating={isLoading}
                  onBack={handleBack}
                  onSaveDraft={handleSaveDraft}
                  onSubmit={handleSubmit}
                  onEditSection={handleStepChange}
                />
              )}
            </form>
            )}
          </div>
        </div>
      </section>
    );
  },
);

EditCompanyDesktopPage.displayName = "EditCompanyDesktopPage";

/* ==========================================================================
   TOP WORKFLOW PROGRESS STEPPER (Compact)
   ========================================================================== */

const TopStepper = memo(({ currentStep, onStepChange }) => {
  const steps = [
    { id: 1, title: "Company Details", label: "Basic information" },
    { id: 2, title: "Owner Info", label: "Business ownership" },
    { id: 3, title: "Address", label: "Registered office" },
    { id: 4, title: "Licenses & Tax", label: "Statutory parameters" },
    { id: 5, title: "Review & Save", label: "Final confirmation" },
  ];

  return (
    <div className="w-full flex items-center justify-between overflow-x-auto no-scrollbar">
      {steps.map((step, idx) => {
        const active = currentStep === step.id;
        const completed = currentStep > step.id;

        return (
          <div
            key={step.id}
            className="flex-1 flex items-center min-w-[150px] last:min-w-fit"
          >
            <button
              type="button"
              onClick={() => onStepChange?.(step.id)}
              className="flex items-center gap-2 outline-none group cursor-pointer"
            >
              <div
                className={`flex shrink-0 size-7 items-center justify-center rounded-full text-[11px] font-bold transition-all group-hover:ring-4 group-hover:ring-primary/10 ${
                  completed
                    ? "bg-primary text-primary-contrast"
                    : active
                      ? "bg-primary text-primary-contrast ring-4 ring-primary/10"
                      : "bg-surface border border-border text-text-muted"
                }`}
              >
                {completed ? <Check className="size-3.5" /> : step.id}
              </div>
              <div className="flex flex-col items-start text-left min-w-0 max-w-[130px]">
                <span
                  className={`text-xs font-bold truncate w-full transition-colors ${
                    active || completed
                      ? "text-text"
                      : "text-text-muted group-hover:text-text"
                  }`}
                >
                  {step.title}
                </span>
                <span className="text-[10px] text-text-muted truncate w-full">
                  {step.label}
                </span>
              </div>
            </button>

            {idx < steps.length - 1 && (
              <div className="h-[2px] bg-border flex-1 mx-3 lg:mx-5 min-w-[12px] max-w-[30px] lg:max-w-none" />
            )}
          </div>
        );
      })}
    </div>
  );
});
TopStepper.displayName = "TopStepper";

/* ==========================================================================
   LAYOUT COMPONENT: SPLIT SECTION
   ========================================================================== */

const SplitSection = ({ title, description, icon: Icon, children }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-8">
    <div className="lg:col-span-4 lg:sticky lg:top-8">
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
        )}
        <h3 className="text-lg font-bold text-text m-0">{title}</h3>
      </div>
      <p className="text-sm text-text-muted leading-relaxed m-0">
        {description}
      </p>
    </div>
    <div className="lg:col-span-8">
      <UICard className="p-6 md:p-8 shadow-sm border-border bg-surface">
        {children}
      </UICard>
    </div>
  </div>
);

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
  <div className="space-y-2">
    <SplitSection
      title="Company Profile"
      description="Enter the core identifiers for your business. This information will be used as the root profile for all operational and invoicing contexts."
      icon={Building2}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="md:col-span-2">
          <UIInput
            label="Company Name"
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleChange}
            placeholder="e.g. MedPlus Healthcare Pvt. Ltd."
            required
            error={formErrors.companyName}
          />
        </div>
        <UISelect
          label="Company Type"
          name="companyType"
          value={formData.companyType || ""}
          onChange={(val) =>
            handleChange({ target: { name: "companyType", value: val } })
          }
          options={companyTypeOptions}
          required
          error={formErrors.companyType}
        />
        <UISelect
          label="Industry"
          name="industry"
          value={formData.industry || ""}
          onChange={(val) =>
            handleChange({ target: { name: "industry", value: val } })
          }
          options={industryOptions}
          required
          error={formErrors.industry}
        />
        <div className="md:col-span-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-text">
              Company Description (Optional)
            </label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription || ""}
              onChange={handleChange}
              placeholder="Describe your business operations briefly..."
              className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] resize-y transition-colors hover:border-border-hover"
            />
          </div>
        </div>
      </div>
    </SplitSection>

    <SplitSection
      title="Contact Details"
      description="Provide the primary communication channels. These will be used for official notifications and support communications."
      icon={Mail}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="md:col-span-2">
          <UIInput
            label="Email Address"
            name="companyEmail"
            value={formData.companyEmail || ""}
            onChange={handleChange}
            placeholder="contact@company.com"
            required
            error={formErrors.companyEmail}
            startIcon={<Mail className="text-text-muted size-4.5" />}
          />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[13px] font-semibold text-text">
            Phone Number <span className="text-error">*</span>
          </label>
          <div className="flex gap-3">
            <div className="w-[120px] shrink-0">
              <UISelect
                name="countryCode"
                value="India (+91)"
                options={[{ label: "🇮🇳 +91", value: "India (+91)" }]}
                disabled
              />
            </div>
            <div className="flex-1">
              <UIInput
                name="companyPhone"
                value={formData.companyPhone || ""}
                onChange={handleChange}
                placeholder="Enter 10-digit number"
                error={formErrors.companyPhone}
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <UIInput
            label="Website (Optional)"
            name="website"
            value={formData.website || ""}
            onChange={handleChange}
            placeholder="https://www.company.com"
            startIcon={<Globe className="text-text-muted size-4.5" />}
          />
        </div>
      </div>
    </SplitSection>

    <SplitSection
      title="Brand Assets"
      description="Upload your corporate logo. We recommend a high-resolution transparent PNG or SVG for best results on invoices."
      icon={CloudUpload}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-primary/5 text-primary">
          <Building2 className="size-8" />
        </div>
        <div className="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left">
          <div className="w-full relative group cursor-pointer">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept="image/png, image/jpeg, image/svg+xml"
            />
            <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-surface-alt py-6 px-4 group-hover:bg-surface-hover group-hover:border-primary/50 transition-colors">
              <CloudUpload className="size-5 text-primary" />
              <div className="text-sm">
                <span className="font-bold text-primary">Click to upload</span>{" "}
                or drag and drop
                <span className="block mt-1 text-xs text-text-muted">
                  PNG, JPG or SVG (Max. 2MB)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SplitSection>

    <div className="mt-10 flex items-center justify-end gap-3 pt-6 border-t border-border">
      <UIButton variant="ghost" onClick={handleCancel}>
        Cancel
      </UIButton>
      <UIButton
        variant="primary"
        endIcon={<ArrowRight className="size-4" />}
        onClick={handleContinue}
      >
        Save & Continue
      </UIButton>
    </div>
  </div>
);

const OwnerDetailsForm = ({
  formData,
  formErrors,
  handleChange,
  handleBack,
  handleContinue,
}) => (
  <div className="space-y-2">
    <SplitSection
      title="Ownership Details"
      description="Configure accountability parameters. This maps individual person entities to your corporate database records."
      icon={User}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="md:col-span-2">
          <UIInput
            label="Full Name"
            name="ownerName"
            value={formData.ownerName || ""}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            startIcon={<User className="text-text-muted size-4.5" />}
          />
        </div>
        <UIInput
          label="Email Address"
          name="ownerEmail"
          value={formData.ownerEmail || ""}
          onChange={handleChange}
          placeholder="owner@company.com"
          error={formErrors.ownerEmail}
          startIcon={<Mail className="text-text-muted size-4.5" />}
        />
        <UIInput
          label="Mobile Number"
          name="ownerMobile"
          value={formData.ownerMobile || ""}
          onChange={handleChange}
          placeholder="Enter 10-digit number"
          error={formErrors.ownerMobile}
          startIcon={<Phone className="text-text-muted size-4.5" />}
        />
      </div>
    </SplitSection>

    <SplitSection
      title="Personal Identifiers"
      description="Statutory KYC identifiers required for auditing and compliance mapping."
      icon={FileText}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <UIInput
          label="Aadhaar Number"
          name="ownerAadhaar"
          value={formData.ownerAadhaar || ""}
          onChange={handleChange}
          placeholder="12-digit UIDAI record"
          error={formErrors.ownerAadhaar}
        />
        <UIInput
          label="PAN Number"
          name="ownerPan"
          value={formData.ownerPan || ""}
          onChange={handleChange}
          placeholder="Uppercase PAN"
          error={formErrors.ownerPan}
        />
      </div>
    </SplitSection>

    <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
      <UIButton
        variant="outline"
        startIcon={<ArrowLeft className="size-4" />}
        onClick={handleBack}
      >
        Back
      </UIButton>
      <UIButton
        variant="primary"
        endIcon={<ArrowRight className="size-4" />}
        onClick={handleContinue}
      >
        Save & Continue
      </UIButton>
    </div>
  </div>
);

const AddressForm = ({
  formData,
  formErrors,
  handleChange,
  handleBack,
  handleContinue,
}) => (
  <div className="space-y-2">
    <SplitSection
      title="Registered Office"
      description="Define the structural location details. This address is strictly used for invoice printing and official letterheads."
      icon={MapPin}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="md:col-span-2">
          <UIInput
            label="Address Line 1"
            name="addressLine1"
            value={formData.addressLine1 || ""}
            onChange={handleChange}
            placeholder="Flat/Plot, Building, Street name"
          />
        </div>
        <div className="md:col-span-2">
          <UIInput
            label="Address Line 2 (Optional)"
            name="addressLine2"
            value={formData.addressLine2 || ""}
            onChange={handleChange}
            placeholder="Locality, Sector, Landmark"
          />
        </div>

        <UIInput
          label="City"
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
          placeholder="Enter City"
        />
        <UIInput
          label="District"
          name="district"
          value={formData.district || ""}
          onChange={handleChange}
          placeholder="Enter District"
        />
        <UIInput
          label="State"
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
          placeholder="Enter State"
        />
        <UIInput
          label="Pincode"
          name="pincode"
          value={formData.pincode || ""}
          onChange={handleChange}
          placeholder="6-digit postal index"
          error={formErrors.pincode}
        />
        <div className="md:col-span-2">
          <UIInput
            label="Country"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            placeholder="India"
          />
        </div>
      </div>
    </SplitSection>

    <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
      <UIButton
        variant="outline"
        startIcon={<ArrowLeft className="size-4" />}
        onClick={handleBack}
      >
        Back
      </UIButton>
      <UIButton
        variant="primary"
        endIcon={<ArrowRight className="size-4" />}
        onClick={handleContinue}
      >
        Save & Continue
      </UIButton>
    </div>
  </div>
);

const LicenseAndIdentityForm = ({
  formData,
  formErrors,
  licenseStatusOptions,
  handleChange,
  handleBack,
  handleContinue,
}) => (
  <div className="space-y-2">
    <SplitSection
      title="Corporate Tax Parameters"
      description="Configure base tracking compliance and root taxation identity for the company."
      icon={Scale}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <UIInput
          label="GSTIN"
          name="gstNumber"
          value={formData.gstNumber || ""}
          onChange={handleChange}
          placeholder="15-digit corporate GSTIN"
          error={formErrors.gstNumber}
        />
        <UIInput
          label="PAN Number"
          name="panNumber"
          value={formData.panNumber || ""}
          onChange={handleChange}
          placeholder="10-character root PAN"
          error={formErrors.panNumber}
        />
      </div>
    </SplitSection>

    <SplitSection
      title="Industry Licenses"
      description="Specific licenses authorizing trade, such as FSSAI for food or Drug Licenses for pharmaceuticals."
      icon={CheckCircle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="md:col-span-2">
          <UISelect
            label="License Status"
            name="licenseStatus"
            value={formData.licenseStatus || ""}
            onChange={(val) =>
              handleChange({ target: { name: "licenseStatus", value: val } })
            }
            options={licenseStatusOptions}
          />
        </div>
        <UIInput
          label="License Type"
          name="licenseType"
          value={formData.licenseType || ""}
          onChange={handleChange}
          placeholder="e.g. Drug License"
        />
        <UIInput
          label="FSSAI Number"
          name="fssaiNumber"
          value={formData.fssaiNumber || ""}
          onChange={handleChange}
          placeholder="14-digit FSSAI record"
        />
        <UIInput
          label="Retail License Number"
          name="retailLicenseNumber"
          value={formData.retailLicenseNumber || ""}
          onChange={handleChange}
          placeholder="Form 20 / Form 21 identifiers"
        />
        <UIInput
          label="Wholesale License Number"
          name="wholesaleLicenseNumber"
          value={formData.wholesaleLicenseNumber || ""}
          onChange={handleChange}
          placeholder="Form 20B / Form 21B identifiers"
        />
        <UIInput
          label="Issued At"
          name="licenseIssuedAt"
          value={formData.licenseIssuedAt || ""}
          onChange={handleChange}
          placeholder="YYYY-MM-DD"
        />
        <UIInput
          label="Expires At"
          name="licenseExpiresAt"
          value={formData.licenseExpiresAt || ""}
          onChange={handleChange}
          placeholder="YYYY-MM-DD"
        />
      </div>
    </SplitSection>

    <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
      <UIButton
        variant="outline"
        startIcon={<ArrowLeft className="size-4" />}
        onClick={handleBack}
      >
        Back
      </UIButton>
      <UIButton
        variant="primary"
        endIcon={<ArrowRight className="size-4" />}
        onClick={handleContinue}
      >
        Continue to Review
      </UIButton>
    </div>
  </div>
);

/* ==========================================================================
   STEP 5: SCREEN REVIEW SECTIONS
   ========================================================================== */

const ReviewAndCreateStep = ({
  formData,
  companyTypeOptions,
  industryOptions,
  isUpdating,
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
    <div className="space-y-6">
      {/* 1. Company Overview Summary Card */}
      <UICard className="p-6 md:p-8 border-border bg-surface shadow-sm">
        <ReviewSectionHeader
          title="Company Overview"
          stepId={1}
          onEdit={onEditSection}
        />

        <div className="mt-6 flex flex-wrap items-start justify-between gap-8">
          <div className="flex items-center gap-5 min-w-[320px]">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
              <Building2 className="size-8" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-text truncate max-w-[280px] m-0">
                  {formData.companyName || "MedPlus Healthcare Pvt. Ltd."}
                </h3>
                <UIBadge variant="success">{resolvedIndustryLabel}</UIBadge>
              </div>
              <div className="mt-2.5 space-y-2 text-[13px] text-text-muted">
                <div className="flex items-center gap-2.5">
                  <Mail className="size-4 shrink-0" />
                  <span>
                    {formData.companyEmail || "contact@medplushealthcare.com"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0" />
                  <span>
                    {formData.companyPhone
                      ? `+91 ${formData.companyPhone}`
                      : "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe className="size-4 shrink-0" />
                  <span>{formData.website || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-5 max-w-[500px]">
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
      </UICard>

      {/* 2. Owner & Address Layout Grid Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UICard className="p-6 md:p-8 border-border bg-surface shadow-sm">
          <ReviewSectionHeader
            title="Ownership Identity"
            stepId={2}
            onEdit={onEditSection}
          />
          <div className="mt-6 space-y-4">
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
        </UICard>

        <UICard className="p-6 md:p-8 border-border bg-surface shadow-sm">
          <ReviewSectionHeader
            title="Registered Address"
            stepId={3}
            onEdit={onEditSection}
          />
          <div className="mt-6 space-y-4">
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
        </UICard>
      </div>

      {/* 3. Statutory Licenses & Corporate Identifiers */}
      <UICard className="p-6 md:p-8 border-border bg-surface shadow-sm">
        <ReviewSectionHeader
          title="Licenses & Tax Parameters"
          stepId={4}
          onEdit={onEditSection}
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
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
          <div className="col-span-1 md:col-span-2 border-t border-border pt-4 mt-2">
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
      </UICard>

      {/* 4. Action Bars Strip */}
      <div className="mt-8 flex items-center justify-between bg-surface border border-border rounded-xl p-5 shadow-xs">
        <UIButton
          variant="outline"
          startIcon={<ArrowLeft className="size-4" />}
          onClick={onBack}
          disabled={isUpdating}
        >
          Back
        </UIButton>
        <div className="flex items-center gap-3">
          <UIButton
            variant="primary"
            startIcon={<CheckCircle className="size-4" />}
            onClick={onSubmit}
            loading={isUpdating}
            disabled={isUpdating}
          >
            Save Changes
          </UIButton>
        </div>
      </div>
    </div>
  );
};

const ReviewSectionHeader = ({ title, stepId, onEdit }) => (
  <div className="flex items-center justify-between border-b border-border pb-4">
    <h4 className="m-0 text-base font-bold text-text">{title}</h4>
    <UIButton
      variant="outline"
      size="sm"
      className="h-8 px-2.5 text-xs bg-surface-alt"
      startIcon={<Edit3 className="size-3.5" />}
      onClick={() => onEdit(stepId)}
    >
      Edit
    </UIButton>
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div>
    <span className="block text-[13px] font-semibold text-text-muted">
      {label}
    </span>
    <span className="block mt-1 text-sm font-medium text-text">{value}</span>
  </div>
);

const ReviewRowData = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-text-muted font-medium whitespace-nowrap">
      {label}
    </span>
    <div className="text-right font-bold text-text max-w-[300px] truncate">
      {value}
    </div>
  </div>
);

export default EditCompanyDesktopPage;
