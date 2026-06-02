// src/features/company/pages/desktop/CompanyDetailsDesktopPage.jsx

import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiEdit2,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiSettings,
  FiShield,
} from "react-icons/fi";

import {
  AppAccordion,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppDescriptionList,
  AppErrorState,
  AppGrid,
  AppHeading,
  AppKeyValue,
  AppPageLoader,
  AppStack,
  AppStatusBadge,
  AppText,
} from "@/components";

const CompanyDetailsDesktopPage = ({
  company,
  isLoading,
  hasError,
  error,
  handleBack,
  handleEdit,
  handleSettings,
  handleRefresh,
}) => {
  if (isLoading && !company) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-3">
        <div className="mx-auto w-full max-w-[1500px]">
          <AppPageLoader text="Loading company details..." />
        </div>
      </section>
    );
  }

  if (hasError && !company) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-3">
        <div className="mx-auto w-full max-w-[1500px]">
          <AppErrorState
            title="Unable to load company"
            description={error || "Please refresh and try again."}
            actionText="Refresh"
            onRetry={handleRefresh}
            size="page"
            fullHeight
          />
        </div>
      </section>
    );
  }

  const safeCompany = company || {};

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-3">
      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          company={safeCompany}
          isLoading={isLoading}
          handleBack={handleBack}
          handleEdit={handleEdit}
          handleSettings={handleSettings}
          handleRefresh={handleRefresh}
        />

        <div className="grid grid-cols-[360px_1fr] gap-3.5">
          <CompanySummaryCard company={safeCompany} />

          <AppStack direction="column" gap={1.5}>
            <OverviewCard company={safeCompany} />

            <AppGrid columns={2} gap={1.5}>
              <DetailsSection
                icon={<FiCreditCard />}
                title="Tax Details"
                items={safeCompany.taxItems || []}
              />

              <DetailsSection
                icon={<FiFileText />}
                title="Billing Settings"
                items={safeCompany.billingItems || []}
              />
            </AppGrid>

            <LicenseSection licenses={safeCompany.licenses || []} />

            <DetailsSection
              icon={<FiSettings />}
              title="Company Settings"
              items={safeCompany.settingsItems || []}
              columns={3}
            />
          </AppStack>
        </div>
      </div>
    </section>
  );
};

const PageHeader = ({
  company,
  isLoading,
  handleBack,
  handleEdit,
  handleSettings,
  handleRefresh,
}) => (
  <div className="mb-3 flex w-full items-center justify-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiBriefcase />} large />

      <AppBox>
        <AppHeading level={1} weight={700} sx={pageTitleSx}>
          {company.displayName || "Company Details"}
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Companies", onClick: handleBack },
            { label: company.displayName || "Company Details", current: true },
          ]}
          sx={breadcrumbSx}
          itemSx={breadcrumbItemSx}
          currentItemSx={breadcrumbCurrentSx}
        />
      </AppBox>
    </AppStack>

    <AppStack direction="row" align="center" gap={1}>
      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiArrowLeft />}
        onClick={handleBack}
        sx={secondaryButtonSx}
      >
        Back
      </AppButton>

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiRefreshCw />}
        onClick={handleRefresh}
        loading={isLoading}
        disabled={isLoading}
        sx={secondaryButtonSx}
      >
        Refresh
      </AppButton>

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="warning"
        rounded="md"
        size="small"
        startIcon={<FiSettings />}
        onClick={handleSettings}
        sx={secondaryButtonSx}
      >
        Settings
      </AppButton>

      <AppButton
        type="button"
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiEdit2 />}
        onClick={handleEdit}
        sx={primaryButtonSx}
      >
        Edit Company
      </AppButton>
    </AppStack>
  </div>
);

const CompanySummaryCard = ({ company }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={summaryCardSx}
  >
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-primary-soft text-primary">
        <FiBriefcase className="text-[36px]" />
      </div>

      <AppHeading level={2} weight={700} sx={summaryTitleSx}>
        {company.displayName || "-"}
      </AppHeading>

      <AppText variant="body2" sx={summarySubtitleSx}>
        {company.companyCode || "-"}
      </AppText>

      <div className="mt-2">
        <AppStatusBadge
          status={company.status || "inactive"}
          variant="soft"
          size="small"
          rounded="full"
        />
      </div>
    </div>

    <div className="my-4 h-px bg-border" />

    <AppStack direction="column" gap={1.4}>
      <SummaryRow
        icon={<FiBriefcase />}
        label="Type"
        value={company.displayType}
      />

      <SummaryRow
        icon={<FiMail />}
        label="Email"
        value={company.displayEmail}
      />

      <SummaryRow
        icon={<FiPhone />}
        label="Phone"
        value={company.displayPhone}
      />

      <SummaryRow
        icon={<FiMapPin />}
        label="Address"
        value={company.displayAddress}
      />
    </AppStack>

    <div className="my-4 h-px bg-border" />

    <AppStack direction="column" gap={1.4}>
      <SummaryRow
        icon={<FiCalendar />}
        label="Created"
        value={company.displayCreatedAt}
      />

      <SummaryRow
        icon={<FiClock />}
        label="Updated"
        value={company.displayUpdatedAt}
      />
    </AppStack>
  </AppCard>
);

