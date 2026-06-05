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
  FiSettings,
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
  AppDescriptionList,
  AppEmptyState,
  AppGrid,
  AppHeading,
  AppIconButton,
  AppKeyValue,
  AppStack,
  AppStatCard,
  AppStatusBadge,
  AppTable,
  AppText,
} from "@/components";

const WorkspaceDesktopPage = memo(
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

    const columns = useMemo(
      () => [
        {
          id: "workspace",
          key: "name",
          label: "Workspace",
          minWidth: 240,
          render: (_, row) => (
            <WorkspaceIdentity
              workspace={row}
              onClick={() => handleViewWorkspace(row)}
            />
          ),
        },
        {
          id: "type",
          key: "displayType",
          label: "Type",
          width: 130,
          render: (_, row) => (
            <AppBadge
              label={row.displayType || "-"}
              variant="soft"
              colorVariant="primary"
              rounded="full"
              size="small"
            />
          ),
        },
        {
          id: "status",
          key: "status",
          label: "Status",
          width: 120,
          render: (_, row) => (
            <AppStatusBadge
              status={row.status || "active"}
              variant="soft"
              rounded="full"
              size="small"
            />
          ),
        },
        {
          id: "role",
          key: "roleName",
          label: "Role",
          width: 130,
          render: (_, row) => (
            <AppText variant="body2" weight={650} sx={tableValueSx}>
              {row.isOwner ? "Owner" : row.roleName || "-"}
            </AppText>
          ),
        },
        {
          id: "contact",
          key: "email",
          label: "Contact",
          minWidth: 190,
          render: (_, row) => (
            <AppBox sx={{ minWidth: 0 }}>
              <AppText variant="body2" weight={600} sx={tableValueSx}>
                {row.email || "-"}
              </AppText>
              <AppText variant="caption" sx={tableMutedSx}>
                {row.phone || "No phone added"}
              </AppText>
            </AppBox>
          ),
        },
        {
          id: "createdAt",
          key: "displayCreatedAt",
          label: "Created",
          width: 120,
        },
        {
          id: "actions",
          key: "actions",
          label: "Actions",
          align: "right",
          width: 190,
          render: (_, row) => (
            <AppStack
              direction="row"
              align="center"
              justify="flex-end"
              gap={0.5}
            >
              <AppIconButton
                icon={<FiEye />}
                tooltip="View details"
                size="small"
                rounded="md"
                variant="soft"
                colorVariant="info"
                onClick={() => handleViewWorkspace(row)}
              />

              <AppIconButton
                icon={<FiUsers />}
                tooltip="Members"
                size="small"
                rounded="md"
                variant="soft"
                colorVariant="primary"
                onClick={() => handleManageMembers(row)}
              />

              <AppIconButton
                icon={<FiSend />}
                tooltip="Invitations"
                size="small"
                rounded="md"
                variant="soft"
                colorVariant="warning"
                onClick={() => handleManageInvitations(row)}
              />

              {row.isOwner ? (
                <>
                  <AppIconButton
                    icon={<FiEdit2 />}
                    tooltip="Edit workspace"
                    size="small"
                    rounded="md"
                    variant="soft"
                    colorVariant="success"
                    onClick={() => handleEditWorkspace(row)}
                  />

                  <AppIconButton
                    icon={<FiTrash2 />}
                    tooltip="Delete workspace"
                    size="small"
                    rounded="md"
                    variant="soft"
                    colorVariant="error"
                    loading={isDeleting}
                    disabled={isDeleting}
                    onClick={() => handleDeleteWorkspace(row)}
                  />
                </>
              ) : null}
            </AppStack>
          ),
        },
      ],
      [
        handleDeleteWorkspace,
        handleEditWorkspace,
        handleManageInvitations,
        handleManageMembers,
        handleViewWorkspace,
        isDeleting,
      ],
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

          <AppGrid columns={4} gap={1.5}>
            {stats.map((stat) => (
              <AppStatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                subtitle={stat.description}
                colorVariant={stat.colorVariant}
                icon={statIcons[stat.id] || <FiBriefcase />}
                variant="default"
                sx={statCardSx}
                iconSx={statIconSx}
              />
            ))}
          </AppGrid>

          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_360px] gap-3.5">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={tableCardSx}
            >
              <AppStack
                direction="row"
                align="center"
                justify="space-between"
                sx={tableHeaderSx}
              >
                <AppBox>
                  <AppHeading level={2} weight={700} sx={sectionTitleSx}>
                    My Workspaces
                  </AppHeading>

                  <AppText variant="body2" sx={sectionSubtitleSx}>
                    View and manage workspaces linked to your account.
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

              <AppTable
                columns={columns}
                rows={workspaces}
                getRowId={(row) => row._id}
                loading={isLoading}
                bordered={false}
                rounded={false}
                hover
                dense
                emptyTitle="No workspaces found"
                emptyDescription="Create a workspace to start managing your business."
                emptyActionLabel="Create Workspace"
                onEmptyAction={handleCreateWorkspace}
                sx={workspaceTableSx}
                rowSx={(row) =>
                  row?._id === currentWorkspace?._id ? selectedRowSx : undefined
                }
                onRowClick={handleSelectWorkspace}
              />
            </AppCard>

            <WorkspaceSidebar
              workspace={currentWorkspace}
              isDeleting={isDeleting}
              onView={handleViewWorkspace}
              onEdit={handleEditWorkspace}
              onMembers={handleManageMembers}
              onInvitations={handleManageInvitations}
              onInvite={handleInviteMember}
              onDelete={handleDeleteWorkspace}
            />
          </div>
        </div>
      </section>
    );
  },
);

