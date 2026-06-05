// src/features/workspace/pages/desktop/WorkspaceMembersDesktopPage.jsx

import {
  FiArrowLeft,
  FiClock,
  FiMail,
  FiMoreVertical,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUserCheck,
  FiUserMinus,
  FiUserPlus,
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
  total: <FiUsers />,
  active: <FiUserCheck />,
  inactive: <FiClock />,
  suspended: <FiShield />,
};

const WorkspaceMembersDesktopPage = ({
  workspace,
  members = [],
  stats = [],

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

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasMembers;

  const columns = [
    {
      id: "member",
      key: "displayName",
      label: "Member",
      minWidth: 285,
      render: (_, member) => <MemberCell member={member} />,
    },
    {
      id: "contact",
      key: "contact",
      label: "Contact",
      minWidth: 240,
      render: (_, member) => <ContactCell member={member} />,
    },
    {
      id: "role",
      key: "role",
      label: "Role",
      minWidth: 160,
      render: (_, member) => (
        <AppTag
          label={member?.displayRole || "-"}
          variant="soft"
          colorVariant={member?.isOwner ? "warning" : "primary"}
          size="small"
          rounded="full"
        />
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      width: 130,
      render: (_, member) => (
        <AppStatusBadge
          status={member?.status || "inactive"}
          variant="soft"
          size="small"
          rounded="full"
        />
      ),
    },
    {
      id: "joinedAt",
      key: "createdAt",
      label: "Joined",
      width: 130,
      render: (_, member) => (
        <AppText variant="body2" sx={tableValueSx}>
          {member?.displayJoinedAt || "-"}
        </AppText>
      ),
    },
    {
      id: "lastActiveAt",
      key: "lastActiveAt",
      label: "Last Active",
      width: 165,
      render: (_, member) => (
        <AppText variant="body2" sx={tableValueSx}>
          {member?.displayLastActiveAt || "-"}
        </AppText>
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 150,
      render: (_, member) => (
        <MemberActions
          member={member}
          onChangeStatus={handleChangeMemberStatus}
          onRemove={handleRemoveMember}
        />
      ),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          workspace={workspace}
          isLoading={isLoading}
          onBack={handleBackToWorkspace}
          onRefresh={handleRefresh}
          onInvite={handleInviteMember}
          onViewInvitations={handleViewInvitations}
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
            <AppTableSkeleton rows={6} columns={7} showHeader={false} />
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
              minWidth={1260}
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
  workspace,
  isLoading,
  onBack,
  onRefresh,
  onInvite,
  onViewInvitations,
}) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiUsers />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Workspace Members
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Workspace", onClick: onBack },
            { label: workspace?.name || "Members", current: true },
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
        Workspace
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
        onClick={onViewInvitations}
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
        onClick={onInvite}
        sx={primaryButtonSx}
      >
        Invite Member
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
        icon={statIcons[stat.id] || <FiUsers />}
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
  roleOptions,
  totalMembers,
  filteredMembersCount,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3 py-2.5">
    <div className="grid grid-cols-[minmax(220px,1fr)_minmax(600px,auto)] items-center gap-5">
      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={650} sx={sectionTitleSx}>
          Member Directory
        </AppHeading>

        <AppText variant="body2" sx={sectionSubtitleSx}>
          Showing {filteredMembersCount} of {totalMembers} members
        </AppText>
      </AppBox>

      <div className="grid min-w-[600px] grid-cols-[minmax(280px,1fr)_145px_145px] items-center gap-3 justify-self-end">
        <AppSearchInput
          name="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search member, email, phone, role..."
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
  <AppStack direction="row" align="center" gap={1.1}>
    <Avatar name={member?.displayName} />

    <AppBox sx={{ minWidth: 0 }}>
      <AppStack direction="row" align="center" gap={0.7}>
        <AppHeading level={3} weight={650} sx={memberNameSx}>
          {member?.displayName || "-"}
        </AppHeading>

        {member?.isOwner ? (
          <AppTag
            label="Owner"
            variant="soft"
            colorVariant="warning"
            size="small"
            rounded="full"
          />
        ) : null}
      </AppStack>

      <AppText variant="body2" sx={memberMetaSx}>
        Member ID: {member?._id || "-"}
      </AppText>
    </AppBox>
  </AppStack>
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

const MemberActions = ({ member, onChangeStatus, onRemove }) => {
  const isOwner = Boolean(member?.isOwner);

  const items = [
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
    { id: "divider", type: "divider" },
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
    <AppStack direction="row" align="center" justify="flex-end" gap={0.45}>
      <AppMenu
        trigger={
          <AppIconButton
            icon={<FiMoreVertical />}
            tooltip={isOwner ? "Owner cannot be modified" : "Member actions"}
            variant="soft"
            colorVariant="neutral"
            size="small"
            rounded="md"
          />
        }
        items={items}
        dense
        minWidth={190}
      />
    </AppStack>
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
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-bold text-primary">
      {initials || "M"}
    </span>
  );
};

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
      bgcolor: `var(--app-color-${colorVariant}-soft)`,
      color: `var(--app-color-${colorVariant})`,
      fontSize: large ? "21px" : "19px",
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

const memberNameSx = {
  m: 0,
  maxWidth: 180,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const memberMetaSx = {
  mt: 0.35,
  maxWidth: 225,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
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

const stateSx = {
  minHeight: 330,
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default WorkspaceMembersDesktopPage;
