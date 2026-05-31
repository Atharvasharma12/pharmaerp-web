// src/features/company/pages/desktop/CreateCompanyDesktopPage.jsx

import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiChevronDown,
  FiCreditCard,
  FiEye,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiSettings,
  FiUser,
  FiClock,
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
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto max-w-[1500px]">
        <AppStack direction="row" align="center" justify="space-between">
          <AppStack direction="row" align="center" gap={1.4}>
            <IconBox icon={<FiBriefcase />} large />

            <AppBox>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Create Company
              </AppHeading>

              <AppStack
                direction="row"
                align="center"
                gap={0.8}
                sx={{ mt: 0.5 }}
              >
                <AppText variant="body2" sx={breadcrumbSx}>
                  Companies
                </AppText>
                <FiChevronDown className="-rotate-90 text-[13px] text-text-muted" />
                <AppText variant="body2" sx={breadcrumbActiveSx}>
                  Create Company
                </AppText>
              </AppStack>
            </AppBox>
          </AppStack>

          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            sx={backButtonSx}
          >
            Back to Companies
          </AppButton>
        </AppStack>

        <form onSubmit={handleSubmit}>
          <div className="mt-4 grid grid-cols-[1fr_360px] gap-4">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={mainCardSx}
            >
              <SectionHeader icon={<FiBriefcase />} title="Basic Information" />

              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <AppInput
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                  fullWidth
                  variant="bordered"
                  rounded="md"
                  size="small"
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
                  variant="bordered"
                  rounded="md"
                  size="small"
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
                  variant="bordered"
                  rounded="md"
                  size="small"
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
                  variant="bordered"
                  rounded="md"
                  size="small"
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
                  variant="bordered"
                  rounded="md"
                  size="small"
                  startIcon={<FiMail />}
                  error={Boolean(formErrors.companyEmail)}
                  helperText={formErrors.companyEmail}
                  labelSx={labelSx}
                  inputSx={inputSx}
                />

                <PhoneInput
                  label="Company Phone Number"
                  countryCodeName="phoneCountryCode"
                  phoneName="companyPhone"
                  countryCode={formData.phoneCountryCode}
                  phone={formData.companyPhone}
                  onChange={handleChange}
                  error={formErrors.companyPhone}
                />
              </div>

              <Divider />

              <SectionHeader
                icon={<FiFileText />}
                title="Licenses & Compliance"
                green
              />

              <div className="grid grid-cols-3 gap-x-5 gap-y-3">
                <AppInput
                  label="Drug License Number"
                  name="drugLicenseNumber"
                  value={formData.drugLicenseNumber}
                  onChange={handleChange}
                  placeholder="Enter license number"
                  required
                  fullWidth
                  variant="bordered"
                  rounded="md"
                  size="small"
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
                  variant="bordered"
                  rounded="md"
                  size="small"
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
                  variant="bordered"
                  rounded="md"
                  size="small"
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
                  variant="bordered"
                  rounded="md"
                  size="small"
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
                    variant="bordered"
                    rounded="md"
                    size="small"
                    endIcon={<FiMapPin />}
                    error={Boolean(formErrors.legalAddress)}
                    helperText={formErrors.legalAddress}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </AppBox>
              </div>

              <Divider />

              <SectionHeader
                icon={<FiFileText />}
                title="Tax & Billing Settings"
                green
              />

              <div className="grid grid-cols-4 gap-x-5 gap-y-3">
                <AppSelect
                  label="Currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  options={currencyOptions}
                  fullWidth
                  variant="bordered"
                  rounded="md"
                  size="small"
                  labelSx={labelSx}
                  selectSx={inputSx}
                />

                <AppSelect
                  label="Tax Preference"
                  name="taxPreference"
                  value={formData.taxPreference}
                  onChange={handleChange}
                  options={taxPreferenceOptions}
                  fullWidth
                  variant="bordered"
                  rounded="md"
                  size="small"
                  labelSx={labelSx}
                  selectSx={inputSx}
                />

                <AppInput
                  label="Default Billing Prefix"
                  name="defaultBillingPrefix"
                  value={formData.defaultBillingPrefix}
                  onChange={handleChange}
                  placeholder="INV-"
                  fullWidth
                  variant="bordered"
                  rounded="md"
                  size="small"
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
                  variant="bordered"
                  rounded="md"
                  size="small"
                  labelSx={labelSx}
                  selectSx={inputSx}
                />
              </div>

              <Divider />

              <button
                type="button"
                className="flex w-full items-center justify-between px-0 py-0 text-left"
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold text-text">
                  <FiSettings className="text-[16px] text-text-muted" />
                  Additional Settings{" "}
                  <span className="font-medium text-text-muted">
                    (Optional)
                  </span>
                </span>

                <FiChevronDown className="text-[15px] text-text-muted" />
              </button>
            </AppCard>

            <CompanyPreview formData={formData} />
          </div>

          <AppStack
            direction="row"
            align="center"
            justify="flex-end"
            gap={1.2}
            sx={{ mt: 3 }}
          >
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
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
              disabled={isLoading}
              sx={saveButtonSx}
            >
              {isLoading ? "Saving..." : "Save Company"}
            </AppButton>
          </AppStack>
        </form>
      </div>
    </section>
  );
};

