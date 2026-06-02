// src/features/branch/pages/desktop/EditBranchDesktopPage.jsx

import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiEdit3,
  FiEye,
  FiFileText,
  FiGrid,
  FiHash,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiSettings,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppFormSkeleton,
  AppGrid,
  AppHeading,
  AppInput,
  AppKeyValue,
  AppPhoneInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
} from "@/components";

const EditBranchDesktopPage = ({
  formData,
  formErrors,
  isLoading,
  isFetching,
  branchTypeOptions,
  statusOptions,
  billingTypeOptions,
  inventoryModeOptions,
  priceModeOptions,
  currencyOptions,
  timeFormatOptions,
  booleanOptions,
  handleChange,
  handleSubmit,
  handleBack,
}) => {
  if (isFetching) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-3">
        <div className="mx-auto w-full max-w-[1500px]">
          <AppFormSkeleton fields={18} showHeader showActions />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-3">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-3 flex w-full items-center justify-between">
          <AppStack direction="row" align="center" gap={1}>
            <IconBox icon={<FiEdit3 />} large />

            <AppBox>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Edit Branch
              </AppHeading>

              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Branches", onClick: handleBack },
                  { label: "Edit Branch", current: true },
                ]}
                sx={breadcrumbSx}
                itemSx={breadcrumbItemSx}
                currentItemSx={breadcrumbCurrentSx}
              />
            </AppBox>
          </AppStack>

          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            disabled={isLoading}
            sx={backButtonSx}
          >
            Back to Branches
          </AppButton>
        </div>

        <AppBox component="form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-[1fr_330px] gap-3.5">
            <div>
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="sm"
                padding="none"
                sx={mainCardSx}
              >
                {formErrors.submit ? (
                  <AppAlert
                    severity="error"
                    variant="soft"
                    rounded="md"
                    dense
                    sx={{ mb: 1.5 }}
                  >
                    {formErrors.submit}
                  </AppAlert>
                ) : null}

                <FormSection
                  icon={<FiBriefcase />}
                  title="Basic Information"
                  columns={3}
                >
                  <AppInput
                    label="Branch Name"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    placeholder="Enter branch name"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiBriefcase />}
                    error={Boolean(formErrors.branchName)}
                    helperText={formErrors.branchName}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Branch Type"
                    name="branchType"
                    value={formData.branchType}
                    onChange={handleChange}
                    options={branchTypeOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Branch Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="GSTIN"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="Enter GSTIN"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCreditCard />}
                    error={Boolean(formErrors.gstNumber)}
                    helperText={formErrors.gstNumber}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Branch Email"
                    name="branchEmail"
                    value={formData.branchEmail}
                    onChange={handleChange}
                    placeholder="Enter branch email"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiMail />}
                    error={Boolean(formErrors.branchEmail)}
                    helperText={formErrors.branchEmail}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppPhoneInput
                    label="Branch Phone Number"
                    name="branchPhone"
                    value={formData.branchPhone}
                    onChange={handleChange}
                    countryCode={formData.phoneCountryCode || "+91"}
                    showCountryCode
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.branchPhone)}
                    helperText={formErrors.branchPhone}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Drug License Number"
                    name="drugLicenseNumber"
                    value={formData.drugLicenseNumber}
                    onChange={handleChange}
                    placeholder="Enter drug license number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiFileText />}
                    error={Boolean(formErrors.drugLicenseNumber)}
                    helperText={formErrors.drugLicenseNumber}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Primary Branch"
                    name="isPrimary"
                    value={formData.isPrimary}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiMapPin />}
                  title="Address"
                  columns={3}
                  divided
                  green
                >
                  <AppInput
                    label="Address Line 1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Enter address line 1"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    endIcon={<FiMapPin />}
                    error={Boolean(formErrors.addressLine1)}
                    helperText={formErrors.addressLine1}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Address Line 2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Enter address line 2"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiUser />}
                  title="Contact Person"
                  columns={4}
                  divided
                  green
                >
                  <AppInput
                    label="Contact Person Name"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    placeholder="Enter contact person name"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiUser />}
                    error={Boolean(formErrors.contactPersonName)}
                    helperText={formErrors.contactPersonName}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppPhoneInput
                    label="Contact Phone"
                    name="contactPersonPhone"
                    value={formData.contactPersonPhone}
                    onChange={handleChange}
                    countryCode={formData.phoneCountryCode || "+91"}
                    showCountryCode
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.contactPersonPhone)}
                    helperText={formErrors.contactPersonPhone}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Contact Email"
                    name="contactPersonEmail"
                    value={formData.contactPersonEmail}
                    onChange={handleChange}
                    placeholder="Enter contact person email"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiMail />}
                    error={Boolean(formErrors.contactPersonEmail)}
                    helperText={formErrors.contactPersonEmail}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Designation"
                    name="contactPersonDesignation"
                    value={formData.contactPersonDesignation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiBriefcase />}
                    error={Boolean(formErrors.contactPersonDesignation)}
                    helperText={formErrors.contactPersonDesignation}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiCreditCard />}
                  title="Billing Settings"
                  columns={4}
                  divided
                  green
                >
                  <AppSelect
                    label="Billing Type"
                    name="billingType"
                    value={formData.billingType}
                    onChange={handleChange}
                    options={billingTypeOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Invoice Prefix"
                    name="invoicePrefix"
                    value={formData.invoicePrefix}
                    onChange={handleChange}
                    placeholder="INV"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiHash />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Invoice Start Number"
                    name="invoiceStartNumber"
                    value={formData.invoiceStartNumber}
                    onChange={handleChange}
                    placeholder="1"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.invoiceStartNumber)}
                    helperText={formErrors.invoiceStartNumber}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Bill Prefix"
                    name="billPrefix"
                    value={formData.billPrefix}
                    onChange={handleChange}
                    placeholder="BILL"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiHash />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Bill Start Number"
                    name="billStartNumber"
                    value={formData.billStartNumber}
                    onChange={handleChange}
                    placeholder="1"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.billStartNumber)}
                    helperText={formErrors.billStartNumber}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Purchase Prefix"
                    name="purchasePrefix"
                    value={formData.purchasePrefix}
                    onChange={handleChange}
                    placeholder="PUR"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiHash />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Purchase Start Number"
                    name="purchaseStartNumber"
                    value={formData.purchaseStartNumber}
                    onChange={handleChange}
                    placeholder="1"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.purchaseStartNumber)}
                    helperText={formErrors.purchaseStartNumber}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Sales Return Prefix"
                    name="salesReturnPrefix"
                    value={formData.salesReturnPrefix}
                    onChange={handleChange}
                    placeholder="SR"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiHash />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Purchase Return Prefix"
                    name="purchaseReturnPrefix"
                    value={formData.purchaseReturnPrefix}
                    onChange={handleChange}
                    placeholder="PR"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiHash />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiGrid />}
                  title="Inventory Settings"
                  columns={4}
                  divided
                  green
                >
                  <AppSelect
                    label="Inventory Mode"
                    name="inventoryMode"
                    value={formData.inventoryMode}
                    onChange={handleChange}
                    options={inventoryModeOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Price Mode"
                    name="priceMode"
                    value={formData.priceMode}
                    onChange={handleChange}
                    options={priceModeOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Allow Negative Stock"
                    name="allowNegativeStock"
                    value={formData.allowNegativeStock}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Allow Backdated Entries"
                    name="allowBackdatedEntries"
                    value={formData.allowBackdatedEntries}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Batch Tracking"
                    name="enableBatchTracking"
                    value={formData.enableBatchTracking}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Expiry Tracking"
                    name="enableExpiryTracking"
                    value={formData.enableExpiryTracking}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Rack Tracking"
                    name="enableRackTracking"
                    value={formData.enableRackTracking}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiSettings />}
                  title="Branch Settings"
                  columns={4}
                  divided
                  green
                >
                  <AppInput
                    label="Timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    placeholder="Asia/Kolkata"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiClock />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    options={currencyOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Date Format"
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleChange}
                    placeholder="DD/MM/YYYY"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCalendar />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Time Format"
                    name="timeFormat"
                    value={formData.timeFormat}
                    onChange={handleChange}
                    options={timeFormatOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Default GST Rate"
                    name="defaultGstRate"
                    value={formData.defaultGstRate}
                    onChange={handleChange}
                    placeholder="0"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.defaultGstRate)}
                    helperText={formErrors.defaultGstRate}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Purchase Module"
                    name="enablePurchaseModule"
                    value={formData.enablePurchaseModule}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Sales Module"
                    name="enableSalesModule"
                    value={formData.enableSalesModule}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Inventory Module"
                    name="enableInventoryModule"
                    value={formData.enableInventoryModule}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="POS Billing"
                    name="enablePosBilling"
                    value={formData.enablePosBilling}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <div className="mt-4 border-t border-border pt-3">
                  <AppStack
                    direction="row"
                    align="center"
                    justify="flex-end"
                    gap={1}
                  >
                    <AppButton
                      type="button"
                      variant="outlined"
                      colorVariant="neutral"
                      rounded="md"
                      disabled={isLoading}
                      onClick={handleBack}
                      sx={cancelButtonSx}
                    >
                      Cancel
                    </AppButton>

                    <AppButton
                      type="submit"
                      variant="contained"
                      colorVariant="primary"
                      rounded="md"
                      startIcon={<FiSave />}
                      loading={isLoading}
                      disabled={isLoading}
                      sx={saveButtonSx}
                    >
                      Update Branch
                    </AppButton>
                  </AppStack>
                </div>
              </AppCard>
            </div>

            <BranchPreview formData={formData} />
          </div>
        </AppBox>
      </div>
    </section>
  );
};

