import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFilter,
  FiHeadphones,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiShield,
  FiSliders,
  FiUsers,
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
} from "@/components";

const statIcons = {
  total: <FiUsers />,
  system: <FiShield />,
  custom: <FiUsers />,
  inactive: <FiSliders />,
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const typeColorMap = {
  System: "info",
  Custom: "purple",
};

const RolesDesktopPage = ({
  roles = [],
  stats = [],
  roleHelp,

  filters,
  activeFilterChips = [],
  statusOptions = [],
  typeOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalRoles = 0,
  filteredRolesCount = 0,
  hasRoles,
  hasFilteredRoles,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleRefresh,
  handleBackToAccessControl,
  handleCreateRole,
  handleExportRoles,
  handleViewRole,
  handleEditRole,
  handleDeleteRole,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasRoles;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          onBack={handleBackToAccessControl}
          onCreate={handleCreateRole}
          onExport={handleExportRoles}
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

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_290px] gap-5">
          <div className="min-w-0">
            <StatsGrid stats={stats} />

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
                typeOptions={typeOptions}
                handleFilterChange={handleFilterChange}
                handleSearchChange={handleSearchChange}
                handleRemoveFilter={handleRemoveFilter}
                handleClearFilters={handleClearFilters}
              />

              {hasError ? (
                <AppErrorState
                  title="Unable to load roles"
                  description={error || "Please refresh and try again."}
                  actionText="Refresh"
                  onRetry={handleRefresh}
                  size="page"
                  sx={stateSx}
                />
              ) : showInitialSkeleton ? (
                <AppTableSkeleton rows={8} columns={6} showHeader={false} />
              ) : !hasRoles ? (
                <AppEmptyState
                  title="No roles yet"
                  description="Create custom roles or refresh to load default workspace roles."
                  icon={<FiShield />}
                  action={
                    <AppButton
                      variant="contained"
                      colorVariant="primary"
                      rounded="md"
                      startIcon={<FiPlus />}
                      onClick={handleCreateRole}
                    >
                      Create Role
                    </AppButton>
                  }
                  size="page"
                  sx={stateSx}
                />
              ) : !hasFilteredRoles ? (
                <AppEmptyState
                  title="No roles found"
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
                <RoleTable
                  roles={roles}
                  onView={handleViewRole}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteRole}
                />
              )}

              {hasRoles ? (
                <TableFooter
                  totalRoles={totalRoles}
                  filteredRolesCount={filteredRolesCount}
                />
              ) : null}
            </AppCard>
          </div>

          <RightSidebar roleHelp={roleHelp} />
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

const PageHeader = ({ onBack, onCreate, onExport }) => (
  <div className="w-full">
    <AppBreadcrumb
      size="small"
      variant="text"
      items={[
        { label: "Access Control", onClick: onBack },
        { label: "Roles", current: true },
      ]}
      sx={breadcrumbSx}
      itemSx={breadcrumbItemSx}
      currentItemSx={breadcrumbCurrentSx}
    />

    <div className="flex w-full items-center justify-between gap-5">
      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={1} weight={800} sx={pageTitleSx}>
          Roles
        </AppHeading>

        <AppText variant="body2" sx={pageSubtitleSx}>
          Create and manage roles for your workspace. Define permissions for
          each role.
        </AppText>
      </AppBox>

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
          onClick={onExport}
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
          onClick={onCreate}
          sx={primaryButtonSx}
        >
          Create Role
        </AppButton>
      </AppStack>
    </div>
  </div>
);

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-4 gap-4">
    {stats.map((stat) => (
      <StatCard key={stat.id} stat={stat} />
    ))}
  </div>
);

const StatCard = ({ stat }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={statCardSx}
  >
    <AppStack direction="row" align="flex-start" gap={1.3}>
      <IconBox
        icon={statIcons[stat.id] || <FiShield />}
        colorVariant={stat.colorVariant}
        stat
      />

      <AppBox sx={{ minWidth: 0 }}>
        <AppText variant="body2" sx={statTitleSx}>
          {stat.title}
        </AppText>

        <AppHeading level={2} weight={700} sx={statValueSx}>
          {stat.value}
        </AppHeading>

        <AppText variant="body2" sx={statDescriptionSx}>
          {stat.description}
        </AppText>
      </AppBox>
    </AppStack>
  </AppCard>
);

