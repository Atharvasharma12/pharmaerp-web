import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiInfo,
  FiKey,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCcw,
  FiSend,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiUserPlus,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppKeyValue,
  AppStack,
  AppTextarea,
  AppText,
} from "@/components";

const InviteWorkspaceMemberMobilePage = ({
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
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Expanded Width Mobile Header Section */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Invite Team Member
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                Pre-configure store facility roles & access.
              </AppText>
            </AppBox>

            <AppStack
              direction="row"
              align="center"
              gap={0.5}
              sx={{ flexShrink: 0 }}
            >
              <AppIconButtonCustom
                icon={<FiClock />}
                onClick={handleViewInvitations}
                disabled={isLoading}
              />
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleBack}
                disabled={isInviting}
                sx={headerSecondaryBtnSx}
              >
                Members
              </AppButton>
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Global Alert Notification Interceptors */}
        {message && (
          <AppBox sx={alertContainerSx}>
            <AppAlert
              severity="success"
              variant="soft"
              title={message}
              rounded="md"
            />
          </AppBox>
        )}

        {error && !formErrors.submit && (
          <AppBox sx={alertContainerSx}>
            <AppAlert
              severity="error"
              variant="soft"
              title="Something went wrong"
              rounded="md"
            >
              {error}
            </AppAlert>
          </AppBox>
        )}

        {/* Core Direct Input Action Form Fields Block */}
        <AppBox component="form" onSubmit={handleSubmit} sx={formSectionSx}>
          {/* Mode Switcher Pill */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-alt/90 rounded-lg border border-border/80 mb-3">
            <button
              type="button"
              onClick={() => handleModeChange?.("direct")}
              className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                isDirectMode
                  ? "bg-primary text-text-inverse shadow-xs"
                  : "text-text-muted hover:text-text hover:bg-surface"
              }`}
            >
              <FiZap className={isDirectMode ? "text-amber-300 text-xs" : "text-xs"} />
              <span>Direct Add</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange?.("invite")}
              className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                !isDirectMode
                  ? "bg-primary text-text-inverse shadow-xs"
                  : "text-text-muted hover:text-text hover:bg-surface"
              }`}
            >
              <FiMail className="text-xs" />
              <span>Invite Link</span>
            </button>
          </div>

          <AppStack direction="column" gap={1.65}>
            {isDirectMode ? (
              <>
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
                  helperText={formErrors.fullName}
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                />

                <AppInput
                  label="Mobile Number (Login ID)"
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
                  helperText={formErrors.phone || "10-digit Indian mobile number"}
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                />

                <AppInput
                  label="Email (Optional)"
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
                  helperText={formErrors.email}
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-text mb-0.5 block">
                      Password / PIN <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                    >
                      <FiRefreshCcw className="text-[9px]" /> Generate
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
                    helperText={formErrors.password || "Initial staff password"}
                    inputSx={inputSx}
                    helperTextSx={helperTextSx}
                  />
                </div>
              </>
            ) : (
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
                  formErrors.email || "Invitation will be linked to this address."
                }
                labelSx={labelSx}
                inputSx={inputSx}
                helperTextSx={helperTextSx}
              />
            )}

            <AppBox>
              <AppStack
                direction="row"
                align="center"
                gap={0.4}
                sx={labelRowSx}
              >
                <FiShield className="text-[12px] text-text-muted" />
                <AppText
                  component="label"
                  htmlFor="invite-role-id"
                  sx={labelSx}
                >
                  Global Fallback Role
                </AppText>
              </AppStack>

              <select
                id="invite-role-id"
                name="roleId"
                value={formData.roleId || ""}
                onChange={handleChange}
                disabled={isLoading || isFetchingRoles}
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

              <AppText
                variant="body2"
                sx={formErrors.roleId ? helperErrorTextSx : helperTextSx}
              >
                {formErrors.roleId
                  ? formErrors.roleId
                  : isFetchingRoles
                    ? "Loading workspace roles..."
                    : "Optional. Used as fallback when branch-specific role is not set."}
              </AppText>
            </AppBox>

            {/* PBAC Facilities Scoping */}
            <div className="rounded-lg border border-border bg-surface-alt/40 p-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-semibold text-text">Store Facilities (PBAC)</span>
                <div className="flex items-center gap-2.5 text-[11px]">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      name="accessAllBranches"
                      checked={isAllBranches}
                      onChange={handleChange}
                      className="rounded text-primary"
                    />
                    <span>All Stores</span>
                  </label>
                </div>
              </div>

              {!isAllBranches && (
                <div className="mt-2.5 space-y-2">
                  {branches.length === 0 ? (
                    <p className="text-[11px] text-text-muted italic">No stores found</p>
                  ) : (
                    branches.map((branch) => {
                      const branchAccessItem = formData.branchAccess.find(
                        (ba) => ba.branchId === branch._id,
                      );
                      const isAssigned = Boolean(branchAccessItem);

                      return (
                        <div
                          key={branch._id}
                          className={`p-2 rounded border transition text-xs ${
                            isAssigned
                              ? "border-primary/50 bg-surface"
                              : "border-border/60 bg-surface/60 opacity-80"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={() => handleToggleBranchAccess(branch._id, formData.roleId)}
                                className="rounded text-primary"
                              />
                              <span className="font-semibold text-text">{branch.name}</span>
                            </label>
                            <span className="text-[10px] text-text-muted font-mono">{branch.branchCode}</span>
                          </div>

                          {isAssigned && (
                            <div className="mt-2 pt-1.5 border-t border-border/50 flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-text-muted">Branch Role:</span>
                                <select
                                  value={branchAccessItem.roleId || ""}
                                  onChange={(e) =>
                                    handleBranchRoleChange(branch._id, e.target.value)
                                  }
                                  className="text-[11px] rounded border border-border bg-surface px-1.5 py-0.5 outline-none flex-1 text-text"
                                >
                                  <option value="">Inherit Global Role</option>
                                  {roles.map((r) => (
                                    <option key={r._id} value={r._id}>
                                      {r.name || r.code}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleBranchMarketplaceToggle(branch._id)}
                                className={`text-[10px] py-1 px-2 rounded border flex items-center justify-center gap-1 ${
                                  branchAccessItem.canOperateMarketplaceStore
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 font-semibold"
                                    : "border-border text-text-muted"
                                }`}
                              >
                                <FiShoppingBag className="text-xs" />
                                <span>Marketplace Fulfillment Operator</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <AppTextarea
              label="Notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Optional note for internal reference"
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
              labelSx={labelSx}
              inputSx={textareaSx}
              helperTextSx={helperTextSx}
            />

            {formErrors.submit && (
              <AppAlert
                severity="error"
                variant="soft"
                rounded="md"
                sx={{ mt: 1 }}
              >
                {formErrors.submit}
              </AppAlert>
            )}

            {/* Standardized Form Actions Row Component Structure */}
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
                size="small"
                startIcon={<FiRefreshCcw />}
                onClick={handleReset}
                disabled={isLoading}
                sx={secondaryButtonSx}
              >
                Reset
              </AppButton>

              <AppButton
                type="submit"
                variant="contained"
                colorVariant="success"
                rounded="md"
                size="small"
                startIcon={isDirectMode ? <FiCheckCircle /> : <FiSend />}
                loading={isInviting}
                disabled={isLoading || isCheckingWorkspace}
                sx={primaryButtonSx}
              >
                {isDirectMode ? "Create & Activate Staff" : "Send Invitation"}
              </AppButton>
            </AppStack>
          </AppStack>
        </AppBox>

        {/* High Density Information Advisory Segments Block */}
        <AppBox sx={infoSectionWrapperSx}>
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={sideCardSx}
          >
            <AppStack direction="row" align="center" gap={0.75}>
              <AppBox sx={iconBoxSx}>
                <FiUsers />
              </AppBox>
              <AppBox>
                <AppHeading level={2} weight={750} sx={sideTitleSx}>
                  Workspace Summary
                </AppHeading>
                <AppText variant="body2" sx={sideSubtitleSx}>
                  Target profile destination details.
                </AppText>
              </AppBox>
            </AppStack>

            <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 border-t border-divider/60 pt-2.5">
              <AppKeyValue
                label="Name"
                value={workspaceSummary?.name || "-"}
                labelSx={summaryLabelSx}
                valueSx={summaryValueSx}
              />
              <AppKeyValue
                label="Code"
                value={workspaceSummary?.code || "-"}
                labelSx={summaryLabelSx}
                valueSx={summaryValueSx}
              />
              <AppKeyValue
                label="Type"
                value={workspaceSummary?.type || "-"}
                labelSx={summaryLabelSx}
                valueSx={summaryValueSx}
              />
              <AppKeyValue
                label="Phone"
                value={workspaceSummary?.phone || "-"}
                labelSx={summaryLabelSx}
                valueSx={summaryValueSx}
              />
            </div>
          </AppCard>

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={{ ...sideCardSx, mt: 1 }}
          >
            <AppStack direction="row" align="center" gap={0.75}>
              <AppBox
                sx={{
                  ...iconBoxSx,
                  bgcolor: "var(--app-color-info-soft)",
                  color: "var(--app-color-info)",
                }}
              >
                <FiInfo />
              </AppBox>
              <AppBox>
                <AppHeading level={2} weight={750} sx={sideTitleSx}>
                  How Invitations Work
                </AppHeading>
                <AppText variant="body2" sx={sideSubtitleSx}>
                  Seat-aware links expire automatically.
                </AppText>
              </AppBox>
            </AppStack>

            <AppStack
              direction="column"
              gap={0.85}
              sx={{
                mt: 2,
                borderTop: "1px solid var(--app-color-divider)",
                pt: 2,
              }}
            >
              <InfoRow
                icon={<FiCheckCircle />}
                title="Seat validation"
                text="Roster validation applies prior to allocation."
              />
              <InfoRow
                icon={<FiClock />}
                title="72-hour expiry"
                text="Link codes invalidate automatically post 72 hours."
              />
            </AppStack>

            <AppButton
              type="button"
              variant="soft"
              colorVariant="primary"
              rounded="md"
              fullWidth
              size="small"
              startIcon={<FiUsers />}
              onClick={handleViewMembers}
              sx={membersButtonSx}
            >
              View Workspace Members
            </AppButton>
          </AppCard>
        </AppBox>
      </AppBox>
    </section>
  );
};

// Internal Presentation Compositions
const InfoRow = ({ icon, title, text }) => (
  <AppStack direction="row" align="flex-start" gap={0.75}>
    <AppBox sx={smallInfoIconSx}>{icon}</AppBox>
    <AppBox sx={{ minWidth: 0, flex: 1 }}>
      <AppHeading level={3} weight={700} sx={infoTitleSx}>
        {title}
      </AppHeading>
      <AppText variant="body2" sx={infoTextSx}>
        {text}
      </AppText>
    </AppBox>
  </AppStack>
);

const AppIconButtonCustom = ({ icon, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-muted transition active:bg-surface-active disabled:cursor-not-allowed disabled:opacity-50"
  >
    <span className="text-[15px]">{icon}</span>
  </button>
);

/* Architectural Structural Layout Definitions */
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 0.5,
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const headerSecondaryBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 700,
  px: 1.1,
  borderColor: "var(--app-color-border-strong)",
  color: "var(--app-color-text)",
};

const alertContainerSx = {
  px: 0.5,
  mb: 1,
};

const formSectionSx = {
  px: 0.5,
  pb: 1.5,
};

const labelRowSx = {
  mb: 0.45,
  alignItems: "center",
};

const labelSx = {
  mb: 0,
  fontSize: "12.3px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 40,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const selectStyle = {
  height: 40,
  fontSize: "12px",
  backgroundColor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
};

const textareaSx = {
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const helperTextSx = {
  mt: 0.45,
  fontSize: "10.5px",
  fontWeight: 500,
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const helperErrorTextSx = {
  ...helperTextSx,
  color: "var(--app-color-error)",
};

const actionsSx = {
  mt: 1,
  pt: 1.5,
  borderTop: "1px solid var(--app-color-divider)",
};

const primaryButtonSx = {
  height: 34,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 750,
};

const secondaryButtonSx = {
  height: 34,
  px: 1.25,
  fontSize: "12px",
  fontWeight: 650,
};

const infoSectionWrapperSx = {
  px: 0.5,
  py: 1.25,
  borderTop: "1px solid var(--app-color-divider)",
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 25%, transparent)",
};

const sideCardSx = {
  p: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};

const iconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: "8px",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "15px",
  flexShrink: 0,
};

const sideTitleSx = {
  m: 0,
  fontSize: "13px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sideSubtitleSx = {
  mt: 0.1,
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
};

const summaryLabelSx = {
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

const summaryValueSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text)",
  fontWeight: 600,
};

const smallInfoIconSx = {
  width: 24,
  height: 24,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "12px",
  flexShrink: 0,
};

const infoTitleSx = {
  m: 0,
  fontSize: "11.5px",
  color: "var(--app-color-text)",
};

const infoTextSx = {
  mt: 0.05,
  fontSize: "10.5px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const membersButtonSx = {
  mt: 1.5,
  height: 34,
  fontSize: "11.5px",
  fontWeight: 750,
};

export default InviteWorkspaceMemberMobilePage;
