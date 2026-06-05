import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiGrid,
  FiKey,
  FiLayers,
  FiLock,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiSliders,
  FiUsers,
  FiX,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppKeyValue,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppTableSkeleton,
  AppTag,
  AppText,
  AppEmptyState,
  AppErrorState,
} from "@/components";

const statIcons = {
  total: <FiKey />,
  modules: <FiLayers />,
  view: <FiEye />,
  manage: <FiSliders />,
};

const actionColorMap = {
  view: "success",
  create: "primary",
  manage: "warning",
  delete: "error",
  other: "neutral",
};

const actionIconMap = {
  view: <FiEye />,
  create: <FiCheckCircle />,
  manage: <FiSliders />,
  delete: <FiLock />,
  other: <FiKey />,
};

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
  handleViewRoles,
  handleViewMemberAccess,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasPermissions;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          isLoading={isLoading}
          onBack={handleBackToAccessControl}
          onRefresh={handleRefresh}
          onViewRoles={handleViewRoles}
          onViewMemberAccess={handleViewMemberAccess}
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

        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={contentCardSx}
        >
          <PermissionHeader
            filters={filters}
            activeFilterChips={activeFilterChips}
            moduleOptions={moduleOptions}
            totalPermissions={totalPermissions}
            filteredPermissionsCount={filteredPermissionsCount}
            totalModules={totalModules}
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
            <PermissionSkeleton />
          ) : !hasPermissions ? (
            <AppEmptyState
              title="No permissions available"
              description="Refresh to load permissions configured by the backend."
              icon={<FiKey />}
              action={
                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  startIcon={<FiRefreshCw />}
                  onClick={handleRefresh}
                >
                  Refresh Permissions
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : !hasFilteredPermissions ? (
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
            <PermissionGroups groups={permissionGroups} />
          )}
        </AppCard>
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

const PageHeader = ({
  isLoading,
  onBack,
  onRefresh,
  onViewRoles,
  onViewMemberAccess,
}) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiKey />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Permissions
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Access Control", onClick: onBack },
            { label: "Permissions", current: true },
          ]}
          sx={breadcrumbSx}
          itemSx={breadcrumbItemSx}
          currentItemSx={breadcrumbCurrentSx}
        />
      </AppBox>
    </AppStack>

    <AppStack direction="row" align="center" gap={0.8}>
      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiArrowLeft />}
        onClick={onBack}
        sx={secondaryButtonSx}
      >
        Access Control
      </AppButton>

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiRefreshCw />}
        onClick={onRefresh}
        loading={isLoading}
        disabled={isLoading}
        sx={secondaryButtonSx}
      >
        Refresh
      </AppButton>

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiShield />}
        onClick={onViewRoles}
        sx={secondaryButtonSx}
      >
        Roles
      </AppButton>

      <AppButton
        type="button"
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiUsers />}
        onClick={onViewMemberAccess}
        sx={primaryButtonSx}
      >
        Member Access
      </AppButton>
    </AppStack>
  </AppStack>
);

const StatsGrid = ({ stats }) => (
  <div className="mt-4 grid grid-cols-4 gap-3">
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
    <AppStack direction="row" align="flex-start" gap={1.1}>
      <IconBox
        icon={statIcons[stat.id] || <FiKey />}
        colorVariant={stat.colorVariant}
      />

      <AppBox sx={{ minWidth: 0 }}>
        <AppText variant="body2" sx={statTitleSx}>
          {stat.title}
        </AppText>

        <AppHeading level={2} weight={650} sx={statValueSx}>
          {stat.value}
        </AppHeading>

        <AppText variant="body2" sx={statDescriptionSx}>
          {stat.description}
        </AppText>
      </AppBox>
    </AppStack>
  </AppCard>
);

