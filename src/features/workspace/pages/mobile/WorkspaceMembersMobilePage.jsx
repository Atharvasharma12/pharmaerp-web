// src/features/workspace/pages/mobile/WorkspaceMembersMobilePage.jsx

import {
  FiArrowLeft,
  FiClock,
  FiMail,
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
  AppBadge,
  AppBox,
  AppButton,
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppHeading,
  AppIconButton,
  AppInput,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
} from "@/components";

const statIcons = {
  total: <FiUsers />,
  active: <FiUserCheck />,
  inactive: <FiClock />,
  suspended: <FiShield />,
};

const WorkspaceMembersMobilePage = ({
  workspace,
  members = [],
  stats = [],

  filters,
  activeFilterChips = [],
  statusOptions = [],
  roleOptions = [],

  isLoading = false,
  hasError = false,
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
  const showInitialLoading = isLoading && !hasMembers;

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
            Back
          </AppButton>

          <AppStack direction="row" align="center" gap={0.65}>
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
          <AppBox sx={headerIconSx}>
            <FiUsers />
          </AppBox>

          <AppHeading level={1} weight={800} align="center" sx={titleSx}>
            Workspace Members
          </AppHeading>

          <AppText variant="body2" align="center" weight={600} sx={subtitleSx}>
            {workspace?.name
              ? `Manage users in ${workspace.name}.`
              : "Manage users linked to this workspace."}
          </AppText>
        </AppBox>

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={workspaceCardSx}
        >
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppStack
              direction="row"
              align="center"
              gap={1}
              sx={{ minWidth: 0 }}
            >
              <Avatar name={workspace?.name || "Workspace"} large />

              <AppBox sx={{ minWidth: 0 }}>
                <AppHeading level={2} weight={800} sx={workspaceTitleSx}>
                  {workspace?.name || "Selected Workspace"}
                </AppHeading>

                <AppText variant="body2" weight={600} sx={workspaceMetaSx}>
                  {workspace?.workspaceCode ||
                    workspace?.slug ||
                    workspace?._id ||
                    "-"}
                </AppText>
              </AppBox>
            </AppStack>

            <AppButton
              type="button"
              variant="outlined"
              colorVariant="primary"
              rounded="md"
              onClick={handleViewInvitations}
              sx={invitesButtonSx}
            >
              Invites
            </AppButton>
          </AppStack>
        </AppCard>

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
                Member Directory
              </AppHeading>

              <AppText variant="body2" weight={500} sx={sectionSubtitleSx}>
                Showing {filteredMembersCount} of {totalMembers} members
              </AppText>
            </AppBox>

            <AppBadge
              label={`${members.length} shown`}
              variant="soft"
              colorVariant="primary"
              rounded="full"
              size="small"
            />
          </AppStack>

          <AppStack direction="column" gap={1.05} sx={{ mt: 1.25 }}>
            <AppInput
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search member, email, phone, role..."
              fullWidth
              size="small"
              variant="bordered"
              rounded="md"
              startIcon={<FiSearch />}
              error={false}
              labelSx={filterLabelSx}
              inputSx={filterInputSx}
            />

            <div className="grid grid-cols-2 gap-1">
              <AppInput
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                select
                fullWidth
                size="small"
                variant="bordered"
                rounded="md"
                labelSx={filterLabelSx}
                inputSx={filterInputSx}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </AppInput>

              <AppInput
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                select
                fullWidth
                size="small"
                variant="bordered"
                rounded="md"
                labelSx={filterLabelSx}
                inputSx={filterInputSx}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </AppInput>
            </div>
          </AppStack>

          {activeFilterChips.length ? (
            <AppStack direction="row" align="center" gap={0.65} sx={chipsRowSx}>
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => handleRemoveFilter(chip.key)}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[10.6px] font-bold text-text-muted"
                >
                  {chip.label}
                  <FiX className="text-[12px]" />
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
              title="Unable to load members"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          ) : showInitialLoading ? (
            <LoadingList />
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
                  sx={emptyActionSx}
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
                  sx={emptyActionSx}
                >
                  Clear Filters
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : (
            <AppStack direction="column" gap={1} sx={memberListSx}>
              {members.map((member) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  onChangeStatus={handleChangeMemberStatus}
                  onRemove={handleRemoveMember}
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
  <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-28px)] max-w-sm -translate-x-1/2">
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
        icon={statIcons[stat.id] || <FiUsers />}
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

const MemberCard = ({ member, onChangeStatus, onRemove }) => {
  const isOwner = Boolean(member?.isOwner);

  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={memberCardSx}
    >
      <AppStack direction="row" align="flex-start" gap={1}>
        <Avatar name={member?.displayName} />

        <AppBox sx={{ minWidth: 0, flex: 1 }}>
          <AppStack
            direction="row"
            align="center"
            gap={0.65}
            sx={{ minWidth: 0 }}
          >
            <AppHeading level={3} weight={800} sx={memberNameSx}>
              {member?.displayName || "-"}
            </AppHeading>

            {isOwner ? (
              <AppTag
                label="Owner"
                variant="soft"
                colorVariant="warning"
                size="small"
                rounded="full"
              />
            ) : null}
          </AppStack>

          <AppText variant="body2" weight={600} sx={memberMetaSx}>
            {member?.displayEmail || "-"}
          </AppText>

          <AppText variant="body2" weight={500} sx={memberPhoneSx}>
            {member?.displayPhone || "-"}
          </AppText>
        </AppBox>

        <AppStatusBadge
          status={member?.status || "inactive"}
          variant="soft"
          size="small"
          rounded="full"
          sx={memberStatusSx}
        />
      </AppStack>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-readonly-bg p-2">
        <InfoItem label="Role" value={member?.displayRole || "-"} />
        <InfoItem label="Joined" value={member?.displayJoinedAt || "-"} />
        <InfoItem
          label="Last Active"
          value={member?.displayLastActiveAt || "-"}
        />
        <InfoItem label="Member ID" value={member?._id || "-"} />
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        <ActionButton
          label="Mark Active"
          icon={<FiUserCheck />}
          disabled={isOwner || member?.status === "active"}
          onClick={() => onChangeStatus(member, "active")}
        />

        <ActionButton
          label="Inactive"
          icon={<FiClock />}
          disabled={isOwner || member?.status === "inactive"}
          onClick={() => onChangeStatus(member, "inactive")}
        />

        <ActionButton
          label="Suspend"
          icon={<FiShield />}
          disabled={isOwner || member?.status === "suspended"}
          onClick={() => onChangeStatus(member, "suspended")}
        />

        <ActionButton
          label="Remove"
          icon={<FiUserMinus />}
          danger
          disabled={isOwner}
          onClick={() => onRemove(member)}
        />
      </div>

      {isOwner ? (
        <AppBox sx={ownerNoteSx}>
          <AppText variant="body2" weight={650} sx={ownerNoteTextSx}>
            Owner cannot be modified or removed.
          </AppText>
        </AppBox>
      ) : null}
    </AppCard>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="min-w-0">
    <div className="text-[9.8px] font-bold uppercase tracking-wide text-text-muted">
      {label}
    </div>

    <div className="mt-0.5 truncate text-[10.9px] font-bold text-text">
      {value}
    </div>
  </div>
);

const ActionButton = ({ icon, label, danger = false, disabled, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={[
      "flex h-8 items-center justify-center gap-1 rounded-lg border px-1 text-[10.4px] font-extrabold transition active:scale-[0.99]",
      disabled
        ? "border-border bg-disabled-bg text-text-muted opacity-60"
        : danger
          ? "border-error bg-error-soft text-error"
          : "border-border bg-surface text-text-muted",
    ].join(" ")}
  >
    <span className={danger && !disabled ? "text-error" : "text-primary"}>
      {icon}
    </span>
    {label}
  </button>
);

const LoadingList = () => (
  <AppStack direction="column" gap={1} sx={memberListSx}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="h-[134px] animate-pulse rounded-xl border border-border bg-surface"
      />
    ))}
  </AppStack>
);

const Avatar = ({ name, large = false }) => {
  const initials = String(name || "M")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <span
      className={[
        "flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary",
        large ? "h-10 w-10 text-[14px]" : "h-9 w-9 text-[13px]",
      ].join(" ")}
    >
      {initials || "M"}
    </span>
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
  px: 1.2,
  fontSize: "11.4px",
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
  px: 1.15,
  fontSize: "11.6px",
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

const headerIconSx = {
  width: 42,
  height: 42,
  mb: 1,
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "21px",
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

const workspaceCardSx = {
  mt: 1.85,
  px: 1.15,
  py: 1.1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const workspaceTitleSx = {
  m: 0,
  maxWidth: 205,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "14px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const workspaceMetaSx = {
  mt: 0.35,
  maxWidth: 205,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "10.9px",
  color: "var(--app-color-text-muted)",
};

const invitesButtonSx = {
  height: 32,
  px: 1,
  fontSize: "10.8px",
  fontWeight: 800,
  bgcolor: "var(--app-color-surface)",
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
};

const filterCardSx = {
  mt: 2.2,
  px: 1.15,
  py: 1.15,
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

const filterLabelSx = {
  display: "none",
};

const filterInputSx = {
  height: 39,
  fontSize: "11.7px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const chipsRowSx = {
  mt: 1.15,
  flexWrap: "wrap",
};

const listCardSx = {
  mt: 1.4,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const memberListSx = {
  px: 1,
  py: 1,
};

const memberCardSx = {
  px: 1,
  py: 1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const memberNameSx = {
  m: 0,
  maxWidth: 170,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.6px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const memberMetaSx = {
  mt: 0.45,
  maxWidth: 215,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "10.9px",
  color: "var(--app-color-text-muted)",
};

const memberPhoneSx = {
  mt: 0.25,
  maxWidth: 215,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "10.6px",
  color: "var(--app-color-text-muted)",
};

const memberStatusSx = {
  flex: "0 0 auto",
  width: "fit-content",
};

const ownerNoteSx = {
  mt: 0.85,
  p: 0.85,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-readonly-bg)",
};

const ownerNoteTextSx = {
  fontSize: "10.7px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const stateSx = {
  minHeight: 270,
};

const emptyActionSx = {
  height: 38,
  fontSize: "11.8px",
  fontWeight: 800,
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default WorkspaceMembersMobilePage;
