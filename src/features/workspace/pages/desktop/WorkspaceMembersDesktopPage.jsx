// src/features/workspace/pages/desktop/WorkspaceMembersDesktopPage.jsx

import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiKey,
  FiMail,
  FiMapPin,
  FiMoreHorizontal,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUserCheck,
  FiUserMinus,
  FiUserPlus,
  FiUsers,
  FiX,
  FiZap,
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
  AppStatCard,
  AppStatusBadge,
  AppTable,
  AppTableSkeleton,
  AppTag,
  AppText,
  AppEmptyState,
  AppErrorState,
  HELP_SUPPORT_CARD,
  PageRightSidebar,
} from "@/components";

const statIcons = {
  total: <FiUsers />,
  active: <FiUserCheck />,
  inactive: <FiClock />,
  suspended: <FiShield />,
};

const WorkspaceMembersDesktopPage = ({
  workspace,
  members = [],
  stats = [],
  memberHelp,

  filters,
  activeFilterChips = [],
  statusOptions = [],
  roleOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalMembers = 0,
  filteredMembersCount = 0,
  hasMembers,
  hasFilteredMembers,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleRefresh,
  handleInviteMember,
  handleViewInvitations,
  handleBackToWorkspace,
  handleChangeMemberStatus,
  handleRemoveMember,
  handleManageAccess,
  handleOpenResetPassword,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasMembers;

  const columns = [
    {
      id: "member",
      key: "displayName",
      label: "Member",
      minWidth: 280,
      render: (_, member) => <MemberCell member={member} />,
    },
    {
      id: "contact",
      key: "contact",
      label: "Contact Information",
      minWidth: 240,
      render: (_, member) => <ContactCell member={member} />,
    },
    {
      id: "role",
      key: "role",
      label: "Workspace Role",
      minWidth: 160,
      render: (_, member) => (
        <AppTag
          label={member?.displayRole || "-"}
          variant="soft"
          colorVariant={member?.isOwner ? "warning" : "primary"}
          size="small"
          rounded="md"
          sx={roleTagSx}
        />
      ),
    },
    {
      id: "joinedAt",
      key: "createdAt",
      label: "Joined Date",
      minWidth: 140,
      render: (_, member) => (
        <AppText variant="body2" sx={tableValueSx}>
          {member?.displayJoinedAt || "-"}
        </AppText>
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      width: 120,
      render: (_, member) => (
        <AppStatusBadge
          status={member?.status || "inactive"}
          label={member?.status || "inactive"}
          variant="soft"
          size="small"
          rounded="md"
          colorVariant={
            member?.status === "active"
              ? "success"
              : member?.status === "suspended"
                ? "error"
                : "neutral"
          }
          sx={statusBadgeSx}
        />
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 70,
      render: (_, member) => (
        <MemberActions
          member={member}
          onChangeStatus={handleChangeMemberStatus}
          onRemove={handleRemoveMember}
          onManageAccess={handleManageAccess}
          onResetPassword={handleOpenResetPassword}
        />
      ),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Workspace Members"
          subtitle="Manage your team members, workspace roles and control account access."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Workspace", onClick: handleBackToWorkspace },
                { label: workspace?.name || "Members", current: true },
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
                startIcon={<FiArrowLeft />}
                onClick={handleBackToWorkspace}
                sx={secondaryButtonSx}
              >
                Workspace
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
                colorVariant="primary"
                rounded="md"
                size="small"
                onClick={handleViewInvitations}
                sx={secondaryButtonSx}
              >
                Invitations
              </AppButton>

              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<FiUserPlus />}
                onClick={handleInviteMember}
                sx={primaryButtonSx}
              >
                Invite Member
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
                roleOptions={roleOptions}
                totalMembers={totalMembers}
                filteredMembersCount={filteredMembersCount}
                handleFilterChange={handleFilterChange}
                handleSearchChange={handleSearchChange}
                handleRemoveFilter={handleRemoveFilter}
                handleClearFilters={handleClearFilters}
              />

              {hasError ? (
                <AppErrorState
                  title="Unable to load workspace members"
                  description={error || "Please refresh and try again."}
                  actionText="Refresh"
                  onRetry={handleRefresh}
                  size="page"
                  sx={stateSx}
                />
              ) : showInitialSkeleton ? (
                <AppTableSkeleton rows={8} columns={6} showHeader={false} />
              ) : !hasMembers ? (
                <AppEmptyState
                  title="No members yet"
                  description="Invite team members to collaborate in this workspace."
                  icon={<FiUsers />}
                  action={
                    <AppButton
                      variant="contained"
                      colorVariant="primary"
                      rounded="md"
                      startIcon={<FiUserPlus />}
                      onClick={handleInviteMember}
                      sx={primaryButtonSx}
                    >
                      Invite Member
                    </AppButton>
                  }
                  size="page"
                  sx={stateSx}
                />
              ) : !hasFilteredMembers ? (
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
                      sx={secondaryButtonSx}
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
                  rows={members}
                  getRowId={(row) => row._id}
                  dense
                  bordered={false}
                  rounded={false}
                  hover
                  stickyHeader
                  minWidth={1050}
                  maxHeight="calc(100vh - 315px)"
                  sx={tableSx}
                  headSx={tableHeadSx}
                  cellSx={tableCellSx}
                />
              )}
            </AppCard>
          </div>

          <WorkspaceMembersRightSidebar memberHelp={memberHelp} />
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

const PageHeader = ({
  title,
  subtitle,
  extra,
  actions,
  align,
  justify,
  sx,
  contentSx,
}) => (
  <AppBox
    display="flex"
    alignItems={align || "flex-start"}
    justifyContent={justify || "space-between"}
    sx={{ width: "100%", ...sx }}
  >
    <AppBox sx={contentSx}>
      <AppHeading level={1} weight={650}>
        {title}
      </AppHeading>
      {subtitle ? (
        <AppText variant="body2" sx={pageHeaderSubtitleSx}>
          {subtitle}
        </AppText>
      ) : null}
      {extra}
    </AppBox>
    {actions}
  </AppBox>
);

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-4 gap-4">
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
  roleOptions,
  totalMembers,
  filteredMembersCount,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3.5 py-3">
    <div className="grid grid-cols-[minmax(0,1fr)_128px_128px] items-center gap-3">
      <AppSearchInput
        name="search"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search members by name, email or status..."
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
        name="role"
        value={filters.role}
        onChange={handleFilterChange}
        options={roleOptions}
        size="small"
        variant="bordered"
        rounded="md"
        sx={selectSx}
        inputSx={filterInputSx}
      />
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

const MemberCell = ({ member }) => (
  // Added h-full and items-center to ensure the layout centers perfectly vertically
  <div className="flex items-center gap-3 min-w-0 h-full">
    <div className="flex items-center justify-center shrink-0">
      <Avatar name={member?.displayName} />
    </div>

    <div className="flex flex-col min-w-0 justify-center">
      <AppStack direction="row" align="center" gap={0.7}>
        <AppHeading level={3} weight={700} sx={memberNameSx}>
          {member?.displayName || "-"}
        </AppHeading>

        {member?.isOwner ? (
          <AppTag
            label="Owner"
            variant="soft"
            colorVariant="warning"
            size="small"
            rounded="md"
            sx={roleTagSx}
          />
        ) : null}
      </AppStack>
    </div>
  </div>
);
const ContactCell = ({ member }) => (
  <AppBox sx={{ minWidth: 0 }}>
    <AppKeyValue
      icon={<FiMail />}
      label="Email"
      value={member?.displayEmail || "-"}
      dense
      sx={keyValueSx}
      labelSx={keyLabelSx}
      valueSx={keyTextSx}
    />

    <AppKeyValue
      icon={<FiUserCheck />}
      label="Phone"
      value={member?.displayPhone || "-"}
      dense
      sx={keyValueSx}
      labelSx={keyLabelSx}
      valueSx={keyTextSx}
    />
  </AppBox>
);

const MemberActions = ({
  member,
  onChangeStatus,
  onRemove,
  onManageAccess,
  onResetPassword,
}) => {
  const isOwner = Boolean(member?.isOwner);

  const items = [
    {
      id: "access",
      label: "Store & Role Access",
      icon: <FiMapPin />,
      disabled: isOwner,
      onClick: () => onManageAccess?.(member),
    },
    {
      id: "reset-password",
      label: "Reset Password / PIN",
      icon: <FiKey />,
      disabled: isOwner,
      onClick: () => onResetPassword?.(member),
    },
    { id: "divider-1", type: "divider" },
    {
      id: "active",
      label: "Mark Active",
      icon: <FiUserCheck />,
      disabled: isOwner || member?.status === "active",
      onClick: () => onChangeStatus(member, "active"),
    },
    {
      id: "inactive",
      label: "Mark Inactive",
      icon: <FiClock />,
      disabled: isOwner || member?.status === "inactive",
      onClick: () => onChangeStatus(member, "inactive"),
    },
    {
      id: "suspended",
      label: "Suspend Member",
      icon: <FiShield />,
      disabled: isOwner || member?.status === "suspended",
      onClick: () => onChangeStatus(member, "suspended"),
    },
    { id: "divider-2", type: "divider" },
    {
      id: "remove",
      label: "Remove Member",
      icon: <FiUserMinus />,
      danger: true,
      disabled: isOwner,
      onClick: () => onRemove(member),
    },
  ];

  return (
    <AppMenu
      trigger={
        <button
          type="button"
          aria-label="Member actions"
          className="inline-flex h-auto w-auto items-center justify-center border-0 bg-transparent p-0 text-text-muted shadow-none outline-none transition hover:bg-transparent hover:text-text focus:bg-transparent active:bg-transparent"
        >
          <FiMoreHorizontal className="text-[18px]" />
        </button>
      }
      items={items}
      dense
      minWidth={180}
    />
  );
};

const WorkspaceMembersRightSidebar = ({ memberHelp }) => (
  <PageRightSidebar
    spacing={4}
    cards={[
      {
        title: "About Workspace",
        icon: <FiUsers />,
        colorVariant: "success",
        variant: "default",
        description:
          "Manage access tiers, tracking profiles and verify operational states for staff inside your dashboard directory.",
        points: memberHelp?.aboutPoints || [
          "Assign custom security profiles",
          "Provision access rights securely",
          "Track operations audit changes",
          "Enforce platform permissions",
        ],
        pointIcon: <FiCheckCircle />,
        pointIconVariant: "check",
      },
      {
        title: "Security Measures",
        icon: <FiZap />,
        colorVariant: "primary",
        variant: "soft",
        soft: true,
        points: [
          "Audit workspace rosters monthly",
          "Apply minimum access logic",
          "Audit deactivated user tokens",
          "Enforce modern authentication",
        ],
        pointIcon: <FiZap />,
        pointIconVariant: "zap",
      },
      {
        title: "Workspace Directory Info",
        icon: null,
        colorVariant: "info",
        variant: "default",
        custom: (
          <div className="space-y-4">
            <div>
              <AppTag
                label="Primary Owner"
                variant="soft"
                colorVariant="warning"
                rounded="md"
                sx={roleTagSx}
              />
              <AppText variant="body2" sx={sidebarInfoTextSx}>
                Holds complete business platform orchestration control rights.
                Max 1 per workspace entity.
              </AppText>
            </div>
            <div>
              <AppTag
                label="Standard Users"
                variant="soft"
                colorVariant="primary"
                rounded="md"
                sx={roleTagSx}
              />
              <AppText variant="body2" sx={sidebarInfoTextSx}>
                Assigned limited operational profiles tailored strictly around
                clear department boundaries.
              </AppText>
            </div>
          </div>
        ),
      },
      HELP_SUPPORT_CARD,
    ]}
  />
);

const Avatar = ({ name }) => {
  const initials = String(name || "M")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[12px] font-bold text-primary">
      {initials || "M"}
    </span>
  );
};

const IconBox = ({
  icon,
  colorVariant = "primary",
  large = false,
  small = false,
  stat = false,
}) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 48 : small ? 32 : stat ? 38 : 44,
      height: large ? 48 : small ? 32 : stat ? 38 : 44,
      minWidth: large ? 48 : small ? 32 : stat ? 38 : 44,
      borderRadius: large ? "14px" : small ? "9px" : stat ? "11px" : "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "34px" : small ? "16px" : stat ? "19px" : "22px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const pageHeaderSx = {
  width: "100%",
};

const pageHeaderSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
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

const statCardSx = {
  minHeight: 96,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
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
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  "& > div": {
    minWidth: 0,
  },
};

const searchSx = {
  width: "100%",
};

const selectSx = {
  width: "100%",
};

const filterInputSx = {
  height: 36,
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
    // Applies hidden scrollbar styling engine to the underlying Material-UI wrapper container
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE / Edge
    "&::-webkit-scrollbar": {
      display: "none", // Chrome / Safari / Webkit
    },
  },
};

const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
  "& .MuiTableCell-root": {
    fontSize: "11.2px",
    fontWeight: 750,
    color: "var(--app-color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
};

const tableCellSx = {
  py: 1.2,
  fontSize: "12px",
  borderColor: "var(--app-color-border)",
};

const tableValueSx = {
  fontSize: "12px",
  fontWeight: 550,
  color: "var(--app-color-text)",
};

const memberNameSx = {
  m: 0,
  maxWidth: 210,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const memberMetaSx = {
  mt: 0.3,
  maxWidth: 250,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const roleTagSx = {
  width: "fit-content",
  height: 22,
  px: 0.8,
  fontSize: "10.5px",
  fontWeight: 700,
};

const statusBadgeSx = {
  width: "fit-content",
  height: 22,
  px: 1,
  fontSize: "10.5px",
  fontWeight: 700,
  textTransform: "capitalize",
};

const keyValueSx = {
  mb: 0.35,
  alignItems: "center",
  gap: 0.7,
  "& svg": {
    color: "var(--app-color-primary)",
    fontSize: "12px",
  },
};

const keyLabelSx = {
  minWidth: 42,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const keyTextSx = {
  maxWidth: 160,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11.5px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const sidebarInfoTextSx = {
  mt: 0.9,
  fontSize: "12px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const stateSx = {
  minHeight: 430,
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default WorkspaceMembersDesktopPage;
