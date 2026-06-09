// src/features/access-control/pages/desktop/RoleDetailsDesktopPage.jsx

import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiEdit2,
  FiEye,
  FiMoreHorizontal,
  FiPlus,
  FiShield,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppErrorState,
  AppHeading,
  AppStack,
  AppStatCard,
  AppStatusBadge,
  AppTag,
  AppText,
  PageHeader,
  PageRightSidebar,
} from "@/components";

const dummyRole = {
  _id: "dummy-pharmacist",
  displayName: "Pharmacist",
  name: "Pharmacist",
  displayDescription: "Manage medicines, prescriptions and inventory",
  description: "Manage medicines, prescriptions and inventory",
  displayType: "System Role",
  displayStatus: "active",
  displayCreatedBy: "Admin",
  displayCreatedAt: "28 May 2024, 10:30 AM",
  displayUpdatedAt: "28 May 2024, 04:15 PM",
  displayUpdatedBy: "Admin",
  workspaceName: "MedPlus Pharmacy",
  companiesScope: "All Companies",
  branchesScope: "All Branches",
  membersCount: 8,
  permissionCount: 24,
  totalPermissionCount: 48,
  canEdit: false,
  permissions: [
    "dashboard.view",
    "dashboard.export",
    "company.view",
    "company.create",
    "company.update",
    "company.export",
    "branch.view",
    "branch.create",
    "branch.update",
    "inventory.view",
    "inventory.create",
    "inventory.update",
    "inventory.export",
    "sales.view",
    "sales.create",
    "sales.export",
  ],
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const permissionModules = [
  {
    id: "dashboard",
    title: "Dashboard",
    access: "View, Export",
    count: 2,
    total: 6,
  },
  {
    id: "companies",
    title: "Companies",
    access: "View, Create, Edit, Export",
    count: 4,
    total: 6,
  },
  {
    id: "branches",
    title: "Branches",
    access: "View, Create, Edit",
    count: 3,
    total: 6,
  },
  {
    id: "inventory",
    title: "Inventory",
    access: "View, Create, Edit, Export",
    count: 4,
    total: 6,
  },
  {
    id: "sales",
    title: "Sales (POS)",
    access: "View, Create, Export",
    count: 3,
    total: 6,
  },
];

const members = ["RV", "SK", "AM", "NP", "JT"];

const recentActivity = [
  { title: "Role updated", meta: "by Admin • 28 May 2024, 04:15 PM" },
  { title: "Permissions updated", meta: "by Admin • 28 May 2024, 11:20 AM" },
  { title: "Role created", meta: "by Admin • 28 May 2024, 10:30 AM" },
];

const RoleDetailsDesktopPage = ({
  role,
  isLoading,
  hasError,
  error,
  message,
  handleRefresh,
  handleBackToRoles,
  handleBackToAccessControl,
  handleEditRole,
  handleViewPermissions,
  clearMessage,
}) => {
  const displayRole = role || dummyRole;
  const permissionStats = getPermissionStats(displayRole);

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Role Details"
          subtitle="View role information, permissions and assigned members."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Access Control", onClick: handleBackToAccessControl },
                { label: "Roles", onClick: handleBackToRoles },
                { label: "Role Details", current: true },
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
                startIcon={<FiEdit2 />}
                onClick={handleEditRole}
                disabled={!displayRole?.canEdit}
                sx={secondaryButtonSx}
              >
                Edit Role
              </AppButton>

              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                endIcon={<FiMoreHorizontal />}
                onClick={handleRefresh}
                sx={moreButtonSx}
              >
                More
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
              title="Unable to load role"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          </AppCard>
        ) : isLoading && !role ? (
          <DetailsSkeleton />
        ) : (
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_320px] items-start gap-5">
            <main className="min-w-0 space-y-5">
              <HeroCard role={displayRole} />
              <Tabs role={displayRole} />
              <OverviewCard
                role={displayRole}
                permissionStats={permissionStats}
                onViewPermissions={handleViewPermissions}
              />
            </main>

            <RoleDetailsRightSidebar role={displayRole} />
          </div>
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

const HeroCard = ({ role }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={heroCardSx}
  >
    <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 p-5">
      <IconBox icon={<FiUsers />} colorVariant="success" large />

      <div className="min-w-0">
        <AppStack direction="row" align="center" gap={1}>
          <AppHeading level={2} weight={750} sx={heroTitleSx}>
            {role.displayName}
          </AppHeading>

          <AppStatusBadge
            status={role.displayStatus}
            label={formatStatus(role.displayStatus)}
            variant="soft"
            size="small"
            rounded="md"
            colorVariant={statusColorMap[role.displayStatus] || "success"}
            sx={statusBadgeSx}
          />
        </AppStack>

        <AppText variant="body2" sx={heroSubtitleSx}>
          {role.displayDescription}
        </AppText>

        <div className="mt-4 grid grid-cols-4 gap-5">
          <MetaItem
            label="Role Type"
            value={
              <AppTag
                label={role.displayType || "System Role"}
                variant="soft"
                colorVariant="purple"
                rounded="md"
                sx={smallTagSx}
              />
            }
          />

          <MetaItem
            label="Created By"
            value={role.displayCreatedBy || "Admin"}
          />

          <MetaItem
            label="Created On"
            value={role.displayCreatedAt || "28 May 2024, 10:30 AM"}
          />

          <MetaItem
            label="Last Updated"
            value={role.displayUpdatedAt || "28 May 2024, 04:15 PM"}
          />
        </div>
      </div>
    </div>
  </AppCard>
);

const Tabs = ({ role }) => (
  <div className="flex items-center gap-10 border-b border-border">
    {[
      "Overview",
      `Permissions (${role.permissionCount || 24})`,
      `Members (${role.membersCount || 8})`,
      "Access Scope",
      "Activity Log",
    ].map((tab, index) => (
      <button
        key={tab}
        type="button"
        className={`relative px-0 pb-3 text-[13px] font-bold ${
          index === 0 ? "text-primary" : "text-text"
        }`}
      >
        {tab}
        {index === 0 ? (
          <span className="absolute bottom-[-1px] left-0 h-0.5 w-full rounded-full bg-primary" />
        ) : null}
      </button>
    ))}
  </div>
);

const OverviewCard = ({ role, permissionStats, onViewPermissions }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={mainCardSx}
  >
    <section className="p-5">
      <AppHeading level={2} weight={750} sx={sectionTitleSx}>
        Role Information
      </AppHeading>

      <div className="mt-4 grid grid-cols-3 gap-x-12 gap-y-4">
        <InfoPair label="Role Name" value={role.displayName} />
        <InfoPair label="Description" value={role.displayDescription} />
        <InfoPair label="" value="" />

        <InfoPair label="Role Type" value={role.displayType || "System Role"} />
        <InfoPair label="Created By" value={role.displayCreatedBy || "Admin"} />
        <InfoPair
          label="Last Updated By"
          value={role.displayUpdatedBy || "Admin"}
        />

        <InfoPair
          label="Status"
          value={
            <AppStatusBadge
              status={role.displayStatus}
              label={formatStatus(role.displayStatus)}
              variant="soft"
              size="small"
              rounded="md"
              colorVariant={statusColorMap[role.displayStatus] || "success"}
              sx={statusBadgeSx}
            />
          }
        />

        <InfoPair
          label="Created On"
          value={role.displayCreatedAt || "28 May 2024, 10:30 AM"}
        />
      </div>
    </section>

    <section className="border-t border-border p-5">
      <AppHeading level={2} weight={750} sx={sectionTitleSx}>
        Permissions Summary
      </AppHeading>

      <div className="mt-4 grid grid-cols-6 gap-3">
        {permissionStats.map((stat) => (
          <AppStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            colorVariant={stat.colorVariant}
            variant="default"
            sx={permissionStatCardSx}
            iconSx={permissionStatIconSx}
          />
        ))}
      </div>

      <AppHeading level={2} weight={750} sx={topModuleTitleSx}>
        Top Module Access
      </AppHeading>

      <ModuleTable />

      <div className="mt-4 flex justify-center">
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          endIcon={<FiArrowRight />}
          onClick={onViewPermissions}
          sx={viewAllButtonSx}
        >
          View All Permissions
        </AppButton>
      </div>
    </section>
  </AppCard>
);

const ModuleTable = () => (
  <div className="mt-3 overflow-hidden rounded-lg border border-border">
    <div className="grid grid-cols-[190px_minmax(0,1fr)_210px_120px] bg-surface-alt px-3 py-2.5 text-[11px] font-bold text-text-muted">
      <span>Module</span>
      <span>Access Level</span>
      <span>Permissions</span>
      <span className="text-right">Actions</span>
    </div>

    {permissionModules.map((module) => (
      <div
        key={module.id}
        className="grid grid-cols-[190px_minmax(0,1fr)_210px_120px] items-center border-t border-border px-3 py-2.5"
      >
        <AppStack direction="row" align="center" gap={1}>
          <IconBox icon={<FiShield />} colorVariant="success" tiny />

          <AppText variant="body2" sx={moduleTitleSx}>
            {module.title}
          </AppText>
        </AppStack>

        <AppText variant="body2" sx={moduleAccessSx}>
          {module.access}
        </AppText>

        <div className="grid grid-cols-[1fr_38px] items-center gap-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(module.count / module.total) * 100}%` }}
            />
          </div>

          <span className="text-[12px] font-semibold text-text-muted">
            {module.count} / {module.total}
          </span>
        </div>

        <div className="flex justify-end">
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            sx={tableButtonSx}
          >
            View Details
          </AppButton>
        </div>
      </div>
    ))}
  </div>
);

const RoleDetailsRightSidebar = ({ role }) => (
  <PageRightSidebar
    spacing={4}
    cards={[
      {
        title: "Role Summary",
        icon: <FiUsers />,
        colorVariant: "success",
        variant: "default",
        custom: <RoleSummaryContent role={role} />,
      },
      {
        title: "Assigned Members",
        icon: <FiUsers />,
        colorVariant: "info",
        variant: "default",
        custom: <AssignedMembersContent role={role} />,
      },
      {
        title: "Recent Activity",
        icon: <FiActivity />,
        colorVariant: "neutral",
        variant: "default",
        custom: <RecentActivityContent />,
      },
    ]}
  />
);

const RoleSummaryContent = ({ role }) => (
  <div className="space-y-3">
    <SummaryItem label="Role Name" value={role.displayName} />

    <SummaryItem
      label="Role Type"
      value={
        <AppTag
          label={role.displayType || "System Role"}
          variant="soft"
          colorVariant="purple"
          rounded="md"
          sx={smallTagSx}
        />
      }
    />

    <SummaryItem
      label="Status"
      value={
        <AppStatusBadge
          status={role.displayStatus}
          label={formatStatus(role.displayStatus)}
          variant="soft"
          size="small"
          rounded="md"
          colorVariant={statusColorMap[role.displayStatus] || "success"}
          sx={statusBadgeSx}
        />
      }
    />

    <SummaryItem label="Description" value={role.displayDescription} />

    <div className="border-t border-border pt-4">
      <SummaryItem
        label="Total Permissions"
        value={
          <span className="text-[18px] font-semibold text-text">
            {role.permissionCount || 24} / {role.totalPermissionCount || 48}
          </span>
        }
      />

      <SummaryItem
        label="Total Members"
        value={
          <span className="inline-flex items-center gap-2">
            <FiUsers /> {role.membersCount || 8}
          </span>
        }
      />

      <AppText variant="body2" sx={summaryLabelSx}>
        Access Scope
      </AppText>

      <div className="mt-3 space-y-2">
        <SummaryLine
          label="Workspace"
          value={role.workspaceName || "MedPlus Pharmacy"}
        />
        <SummaryLine
          label="Companies"
          value={role.companiesScope || "All Companies"}
        />
        <SummaryLine
          label="Branches"
          value={role.branchesScope || "All Branches"}
        />
      </div>
    </div>
  </div>
);

const AssignedMembersContent = ({ role }) => (
  <div>
    <div className="mb-4 flex items-center justify-end text-[11px] font-semibold text-text-muted">
      {role.membersCount || 8} Members
    </div>

    <div className="flex items-center gap-3">
      {members.map((member) => (
        <span
          key={member}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-alt text-[12px] font-bold text-text"
        >
          {member}
        </span>
      ))}

      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-alt text-[12px] font-bold text-text-muted">
        +3
      </span>
    </div>

    <button
      type="button"
      className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-primary"
    >
      View All Members <FiArrowRight />
    </button>
  </div>
);

const RecentActivityContent = () => (
  <div>
    <div className="mb-4 flex items-center justify-end text-[11px] font-semibold text-text-muted">
      View All
    </div>

    <div className="space-y-4">
      {recentActivity.map((activity) => (
        <AppStack
          key={activity.title}
          direction="row"
          align="flex-start"
          gap={1.2}
        >
          <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-border text-success">
            <FiCheckCircle className="text-[12px]" />
          </span>

          <div>
            <AppHeading level={4} weight={700} sx={activityTitleSx}>
              {activity.title}
            </AppHeading>

            <AppText variant="body2" sx={activityMetaSx}>
              {activity.meta}
            </AppText>
          </div>
        </AppStack>
      ))}
    </div>
  </div>
);

const MetaItem = ({ label, value }) => (
  <div>
    <AppText variant="body2" sx={metaLabelSx}>
      {label}
    </AppText>

    <AppBox sx={metaValueSx}>{value}</AppBox>
  </div>
);

const InfoPair = ({ label, value }) =>
  label ? (
    <div>
      <AppText variant="body2" sx={infoLabelSx}>
        {label}
      </AppText>

      <AppBox sx={infoValueSx}>{value}</AppBox>
    </div>
  ) : (
    <span />
  );

const SummaryItem = ({ label, value }) => (
  <div>
    <AppText variant="body2" sx={summaryLabelSx}>
      {label}
    </AppText>

    <AppBox sx={summaryValueSx}>{value}</AppBox>
  </div>
);

const SummaryLine = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[12px] font-bold text-text">{label}</span>
    <span className="text-right text-[12px] text-text-muted">{value}</span>
  </div>
);

