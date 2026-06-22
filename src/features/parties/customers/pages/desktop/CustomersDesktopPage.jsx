// src/features/parties/customers/pages/desktop/CustomersDesktopPage.jsx

import { useMemo } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiMoreHorizontal,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiPhone,
  FiMail,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
  FiUserMinus,
  FiUserX,
} from "react-icons/fi";
import { LuStore } from "react-icons/lu";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

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

const typeColorMap = {
  retail: "success",
  wholesale: "primary",
  hospital: "purple",
  clinic: "warning",
  corporate: "info",
  other: "neutral",
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
  blocked: "danger",
};

const getCategoryIcon = (type = "") => {
  const normType = String(type).toLowerCase();
  if (normType === "hospital") {
    return <HiOutlineBuildingOffice2 />;
  }
  return <LuStore />;
};

const CustomersDesktopPage = ({
  customers = [],
  stats,
  typeDistribution = [],
  filters,
  activeFilterChips = [],
  isLoading,
  hasError,
  error,
  message,
  totalCustomers = 0,
  filteredCustomersCount = 0,
  hasCustomers,
  hasFilteredCustomers,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleCreateCustomer,
  handleViewCustomer,
  handleEditCustomer,
  handleDeleteCustomer,
  handleRefresh,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasCustomers;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Customers"
          subtitle="View and manage all your customer records."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Parties" },
                { label: "Customers", current: true },
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
                colorVariant="success"
                rounded="md"
                size="small"
                startIcon={<FiPlus />}
                onClick={handleCreateCustomer}
                sx={primaryButtonSx}
              >
                Add Customer
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
              handleFilterChange={handleFilterChange}
              handleSearchChange={handleSearchChange}
              handleRemoveFilter={handleRemoveFilter}
              handleClearFilters={handleClearFilters}
            />

            {hasError ? (
              <AppErrorState
                title="Unable to load customers list"
                description={error || "Please refresh and try again."}
                actionText="Refresh"
                onRetry={handleRefresh}
                size="page"
                sx={stateSx}
              />
            ) : showInitialSkeleton ? (
              <AppTableSkeleton rows={8} columns={7} showHeader={false} />
            ) : !hasCustomers ? (
              <AppEmptyState
                title="No customers configured yet"
                description="Add customer profiles to start recording invoices and pipeline terms."
                icon={<FiUsers />}
                action={
                  <AppButton
                    variant="contained"
                    colorVariant="success"
                    rounded="md"
                    startIcon={<FiPlus />}
                    onClick={handleCreateCustomer}
                  >
                    Add Customer
                  </AppButton>
                }
                size="page"
                sx={stateSx}
              />
            ) : !hasFilteredCustomers ? (
              <AppEmptyState
                title="No customer records match"
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
              <CustomersTable
                customers={customers}
                onView={handleViewCustomer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
              />
            )}

            {hasCustomers && totalCustomers > 10 ? (
              <TableFooter
                totalCustomers={totalCustomers}
                filteredCustomersCount={filteredCustomersCount}
                handleClearFilters={handleClearFilters}
              />
            ) : null}
          </AppCard>

          <CustomersRightSidebar stats={stats} typeDistribution={typeDistribution} />
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
        placeholder="Search customers..."
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
        placeholder="Status"
        options={[
          { label: "Status: All", value: "all" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Blocked", value: "blocked" },
        ]}
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
        placeholder="Customer Type"
        options={[
          { label: "Type: All", value: "all" },
          { label: "Retail", value: "retail" },
          { label: "Wholesale", value: "wholesale" },
          { label: "Hospital", value: "hospital" },
          { label: "Clinic", value: "clinic" },
          { label: "Corporate", value: "corporate" },
        ]}
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

const CustomersTable = ({ customers, onView, onEdit, onDelete }) => (
  <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
    <div className="min-w-[980px]">
      <div className="grid grid-cols-[1.1fr_1.5fr_1.1fr_1.1fr_1.5fr_1.2fr_1fr_54px] border-b border-border bg-surface-alt px-3.5 py-2.5">
        <HeaderCell>Customer Code</HeaderCell>
        <HeaderCell>Customer Name</HeaderCell>
        <HeaderCell>Customer Type</HeaderCell>
        <HeaderCell>Mobile</HeaderCell>
        <HeaderCell>Email</HeaderCell>
        <HeaderCell>Credit Limit</HeaderCell>
        <HeaderCell>Status</HeaderCell>
        <HeaderCell align="right">Actions</HeaderCell>
      </div>

      <div className="divide-y divide-border">
        {customers.map((customer) => (
          <CustomerRow
            key={customer.id}
            customer={customer}
            onView={onView}
            onEdit={onEdit}
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

const CustomerRow = ({ customer, onView, onEdit, onDelete }) => (
  <div className="grid min-h-[58px] grid-cols-[1.1fr_1.5fr_1.1fr_1.1fr_1.5fr_1.2fr_1fr_54px] items-center px-3.5 py-2 transition hover:bg-surface-hover/60">
    <div className="font-semibold text-text-muted">
      {customer.displayCode || "-"}
    </div>

    <div className="flex items-center gap-3 min-w-0 h-full">
      <div className="flex items-center justify-center shrink-0">
        <IconBox
          icon={getCategoryIcon(customer.customerType || customer.type)}
          colorVariant={typeColorMap[String(customer.customerType || customer.type).toLowerCase()] || "primary"}
          small
        />
      </div>
      <div className="flex flex-col min-w-0 justify-center">
        <AppHeading level={3} weight={700} sx={customerNameSx}>
          {customer.displayName || "-"}
        </AppHeading>
        {customer.displayEmail && (
          <AppText variant="body2" sx={customerSubTextSx}>
            {customer.displayEmail}
          </AppText>
        )}
      </div>
    </div>

    <div>
      <AppTag
        label={customer.displayType || "Retail"}
        variant="soft"
        colorVariant={typeColorMap[String(customer.customerType || customer.type).toLowerCase()] || "neutral"}
        rounded="md"
        sx={roleTagSx}
      />
    </div>

    <div className="text-text-muted font-medium">
      {customer.displayMobile || "-"}
    </div>

    <div className="text-text-muted font-medium truncate max-w-[140px]">
      {customer.displayEmail || "—"}
    </div>

    <div className="text-text font-bold">
      ₹ {customer.displayCreditLimit.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </div>

    <div>
      <AppStatusBadge
        status={String(customer.displayStatus).toLowerCase()}
        label={customer.displayStatus || ""}
        variant="soft"
        size="small"
        rounded="md"
        colorVariant={statusColorMap[String(customer.displayStatus).toLowerCase()] || "neutral"}
        sx={statusBadgeSx}
      />
    </div>

    <div className="flex justify-end">
      <CustomerActions
        customer={customer}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  </div>
);

const CustomerActions = ({ customer, onView, onEdit, onDelete }) => {
  const items = [
    { id: "view", label: "View Details", icon: <FiEye />, onClick: () => onView?.(customer) },
    { id: "edit", label: "Edit Customer", icon: <FiEdit2 />, onClick: () => onEdit?.(customer) },
    { id: "divider", type: "divider" },
    {
      id: "remove",
      label: "Remove Profile",
      icon: <FiTrash2 />,
      danger: true,
      onClick: () => onDelete?.(customer),
    },
  ];

  return (
    <AppMenu
      trigger={
        <button
          type="button"
          aria-label="Customer actions list trigger"
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
  totalCustomers,
  filteredCustomersCount,
  handleClearFilters,
}) => (
  <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
    <AppText variant="body2" sx={footerTextSx}>
      Showing {filteredCustomersCount > 0 ? 1 : 0} to {filteredCustomersCount} of {totalCustomers} customers
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
        disabled={totalCustomers <= 10}
      />
    </AppStack>
  </div>
);

const CustomersRightSidebar = ({ stats, typeDistribution = [] }) => {
  return (
    <PageRightSidebar
      spacing={4}
      cards={[
        {
          title: "Customers Summary",
          icon: null,
          colorVariant: "success",
          variant: "default",
          custom: <CustomersSummaryWidget stats={stats} />,
        },
        {
          title: "Customer Type",
          icon: null,
          colorVariant: "primary",
          variant: "default",
          custom: <TypeDistributionList typeDistribution={typeDistribution} />,
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
};

const CustomersSummaryWidget = ({ stats }) => {
  return (
    <div className="space-y-3.5">
      {/* Total */}
      <AppStack direction="row" align="center" justify="space-between">
        <AppStack direction="row" align="center" gap={1.2}>
          <IconBox icon={<FiUsers />} colorVariant="success" small />
          <div>
            <AppText variant="body2" sx={sidebarRowTitleSx}>
              Total Customers
            </AppText>
            <AppText variant="body2" sx={sidebarRowDescSx}>
              Total customer records
            </AppText>
          </div>
        </AppStack>
        <AppText variant="body2" sx={sidebarRowValueSx}>
          {stats.total.toLocaleString()}
        </AppText>
      </AppStack>

      {/* Active */}
      <AppStack direction="row" align="center" justify="space-between">
        <AppStack direction="row" align="center" gap={1.2}>
          <IconBox icon={<FiUserCheck />} colorVariant="success" small />
          <div>
            <AppText variant="body2" sx={sidebarRowTitleSx}>
              Active Customers
            </AppText>
            <AppText variant="body2" sx={sidebarRowDescSx}>
              Active customers logs
            </AppText>
          </div>
        </AppStack>
        <AppText variant="body2" sx={sidebarRowValueActiveSx}>
          {stats.active.toLocaleString()}
        </AppText>
      </AppStack>

      {/* Inactive */}
      <AppStack direction="row" align="center" justify="space-between">
        <AppStack direction="row" align="center" gap={1.2}>
          <IconBox icon={<FiUserMinus />} colorVariant="neutral" small />
          <div>
            <AppText variant="body2" sx={sidebarRowTitleSx}>
              Inactive Customers
            </AppText>
            <AppText variant="body2" sx={sidebarRowDescSx}>
              Dormant client logs
            </AppText>
          </div>
        </AppStack>
        <AppText variant="body2" sx={sidebarRowValueMutedSx}>
          {stats.inactive.toLocaleString()}
        </AppText>
      </AppStack>

      {/* Blocked */}
      <AppStack direction="row" align="center" justify="space-between">
        <AppStack direction="row" align="center" gap={1.2}>
          <IconBox icon={<FiUserX />} colorVariant="danger" small />
          <div>
            <AppText variant="body2" sx={sidebarRowTitleSx}>
              Blocked Customers
            </AppText>
            <AppText variant="body2" sx={sidebarRowDescSx}>
              Suspended credit terms
            </AppText>
          </div>
        </AppStack>
        <AppText variant="body2" sx={sidebarRowValueDangerSx}>
          {stats.blocked.toLocaleString()}
        </AppText>
      </AppStack>
    </div>
  );
};

const TypeDistributionList = ({ typeDistribution = [] }) => (
  <div className="space-y-2.5">
    {typeDistribution.map((item) => (
      <div key={item.name} className="flex items-center justify-between text-[11.5px] font-semibold text-text">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full inline-block"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.name}</span>
        </div>
        <span className="text-text-muted font-bold">{item.count.toLocaleString()}</span>
      </div>
    ))}
  </div>
);

const SidebarQuickActions = () => (
  <div className="space-y-3">
    <QuickActionItem text="Import Customers" />
    <QuickActionItem text="Export Customers" />
    <QuickActionItem text="Customer Groups" />
    <QuickActionItem text="Merge Customers" />
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

const customerNameSx = {
  m: 0,
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};
const customerSubTextSx = {
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
  fontWeight: 700,
};
const statusBadgeSx = {
  height: 22,
  px: 1.2,
  fontSize: "10.5px",
  fontWeight: 700,
  textTransform: "capitalize",
};

const footerTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const pageSizeButtonSx = {
  height: 31,
  fontSize: "11.5px",
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text-muted)",
  "& .MuiButton-endIcon": {
    marginLeft: "4px",
  },
};

const overviewLabelSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};
const overviewValueSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const stateSx = {
  minHeight: 390,
};

const sidebarRowTitleSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};
const sidebarRowDescSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  mt: 0.15,
};
const sidebarRowValueSx = {
  fontSize: "13px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};
const sidebarRowValueActiveSx = {
  fontSize: "13px",
  fontWeight: 700,
  color: "var(--app-color-success)",
};
const sidebarRowValueMutedSx = {
  fontSize: "13px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
};
const sidebarRowValueDangerSx = {
  fontSize: "13px",
  fontWeight: 700,
  color: "var(--app-color-danger)",
};
const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default CustomersDesktopPage;
