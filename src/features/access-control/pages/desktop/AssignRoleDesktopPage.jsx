import {
  FiArrowLeft,
  FiCheckCircle,
  FiHeadphones,
  FiInfo,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiSliders,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppKeyValue,
  AppSelect,
  AppStack,
  AppTag,
  AppText,
  HELP_SUPPORT_CARD,
  PageHeader,
  PageRightSidebar,
} from "@/components";

const AssignRoleDesktopPage = ({
  formData,
  formErrors = {},

  memberOptions = [],
  roleOptions = [],
  selectedMember,
  assignmentSummary,

  isLoading = false,
  isLoadingMembers = false,
  isLoadingRoles = false,
  isSubmitting = false,
  error,
  message,

  handleChange,
  handleSubmit,
  handleReset,
  handleRefresh,
  handleBack,
  handleBackToAccessControl,
  handleViewMembersList,
  clearMessage,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Assign Role"
          subtitle="Assign an access and permission security role to a workspace member."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                {
                  label: "Access Control",
                  onClick: handleBackToAccessControl || handleBack,
                },
                { label: "Roles", onClick: handleBack },
                { label: "Assign Role", current: true },
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
              gap={1.1}
              sx={{ flexShrink: 0 }}
            >
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiArrowLeft />}
                onClick={handleBack}
                disabled={isSubmitting}
                sx={secondaryButtonSx}
              >
                Roles Dashboard
              </AppButton>

              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiRefreshCw />}
                onClick={handleRefresh}
                loading={isLoading}
                disabled={isLoading || isSubmitting}
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
                startIcon={<FiShield />}
                onClick={handleBack}
                disabled={isSubmitting}
                sx={primaryButtonSx}
              >
                View Roles
              </AppButton>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

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

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_290px] items-start gap-5">
          <main className="min-w-0 space-y-5">
            <HeroSummary
              selectedMember={selectedMember}
              assignmentSummary={assignmentSummary}
              roleOptions={roleOptions}
            />

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={formCardSx}
            >
              <AppBox component="form" onSubmit={handleSubmit}>
                <SectionHeader
                  icon={<FiSliders />}
                  title="Assign Workspace Role"
                  subtitle="Select an active teammate from the pool, then connect them with a functional security classification to adjust systemic authorization access."
                />

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <AppSelect
                    label="Workspace Member"
                    name="memberUserId"
                    value={formData.memberUserId || ""}
                    onChange={handleChange}
                    options={memberOptions}
                    disabled={isSubmitting || isLoadingMembers}
                    loading={isLoadingMembers}
                    placeholder="Select active member"
                    fullWidth
                    required
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiUserCheck />}
                    error={Boolean(formErrors.memberUserId)}
                    helperText={
                      formErrors.memberUserId ||
                      "Only active team members can be reassigned runtime permission layers."
                    }
                    labelSx={labelSx}
                    inputSx={inputSx}
                    helperTextSx={helperTextSx}
                    renderOption={(option) => <MemberOption option={option} />}
                  />

                  <AppSelect
                    label="Security Role"
                    name="roleId"
                    value={formData.roleId || ""}
                    onChange={handleChange}
                    options={roleOptions}
                    disabled={isSubmitting || isLoadingRoles}
                    loading={isLoadingRoles}
                    placeholder="Select custom or system role"
                    fullWidth
                    required
                    size="small"
                    variant="bordered"
                    rounded="md"
                    startIcon={<FiShield />}
                    error={Boolean(formErrors.roleId)}
                    helperText={
                      formErrors.roleId ||
                      "Select an active functional matrix blueprint from your workspace."
                    }
                    labelSx={labelSx}
                    inputSx={inputSx}
                    helperTextSx={helperTextSx}
                  />
                </div>

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
                    startIcon={<FiRefreshCw />}
                    onClick={handleReset}
                    disabled={isSubmitting}
                    sx={secondaryLargeButtonSx}
                  >
                    Reset Form
                  </AppButton>

                  <AppStack direction="row" align="center" gap={1}>
                    <AppButton
                      type="button"
                      variant="outlined"
                      colorVariant="neutral"
                      rounded="md"
                      startIcon={<FiArrowLeft />}
                      onClick={handleBack}
                      disabled={isSubmitting}
                      sx={secondaryLargeButtonSx}
                    >
                      Cancel
                    </AppButton>

                    <AppButton
                      type="submit"
                      variant="contained"
                      colorVariant="primary"
                      rounded="md"
                      startIcon={<FiSave />}
                      loading={isSubmitting}
                      disabled={isSubmitting || isLoading}
                      sx={primaryLargeButtonSx}
                    >
                      Assign Role Mapping
                    </AppButton>
                  </AppStack>
                </AppStack>
              </AppBox>
            </AppCard>
          </main>

          <AssignRoleRightSidebar
            selectedMember={selectedMember}
            assignmentSummary={assignmentSummary}
            onViewMembersList={handleViewMembersList}
          />
        </div>
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