const DetailsSkeleton = () => (
  <div className="mt-4 h-[560px] animate-pulse rounded-xl border border-border bg-surface" />
);

const IconBox = ({
  icon,
  colorVariant = "primary",
  large = false,
  tiny = false,
}) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 56 : tiny ? 24 : 40,
      height: large ? 56 : tiny ? 24 : 40,
      minWidth: large ? 56 : tiny ? 24 : 40,
      borderRadius: large ? "12px" : tiny ? "7px" : "10px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "26px" : tiny ? "13px" : "19px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const getPermissionStats = (role) => {
  const permissions = Array.isArray(role?.permissions) ? role.permissions : [];

  const viewCount = countPermissions(permissions, ["view"]);
  const createCount = countPermissions(permissions, ["create", "add"]);
  const editCount = countPermissions(permissions, ["edit", "update"]);
  const deleteCount = countPermissions(permissions, ["delete", "remove"]);
  const exportCount = countPermissions(permissions, ["export", "download"]);

  const totalPermissionCount =
    Number(role?.totalPermissionCount) || Math.max(permissions.length, 48);

  return [
    {
      id: "total",
      title: "Total Permissions",
      value: totalPermissionCount,
      subtitle: "All permissions",
      icon: <FiShield />,
      colorVariant: "success",
    },
    {
      id: "view",
      title: "View",
      value: viewCount || 16,
      subtitle: getPercentText(viewCount || 16, totalPermissionCount),
      icon: <FiEye />,
      colorVariant: "info",
    },
    {
      id: "create",
      title: "Create",
      value: createCount || 12,
      subtitle: getPercentText(createCount || 12, totalPermissionCount),
      icon: <FiPlus />,
      colorVariant: "purple",
    },
    {
      id: "edit",
      title: "Edit",
      value: editCount || 10,
      subtitle: getPercentText(editCount || 10, totalPermissionCount),
      icon: <FiEdit2 />,
      colorVariant: "warning",
    },
    {
      id: "delete",
      title: "Delete",
      value: deleteCount || 6,
      subtitle: getPercentText(deleteCount || 6, totalPermissionCount),
      icon: <FiTrash2 />,
      colorVariant: "danger",
    },
    {
      id: "export",
      title: "Export",
      value: exportCount || 4,
      subtitle: getPercentText(exportCount || 4, totalPermissionCount),
      icon: <FiDownload />,
      colorVariant: "info",
    },
  ];
};

