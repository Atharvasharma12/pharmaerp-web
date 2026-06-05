// src/features/access-control/pages/desktop/CreateRoleDesktopPage.jsx

import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiHash,
  FiInfo,
  FiKey,
  FiList,
  FiRefreshCcw,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiSliders,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppKeyValue,
  AppMultiSelect,
  AppStack,
  AppTag,
  AppTextarea,
  AppText,
} from "@/components";

const CreateRoleDesktopPage = ({
  formData,
  formErrors = {},
  permissionOptions = [],
  selectedPermissionOptions = [],
  permissionSummary,
  previewRole,

  isLoading = false,
  isCreating = false,
  isLoadingPermissions = false,
  hasPermissionError = false,
  error,
  message,

  handleChange,
  handlePermissionsChange,
  handleSelectAllPermissions,
  handleClearPermissions,
  handleSubmit,
  handleReset,
  handleBack,
  handleViewPermissions,
  handleRefreshPermissions,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1380px]">
        <PageHeader
          isLoading={isLoading}
          onBack={handleBack}
          onViewPermissions={handleViewPermissions}
        />

        {message ? (
          <AppAlert
            severity="success"
            variant="soft"
            title={message}
            rounded="md"
            sx={alertSx}
          />
        ) : null}

        {error && !formErrors.submit ? (
          <AppAlert
            severity="error"
            variant="soft"
            title="Something went wrong"
            rounded="md"
            sx={alertSx}
          >
            {error}
          </AppAlert>
        ) : null}

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_390px] gap-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={formCardSx}
          >
            <AppBox component="form" onSubmit={handleSubmit}>
              <AppStack direction="row" align="flex-start" gap={1.2}>
                <IconBox icon={<FiShield />} large />

                <AppBox sx={{ minWidth: 0, flex: 1 }}>
                  <AppHeading level={2} weight={650} sx={sectionTitleSx}>
                    Create Workspace Role
                  </AppHeading>

                  <AppText variant="body2" sx={sectionSubtitleSx}>
                    Define a custom role for this workspace and choose the exact
                    permissions the role should receive.
                  </AppText>
                </AppBox>
              </AppStack>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <AppInput
                  label="Role Name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Example: Store Manager"
                  fullWidth
                  required
                  size="small"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiShield />}
                  error={Boolean(formErrors.name)}
                  helperText={
                    formErrors.name ||
                    "Use 2 to 80 characters for the role name."
                  }
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                />

                <AppInput
                  label="Role Code"
                  name="code"
                  value={formData.code || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Auto-generated or custom code"
                  fullWidth
                  size="small"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiHash />}
                  error={Boolean(formErrors.code)}
                  helperText={
                    formErrors.code ||
                    "Optional. Lowercase letters, numbers and underscores only."
                  }
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                />
              </div>

              <AppTextarea
                label="Description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Describe what this role is allowed to do"
                fullWidth
                size="small"
                variant="bordered"
                rounded="md"
                minRows={4}
                maxRows={6}
                showCount
                maxLength={500}
                error={Boolean(formErrors.description)}
                helperText={
                  formErrors.description || "Optional. Maximum 500 characters."
                }
                sx={{ mt: 3 }}
                labelSx={labelSx}
                inputSx={textareaSx}
                helperTextSx={helperTextSx}
              />

              <PermissionsSection
                formData={formData}
                formErrors={formErrors}
                permissionOptions={permissionOptions}
                selectedPermissionOptions={selectedPermissionOptions}
                isLoading={isLoading}
                isLoadingPermissions={isLoadingPermissions}
                hasPermissionError={hasPermissionError}
                onPermissionsChange={handlePermissionsChange}
                onSelectAll={handleSelectAllPermissions}
                onClear={handleClearPermissions}
                onRefresh={handleRefreshPermissions}
              />

              {formErrors.submit ? (
                <AppAlert
                  severity="error"
                  variant="soft"
                  rounded="md"
                  sx={submitAlertSx}
                >
                  {formErrors.submit}
                </AppAlert>
              ) : null}

              <AppStack
                direction="row"
                align="center"
                justify="space-between"
                gap={1.2}
                sx={actionsSx}
              >
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  startIcon={<FiRefreshCcw />}
                  onClick={handleReset}
                  disabled={isLoading}
                  sx={secondaryButtonSx}
                >
                  Reset
                </AppButton>

                <AppStack direction="row" align="center" gap={1}>
                  <AppButton
                    type="button"
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    startIcon={<FiArrowLeft />}
                    onClick={handleBack}
                    disabled={isCreating}
                    sx={secondaryButtonSx}
                  >
                    Back
                  </AppButton>

                  <AppButton
                    type="submit"
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={<FiSave />}
                    loading={isCreating}
                    disabled={isLoadingPermissions || isCreating}
                    sx={primaryButtonSx}
                  >
                    Create Role
                  </AppButton>
                </AppStack>
              </AppStack>
            </AppBox>
          </AppCard>

          <AppStack direction="column" gap={1.5}>
            <RolePreviewCard previewRole={previewRole} />
            <PermissionSummaryCard summary={permissionSummary} />
            <RoleInfoCard onViewPermissions={handleViewPermissions} />
          </AppStack>
        </div>
      </div>
    </section>
  );
};

