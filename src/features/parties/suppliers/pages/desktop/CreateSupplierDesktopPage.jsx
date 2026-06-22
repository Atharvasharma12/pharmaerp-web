// src/features/parties/suppliers/pages/desktop/CreateSupplierDesktopPage.jsx

import { memo } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiEdit3,
  FiFileText,
  FiGlobe,
  FiInfo,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiUser,
  FiCreditCard,
  FiDollarSign,
  FiAlertCircle,
  FiBookOpen,
} from "react-icons/fi";
import { LuStore } from "react-icons/lu";

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
  AppText,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
  AppIconButton,
} from "@/components";

const CreateSupplierDesktopPage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
    currentStep = 1,

    supplierTypeOptions = [],
    statusOptions = [],
    balanceTypeOptions = [],

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
            title="Create New Supplier"
            subtitle={
              currentStep === 5
                ? "Review all details before creating your supplier profile."
                : "Add your supplier details, addresses, credit terms, and licenses."
            }
            extra={
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Suppliers", onClick: handleCancel },
                  { label: "Create Supplier", current: true },
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
              {/* Stepper Progress Bar */}
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
                  <SupplierDetailsForm
                    formData={formData}
                    formErrors={formErrors}
                    supplierTypeOptions={supplierTypeOptions}
                    statusOptions={statusOptions}
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
                  <FinancialDetailsForm
                    formData={formData}
                    formErrors={formErrors}
                    balanceTypeOptions={balanceTypeOptions}
                    handleChange={handleChange}
                    handleBack={handleBack}
                    handleContinue={handleContinue}
                  />
                )}

                {currentStep === 4 && (
                  <IdentityAndNotesForm
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
                    supplierTypeOptions={supplierTypeOptions}
                    statusOptions={statusOptions}
                    balanceTypeOptions={balanceTypeOptions}
                    isCreating={isLoading}
                    onBack={handleBack}
                    onSaveDraft={handleSaveDraft}
                    onSubmit={handleSubmit}
                    onEditSection={handleStepChange}
                  />
                )}
              </AppBox>
            </AppBox>

            {/* Sidebar Details summary card */}
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

CreateSupplierDesktopPage.displayName = "CreateSupplierDesktopPage";

/* ==========================================================================
   TOP STEPS STEPPER
   ========================================================================== */

