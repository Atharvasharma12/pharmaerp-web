// src/features/workspace/pages/desktop/WorkspaceDetailsDesktopPage.jsx

import { memo, useMemo } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiEdit2,
  FiGlobe,
  FiHash,
  FiImage,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCcw,
  FiSend,
  FiSettings,
  FiShield,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import {
  AppAvatar,
  AppBadge,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppDescriptionList,
  AppEmptyState,
  AppGrid,
  AppHeading,
  AppKeyValue,
  AppPageLoader,
  AppStack,
  AppStatusBadge,
  AppText,
} from "@/components";

const WorkspaceDetailsDesktopPage = memo(
  ({
    workspace,

    isLoading = false,
    isDeleting = false,
    hasError = false,
    error,

    handleBack,
    handleRefresh,
    handleEditWorkspace,
    handleManageMembers,
    handleManageInvitations,
    handleInviteMember,
    handleDeleteWorkspace,
  }) => {
    const breadcrumbItems = useMemo(
      () => [
        { label: "Workspace", onClick: handleBack },
        { label: "Workspace Details", current: true },
      ],
      [handleBack],
    );

    const basicItems = useMemo(
      () => [
        {
          key: "workspaceCode",
          label: "Workspace Code",
          value: workspace?.workspaceCode || "-",
          icon: <FiHash />,
        },
        {
          key: "slug",
          label: "Slug",
          value: workspace?.slug || "-",
          icon: <FiGlobe />,
        },
        {
          key: "type",
          label: "Type",
          value: workspace?.displayType || "-",
          icon: <FiBriefcase />,
        },
        {
          key: "status",
          label: "Status",
          value: (
            <AppStatusBadge
              status={workspace?.status || "active"}
              variant="soft"
              rounded="full"
              size="small"
            />
          ),
          icon: <FiShield />,
        },
      ],
      [workspace],
    );

    const contactItems = useMemo(
      () => [
        {
          key: "email",
          label: "Email",
          value: workspace?.email || "-",
          icon: <FiMail />,
        },
        {
          key: "phone",
          label: "Phone",
          value: workspace?.phone || "-",
          icon: <FiPhone />,
        },
        {
          key: "address",
          label: "Address",
          value: workspace?.displayAddress || "-",
          icon: <FiMapPin />,
        },
      ],
      [workspace],
    );

    const settingsItems = useMemo(
      () => [
        {
          key: "timezone",
          label: "Timezone",
          value: workspace?.settings?.timezone || "-",
          icon: <FiClock />,
        },
        {
          key: "currency",
          label: "Currency",
          value: workspace?.settings?.currency || "-",
          icon: <FiSettings />,
        },
        {
          key: "dateFormat",
          label: "Date Format",
          value: workspace?.settings?.dateFormat || "-",
          icon: <FiCalendar />,
        },
        {
          key: "timeFormat",
          label: "Time Format",
          value: workspace?.settings?.timeFormat || "-",
          icon: <FiClock />,
        },
      ],
      [workspace],
    );

    const auditItems = useMemo(
      () => [
        {
          key: "createdAt",
          label: "Created At",
          value: workspace?.displayCreatedAtTime || "-",
        },
        {
          key: "updatedAt",
          label: "Updated At",
          value: workspace?.displayUpdatedAtTime || "-",
        },
        {
          key: "deletedAt",
          label: "Deleted At",
          value: workspace?.displayDeletedAtTime || "-",
        },
        {
          key: "deletedBy",
          label: "Deleted By",
          value: workspace?.deletedBy || "-",
        },
      ],
      [workspace],
    );

    if (isLoading) {
      return <AppPageLoader text="Loading workspace details..." />;
    }

    if (hasError) {
      return (
        <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
          <div className="mx-auto w-full max-w-[900px]">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={stateCardSx}
            >
              <AppEmptyState
                title="Unable to load workspace"
                description={error || "Please refresh and try again."}
                icon={<FiBriefcase />}
                action={
                  <AppButton
                    type="button"
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={<FiRefreshCcw />}
                    onClick={handleRefresh}
                  >
                    Retry
                  </AppButton>
                }
              />
            </AppCard>
          </div>
        </section>
      );
    }

    if (!workspace) {
      return (
        <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
          <div className="mx-auto w-full max-w-[900px]">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={stateCardSx}
            >
              <AppEmptyState
                title="No workspace selected"
                description="Go back and select a workspace to view details."
                icon={<FiBriefcase />}
                action={
                  <AppButton
                    type="button"
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={<FiArrowLeft />}
                    onClick={handleBack}
                  >
                    Back to Workspace
                  </AppButton>
                }
              />
            </AppCard>
          </div>
        </section>
      );
    }

    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 pb-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="sticky top-0 z-30 -mx-5 mb-3 flex w-[calc(100%+40px)] items-center justify-between border-b border-border bg-bg/95 px-5 py-2 backdrop-blur">
            <AppStack direction="row" align="center" gap={1}>
              <IconBox icon={<FiBriefcase />} large />

              <AppBox>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  Workspace Details
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
                startIcon={<FiArrowLeft />}
                onClick={handleBack}
                disabled={isDeleting}
                sx={toolbarButtonSx}
              >
                Back
              </AppButton>

              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiRefreshCcw />}
                onClick={handleRefresh}
                disabled={isDeleting}
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
                startIcon={<FiEdit2 />}
                onClick={handleEditWorkspace}
                disabled={isDeleting}
                sx={primaryButtonSx}
              >
                Edit Workspace
              </AppButton>
            </AppStack>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-3.5">
            <div>
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="sm"
                padding="none"
                sx={heroCardSx}
              >
                <AppStack
                  direction="row"
                  align="center"
                  justify="space-between"
                >
                  <AppStack direction="row" align="center" gap={1.3}>
                    <AppAvatar
                      src={workspace.logo?.url || ""}
                      name={workspace.name}
                      size="large"
                      variant="rounded"
                      colorVariant="primary"
                      bordered
                    />

                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading level={1} weight={750} sx={heroTitleSx}>
                        {workspace.name}
                      </AppHeading>

                      <AppStack
                        direction="row"
                        align="center"
                        gap={0.75}
                        wrap="wrap"
                        sx={{ mt: 0.65 }}
                      >
                        <AppBadge
                          label={workspace.displayType}
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

                        <AppBadge
                          label={workspace.workspaceCode || "No code"}
                          variant="outlined"
                          colorVariant="neutral"
                          rounded="full"
                          size="small"
                        />
                      </AppStack>
                    </AppBox>
                  </AppStack>

                  <AppBox sx={heroDateSx}>
                    <AppText variant="caption" sx={heroDateLabelSx}>
                      Last Updated
                    </AppText>
                    <AppText variant="body2" weight={700} sx={heroDateValueSx}>
                      {workspace.displayUpdatedAt || "-"}
                    </AppText>
                  </AppBox>
                </AppStack>
              </AppCard>

              <AppGrid columns={2} gap={1.5} sx={{ mt: 1.5 }}>
                <DetailSection
                  icon={<FiBriefcase />}
                  title="Basic Information"
                  description="Workspace identity and status."
                  items={basicItems}
                />

                <DetailSection
                  icon={<FiMail />}
                  title="Contact & Address"
                  description="Communication and address details."
                  items={contactItems}
                />
              </AppGrid>

              <AppGrid columns={2} gap={1.5} sx={{ mt: 1.5 }}>
                <DetailSection
                  icon={<FiSettings />}
                  title="Settings"
                  description="Regional and display preferences."
                  items={settingsItems}
                />

                <DetailSection
                  icon={<FiCalendar />}
                  title="Audit Information"
                  description="Creation, update and deletion metadata."
                  items={auditItems}
                />
              </AppGrid>

              {workspace.logo?.url ? (
                <AppCard
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="sm"
                  padding="none"
                  sx={logoCardSx}
                >
                  <AppStack direction="row" align="center" gap={1}>
                    <IconBox icon={<FiImage />} />

                    <AppBox>
                      <AppHeading level={2} weight={700} sx={sectionTitleSx}>
                        Workspace Logo
                      </AppHeading>

                      <AppText variant="body2" sx={sectionSubtitleSx}>
                        Logo URL and cloud image reference.
                      </AppText>
                    </AppBox>
                  </AppStack>

                  <AppGrid columns={2} gap={1.25} sx={{ mt: 1.2 }}>
                    <AppKeyValue
                      label="Logo URL"
                      value={workspace.logo.url}
                      direction="column"
                      size="small"
                      sx={keyValueBoxSx}
                      labelSx={keyLabelSx}
                      valueSx={keyValueSx}
                    />

                    <AppKeyValue
                      label="Public ID"
                      value={workspace.logo.publicId || "-"}
                      direction="column"
                      size="small"
                      sx={keyValueBoxSx}
                      labelSx={keyLabelSx}
                      valueSx={keyValueSx}
                    />
                  </AppGrid>
                </AppCard>
              ) : null}
            </div>

            <DetailsSidebar
              workspace={workspace}
              isDeleting={isDeleting}
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

WorkspaceDetailsDesktopPage.displayName = "WorkspaceDetailsDesktopPage";

const DetailSection = memo(({ icon, title, description, items }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={detailCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={icon} />

      <AppBox>
        <AppHeading level={2} weight={700} sx={sectionTitleSx}>
          {title}
        </AppHeading>

        <AppText variant="body2" sx={sectionSubtitleSx}>
          {description}
        </AppText>
      </AppBox>
    </AppStack>

    <AppDescriptionList
      items={items}
      columns={1}
      size="small"
      dense
      sx={descriptionListSx}
      itemSx={descriptionItemSx}
    />
  </AppCard>
));

DetailSection.displayName = "DetailSection";

const DetailsSidebar = memo(
  ({
    workspace,
    isDeleting,
    onEdit,
    onMembers,
    onInvitations,
    onInvite,
    onDelete,
  }) => (
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

          <AppBox>
            <AppHeading level={2} weight={700} sx={sidebarTitleSx}>
              Workspace Actions
            </AppHeading>

            <AppText variant="body2" sx={sidebarSubtitleSx}>
              Manage settings, members and invitations.
            </AppText>
          </AppBox>
        </AppStack>

        <div className="my-3 h-px bg-border" />

        <AppStack direction="column" gap={0.8}>
          <AppButton
            type="button"
            variant="contained"
            colorVariant="primary"
            rounded="md"
            size="small"
            fullWidth
            startIcon={<FiEdit2 />}
            onClick={onEdit}
            disabled={isDeleting}
            sx={sidebarButtonSx}
          >
            Edit Workspace
          </AppButton>

          <AppButton
            type="button"
            variant="outlined"
            colorVariant="primary"
            rounded="md"
            size="small"
            fullWidth
            startIcon={<FiUsers />}
            onClick={onMembers}
            disabled={isDeleting}
            sx={sidebarButtonSx}
          >
            Manage Members
          </AppButton>

          <AppButton
            type="button"
            variant="outlined"
            colorVariant="warning"
            rounded="md"
            size="small"
            fullWidth
            startIcon={<FiSend />}
            onClick={onInvitations}
            disabled={isDeleting}
            sx={sidebarButtonSx}
          >
            View Invitations
          </AppButton>

          <AppButton
            type="button"
            variant="soft"
            colorVariant="info"
            rounded="md"
            size="small"
            fullWidth
            startIcon={<FiMail />}
            onClick={onInvite}
            disabled={isDeleting}
            sx={sidebarButtonSx}
          >
            Invite Member
          </AppButton>

          <AppButton
            type="button"
            variant="soft"
            colorVariant="error"
            rounded="md"
            size="small"
            fullWidth
            startIcon={<FiTrash2 />}
            onClick={onDelete}
            loading={isDeleting}
            disabled={isDeleting}
            sx={sidebarButtonSx}
          >
            Delete Workspace
          </AppButton>
        </AppStack>

        <AppBox sx={sidebarNoteSx}>
          <AppText variant="body2" weight={700} sx={sidebarNoteTitleSx}>
            Owner-only controls
          </AppText>

          <AppText variant="caption" sx={sidebarNoteTextSx}>
            Backend permissions decide whether edit, delete and invite actions
            are allowed for this workspace.
          </AppText>
        </AppBox>

        <AppBox sx={quickMetaSx}>
          <AppKeyValue
            label="Workspace ID"
            value={workspace._id || "-"}
            direction="column"
            size="small"
            labelSx={quickMetaLabelSx}
            valueSx={quickMetaValueSx}
          />
        </AppBox>
      </AppCard>
    </aside>
  ),
);

DetailsSidebar.displayName = "DetailsSidebar";

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
  height: 30,
  px: 1.25,
  fontSize: "11px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
};

const primaryButtonSx = {
  height: 30,
  px: 1.5,
  fontSize: "11px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

const stateCardSx = {
  mt: 8,
  px: 3,
  py: 3,
  bgcolor: "var(--app-color-surface)",
};

const heroCardSx = {
  px: 1.8,
  py: 1.6,
  bgcolor: "var(--app-color-surface)",
};

const heroTitleSx = {
  m: 0,
  maxWidth: 680,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "22px",
  lineHeight: 1.1,
  letterSpacing: "-0.35px",
  color: "var(--app-color-text)",
};

const heroDateSx = {
  minWidth: 150,
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
  textAlign: "right",
};

const heroDateLabelSx = {
  display: "block",
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const heroDateValueSx = {
  mt: 0.25,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const detailCardSx = {
  px: 1.45,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "13.4px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.25,
  fontSize: "10.8px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const descriptionListSx = {
  mt: 1.15,
};

const descriptionItemSx = {
  minHeight: 31,
  borderBottom: "1px solid var(--app-color-border)",
  "&:last-of-type": {
    borderBottom: 0,
  },
};

const logoCardSx = {
  mt: 1.5,
  px: 1.45,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
};

const keyValueBoxSx = {
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const keyLabelSx = {
  fontSize: "10.8px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
};

const keyValueSx = {
  mt: 0.4,
  fontSize: "11.4px",
  lineHeight: "16px",
  color: "var(--app-color-text)",
  overflowWrap: "anywhere",
};

const sidebarCardSx = {
  px: 1.45,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
};

const sidebarTitleSx = {
  m: 0,
  fontSize: "13.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sidebarSubtitleSx = {
  mt: 0.3,
  fontSize: "10.8px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const sidebarButtonSx = {
  height: 34,
  fontSize: "11.7px",
  fontWeight: 700,
};

const sidebarNoteSx = {
  mt: 1.25,
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-readonly-bg)",
};

const sidebarNoteTitleSx = {
  m: 0,
  fontSize: "11.4px",
  lineHeight: "15px",
  color: "var(--app-color-text)",
};

const sidebarNoteTextSx = {
  display: "block",
  mt: 0.45,
  fontSize: "10.6px",
  lineHeight: "14.5px",
  color: "var(--app-color-text-muted)",
};

const quickMetaSx = {
  mt: 1.25,
  p: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const quickMetaLabelSx = {
  fontSize: "10.5px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
};

const quickMetaValueSx = {
  mt: 0.35,
  fontSize: "10.8px",
  lineHeight: "14.5px",
  color: "var(--app-color-text)",
  overflowWrap: "anywhere",
};

export default WorkspaceDetailsDesktopPage;