const OverviewCard = ({ company }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sectionCardSx}
  >
    <SectionHeader icon={<FiShield />} title="Company Overview" />

    <AppDescriptionList
      columns={2}
      items={(company.overviewItems || []).map((item) => ({
        ...item,
        value: item.badge ? (
          <AppStatusBadge
            status={item.badge}
            variant="soft"
            size="small"
            rounded="full"
          />
        ) : (
          item.value || "-"
        ),
      }))}
      size="small"
      variant="default"
      sx={descriptionListSx}
      itemSx={descriptionItemSx}
    />
  </AppCard>
);

const DetailsSection = ({ icon, title, items = [], columns = 2 }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sectionCardSx}
  >
    <SectionHeader icon={icon} title={title} />

    <AppDescriptionList
      columns={columns}
      items={items.map((item) => ({
        ...item,
        value: item.value || "-",
      }))}
      size="small"
      variant="default"
      sx={descriptionListSx}
      itemSx={descriptionItemSx}
    />
  </AppCard>
);

const LicenseSection = ({ licenses = [] }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sectionCardSx}
  >
    <SectionHeader icon={<FiFileText />} title="Licenses" />

    <AppAccordion
      size="small"
      variant="ghost"
      defaultExpanded={licenses.map((license) => license.key)}
      multiple
      items={licenses.map((license) => ({
        id: license.key,
        title: (
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            fullWidth
          >
            <AppStack direction="row" align="center" gap={0.8}>
              <FiFileText className="text-[14px] text-primary" />

              <AppText variant="body2" sx={accordionTitleSx}>
                {license.title}
              </AppText>
            </AppStack>

            <AppStatusBadge
              status={license.status || "pending"}
              variant="soft"
              size="small"
              rounded="full"
            />
          </AppStack>
        ),
        content: <LicenseDetails license={license} />,
      }))}
      sx={accordionSx}
      summarySx={accordionSummarySx}
      detailsSx={accordionDetailsSx}
    />
  </AppCard>
);

const LicenseDetails = ({ license }) => {
  if (!license?.hasData) {
    return (
      <AppBox sx={emptyLicenseSx}>
        <AppText variant="body2" sx={mutedTextSx}>
          No license details added.
        </AppText>
      </AppBox>
    );
  }

  return (
    <AppGrid columns={3} gap={1.25}>
      <AppKeyValue
        label="License Number"
        value={license.licenseNumber || "-"}
        direction="column"
        size="small"
        labelSx={keyLabelSx}
        valueSx={keyValueSx}
      />

      <AppKeyValue
        label="Issued At"
        value={license.issuedAt || "-"}
        direction="column"
        size="small"
        labelSx={keyLabelSx}
        valueSx={keyValueSx}
      />

      <AppKeyValue
        label="Expires At"
        value={license.expiresAt || "-"}
        direction="column"
        size="small"
        labelSx={keyLabelSx}
        valueSx={keyValueSx}
      />
    </AppGrid>
  );
};

const SectionHeader = ({ icon, title }) => (
  <AppStack direction="row" align="center" gap={0.8} sx={sectionHeaderSx}>
    <span className="flex text-[15px] text-primary">{icon}</span>

    <AppHeading level={2} weight={650} sx={sectionTitleSx}>
      {title}
    </AppHeading>
  </AppStack>
);

const SummaryRow = ({ icon, label, value }) => (
  <AppStack direction="row" align="flex-start" gap={1}>
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-[14px] text-primary">
      {icon}
    </span>

    <AppKeyValue
      label={label}
      value={value || "-"}
      direction="column"
      size="small"
      sx={{ minWidth: 0, flex: 1 }}
      labelSx={summaryLabelSx}
      valueSx={summaryValueSx}
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

const secondaryButtonSx = {
  height: 34,
  px: 1.55,
  fontSize: "11.8px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const primaryButtonSx = {
  height: 34,
  px: 1.75,
  fontSize: "11.8px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

const summaryCardSx = {
  alignSelf: "start",
  px: 2,
  py: 1.8,
  bgcolor: "var(--app-color-surface)",
};

const summaryTitleSx = {
  mt: 1.35,
  mb: 0,
  width: "100%",
  textAlign: "center",
  fontSize: "17px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const summarySubtitleSx = {
  mt: 0.45,
  fontSize: "11.7px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const summaryLabelSx = {
  fontSize: "11.2px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const summaryValueSx = {
  mt: 0.2,
  fontSize: "12px",
  lineHeight: "17px",
  fontWeight: 650,
  color: "var(--app-color-text)",
  wordBreak: "break-word",
};

const sectionCardSx = {
  px: 2,
  py: 1.55,
  bgcolor: "var(--app-color-surface)",
};

const sectionHeaderSx = {
  mb: 1.25,
};

const sectionTitleSx = {
  m: 0,
  fontSize: "13.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const descriptionListSx = {
  width: "100%",
};

const descriptionItemSx = {
  py: 0.7,
};

const accordionSx = {
  boxShadow: "none",
  bgcolor: "transparent",
};

const accordionSummarySx = {
  minHeight: 36,
  px: 0,
  py: 0,
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const accordionDetailsSx = {
  px: 0,
  pt: 0.8,
  pb: 1,
};

const accordionTitleSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const emptyLicenseSx = {
  px: 1.2,
  py: 1,
  borderRadius: "10px",
  bgcolor: "var(--app-color-surface-alt)",
};

const mutedTextSx = {
  fontSize: "11.6px",
  color: "var(--app-color-text-muted)",
};

const keyLabelSx = {
  fontSize: "11.2px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const keyValueSx = {
  mt: 0.25,
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

export default CompanyDetailsDesktopPage;
