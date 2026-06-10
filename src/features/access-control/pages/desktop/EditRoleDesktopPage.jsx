// src/features/access-control/pages/desktop/EditRoleDesktopPage.jsx

import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiFilter,
  FiGrid,
  FiHelpCircle,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiShield,
  FiSliders,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppCheckbox,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppTag,
  AppTextarea,
  AppText,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
} from "@/components";

const actionKeys = ["view", "create", "update", "delete"];

const actionLabels = {
  view: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
};

const moduleIcons = {
  dashboard: <FiGrid />,
  workspace: <FiUsers />,
  "workspace-member": <FiUsers />,
  company: <HiOutlineBuildingOffice2 />,
  branch: <LuStore />,
  role: <FiShield />,
  product: <FiGrid />,
  category: <FiGrid />,
  inventory: <FiGrid />,
  stock: <FiGrid />,
  purchase: <FiGrid />,
  "purchase-return": <FiGrid />,
  sale: <FiGrid />,
  "sales-return": <FiGrid />,
  customer: <FiUsers />,
  supplier: <FiUsers />,
  bill: <FiGrid />,
  pos: <FiGrid />,
  payment: <FiGrid />,
  expense: <FiGrid />,
  report: <FiGrid />,
  settings: <FiGrid />,
  subscription: <FiGrid />,
};

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const EditRoleDesktopPage = ({
  formData,
  formErrors = {},

  permissionModules = [],
  moduleOptions = [],
  moduleFilter = "all",
  permissionSearch = "",
  permissionSummary,
  previewRole,
  currentStep = 1,

  isLoading = false,
  isUpdating = false,
  isLoadingRole = false,
  isLoadingPermissions = false,
  hasRoleError = false,
  hasPermissionError = false,
  error,
  message,

  handleChange,
  handleTogglePermission,
  handleToggleModule,
  handleSelectAllPermissions,
  handleClearPermissions,
  handleSubmit,
  handleReset,
  handleBack,
  handleCancel,
  handleContinue,
  handleStepChange,
  handleRefreshPermissions,
  handleRefreshRole,

  setPermissionSearch,
  setModuleFilter,
}) => {
  if (isLoadingRole) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <PageHeader
            title="Edit Role"
            subtitle="Loading role details..."
            extra={
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Access Control", href: "/access-control" },
                  { label: "Roles", href: "/access-control/roles" },
                  { label: "Edit Role", current: true },
                ]}
                sx={breadcrumbSx}
                itemSx={breadcrumbItemSx}
                currentItemSx={breadcrumbCurrentSx}
              />
            }
            align="flex-start"
            justify="space-between"
            sx={pageHeaderSx}
            contentSx={pageHeaderContentSx}
          />

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={mainCardSx}
          >
            <AppStack direction="row" align="center" gap={1.2}>
              <FiRefreshCw className="animate-spin text-primary" />

              <AppText variant="body2" sx={sectionSubtitleSx}>
                Fetching role information. Please wait...
              </AppText>
            </AppStack>
          </AppCard>
        </div>
      </section>
    );
  }

  if (hasRoleError) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <div className="mx-auto w-full max-w-[1500px]">
          <PageHeader
            title="Edit Role"
            subtitle="Unable to load role details."
            extra={
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Access Control", href: "/access-control" },
                  { label: "Roles", href: "/access-control/roles" },
                  { label: "Edit Role", current: true },
                ]}
                sx={breadcrumbSx}
                itemSx={breadcrumbItemSx}
                currentItemSx={breadcrumbCurrentSx}
              />
            }
            actions={
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiArrowLeft />}
                onClick={handleCancel}
                sx={secondaryButtonSx}
              >
                Back
              </AppButton>
            }
            align="flex-start"
            justify="space-between"
            sx={pageHeaderSx}
            contentSx={pageHeaderContentSx}
          />

          <AppAlert
            severity="error"
            variant="soft"
            title="Role not found"
            rounded="md"
            sx={alertSx}
          >
            {error || "Unable to fetch role details. Please try again."}
          </AppAlert>

          <AppStack direction="row" align="center" gap={1} sx={{ mt: 3 }}>
            <AppButton
              type="button"
              variant="contained"
              colorVariant="primary"
              rounded="md"
              startIcon={<FiRefreshCw />}
              onClick={handleRefreshRole}
              sx={primaryButtonSx}
            >
              Retry
            </AppButton>

            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              onClick={handleCancel}
              sx={secondaryButtonSx}
            >
              Back to Roles
            </AppButton>
          </AppStack>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Edit Role"
          subtitle="Update role details, modify permissions and review access scope."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Access Control", href: "/access-control" },
                { label: "Roles", href: "/access-control/roles" },
                { label: "Edit Role", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          actions={
            <AppStack
              direction="row"
              align="center"
              justify="flex-end"
              gap={1}
              sx={{ flexShrink: 0 }}
            >
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiArrowLeft />}
                onClick={handleCancel}
                sx={secondaryButtonSx}
              >
                Back
              </AppButton>

              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiRefreshCw />}
                onClick={handleRefreshPermissions}
                loading={isLoadingPermissions}
                disabled={isLoadingPermissions}
                sx={secondaryButtonSx}
              >
                Refresh
              </AppButton>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_330px] items-start gap-5">
          <AppBox sx={{ minWidth: 0 }}>
            <Stepper
              currentStep={currentStep}
              onStepChange={handleStepChange}
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

            <AppBox component="form" onSubmit={handleSubmit}>
              {currentStep === 1 ? (
                <RoleDetailsStep
                  formData={formData}
                  formErrors={formErrors}
                  isLoading={isLoading}
                  onChange={handleChange}
                  onCancel={handleCancel}
                  onContinue={handleContinue}
                />
              ) : null}

              {currentStep === 2 ? (
                <PermissionsStep
                  formData={formData}
                  formErrors={formErrors}
                  permissionModules={permissionModules}
                  moduleOptions={moduleOptions}
                  moduleFilter={moduleFilter}
                  permissionSearch={permissionSearch}
                  isLoading={isLoading}
                  isLoadingPermissions={isLoadingPermissions}
                  hasPermissionError={hasPermissionError}
                  onSearchChange={setPermissionSearch}
                  onModuleChange={setModuleFilter}
                  onTogglePermission={handleTogglePermission}
                  onToggleModule={handleToggleModule}
                  onSelectAll={handleSelectAllPermissions}
                  onClear={handleClearPermissions}
                  onRefresh={handleRefreshPermissions}
                  onBack={handleBack}
                  onContinue={handleContinue}
                />
              ) : null}

              {currentStep === 3 ? (
                <ReviewStep
                  formData={formData}
                  formErrors={formErrors}
                  previewRole={previewRole}
                  permissionModules={permissionModules}
                  permissionSummary={permissionSummary}
                  isUpdating={isUpdating}
                  onBack={handleBack}
                  onEditDetails={() => handleStepChange?.(1)}
                />
              ) : null}

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
            </AppBox>
          </AppBox>

          <RightSidebar
            currentStep={currentStep}
            previewRole={previewRole}
            permissionSummary={permissionSummary}
            onReset={handleReset}
          />
        </div>
      </div>
    </section>
  );
};

