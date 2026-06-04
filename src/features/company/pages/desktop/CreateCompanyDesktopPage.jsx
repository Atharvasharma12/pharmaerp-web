// src/features/company/pages/desktop/CreateCompanyDesktopPage.jsx

import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiEye,
  FiFileText,
  FiGlobe,
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
  companyTypeOptions,
  currencyOptions,
  gstTypeOptions,
  licenseStatusOptions,
  statusOptions,
  timeFormatOptions,
  booleanOptions,
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
            disabled={isLoading}
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
                  columns={3}
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

                  <AppSelect
                    label="Company Type"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    options={companyTypeOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiGlobe />}
                    error={Boolean(formErrors.website)}
                    helperText={formErrors.website}
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
                    label="PAN Number"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="Enter PAN number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCreditCard />}
                    error={Boolean(formErrors.panNumber)}
                    helperText={formErrors.panNumber}
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
                    label="Mobile Number"
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

                  <AppPhoneInput
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    countryCode={formData.phoneCountryCode || "+91"}
                    showCountryCode
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.whatsappNumber)}
                    helperText={formErrors.whatsappNumber}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Landline Number"
                    name="landlineNumber"
                    value={formData.landlineNumber}
                    onChange={handleChange}
                    placeholder="Enter landline number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiPhone />}
                    error={Boolean(formErrors.landlineNumber)}
                    helperText={formErrors.landlineNumber}
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
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter district"
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
                  title="Owner Details"
                  columns={3}
                  divided
                  green
                >
                  <AppInput
                    label="Owner Name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Enter owner name"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiUser />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Owner Email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    placeholder="Enter owner email"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiMail />}
                    error={Boolean(formErrors.ownerEmail)}
                    helperText={formErrors.ownerEmail}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppPhoneInput
                    label="Owner Mobile"
                    name="ownerMobile"
                    value={formData.ownerMobile}
                    onChange={handleChange}
                    countryCode={formData.phoneCountryCode || "+91"}
                    showCountryCode
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.ownerMobile)}
                    helperText={formErrors.ownerMobile}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Owner Aadhaar"
                    name="ownerAadhaar"
                    value={formData.ownerAadhaar}
                    onChange={handleChange}
                    placeholder="Enter Aadhaar number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.ownerAadhaar)}
                    helperText={formErrors.ownerAadhaar}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Owner PAN"
                    name="ownerPan"
                    value={formData.ownerPan}
                    onChange={handleChange}
                    placeholder="Enter owner PAN"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.ownerPan)}
                    helperText={formErrors.ownerPan}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiUser />}
                  title="Pharmacist Details"
                  columns={3}
                  divided
                  green
                >
                  <AppInput
                    label="Pharmacist Name"
                    name="pharmacistName"
                    value={formData.pharmacistName}
                    onChange={handleChange}
                    placeholder="Enter pharmacist name"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiUser />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Registration Number"
                    name="pharmacistRegistrationNumber"
                    value={formData.pharmacistRegistrationNumber}
                    onChange={handleChange}
                    placeholder="Enter registration number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppPhoneInput
                    label="Pharmacist Mobile"
                    name="pharmacistMobile"
                    value={formData.pharmacistMobile}
                    onChange={handleChange}
                    countryCode={formData.phoneCountryCode || "+91"}
                    showCountryCode
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.pharmacistMobile)}
                    helperText={formErrors.pharmacistMobile}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Pharmacist Email"
                    name="pharmacistEmail"
                    value={formData.pharmacistEmail}
                    onChange={handleChange}
                    placeholder="Enter pharmacist email"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiMail />}
                    error={Boolean(formErrors.pharmacistEmail)}
                    helperText={formErrors.pharmacistEmail}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Registration Expiry Date"
                    name="pharmacistRegistrationExpiryDate"
                    value={formData.pharmacistRegistrationExpiryDate}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCalendar />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiFileText />}
                  title="License Details"
                  columns={4}
                  divided
                  green
                >
                  <AppInput
                    label="License Type"
                    name="licenseType"
                    value={formData.licenseType}
                    onChange={handleChange}
                    placeholder="Enter license type"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Retail License Number"
                    name="retailLicenseNumber"
                    value={formData.retailLicenseNumber}
                    onChange={handleChange}
                    placeholder="Enter retail license number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Wholesale License Number"
                    name="wholesaleLicenseNumber"
                    value={formData.wholesaleLicenseNumber}
                    onChange={handleChange}
                    placeholder="Enter wholesale license number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
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
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="FSSAI Number"
                    name="fssaiNumber"
                    value={formData.fssaiNumber}
                    onChange={handleChange}
                    placeholder="Enter FSSAI number"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Issued At"
                    name="licenseIssuedAt"
                    value={formData.licenseIssuedAt}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCalendar />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Expires At"
                    name="licenseExpiresAt"
                    value={formData.licenseExpiresAt}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiCalendar />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="License Status"
                    name="licenseStatus"
                    value={formData.licenseStatus}
                    onChange={handleChange}
                    options={licenseStatusOptions}
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
                  title="Tax Settings"
                  columns={4}
                  divided
                  green
                >
                  <AppSelect
                    label="GST Type"
                    name="gstType"
                    value={formData.gstType}
                    onChange={handleChange}
                    options={gstTypeOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="GST Jurisdiction"
                    name="gstJurisdiction"
                    value={formData.gstJurisdiction}
                    onChange={handleChange}
                    placeholder="Enter GST jurisdiction"
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
                    label="GST Inclusive"
                    name="isGstInclusive"
                    value={formData.isGstInclusive}
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
                  icon={<FiCreditCard />}
                  title="Billing Settings"
                  columns={4}
                  divided
                  green
                >
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
                    label="Purchase Prefix"
                    name="purchasePrefix"
                    value={formData.purchasePrefix}
                    onChange={handleChange}
                    placeholder="PUR"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
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
                    label="Credit Note Prefix"
                    name="creditNotePrefix"
                    value={formData.creditNotePrefix}
                    onChange={handleChange}
                    placeholder="CRN"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Debit Note Prefix"
                    name="debitNotePrefix"
                    value={formData.debitNotePrefix}
                    onChange={handleChange}
                    placeholder="DBN"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Barcode Format"
                    name="barcodeFormat"
                    value={formData.barcodeFormat}
                    onChange={handleChange}
                    placeholder="Code128"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Rounding Type"
                    name="roundingType"
                    value={formData.roundingType}
                    onChange={handleChange}
                    placeholder="2 Decimal Places"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppSelect
                    label="Print Logo On Invoice"
                    name="printCompanyLogoOnInvoice"
                    value={formData.printCompanyLogoOnInvoice}
                    onChange={handleChange}
                    options={booleanOptions}
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Footer Message"
                    name="footerMessage"
                    value={formData.footerMessage}
                    onChange={handleChange}
                    placeholder="Enter invoice footer message"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.footerMessage)}
                    helperText={formErrors.footerMessage}
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
                        title: "Additional Settings",
                        icon: <FiSettings />,
                        content: (
                          <AppGrid columns={4} gap={1.25} columnGap={2}>
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
                              label="Batch Wise Inventory"
                              name="enableBatchWiseInventory"
                              value={formData.enableBatchWiseInventory}
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
                              label="Schedule H Tracking"
                              name="enableScheduleHTracking"
                              value={formData.enableScheduleHTracking}
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
                              label="Narcotic Drug Tracking"
                              name="enableNarcoticDrugTracking"
                              value={formData.enableNarcoticDrugTracking}
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
                              label="SMS Notifications"
                              name="enableSmsNotifications"
                              value={formData.enableSmsNotifications}
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
                              label="WhatsApp Notifications"
                              name="enableWhatsappNotifications"
                              value={formData.enableWhatsappNotifications}
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
                              label="Email Notifications"
                              name="enableEmailNotifications"
                              value={formData.enableEmailNotifications}
                              onChange={handleChange}
                              options={booleanOptions}
                              fullWidth
                              size="small"
                              variant="bordered"
                              rounded="md"
                              labelSx={labelSx}
                              inputSx={inputSx}
                            />
                          </AppGrid>
                        ),
                      },
                    ]}
                    sx={accordionSx}
                    summarySx={accordionSummarySx}
                    detailsSx={accordionDetailsSx}
                  />
                </div>
              </AppCard>

              {formErrors.submit ? (
                <AppText variant="body2" sx={submitErrorSx}>
                  {formErrors.submit}
                </AppText>
              ) : null}

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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
        value={formData.companyType}
      />
      <PreviewRow
        icon={<FiFileText />}
        label="GSTIN"
        value={formData.gstNumber}
      />
      <PreviewRow
        icon={<FiCreditCard />}
        label="PAN"
        value={formData.panNumber}
      />
      <PreviewRow
        icon={<FiMail />}
        label="Email"
        value={formData.companyEmail}
      />
      <PreviewRow
        icon={<FiPhone />}
        label="Mobile"
        value={`${formData.phoneCountryCode || "+91"} ${
          formData.companyPhone || ""
        }`}
      />
      <PreviewRow icon={<FiGlobe />} label="Website" value={formData.website} />
      <PreviewRow
        icon={<FiMapPin />}
        label="Address"
        value={[
          formData.addressLine1,
          formData.addressLine2,
          formData.city,
          formData.district,
          formData.state,
          formData.pincode,
        ]
          .filter(Boolean)
          .join(", ")}
      />
      <PreviewRow icon={<FiUser />} label="Owner" value={formData.ownerName} />
      <PreviewRow
        icon={<FiUser />}
        label="Pharmacist"
        value={formData.pharmacistName}
      />
    </AppStack>

    <div className="h-px bg-border" />

    <AppStack direction="column" gap={1.25} sx={{ pt: 1.8 }}>
      <PreviewRow icon={<FiUser />} label="Created By" value="-" />
      <PreviewRow
        icon={<FiClock />}
        label="Created On"
        value="Not created yet"
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

const submitErrorSx = {
  mt: 1,
  textAlign: "right",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--app-color-danger)",
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
