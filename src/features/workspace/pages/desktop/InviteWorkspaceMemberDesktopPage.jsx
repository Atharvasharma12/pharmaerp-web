// src/features/workspace/pages/desktop/InviteWorkspaceMemberDesktopPage.jsx

import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiInfo,
  FiMail,
  FiRefreshCcw,
  FiSend,
  FiShield,
  FiUserPlus,
  FiUsers,
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

  isLoading = false,
  isCheckingWorkspace = false,
  isInviting = false,
  error,
  message,

  handleChange,
  handleSubmit,
  handleReset,
  handleBack,
  handleViewInvitations,
  handleViewMembers,
}) => {
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
              <AppStack direction="row" align="flex-start" gap={1.2}>
                <IconBox icon={<FiUserPlus />} large />

                <AppBox sx={{ minWidth: 0, flex: 1 }}>
                  <AppHeading level={2} weight={650} sx={sectionTitleSx}>
                    Invite Workspace Member
                  </AppHeading>

                  <AppText variant="body2" sx={sectionSubtitleSx}>
                    Send an invitation to add a user to this workspace. If no
                    role id is provided, the backend assigns the default staff
                    role when available.
                  </AppText>
                </AppBox>
              </AppStack>

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
                    "The invitation will be linked to this email address."
                  }
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                />

                <AppInput
                  label="Role ID"
                  name="roleId"
                  value={formData.roleId || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Optional Mongo role id"
                  fullWidth
                  size="small"
                  variant="bordered"
                  rounded="md"
                  startIcon={<FiShield />}
                  error={Boolean(formErrors.roleId)}
                  helperText={
                    formErrors.roleId ||
                    "Optional. Leave blank to invite as default staff."
                  }
                  labelSx={labelSx}
                  inputSx={inputSx}
                  helperTextSx={helperTextSx}
                />
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
                minRows={4}
                maxRows={6}
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
                    startIcon={<FiSend />}
                    loading={isInviting}
                    disabled={isLoading || isCheckingWorkspace}
                    sx={primaryButtonSx}
                  >
                    Send Invitation
                  </AppButton>
                </AppStack>
              </AppStack>
            </AppBox>
          </AppCard>

          <AppStack direction="column" gap={1.5}>
            <WorkspaceSummaryCard workspaceSummary={workspaceSummary} />
            <InvitationInfoCard onViewMembers={handleViewMembers} />
          </AppStack>
        </div>
      </div>
    </section>
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

const WorkspaceSummaryCard = ({ workspaceSummary }) => (
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
          Invitation will be sent for this workspace.
        </AppText>
      </AppBox>
    </AppStack>

    <div className="mt-3 space-y-2">
      <AppKeyValue label="Name" value={workspaceSummary?.name || "-"} />
      <AppKeyValue label="Code" value={workspaceSummary?.code || "-"} />
      <AppKeyValue label="Type" value={workspaceSummary?.type || "-"} />
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