const TableToolbar = ({
  filters,
  activeFilterChips,
  statusOptions,
  typeOptions,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3.5 py-3">
    <div className="grid grid-cols-[minmax(0,1fr)_128px_128px_104px] items-center gap-3">
      <AppSearchInput
        name="search"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search roles by name or description..."
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
        options={typeOptions}
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
        startIcon={<FiFilter />}
        sx={filterButtonSx}
      >
        Filters
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

const RoleTable = ({ roles, onView, onEdit, onDelete }) => (
  <div className="w-full overflow-x-auto">
    <div className="min-w-[920px]">
      <div className="grid grid-cols-[minmax(250px,1.25fr)_95px_95px_minmax(190px,1fr)_100px_70px] border-b border-border bg-surface-alt px-3.5 py-2.5">
        <HeaderCell>Role Name</HeaderCell>
        <HeaderCell>Type</HeaderCell>
        <HeaderCell>Members</HeaderCell>
        <HeaderCell>Description</HeaderCell>
        <HeaderCell>Status</HeaderCell>
        <HeaderCell align="right">Actions</HeaderCell>
      </div>

      <div className="divide-y divide-border">
        {roles.map((role) => (
          <RoleRow
            key={role._id}
            role={role}
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
    className={`text-[11.2px] font-bold leading-5 text-text-muted ${
      align === "right" ? "text-right" : "text-left"
    }`}
  >
    {children}
  </div>
);

const RoleRow = ({ role, onView, onEdit, onDelete }) => (
  <div className="grid min-h-[58px] grid-cols-[minmax(250px,1.25fr)_95px_95px_minmax(190px,1fr)_100px_70px] items-center px-3.5 py-2.5 transition hover:bg-surface-hover/60">
    <AppStack direction="row" align="center" gap={1.1} sx={{ minWidth: 0 }}>
      <IconBox icon={<FiUsers />} colorVariant="success" small />

      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={3} weight={700} sx={roleNameSx}>
          {role.displayName}
        </AppHeading>

        <AppText variant="body2" sx={roleSubtitleSx}>
          {role.displaySubtitle}
        </AppText>
      </AppBox>
    </AppStack>

    <AppTag
      label={role.displayType}
      variant="soft"
      colorVariant={typeColorMap[role.displayType] || "primary"}
      rounded="md"
      sx={typeTagSx}
    />

    <AppStack direction="row" align="center" gap={0.75}>
      <FiUsers className="text-[13px] text-text-muted" />
      <AppText variant="body2" sx={memberTextSx}>
        {role.membersCount}
      </AppText>
    </AppStack>

    <AppText variant="body2" sx={descriptionSx}>
      {role.displayDescription}
    </AppText>

    <AppStatusBadge
      status={role.displayStatus}
      label={role.displayStatus}
      variant="soft"
      size="small"
      rounded="md"
      colorVariant={statusColorMap[role.displayStatus] || "neutral"}
      sx={statusBadgeSx}
    />

    <div className="flex justify-end">
      <RoleActions
        role={role}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  </div>
);

const RoleActions = ({ role, onView, onEdit, onDelete }) => {
  const items = [
    {
      id: "view",
      label: "View Details",
      onClick: () => onView(role),
    },
    {
      id: "edit",
      label: "Edit Role",
      disabled: !role?.canEdit,
      onClick: () => onEdit(role),
    },
    { id: "divider", type: "divider" },
    {
      id: "delete",
      label: "Delete Role",
      danger: true,
      disabled: !role?.canDelete,
      onClick: () => onDelete(role),
    },
  ];

  return (
    <AppMenu
      trigger={
        <button
          type="button"
          aria-label="Role actions"
          className="inline-flex h-auto w-auto items-center justify-center border-0 bg-transparent p-0 text-text-muted shadow-none outline-none transition hover:bg-transparent hover:text-text focus:bg-transparent active:bg-transparent"
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

const TableFooter = ({ totalRoles, filteredRolesCount }) => (
  <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
    <AppText variant="body2" sx={footerTextSx}>
      Showing 1 to {filteredRolesCount} of {totalRoles} roles
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

const RightSidebar = ({ roleHelp }) => (
  <div className="space-y-4">
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={sideCardSx}
    >
      <AppStack direction="row" align="center" gap={1.2}>
        <IconBox icon={<FiUsers />} colorVariant="success" largeRound />
        <AppHeading level={3} weight={700} sx={sideTitleSx}>
          About Roles
        </AppHeading>
      </AppStack>

      <AppText variant="body2" sx={sideTextSx}>
        Roles help you to group permissions and assign them to members. Create
        custom roles based on responsibilities.
      </AppText>

      <div className="mt-4 space-y-3">
        {(roleHelp?.aboutPoints || []).map((point) => (
          <AppStack key={point} direction="row" align="center" gap={1}>
            <FiCheckCircle className="shrink-0 text-[15px] text-success" />
            <AppText variant="body2" sx={pointTextSx}>
              {point}
            </AppText>
          </AppStack>
        ))}
      </div>
    </AppCard>

    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={sideCardSx}
    >
      <AppHeading level={3} weight={700} sx={sideTitleSx}>
        Role Types
      </AppHeading>

      <div className="mt-4 space-y-4">
        <RoleTypeInfo
          label="System"
          colorVariant="info"
          description={roleHelp?.systemDescription}
        />
        <RoleTypeInfo
          label="Custom"
          colorVariant="purple"
          description={roleHelp?.customDescription}
        />
      </div>
    </AppCard>

    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={sideCardSx}
    >
      <AppStack direction="row" align="center" gap={1.2}>
        <FiHeadphones className="text-[24px] text-text-muted" />
        <AppHeading level={3} weight={700} sx={sideTitleSx}>
          Need Help?
        </AppHeading>
      </AppStack>

      <AppText variant="body2" sx={sideTextSx}>
        Learn more about roles and permissions management in PharmaERP.
      </AppText>

      <button
        type="button"
        className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-primary"
      >
        View User Guide <FiChevronRight />
      </button>
    </AppCard>
  </div>
);

const RoleTypeInfo = ({ label, colorVariant, description }) => (
  <div>
    <AppTag
      label={label}
      variant="soft"
      colorVariant={colorVariant}
      rounded="md"
      sx={typeTagSx}
    />

    <AppText variant="body2" sx={roleTypeTextSx}>
      {description}
    </AppText>
  </div>
);

const IconBox = ({
  icon,
  colorVariant = "primary",
  small = false,
  stat = false,
  largeRound = false,
}) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: largeRound ? 44 : small ? 32 : stat ? 44 : 38,
      height: largeRound ? 44 : small ? 32 : stat ? 44 : 38,
      minWidth: largeRound ? 44 : small ? 32 : stat ? 44 : 38,
      borderRadius: largeRound
        ? "999px"
        : small
          ? "9px"
          : stat
            ? "12px"
            : "11px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: largeRound ? "22px" : small ? "16px" : stat ? "22px" : "19px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const breadcrumbSx = {
  mb: 1.1,
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

const pageTitleSx = {
  m: 0,
  fontSize: "25px",
  lineHeight: 1.15,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const primaryButtonSx = {
  height: 36,
  px: 1.6,
  fontSize: "12px",
  fontWeight: 700,
};

const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const alertSx = { mt: 3 };

const statCardSx = {
  px: 1.55,
  py: 1.45,
  minHeight: 112,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const statTitleSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};

const statValueSx = {
  mt: 0.45,
  mb: 0,
  fontSize: "24px",
  lineHeight: 1.05,
  color: "var(--app-color-text)",
};

const statDescriptionSx = {
  mt: 0.75,
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const tableCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",

  "& > div": {
    minWidth: 0,
  },
};

const searchSx = { width: "100%" };
const selectSx = { width: "100%" };

const filterInputSx = {
  height: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const filterButtonSx = {
  height: 36,
  px: 1.25,
  fontSize: "12px",
  fontWeight: 650,
};

const chipsRowSx = {
  mt: 1.2,
  flexWrap: "wrap",
};

const roleNameSx = {
  m: 0,
  maxWidth: 210,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const roleSubtitleSx = {
  mt: 0.3,
  maxWidth: 250,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const typeTagSx = {
  width: "fit-content",
  height: 22,
  px: 0.8,
  fontSize: "10.5px",
  fontWeight: 700,
};

const memberTextSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const descriptionSx = {
  maxWidth: 230,
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "var(--app-color-text)",
};

const statusBadgeSx = {
  width: "fit-content",
  height: 22,
  px: 1,
  fontSize: "10.5px",
  fontWeight: 700,
  textTransform: "capitalize",
};

const footerTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const pageSizeButtonSx = {
  height: 34,
  minWidth: 122,
  px: 1.2,
  fontSize: "12px",
  fontWeight: 600,
};

const sideCardSx = {
  px: 2,
  py: 1.8,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sideTitleSx = {
  m: 0,
  fontSize: "15px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const sideTextSx = {
  mt: 1.5,
  fontSize: "12px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const pointTextSx = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const roleTypeTextSx = {
  mt: 0.9,
  fontSize: "12px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const stateSx = { minHeight: 430 };

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default RolesDesktopPage;
