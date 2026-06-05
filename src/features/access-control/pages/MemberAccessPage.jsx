import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccessControl from "../hooks/useAccessControl";

import MemberAccessDesktopPage from "./desktop/MemberAccessDesktopPage";
import MemberAccessMobilePage from "./mobile/MemberAccessMobilePage";

const accessOptions = [
  { label: "All Access", value: "all" },
  { label: "Full Companies", value: "allCompanies" },
  { label: "Limited Companies", value: "limitedCompanies" },
  { label: "Full Branches", value: "allBranches" },
  { label: "Limited Branches", value: "limitedBranches" },
  { label: "Owner", value: "owner" },
];

const initialFilters = {
  search: "",
  access: "all",
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

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

const formatName = (value) => {
  if (!value) return "-";

  return String(value)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getObjectId = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  return value?._id || value?.id || "";
};

const getUserName = (user) =>
  user?.fullName || user?.name || user?.profile?.fullName || user?.email || "-";

const getUserEmail = (user) => user?.email || "-";

const getUserPhone = (user) => {
  const phone = user?.phone || user?.mobile || user?.profile?.phone;

  return phone ? `+91 ${phone}` : "-";
};

const getRoleName = (member) => {
  const role = member?.roleId || member?.role || null;

  if (member?.isOwner) return "Owner";

  return formatName(role?.name || role?.title || role?.code || "Staff");
};

const getCompanyName = (company) =>
  company?.name ||
  company?.companyName ||
  company?.legalName ||
  company?.code ||
  "Company";

const getBranchName = (branch) =>
  branch?.name || branch?.branchName || branch?.code || "Branch";

const mapMemberAccessForView = (access) => {
  const workspaceMember =
    access?.workspaceMemberId || access?.workspaceMember || null;
  const user =
    access?.userId || access?.user || workspaceMember?.userId || null;

  const companies = Array.isArray(access?.companyIds) ? access.companyIds : [];
  const branches = Array.isArray(access?.branchIds) ? access.branchIds : [];

  const memberUserId = getObjectId(user || workspaceMember?.userId);
  const accessAllCompanies = Boolean(access?.accessAllCompanies);
  const accessAllBranches = Boolean(access?.accessAllBranches);
  const isOwner = Boolean(workspaceMember?.isOwner);

  return {
    ...access,
    workspaceMember,
    user,
    companies,
    branches,
    memberUserId,

    displayName: getUserName(user),
    displayEmail: getUserEmail(user),
    displayPhone: getUserPhone(user),
    displayRole: getRoleName(workspaceMember),
    displayStatus: workspaceMember?.status || "active",
    displayUpdatedAt: formatDateTime(access?.updatedAt),
    displayCreatedAt: formatDateTime(access?.createdAt),

    accessAllCompanies,
    accessAllBranches,
    companyCount: companies.length,
    branchCount: branches.length,
    companyPreview: companies.slice(0, 3).map(getCompanyName),
    branchPreview: branches.slice(0, 3).map(getBranchName),
    companyAccessLabel: accessAllCompanies
      ? "All companies"
      : `${companies.length} ${companies.length === 1 ? "company" : "companies"}`,
    branchAccessLabel: accessAllBranches
      ? "All branches"
      : `${branches.length} ${branches.length === 1 ? "branch" : "branches"}`,
    isOwner,
    canEdit: !isOwner && Boolean(memberUserId),
  };
};

const MemberAccessPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    memberAccessList,
    getWorkspaceMemberAccessList,

    getWorkspaceMemberAccessListStatus,

    error,
    message,

    clearError,
    clearMessage,
    clearCurrentMemberAccess,
    clearMemberAccessCheck,
  } = useAccessControl();

  const hasFetchedAccessRef = useRef(false);

  const [filters, setFilters] = useState(initialFilters);

  const isLoadingAccess =
    getWorkspaceMemberAccessListStatus === API_STATUS.LOADING;
  const isLoading = isLoadingAccess;
  const hasError = getWorkspaceMemberAccessListStatus === API_STATUS.ERROR;

  const fetchMemberAccessList = useCallback(async () => {
    try {
      await getWorkspaceMemberAccessList();
    } catch {
      // Error is already stored in access control slice.
    }
  }, [getWorkspaceMemberAccessList]);

  useEffect(() => {
    clearError();
    clearCurrentMemberAccess();
    clearMemberAccessCheck();

    return () => {
      clearError();
    };
  }, [clearCurrentMemberAccess, clearError, clearMemberAccessCheck]);

  useEffect(() => {
    if (hasFetchedAccessRef.current) return;

    hasFetchedAccessRef.current = true;
    fetchMemberAccessList();
  }, [fetchMemberAccessList]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedAccessList = useMemo(
    () =>
      (Array.isArray(memberAccessList) ? memberAccessList : []).map(
        mapMemberAccessForView,
      ),
    [memberAccessList],
  );

  const filteredAccessList = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedAccessList.filter((access) => {
      const matchesSearch =
        !search ||
        normalizeText(access.displayName).includes(search) ||
        normalizeText(access.displayEmail).includes(search) ||
        normalizeText(access.displayPhone).includes(search) ||
        normalizeText(access.displayRole).includes(search) ||
        normalizeText(access.displayStatus).includes(search) ||
        normalizeText(access.companyAccessLabel).includes(search) ||
        normalizeText(access.branchAccessLabel).includes(search) ||
        access.companyPreview.some((company) =>
          normalizeText(company).includes(search),
        ) ||
        access.branchPreview.some((branch) =>
          normalizeText(branch).includes(search),
        );

      const matchesAccess =
        filters.access === "all" ||
        (filters.access === "allCompanies" && access.accessAllCompanies) ||
        (filters.access === "limitedCompanies" && !access.accessAllCompanies) ||
        (filters.access === "allBranches" && access.accessAllBranches) ||
        (filters.access === "limitedBranches" && !access.accessAllBranches) ||
        (filters.access === "owner" && access.isOwner);

      return matchesSearch && matchesAccess;
    });
  }, [filters, mappedAccessList]);

  const stats = useMemo(() => {
    const total = mappedAccessList.length;
    const fullCompanyAccess = mappedAccessList.filter(
      (access) => access.accessAllCompanies,
    ).length;
    const fullBranchAccess = mappedAccessList.filter(
      (access) => access.accessAllBranches,
    ).length;
    const restricted = mappedAccessList.filter(
      (access) => !access.accessAllCompanies || !access.accessAllBranches,
    ).length;

    return [
      {
        id: "total",
        title: "Total",
        value: total,
        description: "Members configured",
        colorVariant: "primary",
      },
      {
        id: "companies",
        title: "Companies",
        value: fullCompanyAccess,
        description: "With full company access",
        colorVariant: "success",
      },
      {
        id: "branches",
        title: "Branches",
        value: fullBranchAccess,
        description: "With full branch access",
        colorVariant: "info",
      },
      {
        id: "restricted",
        title: "Restricted",
        value: restricted,
        description: "Limited company or branch access",
        colorVariant: "warning",
      },
    ];
  }, [mappedAccessList]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({
        key: "search",
        label: `Search: ${filters.search}`,
        value: filters.search,
      });
    }

    if (filters.access !== "all") {
      chips.push({
        key: "access",
        label:
          accessOptions.find((option) => option.value === filters.access)
            ?.label || filters.access,
        value: filters.access,
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
    hasFetchedAccessRef.current = false;
    fetchMemberAccessList();
  }, [fetchMemberAccessList]);

  const handleBackToAccessControl = useCallback(() => {
    navigate(ROUTES.ACCESS_CONTROL);
  }, [navigate]);

  const handleAssignAccess = useCallback(() => {
    navigate(ROUTES.ASSIGN_ACCESS);
  }, [navigate]);

  const handleViewMembers = useCallback(() => {
    navigate(ROUTES.WORKSPACE_MEMBERS);
  }, [navigate]);

  const handleViewRoles = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleEditAccess = useCallback(
    (access) => {
      if (!access?.memberUserId || access?.isOwner) return;

      navigate(
        generatePath(ROUTES.EDIT_ACCESS, {
          memberId: access.memberUserId,
        }),
      );
    },
    [navigate],
  );

  const pageProps = {
    accessList: filteredAccessList,
    stats,

    filters,
    activeFilterChips,
    accessOptions,

    isLoading,
    hasError,
    error,
    message,

    totalAccessRecords: mappedAccessList.length,
    filteredAccessRecordsCount: filteredAccessList.length,
    hasAccessRecords: mappedAccessList.length > 0,
    hasFilteredAccessRecords: filteredAccessList.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,

    handleRefresh,
    handleBackToAccessControl,
    handleAssignAccess,
    handleViewMembers,
    handleViewRoles,
    handleEditAccess,

    clearMessage,
  };

  return isMobile ? (
    <MemberAccessMobilePage {...pageProps} />
  ) : (
    <MemberAccessDesktopPage {...pageProps} />
  );
};

export default MemberAccessPage;
