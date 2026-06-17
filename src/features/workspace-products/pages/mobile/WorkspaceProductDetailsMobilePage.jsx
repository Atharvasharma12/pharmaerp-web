// src/features/workspace-products/pages/mobile/WorkspaceProductDetailsMobilePage.jsx

import { useState } from "react";
import {
  FiChevronLeft,
  FiMoreHorizontal,
  FiInfo,
  FiBox,
  FiHash,
  FiChevronDown,
  FiGlobe,
  FiDownload,
  FiList,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiTag,
  FiEdit3,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
  AppPageLoader,
  AppErrorState,
  AppMenu,
} from "@/components";

const WorkspaceProductDetailsMobilePage = ({
  product,
  currentTab,
  isLoading,
  hasError,
  error,
  handleTabChange,
  handleBack,
  handleRefresh,
  handleEditProduct,
  handleDeleteProduct,
}) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Pricing" },
    { id: "inventory", label: "Inventory" },
    { id: "packaging_pricing", label: "Packaging & Pricing" },
    { id: "availability", label: "Availability" },
    { id: "history", label: "History" },
    { id: "audit_log", label: "Audit Log" },
  ];

  if (isLoading && !product) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppPageLoader text="Extracting custom product profile specifications..." />
      </AppBox>
    );
  }

  if (hasError && !product) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppErrorState
          title="Product Extraction Failure"
          description={
            error || "The server could not resolve the custom product entity."
          }
          actionText="Retry Data Pipeline"
          onRetry={handleRefresh}
          size="medium"
        />
      </AppBox>
    );
  }

  if (!product) return null;

  const safeProduct = product || {};

  return (
    <section className="w-full bg-bg pb-24">
      <AppBox sx={containerSx}>
        {/* --- BACK NAVIGATION ROW --- */}
        <AppBox sx={navigationRowSx}>
          <AppStack direction="row" align="center" justify="space-between">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-[13px] font-bold text-success hover:opacity-85 transition outline-none"
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
            >
              <FiChevronLeft className="text-[16px] stroke-[2.5]" />
              Workspace Products
            </button>
            <AppMenu
              trigger={
                <AppIconButton
                  icon={<FiMoreHorizontal />}
                  size="small"
                  variant="text"
                  colorVariant="neutral"
                  sx={moreActionBtnSx}
                />
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
              minWidth={180}
            />
          </AppStack>
        </AppBox>

        {/* --- PRODUCT IDENTITY BLOCK CARD --- */}
        <AppBox sx={productIdentityWrapperSx}>
          <AppCard
            variant="default"
            rounded="xl"
            bordered
            shadow="none"
            padding="none"
            sx={identityCardSx}
          >
            <AppStack direction="row" align="flex-start" gap={1.25}>
              {/* Product Avatar Pill Icon Box */}
              <AppBox sx={pillIconBoxSx}>
                <svg
                  viewBox="0 0 100 100"
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    d="M35,25 C35,20 40,15 50,15 C60,15 65,20 65,25 L65,30 L35,30 Z"
                    fill="var(--app-color-surface)"
                    strokeWidth="2.5"
                  />
                  <rect
                    x="25"
                    y="30"
                    width="50"
                    height="55"
                    rx="10"
                    fill="var(--app-color-surface)"
                    strokeWidth="2.5"
                  />
                  <rect
                    x="62"
                    y="55"
                    width="22"
                    height="30"
                    rx="4"
                    fill="var(--app-color-surface-alt)"
                    strokeWidth="2"
                  />
                  <path
                    d="M42,57 L58,57 M50,49 L50,65"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M68,70 L78,70 M73,65 L73,75"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </AppBox>

              <AppBox sx={{ flex: 1, minWidth: 0 }}>
                <AppStack direction="row" align="flex-start" justify="space-between" gap={1}>
                  <AppBox sx={{ minWidth: 0, flex: 1 }}>
                    <AppHeading level={1} weight={700} sx={productTitleSx}>
                      {safeProduct.displayName}
                    </AppHeading>
                    <AppBox sx={{ mt: 0.5 }}>
                      <AppStatusBadge
                        status={safeProduct.status === "inactive" ? "inactive" : "active"}
                        variant="soft"
                        rounded="md"
                        size="small"
                        sx={statusBadgeSx}
                      />
                    </AppBox>
                  </AppBox>

                  <AppTag
                    label="WORKSPACE"
                    variant="soft"
                    colorVariant="purple"
                    rounded="md"
                    sx={globalTagSx}
                  />
                </AppStack>

                <AppText variant="body2" sx={metaTextSx}>
                  {safeProduct.displayCode}
                </AppText>
                
                <AppText variant="body2" sx={categoryTextSx}>
                  {safeProduct.displayForm} &bull; {safeProduct.displayPack}
                </AppText>
              </AppBox>
            </AppStack>

            {/* Warning / Alert Banner */}
            <AppBox sx={infoBannerSx}>
              <AppStack direction="row" align="flex-start" gap={1}>
                <FiInfo className="text-[16px] shrink-0 mt-0.5" style={{ color: "#9333ea" }} />
                <AppBox>
                  <AppText variant="body2" weight={700} sx={infoBannerTitleSx}>
                    This is a workspace product.
                  </AppText>
                  <AppText variant="body2" sx={infoBannerDescSx}>
                    Only members of this workspace entity can view or manage this catalog reference.
                  </AppText>
                </AppBox>
              </AppStack>
            </AppBox>

            {/* Quick Micro Stats Grid */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border border-gray-200/50 rounded-xl bg-white py-3.5 mt-4 shadow-sm">
              <QuickFactCell
                icon={<FiBox className="text-[16px] stroke-[2]" />}
                label="Product Type"
                value={safeProduct.displayType || "Medicine"}
              />
              <QuickFactCell
                icon={<FiHash className="text-[16px] stroke-[2]" />}
                label="Unit"
                value={safeProduct.displayForm || "Tablet"}
              />
              <QuickFactCell
                icon={<HiOutlineBuildingOffice2 className="text-[17px] stroke-[2]" />}
                label="Manufacturer"
                value={safeProduct.displayManufacturer?.split(" ").slice(0, 2).join(" ") || "MedPlus Pharma"}
              />
            </div>
          </AppCard>
        </AppBox>

        {/* --- HORIZONTAL TABS STRIP ROW --- */}
        <AppBox sx={tabsScrollWrapperSx}>
          <AppStack direction="row" align="center" gap={2.5} sx={tabsInnerSx}>
            {tabs.map((tab) => {
              const isTabActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={[
                    "relative pb-2 pt-2 text-[11px] font-bold tracking-wide transition-colors whitespace-nowrap outline-none",
                    isTabActive ? "text-success" : "text-text-muted hover:text-text",
                  ].join(" ")}
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  {tab.label}
                  {isTabActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-success rounded-t-full" />
                  )}
                </button>
              );
            })}
          </AppStack>
        </AppBox>

        {/* --- SWITCHABLE BODY VIEWS --- */}
        <AppBox sx={contentWrapperSx}>
          {currentTab === "overview" && (
            <AppStack direction="column" gap={1.5}>
              <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                Basic Information
              </AppHeading>

              <div className="flex flex-col mt-1">
                <InfoRow
                  label="Generic Name"
                  icon={<FiTag />}
                  value={safeProduct.displayName || "Calcium Carbonate"}
                />
                <InfoRow
                  label="SKU"
                  icon={<FiList />}
                  value={safeProduct.displayCode}
                />
                <InfoRow
                  label="Strength"
                  icon={<FiActivity />}
                  value={safeProduct.displayStrength || "500 mg"}
                />
                <InfoRow
                  label="Dosage Form"
                  icon={<FiBox />}
                  value={safeProduct.displayForm || "Tablet"}
                />
                <InfoRow
                  label="Unit"
                  icon={<FiHash />}
                  value={safeProduct.displayForm || "Tablet"}
                />
                
                {/* Status Badge Row */}
                <div className="grid grid-cols-[125px_10px_1fr] items-center py-2.5 text-[12px] border-b border-gray-100">
                  <AppStack direction="row" align="center" gap={0.75} sx={{ minWidth: 0 }}>
                    <span className="text-[14px] text-text-muted shrink-0 flex items-center">
                      <FiCheckCircle />
                    </span>
                    <AppText variant="body2" sx={infoLabelSx}>Status</AppText>
                  </AppStack>
                  <AppText variant="body2" sx={infoColonSx}>:</AppText>
                  <div className="min-w-0 pl-1">
                    <AppStatusBadge
                      status={safeProduct.status === "inactive" ? "inactive" : "active"}
                      variant="soft"
                      size="small"
                      rounded="sm"
                      colorVariant={safeProduct.status === "inactive" ? "neutral" : "success"}
                      sx={{ height: 18, fontSize: "9px", px: 0.75, fontWeight: 700 }}
                    />
                  </div>
                </div>

                {/* Description and See More Toggle Row */}
                <div className="grid grid-cols-[125px_10px_1fr] items-start py-2.5 text-[12px]">
                  <AppStack direction="row" align="center" gap={0.75} sx={{ minWidth: 0, mt: 0.25 }}>
                    <span className="text-[14px] text-text-muted shrink-0 flex items-center">
                      <FiInfo />
                    </span>
                    <AppText variant="body2" sx={infoLabelSx}>Description</AppText>
                  </AppStack>
                  <AppText variant="body2" sx={infoColonSx}>:</AppText>
                  <div className="min-w-0 pl-1">
                    <AppText
                      variant="body2"
                      sx={{ ...infoValueSx, lineHeight: 1.4 }}
                      className={isDescExpanded ? "" : "line-clamp-2"}
                    >
                      {safeProduct.displayNotes ||
                        `${safeProduct.displayName || "Calcium Tablet"} ${safeProduct.displayStrength || "500mg"} is a local custom workspace product mapped securely inside inventory parameters when no matching entry exists in the platform global catalog.`}
                    </AppText>
                    <button
                      type="button"
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="text-[10.5px] font-bold text-success flex items-center gap-0.5 mt-1.5 outline-none"
                      style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      {isDescExpanded ? "See Less" : "See More"}{" "}
                      <FiChevronDown className={`text-[12px] transition-transform ${isDescExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Info & Status Cards */}
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={manufacturerCardSx}
              >
                <AppHeading level={3} weight={800} sx={manufacturerTitleSx}>
                  Quick Info
                </AppHeading>
                <AppStack direction="column" gap={0.5} sx={{ mt: 1 }}>
                  <InfoRow
                    label="Prescription Required"
                    icon={<FiInfo />}
                    value="No"
                  />
                  <InfoRow
                    label="Shelf Life"
                    icon={<FiClock />}
                    value="24 Months"
                  />
                  <InfoRow
                    label="Storage"
                    icon={<FiBox />}
                    value="Store in a cool & dry place"
                  />
                </AppStack>
              </AppCard>

              {/* Manufacturer Information Card Block */}
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={manufacturerCardSx}
              >
                <AppHeading level={3} weight={800} sx={manufacturerTitleSx}>
                  Manufacturer Information
                </AppHeading>
                
                <AppStack direction="column" gap={0.5} sx={{ mt: 1 }}>
                  <InfoRow
                    label="Manufacturer"
                    icon={<HiOutlineBuildingOffice2 />}
                    value={safeProduct.displayManufacturer || "MedPlus Pharma"}
                  />
                  <InfoRow
                    label="Country"
                    icon={<FiGlobe />}
                    value="India"
                  />
                </AppStack>
              </AppCard>
            </AppStack>
          )}

          {currentTab !== "overview" && (
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              sx={{ p: 4, bgcolor: "var(--app-color-surface)", textAlign: "center" }}
            >
              <FiInfo className="mx-auto text-[24px] text-text-muted mb-2" />
              <AppHeading
                level={3}
                weight={700}
                sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}
              >
                {tabs.find((t) => t.id === currentTab)?.label} Information
              </AppHeading>
              <AppText
                variant="body2"
                sx={{ mt: 0.5, color: "var(--app-color-text-muted)", fontSize: "12px" }}
              >
                Relational workspace transactional data logged dynamically through core ERP modules.
              </AppText>
            </AppCard>
          )}
        </AppBox>
      </AppBox>

      {/* --- FIXED BOTTOM ACTIONS BAR --- */}
      <AppBox sx={bottomActionBarSx}>
        <AppButton
          variant="outlined"
          colorVariant="neutral"
          size="medium"
          rounded="lg"
          startIcon={<FiDownload />}
          sx={actionBtnLeftSx}
        >
          Export Details
        </AppButton>
        <AppButton
          variant="contained"
          colorVariant="success"
          size="medium"
          rounded="lg"
          startIcon={<FiEdit3 />}
          onClick={handleEditProduct}
          sx={actionBtnRightSx}
        >
          Edit Product
        </AppButton>
      </AppBox>
    </section>
  );
};

// --- SUB-ATOM PRESENTATIONAL COMPONENTS ---
const QuickFactCell = ({ icon, label, value }) => (
  <AppStack direction="column" align="center" justify="center" gap={0.5} sx={{ minWidth: 0, px: 0.5 }}>
    <AppBox sx={quickFactIconBoxSx}>
      {icon}
    </AppBox>
    <AppText variant="body2" sx={quickFactLabelSx}>
      {label}
    </AppText>
    <AppText variant="body2" weight={750} sx={quickFactValueSx}>
      {value}
    </AppText>
  </AppStack>
);

const InfoRow = ({ label, icon, value }) => (
  <div className="grid grid-cols-[125px_10px_1fr] items-center py-2.5 text-[12px] border-b border-gray-100 last:border-b-0">
    <AppStack direction="row" align="center" gap={0.75} sx={{ minWidth: 0 }}>
      <span className="text-[14px] text-text-muted shrink-0 flex items-center">{icon}</span>
      <AppText variant="body2" sx={infoLabelSx}>{label}</AppText>
    </AppStack>
    <AppText variant="body2" sx={infoColonSx}>:</AppText>
    <div className="min-w-0 pl-1">
      <AppText variant="body2" sx={infoValueSx}>{value || "-"}</AppText>
    </div>
  </div>
);

// --- STYLES OBJECTS DICTIONARY ---
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: "100%", sm: 460 },
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

const navigationRowSx = {
  pt: 1.5,
  pb: 1,
  px: 1.5,
  bgcolor: "var(--app-color-surface)",
};

const moreActionBtnSx = {
  width: 32,
  height: 32,
  minWidth: 32,
  color: "var(--app-color-text-muted)",
};

const productIdentityWrapperSx = {
  px: 1.5,
  pb: 1.5,
  bgcolor: "var(--app-color-surface)",
};

const identityCardSx = {
  bgcolor: "var(--app-color-surface)",
  border: "none",
  boxShadow: "none",
  p: 0,
};

const pillIconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 60,
  height: 60,
  borderRadius: "12px",
  bgcolor: "#faf5ff",
  color: "#9333ea",
  flexShrink: 0,
};

const productTitleSx = {
  m: 0,
  fontSize: "17px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const statusBadgeSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 750,
  px: 0.8,
};

const globalTagSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 800,
  px: 0.8,
  bgcolor: "#faf5ff",
  color: "#9333ea",
  border: "1px solid #e8d5ff",
};

const metaTextSx = {
  mt: 0.5,
  fontSize: "11px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const categoryTextSx = {
  mt: 0.25,
  fontSize: "11px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
};

const infoBannerSx = {
  mt: 2,
  p: 1.5,
  borderRadius: "8px",
  bgcolor: "#faf5ff",
  border: "1px solid #f3e8ff",
};

const infoBannerTitleSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#6b21a8",
};

const infoBannerDescSx = {
  mt: 0.5,
  fontSize: "11px",
  color: "#7e22ce",
  lineHeight: 1.4,
};

const quickFactIconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--app-color-success)",
  mb: 0.25,
};

const quickFactLabelSx = {
  fontSize: "10px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
  textAlign: "center",
  lineHeight: 1.2,
};

const quickFactValueSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  color: "var(--app-color-text)",
  textAlign: "center",
  lineHeight: 1.25,
  mt: 0.25,
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const tabsScrollWrapperSx = {
  borderBottom: "1px solid var(--app-color-divider)",
  bgcolor: "var(--app-color-surface)",
  overflowX: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
  px: 1.5,
};

const tabsInnerSx = {
  minWidth: "max-content",
};

const contentWrapperSx = {
  p: 2,
  bgcolor: "var(--app-color-surface)",
  minHeight: "45vh",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "14px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  letterSpacing: "-0.1px",
};

const infoLabelSx = {
  fontSize: "12px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
};

const infoColonSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  textAlign: "center",
};

const infoValueSx = {
  fontSize: "12px",
  fontWeight: 500,
  color: "var(--app-color-text)",
};

const manufacturerCardSx = {
  mt: 1.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  p: 1.25,
};

const manufacturerTitleSx = {
  m: 0,
  fontSize: "13px",
  fontWeight: 700,
  color: "var(--app-color-primary)",
};

const bottomActionBarSx = {
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: 460,
  p: 1.25,
  bgcolor: "var(--app-color-surface)",
  borderTop: "1px solid var(--app-color-divider)",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 1.25,
  zIndex: 50,
  boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.04)",
};

const actionBtnLeftSx = {
  height: 38,
  fontSize: "11.5px",
  fontWeight: 700,
  borderColor: "var(--app-color-border-strong)",
  color: "var(--app-color-text)",
  px: 1,
};

const actionBtnRightSx = {
  height: 38,
  fontSize: "11.5px",
  fontWeight: 700,
  bgcolor: "var(--app-color-success)",
  color: "#fff",
  px: 1,
  "&:hover": {
    bgcolor: "color-mix(in_srgb, var(--app-color-success) 90%, black)",
  },
};

export default WorkspaceProductDetailsMobilePage;
