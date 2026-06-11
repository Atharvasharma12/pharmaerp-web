// src/features/company/pages/CompanyDetailsPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCompany from "../hooks/useCompany";

import CompanyDetailsDesktopPage from "./desktop/CompanyDetailsDesktopPage";
import CompanyDetailsMobilePage from "./mobile/CompanyDetailsMobilePage";

const formatCompanyType = (type) => {
  if (!type) return "Private Limited Company";
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
  if (!address) return "123, Health Care Street, New Delhi - 110001, India";
  const pieces = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean);
  return pieces.length > 0
    ? pieces.join(", ")
    : "123, Health Care Street, New Delhi - 110001, India";
};

// Dummy Fallback Records to closely match reference layouts
const DUMMY_HIGHLIGHTS = {
  totalBranches: 6,
  totalMembers: 12,
  activeMembers: 10,
  rolesCount: 7,
  productsCount: "2,458",
  totalCustomers: "5,320",
};

const DUMMY_BRANCHES = [
  {
    _id: "b1",
    name: "MedPlus Main Branch",
    address: "123, Health Care Street, New Delhi - 110001",
    code: "MP-MAIN",
    managerName: "Ravi Verma",
    managerPhone: "+91 98765 43210",
    city: "New Delhi",
    state: "Delhi",
    contactEmail: "main@medplus.com",
    status: "active",
    createdAt: "12 Mar 2018",
  },
  {
    _id: "b2",
    name: "MedPlus Dwarka",
    address: "Shop No. 45, Sector 12, Dwarka, New Delhi - 110075",
    code: "MP-DWK",
    managerName: "Amit Mishra",
    managerPhone: "+91 98765 43211",
    city: "New Delhi",
    state: "Delhi",
    contactEmail: "dwarka@medplus.com",
    status: "active",
    createdAt: "15 Mar 2018",
  },
  {
    _id: "b3",
    name: "MedPlus Indirapuram",
    address: "LG-12, Shipra Mall, Indirapuram, Ghaziabad - 201014",
    code: "MP-IND",
    managerName: "Rahul Sharma",
    managerPhone: "+91 98765 43212",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    contactEmail: "indirapuram@medplus.com",
    status: "active",
    createdAt: "20 Apr 2019",
  },
  {
    _id: "b4",
    name: "MedPlus Noida Sector 18",
    address: "G-18, Sector 18, Noida, Noida - 201301",
    code: "MP-N18",
    managerName: "Pooja Sharma",
    managerPhone: "+91 98765 43213",
    city: "Noida",
    state: "Uttar Pradesh",
    contactEmail: "noida18@medplus.com",
    status: "active",
    createdAt: "05 May 2019",
  },
  {
    _id: "b5",
    name: "MedPlus Gurugram",
    address: "Unit No. 7, Cyber City, Gurugram, Gurugram - 122002",
    code: "MP-GGN",
    managerName: "Sandeep Kumar",
    managerPhone: "+91 98765 43214",
    city: "Gurugram",
    state: "Haryana",
    contactEmail: "gurugram@medplus.com",
    status: "active",
    createdAt: "18 Jun 2020",
  },
  {
    _id: "b6",
    name: "MedPlus Lucknow",
    address: "Shop No. 3, Hazratganj, Lucknow - 226001",
    code: "MP-LKO",
    managerName: "Neha Gupta",
    managerPhone: "+91 98765 43215",
    city: "Lucknow",
    state: "Uttar Pradesh",
    contactEmail: "lucknow@medplus.com",
    status: "active",
    createdAt: "30 Aug 2021",
  },
];

const DUMMY_MEMBERS = [
  {
    _id: "m1",
    name: "Amit Mishra",
    email: "amit@mishra.com",
    role: "Owner",
    tagColor: "owner",
    department: "Management",
    joinedOn: "12 Mar 2018",
    status: "active",
    lastActive: "Today, 10:30 AM",
    addedBy: "Self",
  },
  {
    _id: "m2",
    name: "Ravi Verma",
    email: "ravi.verma@medplus.com",
    role: "Company Admin",
    tagColor: "primary",
    department: "Management",
    joinedOn: "15 Mar 2018",
    status: "active",
    lastActive: "Today, 09:15 AM",
    addedBy: "Amit Mishra",
  },
  {
    _id: "m3",
    name: "Neha Gupta",
    email: "neha.gupta@medplus.com",
    role: "Accounts Manager",
    tagColor: "success",
    department: "Accounts",
    joinedOn: "16 Mar 2018",
    status: "active",
    lastActive: "Yesterday, 06:20 PM",
    addedBy: "Amit Mishra",
  },
  {
    _id: "m4",
    name: "Pooja Sharma",
    email: "pooja.sharma@medplus.com",
    role: "Inventory Manager",
    tagColor: "purple",
    department: "Inventory",
    joinedOn: "16 Mar 2018",
    status: "active",
    lastActive: "Today, 11:45 AM",
    addedBy: "Ravi Verma",
  },
  {
    _id: "m5",
    name: "Sandeep Kumar",
    email: "sandeep.kumar@medplus.com",
    role: "Purchasing Manager",
    tagColor: "cyan",
    department: "Purchase",
    joinedOn: "17 Mar 2018",
    status: "active",
    lastActive: "2 days ago, 04:10 PM",
    addedBy: "Ravi Verma",
  },
  {
    _id: "m6",
    name: "Ankit Singh",
    email: "ankit.singh@medplus.com",
    role: "Sales Manager",
    tagColor: "warning",
    department: "Sales",
    joinedOn: "18 Mar 2018",
    status: "pending",
    lastActive: "-",
    addedBy: "Amit Mishra",
  },
  {
    _id: "m7",
    name: "Priya Kapoor",
    email: "priya.kapoor@medplus.com",
    role: "Pharmacist",
    tagColor: "info",
    department: "Operations",
    joinedOn: "18 Mar 2018",
    status: "pending",
    lastActive: "-",
    addedBy: "Pooja Sharma",
  },
];

