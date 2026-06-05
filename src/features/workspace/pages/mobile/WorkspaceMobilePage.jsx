// src/features/workspace/pages/mobile/WorkspaceMobilePage.jsx

import { memo } from "react";
import {
  FiBriefcase,
  FiEdit2,
  FiEye,
  FiMail,
  FiMapPin,
  FiPlus,
  FiRefreshCcw,
  FiSend,
  FiSettings,
  FiShield,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import {
  AppBadge,
  AppBox,
  AppButton,
  AppCard,
  AppEmptyState,
  AppHeading,
  AppIconButton,
  AppStack,
  AppStatusBadge,
  AppText,
} from "@/components";

const statIcons = {
  total: <FiBriefcase />,
  active: <FiShield />,
  owner: <FiSettings />,
  member: <FiUsers />,
};

const WorkspaceMobilePage = memo(
  ({
    workspaces = [],
    currentWorkspace = null,
    stats = [],

    isLoading = false,
    isDeleting = false,
    hasError = false,
    error,

    handleRefresh,
    handleCreateWorkspace,
    handleEditWorkspace,
    handleViewWorkspace,
    handleManageMembers,
    handleManageInvitations,
    handleInviteMember,
    handleSelectWorkspace,
    handleDeleteWorkspace,
  }) => {
    return (
      <section className="relative min-h-screen w-full overflow-hidden bg-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_8%,transparent),transparent_36%)]" />

        <AppBox sx={sectionSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={headerBadgeSx}>
              <FiBriefcase />
              <span>Workspace</span>
            </AppBox>

            <AppStack direction="row" align="center" gap={0.75}>
              <AppIconButton
                icon={<FiRefreshCcw />}
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
                startIcon={<FiPlus />}
                onClick={handleCreateWorkspace}
                sx={newButtonSx}
              >
                New
              </AppButton>
            </AppStack>
          </AppStack>

          <AppBox sx={headerSx}>
            <AppHeading level={1} weight={800} align="center" sx={titleSx}>
              My Workspaces
            </AppHeading>

            <AppText
              variant="body2"
              align="center"
              weight={600}
              sx={subtitleSx}
            >
              View, switch and manage all workspaces linked to your account.
            </AppText>
          </AppBox>

          {hasError ? (
            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="sm"
              padding="none"
              sx={errorCardSx}
            >
              <AppText variant="body2" weight={650} sx={errorTextSx}>
                {error || "Unable to load workspaces. Please try again."}
              </AppText>

              <AppButton
                type="button"
                variant="soft"
                colorVariant="primary"
                rounded="md"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                onClick={handleRefresh}
                sx={retryButtonSx}
              >
                Retry
              </AppButton>
            </AppCard>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>

          {currentWorkspace ? (
            <CurrentWorkspaceCard
              workspace={currentWorkspace}
              isDeleting={isDeleting}
              onView={handleViewWorkspace}
              onEdit={handleEditWorkspace}
              onMembers={handleManageMembers}
              onInvitations={handleManageInvitations}
              onInvite={handleInviteMember}
              onDelete={handleDeleteWorkspace}
            />
          ) : null}

          <AppCard
            variant="default"
            rounded="xl"
            bordered
            shadow="sm"
            padding="none"
            sx={listCardSx}
          >
            <AppStack
              direction="row"
              align="center"
              justify="space-between"
              gap={1}
              sx={listHeaderSx}
            >
              <AppBox sx={{ minWidth: 0 }}>
                <AppHeading level={2} weight={750} sx={sectionTitleSx}>
                  Workspace List
                </AppHeading>

                <AppText variant="body2" weight={500} sx={sectionSubtitleSx}>
                  Tap a workspace to make it selected.
                </AppText>
              </AppBox>

              <AppBadge
                label={`${workspaces.length} total`}
                variant="soft"
                colorVariant="primary"
                rounded="full"
                size="small"
              />
            </AppStack>

            {workspaces.length > 0 ? (
              <AppStack direction="column" gap={1} sx={workspaceListSx}>
                {workspaces.map((workspace) => (
                  <WorkspaceRow
                    key={workspace._id}
                    workspace={workspace}
                    selected={workspace._id === currentWorkspace?._id}
                    isDeleting={isDeleting}
                    onSelect={handleSelectWorkspace}
                    onView={handleViewWorkspace}
                    onEdit={handleEditWorkspace}
                    onMembers={handleManageMembers}
                    onInvitations={handleManageInvitations}
                    onDelete={handleDeleteWorkspace}
                  />
                ))}
              </AppStack>
            ) : (
              <AppBox sx={emptyStateSx}>
                <AppEmptyState
                  title={
                    isLoading ? "Loading workspaces" : "No workspaces found"
                  }
                  description={
                    isLoading
                      ? "Please wait while we fetch your workspaces."
                      : "Create a workspace to start managing your business."
                  }
                  icon={<FiBriefcase />}
                  actionLabel={isLoading ? undefined : "Create Workspace"}
                  onAction={isLoading ? undefined : handleCreateWorkspace}
                  size="small"
                />
              </AppBox>
            )}
          </AppCard>
        </AppBox>
      </section>
    );
  },
);

WorkspaceMobilePage.displayName = "WorkspaceMobilePage";

const StatCard = memo(({ stat }) => (
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
        icon={statIcons[stat.id] || <FiBriefcase />}
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
));

StatCard.displayName = "StatCard";

const CurrentWorkspaceCard = memo(
  ({
    workspace,
    isDeleting,
    onView,
    onEdit,
    onMembers,
    onInvitations,
    onInvite,
    onDelete,
  }) => (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={currentCardSx}
    >
      <AppStack
        direction="row"
        align="flex-start"
        justify="space-between"
        gap={1}
      >
        <AppStack direction="row" align="center" gap={1} sx={{ minWidth: 0 }}>
          <IconBox icon={<FiShield />} large />

          <AppBox sx={{ minWidth: 0 }}>
            <AppHeading level={2} weight={800} sx={currentTitleSx}>
              {workspace.name || "-"}
            </AppHeading>

            <AppText variant="body2" weight={600} sx={currentSubtitleSx}>
              {workspace.isOwner ? "Owner workspace" : "Member workspace"}
            </AppText>
          </AppBox>
        </AppStack>

        <AppStatusBadge
          status={workspace.status || "active"}
          size="small"
          variant="soft"
          rounded="full"
          sx={statusBadgeSx}
        />
      </AppStack>

      <AppBox sx={detailBoxSx}>
        <DetailRow
          label="Code"
          value={workspace.workspaceCode || workspace.slug || "-"}
        />
        <DetailRow label="Type" value={workspace.displayType || "-"} />
        <DetailRow
          label="Role"
          value={workspace.isOwner ? "Owner" : workspace.roleName || "-"}
        />
        <DetailRow label="Created" value={workspace.displayCreatedAt || "-"} />
      </AppBox>

      <AppStack direction="row" align="flex-start" gap={0.85} sx={addressBoxSx}>
        <span className="mt-0.5 flex shrink-0 text-[14px] text-primary">
          <FiMapPin />
        </span>

        <AppBox sx={{ minWidth: 0 }}>
          <AppText variant="body2" weight={750} sx={addressTitleSx}>
            Address
          </AppText>

          <AppText variant="caption" sx={addressTextSx}>
            {workspace.displayAddress || "-"}
          </AppText>
        </AppBox>
      </AppStack>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <QuickAction
          icon={<FiEye />}
          title="Details"
          text="View profile"
          onClick={() => onView(workspace)}
        />

        <QuickAction
          icon={<FiUsers />}
          title="Members"
          text="Manage team"
          onClick={() => onMembers(workspace)}
        />

        <QuickAction
          icon={<FiSend />}
          title="Invites"
          text="Pending invites"
          onClick={() => onInvitations(workspace)}
        />

        <QuickAction
          icon={<FiMail />}
          title="Invite"
          text="Add member"
          onClick={() => onInvite(workspace)}
        />
      </div>

      {workspace.isOwner ? (
        <AppStack direction="row" align="center" gap={0.85} sx={{ mt: 1.2 }}>
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="primary"
            rounded="md"
            fullWidth
            startIcon={<FiEdit2 />}
            onClick={() => onEdit(workspace)}
            sx={ownerButtonSx}
          >
            Edit
          </AppButton>

          <AppButton
            type="button"
            variant="soft"
            colorVariant="error"
            rounded="md"
            fullWidth
            startIcon={<FiTrash2 />}
            loading={isDeleting}
            disabled={isDeleting}
            onClick={() => onDelete(workspace)}
            sx={ownerButtonSx}
          >
            Delete
          </AppButton>
        </AppStack>
      ) : (
        <AppBox sx={memberNoteSx}>
          <AppText variant="body2" weight={650} sx={memberNoteTextSx}>
            Owner access is required to edit or delete this workspace.
          </AppText>
        </AppBox>
      )}
    </AppCard>
  ),
);

CurrentWorkspaceCard.displayName = "CurrentWorkspaceCard";

const WorkspaceRow = memo(
  ({
    workspace,
    selected,
    isDeleting,
    onSelect,
    onView,
    onEdit,
    onMembers,
    onInvitations,
    onDelete,
  }) => (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="sm"
      padding="none"
      sx={selected ? selectedRowCardSx : rowCardSx}
    >
      <button
        type="button"
        className="flex w-full items-start gap-2.5 text-left"
        onClick={() => onSelect(workspace)}
      >
        <IconBox icon={<FiBriefcase />} />

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="block truncate text-[12.4px] font-extrabold leading-[15px] text-text">
              {workspace.name || "-"}
            </span>

            {selected ? (
              <span className="shrink-0 rounded-full bg-primary-soft px-1.5 py-0.5 text-[9.4px] font-bold leading-none text-primary">
                Selected
              </span>
            ) : null}
          </span>

          <span className="mt-0.5 block truncate text-[10.6px] font-semibold text-text-muted">
            {workspace.workspaceCode || workspace.slug || "-"}
          </span>

          <span className="mt-1 flex flex-wrap items-center gap-1.3">
            <AppBadge
              label={workspace.displayType || "-"}
              variant="soft"
              colorVariant="primary"
              rounded="full"
              size="small"
            />

            <AppStatusBadge
              status={workspace.status || "active"}
              variant="soft"
              rounded="full"
              size="small"
            />

            {workspace.isOwner ? (
              <AppBadge
                label="Owner"
                variant="soft"
                colorVariant="info"
                rounded="full"
                size="small"
              />
            ) : null}
          </span>

          <span className="mt-1.1 block truncate text-[10.6px] font-medium leading-[14px] text-text-muted">
            {workspace.email || "No email added"}
          </span>
        </span>
      </button>

      <div className="mt-2.5 grid grid-cols-4 gap-1.5 border-t border-border pt-2">
        <RowAction
          icon={<FiEye />}
          label="View"
          onClick={() => onView(workspace)}
        />
        <RowAction
          icon={<FiUsers />}
          label="Team"
          onClick={() => onMembers(workspace)}
        />
        <RowAction
          icon={<FiSend />}
          label="Invites"
          onClick={() => onInvitations(workspace)}
        />

        {workspace.isOwner ? (
          <RowAction
            icon={<FiEdit2 />}
            label="Edit"
            onClick={() => onEdit(workspace)}
          />
        ) : (
          <RowAction
            icon={<FiEye />}
            label="Open"
            onClick={() => onView(workspace)}
          />
        )}
      </div>

      {workspace.isOwner ? (
        <AppButton
          type="button"
          variant="soft"
          colorVariant="error"
          rounded="md"
          fullWidth
          startIcon={<FiTrash2 />}
          loading={isDeleting}
          disabled={isDeleting}
          onClick={() => onDelete(workspace)}
          sx={deleteRowButtonSx}
        >
          Delete Workspace
        </AppButton>
      ) : null}
    </AppCard>
  ),
);

WorkspaceRow.displayName = "WorkspaceRow";

const DetailRow = memo(({ label, value }) => (
  <AppStack direction="row" align="center" justify="space-between" gap={1}>
    <AppText variant="body2" weight={650} sx={detailLabelSx}>
      {label}
    </AppText>

    <AppText variant="body2" weight={750} sx={detailValueSx}>
      {value}
    </AppText>
  </AppStack>
));

DetailRow.displayName = "DetailRow";

const QuickAction = memo(({ icon, title, text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-xl border border-border bg-surface px-2.5 py-2 text-left transition active:scale-[0.99]"
  >
    <span className="flex items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-[15px] text-primary">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-[11.5px] font-extrabold leading-[14px] text-text">
          {title}
        </span>
        <span className="mt-0.5 block text-[10.2px] font-medium leading-[13px] text-text-muted">
          {text}
        </span>
      </span>
    </span>
  </button>
));

QuickAction.displayName = "QuickAction";

const RowAction = memo(({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-8 items-center justify-center gap-1 rounded-lg border border-border bg-surface text-[10.3px] font-bold text-text-muted active:scale-[0.99]"
  >
    <span className="text-[12px] text-primary">{icon}</span>
    {label}
  </button>
));

RowAction.displayName = "RowAction";

const IconBox = memo(
  ({ icon, colorVariant = "primary", large = false, compact = false }) => (
    <AppBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: compact ? 34 : large ? 42 : 36,
        height: compact ? 34 : large ? 42 : 36,
        minWidth: compact ? 34 : large ? 42 : 36,
        borderRadius: compact ? "12px" : large ? "14px" : "11px",
        bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
        color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
        fontSize: compact ? "16px" : large ? "21px" : "18px",
        lineHeight: 0,
      }}
    >
      {icon}
    </AppBox>
  ),
);

IconBox.displayName = "IconBox";

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

const headerBadgeSx = {
  height: 32,
  px: 1.15,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  gap: 0.65,
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "11.2px",
  fontWeight: 750,
};

const headerIconButtonSx = {
  width: 34,
  height: 34,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
};

const newButtonSx = {
  height: 34,
  px: 1.25,
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

const errorCardSx = {
  mt: 2,
  px: 1.2,
  py: 1.1,
  bgcolor: "var(--app-color-error-soft)",
  borderColor: "var(--app-color-error)",
};

const errorTextSx = {
  color: "var(--app-color-error)",
  fontSize: "11.7px",
  lineHeight: "17px",
};

const retryButtonSx = {
  mt: 1,
  height: 36,
  fontSize: "11.8px",
  fontWeight: 750,
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

const currentCardSx = {
  mt: 2.2,
  px: 1.15,
  py: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const currentTitleSx = {
  m: 0,
  maxWidth: 230,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "15px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const currentSubtitleSx = {
  mt: 0.35,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const statusBadgeSx = {
  flex: "0 0 auto",
  width: "fit-content",
};

const detailBoxSx = {
  mt: 1.2,
  display: "flex",
  flexDirection: "column",
  gap: 0.8,
  p: 1,
  borderRadius: "11px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-readonly-bg)",
};

const detailLabelSx = {
  fontSize: "10.7px",
  color: "var(--app-color-text-muted)",
};

const detailValueSx = {
  maxWidth: "58%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textAlign: "right",
  fontSize: "11.1px",
  color: "var(--app-color-text)",
};

const addressBoxSx = {
  mt: 1.1,
  p: 1,
  borderRadius: "11px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const addressTitleSx = {
  m: 0,
  fontSize: "11.6px",
  lineHeight: "15px",
  color: "var(--app-color-text)",
};

const addressTextSx = {
  display: "block",
  mt: 0.25,
  fontSize: "10.8px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const ownerButtonSx = {
  height: 36,
  fontSize: "11.8px",
  fontWeight: 800,
};

const memberNoteSx = {
  mt: 1.15,
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-readonly-bg)",
};

const memberNoteTextSx = {
  fontSize: "10.9px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const listCardSx = {
  mt: 2.2,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const listHeaderSx = {
  px: 1.15,
  py: 1.15,
  borderBottom: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-readonly-bg)",
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

const workspaceListSx = {
  px: 1,
  py: 1,
};

const rowCardSx = {
  px: 1,
  py: 1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const selectedRowCardSx = {
  ...rowCardSx,
  bgcolor: "var(--app-color-primary-soft)",
  borderColor: "var(--app-color-primary)",
};

const deleteRowButtonSx = {
  mt: 0.85,
  height: 33,
  fontSize: "11.2px",
  fontWeight: 800,
};

const emptyStateSx = {
  px: 1.2,
  py: 2,
};

export default WorkspaceMobilePage;
