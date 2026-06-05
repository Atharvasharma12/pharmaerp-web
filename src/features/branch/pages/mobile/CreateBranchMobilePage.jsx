// src/features/branch/pages/mobile/CreateBranchMobilePage.jsx

import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiInfo,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiSave,
  FiSettings,
  FiShield,
  FiTruck,
  FiUser,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppPhoneInput,
  AppStack,
  AppSwitch,
  AppText,
} from "@/components";

const FIELD_SECTIONS = [
  {
    id: "basic",
    title: "Basic Information",
    subtitle: "Branch identity, type, primary flag and contact details.",
    icon: <FiBriefcase />,
    fields: [
      {
        component: "input",
        label: "Branch Name",
        name: "branchName",
        placeholder: "Enter branch name",
        required: true,
        startIcon: <FiBriefcase />,
      },
      {
        component: "select",
        label: "Branch Type",
        name: "branchType",
        optionsKey: "branchTypeOptions",
      },
      {
        component: "select",
        label: "Status",
        name: "status",
        optionsKey: "statusOptions",
      },
      {
        component: "switch",
        label: "Primary Branch",
        name: "isPrimary",
      },
      {
        component: "input",
        label: "Branch Email",
        name: "branchEmail",
        placeholder: "Enter branch email",
        startIcon: <FiMail />,
      },
      {
        component: "phone",
        label: "Branch Phone Number",
        name: "branchPhone",
      },
    ],
  },
  {
    id: "address",
    title: "Address",
    subtitle: "Used on invoices, records and branch delivery workflows.",
    icon: <FiMapPin />,
    fields: [
      {
        component: "input",
        label: "Address Line 1",
        name: "addressLine1",
        placeholder: "Enter address line 1",
        startIcon: <FiMapPin />,
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
      {
        component: "input",
        label: "Google Map Location",
        name: "googleMapLocation",
        placeholder: "Enter Google Map location/link",
        startIcon: <FiMapPin />,
      },
    ],
  },
  {
    id: "license",
    title: "License Details",
    subtitle: "Drug license, license type, expiry and FSSAI references.",
    icon: <FiFileText />,
    fields: [
      {
        component: "input",
        label: "Drug License Number",
        name: "drugLicenseNumber",
        placeholder: "Enter drug license number",
        startIcon: <FiFileText />,
      },
      {
        component: "input",
        label: "Drug License Type",
        name: "drugLicenseType",
        placeholder: "Enter license type",
      },
      {
        component: "input",
        label: "FSSAI Number",
        name: "fssaiNumber",
        placeholder: "Enter FSSAI number",
      },
      {
        component: "input",
        label: "License Expiry Date",
        name: "licenseExpiresAt",
        type: "date",
        startIcon: <FiCalendar />,
      },
    ],
  },
  {
    id: "pharmacist",
    title: "Pharmacist Details",
    subtitle: "Registration and pharmacist accountability details.",
    icon: <FiUser />,
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
    ],
  },
  {
    id: "emergency",
    title: "Emergency Contact",
    subtitle: "Urgent branch contact person and relationship details.",
    icon: <FiPhone />,
    fields: [
      {
        component: "input",
        label: "Contact Name",
        name: "emergencyContactName",
        placeholder: "Enter emergency contact name",
        startIcon: <FiUser />,
      },
      {
        component: "phone",
        label: "Contact Mobile",
        name: "emergencyContactMobile",
      },
      {
        component: "input",
        label: "Relationship",
        name: "emergencyContactRelationship",
        placeholder: "Enter relationship",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing Settings",
    subtitle: "Invoice, purchase, return and note series defaults.",
    icon: <FiCreditCard />,
    fields: [
      {
        component: "input",
        label: "Invoice Prefix",
        name: "invoicePrefix",
        placeholder: "INV",
      },
      {
        component: "input",
        label: "Purchase Prefix",
        name: "purchasePrefix",
        placeholder: "PUR",
      },
      {
        component: "input",
        label: "Sales Return Prefix",
        name: "salesReturnPrefix",
        placeholder: "SR",
      },
      {
        component: "input",
        label: "Purchase Return Prefix",
        name: "purchaseReturnPrefix",
        placeholder: "PR",
      },
      {
        component: "input",
        label: "Credit Note Prefix",
        name: "creditNotePrefix",
        placeholder: "CN",
      },
      {
        component: "input",
        label: "Debit Note Prefix",
        name: "debitNotePrefix",
        placeholder: "DBN",
      },
      {
        component: "input",
        label: "Starting Invoice Number",
        name: "startingInvoiceNumber",
        placeholder: "1",
      },
      {
        component: "input",
        label: "Starting Purchase Number",
        name: "startingPurchaseNumber",
        placeholder: "1",
      },
    ],
  },
  {
    id: "inventory",
    title: "Inventory Settings",
    subtitle: "Stock, batch, rack, expiry and pricing controls.",
    icon: <FiPackage />,
    fields: [
      {
        component: "select",
        label: "Inventory Mode",
        name: "inventoryMode",
        optionsKey: "inventoryModeOptions",
      },
      {
        component: "select",
        label: "Price Mode",
        name: "priceMode",
        optionsKey: "priceModeOptions",
      },
      {
        component: "switch",
        label: "Allow Negative Stock",
        name: "allowNegativeStock",
      },
      {
        component: "switch",
        label: "Allow Backdated Entries",
        name: "allowBackdatedEntries",
      },
      {
        component: "switch",
        label: "Batch Tracking",
        name: "enableBatchTracking",
      },
      {
        component: "switch",
        label: "Expiry Tracking",
        name: "enableExpiryTracking",
      },
      {
        component: "switch",
        label: "Rack Tracking",
        name: "enableRackTracking",
      },
      {
        component: "switch",
        label: "Stock Tracking",
        name: "enableStockTracking",
      },
    ],
  },
  {
    id: "working-hours",
    title: "Working Hours",
    subtitle: "Opening time, closing time and branch working days.",
    icon: <FiClock />,
    fields: [
      {
        component: "input",
        label: "Opening Time",
        name: "openingTime",
        placeholder: "09:00 AM",
        startIcon: <FiClock />,
      },
      {
        component: "input",
        label: "Closing Time",
        name: "closingTime",
        placeholder: "09:00 PM",
        startIcon: <FiClock />,
      },
      {
        component: "input",
        label: "Weekly Off",
        name: "weeklyOff",
        placeholder: "Sunday",
      },
      {
        component: "input",
        label: "Working Days",
        name: "workingDays",
        placeholder: "Monday, Tuesday, Wednesday",
      },
    ],
  },
  {
    id: "facilities",
    title: "Facilities",
    subtitle: "Delivery, online order, cold storage and 24x7 flags.",
    icon: <FiTruck />,
    fields: [
      {
        component: "switch",
        label: "Home Delivery",
        name: "homeDelivery",
      },
      {
        component: "switch",
        label: "WhatsApp Orders",
        name: "whatsappOrders",
      },
      {
        component: "switch",
        label: "Online Orders",
        name: "onlineOrders",
      },
      {
        component: "switch",
        label: "Cold Storage",
        name: "coldStorageAvailable",
      },
      {
        component: "switch",
        label: "24x7 Service",
        name: "twentyFourSevenService",
      },
    ],
  },
  {
    id: "settings",
    title: "Additional Settings",
    subtitle: "Currency, timezone, date and time display preferences.",
    icon: <FiSettings />,
    fields: [
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
    ],
  },
];

const setupTips = [
  {
    icon: <FiShield />,
    title: "Verify branch records",
    desc: "Check branch phone, address and license details before saving.",
  },
  {
    icon: <FiPackage />,
    title: "Stock controls",
    desc: "Batch, expiry, rack and stock tracking affect inventory flows.",
  },
  {
    icon: <FiCheckCircle />,
    title: "Billing series",
    desc: "Confirm invoice and purchase start numbers before transactions.",
  },
];

const CreateBranchMobilePage = ({
  formData,
  formErrors = {},
  isLoading = false,
  branchTypeOptions = [],
  statusOptions = [],
  inventoryModeOptions = [],
  priceModeOptions = [],
  currencyOptions = [],
  timeFormatOptions = [],
  handleChange,
  handleSubmit,
  handleBack,
}) => {
  const optionMaps = {
    branchTypeOptions,
    statusOptions,
    inventoryModeOptions,
    priceModeOptions,
    currencyOptions,
    timeFormatOptions,
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_8%,transparent),transparent_36%)]" />

      <AppBox sx={sectionSx}>
        <AppStack
          direction="row"
          align="center"
          justify="space-between"
          gap={1}
        >
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            disabled={isLoading}
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            sx={backButtonSx}
          >
            Back
          </AppButton>

          <AppBox sx={headerBadgeSx}>
            <FiBriefcase />
            <span>Branch Setup</span>
          </AppBox>
        </AppStack>

        <AppBox sx={headerSx}>
          <AppHeading level={1} weight={800} align="center" sx={titleSx}>
            Create Branch
          </AppHeading>

          <AppText variant="body2" align="center" weight={600} sx={subtitleSx}>
            Add branch profile, address, license, inventory and facility
            settings.
          </AppText>
        </AppBox>

        <AppBox component="form" onSubmit={handleSubmit} sx={{ mt: 2.2 }}>
          <AppStack direction="column" gap={1.65}>
            {FIELD_SECTIONS.map((section) => (
              <FormSection key={section.id} section={section}>
                {section.fields.map((field) => (
                  <MobileField
                    key={field.name}
                    field={field}
                    value={formData[field.name] ?? ""}
                    error={formErrors[field.name]}
                    disabled={isLoading}
                    optionMaps={optionMaps}
                    onChange={handleChange}
                  />
                ))}
              </FormSection>
            ))}

            {formErrors.submit ? (
              <AppText variant="body2" sx={submitErrorSx}>
                {formErrors.submit}
              </AppText>
            ) : null}

            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="sm"
              padding="none"
              sx={infoCardSx}
            >
              <AppStack direction="row" align="flex-start" gap={1.1}>
                <AppBox sx={infoIconSx}>
                  <FiInfo />
                </AppBox>

                <AppBox sx={{ minWidth: 0 }}>
                  <AppHeading level={3} weight={750} sx={infoTitleSx}>
                    Before creating
                  </AppHeading>

                  <AppText variant="body2" weight={500} sx={infoTextSx}>
                    Review branch contact, address, license, billing and
                    inventory settings. These details affect invoices, stock
                    movement and branch operations.
                  </AppText>
                </AppBox>
              </AppStack>
            </AppCard>

            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="sm"
              padding="none"
              sx={featuresCardSx}
            >
              {setupTips.map((item, index) => (
                <TipRow
                  key={item.title}
                  {...item}
                  bordered={index !== setupTips.length - 1}
                />
              ))}
            </AppCard>

            <AppButton
              type="submit"
              variant="contained"
              colorVariant="primary"
              rounded="md"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              startIcon={<FiSave />}
              sx={saveButtonSx}
            >
              Save Branch
            </AppButton>
          </AppStack>
        </AppBox>
      </AppBox>
    </section>
  );
};

