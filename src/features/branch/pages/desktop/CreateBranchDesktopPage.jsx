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
  FiPackage,
  FiPhone,
  FiSave,
  FiSettings,
  FiStar,
  FiTruck,
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
  branchTypeOptions,
  statusOptions,
  inventoryModeOptions,
  priceModeOptions,
  currencyOptions,
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

                  {/* Keep hidden for create if backend defaults active */}
                  {/* <AppSelect
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
                  /> */}

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

                  <AppInput
                    label="Google Map Location"
                    name="googleMapLocation"
                    value={formData.googleMapLocation}
                    onChange={handleChange}
                    placeholder="Enter Google Map location/link"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
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

                  <AppInput
                    label="Drug License Type"
                    name="drugLicenseType"
                    value={formData.drugLicenseType}
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
                    label="License Expiry Date"
                    name="licenseExpiresAt"
                    type="date"
                    value={formData.licenseExpiresAt}
                    onChange={handleChange}
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
                  icon={<FiUser />}
                  title="Pharmacist Details"
                  columns={4}
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
                    error={Boolean(formErrors.pharmacistName)}
                    helperText={formErrors.pharmacistName}
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
                    error={Boolean(formErrors.pharmacistRegistrationNumber)}
                    helperText={formErrors.pharmacistRegistrationNumber}
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
                </FormSection>

                <FormSection
                  icon={<FiPhone />}
                  title="Emergency Contact"
                  columns={3}
                  divided
                  green
                >
                  <AppInput
                    label="Contact Name"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Enter emergency contact name"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiUser />}
                    error={Boolean(formErrors.emergencyContactName)}
                    helperText={formErrors.emergencyContactName}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppPhoneInput
                    label="Contact Mobile"
                    name="emergencyContactMobile"
                    value={formData.emergencyContactMobile}
                    onChange={handleChange}
                    countryCode={formData.phoneCountryCode || "+91"}
                    showCountryCode
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.emergencyContactMobile)}
                    helperText={formErrors.emergencyContactMobile}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Relationship"
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    placeholder="Enter relationship"
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
                    label="Sales Return Prefix"
                    name="salesReturnPrefix"
                    value={formData.salesReturnPrefix}
                    onChange={handleChange}
                    placeholder="SR"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
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
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Credit Note Prefix"
                    name="creditNotePrefix"
                    value={formData.creditNotePrefix}
                    onChange={handleChange}
                    placeholder="CN"
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
                    label="Starting Invoice Number"
                    name="startingInvoiceNumber"
                    value={formData.startingInvoiceNumber}
                    onChange={handleChange}
                    placeholder="1"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.startingInvoiceNumber)}
                    helperText={formErrors.startingInvoiceNumber}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Starting Purchase Number"
                    name="startingPurchaseNumber"
                    value={formData.startingPurchaseNumber}
                    onChange={handleChange}
                    placeholder="1"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    error={Boolean(formErrors.startingPurchaseNumber)}
                    helperText={formErrors.startingPurchaseNumber}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiPackage />}
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
                    label="Enable Batch Tracking"
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
                    label="Enable Expiry Tracking"
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
                    label="Enable Rack Tracking"
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

                  <AppSelect
                    label="Enable Stock Tracking"
                    name="enableStockTracking"
                    value={formData.enableStockTracking}
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
                  icon={<FiClock />}
                  title="Working Hours"
                  columns={4}
                  divided
                  green
                >
                  <AppInput
                    label="Opening Time"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleChange}
                    placeholder="09:00 AM"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiClock />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Closing Time"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleChange}
                    placeholder="09:00 PM"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiClock />}
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Weekly Off"
                    name="weeklyOff"
                    value={formData.weeklyOff}
                    onChange={handleChange}
                    placeholder="Sunday"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />

                  <AppInput
                    label="Working Days"
                    name="workingDays"
                    value={formData.workingDays}
                    onChange={handleChange}
                    placeholder="Monday, Tuesday, Wednesday"
                    fullWidth
                    size="small"
                    variant="bordered"
                    rounded="md"
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </FormSection>

                <FormSection
                  icon={<FiTruck />}
                  title="Facilities"
                  columns={5}
                  divided
                  green
                >
                  <AppSelect
                    label="Home Delivery"
                    name="homeDelivery"
                    value={formData.homeDelivery}
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
                    label="WhatsApp Orders"
                    name="whatsappOrders"
                    value={formData.whatsappOrders}
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
                    label="Online Orders"
                    name="onlineOrders"
                    value={formData.onlineOrders}
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
                    label="Cold Storage"
                    name="coldStorageAvailable"
                    value={formData.coldStorageAvailable}
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
                    label="24x7 Service"
                    name="twentyFourSevenService"
                    value={formData.twentyFourSevenService}
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
                    Save Branch
                  </AppButton>
                </AppStack>
              </div>
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
        <FiBriefcase className="text-[31px]" />
      </div>

      <AppHeading level={3} weight={700} sx={previewTitleSx}>
        {formData.branchName || "Branch Name"}
      </AppHeading>

      <div className="mt-0.8 flex w-full justify-center gap-1">
        <AppStatusBadge
          status={formData.status || "active"}
          size="small"
          variant="soft"
          rounded="full"
          sx={statusBadgeSx}
        />

        {formData.isPrimary === "true" ? (
          <AppStatusBadge
            status="primary"
            label="Primary"
            size="small"
            variant="soft"
            rounded="full"
            sx={statusBadgeSx}
          />
        ) : null}
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
        icon={<FiStar />}
        label="Primary"
        value={formData.isPrimary === "true" ? "Yes" : "No"}
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
          formData.district,
          formData.state,
          formData.pincode,
        ]
          .filter(Boolean)
          .join(", ")}
      />
      <PreviewRow
        icon={<FiFileText />}
        label="Drug License"
        value={formData.drugLicenseNumber}
      />
      <PreviewRow
        icon={<FiFileText />}
        label="FSSAI"
        value={formData.fssaiNumber}
      />
      <PreviewRow
        icon={<FiUser />}
        label="Pharmacist"
        value={formData.pharmacistName}
      />
      <PreviewRow
        icon={<FiPhone />}
        label="Emergency"
        value={formData.emergencyContactName}
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

export default CreateBranchDesktopPage;
