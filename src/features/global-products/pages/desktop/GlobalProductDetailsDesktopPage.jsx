import { useMemo } from "react";
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

const GlobalProductDetailsDesktopPage = ({
  product,
  isLoading,
  hasError,
  error,
  currentTab,
  handleTabChange,
  handleBack,
  handleRefresh,
  handleBackToCatalog,
}) => {
  if (isLoading && !product) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppPageLoader text="Extracting master catalog specifications item..." />
      </section>
    );
  }

  if (hasError && !product) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppErrorState
          title="Catalog Extraction Failure"
          description={
            error || "The server could not resolve the global product entity."
          }
          actionText="Retry Data Pipeline"
          onRetry={handleRefresh}
          size="page"
        />
      </section>
    );
  }

  const safeProduct = product || {};

  // Interactive Tab Definitions Strip Array
  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "specifications", label: "Specifications" },
    { value: "packaging_pricing", label: "Packaging & Pricing" },
    { value: "availability", label: "Availability" },
    { value: "history", label: "History" },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* --- BREADCRUMB STRIP & TOP LEVEL ACTION ROW --- */}
        <div className="flex items-center justify-between">
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard", onClick: () => {} },
              { label: "Products", onClick: () => {} },
              { label: "Global Products", onClick: handleBack },
              {
                label:
                  safeProduct.displayName || "Product Specification Details",
                current: true,
              },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* --- CORPORATE MASTER CATALOG JUMBOTRON ROW --- */}
        <div className="mt-2 flex w-full items-start justify-between border-b border-border-strong bg-surface rounded-xl border p-5 shadow-xs gap-4">
          <AppStack
            direction="row"
            align="flex-start"
            gap={1.5}
            sx={{ width: "100%", minWidth: 0 }}
          >
            {/* Product Image Frame Wrapper Box */}
            <div className="flex h-36 w-44 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-alt p-2 overflow-hidden shadow-2xs">
              {safeProduct.imageUrl ? (
                <img
                  src={safeProduct.imageUrl}
                  alt={safeProduct.displayName || "Product"}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 text-text-muted">
                  <FiBox className="text-[28px] opacity-60" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    No Image Available
                  </span>
                </div>
              )}
            </div>

            <AppBox sx={{ flex: 1, minWidth: 0 }}>
              <AppStack direction="row" align="center" gap={0.8}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {safeProduct.displayName || "Paracetamol Tablet 650mg"}
                </AppHeading>
                <AppStatusBadge
                  status={
                    safeProduct.status === "inactive" ? "inactive" : "active"
                  }
                  variant="soft"
                  rounded="md"
                  size="small"
                />
              </AppStack>

              <div className="mt-1.5 flex items-center gap-2">
                <AppTag
                  label="Global Product"
                  colorVariant="primary"
                  variant="soft"
                  rounded="md"
                  sx={{ height: 18, fontSize: "10.5px", fontWeight: 700 }}
                />
                <AppText variant="body2" sx={subHeaderMetaDataSx}>
                  This product is globally available for all workspaces.
                </AppText>
              </div>

              {/* Identity Properties Strip */}
              <div className="mt-4 grid grid-cols-4 gap-x-6 gap-y-2 max-w-2xl border-t border-border-strong/40 pt-3 text-[12px]">
                <div className="flex items-center gap-2">
                  <FiGrid className="text-text-muted text-[13px]" />
                  <span className="text-text-muted font-medium">SKU:</span>
                  <span className="font-bold text-text">
                    {safeProduct.displayCode || "GP-000001"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineBuildingOffice2 className="text-text-muted text-[14px]" />
                  <span className="text-text-muted font-medium">
                    Manufacturer:
                  </span>
                  <span
                    className="font-bold text-text truncate max-w-[120px]"
                    title={safeProduct.displayMarketer || "-"}
                  >
                    {safeProduct.displayMarketer || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiLayers className="text-text-muted text-[13px]" />
                  <span className="text-text-muted font-medium">Category:</span>
                  <span className="font-bold text-primary bg-primary-soft/40 px-2 py-0.5 rounded text-[11px]">
                    {safeProduct.displayCategory || "Analgesic"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-text-muted text-[13px]" />
                  <span className="text-text-muted font-medium">Strength:</span>
                  <span className="font-bold text-text">
                    {safeProduct.medicineDetails?.strength ||
                      safeProduct.qty ||
                      "650 mg"}
                  </span>
                </div>
              </div>
            </AppBox>
          </AppStack>

          {/* FIXED RIGHT BUTTONS CONTAINER PANEL: Locked to single-line view without shrinking */}
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
              Back to Global Products
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
                  id: "refresh",
                  label: "Sync Global Record",
                  onClick: handleRefresh,
                },
              ]}
              dense
            />
          </div>
        </div>

        {/* --- INTERACTIVE NAV TABS LINE STRIP --- */}
        <div className="mt-5 flex border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-5 pb-3 text-[13px] font-bold transition whitespace-nowrap outline-none ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- SWITCHABLE TAB PLATFORM PANEL VIEWPORTS --- */}
        <div className="mt-5">
          {currentTab === "overview" && (
            <OverviewTabSection product={safeProduct} />
          )}
          {currentTab === "specifications" && (
            <SpecificationsTabSection product={safeProduct} />
          )}
          {currentTab !== "overview" && currentTab !== "specifications" && (
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
                {tabs.find((t) => t.value === currentTab)?.label} Details
                Segment
              </AppHeading>
              <AppText
                variant="body2"
                sx={{ mt: 0.5, color: "var(--app-color-text-muted)" }}
              >
                Additional master configuration metrics linked via pipeline
                parameters.
              </AppText>
            </AppCard>
          )}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
    1. OVERVIEW TAB MODULE COMPONENTS
   ========================================================================== */