const FormSection = ({ icon, title, columns, children, divided, green }) => (
  <AppBox sx={divided ? sectionDividedSx : sectionSx}>
    <AppStack direction="row" align="center" gap={0.8} sx={{ mb: 1.35 }}>
      <span
        className={[
          "flex text-[15px]",
          green ? "text-primary" : "text-text-muted",
        ].join(" ")}
      >
        {icon}
      </span>

      <AppHeading level={2} weight={650} sx={sectionTitleSx}>
        {title}
      </AppHeading>
    </AppStack>

    <AppGrid columns={columns} gap={1.25} columnGap={2}>
      {children}
    </AppGrid>
  </AppBox>
);

const BranchPreview = ({ formData }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={previewCardSx}
  >
    <AppStack direction="row" align="center" gap={0.8}>
      <FiEye className="text-[15px] text-primary" />

      <AppHeading level={2} weight={650} sx={sectionTitleSx}>
        Branch Preview
      </AppHeading>
    </AppStack>

    <div className="mt-3 h-px bg-border" />

    <div className="flex w-full flex-col items-center justify-center py-2">
      <div className="mx-auto flex h-[70px] w-[70px] items-center justify-center rounded-full bg-primary-soft text-primary">
        <FiShoppingCart className="text-[31px]" />
      </div>

      <AppHeading level={3} weight={700} sx={previewTitleSx}>
        {formData.branchName || "Branch Name"}
      </AppHeading>

      <div className="mt-0.8 flex w-full justify-center">
        <AppStatusBadge
          status={formData.status || "active"}
          size="small"
          variant="soft"
          rounded="full"
          sx={statusBadgeSx}
        />
      </div>
    </div>

    <div className="h-px bg-border" />

    <AppStack direction="column" gap={1.25} sx={{ py: 1.8 }}>
      <PreviewRow
        icon={<FiBriefcase />}
        label="Type"
        value={formData.branchType}
      />

      <PreviewRow
        icon={<FiCreditCard />}
        label="GSTIN"
        value={formData.gstNumber}
      />

      <PreviewRow
        icon={<FiFileText />}
        label="Drug License"
        value={formData.drugLicenseNumber}
      />

      <PreviewRow
        icon={<FiMail />}
        label="Email"
        value={formData.branchEmail}
      />

      <PreviewRow
        icon={<FiPhone />}
        label="Phone"
        value={`${formData.phoneCountryCode || "+91"} ${
          formData.branchPhone || ""
        }`}
      />

      <PreviewRow
        icon={<FiMapPin />}
        label="Address"
        value={[
          formData.addressLine1,
          formData.addressLine2,
          formData.city,
          formData.state,
          formData.pincode,
        ]
          .filter(Boolean)
          .join(", ")}
      />

      <PreviewRow
        icon={<FiUser />}
        label="Contact"
        value={formData.contactPersonName}
      />
    </AppStack>

    <div className="h-px bg-border" />

    <AppStack direction="column" gap={1.25} sx={{ pt: 1.8 }}>
      <PreviewRow
        icon={<FiGrid />}
        label="Inventory"
        value={formData.inventoryMode}
      />

      <PreviewRow
        icon={<FiCreditCard />}
        label="Billing"
        value={formData.billingType}
      />

      <PreviewRow
        icon={<FiBriefcase />}
        label="Primary"
        value={formData.isPrimary === "true" ? "Yes" : "No"}
      />

      <PreviewRow icon={<FiClock />} label="Mode" value="Editing branch" />
    </AppStack>
  </AppCard>
);

