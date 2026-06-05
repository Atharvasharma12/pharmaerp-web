// src/features/workspace/pages/mobile/InviteWorkspaceMemberMobilePage.jsx

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
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppStack,
  AppTextarea,
  AppText,
} from "@/components";

const InviteWorkspaceMemberMobilePage = ({
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
    <section className="relative min-h-screen w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_8%,transparent),transparent_36%)]" />

      <AppBox sx={sectionSx}>
        <AppStack
          direction="row"
          align="center"
          justify="space-between"
          gap={1}
        >
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            disabled={isLoading}
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            sx={backButtonSx}
          >
            Members
          </AppButton>

          <AppButton
            type="button"
            variant="soft"
            colorVariant="primary"
            rounded="md"
            disabled={isLoading}
            startIcon={<FiClock />}
            onClick={handleViewInvitations}
            sx={invitesButtonSx}
          >
            Invites
          </AppButton>
        </AppStack>

        <AppBox sx={headerSx}>
          <AppBox sx={heroIconSx}>
            <FiUserPlus />
          </AppBox>

          <AppHeading level={1} weight={800} align="center" sx={titleSx}>
            Invite Member
          </AppHeading>

          <AppText variant="body2" align="center" weight={600} sx={subtitleSx}>
            Send a workspace invitation by email and optionally attach a role id
            or note.
          </AppText>
        </AppBox>

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

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="md"
          padding="none"
          sx={formCardSx}
        >
          <AppBox component="form" onSubmit={handleSubmit}>
            <AppStack direction="row" align="flex-start" gap={1.1}>
              <IconBox icon={<FiUserPlus />} large />

              <AppBox sx={{ minWidth: 0, flex: 1 }}>
                <AppHeading level={2} weight={750} sx={sectionTitleSx}>
                  Member Details
                </AppHeading>

                <AppText variant="body2" weight={500} sx={sectionSubtitleSx}>
                  If role id is blank, default staff role will be used when
                  available.
                </AppText>
              </AppBox>
            </AppStack>

            <AppStack direction="column" gap={1.25} sx={{ mt: 2 }}>
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
                labelSx={labelSx}
                inputSx={textareaSx}
                helperTextSx={helperTextSx}
              />
            </AppStack>

            {formErrors.submit ? (
              <AppText variant="body2" sx={submitErrorSx}>
                {formErrors.submit}
              </AppText>
            ) : null}

            <AppStack direction="column" gap={1} sx={actionsSx}>
              <AppButton
                type="submit"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                fullWidth
                startIcon={<FiSend />}
                loading={isInviting}
                disabled={isLoading || isCheckingWorkspace}
                sx={primaryButtonSx}
              >
                Send Invitation
              </AppButton>

              <AppStack direction="row" align="center" gap={0.9}>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  fullWidth
                  startIcon={<FiRefreshCcw />}
                  onClick={handleReset}
                  disabled={isLoading}
                  sx={secondaryButtonSx}
                >
                  Reset
                </AppButton>

                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  fullWidth
                  startIcon={<FiArrowLeft />}
                  onClick={handleBack}
                  disabled={isInviting}
                  sx={secondaryButtonSx}
                >
                  Back
                </AppButton>
              </AppStack>
            </AppStack>
          </AppBox>
        </AppCard>

        <WorkspaceSummaryCard workspaceSummary={workspaceSummary} />

        <InvitationInfoCard onViewMembers={handleViewMembers} />
      </AppBox>
    </section>
  );
};

const WorkspaceSummaryCard = ({ workspaceSummary }) => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={sideCardSx}
  >
    <AppStack direction="row" align="flex-start" gap={1.05}>
      <IconBox icon={<FiUsers />} />

      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={750} sx={sideTitleSx}>
          Workspace Summary
        </AppHeading>

        <AppText variant="body2" weight={500} sx={sideSubtitleSx}>
          Invitation will be sent for this workspace.
        </AppText>
      </AppBox>
    </AppStack>

    <AppBox sx={summaryBoxSx}>
      <SummaryRow label="Name" value={workspaceSummary?.name || "-"} />
      <SummaryRow label="Code" value={workspaceSummary?.code || "-"} />
      <SummaryRow label="Type" value={workspaceSummary?.type || "-"} />
      <SummaryRow label="Email" value={workspaceSummary?.email || "-"} />
      <SummaryRow label="Phone" value={workspaceSummary?.phone || "-"} />
    </AppBox>
  </AppCard>
);