const OverviewTabSection = ({ product }) => {
  const nameString = product?.displayName || "Paracetamol";
  const defaultGenericName = nameString.includes(" ")
    ? nameString.split(" ")[0]
    : nameString;

  return (
    <div className="space-y-4">
      {/* Grid Layout Row 1 */}
      <div className="grid grid-cols-[1fr_390px_350px] gap-4 items-start">
        {/* Box A: Product Description Panel */}
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
              {product?.medicineDetails?.description ||
                product?.otcDetails?.information ||
                `${product?.displayName || "Paracetamol Tablet 650mg"} is used to relieve pain and reduce fever. It is effective for headaches, muscle aches, toothaches, arthritis, backaches, and mild to moderate pain.`}
            </p>

            <div className="flex items-center gap-2.5 rounded-lg border border-primary-soft bg-primary-soft/20 p-3 text-[12px] font-semibold text-primary">
              <FiInfo className="text-[14px] shrink-0" />
              <span>
                This is a globally managed product. You can view and use this
                product in your workspace.
              </span>
            </div>
          </div>
        </AppCard>

        {/* Box B: Product Status Parameters */}
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
                  sx={{ height: 20, fontSize: "10.5px", fontWeight: 700 }}
                />
              }
            />
            <StatusTrackingRow label="Availability" value="Global" />
            <StatusTrackingRow label="Listed On" value="12 Mar 2018" />
            <StatusTrackingRow
              label="Last Updated"
              value="28 May 2024, 04:32 PM"
            />
            <StatusTrackingRow label="Updated By" value="System Admin" />
          </div>
        </AppCard>

        {/* Box C: Quick Info Parameters */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Quick Info" />
          <div className="p-4 space-y-3.5">
            <StatusTrackingRow
              label="Product Type"
              value={product?.displayType || "Medicine"}
            />
            <StatusTrackingRow
              label="Prescription Required"
              value={product?.medicineDetails?.prescriptionRequired || "No"}
            />
            <StatusTrackingRow label="Discard After" value="-" />
            <StatusTrackingRow label="Shelf Life" value="24 Months" />
            <StatusTrackingRow
              label="Storage"
              value={
                product?.medicineDetails?.storage ||
                "Store in a cool & dry place"
              }
            />
          </div>
        </AppCard>
      </div>

      {/* Grid Layout Row 2 Split */}
      <div className="grid grid-cols-[1fr_520px] gap-4 items-start">
        {/* Box D: Detailed Key Attributes Registry */}
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
              value={
                product?.medicineDetails?.composition || defaultGenericName
              }
            />
            <InfoGridRow
              label="Therapeutic Class"
              value={product?.displayCategory || "Analgesic"}
            />
            <InfoGridRow
              label="Indication"
              value={
                product?.medicineDetails?.primaryUse || "Pain relief, Fever"
              }
            />
            <InfoGridRow label="Age Group" value="All Age Groups" />
            <InfoGridRow label="Route of Administration" value="Oral" />
            <InfoGridRow
              label="Contraindications"
              value={
                product?.medicineDetails?.interactions?.liver ||
                "Severe liver impairment"
              }
            />
            <InfoGridRow
              label="Warnings"
              value="Do not exceed the recommended dose."
            />
            <InfoGridRow
              label="Side Effects"
              value={
                product?.medicineDetails?.commonSideEffect ||
                "Nausea, Rash, Allergic reactions (rare)"
              }
            />
          </div>
        </AppCard>

        <div className="space-y-4">
          {/* Box E: Packaging Information Specification Block */}
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
                <StatusTrackingRow
                  label="Primary Pack"
                  value={
                    product?.packagingInformation?.primaryPack || "Blister"
                  }
                />
                <StatusTrackingRow
                  label="Pack Size"
                  value={
                    product?.packagingInformation?.packSize || "10 x 10 Tablets"
                  }
                />
                <StatusTrackingRow
                  label="Unit Type"
                  value={product?.packagingInformation?.unitType || "Strip"}
                />
                <StatusTrackingRow
                  label="Units per Box"
                  value={
                    product?.packagingInformation?.unitsPerBox || "10 Strips"
                  }
                />
              </div>

              {/* Illustration Embedded Wrapper */}
              <div className="flex h-28 w-full items-center justify-center rounded-xl bg-primary-soft/10 text-primary border border-primary-soft/20 p-2">
                <svg
                  viewBox="0 0 120 80"
                  className="h-full w-full opacity-75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect
                    x="10"
                    y="20"
                    width="75"
                    height="45"
                    rx="4"
                    fill="var(--app-color-surface)"
                    strokeWidth="2"
                  />
                  <rect
                    x="55"
                    y="10"
                    width="55"
                    height="40"
                    rx="3"
                    fill="var(--app-color-surface-alt)"
                    opacity="0.8"
                  />
                  <circle cx="22" cy="32" r="4" />
                  <circle cx="37" cy="32" r="4" />
                  <circle cx="52" cy="32" r="4" />
                  <circle cx="67" cy="32" r="4" />
                  <circle cx="22" cy="45" r="4" />
                  <circle cx="37" cy="45" r="4" />
                  <circle cx="52" cy="45" r="4" />
                  <circle cx="67" cy="45" r="4" />
                </svg>
              </div>
            </div>
          </AppCard>

          {/* Box F: Related Products Grid Strips */}
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
                    <span className="block text-[10px] text-text-muted font-medium mt-0.5">
                      {item.productForm} &bull; {item.strength}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AppCard>
        </div>
      </div>

      {/* Box G: Workspace Multi-Tenant Analytics Strip */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <div className="border-b border-border px-4 py-3 bg-surface">
          <span className="block text-[13.5px] font-bold text-text">
            Workspace Usage
          </span>
          <span className="block text-[11px] text-text-muted mt-0.5">
            This global product is being used in the following workspaces
            (read-only).
          </span>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-6 items-center p-4 bg-surface-alt/10">
          <UsageMetricCell
            label="Total Workspaces Using"
            value={
              product?.workspaceUsage?.totalWorkspaces?.toLocaleString() ||
              "1,245"
            }
            dotColor="bg-success"
          />
          <UsageMetricCell
            label="Total Branches Using"
            value={
              product?.workspaceUsage?.totalBranches?.toLocaleString() ||
              "3,876"
            }
            dotColor="bg-primary"
          />
          <UsageMetricCell
            label="Total Sales (Last 30 Days)"
            value={product?.workspaceUsage?.totalSales || "45,230 Units"}
            dotColor="bg-warning"
          />
          <UsageMetricCell
            label="Total Stock (Across Workspaces)"
            value={product?.workspaceUsage?.totalStock || "1,28,560 Units"}
            dotColor="bg-info"
          />

          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            startIcon={<FiActivity />}
            sx={{
              height: 32,
              fontSize: "11px",
              fontW: 700,
              bgcolor: "var(--app-color-surface)",
            }}
          >
            View Usage Details
          </AppButton>
        </div>
      </AppCard>
    </div>
  );
};

/* ==========================================================================
    2. SPECIFICATIONS DEEP-DIVE TAB MODULE COMPONENTS
   ========================================================================== */
const SpecificationsTabSection = ({ product }) => {
  const isOtc = product?.productType === "otc";

  if (isOtc) {
    const otc = product?.otcDetails || {};
    return (
      <div className="grid grid-cols-[1fr_400px] gap-4 items-start">
        {/* Left Column: Core Clinical Information */}
        <div className="space-y-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            padding="none"
            sx={sectionCardSx}
          >
            <SectionHeader title="OTC Product Information" />
            <div className="p-4 space-y-4">
              <ClinicalBlock
                icon={<FiBookOpen />}
                title="Information Overview"
                text={otc.information}
              />
              <ClinicalBlock
                icon={<FiCheckCircle />}
                title="Product Highlights"
                text={otc.productHighlights}
              />
              <ClinicalBlock
                icon={<FiLayers />}
                title="Key Benefits"
                text={otc.keyBenefits}
              />
            </div>
          </AppCard>
        </div>

        {/* Right Column: Directions & Safety Guidelines */}
        <div className="space-y-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            padding="none"
            sx={sectionCardSx}
          >
            <SectionHeader title="Usage & Safety Guidelines" />
            <div className="p-4 space-y-4">
              <ClinicalBlock
                icon={<FiActivity />}
                title="Directions For Use"
                text={otc.directionsForUse}
              />
              <ClinicalBlock
                icon={<FiAlertTriangle />}
                title="Safety Information"
                text={otc.safetyInformation}
              />
              <ClinicalBlock
                icon={<FiGrid />}
                title="Key Ingredients"
                text={otc.keyIngredients}
              />
            </div>
          </AppCard>
        </div>
      </div>
    );
  }

  // Otherwise fallback rendering medicine-specific schema fields
  const med = product?.medicineDetails || {};
  const interact = med.interactions || {};

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_450px] gap-4 items-start">
      {/* Left Column: Master Medical Monographs */}
      <div className="space-y-4">
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Clinical Monograph" />
          <div className="p-4 space-y-5">
            <ClinicalBlock
              icon={<FiBookOpen />}
              title="Introduction"
              text={med.introduction}
            />
            <ClinicalBlock
              icon={<FiActivity />}
              title="Mechanism of Action (How it Works)"
              text={med.howItWorks}
            />
            <ClinicalBlock
              icon={<FiAlertTriangle />}
              title="Missed Dose Protocol"
              text={med.missedDose}
            />
            <ClinicalBlock
              icon={<FiInfo />}
              title="Fact Box Summary"
              text={med.factBox}
            />
          </div>
        </AppCard>

        {/* Clinical Patient Q&As Block */}
        {med.qa && (
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            padding="none"
            sx={sectionCardSx}
          >
            <SectionHeader title="Frequently Asked Questions (Q&A)" />
            <div className="p-4">
              <div className="flex gap-3 items-start rounded-lg border border-border bg-surface-alt/40 p-4">
                <FiHelpCircle className="text-primary text-[18px] shrink-0 mt-0.5" />
                <div className="text-[12.5px] leading-relaxed text-text font-medium whitespace-pre-line">
                  {med.qa}
                </div>
              </div>
            </div>
          </AppCard>
        )}
      </div>

      {/* Right Column: Physiological System Safety Advice Blocks */}
      <div className="space-y-4">
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Physiological Safety Profile" />
          <div className="p-4 space-y-3">
            <AppText
              variant="body2"
              sx={{
                color: "var(--app-color-text-muted)",
                fontW: 600,
                mb: 1,
                display: "block",
              }}
            >
              Contraindications & cross-system metabolic tolerances:
            </AppText>

            <SafetyAdviceRow
              label="Liver Interaction"
              text={interact.liver}
              severity={interact.liver ? "danger" : "neutral"}
            />
            <SafetyAdviceRow
              label="Kidney Interaction"
              text={interact.kidney}
              severity={interact.kidney ? "warning" : "neutral"}
            />
            <SafetyAdviceRow
              label="Pregnancy Warning"
              text={interact.pregnancy}
              severity={interact.pregnancy ? "danger" : "neutral"}
            />
            <SafetyAdviceRow
              label="Lactation / Breastfeeding"
              text={interact.lactation}
              severity={interact.lactation ? "warning" : "neutral"}
            />
            <SafetyAdviceRow
              label="Alcohol Consumption"
              text={interact.alcohol}
              severity={interact.alcohol ? "danger" : "neutral"}
            />
            <SafetyAdviceRow
              label="Driving Security"
              text={interact.driving}
              severity={interact.driving ? "warning" : "neutral"}
            />
            <SafetyAdviceRow
              label="General Advice"
              text={interact.general}
              severity="neutral"
            />
          </div>
        </AppCard>

        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader title="Clinical Safety Parameters" />
          <div className="p-4 space-y-3.5">
            <StatusTrackingRow
              label="Medicine Composition"
              value={med.composition || "-"}
            />
            <StatusTrackingRow
              label="Therapeutic Type Code"
              value={med.medicineType || "-"}
            />
            <StatusTrackingRow
              label="Prescription Mandate"
              value={med.prescriptionRequired || "No"}
            />
            <StatusTrackingRow
              label="Primary Clinical Indication"
              value={med.primaryUse || "-"}
            />
            <StatusTrackingRow
              label="Environmental Storage"
              value={med.storage || "Store in a cool & dry place"}
            />
          </div>
        </AppCard>
      </div>
    </div>
  );
};

