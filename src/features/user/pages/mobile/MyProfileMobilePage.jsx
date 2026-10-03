// src/features/user/pages/mobile/MyProfileMobilePage.jsx

import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCamera,
  FiTrash2,
  FiSave,
  FiCpu,
  FiLogOut,
  FiCheckCircle,
  FiAlertCircle,
  FiSliders,
  FiClock,
  FiActivity,
  FiCheck,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
  AppAvatar,
  AppTag,
  AppStatusBadge,
} from "@/components";

const MyProfileMobilePage = ({
  currentUser,
  fullName,
  email,
  phone,
  userName,
  userInitials,
  incomingInvitations = [],
  isUpdating = false,
  isInvitationsLoading = false,
  isAcceptingInvitation = false,
  deactivateAccountStatus,
  activeMessage,
  activeError,
  setFullName,
  handleUpdateProfile,
  handleAvatarChange,
  handleDeleteAvatar,
  handleDeactivate,
  handleAcceptInvitation,
  handleDismissMessage,
  handleDismissError,
}) => {
  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* --- SYSTEM NOTIFICATION BANNER STRIPS --- */}
        {activeMessage && (
          <AppBox sx={toastNotificationWrapperSx}>
            <div className="flex items-center gap-2 rounded-lg border border-success-soft bg-surface p-2.5 shadow-sm w-full">
              <FiCheckCircle className="text-success text-base shrink-0" />
              <AppText variant="body2" weight={700} sx={toastMessageTextSx}>
                {activeMessage}
              </AppText>
              <button
                type="button"
                onClick={handleDismissMessage}
                className="text-text-muted text-[11px] font-bold shrink-0 ml-auto"
              >
                Dismiss
              </button>
            </div>
          </AppBox>
        )}

        {activeError && (
          <AppBox sx={toastNotificationWrapperSx}>
            <div className="flex items-center gap-2 rounded-lg border border-error-soft bg-surface p-2.5 shadow-sm w-full">
              <FiAlertCircle className="text-error text-base shrink-0" />
              <AppText variant="body2" weight={700} sx={toastMessageTextSx}>
                {activeError}
              </AppText>
              <button
                type="button"
                onClick={handleDismissError}
                className="text-text-muted text-[11px] font-bold shrink-0 ml-auto"
              >
                Dismiss
              </button>
            </div>
          </AppBox>
        )}

        {/* --- DENSE HEADER TITLE SECTION --- */}
        <AppBox sx={headerWrapperSx}>
          <AppHeading level={1} weight={800} sx={pageTitleSx}>
            My Profile
          </AppHeading>
          <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
            Manage your credentials and core account access configurations.
          </AppText>
        </AppBox>

        {/* --- MAIN HIGH-DENSITY SCROLL DATA PANELS --- */}
        <AppBox sx={mainBodyScrollContentWrapperSx}>
          <AppStack direction="column" gap={1.25}>
            {/* 1. Identity profile settings metadata card */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              padding="none"
              sx={moduleCardContainerSx}
            >
              <AppBox sx={{ p: 1.25 }}>
                <AppStack
                  direction="row"
                  align="center"
                  gap={1.25}
                  sx={{
                    pb: 1.5,
                    borderBottom: "1px solid var(--app-color-divider)",
                  }}
                >
                  <div className="relative shrink-0">
                    <AppAvatar
                      src={currentUser?.avatar?.url}
                      name={userName}
                      initials={userInitials}
                      sx={avatarMobileSx}
                    />
                    <label className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-divider bg-surface shadow-xs transition active:bg-surface-active">
                      <FiCamera className="text-[11px] text-text" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={isUpdating}
                      />
                    </label>
                  </div>

                  <div className="min-w-0 flex-1">
                    <AppHeading level={2} weight={800} sx={profileNameMobileSx}>
                      {userName}
                    </AppHeading>
                    <AppText variant="body2" sx={profileMetaMobileSx}>
                      Identity Code:{" "}
                      <span className="font-mono font-bold text-text">
                        {currentUser?.userCode || "N/A"}
                      </span>
                    </AppText>
                    {currentUser?.avatar?.url && (
                      <button
                        type="button"
                        onClick={handleDeleteAvatar}
                        disabled={isUpdating}
                        className="mt-1 flex items-center gap-1 text-[10.5px] font-bold text-error outline-none"
                      >
                        <FiTrash2 /> Remove Avatar
                      </button>
                    )}
                  </div>
                </AppStack>

                {/* Form fields layout block */}
                <form onSubmit={handleUpdateProfile} className="mt-3 space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-text">
                      Full Identity Name
                    </label>
                    <div className="relative flex items-center">
                      <FiUser className="absolute left-3 text-text-muted text-[13px]" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-8.5 rounded-xl border border-divider bg-bg pl-8.5 pr-3 text-[11.5px] font-semibold text-text placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors shadow-xs"
                        placeholder="Enter full name"
                        required
                        disabled={isUpdating}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-text-muted">
                      User Verification Code
                    </label>
                    <div className="relative flex items-center">
                      <FiCpu className="absolute left-3 text-text-muted text-[13px]" />
                      <input
                        type="text"
                        value={currentUser?.userCode || "Generating..."}
                        className="w-full h-8.5 rounded-xl border border-divider bg-surface-alt pl-8.5 pr-3 text-[11.5px] font-mono font-bold text-text-muted cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-text-muted">
                      Primary Email Address
                    </label>
                    <div className="relative flex items-center">
                      <FiMail className="absolute left-3 text-text-muted text-[13px]" />
                      <input
                        type="email"
                        value={email}
                        className="w-full h-8.5 rounded-xl border border-divider bg-surface-alt pl-8.5 pr-3 text-[11.5px] font-semibold text-text-muted cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-text-muted">
                      Contact Mobile
                    </label>
                    <div className="relative flex items-center">
                      <FiPhone className="absolute left-3 text-text-muted text-[13px]" />
                      <input
                        type="text"
                        value={phone || "Not Provided"}
                        className="w-full h-8.5 rounded-xl border border-divider bg-surface-alt pl-8.5 pr-3 text-[11.5px] font-semibold text-text-muted cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <AppButton
                      type="submit"
                      variant="contained"
                      colorVariant="primary"
                      rounded="md"
                      loading={isUpdating}
                      disabled={
                        isUpdating ||
                        fullName ===
                          (currentUser?.fullName || currentUser?.name)
                      }
                      startIcon={<FiSave />}
                      sx={saveButtonMobileSx}
                    >
                      Save Changes
                    </AppButton>
                  </div>
                </form>
              </AppBox>
            </AppCard>

            {/* 2. Pending inbound organization invitations ledger container */}
            {isInvitationsLoading ? (
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                padding="none"
                sx={{
                  p: 1.25,
                  bgcolor: "var(--app-color-surface)",
                  borderColor: "var(--app-color-border)",
                }}
              >
                <AppText
                  variant="body2"
                  sx={{
                    color: "var(--app-color-text-muted)",
                    fontSize: "11px",
                  }}
                  className="animate-pulse"
                >
                  Querying workspace registry for pending invitations...
                </AppText>
              </AppCard>
            ) : incomingInvitations && incomingInvitations.length > 0 ? (
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={moduleCardContainerSx}
              >
                <AppBox sx={cardHeaderBannerSx}>
                  <AppStack direction="row" align="center" gap={0.5}>
                    <FiMail className="text-primary text-[13px]" />
                    <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                      Pending Workspace Invitations (
                      {incomingInvitations.length})
                    </AppHeading>
                  </AppStack>
                </AppBox>

                <AppBox sx={{ p: 1.25 }}>
                  <AppStack direction="column" gap={1}>
                    {incomingInvitations.map((invitation) => {
                      const workspaceObj = invitation.workspaceId || {};
                      const inviterObj = invitation.invitedBy || {};
                      const targetId = invitation._id;

                      return (
                        <div
                          key={invitation._id}
                          className="rounded-xl border border-border bg-bg p-3 flex flex-col gap-2.5"
                        >
                          <div className="min-w-0">
                            <AppHeading
                              level={3}
                              weight={800}
                              sx={inviteWorkspaceTitleSx}
                            >
                              {workspaceObj.name || "Workspace Profile"}
                            </AppHeading>
                            <div className="flex flex-col gap-0.5 mt-1 text-[10.5px] text-text-muted font-semibold">
                              <span>
                                Code:{" "}
                                <span className="font-mono text-text font-bold">
                                  {workspaceObj.workspaceCode || "N/A"}
                                </span>
                              </span>
                              <span>
                                Invited By:{" "}
                                <span className="text-text">
                                  {inviterObj.fullName ||
                                    inviterObj.email ||
                                    "System"}
                                </span>
                              </span>
                              <span className="text-warning flex items-center gap-0.5">
                                <FiClock /> Expires soon
                              </span>
                            </div>
                            {invitation.notes && (
                              <div className="mt-1.5 rounded bg-surface p-2 text-[10px] text-text-muted italic border-l-2 border-primary-soft">
                                &ldquo;{invitation.notes}&rdquo;
                              </div>
                            )}
                          </div>
                          <AppButton
                            type="button"
                            variant="contained"
                            colorVariant="primary"
                            size="small"
                            rounded="md"
                            loading={isAcceptingInvitation}
                            disabled={isAcceptingInvitation}
                            startIcon={<FiCheck />}
                            onClick={() => handleAcceptInvitation(targetId)}
                            sx={acceptInviteBtnMobileSx}
                          >
                            Accept & Join
                          </AppButton>
                        </div>
                      );
                    })}
                  </AppStack>
                </AppBox>
              </AppCard>
            ) : null}

            {/* 3. Operational security metadata access details mappings card */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              padding="none"
              sx={moduleCardContainerSx}
            >
              <AppBox sx={cardHeaderBannerSx}>
                <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                  Context Access Mapping
                </AppHeading>
              </AppBox>
              <AppBox sx={{ p: 1.25, spaceY: 3 }}>
                <CompactLabelRow
                  label="Active Account Status"
                  value={
                    <AppTag
                      label={
                        currentUser?.isActive !== false ? "ACTIVE" : "SUSPENDED"
                      }
                      colorVariant={
                        currentUser?.isActive !== false ? "success" : "error"
                      }
                      variant="soft"
                      rounded="sm"
                      sx={inlineStatusTagSx}
                    />
                  }
                />
                <CompactLabelRow
                  label="Assigned System Identity"
                  value={
                    <span className="font-mono text-[11px] font-bold text-text">
                      {currentUser?.userCode || "N/A"}
                    </span>
                  }
                />
                <CompactLabelRow
                  label="Email Verified State"
                  value={
                    <AppTag
                      label={
                        currentUser?.emailVerified ? "VERIFIED" : "UNVERIFIED"
                      }
                      colorVariant={
                        currentUser?.emailVerified ? "success" : "error"
                      }
                      variant="soft"
                      rounded="sm"
                      sx={inlineStatusTagSx}
                    />
                  }
                />
                <CompactLabelRow
                  label="Phone Verified State"
                  value={
                    <AppTag
                      label={
                        currentUser?.phoneVerified ? "VERIFIED" : "UNVERIFIED"
                      }
                      colorVariant={
                        currentUser?.phoneVerified ? "success" : "error"
                      }
                      variant="soft"
                      rounded="sm"
                      sx={inlineStatusTagSx}
                    />
                  }
                />

                <div className="w-full h-[1px] bg-divider my-2" />

                <div className="flex flex-col gap-0.5 text-[10.5px] text-text-muted font-semibold">
                  <span>
                    • Created:{" "}
                    <span className="text-text">
                      {currentUser?.createdAt
                        ? new Date(currentUser.createdAt).toLocaleDateString(
                            "en-IN",
                          )
                        : "N/A"}
                    </span>
                  </span>
                  <span>
                    • Last Verification:{" "}
                    <span className="text-text">
                      {currentUser?.lastLoginAt
                        ? new Date(currentUser.lastLoginAt).toLocaleDateString(
                            "en-IN",
                          )
                        : "N/A"}
                    </span>
                  </span>
                  <span>
                    • Synchronization Token:{" "}
                    <span className="font-mono text-text text-[9.5px]">
                      SHA256 Encrypted
                    </span>
                  </span>
                </div>
              </AppBox>
            </AppCard>

            {/* 4. Destruction safety system boundary parameters profile card */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              padding="none"
              sx={dangerZoneCardMobileSx}
            >
              <AppBox sx={{ p: 1.25 }}>
                <AppHeading level={3} weight={800} sx={dangerTitleMobileSx}>
                  Deactivate Application Account
                </AppHeading>
                <AppText variant="body2" sx={dangerDescMobileSx}>
                  Deactivating your profile completely isolates your operational
                  authorization maps across connected workspace terminals.
                </AppText>
                <AppButton
                  type="button"
                  variant="contained"
                  colorVariant="error"
                  size="small"
                  rounded="md"
                  onClick={handleDeactivate}
                  loading={deactivateAccountStatus === "LOADING"}
                  startIcon={<FiLogOut />}
                  sx={deactivateBtnMobileSx}
                >
                  Deactivate Account
                </AppButton>
              </AppBox>
            </AppCard>
          </AppStack>
        </AppBox>
      </AppBox>
    </section>
  );
};

const CompactLabelRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-2 text-[11px]">
    <AppText
      variant="body2"
      weight={700}
      sx={{ color: "var(--app-color-text-muted)" }}
    >
      {label}
    </AppText>
    <div className="font-semibold text-text text-right">{value}</div>
  </div>
);

