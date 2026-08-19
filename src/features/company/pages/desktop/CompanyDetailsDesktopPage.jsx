// src/features/company/pages/desktop/CompanyDetailsDesktopPage.jsx

import { useMemo, useState } from "react";
import {
  FiBriefcase,
  FiArrowLeft,
  FiRefreshCw,
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
  FiInfo,
  FiMail,
  FiPhone,
  FiGlobe,
  FiExternalLink,
  FiMapPin,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

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
} from "@/components";

const CompanyDetailsDesktopPage = ({
  company,
  isLoading,
  hasError,
  error,
  currentTab,
  handleTabChange,
  handleBack,
  handleEdit,
  handleSettings,
  handleRefresh,
}) => {
  if (isLoading && !company) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppPageLoader text="Retrieving platform entity coordinates..." />
      </section>
    );
  }

  if (hasError && !company) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppErrorState
          title="Profile Extraction Failure"
          description={
            error || "The server could not process the company identifier."
          }
          actionText="Retry Pipeline"
          onRetry={handleRefresh}
          size="page"
        />
      </section>
    );
  }

  const safeCompany = company || {};

  // Tab Header Items
  const tabs = [
    { value: "overview", label: "Overview" },
    {
      value: "branches",
      label: `Branches (${safeCompany.highlights?.totalBranches || 0})`,
    },
    {
      value: "members",
      label: `Members (${safeCompany.highlights?.totalMembers || 0})`,
    },
    {
      value: "documents",
      label: `Documents (${safeCompany.documents?.length || 0})`,
    },
    { value: "settings", label: "Settings" },
    { value: "activity", label: "Activity Log" },
  ];

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
              {
                label: safeCompany.displayName || "Company Profile",
                current: true,
              },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* --- CORPORATE IDENTITY JUMBOTRON HEADER ROW --- */}
        <div className="mt-2 flex w-full items-start justify-between border-b border-border-strong bg-surface rounded-xl border p-4 shadow-xs">
          <AppStack direction="row" align="center" gap={1.2}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success text-[28px]">
              <HiOutlineBuildingOffice2 />
            </div>
            <AppBox>
              <AppStack direction="row" align="center" gap={0.8}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {safeCompany.displayName}
                </AppHeading>
                <AppStatusBadge
                  status={safeCompany.status || "active"}
                  variant="soft"
                  rounded="md"
                  size="small"
                />
              </AppStack>
              <AppText variant="body2" sx={subHeaderMetaDataSx}>
                {safeCompany.displayType} &bull;{" "}
                <span className="font-semibold text-text-muted">CIN:</span>{" "}
                {safeCompany.pan
                  ? `U24233DL2018PTC${safeCompany.pan}`
                  : "U24233DL2018PTC341234"}
              </AppText>

              {/* Meta pills strip */}
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-text-muted">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-primary text-[13px]" /> Created on{" "}
                  {safeCompany.displayCreatedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiUser className="text-success text-[13px]" /> Owned by{" "}
                  {safeCompany.displayOwnerName}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock className="text-warning text-[13px]" /> Member since
                  15 Mar 2024
                </span>
              </div>
            </AppBox>
          </AppStack>

          <AppStack direction="row" align="center" gap={1}>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiEdit3 />}
              onClick={handleEdit}
              sx={secondaryButtonSx}
            >
              Edit Company
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
                  id: "settings",
                  label: "Module Settings",
                  onClick: handleSettings,
                },
                {
                  id: "refresh",
                  label: "Force Sync State",
                  onClick: handleRefresh,
                },
              ]}
              dense
            />
          </AppStack>
        </div>

        {/* --- INTERACTIVE NAV TABS LINE STRIP --- */}
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

        {/* --- SWITCHABLE TAB CONTENT DISPLAY LAYOUTS --- */}
        <div className="mt-5">
          {currentTab === "overview" && (
            <OverviewTabSection company={safeCompany} />
          )}
          {currentTab === "branches" && (
            <BranchesTabSection company={safeCompany} />
          )}
          {currentTab === "members" && (
            <MembersTabSection company={safeCompany} />
          )}
          {currentTab === "documents" && (
            <DocumentsTabSection company={safeCompany} />
          )}
          {currentTab === "settings" && (
            <SettingsTabSection company={safeCompany} />
          )}
          {currentTab === "activity" && (
            <ActivityLogTabSection company={safeCompany} />
          )}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   1. OVERVIEW TAB MODULE PANELS
   ========================================================================== */
