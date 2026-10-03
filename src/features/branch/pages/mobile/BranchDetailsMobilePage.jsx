// src/features/branch/pages/mobile/BranchDetailsMobilePage.jsx

import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiEdit3,
  FiMoreHorizontal,
  FiCalendar,
  FiUser,
  FiClock,
  FiFileText,
  FiShield,
  FiChevronRight,
  FiChevronDown,
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
  FiUsers,
  FiCheckCircle,
  FiSettings,
  FiRefreshCw,
  FiGrid,
} from "react-icons/fi";
import { LuStore } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa"; // 🔥 Fixed: Removed FaWhitespace export artifact

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppMenu,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
  AppPageLoader,
  AppErrorState,
} from "@/components";

const statusColorMap = {
  active: "success",
  inactive: "neutral",
  suspended: "danger",
};

const BranchDetailsMobilePage = ({
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
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);

  if (isLoading && !branch) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppPageLoader text="Extracting branch node registry data..." />
      </AppBox>
    );
  }

  if (hasError && !branch) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppErrorState
          title="Location Matrix Extraction Failure"
          description={
            error ||
            "The service registry failed to unpack the branch entity token."
          }
          actionText="Re-verify Pipeline"
          onRetry={handleRefresh}
          size="medium"
        />
      </AppBox>
    );
  }

  const safeBranch = branch || {};

  // Compact swipeable navigation layout tabs configuration matrix
  const mobileTabs = [
    { value: "overview", label: "Overview" },
    { value: "staff", label: `Staff (${safeBranch.staff?.length || 0})` },
    { value: "stock", label: "Stock" },
    { value: "licenses", label: "Licenses" },
  ];

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* --- MOBILE COMPACT HEADER JUMBOTRON LINK --- */}
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
                Configure
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
                    id: "sync",
                    label: "Sync Inventory",
                    icon: <FiRefreshCw />,
                    onClick: handleRefresh,
                  },
                  {
                    id: "report",
                    label: "EOD Report",
                    icon: <FiFileText />,
                    onClick: () => {},
                  },
                ]}
                dense
                minWidth={160}
              />
            </AppStack>
          </AppStack>

          <AppStack direction="row" align="center" gap={1}>
            <AppBox sx={branchIconFrameSx}>
              <LuStore />
            </AppBox>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppStack direction="row" align="center" gap={0.5} wrap="wrap">
                <AppHeading level={2} weight={800} sx={branchTitleTextSx}>
                  {safeBranch.name}
                </AppHeading>
                {safeBranch.isPrimary && (
                  <AppTag
                    label="Primary Hub"
                    variant="contained"
                    colorVariant="primary"
                    rounded="sm"
                    sx={hubTagOverrideSx}
                  />
                )}
                <AppStatusBadge
                  status={safeBranch.status || "active"}
                  variant="soft"
                  rounded="md"
                  size="small"
                  sx={statusBadgeOverrideSx}
                />
              </AppStack>
              <AppText variant="body2" sx={branchMetadataTextSx}>
                {safeBranch.displayType} &bull; Code:{" "}
                {safeBranch.displayTypeCode}
              </AppText>
            </AppBox>
          </AppStack>

          {/* Chronological Summary Metadata Tag Strip */}
          <AppBox sx={metaPillsRibbonSx}>
            <span className="flex items-center gap-1.5">
              <FiCalendar className="text-primary" /> Active Since{" "}
              {safeBranch.displayCreatedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <FiUser className="text-success" /> Pharmacist-in-Charge:{" "}
              {safeBranch.displayPharmacistName}
            </span>
            <span className="flex items-center gap-1.5">
              <FiActivity className="text-warning" /> Real-time Calculation
              Online
            </span>
          </AppBox>
        </AppBox>

        {/* --- FLUSH HIGHLIGHTED HORIZONTAL SLIDER TABS --- */}
        <AppBox sx={tabsLineTrackSx}>
          {mobileTabs.map((tab) => {
            const isTabActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-3.5 pb-2 text-[12px] font-bold transition whitespace-nowrap outline-none ${
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

        {/* --- HIGH-DENSITY BODY SEGMENT INTERFACES --- */}
        <AppBox sx={mainBodyScrollContentWrapperSx}>
          {currentTab === "overview" && (
            <AppStack direction="column" gap={1.25}>
              {/* Card Section A: Static Parameter Properties Ledger */}
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={moduleCardContainerSx}
              >
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={3} weight={800} sx={cardHeaderTitleSx}>
                    Terminal Location Parameters
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2, spaceY: 3.5 }}>
                  <CompactDataInfoRow
                    icon={<LuStore />}
                    label="Branch Name"
                    value={safeBranch.displayName}
                  />
                  <CompactDataInfoRow
                    icon={<FiLayers />}
                    label="System Type"
                    value={safeBranch.displayType}
                  />
                  <CompactDataInfoRow
                    icon={<FiGrid />}
                    label="Unique Code"
                    value={safeBranch.displayTypeCode}
                  />
                  <CompactDataInfoRow
                    icon={<FiMail />}
                    label="Operational Email"
                    value={safeBranch.displayEmail}
                  />
                  <CompactDataInfoRow
                    icon={<FiPhone />}
                    label="Primary Landline"
                    value={safeBranch.displayPhone}
                  />
                  {safeBranch.displayWhatsapp && (
                    <CompactDataInfoRow
                      icon={<FaWhatsapp className="text-emerald-500" />}
                      label="WhatsApp Desk"
                      value={safeBranch.displayWhatsapp}
                    />
                  )}
                  <CompactDataInfoRow
                    icon={<FiFileText />}
                    label="Drug License Node"
                    value={safeBranch.displayDrugLicense}
                  />
                  <CompactDataInfoRow
                    icon={<FiUser />}
                    label="Pharmacist-In-Charge"
                    value={safeBranch.displayPharmacistName}
                  />
                  <CompactDataInfoRow
                    icon={<FiCalendar />}
                    label="License Verified"
                    value={safeBranch.displayLicenseExpiry}
                  />
                  <CompactDataInfoRow
                    icon={<FiMapPin />}
                    label="Shipping Address"
                    value={safeBranch.displayAddress}
                  />
                </AppBox>
                <AppBox sx={cardFooterActionTriggerSx}>
                  <button
                    type="button"
                    className="text-[11.5px] font-bold text-primary flex items-center gap-0.5"
                  >
                    Inspect Full Registration Ledger{" "}
                    <FiChevronRight className="text-[12px]" />
                  </button>
                </AppBox>
              </AppCard>

              {/* Card Section B: Compact Real-Time Telemetry Performance Widgets */}
              <AppBox sx={highlightsHeaderSpacingBoxSx}>
                <AppHeading level={3} weight={800} sx={cardHeaderTitleSx}>
                  Terminal Performance Live Summary
                </AppHeading>
              </AppBox>
              <div className="grid grid-cols-2 gap-2">
                <CompactHighlightCard
                  icon={<FiTrendingUp />}
                  title="Sales Today"
                  value={safeBranch.highlights?.totalSalesToday}
                  color="success"
                />
                <CompactHighlightCard
                  icon={<FiFileText />}
                  title="Active Invoices"
                  value={safeBranch.highlights?.activeInvoicesCount}
                  color="primary"
                />
                <CompactHighlightCard
                  icon={<FiLayers />}
                  title="Stock Items"
                  value={safeBranch.highlights?.stockItemsCount}
                  color="purple"
                />
                <CompactHighlightCard
                  icon={<FiAlertTriangle />}
                  title="Stock Alerts"
                  value={safeBranch.highlights?.lowStockAlerts}
                  color="error"
                />
              </div>

              {/* Card Section C: Compliance Certifications Monitor */}
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={moduleCardContainerSx}
              >
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={3} weight={800} sx={cardHeaderTitleSx}>
                    Compliance Parameters
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2, spaceY: 3 }}>
                  <CompactTrackingRow
                    label="Node Status"
                    value={
                      <AppTag
                        label="Active Line"
                        colorVariant="success"
                        variant="soft"
                        rounded="sm"
                        sx={inlineStatusPillSx}
                      />
                    }
                  />
                  <CompactTrackingRow
                    label="Pharmacist Bonded"
                    value={
                      <span className="flex items-center gap-0.5 text-[11px] font-bold text-success">
                        <FiCheckCircle /> Verified
                      </span>
                    }
                  />
                  <CompactTrackingRow
                    label="FSSAI Index"
                    value={safeBranch.displayFssai || "10024011000234"}
                  />
                  <CompactTrackingRow
                    label="Incorporation Date"
                    value={safeBranch.displayCreatedAt}
                  />

                  <div className="w-full h-[1px] bg-divider my-2" />

                  <AppBox sx={{ mt: 1 }}>
                    <AppText
                      variant="body2"
                      weight={750}
                      sx={regulatoryNoteHeadingTextSx}
                    >
                      Regulatory Note
                    </AppText>
                    <p
                      className={`mt-1 text-[11px] leading-relaxed text-text-muted ${isNoteExpanded ? "" : "line-clamp-2"}`}
                    >
                      This terminal site location is strictly audited and
                      certified for automated real-time stock calculation,
                      unified invoicing execution layers, and localized
                      pharmaceutical batch compliance management tracking
                      schemas.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                      className="mt-1 flex items-center gap-0.5 text-[10.5px] font-bold text-primary outline-none"
                    >
                      {isNoteExpanded ? "Read Less" : "Read More"}{" "}
                      <FiChevronDown
                        className={`text-[11px] transition-transform ${isNoteExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </AppBox>
                </AppBox>
              </AppCard>
            </AppStack>
          )}

          {/* Staff Roster Tab Section Fallback Component */}
          {currentTab === "staff" && (
            <AppCard
              variant="default"
              rounded="md"
              bordered
              shadow="none"
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
                  Assigned Operational Staff Desk
                </AppHeading>
                <AppText variant="body2" align="center" sx={tabFallbackDescSx}>
                  Verify location privilege profiles and shift rosters allocated
                  inside this terminal cell.
                </AppText>
              </AppStack>
            </AppCard>
          )}

          {/* Stock Analytics Tab Section Fallback Component */}
          {currentTab === "stock" && (
            <AppCard
              variant="default"
              rounded="md"
              bordered
              shadow="none"
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
                <FiPackage className="text-[28px] text-text-muted/60" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{ m: 0, fontSize: "13px", width: "100%" }}
                >
                  Real-time Inventory Monitor
                </AppHeading>
                <AppText variant="body2" align="center" sx={tabFallbackDescSx}>
                  Telemetry metrics parsing pipelines are actively tracking
                  batch numbers and low safe-point parameters.
                </AppText>
              </AppStack>
            </AppCard>
          )}

          {/* Regulatory Licenses Tab Section Fallback Component */}
          {currentTab === "licenses" && (
            <AppCard
              variant="default"
              rounded="md"
              bordered
              shadow="none"
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
                <FiShield className="text-[28px] text-text-muted/60" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{ m: 0, fontSize: "13px", width: "100%" }}
                >
                  Drug Compliance Licenses
                </AppHeading>
                <AppText variant="body2" align="center" sx={tabFallbackDescSx}>
                  Inspect active retail drug certification frameworks and valid
                  oversight signatures.
                </AppText>
              </AppStack>
            </AppCard>
          )}
        </AppBox>
      </AppBox>
    </section>
  );
};

// Reusable Atomic Information Rows mapping layout schema fields
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

// High-Density Metric Grid Blocks
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
        Sales register
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

const branchIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: "10px",
  fontSize: "22px",
  flexShrink: 0,
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
};

const branchTitleTextSx = {
  m: 0,
  fontSize: "17.5px",
  lineHeight: 1.2,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const hubTagOverrideSx = {
  height: 16,
  fontSize: "8.5px",
  fontWeight: 800,
  px: 0.85,
};

const statusBadgeOverrideSx = {
  height: 16,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 0.85,
  textTransform: "capitalize",
};

const branchMetadataTextSx = {
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

const regulatoryNoteHeadingTextSx = {
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

export default BranchDetailsMobilePage;