/* Architectural Layout Token Specifications */
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

const toastNotificationWrapperSx = {
  px: 0.5,
  pt: 1,
};

const toastMessageTextSx = {
  fontSize: "11px",
  color: "var(--app-color-text)",
  lineHeight: 1.3,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1.25,
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

const mainBodyScrollContentWrapperSx = {
  px: 0.5,
  py: 1.25,
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 20%, transparent)",
};

const moduleCardContainerSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const cardHeaderBannerSx = {
  px: 1.2,
  py: 0.85,
  borderBottom: "1px solid var(--app-color-divider)",
  bgcolor: "var(--app-color-surface-alt)",
};

const cardHeaderTitleSx = {
  m: 0,
  fontSize: "12px",
  letterSpacing: "-0.1px",
  color: "var(--app-color-text)",
};

const avatarMobileSx = {
  width: 52,
  height: 52,
  fontSize: "18px",
  borderRadius: "12px",
  boxShadow: "var(--app-shadow-sm)",
};

const profileNameMobileSx = {
  m: 0,
  fontSize: "15px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const profileMetaMobileSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const saveButtonMobileSx = {
  height: 30,
  fontSize: "11px",
  fontWeight: 750,
  px: 1.5,
};

const inviteWorkspaceTitleSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const acceptInviteBtnMobileSx = {
  height: 28,
  fontSize: "10.5px",
  fontWeight: 750,
  width: "100%",
  mt: 0.5,
};

const inlineStatusTagSx = {
  height: 16,
  fontSize: "8.5px",
  px: 0.8,
};

const dangerZoneCardMobileSx = {
  borderColor: "var(--app-color-error-soft)",
  bgcolor: "var(--app-color-surface)",
};

const dangerTitleMobileSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-error)",
};

const dangerDescMobileSx = {
  mt: 0.25,
  fontSize: "11px",
  lineHeight: 1.4,
  color: "var(--app-color-text-muted)",
};

const deactivateBtnMobileSx = {
  height: 30,
  fontSize: "11px",
  fontWeight: 750,
  width: "100%",
  mt: 1.2,
};

const searchBarSx = { width: "100%" };
const selectInputSx = { width: "100%" };

export default MyProfileMobilePage;