const PageHeader = ({ isLoading, onBack, onViewPermissions }) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiShield />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Create Role
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Access Control", href: "/access-control" },
            { label: "Roles", href: "/access-control/roles" },
            { label: "Create", current: true },
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
        disabled={isLoading}
        sx={secondaryButtonSx}
      >
        Back to Roles
      </AppButton>

      <AppButton
        type="button"
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiKey />}
        onClick={onViewPermissions}
        disabled={isLoading}
        sx={primaryButtonSx}
      >
        View Permissions
      </AppButton>
    </AppStack>
  </AppStack>
);

const PermissionsSection = ({
  formData,
  formErrors,
  permissionOptions,
  selectedPermissionOptions,
  isLoading,
  isLoadingPermissions,
  hasPermissionError,
  onPermissionsChange,
  onSelectAll,
  onClear,
  onRefresh,
}) => (
  <AppCard
    variant="soft"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={permissionCardSx}
  >
    <AppStack
      direction="row"
      align="flex-start"
      justify="space-between"
      gap={1.5}
    >
      <AppStack direction="row" align="center" gap={1}>
        <IconBox icon={<FiSliders />} colorVariant="info" />

        <AppBox>
          <AppHeading level={3} weight={650} sx={innerTitleSx}>
            Permissions
          </AppHeading>

          <AppText variant="body2" sx={innerSubtitleSx}>
            Select permissions from the backend permission registry.
          </AppText>
        </AppBox>
      </AppStack>

      <AppStack direction="row" align="center" gap={0.7}>
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          onClick={onClear}
          disabled={isLoading || !formData.permissions?.length}
          sx={miniButtonSx}
        >
          Clear
        </AppButton>

        <AppButton
          type="button"
          variant="outlined"
          colorVariant="primary"
          rounded="md"
          size="small"
          onClick={onSelectAll}
          disabled={isLoading || !permissionOptions.length}
          sx={miniButtonSx}
        >
          Select All
        </AppButton>

        <AppButton
          type="button"
          variant="soft"
          colorVariant="primary"
          rounded="md"
          size="small"
          startIcon={<FiRefreshCw />}
          onClick={onRefresh}
          loading={isLoadingPermissions}
          disabled={isLoadingPermissions}
          sx={miniButtonSx}
        >
          Refresh
        </AppButton>
      </AppStack>
    </AppStack>

    {hasPermissionError ? (
      <AppAlert
        severity="error"
        variant="soft"
        title="Unable to load permissions"
        rounded="md"
        sx={permissionAlertSx}
      >
        Refresh permissions and try again before creating a role.
      </AppAlert>
    ) : null}

    <AppMultiSelect
      label="Role Permissions"
      name="permissions"
      value={formData.permissions || []}
      onChange={onPermissionsChange}
      options={permissionOptions}
      placeholder="Select permissions"
      fullWidth
      size="small"
      variant="bordered"
      rounded="md"
      showCheckbox
      showChips
      showSelectAll
      showCloseAction
      loading={isLoadingPermissions}
      disabled={isLoading || hasPermissionError}
      error={Boolean(formErrors.permissions)}
      helperText={
        formErrors.permissions ||
        `${selectedPermissionOptions.length} permission${
          selectedPermissionOptions.length === 1 ? "" : "s"
        } selected.`
      }
      sx={{ mt: 3 }}
      labelSx={labelSx}
      inputSx={inputSx}
      helperTextSx={helperTextSx}
    />

    {selectedPermissionOptions.length ? (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {selectedPermissionOptions.slice(0, 18).map((permission) => (
          <AppTag
            key={permission.value}
            label={permission.label}
            variant="soft"
            colorVariant="primary"
            size="small"
            rounded="full"
          />
        ))}

        {selectedPermissionOptions.length > 18 ? (
          <AppTag
            label={`+${selectedPermissionOptions.length - 18} more`}
            variant="soft"
            colorVariant="neutral"
            size="small"
            rounded="full"
          />
        ) : null}
      </div>
    ) : null}
  </AppCard>
);