const FormSection = ({ section, children }) => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={formCardSx}
  >
    <AppStack direction="row" align="flex-start" gap={1} sx={sectionHeaderSx}>
      <AppBox sx={sectionIconSx}>{section.icon}</AppBox>

      <AppBox sx={{ minWidth: 0, flex: 1 }}>
        <AppHeading level={2} weight={750} sx={sectionTitleSx}>
          {section.title}
        </AppHeading>

        <AppText variant="body2" weight={500} sx={sectionSubtitleSx}>
          {section.subtitle}
        </AppText>
      </AppBox>
    </AppStack>

    <AppStack direction="column" gap={1.15} sx={fieldsStackSx}>
      {children}
    </AppStack>
  </AppCard>
);

const MobileField = ({
  field,
  value,
  error,
  disabled,
  optionMaps,
  onChange,
}) => {
  const commonProps = {
    label: field.label,
    name: field.name,
    value,
    onChange,
    disabled,
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
    helperTextSx,
  };

  if (field.component === "select") {
    return (
      <AppInput {...commonProps} select>
        {(optionMaps[field.optionsKey] || []).map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </AppInput>
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
            onChange(field.name, event?.target?.checked ? "true" : "false")
          }
          size="small"
          colorVariant="primary"
          labelPlacement="start"
          fullWidth
          disabled={disabled}
          error={Boolean(error)}
          helperText={error}
          sx={switchWrapperSx}
          switchSx={switchSx}
          labelSx={switchLabelSx}
          helperTextSx={switchHelperTextSx}
        />
      </AppBox>
    );
  }

  if (field.component === "phone") {
    return <AppPhoneInput {...commonProps} countryCode="+91" showCountryCode />;
  }

  return (
    <AppInput
      {...commonProps}
      type={field.type}
      startIcon={field.startIcon}
      endIcon={field.endIcon}
    />
  );
};

