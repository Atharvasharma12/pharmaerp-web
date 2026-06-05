// src/features/workspace/pages/desktop/WorkspaceDesktopPage.jsx

import { memo, useMemo } from "react";
import {
  FiBriefcase,
  FiEdit2,
  FiEye,
  FiMail,
  FiMapPin,
  FiPlus,
  FiRefreshCcw,
  FiSend,
  FiShield,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import {
  AppBadge,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppEmptyState,
  AppHeading,
  AppKeyValue,
  AppStack,
  AppStatusBadge,
  AppText,
} from "@/components";

const WorkspaceDesktopPage = memo(
  ({
    workspaces = [],
    currentWorkspace = null,

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
    const breadcrumbItems = useMemo(
      () => [
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Workspace",
          current: true,
        },
      ],
      [],
    );

    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 pb-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="sticky top-0 z-30 -mx-5 mb-3 flex w-[calc(100%+40px)] items-center justify-between border-b border-border bg-bg/95 px-5 py-2 backdrop-blur">
            <AppStack direction="row" align="center" gap={1}>
              <IconBox icon={<FiBriefcase />} large />

              <AppBox>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  Workspace
                </AppHeading>

                <AppBreadcrumb
                  size="small"
                  variant="text"
                  items={breadcrumbItems}
                  sx={breadcrumbSx}
                  itemSx={breadcrumbItemSx}
                  currentItemSx={breadcrumbCurrentSx}
                />
              </AppBox>
            </AppStack>

            <AppStack direction="row" align="center" gap={1}>
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiRefreshCcw />}
                loading={isLoading}
                disabled={isLoading}
                onClick={handleRefresh}
                sx={toolbarButtonSx}
              >
                Refresh
              </AppButton>

              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<FiPlus />}
                onClick={handleCreateWorkspace}
                sx={primaryButtonSx}
              >
                New Workspace
              </AppButton>
            </AppStack>
          </div>

          {hasError ? (
            <AppCard
              variant="default"
              rounded="lg"
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
                size="small"
                onClick={handleRefresh}
                sx={{ mt: 1 }}
              >
                Retry
              </AppButton>
            </AppCard>
          ) : null}

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={workspaceSectionSx}
          >
            <AppStack
              direction="row"
              align="center"
              justify="space-between"
              sx={sectionHeaderSx}
            >
              <AppBox>
                <AppHeading level={2} weight={700} sx={sectionTitleSx}>
                  My Workspaces
                </AppHeading>

                <AppText variant="body2" sx={sectionSubtitleSx}>
                  View workspace details and manage members, invites, and
                  settings.
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

            {isLoading ? (
              <AppBox sx={loadingBoxSx}>
                <AppText variant="body2" sx={sectionSubtitleSx}>
                  Loading workspaces...
                </AppText>
              </AppBox>
            ) : workspaces.length ? (
              <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-2 2xl:grid-cols-3">
                {workspaces.map((workspace) => (
                  <WorkspaceCard
                    key={workspace._id}
                    workspace={workspace}
                    selected={workspace?._id === currentWorkspace?._id}
                    isDeleting={isDeleting}
                    onSelect={handleSelectWorkspace}
                    onView={handleViewWorkspace}
                    onEdit={handleEditWorkspace}
                    onMembers={handleManageMembers}
                    onInvitations={handleManageInvitations}
                    onInvite={handleInviteMember}
                    onDelete={handleDeleteWorkspace}
                  />
                ))}
              </div>
            ) : (
              <AppBox sx={emptyBoxSx}>
                <AppEmptyState
                  title="No workspaces found"
                  description="Create a workspace to start managing your business."
                  icon={<FiBriefcase />}
                  size="small"
                />

                <AppStack direction="row" justify="center" sx={{ mt: 1.5 }}>
                  <AppButton
                    type="button"
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    size="small"
                    startIcon={<FiPlus />}
                    onClick={handleCreateWorkspace}
                    sx={primaryButtonSx}
                  >
                    Create Workspace
                  </AppButton>
                </AppStack>
              </AppBox>
            )}
          </AppCard>
        </div>
      </section>
    );
  },
);

WorkspaceDesktopPage.displayName = "WorkspaceDesktopPage";

