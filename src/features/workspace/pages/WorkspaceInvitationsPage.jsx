// src/features/workspace/pages/WorkspaceInvitationsPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppConfirmModal } from "@/components";

import useWorkspace from "../hooks/useWorkspace";

import WorkspaceInvitationsDesktopPage from "./desktop/WorkspaceInvitationsDesktopPage";
import WorkspaceInvitationsMobilePage from "./mobile/WorkspaceInvitationsMobilePage";

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Expired", value: "expired" },
];

const initialFilters = {
  search: "",
  status: "all",
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRoleName = (role) => {
  const roleName = role?.name || role?.title || role?.code;

  if (!roleName) return "Staff";

  return String(roleName)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getUserName = (user) =>
  user?.fullName || user?.name || user?.profile?.fullName || user?.email || "-";

const getEffectiveStatus = (invitation) => {
  if (
    invitation?.status === "pending" &&
    invitation?.expiresAt &&
    new Date(invitation.expiresAt) <= new Date()
  ) {
    return "expired";
  }

  return invitation?.status || "pending";
};

const mapInvitationForView = (invitation) => {
  const role = invitation?.roleId || invitation?.role || null;
  const invitedBy = invitation?.invitedBy || null;
  const acceptedBy = invitation?.acceptedBy || null;
  const cancelledBy = invitation?.cancelledBy || null;
  const effectiveStatus = getEffectiveStatus(invitation);

  const branchAccess = Array.isArray(invitation?.branchAccess)
    ? invitation.branchAccess
    : [];

  const storeFootprint = invitation?.accessAllBranches
    ? "All Stores"
    : branchAccess.length > 0
      ? `${branchAccess.length} Store${branchAccess.length > 1 ? "s" : ""}`
      : "Workspace Only";

  return {
    ...invitation,
    role,
    invitedBy,
    acceptedBy,
    cancelledBy,
    effectiveStatus,
    branchAccess,
    storeFootprint,
    resendCount: invitation?.resendCount || 0,
    lastResentAt: formatDateTime(invitation?.lastResentAt),
    displayEmail: invitation?.invitedEmail || "-",
    displayRole: formatRoleName(role),
    displayInvitedBy: getUserName(invitedBy),
    displayAcceptedBy: getUserName(acceptedBy),
    displayCancelledBy: getUserName(cancelledBy),
    displayCreatedAt: formatDate(invitation?.createdAt),
    displayExpiresAt: formatDateTime(invitation?.expiresAt),
    displayAcceptedAt: formatDateTime(invitation?.acceptedAt),
    displayCancelledAt: formatDateTime(invitation?.cancelledAt),
  };
};

const WorkspaceInvitationsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    currentWorkspace,
    invitations,

    getMyWorkspaces,
    getWorkspaceInvitations,
    cancelWorkspaceInvitation,
    resendWorkspaceInvitation,

    getMyWorkspacesStatus,
    getWorkspaceInvitationsStatus,
    cancelWorkspaceInvitationStatus,
    resendWorkspaceInvitationStatus,

    error,
    message,

    clearError,
    clearMessage,
  } = useWorkspace();

  const hasFetchedWorkspacesRef = useRef(false);
  const hasFetchedInvitationsRef = useRef(false);

  const [filters, setFilters] = useState(initialFilters);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const workspaceId = currentWorkspace?._id;

  const isLoadingWorkspaces = getMyWorkspacesStatus === API_STATUS.LOADING;
  const isLoadingInvitations =
    getWorkspaceInvitationsStatus === API_STATUS.LOADING;
  const isCancellingInvitation =
    cancelWorkspaceInvitationStatus === API_STATUS.LOADING;

  const isLoading = isLoadingWorkspaces || isLoadingInvitations;
  const hasError = getWorkspaceInvitationsStatus === API_STATUS.ERROR;

  const fetchWorkspaces = useCallback(async () => {
    try {
      await getMyWorkspaces();
    } catch {
      // Error is already stored in workspace slice.
    }
  }, [getMyWorkspaces]);

  const fetchInvitations = useCallback(async () => {
    if (!workspaceId) return;

    try {
      await getWorkspaceInvitations(workspaceId);
    } catch {
      // Error is already stored in workspace slice.
    }
  }, [getWorkspaceInvitations, workspaceId]);

  useEffect(() => {
    clearError();

    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    if (workspaceId || hasFetchedWorkspacesRef.current) return;

    hasFetchedWorkspacesRef.current = true;
    fetchWorkspaces();
  }, [fetchWorkspaces, workspaceId]);

  useEffect(() => {
    if (!workspaceId || hasFetchedInvitationsRef.current) return;

    hasFetchedInvitationsRef.current = true;
    fetchInvitations();
  }, [fetchInvitations, workspaceId]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [message, clearMessage]);

  const mappedInvitations = useMemo(
    () =>
      (Array.isArray(invitations) ? invitations : []).map(mapInvitationForView),
    [invitations],
  );

  const filteredInvitations = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedInvitations.filter((invitation) => {
      const matchesSearch =
        !search ||
        normalizeText(invitation.displayEmail).includes(search) ||
        normalizeText(invitation.displayRole).includes(search) ||
        normalizeText(invitation.effectiveStatus).includes(search) ||
        normalizeText(invitation.displayInvitedBy).includes(search) ||
        normalizeText(invitation.displayAcceptedBy).includes(search) ||
        normalizeText(invitation.displayCancelledBy).includes(search) ||
        normalizeText(invitation.notes).includes(search);

      const matchesStatus =
        filters.status === "all" ||
        invitation.effectiveStatus === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [mappedInvitations, filters]);

  const stats = useMemo(() => {
    const total = mappedInvitations.length;
    const pending = mappedInvitations.filter(
      (item) => item.effectiveStatus === "pending",
    ).length;
    const accepted = mappedInvitations.filter(
      (item) => item.effectiveStatus === "accepted",
    ).length;
    const cancelled = mappedInvitations.filter(
      (item) => item.effectiveStatus === "cancelled",
    ).length;
    const expired = mappedInvitations.filter(
      (item) => item.effectiveStatus === "expired",
    ).length;

    return [
      {
        id: "total",
        title: "Total",
        value: total,
        description: "Invitations",
        colorVariant: "primary",
      },
      {
        id: "pending",
        title: "Pending",
        value: pending,
        description: "Awaiting action",
        colorVariant: "warning",
      },
      {
        id: "accepted",
        title: "Accepted",
        value: accepted,
        description: "Joined workspace",
        colorVariant: "success",
      },
      {
        id: "expired",
        title: "Expired",
        value: expired,
        description: `${cancelled} cancelled`,
        colorVariant: "error",
      },
    ];
  }, [mappedInvitations]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({
        key: "search",
        label: `Search: ${filters.search}`,
        value: filters.search,
      });
    }

    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label:
          statusOptions.find((option) => option.value === filters.status)
            ?.label || filters.status,
        value: filters.status,
      });
    }

    return chips;
  }, [filters]);

  const handleFilterChange = useCallback((eventOrValue) => {
    if (eventOrValue?.target) {
      const { name, value } = eventOrValue.target;

      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));

      return;
    }

    setFilters((prev) => ({
      ...prev,
      ...eventOrValue,
    }));
  }, []);

  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? event;

    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: initialFilters[key],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    hasFetchedInvitationsRef.current = false;
    fetchInvitations();
  }, [fetchInvitations]);

  const handleInviteMember = useCallback(() => {
    navigate(ROUTES.INVITE_WORKSPACE_MEMBER);
  }, [navigate]);

  const handleViewMembers = useCallback(() => {
    navigate(ROUTES.WORKSPACE_MEMBERS);
  }, [navigate]);

  const handleBackToWorkspace = useCallback(() => {
    navigate(ROUTES.WORKSPACE);
  }, [navigate]);

  const handleCancelInvitation = useCallback((invitation) => {
    if (!invitation || invitation.effectiveStatus !== "pending") return;

    setSelectedInvitation(invitation);
    setIsCancelModalOpen(true);
  }, []);

  const closeCancelModal = useCallback(() => {
    if (isCancellingInvitation) return;

    setIsCancelModalOpen(false);
    setSelectedInvitation(null);
  }, [isCancellingInvitation]);

  const handleConfirmCancelInvitation = useCallback(async () => {
    if (!workspaceId || !selectedInvitation?._id) return;

    try {
      await cancelWorkspaceInvitation(workspaceId, selectedInvitation._id);
      closeCancelModal();
    } catch {
      // Error is already stored in workspace slice.
    }
  }, [
    cancelWorkspaceInvitation,
    closeCancelModal,
    selectedInvitation,
    workspaceId,
  ]);

  const handleResendInvitation = useCallback(
    async (invitation) => {
      if (!workspaceId || !invitation?._id) return;
      try {
        await resendWorkspaceInvitation(workspaceId, invitation._id);
      } catch {
        // Error handled in slice
      }
    },
    [resendWorkspaceInvitation, workspaceId],
  );

  const [copiedId, setCopiedId] = useState(null);
  const handleCopyLink = useCallback((invitation) => {
    if (!invitation) return;
    const url = `${window.location.origin}/workspace-invitations/${invitation._id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(invitation._id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const pageProps = {
    workspace: currentWorkspace,
    invitations: filteredInvitations,
    stats,

    filters,
    activeFilterChips,
    statusOptions,

    isLoading,
    hasError,
    error,
    message,
    copiedId,

    totalInvitations: mappedInvitations.length,
    filteredInvitationsCount: filteredInvitations.length,
    hasInvitations: mappedInvitations.length > 0,
    hasFilteredInvitations: filteredInvitations.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,

    handleRefresh,
    handleInviteMember,
    handleViewMembers,
    handleBackToWorkspace,
    handleCancelInvitation,
    handleResendInvitation,
    handleCopyLink,

    clearMessage,
  };

  return (
    <>
      {isMobile ? (
        <WorkspaceInvitationsMobilePage {...pageProps} />
      ) : (
        <WorkspaceInvitationsDesktopPage {...pageProps} />
      )}

      <AppConfirmModal
        open={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleConfirmCancelInvitation}
        title="Cancel Invitation"
        message={`Cancel invitation for ${
          selectedInvitation?.displayEmail || "this email"
        }?`}
        description="The invitation link will stop working and this seat will become available again."
        variant="error"
        confirmLabel="Cancel Invitation"
        cancelLabel="Keep Invitation"
        loading={isCancellingInvitation}
        closeOnBackdrop={!isCancellingInvitation}
      />
    </>
  );
};

export default WorkspaceInvitationsPage;