/* ==========================================================================
    ATOM UTILITY UI MODULE REUSABLE BLOCK PARTICLES
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

const ClinicalBlock = ({ icon, title, text }) => {
  if (!text) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-[12px] font-bold text-text">
        <span className="text-primary text-[14px]">{icon}</span>
        <span>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed text-text-muted pl-5 font-medium">
        {text}
      </p>
    </div>
  );
};

const SafetyAdviceRow = ({ label, text, severity }) => {
  const badgeColors =
    severity === "danger"
      ? "bg-danger-soft text-danger border-danger/20"
      : severity === "warning"
        ? "bg-warning-soft text-warning border-warning/20"
        : "bg-surface-alt text-text-muted border-border";

  return (
    <div className="rounded-lg border border-border bg-surface p-3 space-y-1 select-none">
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-bold text-text">{label}</span>
        <span
          className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${badgeColors}`}
        >
          {severity === "neutral" ? "Information" : severity}
        </span>
      </div>
      <p className="text-[11px] leading-normal text-text-muted font-medium">
        {text ||
          "No structural restrictions documented for this formulation index profile parameters."}
      </p>
    </div>
  );
};

/* ==========================================================================
    STYLE OBJECT MAPS (THEME DESIGN SYSTEM ALIGNMENT)
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

const sectionCardSx = {
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

export default GlobalProductDetailsDesktopPage;