const InvitationInfoCard = ({ onViewMembers }) => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={infoCardSx}
  >
    <AppStack direction="row" align="flex-start" gap={1.05}>
      <IconBox icon={<FiInfo />} colorVariant="info" />

      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={750} sx={sideTitleSx}>
          How Invitations Work
        </AppHeading>

        <AppText variant="body2" weight={500} sx={sideSubtitleSx}>
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

const SummaryRow = ({ label, value }) => (
  <AppStack direction="row" align="center" justify="space-between" gap={1}>
    <AppText variant="body2" weight={650} sx={summaryLabelSx}>
      {label}
    </AppText>

    <AppText variant="body2" weight={750} sx={summaryValueSx}>
      {value}
    </AppText>
  </AppStack>
);

const InfoRow = ({ icon, title, text }) => (
  <AppStack direction="row" align="flex-start" gap={1}>
    <AppBox sx={smallInfoIconSx}>{icon}</AppBox>

    <AppBox sx={{ minWidth: 0 }}>
      <AppHeading level={3} weight={750} sx={infoTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" weight={500} sx={infoTextSx}>
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
      width: large ? 40 : 36,
      height: large ? 40 : 36,
      minWidth: large ? 40 : 36,
      borderRadius: large ? "14px" : "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "21px" : "18px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  minHeight: "100vh",
  mx: "auto",
  px: { xs: 1.55, sm: 2 },
  pt: { xs: 1.55, sm: 2 },
  pb: { xs: 2, sm: 2.5 },
};

const backButtonSx = {
  height: 34,
  px: 1.2,
  fontSize: "11.4px",
  fontWeight: 750,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const invitesButtonSx = {
  height: 34,
  px: 1.2,
  fontSize: "11.4px",
  fontWeight: 800,
};

const headerSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  mt: { xs: 1.5, sm: 1.9 },
};

const heroIconSx = {
  width: 48,
  height: 48,
  mb: 1.1,
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "24px",
};

const titleSx = {
  m: 0,
  fontSize: { xs: "22px", sm: "24px" },
  lineHeight: 1.14,
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.55,
  maxWidth: 335,
  fontSize: { xs: "11.8px", sm: "12.6px" },
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const alertSx = {
  mt: 1.75,
};

const formCardSx = {
  mt: 2.15,
  width: "100%",
  px: { xs: 1.35, sm: 1.65 },
  py: { xs: 1.35, sm: 1.65 },
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-md)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "14.2px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.45,
  fontSize: "11.1px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const labelSx = {
  mb: 0.35,
  fontSize: "11.6px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 40,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const textareaSx = {
  minHeight: 92,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const helperTextSx = {
  mt: 0.45,
  fontSize: "10.7px",
  fontWeight: 500,
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const submitErrorSx = {
  mt: 1.2,
  px: 0.35,
  fontSize: "11.4px",
  fontWeight: 650,
  lineHeight: "17px",
  color: "var(--app-color-error)",
};

const actionsSx = {
  mt: 1.6,
  pt: 1.25,
  borderTop: "1px solid var(--app-color-border)",
};

const primaryButtonSx = {
  height: 46,
  fontSize: "13.5px",
  fontWeight: 800,
  boxShadow: "var(--app-shadow-sm)",
};

const secondaryButtonSx = {
  height: 38,
  fontSize: "11.8px",
  fontWeight: 750,
  bgcolor: "var(--app-color-surface)",
};

const sideCardSx = {
  mt: 1.65,
  px: 1.15,
  py: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const infoCardSx = {
  mt: 1.65,
  px: 1.15,
  py: 1.2,
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-primary-soft)",
  boxShadow: "var(--app-shadow-xs)",
};

const sideTitleSx = {
  m: 0,
  fontSize: "13.8px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sideSubtitleSx = {
  mt: 0.4,
  fontSize: "11px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const summaryBoxSx = {
  mt: 1.15,
  display: "flex",
  flexDirection: "column",
  gap: 0.85,
  p: 1,
  borderRadius: "11px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-readonly-bg)",
};

const summaryLabelSx = {
  fontSize: "10.7px",
  color: "var(--app-color-text-muted)",
};

const summaryValueSx = {
  maxWidth: "60%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textAlign: "right",
  fontSize: "11px",
  color: "var(--app-color-text)",
};

const smallInfoIconSx = {
  width: 30,
  height: 30,
  minWidth: 30,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "15px",
};

const infoTitleSx = {
  m: 0,
  fontSize: "12.2px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const infoTextSx = {
  mt: 0.35,
  fontSize: "10.8px",
  lineHeight: "15.5px",
  color: "var(--app-color-text-muted)",
};

const membersButtonSx = {
  mt: 1.35,
  height: 38,
  fontSize: "12px",
  fontWeight: 800,
};

export default InviteWorkspaceMemberMobilePage;
