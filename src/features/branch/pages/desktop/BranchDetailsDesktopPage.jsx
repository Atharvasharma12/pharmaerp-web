// src/features/branch/pages/desktop/BranchDetailsDesktopPage.jsx

import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiEdit3,
  FiMoreHorizontal,
  FiCalendar,
  FiUser,
  FiClock,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiUsers,
  FiCheckCircle,
  FiFileText,
  FiShield,
  FiChevronRight,
  FiChevronLeft,
  FiGrid,
  FiMail,
  FiPhone,
  FiExternalLink,
  FiMapPin,
  FiAlertTriangle,
  FiTrendingUp,
  FiLayers,
  FiActivity,
  FiPackage,
  FiCreditCard,
} from "react-icons/fi";
import { LuStore } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppMenu,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
  AppPageLoader,
  AppErrorState,
  PermissionGate,
} from "@/components";

const BranchDetailsDesktopPage = ({
  branch,
  isLoading,
  hasError,
  error,
  currentTab,
  handleTabChange,
  handleBack,
  handleEdit,
  handleRefresh,
}) => {
  if (isLoading && !branch) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppPageLoader text="Extracting branch node registry data..." />
      </section>
    );
  }

  if (hasError && !branch) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppErrorState
          title="Location Matrix Extraction Failure"
          description={
            error ||
            "The service registry failed to unpack the branch entity token."
          }
          actionText="Re-verify Pipeline"
          onRetry={handleRefresh}
          size="page"
        />
      </section>
    );
  }

  const safeBranch = branch || {};

  // Tab configurations matching layout volume counts dynamically
  const tabs = useMemo(
    () => [
      { value: "overview", label: "Overview" },
      {
        value: "staff",
        label: `Assigned Staff (${safeBranch.staff?.length || 0})`,
      },
      { value: "stock", label: "Stock Analytics" },
      { value: "licenses", label: "Regulatory Licenses" },
      { value: "transactions", label: "Terminal Invoices" },
    ],
    [safeBranch.staff?.length],
  );

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* --- BREADCRUMB HEADER NAV STRIP --- */}
        <div className="flex items-center justify-between">
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard", onClick: () => {} },
              { label: "Companies", onClick: handleBack },
              { label: "Branches", onClick: handleBack },
              {
                label: safeBranch.name || "Branch Terminal Profile",
                current: true,
              },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* --- LOCATION IDENTITY HERO PANEL HUB --- */}
        <div className="mt-2 flex w-full items-start justify-between border-b border-border-strong bg-surface rounded-xl border p-4 shadow-xs">
          <AppStack direction="row" align="center" gap={1.2}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary text-[26px]">
              <LuStore />
            </div>
            <AppBox>
              <AppStack direction="row" align="center" gap={0.8}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {safeBranch.name}
                </AppHeading>
                {safeBranch.isPrimary && (
                  <AppTag
                    label="Primary Hub"
                    variant="contained"
                    colorVariant="primary"
                    rounded="md"
                    sx={{ height: 18, fontSize: "9.5px", fontWeight: 800 }}
                  />
                )}
                <AppStatusBadge
                  status={safeBranch.status || "active"}
                  variant="soft"
                  rounded="md"
                  size="small"
                />
              </AppStack>
              <AppText variant="body2" sx={subHeaderMetaDataSx}>
                {safeBranch.displayType} &bull;{" "}
                <span className="font-semibold text-text-muted">Code:</span>{" "}
                {safeBranch.displayTypeCode}
              </AppText>

              {/* Context metadata telemetry badges */}
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-text-muted">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-primary text-[13px]" /> Active
                  Since {safeBranch.displayCreatedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiUser className="text-success text-[13px]" />{" "}
                  Pharmacist-in-Charge: {safeBranch.displayPharmacistName}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiActivity className="text-warning text-[13px]" /> Real-time
                  Calculation Online
                </span>
              </div>
            </AppBox>
          </AppStack>

          <AppStack direction="row" align="center" gap={1}>
            <PermissionGate permission="branch:update">
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiEdit3 />}
                onClick={handleEdit}
                sx={secondaryButtonSx}
              >
                Configure Terminal
              </AppButton>
            </PermissionGate>
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
                  id: "sync",
                  label: "Sync Inventory Pipeline",
                  onClick: handleRefresh,
                },
                {
                  id: "report",
                  label: "Generate EOD Report",
                  onClick: () => {},
                },
                {
                  id: "logs",
                  label: "Terminal Activity Audit",
                  onClick: () => {},
                },
              ]}
              dense
            />
          </AppStack>
        </div>

        {/* --- INTERACTIVE NAV TAB STRIP --- */}
        <div className="mt-4 flex border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-4 pb-2.5 text-[12.5px] font-bold transition whitespace-nowrap outline-none ${
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

        {/* --- SWITCHABLE TAB DISPLAY SHEET CONTENT GRID --- */}
        <div className="mt-5">
          {currentTab === "overview" && (
            <OverviewTabSection branch={safeBranch} />
          )}
          {currentTab === "staff" && <StaffTabSection branch={safeBranch} />}
          {currentTab === "stock" && (
            <StockAnalyticsTabSection branch={safeBranch} />
          )}
          {currentTab === "licenses" && (
            <RegulatoryLicensesTabSection branch={safeBranch} />
          )}
          {currentTab === "transactions" && (
            <TerminalInvoicesTabSection branch={safeBranch} />
          )}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   1. OVERVIEW TAB MODULE CORES
   ========================================================================== */
