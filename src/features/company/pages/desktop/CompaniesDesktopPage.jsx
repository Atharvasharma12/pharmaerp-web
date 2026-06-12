// src/features/company/pages/desktop/CompaniesDesktopPage.jsx

import { useMemo } from "react";
import {
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiMoreHorizontal,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiMail,
  FiPhone,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppHeading,
  AppIconButton,
  AppMenu,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppTableSkeleton,
  AppTag,
  AppText,
  HELP_SUPPORT_CARD,
  PageHeader,
  PageRightSidebar,
} from "@/components";

const companyColorMap = {
  proprietorship: "primary",
  partnership: "info",
  llp: "warning",
  private_limited: "success",
  public_limited: "purple",
  opc: "cyan",
  trust: "neutral",
  society: "neutral",
  other: "neutral",
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
  suspended: "danger",
};

const CompaniesDesktopPage = ({
  companies = [],
  stats = [],

  filters,
  activeFilterChips = [],
  statusOptions = [],
  companyTypeOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalCompanies = 0,
  filteredCompaniesCount = 0,
  hasCompanies,
  hasFilteredCompanies,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleCreateCompany,
  handleViewCompany,
  handleEditCompany,
  handleOpenSettings,
  handleDeleteCompany,
  handleRefresh,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasCompanies;

  const derivedOverview = useMemo(() => {
    const total = companies.length || 1;
    const active = companies.filter((c) => c.status === "active").length;
    const inactive = companies.filter((c) => c.status === "inactive").length;
    const pending = companies.filter((c) => c.status === "suspended").length;

    return [
      {
        id: "active",
        label: "Active",
        value: active,
        percent: Math.round((active / total) * 100),
        color: "bg-primary",
      },
      {
        id: "inactive",
        label: "Inactive",
        value: inactive,
        percent: Math.round((inactive / total) * 100),
        color: "bg-border-strong",
      },
      {
        id: "pending",
        label: "Pending",
        value: pending,
        percent: Math.round((pending / total) * 100),
        color: "bg-warning",
      },
    ];
  }, [companies]);

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Companies"
          subtitle="Manage all companies in your workspace."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Companies" },
                { label: "All Companies", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          actions={
            <AppStack
              direction="row"
              align="center"
              justify="flex-end"
              gap={1.1}
              sx={{ flexShrink: 0 }}
            >
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiDownload />}
                sx={secondaryButtonSx}
              >
                Export
              </AppButton>

              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<FiPlus />}
                onClick={handleCreateCompany}
                sx={primaryButtonSx}
              >
                Add Company
              </AppButton>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {error && !hasError ? (
          <AppAlert
            severity="error"
            variant="soft"
            title="Something went wrong"
            closable
            onClose={handleRefresh}
            sx={alertSx}
          >
            {error}
          </AppAlert>
        ) : null}

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_290px] gap-5">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={tableCardSx}
          >
            <TableToolbar
              filters={filters}
              activeFilterChips={activeFilterChips}
              statusOptions={statusOptions}
              companyTypeOptions={companyTypeOptions}
              handleFilterChange={handleFilterChange}
              handleSearchChange={handleSearchChange}
              handleRemoveFilter={handleRemoveFilter}
              handleClearFilters={handleClearFilters}
            />

            {hasError ? (
              <AppErrorState
                title="Unable to load companies list"
                description={error || "Please refresh and try again."}
                actionText="Refresh"
                onRetry={handleRefresh}
                size="page"
                sx={stateSx}
              />
            ) : showInitialSkeleton ? (
              <AppTableSkeleton rows={8} columns={7} showHeader={false} />
            ) : !hasCompanies ? (
              <AppEmptyState
                title="No companies configure yet"
                description="Add your business units or primary setup options to structure module layout pipelines."
                icon={<FiBriefcase />}
                action={
                  <AppButton
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={<FiPlus />}
                    onClick={handleCreateCompany}
                  >
                    Add Company
                  </AppButton>
                }
                size="page"
                sx={stateSx}
              />
            ) : !hasFilteredCompanies ? (
              <AppEmptyState
                title="No workspace records match"
                description="Try changing your search keywords or filter dropdown definitions."
                icon={<FiSearch />}
                action={
                  <AppButton
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    onClick={handleClearFilters}
                  >
                    Reset Filters
                  </AppButton>
                }
                size="page"
                sx={stateSx}
              />
            ) : (
              <CompaniesTable
                companies={companies}
                onView={handleViewCompany}
                onEdit={handleEditCompany}
                onSettings={handleOpenSettings}
                onDelete={handleDeleteCompany}
              />
            )}

            {hasCompanies && totalCompanies > 10 ? (
              <TableFooter
                totalCompanies={totalCompanies}
                filteredCompaniesCount={filteredCompaniesCount}
                handleClearFilters={handleClearFilters}
              />
            ) : null}
          </AppCard>

          <CompaniesRightSidebar overviewData={derivedOverview} />
        </div>
      </div>
    </section>
  );
};