const RolePreviewCard = ({ previewRole }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sideCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiEye />} />

      <AppBox>
        <AppHeading level={2} weight={650} sx={sideTitleSx}>
          Role Preview
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          This is the role that will be created.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2">
      <AppKeyValue label="Name" value={previewRole?.name || "-"} />
      <AppKeyValue label="Code" value={previewRole?.code || "-"} />
      <AppKeyValue label="Status" value={previewRole?.status || "active"} />
      <AppKeyValue
        label="Permissions"
        value={previewRole?.permissionsCount ?? 0}
      />
      <AppKeyValue
        label="System Role"
        value={previewRole?.isSystem ? "Yes" : "No"}
      />
      <AppKeyValue
        label="Editable"
        value={previewRole?.isEditable ? "Yes" : "No"}
      />
    </div>

    <AppCard
      variant="soft"
      rounded="lg"
      bordered
      shadow="none"
      padding="none"
      sx={previewDescriptionSx}
    >
      <AppText variant="body2" sx={descriptionTextSx}>
        {previewRole?.description || "-"}
      </AppText>
    </AppCard>
  </AppCard>
);

const PermissionSummaryCard = ({ summary }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sideCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiList />} colorVariant="success" />

      <AppBox>
        <AppHeading level={2} weight={650} sx={sideTitleSx}>
          Permission Summary
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          Live count from selected permissions.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 grid grid-cols-2 gap-2">
      <SummaryTile label="Available" value={summary?.total || 0} />
      <SummaryTile label="Selected" value={summary?.selected || 0} />
      <SummaryTile label="Groups" value={summary?.groups || 0} />
      <SummaryTile label="Remaining" value={summary?.remaining || 0} />
    </div>
  </AppCard>
);

const SummaryTile = ({ label, value }) => (
  <div className="rounded-lg border border-border bg-surface px-3 py-2">
    <AppText variant="body2" sx={summaryLabelSx}>
      {label}
    </AppText>

    <AppHeading level={3} weight={650} sx={summaryValueSx}>
      {value}
    </AppHeading>
  </div>
);

