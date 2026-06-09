// src/features/access-control/pages/desktop/PermissionDesktopPage.jsx

import {
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEye,
  FiFilter,
  FiGrid,
  FiHeadphones,
  FiKey,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiShield,
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
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatCard,
  AppTableSkeleton,
  AppText,
  PageHeader,
  PageRightSidebar,
} from "@/components";

const statIcons = {
  modules: <FiGrid />,
  total: <FiKey />,
  active: <FiShield />,
  system: <FiShield />,
};

const moduleIcons = {
  dashboard: <FiGrid />,
  companies: <FiGrid />,
  branches: <FiGrid />,
  inventory: <FiGrid />,
  purchases: <FiGrid />,
  sales: <FiGrid />,
  billing: <FiGrid />,
  staff: <FiGrid />,
  reports: <FiGrid />,
  expenses: <FiGrid />,
  access: <FiShield />,
  settings: <FiSettings />,
};

const dummyPermissionModules = [
  {
    id: "dashboard",
    displayModule: "Dashboard",
    description: "Dashboard and analytics access",
    total: 8,
    active: 8,
  },
  {
    id: "companies",
    displayModule: "Companies",
    description: "Manage companies and company settings",
    total: 16,
    active: 16,
  },
  {
    id: "branches",
    displayModule: "Branches",
    description: "Manage branches and branch settings",
    total: 14,
    active: 14,
  },
  {
    id: "inventory",
    displayModule: "Inventory",
    description: "Manage inventory, stock and items",
    total: 24,
    active: 24,
  },
  {
    id: "purchases",
    displayModule: "Purchases",
    description: "Manage purchase orders and suppliers",
    total: 16,
    active: 16,
  },
  {
    id: "sales",
    displayModule: "Sales (POS)",
    description: "Manage sales and POS transactions",
    total: 20,
    active: 20,
  },
  {
    id: "billing",
    displayModule: "Billing & Invoicing",
    description: "Manage invoices and billing",
    total: 12,
    active: 12,
  },
  {
    id: "staff",
    displayModule: "Staff & Users",
    description: "Manage staff and user accounts",
    total: 16,
    active: 16,
  },
  {
    id: "reports",
    displayModule: "Reports",
    description: "View and export reports",
    total: 10,
    active: 10,
  },
  {
    id: "expenses",
    displayModule: "Expenses",
    description: "Manage expenses and categories",
    total: 10,
    active: 10,
  },
  {
    id: "access",
    displayModule: "Access Control",
    description: "Manage roles, permissions and access",
    total: 6,
    active: 6,
  },
  {
    id: "settings",
    displayModule: "Settings",
    description: "System settings and configurations",
    total: 4,
    active: 4,
  },
];

