// src/features/workspace/pages/desktop/WorkspaceInvitationsDesktopPage.jsx

import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiUserPlus,
  FiUsers,
  FiX,
  FiXCircle,
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
  AppSearchInput,
  AppSelect,
  AppStack,
  AppTable,
  AppTableSkeleton,
  AppTag,
  AppText,
  AppEmptyState,
  AppErrorState,
} from "@/components";

const statIcons = {
  total: <FiSend />,
  pending: <FiClock />,
  accepted: <FiCheckCircle />,
  expired: <FiXCircle />,
};

const statusColorMap = {
  pending: "warning",
  accepted: "success",
  cancelled: "error",
  expired: "error",
};

const WorkspaceInvitationsDesktopPage = ({
  workspace,
  invitations = [],
  stats = [],

  filters,
  activeFilterChips = [],
  statusOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalInvitations = 0,
  filteredInvitationsCount = 0,
  hasInvitations,
  hasFilteredInvitations,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleRefresh,
  handleInviteMember,
  handleViewMembers,
  handleBackToWorkspace,
  handleCancelInvitation,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasInvitations;

  const columns = [
    {
      id: "invitation",
      key: "invitedEmail",
      label: "Invitation",
      minWidth: 285,
      render: (_, invitation) => <InvitationCell invitation={invitation} />,
    },
    {
      id: "role",
      key: "role",
      label: "Role",
      minWidth: 150,
      render: (_, invitation) => (
        <AppTag
          label={invitation?.displayRole || "Staff"}
          variant="soft"
          colorVariant="primary"
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
      render: (_, invitation) => (
        <AppTag
          label={invitation?.effectiveStatus || "pending"}
          variant="soft"
          colorVariant={
            statusColorMap[invitation?.effectiveStatus] || "neutral"
          }
          size="small"
          rounded="full"
        />
      ),
    },
    {
      id: "invitedBy",
      key: "invitedBy",
      label: "Invited By",
      minWidth: 190,
      render: (_, invitation) => (
        <AppText variant="body2" sx={tableValueSx}>
          {invitation?.displayInvitedBy || "-"}
        </AppText>
      ),
    },
    {
      id: "createdAt",
      key: "createdAt",
      label: "Created",
      width: 125,
      render: (_, invitation) => (
        <AppText variant="body2" sx={tableValueSx}>
          {invitation?.displayCreatedAt || "-"}
        </AppText>
      ),
    },
    {
      id: "expiresAt",
      key: "expiresAt",
      label: "Expires At",
      width: 170,
      render: (_, invitation) => (
        <AppText variant="body2" sx={tableValueSx}>
          {invitation?.displayExpiresAt || "-"}
        </AppText>
      ),
    },
    {
      id: "activity",
      key: "activity",
      label: "Activity",
      minWidth: 215,
      render: (_, invitation) => <ActivityCell invitation={invitation} />,
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 105,
      render: (_, invitation) => (
        <AppIconButton
          icon={<FiXCircle />}
          tooltip="Cancel invitation"
          variant="soft"
          colorVariant="error"
          size="small"
          rounded="md"
          disabled={invitation?.effectiveStatus !== "pending"}
          onClick={() => handleCancelInvitation(invitation)}
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
          onViewMembers={handleViewMembers}
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
            totalInvitations={totalInvitations}
            filteredInvitationsCount={filteredInvitationsCount}
            handleFilterChange={handleFilterChange}
            handleSearchChange={handleSearchChange}
            handleRemoveFilter={handleRemoveFilter}
            handleClearFilters={handleClearFilters}
          />

          {hasError ? (
            <AppErrorState
              title="Unable to load invitations"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          ) : showInitialSkeleton ? (
            <AppTableSkeleton rows={6} columns={8} showHeader={false} />
          ) : !hasInvitations ? (
            <AppEmptyState
              title="No invitations yet"
              description="Invite workspace members to share access with your team."
              icon={<FiSend />}
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
          ) : !hasFilteredInvitations ? (
            <AppEmptyState
              title="No invitations found"
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
              rows={invitations}
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
  workspace,
  isLoading,
  onBack,
  onRefresh,
  onInvite,
  onViewMembers,
}) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiSend />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Workspace Invitations
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Workspace", onClick: onBack },
            { label: workspace?.name || "Invitations", current: true },
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
        startIcon={<FiUsers />}
        onClick={onViewMembers}
        sx={secondaryButtonSx}
      >
        Members
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
        icon={statIcons[stat.id] || <FiSend />}
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
  totalInvitations,
  filteredInvitationsCount,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3 py-2.5">
    <div className="grid grid-cols-[minmax(220px,1fr)_minmax(470px,auto)] items-center gap-5">
      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={650} sx={sectionTitleSx}>
          Invitation Directory
        </AppHeading>

        <AppText variant="body2" sx={sectionSubtitleSx}>
          Showing {filteredInvitationsCount} of {totalInvitations} invitations
        </AppText>
      </AppBox>

      <div className="grid min-w-[470px] grid-cols-[minmax(280px,1fr)_155px] items-center gap-3 justify-self-end">
        <AppSearchInput
          name="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search email, role, inviter..."
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

const InvitationCell = ({ invitation }) => (
  <AppStack direction="row" align="center" gap={1.1}>
    <Avatar value={invitation?.displayEmail} />

    <AppBox sx={{ minWidth: 0 }}>
      <AppStack direction="row" align="center" gap={0.7}>
        <AppText variant="body2" weight={700} sx={primaryTextSx}>
          {invitation?.displayEmail || "-"}
        </AppText>

        {invitation?.notes ? (
          <AppTag
            label="Notes"
            variant="soft"
            colorVariant="info"
            size="small"
            rounded="full"
          />
        ) : null}
      </AppStack>

      <AppText variant="body2" sx={mutedTextSx}>
        Sent on {invitation?.displayCreatedAt || "-"}
      </AppText>
    </AppBox>
  </AppStack>
);

const ActivityCell = ({ invitation }) => {
  if (invitation?.effectiveStatus === "accepted") {
    return (
      <AppKeyValue
        label={`Accepted by ${invitation?.displayAcceptedBy || "-"}`}
        value={invitation?.displayAcceptedAt || "-"}
        direction="column"
        size="small"
        sx={keyValueSx}
      />
    );
  }

  if (invitation?.effectiveStatus === "cancelled") {
    return (
      <AppKeyValue
        label={`Cancelled by ${invitation?.displayCancelledBy || "-"}`}
        value={invitation?.displayCancelledAt || "-"}
        direction="column"
        size="small"
        sx={keyValueSx}
      />
    );
  }

  if (invitation?.effectiveStatus === "expired") {
    return (
      <AppTag
        label="Invitation expired"
        variant="soft"
        colorVariant="error"
        size="small"
        rounded="full"
      />
    );
  }

  return (
    <AppTag
      label="Waiting for response"
      variant="soft"
      colorVariant="warning"
      size="small"
      rounded="full"
    />
  );
};

const Avatar = ({ value }) => {
  const initials = String(value || "I")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-bold text-primary">
      {initials || "I"}
    </div>
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
      fontSize: large ? "22px" : "19px",
    }}
  >
    {icon}
  </AppBox>
);

const pageTitleSx = {
  m: 0,
  fontSize: "24px",
  lineHeight: 1.18,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = {
  mt: 0.35,
};

const breadcrumbItemSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "11.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const primaryButtonSx = {
  height: 34,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 750,
};

const secondaryButtonSx = {
  height: 34,
  px: 1.25,
  fontSize: "12px",
  fontWeight: 700,
};

const statCardSx = {
  px: 1.6,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const statTitleSx = {
  fontSize: "11.6px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
};

const statValueSx = {
  mt: 0.25,
  mb: 0,
  fontSize: "24px",
  lineHeight: 1,
  color: "var(--app-color-text)",
};

const statDescriptionSx = {
  mt: 0.45,
  fontSize: "11.2px",
  color: "var(--app-color-text-muted)",
};

const alertSx = {
  mt: 2,
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
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.3,
  fontSize: "11.8px",
  color: "var(--app-color-text-muted)",
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
  "& .MuiTableRow-root": {
    verticalAlign: "top",
  },
};

const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
  "& .MuiTableCell-root": {
    fontSize: "11px",
    fontWeight: 800,
    color: "var(--app-color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
};

const tableCellSx = {
  py: 1.05,
  borderColor: "var(--app-color-border)",
};

const tableValueSx = {
  fontSize: "12.2px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const primaryTextSx = {
  maxWidth: 210,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.8px",
  color: "var(--app-color-text)",
};

const mutedTextSx = {
  mt: 0.25,
  fontSize: "11.3px",
  color: "var(--app-color-text-muted)",
};

const keyValueSx = {
  "& .AppKeyValue-label": {
    fontSize: "11px",
    color: "var(--app-color-text-muted)",
  },
  "& .AppKeyValue-value": {
    fontSize: "12px",
    fontWeight: 650,
    color: "var(--app-color-text)",
  },
};

const stateSx = {
  minHeight: 360,
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default WorkspaceInvitationsDesktopPage;
