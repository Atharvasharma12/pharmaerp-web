import React, { useState, useEffect } from "react";
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
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
  AppAvatar,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
} from "@/components";

import useUser from "@/features/user/hooks/useUser";
import useAuth from "@/features/auth/hooks/useAuth";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import { WORKSPACE_STORAGE_KEY } from "@/constants";

const MyProfileDesktopPage = () => {
  const { user: authUser } = useAuth();
  const {
    user: profileUser,
    status: userStatus,
    error: userError,
    message: userMessage,
    updateProfileStatus,
    updateAvatarStatus,
    deleteAvatarStatus,
    deactivateAccountStatus,
    updateProfile,
    updateAvatar,
    deleteAvatar,
    deactivateAccount,
    clearError: clearUserError,
    clearMessage: clearUserMessage,
    getProfile,
  } = useUser();

  // Workspace Hook States for Inbound Invitation stream processing
  const {
    incomingInvitations,
    getIncomingUserInvitations,
    getIncomingUserInvitationsStatus,
    acceptIncomingInvitation,
    acceptIncomingInvitationStatus,
    error: workspaceError,
    message: workspaceMessage,
    clearError: clearWorkspaceError,
    clearMessage: clearWorkspaceMessage,
  } = useWorkspace();

  const currentUser = profileUser || authUser;

  const [fullName, setFullName] = useState(
    currentUser?.fullName || currentUser?.name || "",
  );
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");

  // Core Hydration: Pull Profile Data and Inbound Invites concurrently on mount
  useEffect(() => {
    if (getProfile) {
      getProfile().catch(() => {});
    }
    if (getIncomingUserInvitations) {
      getIncomingUserInvitations().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ fullName });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mockAvatarPayload = {
      avatar: {
        publicId: `avatar_${Date.now()}`,
        url: URL.createObjectURL(file),
      },
    };

    try {
      await updateAvatar(mockAvatarPayload);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAvatar = async () => {
    if (window.confirm("Are you sure you want to remove your avatar?")) {
      try {
        await deleteAvatar();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeactivate = async () => {
    if (
      window.confirm(
        "CRITICAL ACTION: Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      try {
        await deactivateAccount();
        window.location.href = "/login";
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Invitation Acceptance workflow sequence
  const handleAcceptInvitation = async (tokenHashOrRawToken) => {
    try {
      const result = await acceptIncomingInvitation(tokenHashOrRawToken);
      if (result?.success || result?.workspaceId) {
        // Hydrate target identifier token directly to local state locks
        const targetWorkspaceId = result?.workspaceId || result?.id;
        if (targetWorkspaceId) {
          localStorage.setItem(WORKSPACE_STORAGE_KEY, targetWorkspaceId);
        }
        // Force complete document state reload to trigger top-level core bootstrap sequencers
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Critical error accepting profile invitation stream:", err);
    }
  };

  const userName = currentUser?.fullName || currentUser?.name || "User";
  const userInitials = userName
    ?.split(" ")
    ?.map((word) => word?.[0])
    ?.join("")
    ?.slice(0, 2)
    ?.toUpperCase();

  const isUpdating =
    updateProfileStatus === "LOADING" ||
    updateAvatarStatus === "LOADING" ||
    deleteAvatarStatus === "LOADING";

  const isInvitationsLoading = getIncomingUserInvitationsStatus === "LOADING";
  const isAcceptingInvitation = acceptIncomingInvitationStatus === "LOADING";

  // Unified notifications messaging matrices
  const activeMessage = userMessage || workspaceMessage;
  const activeError = userError || workspaceError;

  const handleDismissMessage = () => {
    clearUserMessage();
    clearWorkspaceMessage();
  };

  const handleDismissError = () => {
    clearUserError();
    clearWorkspaceError();
  };

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {/* Toast Alert Systems */}
      {activeMessage && (
        <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-32px)] max-w-md -translate-x-1/2 rounded-xl border border-success-soft bg-surface p-3 shadow-lg flex items-center gap-3">
          <FiCheckCircle className="text-success text-lg shrink-0" />
          <AppText
            variant="body2"
            sx={{ color: "var(--app-color-text)", fontWeight: 650, flex: 1 }}
          >
            {activeMessage}
          </AppText>
          <button
            type="button"
            onClick={handleDismissMessage}
            className="text-text-muted hover:text-text text-xs font-bold px-1.5 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {activeError && (
        <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-32px)] max-w-md -translate-x-1/2 rounded-xl border border-error-soft bg-surface p-3 shadow-lg flex items-center gap-3">
          <FiAlertCircle className="text-error text-lg shrink-0" />
          <AppText
            variant="body2"
            sx={{ color: "var(--app-color-text)", fontWeight: 650, flex: 1 }}
          >
            {activeError}
          </AppText>
          <button
            type="button"
            onClick={handleDismissError}
            className="text-text-muted hover:text-text text-xs font-bold px-1.5 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="My Profile"
          subtitle="Manage your personal information, security preferences, and view your system account access configuration."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "User Management" },
                { label: "Profile Settings", current: true },
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

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_340px] items-start gap-5">
          <AppBox sx={{ minWidth: 0 }}>
            {/* 1. Core Profile Configuration Card */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={profileCardSx}
            >
              <div className="flex items-center gap-5 border-b border-divider pb-4">
                <div className="relative group">
                  <AppAvatar
                    src={currentUser?.avatar?.url}
                    name={userName}
                    initials={userInitials}
                    sx={avatarSx}
                  />
                  <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-divider bg-surface shadow-sm transition hover:bg-surface-hover">
                    <FiCamera className="text-[13px] text-text" />
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
                  <AppHeading level={2} weight={700} sx={profileNameSx}>
                    {userName}
                  </AppHeading>
                  <AppText variant="body2" sx={profileMetaSx}>
                    System Code:{" "}
                    <span className="font-mono font-bold text-text">
                      {currentUser?.userCode || "N/A"}
                    </span>
                  </AppText>
                  {currentUser?.avatar?.url && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      disabled={isUpdating}
                      className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-error hover:underline disabled:opacity-50"
                    >
                      <FiTrash2 /> Remove Avatar
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11.5px] font-bold text-text">
                      Full Identity Name
                    </label>
                    <div className="relative flex items-center">
                      <FiUser className="absolute left-3.5 text-text-muted text-[14px]" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-9 rounded-xl border border-divider bg-bg pl-9 pr-3.5 text-[12.5px] font-medium text-text placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors shadow-xs"
                        placeholder="Enter full name"
                        required
                        disabled={isUpdating}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11.5px] font-bold text-text">
                      User Verification Code
                    </label>
                    <div className="relative flex items-center">
                      <FiCpu className="absolute left-3.5 text-text-muted text-[14px]" />
                      <input
                        type="text"
                        value={currentUser?.userCode || "Generating..."}
                        className="w-full h-9 rounded-xl border border-divider bg-surface-alt pl-9 pr-3.5 text-[12.5px] font-mono font-bold text-text-muted cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11.5px] font-bold text-text-muted">
                      Primary Email Address
                    </label>
                    <div className="relative flex items-center">
                      <FiMail className="absolute left-3.5 text-text-muted text-[14px]" />
                      <input
                        type="email"
                        value={email}
                        className="w-full h-9 rounded-xl border border-divider bg-surface-alt pl-9 pr-3.5 text-[12.5px] font-medium text-text-muted cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11.5px] font-bold text-text-muted">
                      Contact Mobile
                    </label>
                    <div className="relative flex items-center">
                      <FiPhone className="absolute left-3.5 text-text-muted text-[14px]" />
                      <input
                        type="text"
                        value={phone || "Not Provided"}
                        className="w-full h-9 rounded-xl border border-divider bg-surface-alt pl-9 pr-3.5 text-[12.5px] font-medium text-text-muted cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-divider pt-4 flex justify-end">
                  <AppButton
                    type="submit"
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    loading={isUpdating}
                    disabled={
                      isUpdating ||
                      fullName === (currentUser?.fullName || currentUser?.name)
                    }
                    startIcon={<FiSave />}
                    sx={saveButtonSx}
                  >
                    Save Changes
                  </AppButton>
                </div>
              </form>
            </AppCard>

            {/* 2. INLINE USER INVITATIONS DIRECTORY INTERFACE */}
            {isInvitationsLoading ? (
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                sx={{ p: 2.5, mt: 4, bgcolor: "var(--app-color-surface)" }}
              >
                <AppText
                  variant="body2"
                  sx={{ color: "var(--app-color-text-muted)" }}
                  className="animate-pulse"
                >
                  Querying database for pending inbound organizational
                  invitations...
                </AppText>
              </AppCard>
            ) : incomingInvitations && incomingInvitations.length > 0 ? (
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="sm"
                sx={{ ...profileCardSx, mt: 4 }}
              >
                <AppStack
                  direction="row"
                  align="center"
                  gap={1}
                  sx={{ mb: 2.5 }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary text-[15px]">
                    <FiMail />
                  </div>
                  <AppBox>
                    <AppHeading
                      level={3}
                      weight={700}
                      sx={{
                        m: 0,
                        fontSize: "15px",
                        color: "var(--app-color-text)",
                      }}
                    >
                      Pending Inbound Workspace Invitations (
                      {incomingInvitations.length})
                    </AppHeading>
                    <AppText
                      variant="body2"
                      sx={{
                        fontSize: "11px",
                        color: "var(--app-color-text-muted)",
                      }}
                    >
                      You have been invited to join the following system
                      workspaces. Accepting will immediately change your
                      environment access.
                    </AppText>
                  </AppBox>
                </AppStack>

                <div className="space-y-3">
                  {incomingInvitations.map((invitation) => {
                    const workspaceObj = invitation.workspaceId || {};
                    const inviterObj = invitation.invitedBy || {};

                    // PASS THE DATABASE ID AS THE TARGET ACCEPTANCE IDENTIFIER
                    const targetId = invitation._id;

                    return (
                      <div
                        key={invitation._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-bg p-3.5 transition-all hover:border-divider"
                      >
                        <div className="space-y-1 min-w-0">
                          <AppHeading
                            level={4}
                            weight={700}
                            sx={{
                              m: 0,
                              fontSize: "13.5px",
                              color: "var(--app-color-text)",
                            }}
                          >
                            {workspaceObj.name || "Unnamed Workspace"}
                          </AppHeading>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted">
                            <span className="flex items-center gap-1">
                              <FiActivity className="shrink-0" /> Code:{" "}
                              <span className="font-mono font-semibold text-text">
                                {workspaceObj.workspaceCode || "N/A"}
                              </span>
                            </span>
                            <span>•</span>
                            <span>
                              Invited By:{" "}
                              <strong className="text-text">
                                {inviterObj.fullName ||
                                  inviterObj.email ||
                                  "Owner"}
                              </strong>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-warning font-medium">
                              <FiClock className="shrink-0" /> Expires:{" "}
                              {invitation.expiresAt
                                ? new Date(
                                    invitation.expiresAt,
                                  ).toLocaleDateString("en-IN")
                                : "72h"}
                            </span>
                          </div>

                          {invitation.notes && (
                            <div className="mt-1.5 rounded-md bg-surface p-2 text-[11px] text-text-muted italic border-l-2 border-primary-soft">
                              "{invitation.notes}"
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <AppButton
                            type="button"
                            variant="contained"
                            colorVariant="primary"
                            rounded="md"
                            size="small"
                            loading={isAcceptingInvitation}
                            disabled={isAcceptingInvitation}
                            startIcon={<FiCheck />}
                            onClick={() => handleAcceptInvitation(targetId)} // <-- Passes ID securely now
                            sx={{
                              height: 30,
                              px: 2,
                              fontSize: "11.5px",
                              fontWeight: 700,
                            }}
                          >
                            Accept & Join
                          </AppButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AppCard>
            ) : null}

            {/* 3. System Danger Zone Account Status Deactivation Card */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={dangerZoneCardSx}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <AppHeading level={3} weight={700} sx={dangerTitleSx}>
                    Deactivate Application Account
                  </AppHeading>
                  <AppText variant="body2" sx={dangerDescSx}>
                    Deactivating your profile flags your structural metadata
                    record as deleted. You will immediately lose contextual
                    authorization mapping capabilities across connected
                    Workspaces, Companies, and active Stores.
                  </AppText>
                </div>
                <AppButton
                  type="button"
                  variant="contained"
                  colorVariant="error"
                  rounded="md"
                  onClick={handleDeactivate}
                  loading={deactivateAccountStatus === "LOADING"}
                  startIcon={<FiLogOut />}
                  sx={deactivateButtonSx}
                >
                  Deactivate Account
                </AppButton>
              </div>
            </AppCard>
          </AppBox>

          {/* Right Audit Meta-tracking Sidebar Controls */}
          <PageRightSidebar
            spacing={4}
            cards={[
              {
                title: "Context Access Mapping",
                icon: <FiShield />,
                colorVariant: "primary",
                variant: "default",
                description:
                  "Your current active routing token environment maps to the following identity nodes:",
                custom: (
                  <div className="space-y-2.5 mt-2">
                    <ContextNodeLabel
                      label="Active Account Status"
                      value={
                        currentUser?.isActive !== false ? "ACTIVE" : "SUSPENDED"
                      }
                      isTag
                      success={currentUser?.isActive !== false}
                    />
                    <ContextNodeLabel
                      label="Assigned System Identity"
                      value={currentUser?.userCode || "N/A"}
                      fontMono
                    />
                    <ContextNodeLabel
                      label="Email Verified State"
                      value={
                        currentUser?.emailVerified ? "VERIFIED" : "UNVERIFIED"
                      }
                      isTag
                      success={currentUser?.emailVerified}
                    />
                    <ContextNodeLabel
                      label="Phone Verified State"
                      value={
                        currentUser?.phoneVerified ? "VERIFIED" : "UNVERIFIED"
                      }
                      isTag
                      success={currentUser?.phoneVerified}
                    />
                  </div>
                ),
              },
              {
                title: "Profile Audit Metrics",
                icon: <FiSliders />,
                colorVariant: "info",
                variant: "default",
                custom: (
                  <div className="space-y-2 text-[11px] text-text-muted leading-relaxed">
                    <div>
                      • Account Created:{" "}
                      <span className="font-semibold text-text">
                        {currentUser?.createdAt
                          ? new Date(currentUser.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      • Last Identity Verification:{" "}
                      <span className="font-semibold text-text">
                        {currentUser?.lastLoginAt
                          ? new Date(
                              currentUser.lastLoginAt,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      • Secure Metadata Syncing Token:{" "}
                      <span className="font-mono text-text">
                        SHA256 hash valid
                      </span>
                    </div>
                  </div>
                ),
              },
              HELP_SUPPORT_CARD,
            ]}
          />
        </div>
      </div>
    </section>
  );
};

const ContextNodeLabel = ({
  label,
  value,
  isTag = false,
  success = false,
  fontMono = false,
}) => (
  <div className="flex items-center justify-between gap-2 border-b border-divider/40 pb-1.5 last:border-0 last:pb-0">
    <span className="text-[11px] text-text-muted">{label}</span>
    {isTag ? (
      <span
        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${success ? "bg-success-soft text-success" : "bg-error-soft text-error"}`}
      >
        {value}
      </span>
    ) : (
      <span
        className={`text-[11.5px] font-semibold text-text ${fontMono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    )}
  </div>
);

// CSS SX Matrix configurations
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

const breadcrumbSx = { mt: 1 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const profileCardSx = {
  p: 2.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const avatarSx = {
  width: 68,
  height: 68,
  fontSize: "24px",
  borderRadius: "16px",
  boxShadow: "var(--app-shadow-sm)",
};

const profileNameSx = {
  m: 0,
  fontSize: "18px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const profileMetaSx = {
  mt: 0.5,
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const saveButtonSx = {
  height: 32,
  px: 2,
  fontSize: "11.5px",
  fontWeight: 700,
};

const dangerZoneCardSx = {
  mt: 4,
  p: 2.2,
  borderColor: "var(--app-color-error-soft)",
  bgcolor: "var(--app-color-surface)",
};

const dangerTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-error)",
};

const dangerDescSx = {
  mt: 0.5,
  fontSize: "11px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const deactivateButtonSx = {
  height: 34,
  px: 1.5,
  fontSize: "11px",
  fontWeight: 700,
  whiteSpace: "nowrap",
  flexShrink: 0,
};

export default MyProfileDesktopPage;