const RoleInfoCard = ({ onViewPermissions }) => (
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
          Creation Rules
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          Role validation follows the backend access-control model.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2.5">
      <RuleItem text="Only workspace owners can create and manage roles." />
      <RuleItem text="Role code must be unique in the current workspace." />
      <RuleItem text="Permissions must exist in the backend permission list." />
      <RuleItem text="Custom roles are active, editable and non-system by default." />
    </div>

    <AppButton
      type="button"
      variant="outlined"
      colorVariant="primary"
      rounded="md"
      fullWidth
      startIcon={<FiKey />}
      onClick={onViewPermissions}
      sx={{ mt: 3 }}
    >
      Open Permission Registry
    </AppButton>
  </AppCard>
);

const RuleItem = ({ text }) => (
  <AppStack direction="row" align="flex-start" gap={0.8}>
    <FiCheckCircle className="mt-[2px] shrink-0 text-[14px] text-primary" />

    <AppText variant="body2" sx={ruleTextSx}>
      {text}
    </AppText>
  </AppStack>
);

const IconBox = ({ icon, colorVariant = "primary", large = false }) => (
  <span
    className={`inline-flex shrink-0 items-center justify-center rounded-xl border border-border ${
      large ? "h-10 w-10 text-[20px]" : "h-9 w-9 text-[17px]"
    }`}
    style={{
      backgroundColor: `var(--app-color-${colorVariant}-soft)`,
      color: `var(--app-color-${colorVariant})`,
    }}
  >
    {icon}
  </span>
);

const pageTitleSx = {
  fontSize: 22,
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const breadcrumbSx = {
  mt: 0.35,
};

const breadcrumbItemSx = {
  fontSize: 12,
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const alertSx = {
  mt: 3,
};

const formCardSx = {
  p: 3,
};

const sectionTitleSx = {
  fontSize: 17,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.35,
  maxWidth: 720,
  fontSize: 12.5,
  color: "var(--app-color-text-muted)",
};

const labelSx = {
  fontSize: 12.5,
  fontWeight: 600,
};

const inputSx = {
  fontSize: 13,
};

const textareaSx = {
  fontSize: 13,
};

const helperTextSx = {
  fontSize: 11.5,
};

const permissionCardSx = {
  mt: 3,
  p: 2.25,
  backgroundColor: "var(--app-color-surface-alt)",
};

const innerTitleSx = {
  fontSize: 14.5,
  color: "var(--app-color-text)",
};

const innerSubtitleSx = {
  mt: 0.25,
  fontSize: 12,
  color: "var(--app-color-text-muted)",
};

const permissionAlertSx = {
  mt: 2,
};

const submitAlertSx = {
  mt: 3,
};

const actionsSx = {
  mt: 3,
  pt: 2.5,
  borderTop: "1px solid var(--app-color-border)",
};

const primaryButtonSx = {
  minHeight: 36,
  px: 2,
  fontSize: 12.5,
  fontWeight: 650,
};

const secondaryButtonSx = {
  minHeight: 36,
  px: 1.7,
  fontSize: 12.5,
  fontWeight: 600,
};

const miniButtonSx = {
  minHeight: 30,
  px: 1.25,
  fontSize: 11.5,
  fontWeight: 600,
};

const sideCardSx = {
  p: 2.25,
};

const sideTitleSx = {
  fontSize: 15,
  color: "var(--app-color-text)",
};

const sideSubtitleSx = {
  mt: 0.25,
  fontSize: 12,
  color: "var(--app-color-text-muted)",
};

const previewDescriptionSx = {
  mt: 3,
  p: 1.5,
  backgroundColor: "var(--app-color-surface-alt)",
};

const descriptionTextSx = {
  fontSize: 12.5,
  color: "var(--app-color-text-muted)",
};

const summaryLabelSx = {
  fontSize: 11.5,
  color: "var(--app-color-text-muted)",
};

const summaryValueSx = {
  mt: 0.25,
  fontSize: 18,
  color: "var(--app-color-text)",
};

const ruleTextSx = {
  fontSize: 12.5,
  lineHeight: 1.45,
  color: "var(--app-color-text-muted)",
};

export default CreateRoleDesktopPage;