const WorkspaceCard = memo(
  ({
    workspace,
    selected,
    isDeleting,
    onSelect,
    onView,
    onEdit,
    onMembers,
    onInvitations,
    onInvite,
    onDelete,
  }) => {
    const stopAndRun = (event, callback) => {
      event.stopPropagation();
      callback?.(workspace);
    };

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(workspace)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect?.(workspace);
          }
        }}
        className="h-full cursor-pointer text-left"
      >
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={{
            ...workspaceCardSx,
            ...(selected ? selectedWorkspaceCardSx : null),
          }}
        >
          <AppStack
            direction="row"
            align="flex-start"
            justify="space-between"
            gap={1.2}
          >
            <AppStack
              direction="row"
              align="center"
              gap={1.1}
              sx={{ minWidth: 0 }}
            >
              <IconBox icon={<FiBriefcase />} large />

              <AppBox sx={{ minWidth: 0 }}>
                <AppHeading level={3} weight={700} sx={workspaceNameSx}>
                  {workspace.name || "-"}
                </AppHeading>

                <AppText variant="body2" sx={workspaceCodeSx}>
                  {workspace.workspaceCode || workspace.slug || "-"}
                </AppText>
              </AppBox>
            </AppStack>

            <AppStatusBadge
              status={workspace.status || "active"}
              variant="soft"
              rounded="full"
              size="small"
            />
          </AppStack>

          <AppStack direction="row" align="center" gap={0.7} sx={badgeRowSx}>
            <AppBadge
              label={workspace.displayType || "Workspace"}
              variant="soft"
              colorVariant="primary"
              rounded="full"
              size="small"
            />

            <AppBadge
              label={
                workspace.isOwner ? "Owner" : workspace.roleName || "Member"
              }
              variant="soft"
              colorVariant={workspace.isOwner ? "success" : "neutral"}
              rounded="full"
              size="small"
            />
          </AppStack>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <InfoItem label="Email" value={workspace.email || "-"} />
            <InfoItem
              label="Phone"
              value={workspace.phone || "No phone added"}
            />
            <InfoItem
              label="Created"
              value={workspace.displayCreatedAt || "-"}
            />
            <InfoItem
              label="Code"
              value={workspace.workspaceCode || workspace.slug || "-"}
            />
          </div>

          <AppBox sx={addressBoxSx}>
            <AppStack direction="row" align="flex-start" gap={0.9}>
              <span className="mt-0.5 flex text-[14px] text-primary">
                <FiMapPin />
              </span>

              <AppBox sx={{ minWidth: 0 }}>
                <AppText variant="body2" weight={700} sx={addressTitleSx}>
                  Address
                </AppText>
                <AppText variant="caption" sx={addressTextSx}>
                  {workspace.displayAddress || "-"}
                </AppText>
              </AppBox>
            </AppStack>
          </AppBox>

          <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
            <CardActionButton
              icon={<FiEye />}
              label="Details"
              colorVariant="info"
              onClick={(event) => stopAndRun(event, onView)}
            />

            <CardActionButton
              icon={<FiUsers />}
              label="Members"
              colorVariant="primary"
              onClick={(event) => stopAndRun(event, onMembers)}
            />

            <CardActionButton
              icon={<FiSend />}
              label="Invites"
              colorVariant="warning"
              onClick={(event) => stopAndRun(event, onInvitations)}
            />

            <CardActionButton
              icon={<FiMail />}
              label="Invite"
              colorVariant="primary"
              onClick={(event) => stopAndRun(event, onInvite)}
            />
          </div>

          {workspace.isOwner ? (
            <AppStack direction="row" align="center" gap={0.8} sx={{ mt: 2 }}>
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="primary"
                rounded="md"
                size="small"
                fullWidth
                startIcon={<FiEdit2 />}
                onClick={(event) => stopAndRun(event, onEdit)}
                sx={cardButtonSx}
              >
                Edit
              </AppButton>

              <AppButton
                type="button"
                variant="soft"
                colorVariant="error"
                rounded="md"
                size="small"
                fullWidth
                startIcon={<FiTrash2 />}
                loading={isDeleting}
                disabled={isDeleting}
                onClick={(event) => stopAndRun(event, onDelete)}
                sx={cardButtonSx}
              >
                Delete
              </AppButton>
            </AppStack>
          ) : (
            <AppBox sx={memberNoteSx}>
              <AppKeyValue
                label="Permission"
                value="Owner access is required to edit or delete workspace."
                direction="column"
                size="small"
                labelSx={memberNoteLabelSx}
                valueSx={memberNoteValueSx}
              />
            </AppBox>
          )}
        </AppCard>
      </div>
    );
  },
);