const TopToast = ({ message, onClose }) => (
  <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-32px)] max-w-md -translate-x-1/2">
    <AppAlert
      severity="success"
      variant="filled"
      title={message}
      closable
      onClose={onClose}
      sx={toastSx}
    />
  </div>
);

const TableToolbar = ({
  filters,
  activeFilterChips,
  statusOptions,
  companyTypeOptions,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3.5 py-3">
    <div className="grid grid-cols-[minmax(300px,1fr)_128px_150px_104px] items-center gap-3">
      <AppSearchInput
        name="search"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search companies..."
        clearable
        onClear={() => handleSearchChange("")}
        size="small"
        variant="bordered"
        rounded="md"
        sx={searchSx}
        inputSx={filterInputSx}
      />

      <AppSelect
        name="status"
        value={filters.status}
        onChange={handleFilterChange}
        options={statusOptions}
        size="small"
        variant="bordered"
        rounded="md"
        sx={selectSx}
        inputSx={filterInputSx}
      />

      <AppSelect
        name="type"
        value={filters.type}
        onChange={handleFilterChange}
        options={companyTypeOptions}
        size="small"
        variant="bordered"
        rounded="md"
        sx={selectSx}
        inputSx={filterInputSx}
      />

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiRefreshCw />}
        onClick={handleClearFilters}
        sx={clearButtonSx}
      >
        Reset
      </AppButton>
    </div>

    {activeFilterChips.length ? (
      <AppStack direction="row" align="center" gap={0.7} sx={chipsRowSx}>
        {activeFilterChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => handleRemoveFilter(chip.key)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-alt px-2 py-1 text-[11px] font-semibold text-text-muted transition hover:bg-surface-hover"
          >
            {chip.label}
          </button>
        ))}

        <button
          type="button"
          onClick={handleClearFilters}
          className="text-[11px] font-semibold text-primary"
        >
          Clear all
        </button>
      </AppStack>
    ) : null}
  </div>
);

