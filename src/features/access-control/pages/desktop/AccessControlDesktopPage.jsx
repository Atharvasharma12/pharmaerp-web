import {
  FiArrowRight,
  FiCheckCircle,
  FiGitBranch,
  FiKey,
  FiLock,
  FiRefreshCw,
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
  AppKeyValue,
  AppStack,
  AppTableSkeleton,
  AppTag,
  AppText,
} from "@/components";

const statIcons = {
  roles: <FiShield />,
  permissions: <FiKey />,
  systemRoles: <FiLock />,
  memberAccess: <FiUsers />,
};

const moduleIcons = {
  roles: <FiShield />,
  permissions: <FiKey />,
  memberAccess: <FiGitBranch />,
};

const statusColorMap = {
  active: "success",
  inactive: "warning",
};

const formatRoleName = (role) => {
  const roleName = role?.name || role?.title || role?.code;

  if (!roleName) return "-";

  return String(roleName)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatPermissionLabel = (value) =>
  String(value || "")
    .replace(/[.:_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const AccessControlDesktopPage = ({
  stats = [],
  accessModules = [],
  recentRoles = [],
  permissionGroups = [],

  permissions = [],

  isLoading,
  hasError,
  error,
  message,

  hasRoles,
  hasPermissions,

  handleRefresh,
  handleCreateRole,
  handleViewRoles,
  handleViewPermissions,
  handleViewMemberAccess,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasRoles && !hasPermissions;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onCreateRole={handleCreateRole}
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

        {hasError ? (
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={stateCardSx}
          >
            <AppErrorState
              title="Unable to load access control"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          </AppCard>
        ) : showInitialSkeleton ? (
          <div className="mt-3 grid grid-cols-[1fr_390px] gap-3">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={sectionCardSx}
            >
              <AppTableSkeleton rows={5} columns={3} showHeader={false} />
            </AppCard>

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={sectionCardSx}
            >
              <AppTableSkeleton rows={5} columns={2} showHeader={false} />
            </AppCard>
          </div>
        ) : (
          <>
            <ModuleGrid
              accessModules={accessModules}
              onViewRoles={handleViewRoles}
              onViewPermissions={handleViewPermissions}
              onViewMemberAccess={handleViewMemberAccess}
            />

            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_390px] gap-3">
              <RecentRolesCard
                roles={recentRoles}
                hasRoles={hasRoles}
                onCreateRole={handleCreateRole}
                onViewRoles={handleViewRoles}
              />

              <PermissionOverviewCard
                permissions={permissions}
                permissionGroups={permissionGroups}
                hasPermissions={hasPermissions}
                onViewPermissions={handleViewPermissions}
              />
            </div>
          </>
        )}
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

const PageHeader = ({ isLoading, onRefresh, onCreateRole }) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiSliders />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Access Control
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Access Control", current: true },
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
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiShield />}
        onClick={onCreateRole}
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
        icon={statIcons[stat.id] || <FiSliders />}
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

const ModuleGrid = ({ accessModules = [] }) => (
  <div className="mt-3 grid grid-cols-3 gap-3">
    {accessModules.map((item) => (
      <ModuleCard key={item.id} item={item} />
    ))}
  </div>
);

const ModuleCard = ({ item }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={moduleCardSx}
  >
    <AppStack
      direction="row"
      align="flex-start"
      justify="space-between"
      gap={1.2}
    >
      <IconBox
        icon={moduleIcons[item.id] || <FiSliders />}
        colorVariant={item.colorVariant}
        large
      />

      <AppTag
        label={`${item.stat} ${item.statLabel}`}
        variant="soft"
        colorVariant={item.colorVariant}
        size="small"
        rounded="full"
      />
    </AppStack>

    <AppHeading level={2} weight={650} sx={moduleTitleSx}>
      {item.title}
    </AppHeading>

    <AppText variant="body2" sx={moduleDescriptionSx}>
      {item.description}
    </AppText>

    <AppButton
      type="button"
      variant="soft"
      colorVariant={item.colorVariant}
      rounded="md"
      size="small"
      endIcon={<FiArrowRight />}
      onClick={item.onClick}
      sx={moduleButtonSx}
    >
      {item.actionText}
    </AppButton>
  </AppCard>
);

const RecentRolesCard = ({
  roles = [],
  hasRoles,
  onCreateRole,
  onViewRoles,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sectionCardSx}
  >
    <SectionHeader
      title="Recent Roles"
      subtitle="Latest workspace roles from access control."
      action={
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="primary"
          rounded="md"
          size="small"
          onClick={onViewRoles}
          sx={sectionActionSx}
        >
          View All
        </AppButton>
      }
    />

    {!hasRoles ? (
      <AppEmptyState
        title="No roles found"
        description="Create custom roles or initialize system roles for this workspace."
        icon={<FiShield />}
        action={
          <AppButton
            type="button"
            variant="contained"
            colorVariant="primary"
            rounded="md"
            size="small"
            onClick={onCreateRole}
          >
            Create Role
          </AppButton>
        }
        size="medium"
        sx={compactStateSx}
      />
    ) : (
      <div className="mt-3 divide-y divide-border">
        {roles.map((role) => (
          <RoleRow key={role?._id || role?.code} role={role} />
        ))}
      </div>
    )}
  </AppCard>
);

const RoleRow = ({ role }) => (
  <div className="grid grid-cols-[minmax(0,1fr)_120px_110px] items-center gap-3 py-2.5">
    <AppStack direction="row" align="center" gap={1} sx={{ minWidth: 0 }}>
      <IconBox
        icon={role?.isSystem ? <FiLock /> : <FiShield />}
        colorVariant={role?.isSystem ? "warning" : "primary"}
        small
      />

      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={3} weight={650} sx={roleTitleSx}>
          {formatRoleName(role)}
        </AppHeading>

        <AppText variant="body2" sx={roleSubtitleSx}>
          {role?.code || "-"}
        </AppText>
      </AppBox>
    </AppStack>

    <AppTag
      label={role?.isSystem ? "System" : "Custom"}
      variant="soft"
      colorVariant={role?.isSystem ? "warning" : "info"}
      size="small"
      rounded="full"
    />

    <AppTag
      label={role?.status || "inactive"}
      variant="soft"
      colorVariant={statusColorMap[role?.status] || "neutral"}
      size="small"
      rounded="full"
    />
  </div>
);

const PermissionOverviewCard = ({
  permissions = [],
  permissionGroups = [],
  hasPermissions,
  onViewPermissions,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sectionCardSx}
  >
    <SectionHeader
      title="Permission Overview"
      subtitle="Permission groups available for role setup."
      action={
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="primary"
          rounded="md"
          size="small"
          onClick={onViewPermissions}
          sx={sectionActionSx}
        >
          Catalog
        </AppButton>
      }
    />

    {!hasPermissions ? (
      <AppEmptyState
        title="No permissions found"
        description="Permissions are loaded from the backend access-control catalog."
        icon={<FiKey />}
        size="medium"
        sx={compactStateSx}
      />
    ) : (
      <>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {permissionGroups.map((group) => (
            <AppCard
              key={group.id}
              variant="soft"
              rounded="lg"
              bordered
              shadow="none"
              padding="none"
              sx={permissionGroupCardSx}
            >
              <AppKeyValue
                label={group.title || "General"}
                value={`${group.count} permissions`}
                direction="column"
                size="small"
                sx={permissionKeyValueSx}
              />
            </AppCard>
          ))}
        </div>

        <AppStack
          direction="row"
          align="center"
          gap={0.7}
          sx={permissionHintSx}
        >
          <FiCheckCircle className="text-[13px] text-success" />

          <AppText variant="body2" sx={hintTextSx}>
            {permissions.length} permission keys are ready to assign to roles.
          </AppText>
        </AppStack>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {permissions.slice(0, 8).map((permission) => (
            <AppTag
              key={permission}
              label={formatPermissionLabel(permission)}
              variant="soft"
              colorVariant="neutral"
              size="small"
              rounded="full"
            />
          ))}
        </div>
      </>
    )}
  </AppCard>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <AppStack
    direction="row"
    align="flex-start"
    justify="space-between"
    gap={1.5}
  >
    <AppBox sx={{ minWidth: 0 }}>
      <AppHeading level={2} weight={650} sx={sectionTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={sectionSubtitleSx}>
        {subtitle}
      </AppText>
    </AppBox>

    {action}
  </AppStack>
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
      borderRadius: large ? "12px" : small ? "9px" : "11px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "22px" : small ? "16px" : "19px",
      lineHeight: 0,
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

const stateCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const stateSx = {
  minHeight: 390,
};

const compactStateSx = {
  minHeight: 250,
};

const moduleCardSx = {
  p: 2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const moduleTitleSx = {
  mt: 1.6,
  mb: 0,
  fontSize: "15px",
  color: "var(--app-color-text)",
};

const moduleDescriptionSx = {
  mt: 0.45,
  minHeight: 38,
  fontSize: "11.7px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const moduleButtonSx = {
  mt: 1.5,
  height: 32,
  px: 1.2,
  fontSize: "11.7px",
  fontWeight: 700,
};

const sectionCardSx = {
  p: 2,
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

const sectionActionSx = {
  height: 30,
  px: 1.2,
  fontSize: "11.5px",
  fontWeight: 700,
};

const roleTitleSx = {
  m: 0,
  maxWidth: 260,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const roleSubtitleSx = {
  mt: 0.25,
  maxWidth: 260,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
};

const permissionGroupCardSx = {
  px: 1.2,
  py: 1,
  bgcolor: "var(--app-color-surface-alt)",
  borderColor: "var(--app-color-border)",
};

const permissionKeyValueSx = {
  "& .AppKeyValue-label": {
    fontSize: "11px",
    color: "var(--app-color-text-muted)",
  },
  "& .AppKeyValue-value": {
    mt: 0.25,
    fontSize: "12.2px",
    fontWeight: 700,
    color: "var(--app-color-text)",
  },
};

const permissionHintSx = {
  mt: 1.4,
};

const hintTextSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default AccessControlDesktopPage;
