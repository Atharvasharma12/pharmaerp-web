import {
  FiArrowLeft,
  FiCalendar,
  FiCode,
  FiEdit2,
  FiHash,
  FiRefreshCw,
  FiShield,
  FiToggleLeft,
  FiUser,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppHeading,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
} from "@/components";

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const typeColorMap = {
  System: "info",
  Custom: "purple",
};

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

  clearMessage,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1240px]">
        <PageHeader
          role={role}
          onBackToAccessControl={handleBackToAccessControl}
          onBackToRoles={handleBackToRoles}
          onEdit={handleEditRole}
          onRefresh={handleRefresh}
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

        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={detailsCardSx}
        >
          {hasError ? (
            <AppErrorState
              title="Unable to load role"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          ) : isLoading && !role ? (
            <DetailsSkeleton />
          ) : !role ? (
            <AppEmptyState
              title="Role not found"
              description="This role may have been deleted or you may not have access to it."
              icon={<FiShield />}
              action={
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  startIcon={<FiArrowLeft />}
                  onClick={handleBackToRoles}
                >
                  Back to Roles
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : (
            <RoleDetailsContent role={role} />
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
  role,
  onBackToAccessControl,
  onBackToRoles,
  onEdit,
  onRefresh,
}) => (
  <div className="w-full">
    <AppBreadcrumb
      size="small"
      variant="text"
      items={[
        { label: "Access Control", onClick: onBackToAccessControl },
        { label: "Roles", onClick: onBackToRoles },
        { label: role?.displayName || "Role Details", current: true },
      ]}
      sx={breadcrumbSx}
      itemSx={breadcrumbItemSx}
      currentItemSx={breadcrumbCurrentSx}
    />

    <div className="flex w-full items-center justify-between gap-5">
      <AppStack
        direction="row"
        align="flex-start"
        gap={1.4}
        sx={{ minWidth: 0 }}
      >
        <button
          type="button"
          onClick={onBackToRoles}
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition hover:bg-surface-hover hover:text-text"
          aria-label="Back to roles"
        >
          <FiArrowLeft className="text-[17px]" />
        </button>

        <AppBox sx={{ minWidth: 0 }}>
          <AppHeading level={1} weight={800} sx={pageTitleSx}>
            {role?.displayName || "Role Details"}
          </AppHeading>

          <AppText variant="body2" sx={pageSubtitleSx}>
            View backend role fields including code, status, permissions and
            audit details.
          </AppText>
        </AppBox>
      </AppStack>

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
          startIcon={<FiRefreshCw />}
          onClick={onRefresh}
          sx={secondaryButtonSx}
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
          onClick={onEdit}
          disabled={!role?.canEdit}
          sx={primaryButtonSx}
        >
          Edit Role
        </AppButton>
      </AppStack>
    </div>
  </div>
);

const RoleDetailsContent = ({ role }) => (
  <div>
    <div className="border-b border-border px-5 py-4">
      <AppStack direction="row" align="center" justify="space-between" gap={2}>
        <AppStack direction="row" align="center" gap={1.3} sx={{ minWidth: 0 }}>
          <IconBox icon={<FiShield />} colorVariant="primary" large />

          <AppBox sx={{ minWidth: 0 }}>
            <AppHeading level={2} weight={750} sx={sectionTitleSx}>
              {role.displayName}
            </AppHeading>

            <AppText variant="body2" sx={sectionSubtitleSx}>
              {role.displayDescription}
            </AppText>
          </AppBox>
        </AppStack>

        <AppStack
          direction="row"
          align="center"
          gap={0.8}
          sx={{ flexShrink: 0 }}
        >
          <AppTag
            label={role.displayType}
            variant="soft"
            colorVariant={typeColorMap[role.displayType] || "primary"}
            rounded="md"
            sx={tagSx}
          />

          <AppStatusBadge
            status={role.displayStatus}
            label={role.displayStatus}
            variant="soft"
            size="small"
            rounded="md"
            colorVariant={statusColorMap[role.displayStatus] || "neutral"}
            sx={statusBadgeSx}
          />
        </AppStack>
      </AppStack>
    </div>

    <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-0">
      <div className="min-w-0 border-r border-border p-5">
        <AppHeading level={3} weight={700} sx={blockTitleSx}>
          Role Information
        </AppHeading>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <DetailItem icon={<FiHash />} label="Role ID" value={role._id} />
          <DetailItem
            icon={<FiCode />}
            label="Role Code"
            value={role.displayCode}
          />
          <DetailItem
            icon={<FiShield />}
            label="Role Name"
            value={role.displayName}
          />
          <DetailItem
            icon={<FiShield />}
            label="Workspace ID"
            value={role.workspaceId}
          />
          <DetailItem
            icon={<FiToggleLeft />}
            label="Type"
            value={role.displayType}
          />
          <DetailItem
            icon={<FiToggleLeft />}
            label="Editable"
            value={role.displayEditable}
          />
          <DetailItem
            icon={<FiToggleLeft />}
            label="Status"
            value={role.displayStatus}
          />
          <DetailItem
            icon={<FiShield />}
            label="Permissions Count"
            value={role.permissionCount}
          />
        </div>

        <div className="mt-5">
          <AppHeading level={3} weight={700} sx={blockTitleSx}>
            Description
          </AppHeading>

          <AppText variant="body2" sx={descriptionSx}>
            {role.displayDescription}
          </AppText>
        </div>

        <div className="mt-5">
          <AppHeading level={3} weight={700} sx={blockTitleSx}>
            Permissions
          </AppHeading>

          {role.permissions.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {role.permissions.map((permission) => (
                <AppTag
                  key={permission}
                  label={permission}
                  variant="soft"
                  colorVariant="neutral"
                  rounded="md"
                  sx={permissionTagSx}
                />
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-border bg-surface-alt px-4 py-6 text-center">
              <AppText variant="body2" sx={emptyPermissionSx}>
                No permissions assigned to this role.
              </AppText>
            </div>
          )}
        </div>
      </div>

      <div className="min-w-0 p-5">
        <AppHeading level={3} weight={700} sx={blockTitleSx}>
          Audit Details
        </AppHeading>

        <div className="mt-4 space-y-3">
          <DetailItem
            icon={<FiUser />}
            label="Created By"
            value={role.displayCreatedBy}
            full
          />
          <DetailItem
            icon={<FiCalendar />}
            label="Created At"
            value={role.displayCreatedAt}
            full
          />
          <DetailItem
            icon={<FiCalendar />}
            label="Updated At"
            value={role.displayUpdatedAt}
            full
          />
          <DetailItem
            icon={<FiCalendar />}
            label="Deleted At"
            value={role.displayDeletedAt}
            full
          />
          <DetailItem
            icon={<FiUser />}
            label="Deleted By"
            value={role.displayDeletedBy}
            full
          />
        </div>
      </div>
    </div>
  </div>
);

const DetailItem = ({ icon, label, value, full = false }) => (
  <div
    className={`rounded-lg border border-border bg-surface-alt px-3.5 py-3 ${
      full ? "w-full" : "min-w-0"
    }`}
  >
    <AppStack direction="row" align="flex-start" gap={1.1} sx={{ minWidth: 0 }}>
      <IconBox icon={icon} colorVariant="neutral" small />

      <AppBox sx={{ minWidth: 0 }}>
        <AppText variant="body2" sx={detailLabelSx}>
          {label}
        </AppText>

        <AppText variant="body2" sx={detailValueSx}>
          {value || "-"}
        </AppText>
      </AppBox>
    </AppStack>
  </div>
);

const DetailsSkeleton = () => (
  <div className="p-5">
    <div className="h-7 w-64 animate-pulse rounded bg-surface-alt" />
    <div className="mt-3 h-4 w-[420px] animate-pulse rounded bg-surface-alt" />

    <div className="mt-6 grid grid-cols-2 gap-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-[74px] animate-pulse rounded-lg border border-border bg-surface-alt"
        />
      ))}
    </div>

    <div className="mt-6 h-28 animate-pulse rounded-lg border border-border bg-surface-alt" />
  </div>
);

const IconBox = ({
  icon,
  colorVariant = "primary",
  small = false,
  large = false,
}) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 44 : small ? 32 : 38,
      height: large ? 44 : small ? 32 : 38,
      minWidth: large ? 44 : small ? 32 : 38,
      borderRadius: large ? "12px" : small ? "9px" : "11px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "22px" : small ? "15px" : "18px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const breadcrumbSx = {
  mb: 1.1,
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

const pageTitleSx = {
  m: 0,
  fontSize: "25px",
  lineHeight: 1.15,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
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

const alertSx = { mt: 3 };

const detailsCardSx = {
  mt: 4,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "18px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.45,
  maxWidth: 720,
  fontSize: "12.5px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const blockTitleSx = {
  m: 0,
  fontSize: "14px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const tagSx = {
  width: "fit-content",
  height: 24,
  px: 0.9,
  fontSize: "11px",
  fontWeight: 700,
};

const statusBadgeSx = {
  width: "fit-content",
  height: 24,
  px: 1,
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "capitalize",
};

const detailLabelSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};

const detailValueSx = {
  mt: 0.45,
  maxWidth: "100%",
  overflowWrap: "anywhere",
  fontSize: "12.5px",
  lineHeight: "19px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const descriptionSx = {
  mt: 3,
  rounded: "md",
  fontSize: "12.5px",
  lineHeight: "22px",
  color: "var(--app-color-text-muted)",
};

const permissionTagSx = {
  minHeight: 25,
  px: 0.9,
  fontSize: "11px",
  fontWeight: 650,
};

const emptyPermissionSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const stateSx = { minHeight: 430 };

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default RoleDetailsDesktopPage;
