// src/features/user/pages/MyProfilePage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useIsMobile } from "@/hooks";
import { WORKSPACE_STORAGE_KEY } from "@/constants";
import { AppConfirmModal } from "@/components";

import useUser from "@/features/user/hooks/useUser";
import useAuth from "@/features/auth/hooks/useAuth";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";

import MyProfileDesktopPage from "./desktop/MyProfileDesktopPage";
import MyProfileMobilePage from "./mobile/MyProfileMobilePage";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const MyProfilePage = () => {
  const isMobile = useIsMobile();
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

  const hasFetchedWorkspacesRef = useRef(false);
  const hasFetchedMembersRef = useRef(false);

  const currentUser = useMemo(
    () => profileUser || authUser,
    [profileUser, authUser],
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    description: "",
    variant: "warning",
    confirmLabel: "",
    actionType: "",
  });

  // Dual Hydration Hook
  useEffect(() => {
    if (getProfile && !hasFetchedMembersRef.current) {
      hasFetchedMembersRef.current = true;
      getProfile().catch(() => {});
    }
    if (getIncomingUserInvitations && !hasFetchedWorkspacesRef.current) {
      hasFetchedWorkspacesRef.current = true;
      getIncomingUserInvitations().catch(() => {});
    }

    return () => {
      clearUserError();
      clearWorkspaceError();
    };
  }, [
    getProfile,
    getIncomingUserInvitations,
    clearUserError,
    clearWorkspaceError,
  ]);

  // Synchronize dynamic updates back into controlled values
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
    }
  }, [currentUser]);

  // Toast Alert Systems Dismissals
  useEffect(() => {
    const activeMessage = userMessage || workspaceMessage;
    if (!activeMessage) return;

    const timer = window.setTimeout(() => {
      clearUserMessage();
      clearWorkspaceMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [userMessage, workspaceMessage, clearUserMessage, clearWorkspaceMessage]);

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
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

  // Safe Deletion Confirmation Window
  const handleDeleteAvatarClick = useCallback(() => {
    setConfirmConfig({
      title: "Remove Avatar Image",
      message: "Are you sure you want to remove your avatar image?",
      description:
        "This will restore your profile display back to your standard initials.",
      confirmLabel: "Remove Avatar",
      variant: "error",
      actionType: "DELETE_AVATAR",
    });
    setIsConfirmOpen(true);
  }, []);

  // Critical Account Deactivation Warning
  const handleDeactivateClick = useCallback(() => {
    setConfirmConfig({
      title: "Deactivate Profile Account",
      message: "CRITICAL ACTION: Are you sure you want to delete your account?",
      description:
        "This action cannot be undone. You will immediately lose contextual authorization mappings across all connected Workspaces, Companies, and active Stores.",
      confirmLabel: "Deactivate Account",
      variant: "error",
      actionType: "DEACTIVATE",
    });
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmAction = async () => {
    setIsConfirmOpen(false);
    if (confirmConfig.actionType === "DELETE_AVATAR") {
      try {
        await deleteAvatar();
      } catch (err) {
        console.error(err);
      }
    } else if (confirmConfig.actionType === "DEACTIVATE") {
      try {
        await deactivateAccount();
        window.location.href = "/login";
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAcceptInvitation = async (tokenHashOrRawToken) => {
    try {
      const result = await acceptIncomingInvitation(tokenHashOrRawToken);
      if (result?.success || result?.workspaceId) {
        const targetWorkspaceId = result?.workspaceId || result?.id;
        if (targetWorkspaceId) {
          localStorage.setItem(WORKSPACE_STORAGE_KEY, targetWorkspaceId);
        }
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Critical error accepting profile invitation stream:", err);
    }
  };

  const handleDismissMessage = () => {
    clearUserMessage();
    clearWorkspaceMessage();
  };

  const handleDismissError = () => {
    clearUserError();
    clearWorkspaceError();
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
  const isMutating = deactivateAccountStatus === "LOADING" || isUpdating;

  const activeMessage = userMessage || workspaceMessage;
  const activeError = userError || workspaceError;

  const sharedProps = {
    currentUser,
    fullName,
    email,
    phone,
    userName,
    userInitials,
    incomingInvitations,
    isUpdating,
    isInvitationsLoading,
    isAcceptingInvitation,
    deactivateAccountStatus,
    activeMessage,
    activeError,
    setFullName,
    handleUpdateProfile,
    handleAvatarChange,
    handleDeleteAvatar: handleDeleteAvatarClick,
    handleDeactivate: handleDeactivateClick,
    handleAcceptInvitation,
    handleDismissMessage,
    handleDismissError,
  };

  return (
    <>
      {isMobile ? (
        <MyProfileMobilePage {...sharedProps} />
      ) : (
        <MyProfileDesktopPage {...sharedProps} />
      )}

      <AppConfirmModal
        open={isConfirmOpen}
        onClose={() => !isMutating && setIsConfirmOpen(false)}
        onCancel={() => !isMutating && setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmConfig.title}
        message={confirmConfig.message}
        description={confirmConfig.description}
        variant={confirmConfig.variant}
        confirmLabel={confirmConfig.confirmLabel}
        cancelLabel="Cancel"
        loading={isMutating}
        confirmDisabled={isMutating}
        cancelDisabled={isMutating}
        closeOnBackdrop={!isMutating}
      />
    </>
  );
};

export default MyProfilePage;