const CompanyPreview = ({ formData }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={previewCardSx}
  >
    <SectionHeader icon={<FiEye />} title="Company Preview" green />

    <div className="mt-3 h-px bg-border" />

    <AppStack direction="column" align="center" sx={{ py: 2.2 }}>
      <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-primary-soft text-primary">
        <FiBriefcase className="text-[38px]" />
      </div>

      <AppHeading level={2} weight={700} sx={previewTitleSx}>
        {formData.companyName || "Company Name"}
      </AppHeading>

      <span className="mt-2 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success">
        Active
      </span>
    </AppStack>

    <div className="h-px bg-border" />

    <div className="space-y-3 py-3">
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
        value={`${formData.phoneCountryCode || ""} ${formData.companyPhone || ""}`}
      />
      <PreviewRow
        icon={<FiMapPin />}
        label="Address"
        value={formData.legalAddress}
      />
    </div>

    <div className="h-px bg-border" />

    <div className="space-y-3 pt-3">
      <PreviewRow icon={<FiUser />} label="Created By" value="Admin" />
      <PreviewRow
        icon={<FiClock />}
        label="Created On"
        value="21 May 2024, 10:45 AM"
      />
    </div>
  </AppCard>
);

const PreviewRow = ({ icon, label, value }) => (
  <div className="grid grid-cols-[28px_92px_1fr] items-start gap-2">
    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-[15px] text-primary">
      {icon}
    </span>

    <AppText variant="body2" sx={previewLabelSx}>
      {label}
    </AppText>

    <AppText variant="body2" sx={previewValueSx}>
      {value || "-"}
    </AppText>
  </div>
);

const SectionHeader = ({ icon, title, green = false }) => (
  <AppStack direction="row" align="center" gap={1} sx={{ mb: 2 }}>
    <span
      className={[
        "flex items-center justify-center text-[16px]",
        green ? "text-primary" : "text-text-muted",
      ].join(" ")}
    >
      {icon}
    </span>

    <AppHeading level={2} weight={650} sx={sectionTitleSx}>
      {title}
    </AppHeading>
  </AppStack>
);

const PhoneInput = ({
  label,
  countryCodeName,
  phoneName,
  countryCode,
  phone,
  onChange,
  error,
}) => (
  <AppBox>
    <AppText component="label" variant="body2" sx={labelSx}>
      {label}
    </AppText>

    <div className="mt-[5px] grid h-[38px] grid-cols-[120px_1fr] overflow-hidden rounded-md border border-border bg-surface-alt">
      <select
        name={countryCodeName}
        value={countryCode}
        onChange={onChange}
        className="h-full border-r border-border bg-transparent px-3 text-[13px] font-medium text-text outline-none"
      >
        <option value="+91">🇮🇳 +91</option>
      </select>

      <input
        name={phoneName}
        value={phone}
        onChange={onChange}
        placeholder="Enter phone number"
        className="h-full bg-transparent px-3 text-[13px] font-medium text-text outline-none placeholder:text-text-muted"
      />
    </div>

    {error && <div className="mt-1 text-[11px] text-error">{error}</div>}
  </AppBox>
);

const IconBox = ({ icon, large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 50 : 36,
      height: large ? 50 : 36,
      minWidth: large ? 50 : 36,
      borderRadius: large ? "12px" : "10px",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: large ? "27px" : "18px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const Divider = () => <div className="-mx-5 my-3 h-px bg-border" />;

const pageTitleSx = {
  m: 0,
  fontSize: "26px",
  lineHeight: 1.15,
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = {
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
};

const breadcrumbActiveSx = {
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const backButtonSx = {
  height: 38,
  px: 1.8,
  fontSize: "12.5px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const mainCardSx = {
  px: 2,
  py: 1.8,
  bgcolor: "var(--app-color-surface)",
};

const previewCardSx = {
  alignSelf: "start",
  px: 2,
  py: 1.8,
  bgcolor: "var(--app-color-surface)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const labelSx = {
  mb: 0.4,
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 38,
  fontSize: "13px",
  fontWeight: 500,
  bgcolor: "var(--app-color-surface-alt)",
};

const previewTitleSx = {
  mt: 1.8,
  mb: 0,
  textAlign: "center",
  fontSize: "18px",
  color: "var(--app-color-text)",
};

const previewLabelSx = {
  pt: 0.45,
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const previewValueSx = {
  pt: 0.45,
  fontSize: "12px",
  lineHeight: "18px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const cancelButtonSx = {
  height: 40,
  px: 2.2,
  fontSize: "13px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const saveButtonSx = {
  height: 40,
  px: 2.8,
  fontSize: "13px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

export default CreateCompanyDesktopPage;