const HeroSummary = ({
  selectedMember,
  assignmentSummary,
  roleOptions = [],
}) => {
  const items = [
    {
      id: "member",
      title: "Target Member",
      value: selectedMember?.displayName || "Not selected",
      subtitle: selectedMember?.displayEmail || "Choose teammate below",
      icon: <FiUserCheck />,
      colorVariant: "success",
    },
    {
      id: "current_role",
      title: "Current Strategy",
      value: assignmentSummary?.currentRole || "Staff",
      subtitle: "Active workspace designation",
      icon: <FiUsers />,
      colorVariant: "info",
    },
    {
      id: "target_role",
      title: "Target Designation",
      value: assignmentSummary?.targetRole || "None Selected",
      subtitle: "Pending runtime adjustments",
      icon: <FiShield />,
      colorVariant: selectedMember ? "purple" : "warning",
    },
    {
      id: "total_roles",
      title: "Roles Pool",
      value: `${roleOptions.length || 8} Active`,
      subtitle: "Available core variations",
      icon: <FiSliders />,
      colorVariant: "success",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <AppCard
          key={item.id}
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={summaryCardSx}
        >
          <AppStack direction="row" align="flex-start" gap={1.1}>
            <IconBox icon={item.icon} colorVariant={item.colorVariant} />

            <AppBox sx={{ minWidth: 0 }}>
              <AppText variant="body2" sx={summaryTitleSx}>
                {item.title}
              </AppText>

              <AppHeading level={3} weight={750} sx={summaryValueSx}>
                {item.value}
              </AppHeading>

              <AppText variant="body2" sx={summarySubtitleSx}>
                {item.subtitle}
              </AppText>
            </AppBox>
          </AppStack>
        </AppCard>
      ))}
    </div>
  );
};