const OverviewTabSection = ({ company }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-[1fr_420px_350px] gap-4 items-start">
      {/* Col 1: Static Information Fields Card */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <SectionHeader
          title="Company Information"
          description="Root registry records configuration details."
        />
        <div className="p-4 space-y-3.5">
          <InfoGridRow
            icon={<HiOutlineBuildingOffice2 />}
            label="Company Name"
            value={company.displayName}
          />
          <InfoGridRow
            icon={<FiBriefcase />}
            label="Company Type"
            value={company.displayType}
          />
          <InfoGridRow
            icon={<FiUser />}
            label="Owner"
            value={company.displayOwnerName}
          />
          <InfoGridRow
            icon={<FiGrid />}
            label="PAN Number"
            value={company.displayPan}
          />
          <InfoGridRow
            icon={<FiFileText />}
            label="GST Number"
            value={company.displayGstin}
          />
          <InfoGridRow
            icon={<FiMail />}
            label="Email"
            value={company.displayEmail}
          />
          <InfoGridRow
            icon={<FiPhone />}
            label="Phone"
            value={company.displayPhone}
          />
          <InfoGridRow
            icon={<FiGlobe />}
            label="Website"
            value={company.website || "www.medplus.com"}
            link
          />
          <InfoGridRow
            icon={<FiShield />}
            label="Industry Type"
            value="Pharmacy & Healthcare"
          />
          <InfoGridRow
            icon={<FiCalendar />}
            label="Incorporation Date"
            value={company.displayCreatedAt}
          />
          <InfoGridRow
            icon={<FiMapPin />}
            label="Registered Address"
            value={company.displayAddress}
          />
        </div>
        <div className="border-t border-border p-3 flex justify-center">
          <button
            type="button"
            className="text-[12px] font-bold text-primary hover:underline"
          >
            View Full Details
          </button>
        </div>
      </AppCard>

      {/* Col 2: Core Highlights Mini-Grid Cards */}
      <div className="space-y-4">
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          padding="none"
          sx={sectionCardSx}
        >
          <SectionHeader
            title="Company Highlights"
            description="Operational volume parameters summary."
          />
          <div className="grid grid-cols-2 gap-3 p-4">
            <HighlightMetricCard
              icon={<LuStore />}
              title="Total Branches"
              value={company.highlights?.totalBranches}
              subtext="View branches &rarr;"
              color="bg-primary-soft text-primary"
            />
            <HighlightMetricCard
              icon={<FiUsers />}
              title="Total Members"
              value={company.highlights?.totalMembers}
              subtext="View members &rarr;"
              color="bg-info-soft text-info"
            />
            <HighlightMetricCard
              icon={<FiCheckCircle />}
              title="Active Members"
              value={company.highlights?.activeMembers}
              subtext="View members &rarr;"
              color="bg-success-soft text-success"
            />
            <HighlightMetricCard
              icon={<FiShield />}
              title="Roles"
              value={company.highlights?.rolesCount}
              subtext="View roles &rarr;"
              color="bg-warning-soft text-warning"
            />
            <HighlightMetricCard
              icon={<FiGrid />}
              title="Products"
              value={company.highlights?.productsCount}
              subtext="View products &rarr;"
              color="bg-purple-soft text-purple"
            />
            <HighlightMetricCard
              icon={<FiUsers />}
              title="Total Customers"
              value={company.highlights?.totalCustomers}
              subtext="View customers &rarr;"
              color="bg-cyan-soft text-cyan"
            />
          </div>
        </AppCard>
      </div>

      {/* Col 3: Status Tracking Information Module Panel */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        sx={sectionCardSx}
      >
        <SectionHeader
          title="Company Status"
          description="Lifecycle governance logs."
        />
        <div className="p-4 space-y-4">
          <StatusTrackingRow
            label="Status"
            value={
              <AppTag
                label="Active"
                colorVariant="success"
                variant="soft"
                rounded="md"
                sx={{ height: 20, fontSize: "10px" }}
              />
            }
          />
          <StatusTrackingRow
            label="Verified By Workspace"
            value={
              <span className="flex items-center gap-1 text-[11.5px] font-bold text-success">
                <FiCheckCircle /> Verified
              </span>
            }
          />
          <StatusTrackingRow
            label="Last Verified On"
            value="28 May 2024, 04:32 PM"
          />
          <StatusTrackingRow
            label="Created On"
            value={company.displayCreatedAt}
          />
          <StatusTrackingRow
            label="Last Updated"
            value="28 May 2024, 04:32 PM"
          />

          <div className="border-t border-border pt-3">
            <span className="block text-[11px] font-bold text-text-muted uppercase">
              Description
            </span>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-text-muted">
              MedPlus Healthcare Pvt. Ltd. is engaged in the distribution and
              retail of pharmaceutical products and healthcare solutions.
            </p>
          </div>
        </div>
        <div className="border-t border-border p-3 flex justify-center">
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            sx={{ width: "100%", height: 32, fontSize: "11px" }}
          >
            Edit Description
          </AppButton>
        </div>
      </AppCard>
    </div>

    {/* Bottom Activity Layout Split Strip Grid */}
    <div className="grid grid-cols-3 gap-4">
      {/* Left Bottom Mini-Table: Members Link Summary Panel */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        className="col-span-1"
        sx={sectionCardSx}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-[13px] font-bold text-text">
            Assigned Members{" "}
            <span className="text-[11px] font-normal text-text-muted">
              (From Workspace)
            </span>
          </span>
          <button
            type="button"
            className="text-[11px] font-bold text-primary hover:underline"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-border overflow-y-auto max-h-[300px]">
          {company.members?.slice(0, 5).map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-alt/50"
            >
              <AppStack direction="row" align="center" gap={0.8}>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[10px] font-bold text-primary uppercase">
                  {member.name.slice(0, 2)}
                </div>
                <div>
                  <span className="block text-[12px] font-bold text-text leading-tight">
                    {member.name}
                  </span>
                  <span className="block text-[10.5px] text-text-muted">
                    {member.department}
                  </span>
                </div>
              </AppStack>
              <AppTag
                label={member.role}
                size="small"
                variant="soft"
                rounded="md"
                colorVariant={member.tagColor}
                sx={{ height: 18, fontSize: "9.5px", fontWeight: 700 }}
              />
            </div>
          ))}
        </div>
      </AppCard>

      {/* Middle Bottom List: Activity Streams */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        className="col-span-1"
        sx={sectionCardSx}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-[13px] font-bold text-text">
            Recent Activity
          </span>
          <button
            type="button"
            className="text-[11px] font-bold text-primary hover:underline"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-border overflow-y-auto max-h-[300px] p-2 space-y-2">
          {company.activities?.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-surface-alt/40"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-[10px] text-success">
                <FiCheckCircle />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-medium text-text leading-snug">
                  {act.text}
                </p>
                <span className="block mt-0.5 text-[10px] text-text-muted">
                  by {act.user} &bull; {act.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AppCard>

      {/* Right Bottom List: Cloud Asset Documents Storage Panels */}
      <AppCard
        variant="default"
        rounded="lg"
        bordered
        padding="none"
        className="col-span-1"
        sx={sectionCardSx}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-[13px] font-bold text-text">
            Important Documents
          </span>
          <button
            type="button"
            className="text-[11px] font-bold text-primary hover:underline"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-border overflow-y-auto max-h-[300px]">
          {company.documents?.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-alt/50"
            >
              <AppStack
                direction="row"
                align="center"
                gap={0.8}
                sx={{ minWidth: 0 }}
              >
                <span className="text-[16px] text-primary shrink-0">
                  <FiFileText />
                </span>
                <div className="min-w-0">
                  <span className="block text-[12px] font-bold text-text truncate leading-tight">
                    {doc.name}
                  </span>
                  <span className="block text-[10.5px] text-text-muted">
                    {doc.uploadedAt}
                  </span>
                </div>
              </AppStack>
              <AppIconButton
                icon={<FiDownload />}
                size="small"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
              />
            </div>
          ))}
        </div>
      </AppCard>
    </div>

    {/* Base alert strip verification status marker */}
    <div className="flex items-center gap-2 rounded-lg border border-success-soft/30 bg-success-soft/10 p-3 text-[11.5px] font-semibold text-success">
      <FiCheckCircle className="text-[14px]" /> This company profile ledger
      index is fully validated and active across all mapped inventory pipelines.
    </div>
  </div>
);

/* ==========================================================================
   2. BRANCHES MANAGEMENT TAB PANEL
   ========================================================================== */
const BranchesTabSection = ({ company }) => {
  return (
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      padding="none"
      sx={sectionCardSx}
    >
      {/* Context Action Toolbar Header Rows */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <span className="block text-[13.5px] font-bold text-text">
            Company Branches
          </span>
          <span className="block text-[11px] text-text-muted">
            Manage all distribution terminals linked onto this corporate
            identity model.
          </span>
        </div>
        <AppStack direction="row" gap={1}>
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiDownload />}
            sx={{ height: 32, fontSize: "11.5px" }}
          >
            Export Metrics
          </AppButton>
          <AppButton
            variant="contained"
            colorVariant="primary"
            size="small"
            rounded="md"
            startIcon={<FiPlus />}
            sx={{ height: 32, fontSize: "11.5px", fontWeight: 700 }}
          >
            Add Branch
          </AppButton>
        </AppStack>
      </div>

      {/* Grid Summary Block widgets panel */}
      <div className="grid grid-cols-5 gap-3 border-b border-border bg-surface-alt/40 p-4">
        <StatWidgetCard
          label="Total Branches"
          value="6"
          description="All configured centers"
        />
        <StatWidgetCard
          label="Active Branches"
          value="6"
          description="Operational setups live"
        />
        <StatWidgetCard
          label="Inactive Branches"
          value="0"
          description="Suspended nodes locked"
        />
        <StatWidgetCard
          label="Cities Map Coordinates"
          value="4"
          description="Spatial reach density"
        />
        <StatWidgetCard
          label="States Represented"
          value="2"
          description="Regional index divisions"
        />
      </div>

      {/* Filters Search Layout Strip Panels */}
      <div className="border-b border-border p-3 flex items-center justify-between gap-4 bg-surface">
        <AppSearchInput
          placeholder="Search branches by identity keys or code prefixes..."
          size="small"
          rounded="md"
          variant="bordered"
          sx={{ maxW: 360 }}
        />
        <AppStack direction="row" gap={1}>
          <AppSelect
            value="all"
            options={[{ label: "Status: All", value: "all" }]}
            size="small"
            rounded="md"
            variant="bordered"
            sx={{ width: 120, height: 32 }}
          />
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiFilter />}
            sx={{ height: 32, fontSize: "11px" }}
          >
            Filters
          </AppButton>
        </AppStack>
      </div>

      {/* Grid Table Frame Sheets Component */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[950px]">
          <thead>
            <tr className="border-b border-border bg-surface-alt/70 text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <th className="px-4 py-3">Branch Name</th>
              <th className="px-4 py-3">Branch Code</th>
              <th className="px-4 py-3">Manager</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created On</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-[12px]">
            {company.branches?.map((branch) => (
              <tr
                key={branch._id}
                className="hover:bg-surface-alt/40 transition"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary text-[14px]">
                      <LuStore />
                    </span>
                    <div>
                      <span className="block font-bold text-text">
                        {branch.name}
                      </span>
                      <span className="block text-[10.5px] text-text-muted truncate max-w-[240px]">
                        {typeof branch.address === "string"
                          ? branch.address
                          : [branch.address?.addressLine1, branch.address?.city]
                              .filter(Boolean)
                              .join(", ") || "-"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-semibold text-text-muted">
                  {branch.code}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info-soft text-[9.5px] font-bold text-info uppercase">
                      {branch.managerName.slice(0, 2)}
                    </div>
                    <div>
                      <span className="block font-semibold text-text">
                        {branch.managerName}
                      </span>
                      <span className="block text-[10.5px] text-text-muted">
                        {branch.managerPhone}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="block font-medium text-text">
                    {branch.city}
                  </span>
                  <span className="block text-[10.5px] text-text-muted">
                    {branch.state}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-text-muted font-medium">
                  {branch.contactEmail}
                </td>
                <td className="px-4 py-3.5">
                  <AppStatusBadge
                    status={branch.status}
                    variant="soft"
                    rounded="md"
                    size="small"
                  />
                </td>
                <td className="px-4 py-3.5 text-text-muted font-medium">
                  {branch.createdAt}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <AppStack
                    direction="row"
                    align="center"
                    justify="flex-end"
                    gap={0.5}
                  >
                    <AppIconButton
                      icon={<FiEdit3 />}
                      size="small"
                      variant="ghost"
                      colorVariant="neutral"
                    />
                    <AppIconButton
                      icon={<FiMoreHorizontal />}
                      size="small"
                      variant="ghost"
                      colorVariant="neutral"
                    />
                  </AppStack>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Sheet Strip Pagination Widget */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-surface-alt/20">
        <span className="text-[11.5px] font-medium text-text-muted">
          Showing 1 to 6 of 6 entries
        </span>
        <AppStack direction="row" align="center" gap={0.5}>
          <AppIconButton
            icon={<FiChevronLeft />}
            size="small"
            variant="outlined"
            colorVariant="neutral"
            disabled
            rounded="md"
          />
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-md bg-primary px-1.5 text-[11px] font-bold text-text-inverse">
            1
          </span>
          <AppIconButton
            icon={<FiChevronRight />}
            size="small"
            variant="outlined"
            colorVariant="neutral"
            disabled
            rounded="md"
          />
        </AppStack>
      </div>
    </AppCard>
  );
};

/* ==========================================================================
   3. ACCOUNTABILITY MEMBERS LIST TAB MODULE PANEL
   ========================================================================== */
const MembersTabSection = ({ company }) => {
  return (
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
            Company Members
          </span>
          <span className="block text-[11px] text-text-muted">
            Manage administrative privileges assigned directly onto this
            enterprise framework.
          </span>
        </div>
        <AppStack direction="row" gap={1}>
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiDownload />}
            sx={{ height: 32, fontSize: "11.5px" }}
          >
            Export Members
          </AppButton>
          <AppButton
            variant="contained"
            colorVariant="primary"
            size="small"
            rounded="md"
            startIcon={<FiPlus />}
            sx={{ height: 32, fontSize: "11.5px", fontWeight: 700 }}
          >
            Add Member
          </AppButton>
        </AppStack>
      </div>

      <div className="grid grid-cols-4 gap-3 border-b border-border bg-surface-alt/40 p-4">
        <StatWidgetCard
          label="Total Members"
          value="12"
          description="Registered inside profiles"
        />
        <StatWidgetCard
          label="Active Members"
          value="10"
          description="Currently alive nodes"
        />
        <StatWidgetCard
          label="Pending Invitations"
          value="2"
          description="Awaiting identity claims"
        />
        <StatWidgetCard
          label="Inactive Members"
          value="0"
          description="Compliance pipeline locks"
        />
      </div>

      <div className="border-b border-border p-3 flex items-center justify-between bg-surface gap-4">
        <AppSearchInput
          placeholder="Search members by names, email metrics, or department indexes..."
          size="small"
          rounded="md"
          variant="bordered"
          sx={{ maxW: 360 }}
        />
        <AppStack direction="row" gap={1}>
          <AppSelect
            value="all"
            options={[{ label: "Status: All", value: "all" }]}
            size="small"
            rounded="md"
            variant="bordered"
            sx={{ width: 110 }}
          />
          <AppSelect
            value="all"
            options={[{ label: "Roles: All", value: "all" }]}
            size="small"
            rounded="md"
            variant="bordered"
            sx={{ width: 110 }}
          />
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiFilter />}
            sx={{ height: 32, fontSize: "11px" }}
          >
            Filters
          </AppButton>
        </AppStack>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[950px]">
          <thead>
            <tr className="border-b border-border bg-surface-alt/70 text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Joined On</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Active</th>
              <th className="px-4 py-3">Added By</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-[12px]">
            {company.members?.map((member) => (
              <tr
                key={member._id}
                className="hover:bg-surface-alt/40 transition"
              >
                <td className="px-4 py-3">
                  <AppStack direction="row" align="center" gap={0.8}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-[10px] font-bold text-primary uppercase">
                      {member.name.slice(0, 2)}
                    </div>
                    <div>
                      <span className="block font-bold text-text">
                        {member.name}
                      </span>
                      <span className="block text-[10.5px] text-text-muted font-medium">
                        {member.email}
                      </span>
                    </div>
                  </AppStack>
                </td>
                <td className="px-4 py-3">
                  <AppTag
                    label={member.role}
                    size="small"
                    variant="soft"
                    rounded="md"
                    colorVariant={member.tagColor}
                    sx={{ height: 20, fontSize: "10px", fontWeight: 700 }}
                  />
                </td>
                <td className="px-4 py-3 text-text font-semibold">
                  {member.department}
                </td>
                <td className="px-4 py-3 text-text-muted font-medium">
                  {member.joinedOn}
                </td>
                <td className="px-4 py-3">
                  <AppStatusBadge
                    status={member.status}
                    variant="soft"
                    rounded="md"
                    size="small"
                  />
                </td>
                <td className="px-4 py-3 text-text font-medium">
                  {member.lastActive}
                </td>
                <td className="px-4 py-3 text-text-muted font-semibold">
                  {member.addedBy}
                </td>
                <td className="px-4 py-3 text-right">
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
};

/* ==========================================================================
   4. CLOUD FILE STORAGE DOCUMENTS TAB SECTIONS
   ========================================================================== */
const DocumentsTabSection = ({ company }) => (
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
          Corporate Compliance Asset Bin
        </span>
        <span className="block text-[11px] text-text-muted">
          Repository catalog housing legal certifications and encryption
          documents.
        </span>
      </div>
      <AppButton
        variant="contained"
        colorVariant="primary"
        size="small"
        rounded="md"
        startIcon={<FiPlus />}
        sx={{ height: 32, fontSize: "11.5px", fontWeight: 700 }}
      >
        Upload Document
      </AppButton>
    </div>
    <div className="p-4 grid grid-cols-4 gap-4">
      {company.documents?.map((doc) => (
        <AppCard
          key={doc.id}
          variant="default"
          rounded="md"
          bordered
          sx={{
            p: 3,
            bg: "var(--app-color-surface)",
            transition: "hover:shadow-md cursor-pointer",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[26px] text-primary">
              <FiFileText />
            </span>
            <AppIconButton
              icon={<FiDownload />}
              size="small"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
            />
          </div>
          <span className="block mt-4 text-[12.5px] font-bold text-text truncate">
            {doc.name}
          </span>
          <span className="block mt-0.5 text-[10.5px] font-medium text-text-muted">
            {doc.size} &bull; {doc.uploadedAt}
          </span>
        </AppCard>
      ))}
    </div>
  </AppCard>
);

/* ==========================================================================
   5. SETTINGS MODULE TAB COMPONENT PANELS
   ========================================================================== */
const SettingsTabSection = ({ company }) => (
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
        title="Compliance System Parameters"
        description="Override validation parameters."
      />
      <div className="p-4 grid grid-cols-2 gap-4">
        <SettingsKeyValueDisplay
          label="Default Regional Currency Mapping"
          value="INR (₹) - Indian Rupee"
        />
        <SettingsKeyValueDisplay
          label="Invoicing Tax Model Architecture"
          value="Unified CGST + SGST Pipeline Rules"
        />
        <SettingsKeyValueDisplay
          label="Allow Backdated Ledger Mutations"
          value="Enabled (Audit Logs Mandated)"
        />
        <SettingsKeyValueDisplay
          label="Negative Product Inventory Balances"
          value="Prevented (Stall Transactions Enabled)"
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
      <SectionHeader
        title="Danger Zones"
        description="Irreversible model lifecycle changes."
      />
      <div className="p-4 space-y-3">
        <AppButton
          variant="contained"
          colorVariant="danger"
          rounded="md"
          size="small"
          sx={{ width: "100%", height: 36, fontSize: "12px", fontWeight: 700 }}
        >
          Suspend Workspace Branch Linkage
        </AppButton>
        <AppButton
          variant="outlined"
          colorVariant="danger"
          rounded="md"
          size="small"
          sx={{ width: "100%", height: 36, fontSize: "12px", fontWeight: 700 }}
        >
          Delete Corporate Log Record Archive
        </AppButton>
      </div>
    </AppCard>
  </div>
);

/* ==========================================================================
   6. GLOBAL AUDIT ACTIVITY TRACKING TRAIL PANELS
   ========================================================================== */
const ActivityLogTabSection = ({ company }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    padding="none"
    sx={sectionCardSx}
  >
    <SectionHeader
      title="Global Ledger Mutation Streams"
      description="Cryptographic transparency audit verification pipeline logs."
    />
    <div className="p-4 space-y-4 max-w-xl">
      {company.activities?.map((act) => (
        <div
          key={act.id}
          className="flex gap-4 items-start border-l-2 border-border pl-4 relative before:absolute before:h-2 before:w-2 before:bg-primary before:rounded-full before:-left-[5px] before:top-1"
        >
          <div>
            <span className="block text-[12.5px] font-bold text-text leading-tight">
              {act.text}
            </span>
            <span className="block mt-0.5 text-[11px] text-text-muted">
              Mutated by context token{" "}
              <span className="font-semibold text-text">{act.user}</span> &bull;{" "}
              {act.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  </AppCard>
);

/* ==========================================================================
   ATOM UTILITY UI REUSABLE MODULE COMPONENTS
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

const InfoGridRow = ({ icon, label, value, link = false }) => (
  <div className="grid grid-cols-[160px_1fr] items-start gap-4 text-[12px] py-0.5">
    <div className="flex items-center gap-2 font-bold text-text-muted">
      <span className="text-[14px] text-primary/80 shrink-0">{icon}</span>
      <span>{label}</span>
    </div>
    <div
      className={`font-bold text-text truncate max-w-[500px] ${link ? "text-primary cursor-pointer hover:underline flex items-center gap-1" : ""}`}
    >
      {value} {link && <FiExternalLink className="text-[10px]" />}
    </div>
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
   STYLE OBJECT MAPS (THEME DESIGN PRIMARY primitivetokens)
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

export default CompanyDetailsDesktopPage;