WorkspaceCard.displayName = "WorkspaceCard";

const InfoItem = memo(({ label, value }) => (
  <AppBox sx={infoItemSx}>
    <AppText variant="caption" sx={infoLabelSx}>
      {label}
    </AppText>
    <AppText variant="body2" weight={650} sx={infoValueSx}>
      {value}
    </AppText>
  </AppBox>
));

InfoItem.displayName = "InfoItem";

const CardActionButton = memo(({ icon, label, colorVariant, onClick }) => (
  <AppButton
    type="button"
    variant="soft"
    colorVariant={colorVariant}
    rounded="md"
    size="small"
    fullWidth
    startIcon={icon}
    onClick={onClick}
    sx={actionButtonSx}
  >
    {label}
  </AppButton>
));

CardActionButton.displayName = "CardActionButton";

const IconBox = memo(({ icon, large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 35 : 31,
      height: large ? 35 : 31,
      minWidth: large ? 35 : 31,
      borderRadius: large ? "10px" : "9px",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: large ? "18px" : "15px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
));

IconBox.displayName = "IconBox";

const pageTitleSx = {
  m: 0,
  fontSize: "17px",
  lineHeight: 1.05,
  letterSpacing: "-0.25px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = { mt: 0, lineHeight: 1 };

const breadcrumbItemSx = {
  fontSize: "10.5px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "10.5px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const toolbarButtonSx = {
  height: 31,
  px: 1.35,
  fontSize: "11.3px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const primaryButtonSx = {
  height: 31,
  px: 1.55,
  fontSize: "11.5px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

const errorCardSx = {
  mb: 2,
  px: 1.5,
  py: 1.25,
  bgcolor: "var(--app-color-error-soft)",
  borderColor: "var(--app-color-error)",
};

const errorTextSx = {
  color: "var(--app-color-error)",
  fontSize: "12px",
};

const workspaceSectionSx = {
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
};

const sectionHeaderSx = {
  px: 1.7,
  py: 1.35,
  borderBottom: "1px solid var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.35,
  fontSize: "11.3px",
  color: "var(--app-color-text-muted)",
};

const loadingBoxSx = {
  px: 1.7,
  py: 3,
};

const emptyBoxSx = {
  px: 1.7,
  py: 4,
};

const workspaceCardSx = {
  height: "100%",
  px: 1.55,
  py: 1.45,
  bgcolor: "var(--app-color-surface)",
  transition:
    "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
  "&:hover": {
    borderColor: "var(--app-color-primary)",
    boxShadow: "var(--app-shadow-md)",
    transform: "translateY(-1px)",
  },
};

const selectedWorkspaceCardSx = {
  borderColor: "var(--app-color-primary)",
  bgcolor: "var(--app-color-primary-soft)",
};

const workspaceNameSx = {
  m: 0,
  maxWidth: 320,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "14px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const workspaceCodeSx = {
  mt: 0.25,
  maxWidth: 320,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
};

const badgeRowSx = {
  mt: 1.2,
  flexWrap: "wrap",
};

const infoItemSx = {
  minWidth: 0,
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const infoLabelSx = {
  display: "block",
  fontSize: "10.4px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
};

const infoValueSx = {
  mt: 0.35,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11.5px",
  color: "var(--app-color-text)",
};

const addressBoxSx = {
  mt: 1.2,
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
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

const actionButtonSx = {
  height: 32,
  px: 0.8,
  fontSize: "11px",
  fontWeight: 700,
};

const cardButtonSx = {
  height: 33,
  fontSize: "11.6px",
  fontWeight: 700,
};

const memberNoteSx = {
  mt: 1.25,
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-readonly-bg)",
};

const memberNoteLabelSx = {
  fontSize: "10.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const memberNoteValueSx = {
  mt: 0.3,
  fontSize: "10.6px",
  lineHeight: "14.5px",
  color: "var(--app-color-text-muted)",
};

export default WorkspaceDesktopPage;