const OverviewTabSection = ({ branch }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-[1fr_420px_350px] gap-4 items-start">
      {/* Col 1: Static Parameter Properties Attributes info */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <SectionHeader
          title="Terminal Location Parameters"
          description="Registered baseline physical and digital metadata properties."
        />
        <div className="p-4 space-y-3.5">
          <InfoGridRow
            icon={<LuStore />}
            label="Branch Name"
            value={branch.displayName}
          />
          <InfoGridRow
            icon={<FiLayers />}
            label="System Operational Type"
            value={branch.displayType}
          />
          <InfoGridRow
            icon={<FiGrid />}
            label="Unique Branch Code"
            value={branch.displayTypeCode}
          />
          <InfoGridRow
            icon={<FiMail />}
            label="Operational Email"
            value={branch.displayEmail}
          />
          <InfoGridRow
            icon={<FiPhone />}
            label="Primary Landline"
            value={branch.displayPhone}
          />

          {branch.displayWhatsapp && (
            <InfoGridRow
              icon={<FaWhatsapp className="text-emerald-500" />}
              label="WhatsApp Alert Desk"
              value={branch.displayWhatsapp}
            />
          )}

          <InfoGridRow
            icon={<FiFileText />}
            label="Drug License Node"
            value={branch.displayDrugLicense}
          />
          <InfoGridRow
            icon={<FiUser />}
            label="Pharmacist-In-Charge"
            value={branch.displayPharmacistName}
          />
          <InfoGridRow
            icon={<FiCalendar />}
            label="License Verified Until"
            value={branch.displayLicenseExpiry}
          />
          <InfoGridRow
            icon={<FiMapPin />}
            label="Physical Shipping Address"
            value={branch.displayAddress}
          />
        </div>
        <div className="border-t border-border p-3 flex justify-center">
          <button
            type="button"
            className="text-[12px] font-bold text-primary hover:underline"
          >
            Inspect Full Registration Ledger
          </button>
        </div>
      </AppCard>

      {/* Col 2: Core Branch Highlights Live Analytics Mini-Cards */}
      <div className="space-y-4">
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader
            title="Terminal Highlights"
            description="Live execution window metrics summaries."
          />
          <div className="grid grid-cols-2 gap-3 p-4">
            <HighlightMetricCard
              icon={<FiTrendingUp />}
              title="Sales Today"
              value={branch.highlights?.totalSalesToday}
              subtext="View sales register &rarr;"
              color="bg-success-soft text-success"
            />
            <HighlightMetricCard
              icon={<FiFileText />}
              title="Active Invoices"
              value={branch.highlights?.activeInvoicesCount}
              subtext="Billing terminal &rarr;"
              color="bg-primary-soft text-primary"
            />
            <HighlightMetricCard
              icon={<FiLayers />}
              title="Stock Items"
              value={branch.highlights?.stockItemsCount}
              subtext="View warehouse &rarr;"
              color="bg-purple-soft text-purple"
            />
            <HighlightMetricCard
              icon={<FiAlertTriangle />}
              title="Stock Alerts"
              value={branch.highlights?.lowStockAlerts}
              subtext="Procurements &rarr;"
              color="bg-danger-soft text-danger"
            />
          </div>
        </AppCard>
      </div>

      {/* Col 3: Compliance Status Lifecycle Governance logs */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <SectionHeader
          title="Compliance Status"
          description="Lifecycle governance rules status."
        />
        <div className="p-4 space-y-4">
          <StatusTrackingRow
            label="Node Status"
            value={
              <AppTag
                label="Active Line"
                colorVariant="success"
                variant="soft"
                rounded="md"
                sx={{ height: 20, fontSize: "10px" }}
              />
            }
          />
          <StatusTrackingRow
            label="Pharmacist Bonded"
            value={
              <span className="flex items-center gap-1 text-[11.5px] font-bold text-success">
                <FiCheckCircle /> Secured
              </span>
            }
          />
          <StatusTrackingRow label="FSSAI Index" value={branch.displayFssai} />
          <StatusTrackingRow
            label="Incorporation Date"
            value={branch.displayCreatedAt}
          />

          <div className="border-t border-border pt-3">
            <span className="block text-[11px] font-bold text-text-muted uppercase">
              Regulatory Note
            </span>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-text-muted">
              This terminal is strictly certified for real-time stock
              calculation, unified invoicing, and pharmaceutical batch
              compliance tracking parameters.
            </p>
          </div>
        </div>
      </AppCard>
    </div>

    {/* Bottom Activity Layout Split Strip Grid */}
    <div className="grid grid-cols-3 gap-4">
      {/* Left Bottom Mini-Table: Assigned Staff Desk Summary */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-[13px] font-bold text-text">
            Assigned Staff Desk
          </span>
          <button
            type="button"
            className="text-[11px] font-bold text-primary hover:underline"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-border overflow-y-auto max-h-[300px]">
          {branch.staff?.slice(0, 3).map((person) => (
            <div
              key={person._id}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-alt/50"
            >
              <AppStack direction="row" align="center" gap={0.8}>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[10px] font-bold text-primary uppercase">
                  {person.name.slice(0, 2)}
                </div>
                <div>
                  <span className="block text-[12px] font-bold text-text leading-tight">
                    {person.name}
                  </span>
                  <span className="block text-[10.5px] text-text-muted">
                    {person.phone}
                  </span>
                </div>
              </AppStack>
              <AppTag
                label={person.role}
                size="small"
                variant="soft"
                rounded="md"
                colorVariant={person.tagColor}
                sx={{ height: 18, fontSize: "9.5px", fontWeight: 700 }}
              />
            </div>
          ))}
        </div>
      </AppCard>

      {/* Middle Bottom List: Low Stock Pipeline Interventions */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-[13px] font-bold text-text">
            Critical Inventory Interventions
          </span>
          <span className="text-[10px] bg-danger-soft text-danger font-extrabold px-2 py-0.5 rounded-full">
            Action Required
          </span>
        </div>
        <div className="divide-y divide-border overflow-y-auto max-h-[300px] p-2 space-y-2">
          {branch.alerts?.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-surface-alt/40"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger-soft text-[10px] text-danger">
                <FiAlertTriangle />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-bold text-text leading-snug truncate">
                  {alert.item}
                </p>
                <span className="block mt-0.5 text-[10px] text-text-muted">
                  Batch: {alert.batch} &bull;{" "}
                  <span className="font-semibold text-danger-strong">
                    {alert.qtyLeft}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </AppCard>

      {/* Right Bottom List: Recent Live Invoice streams */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-[13px] font-bold text-text">
            Recent Live Invoices
          </span>
          <button
            type="button"
            className="text-[11px] font-bold text-primary hover:underline"
          >
            Sales Desk
          </button>
        </div>
        <div className="divide-y divide-border overflow-y-auto max-h-[300px]">
          {branch.invoices?.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-alt/50"
            >
              <AppStack
                direction="row"
                align="center"
                gap={0.8}
                sx={{ minWidth: 0 }}
              >
                <span className="text-[16px] text-success shrink-0">
                  <FiFileText />
                </span>
                <div className="min-w-0">
                  <span className="block text-[12px] font-bold text-text truncate leading-tight">
                    {invoice.customer}
                  </span>
                  <span className="block text-[10.5px] text-text-muted">
                    {invoice.id} &bull; {invoice.time}
                  </span>
                </div>
              </AppStack>
              <div className="text-right">
                <span className="block text-[12px] font-extrabold text-text leading-tight">
                  {invoice.amount}
                </span>
                <span className="block text-[9.5px] text-text-muted font-bold uppercase">
                  {invoice.paymentMode}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AppCard>
    </div>
  </div>
);

/* ==========================================================================
   2. STAFF DESK TAB COMPONENT PANELS
   ========================================================================== */
const StaffTabSection = ({ branch }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    padding="none"
    sx={sectionCardSx}
  >
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <div>
        <span className="block text-[13.5px] font-bold text-text">
          Assigned Operational Staff
        </span>
        <span className="block text-[11px] text-text-muted">
          Privileges allocated directly onto this specific distribution terminal
          node.
        </span>
      </div>
      <AppStack direction="row" gap={1}>
        <AppButton
          variant="contained"
          colorVariant="primary"
          size="small"
          rounded="md"
          startIcon={<FiPlus />}
        >
          Assign Staff Member
        </AppButton>
      </AppStack>
    </div>

    <div className="border-b border-border p-3 flex items-center justify-between bg-surface gap-4">
      <AppSearchInput
        placeholder="Search staff metrics by name or email indexes..."
        size="small"
        rounded="md"
        variant="bordered"
        sx={{ maxW: 360 }}
      />
    </div>

    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left min-w-[950px]">
        <thead>
          <tr className="border-b border-border bg-surface-alt/70 text-[11px] font-bold text-text-muted uppercase tracking-wider">
            <th className="px-4 py-3">Staff Profile Member</th>
            <th className="px-4 py-3">Terminal Permission Role</th>
            <th className="px-4 py-3">Contact Index</th>
            <th className="px-4 py-3">Last Active</th>
            <th className="px-4 py-3">Activity Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-[12px]">
          {branch.staff?.map((person) => (
            <tr key={person._id} className="hover:bg-surface-alt/40 transition">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-[10px] font-bold text-primary uppercase">
                    {person.name.slice(0, 2)}
                  </div>
                  <div>
                    <span className="block font-bold text-text">
                      {person.name}
                    </span>
                    <span className="block text-[10.5px] text-text-muted font-medium">
                      {person.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <AppTag
                  label={person.role}
                  size="small"
                  variant="soft"
                  rounded="md"
                  colorVariant={person.tagColor}
                  sx={{ height: 20, fontSize: "10px", fontWeight: 700 }}
                />
              </td>
              <td className="px-4 py-3.5 text-text font-semibold">
                {person.phone}
              </td>
              <td className="px-4 py-3.5 text-text-muted font-medium">
                {person.lastActive}
              </td>
              <td className="px-4 py-3.5">
                <AppStatusBadge
                  status={person.status}
                  variant="soft"
                  rounded="md"
                  size="small"
                />
              </td>
              <td className="px-4 py-3.5 text-right">
                <AppIconButton
                  icon={<FiMoreHorizontal />}
                  size="small"
                  variant="ghost"
                  colorVariant="neutral"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </AppCard>
);

/* ==========================================================================
   3. STOCK ANALYTICS TAB MODULE PANEL
   ========================================================================== */
const StockAnalyticsTabSection = ({ branch }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-4 gap-3">
      <StatWidgetCard
        label="Total Stock SKUs"
        value={branch.highlights?.stockItemsCount || "0"}
        description="Unique items tracked"
      />
      <StatWidgetCard
        label="Low Stock Triggers"
        value={branch.highlights?.lowStockAlerts || "0"}
        description="Below safepoint minimums"
      />
      <StatWidgetCard
        label="Near Expiry Batches"
        value="2"
        description="Expiring inside 60 days"
      />
      <StatWidgetCard
        label="Valuation Ledger"
        value="自行计算"
        description="Real-time live pricing sync"
      />
    </div>

    <AppCard
      variant="default"
      rounded="lg"
      bordered
      padding="none"
      sx={sectionCardSx}
    >
      <SectionHeader
        title="Real-time Inventory Monitor"
        description="Live batch status metrics."
      />
      <div className="p-16 flex flex-col items-center justify-center text-center">
        <FiPackage className="text-text-muted text-[42px] mb-3" />
        <span className="block text-[14px] font-bold text-text">
          Stock Analytics Visualizer Engine
        </span>
        <span className="block text-[11.5px] text-text-muted max-w-md mt-1">
          Telemetry parsing pipelines are actively syncing database rows with
          local stock counters.
        </span>
      </div>
    </AppCard>
  </div>
);

/* ==========================================================================
   4. REGULATORY LICENSES TAB SECTIONS 
   ========================================================================== */
const RegulatoryLicensesTabSection = ({ branch }) => (
  <div className="grid grid-cols-3 gap-4">
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      padding="none"
      sx={sectionCardSx}
      className="col-span-2"
    >
      <SectionHeader
        title="State Drug Compliance Licenses"
        description="Registered pharmaceutical dispatch credentials."
      />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SettingsKeyValueDisplay
            label="Drug License Number"
            value={branch.displayDrugLicense}
          />
          <SettingsKeyValueDisplay
            label="License Types Framework"
            value={branch.displayDrugLicenseType}
          />
          <SettingsKeyValueDisplay
            label="FSSAI Registration Node"
            value={branch.displayFssai}
          />
          <SettingsKeyValueDisplay
            label="Expirations Verification Marker"
            value={branch.displayLicenseExpiry}
          />
        </div>

        <div className="border-t border-border pt-4 flex gap-2">
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiDownload />}
          >
            Download License Pack (PDF)
          </AppButton>
        </div>
      </div>
    </AppCard>

    <AppCard
      variant="default"
      rounded="lg"
      bordered
      padding="none"
      sx={sectionCardSx}
    >
      <SectionHeader
        title="Registered Pharmacist Verification"
        description="Mandated legal oversight signatures."
      />
      <div className="p-4 space-y-3.5 text-[12px]">
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-text-muted font-bold">Pharmacist Name</span>
          <span className="text-text font-bold">
            {branch.displayPharmacistName}
          </span>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-text-muted font-bold">Registration Number</span>
          <span className="text-text font-mono font-bold text-primary">
            {branch.displayPharmacistReg}
          </span>
        </div>
        <div className="flex justify-between pb-1">
          <span className="text-text-muted font-bold">
            Registered Mobile Contact
          </span>
          <span className="text-text font-semibold">
            {branch.displayPharmacistMobile}
          </span>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-success-soft/10 border border-success-soft/30 flex items-start gap-2 text-success text-[11.5px] font-semibold">
          <FiCheckCircle className="mt-0.5 shrink-0" />
          <span>
            Oversight validation signature matches active state regulatory
            registry index models.
          </span>
        </div>
      </div>
    </AppCard>
  </div>
);

/* ==========================================================================
   5. TERMINAL INVOICES TAB TRACKING TRAIL
   ========================================================================== */
const TerminalInvoicesTabSection = ({ branch }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    padding="none"
    sx={sectionCardSx}
  >
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <div>
        <span className="block text-[13.5px] font-bold text-text">
          Unified Terminal Invoices
        </span>
        <span className="block text-[11px] text-text-muted">
          Complete log records of billing mutations mapped onto this sales
          point.
        </span>
      </div>
      <AppButton
        variant="contained"
        colorVariant="primary"
        size="small"
        rounded="md"
        startIcon={<FiPlus />}
      >
        Create Unified Invoice
      </AppButton>
    </div>

    <div className="p-12 flex flex-col items-center justify-center text-center">
      <FiCreditCard className="text-text-muted text-[38px] mb-2" />
      <span className="block text-[13px] font-bold text-text">
        Billing Ledger Stream Connected
      </span>
      <span className="block text-[11px] text-text-muted mt-0.5">
        Terminal is ready to stream sales rows. Total invoices generated today:{" "}
        {branch.highlights?.activeInvoicesCount || 0}
      </span>
    </div>
  </AppCard>
);

/* ==========================================================================
   ATOM UI UTILITY SUB-COMPONENTS REUSABLE WRAPPERS
   ========================================================================== */
const SectionHeader = ({ title, description }) => (
  <div className="border-b border-border px-4 py-3 bg-surface">
    <span className="block text-[13.5px] font-bold text-text">{title}</span>
    {description && (
      <span className="block text-[11px] text-text-muted mt-0.5">
        {description}
      </span>
    )}
  </div>
);

const InfoGridRow = ({ icon, label, value }) => (
  <div className="grid grid-cols-[190px_1fr] items-start gap-4 text-[12px] py-0.5">
    <div className="flex items-center gap-2 font-bold text-text-muted">
      <span className="text-[14px] text-primary/80 shrink-0">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="font-bold text-text truncate max-w-[500px]">{value}</div>
  </div>
);

const HighlightMetricCard = ({ icon, title, value, subtext, color }) => (
  <div className="rounded-xl border border-border p-3 bg-surface hover:shadow-xs transition select-none">
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color} text-[15px]`}
      >
        {icon}
      </div>
      <div>
        <span className="block text-[10.5px] font-bold text-text-muted uppercase leading-none tracking-wide">
          {title}
        </span>
        <span className="block mt-1 text-[17px] font-extrabold text-text leading-none">
          {value}
        </span>
      </div>
    </div>
    <div className="mt-2.5 border-t border-border-strong/50 pt-1.5 flex items-center justify-between">
      <span className="text-[10px] font-semibold text-text-muted">
        {subtext}
      </span>
      <FiChevronRight className="text-[10px] text-text-muted" />
    </div>
  </div>
);

const StatusTrackingRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 text-[12px]">
    <span className="text-text-muted font-bold">{label}</span>
    <div className="font-bold text-text text-right">{value}</div>
  </div>
);

const StatWidgetCard = ({ label, value, description }) => (
  <div className="rounded-lg border border-border p-3 bg-surface">
    <span className="block text-[10.5px] font-bold text-text-muted uppercase tracking-wider">
      {label}
    </span>
    <span className="block mt-1 text-[20px] font-extrabold text-text leading-none">
      {value}
    </span>
    <span className="block mt-1.5 text-[10px] text-text-muted font-medium">
      {description}
    </span>
  </div>
);

const SettingsKeyValueDisplay = ({ label, value }) => (
  <div className="rounded-lg border border-border p-3 bg-surface-alt/30">
    <span className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
      {label}
    </span>
    <span className="block mt-1 text-[12.5px] font-bold text-text">
      {value}
    </span>
  </div>
);

/* ==========================================================================
   THEME STYLING primitivetokens DESIGN MAPS
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
  mt: 0.35,
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

export default BranchDetailsDesktopPage;
