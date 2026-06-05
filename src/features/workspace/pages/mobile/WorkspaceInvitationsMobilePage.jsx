// src/features/workspace/pages/mobile/WorkspaceInvitationsMobilePage.jsx

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
  AppBadge,
  AppBox,
  AppButton,
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppHeading,
  AppIconButton,
  AppKeyValue,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
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

const WorkspaceInvitationsMobilePage = ({
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

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_8%,transparent),transparent_36%)]" />

      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <AppBox sx={sectionSx}>
        <AppStack
          direction="row"
          align="center"
          justify="space-between"
          gap={1}
        >
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            startIcon={<FiArrowLeft />}
            onClick={handleBackToWorkspace}
            sx={backButtonSx}
          >
            Workspace
          </AppButton>

          <AppStack direction="row" align="center" gap={0.75}>
            <AppIconButton
              icon={<FiRefreshCw />}
              tooltip="Refresh"
              size="small"
              rounded="md"
              variant="soft"
              colorVariant="neutral"
              loading={isLoading}
              disabled={isLoading}
              onClick={handleRefresh}
              sx={headerIconButtonSx}
            />

            <AppButton
              type="button"
              variant="contained"
              colorVariant="primary"
              rounded="md"
              startIcon={<FiUserPlus />}
              onClick={handleInviteMember}
              sx={inviteButtonSx}
            >
              Invite
            </AppButton>
          </AppStack>
        </AppStack>

        <AppBox sx={headerSx}>
          <AppBox sx={headerBadgeSx}>
            <FiSend />
            <span>Invitations</span>
          </AppBox>

          <AppHeading level={1} weight={800} align="center" sx={titleSx}>
            Workspace Invitations
          </AppHeading>

          <AppText variant="body2" align="center" weight={600} sx={subtitleSx}>
            {workspace?.name
              ? `Manage invitations for ${workspace.name}.`
              : "Manage member invitations for your workspace."}
          </AppText>
        </AppBox>

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

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
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={filterCardSx}
        >
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0 }}>
              <AppHeading level={2} weight={750} sx={sectionTitleSx}>
                Invitation Directory
              </AppHeading>

              <AppText variant="body2" weight={500} sx={sectionSubtitleSx}>
                Showing {filteredInvitationsCount} of {totalInvitations}
              </AppText>
            </AppBox>

            <AppButton
              type="button"
              variant="outlined"
              colorVariant="primary"
              rounded="md"
              startIcon={<FiUsers />}
              onClick={handleViewMembers}
              sx={membersButtonSx}
            >
              Members
            </AppButton>
          </AppStack>

          <AppStack direction="column" gap={1} sx={{ mt: 1.2 }}>
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
          </AppStack>

          {activeFilterChips.length ? (
            <AppStack direction="row" align="center" gap={0.65} sx={chipsRowSx}>
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => handleRemoveFilter(chip.key)}
                  className="inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-surface-alt px-2 py-1 text-[10.8px] font-bold text-text-muted"
                >
                  <span className="max-w-[210px] truncate">{chip.label}</span>
                  <FiX className="shrink-0 text-[12px]" />
                </button>
              ))}

              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[10.8px] font-extrabold text-primary"
              >
                Clear all
              </button>
            </AppStack>
          ) : null}
        </AppCard>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={listCardSx}
        >
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
            <InvitationSkeletonList />
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
                  sx={emptyActionButtonSx}
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
                  sx={emptyActionButtonSx}
                >
                  Clear Filters
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : (
            <AppStack direction="column" gap={1} sx={invitationListSx}>
              {invitations.map((invitation) => (
                <InvitationCard
                  key={invitation._id}
                  invitation={invitation}
                  onCancel={handleCancelInvitation}
                />
              ))}
            </AppStack>
          )}
        </AppCard>
      </AppBox>
    </section>
  );
};

const TopToast = ({ message, onClose }) => (
  <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-28px)] max-w-[390px] -translate-x-1/2">
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

const StatCard = ({ stat }) => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={statCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox
        icon={statIcons[stat.id] || <FiSend />}
        colorVariant={stat.colorVariant}
        compact
      />

      <AppBox sx={{ minWidth: 0 }}>
        <AppText variant="body2" weight={650} sx={statTitleSx}>
          {stat.title}
        </AppText>

        <AppHeading level={3} weight={800} sx={statValueSx}>
          {stat.value}
        </AppHeading>

        <AppText variant="body2" weight={500} sx={statDescriptionSx}>
          {stat.description}
        </AppText>
      </AppBox>
    </AppStack>
  </AppCard>
);

