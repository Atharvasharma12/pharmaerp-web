// src/features/company/pages/mobile/CompanyDetailsMobilePage.jsx

import { useMemo, useState } from "react";
import {
  FiBriefcase,
  FiArrowLeft,
  FiMoreHorizontal,
  FiCalendar,
  FiUser,
  FiClock,
  FiFileText,
  FiShield,
  FiChevronRight,
  FiInfo,
  FiMail,
  FiPhone,
  FiGlobe,
  FiExternalLink,
  FiMapPin,
  FiGrid,
  FiUsers,
  FiCheckCircle,
  FiChevronDown,
  FiSettings,
  FiRefreshCw,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppMenu,
  AppStack,
  AppStatusBadge,
  AppText,
  AppPageLoader,
  AppErrorState,
  AppTag,
} from "@/components";

const CompanyDetailsMobilePage = ({
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
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  if (isLoading && !company) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppPageLoader text="Retrieving platform entity coordinates..." />
      </AppBox>
    );
  }

  if (hasError && !company) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppErrorState
          title="Profile Extraction Failure"
          description={
            error || "The server could not process the company identifier."
          }
          actionText="Retry Pipeline"
          onRetry={handleRefresh}
          size="medium"
        />
      </AppBox>
    );
  }

  const safeCompany = company || {};

  // Compact Swipeable Mobile Tabs Definition Matrix
  const mobileTabs = [
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
  ];

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* --- DENSE HEADER NAVIGATION JUMBOTRON --- */}
        <AppBox sx={jumbotronHeaderSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
            sx={{ mb: 1.5 }}
          >
            <AppIconButton
              icon={<FiArrowLeft />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleBack}
              sx={backBtnSx}
            />
            <AppStack direction="row" align="center" gap={0.5}>
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleEdit}
                sx={headerActionBtnSx}
              >
                Edit
              </AppButton>
              <AppMenu
                trigger={
                  <AppIconButton
                    icon={<FiMoreHorizontal />}
                    size="small"
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    sx={moreActionBtnSx}
                  />
                }
                triggerProps={{ onClick: (e) => e.stopPropagation() }}
                items={[
                  {
                    id: "settings",
                    label: "Module Settings",
                    icon: <FiSettings />,
                    onClick: handleSettings,
                  },
                  {
                    id: "refresh",
                    label: "Force Sync State",
                    icon: <FiRefreshCw />,
                    onClick: handleRefresh,
                  },
                ]}
                dense
                minWidth={160}
              />
            </AppStack>
          </AppStack>

          <AppStack direction="row" align="center" gap={1}>
            <AppBox sx={corporateIconFrameSx}>
              <HiOutlineBuildingOffice2 />
            </AppBox>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppStack direction="row" align="center" gap={0.5} wrap="wrap">
                <AppHeading level={1} weight={800} sx={companyTitleTextSx}>
                  {safeCompany.displayName}
                </AppHeading>
                <AppStatusBadge
                  status={safeCompany.status || "active"}
                  variant="soft"
                  rounded="md"
                  size="small"
                  sx={statusBadgeOverrideSx}
                />
              </AppStack>
              <AppText variant="body2" sx={companyMetadataTextSx}>
                {safeCompany.displayType} &bull; CIN: U24233DL2018PTC341234
              </AppText>
            </AppBox>
          </AppStack>

          {/* Chronological Summary Meta Tags Ribbon */}
          <AppBox sx={metaPillsRibbonSx}>
            <span className="flex items-center gap-1">
              <FiCalendar className="text-primary" /> Created on{" "}
              {safeCompany.displayCreatedAt}
            </span>
            <span className="flex items-center gap-1">
              <FiUser className="text-success" /> Owned by{" "}
              {safeCompany.displayOwnerName}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="text-warning" /> Member since 15 Mar 2024
            </span>
          </AppBox>
        </AppBox>

        {/* --- FLUSH HIGHLIGHTED INTERACTIVE SCROLL NAVIGATION TABS --- */}
        <AppBox sx={tabsLineTrackSx}>
          {mobileTabs.map((tab) => {
            const isTabActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-3 pb-2 text-[12px] font-bold transition whitespace-nowrap outline-none ${
                  isTabActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </AppBox>

        {/* --- HIGH-DENSITY CONDITIONAL SUBSECTION MODULE ROUTERS --- */}
        <AppBox sx={mainBodyScrollContentWrapperSx}>
          {currentTab === "overview" && (
            <AppStack direction="column" gap={1.25}>
              {/* Card Section A: Static Profile Informational Ledger */}
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={moduleCardContainerSx}
              >
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                    Company Information
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2, spaceY: 3.5 }}>
                  <CompactDataInfoRow
                    icon={<HiOutlineBuildingOffice2 />}
                    label="Company Name"
                    value={safeCompany.displayName}
                  />
                  <CompactDataInfoRow
                    icon={<FiBriefcase />}
                    label="Company Type"
                    value={safeCompany.displayType}
                  />
                  <CompactDataInfoRow
                    icon={<FiUser />}
                    label="Owner"
                    value={safeCompany.displayOwnerName}
                  />
                  <CompactDataInfoRow
                    icon={<FiGrid />}
                    label="PAN Number"
                    value={safeCompany.displayPan}
                  />
                  <CompactDataInfoRow
                    icon={<FiFileText />}
                    label="GST Number"
                    value={safeCompany.displayGstin}
                  />
                  <CompactDataInfoRow
                    icon={<FiMail />}
                    label="Email"
                    value={safeCompany.displayEmail}
                  />
                  <CompactDataInfoRow
                    icon={<FiPhone />}
                    label="Phone"
                    value={safeCompany.displayPhone}
                  />
                  <CompactDataInfoRow
                    icon={<FiGlobe />}
                    label="Website"
                    value="www.medplus.com"
                    isLink
                  />
                  <CompactDataInfoRow
                    icon={<FiShield />}
                    label="Industry Type"
                    value="Healthcare & Wellness"
                  />
                  <CompactDataInfoRow
                    icon={<FiCalendar />}
                    label="Incorporation Date"
                    value={safeCompany.displayCreatedAt}
                  />
                  <CompactDataInfoRow
                    icon={<FiMapPin />}
                    label="Registered Address"
                    value={safeCompany.displayAddress}
                  />
                </AppBox>
                <AppBox sx={cardFooterActionTriggerSx}>
                  <button
                    type="button"
                    className="text-[11.5px] font-bold text-primary flex items-center gap-0.5"
                  >
                    View Full Details <FiChevronRight className="text-[12px]" />
                  </button>
                </AppBox>
              </AppCard>

              {/* Card Section B: Compact High-Density Grid Summary Parameters */}
              <AppBox sx={highlightsHeaderSpacingBoxSx}>
                <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                  Company Highlights
                </AppHeading>
              </AppBox>
              <div className="grid grid-cols-2 gap-2">
                <CompactHighlightCard
                  icon={<LuStore />}
                  title="Total Branches"
                  value={safeCompany.highlights?.totalBranches}
                  color="primary"
                />
                <CompactHighlightCard
                  icon={<FiUsers />}
                  title="Total Members"
                  value={safeCompany.highlights?.totalMembers}
                  color="info"
                />
                <CompactHighlightCard
                  icon={<FiCheckCircle />}
                  title="Active Members"
                  value={safeCompany.highlights?.activeMembers}
                  color="success"
                />
                <CompactHighlightCard
                  icon={<FiShield />}
                  title="Roles"
                  value={safeCompany.highlights?.rolesCount}
                  color="warning"
                />
                <CompactHighlightCard
                  icon={<FiGrid />}
                  title="Products"
                  value={safeCompany.highlights?.productsCount}
                  color="purple"
                />
                <CompactHighlightCard
                  icon={<FiUsers />}
                  title="Total Customers"
                  value={safeCompany.highlights?.totalCustomers}
                  color="cyan"
                />
              </div>

              {/* Card Section C: Compliance Lifecycles Tracking Monitor */}
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={moduleCardContainerSx}
              >
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                    Company Status
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2, spaceY: 3 }}>
                  <CompactTrackingRow
                    label="Status"
                    value={
                      <AppTag
                        label="Active"
                        colorVariant="success"
                        variant="soft"
                        rounded="sm"
                        sx={inlineStatusPillSx}
                      />
                    }
                  />
                  <CompactTrackingRow
                    label="Verified By Workspace"
                    value={
                      <span className="flex items-center gap-0.5 text-[11px] font-bold text-success">
                        <FiCheckCircle /> Verified
                      </span>
                    }
                  />
                  <CompactTrackingRow
                    label="Last Verified On"
                    value="28 May 2024, 04:32 PM"
                  />
                  <CompactTrackingRow
                    label="Created On"
                    value={safeCompany.displayCreatedAt}
                  />
                  <CompactTrackingRow
                    label="Last Updated"
                    value="28 May 2024, 04:32 PM"
                  />

                  <div className="w-full h-[1px] bg-divider my-2" />

                  <AppBox sx={{ mt: 1 }}>
                    <AppText
                      variant="body2"
                      weight={750}
                      sx={descriptionHeadingTextSx}
                    >
                      Description
                    </AppText>
                    <p
                      className={`mt-1 text-[11px] leading-relaxed text-text-muted ${isDescExpanded ? "" : "line-clamp-2"}`}
                    >
                      MedPlus Healthcare Pvt. Ltd. is engaged in the
                      distribution and retail of pharmaceutical products and
                      healthcare solutions across regional branch
                      infrastructures.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="mt-1 flex items-center gap-0.5 text-[10.5px] font-bold text-primary outline-none"
                    >
                      {isDescExpanded ? "Read Less" : "Read More"}{" "}
                      <FiChevronDown
                        className={`text-[11px] transition-transform ${isDescExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </AppBox>
                </AppBox>
              </AppCard>
            </AppStack>
          )}

          {/* Branch Section Tab View Fallbacks */}
          {currentTab === "branches" && (
            <AppCard
              variant="default"
              rounded="md"
              bordered
              padding="md"
              sx={emptyCardContainerSx}
            >
              <AppStack
                direction="column"
                align="center"
                justify="center"
                gap={1}
                sx={{ py: 3, width: "100%" }}
              >
                <LuStore className="text-[28px] text-text-muted/60" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{ m: 0, fontSize: "13px", width: "100%" }}
                >
                  Branches Directory Section
                </AppHeading>
                <AppText variant="body2" align="center" sx={tabFallbackDescSx}>
                  Review granular inventory metrics via central branch dashboard
                  links.
                </AppText>
              </AppStack>
            </AppCard>
          )}

          {/* Members Section Tab View Fallbacks */}
          {currentTab === "members" && (
            <AppCard
              variant="default"
              rounded="md"
              bordered
              padding="md"
              sx={emptyCardContainerSx}
            >
              <AppStack
                direction="column"
                align="center"
                justify="center"
                gap={1}
                sx={{ py: 3, width: "100%" }}
              >
                <FiUsers className="text-[28px] text-text-muted/60" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{ m: 0, fontSize: "13px", width: "100%" }}
                >
                  Workspace Rosters
                </AppHeading>
                <AppText variant="body2" align="center" sx={tabFallbackDescSx}>
                  Account authorizations are managed via security panel
                  parameters.
                </AppText>
              </AppStack>
            </AppCard>
          )}

          {/* Documents Section Tab View Fallbacks */}
          {currentTab === "documents" && (
            <AppCard
              variant="default"
              rounded="md"
              bordered
              padding="md"
              sx={emptyCardContainerSx}
            >
              <AppStack
                direction="column"
                align="center"
                justify="center"
                gap={1}
                sx={{ py: 3, width: "100%" }}
              >
                <FiFileText className="text-[28px] text-text-muted/60" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{ m: 0, fontSize: "13px", width: "100%" }}
                >
                  Compliance Vault
                </AppHeading>
                <AppText variant="body2" align="center" sx={tabFallbackDescSx}>
                  Secure cloud storage attachments mapped safely inside
                  corporate ledger records.
                </AppText>
              </AppStack>
            </AppCard>
          )}
        </AppBox>
      </AppBox>
    </section>
  );
};

// Reusable Atomic Presentational Rows mapping grid keys efficiently
const CompactDataInfoRow = ({ icon, label, value, isLink = false }) => (
  <div className="grid grid-cols-[115px_1fr] gap-2 items-start py-0.5 text-[11px]">
    <div className="flex items-center gap-1.5 font-bold text-text-muted">
      <span className="text-[12.5px] text-primary shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
    <div
      className={`font-semibold text-text break-words ${isLink ? "text-primary flex items-center gap-0.5" : ""}`}
    >
      {value || "-"} {isLink && <FiExternalLink className="text-[9.5px]" />}
    </div>
  </div>
);

const CompactHighlightCard = ({ icon, title, value, color }) => (
  <AppCard
    variant="default"
    rounded="md"
    bordered
    shadow="none"
    padding="none"
    sx={highlightGridCardSx}
  >
    <AppStack direction="row" align="center" gap={0.75}>
      <AppBox
        sx={{
          ...highlightIconBoxFrameSx,
          bgcolor: `var(--app-color-${color}-soft)`,
          color: `var(--app-color-${color})`,
        }}
      >
        {icon}
      </AppBox>
      <AppBox sx={{ minWidth: 0, flex: 1 }}>
        <AppText variant="body2" sx={highlightCardTitleSx}>
          {title}
        </AppText>
        <AppHeading level={3} weight={800} sx={highlightCardValueSx}>
          {value || "0"}
        </AppHeading>
      </AppBox>
    </AppStack>
    <AppStack
      direction="row"
      align="center"
      justify="space-between"
      sx={highlightCardFooterSx}
    >
      <AppText variant="body2" sx={highlightFooterLabelTextSx}>
        View details
      </AppText>
      <FiChevronRight className="text-[9.5px]" />
    </AppStack>
  </AppCard>
);

const CompactTrackingRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-2 text-[11px]">
    <AppText
      variant="body2"
      weight={700}
      sx={{ color: "var(--app-color-text-muted)" }}
    >
      {label}
    </AppText>
    <div className="font-semibold text-text text-right">{value}</div>
  </div>
);

/* Architectural Style Definitions Dictionary */
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const loadingErrorWrapperSx = {
  width: "100%",
  minHeight: 320,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 1.5,
};

const jumbotronHeaderSx = {
  pt: 1.5,
  pb: 1.25,
  px: 0.5,
};

const backBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const headerActionBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 750,
  px: 1.3,
  borderColor: "var(--app-color-border-strong)",
  color: "var(--app-color-text)",
};

const moreActionBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border-strong)",
};

const corporateIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: "10px",
  fontSize: "22px",
  flexShrink: 0,
  bgcolor: "var(--app-color-success-soft)",
  color: "var(--app-color-success)",
};

const companyTitleTextSx = {
  m: 0,
  fontSize: "17.5px",
  lineHeight: 1.2,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const statusBadgeOverrideSx = {
  height: 16,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 0.85,
  textTransform: "capitalize",
};

const companyMetadataTextSx = {
  mt: 0.15,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const metaPillsRibbonSx = {
  mt: 1.5,
  pt: 1.1,
  borderTop: "1px dashed var(--app-color-border)",
  display: "flex",
  flexDirection: "column",
  gap: 0.4,
  fontSize: "10.5px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const tabsLineTrackSx = {
  display: "flex",
  gap: 0.75,
  borderBottom: "1px solid var(--app-color-divider)",
  px: 0.5,
  overflowX: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
    width: 0,
    height: 0,
  },
};

const mainBodyScrollContentWrapperSx = {
  px: 0.5,
  py: 1.25,
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 20%, transparent)",
};

const moduleCardContainerSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const cardHeaderBannerSx = {
  px: 1.2,
  py: 0.85,
  borderBottom: "1px solid var(--app-color-divider)",
  bgcolor: "var(--app-color-surface-alt)",
};

const cardHeaderTitleSx = {
  m: 0,
  fontSize: "12px",
  letterSpacing: "-0.1px",
  color: "var(--app-color-text)",
};

const cardFooterActionTriggerSx = {
  borderTop: "1px solid var(--app-color-divider)",
  py: 0.75,
  display: "flex",
  justifyContent: "center",
};

const highlightsHeaderSpacingBoxSx = {
  pt: 0.5,
  pb: 0.65,
};

const highlightGridCardSx = {
  p: 0.85,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};

const highlightIconBoxFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "6px",
  fontSize: "13px",
  flexShrink: 0,
};

const highlightCardTitleSx = {
  fontSize: "9.5px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
  lineHeight: 1,
};

const highlightCardValueSx = {
  m: 0,
  mt: 0.15,
  fontSize: "14.5px",
  lineHeight: 1,
  color: "var(--app-color-text)",
};

const highlightCardFooterSx = {
  mt: 1,
  pt: 0.6,
  borderTop:
    "1px solid color-mix(in_srgb, var(--app-color-divider) 60%, transparent)",
  color: "var(--app-color-text-muted)",
};

const highlightFooterLabelTextSx = {
  fontSize: "9px",
  fontWeight: 500,
};

const inlineStatusPillSx = {
  height: 16,
  fontSize: "8.5px",
  px: 0.85,
};

const descriptionHeadingTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text)",
  textTransform: "uppercase",
  letterSpacing: "0.2px",
};

const emptyCardContainerSx = {
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  width: "100%",
};

const tabFallbackDescSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  px: 2,
  textAlign: "center",
};

export default CompanyDetailsMobilePage;
