// src/features/parties/suppliers/pages/mobile/EditSupplierMobilePage.jsx

import { memo } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiEdit3,
  FiFileText,
  FiGlobe,
  FiMapPin,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
  FiCreditCard,
  FiDollarSign,
  FiInfo,
  FiRefreshCw,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
} from "@/components";

const EditSupplierMobilePage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
    isFetching = false,
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
      <section className="relative w-full overflow-hidden bg-bg">
        <AppBox sx={containerSx}>
          {/* Section 1: Step Status Header Title Area */}
          <AppBox sx={headerTitleBlockSx}>
            <AppText variant="caption" weight={700} sx={stepTrackerLabelSx}>
              Step {currentStep} of 5
            </AppText>
            <AppHeading level={1} weight={800} sx={pageTitleSx}>
              {currentStep === 5 ? "Review & Save" : "Edit Supplier"}
            </AppHeading>
            <AppText variant="body2" weight={500} sx={pageSubtitleSx}>
              {currentStep === 5
                ? "Please review all modifications before saving."
                : "Modify your supplier details, address, credit terms and licenses."}
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

            {isFetching ? (
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={formCardContainerSx}
              >
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FiRefreshCw className="animate-spin text-[32px] text-info mb-3" />
                  <AppText
                    variant="body2"
                    sx={{ color: "var(--app-color-text-muted)", fontSize: "12px" }}
                  >
                    Retrieving supplier records from server...
                  </AppText>
                </div>
              </AppCard>
            ) : (
              <>
                {currentStep === 1 && (
                  <MobileStepSupplierDetails
                    formData={formData}
                    formErrors={formErrors}
                    supplierTypeOptions={supplierTypeOptions}
                    statusOptions={statusOptions}
                    handleChange={handleChange}
                    isLoading={isLoading}
                  />
                )}

                {currentStep === 2 && (
                  <MobileStepAddressDetails
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    isLoading={isLoading}
                  />
                )}

                {currentStep === 3 && (
                  <MobileStepFinancialDetails
                    formData={formData}
                    formErrors={formErrors}
                    balanceTypeOptions={balanceTypeOptions}
                    handleChange={handleChange}
                    isLoading={isLoading}
                  />
                )}

                {currentStep === 4 && (
                  <MobileStepIdentityDetails
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    isLoading={isLoading}
                  />
                )}

                {currentStep === 5 && (
                  <MobileStepReviewAndCreate
                    formData={formData}
                    supplierTypeOptions={supplierTypeOptions}
                    statusOptions={statusOptions}
                    balanceTypeOptions={balanceTypeOptions}
                    onEditSection={handleStepChange}
                  />
                )}
              </>
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
                  Your data is safe with us.
                </AppText>
                <AppText variant="body2" weight={500} sx={securityBannerDescSx}>
                  We use advanced security to protect supplier profiles.
                </AppText>
              </AppBox>
            </AppStack>
          </AppCard>

          {/* Section 5: Core Form Bottom Presentational Action Bars */}
          <AppBox sx={bottomStickyActionBarSx}>
            {currentStep === 5 ? (
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
                  disabled={isLoading || isFetching}
                  sx={actionButtonLeftSx}
                >
                  Back
                </AppButton>
                <AppStack direction="row" gap={1}>
                  <AppButton
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    onClick={handleResetAndRefresh}
                    disabled={isLoading || isFetching}
                    sx={actionButtonLeftSx}
                  >
                    Reset
                  </AppButton>
                  <AppButton
                    variant="contained"
                    colorVariant="success"
                    rounded="md"
                    startIcon={<FiCheckCircle />}
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading || isFetching}
                    sx={actionButtonRightSx}
                  >
                    Save Changes
                  </AppButton>
                </AppStack>
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
                  startIcon={currentStep > 1 ? <FiArrowLeft /> : undefined}
                  onClick={currentStep > 1 ? handleBack : handleCancel}
                  disabled={isLoading || isFetching}
                  sx={actionButtonCancelSx}
                >
                  {currentStep > 1 ? "Back" : "Cancel"}
                </AppButton>
                <AppButton
                  variant="contained"
                  colorVariant="success"
                  rounded="md"
                  endIcon={<FiArrowRight />}
                  onClick={handleContinue}
                  disabled={isLoading || isFetching}
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

EditSupplierMobilePage.displayName = "EditSupplierMobilePage";

/* ==========================================================================
   PRESENTATIONAL STEPPER COMPONENT
   ========================================================================== */

const MobileWorkflowStepper = ({ currentStep, onStepClick }) => {
  const stepsMeta = [
    { id: 1, title: "Profile" },
    { id: 2, title: "Address" },
    { id: 3, title: "Financials" },
    { id: 4, title: "Identity" },
    { id: 5, title: "Review" },
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
                      width: "40%",
                      left: "-20%",
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
   SUB-MODULE FORMS STEPS
   ========================================================================== */

const MobileStepSupplierDetails = ({
  formData,
  formErrors,
  supplierTypeOptions,
  statusOptions,
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
      Supplier Profile
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Enter supplier/business name, mobile details and select type.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Business Name"
        name="businessName"
        value={formData.businessName || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter business name"
        required
        error={Boolean(formErrors.businessName)}
        helperText={formErrors.businessName}
        startIcon={<FiUser className="text-text-muted" />}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppSelect
        label="Supplier Type"
        name="supplierType"
        value={formData.supplierType || "distributor"}
        onChange={handleChange}
        disabled={isLoading}
        options={supplierTypeOptions}
        required
        error={Boolean(formErrors.supplierType)}
        helperText={formErrors.supplierType}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Mobile Number"
        name="mobile"
        value={formData.mobile || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter 10-digit number"
        error={Boolean(formErrors.mobile)}
        helperText={formErrors.mobile}
        startIcon={<FiPhone className="text-text-muted" />}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Alternate Mobile (Optional)"
        name="alternateMobile"
        value={formData.alternateMobile || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter alt mobile"
        error={Boolean(formErrors.alternateMobile)}
        helperText={formErrors.alternateMobile}
        startIcon={<FiPhone className="text-text-muted" />}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Email Address (Optional)"
        name="email"
        value={formData.email || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter email address"
        error={Boolean(formErrors.email)}
        helperText={formErrors.email}
        startIcon={<FiMail className="text-text-muted" />}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppSelect
        label="Profile Status"
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

const MobileStepAddressDetails = ({
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
      Location Details
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Configure billing and communication address details.
    </AppText>

    <AppStack direction="column" gap={1.2} sx={{ mt: 1.5 }}>
      <AppInput
        label="Address Line 1"
        name="billingAddressLine1"
        value={formData.billingAddressLine1 || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Flat/Plot, Street"
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />
      <AppInput
        label="Address Line 2"
        name="billingAddressLine2"
        value={formData.billingAddressLine2 || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Locality/Sector"
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />
      <div className="grid grid-cols-2 gap-2">
        <AppInput
          label="City"
          name="billingCity"
          value={formData.billingCity || ""}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="City"
          labelSx={mobileLabelSx}
          inputSx={mobileInputSx}
        />
        <AppInput
          label="District"
          name="billingDistrict"
          value={formData.billingDistrict || ""}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="District"
          labelSx={mobileLabelSx}
          inputSx={mobileInputSx}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <AppInput
          label="State"
          name="billingState"
          value={formData.billingState || ""}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="State"
          labelSx={mobileLabelSx}
          inputSx={mobileInputSx}
        />
        <AppInput
          label="Pincode"
          name="billingPincode"
          value={formData.billingPincode || ""}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Pincode"
          error={Boolean(formErrors.billingPincode)}
          helperText={formErrors.billingPincode}
          labelSx={mobileLabelSx}
          inputSx={mobileInputSx}
        />
      </div>
      <AppInput
        label="Country"
        name="billingCountry"
        value={formData.billingCountry || "India"}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Country"
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />
    </AppStack>
  </AppCard>
);

const MobileStepFinancialDetails = ({
  formData,
  formErrors,
  balanceTypeOptions,
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
      Credit & Balance Info
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Define credit days cycle terms and opening ledger parameters.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Credit Days"
        name="creditDays"
        type="number"
        value={formData.creditDays}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="e.g. 30"
        error={Boolean(formErrors.creditDays)}
        helperText={formErrors.creditDays}
        startIcon={<FiInfo className="text-text-muted" />}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Opening Balance (₹)"
        name="openingBalance"
        type="number"
        value={formData.openingBalance}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter opening balance"
        error={Boolean(formErrors.openingBalance)}
        helperText={formErrors.openingBalance}
        startIcon={<FiDollarSign className="text-text-muted" />}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppSelect
        label="Opening Balance Type"
        name="openingBalanceType"
        value={formData.openingBalanceType || "cr"}
        onChange={handleChange}
        disabled={isLoading}
        options={balanceTypeOptions}
        required
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />
    </AppStack>
  </AppCard>
);

const MobileStepIdentityDetails = ({
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
      Regulatory & Identity
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Set tax credentials (GSTIN/PAN) and drug licenses.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="GSTIN"
        name="gstNumber"
        value={formData.gstNumber || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter 15-digit GSTIN"
        error={Boolean(formErrors.gstNumber)}
        helperText={formErrors.gstNumber}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="PAN Number"
        name="panNumber"
        value={formData.panNumber || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter 10-digit PAN"
        error={Boolean(formErrors.panNumber)}
        helperText={formErrors.panNumber}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Drug License Number"
        name="drugLicenseNumber"
        value={formData.drugLicenseNumber || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter License details"
        error={Boolean(formErrors.drugLicenseNumber)}
        helperText={formErrors.drugLicenseNumber}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Internal Notes"
        name="notes"
        value={formData.notes || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Additional notes..."
        multiline
        rows={3}
        error={Boolean(formErrors.notes)}
        helperText={formErrors.notes}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />
    </AppStack>
  </AppCard>
);

const MobileStepReviewAndCreate = ({
  formData,
  supplierTypeOptions,
  statusOptions,
  balanceTypeOptions,
  onEditSection,
}) => {
  const getLabelFromOptions = (value, options) => {
    return options.find((opt) => opt.value === value)?.label || value || "—";
  };

  return (
    <AppStack direction="column" gap={1.5} sx={{ pb: 2 }}>
      {/* Step 1 Profile Review */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="none"
        padding="none"
        sx={formCardContainerSx}
      >
        <AppStack direction="row" align="center" justify="space-between">
          <AppHeading level={3} weight={800} sx={reviewHeaderTitleSx}>
            Supplier Profile
          </AppHeading>
          <AppButton
            variant="text"
            colorVariant="primary"
            size="small"
            onClick={() => onEditSection?.(1)}
            sx={editButtonSx}
          >
            Edit
          </AppButton>
        </AppStack>
        <div className="mt-2.5 grid grid-cols-2 gap-y-3 text-[11.5px]">
          <div>
            <span className="block text-text-muted">Business Name</span>
            <span className="block font-bold text-text mt-0.5">{formData.businessName || "—"}</span>
          </div>
          <div>
            <span className="block text-text-muted">Supplier Type</span>
            <span className="block font-bold text-text mt-0.5">
              {getLabelFromOptions(formData.supplierType, supplierTypeOptions)}
            </span>
          </div>
          <div>
            <span className="block text-text-muted">Mobile Number</span>
            <span className="block font-bold text-text mt-0.5">{formData.mobile || "—"}</span>
          </div>
          <div>
            <span className="block text-text-muted">Status</span>
            <span className="block font-bold text-text mt-0.5">
              {getLabelFromOptions(formData.status, statusOptions)}
            </span>
          </div>
        </div>
      </AppCard>

      {/* Step 2 Address Review */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="none"
        padding="none"
        sx={formCardContainerSx}
      >
        <AppStack direction="row" align="center" justify="space-between">
          <AppHeading level={3} weight={800} sx={reviewHeaderTitleSx}>
            Location Details
          </AppHeading>
          <AppButton
            variant="text"
            colorVariant="primary"
            size="small"
            onClick={() => onEditSection?.(2)}
            sx={editButtonSx}
          >
            Edit
          </AppButton>
        </AppStack>
        <div className="mt-2.5 text-[11.5px]">
          <span className="block text-text-muted">Address Details</span>
          <span className="block font-bold text-text mt-0.5">
            {formData.billingAddressLine1 ? (
              <>
                {formData.billingAddressLine1}
                {formData.billingAddressLine2 ? `, ${formData.billingAddressLine2}` : ""}
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
      </AppCard>

      {/* Step 3 Financials Review */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="none"
        padding="none"
        sx={formCardContainerSx}
      >
        <AppStack direction="row" align="center" justify="space-between">
          <AppHeading level={3} weight={800} sx={reviewHeaderTitleSx}>
            Credit & Financials
          </AppHeading>
          <AppButton
            variant="text"
            colorVariant="primary"
            size="small"
            onClick={() => onEditSection?.(3)}
            sx={editButtonSx}
          >
            Edit
          </AppButton>
        </AppStack>
        <div className="mt-2.5 grid grid-cols-2 gap-y-3 text-[11.5px]">
          <div>
            <span className="block text-text-muted">Credit Days</span>
            <span className="block font-bold text-text mt-0.5">{formData.creditDays || 0} Days</span>
          </div>
          <div>
            <span className="block text-text-muted">Opening Balance</span>
            <span className="block font-bold text-text mt-0.5">
              ₹ {Number(formData.openingBalance || 0).toLocaleString()} ({getLabelFromOptions(formData.openingBalanceType, balanceTypeOptions)})
            </span>
          </div>
        </div>
      </AppCard>

      {/* Step 4 Identity Review */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        shadow="none"
        padding="none"
        sx={formCardContainerSx}
      >
        <AppStack direction="row" align="center" justify="space-between">
          <AppHeading level={3} weight={800} sx={reviewHeaderTitleSx}>
            Identity & Notes
          </AppHeading>
          <AppButton
            variant="text"
            colorVariant="primary"
            size="small"
            onClick={() => onEditSection?.(4)}
            sx={editButtonSx}
          >
            Edit
          </AppButton>
        </AppStack>
        <div className="mt-2.5 grid grid-cols-2 gap-y-3 text-[11.5px]">
          <div>
            <span className="block text-text-muted">GSTIN</span>
            <span className="block font-bold text-text mt-0.5">{formData.gstNumber || "—"}</span>
          </div>
          <div>
            <span className="block text-text-muted">PAN Number</span>
            <span className="block font-bold text-text mt-0.5">{formData.panNumber || "—"}</span>
          </div>
          <div>
            <span className="block text-text-muted">Drug License</span>
            <span className="block font-bold text-text mt-0.5">{formData.drugLicenseNumber || "—"}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-text-muted">Internal Notes</span>
            <span className="block font-bold text-text mt-0.5 whitespace-pre-wrap">{formData.notes || "—"}</span>
          </div>
        </div>
      </AppCard>
    </AppStack>
  );
};

/* ==========================================================================
   STYLING SPECIFICATIONS
   ========================================================================== */

const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0.5,
  pt: 0,
  pb: 0,
};

const headerTitleBlockSx = {
  pt: 1.8,
  pb: 1.2,
};

const stepTrackerLabelSx = {
  fontSize: "10.5px",
  color: "var(--app-color-success)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.35,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const stepperOuterBoundarySx = {
  width: "100%",
  overflow: "hidden",
};

const stepperInnerTrackSx = {
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  borderRadius: "10px",
  p: 1.2,
};

const stepperTitleTextSx = {
  fontSize: "8.5px",
  lineHeight: 1,
  mt: 0.5,
  whiteSpace: "nowrap",
};

const submitErrorTextSx = {
  color: "var(--app-color-danger)",
  fontWeight: 700,
  fontSize: "12px",
  mb: 1.5,
  px: 1,
};

const formCardContainerSx = {
  p: 3,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};

const formCardSectionHeaderSx = {
  m: 0,
  fontSize: "14.5px",
  color: "var(--app-color-text)",
};

const formCardSectionDescSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const mobileLabelSx = {
  fontSize: "11.5px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const mobileInputSx = {
  minHeight: 34,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const reviewHeaderTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const editButtonSx = {
  height: 24,
  px: 1.2,
  fontSize: "11px",
  fontWeight: 700,
};

const securityFooterBannerSx = {
  mt: 2.2,
  p: 1.5,
  bgcolor: "color-mix(in_srgb, var(--app-color-success-soft) 25%, transparent)",
};

const securityBannerTitleSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text)",
  m: 0,
};

const securityBannerDescSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  mt: 0.15,
};

const bottomStickyActionBarSx = {
  mt: 2.2,
  mb: 1.5,
  width: "100%",
};

const actionButtonLeftSx = {
  height: 35,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 700,
};

const actionButtonRightSx = {
  height: 35,
  px: 1.8,
  fontSize: "12px",
  fontWeight: 750,
};

const actionButtonCancelSx = {
  height: 35,
  flex: 0.45,
  fontSize: "12px",
  fontWeight: 700,
};

const actionButtonContinueSx = {
  height: 35,
  flex: 0.55,
  fontSize: "12px",
  fontWeight: 750,
};

export default EditSupplierMobilePage;