const Stepper = ({ currentStep, onStepChange }) => {
  const steps = [
    {
      id: 1,
      title: "Role Details",
      subtitle: "Basic information",
    },
    {
      id: 2,
      title: "Set Permissions",
      subtitle: "Configure permissions",
    },
    {
      id: 3,
      title: "Review & Update",
      subtitle: "Review and update role",
    },
  ];

  return (
    <div className="grid grid-cols-[1fr_120px_1fr_120px_1fr] items-center">
      {steps.map((step, index) => {
        const active = currentStep === step.id;
        const completed = currentStep > step.id;

        return (
          <>
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange?.(step.id)}
              className="flex items-center gap-3 text-left"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                  completed || active
                    ? "bg-primary text-text-inverse"
                    : "border border-border bg-surface-alt text-text"
                }`}
              >
                {completed ? <FiCheck /> : step.id}
              </span>

              <span className="min-w-0">
                <span className="block text-[13px] font-bold text-text">
                  {step.title}
                </span>
                <span className="mt-0.5 block text-[12px] text-text-muted">
                  {step.subtitle}
                </span>
              </span>
            </button>

            {index < steps.length - 1 ? (
              <div key={`${step.id}-line`} className="mx-5 h-px bg-border" />
            ) : null}
          </>
        );
      })}
    </div>
  );
};

const RoleDetailsStep = ({
  formData,
  formErrors,
  isLoading,
  onChange,
  onCancel,
  onContinue,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={mainCardSx}
  >
    <SectionHeader
      title="Role Information"
      subtitle="Update basic details for this role."
    />

    <div className="mt-5 grid grid-cols-2 gap-4">
      <AppInput
        label="Role Name"
        name="name"
        value={formData.name || ""}
        onChange={onChange}
        disabled={isLoading}
        placeholder="Enter role name"
        fullWidth
        required
        size="small"
        variant="bordered"
        rounded="md"
        error={Boolean(formErrors.name)}
        helperText={
          formErrors.name || "Use a clear name that describes the role"
        }
        labelSx={labelSx}
        inputSx={inputSx}
        helperTextSx={helperTextSx}
      />

      <AppInput
        label="Role Code"
        name="code"
        value={formData.code || ""}
        disabled
        placeholder="Role code"
        fullWidth
        size="small"
        variant="bordered"
        rounded="md"
        error={Boolean(formErrors.code)}
        helperText={formErrors.code || "Role code cannot be changed"}
        labelSx={labelSx}
        inputSx={inputSx}
        helperTextSx={helperTextSx}
      />
    </div>

    <AppTextarea
      label="Description"
      name="description"
      value={formData.description || ""}
      onChange={onChange}
      disabled={isLoading}
      placeholder="Enter role description (optional)"
      fullWidth
      size="small"
      variant="bordered"
      rounded="md"
      minRows={2}
      maxRows={3}
      showCount
      maxLength={500}
      error={Boolean(formErrors.description)}
      helperText={
        formErrors.description ||
        "Describe the purpose and responsibilities of this role"
      }
      sx={{ mt: 3 }}
      labelSx={labelSx}
      inputSx={textareaSx}
      helperTextSx={helperTextSx}
    />

    <div className="mt-3 max-w-[280px]">
      <AppSelect
        label="Status"
        name="status"
        value={formData.status || "active"}
        onChange={onChange}
        options={statusOptions}
        disabled={isLoading}
        fullWidth
        size="small"
        variant="bordered"
        rounded="md"
        error={Boolean(formErrors.status)}
        helperText={
          formErrors.status ||
          "Inactive roles will not be available for assignment"
        }
        labelSx={labelSx}
        inputSx={inputSx}
        helperTextSx={helperTextSx}
      />
    </div>

    <FormActions
      left={
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          onClick={onCancel}
          sx={secondaryButtonSx}
        >
          Cancel
        </AppButton>
      }
      right={
        <AppButton
          type="button"
          variant="contained"
          colorVariant="primary"
          rounded="md"
          endIcon={<FiArrowRight />}
          onClick={onContinue}
          sx={primaryButtonSx}
        >
          Save & Continue
        </AppButton>
      }
    />
  </AppCard>
);

const PermissionsStep = ({
  formData,
  formErrors,
  permissionModules,
  moduleOptions,
  moduleFilter,
  permissionSearch,
  isLoading,
  isLoadingPermissions,
  hasPermissionError,
  onSearchChange,
  onModuleChange,
  onTogglePermission,
  onToggleModule,
  onSelectAll,
  onClear,
  onRefresh,
  onBack,
  onContinue,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={mainCardSx}
  >
    <AppBox
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={700} sx={sectionTitleSx}>
          Set Permissions
        </AppHeading>

        <AppText variant="body2" sx={sectionSubtitleSx}>
          Choose the permissions this role should have.
        </AppText>
      </AppBox>

      <AppStack direction="row" align="center" gap={0.8}>
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          onClick={onSelectAll}
          disabled={isLoading}
          sx={topActionButtonSx}
        >
          Select All
        </AppButton>

        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          onClick={onClear}
          disabled={isLoading || !formData.permissions?.length}
          sx={topActionButtonSx}
        >
          Clear
        </AppButton>

        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          startIcon={<FiRefreshCw />}
          onClick={onRefresh}
          loading={isLoadingPermissions}
          disabled={isLoadingPermissions}
          sx={topActionButtonSx}
        >
          Refresh
        </AppButton>
      </AppStack>
    </AppBox>

    <div className="mt-4 grid grid-cols-[minmax(0,1fr)_180px_106px] gap-3">
      <AppInput
        value={permissionSearch}
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder="Search permissions..."
        fullWidth
        size="small"
        variant="bordered"
        rounded="md"
        startIcon={<FiSearch />}
        inputSx={inputSx}
      />

      <AppSelect
        value={moduleFilter}
        onChange={(event) => onModuleChange?.(event.target.value)}
        options={moduleOptions}
        fullWidth
        size="small"
        variant="bordered"
        rounded="md"
        inputSx={inputSx}
      />

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        startIcon={<FiFilter />}
        sx={filterButtonSx}
      >
        Filters
      </AppButton>
    </div>

    {hasPermissionError ? (
      <AppAlert
        severity="error"
        variant="soft"
        title="Unable to load permissions"
        rounded="md"
        sx={permissionAlertSx}
      >
        Refresh permissions and try again before updating this role.
      </AppAlert>
    ) : null}

    <div className="mt-4 overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-[minmax(260px,1fr)_82px_82px_82px_82px_44px] border-b border-border bg-surface-alt px-4 py-3">
        <AppText variant="body2" sx={tableHeadSx}>
          Module / Permission
        </AppText>

        {actionKeys.map((action) => (
          <AppText key={action} variant="body2" sx={tableHeadCenterSx}>
            {actionLabels[action]}
          </AppText>
        ))}

        <span />
      </div>

      <div>
        {permissionModules.map((module) => (
          <PermissionModuleRow
            key={module.id}
            module={module}
            selectedPermissions={formData.permissions || []}
            onTogglePermission={onTogglePermission}
            onToggleModule={onToggleModule}
          />
        ))}
      </div>
    </div>

    {formErrors.permissions ? (
      <AppText variant="body2" sx={errorTextSx}>
        {formErrors.permissions}
      </AppText>
    ) : null}

    <FormActions
      left={
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          startIcon={<FiArrowLeft />}
          onClick={onBack}
          sx={secondaryButtonSx}
        >
          Back
        </AppButton>
      }
      right={
        <AppButton
          type="button"
          variant="contained"
          colorVariant="primary"
          rounded="md"
          endIcon={<FiArrowRight />}
          onClick={onContinue}
          sx={primaryButtonSx}
        >
          Continue to Review
        </AppButton>
      }
    />
  </AppCard>
);

const PermissionModuleRow = ({
  module,
  selectedPermissions,
  onTogglePermission,
  onToggleModule,
}) => {
  const selectedCount = module.permissions.filter((permission) =>
    selectedPermissions.includes(permission.value),
  ).length;

  const actionText = module.permissions
    .filter((permission) => selectedPermissions.includes(permission.value))
    .map((permission) => permission.actionLabel)
    .filter((label, index, arr) => arr.indexOf(label) === index)
    .join(", ");

  return (
    <div className="grid grid-cols-[minmax(260px,1fr)_82px_82px_82px_82px_44px] items-center border-b border-border px-4 py-3 last:border-b-0">
      <AppStack direction="row" align="center" gap={1.2} sx={{ minWidth: 0 }}>
        <IconBox icon={moduleIcons[module.id] || <FiShield />} />

        <AppBox sx={{ minWidth: 0 }}>
          <AppHeading level={3} weight={700} sx={moduleTitleSx}>
            {module.title}
          </AppHeading>

          <AppText variant="body2" sx={moduleSubtitleSx}>
            {actionText || "No permissions selected"}
          </AppText>
        </AppBox>
      </AppStack>

      {actionKeys.map((action) => {
        const permission = module.actions?.[action];

        return (
          <div key={action} className="flex justify-center">
            {permission ? (
              <AppCheckbox
                checked={selectedPermissions.includes(permission.value)}
                onChange={() => onTogglePermission?.(permission.value)}
                size="small"
                colorVariant="primary"
                checkboxSx={checkboxSx}
              />
            ) : (
              <span className="h-5 w-5" />
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => onToggleModule?.(module)}
        className="flex justify-end text-text-muted hover:text-primary"
        title={`${selectedCount} of ${module.permissions.length} selected`}
      >
        <FiChevronRight className="text-[17px]" />
      </button>
    </div>
  );
};

const ReviewStep = ({
  formData,
  formErrors,
  previewRole,
  permissionModules,
  permissionSummary,
  isUpdating,
  onBack,
  onEditDetails,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={mainCardSx}
  >
    <AppBox
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <SectionHeader
        title="Review Role Details"
        subtitle="Review all information before updating this role."
      />

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        onClick={onEditDetails}
        sx={topActionButtonSx}
      >
        Update Details
      </AppButton>
    </AppBox>

    <div className="mt-5 grid grid-cols-4 gap-4">
      <ReviewItem title="Role Name" value={previewRole?.name || "-"} />
      <ReviewItem title="Role Code" value={previewRole?.code || "-"} />
      <ReviewItem
        title="Status"
        value={
          <AppTag
            label={previewRole?.status === "inactive" ? "Inactive" : "Active"}
            variant="soft"
            colorVariant={
              previewRole?.status === "inactive" ? "warning" : "success"
            }
            rounded="md"
            sx={smallTagSx}
          />
        }
      />
      <ReviewItem
        title="Description"
        value={formData.description || previewRole?.description || "-"}
      />
    </div>

    <div className="mt-5 border-t border-border pt-5">
      <SectionHeader
        title="Permissions Summary"
        subtitle="This role will have access to the following modules and permissions."
      />

      <div className="mt-4 grid grid-cols-4 gap-3">
        {permissionModules.map((module) => (
          <ReviewPermissionCard
            key={module.id}
            module={module}
            selectedPermissions={formData.permissions || []}
          />
        ))}
      </div>
    </div>

    <div className="mt-5 border-t border-border pt-5">
      <SectionHeader
        title="Access Scope"
        subtitle="This role can be assigned and will have access within the following scope."
      />

      <div className="mt-4 grid grid-cols-3 gap-4">
        <ScopeItem
          icon={<FiGrid />}
          title="Workspace Scope"
          description="Entire Workspace"
        />
        <ScopeItem
          icon={<HiOutlineBuildingOffice2 />}
          title="Companies"
          description="All Companies"
        />
        <ScopeItem
          icon={<LuStore />}
          title="Branches"
          description="All Branches"
        />
      </div>
    </div>

    {formErrors.submit ? (
      <AppAlert severity="error" variant="soft" rounded="md" sx={submitAlertSx}>
        {formErrors.submit}
      </AppAlert>
    ) : null}

    <FormActions
      left={
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          startIcon={<FiArrowLeft />}
          onClick={onBack}
          disabled={isUpdating}
          sx={secondaryButtonSx}
        >
          Back
        </AppButton>
      }
      right={
        <AppButton
          type="submit"
          variant="contained"
          colorVariant="primary"
          rounded="md"
          startIcon={<FiCheckCircle />}
          loading={isUpdating}
          disabled={isUpdating}
          sx={primaryButtonSx}
        >
          Update Role
        </AppButton>
      }
    />
  </AppCard>
);

const ReviewItem = ({ title, value }) => (
  <AppBox>
    <AppText variant="body2" sx={reviewLabelSx}>
      {title}
    </AppText>

    <AppBox sx={reviewValueSx}>{value}</AppBox>
  </AppBox>
);

const ReviewPermissionCard = ({ module, selectedPermissions }) => {
  const selected = module.permissions.filter((permission) =>
    selectedPermissions.includes(permission.value),
  );

  const selectedLabels = selected
    .map((permission) => permission.actionLabel)
    .filter((label, index, arr) => arr.indexOf(label) === index);

  return (
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="none"
      padding="none"
      sx={permissionSummaryCardSx}
    >
      <AppStack direction="row" align="flex-start" gap={1}>
        <IconBox icon={moduleIcons[module.id] || <FiShield />} />

        <AppBox sx={{ minWidth: 0, flex: 1 }}>
          <AppHeading level={3} weight={700} sx={moduleTitleSx}>
            {module.title}
          </AppHeading>

          <AppText variant="body2" sx={moduleSubtitleSx}>
            {selectedLabels.join(", ") || "No permissions"}
          </AppText>

          <AppText variant="body2" sx={permissionCountSx}>
            {selected.length} of {module.permissions.length} permissions
          </AppText>

          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: module.permissions.length
                  ? `${(selected.length / module.permissions.length) * 100}%`
                  : "0%",
              }}
            />
          </div>
        </AppBox>
      </AppStack>
    </AppCard>
  );
};

const ScopeItem = ({ icon, title, description }) => (
  <AppStack direction="row" align="center" gap={1}>
    <IconBox icon={icon} />

    <AppBox>
      <AppHeading level={3} weight={700} sx={scopeTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={scopeTextSx}>
        {description}
      </AppText>
    </AppBox>
  </AppStack>
);

const RightSidebar = ({
  currentStep,
  previewRole,
  permissionSummary,
  onReset,
}) => {
  if (currentStep === 1) {
    return (
      <PageRightSidebar
        spacing={4}
        cards={[
          {
            title: "Role Update Guide",
            icon: <FiBookOpen />,
            colorVariant: "primary",
            variant: "default",
            description: "Follow these steps to safely update this role.",
            custom: (
              <div className="mt-4 space-y-4">
                <GuideStep
                  number="1"
                  title="Update Role Details"
                  text="Change the role name, description or active status."
                />
                <GuideStep
                  number="2"
                  title="Set Permissions"
                  text="Modify the permissions this role should have."
                />
                <GuideStep
                  number="3"
                  title="Review & Update"
                  text="Review all settings and update the role."
                />
              </div>
            ),
          },
          {
            title: "Role Types",
            icon: <FiShield />,
            colorVariant: "info",
            variant: "default",
            custom: (
              <div className="space-y-4">
                <RoleType
                  icon={<FiShield />}
                  title="System Role"
                  text="Default roles created by the system. Some system roles may have limited editing."
                  colorVariant="primary"
                />
                <RoleType
                  icon={<FiUsers />}
                  title="Custom Role"
                  text="Custom roles created for your workspace. You can update or delete these roles."
                />
              </div>
            ),
          },
          HELP_SUPPORT_CARD,
        ]}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <PageRightSidebar
        spacing={4}
        cards={[
          {
            title: "Permission Guide",
            icon: <FiBookOpen />,
            colorVariant: "primary",
            variant: "default",
            description:
              "Set appropriate permissions to control what members can access and do.",
            custom: (
              <div className="mt-4 space-y-3">
                {[
                  ["View", "Allow viewing of data"],
                  ["Create", "Allow creating new data"],
                  ["Update", "Allow modifying existing data"],
                  ["Delete", "Allow deleting data"],
                ].map(([title, text]) => (
                  <AppStack key={title} direction="row" align="center" gap={1}>
                    <FiCheckCircle className="shrink-0 text-[15px] text-primary" />
                    <AppText variant="body2" sx={sideTextSx}>
                      <strong>{title}:</strong> {text}
                    </AppText>
                  </AppStack>
                ))}
              </div>
            ),
          },
          {
            title: "Role Summary",
            icon: <FiUsers />,
            colorVariant: "success",
            variant: "default",
            custom: (
              <RoleSummaryContent
                previewRole={previewRole}
                permissionSummary={permissionSummary}
                compact
              />
            ),
          },
          HELP_SUPPORT_CARD,
        ]}
      />
    );
  }

  return (
    <PageRightSidebar
      spacing={4}
      cards={[
        {
          title: "Role Summary",
          icon: <FiUsers />,
          colorVariant: "success",
          variant: "default",
          custom: (
            <RoleSummaryContent
              previewRole={previewRole}
              permissionSummary={permissionSummary}
            />
          ),
        },
        {
          title: "What happens next?",
          icon: <FiCheckCircle />,
          colorVariant: "primary",
          variant: "default",
          description:
            "Once you update this role, the changes will apply to members assigned to this role.",
          points: [
            "Assigned members receive updated permissions",
            "You can update permissions anytime",
            "Inactive roles cannot be assigned",
          ],
          pointIcon: <FiCheckCircle />,
          pointIconVariant: "check",
        },
        HELP_SUPPORT_CARD,
      ]}
    />
  );
};

const RoleSummaryContent = ({
  previewRole,
  permissionSummary,
  compact = false,
}) => (
  <div className="space-y-3">
    <SummaryItem label="Role Name" value={previewRole?.name || "-"} />

    {!compact ? (
      <SummaryItem label="Role Code" value={previewRole?.code || "-"} />
    ) : null}

    <SummaryItem
      label="Role Type"
      value={
        <AppTag
          label={previewRole?.isSystem ? "System Role" : "Custom Role"}
          variant="soft"
          colorVariant={previewRole?.isSystem ? "info" : "primary"}
          rounded="md"
          sx={smallTagSx}
        />
      }
    />

    <SummaryItem
      label="Status"
      value={
        <AppTag
          label={previewRole?.status === "inactive" ? "Inactive" : "Active"}
          variant="soft"
          colorVariant={
            previewRole?.status === "inactive" ? "warning" : "success"
          }
          rounded="md"
          sx={smallTagSx}
        />
      }
    />

    <SummaryItem
      label="Description"
      value={previewRole?.description || "Custom workspace role."}
    />

    <div className="border-t border-border pt-4">
      <AppText variant="body2" sx={summaryLabelSx}>
        Permissions
      </AppText>

      <AppHeading level={3} weight={700} sx={permissionTotalSx}>
        {permissionSummary?.selected || 0} / {permissionSummary?.total || 0}
      </AppHeading>

      <AppText variant="body2" sx={sideTextSx}>
        Permissions selected
      </AppText>
    </div>

    {!compact ? (
      <div className="border-t border-border pt-4">
        <AppText variant="body2" sx={summaryLabelSx}>
          Access Scope
        </AppText>

        <div className="mt-3 space-y-3">
          <ScopeItem
            icon={<FiGrid />}
            title="Workspace"
            description="Entire Workspace"
          />
          <ScopeItem
            icon={<HiOutlineBuildingOffice2 />}
            title="Companies"
            description="All Companies"
          />
          <ScopeItem
            icon={<LuStore />}
            title="Branches"
            description="All Branches"
          />
        </div>
      </div>
    ) : null}
  </div>
);

const GuideStep = ({ number, title, text }) => (
  <AppStack direction="row" align="flex-start" gap={1.2}>
    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary text-[10px] font-bold text-primary">
      {number}
    </span>

    <AppBox>
      <AppHeading level={4} weight={700} sx={sidePointTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={sideTextSx}>
        {text}
      </AppText>
    </AppBox>
  </AppStack>
);

const RoleType = ({ icon, title, text, colorVariant = "success" }) => (
  <AppStack direction="row" align="flex-start" gap={1.3}>
    <IconBox icon={icon} colorVariant={colorVariant} />

    <AppBox>
      <AppHeading level={4} weight={700} sx={sidePointTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={sideTextSx}>
        {text}
      </AppText>
    </AppBox>
  </AppStack>
);

const SummaryItem = ({ label, value }) => (
  <AppBox>
    <AppText variant="body2" sx={summaryLabelSx}>
      {label}
    </AppText>

    <AppBox sx={summaryValueSx}>{value}</AppBox>
  </AppBox>
);

const SectionHeader = ({ title, subtitle }) => (
  <AppBox sx={{ minWidth: 0 }}>
    <AppHeading level={2} weight={700} sx={sectionTitleSx}>
      {title}
    </AppHeading>

    {subtitle ? (
      <AppText variant="body2" sx={sectionSubtitleSx}>
        {subtitle}
      </AppText>
    ) : null}
  </AppBox>
);

const FormActions = ({ left, right }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    sx={formActionsSx}
  >
    {left}
    {right}
  </AppBox>
);

const IconBox = ({ icon, colorVariant = "primary" }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: 34,
      height: 34,
      minWidth: 34,
      borderRadius: "9px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: "17px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const pageHeaderSx = {
  width: "100%",
};

const pageHeaderContentSx = {
  minWidth: 0,

  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "25px",
    lineHeight: 1.15,
    letterSpacing: "-0.45px",
    color: "var(--app-color-text)",
  },
};

const breadcrumbSx = {
  mt: 1,
};

const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "12px",
  color: "var(--app-color-text)",
  fontWeight: 600,
};

const mainCardSx = {
  mt: 4,
  px: 2,
  py: 2,
  bgcolor: "var(--app-color-surface)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "15px",
  lineHeight: 1.3,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.7,
  fontSize: "12.5px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const labelSx = {
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const inputSx = {
  minHeight: 38,
  fontSize: "12.5px",
};

const textareaSx = {
  fontSize: "12.5px",
  lineHeight: "21px",
};

const helperTextSx = {
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const formActionsSx = {
  mt: 5,
  pt: 2,
  borderTop: "1px solid var(--app-color-border)",
};

const primaryButtonSx = {
  height: 36,
  px: 2,
  fontSize: "12.5px",
  fontWeight: 700,
};

const secondaryButtonSx = {
  height: 36,
  px: 1.8,
  fontSize: "12.5px",
  fontWeight: 650,
};

const topActionButtonSx = {
  height: 34,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
};

const filterButtonSx = {
  height: 38,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
};

const tableHeadSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
};

const tableHeadCenterSx = {
  ...tableHeadSx,
  textAlign: "center",
};

const moduleTitleSx = {
  m: 0,
  fontSize: "12.8px",
  lineHeight: 1.3,
  color: "var(--app-color-text)",
};

const moduleSubtitleSx = {
  mt: 0.4,
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const checkboxSx = {
  p: 0,
};

const permissionAlertSx = {
  mt: 3,
  fontSize: "12.5px",
};

const alertSx = {
  mt: 3,
  fontSize: "12.5px",
};

const submitAlertSx = {
  mt: 3,
  fontSize: "12.5px",
};

const errorTextSx = {
  mt: 1,
  fontSize: "12px",
  color: "var(--app-color-error)",
};

const reviewLabelSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const reviewValueSx = {
  mt: 1,
  fontSize: "12.5px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const permissionSummaryCardSx = {
  px: 1.2,
  py: 1.2,
  bgcolor: "var(--app-color-surface)",
};

const permissionCountSx = {
  mt: 1.4,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const scopeTitleSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const scopeTextSx = {
  mt: 0.4,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const sideTextSx = {
  mt: 0.8,
  fontSize: "12.3px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const sidePointTitleSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.35,
  color: "var(--app-color-text)",
};

const summaryLabelSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const summaryValueSx = {
  mt: 0.8,
  fontSize: "12.5px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const permissionTotalSx = {
  mt: 1,
  mb: 0,
  fontSize: "22px",
  color: "var(--app-color-primary)",
};

const smallTagSx = {
  height: 22,
  fontSize: "11px",
  fontWeight: 700,
};

export default EditRoleDesktopPage;
