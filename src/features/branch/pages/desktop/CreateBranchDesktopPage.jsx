// src/features/branch/pages/desktop/CreateBranchDesktopPage.jsx

import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiEye,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiSettings,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import {
  AppAccordion,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppGrid,
  AppHeading,
  AppInput,
  AppKeyValue,
  AppPhoneInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppText,
} from "@/components";

const CreateBranchDesktopPage = ({
  formData,
  formErrors,
  isLoading,
  companyOptions,
  branchTypeOptions,
  stateOptions,
  countryOptions,
  inventoryTrackingOptions,
  posEnabledOptions,
  allowNegativeStockOptions,
  handleChange,
  handleSubmit,
  handleBack,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-3">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-3 flex w-full items-center justify-between">
          <AppStack direction="row" align="center" gap={1}>
            <IconBox icon={<FiMapPin />} large />

            <AppBox>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Create Branch
              </AppHeading>

              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Branches", onClick: handleBack },
                  { label: "Create Branch", current: true },
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
                <FormSection
                  icon={<FiMapPin />}
                  title="Branch Information"
                  columns={3}
                >
                  <AppSelect
                    label="Company"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    options={companyOptions}
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.companyId)}
                    helperText={formErrors.companyId}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

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
                    startIcon={<FiShoppingBag />}
                    error={Boolean(formErrors.branchName)}
                    helperText={formErrors.branchName}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Branch Code"
                    name="branchCode"
                    value={formData.branchCode}
                    onChange={handleChange}
                    placeholder="BR-001"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiFileText />}
                    error={Boolean(formErrors.branchCode)}
                    helperText={formErrors.branchCode}
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
                </FormSection>

                <FormSection
                  icon={<FiUser />}
                  title="Manager Details"
                  columns={2}
                  divided
                  green
                >
                  <AppInput
                    label="Manager Name"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    placeholder="Enter manager name"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiUser />}
                    error={Boolean(formErrors.managerName)}
                    helperText={formErrors.managerName}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppPhoneInput
                    label="Manager Phone Number"
                    name="managerPhone"
                    value={formData.managerPhone}
                    onChange={handleChange}
                    countryCode={formData.phoneCountryCode || "+91"}
                    showCountryCode
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
                  title="Branch Address"
                  columns={3}
                  divided
                  green
                >
                  <AppBox sx={{ gridColumn: "span 2" }}>
                    <AppInput
                      label="Address Line 1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="Enter address line 1"
                      required
                      fullWidth
                      size="small"
                      variant="bordered"
                      rounded="md"
                      startIcon={<FiMapPin />}
                      error={Boolean(formErrors.addressLine1)}
                      helperText={formErrors.addressLine1}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </AppBox>

                  <AppInput
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="400069"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.pincode)}
                    helperText={formErrors.pincode}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppBox sx={{ gridColumn: "span 2" }}>
                    <AppInput
                      label="Address Line 2 (Optional)"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Nearby landmark or area"
                      fullWidth
                      size="small"
                      variant="bordered"
                      rounded="md"
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </AppBox>

                  <AppInput
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.city)}
                    helperText={formErrors.city}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    options={stateOptions}
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.state)}
                    helperText={formErrors.state}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    options={countryOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiCreditCard />}
                  title="Compliance Details"
                  columns={3}
                  divided
                  green
                >
                  <AppInput
                    label="GST Number (Optional)"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="Enter GST number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCreditCard />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Drug License Number (Optional)"
                    name="drugLicenseNumber"
                    value={formData.drugLicenseNumber}
                    onChange={handleChange}
                    placeholder="Enter drug license"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiFileText />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="FSSAI Number (Optional)"
                    name="fssaiNumber"
                    value={formData.fssaiNumber}
                    onChange={handleChange}
                    placeholder="Enter FSSAI number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiFileText />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiClock />}
                  title="Operations Settings"
                  columns={4}
                  divided
                  green
                >
                  <AppInput
                    label="Opening Time"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleChange}
                    placeholder="09:00"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiClock />}
                    error={Boolean(formErrors.openingTime)}
                    helperText={formErrors.openingTime}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Closing Time"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleChange}
                    placeholder="22:00"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCalendar />}
                    error={Boolean(formErrors.closingTime)}
                    helperText={formErrors.closingTime}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Inventory Tracking"
                    name="inventoryTracking"
                    value={formData.inventoryTracking}
                    onChange={handleChange}
                    options={inventoryTrackingOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="POS Enabled"
                    name="posEnabled"
                    value={formData.posEnabled}
                    onChange={handleChange}
                    options={posEnabledOptions}
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
                    options={allowNegativeStockOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <div className="-mx-4 mt-3 border-t border-border px-4 pt-2.5">
                  <AppAccordion
                    size="small"
                    variant="ghost"
                    items={[
                      {
                        id: "additional-settings",
                        title: "Additional Settings (Optional)",
                        icon: <FiSettings />,
                        content: (
                          <AppText variant="body2" sx={mutedTextSx}>
                            More branch settings can be added here later.
                          </AppText>
                        ),
                      },
                    ]}
                    sx={accordionSx}
                    summarySx={accordionSummarySx}
                    detailsSx={accordionDetailsSx}
                  />
                </div>
              </AppCard>

              <div className="mt-2 flex w-full justify-end">
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
                    size="small"
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
                    size="small"
                    startIcon={<FiSave />}
                    loading={isLoading}
                    sx={saveButtonSx}
                  >
                    Save Branch
                  </AppButton>
                </AppStack>
              </div>
            </div>

            <BranchPreview
              formData={formData}
              companyOptions={companyOptions}
            />
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

const BranchPreview = ({ formData, companyOptions }) => {
  const companyName =
    companyOptions.find((company) => company.value === formData.companyId)
      ?.label || "-";

  return (
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

      <AppBox sx={previewHeaderSx}>
        <div className="mx-auto flex h-[70px] w-[70px] items-center justify-center rounded-full bg-primary-soft text-primary">
          <FiMapPin className="text-[31px]" />
        </div>

        <AppHeading level={3} weight={700} sx={previewTitleSx}>
          {formData.branchName || "Branch Name"}
        </AppHeading>

        <div className="flex w-full justify-center" style={{ marginTop: 8 }}>
          <AppStatusBadge
            status={formData.status || "active"}
            size="small"
            variant="soft"
            rounded="full"
            sx={statusBadgeSx}
          />
        </div>
      </AppBox>

      <div className="h-px bg-border" />

      <AppStack direction="column" gap={1.25} sx={{ py: 1.8 }}>
        <PreviewRow
          icon={<FiBriefcase />}
          label="Company"
          value={companyName}
        />
        <PreviewRow
          icon={<FiFileText />}
          label="Code"
          value={formData.branchCode}
        />
        <PreviewRow
          icon={<FiShoppingBag />}
          label="Type"
          value={formatValue(formData.branchType)}
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
            formData.pincode,
          ]
            .filter(Boolean)
            .join(", ")}
        />
      </AppStack>

      <div className="h-px bg-border" />

      <AppStack direction="column" gap={1.25} sx={{ py: 1.8 }}>
        <PreviewRow
          icon={<FiUser />}
          label="Manager"
          value={formData.managerName}
        />
        <PreviewRow
          icon={<FiClock />}
          label="Timing"
          value={`${formData.openingTime || "-"} - ${
            formData.closingTime || "-"
          }`}
        />
        <PreviewRow
          icon={<FiCreditCard />}
          label="Inventory"
          value={formatValue(formData.inventoryTracking)}
        />
        <PreviewRow
          icon={<FiShoppingBag />}
          label="POS"
          value={formatValue(formData.posEnabled)}
        />
      </AppStack>

      <div className="h-px bg-border" />

      <AppStack direction="column" gap={1.25} sx={{ pt: 1.8 }}>
        <PreviewRow icon={<FiUser />} label="Created By" value="Admin" />
        <PreviewRow
          icon={<FiClock />}
          label="Created On"
          value="21 May 2024, 10:45 AM"
        />
      </AppStack>
    </AppCard>
  );
};

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

const formatValue = (value) => {
  if (!value) return "-";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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

const previewHeaderSx = {
  width: "100%",
  py: 1.8,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
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
  minWidth: 74,
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

const mutedTextSx = {
  fontSize: "11.3px",
  color: "var(--app-color-text-muted)",
};

const accordionSx = {
  boxShadow: "none",
  bgcolor: "transparent",
};

const accordionSummarySx = {
  minHeight: 26,
  px: 0,
  py: 0,
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const accordionDetailsSx = {
  px: 0,
  pt: 0.7,
  pb: 0,
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

export default CreateBranchDesktopPage;