const InvitationCard = ({ invitation, onCancel }) => {
  const isPending = invitation?.effectiveStatus === "pending";

  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={invitationCardSx}
    >
      <AppStack direction="row" align="flex-start" gap={1}>
        <Avatar value={invitation?.displayEmail} />

        <AppBox sx={{ minWidth: 0, flex: 1 }}>
          <AppStack
            direction="row"
            align="flex-start"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0 }}>
              <AppText variant="body2" weight={800} sx={emailSx}>
                {invitation?.displayEmail || "-"}
              </AppText>

              <AppText variant="body2" weight={600} sx={sentSx}>
                Sent on {invitation?.displayCreatedAt || "-"}
              </AppText>
            </AppBox>

            <AppTag
              label={invitation?.effectiveStatus || "pending"}
              variant="soft"
              colorVariant={
                statusColorMap[invitation?.effectiveStatus] || "neutral"
              }
              size="small"
              rounded="full"
            />
          </AppStack>

          <AppStack direction="row" align="center" gap={0.65} sx={{ mt: 0.85 }}>
            <AppBadge
              label={invitation?.displayRole || "Staff"}
              variant="soft"
              colorVariant="primary"
              rounded="full"
              size="small"
            />

            {invitation?.notes ? (
              <AppBadge
                label="Notes"
                variant="soft"
                colorVariant="info"
                rounded="full"
                size="small"
              />
            ) : null}
          </AppStack>
        </AppBox>
      </AppStack>

      <AppBox sx={detailsBoxSx}>
        <MiniKeyValue
          label="Invited By"
          value={invitation?.displayInvitedBy || "-"}
        />
        <MiniKeyValue
          label="Expires At"
          value={invitation?.displayExpiresAt || "-"}
        />
        <ActivityValue invitation={invitation} />

        {invitation?.notes ? (
          <AppKeyValue
            label="Notes"
            value={invitation.notes}
            direction="column"
            size="small"
            sx={notesSx}
            labelSx={notesLabelSx}
            valueSx={notesValueSx}
          />
        ) : null}
      </AppBox>

      <AppButton
        type="button"
        variant="soft"
        colorVariant="error"
        rounded="md"
        fullWidth
        startIcon={<FiXCircle />}
        disabled={!isPending}
        onClick={() => onCancel(invitation)}
        sx={cancelButtonSx(isPending)}
      >
        {isPending ? "Cancel Invitation" : "Cancel Unavailable"}
      </AppButton>
    </AppCard>
  );
};

const ActivityValue = ({ invitation }) => {
  if (invitation?.effectiveStatus === "accepted") {
    return (
      <MiniKeyValue
        label={`Accepted by ${invitation?.displayAcceptedBy || "-"}`}
        value={invitation?.displayAcceptedAt || "-"}
      />
    );
  }

  if (invitation?.effectiveStatus === "cancelled") {
    return (
      <MiniKeyValue
        label={`Cancelled by ${invitation?.displayCancelledBy || "-"}`}
        value={invitation?.displayCancelledAt || "-"}
      />
    );
  }

  if (invitation?.effectiveStatus === "expired") {
    return (
      <div className="rounded-lg border border-border bg-bg/60 px-2.5 py-2">
        <AppTag
          label="Invitation expired"
          variant="soft"
          colorVariant="error"
          size="small"
          rounded="full"
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-bg/60 px-2.5 py-2">
      <AppTag
        label="Waiting for response"
        variant="soft"
        colorVariant="warning"
        size="small"
        rounded="full"
      />
    </div>
  );
};

const MiniKeyValue = ({ label, value }) => (
  <AppKeyValue
    label={label}
    value={value}
    direction="column"
    size="small"
    sx={miniKeyValueSx}
    labelSx={miniLabelSx}
    valueSx={miniValueSx}
  />
);

const InvitationSkeletonList = () => (
  <AppStack direction="column" gap={1} sx={invitationListSx}>
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse rounded-xl border border-border bg-surface px-3 py-3"
      >
        <div className="flex items-start gap-2.5">
          <div className="h-9 w-9 rounded-full bg-border" />
          <div className="min-w-0 flex-1">
            <div className="h-3.5 w-2/3 rounded bg-border" />
            <div className="mt-2 h-3 w-1/2 rounded bg-border" />
            <div className="mt-3 h-7 w-full rounded bg-border" />
          </div>
        </div>
      </div>
    ))}
  </AppStack>
);

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

