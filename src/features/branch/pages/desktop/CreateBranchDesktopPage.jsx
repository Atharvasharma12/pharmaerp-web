// src/features/branch/pages/desktop/CreateBranchDesktopPage.jsx

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
  Stethoscope
} from "lucide-react";

import {
  UIAlert,
  UIButton,
  UICard,
  UIInput,
  UISelect,
  UIBadge,
} from "@/components/ui";

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
    handleResetAndRefresh,
  }) => {
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

            <form onSubmit={(e) => e.preventDefault()} className="w-full">
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
                  branchTypeOptions={branchTypeOptions}
                  isCreating={isLoading}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  onEditSection={handleStepChange}
                />
              )}
            </form>
          </div>
        </div>
      </section>
    );
  },
);

CreateBranchDesktopPage.displayName = "CreateBranchDesktopPage";

/* ==========================================================================
   TOP WORKFLOW PROGRESS STEPPER (Compact)
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
   ACTIVE STEPS FORM MODULES
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
  <div className="space-y-2">
    <SplitSection
      title="Branch Core Profile"
      description="Provide core naming structures, communications routing endpoints, and infrastructure modes."
      icon={Building2}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="md:col-span-2">
          <UIInput
            label="Branch Name"
            name="branchName"
            value={formData.branchName || ""}
            onChange={handleChange}
            placeholder="Enter branch name"
            required
            error={formErrors.branchName}
          />
        </div>
        <UISelect
          label="Branch Type"
          name="branchType"
          value={formData.branchType || ""}
          onChange={(val) =>
            handleChange({ target: { name: "branchType", value: val } })
          }
          options={branchTypeOptions}
          required
          error={formErrors.branchType}
        />
        <UISelect
          label="Primary Location Flag"
          name="isPrimary"
          value={formData.isPrimary || "false"}
          onChange={(val) =>
            handleChange({ target: { name: "isPrimary", value: val } })
          }
          options={booleanOptions}
          required
          error={formErrors.isPrimary}
        />
      </div>
    </SplitSection>

    <SplitSection
      title="Contact Details"
      description="Provide the primary communication channels. These will be used for official notifications and support communications."
      icon={Phone}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="md:col-span-2">
          <UIInput
            label="Branch Email Address"
            name="branchEmail"
            value={formData.branchEmail || ""}
            onChange={handleChange}
            placeholder="branch@company.com"
            error={formErrors.branchEmail}
            startIcon={<Mail className="text-text-muted size-4.5" />}
          />
        </div>
        <UIInput
          label="Mobile Number"
          name="mobile"
          value={formData.mobile || ""}
          onChange={handleChange}
          placeholder="Enter 10-digit number"
          required
          error={formErrors.mobile}
          startIcon={<Phone className="text-text-muted size-4.5" />}
        />
        <UIInput
          label="WhatsApp Number"
          name="whatsapp"
          value={formData.whatsapp || ""}
          onChange={handleChange}
          placeholder="WhatsApp link"
          error={formErrors.whatsapp}
          startIcon={<Phone className="text-text-muted size-4.5" />}
        />
        <div className="md:col-span-2">
          <UIInput
            label="Landline Number (Optional)"
            name="landline"
            value={formData.landline || ""}
            onChange={handleChange}
            placeholder="Enter area code and landline number"
          />
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

const AddressForm = ({
  formData,
  formErrors,
  handleChange,
  handleBack,
  handleContinue,
}) => (
  <div className="space-y-2">
    <SplitSection
      title="Registered Branch Address"
      description="Physical spatial mapping directly bound to tax reporting setups and invoice templates."
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
          required
          error={formErrors.pincode}
        />
        <UIInput
          label="Country"
          name="country"
          value={formData.country || ""}
          onChange={handleChange}
          placeholder="India"
        />
        <UIInput
          label="Google Map Location Link"
          name="googleMapLocation"
          value={formData.googleMapLocation || ""}
          onChange={handleChange}
          placeholder="http://maps.google.com/..."
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

const LicenseForm = ({
  formData,
  formErrors,
  handleChange,
  handleBack,
  handleContinue,
}) => (
  <div className="space-y-2">
    <SplitSection
      title="Statutory Compliance Licenses"
      description="Configure trackable pharmacy compliance logs and operational parameters."
      icon={Scale}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <UIInput
          label="Drug License Number"
          name="drugLicenseNumber"
          value={formData.drugLicenseNumber || ""}
          onChange={handleChange}
          placeholder="Form 20 / Form 21 identifiers"
        />
        <UIInput
          label="Drug License Type"
          name="drugLicenseType"
          value={formData.drugLicenseType || ""}
          onChange={handleChange}
          placeholder="e.g., Retail / Wholesale"
        />
        <UIInput
          label="FSSAI Number"
          name="fssaiNumber"
          value={formData.fssaiNumber || ""}
          onChange={handleChange}
          placeholder="14-digit food compliance token"
        />
        <UIInput
          label="License Expiry Date"
          name="licenseExpiresAt"
          type="date"
          value={formData.licenseExpiresAt || ""}
          onChange={handleChange}
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

const ComplianceContactsForm = ({
  formData,
  formErrors,
  handleChange,
  handleBack,
  handleContinue,
}) => (
  <div className="space-y-2">
    <SplitSection
      title="Pharmacist Parameters"
      description="Link technical operators, pharmacy practitioners to records."
      icon={Stethoscope}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <UIInput
          label="Registered Pharmacist Name"
          name="pharmacistName"
          value={formData.pharmacistName || ""}
          onChange={handleChange}
          placeholder="Full name matching council logs"
        />
        <UIInput
          label="Pharmacy Registration Number"
          name="pharmacistRegistrationNumber"
          value={formData.pharmacistRegistrationNumber || ""}
          onChange={handleChange}
          placeholder="State council registration index"
        />
        <UIInput
          label="Pharmacist Mobile"
          name="pharmacistMobile"
          value={formData.pharmacistMobile || ""}
          onChange={handleChange}
          placeholder="Pharmacist phone contact record"
          error={formErrors.pharmacistMobile}
        />
        <UIInput
          label="Pharmacist Email"
          name="pharmacistEmail"
          value={formData.pharmacistEmail || ""}
          onChange={handleChange}
          placeholder="pharmacist@company.com"
          error={formErrors.pharmacistEmail}
        />
      </div>
    </SplitSection>

    <SplitSection
      title="Emergency Contact Link"
      description="Emergency contacts for branch operations."
      icon={Phone}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="md:col-span-2">
          <UIInput
            label="Contact Name"
            name="emergencyContactName"
            value={formData.emergencyContactName || ""}
            onChange={handleChange}
            placeholder="Full name"
          />
        </div>
        <UIInput
          label="Contact Mobile"
          name="emergencyContactMobile"
          value={formData.emergencyContactMobile || ""}
          onChange={handleChange}
          placeholder="10-digit number"
          error={formErrors.emergencyContactMobile}
        />
        <UIInput
          label="Relationship Mapping"
          name="emergencyContactRelationship"
          value={formData.emergencyContactRelationship || ""}
          onChange={handleChange}
          placeholder="e.g., Manager / Director"
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
  branchTypeOptions,
  isCreating,
  onBack,
  onSubmit,
  onEditSection,
}) => {
  const resolvedTypeLabel =
    branchTypeOptions.find((opt) => opt.value === formData.branchType)
      ?.label || formData.branchType;

  return (
    <div className="space-y-6">
      {/* 1. Branch Overview Summary Card */}
      <UICard className="p-6 md:p-8 border-border bg-surface shadow-sm">
        <ReviewSectionHeader
          title="Branch Overview"
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
                  {formData.branchName || "Unnamed Branch"}
                </h3>
                {formData.isPrimary === "true" && (
                  <UIBadge variant="success">Primary</UIBadge>
                )}
              </div>
              <div className="mt-2.5 space-y-2 text-[13px] text-text-muted">
                <div className="flex items-center gap-2.5">
                  <Mail className="size-4 shrink-0" />
                  <span>
                    {formData.branchEmail || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0" />
                  <span>
                    {formData.mobile
                      ? `+91 ${formData.mobile}`
                      : "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-5 max-w-[500px]">
            <ReviewItem label="Branch Type" value={resolvedTypeLabel} />
            <ReviewItem
              label="WhatsApp"
              value={formData.whatsapp || "-"}
            />
            <ReviewItem
              label="Landline"
              value={formData.landline || "-"}
            />
          </div>
        </div>
      </UICard>

      {/* 2. Address Layout */}
      <UICard className="p-6 md:p-8 border-border bg-surface shadow-sm">
        <ReviewSectionHeader
          title="Registered Address"
          stepId={2}
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

      {/* 3. Statutory Licenses */}
      <UICard className="p-6 md:p-8 border-border bg-surface shadow-sm">
        <ReviewSectionHeader
          title="Licenses & Tax Parameters"
          stepId={3}
          onEdit={onEditSection}
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          <ReviewRowData label="Drug License Number" value={formData.drugLicenseNumber || "-"} />
          <ReviewRowData label="Drug License Type" value={formData.drugLicenseType || "-"} />
          <ReviewRowData label="FSSAI Code" value={formData.fssaiNumber || "-"} />
          <ReviewRowData label="Expires At Date" value={formData.licenseExpiresAt || "-"} />
        </div>
      </UICard>

      {/* 4. Compliance Contacts */}
      <UICard className="p-6 md:p-8 border-border bg-surface shadow-sm">
        <ReviewSectionHeader
          title="Compliance Contacts"
          stepId={4}
          onEdit={onEditSection}
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          <ReviewRowData label="Pharmacist Name" value={formData.pharmacistName || "-"} />
          <ReviewRowData label="Registration Number" value={formData.pharmacistRegistrationNumber || "-"} />
          <ReviewRowData label="Pharmacist Mobile" value={formData.pharmacistMobile || "-"} />
          <ReviewRowData label="Emergency Contact" value={formData.emergencyContactName || "-"} />
          <ReviewRowData label="Emergency Mobile" value={formData.emergencyContactMobile || "-"} />
        </div>
      </UICard>

      {/* 5. Action Bars Strip */}
      <div className="mt-8 flex items-center justify-between bg-surface border border-border rounded-xl p-5 shadow-xs">
        <UIButton
          variant="outline"
          startIcon={<ArrowLeft className="size-4" />}
          onClick={onBack}
          disabled={isCreating}
        >
          Back
        </UIButton>
        <div className="flex items-center gap-3">
          <UIButton
            variant="primary"
            startIcon={<CheckCircle className="size-4" />}
            onClick={onSubmit}
            loading={isCreating}
            disabled={isCreating}
          >
            Create Branch
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

export default CreateBranchDesktopPage;