const CompaniesTable = ({
  companies,
  onView,
  onEdit,
  onSettings,
  onDelete,
}) => (
  <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
    <div className="min-w-[980px]">
      <div className="grid grid-cols-[1.5fr_1.1fr_1.3fr_1.4fr_75px_95px_54px] border-b border-border bg-surface-alt px-3.5 py-2.5">
        <HeaderCell>Company</HeaderCell>
        <HeaderCell>Type</HeaderCell>
        <HeaderCell>Owner</HeaderCell>
        <HeaderCell>Location</HeaderCell>
        <HeaderCell>Staff</HeaderCell>
        <HeaderCell>Status</HeaderCell>
        <HeaderCell align="right">Actions</HeaderCell>
      </div>

      <div className="divide-y divide-border">
        {companies.map((company) => (
          <CompanyRow
            key={company._id}
            company={company}
            onView={onView}
            onEdit={onEdit}
            onSettings={onSettings}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  </div>
);

const HeaderCell = ({ children, align = "left" }) => (
  <div
    className={`text-[11.2px] font-bold leading-5 text-text-muted ${align === "right" ? "text-right" : "text-left"}`}
  >
    {children}
  </div>
);

const CompanyRow = ({ company, onView, onEdit, onSettings, onDelete }) => (
  <div className="grid min-h-[58px] grid-cols-[1.5fr_1.1fr_1.3fr_1.4fr_75px_95px_54px] items-center px-3.5 py-2 transition hover:bg-surface-hover/60">
    <div className="flex items-center gap-3 min-w-0 h-full">
      <div className="flex items-center justify-center shrink-0">
        <IconBox
          icon={<FiBriefcase />}
          colorVariant={companyColorMap[company.type] || "primary"}
          small
        />
      </div>
      <div className="flex flex-col min-w-0 justify-center">
        <AppHeading level={3} weight={700} sx={companyNameSx}>
          {company.displayName || "-"}
        </AppHeading>
        {company.displayEmail && (
          <AppText variant="body2" sx={companySubTextSx}>
            {company.displayEmail}
          </AppText>
        )}
      </div>
    </div>

    <div>
      <AppTag
        label={company.displayType || "-"}
        variant="soft"
        colorVariant={companyColorMap[company.type] || "neutral"}
        rounded="md"
        sx={roleTagSx}
      />
    </div>

    <AppBox sx={{ minWidth: 0 }}>
      <AppText variant="body2" sx={tableTextSx}>
        {company.displayOwnerName || "-"}
      </AppText>
      {company.displayOwnerContact && (
        <AppText variant="body2" sx={subLocationTextSx}>
          {company.displayOwnerContact}
        </AppText>
      )}
    </AppBox>

    <AppBox sx={{ minWidth: 0 }}>
      <AppText variant="body2" sx={tableTextSx}>
        {company.addressLine1 || "-"}
      </AppText>
      {company.locationSummary && (
        <AppText variant="body2" sx={subLocationTextSx}>
          {company.locationSummary}
        </AppText>
      )}
    </AppBox>

    <AppStack direction="row" align="center" gap={0.5}>
      <FiUsers className="text-[12px] text-text-muted" />
      <AppText variant="body2" sx={staffCountSx}>
        {company.memberCount || company.membersCount || 0}
      </AppText>
    </AppStack>

    <div>
      <AppStatusBadge
        status={company.status}
        label={company.status || ""}
        variant="soft"
        size="small"
        rounded="md"
        colorVariant={statusColorMap[company.status] || "neutral"}
        sx={statusBadgeSx}
      />
    </div>

    <div className="flex justify-end">
      <CompanyActions
        company={company}
        onView={onView}
        onEdit={onEdit}
        onSettings={onSettings}
        onDelete={onDelete}
      />
    </div>
  </div>
);

const CompanyActions = ({ company, onView, onEdit, onSettings, onDelete }) => {
  const items = [
    { id: "view", label: "View Details", onClick: () => onView?.(company) },
    { id: "edit", label: "Edit Company", onClick: () => onEdit?.(company) },
    {
      id: "settings",
      label: "Module Settings",
      onClick: () => onSettings?.(company),
    },
    { id: "divider", type: "divider" },
    {
      id: "remove",
      label: "Remove Profile",
      danger: true,
      onClick: () => onDelete?.(company),
    },
  ];

  return (
    <AppMenu
      trigger={
        <button
          type="button"
          aria-label="Company actions list trigger"
          className="inline-flex h-auto w-auto items-center justify-center border-0 bg-transparent p-0 text-text-muted shadow-none outline-none transition hover:bg-transparent hover:text-primary focus:bg-transparent active:bg-transparent"
        >
          <FiMoreHorizontal className="text-[18px]" />
        </button>
      }
      items={items}
      dense
      minWidth={170}
    />
  );
};

const TableFooter = ({
  totalCompanies,
  filteredCompaniesCount,
  handleClearFilters,
}) => (
  <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
    <AppText variant="body2" sx={footerTextSx}>
      Showing {filteredCompaniesCount > 0 ? 1 : 0} to {filteredCompaniesCount}{" "}
      of {totalCompanies} companies
    </AppText>

    <AppStack direction="row" align="center" gap={1}>
      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        endIcon={<FiChevronRight className="rotate-90" />}
        sx={pageSizeButtonSx}
      >
        10 per page
      </AppButton>

      <AppIconButton
        icon={<FiChevronLeft />}
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        disabled
      />

      <span className="flex h-[31px] min-w-[31px] items-center justify-center rounded-md bg-primary px-2 text-[12px] font-bold text-text-inverse">
        1
      </span>

      <AppIconButton
        icon={<FiChevronRight />}
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        onClick={handleClearFilters}
        disabled={totalCompanies <= 10}
      />
    </AppStack>
  </div>
);

const CompaniesRightSidebar = ({ overviewData = [] }) => (
  <PageRightSidebar
    spacing={4}
    cards={[
      {
        title: "Companies Overview",
        icon: null,
        colorVariant: "success",
        variant: "default",
        custom: <OverviewChartCard overviewData={overviewData} />,
      },
      {
        title: "Quick Actions",
        icon: null,
        colorVariant: "primary",
        variant: "default",
        custom: <SidebarQuickActions />,
      },
      HELP_SUPPORT_CARD,
    ]}
  />
);

const OverviewChartCard = ({ overviewData }) => {
  const conicGradientStyle = useMemo(() => {
    let currentPercentage = 0;
    const segments = overviewData.map((item) => {
      const start = currentPercentage;
      currentPercentage += item.percent || 0;
      return `var(--app-color-${item.id === "active" ? "primary" : item.id === "inactive" ? "border-strong" : "warning"}) ${start}% ${currentPercentage}%`;
    });
    return {
      background: segments.length
        ? `conic-gradient(${segments.join(", ")})`
        : "var(--app-color-border)",
    };
  }, [overviewData]);

  return (
    <div>
      <div
        style={conicGradientStyle}
        className="mx-auto mt-2 flex h-[86px] w-[86px] items-center justify-center rounded-full"
      >
        <div className="h-[45px] w-[45px] rounded-full bg-surface" />
      </div>

      <div className="mt-4 space-y-3">
        {overviewData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_auto] items-center gap-3"
          >
            <AppStack
              direction="row"
              align="center"
              gap={0.8}
              sx={{ minWidth: 0 }}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <AppText variant="body2" sx={overviewLabelSx}>
                {item.label}
              </AppText>
            </AppStack>
            <AppText variant="body2" sx={overviewValueSx}>
              {item.value} ({item.percent || 0}%)
            </AppText>
          </div>
        ))}
      </div>
    </div>
  );
};

