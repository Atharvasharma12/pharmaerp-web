// src/features/company/pages/desktop/CreateCompanyDesktopPage.jsx

import { memo, useCallback, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiPackage,
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
  AppDialog,
  AppGrid,
  AppHeading,
  AppInput,
  AppKeyValue,
  AppPhoneInput,
  AppSelect,
  AppStack,
  AppSwitch,
  AppStatusBadge,
  AppText,
} from "@/components";

const FIELD_SECTIONS = [
  {
    id: "basic",
    title: "Basic Information",
    icon: <FiBriefcase />,
    columns: 3,
    fields: [
      {
        component: "input",
        label: "Company Name",
        name: "companyName",
        placeholder: "Enter company name",
        required: true,
        startIcon: <FiBriefcase />,
      },
      {
        component: "select",
        label: "Company Type",
        name: "companyType",
        optionsKey: "companyTypeOptions",
      },
      {
        component: "input",
        label: "Website",
        name: "website",
        placeholder: "https://example.com",
        startIcon: <FiGlobe />,
      },
      {
        component: "input",
        label: "GSTIN",
        name: "gstNumber",
        placeholder: "Enter GSTIN",
        startIcon: <FiCreditCard />,
      },
      {
        component: "input",
        label: "PAN Number",
        name: "panNumber",
        placeholder: "Enter PAN number",
        startIcon: <FiCreditCard />,
      },
      {
        component: "input",
        label: "Company Email",
        name: "companyEmail",
        placeholder: "Enter company email",
        startIcon: <FiMail />,
      },
      {
        component: "phone",
        label: "Mobile Number",
        name: "companyPhone",
      },
      {
        component: "phone",
        label: "WhatsApp Number",
        name: "whatsappNumber",
      },
      {
        component: "input",
        label: "Landline Number",
        name: "landlineNumber",
        placeholder: "Enter landline number",
        startIcon: <FiPhone />,
      },
    ],
  },
  {
    id: "address",
    title: "Address",
    icon: <FiMapPin />,
    columns: 3,
    divided: true,
    green: true,
    fields: [
      {
        component: "input",
        label: "Address Line 1",
        name: "addressLine1",
        placeholder: "Enter address line 1",
        endIcon: <FiMapPin />,
      },
      {
        component: "input",
        label: "Address Line 2",
        name: "addressLine2",
        placeholder: "Enter address line 2",
      },
      {
        component: "input",
        label: "City",
        name: "city",
        placeholder: "Enter city",
      },
      {
        component: "input",
        label: "District",
        name: "district",
        placeholder: "Enter district",
      },
      {
        component: "input",
        label: "State",
        name: "state",
        placeholder: "Enter state",
      },
      {
        component: "input",
        label: "Country",
        name: "country",
        placeholder: "Enter country",
      },
      {
        component: "input",
        label: "Pincode",
        name: "pincode",
        placeholder: "Enter pincode",
      },
    ],
  },
  {
    id: "owner",
    title: "Owner Details",
    icon: <FiUser />,
    columns: 3,
    divided: true,
    green: true,
    fields: [
      {
        component: "input",
        label: "Owner Name",
        name: "ownerName",
        placeholder: "Enter owner name",
        startIcon: <FiUser />,
      },
      {
        component: "input",
        label: "Owner Email",
        name: "ownerEmail",
        placeholder: "Enter owner email",
        startIcon: <FiMail />,
      },
      {
        component: "phone",
        label: "Owner Mobile",
        name: "ownerMobile",
      },
      {
        component: "input",
        label: "Owner Aadhaar",
        name: "ownerAadhaar",
        placeholder: "Enter Aadhaar number",
      },
      {
        component: "input",
        label: "Owner PAN",
        name: "ownerPan",
        placeholder: "Enter owner PAN",
      },
    ],
  },
  {
    id: "pharmacist",
    title: "Pharmacist Details",
    icon: <FiUser />,
    columns: 3,
    divided: true,
    green: true,
    fields: [
      {
        component: "input",
        label: "Pharmacist Name",
        name: "pharmacistName",
        placeholder: "Enter pharmacist name",
        startIcon: <FiUser />,
      },
      {
        component: "input",
        label: "Registration Number",
        name: "pharmacistRegistrationNumber",
        placeholder: "Enter registration number",
      },
      {
        component: "phone",
        label: "Pharmacist Mobile",
        name: "pharmacistMobile",
      },
      {
        component: "input",
        label: "Pharmacist Email",
        name: "pharmacistEmail",
        placeholder: "Enter pharmacist email",
        startIcon: <FiMail />,
      },
      {
        component: "input",
        label: "Registration Expiry Date",
        name: "pharmacistRegistrationExpiryDate",
        placeholder: "YYYY-MM-DD",
        startIcon: <FiCalendar />,
      },
    ],
  },
  {
    id: "license",
    title: "License Details",
    icon: <FiFileText />,
    columns: 4,
    divided: true,
    green: true,
    fields: [
      {
        component: "input",
        label: "License Type",
        name: "licenseType",
        placeholder: "Enter license type",
      },
      {
        component: "input",
        label: "Retail License Number",
        name: "retailLicenseNumber",
        placeholder: "Enter retail license number",
      },
      {
        component: "input",
        label: "Wholesale License Number",
        name: "wholesaleLicenseNumber",
        placeholder: "Enter wholesale license number",
      },
      {
        component: "input",
        label: "Drug License Number",
        name: "drugLicenseNumber",
        placeholder: "Enter drug license number",
      },
      {
        component: "input",
        label: "FSSAI Number",
        name: "fssaiNumber",
        placeholder: "Enter FSSAI number",
      },
      {
        component: "input",
        label: "Issued At",
        name: "licenseIssuedAt",
        placeholder: "YYYY-MM-DD",
        startIcon: <FiCalendar />,
      },
      {
        component: "input",
        label: "Expires At",
        name: "licenseExpiresAt",
        placeholder: "YYYY-MM-DD",
        startIcon: <FiCalendar />,
      },
      {
        component: "select",
        label: "License Status",
        name: "licenseStatus",
        optionsKey: "licenseStatusOptions",
      },
    ],
  },
  {
    id: "tax",
    title: "Tax Settings",
    icon: <FiCreditCard />,
    columns: 4,
    divided: true,
    green: true,
    fields: [
      {
        component: "select",
        label: "GST Type",
        name: "gstType",
        optionsKey: "gstTypeOptions",
      },
      {
        component: "input",
        label: "GST Jurisdiction",
        name: "gstJurisdiction",
        placeholder: "Enter GST jurisdiction",
      },
      {
        component: "input",
        label: "Default GST Rate",
        name: "defaultGstRate",
        placeholder: "0",
      },
      {
        component: "switch",
        label: "GST Inclusive",
        name: "isGstInclusive",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing Settings",
    icon: <FiCreditCard />,
    columns: 4,
    divided: true,
    green: true,
    fields: [
      {
        component: "input",
        label: "Invoice Prefix",
        name: "invoicePrefix",
        placeholder: "INV",
      },
      {
        component: "input",
        label: "Invoice Start Number",
        name: "invoiceStartNumber",
        placeholder: "1",
      },
      {
        component: "input",
        label: "Purchase Prefix",
        name: "purchasePrefix",
        placeholder: "PUR",
      },
      {
        component: "input",
        label: "Purchase Start Number",
        name: "purchaseStartNumber",
        placeholder: "1",
      },
      {
        component: "input",
        label: "Credit Note Prefix",
        name: "creditNotePrefix",
        placeholder: "CRN",
      },
      {
        component: "input",
        label: "Debit Note Prefix",
        name: "debitNotePrefix",
        placeholder: "DBN",
      },
      {
        component: "input",
        label: "Barcode Format",
        name: "barcodeFormat",
        placeholder: "Code128",
      },
      {
        component: "input",
        label: "Rounding Type",
        name: "roundingType",
        placeholder: "2 Decimal Places",
      },
      {
        component: "switch",
        label: "Print Logo On Invoice",
        name: "printCompanyLogoOnInvoice",
      },
      {
        component: "input",
        label: "Footer Message",
        name: "footerMessage",
        placeholder: "Enter invoice footer message",
      },
    ],
  },
];

const ADDITIONAL_FIELDS = [
  {
    component: "input",
    label: "Timezone",
    name: "timezone",
    placeholder: "Asia/Kolkata",
  },
  {
    component: "select",
    label: "Currency",
    name: "currency",
    optionsKey: "currencyOptions",
  },
  {
    component: "input",
    label: "Date Format",
    name: "dateFormat",
    placeholder: "DD/MM/YYYY",
  },
  {
    component: "select",
    label: "Time Format",
    name: "timeFormat",
    optionsKey: "timeFormatOptions",
  },
  {
    component: "switch",
    label: "Allow Negative Stock",
    name: "allowNegativeStock",
  },
  {
    component: "switch",
    label: "Batch Wise Inventory",
    name: "enableBatchWiseInventory",
  },
  {
    component: "switch",
    label: "Expiry Tracking",
    name: "enableExpiryTracking",
  },
  {
    component: "switch",
    label: "Schedule H Tracking",
    name: "enableScheduleHTracking",
  },
  {
    component: "switch",
    label: "Narcotic Drug Tracking",
    name: "enableNarcoticDrugTracking",
  },
  {
    component: "switch",
    label: "SMS Notifications",
    name: "enableSmsNotifications",
  },
  {
    component: "switch",
    label: "WhatsApp Notifications",
    name: "enableWhatsappNotifications",
  },
  {
    component: "switch",
    label: "Email Notifications",
    name: "enableEmailNotifications",
  },
];

const PREVIEW_GROUPS = [
  {
    title: "Basic Information",
    fields: [
      ["Company Name", "companyName"],
      ["Company Type", "companyType"],
      ["Status", "status"],
      ["Website", "website"],
      ["GSTIN", "gstNumber"],
      ["PAN", "panNumber"],
      ["Company Email", "companyEmail"],
      ["Mobile", "companyPhone", "phone"],
      ["WhatsApp", "whatsappNumber", "phone"],
      ["Landline", "landlineNumber"],
    ],
  },
  {
    title: "Address",
    fields: [
      ["Address Line 1", "addressLine1"],
      ["Address Line 2", "addressLine2"],
      ["City", "city"],
      ["District", "district"],
      ["State", "state"],
      ["Country", "country"],
      ["Pincode", "pincode"],
    ],
  },
  {
    title: "Owner Details",
    fields: [
      ["Owner Name", "ownerName"],
      ["Owner Email", "ownerEmail"],
      ["Owner Mobile", "ownerMobile", "phone"],
      ["Owner Aadhaar", "ownerAadhaar"],
      ["Owner PAN", "ownerPan"],
    ],
  },
  {
    title: "Pharmacist Details",
    fields: [
      ["Pharmacist Name", "pharmacistName"],
      ["Registration Number", "pharmacistRegistrationNumber"],
      ["Pharmacist Mobile", "pharmacistMobile", "phone"],
      ["Pharmacist Email", "pharmacistEmail"],
      ["Registration Expiry", "pharmacistRegistrationExpiryDate"],
    ],
  },
  {
    title: "License Details",
    fields: [
      ["License Type", "licenseType"],
      ["Retail License", "retailLicenseNumber"],
      ["Wholesale License", "wholesaleLicenseNumber"],
      ["Drug License", "drugLicenseNumber"],
      ["FSSAI", "fssaiNumber"],
      ["Issued At", "licenseIssuedAt"],
      ["Expires At", "licenseExpiresAt"],
      ["License Status", "licenseStatus"],
    ],
  },
  {
    title: "Tax, Billing & Settings",
    fields: [
      ["GST Type", "gstType"],
      ["GST Jurisdiction", "gstJurisdiction"],
      ["Default GST Rate", "defaultGstRate"],
      ["GST Inclusive", "isGstInclusive", "boolean"],
      ["Invoice Prefix", "invoicePrefix"],
      ["Invoice Start", "invoiceStartNumber"],
      ["Purchase Prefix", "purchasePrefix"],
      ["Purchase Start", "purchaseStartNumber"],
      ["Currency", "currency"],
      ["Timezone", "timezone"],
      ["Date Format", "dateFormat"],
      ["Time Format", "timeFormat"],
    ],
  },
];

const CreateCompanyDesktopPage = memo(
  ({
    initialFormData,
    formErrors,
    isLoading,
    isConfirmOpen,
    previewData,
    companyTypeOptions,
    currencyOptions,
    gstTypeOptions,
    licenseStatusOptions,
    timeFormatOptions,
    booleanOptions,
    handleChange,
    handleSubmit,
    handleBack,
    closeConfirm,
    handleConfirmCreate,
  }) => {
    const optionMaps = useMemo(
      () => ({
        companyTypeOptions,
        currencyOptions,
        gstTypeOptions,
        licenseStatusOptions,
        timeFormatOptions,
        booleanOptions,
      }),
      [
        booleanOptions,
        companyTypeOptions,
        currencyOptions,
        gstTypeOptions,
        licenseStatusOptions,
        timeFormatOptions,
      ],
    );

    const breadcrumbItems = useMemo(
      () => [
        { label: "Companies", onClick: handleBack },
        { label: "Create Company", current: true },
      ],
      [handleBack],
    );

    const additionalAccordionItems = useMemo(
      () => [
        {
          id: "additional-settings",
          title: "Additional Settings",
          icon: <FiSettings />,
          content: (
            <AppGrid columns={4} gap={1.25} columnGap={2}>
              {ADDITIONAL_FIELDS.map((field) => (
                <FastField
                  key={field.name}
                  field={field}
                  initialValue={initialFormData[field.name]}
                  error={formErrors[field.name]}
                  optionMaps={optionMaps}
                  onFieldChange={handleChange}
                />
              ))}
            </AppGrid>
          ),
        },
      ],
      [formErrors, handleChange, initialFormData, optionMaps],
    );

    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 pb-3">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="sticky top-0 z-30 -mx-5 mb-2 flex w-[calc(100%+40px)] items-center justify-between border-b border-border bg-bg/95 px-5 py-1.5 backdrop-blur">
            <AppStack direction="row" align="center" gap={1}>
              <IconBox icon={<FiBriefcase />} large />

              <AppBox>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  Create Company
                </AppHeading>

                <AppBreadcrumb
                  size="small"
                  variant="text"
                  items={breadcrumbItems}
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
            <div className="grid grid-cols-[minmax(0,1fr)_330px] gap-3.5">
              <div>
                <AppCard
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="sm"
                  padding="none"
                  sx={mainCardSx}
                >
                  {FIELD_SECTIONS.map((section) => (
                    <FormSection
                      key={section.id}
                      icon={section.icon}
                      title={section.title}
                      columns={section.columns}
                      divided={section.divided}
                      green={section.green}
                    >
                      {section.fields.map((field) => (
                        <FastField
                          key={field.name}
                          field={field}
                          initialValue={initialFormData[field.name]}
                          error={formErrors[field.name]}
                          optionMaps={optionMaps}
                          onFieldChange={handleChange}
                        />
                      ))}
                    </FormSection>
                  ))}

                  <div className="-mx-4 mt-3 border-t border-border px-4 pt-2.5">
                    <AppAccordion
                      size="small"
                      variant="ghost"
                      items={additionalAccordionItems}
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

              <FormAssistSidebar />
            </div>
          </AppBox>
        </div>

        <ConfirmPreviewDialog
          open={isConfirmOpen}
          data={previewData}
          isLoading={isLoading}
          onBack={closeConfirm}
          onCreate={handleConfirmCreate}
        />
      </section>
    );
  },
);

CreateCompanyDesktopPage.displayName = "CreateCompanyDesktopPage";

const SIDEBAR_CHECKS = [
  {
    icon: <FiBriefcase />,
    title: "Company profile",
    text: "Name, type, GSTIN, PAN, email and phone details.",
  },
  {
    icon: <FiMapPin />,
    title: "Address details",
    text: "Used on invoices, reports and statutory records.",
  },
  {
    icon: <FiUser />,
    title: "Owner & pharmacist",
    text: "Important for pharmacy accountability and renewals.",
  },
  {
    icon: <FiFileText />,
    title: "Licenses",
    text: "Retail, wholesale, drug license and FSSAI references.",
  },
];

const SIDEBAR_ERP_AREAS = [
  {
    icon: <FiCreditCard />,
    title: "Billing",
    text: "Invoice series, GST type and footer defaults.",
  },
  {
    icon: <FiPackage />,
    title: "Inventory",
    text: "Batch, expiry and stock control settings.",
  },
  {
    icon: <FiSettings />,
    title: "Operations",
    text: "Currency, timezone and notification preferences.",
  },
];

const SIDEBAR_REMINDERS = [
  "Verify GSTIN, PAN and license numbers before creating the company.",
  "Set invoice and purchase start numbers carefully before transactions begin.",
  "Enable expiry, Schedule H and narcotic tracking based on business need.",
];

const FormAssistSidebar = memo(() => (
  <aside className="self-start">
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={assistCardSx}
    >
      <SidebarHeader
        icon={<FiBriefcase />}
        title="Company Setup"
        subtitle="Complete key details before creating this company."
      />

      <div className="my-3 h-px bg-border" />

      <AppStack direction="column" gap={0.9}>
        {SIDEBAR_CHECKS.map((item) => (
          <SidebarInfoRow key={item.title} item={item} />
        ))}
      </AppStack>

      <div className="my-3 h-px bg-border" />

      <SidebarHeader
        icon={<FiSettings />}
        title="Used In ERP"
        subtitle="These settings affect daily workflows."
      />

      <AppStack direction="column" gap={0.85} sx={{ mt: 1.1 }}>
        {SIDEBAR_ERP_AREAS.map((item) => (
          <SidebarInfoRow key={item.title} item={item} compact />
        ))}
      </AppStack>

      <AppBox sx={assistNoteSx}>
        <AppText variant="body2" weight={700} sx={assistNoteTitleSx}>
          Before creating
        </AppText>
        <AppStack direction="column" gap={0.55} sx={{ mt: 0.65 }}>
          {SIDEBAR_REMINDERS.map((item) => (
            <AppText key={item} variant="caption" sx={assistReminderSx}>
              • {item}
            </AppText>
          ))}
        </AppStack>
      </AppBox>
    </AppCard>
  </aside>
));

const SidebarInfoRow = memo(({ item, compact = false }) => (
  <AppStack direction="row" align="flex-start" gap={0.9}>
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-[13px] text-primary">
      {item.icon}
    </span>

    <AppBox sx={{ minWidth: 0 }}>
      <AppText variant="body2" weight={700} sx={assistStepTitleSx}>
        {item.title}
      </AppText>
      <AppText
        variant="caption"
        sx={compact ? assistCompactTextSx : assistStepTextSx}
      >
        {item.text}
      </AppText>
    </AppBox>
  </AppStack>
));

SidebarInfoRow.displayName = "SidebarInfoRow";

const SidebarHeader = memo(({ icon, title, subtitle }) => (
  <AppStack direction="row" align="center" gap={0.85}>
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
      {icon}
    </span>
    <AppBox>
      <AppHeading level={2} weight={700} sx={assistTitleSx}>
        {title}
      </AppHeading>
      <AppText variant="body2" sx={assistSubtitleSx}>
        {subtitle}
      </AppText>
    </AppBox>
  </AppStack>
));

SidebarHeader.displayName = "SidebarHeader";

FormAssistSidebar.displayName = "FormAssistSidebar";

const FastField = memo(
  ({ field, initialValue, error, optionMaps, onFieldChange }) => {
    const [value, setValue] = useState(initialValue ?? "");

    const handleLocalChange = useCallback(
      (eventOrValue) => {
        const nextValue = eventOrValue?.target
          ? eventOrValue.target.value
          : eventOrValue;

        setValue(nextValue);
        onFieldChange(field.name, nextValue);
      },
      [field.name, onFieldChange],
    );

    const commonProps = {
      label: field.label,
      name: field.name,
      value,
      onChange: handleLocalChange,
      placeholder: field.placeholder,
      required: field.required,
      fullWidth: true,
      size: "small",
      variant: "bordered",
      rounded: "md",
      error: Boolean(error),
      helperText: error,
      labelSx,
      inputSx,
    };

    if (field.component === "select") {
      return (
        <AppSelect
          {...commonProps}
          options={optionMaps[field.optionsKey] || []}
        />
      );
    }

    if (field.component === "switch") {
      const checked = value === true || value === "true";

      return (
        <AppBox sx={switchFieldSx}>
          <AppSwitch
            label={field.label}
            name={field.name}
            checked={checked}
            onChange={(event) =>
              handleLocalChange(event?.target?.checked ? "true" : "false")
            }
            size="small"
            colorVariant="primary"
            labelPlacement="start"
            fullWidth
            disabled={field.disabled}
            error={Boolean(error)}
            helperText={error}
            sx={compactSwitchWrapperSx}
            switchSx={compactSwitchSx}
            labelSx={switchLabelSx}
            helperTextSx={switchHelperTextSx}
          />
        </AppBox>
      );
    }

    if (field.component === "phone") {
      return (
        <AppPhoneInput {...commonProps} countryCode="+91" showCountryCode />
      );
    }

    return (
      <AppInput
        {...commonProps}
        startIcon={field.startIcon}
        endIcon={field.endIcon}
      />
    );
  },
  (prev, next) =>
    prev.initialValue === next.initialValue &&
    prev.error === next.error &&
    prev.field === next.field &&
    prev.optionMaps === next.optionMaps &&
    prev.onFieldChange === next.onFieldChange,
);

FastField.displayName = "FastField";

const FormSection = memo(
  ({ icon, title, columns, children, divided, green }) => (
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
  ),
);

FormSection.displayName = "FormSection";

const ConfirmPreviewDialog = memo(
  ({ open, data, isLoading, onBack, onCreate }) => {
    if (!data) return null;

    return (
      <AppDialog
        open={open}
        onClose={onBack}
        title="Confirm Company Details"
        subtitle="Please verify these details before creating the company."
        maxWidth="lg"
        fullWidth
        closeOnBackdrop={false}
        showActions
        cancelLabel="Back to Edit"
        confirmLabel="Create Company"
        onCancel={onBack}
        onConfirm={onCreate}
        confirmLoading={isLoading}
        confirmDisabled={isLoading}
        cancelProps={{ disabled: isLoading }}
        confirmProps={{ startIcon: <FiSave /> }}
        paperSx={dialogPaperSx}
        contentSx={dialogContentSx}
      >
        <AppStack
          direction="row"
          align="center"
          justify="space-between"
          sx={dialogStatusSx}
        >
          <AppText variant="body2" sx={dialogSubTitleSx}>
            Review the details below before creating the company.
          </AppText>

          <AppStatusBadge
            status={data.status || "active"}
            size="small"
            variant="soft"
            rounded="full"
            sx={statusBadgeSx}
          />
        </AppStack>

        {PREVIEW_GROUPS.map((group) => (
          <PreviewGroup key={group.title} group={group} data={data} />
        ))}
      </AppDialog>
    );
  },
);

ConfirmPreviewDialog.displayName = "ConfirmPreviewDialog";

const PreviewGroup = memo(({ group, data }) => {
  const rows = group.fields
    .map(([label, key, type]) => ({
      label,
      value: formatPreviewValue(data, key, type),
    }))
    .filter((row) => row.value !== "-");

  if (rows.length === 0) return null;

  return (
    <div className="mb-3 rounded-lg border border-border bg-bg/40 p-3 last:mb-0">
      <AppHeading level={3} weight={650} sx={previewGroupTitleSx}>
        {group.title}
      </AppHeading>

      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        {rows.map((row) => (
          <AppKeyValue
            key={`${group.title}-${row.label}`}
            label={row.label}
            value={row.value}
            direction="row"
            align="space-between"
            size="small"
            sx={previewKeyValueSx}
            labelSx={previewLabelSx}
            valueSx={previewValueSx}
          />
        ))}
      </div>
    </div>
  );
});

PreviewGroup.displayName = "PreviewGroup";

const formatPreviewValue = (data, key, type) => {
  const value = data?.[key];

  if (type === "boolean") {
    if (value === true || value === "true") return "Yes";
    if (value === false || value === "false") return "No";
  }

  if (type === "phone" && value) {
    return `${data.phoneCountryCode || "+91"} ${value}`;
  }

  return value || "-";
};

const IconBox = memo(({ icon, large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 34 : 30,
      height: large ? 34 : 30,
      minWidth: large ? 34 : 30,
      borderRadius: large ? "9px" : "8px",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: large ? "18px" : "15px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
));

IconBox.displayName = "IconBox";

const pageTitleSx = {
  m: 0,
  fontSize: "17px",
  lineHeight: 1.05,
  letterSpacing: "-0.25px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = { mt: 0, lineHeight: 1 };

const breadcrumbItemSx = {
  fontSize: "10.5px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "10.5px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const backButtonSx = {
  height: 29,
  px: 1.25,
  fontSize: "11px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const mainCardSx = {
  px: 2,
  py: 1.25,
  bgcolor: "var(--app-color-surface)",
};

const sectionSx = { m: 0 };

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

const statusBadgeSx = {
  width: "fit-content",
  flex: "0 0 auto",
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

const dialogSubTitleSx = {
  mt: 0.45,
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const previewGroupTitleSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const previewKeyValueSx = {
  minHeight: 26,
  gap: 1.5,
};

const previewLabelSx = {
  minWidth: 116,
  fontSize: "10.5px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const previewValueSx = {
  textAlign: "right",
  fontSize: "11.8px",
  lineHeight: "16px",
  fontWeight: 650,
  color: "var(--app-color-text)",
  overflowWrap: "anywhere",
};

const switchFieldSx = {
  minHeight: 34,
  display: "flex",
  alignItems: "center",
  px: 0.75,
  py: 0.35,
  borderRadius: "9px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const compactSwitchWrapperSx = {
  width: "100%",
  m: 0,
  minHeight: 0,
  alignItems: "center",
  justifyContent: "space-between",
  gap: 0.8,
};

const compactSwitchSx = {
  transform: "scale(0.62)",
  transformOrigin: "right center",
  mr: -1.1,
};

const switchLabelSx = {
  flex: 1,
  mr: 0.5,
  fontSize: "10.8px",
  lineHeight: "14px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const switchHelperTextSx = {
  mt: 0.15,
  fontSize: "10.5px",
};

const assistCardSx = {
  px: 1.45,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
};

const assistTitleSx = {
  m: 0,
  fontSize: "13.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const assistSubtitleSx = {
  mt: 0.3,
  fontSize: "10.8px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const assistStepTitleSx = {
  m: 0,
  fontSize: "11.8px",
  lineHeight: "15px",
  color: "var(--app-color-text)",
};

const assistStepTextSx = {
  mt: 0.1,
  display: "block",
  fontSize: "10.8px",
  lineHeight: "14.5px",
  color: "var(--app-color-text-muted)",
};

const assistCompactTextSx = {
  mt: 0.05,
  display: "block",
  fontSize: "10.6px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const assistNoteSx = {
  mt: 1.25,
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const assistNoteTitleSx = {
  m: 0,
  fontSize: "11.4px",
  lineHeight: "15px",
  color: "var(--app-color-text)",
};

const assistReminderSx = {
  display: "block",
  fontSize: "10.6px",
  lineHeight: "14.5px",
  color: "var(--app-color-text-muted)",
};

const dialogPaperSx = {
  bgcolor: "var(--app-color-surface)",
};

const dialogContentSx = {
  maxHeight: "68vh",
  overflowY: "auto",
};

const dialogStatusSx = {
  mb: 1.5,
};

export default CreateCompanyDesktopPage;
