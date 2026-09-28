// src/features/workspace-products/pages/desktop/WorkspaceProductDetailsDesktopPage.jsx

import { memo } from "react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiMoreHorizontal,
  FiCalendar,
  FiUser,
  FiInfo,
  FiCheckCircle,
  FiGrid,
  FiLayers,
  FiShield,
  FiBriefcase,
  FiActivity,
  FiBox,
  FiBookOpen,
  FiAlertTriangle,
  FiHelpCircle,
  FiEdit3,
  FiTrash2,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppMenu,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
  AppPageLoader,
  AppErrorState,
} from "@/components";

const WorkspaceProductDetailsDesktopPage = ({
  product,
  isLoading,
  hasError,
  error,
  currentTab,
  handleTabChange,
  handleBack,
  handleRefresh,
  handleBackToCatalog,
  handleEditProduct,
  handleDeleteProduct,
}) => {
  if (isLoading && !product) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppPageLoader text="Extracting custom product profile specifications..." />
      </section>
    );
  }

  if (hasError && !product) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppErrorState
          title="Product Extraction Failure"
          description={
            error || "The server could not resolve the custom product entity."
          }
          actionText="Retry Data Pipeline"
          onRetry={handleRefresh}
          size="page"
        />
      </section>
    );
  }

  const safeProduct = product || {};

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "pricing", label: "Pricing" },
    { value: "inventory", label: "Inventory" },
    { value: "packaging_pricing", label: "Packaging & Pricing" },
    { value: "availability", label: "Availability" },
    { value: "history", label: "History" },
    { value: "audit_log", label: "Audit Log" },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* --- BREADCRUMB STRIP VIEWPORT --- */}
        <div className="flex items-center justify-between">
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard" },
              { label: "Products" },
              { label: "Workspace Products", onClick: handleBack },
              {
                label: safeProduct.displayName || "Custom Product Details",
                current: true,
              },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* --- CENTRAL JUMBOTRON ROW LAYOUT --- */}
        <div className="mt-2 flex w-full items-start justify-between border-b border-border-strong bg-surface rounded-xl border p-5 shadow-xs gap-4">
          <AppStack
            direction="row"
            align="flex-start"
            gap={1.5}
            sx={{ width: "100%", minWidth: 0 }}
          >
            {/* Custom Product Icon Vector Container Box */}
            <div className="flex h-36 w-44 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-alt p-2 overflow-hidden shadow-2xs text-success bg-success-soft/20 border-success/10">
              <svg
                viewBox="0 0 100 100"
                className="h-20 w-20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M35,25 C35,20 40,15 50,15 C60,15 65,20 65,25 L65,30 L35,30 Z"
                  fill="var(--app-color-surface)"
                  strokeWidth="2"
                />
                <rect
                  x="25"
                  y="30"
                  width="50"
                  height="55"
                  rx="10"
                  fill="var(--app-color-surface)"
                  strokeWidth="2"
                />
                <rect
                  x="62"
                  y="55"
                  width="22"
                  height="30"
                  rx="4"
                  fill="var(--app-color-surface-alt)"
                  strokeWidth="1.5"
                />
                <path
                  d="M42,57 L58,57 M50,49 L50,65"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M68,70 L78,70 M73,65 L73,75"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <AppBox sx={{ flex: 1, minWidth: 0 }}>
              <AppStack direction="row" align="center" gap={0.8}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {safeProduct.displayName || "Calcium Tablet"}
                </AppHeading>
                <AppStatusBadge
                  status={
                    safeProduct.displayStatus === "inactive"
                      ? "inactive"
                      : "active"
                  }
                  variant="soft"
                  rounded="md"
                  size="small"
                />
              </AppStack>

              <div className="mt-1.5 flex items-center gap-2">
                <AppTag
                  label="Workspace Product"
                  colorVariant="purple"
                  variant="soft"
                  rounded="md"
                  sx={{ height: 18, fontSize: "10.5px", fontWeight: 700 }}
                />
                <AppText variant="body2" sx={subHeaderMetaDataSx}>
                  {safeProduct.displayCode || "CAT-WS-001"}
                </AppText>
              </div>

              {/* Dynamic Sizing Meta Grid Strips */}
              <div className="mt-4 grid grid-cols-4 gap-4 border-t border-border-strong/40 pt-3 text-[12px] max-w-3xl">
                <MetaItemIconBox
                  icon={<FiBox />}
                  label="Unit"
                  value={safeProduct.displayForm || "Tablet"}
                />
                <MetaItemIconBox
                  icon={<FiShield />}
                  label="Strength"
                  value={safeProduct.displayStrength || "500 mg"}
                />
                <MetaItemIconBox
                  icon={<HiOutlineBuildingOffice2 />}
                  label="Manufacturer"
                  value={safeProduct.displayManufacturer || "MedPlus Pharma"}
                />
                <MetaItemIconBox
                  icon={<FiCalendar />}
                  label="Created On"
                  value="12 May 2024"
                />
              </div>
            </AppBox>
          </AppStack>

          {/* Action Control Trigger Set */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap pt-1">
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiArrowLeft />}
              onClick={handleBack}
              sx={secondaryButtonSx}
            >
              Back to Workspace Products
            </AppButton>
            <AppMenu
              trigger={
                <AppButton
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  endIcon={<FiMoreHorizontal />}
                  sx={secondaryButtonSx}
                >
                  More Actions
                </AppButton>
              }
              items={[
                {
                  id: "edit",
                  label: "Edit Custom Product",
                  icon: <FiEdit3 />,
                  onClick: handleEditProduct,
                },
                {
                  id: "refresh",
                  label: "Sync Record Data",
                  icon: <FiRefreshCw />,
                  onClick: handleRefresh,
                },
                { id: "divider", type: "divider" },
                {
                  id: "delete",
                  label: "Delete Product",
                  icon: <FiTrash2 />,
                  danger: true,
                  onClick: handleDeleteProduct,
                },
              ]}
              dense
            />
          </div>
        </div>

        {/* --- NAV TAB STRIP PANEL --- */}
        <div className="mt-5 flex border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-5 pb-3 text-[13px] font-bold transition whitespace-nowrap outline-none ${isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- VIEWPORT TAB PANEL FOOTPRINTS --- */}
        <div className="mt-5">
          {currentTab === "overview" && (
            <OverviewTabSection product={safeProduct} />
          )}
          {(currentTab === "pricing" || currentTab === "packaging_pricing") && (
            <PricingTabSection product={safeProduct} />
          )}
          {currentTab !== "overview" && currentTab !== "pricing" && currentTab !== "packaging_pricing" && (
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              sx={sectionCardSx}
              className="p-8 text-center"
            >
              <FiInfo className="mx-auto text-[24px] text-text-muted mb-2" />
              <AppHeading
                level={3}
                weight={700}
                sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}
              >
                {tabs.find((t) => t.value === currentTab)?.label} Information
              </AppHeading>
              <AppText
                variant="body2"
                sx={{ mt: 0.5, color: "var(--app-color-text-muted)" }}
              >
                Relational workspace transactional data logged dynamically
                through core ERP modules.
              </AppText>
            </AppCard>
          )}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
    PRICING & HSN/GST TAB PANEL SECTION
   ========================================================================== */
