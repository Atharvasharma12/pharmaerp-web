// src/features/access-control/pages/MemberAccessPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccessControl from "../hooks/useAccessControl";

import MemberAccessDesktopPage from "./desktop/MemberAccessDesktopPage";
import MemberAccessMobilePage from "./mobile/MemberAccessMobilePage";

const statusOptions = [
  { label: "Status: All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const companyOptions = [
  { label: "Company: All", value: "all" },
  { label: "MedPlus Pharmacy", value: "medplus-pharmacy" },
  { label: "HealthCare Medicals", value: "healthcare-medicals" },
  { label: "CityCare Pharma", value: "citycare-pharma" },
  { label: "LifeLine Drugs", value: "lifeline-drugs" },
];

const branchOptions = [
  { label: "Branch: All", value: "all" },
  { label: "Main Branch", value: "main-branch" },
  { label: "Central Branch", value: "central-branch" },
  { label: "North Branch", value: "north-branch" },
  { label: "South Branch", value: "south-branch" },
];

const accessOptions = [
  { label: "All Access", value: "all" },
  { label: "Full Access", value: "full" },
  { label: "Partial Access", value: "partial" },
  { label: "No Access", value: "none" },
];

const initialFilters = {
  search: "",
  status: "all",
  company: "all",
  branch: "all",
  access: "all",
};

const dummyMemberAccess = [
  {
    _id: "dummy-ravi-verma",
    displayName: "Ravi Verma",
    displayEmail: "ravi.verma@medplus.com",
    displayRole: "Pharmacist",
    displayStatus: "active",
    displayUpdatedAt: "28 May 2024",
    updatedBy: "Admin",
    companyAccessLabel: "2 Companies",
    branchAccessLabel: "5 Branches",
    companyCount: 2,
    branchCount: 5,
    accessLevel: "full",
    companySlug: "medplus-pharmacy",
    branchSlug: "main-branch",
    roleColorVariant: "success",
  },
  {
    _id: "dummy-sneha-kapoor",
    displayName: "Sneha Kapoor",
    displayEmail: "sneha.kapoor@medplus.com",
    displayRole: "Manager",
    displayStatus: "active",
    displayUpdatedAt: "27 May 2024",
    updatedBy: "Admin",
    companyAccessLabel: "3 Companies",
    branchAccessLabel: "8 Branches",
    companyCount: 3,
    branchCount: 8,
    accessLevel: "partial",
    companySlug: "healthcare-medicals",
    branchSlug: "central-branch",
    roleColorVariant: "info",
  },
  {
    _id: "dummy-amit-mishra",
    displayName: "Amit Mishra",
    displayEmail: "amit.mishra@medplus.com",
    displayRole: "Cashier",
    displayStatus: "active",
    displayUpdatedAt: "26 May 2024",
    updatedBy: "Admin",
    companyAccessLabel: "1 Company",
    branchAccessLabel: "2 Branches",
    companyCount: 1,
    branchCount: 2,
    accessLevel: "partial",
    companySlug: "citycare-pharma",
    branchSlug: "north-branch",
    roleColorVariant: "purple",
  },
  {
    _id: "dummy-neha-patel",
    displayName: "Neha Patel",
    displayEmail: "neha.patel@medplus.com",
    displayRole: "Store Incharge",
    displayStatus: "active",
    displayUpdatedAt: "25 May 2024",
    updatedBy: "Admin",
    companyAccessLabel: "4 Companies",
    branchAccessLabel: "10 Branches",
    companyCount: 4,
    branchCount: 10,
    accessLevel: "full",
    companySlug: "lifeline-drugs",
    branchSlug: "south-branch",
    roleColorVariant: "warning",
  },
  {
    _id: "dummy-john-thomas",
    displayName: "John Thomas",
    displayEmail: "john.thomas@medplus.com",
    displayRole: "Accountant",
    displayStatus: "inactive",
    displayUpdatedAt: "24 May 2024",
    updatedBy: "Admin",
    companyAccessLabel: "2 Companies",
    branchAccessLabel: "3 Branches",
    companyCount: 2,
    branchCount: 3,
    accessLevel: "partial",
    companySlug: "medplus-pharmacy",
    branchSlug: "central-branch",
    roleColorVariant: "cyan",
  },
  {
    _id: "dummy-pooja-sharma",
    displayName: "Pooja Sharma",
    displayEmail: "pooja.sharma@medplus.com",
    displayRole: "Pharmacist",
    displayStatus: "active",
    displayUpdatedAt: "23 May 2024",
    updatedBy: "Admin",
    companyAccessLabel: "1 Company",
    branchAccessLabel: "2 Branches",
    companyCount: 1,
    branchCount: 2,
    accessLevel: "partial",
    companySlug: "healthcare-medicals",
    branchSlug: "main-branch",
    roleColorVariant: "success",
  },
  {
    _id: "dummy-arjun-kumar",
    displayName: "Arjun Kumar",
    displayEmail: "arjun.kumar@medplus.com",
    displayRole: "Manager",
    displayStatus: "active",
    displayUpdatedAt: "22 May 2024",
    updatedBy: "Admin",
    companyAccessLabel: "3 Companies",
    branchAccessLabel: "6 Branches",
    companyCount: 3,
    branchCount: 6,
    accessLevel: "full",
    companySlug: "citycare-pharma",
    branchSlug: "north-branch",
    roleColorVariant: "info",
  },
  {
    _id: "dummy-dinesh-singh",
    displayName: "Dinesh Singh",
    displayEmail: "dinesh.singh@medplus.com",
    displayRole: "Delivery Boy",
    displayStatus: "inactive",
    displayUpdatedAt: "21 May 2024",
    updatedBy: "Admin",
    companyAccessLabel: "1 Company",
    branchAccessLabel: "1 Branch",
    companyCount: 1,
    branchCount: 1,
    accessLevel: "none",
    companySlug: "lifeline-drugs",
    branchSlug: "south-branch",
    roleColorVariant: "purple",
  },
];

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const slugify = (value) =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

const getAccessLevel = (
  accessAllCompanies,
  accessAllBranches,
  companyCount,
  branchCount,
) => {
  if (accessAllCompanies && accessAllBranches) return "full";
  if (
    !accessAllCompanies &&
    !accessAllBranches &&
    companyCount === 0 &&
    branchCount === 0
  )
    return "none";
  return "partial";
};

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
  const displayName = getUserName(user);
  const displayRole = getRoleName(workspaceMember);
  const companyCount = accessAllCompanies
    ? companies.length || 4
    : companies.length;
  const branchCount = accessAllBranches
    ? branches.length || 10
    : branches.length;

  return {
    ...access,
    workspaceMember,
    user,
    companies,
    branches,
    memberUserId,

    displayName,
    displayEmail: getUserEmail(user),
    displayRole,
    displayStatus: workspaceMember?.status || access?.status || "active",
    displayUpdatedAt: formatDate(access?.updatedAt) || "-",
    updatedBy: access?.updatedBy?.name || access?.updatedByName || "Admin",

    accessAllCompanies,
    accessAllBranches,
    companyCount,
    branchCount,
    companyPreview: companies.slice(0, 3).map(getCompanyName),
    branchPreview: branches.slice(0, 3).map(getBranchName),
    companyAccessLabel: accessAllCompanies
      ? "All Companies"
      : `${companyCount} ${companyCount === 1 ? "Company" : "Companies"}`,
    branchAccessLabel: accessAllBranches
      ? "All Branches"
      : `${branchCount} ${branchCount === 1 ? "Branch" : "Branches"}`,
    accessLevel: getAccessLevel(
      accessAllCompanies,
      accessAllBranches,
      companyCount,
      branchCount,
    ),
    companySlug: slugify(companies[0]?.name || companies[0]?.companyName || ""),
    branchSlug: slugify(branches[0]?.name || branches[0]?.branchName || ""),
    roleColorVariant: "success",
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

  const isLoading = getWorkspaceMemberAccessListStatus === API_STATUS.LOADING;
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
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedAccessList = useMemo(() => {
    const sourceList =
      Array.isArray(memberAccessList) && memberAccessList.length
        ? memberAccessList.map(mapMemberAccessForView)
        : dummyMemberAccess;

    return sourceList;
  }, [memberAccessList]);

  const filteredAccessList = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedAccessList.filter((access) => {
      const matchesSearch =
        !search ||
        normalizeText(access.displayName).includes(search) ||
        normalizeText(access.displayEmail).includes(search) ||
        normalizeText(access.displayRole).includes(search) ||
        normalizeText(access.displayStatus).includes(search) ||
        normalizeText(access.companyAccessLabel).includes(search) ||
        normalizeText(access.branchAccessLabel).includes(search);

      const matchesStatus =
        filters.status === "all" || access.displayStatus === filters.status;

      const matchesCompany =
        filters.company === "all" || access.companySlug === filters.company;

      const matchesBranch =
        filters.branch === "all" || access.branchSlug === filters.branch;

      const matchesAccess =
        filters.access === "all" || access.accessLevel === filters.access;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCompany &&
        matchesBranch &&
        matchesAccess
      );
    });
  }, [filters, mappedAccessList]);

  const stats = useMemo(() => {
    const total = mappedAccessList.length;
    const active = mappedAccessList.filter(
      (access) => access.displayStatus === "active",
    ).length;
    const companies = mappedAccessList.reduce(
      (sum, access) => sum + (Number(access.companyCount) || 0),
      0,
    );
    const branches = mappedAccessList.reduce(
      (sum, access) => sum + (Number(access.branchCount) || 0),
      0,
    );

    return [
      {
        id: "total",
        title: "Total Members",
        value: total || 28,
        description: "All members in workspace",
        colorVariant: "success",
      },
      {
        id: "active",
        title: "Active Members",
        value: active || 24,
        description: "Currently active members",
        colorVariant: "info",
      },
      {
        id: "companies",
        title: "Companies Access",
        value: companies || 12,
        description: "Companies assigned",
        colorVariant: "purple",
      },
      {
        id: "branches",
        title: "Branches Access",
        value: branches || 36,
        description: "Branches assigned",
        colorVariant: "warning",
      },
    ];
  }, [mappedAccessList]);

  const accessOverview = useMemo(() => {
    const full =
      mappedAccessList.filter((access) => access.accessLevel === "full")
        .length || 12;
    const partial =
      mappedAccessList.filter((access) => access.accessLevel === "partial")
        .length || 14;
    const none =
      mappedAccessList.filter((access) => access.accessLevel === "none")
        .length || 2;
    const total = full + partial + none || 28;

    return [
      {
        id: "full",
        label: "Full Access",
        value: full,
        percent: Math.round((full / total) * 100),
        colorVariant: "success",
      },
      {
        id: "partial",
        label: "Partial Access",
        value: partial,
        percent: Math.round((partial / total) * 100),
        colorVariant: "successSoft",
      },
      {
        id: "none",
        label: "No Access",
        value: none,
        percent: Math.round((none / total) * 100),
        colorVariant: "neutral",
      },
    ];
  }, [mappedAccessList]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search)
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    if (filters.status !== "all")
      chips.push({
        key: "status",
        label:
          statusOptions.find((option) => option.value === filters.status)
            ?.label || filters.status,
      });
    if (filters.company !== "all")
      chips.push({
        key: "company",
        label:
          companyOptions.find((option) => option.value === filters.company)
            ?.label || filters.company,
      });
    if (filters.branch !== "all")
      chips.push({
        key: "branch",
        label:
          branchOptions.find((option) => option.value === filters.branch)
            ?.label || filters.branch,
      });
    if (filters.access !== "all")
      chips.push({
        key: "access",
        label:
          accessOptions.find((option) => option.value === filters.access)
            ?.label || filters.access,
      });

    return chips;
  }, [filters]);

  const handleFilterChange = useCallback((eventOrValue) => {
    if (eventOrValue?.target) {
      const { name, value } = eventOrValue.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
      return;
    }

    setFilters((prev) => ({ ...prev, ...eventOrValue }));
  }, []);

  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? event;
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
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
  const handleAssignRole = useCallback(() => {
    navigate(ROUTES.ASSIGN_ROLE);
  }, [navigate]);

  const handleViewMembers = useCallback(() => {
    navigate(ROUTES.WORKSPACE_MEMBERS);
  }, [navigate]);

  const handleViewRoles = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleExportMemberAccess = useCallback(() => {
    // Wire this to your export API when available.
  }, []);

  const handleEditAccess = useCallback(
    (access) => {
      if (
        !access?.memberUserId ||
        access?.isOwner ||
        String(access._id).startsWith("dummy-")
      )
        return;

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
    accessOverview,

    filters,
    activeFilterChips,
    accessOptions,
    statusOptions,
    companyOptions,
    branchOptions,

    isLoading,
    hasError,
    error,
    message,

    totalAccessRecords: mappedAccessList.length || 28,
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
    handleAssignRole,
    handleViewMembers,
    handleViewRoles,
    handleExportMemberAccess,
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
