// src/features/company/pages/desktop/CreateCompanyDesktopPage.jsx

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

const CreateCompanyDesktopPage = ({
  formData,
  formErrors,
  isLoading,
  currencyOptions,
  taxPreferenceOptions,
  financialYearOptions,
  handleChange,
  handleSubmit,
  handleBack,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-3">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-3 flex w-full items-center justify-between">
          <AppStack direction="row" align="center" gap={1}>
            <IconBox icon={<FiBriefcase />} large />

            <AppBox>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Create Company
              </AppHeading>

              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Companies", onClick: handleBack },
                  { label: "Create Company", current: true },
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
            Back to Companies
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
                  icon={<FiBriefcase />}
                  title="Basic Information"
                  columns={2}
                >
                  <AppInput
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiBriefcase />}
                    error={Boolean(formErrors.companyName)}
                    helperText={formErrors.companyName}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Legal Company Name (Optional)"
                    name="legalCompanyName"
                    value={formData.legalCompanyName}
                    onChange={handleChange}
                    placeholder="Enter legal company name"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiBriefcase />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="GST Number"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="Enter GST number"
                    required
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
                    label="PAN Number (Optional)"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="Enter PAN number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCreditCard />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Company Email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    placeholder="Enter company email"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiMail />}
                    error={Boolean(formErrors.companyEmail)}
                    helperText={formErrors.companyEmail}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppPhoneInput
                    label="Company Phone Number"
                    name="companyPhone"
                    value={formData.companyPhone}
                    onChange={handleChange}
                    countryCode={formData.phoneCountryCode || "+91"}
                    showCountryCode
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.companyPhone)}
                    helperText={formErrors.companyPhone}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiFileText />}
                  title="Licenses & Compliance"
                  columns={3}
                  divided
                  green
                >
                  <AppInput
                    label="Drug License Number"
                    name="drugLicenseNumber"
                    value={formData.drugLicenseNumber}
                    onChange={handleChange}
                    placeholder="Enter license number"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.drugLicenseNumber)}
                    helperText={formErrors.drugLicenseNumber}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Drug License Expiry"
                    name="drugLicenseExpiry"
                    value={formData.drugLicenseExpiry}
                    onChange={handleChange}
                    placeholder="Select expiry date"
                    required
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCalendar />}
                    error={Boolean(formErrors.drugLicenseExpiry)}
                    helperText={formErrors.drugLicenseExpiry}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Trade License Number (Optional)"
                    name="tradeLicenseNumber"
                    value={formData.tradeLicenseNumber}
                    onChange={handleChange}
                    placeholder="Enter trade license"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiFileText />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Trade License Expiry (Optional)"
                    name="tradeLicenseExpiry"
                    value={formData.tradeLicenseExpiry}
                    onChange={handleChange}
                    placeholder="Select expiry date"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCalendar />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppBox sx={{ gridColumn: "span 2" }}>
                    <AppInput
                      label="Legal Address"
                      name="legalAddress"
                      value={formData.legalAddress}
                      onChange={handleChange}
                      placeholder="Enter legal address"
                      required
                      fullWidth
                      size="small"
                      variant="bordered"
                      rounded="md"
                      endIcon={<FiMapPin />}
                      error={Boolean(formErrors.legalAddress)}
                      helperText={formErrors.legalAddress}
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </AppBox>
                </FormSection>

                <FormSection
                  icon={<FiCreditCard />}
                  title="Tax & Billing Settings"
                  columns={4}
                  divided
                  green
                >
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

                  <AppSelect
                    label="Tax Preference"
                    name="taxPreference"
                    value={formData.taxPreference}
                    onChange={handleChange}
                    options={taxPreferenceOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Default Billing Prefix"
                    name="defaultBillingPrefix"
                    value={formData.defaultBillingPrefix}
                    onChange={handleChange}
                    placeholder="INV-"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Financial Year Start"
                    name="financialYearStart"
                    value={formData.financialYearStart}
                    onChange={handleChange}
                    options={financialYearOptions}
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
                            More company settings can be added here later.
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
                    Save Company
                  </AppButton>
                </AppStack>
              </div>
            </div>

            <CompanyPreview formData={formData} />
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

const CompanyPreview = ({ formData }) => (
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
        Company Preview
      </AppHeading>
    </AppStack>

    <div className="mt-3 h-px bg-border" />

    <div className="flex w-full flex-col items-center justify-center py-2">
      <div className="mx-auto flex h-[70px] w-[70px] items-center justify-center rounded-full bg-primary-soft text-primary">
        <FiBriefcase className="text-[31px]" />
      </div>

      <AppHeading level={3} weight={700} sx={previewTitleSx}>
        {formData.companyName || "Company Name"}
      </AppHeading>

      <div className="mt-0.8 flex w-full justify-center">
        <AppStatusBadge
          status="active"
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
        icon={<FiFileText />}
        label="GST Number"
        value={formData.gstNumber}
      />
      <PreviewRow
        icon={<FiCreditCard />}
        label="PAN Number"
        value={formData.panNumber}
      />
      <PreviewRow
        icon={<FiMail />}
        label="Email"
        value={formData.companyEmail}
      />
      <PreviewRow
        icon={<FiPhone />}
        label="Phone"
        value={`${formData.phoneCountryCode || "+91"} ${
          formData.companyPhone || ""
        }`}
      />
      <PreviewRow
        icon={<FiMapPin />}
        label="Address"
        value={formData.legalAddress}
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

export default CreateCompanyDesktopPage;
