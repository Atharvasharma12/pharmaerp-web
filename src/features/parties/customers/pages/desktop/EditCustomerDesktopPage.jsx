// src/features/parties/customers/pages/desktop/EditCustomerDesktopPage.jsx

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

const EditCustomerDesktopPage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
    isFetching = false,
    currentStep = 1,

    customerTypeOptions = [],
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
            title="Edit Customer Profile"
            subtitle={
              currentStep === 5
                ? "Review modified records before saving customer changes."
                : "Modify structural fields, contact details, and statutory parameters."
            }
            extra={
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Customers", onClick: handleCancel },
                  { label: "Edit Customer", current: true },
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
                  disabled={isLoading || isFetching}
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
                  onClick={handleResetAndRefresh}
                  loading={isFetching || isLoading}
                  disabled={isFetching || isLoading}
                  sx={secondaryButtonSx}
                >
                  Reset Form
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
                {isFetching ? (
                  <AppCard
                    variant="default"
                    rounded="lg"
                    bordered
                    sx={formMainCardSx}
                  >
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FiRefreshCw className="animate-spin text-[32px] text-success mb-3" />
                      <AppText
                        variant="body2"
                        sx={{ color: "var(--app-color-text-muted)" }}
                      >
                        Retrieving customer records from server...
                      </AppText>
                    </div>
                  </AppCard>
                ) : (
                  <>
                    {currentStep === 1 && (
                      <CustomerDetailsForm
                        formData={formData}
                        formErrors={formErrors}
                        customerTypeOptions={customerTypeOptions}
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
                        customerTypeOptions={customerTypeOptions}
                        statusOptions={statusOptions}
                        balanceTypeOptions={balanceTypeOptions}
                        isUpdating={isLoading}
                        onBack={handleBack}
                        onSaveDraft={handleSaveDraft}
                        onSubmit={handleSubmit}
                        onEditSection={handleStepChange}
                      />
                    )}
                  </>
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

EditCustomerDesktopPage.displayName = "EditCustomerDesktopPage";

/* ==========================================================================
   TOP STEPS STEPPER
   ========================================================================== */

const TopStepper = memo(({ currentStep, onStepChange }) => {
  const steps = [
    { id: 1, title: "Customer Info", label: "Basic details" },
    { id: 2, title: "Addresses", label: "Billing & Shipping" },
    { id: 3, title: "Credit & Balances", label: "Financial setups" },
    { id: 4, title: "Identity & Notes", label: "Statutory parameters" },
    { id: 5, title: "Review & Save", label: "Final confirmation" },
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

const CustomerDetailsForm = ({
  formData,
  formErrors,
  customerTypeOptions,
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
        Customer Profile
      </AppHeading>
      <AppText variant="body2" sx={sectionSubtitleSx}>
        Enter basic customer identifiers, phone numbers, and profile type
        parameters.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Customer Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        placeholder="Enter customer/business name"
        required
        error={Boolean(formErrors.name)}
        helperText={formErrors.name}
        startIcon={<FiUser className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <AppSelect
        label="Customer Type"
        name="customerType"
        value={formData.customerType || "retail"}
        onChange={handleChange}
        options={customerTypeOptions}
        required
        error={Boolean(formErrors.customerType)}
        helperText={formErrors.customerType}
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
        placeholder="Enter customer email address"
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
    <div className="border-b border-border pb-3 flex items-center justify-between gap-3">
      <div>
        <AppHeading level={2} weight={700} sx={sectionTitleSx}>
          Billing & Shipping Address
        </AppHeading>
        <AppText variant="body2" sx={sectionSubtitleSx}>
          Configure billing credentials and delivery locations for sales
          invoicing.
        </AppText>
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-[12px] font-bold text-text-muted select-none shrink-0">
        <input
          type="checkbox"
          name="sameAsBilling"
          checked={Boolean(formData.sameAsBilling)}
          onChange={(e) => handleChange("sameAsBilling", e.target.checked)}
          className="rounded border-border text-success focus:ring-success w-4 h-4 cursor-pointer"
        />
        <span>Shipping same as Billing</span>
      </label>
    </div>

    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {/* Billing Address Block */}
      <AppStack direction="column" gap={3}>
        <AppHeading level={3} weight={700} sx={{ ...subSectionTitleSx, mb: 0.5 }}>
          Billing Location
        </AppHeading>

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

      {/* Shipping Address Block */}
      <AppStack direction="column" gap={3}>
        <AppHeading level={3} weight={700} sx={{ ...subSectionTitleSx, mb: 0.5 }}>
          Shipping Location
        </AppHeading>

        <AppInput
          label="Address Line 1"
          name="shippingAddressLine1"
          value={formData.shippingAddressLine1 || ""}
          onChange={handleChange}
          placeholder="Flat/Plot, Street name"
          disabled={Boolean(formData.sameAsBilling)}
          labelSx={labelSx}
          inputSx={inputSx}
        />
        <AppInput
          label="Address Line 2"
          name="shippingAddressLine2"
          value={formData.shippingAddressLine2 || ""}
          onChange={handleChange}
          placeholder="Locality, Sector, Landmark (Optional)"
          disabled={Boolean(formData.sameAsBilling)}
          labelSx={labelSx}
          inputSx={inputSx}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <AppInput
            label="City"
            name="shippingCity"
            value={formData.shippingCity || ""}
            onChange={handleChange}
            placeholder="City"
            disabled={Boolean(formData.sameAsBilling)}
            labelSx={labelSx}
            inputSx={inputSx}
          />
          <AppInput
            label="District"
            name="shippingDistrict"
            value={formData.shippingDistrict || ""}
            onChange={handleChange}
            placeholder="District"
            disabled={Boolean(formData.sameAsBilling)}
            labelSx={labelSx}
            inputSx={inputSx}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <AppInput
            label="State"
            name="shippingState"
            value={formData.shippingState || ""}
            onChange={handleChange}
            placeholder="State"
            disabled={Boolean(formData.sameAsBilling)}
            labelSx={labelSx}
            inputSx={inputSx}
          />
          <AppInput
            label="Pincode"
            name="shippingPincode"
            value={formData.shippingPincode || ""}
            onChange={handleChange}
            placeholder="Postal index"
            disabled={Boolean(formData.sameAsBilling)}
            error={Boolean(formErrors.shippingPincode)}
            helperText={formErrors.shippingPincode}
            labelSx={labelSx}
            inputSx={inputSx}
          />
        </div>
        <AppInput
          label="Country"
          name="shippingCountry"
          value={formData.shippingCountry || "India"}
          onChange={handleChange}
          placeholder="India"
          disabled={Boolean(formData.sameAsBilling)}
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
        Configure credit parameters, payment limits, and outstanding ledger
        account balances.
      </AppText>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
      <AppInput
        label="Credit Limit (₹)"
        name="creditLimit"
        type="number"
        value={formData.creditLimit}
        onChange={handleChange}
        placeholder="Enter credit limit value"
        error={Boolean(formErrors.creditLimit)}
        helperText={formErrors.creditLimit}
        startIcon={<FiCreditCard className="text-text-muted" />}
        labelSx={labelSx}
        inputSx={inputSx}
      />
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
        value={formData.openingBalanceType || "dr"}
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
        Record corporate identity numbers, licenses, and internal notes.
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
        placeholder="Enter 10-character PAN"
        error={Boolean(formErrors.panNumber)}
        helperText={formErrors.panNumber}
        labelSx={labelSx}
        inputSx={inputSx}
      />
      <div className="col-span-2">
        <AppInput
          label="Drug License Number"
          name="drugLicenseNumber"
          value={formData.drugLicenseNumber || ""}
          onChange={handleChange}
          placeholder="Enter retail/wholesale drug license code"
          labelSx={labelSx}
          inputSx={inputSx}
        />
      </div>
      <div className="col-span-2">
        <AppInput
          label="Notes / Comments"
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          placeholder="Enter internal references regarding payment patterns or schedules"
          labelSx={labelSx}
          inputSx={inputSx}
          multiline
          rows={3}
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
  customerTypeOptions,
  statusOptions,
  balanceTypeOptions,
  isUpdating,
  onBack,
  onSaveDraft,
  onSubmit,
  onEditSection,
}) => {
  const getLabelFromOptions = (options, value) => {
    return options.find((opt) => opt.value === value)?.label || value || "—";
  };

  return (
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
          Review & Confirm
        </AppHeading>
        <AppText variant="body2" sx={sectionSubtitleSx}>
          Confirm that all parameters are valid before saving your modifications.
        </AppText>
      </div>

      <div className="mt-5 space-y-6">
        {/* Section 1: Customer Info */}
        <div className="rounded-lg border border-border bg-surface-alt/20 p-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <AppHeading level={3} weight={700} sx={subSectionTitleSx}>
              1. Customer Profile
            </AppHeading>
            <AppIconButton
              icon={<FiEdit3 />}
              size="small"
              onClick={() => onEditSection(1)}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-y-3 gap-x-4 text-[12px]">
            <ReviewField label="Customer Name" value={formData.name} />
            <ReviewField
              label="Customer Type"
              value={getLabelFromOptions(
                customerTypeOptions,
                formData.customerType,
              )}
            />
            <ReviewField label="Mobile Number" value={formData.mobile} />
            <ReviewField
              label="Alternate Mobile"
              value={formData.alternateMobile}
            />
            <ReviewField label="Email Address" value={formData.email} />
            <ReviewField
              label="Status"
              value={getLabelFromOptions(statusOptions, formData.status)}
            />
          </div>
        </div>

        {/* Section 2: Addresses */}
        <div className="rounded-lg border border-border bg-surface-alt/20 p-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <AppHeading level={3} weight={700} sx={subSectionTitleSx}>
              2. Addresses
            </AppHeading>
            <AppIconButton
              icon={<FiEdit3 />}
              size="small"
              onClick={() => onEditSection(2)}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-6 text-[12px]">
            <div>
              <span className="block font-bold text-text-muted mb-1 text-[11px] uppercase tracking-wide">
                Billing Location
              </span>
              <p className="text-text font-semibold leading-relaxed">
                {[
                  formData.billingAddressLine1,
                  formData.billingAddressLine2,
                  formData.billingCity,
                  formData.billingDistrict,
                  formData.billingState,
                  formData.billingPincode,
                  formData.billingCountry,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>
            <div>
              <span className="block font-bold text-text-muted mb-1 text-[11px] uppercase tracking-wide">
                Shipping Location
              </span>
              <p className="text-text font-semibold leading-relaxed">
                {formData.sameAsBilling
                  ? "Same as Billing Address"
                  : [
                      formData.shippingAddressLine1,
                      formData.shippingAddressLine2,
                      formData.shippingCity,
                      formData.shippingDistrict,
                      formData.shippingState,
                      formData.shippingPincode,
                      formData.shippingCountry,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Credit & Financials */}
        <div className="rounded-lg border border-border bg-surface-alt/20 p-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <AppHeading level={3} weight={700} sx={subSectionTitleSx}>
              3. Credit & Balance
            </AppHeading>
            <AppIconButton
              icon={<FiEdit3 />}
              size="small"
              onClick={() => onEditSection(3)}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-y-3 gap-x-4 text-[12px]">
            <ReviewField
              label="Credit Limit"
              value={`₹ ${Number(formData.creditLimit || 0).toLocaleString()}`}
            />
            <ReviewField
              label="Credit Days"
              value={`${formData.creditDays || 0} days`}
            />
            <ReviewField
              label="Opening Balance"
              value={`₹ ${Number(formData.openingBalance || 0).toLocaleString()} (${getLabelFromOptions(balanceTypeOptions, formData.openingBalanceType)})`}
            />
          </div>
        </div>

        {/* Section 4: Compliance */}
        <div className="rounded-lg border border-border bg-surface-alt/20 p-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <AppHeading level={3} weight={700} sx={subSectionTitleSx}>
              4. Identity & Regulatory
            </AppHeading>
            <AppIconButton
              icon={<FiEdit3 />}
              size="small"
              onClick={() => onEditSection(4)}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-y-3 gap-x-4 text-[12px]">
            <ReviewField label="GSTIN" value={formData.gstNumber} />
            <ReviewField label="PAN Number" value={formData.panNumber} />
            <ReviewField
              label="Drug License"
              value={formData.drugLicenseNumber}
            />
            <div className="col-span-3">
              <ReviewField label="Notes" value={formData.notes} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <AppButton
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          startIcon={<FiArrowLeft />}
          onClick={onBack}
          sx={secondaryActionBtnSx}
        >
          Back
        </AppButton>

        <AppStack direction="row" gap={1}>
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            onClick={onSaveDraft}
            sx={secondaryActionBtnSx}
          >
            Cancel
          </AppButton>
          <AppButton
            variant="contained"
            colorVariant="success"
            rounded="md"
            size="small"
            startIcon={<FiCheckCircle />}
            onClick={onSubmit}
            loading={isUpdating}
            disabled={isUpdating}
            sx={primaryActionBtnSx}
          >
            Save Changes
          </AppButton>
        </AppStack>
      </div>
    </AppCard>
  );
};

const ReviewField = ({ label, value }) => (
  <div>
    <span className="block font-bold text-text-muted text-[10px] uppercase tracking-wider mb-0.5">
      {label}
    </span>
    <span className="font-bold text-text truncate block">{value || "—"}</span>
  </div>
);

/* ==========================================================================
   SIDEBAR COMPONENT
   ========================================================================== */

const RightSidebarPanel = memo(({ currentStep, formData }) => {
  const stepsHelper = [
    {
      title: "Step 1: Customer Profile",
      desc: "Complete the client name, mobile numbers, contact email and account type parameters. Name is required.",
    },
    {
      title: "Step 2: Addresses Details",
      desc: "Define the billing destination address. If same, toggle the checkbox to auto-fill the shipping block.",
    },
    {
      title: "Step 3: Credit Limits",
      desc: "Set credit limits (Max outstanding balance allowed) and terms in days for billing invoices.",
    },
    {
      title: "Step 4: Statutory licenses",
      desc: "Add corporate tax IDs (GSTIN, PAN) and state drug license identifiers. Keep notes for operational details.",
    },
  ];

  const currentHelper = stepsHelper[currentStep - 1] || {
    title: "Step 5: Review Profile",
    desc: "Ensure that all inputs are valid before saving the customer account profile modifications.",
  };

  return (
    <PageRightSidebar
      spacing={4}
      cards={[
        {
          title: "Setup Assistance",
          icon: <FiBookOpen />,
          colorVariant: "success",
          variant: "soft",
          soft: true,
          points: [currentHelper.title, currentHelper.desc],
          pointIcon: <FiInfo />,
        },
        HELP_SUPPORT_CARD,
      ]}
    />
  );
});
RightSidebarPanel.displayName = "RightSidebarPanel";

/* ==========================================================================
   STYLING DEFINITIONS
   ========================================================================== */

const pageHeaderSx = { width: "100%" };
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
const breadcrumbSx = { mb: 1 };
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
  minWidth: 86,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
};

const stepperCardSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const formMainCardSx = {
  p: 4,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const alertSx = {
  mb: 3,
};

const sectionTitleSx = {
  m: 0,
  fontSize: "17.5px",
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.55,
  fontSize: "12.5px",
  color: "var(--app-color-text-muted)",
};

const subSectionTitleSx = {
  m: 0,
  fontSize: "13.5px",
  color: "var(--app-color-text)",
};

const labelSx = {
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
};

const inputSx = {
  minHeight: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const secondaryActionBtnSx = {
  height: 36,
  px: 1.8,
  fontSize: "12px",
  fontWeight: 650,
};

const primaryActionBtnSx = {
  height: 36,
  px: 2,
  fontSize: "12px",
  fontWeight: 700,
};

export default EditCustomerDesktopPage;
