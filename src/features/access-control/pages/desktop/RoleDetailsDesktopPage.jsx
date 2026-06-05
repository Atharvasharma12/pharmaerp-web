// src/features/access-control/pages/desktop/RoleDetailsDesktopPage.jsx

import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiCopy,
  FiEdit3,
  FiHash,
  FiInfo,
  FiKey,
  FiLayers,
  FiLock,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiUnlock,
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
  AppFormSkeleton,
  AppHeading,
  AppKeyValue,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
} from "@/components";

const statIcons = {
  total: <FiKey />,
  groups: <FiLayers />,
  type: <FiShield />,
  status: <FiCheckCircle />,
};

const statusColorMap = {
  active: "success",
  inactive: "warning",
};

const RoleDetailsDesktopPage = ({
  role,
  permissionStats = [],

  isLoading = false,
  isFetchingRole = false,
  isDeletingRole = false,
  hasError = false,
  error,
  message,

  handleRefresh,
  handleBack,
  handleEditRole,
  handleViewPermissions,
  handleCreateRole,
  handleDeleteRole,

  clearMessage,
}) => {
  const showInitialSkeleton = isFetchingRole && !role;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1380px]">
        <PageHeader
          role={role}
          isLoading={isLoading}
          onBack={handleBack}
          onRefresh={handleRefresh}
          onEdit={handleEditRole}
          onViewPermissions={handleViewPermissions}
        />

        {error && !hasError ? (
          <AppAlert
            severity="error"
            variant="soft"
            title="Something went wrong"
            rounded="md"
            closable
            onClose={handleRefresh}
            sx={alertSx}
          >
            {error}
          </AppAlert>
        ) : null}

        {showInitialSkeleton ? (
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={loadingCardSx}
          >
            <AppFormSkeleton rows={8} />
          </AppCard>
        ) : hasError ? (
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={stateCardSx}
          >
            <AppErrorState
              title="Unable to load role"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
            />
          </AppCard>
        ) : !role ? (
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={stateCardSx}
          >
            <AppEmptyState
              title="Role not found"
              description="The selected role could not be loaded."
              icon={<FiShield />}
              action={
                <AppButton
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  startIcon={<FiArrowLeft />}
                  onClick={handleBack}
                >
                  Back to Roles
                </AppButton>
              }
              size="page"
            />
          </AppCard>
        ) : (
          <>
            <HeroCard
              role={role}
              isDeletingRole={isDeletingRole}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
              onCreate={handleCreateRole}
            />

            <StatsGrid stats={permissionStats} />

            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_390px] gap-4">
              <PermissionCard
                role={role}
                onViewPermissions={handleViewPermissions}
              />

              <AppStack direction="column" gap={1.5}>
                <RoleMetaCard role={role} />
                <AccessRulesCard role={role} />
              </AppStack>
            </div>
          </>
        )}
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
  isLoading,
  onBack,
  onRefresh,
  onEdit,
  onViewPermissions,
}) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiShield />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Role Details
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Access Control", href: "/access-control" },
            { label: "Roles", onClick: onBack },
            { label: role?.displayName || "Details", current: true },
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
        Roles
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
        startIcon={<FiKey />}
        onClick={onViewPermissions}
        sx={secondaryButtonSx}
      >
        Permissions
      </AppButton>

      <AppButton
        type="button"
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiEdit3 />}
        onClick={onEdit}
        disabled={!role?.canEdit || isLoading}
        sx={primaryButtonSx}
      >
        Edit Role
      </AppButton>
    </AppStack>
  </AppStack>
);

