// src/features/parties/customers/pages/mobile/CreateCustomerMobilePage.jsx

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
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

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

const CreateCustomerMobilePage = memo(
  ({
    formData,
    formErrors = {},
    isLoading = false,
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
              {currentStep === 5 ? "Review & Create" : "Create Customer"}
            </AppHeading>
            <AppText variant="body2" weight={500} sx={pageSubtitleSx}>
              {currentStep === 5
                ? "Please review all customer details before creating."
                : "Add your customer details, address, credit limit and licenses."}
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
              <MobileStepCustomerDetails
                formData={formData}
                formErrors={formErrors}
                customerTypeOptions={customerTypeOptions}
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
                customerTypeOptions={customerTypeOptions}
                statusOptions={statusOptions}
                balanceTypeOptions={balanceTypeOptions}
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
                  Your data is safe with us.
                </AppText>
                <AppText variant="body2" weight={500} sx={securityBannerDescSx}>
                  We use advanced security to protect customer profiles.
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
                  disabled={isLoading}
                  sx={actionButtonLeftSx}
                >
                  Back
                </AppButton>
                <AppStack direction="row" gap={1}>
                  <AppButton
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                    sx={actionButtonLeftSx}
                  >
                    Draft
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
                    Create Customer
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
                  disabled={isLoading}
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

CreateCustomerMobilePage.displayName = "CreateCustomerMobilePage";

/* ==========================================================================
   PRESENTATIONAL STEPPER COMPONENT
   ========================================================================== */

const MobileWorkflowStepper = ({ currentStep, onStepClick }) => {
  const stepsMeta = [
    { id: 1, title: "Profile" },
    { id: 2, title: "Addresses" },
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

const MobileStepCustomerDetails = ({
  formData,
  formErrors,
  customerTypeOptions,
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
      Customer Profile
    </AppHeading>
    <AppText variant="body2" sx={formCardSectionDescSx}>
      Enter customer/business name, mobile details and select type.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Customer Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter name"
        required
        error={Boolean(formErrors.name)}
        helperText={formErrors.name}
        startIcon={<FiUser className="text-text-muted" />}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppSelect
        label="Customer Type"
        name="customerType"
        value={formData.customerType || "retail"}
        onChange={handleChange}
        disabled={isLoading}
        options={customerTypeOptions}
        required
        error={Boolean(formErrors.customerType)}
        helperText={formErrors.customerType}
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
    <AppStack
      direction="row"
      align="center"
      justify="space-between"
      fullWidth
      sx={{ borderBottom: "1px solid var(--app-color-border)", pb: 1 }}
    >
      <AppBox>
        <AppHeading level={3} weight={800} sx={formCardSectionHeaderSx}>
          Billing & Shipping Address
        </AppHeading>
        <AppText variant="body2" sx={formCardSectionDescSx}>
          Configure invoicing location targets.
        </AppText>
      </AppBox>

      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-text-muted select-none shrink-0">
        <input
          type="checkbox"
          name="sameAsBilling"
          checked={Boolean(formData.sameAsBilling)}
          onChange={(e) => handleChange("sameAsBilling", e.target.checked)}
          disabled={isLoading}
          className="rounded border-border text-success focus:ring-success w-3.5 h-3.5 cursor-pointer"
        />
        <span>Same</span>
      </label>
    </AppStack>

    <AppStack direction="column" gap={2} sx={{ mt: 1.5 }}>
      {/* Billing Block */}
      <AppBox>
        <AppHeading
          level={4}
          weight={800}
          sx={{ fontSize: "12px", color: "var(--app-color-success)", mb: 1 }}
        >
          Billing Location
        </AppHeading>
        <AppStack direction="column" gap={1.2}>
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
      </AppBox>

      {/* Shipping Block */}
      {!formData.sameAsBilling && (
        <AppBox sx={{ borderTop: "1px solid var(--app-color-divider)", pt: 1.5 }}>
          <AppHeading
            level={4}
            weight={800}
            sx={{ fontSize: "12px", color: "var(--app-color-primary)", mb: 1 }}
          >
            Shipping Location
          </AppHeading>
          <AppStack direction="column" gap={1.2}>
            <AppInput
              label="Address Line 1"
              name="shippingAddressLine1"
              value={formData.shippingAddressLine1 || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Flat/Plot, Street"
              labelSx={mobileLabelSx}
              inputSx={mobileInputSx}
            />
            <AppInput
              label="Address Line 2"
              name="shippingAddressLine2"
              value={formData.shippingAddressLine2 || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Locality/Sector"
              labelSx={mobileLabelSx}
              inputSx={mobileInputSx}
            />
            <div className="grid grid-cols-2 gap-2">
              <AppInput
                label="City"
                name="shippingCity"
                value={formData.shippingCity || ""}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="City"
                labelSx={mobileLabelSx}
                inputSx={mobileInputSx}
              />
              <AppInput
                label="District"
                name="shippingDistrict"
                value={formData.shippingDistrict || ""}
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
                name="shippingState"
                value={formData.shippingState || ""}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="State"
                labelSx={mobileLabelSx}
                inputSx={mobileInputSx}
              />
              <AppInput
                label="Pincode"
                name="shippingPincode"
                value={formData.shippingPincode || ""}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Pincode"
                error={Boolean(formErrors.shippingPincode)}
                helperText={formErrors.shippingPincode}
                labelSx={mobileLabelSx}
                inputSx={mobileInputSx}
              />
            </div>
            <AppInput
              label="Country"
              name="shippingCountry"
              value={formData.shippingCountry || "India"}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Country"
              labelSx={mobileLabelSx}
              inputSx={mobileInputSx}
            />
          </AppStack>
        </AppBox>
      )}
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
      Define credit limit boundaries and opening ledger parameters.
    </AppText>

    <AppStack direction="column" gap={1.4} sx={{ mt: 1.8 }}>
      <AppInput
        label="Credit Limit (₹)"
        name="creditLimit"
        type="number"
        value={formData.creditLimit}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter amount limit"
        error={Boolean(formErrors.creditLimit)}
        helperText={formErrors.creditLimit}
        startIcon={<FiCreditCard className="text-text-muted" />}
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

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
        value={formData.openingBalanceType || "dr"}
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
        placeholder="Enter 10-character PAN"
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
        placeholder="Enter license number"
        labelSx={mobileLabelSx}
        inputSx={mobileInputSx}
      />

      <AppInput
        label="Notes / Comments"
        name="notes"
        value={formData.notes || ""}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter internal notes"
        labelSx={mobileLabelSx}
        inputSx={mobileTextareaSx}
        multiline
        rows={3}
      />
    </AppStack>
  </AppCard>
);

/* ==========================================================================
   STEP 5: HIGH-DENSITY AUDIT REVIEW MODULE
   ========================================================================== */

const MobileStepReviewAndCreate = ({
  formData,
  customerTypeOptions,
  statusOptions,
  balanceTypeOptions,
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

      {/* Review Block 1: Customer Profile */}
      <AppBox sx={reviewBlockContainerSx}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiUser />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Customer Profile
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow label="Name" value={formData.name} />
          <ReviewGridRow
            label="Type"
            value={getLabelFromOptions(customerTypeOptions, formData.customerType)}
          />
          <ReviewGridRow label="Mobile Number" value={formData.mobile} />
          <ReviewGridRow label="Alternate Mobile" value={formData.alternateMobile} />
          <ReviewGridRow label="Email" value={formData.email} />
          <ReviewGridRow
            label="Status"
            value={getLabelFromOptions(statusOptions, formData.status)}
          />
        </AppStack>
      </AppBox>

      {/* Review Block 2: Addresses */}
      <AppBox sx={reviewBlockContainerSx}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiMapPin />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Billing & Shipping
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow
            label="Billing Location"
            value={
              [
                formData.billingAddressLine1,
                formData.billingAddressLine2,
                formData.billingCity,
                formData.billingDistrict,
                formData.billingState,
                formData.billingPincode,
                formData.billingCountry,
              ]
                .filter(Boolean)
                .join(", ") || "—"
            }
          />
          <ReviewGridRow
            label="Shipping Location"
            value={
              formData.sameAsBilling
                ? "Same as Billing Location"
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
                    .join(", ") || "—"
            }
          />
        </AppStack>
      </AppBox>

      {/* Review Block 3: Credit & Financials */}
      <AppBox sx={reviewBlockContainerSx}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiCreditCard />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Credit & Financials
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow
            label="Credit Limit"
            value={`₹ ${Number(formData.creditLimit || 0).toLocaleString()}`}
          />
          <ReviewGridRow label="Credit Days" value={`${formData.creditDays || 0} days`} />
          <ReviewGridRow
            label="Opening Balance"
            value={`₹ ${Number(formData.openingBalance || 0).toLocaleString()} (${getLabelFromOptions(balanceTypeOptions, formData.openingBalanceType)})`}
          />
        </AppStack>
      </AppBox>

      {/* Review Block 4: Regulatory & Notes */}
      <AppBox sx={{ pt: 1.25 }}>
        <AppStack direction="row" gap={0.75} align="center" sx={{ mb: 1 }}>
          <AppBox sx={reviewHeaderIconTrackSx}>
            <FiFileText />
          </AppBox>
          <AppText variant="body2" weight={800} sx={reviewBlockHeaderTitleSx}>
            Identity & Notes
          </AppText>
        </AppStack>
        <AppStack direction="column" gap={0.8}>
          <ReviewGridRow label="GSTIN" value={formData.gstNumber} />
          <ReviewGridRow label="PAN Number" value={formData.panNumber} />
          <ReviewGridRow label="Drug License" value={formData.drugLicenseNumber} />
          <ReviewGridRow label="Notes" value={formData.notes} />
        </AppStack>
      </AppBox>
    </AppCard>
  );
};

const ReviewGridRow = ({ label, value }) => {
  const resolvedValue =
    value === undefined || value === null ? "" : String(value);
  return (
    <div className="grid grid-cols-[130px_1fr] items-start gap-1 text-[11.8px] leading-normal">
      <span className="text-text-muted font-semibold whitespace-nowrap">
        {label}
      </span>
      <span className="text-text font-bold text-left px-0.5 break-words">
        {resolvedValue || "—"}
      </span>
    </div>
  );
};

/* ==========================================================================
   STYLE TOKEN DICTIONARY DEFINITIONS
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
  pt: 0.5,
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
  color: "var(--app-color-text-muted)",
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
  px: 2,
  fontSize: "12px",
  fontWeight: 700,
};

const actionButtonRightSx = {
  height: 40,
  width: "auto",
  px: 2,
  fontSize: "12px",
  fontWeight: 750,
  boxShadow: "none",
};

export default CreateCustomerMobilePage;