const TipRow = ({ icon, title, desc, bordered }) => (
  <div
    className={[
      "flex items-center gap-2.5 px-3 py-2.5",
      bordered ? "border-b border-border" : "",
    ].join(" ")}
  >
    <AppBox sx={tipIconSx}>{icon}</AppBox>

    <div className="min-w-0 flex-1">
      <AppHeading level={3} weight={750} sx={tipTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" weight={500} sx={tipDescSx}>
        {desc}
      </AppText>
    </div>
  </div>
);

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  minHeight: "100vh",
  mx: "auto",
  px: { xs: 1.55, sm: 2 },
  pt: { xs: 1.55, sm: 2 },
  pb: { xs: 2, sm: 2.5 },
};

const backButtonSx = {
  height: 34,
  px: 1.2,
  fontSize: "11.4px",
  fontWeight: 750,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const headerBadgeSx = {
  height: 32,
  px: 1.15,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  gap: 0.65,
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "11.2px",
  fontWeight: 750,
};

const headerSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  mt: { xs: 1.5, sm: 1.9 },
};

const titleSx = {
  m: 0,
  fontSize: { xs: "22px", sm: "24px" },
  lineHeight: 1.14,
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.55,
  maxWidth: 335,
  fontSize: { xs: "11.8px", sm: "12.6px" },
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const formCardSx = {
  width: "100%",
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const sectionHeaderSx = {
  px: 1.15,
  py: 1.15,
  borderBottom: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-readonly-bg)",
};

const sectionIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "19px",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "13.4px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.4,
  fontSize: "10.8px",
  lineHeight: "15.5px",
  color: "var(--app-color-text-muted)",
};