const SectionHeader = ({ icon, title, subtitle }) => (
  <AppStack direction="row" align="flex-start" gap={1.2}>
    <IconBox icon={icon} colorVariant="success" large />

    <AppBox sx={{ minWidth: 0, flex: 1 }}>
      <AppHeading level={2} weight={750} sx={sectionTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={sectionSubtitleSx}>
        {subtitle}
      </AppText>
    </AppBox>
  </AppStack>
);

const MemberOption = ({ option }) => (
  <AppStack direction="row" align="center" justify="space-between" gap={1}>
    <AppBox sx={{ minWidth: 0 }}>
      <AppText variant="body2" sx={optionTitleSx}>
        {option?.displayName || option?.label}
      </AppText>

      <AppText variant="body2" sx={optionSubtitleSx}>
        {option?.displayEmail || "-"} · {option?.displayRole || "Staff"}
      </AppText>
    </AppBox>

    {option?.isOwner ? (
      <AppTag
        label="Owner"
        variant="soft"
        colorVariant="warning"
        size="small"
        rounded="full"
      />
    ) : null}
  </AppStack>
);

const AssignRoleRightSidebar = ({
  selectedMember,
  assignmentSummary,
  onViewMembersList,
}) => (
  <PageRightSidebar
    spacing={4}
    cards={[
      {
        title: "Teammate Insights",
        icon: <FiUserCheck />,
        colorVariant: "success",
        variant: "default",
        custom: (
          <MemberContent
            member={selectedMember}
            onViewMembersList={onViewMembersList}
          />
        ),
      },
      {
        title: "Assignment Preview",
        icon: <FiCheckCircle />,
        colorVariant: "info",
        variant: "default",
        custom: <AssignmentPreviewContent summary={assignmentSummary} />,
      },
      {
        title: "Operational Rules",
        icon: <FiInfo />,
        colorVariant: "neutral",
        variant: "default",
        description: "RBAC synchronization details for account profiles.",
        custom: <SecurityRulesContent />,
      },
      { ...HELP_SUPPORT_CARD },
    ]}
  />
);

const MemberContent = ({ member, onViewMembersList }) => (
  <div>
    <div className="space-y-2">
      <AppKeyValue
        label="Teammate"
        value={member?.displayName || "Not selected"}
      />
      <AppKeyValue label="Email ID" value={member?.displayEmail || "-"} />
      <AppKeyValue label="Phone" value={member?.displayPhone || "-"} />
      <AppKeyValue label="Prior Blueprint" value={member?.displayRole || "-"} />
      <AppKeyValue label="State" value={member?.status || "-"} />
    </div>

    <AppButton
      type="button"
      variant="outlined"
      colorVariant="primary"
      rounded="md"
      fullWidth
      startIcon={<FiUsers />}
      onClick={onViewMembersList}
      sx={sideButtonSx}
    >
      View Team Directory
    </AppButton>
  </div>
);

const AssignmentPreviewContent = ({ summary }) => (
  <div className="space-y-2">
    <AppKeyValue
      label="Target Profile"
      value={summary?.member?.displayName || "None"}
    />
    <AppKeyValue label="De-associating" value={summary?.currentRole || "-"} />
    <AppKeyValue
      label="Connecting Structure"
      value={summary?.targetRole || "-"}
    />
    <div className="mt-3 rounded-xl border border-border bg-surface-alt p-3">
      <AppText variant="body2" sx={previewBoxTextSx}>
        Confirming this strategy mapping instantly modifies the authorization
        tokens for this consumer across context gateways.
      </AppText>
    </div>
  </div>
);

const SecurityRulesContent = () => (
  <div className="mt-3 space-y-2.5">
    <RuleItem
      icon={<FiShield />}
      text="Role structural adjustments require elevated workspace administrative clearance."
    />
    <RuleItem
      icon={<FiUsers />}
      text="Workspace owner role assignment is static and immutable."
    />
    <RuleItem
      icon={<FiSliders />}
      text="Reassigned users must clear active sessions or refresh context keys to sync structures."
    />
  </div>
);

const RuleItem = ({ icon, text }) => (
  <AppStack direction="row" align="flex-start" gap={0.8}>
    <span className="mt-[2px] text-[13px] text-primary">{icon}</span>
    <AppText variant="body2" sx={ruleTextSx}>
      {text}
    </AppText>
  </AppStack>
);

const IconBox = ({ icon, colorVariant = "primary", large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 44 : 42,
      height: large ? 44 : 42,
      minWidth: large ? 44 : 42,
      borderRadius: "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "22px" : "20px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

// Style definitions matching components style specifications
const pageHeaderSx = { width: "100%" };

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

const breadcrumbSx = { mb: 1 };
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
  height: 36,
  minWidth: 112,
  px: 1.7,
  fontSize: "12px",
  fontWeight: 700,
  boxShadow: "0 10px 20px rgba(22, 163, 74, 0.18)",
};

const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
};
const primaryLargeButtonSx = {
  height: 38,
  px: 1.8,
  fontSize: "12px",
  fontWeight: 700,
  boxShadow: "0 10px 20px rgba(22, 163, 74, 0.18)",
};
const secondaryLargeButtonSx = {
  height: 38,
  px: 1.6,
  fontSize: "12px",
  fontWeight: 650,
};

const alertSx = { mt: 3 };

const summaryCardSx = {
  minHeight: 104,
  px: 1.6,
  py: 1.45,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const summaryTitleSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};
const summaryValueSx = {
  m: 0,
  mt: 0.45,
  fontSize: "17px",
  lineHeight: 1.1,
  color: "var(--app-color-text)",
};
const summarySubtitleSx = {
  mt: 0.55,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const formCardSx = {
  px: 3,
  py: 2.6,
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
  mt: 0.45,
  maxWidth: 760,
  fontSize: "12px",
  lineHeight: 1.6,
  color: "var(--app-color-text-muted)",
};

const labelSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};
const inputSx = {
  minHeight: 38,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};
const helperTextSx = { fontSize: "10.8px", lineHeight: 1.45 };

const submitAlertSx = { mt: 3 };
const actionsSx = {
  mt: 4,
  pt: 2.2,
  borderTop: "1px solid var(--app-color-border)",
};

const optionTitleSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};
const optionSubtitleSx = {
  mt: 0.2,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const sideButtonSx = { mt: 1.5, height: 34, fontSize: "12px", fontWeight: 700 };
const previewBoxTextSx = {
  fontSize: "11.5px",
  lineHeight: 1.5,
  color: "var(--app-color-text-muted)",
};
const ruleTextSx = {
  fontSize: "11.5px",
  lineHeight: 1.5,
  color: "var(--app-color-text-muted)",
};
const toastSx = { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)" };

export default AssignRoleDesktopPage;