const PermissionDesktopPage = ({
  permissionGroups = [],
  stats = [],

  filters,
  activeFilterChips = [],
  moduleOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalPermissions = 0,
  filteredPermissionsCount = 0,
  totalModules = 0,
  hasPermissions,
  hasFilteredPermissions,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleRefresh,
  handleBackToAccessControl,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasPermissions;

  const modules = buildDisplayModules(permissionGroups);
  const hasData = modules.length > 0;
  const displayModules = hasData ? modules : dummyPermissionModules;

  const resolvedTotalModules = totalModules || displayModules.length;
  const resolvedTotalPermissions =
    totalPermissions ||
    displayModules.reduce((sum, module) => sum + Number(module.total || 0), 0);

  const resolvedActivePermissions =
    displayModules.reduce(
      (sum, module) => sum + Number(module.active || 0),
      0,
    ) || resolvedTotalPermissions;

  const displayStats = buildStats({
    stats,
    totalModules: resolvedTotalModules,
    totalPermissions: resolvedTotalPermissions,
    activePermissions: resolvedActivePermissions,
  });

  const overviewItems = [
    {
      id: "active",
      label: "Active",
      value: resolvedActivePermissions,
      percent: resolvedTotalPermissions
        ? Math.round(
            (resolvedActivePermissions / resolvedTotalPermissions) * 100,
          )
        : 100,
    },
    {
      id: "system",
      label: "System",
      value: resolvedTotalPermissions,
      percent: 100,
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Permissions"
          subtitle="Manage system permissions that can be assigned to roles."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Access Control", onClick: handleBackToAccessControl },
                { label: "Permissions", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_290px] gap-5">
          <div className="min-w-0">
            <StatsGrid stats={displayStats} />

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
                moduleOptions={moduleOptions}
                handleFilterChange={handleFilterChange}
                handleSearchChange={handleSearchChange}
                handleRemoveFilter={handleRemoveFilter}
                handleClearFilters={handleClearFilters}
              />

              {hasError ? (
                <AppErrorState
                  title="Unable to load permissions"
                  description={error || "Please refresh and try again."}
                  actionText="Refresh"
                  onRetry={handleRefresh}
                  size="page"
                  sx={stateSx}
                />
              ) : showInitialSkeleton ? (
                <AppTableSkeleton rows={10} columns={6} showHeader={false} />
              ) : !hasPermissions && !hasData ? (
                <PermissionTable modules={displayModules} />
              ) : !hasFilteredPermissions && hasPermissions ? (
                <AppEmptyState
                  title="No permissions found"
                  description="Try changing your search or module filter."
                  icon={<FiSearch />}
                  action={
                    <AppButton
                      variant="outlined"
                      colorVariant="neutral"
                      rounded="md"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </AppButton>
                  }
                  size="page"
                  sx={stateSx}
                />
              ) : (
                <PermissionTable modules={displayModules} />
              )}

              <TableFooter
                totalModules={resolvedTotalModules}
                filteredModules={displayModules.length}
              />
            </AppCard>
          </div>

          <PermissionRightSidebar
            overviewItems={overviewItems}
            totalPermissions={resolvedTotalPermissions}
          />
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

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-4 gap-4">
    {stats.map((stat) => (
      <AppStatCard
        key={stat.id}
        title={stat.title}
        value={stat.value}
        subtitle={stat.description}
        icon={statIcons[stat.id] || <FiKey />}
        colorVariant={stat.colorVariant}
        variant="default"
        sx={statCardSx}
        iconSx={statIconSx}
      />
    ))}
  </div>
);

const TableToolbar = ({
  filters,
  activeFilterChips,
  moduleOptions,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3.5 py-3">
    <div className="grid grid-cols-[minmax(320px,1fr)_150px_150px_104px] items-center gap-3">
      <AppSearchInput
        name="search"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search modules or permissions..."
        clearable
        onClear={() => handleSearchChange("")}
        size="small"
        variant="bordered"
        rounded="md"
        sx={searchSx}
        inputSx={filterInputSx}
      />

      <AppSelect
        name="module"
        value={filters.module}
        onChange={handleFilterChange}
        options={
          moduleOptions.length
            ? moduleOptions.map((option) => ({
                ...option,
                label:
                  option.value === "all"
                    ? "Module: All"
                    : `Module: ${option.label}`,
              }))
            : [{ label: "Module: All", value: "all" }]
        }
        size="small"
        variant="bordered"
        rounded="md"
        sx={selectSx}
        inputSx={filterInputSx}
      />

      <AppSelect
        name="status"
        value="all"
        onChange={() => {}}
        options={[{ label: "Status: All", value: "all" }]}
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
        startIcon={<FiDownload />}
        sx={exportButtonSx}
      >
        Export
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

const PermissionTable = ({ modules }) => (
  <div className="w-full overflow-x-auto">
    <div className="min-w-[880px]">
      <div className="grid grid-cols-[190px_minmax(240px,1fr)_130px_minmax(210px,0.9fr)_88px_82px] border-b border-border bg-surface-alt px-3.5 py-2.5">
        <HeaderCell>Module</HeaderCell>
        <HeaderCell>Description</HeaderCell>
        <HeaderCell align="center">Total Permissions</HeaderCell>
        <HeaderCell>Active</HeaderCell>
        <HeaderCell align="center">System</HeaderCell>
        <HeaderCell align="right">Actions</HeaderCell>
      </div>

      <div className="divide-y divide-border">
        {modules.map((module) => (
          <PermissionRow key={module.id} module={module} />
        ))}
      </div>
    </div>
  </div>
);

const HeaderCell = ({ children, align = "left" }) => (
  <div
    className={`text-[11.2px] font-bold leading-5 text-text-muted ${
      align === "center"
        ? "text-center"
        : align === "right"
          ? "text-right"
          : "text-left"
    }`}
  >
    {children}
  </div>
);

const PermissionRow = ({ module }) => {
  const total = Number(module.total || 0);
  const active = Number(module.active || total);
  const percent = total ? Math.round((active / total) * 100) : 100;

  return (
    <div className="grid min-h-[48px] grid-cols-[190px_minmax(240px,1fr)_130px_minmax(210px,0.9fr)_88px_82px] items-center px-3.5 py-2 transition hover:bg-surface-hover/60">
      <AppStack direction="row" align="center" gap={1.1} sx={{ minWidth: 0 }}>
        <IconBox icon={moduleIcons[module.id] || <FiGrid />} />

        <AppHeading level={3} weight={700} sx={moduleNameSx}>
          {module.displayModule}
        </AppHeading>
      </AppStack>

      <AppText variant="body2" sx={descriptionSx}>
        {module.description}
      </AppText>

      <AppText variant="body2" sx={centerTextSx}>
        {total}
      </AppText>

      <div className="grid grid-cols-[32px_1fr] items-center gap-3">
        <AppText variant="body2" sx={activeTextSx}>
          {active}
        </AppText>

        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <AppText variant="body2" sx={centerTextSx}>
        {total}
      </AppText>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="text-text-muted transition hover:text-primary"
          aria-label="View permissions"
        >
          <FiEye className="text-[15px]" />
        </button>

        <button
          type="button"
          className="text-text-muted transition hover:text-primary"
          aria-label="Permission settings"
        >
          <FiSettings className="text-[15px]" />
        </button>
      </div>
    </div>
  );
};

const TableFooter = ({ totalModules, filteredModules }) => (
  <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
    <AppText variant="body2" sx={footerTextSx}>
      Showing 1 to {filteredModules} of {totalModules} modules
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
        disabled
      />
    </AppStack>
  </div>
);

const PermissionRightSidebar = ({ overviewItems, totalPermissions }) => (
  <PageRightSidebar
    spacing={4}
    cards={[
      {
        title: "Permission Overview",
        icon: null,
        colorVariant: "success",
        variant: "default",
        custom: (
          <PermissionOverview
            overviewItems={overviewItems}
            totalPermissions={totalPermissions}
          />
        ),
      },
      {
        title: "Quick Actions",
        icon: null,
        colorVariant: "primary",
        variant: "default",
        custom: <QuickActions />,
      },
      {
        title: "About Permissions",
        icon: <FiHeadphones />,
        colorVariant: "neutral",
        variant: "default",
        description:
          "Permissions define what actions users can perform in the system. You can assign these permissions to roles.",
        actionLabel: "View User Guide",
        actionIcon: <FiChevronRight />,
      },
    ]}
  />
);

const PermissionOverview = ({ overviewItems, totalPermissions }) => (
  <div>
    <div className="mx-auto mt-2 flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[conic-gradient(var(--app-color-primary)_0_70%,var(--app-color-purple)_70%_100%)]">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-surface">
        <FiShield className="text-[18px] text-primary" />
      </div>
    </div>

    <div className="mt-5 space-y-3">
      {overviewItems.map((item) => (
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
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                item.id === "active" ? "bg-primary" : "bg-purple"
              }`}
            />
            <AppText variant="body2" sx={overviewLabelSx}>
              {item.label}
            </AppText>
          </AppStack>

          <AppText variant="body2" sx={overviewValueSx}>
            {item.value} ({item.percent}%)
          </AppText>
        </div>
      ))}
    </div>

    <button
      type="button"
      className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold text-primary"
    >
      View all permissions <FiChevronRight />
    </button>

    <AppText variant="body2" sx={overviewHintSx}>
      {totalPermissions} hardcoded system permissions are available for role
      assignment.
    </AppText>
  </div>
);

const QuickActions = () => (
  <div className="space-y-3">
    <QuickAction icon={<FiPlus />} text="Add New Permission" disabled />
    <QuickAction icon={<FiGrid />} text="Manage Modules" />
    <QuickAction icon={<FiShield />} text="Permission Groups" />
    <QuickAction icon={<FiBookOpen />} text="Audit Log" />
  </div>
);

const QuickAction = ({ icon, text, disabled = false }) => (
  <button
    type="button"
    disabled={disabled}
    className={`flex w-full items-center gap-2 text-left text-[12px] font-semibold transition ${
      disabled
        ? "cursor-not-allowed text-text-muted/55"
        : "text-text-muted hover:text-primary"
    }`}
  >
    <span className="text-[15px]">{icon}</span>
    {text}
  </button>
);

const IconBox = ({ icon }) => (
  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-success-soft text-[14px] text-success">
    {icon}
  </span>
);

const buildDisplayModules = (permissionGroups = []) =>
  permissionGroups.map((group) => {
    const total = Array.isArray(group.permissions)
      ? group.permissions.length
      : 0;

    return {
      id: group.moduleKey || group.id,
      displayModule: group.displayModule || group.moduleKey || "Module",
      description: getModuleDescription(group.displayModule || group.moduleKey),
      total,
      active: total,
    };
  });

const getModuleDescription = (module) => {
  const key = String(module || "").toLowerCase();

  if (key.includes("dashboard")) return "Dashboard and analytics access";
  if (key.includes("compan")) return "Manage companies and company settings";
  if (key.includes("branch")) return "Manage branches and branch settings";
  if (key.includes("inventory")) return "Manage inventory, stock and items";
  if (key.includes("purchase")) return "Manage purchase orders and suppliers";
  if (key.includes("sale")) return "Manage sales and POS transactions";
  if (key.includes("billing") || key.includes("invoice"))
    return "Manage invoices and billing";
  if (key.includes("staff") || key.includes("user"))
    return "Manage staff and user accounts";
  if (key.includes("report")) return "View and export reports";
  if (key.includes("expense")) return "Manage expenses and categories";
  if (key.includes("access") || key.includes("role"))
    return "Manage roles, permissions and access";
  if (key.includes("setting")) return "System settings and configurations";

  return `Manage ${module || "module"} permissions`;
};

const buildStats = ({
  stats,
  totalModules,
  totalPermissions,
  activePermissions,
}) => {
  if (Array.isArray(stats) && stats.length) {
    const totalStat = stats.find((stat) => stat.id === "total");
    const moduleStat = stats.find((stat) => stat.id === "modules");

    return [
      {
        id: "modules",
        title: "Total Modules",
        value: moduleStat?.value || totalModules,
        description: "System modules",
        colorVariant: "success",
      },
      {
        id: "total",
        title: "Total Permissions",
        value: totalStat?.value || totalPermissions,
        description: "All permissions",
        colorVariant: "info",
      },
      {
        id: "active",
        title: "Active Permissions",
        value: activePermissions || totalPermissions,
        description: "Currently active",
        colorVariant: "purple",
      },
      {
        id: "system",
        title: "System Permissions",
        value: totalPermissions,
        description: "Hardcoded permissions",
        colorVariant: "warning",
      },
    ];
  }

  return [
    {
      id: "modules",
      title: "Total Modules",
      value: totalModules,
      description: "System modules",
      colorVariant: "success",
    },
    {
      id: "total",
      title: "Total Permissions",
      value: totalPermissions,
      description: "All permissions",
      colorVariant: "info",
    },
    {
      id: "active",
      title: "Active Permissions",
      value: activePermissions || totalPermissions,
      description: "Currently active",
      colorVariant: "purple",
    },
    {
      id: "system",
      title: "System Permissions",
      value: totalPermissions,
      description: "Hardcoded permissions",
      colorVariant: "warning",
    },
  ];
};

const pageHeaderSx = {
  width: "100%",
};

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

const breadcrumbSx = {
  mb: 1,
};

const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const statCardSx = {
  minHeight: 104,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",

  "& .MuiCardContent-root": {
    p: 0,
  },

  p: 1.6,

  "& p:first-of-type": {
    fontSize: "11.5px",
  },

  "& h1, & h2, & h3, & h4, & h5, & h6": {
    fontSize: "25px",
    lineHeight: 1.05,
  },

  "& p:last-of-type": {
    fontSize: "11px",
  },
};

const statIconSx = {
  width: 44,
  height: 44,
  minWidth: 44,
  borderRadius: "12px",

  "& svg": {
    fontSize: 22,
  },
};

const alertSx = {
  mt: 3,
};

const tableCardSx = {
  mt: 4,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const searchSx = {
  width: "100%",
};

const selectSx = {
  width: "100%",
};

const filterInputSx = {
  minHeight: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const exportButtonSx = {
  height: 36,
  minWidth: 96,
  px: 1.2,
  fontSize: "12px",
  fontWeight: 650,
};

const chipsRowSx = {
  mt: 1.2,
  flexWrap: "wrap",
};

const moduleNameSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const descriptionSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const centerTextSx = {
  fontSize: "12px",
  fontWeight: 650,
  textAlign: "center",
  color: "var(--app-color-text)",
};

const activeTextSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const footerTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const pageSizeButtonSx = {
  height: 32,
  minWidth: 128,
  justifyContent: "space-between",
  px: 1.2,
  fontSize: "12px",
  fontWeight: 650,
};

const stateSx = {
  minHeight: 360,
};

const overviewLabelSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const overviewValueSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const overviewHintSx = {
  mt: 3,
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const toastSx = {
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
};

export default PermissionDesktopPage;
