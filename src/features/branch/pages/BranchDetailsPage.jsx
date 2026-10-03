// src/features/branch/pages/BranchDetailsPage.jsx

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBranch from "../hooks/useBranch";

import BranchDetailsDesktopPage from "./desktop/BranchDetailsDesktopPage";
import BranchDetailsMobilePage from "./mobile/BranchDetailsMobilePage";

const formatBranchType = (type) => {
  if (!type) return "Retail Pharmacy";
  return String(type)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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

const formatAddress = (address) => {
  if (!address) return "No physical address configured for this location node.";
  const pieces = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.district,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean);
  return pieces.length > 0
    ? pieces.join(", ")
    : "No physical address configured.";
};

// Dummy dataset metrics aligned with active pharmacy stock management telemetry
const DUMMY_HIGHLIGHTS = {
  totalSalesToday: "₹48,250",
  activeInvoicesCount: 142,
  stockItemsCount: "3,120",
  lowStockAlerts: 14,
  assignedStaffCount: 8,
  pendingOrders: 5,
};

const DUMMY_STAFF = [
  {
    _id: "s1",
    name: "Priya Kapoor",
    email: "priya.kapoor@medplus.com",
    role: "Chief Pharmacist",
    tagColor: "owner",
    phone: "+91 98765 43217",
    status: "active",
    lastActive: "Active Now",
  },
  {
    _id: "s2",
    name: "Rahul Sharma",
    email: "rahul.sharma@medplus.com",
    role: "Store Manager",
    tagColor: "primary",
    phone: "+91 98765 43212",
    status: "active",
    lastActive: "Today, 11:15 AM",
  },
  {
    _id: "s3",
    name: "Anuj Verma",
    email: "anuj.verma@medplus.com",
    role: "Billing Executive",
    tagColor: "success",
    phone: "+91 98765 43230",
    status: "active",
    lastActive: "Yesterday, 09:30 PM",
  },
  {
    _id: "s4",
    name: "Kiran Patel",
    email: "kiran.patel@medplus.com",
    role: "Assistant Pharmacist",
    tagColor: "purple",
    phone: "+91 98765 43241",
    status: "pending",
    lastActive: "-",
  },
];

const DUMMY_INVENTORY_ALERTS = [
  {
    id: 1,
    item: "Paracetamol 650mg (Dolo)",
    batch: "B-DL982",
    type: "Low Stock",
    status: "critical",
    qtyLeft: "12 strips",
  },
  {
    id: 2,
    item: "Amoxicillin 500mg Capsule",
    batch: "B-AMX112",
    type: "Near Expiry",
    status: "warning",
    qtyLeft: "42 strips (Exp: Next Month)",
  },
  {
    id: 3,
    item: "Metformin Hydrochloride 500mg",
    batch: "B-MTF441",
    type: "Out of Stock",
    status: "danger",
    qtyLeft: "0 boxes",
  },
];

const DUMMY_RECENT_INVOICES = [
  {
    id: "INV-2026-001",
    customer: "Sanjeev Sahu",
    itemsCount: 4,
    amount: "₹1,240.00",
    paymentMode: "UPI",
    time: "10 mins ago",
  },
  {
    id: "INV-2026-002",
    customer: "Walk-in Customer",
    itemsCount: 1,
    amount: "₹180.00",
    paymentMode: "Cash",
    time: "24 mins ago",
  },
  {
    id: "INV-2026-003",
    customer: "Ramesh Kumar",
    itemsCount: 7,
    amount: "₹3,450.00",
    paymentMode: "Card",
    time: "1 hour ago",
  },
];

const buildBranchDetails = (branch) => {
  if (!branch) return null;

  return {
    ...branch,
    displayName: branch.name || "MedPlus Main Terminal Division",
    displayTypeCode: branch.branchCode || "BR654321",
    displayType: formatBranchType(branch.type),
    displayAddress: formatAddress(branch.address),
    displayEmail: branch.email || "branch.operations@medplus.com",
    displayPhone: branch.phones?.mobile
      ? `+91 ${branch.phones.mobile}`
      : branch.phones?.landline || "+91 731 425 1100",
    displayWhatsapp: branch.phones?.whatsapp
      ? `+91 ${branch.phones.whatsapp}`
      : null,

    // License fields integration
    displayDrugLicense: branch.license?.drugLicenseNumber || "MP-IND-24-987654",
    displayDrugLicenseType:
      branch.license?.drugLicenseType ||
      "Form 20, Form 21 (Retail & Wholesale)",
    displayFssai: branch.license?.fssaiNumber || "10024011000234",
    displayLicenseExpiry: branch.license?.expiresAt
      ? formatDate(branch.license.expiresAt)
      : "18 Dec 2029",

    // Registered Pharmacist fields integration
    displayPharmacistName: branch.pharmacist?.name || "Priya Kapoor",
    displayPharmacistReg:
      branch.pharmacist?.registrationNumber || "MP-RPH-2024-5541",
    displayPharmacistMobile: branch.pharmacist?.mobile
      ? `+91 ${branch.pharmacist.mobile}`
      : "+91 98765 43217",

    displayCreatedAt: branch.createdAt
      ? formatDate(branch.createdAt)
      : "15 Mar 2024",

    // Extracted telemetry metrics models mappings
    highlights: DUMMY_HIGHLIGHTS,
    staff: DUMMY_STAFF,
    alerts: DUMMY_INVENTORY_ALERTS,
    invoices: DUMMY_RECENT_INVOICES,
  };
};

const BranchDetailsPage = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  // Synced state architecture with browser timeline strings descriptor
  const currentTab = searchParams.get("tab") || "overview";

  const {
    managedBranch,
    getBranchById,
    getBranchStatus,
    error,
    clearError,
    clearManagedBranch,
  } = useBranch();

  const isLoading = getBranchStatus === API_STATUS.LOADING;
  const hasError = getBranchStatus === API_STATUS.ERROR;

  const fetchBranchData = useCallback(async () => {
    if (!branchId) return;
    try {
      await getBranchById(branchId);
    } catch {
      // Gracefully handled inside global store error nodes
    }
  }, [branchId, getBranchById]);

  useEffect(() => {
    if (hasFetchedRef.current === branchId) return;
    hasFetchedRef.current = branchId;

    fetchBranchData();

    return () => {
      clearError();
      clearManagedBranch();
    };
  }, [branchId, fetchBranchData, clearError, clearManagedBranch]);

  const branch = useMemo(
    () => buildBranchDetails(managedBranch || {}),
    [managedBranch],
  );

  const handleTabChange = useCallback(
    (tabValue) => {
      setSearchParams({ tab: tabValue });
    },
    [setSearchParams],
  );

  const handleBack = useCallback(() => {
    navigate(-1); // Back directly into company context level route frame
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!branchId) return;
    navigate(`edit`);
  }, [branchId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    fetchBranchData();
  }, [clearError, fetchBranchData]);

  const pageProps = useMemo(
    () => ({
      branch,
      branchId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleEdit,
      handleRefresh,
    }),
    [
      branch,
      branchId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleEdit,
      handleRefresh,
    ],
  );

  return isMobile ? (
    <BranchDetailsMobilePage {...pageProps} />
  ) : (
    <BranchDetailsDesktopPage {...pageProps} />
  );
};

export default BranchDetailsPage;
