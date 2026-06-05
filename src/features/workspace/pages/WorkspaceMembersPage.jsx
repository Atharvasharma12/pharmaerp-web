// src/features/workspace/pages/WorkspaceMembersPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppConfirmModal } from "@/components";

import useWorkspace from "../hooks/useWorkspace";

import WorkspaceMembersDesktopPage from "./desktop/WorkspaceMembersDesktopPage";
import WorkspaceMembersMobilePage from "./mobile/WorkspaceMembersMobilePage";

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const roleOptions = [
  { label: "All Roles", value: "all" },
  { label: "Owner", value: "owner" },
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Staff", value: "staff" },
];

const initialFilters = {
  search: "",
  status: "all",
  role: "all",
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

  if (!roleName) return "-";

  return String(roleName)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getRoleCode = (role) => normalizeText(role?.code || role?.name || "");

const getUser = (member) => member?.userId || member?.user || null;

const getDisplayName = (member) => {
  const user = getUser(member);

  return (
    user?.fullName ||
    user?.name ||
    user?.profile?.fullName ||
    user?.email ||
    "Workspace Member"
  );
};

const getDisplayEmail = (member) => {
  const user = getUser(member);

  return user?.email || "-";
};

const getDisplayPhone = (member) => {
  const user = getUser(member);
  const phone = user?.phone || user?.mobile || user?.profile?.phone;

  return phone ? `+91 ${phone}` : "-";
};

const mapMemberForView = (member) => {
  const user = getUser(member);
  const role = member?.roleId || member?.role || null;
  const displayName = getDisplayName(member);
  const displayEmail = getDisplayEmail(member);
  const displayPhone = getDisplayPhone(member);
  const displayRole = member?.isOwner ? "Owner" : formatRoleName(role);

  return {
    ...member,
    user,
    role,
    displayName,
    displayEmail,
    displayPhone,
    displayRole,
    roleCode: member?.isOwner ? "owner" : getRoleCode(role),
    displayJoinedAt: formatDate(member?.createdAt),
    displayLastActiveAt: formatDateTime(member?.lastActiveAt),
  };
};

const WorkspaceMembersPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    currentWorkspace,
    members,
    getMyWorkspaces,
    getWorkspaceMembers,
    updateWorkspaceMemberStatus,
    removeWorkspaceMember,
    getMyWorkspacesStatus,
    getWorkspaceMembersStatus,
    updateWorkspaceMemberStatus: updateMemberStatusStatus,
    removeWorkspaceMemberStatus,
    error,
    message,
    clearError,
    clearMessage,
  } = useWorkspace();

  const hasFetchedWorkspacesRef = useRef(false);
  const hasFetchedMembersRef = useRef(false);

  const [filters, setFilters] = useState(initialFilters);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberAction, setMemberAction] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const workspaceId = currentWorkspace?._id;

  const isLoadingWorkspaces = getMyWorkspacesStatus === API_STATUS.LOADING;
  const isLoadingMembers = getWorkspaceMembersStatus === API_STATUS.LOADING;
  const isUpdatingStatus = updateMemberStatusStatus === API_STATUS.LOADING;
  const isRemovingMember = removeWorkspaceMemberStatus === API_STATUS.LOADING;

  const isLoading = isLoadingWorkspaces || isLoadingMembers;
  const isMutating = isUpdatingStatus || isRemovingMember;
  const hasError = getWorkspaceMembersStatus === API_STATUS.ERROR;

  const fetchWorkspaces = useCallback(async () => {
    try {
      await getMyWorkspaces();
    } catch {
      // Error is already stored in workspace slice.
    }
  }, [getMyWorkspaces]);

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) return;

    try {
      await getWorkspaceMembers(workspaceId);
    } catch {
      // Error is already stored in workspace slice.
    }
  }, [getWorkspaceMembers, workspaceId]);

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
    if (!workspaceId || hasFetchedMembersRef.current) return;

    hasFetchedMembersRef.current = true;
    fetchMembers();
  }, [fetchMembers, workspaceId]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [message, clearMessage]);

  const mappedMembers = useMemo(
    () => (Array.isArray(members) ? members : []).map(mapMemberForView),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedMembers.filter((member) => {
      const matchesSearch =
        !search ||
        normalizeText(member.displayName).includes(search) ||
        normalizeText(member.displayEmail).includes(search) ||
        normalizeText(member.displayPhone).includes(search) ||
        normalizeText(member.displayRole).includes(search) ||
        normalizeText(member.status).includes(search) ||
        normalizeText(member.notes).includes(search);

      const matchesStatus =
        filters.status === "all" || member.status === filters.status;

      const matchesRole =
        filters.role === "all" ||
        (filters.role === "owner"
          ? member.isOwner
          : normalizeText(member.roleCode).includes(filters.role));

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [mappedMembers, filters]);

  const stats = useMemo(() => {
    const total = mappedMembers.length;
    const active = mappedMembers.filter(
      (member) => member.status === "active",
    ).length;
    const inactive = mappedMembers.filter(
      (member) => member.status === "inactive",
    ).length;
    const suspended = mappedMembers.filter(
      (member) => member.status === "suspended",
    ).length;

    return [
      {
        id: "total",
        title: "Total",
        value: total,
        description: "Members",
        colorVariant: "primary",
      },
      {
        id: "active",
        title: "Active",
        value: active,
        description: "Can access workspace",
        colorVariant: "success",
      },
      {
        id: "inactive",
        title: "Inactive",
        value: inactive,
        description: "Access paused",
        colorVariant: "warning",
      },
      {
        id: "suspended",
        title: "Suspended",
        value: suspended,
        description: "Access blocked",
        colorVariant: "error",
      },
    ];
  }, [mappedMembers]);

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

    if (filters.role !== "all") {
      chips.push({
        key: "role",
        label:
          roleOptions.find((option) => option.value === filters.role)?.label ||
          filters.role,
        value: filters.role,
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
    hasFetchedMembersRef.current = false;
    fetchMembers();
  }, [fetchMembers]);

  const handleInviteMember = useCallback(() => {
    navigate(ROUTES.INVITE_WORKSPACE_MEMBER);
  }, [navigate]);

  const handleViewInvitations = useCallback(() => {
    navigate(ROUTES.WORKSPACE_INVITATIONS);
  }, [navigate]);

  const handleBackToWorkspace = useCallback(() => {
    navigate(ROUTES.WORKSPACE);
  }, [navigate]);

  const openConfirm = useCallback((member, action) => {
    if (!member || member.isOwner) return;

    setSelectedMember(member);
    setMemberAction(action);
    setIsConfirmOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    if (isMutating) return;

    setIsConfirmOpen(false);
    setSelectedMember(null);
    setMemberAction(null);
  }, [isMutating]);

  const handleChangeMemberStatus = useCallback(
    (member, status) => {
      openConfirm(member, status);
    },
    [openConfirm],
  );

  const handleRemoveMember = useCallback(
    (member) => {
      openConfirm(member, "remove");
    },
    [openConfirm],
  );

  const handleConfirmAction = useCallback(async () => {
    if (!workspaceId || !selectedMember || !memberAction) return;

    const memberUserId =
      selectedMember?.user?._id || selectedMember?.userId?._id;

    if (!memberUserId) return;

    try {
      if (memberAction === "remove") {
        await removeWorkspaceMember(workspaceId, memberUserId);
      } else {
        await updateWorkspaceMemberStatus(
          workspaceId,
          memberUserId,
          memberAction,
        );
      }

      closeConfirm();
    } catch {
      // Error is already stored in workspace slice.
    }
  }, [
    closeConfirm,
    memberAction,
    removeWorkspaceMember,
    selectedMember,
    updateWorkspaceMemberStatus,
    workspaceId,
  ]);

  const confirmConfig = useMemo(() => {
    if (!selectedMember || !memberAction) {
      return {
        title: "Update Member",
        message: "Are you sure you want to update this workspace member?",
        confirmLabel: "Confirm",
        variant: "warning",
      };
    }

    if (memberAction === "remove") {
      return {
        title: "Remove Workspace Member",
        message: `Remove ${selectedMember.displayName} from this workspace?`,
        description:
          "The member will be marked inactive and will no longer be able to access this workspace.",
        confirmLabel: "Remove Member",
        variant: "error",
      };
    }

    return {
      title: "Change Member Status",
      message: `Change ${selectedMember.displayName}'s status to ${memberAction}?`,
      description: "This controls whether the member can access the workspace.",
      confirmLabel: "Update Status",
      variant: memberAction === "active" ? "success" : "warning",
    };
  }, [memberAction, selectedMember]);

  const pageProps = {
    workspace: currentWorkspace,
    members: filteredMembers,
    stats,

    filters,
    activeFilterChips,
    statusOptions,
    roleOptions,

    isLoading,
    hasError,
    error,
    message,

    totalMembers: mappedMembers.length,
    filteredMembersCount: filteredMembers.length,
    hasMembers: mappedMembers.length > 0,
    hasFilteredMembers: filteredMembers.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,

    handleRefresh,
    handleInviteMember,
    handleViewInvitations,
    handleBackToWorkspace,
    handleChangeMemberStatus,
    handleRemoveMember,

    clearMessage,
  };

  return (
    <>
      {isMobile ? (
        <WorkspaceMembersMobilePage {...pageProps} />
      ) : (
        <WorkspaceMembersDesktopPage {...pageProps} />
      )}

      <AppConfirmModal
        open={isConfirmOpen}
        onClose={closeConfirm}
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

export default WorkspaceMembersPage;