const PricingTabSection = ({ product }) => {
  const hsnCode = product?.hsn || product?.HsnMaster?.code || "-";
  const gstRate =
    product?.hsnTaxpercent != null
      ? `${product.hsnTaxpercent}%`
      : product?.HsnMaster?.gstRate != null
        ? `${product.HsnMaster.gstRate}%`
        : "-";
  const hsnDescription =
    product?.HsnMaster?.description || "Pharmaceutical Product HSN Code";

  return (
    <div className="space-y-4">
      {/* Grid 1: Tax & Compliance + Margins */}
      <div className="grid grid-cols-2 gap-4 items-start">
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Tax & HSN Compliance" />
          <div className="p-4 space-y-3.5">
            <StatusTrackingRow label="HSN Code" value={hsnCode} />
            <StatusTrackingRow
              label="GST Tax Rate"
              value={
                <AppTag
                  label={gstRate}
                  colorVariant="purple"
                  variant="soft"
                  rounded="md"
                  sx={{ height: 20, fontSize: "11px", fontWeight: 700 }}
                />
              }
            />
            <StatusTrackingRow label="HSN Description" value={hsnDescription} />
          </div>
        </AppCard>

        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Trade Margins" />
          <div className="p-4 space-y-3.5">
            <StatusTrackingRow
              label="Retailer Margin"
              value={`${product?.retailerMarginPercent || 20}%`}
            />
            <StatusTrackingRow
              label="Stockist Margin"
              value={`${product?.stockistMarginPercent || 10}%`}
            />
            <StatusTrackingRow
              label="C %"
              value={`${product?.rateCPercentage || 0}%`}
            />
          </div>
        </AppCard>
      </div>

      {/* Grid 2: Detailed Pricing Rates */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <SectionHeader title="Pricing Rates Matrix" />
        <div className="grid grid-cols-6 gap-3 p-4 text-center">
          <PriceRateCell label="MRP" value={`₹${product?.mrp ?? 0}`} isPrimary />
          <PriceRateCell label="PTR" value={`₹${product?.ptr ?? 0}`} />
          <PriceRateCell label="PTS" value={`₹${product?.pts ?? 0}`} />
          <PriceRateCell label="Rate A" value={`₹${product?.rateA ?? 0}`} />
          <PriceRateCell label="Rate B" value={`₹${product?.rateB ?? 0}`} />
          <PriceRateCell label="Rate C" value={`₹${product?.finalRateC ?? 0}`} />
        </div>
      </AppCard>
    </div>
  );
};

const PriceRateCell = ({ label, value, isPrimary }) => (
  <div
    className={`p-3 rounded-xl border ${isPrimary
      ? "bg-purple-soft/20 border-purple-soft text-purple"
      : "bg-surface-alt/40 border-border"
      }`}
  >
    <span className="block text-[10.5px] font-bold text-text-muted uppercase tracking-wider">
      {label}
    </span>
    <span
      className={`block mt-1 text-[15px] font-extrabold ${isPrimary ? "text-purple" : "text-text"
        }`}
    >
      {value}
    </span>
  </div>
);

/* ==========================================================================
    1. OVERVIEW TAB PANEL GRAPHICS MODULES
   ========================================================================== */
const OverviewTabSection = ({ product }) => {
  return (
    <div className="space-y-4">
      {/* Structural Data Split Grid Row 1 */}
      <div className="grid grid-cols-[1fr_390px_350px] gap-4 items-start">
        {/* Box A: Custom Item Notes Descriptor */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Product Description" />
          <div className="p-4 space-y-4">
            <p className="text-[12.5px] leading-relaxed text-text font-medium">
              {product?.displayNotes ||
                `${product?.displayName || "Calcium Tablet"} ${product?.displayStrength || "500mg"} is a local custom workspace product mapped securely inside inventory parameters when no matching entry exists in the platform global catalog.`}
            </p>

            <div className="flex items-center gap-2.5 rounded-lg border border-purple-soft bg-purple-soft/20 p-3 text-[12px] font-semibold text-purple">
              <FiInfo className="text-[14px] shrink-0" />
              <span>
                This is a workspace custom product. Only members of this
                workspace entity can view or manage this catalog reference.
              </span>
            </div>
          </div>
        </AppCard>

        {/* Box B: Local Profile Verification State */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Product Status" />
          <div className="p-4 space-y-3.5">
            <StatusTrackingRow
              label="Status"
              value={
                <AppTag
                  label={product?.status === "inactive" ? "Inactive" : "Active"}
                  colorVariant={
                    product?.status === "inactive" ? "neutral" : "success"
                  }
                  variant="soft"
                  rounded="md"
                  sx={{ height: 20, fontSize: "10.5px", fontW: 700 }}
                />
              }
            />
            <StatusTrackingRow label="Availability" value="Active Workspace" />
            <StatusTrackingRow label="Created On" value="12 May 2024" />
            <StatusTrackingRow
              label="Last Updated"
              value="28 May 2024, 04:32 PM"
            />
            <StatusTrackingRow label="Updated By" value="Ravi Verma" />
          </div>
        </AppCard>

        {/* Box C: Core Configuration Info */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Quick Info & Tax" />
          <div className="p-4 space-y-3.5">
            <StatusTrackingRow
              label="Product Type"
              value={product?.displayType || "Medicine"}
            />
            <StatusTrackingRow
              label="HSN Code"
              value={product?.hsn || product?.HsnMaster?.code || "-"}
            />
            <StatusTrackingRow
              label="GST Tax Rate"
              value={
                product?.hsnTaxpercent != null
                  ? `${product.hsnTaxpercent}%`
                  : product?.HsnMaster?.gstRate != null
                    ? `${product.HsnMaster.gstRate}%`
                    : "-"
              }
            />
            <StatusTrackingRow label="MRP" value={`₹${product?.mrp ?? 0}`} />
            <StatusTrackingRow label="PTR" value={`₹${product?.ptr ?? 0}`} />
            <StatusTrackingRow label="Shelf Life" value="24 Months" />
            <StatusTrackingRow
              label="Storage"
              value="Store in a cool & dry place"
            />
          </div>
        </AppCard>
      </div>

      {/* Structural Data Split Grid Row 2 */}
      <div className="grid grid-cols-[1fr_520px] gap-4 items-start">
        {/* Box D: Relational Database Properties Panel */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Key Attributes" />
          <div className="p-4 space-y-3.5 divide-y divide-border/40 [&>div:not(:first-child)]:pt-3.5">
            <InfoGridRow
              label="Generic Name"
              value={product?.displayName || "Calcium Carbonate"}
            />
            <InfoGridRow label="Therapeutic Class" value="Mineral Supplement" />
            <InfoGridRow
              label="Indication"
              value="Calcium deficiency, Osteoporosis"
            />
            <InfoGridRow label="Age Group" value="All Age Groups" />
            <InfoGridRow label="Route of Administration" value="Oral" />
            <InfoGridRow label="Contraindications" value="Hypercalcemia" />
            <InfoGridRow
              label="Warnings"
              value="Do not exceed the recommended dose."
            />
            <InfoGridRow
              label="Side Effects"
              value="Constipation, Nausea, Bloating"
            />
          </div>
        </AppCard>

        <div className="space-y-4">
          {/* Box E-alt: Composition Details Card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            padding="none"
            sx={sectionCardSx}
          >
            <SectionHeader title="Composition / Active Salts" />
            <div className="p-4 space-y-3">
              {(!product?.composition || product.composition.length === 0) ? (
                <span className="block text-[12.5px] text-text-muted italic">No active salts configured.</span>
              ) : (
                product.composition.map((item, index) => {
                  const saltName = item.salt?.name || (typeof item.salt === "object" && item.salt !== null ? item.salt.name : "Unknown Salt");
                  return (
                    <div key={index} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="block text-[12.5px] font-bold text-text">{saltName}</span>
                        <span className="block text-[10.5px] text-text-muted">Active Ingredient</span>
                      </div>
                      <AppTag
                        label={`${item.strength} ${item.unit}`}
                        colorVariant="primary"
                        variant="soft"
                        rounded="md"
                        sx={{ height: 20, fontSize: "11px", fontWeight: 750 }}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </AppCard>

          {/* Box E: Packaging Spatial Sizing Panel */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            padding="none"
            sx={sectionCardSx}
          >
            <SectionHeader title="Packaging Information" />
            <div className="grid grid-cols-[1fr_200px] gap-4 p-4 items-center">
              <div className="space-y-3.5">
                <StatusTrackingRow label="Primary Pack" value="Bottle" />
                <StatusTrackingRow
                  label="Pack Size"
                  value={product?.displayPack || "60 Tablets"}
                />
                <StatusTrackingRow
                  label="Unit Type"
                  value={product?.displayForm || "Tablet"}
                />
                <StatusTrackingRow
                  label="Unit of Measure (UOM)"
                  value={product?.displayUomName || "-"}
                />
                <StatusTrackingRow
                  label="Product Category"
                  value={product?.displayCategoryName || "-"}
                />
                <StatusTrackingRow label="Inner Pack" value="1 Bottle" />
                <StatusTrackingRow label="Outer Pack" value="30 Bottles" />
              </div>

              {/* Blueprint Vector Line Illustration Object */}
              <div className="flex h-28 w-full items-center justify-center rounded-xl bg-purple-soft/10 text-purple border border-purple-soft/20 p-2">
                <svg
                  viewBox="0 0 120 80"
                  className="h-full w-full opacity-75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect
                    x="45"
                    y="25"
                    width="30"
                    height="45"
                    rx="6"
                    fill="var(--app-color-surface)"
                    strokeWidth="2"
                  />
                  <path
                    d="M49,25 L49,20 C49,18 53,16 60,16 C67,16 71,18 71,20 L71,25"
                    strokeWidth="2"
                    fill="var(--app-color-surface-alt)"
                  />
                  <rect
                    x="49"
                    y="38"
                    width="22"
                    height="12"
                    rx="1"
                    fill="var(--app-color-purple-soft)"
                    strokeWidth="0"
                  />
                  <line x1="53" y1="44" x2="67" y2="44" strokeWidth="1" />
                  <circle
                    cx="85"
                    cy="65"
                    r="5"
                    fill="var(--app-color-surface)"
                  />
                  <line x1="82" y1="65" x2="88" y2="65" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </AppCard>

          {/* Box F: Custom Related Products Grid Track Links */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            padding="none"
            sx={sectionCardSx}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface">
              <span className="text-[13.5px] font-bold text-text">
                Related Products
              </span>
              <button
                type="button"
                className="text-[11.5px] font-bold text-primary hover:underline"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 p-3">
              {(product?.relatedProducts || []).map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-2.5 rounded-lg border border-border p-2 hover:bg-surface-alt/40 transition select-none"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-alt text-text-muted text-[16px] border border-border">
                    <FiBox />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className="block text-[11.5px] font-bold text-text truncate leading-tight"
                      title={item.name}
                    >
                      {item.name}
                    </span>
                    <span className="block text-[10://px] text-text-muted font-medium mt-0.5">
                      {item.productForm} &bull; {item.strength}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AppCard>
        </div>
      </div>

      {/* Box G: Bottom Extended Workspace Usage Matrix Panels */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <div className="border-b border-border px-4 py-3 bg-surface">
          <span className="block text-[13.5px] font-bold text-text">
            Workspace Analytics Summary
          </span>
          <span className="block text-[11px] text-text-muted mt-0.5">
            Custom product entity cross-branch transactions track data
            indicators (read-only views).
          </span>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-6 items-center p-4 bg-surface-alt/10">
          <UsageMetricCell
            label="Total Branches Using"
            value={product?.workspaceUsage?.totalBranches || "12"}
            dotColor="bg-purple"
          />
          <UsageMetricCell
            label="Total Sales (Last 30 Days)"
            value={product?.workspaceUsage?.totalSales || "1,450 Units"}
            dotColor="bg-success"
          />
          <UsageMetricCell
            label="Total Stock (Across Branches)"
            value={product?.workspaceUsage?.totalStock || "8,760 Units"}
            dotColor="bg-info"
          />
          <UsageMetricCell
            label="Total Purchase (Last 30 Days)"
            value={product?.workspaceUsage?.totalPurchase || "1,120 Units"}
            dotColor="bg-warning"
          />
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            startIcon={<FiActivity />}
            sx={viewUsageBtnSx}
          >
            View Usage Details
          </AppButton>
        </div>
      </AppCard>
    </div>
  );
};

/* ==========================================================================
    ATOM UTILITY VIEW DATA ROW PARTICLES
   ========================================================================== */
const SectionHeader = ({ title }) => (
  <div className="border-b border-border px-4 py-3 bg-surface">
    <span className="block text-[13.5px] font-bold text-text">{title}</span>
  </div>
);

const StatusTrackingRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 text-[12px] font-medium">
    <span className="text-text-muted">{label}</span>
    <div className="font-bold text-text text-right">{value}</div>
  </div>
);

const InfoGridRow = ({ label, value }) => (
  <div className="grid grid-cols-[180px_1fr] items-start gap-4 text-[12px]">
    <span className="font-bold text-text-muted">{label}</span>
    <span className="font-semibold text-text leading-relaxed">{value}</span>
  </div>
);

const UsageMetricCell = ({ label, value, dotColor }) => (
  <div className="space-y-1.5 select-none">
    <span className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
    <span className="block text-[18px] font-extrabold text-text leading-none">
      {value}
    </span>
  </div>
);

const MetaItemIconBox = ({ icon, label, value }) => (
  <AppStack direction="row" align="center" gap={1} sx={{ minWidth: 0 }}>
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-alt border border-border text-text-muted text-[13px]">
      {icon}
    </div>
    <div className="min-w-0">
      <span className="block text-[10.5px] font-bold text-text-muted uppercase tracking-wide leading-none">
        {label}
      </span>
      <span
        className="block mt-0.5 text-[12px] font-bold text-text truncate max-w-[130px]"
        title={value}
      >
        {value}
      </span>
    </div>
  </AppStack>
);

/* ==========================================================================
    SX DESIGN PARAMETER OBJECT MAPS
   ========================================================================== */
const breadcrumbSx = { mb: 1.5 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  fontW: 500,
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageTitleSx = {
  m: 0,
  fontSize: "22px",
  lineHeight: 1.15,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};
const subHeaderMetaDataSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const secondaryButtonSx = {
  height: 34,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
  boxShadow: "none",
};
const viewUsageBtnSx = {
  height: 32,
  fontSize: "11px",
  fontW: 700,
  bgcolor: "var(--app-color-surface)",
};

const sectionCardSx = {
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

export default WorkspaceProductDetailsDesktopPage;