const countPermissions = (permissions, keywords) =>
  permissions.filter((permission) => {
    const normalized = String(permission || "").toLowerCase();

    return keywords.some((keyword) => normalized.includes(keyword));
  }).length;

const getPercentText = (value, total) => {
  if (!total) return "0.00% of total";

  return `${((Number(value) / Number(total)) * 100).toFixed(2)}% of total`;
};

const formatStatus = (status) => {
  if (!status) return "Active";

  return String(status).charAt(0).toUpperCase() + String(status).slice(1);
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
  mt: 1,
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
  minWidth: 104,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const moreButtonSx = {
  ...secondaryButtonSx,
  minWidth: 90,
};

const alertSx = {
  mt: 3,
};

const stateCardSx = {
  mt: 4,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const stateSx = {
  minHeight: 420,
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

const heroCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const heroTitleSx = {
  m: 0,
  fontSize: "20px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const heroSubtitleSx = {
  mt: 1,
  fontSize: "13px",
  color: "var(--app-color-text-muted)",
};

const metaLabelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
};

const metaValueSx = {
  mt: 0.5,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const mainCardSx = {
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "15px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const infoLabelSx = {
  fontSize: "12px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const infoValueSx = {
  mt: 1,
  fontSize: "13px",
  lineHeight: "22px",
  color: "var(--app-color-text-muted)",
};

const smallTagSx = {
  width: "fit-content",
  height: 22,
  px: 0.85,
  fontSize: "10.5px",
  fontWeight: 750,
};

const statusBadgeSx = {
  width: "fit-content",
  height: 22,
  px: 0.8,
  fontSize: "10.5px",
  fontWeight: 750,
  textTransform: "capitalize",
};

const topModuleTitleSx = {
  mt: 4,
  mb: 0,
  fontSize: "15px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const permissionStatCardSx = {
  minHeight: 74,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  p: 1.25,

  "& .MuiCardContent-root": {
    p: 0,
  },

  "& p:first-of-type": {
    fontSize: "11px",
  },

  "& h1, & h2, & h3, & h4, & h5, & h6": {
    fontSize: "18px",
  },

  "& p:last-of-type": {
    fontSize: "10.5px",
  },
};

const permissionStatIconSx = {
  width: 34,
  height: 34,
  minWidth: 34,
  borderRadius: "9px",

  "& svg": {
    fontSize: 17,
  },
};

const moduleTitleSx = {
  fontSize: "12px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const moduleAccessSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const tableButtonSx = {
  height: 27,
  px: 1.1,
  fontSize: "11px",
  fontWeight: 650,
};

const viewAllButtonSx = {
  height: 36,
  minWidth: 178,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 700,
};

const summaryLabelSx = {
  fontSize: "12px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const summaryValueSx = {
  mt: 0.65,
  fontSize: "12px",
  lineHeight: "19px",
  color: "var(--app-color-text-muted)",
};

const activityTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const activityMetaSx = {
  mt: 0.3,
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

export default RoleDetailsDesktopPage;