const TopStepper = memo(({ currentStep, onStepChange }) => {
  const steps = [
    { id: 1, title: "Supplier Info", label: "Basic details" },
    { id: 2, title: "Location Details", label: "Billing location" },
    { id: 3, title: "Credit & Balances", label: "Financial setups" },
    { id: 4, title: "Identity & Notes", label: "Statutory parameters" },
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
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      completed
                        ? "bg-success-soft text-success"
                        : active
                          ? "bg-success text-text-inverse"
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
   FORM COMPONENT DEFINITIONS
   ========================================================================== */

const SupplierDetailsForm = ({
  formData,
  formErrors,
  supplierTypeOptions,
  statusOptions,
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
        Supplier Profile
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Enter basic supplier identifiers, phone numbers, and profile type
        parameters.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Business Name"
        name="businessName"
        value={formData.businessName || ""}
        onChange={handleChange}
        placeholder="Enter supplier business name"
        required
        error={Boolean(formErrors.businessName)}
        helperText={formErrors.businessName}
        startIcon={<FiUser className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppSelect
        label="Supplier Type"
        name="supplierType"
        value={formData.supplierType || "distributor"}
        onChange={handleChange}
        options={supplierTypeOptions}
        required
        error={Boolean(formErrors.supplierType)}
        helperText={formErrors.supplierType}
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
        startIcon={<FiPhone className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Alternate Mobile (Optional)"
        name="alternateMobile"
        value={formData.alternateMobile || ""}
        onChange={handleChange}
        placeholder="Enter alternate mobile number"
        error={Boolean(formErrors.alternateMobile)}
        helperText={formErrors.alternateMobile}
        startIcon={<FiPhone className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Email Address (Optional)"
        name="email"
        value={formData.email || ""}
        onChange={handleChange}
        placeholder="Enter supplier email address"
        error={Boolean(formErrors.email)}
        helperText={formErrors.email}
        startIcon={<FiMail className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppSelect
        label="Profile Status"
        name="status"
        value={formData.status || "active"}
        onChange={handleChange}
        options={statusOptions}
        required
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
        onClick={handleCancel}
        sx={secondaryActionBtnSx}
      >
        Cancel
      </AppButton>
      <AppButton
        variant="contained"
        colorVariant="success"
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
        Location Details
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Configure billing and communication address details for purchase order
        mapping.
      </AppText>
    </div>

    <div className="mt-5 max-w-xl">
      <AppStack direction="column" gap={3}>
        <AppInput
          label="Address Line 1"
          name="billingAddressLine1"
          value={formData.billingAddressLine1 || ""}
          onChange={handleChange}
          placeholder="Flat/Plot, Street name"
          labelSx={labelSx}
          inputSx={inputSx}
        />
        <AppInput
          label="Address Line 2"
          name="billingAddressLine2"
          value={formData.billingAddressLine2 || ""}
          onChange={handleChange}
          placeholder="Locality, Sector, Landmark (Optional)"
          labelSx={labelSx}
          inputSx={inputSx}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <AppInput
            label="City"
            name="billingCity"
            value={formData.billingCity || ""}
            onChange={handleChange}
            placeholder="City"
            labelSx={labelSx}
            inputSx={inputSx}
          />
          <AppInput
            label="District"
            name="billingDistrict"
            value={formData.billingDistrict || ""}
            onChange={handleChange}
            placeholder="District"
            labelSx={labelSx}
            inputSx={inputSx}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <AppInput
            label="State"
            name="billingState"
            value={formData.billingState || ""}
            onChange={handleChange}
            placeholder="State"
            labelSx={labelSx}
            inputSx={inputSx}
          />
          <AppInput
            label="Pincode"
            name="billingPincode"
            value={formData.billingPincode || ""}
            onChange={handleChange}
            placeholder="Postal index"
            error={Boolean(formErrors.billingPincode)}
            helperText={formErrors.billingPincode}
            labelSx={labelSx}
            inputSx={inputSx}
          />
        </div>
        <AppInput
          label="Country"
          name="billingCountry"
          value={formData.billingCountry || "India"}
          onChange={handleChange}
          placeholder="India"
          labelSx={labelSx}
          inputSx={inputSx}
        />
      </AppStack>
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
        colorVariant="success"
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

const FinancialDetailsForm = ({
  formData,
  formErrors,
  balanceTypeOptions,
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
        Credit & Balance Information
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Configure credit days, payment terms, and outstanding balances.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Credit Days"
        name="creditDays"
        type="number"
        value={formData.creditDays}
        onChange={handleChange}
        placeholder="Enter credit terms (e.g. 30)"
        error={Boolean(formErrors.creditDays)}
        helperText={formErrors.creditDays}
        startIcon={<FiInfo className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Opening Balance (₹)"
        name="openingBalance"
        type="number"
        value={formData.openingBalance}
        onChange={handleChange}
        placeholder="Enter opening balance amount"
        error={Boolean(formErrors.openingBalance)}
        helperText={formErrors.openingBalance}
        startIcon={<FiDollarSign className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppSelect
        label="Opening Balance Type"
        name="openingBalanceType"
        value={formData.openingBalanceType || "cr"}
        onChange={handleChange}
        options={balanceTypeOptions}
        required
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
        colorVariant="success"
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

const IdentityAndNotesForm = ({
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
        Regulatory & Miscellaneous
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Record corporate identity numbers, licenses, and partner notes.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="GSTIN"
        name="gstNumber"
        value={formData.gstNumber || ""}
        onChange={handleChange}
        placeholder="Enter 15-digit GSTIN"
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
        placeholder="Enter 10-digit PAN"
        error={Boolean(formErrors.panNumber)}
        helperText={formErrors.panNumber}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppInput
        label="Drug License Number"
        name="drugLicenseNumber"
        value={formData.drugLicenseNumber || ""}
        onChange={handleChange}
        placeholder="Enter Drug License details"
        error={Boolean(formErrors.drugLicenseNumber)}
        helperText={formErrors.drugLicenseNumber}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <div className="col-span-2">
        <AppInput
          label="Internal Notes"
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          placeholder="Enter notes or additional description terms..."
          multiline
          rows={3}
          error={Boolean(formErrors.notes)}
          helperText={formErrors.notes}
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
        colorVariant="success"
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

const ReviewAndCreateStep = ({
  formData,
  supplierTypeOptions,
  statusOptions,
  balanceTypeOptions,
  isCreating,
  onBack,
  onSaveDraft,
  onSubmit,
  onEditSection,
}) => {
  const getLabelFromOptions = (value, options) => {
    return options.find((opt) => opt.value === value)?.label || value || "—";
  };

  return (
    <AppStack direction="column" gap={3}>
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
            Confirm Details
          </AppHeading>
          <AppText variant="body2" sx={sectionSubtitleSx}>
            Verify all supplier parameters before saving profile details.
          </AppText>
        </div>

        <div className="mt-5 space-y-6">
          {/* Section 1: Basic Info */}
          <div>
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <AppHeading level={3} weight={750} sx={subSectionTitleSx}>
                Supplier Profile
              </AppHeading>
              <AppIconButton
                icon={<FiEdit3 />}
                variant="text"
                colorVariant="primary"
                onClick={() => onEditSection?.(1)}
              />
            </div>
            <div className="mt-3.5 grid grid-cols-3 gap-y-3.5 text-[12px]">
              <div>
                <span className="block font-medium text-text-muted">
                  Business Name
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {formData.businessName || "—"}
                </span>
              </div>
              <div>
                <span className="block font-medium text-text-muted">
                  Supplier Type
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {getLabelFromOptions(
                    formData.supplierType,
                    supplierTypeOptions,
                  )}
                </span>
              </div>
              <div>
                <span className="block font-medium text-text-muted">
                  Mobile Number
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {formData.mobile || "—"}
                </span>
              </div>
              <div>
                <span className="block font-medium text-text-muted">
                  Alternate Mobile
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {formData.alternateMobile || "—"}
                </span>
              </div>
              <div>
                <span className="block font-medium text-text-muted">
                  Email Address
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {formData.email || "—"}
                </span>
              </div>
              <div>
                <span className="block font-medium text-text-muted">
                  Status
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {getLabelFromOptions(formData.status, statusOptions)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div>
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <AppHeading level={3} weight={750} sx={subSectionTitleSx}>
                Location Address
              </AppHeading>
              <AppIconButton
                icon={<FiEdit3 />}
                variant="text"
                colorVariant="primary"
                onClick={() => onEditSection?.(2)}
              />
            </div>
            <div className="mt-3.5 grid grid-cols-2 gap-x-8 text-[12px]">
              <div>
                <span className="block font-medium text-text-muted">
                  Address Details
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {formData.billingAddressLine1 ? (
                    <>
                      {formData.billingAddressLine1}
                      {formData.billingAddressLine2
                        ? `, ${formData.billingAddressLine2}`
                        : ""}
                      <br />
                      {formData.billingCity}, {formData.billingDistrict}
                      <br />
                      {formData.billingState} - {formData.billingPincode}
                      <br />
                      {formData.billingCountry}
                    </>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Financial */}
          <div>
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <AppHeading level={3} weight={750} sx={subSectionTitleSx}>
                Financial Parameters
              </AppHeading>
              <AppIconButton
                icon={<FiEdit3 />}
                variant="text"
                colorVariant="primary"
                onClick={() => onEditSection?.(3)}
              />
            </div>
            <div className="mt-3.5 grid grid-cols-3 gap-y-3.5 text-[12px]">
              <div>
                <span className="block font-medium text-text-muted">
                  Credit Days
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {formData.creditDays || 0} Days
                </span>
              </div>
              <div>
                <span className="block font-medium text-text-muted">
                  Opening Balance
                </span>
                <span className="block font-bold text-text mt-0.5">
                  ₹{" "}
                  {Number(formData.openingBalance).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div>
                <span className="block font-medium text-text-muted">
                  Balance Type
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {getLabelFromOptions(
                    formData.openingBalanceType,
                    balanceTypeOptions,
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Identity */}
          <div>
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <AppHeading level={3} weight={750} sx={subSectionTitleSx}>
                Identity & notes
              </AppHeading>
              <AppIconButton
                icon={<FiEdit3 />}
                variant="text"
                colorVariant="primary"
                onClick={() => onEditSection?.(4)}
              />
            </div>
            <div className="mt-3.5 grid grid-cols-3 gap-y-3.5 text-[12px]">
              <div>
                <span className="block font-medium text-text-muted">GSTIN</span>
                <span className="block font-bold text-text mt-0.5">
                  {formData.gstNumber || "—"}
                </span>
              </div>
              <div>
                <span className="block font-medium text-text-muted">
                  PAN Number
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {formData.panNumber || "—"}
                </span>
              </div>
              <div>
                <span className="block font-medium text-text-muted">
                  Drug License
                </span>
                <span className="block font-bold text-text mt-0.5">
                  {formData.drugLicenseNumber || "—"}
                </span>
              </div>
              <div className="col-span-3">
                <span className="block font-medium text-text-muted">
                  Internal Notes
                </span>
                <span className="block font-bold text-text mt-0.5 whitespace-pre-wrap">
                  {formData.notes || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard
        variant="default"
        rounded="lg"
        bordered={false}
        shadow="none"
        padding="none"
        sx={footerActionCardSx}
      >
        <AppStack direction="row" align="center" justify="space-between">
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            startIcon={<FiArrowLeft />}
            disabled={isCreating}
            onClick={onBack}
            sx={secondaryActionBtnSx}
          >
            Back
          </AppButton>

          <AppStack direction="row" align="center" gap={1.2}>
            <AppButton
              variant="text"
              colorVariant="neutral"
              disabled={isCreating}
              onClick={onSaveDraft}
              sx={{ fontSize: "12px", fontWeight: 700 }}
            >
              Save Draft
            </AppButton>
            <AppButton
              variant="contained"
              colorVariant="success"
              rounded="md"
              size="small"
              startIcon={<FiCheckCircle />}
              loading={isCreating}
              disabled={isCreating}
              onClick={onSubmit}
              sx={primaryActionBtnSx}
            >
              Create Supplier
            </AppButton>
          </AppStack>
        </AppStack>
      </AppCard>
    </AppStack>
  );
};

/* ==========================================================================
   SIDEBAR PANEL SUMMARY CARD
   ========================================================================== */

const RightSidebarPanel = ({ currentStep, formData, onResetDraft }) => {
  const stepsDetail = [
    {
      id: 1,
      title: "Supplier Profile",
      desc: "Assign a unique business name and contact coordinates.",
      icon: <FiUser />,
    },
    {
      id: 2,
      title: "Location Details",
      desc: "Billing address triggers state code validation for GST.",
      icon: <FiMapPin />,
    },
    {
      id: 3,
      title: "Financial & Credit",
      desc: "Adjust payment cycle bounds and set ledger balances.",
      icon: <FiCreditCard />,
    },
    {
      id: 4,
      title: "Statutory & Miscellaneous",
      desc: "Verify PAN/GSTIN properties to prevent return filing flags.",
      icon: <FiFileText />,
    },
  ];

  return (
    <PageRightSidebar
      spacing={4}
      cards={[
        {
          title: "Step Details",
          icon: null,
          colorVariant: "primary",
          variant: "default",
          custom: (
            <div className="space-y-4">
              <AppStack direction="row" align="center" gap={1.5}>
                <AppBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 36,
                    width: 36,
                    borderRadius: "8px",
                    bgcolor: "var(--app-color-primary-soft)",
                    color: "var(--app-color-primary)",
                    fontSize: "18px",
                  }}
                >
                  {stepsDetail[currentStep - 1]?.icon || <FiBookOpen />}
                </AppBox>
                <div>
                  <AppHeading
                    level={3}
                    weight={700}
                    sx={{ m: 0, fontSize: "12.5px" }}
                  >
                    {stepsDetail[currentStep - 1]?.title || "Review & Confirm"}
                  </AppHeading>
                  <AppText
                    variant="body2"
                    sx={{
                      fontSize: "10.5px",
                      color: "var(--app-color-text-muted)",
                      mt: 0.1,
                    }}
                  >
                    Step {currentStep} of 5
                  </AppText>
                </div>
              </AppStack>
              <AppText
                variant="body2"
                sx={{
                  fontSize: "11px",
                  color: "var(--app-color-text-muted)",
                  lineHeight: 1.4,
                }}
              >
                {stepsDetail[currentStep - 1]?.desc ||
                  "Verify all fields and review profile configuration."}
              </AppText>
            </div>
          ),
        },
        {
          title: "Quick Guidance",
          icon: null,
          colorVariant: "success",
          variant: "default",
          custom: (
            <div className="space-y-3 text-[11px] text-text-muted font-medium">
              <div className="flex gap-2">
                <FiInfo className="mt-0.5 shrink-0 text-success text-[12px]" />
                <span>
                  All state names must match standard tax classification states.
                </span>
              </div>
              <div className="flex gap-2">
                <FiInfo className="mt-0.5 shrink-0 text-success text-[12px]" />
                <span>
                  GST number checks verify length, check digits, and state
                  mapping codes.
                </span>
              </div>
            </div>
          ),
        },
        HELP_SUPPORT_CARD,
      ]}
    />
  );
};

/* Styles definitions */
const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "22px",
    lineHeight: 1.15,
    letterSpacing: "-0.4px",
    color: "var(--app-color-text)",
  },
};
const breadcrumbSx = { mb: 0.5 };
const breadcrumbItemSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const secondaryButtonSx = {
  height: 32,
  minWidth: 70,
  px: 1.2,
  fontSize: "11.5px",
  fontWeight: 650,
};

const stepperCardSx = {
  p: 1.25,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  mb: 2,
};

const formMainCardSx = {
  p: 5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "15px",
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.25,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const subSectionTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const labelSx = {
  fontSize: "11.5px",
  fontWeight: 750,
  color: "var(--app-color-text)",
  mb: 0.6,
};

const inputSx = {
  minHeight: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface-alt)",
};

const primaryActionBtnSx = {
  height: 36,
  minWidth: 120,
  px: 1.6,
  fontSize: "12px",
  fontWeight: 700,
};

const secondaryActionBtnSx = {
  height: 36,
  minWidth: 80,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const alertSx = {
  mt: 2,
};

const footerActionCardSx = {
  p: 3,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
};

export default CreateSupplierDesktopPage;