const DUMMY_ACTIVITIES = [
  {
    id: 1,
    text: "New branch 'MedPlus Indirapuram' added",
    user: "Ravi Verma",
    type: "branch",
    time: "2 hours ago",
  },
  {
    id: 2,
    text: "New member Rahul Sharma added",
    user: "Amit Mishra",
    type: "member",
    time: "4 hours ago",
  },
  {
    id: 3,
    text: "Company information updated",
    user: "Neha Gupta",
    type: "update",
    time: "6 hours ago",
  },
  {
    id: 4,
    text: "Member role updated for Pooja Sharma",
    user: "Ravi Verma",
    type: "role",
    time: "1 day ago",
  },
  {
    id: 5,
    text: "Company logo updated",
    user: "Admin",
    type: "logo",
    time: "2 days ago",
  },
];

const DUMMY_DOCUMENTS = [
  {
    id: 1,
    name: "Certificate of Incorporation.pdf",
    size: "1.2 MB",
    uploadedAt: "Uploaded on 12 Mar 2018",
  },
  {
    id: 2,
    name: "PAN Card - MedPlus.pdf",
    size: "450 KB",
    uploadedAt: "Uploaded on 12 Mar 2018",
  },
  {
    id: 3,
    name: "GST Certificate.pdf",
    size: "850 KB",
    uploadedAt: "Uploaded on 15 Mar 2018",
  },
  {
    id: 4,
    name: "Company Logo.png",
    size: "120 KB",
    uploadedAt: "Uploaded on 20 Mar 2018",
  },
  {
    id: 5,
    name: "MOA & AOA.pdf",
    size: "3.4 MB",
    uploadedAt: "Uploaded on 22 Mar 2018",
  },
];

const buildCompanyDetails = (company) => {
  if (!company) return null;

  return {
    ...company,
    displayName: company.name || "MedPlus Healthcare Pvt. Ltd.",
    displayType: formatCompanyType(company.type),
    displayAddress: formatAddress(company.address),
    displayPhone: company.phones?.mobile
      ? `+91 ${company.phones.mobile}`
      : "+91 98765 43210",
    displayEmail: company.email || "info@medplus.com",
    displayGstin: company.gstin || "27AABCM1234D1Z5",
    displayPan: company.pan || "AABCM1234D",
    displayOwnerName: company.owner?.name || "Amit Mishra",
    displayCreatedAt: company.createdAt
      ? formatDate(company.createdAt)
      : "12 Mar 2018",

    // Extracted Highlights & Lists Map
    highlights: DUMMY_HIGHLIGHTS,
    branches: DUMMY_BRANCHES,
    members: DUMMY_MEMBERS,
    activities: DUMMY_ACTIVITIES,
    documents: DUMMY_DOCUMENTS,
  };
};

const CompanyDetailsPage = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  // Tab State syncing with query param descriptor strings
  const currentTab = searchParams.get("tab") || "overview";

  const {
    managedCompany,
    getCompanyById,
    getCompanyStatus,
    error,
    clearError,
    clearManagedCompany,
  } = useCompany();

  const isLoading = getCompanyStatus === API_STATUS.LOADING;
  const hasError = getCompanyStatus === API_STATUS.ERROR;

  const fetchCompany = useCallback(async () => {
    if (!companyId) return;
    try {
      await getCompanyById(companyId);
    } catch {
      // Regulated gracefully by state error hooks
    }
  }, [companyId, getCompanyById]);

  useEffect(() => {
    if (hasFetchedRef.current === companyId) return;
    hasFetchedRef.current = companyId;

    fetchCompany();

    return () => {
      clearError();
      clearManagedCompany();
    };
  }, [companyId, fetchCompany, clearError, clearManagedCompany]);

  const company = useMemo(
    () => buildCompanyDetails(managedCompany || {}),
    [managedCompany],
  );

  const handleTabChange = useCallback(
    (tabValue) => {
      setSearchParams({ tab: tabValue });
    },
    [setSearchParams],
  );

  const handleBack = useCallback(() => {
    navigate("/companies");
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!companyId) return;
    navigate(`/companies/${companyId}/edit`);
  }, [companyId, navigate]);

  const handleSettings = useCallback(() => {
    if (!companyId) return;
    navigate(`/companies/${companyId}/settings`);
  }, [companyId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    fetchCompany();
  }, [clearError, fetchCompany]);

  const pageProps = useMemo(
    () => ({
      company,
      companyId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleEdit,
      handleSettings,
      handleRefresh,
    }),
    [
      company,
      companyId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleEdit,
      handleSettings,
      handleRefresh,
    ],
  );

  return isMobile ? (
    <CompanyDetailsMobilePage {...pageProps} />
  ) : (
    <CompanyDetailsDesktopPage {...pageProps} />
  );
};

export default CompanyDetailsPage;