WorkspaceDesktopPage.displayName = "WorkspaceDesktopPage";

const WorkspaceIdentity = memo(({ workspace, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex max-w-full items-center gap-2.5 text-left"
  >
    <IconBox icon={<FiBriefcase />} />

    <span className="min-w-0">
      <span className="block truncate text-[12.5px] font-bold text-text">
        {workspace.name || "-"}
      </span>

      <span className="mt-0.5 block truncate text-[10.8px] font-medium text-text-muted">
        {workspace.workspaceCode || workspace.slug || "-"}
      </span>
    </span>
  </button>
));

WorkspaceIdentity.displayName = "WorkspaceIdentity";

const WorkspaceSidebar = memo(
  ({
    workspace,
    isDeleting,
    onView,
    onEdit,
    onMembers,
    onInvitations,
    onInvite,
    onDelete,
  }) => {
    const detailItems = useMemo(
      () =>
        workspace
          ? [
              {
                key: "code",
                label: "Workspace Code",
                value: workspace.workspaceCode || "-",
              },
              {
                key: "type",
                label: "Type",
                value: workspace.displayType || "-",
              },
              {
                key: "status",
                label: "Status",
                value: (
                  <AppStatusBadge
                    status={workspace.status || "active"}
                    size="small"
                    variant="soft"
                    rounded="full"
                  />
                ),
              },
              {
                key: "email",
                label: "Email",
                value: workspace.email || "-",
              },
              {
                key: "phone",
                label: "Phone",
                value: workspace.phone || "-",
              },
              {
                key: "created",
                label: "Created",
                value: workspace.displayCreatedAt || "-",
              },
            ]
          : [],
      [workspace],
    );

    if (!workspace) {
      return (
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={sidebarCardSx}
        >
          <AppEmptyState
            title="No workspace selected"
            description="Select a workspace from the list to view details."
            icon={<FiBriefcase />}
            size="small"
          />
        </AppCard>
      );
    }

    return (
      <aside className="self-start">
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={sidebarCardSx}
        >
          <AppStack direction="row" align="center" gap={1}>
            <IconBox icon={<FiShield />} large />

            <AppBox sx={{ minWidth: 0 }}>
              <AppHeading level={2} weight={700} sx={sidebarTitleSx}>
                {workspace.name}
              </AppHeading>

              <AppText variant="body2" sx={sidebarSubtitleSx}>
                {workspace.isOwner ? "Owner workspace" : "Member workspace"}
              </AppText>
            </AppBox>
          </AppStack>

          <div className="my-3 h-px bg-border" />

          <AppDescriptionList
            items={detailItems}
            columns={1}
            size="small"
            dense
            sx={descriptionListSx}
          />

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

          <AppGrid columns={2} gap={0.8} sx={{ mt: 1.25 }}>
            <SidebarAction
              icon={<FiEye />}
              title="Details"
              text="View profile"
              onClick={() => onView(workspace)}
            />

            <SidebarAction
              icon={<FiUsers />}
              title="Members"
              text="Manage team"
              onClick={() => onMembers(workspace)}
            />

            <SidebarAction
              icon={<FiSend />}
              title="Invites"
              text="Pending invites"
              onClick={() => onInvitations(workspace)}
            />

            <SidebarAction
              icon={<FiMail />}
              title="Invite"
              text="Add member"
              onClick={() => onInvite(workspace)}
            />
          </AppGrid>

          {workspace.isOwner ? (
            <AppStack direction="column" gap={0.8} sx={{ mt: 1.25 }}>
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="primary"
                rounded="md"
                size="small"
                fullWidth
                startIcon={<FiEdit2 />}
                onClick={() => onEdit(workspace)}
                sx={sidebarButtonSx}
              >
                Edit Workspace
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
                onClick={() => onDelete(workspace)}
                sx={sidebarButtonSx}
              >
                Delete Workspace
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
      </aside>
    );
  },
);

WorkspaceSidebar.displayName = "WorkspaceSidebar";

const SidebarAction = memo(({ icon, title, text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg border border-border bg-surface-alt px-2.5 py-2 text-left transition hover:bg-surface-hover"
  >
    <span className="flex items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-[14px] text-primary">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-[11.5px] font-bold leading-[14px] text-text">
          {title}
        </span>
        <span className="mt-0.5 block text-[10.4px] font-medium leading-[13px] text-text-muted">
          {text}
        </span>
      </span>
    </span>
  </button>
));

SidebarAction.displayName = "SidebarAction";

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

const statIcons = {
  total: <FiBriefcase />,
  active: <FiShield />,
  owner: <FiSettings />,
  member: <FiUsers />,
};

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

const statCardSx = {
  minHeight: 94,
  bgcolor: "var(--app-color-surface)",
};

const statIconSx = {
  width: 36,
  height: 36,
};

const tableCardSx = {
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
};

const tableHeaderSx = {
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

const workspaceTableSx = {
  borderRadius: 0,
};

const selectedRowSx = {
  bgcolor: "var(--app-color-primary-soft)",
};

const tableValueSx = {
  fontSize: "11.8px",
  lineHeight: "16px",
  color: "var(--app-color-text)",
};

const tableMutedSx = {
  display: "block",
  mt: 0.2,
  fontSize: "10.6px",
  color: "var(--app-color-text-muted)",
};

const sidebarCardSx = {
  px: 1.45,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
};

const sidebarTitleSx = {
  m: 0,
  maxWidth: 260,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "14px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sidebarSubtitleSx = {
  mt: 0.25,
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
};

const descriptionListSx = {
  "& .MuiBox-root": {
    minHeight: 25,
  },
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

const sidebarButtonSx = {
  height: 34,
  fontSize: "11.8px",
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