const IconBox = ({ icon, colorVariant = "primary", compact = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: compact ? 34 : 38,
      height: compact ? 34 : 38,
      minWidth: compact ? 34 : 38,
      borderRadius: compact ? "12px" : "13px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: compact ? "16px" : "19px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  minHeight: "100vh",
  mx: "auto",
  px: { xs: 1.35, sm: 1.8 },
  pt: { xs: 1.45, sm: 1.9 },
  pb: { xs: 2, sm: 2.5 },
};

const backButtonSx = {
  height: 34,
  px: 1.15,
  fontSize: "11.3px",
  fontWeight: 750,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const headerIconButtonSx = {
  width: 34,
  height: 34,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
};

const inviteButtonSx = {
  height: 34,
  px: 1.2,
  fontSize: "11.5px",
  fontWeight: 800,
  boxShadow: "var(--app-shadow-sm)",
};

const headerSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  mt: { xs: 1.5, sm: 1.9 },
};

const headerBadgeSx = {
  height: 32,
  px: 1.15,
  mb: 1,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  gap: 0.65,
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "11.2px",
  fontWeight: 750,
};

const titleSx = {
  m: 0,
  fontSize: { xs: "22px", sm: "24px" },
  lineHeight: 1.14,
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.55,
  maxWidth: 335,
  fontSize: { xs: "11.8px", sm: "12.6px" },
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const statCardSx = {
  minHeight: 92,
  px: 1.05,
  py: 0.95,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const statTitleSx = {
  fontSize: "10px",
  lineHeight: 1.2,
  color: "var(--app-color-text-muted)",
};

const statValueSx = {
  mt: 0.4,
  mb: 0,
  fontSize: "17px",
  lineHeight: 1,
  letterSpacing: "-0.35px",
  color: "var(--app-color-text)",
};

const statDescriptionSx = {
  mt: 0.5,
  fontSize: "9.2px",
  lineHeight: "12.5px",
  color: "var(--app-color-text-muted)",
};

const alertSx = {
  mt: 2,
  fontSize: "11.5px",
};

const filterCardSx = {
  mt: 2.2,
  px: 1.15,
  py: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "14px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.4,
  fontSize: "10.9px",
  lineHeight: "15.5px",
  color: "var(--app-color-text-muted)",
};

const membersButtonSx = {
  height: 32,
  px: 1,
  fontSize: "10.8px",
  fontWeight: 800,
  bgcolor: "var(--app-color-surface)",
};

const searchSx = {
  width: "100%",
};

const selectSx = {
  width: "100%",
};

const filterInputSx = {
  height: 40,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const chipsRowSx = {
  mt: 1.1,
  flexWrap: "wrap",
};

const listCardSx = {
  mt: 1.65,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const invitationListSx = {
  px: 1,
  py: 1,
};

const invitationCardSx = {
  px: 1,
  py: 1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const emailSx = {
  maxWidth: 205,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.4px",
  lineHeight: "15px",
  color: "var(--app-color-text)",
};

const sentSx = {
  mt: 0.35,
  fontSize: "10.6px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const detailsBoxSx = {
  mt: 1.15,
  display: "flex",
  flexDirection: "column",
  gap: 0.75,
};

const miniKeyValueSx = {
  px: 1,
  py: 0.85,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-readonly-bg)",
};

const miniLabelSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const miniValueSx = {
  mt: 0.25,
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11.1px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const notesSx = {
  px: 1,
  py: 0.85,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const notesLabelSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const notesValueSx = {
  mt: 0.25,
  fontSize: "11px",
  lineHeight: "15px",
  color: "var(--app-color-text)",
};

const cancelButtonSx = (enabled) => ({
  mt: 1.05,
  height: 34,
  fontSize: "11.3px",
  fontWeight: 800,
  opacity: enabled ? 1 : 0.72,
});

const stateSx = {
  minHeight: 300,
  px: 1,
  py: 2,
};

const emptyActionButtonSx = {
  height: 38,
  fontSize: "12px",
  fontWeight: 800,
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default WorkspaceInvitationsMobilePage;
