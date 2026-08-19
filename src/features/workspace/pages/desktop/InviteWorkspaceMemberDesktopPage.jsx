import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiInfo,
  FiKey,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCcw,
  FiSend,
  FiShield,
  FiShoppingBag,
  FiTrash2,
  FiUser,
  FiUserPlus,
  FiUsers,
  FiZap,
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
  AppStack,
  AppTextarea,
  AppText,
} from "@/components";

const InviteWorkspaceMemberDesktopPage = ({
  formData,
  formErrors = {},
  workspaceSummary,
  roles = [],
  companies = [],
  branches = [],

  isLoading = false,
  isCheckingWorkspace = false,
  isFetchingRoles = false,
  isFetchingCompanies = false,
  isFetchingBranches = false,
  isInviting = false,
  error,
  message,

  handleModeChange,
  handleGeneratePassword,
  handleChange,
  handleToggleCompany,
  handleToggleBranchAccess,
  handleBranchRoleChange,
  handleBranchMarketplaceToggle,
  handleSubmit,
  handleReset,
  handleBack,
  handleViewInvitations,
  handleViewMembers,
}) => {
  const isAllBranches = Boolean(formData.accessAllBranches);
  const isAllCompanies = Boolean(formData.accessAllCompanies);
  const isDirectMode = formData.mode === "direct";

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1380px]">
        <PageHeader
          isLoading={isLoading}
          onBack={handleBack}
          onViewInvitations={handleViewInvitations}
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
              {/* Onboarding Mode Selector */}
              <div className="flex items-center gap-2 p-1.5 bg-surface-alt/70 rounded-lg border border-border/80 mb-5">
                <button
                  type="button"
                  onClick={() => handleModeChange?.("direct")}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isDirectMode
                      ? "bg-primary text-text-inverse shadow-sm"
                      : "text-text-muted hover:text-text hover:bg-surface"
                  }`}
                >
                  <FiZap className={isDirectMode ? "text-amber-300" : ""} />
                  <span>Direct Add Staff (Instant Onboarding)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange?.("invite")}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-bold transition flex items-center justify-center gap-2 ${
                    !isDirectMode
                      ? "bg-primary text-text-inverse shadow-sm"
                      : "text-text-muted hover:text-text hover:bg-surface"
                  }`}
                >
                  <FiMail />
                  <span>Send Email Invitation Link</span>
                </button>
              </div>

              <AppStack direction="row" align="flex-start" gap={1.2}>
                <IconBox icon={isDirectMode ? <FiZap /> : <FiUserPlus />} large />

                <AppBox sx={{ minWidth: 0, flex: 1 }}>
                  <AppHeading level={2} weight={650} sx={sectionTitleSx}>
                    {isDirectMode
                      ? "Create Staff Credentials & Store Access"
                      : "Invite Team Member & Pre-Configure Roles"}
                  </AppHeading>

                  <AppText variant="body2" sx={sectionSubtitleSx}>
                    {isDirectMode
                      ? "Instantly setup mobile login & password for counter cashiers or billing staff with live store role assignments."
                      : "Send an email invite link with granular store-level access and dedicated branch roles."}
                  </AppText>
                </AppBox>
              </AppStack>

              {/* 1. Core Profile / Contact Fields */}
              {isDirectMode ? (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <AppInput
                      label="Staff Full Name"
                      name="fullName"
                      value={formData.fullName || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="e.g. Ramesh Kumar"
                      fullWidth
                      required
                      size="small"
                      variant="bordered"
                      rounded="md"
                      startIcon={<FiUser />}
                      error={Boolean(formErrors.fullName)}
                      helperText={formErrors.fullName || "Official employee name"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                      helperTextSx={helperTextSx}
                    />

                    <AppInput
                      label="Mobile Number (Primary Login ID)"
                      name="phone"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="9876543210"
                      fullWidth
                      size="small"
                      variant="bordered"
                      rounded="md"
                      startIcon={<FiPhone />}
                      error={Boolean(formErrors.phone)}
                      helperText={
                        formErrors.phone || "10-digit Indian mobile number for POS login"
                      }
                      labelSx={labelSx}
                      inputSx={inputSx}
                      helperTextSx={helperTextSx}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <AppInput
                      label="Email Address (Optional)"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="staff@example.com (optional)"
                      fullWidth
                      size="small"
                      variant="bordered"
                      rounded="md"
                      startIcon={<FiMail />}
                      error={Boolean(formErrors.email)}
                      helperText={formErrors.email || "Optional backup email"}
                      labelSx={labelSx}
                      inputSx={inputSx}
                      helperTextSx={helperTextSx}
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-text mb-1 block">
                          Password / PIN <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleGeneratePassword}
                          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <FiRefreshCcw className="text-[10px]" /> Generate
                        </button>
                      </div>
                      <AppInput
                        name="password"
                        value={formData.password || ""}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="••••••••"
                        fullWidth
                        required
                        size="small"
                        variant="bordered"
                        rounded="md"
                        startIcon={<FiKey />}
                        error={Boolean(formErrors.password)}
                        helperText={
                          formErrors.password || "Initial password to hand over to staff"
                        }
                        inputSx={inputSx}
                        helperTextSx={helperTextSx}
                      />
                    </div>
                  </div>

                  <div>
                    <RoleSelect
                      value={formData.roleId || ""}
                      roles={roles}
                      disabled={isLoading || isFetchingRoles}
                      isFetchingRoles={isFetchingRoles}
                      error={formErrors.roleId}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <AppInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="member@example.com"
                    fullWidth
                    required
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiMail />}
                    error={Boolean(formErrors.email)}
                    helperText={
                      formErrors.email ||
                      "The invitation and security token will be linked to this email."
                    }
                    labelSx={labelSx}
                    inputSx={inputSx}
                    helperTextSx={helperTextSx}
                  />

                  <RoleSelect
                    value={formData.roleId || ""}
                    roles={roles}
                    disabled={isLoading || isFetchingRoles}
                    isFetchingRoles={isFetchingRoles}
                    error={formErrors.roleId}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* 2. Facility Scope Configuration (PBAC) */}
              <div className="mt-5 rounded-lg border border-border/80 bg-surface-alt/40 p-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div>
                    <h3 className="text-sm font-semibold text-text">
                      Store & Facility Scope (PBAC)
                    </h3>
                    <p className="text-xs text-text-muted">
                      Determine which pharmacy companies and branch stores this user can operate.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-text">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="accessAllCompanies"
                        checked={isAllCompanies}
                        onChange={handleChange}
                        className="rounded text-primary focus:ring-0"
                      />
                      <span>All Companies</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="accessAllBranches"
                        checked={isAllBranches}
                        onChange={handleChange}
                        className="rounded text-primary focus:ring-0"
                      />
                      <span>All Branches</span>
                    </label>
                  </div>
                </div>

                {/* Company Selection if not all companies */}
                {!isAllCompanies && companies.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-text-muted block mb-1.5">
                      Allowed Legal Companies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {companies.map((company) => {
                        const isSelected = formData.companyIds.includes(company._id);
                        return (
                          <button
                            key={company._id}
                            type="button"
                            onClick={() => handleToggleCompany(company._id)}
                            className={`px-2.5 py-1 text-xs rounded-md border transition flex items-center gap-1.5 ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border bg-surface text-text-muted hover:border-text-muted"
                            }`}
                          >
                            {isSelected && <FiCheck className="text-xs" />}
                            {company.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Branch Specific Roles Matrix */}
                {!isAllBranches && (
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-text-muted block mb-2">
                      Branch Store Role Assignments:
                    </span>

                    {branches.length === 0 ? (
                      <p className="text-xs text-text-muted italic">
                        {isFetchingBranches ? "Loading store branches..." : "No branches found in workspace."}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {branches.map((branch) => {
                          const branchAccessItem = formData.branchAccess.find(
                            (ba) => ba.branchId === branch._id,
                          );
                          const isAssigned = Boolean(branchAccessItem);

                          return (
                            <div
                              key={branch._id}
                              className={`p-2.5 rounded-lg border transition flex items-center justify-between gap-3 ${
                                isAssigned
                                  ? "border-primary/50 bg-surface shadow-xs"
                                  : "border-border/60 bg-surface/50 opacity-80"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-[200px]">
                                <input
                                  type="checkbox"
                                  checked={isAssigned}
                                  onChange={() => handleToggleBranchAccess(branch._id, formData.roleId)}
                                  className="rounded text-primary focus:ring-0"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <FiMapPin className="text-xs text-primary" />
                                    <span className="text-xs font-semibold text-text">
                                      {branch.name}
                                    </span>
                                    <span className="text-[10px] text-text-muted font-mono bg-surface-alt px-1 py-0.2 rounded border border-border">
                                      {branch.branchCode || "STORE"}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-text-muted">
                                    {branch.city ||
                                      (typeof branch.address === "string"
                                        ? branch.address
                                        : branch.address?.city ||
                                          branch.address?.addressLine1 ||
                                          "Local Branch")}
                                  </p>
                                </div>
                              </div>

                              {isAssigned ? (
                                <div className="flex items-center gap-2.5">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[11px] text-text-muted font-medium">Role:</span>
                                    <select
                                      value={branchAccessItem.roleId || ""}
                                      onChange={(e) =>
                                        handleBranchRoleChange(branch._id, e.target.value)
                                      }
                                      className="text-xs rounded border border-border bg-surface px-2 py-1 outline-none text-text"
                                    >
                                      <option value="">Inherit Global Role</option>
                                      {roles.map((role) => (
                                        <option key={role._id} value={role._id}>
                                          {role.name || role.code}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleBranchMarketplaceToggle(branch._id)}
                                    title="Toggle Marketplace Fulfillment Operator"
                                    className={`px-2 py-1 text-[11px] rounded border flex items-center gap-1 transition ${
                                      branchAccessItem.canOperateMarketplaceStore
                                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 font-semibold"
                                        : "border-border bg-surface text-text-muted hover:text-text"
                                    }`}
                                  >
                                    <FiShoppingBag className="text-xs" />
                                    <span>Marketplace Operator</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-text-muted italic">
                                  No Store Access
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <AppTextarea
                label="Invitation Notes / Message"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Optional custom message or onboarding instructions"
                fullWidth
                size="small"
                variant="bordered"
                rounded="md"
                minRows={3}
                maxRows={5}
                showCount
                maxLength={500}
                error={Boolean(formErrors.notes)}
                helperText={formErrors.notes || "Maximum 500 characters."}
                sx={{ mt: 3 }}
                labelSx={labelSx}
                inputSx={textareaSx}
                helperTextSx={helperTextSx}
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
                    disabled={isInviting}
                    sx={secondaryButtonSx}
                  >
                    Back
                  </AppButton>

                  <AppButton
                    type="submit"
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={isDirectMode ? <FiCheckCircle /> : <FiSend />}
                    loading={isInviting}
                    disabled={isLoading || isCheckingWorkspace}
                    sx={primaryButtonSx}
                  >
                    {isDirectMode ? "Create & Activate Staff" : "Send Invitation Link"}
                  </AppButton>
                </AppStack>
              </AppStack>
            </AppBox>
          </AppCard>

          <AppStack direction="column" gap={1.5}>
            <WorkspaceSummaryCard
              workspaceSummary={workspaceSummary}
              branchCount={formData.accessAllBranches ? "All Stores" : formData.branchAccess.length}
              companyCount={formData.accessAllCompanies ? "All Companies" : formData.companyIds.length}
            />
            <InvitationInfoCard onViewMembers={handleViewMembers} />
          </AppStack>
        </div>
      </div>
    </section>
  );
};

const RoleSelect = ({
  value,
  roles = [],
  disabled = false,
  isFetchingRoles = false,
  error,
  onChange,
}) => {
  const helperText = error
    ? error
    : isFetchingRoles
      ? "Loading workspace roles..."
      : roles.length > 0
        ? "Optional. Leave blank to invite as default staff."
        : "No roles found. Leave blank to invite as default staff.";

  return (
    <AppBox>
      <AppStack direction="row" align="center" gap={0.7} sx={labelRowSx}>
        <FiShield />
        <AppText component="label" htmlFor="invite-role-id" sx={labelSx}>
          Role
        </AppText>
      </AppStack>

      <select
        id="invite-role-id"
        name="roleId"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-md border px-3 outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
        style={selectStyle}
      >
        <option value="">Default Staff Role</option>

        {roles.map((role) => (
          <option key={role._id} value={role._id}>
            {role.name || role.code || "Unnamed Role"}
          </option>
        ))}
      </select>

      <AppText variant="body2" sx={error ? helperErrorTextSx : helperTextSx}>
        {helperText}
      </AppText>
    </AppBox>
  );
};

const PageHeader = ({ isLoading, onBack, onViewInvitations }) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiUserPlus />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Invite Member
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Workspace", href: "/workspace" },
            { label: "Members", href: "/workspace/members" },
            { label: "Invite", current: true },
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
        Back to Members
      </AppButton>

      <AppButton
        type="button"
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiClock />}
        onClick={onViewInvitations}
        disabled={isLoading}
        sx={primaryButtonSx}
      >
        View Invitations
      </AppButton>
    </AppStack>
  </AppStack>
);

const WorkspaceSummaryCard = ({
  workspaceSummary,
  branchCount = "-",
  companyCount = "-",
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sideCardSx}
  >
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiUsers />} />

      <AppBox>
        <AppHeading level={2} weight={650} sx={sideTitleSx}>
          Workspace Summary
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          Target workspace and pre-configured facility footprint.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2">
      <AppKeyValue label="Name" value={workspaceSummary?.name || "-"} />
      <AppKeyValue label="Code" value={workspaceSummary?.code || "-"} />
      <AppKeyValue label="Type" value={workspaceSummary?.type || "-"} />
      <AppKeyValue label="Selected Stores" value={String(branchCount)} />
      <AppKeyValue label="Selected Companies" value={String(companyCount)} />
      <AppKeyValue label="Email" value={workspaceSummary?.email || "-"} />
      <AppKeyValue label="Phone" value={workspaceSummary?.phone || "-"} />
    </div>
  </AppCard>
);

const InvitationInfoCard = ({ onViewMembers }) => (
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
          How Invitations Work
        </AppHeading>

        <AppText variant="body2" sx={sideSubtitleSx}>
          Workspace invitations are seat-aware and expire automatically.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2.5">
      <InfoRow
        icon={<FiCheckCircle />}
        title="Seat validation"
        text="The backend checks active members and pending invitations before creating a new invitation."
      />

      <InfoRow
        icon={<FiClock />}
        title="72-hour expiry"
        text="Invitation links expire after 72 hours if they are not accepted."
      />

      <InfoRow
        icon={<FiShield />}
        title="Owner only"
        text="Only workspace owners can invite members or cancel pending invitations."
      />
    </div>

    <AppButton
      type="button"
      variant="soft"
      colorVariant="primary"
      rounded="md"
      fullWidth
      startIcon={<FiUsers />}
      onClick={onViewMembers}
      sx={membersButtonSx}
    >
      View Members
    </AppButton>
  </AppCard>
);

const InfoRow = ({ icon, title, text }) => (
  <AppStack direction="row" align="flex-start" gap={1}>
    <AppBox sx={smallInfoIconSx}>{icon}</AppBox>

    <AppBox sx={{ minWidth: 0 }}>
      <AppHeading level={3} weight={650} sx={infoTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={infoTextSx}>
        {text}
      </AppText>
    </AppBox>
  </AppStack>
);

const IconBox = ({ icon, colorVariant = "primary", large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 42 : 36,
      height: large ? 42 : 36,
      minWidth: large ? 42 : 36,
      borderRadius: "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft)`,
      color: `var(--app-color-${colorVariant})`,
      fontSize: large ? "22px" : "18px",
    }}
  >
    {icon}
  </AppBox>
);

const pageTitleSx = {
  m: 0,
  fontSize: "24px",
  lineHeight: 1.12,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = {
  mt: 0.45,
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

const alertSx = {
  mt: 2,
};

const formCardSx = {
  p: 3,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "18px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.55,
  maxWidth: 720,
  fontSize: "12.5px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const labelRowSx = {
  mb: 0.45,
  color: "var(--app-color-text)",
  fontSize: "13px",
};

const labelSx = {
  mb: 0.45,
  fontSize: "12.3px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 43,
  fontSize: "12.8px",
  bgcolor: "var(--app-color-surface-alt)",
};

const selectStyle = {
  height: 43,
  fontSize: "12.8px",
  backgroundColor: "var(--app-color-surface-alt)",
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
};

const textareaSx = {
  fontSize: "12.8px",
  bgcolor: "var(--app-color-surface-alt)",
};

const helperTextSx = {
  mt: 0.45,
  fontSize: "10.8px",
  fontWeight: 500,
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const helperErrorTextSx = {
  ...helperTextSx,
  color: "var(--app-color-error)",
};

const submitAlertSx = {
  mt: 2.4,
};

const actionsSx = {
  mt: 3,
  pt: 2,
  borderTop: "1px solid var(--app-color-border)",
};

const primaryButtonSx = {
  height: 36,
  px: 1.7,
  fontSize: "12.5px",
  fontWeight: 700,
};

const secondaryButtonSx = {
  height: 36,
  px: 1.5,
  fontSize: "12.5px",
  fontWeight: 650,
};

const sideCardSx = {
  p: 2,
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
  mt: 0.35,
  fontSize: "11.5px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const smallInfoIconSx = {
  width: 28,
  height: 28,
  minWidth: 28,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "14px",
};

const infoTitleSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const infoTextSx = {
  mt: 0.25,
  fontSize: "11.2px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const membersButtonSx = {
  mt: 2,
  height: 38,
  fontSize: "12.5px",
  fontWeight: 700,
};

export default InviteWorkspaceMemberDesktopPage;