const PreviewRow = ({ icon, label, value }) => (
  <AppStack direction="row" align="flex-start" gap={1}>
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-[14px] text-primary">
      {icon}
    </span>

    <AppKeyValue
      label={label}
      value={value || "-"}
      direction="row"
      align="space-between"
      size="small"
      sx={{ flex: 1, gap: 1 }}
      labelSx={previewLabelSx}
      valueSx={previewValueSx}
    />
  </AppStack>
);

const IconBox = ({ icon, large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 44 : 34,
      height: large ? 44 : 34,
      minWidth: large ? 44 : 34,
      borderRadius: large ? "11px" : "10px",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: large ? "23px" : "17px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  lineHeight: 1.12,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = {
  mt: 0.2,
};

const breadcrumbItemSx = {
  fontSize: "11.5px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "11.5px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const backButtonSx = {
  height: 34,
  px: 1.55,
  fontSize: "11.8px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const mainCardSx = {
  px: 2,
  py: 1.45,
  bgcolor: "var(--app-color-surface)",
};

const previewCardSx = {
  alignSelf: "start",
  px: 1.8,
  py: 1.45,
  bgcolor: "var(--app-color-surface)",
};

const sectionSx = {
  m: 0,
};

const sectionDividedSx = {
  mt: 1.8,
  pt: 1.55,
  borderTop: "1px solid var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const labelSx = {
  mb: 0.3,
  fontSize: "11.3px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 35,
  fontSize: "12.3px",
  fontWeight: 500,
  bgcolor: "var(--app-color-surface-alt)",
};

const previewTitleSx = {
  mt: 1.35,
  mb: 0,
  width: "100%",
  textAlign: "center",
  fontSize: "15px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const statusBadgeSx = {
  width: "fit-content",
  flex: "0 0 auto",
};

const previewLabelSx = {
  minWidth: 78,
  fontSize: "11.3px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const previewValueSx = {
  textAlign: "right",
  fontSize: "11.3px",
  lineHeight: "16px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const cancelButtonSx = {
  height: 36,
  px: 2,
  fontSize: "12px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const saveButtonSx = {
  height: 36,
  px: 2.4,
  fontSize: "12px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

export default EditBranchDesktopPage;