const HeroCard = ({ role, isDeletingRole, onEdit, onDelete, onCreate }) => (
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
      align="flex-start"
      justify="space-between"
      gap={2}
    >
      <AppStack
        direction="row"
        align="flex-start"
        gap={1.3}
        sx={{ minWidth: 0 }}
      >
        <IconBox
          icon={role?.isSystem ? <FiLock /> : <FiUnlock />}
          large
          colorVariant={role?.isSystem ? "info" : "primary"}
        />

        <AppBox sx={{ minWidth: 0 }}>
          <AppStack
            direction="row"
            align="center"
            gap={0.7}
            sx={{ flexWrap: "wrap" }}
          >
            <AppHeading level={2} weight={700} sx={heroTitleSx}>
              {role?.displayName || "Role"}
            </AppHeading>

            <AppStatusBadge
              status={role?.displayStatus || "inactive"}
              label={role?.displayStatus || "inactive"}
              variant="soft"
              size="small"
              rounded="full"
              colorVariant={statusColorMap[role?.displayStatus] || "neutral"}
            />

            <AppTag
              label={role?.displayType || "Custom"}
              variant="soft"
              colorVariant={role?.isSystem ? "info" : "primary"}
              size="small"
              rounded="full"
              icon={role?.isSystem ? <FiLock /> : <FiUnlock />}
            />

            <AppTag
              label={role?.displayEditable || "Locked"}
              variant="soft"
              colorVariant={role?.isEditable ? "success" : "neutral"}
              size="small"
              rounded="full"
            />
          </AppStack>

          <AppKeyValue
            label="Code"
            value={role?.displayCode || "-"}
            dense
            sx={codeKeyValueSx}
            labelSx={codeLabelSx}
            valueSx={codeValueSx}
          />

          <AppText variant="body2" sx={heroDescriptionSx}>
            {role?.displayDescription || "No description added."}
          </AppText>
        </AppBox>
      </AppStack>

      <AppStack direction="row" align="center" gap={0.8} sx={{ flexShrink: 0 }}>
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          startIcon={<FiPlus />}
          onClick={onCreate}
          sx={secondaryButtonSx}
        >
          New Role
        </AppButton>

        <AppButton
          type="button"
          variant="outlined"
          colorVariant="primary"
          rounded="md"
          size="small"
          startIcon={<FiEdit3 />}
          onClick={onEdit}
          disabled={!role?.canEdit}
          sx={secondaryButtonSx}
        >
          Edit
        </AppButton>

        <AppButton
          type="button"
          variant="outlined"
          colorVariant="error"
          rounded="md"
          size="small"
          startIcon={<FiTrash2 />}
          onClick={onDelete}
          loading={isDeletingRole}
          disabled={!role?.canDelete || isDeletingRole}
          sx={secondaryButtonSx}
        >
          Delete
        </AppButton>
      </AppStack>
    </AppStack>

    {role?.isSystem ? (
      <AppAlert
        severity="info"
        variant="soft"
        rounded="md"
        title="System role"
        sx={heroAlertSx}
      >
        This role is created by the backend as a default workspace role. System
        roles cannot be deleted.
      </AppAlert>
    ) : null}

    {!role?.isEditable ? (
      <AppAlert
        severity="warning"
        variant="soft"
        rounded="md"
        title="Role is locked"
        sx={heroAlertSx}
      >
        The backend marks this role as non-editable, so updates are disabled.
      </AppAlert>
    ) : null}
  </AppCard>
);

const StatsGrid = ({ stats }) => (
  <div className="mt-3 grid grid-cols-4 gap-3">
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
        icon={statIcons[stat.id] || <FiShield />}
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

const PermissionCard = ({ role, onViewPermissions }) => {
  const groups = Object.entries(role?.groupedPermissions || {});

  return (
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={mainCardSx}
    >
      <AppStack
        direction="row"
        align="flex-start"
        justify="space-between"
        gap={1.5}
      >
        <AppStack direction="row" align="center" gap={1}>
          <IconBox icon={<FiKey />} />

          <AppBox>
            <AppHeading level={2} weight={650} sx={sectionTitleSx}>
              Assigned Permissions
            </AppHeading>

            <AppText variant="body2" sx={sectionSubtitleSx}>
              {role?.permissionCount || 0} permissions across{" "}
              {role?.permissionGroupCount || 0} groups.
            </AppText>
          </AppBox>
        </AppStack>

        <AppButton
          type="button"
          variant="outlined"
          colorVariant="primary"
          rounded="md"
          size="small"
          startIcon={<FiKey />}
          onClick={onViewPermissions}
          sx={secondaryButtonSx}
        >
          Permission Catalog
        </AppButton>
      </AppStack>

      {!role?.permissionCount ? (
        <div className="mt-5">
          <AppEmptyState
            title="No permissions assigned"
            description="This role currently has no permissions. Edit the role to assign permissions."
            icon={<FiKey />}
            size="content"
            sx={emptyPermissionSx}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {groups.map(([group, permissions]) => (
            <PermissionGroup
              key={group}
              group={group}
              permissions={permissions}
            />
          ))}
        </div>
      )}
    </AppCard>
  );
};

const PermissionGroup = ({ group, permissions = [] }) => (
  <div className="rounded-xl border border-border bg-surface-alt/70 p-3">
    <AppStack direction="row" align="center" justify="space-between" gap={1}>
      <AppHeading level={3} weight={650} sx={groupTitleSx}>
        {group}
      </AppHeading>

      <AppTag
        label={`${permissions.length} permission${permissions.length === 1 ? "" : "s"}`}
        variant="soft"
        colorVariant="neutral"
        size="small"
        rounded="full"
      />
    </AppStack>

    <AppStack direction="row" align="center" gap={0.65} sx={permissionTagsSx}>
      {permissions.map((permission) => (
        <AppTag
          key={permission.value}
          label={permission.label}
          variant="soft"
          colorVariant="primary"
          size="small"
          rounded="full"
        />
      ))}
    </AppStack>
  </div>
);

const RoleMetaCard = ({ role }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sideCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiInfo />} colorVariant="info" />

      <AppBox>
        <AppHeading level={2} weight={650} sx={sideTitleSx}>
          Role Metadata
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          Backend role fields and audit details.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2">
      <AppKeyValue label="Role ID" value={role?._id || "-"} icon={<FiCopy />} />
      <AppKeyValue
        label="Name"
        value={role?.displayName || "-"}
        icon={<FiShield />}
      />
      <AppKeyValue
        label="Code"
        value={role?.displayCode || "-"}
        icon={<FiHash />}
      />
      <AppKeyValue
        label="Status"
        value={role?.displayStatus || "-"}
        icon={<FiCheckCircle />}
      />
      <AppKeyValue
        label="Type"
        value={role?.displayType || "-"}
        icon={<FiLock />}
      />
      <AppKeyValue
        label="Editable"
        value={role?.displayEditable || "-"}
        icon={<FiUnlock />}
      />
      <AppKeyValue
        label="Created By"
        value={role?.displayCreatedBy || "-"}
        icon={<FiUser />}
      />
      <AppKeyValue
        label="Created At"
        value={role?.displayCreatedAtTime || "-"}
        icon={<FiCalendar />}
      />
      <AppKeyValue
        label="Updated At"
        value={role?.displayUpdatedAt || "-"}
        icon={<FiRefreshCw />}
      />
    </div>
  </AppCard>
);