const SidebarQuickActions = () => (
  <div className="space-y-3">
    <QuickActionItem text="Add New Company" />
    <QuickActionItem text="Import Companies" />
    <QuickActionItem text="Manage Groups" />
    <QuickActionItem text="Bulk Update Status" />
    <QuickActionItem text="Export Companies" />
  </div>
);

const QuickActionItem = ({ text }) => (
  <button
    type="button"
    className="flex w-full items-center gap-2 text-left text-[12px] font-semibold text-text-muted transition hover:text-primary"
  >
    <span className="text-[14px] text-text-muted/80">+</span>
    {text}
  </button>
);

const IconBox = ({ icon, colorVariant = "primary", small = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: small ? 32 : 44,
      height: small ? 32 : 44,
      minWidth: small ? 32 : 44,
      borderRadius: small ? "9px" : "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: small ? "15px" : "22px",
    }}
  >
    {icon}
  </AppBox>
);

// Style definitions
const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "25px",
    lineHeight: 1.15,
    letterSpacing: "-0.45px",
    color: "var(--app-color-text)",
  },
};
const breadcrumbSx = { mb: 1 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const secondaryButtonSx = {
  height: 36,
  minWidth: 86,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
};
const primaryButtonSx = {
  height: 36,
  minWidth: 124,
  px: 1.7,
  fontSize: "12px",
  fontWeight: 700,
};

const alertSx = { mt: 3 };
const tableCardSx = {
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};
const searchSx = { width: "100%" };
const selectSx = { width: "100%" };
const filterInputSx = {
  minHeight: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};
const clearButtonSx = {
  height: 36,
  minWidth: 88,
  px: 1.2,
  fontSize: "12px",
  fontWeight: 650,
};
const chipsRowSx = { mt: 1.2, flexWrap: "wrap" };

const companyNameSx = {
  m: 0,
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};
const companySubTextSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};
const roleTagSx = {
  height: 22,
  px: 1.2,
  fontSize: "10.5px",
  fontWeight: 600,
  textTransform: "capitalize",
  width: "fit-content",
};
const tableTextSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--app-color-text)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};
const subLocationTextSx = {
  mt: 0.2,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};
const statusBadgeSx = {
  height: 22,
  px: 1.5,
  fontSize: "10.5px",
  textTransform: "capitalize",
};
const staffCountSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const footerTextSx = { fontSize: "12px", color: "var(--app-color-text-muted)" };
const pageSizeButtonSx = {
  height: 32,
  minWidth: 128,
  justifyContent: "space-between",
  px: 1.2,
  fontSize: "12px",
  fontWeight: 650,
};
const stateSx = { minHeight: 360 };
const overviewLabelSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const overviewValueSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};
const toastSx = { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)" };

export default CompaniesDesktopPage;