const fieldsStackSx = {
  px: 1.15,
  py: 1.25,
};

const labelSx = {
  mb: 0.35,
  fontSize: "11.6px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 40,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const helperTextSx = {
  mt: 0.45,
  fontSize: "10.7px",
  fontWeight: 500,
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const switchFieldSx = {
  minHeight: 40,
  display: "flex",
  alignItems: "center",
  px: 0.95,
  py: 0.55,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const switchWrapperSx = {
  width: "100%",
  m: 0,
  minHeight: 0,
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
};

const switchSx = {
  transform: "scale(0.72)",
  transformOrigin: "right center",
  mr: -0.7,
};

const switchLabelSx = {
  flex: 1,
  mr: 0.7,
  fontSize: "11.5px",
  lineHeight: "15px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const switchHelperTextSx = {
  mt: 0.2,
  fontSize: "10.6px",
};

const submitErrorSx = {
  mt: -0.35,
  px: 0.35,
  fontSize: "11.4px",
  fontWeight: 650,
  lineHeight: "17px",
  color: "var(--app-color-error)",
};

const infoCardSx = {
  mt: 0.2,
  px: 1.15,
  py: 1.15,
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-primary-soft)",
};

const infoIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "20px",
};

const infoTitleSx = {
  m: 0,
  fontSize: "13px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const infoTextSx = {
  mt: 0.45,
  fontSize: "11.2px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const featuresCardSx = {
  mt: 0.2,
  overflow: "hidden",
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-primary-soft)",
};

const tipIconSx = {
  width: 40,
  height: 40,
  minWidth: 40,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "20px",
};

const tipTitleSx = {
  m: 0,
  fontSize: "12.3px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const tipDescSx = {
  mt: 0.35,
  fontSize: "10.75px",
  lineHeight: "15.5px",
  color: "var(--app-color-text-muted)",
};

const saveButtonSx = {
  mt: 0.35,
  height: 46,
  fontSize: "13.6px",
  fontWeight: 800,
  boxShadow: "var(--app-shadow-sm)",
};

export default CreateBranchMobilePage;