const AccessRulesCard = ({ role }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sideCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiAlertTriangle />} colorVariant="warning" />

      <AppBox>
        <AppHeading level={2} weight={650} sx={sideTitleSx}>
          Backend Rules
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          Role actions follow server-side constraints.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2">
      <RuleItem
        icon={role?.canEdit ? <FiCheckCircle /> : <FiLock />}
        title={role?.canEdit ? "Editable" : "Editing disabled"}
        description={
          role?.canEdit
            ? "This role can be updated by the workspace owner."
            : "System non-editable roles cannot be updated."
        }
        colorVariant={role?.canEdit ? "success" : "warning"}
      />

      <RuleItem
        icon={role?.canDelete ? <FiTrash2 /> : <FiLock />}
        title={role?.canDelete ? "Deletable" : "Delete disabled"}
        description={
          role?.canDelete
            ? "This custom role can be soft deleted."
            : "System roles cannot be deleted."
        }
        colorVariant={role?.canDelete ? "error" : "warning"}
      />

      <RuleItem
        icon={<FiKey />}
        title="Permissions are validated"
        description="Only permissions returned from the backend catalog are allowed."
        colorVariant="info"
      />
    </div>
  </AppCard>
);

const RuleItem = ({ icon, title, description, colorVariant = "primary" }) => (
  <div className="rounded-xl border border-border bg-surface-alt/70 px-3 py-2.5">
    <AppStack direction="row" align="flex-start" gap={1}>
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[14px]"
        style={{
          background: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
          color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
        }}
      >
        {icon}
      </span>

      <AppBox>
        <AppHeading level={3} weight={650} sx={ruleTitleSx}>
          {title}
        </AppHeading>

        <AppText variant="body2" sx={ruleDescriptionSx}>
          {description}
        </AppText>
      </AppBox>
    </AppStack>
  </div>
);

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
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "22px" : "19px",
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

const alertSx = {
  mt: 3,
};

const loadingCardSx = {
  mt: 4,
  p: 2.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const stateCardSx = {
  mt: 4,
  minHeight: 430,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const heroCardSx = {
  mt: 4,
  px: 1.7,
  py: 1.55,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const heroTitleSx = {
  m: 0,
  maxWidth: 520,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "23px",
  lineHeight: 1.15,
  letterSpacing: "-0.35px",
  color: "var(--app-color-text)",
};

const codeKeyValueSx = {
  mt: 0.6,
  mb: 0,
  alignItems: "center",
  gap: 0.6,
};

const codeLabelSx = {
  minWidth: 34,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const codeValueSx = {
  maxWidth: 460,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11.8px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const heroDescriptionSx = {
  mt: 0.8,
  maxWidth: 720,
  fontSize: "12.2px",
  lineHeight: 1.55,
  color: "var(--app-color-text-muted)",
};

const heroAlertSx = {
  mt: 1.35,
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
  maxWidth: 150,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "25px",
  lineHeight: 1.05,
  color: "var(--app-color-text)",
};

const statDescriptionSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const mainCardSx = {
  minHeight: 480,
  px: 1.7,
  py: 1.55,
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

const emptyPermissionSx = {
  minHeight: 300,
};

const groupTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const permissionTagsSx = {
  mt: 1.1,
  flexWrap: "wrap",
};

const sideCardSx = {
  px: 1.45,
  py: 1.4,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sideTitleSx = {
  m: 0,
  fontSize: "15px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sideSubtitleSx = {
  mt: 0.25,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const ruleTitleSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const ruleDescriptionSx = {
  mt: 0.3,
  fontSize: "11.2px",
  lineHeight: 1.45,
  color: "var(--app-color-text-muted)",
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default RoleDetailsDesktopPage;