const PermissionHeader = ({
  filters,
  activeFilterChips,
  moduleOptions,
  totalPermissions,
  filteredPermissionsCount,
  totalModules,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3 py-2.5">
    <div className="grid grid-cols-[minmax(220px,1fr)_minmax(470px,auto)] items-center gap-5">
      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={650} sx={sectionTitleSx}>
          Permission Catalog
        </AppHeading>

        <AppText variant="body2" sx={sectionSubtitleSx}>
          Showing {filteredPermissionsCount} of {totalPermissions} permissions
          across {totalModules} modules
        </AppText>
      </AppBox>

      <div className="grid min-w-[470px] grid-cols-[minmax(280px,1fr)_165px] items-center gap-3 justify-self-end">
        <AppSearchInput
          name="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search permission, action, module..."
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
          options={moduleOptions}
          size="small"
          variant="bordered"
          rounded="md"
          sx={selectSx}
          inputSx={filterInputSx}
        />
      </div>
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
            <FiX className="text-[12px]" />
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

const PermissionSkeleton = () => (
  <div className="p-3">
    <AppTableSkeleton rows={7} columns={4} showHeader={false} />
  </div>
);

const PermissionGroups = ({ groups }) => (
  <div className="grid grid-cols-2 gap-3 p-3 xl:grid-cols-3">
    {groups.map((group) => (
      <PermissionGroupCard key={group.id} group={group} />
    ))}
  </div>
);

const PermissionGroupCard = ({ group }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={groupCardSx}
  >
    <AppStack direction="row" align="center" justify="space-between" gap={1}>
      <AppStack direction="row" align="center" gap={1} sx={{ minWidth: 0 }}>
        <IconBox icon={<FiGrid />} small />

        <AppBox sx={{ minWidth: 0 }}>
          <AppHeading level={3} weight={650} sx={groupTitleSx}>
            {group.displayModule}
          </AppHeading>

          <AppText variant="body2" sx={groupSubtitleSx}>
            {group.permissions.length} permission
            {group.permissions.length === 1 ? "" : "s"}
          </AppText>
        </AppBox>
      </AppStack>

      <AppTag
        label={group.moduleKey}
        variant="soft"
        colorVariant="neutral"
        size="small"
        rounded="full"
      />
    </AppStack>

    <div className="mt-3 space-y-1.5">
      {group.permissions.map((permission) => (
        <PermissionItem key={permission.id} permission={permission} />
      ))}
    </div>
  </AppCard>
);

const PermissionItem = ({ permission }) => (
  <div className="rounded-lg border border-border bg-surface-alt px-2.5 py-2">
    <AppStack
      direction="row"
      align="flex-start"
      justify="space-between"
      gap={1}
    >
      <AppBox sx={{ minWidth: 0 }}>
        <AppText variant="body2" sx={permissionNameSx}>
          {permission.displayPermission}
        </AppText>

        <AppKeyValue
          label="Key"
          value={permission.value}
          dense
          sx={keyValueSx}
          labelSx={keyLabelSx}
          valueSx={keyTextSx}
        />
      </AppBox>

      <AppTag
        label={permission.actionType}
        variant="soft"
        colorVariant={actionColorMap[permission.actionType] || "neutral"}
        size="small"
        rounded="full"
        icon={actionIconMap[permission.actionType] || <FiKey />}
      />
    </AppStack>
  </div>
);

const IconBox = ({
  icon,
  colorVariant = "primary",
  large = false,
  small = false,
}) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 42 : small ? 32 : 38,
      height: large ? 42 : small ? 32 : 38,
      minWidth: large ? 42 : small ? 32 : 38,
      borderRadius: small ? "10px" : "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "22px" : small ? "16px" : "19px",
    }}
  >
    {icon}
  </AppBox>
);

const pageTitleSx = {
  m: 0,
  fontSize: "25px",
  lineHeight: 1.18,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = {
  mt: 0.4,
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

const primaryButtonSx = {
  height: 34,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 700,
};

const secondaryButtonSx = {
  height: 34,
  px: 1.35,
  fontSize: "12px",
  fontWeight: 650,
};

const statCardSx = {
  px: 1.45,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const statTitleSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};

const statValueSx = {
  mt: 0.25,
  mb: 0,
  fontSize: "25px",
  lineHeight: 1.05,
  color: "var(--app-color-text)",
};

const statDescriptionSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const alertSx = {
  mt: 3,
};

const contentCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "16px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.35,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const searchSx = {
  width: "100%",
};

const selectSx = {
  width: "100%",
};

const filterInputSx = {
  height: 35,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const chipsRowSx = {
  mt: 1.2,
  flexWrap: "wrap",
};

const groupCardSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const groupTitleSx = {
  m: 0,
  maxWidth: 190,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "13.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const groupSubtitleSx = {
  mt: 0.25,
  fontSize: "11.2px",
  color: "var(--app-color-text-muted)",
};

const permissionNameSx = {
  maxWidth: 250,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.2px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const keyValueSx = {
  mt: 0.35,
  mb: 0,
  alignItems: "center",
  gap: 0.55,
};

const keyLabelSx = {
  minWidth: 24,
  fontSize: "10.4px",
  color: "var(--app-color-text-muted)",
};

const keyTextSx = {
  maxWidth: 225,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "10.8px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};

const stateSx = {
  minHeight: 360,
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default PermissionDesktopPage;
