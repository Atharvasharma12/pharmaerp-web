// src/features/access-control/pages/desktop/MemberAccessDesktopPage.jsx

import {
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFilter,
  FiHeadphones,
  FiMoreHorizontal,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSliders,
  FiUsers,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

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
  AppStatCard,
  AppStatusBadge,
  AppTableSkeleton,
  AppTag,
  AppText,
  HELP_SUPPORT_CARD,
  PageHeader,
  PageRightSidebar,
} from "@/components";

const statIcons = {
  total: <FiUsers />,
  active: <HiOutlineBuildingOffice2 />,
  companies: <HiOutlineBuildingOffice2 />,
  branches: <LuStore />,
};

const roleColorMap = {
  Pharmacist: "success",
  Manager: "info",
  Cashier: "purple",
  "Store Incharge": "warning",
  Accountant: "cyan",
  "Delivery Boy": "purple",
  Owner: "warning",
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const MemberAccessDesktopPage = ({
  accessList = [],
  stats = [],
  accessOverview = [],

  filters,
  activeFilterChips = [],
  statusOptions = [],
  companyOptions = [],
  branchOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalAccessRecords = 0,
  filteredAccessRecordsCount = 0,
  hasAccessRecords,
  hasFilteredAccessRecords,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleRefresh,
  handleBackToAccessControl,
  handleAssignAccess,
  handleExportMemberAccess,
  handleEditAccess,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasAccessRecords;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Member Access"
          subtitle="View and manage workspace members and their company & branch access."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Access Control", onClick: handleBackToAccessControl },
                { label: "Member Access", current: true },
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
                onClick={handleExportMemberAccess}
                sx={secondaryButtonSx}
              >
                Export
              </AppButton>

              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiFilter />}
                sx={secondaryButtonSx}
              >
                Filters
              </AppButton>

              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<FiPlus />}
                onClick={handleAssignAccess}
                sx={primaryButtonSx}
              >
                Assign Access
              </AppButton>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        <StatsGrid stats={stats} />

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
              companyOptions={companyOptions}
              branchOptions={branchOptions}
              handleFilterChange={handleFilterChange}
              handleSearchChange={handleSearchChange}
              handleRemoveFilter={handleRemoveFilter}
              handleClearFilters={handleClearFilters}
            />

            {hasError ? (
              <AppErrorState
                title="Unable to load member access"
                description={error || "Please refresh and try again."}
                actionText="Refresh"
                onRetry={handleRefresh}
                size="page"
                sx={stateSx}
              />
            ) : showInitialSkeleton ? (
              <AppTableSkeleton rows={8} columns={7} showHeader={false} />
            ) : !hasAccessRecords ? (
              <AppEmptyState
                title="No member access records yet"
                description="Assign access to configure company and branch visibility for workspace members."
                icon={<FiSliders />}
                action={
                  <AppButton
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={<FiPlus />}
                    onClick={handleAssignAccess}
                  >
                    Assign Access
                  </AppButton>
                }
                size="page"
                sx={stateSx}
              />
            ) : !hasFilteredAccessRecords ? (
              <AppEmptyState
                title="No members found"
                description="Try changing your search or filters."
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
              <MemberAccessTable
                accessList={accessList}
                onEdit={handleEditAccess}
              />
            )}

            {hasAccessRecords ? (
              <TableFooter
                totalAccessRecords={totalAccessRecords}
                filteredAccessRecordsCount={filteredAccessRecordsCount}
              />
            ) : null}
          </AppCard>

          <MemberAccessRightSidebar accessOverview={accessOverview} />
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
  <div className="mt-4 grid grid-cols-4 gap-4">
    {stats.map((stat) => (
      <AppStatCard
        key={stat.id}
        title={stat.title}
        value={stat.value}
        subtitle={stat.description}
        icon={statIcons[stat.id] || <FiUsers />}
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
  statusOptions,
  companyOptions,
  branchOptions,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3.5 py-3">
    <div className="grid grid-cols-[minmax(300px,1fr)_128px_150px_128px_92px] items-center gap-3">
      <AppSearchInput
        name="search"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search members by name, email or role..."
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
        name="company"
        value={filters.company}
        onChange={handleFilterChange}
        options={companyOptions}
        size="small"
        variant="bordered"
        rounded="md"
        sx={selectSx}
        inputSx={filterInputSx}
      />

      <AppSelect
        name="branch"
        value={filters.branch}
        onChange={handleFilterChange}
        options={branchOptions}
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
        Clear
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

const MemberAccessTable = ({ accessList, onEdit }) => (
  <div className="w-full overflow-x-auto">
    <div className="min-w-[930px]">
      <div className="grid grid-cols-[minmax(220px,1.35fr)_115px_minmax(130px,0.95fr)_minmax(125px,0.95fr)_95px_120px_54px] border-b border-border bg-surface-alt px-3.5 py-2.5">
        <HeaderCell>Member</HeaderCell>
        <HeaderCell>Role</HeaderCell>
        <HeaderCell>Companies Access</HeaderCell>
        <HeaderCell>Branches Access</HeaderCell>
        <HeaderCell>Status</HeaderCell>
        <HeaderCell>Last Updated</HeaderCell>
        <HeaderCell align="right">Actions</HeaderCell>
      </div>

      <div className="divide-y divide-border">
        {accessList.map((access) => (
          <MemberAccessRow key={access._id} access={access} onEdit={onEdit} />
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

const MemberAccessRow = ({ access, onEdit }) => (
  <div className="grid min-h-[58px] grid-cols-[minmax(220px,1.35fr)_115px_minmax(130px,0.95fr)_minmax(125px,0.95fr)_95px_120px_54px] items-center px-3.5 py-2.5 transition hover:bg-surface-hover/60">
    <AppStack direction="row" align="center" gap={1.1} sx={{ minWidth: 0 }}>
      <Avatar name={access.displayName} />

      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={3} weight={700} sx={memberNameSx}>
          {access.displayName}
        </AppHeading>

        <AppText variant="body2" sx={memberEmailSx}>
          {access.displayEmail}
        </AppText>
      </AppBox>
    </AppStack>

    <AppTag
      label={access.displayRole}
      variant="soft"
      colorVariant={
        access.roleColorVariant || roleColorMap[access.displayRole] || "primary"
      }
      rounded="md"
      sx={roleTagSx}
    />

    <AppText variant="body2" sx={tableTextSx}>
      {access.companyAccessLabel}
    </AppText>

    <AppText variant="body2" sx={tableTextSx}>
      {access.branchAccessLabel}
    </AppText>

    <AppStatusBadge
      status={access.displayStatus}
      label={access.displayStatus === "active" ? "Active" : "Inactive"}
      variant="soft"
      size="small"
      rounded="md"
      colorVariant={statusColorMap[access.displayStatus] || "neutral"}
      sx={statusBadgeSx}
    />

    <AppBox sx={{ minWidth: 0 }}>
      <AppText variant="body2" sx={dateTextSx}>
        {access.displayUpdatedAt}
      </AppText>
      <AppText variant="body2" sx={updatedBySx}>
        by {access.updatedBy || "Admin"}
      </AppText>
    </AppBox>

    <div className="flex justify-end">
      <MemberActions access={access} onEdit={onEdit} />
    </div>
  </div>
);

const MemberActions = ({ access, onEdit }) => {
  const items = [
    { id: "view", label: "View Details", onClick: () => onEdit?.(access) },
    {
      id: "edit",
      label: "Edit Access",
      disabled: !access?.canEdit,
      onClick: () => onEdit?.(access),
    },
    { id: "divider", type: "divider" },
    { id: "remove", label: "Remove Access", danger: true, disabled: true },
  ];

  return (
    <AppMenu
      trigger={
        <button
          type="button"
          aria-label="Member access actions"
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

const Avatar = ({ name }) => {
  const initials = String(name || "M")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-[11px] font-bold text-text">
      {initials || "M"}
    </span>
  );
};

const TableFooter = ({ totalAccessRecords, filteredAccessRecordsCount }) => (
  <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
    <AppText variant="body2" sx={footerTextSx}>
      Showing 1 to {filteredAccessRecordsCount} of {totalAccessRecords} members
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

const MemberAccessRightSidebar = ({ accessOverview = [] }) => (
  <PageRightSidebar
    spacing={4}
    cards={[
      {
        title: "Access Overview",
        icon: null,
        colorVariant: "success",
        variant: "default",
        custom: <AccessOverviewCard accessOverview={accessOverview} />,
      },
      {
        title: "Quick Actions",
        icon: null,
        colorVariant: "primary",
        variant: "default",
        custom: <QuickActions />,
      },
      HELP_SUPPORT_CARD,
    ]}
  />
);

const AccessOverviewCard = ({ accessOverview }) => (
  <div>
    <div className="mx-auto mt-2 flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[conic-gradient(var(--app-color-primary)_0_43%,var(--app-color-success-soft)_43%_93%,var(--app-color-border-strong)_93%_100%)]">
      <div className="h-[45px] w-[45px] rounded-full bg-surface" />
    </div>

    <div className="mt-4 space-y-3">
      {accessOverview.map((item) => (
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
              className={`h-2.5 w-2.5 rounded-full ${item.id === "full" ? "bg-primary" : item.id === "partial" ? "bg-success-soft" : "bg-border-strong"}`}
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
  </div>
);

const QuickActions = () => (
  <div className="space-y-3">
    <QuickAction icon={<FiUsers />} text="Assign access to member" />
    <QuickAction icon={<FiUsers />} text="Bulk update access" />
    <QuickAction icon={<FiDownload />} text="Export member access" />
  </div>
);

const QuickAction = ({ icon, text }) => (
  <button
    type="button"
    className="flex w-full items-center gap-2 text-left text-[12px] font-semibold text-text-muted transition hover:text-primary"
  >
    <span className="text-[15px]">{icon}</span>
    {text}
  </button>
);

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
  boxShadow: "0 10px 20px rgba(22, 163, 74, 0.18)",
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

const chipsRowSx = {
  mt: 1.2,
  flexWrap: "wrap",
};

const memberNameSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const memberEmailSx = {
  mt: 0.35,
  fontSize: "11px",
  lineHeight: 1.25,
  color: "var(--app-color-text-muted)",
};

const roleTagSx = {
  height: 22,
  px: 0.9,
  fontSize: "10.5px",
  fontWeight: 700,
  width: "fit-content",
};

const tableTextSx = {
  fontSize: "12px",
  fontWeight: 500,
  color: "var(--app-color-text)",
};

const statusBadgeSx = {
  height: 22,
  px: 0,
  fontSize: "10.5px",
  textTransform: "capitalize",
};

const dateTextSx = {
  fontSize: "12px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const updatedBySx = {
  mt: 0.35,
  fontSize: "11px",
  lineHeight: 1.25,
  color: "var(--app-color-text-muted)",
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

const toastSx = {
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
};

export default MemberAccessDesktopPage;
