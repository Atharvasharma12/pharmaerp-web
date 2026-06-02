// src/features/company/pages/CompanyDetailsPage.jsx

import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCompany from "../hooks/useCompany";

import CompanyDetailsDesktopPage from "./desktop/CompanyDetailsDesktopPage";
import CompanyDetailsMobilePage from "./mobile/CompanyDetailsMobilePage";

const formatCompanyType = (type) => {
  if (!type) return "-";

  return String(type)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatBoolean = (value) => (value ? "Yes" : "No");

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAddress = (address) => {
  if (!address) return "-";

  const addressText = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return addressText || "-";
};

const formatBillingType = (value) => {
  if (!value) return "-";

  return value === "non_gst" ? "Non GST" : "GST";
};

const formatGstType = (value) => {
  if (!value) return "-";

  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

const formatLicense = (license) => ({
  licenseNumber: license?.licenseNumber || "-",
  issuedAt: formatDate(license?.issuedAt),
  expiresAt: formatDate(license?.expiresAt),
  status: license?.status || "pending",
  document: license?.document || null,
  hasData: Boolean(
    license?.licenseNumber ||
    license?.issuedAt ||
    license?.expiresAt ||
    license?.document?.url,
  ),
});

const buildOverviewItems = (company) => [
  {
    key: "companyCode",
    label: "Company Code",
    value: company?.companyCode || "-",
  },
  {
    key: "type",
    label: "Company Type",
    value: formatCompanyType(company?.type),
  },
  {
    key: "status",
    label: "Status",
    value: company?.status || "inactive",
    badge: company?.status || "inactive",
  },
  {
    key: "email",
    label: "Email",
    value: company?.email || "-",
  },
  {
    key: "phone",
    label: "Phone",
    value: company?.phone ? `+91 ${company.phone}` : "-",
  },
  {
    key: "address",
    label: "Address",
    value: formatAddress(company?.address),
  },
];

const buildTaxItems = (company) => [
  {
    key: "gstin",
    label: "GSTIN",
    value: company?.gstin || "-",
  },
  {
    key: "pan",
    label: "PAN",
    value: company?.pan || "-",
  },
  {
    key: "gstType",
    label: "GST Type",
    value: formatGstType(company?.taxSettings?.gstType),
  },
  {
    key: "billingType",
    label: "Billing Type",
    value: formatBillingType(company?.taxSettings?.billingType),
  },
  {
    key: "defaultGstRate",
    label: "Default GST Rate",
    value:
      company?.taxSettings?.defaultGstRate !== undefined
        ? `${company.taxSettings.defaultGstRate}%`
        : "-",
  },
  {
    key: "isGstInclusive",
    label: "GST Inclusive",
    value: formatBoolean(company?.taxSettings?.isGstInclusive),
  },
];

const buildBillingItems = (company) => [
  {
    key: "invoicePrefix",
    label: "Invoice Prefix",
    value: company?.billingSettings?.invoicePrefix || "-",
  },
  {
    key: "invoiceStartNumber",
    label: "Invoice Start Number",
    value: company?.billingSettings?.invoiceStartNumber ?? "-",
  },
  {
    key: "purchasePrefix",
    label: "Purchase Prefix",
    value: company?.billingSettings?.purchasePrefix || "-",
  },
  {
    key: "purchaseStartNumber",
    label: "Purchase Start Number",
    value: company?.billingSettings?.purchaseStartNumber ?? "-",
  },
  {
    key: "salesReturnPrefix",
    label: "Sales Return Prefix",
    value: company?.billingSettings?.salesReturnPrefix || "-",
  },
  {
    key: "purchaseReturnPrefix",
    label: "Purchase Return Prefix",
    value: company?.billingSettings?.purchaseReturnPrefix || "-",
  },
];

const buildSettingsItems = (company) => [
  {
    key: "timezone",
    label: "Timezone",
    value: company?.settings?.timezone || "-",
  },
  {
    key: "currency",
    label: "Currency",
    value: company?.settings?.currency || "-",
  },
  {
    key: "dateFormat",
    label: "Date Format",
    value: company?.settings?.dateFormat || "-",
  },
  {
    key: "timeFormat",
    label: "Time Format",
    value: company?.settings?.timeFormat || "-",
  },
  {
    key: "allowNegativeStock",
    label: "Allow Negative Stock",
    value: formatBoolean(company?.settings?.allowNegativeStock),
  },
  {
    key: "allowBackdatedEntries",
    label: "Allow Backdated Entries",
    value: formatBoolean(company?.settings?.allowBackdatedEntries),
  },
  {
    key: "enableBatchTracking",
    label: "Batch Tracking",
    value: formatBoolean(company?.settings?.enableBatchTracking),
  },
  {
    key: "enableExpiryTracking",
    label: "Expiry Tracking",
    value: formatBoolean(company?.settings?.enableExpiryTracking),
  },
  {
    key: "enablePurchaseModule",
    label: "Purchase Module",
    value: formatBoolean(company?.settings?.enablePurchaseModule),
  },
  {
    key: "enableSalesModule",
    label: "Sales Module",
    value: formatBoolean(company?.settings?.enableSalesModule),
  },
  {
    key: "enableInventoryModule",
    label: "Inventory Module",
    value: formatBoolean(company?.settings?.enableInventoryModule),
  },
];

const buildMetaItems = (company) => [
  {
    key: "createdAt",
    label: "Created At",
    value: formatDateTime(company?.createdAt),
  },
  {
    key: "updatedAt",
    label: "Updated At",
    value: formatDateTime(company?.updatedAt),
  },
];

const buildCompanyDetails = (company) => {
  if (!company) return null;

  return {
    ...company,

    displayName: company.name || "-",
    displayType: formatCompanyType(company.type),
    displayAddress: formatAddress(company.address),
    displayPhone: company.phone ? `+91 ${company.phone}` : "-",
    displayEmail: company.email || "-",
    displayGstin: company.gstin || "-",
    displayPan: company.pan || "-",
    displayCreatedAt: formatDateTime(company.createdAt),
    displayUpdatedAt: formatDateTime(company.updatedAt),

    overviewItems: buildOverviewItems(company),
    taxItems: buildTaxItems(company),
    billingItems: buildBillingItems(company),
    settingsItems: buildSettingsItems(company),
    metaItems: buildMetaItems(company),

    licenses: [
      {
        key: "drugLicense",
        title: "Drug License",
        ...formatLicense(company.drugLicense),
      },
      {
        key: "foodLicense",
        title: "Food License",
        ...formatLicense(company.foodLicense),
      },
      {
        key: "tradeLicense",
        title: "Trade License",
        ...formatLicense(company.tradeLicense),
      },
    ],
  };
};

const CompanyDetailsPage = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const isMobile = useIsMobile();

  const {
    currentCompany,
    getCompanyById,
    getCompanyStatus,
    error,
    clearError,
    setCurrentCompany,
    clearCurrentCompany,
  } = useCompany();

  const isLoading = getCompanyStatus === API_STATUS.LOADING;
  const hasError = getCompanyStatus === API_STATUS.ERROR;

  const fetchCompany = useCallback(async () => {
    if (!companyId) return;

    try {
      const company = await getCompanyById(companyId);
      setCurrentCompany(company);
    } catch {
      // Error is already stored in company slice.
    }
  }, [companyId, getCompanyById, setCurrentCompany]);

  useEffect(() => {
    fetchCompany();

    return () => {
      clearError();
    };
  }, [fetchCompany, clearError]);

  const company = useMemo(
    () => buildCompanyDetails(currentCompany),
    [currentCompany],
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

  const handleClearCurrentCompany = useCallback(() => {
    clearCurrentCompany();
    navigate("/companies");
  }, [clearCurrentCompany, navigate]);

  const pageProps = useMemo(
    () => ({
      company,
      companyId,

      isLoading,
      hasError,
      error,

      handleBack,
      handleEdit,
      handleSettings,
      handleRefresh,
      handleClearCurrentCompany,
    }),
    [
      company,
      companyId,
      isLoading,
      hasError,
      error,
      handleBack,
      handleEdit,
      handleSettings,
      handleRefresh,
      handleClearCurrentCompany,
    ],
  );

  return isMobile ? (
    <CompanyDetailsMobilePage {...pageProps} />
  ) : (
    <CompanyDetailsDesktopPage {...pageProps} />
  );
};

export default CompanyDetailsPage;
