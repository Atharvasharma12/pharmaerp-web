import {
  FiArrowLeft,
  FiCheckCircle,
  FiEdit3,
  FiEye,
  FiKey,
  FiLock,
  FiMoreVertical,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiSliders,
  FiTrash2,
  FiUnlock,
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
  AppIconButton,
  AppKeyValue,
  AppMenu,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppTable,
  AppTableSkeleton,
  AppTag,
  AppText,
  AppEmptyState,
  AppErrorState,
} from "@/components";

const statIcons = {
  total: <FiShield />,
  active: <FiCheckCircle />,
  system: <FiLock />,
  custom: <FiUnlock />,
};

const statusColorMap = {
  active: "success",
  inactive: "warning",
};

const RolesDesktopPage = ({
  roles = [],
  stats = [],

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
  handleViewPermissions,
  handleViewRole,
  handleEditRole,
  handleDeleteRole,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasRoles;

  const columns = [
    {
      id: "role",
      key: "displayName",
      label: "Role",
      minWidth: 285,
      render: (_, role) => <RoleCell role={role} />,
    },
    {
      id: "permissions",
      key: "permissions",
      label: "Permissions",
      minWidth: 300,
      render: (_, role) => <PermissionCell role={role} />,
    },
    {
      id: "type",
      key: "isSystem",
      label: "Type",
      width: 135,
      render: (_, role) => (
        <AppTag
          label={role?.displayType || "Custom"}
          variant="soft"
          colorVariant={role?.isSystem ? "info" : "primary"}
          size="small"
          rounded="full"
          icon={role?.isSystem ? <FiLock /> : <FiUnlock />}
        />
      ),
    },
    {
      id: "editable",
      key: "isEditable",
      label: "Editable",
      width: 130,
      render: (_, role) => (
        <AppTag
          label={role?.displayEditable || "Locked"}
          variant="soft"
          colorVariant={role?.isEditable ? "success" : "neutral"}
          size="small"
          rounded="full"
        />
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      width: 120,
      render: (_, role) => (
        <AppStatusBadge
          status={role?.displayStatus || "inactive"}
          label={role?.displayStatus || "inactive"}
          variant="soft"
          size="small"
          rounded="full"
          colorVariant={statusColorMap[role?.displayStatus] || "neutral"}
        />
      ),
    },
    {
      id: "createdAt",
      key: "createdAt",
      label: "Created",
      width: 125,
      render: (_, role) => (
        <AppText variant="body2" sx={tableValueSx}>
          {role?.displayCreatedAt || "-"}
        </AppText>
      ),
    },
    {
      id: "updatedAt",
      key: "updatedAt",
      label: "Updated",
      width: 165,
      render: (_, role) => (
        <AppText variant="body2" sx={tableValueSx}>
          {role?.displayUpdatedAt || "-"}
        </AppText>
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 105,
      render: (_, role) => (
        <RoleActions
          role={role}
          onView={handleViewRole}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />
      ),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          isLoading={isLoading}
          onBack={handleBackToAccessControl}
          onRefresh={handleRefresh}
          onCreate={handleCreateRole}
          onViewPermissions={handleViewPermissions}
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
          sx={tableCardSx}
        >
          <TableHeader
            filters={filters}
            activeFilterChips={activeFilterChips}
            statusOptions={statusOptions}
            typeOptions={typeOptions}
            totalRoles={totalRoles}
            filteredRolesCount={filteredRolesCount}
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
            <AppTableSkeleton rows={7} columns={8} showHeader={false} />
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
            <AppTable
              columns={columns}
              rows={roles}
              getRowId={(row) => row._id}
              dense
              bordered={false}
              rounded={false}
              hover
              stickyHeader
              minWidth={1280}
              maxHeight="calc(100vh - 315px)"
              sx={tableSx}
              headSx={tableHeadSx}
              cellSx={tableCellSx}
            />
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
  onCreate,
  onViewPermissions,
}) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiShield />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Roles
        </AppHeading>

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
        startIcon={<FiKey />}
        onClick={onViewPermissions}
        sx={secondaryButtonSx}
      >
        Permissions
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
        icon={statIcons[stat.id] || <FiShield />}
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

const TableHeader = ({
  filters,
  activeFilterChips,
  statusOptions,
  typeOptions,
  totalRoles,
  filteredRolesCount,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3 py-2.5">
    <div className="grid grid-cols-[minmax(220px,1fr)_minmax(600px,auto)] items-center gap-5">
      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={650} sx={sectionTitleSx}>
          Role Directory
        </AppHeading>

        <AppText variant="body2" sx={sectionSubtitleSx}>
          Showing {filteredRolesCount} of {totalRoles} roles
        </AppText>
      </AppBox>

      <div className="grid min-w-[600px] grid-cols-[minmax(280px,1fr)_145px_145px] items-center gap-3 justify-self-end">
        <AppSearchInput
          name="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search role, code, permission..."
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

const RoleCell = ({ role }) => (
  <AppStack direction="row" align="center" gap={1.1}>
    <IconAvatar isSystem={role?.isSystem} />

    <AppBox sx={{ minWidth: 0 }}>
      <AppStack direction="row" align="center" gap={0.7}>
        <AppHeading level={3} weight={650} sx={roleNameSx}>
          {role?.displayName || "-"}
        </AppHeading>

        {role?.isSystem ? (
          <AppTag
            label="System"
            variant="soft"
            colorVariant="info"
            size="small"
            rounded="full"
          />
        ) : null}
      </AppStack>

      <AppKeyValue
        label="Code"
        value={role?.displayCode || "-"}
        dense
        sx={codeKeyValueSx}
        labelSx={codeLabelSx}
        valueSx={codeValueSx}
      />

      <AppText variant="body2" sx={descriptionSx}>
        {role?.displayDescription || "No description added."}
      </AppText>
    </AppBox>
  </AppStack>
);

const PermissionCell = ({ role }) => {
  if (!role?.permissionCount) {
    return (
      <AppTag
        label="No permissions"
        variant="soft"
        colorVariant="neutral"
        size="small"
        rounded="full"
      />
    );
  }

  const remainingCount = Math.max(
    0,
    role.permissionCount - role.permissionPreview.length,
  );

  return (
    <AppBox sx={{ minWidth: 0 }}>
      <AppText variant="body2" sx={permissionCountSx}>
        {role.permissionCount} permission{role.permissionCount === 1 ? "" : "s"}
      </AppText>

      <AppStack direction="row" align="center" gap={0.55} sx={permissionTagsSx}>
        {role.permissionPreview.map((permission) => (
          <AppTag
            key={permission}
            label={permission}
            variant="soft"
            colorVariant="primary"
            size="small"
            rounded="full"
          />
        ))}

        {remainingCount ? (
          <AppTag
            label={`+${remainingCount}`}
            variant="soft"
            colorVariant="neutral"
            size="small"
            rounded="full"
          />
        ) : null}
      </AppStack>
    </AppBox>
  );
};

const RoleActions = ({ role, onView, onEdit, onDelete }) => {
  const items = [
    {
      id: "view",
      label: "View Details",
      icon: <FiEye />,
      onClick: () => onView(role),
    },
    {
      id: "edit",
      label: "Edit Role",
      icon: <FiEdit3 />,
      disabled: !role?.canEdit,
      onClick: () => onEdit(role),
    },
    { id: "divider", type: "divider" },
    {
      id: "delete",
      label: "Delete Role",
      icon: <FiTrash2 />,
      danger: true,
      disabled: !role?.canDelete,
      onClick: () => onDelete(role),
    },
  ];

  return (
    <AppStack direction="row" align="center" justify="flex-end" gap={0.45}>
      <AppMenu
        trigger={
          <AppIconButton
            icon={<FiMoreVertical />}
            tooltip="Role actions"
            variant="soft"
            colorVariant="neutral"
            size="small"
            rounded="md"
          />
        }
        items={items}
        dense
        minWidth={180}
      />
    </AppStack>
  );
};

const IconAvatar = ({ isSystem }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[15px] font-bold text-primary">
    {isSystem ? <FiLock /> : <FiUsers />}
  </span>
);

const IconBox = ({ icon, colorVariant = "primary", large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 42 : 38,
      height: large ? 42 : 38,
      minWidth: large ? 42 : 38,
      borderRadius: "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "22px" : "19px",
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

const tableCardSx = {
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

const tableSx = {
  "& .MuiTableContainer-root": {
    borderRadius: 0,
  },
};

const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
  "& .MuiTableCell-root": {
    fontSize: "11px",
    fontWeight: 750,
    color: "var(--app-color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
};

const tableCellSx = {
  py: 1,
  fontSize: "12px",
  borderColor: "var(--app-color-border)",
};

const tableValueSx = {
  fontSize: "12px",
  fontWeight: 550,
  color: "var(--app-color-text)",
};

const roleNameSx = {
  m: 0,
  maxWidth: 180,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const codeKeyValueSx = {
  mt: 0.35,
  mb: 0,
  alignItems: "center",
  gap: 0.6,
};

const codeLabelSx = {
  minWidth: 32,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const codeValueSx = {
  maxWidth: 160,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const descriptionSx = {
  mt: 0.35,
  maxWidth: 245,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
};

const permissionCountSx = {
  fontSize: "11.8px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const permissionTagsSx = {
  mt: 0.6,
  maxWidth: 270,
  flexWrap: "wrap",
};

const stateSx = {
  minHeight: 340,
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default RolesDesktopPage;
