// src/features/global-products/pages/mobile/GlobalProductDetailsMobilePage.jsx

import { useState } from "react";
import {
  FiChevronLeft,
  FiMoreHorizontal,
  FiInfo,
  FiCalendar,
  FiBox,
  FiHash,
  FiChevronDown,
  FiGlobe,
  FiDownload,
  FiList,
  FiActivity,
  FiCheckCircle,
  FiUser,
  FiClock,
  FiDatabase,
  FiTag,
  FiBookOpen,
  FiAlertTriangle,
  FiHelpCircle,
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

const GlobalProductDetailsMobilePage = ({
  product,
  currentTab,
  isLoading,
  hasError,
  error,
  handleTabChange,
  handleBack,
  handleRefresh,
}) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "specifications", label: "Specifications" },
    { id: "packaging_pricing", label: "Packaging & Pricing" },
    { id: "availability", label: "Availability" },
    { id: "history", label: "History" },
  ];

  if (isLoading && !product) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppPageLoader text="Extracting master catalog specifications item..." />
      </AppBox>
    );
  }

  if (hasError && !product) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppErrorState
          title="Catalog Extraction Failure"
          description={
            error || "The server could not resolve the global product entity."
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
  const isOtc = safeProduct.productType === "otc";

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
              Global Products
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
                  id: "refresh",
                  label: "Sync Global Record",
                  onClick: handleRefresh,
                },
              ]}
              dense
              minWidth={160}
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
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="w-7 h-7 transform -rotate-45"
                >
                  <rect x="2" y="9" width="20" height="6" rx="3" />
                  <line x1="12" y1="9" x2="12" y2="15" />
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
                    label="GLOBAL"
                    variant="soft"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                      </svg>
                    }
                    sx={globalTagSx}
                  />
                </AppStack>

                <AppText variant="body2" sx={metaTextSx}>
                  {safeProduct.displayCode}
                </AppText>
                
                <AppText variant="body2" sx={categoryTextSx}>
                  {safeProduct.displayCategory} &bull; {safeProduct.packagingInformation?.unitType || "Tablet"}
                </AppText>
              </AppBox>
            </AppStack>

            {/* Warning / Alert Banner */}
            <AppBox sx={infoBannerSx}>
              <AppStack direction="row" align="flex-start" gap={1}>
                <FiInfo className="text-[16px] shrink-0 mt-0.5" style={{ color: "#2563eb" }} />
                <AppBox>
                  <AppText variant="body2" weight={700} sx={infoBannerTitleSx}>
                    This is a global product.
                  </AppText>
                  <AppText variant="body2" sx={infoBannerDescSx}>
                    You can view product details. Editing, deleting or creating duplicates is not allowed.
                  </AppText>
                </AppBox>
              </AppStack>
            </AppBox>

            {/* Quick Micro Stats Grid */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border border-gray-200/50 rounded-xl bg-white py-3.5 mt-4 shadow-sm">
              <QuickFactCell
                icon={<FiBox className="text-[16px] stroke-[2]" />}
                label="Product Type"
                value={safeProduct.displayType || "Finished Good"}
              />
              <QuickFactCell
                icon={<FiHash className="text-[16px] stroke-[2]" />}
                label="Unit"
                value={safeProduct.packagingInformation?.unitType || "Tablet"}
              />
              <QuickFactCell
                icon={<HiOutlineBuildingOffice2 className="text-[17px] stroke-[2]" />}
                label="Manufacturer"
                value={safeProduct.displayMarketer?.split(" ").slice(0, 2).join(" ") || "MedLife Pharma"}
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
                  value={safeProduct.displayComposition || "Paracetamol"}
                />
                <InfoRow
                  label="SKU"
                  icon={<FiList />}
                  value={safeProduct.displayCode}
                />
                <InfoRow
                  label="Strength"
                  icon={<FiActivity />}
                  value={safeProduct.medicineDetails?.strength || safeProduct.qty || "500 mg"}
                />
                <InfoRow
                  label="Dosage Form"
                  icon={<FiBox />}
                  value={safeProduct.packagingInformation?.unitType || "Tablet"}
                />
                <InfoRow
                  label="Unit"
                  icon={<FiHash />}
                  value={safeProduct.packagingInformation?.unitType || "Tablet"}
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
                      {safeProduct.medicineDetails?.description ||
                        safeProduct.otcDetails?.information ||
                        `${safeProduct.displayName || "Paracetamol Tablet 650mg"} is used to relieve pain and reduce fever. It is effective for headaches, muscle aches, toothaches, arthritis, backaches, and mild to moderate pain.`}
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
                    value={safeProduct.medicineDetails?.prescriptionRequired || "No"}
                  />
                  <InfoRow
                    label="Shelf Life"
                    icon={<FiClock />}
                    value="24 Months"
                  />
                  <InfoRow
                    label="Storage"
                    icon={<FiBox />}
                    value={safeProduct.medicineDetails?.storage || "Store in a cool & dry place"}
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
                    value={safeProduct.displayMarketer || "MedLife Pharma Pvt. Ltd."}
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

          {currentTab === "specifications" && (
            <AppStack direction="column" gap={1.5}>
              <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                {isOtc ? "OTC Product Information" : "Clinical Monograph"}
              </AppHeading>

              {isOtc ? (
                // --- OTC SPECIFICATIONS VIEW ---
                <AppStack direction="column" gap={1.5}>
                  <AppCard variant="default" rounded="lg" bordered shadow="none" sx={{ p: 1.25, bgcolor: "var(--app-color-surface)" }}>
                    <AppStack direction="column" gap={1.25}>
                      <ClinicalBlock
                        icon={<FiBookOpen />}
                        title="Information Overview"
                        text={safeProduct.otcDetails?.information}
                      />
                      <ClinicalBlock
                        icon={<FiCheckCircle />}
                        title="Product Highlights"
                        text={safeProduct.otcDetails?.productHighlights}
                      />
                      <ClinicalBlock
                        icon={<FiList />}
                        title="Key Benefits"
                        text={safeProduct.otcDetails?.keyBenefits}
                      />
                    </AppStack>
                  </AppCard>

                  <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                    Usage & Safety Guidelines
                  </AppHeading>
                  <AppCard variant="default" rounded="lg" bordered shadow="none" sx={{ p: 1.25, bgcolor: "var(--app-color-surface)" }}>
                    <AppStack direction="column" gap={1.25}>
                      <ClinicalBlock
                        icon={<FiActivity />}
                        title="Directions For Use"
                        text={safeProduct.otcDetails?.directionsForUse}
                      />
                      <ClinicalBlock
                        icon={<FiAlertTriangle />}
                        title="Safety Information"
                        text={safeProduct.otcDetails?.safetyInformation}
                      />
                      <ClinicalBlock
                        icon={<FiHash />}
                        title="Key Ingredients"
                        text={safeProduct.otcDetails?.keyIngredients}
                      />
                    </AppStack>
                  </AppCard>
                </AppStack>
              ) : (
                // --- MEDICINE SPECIFICATIONS VIEW ---
                <AppStack direction="column" gap={1.5}>
                  <AppCard variant="default" rounded="lg" bordered shadow="none" sx={{ p: 1.25, bgcolor: "var(--app-color-surface)" }}>
                    <AppStack direction="column" gap={1.25}>
                      <ClinicalBlock
                        icon={<FiBookOpen />}
                        title="Introduction"
                        text={safeProduct.medicineDetails?.introduction}
                      />
                      <ClinicalBlock
                        icon={<FiActivity />}
                        title="Mechanism of Action"
                        text={safeProduct.medicineDetails?.howItWorks}
                      />
                      <ClinicalBlock
                        icon={<FiAlertTriangle />}
                        title="Missed Dose Protocol"
                        text={safeProduct.medicineDetails?.missedDose}
                      />
                      <ClinicalBlock
                        icon={<FiInfo />}
                        title="Fact Box Summary"
                        text={safeProduct.medicineDetails?.factBox}
                      />
                    </AppStack>
                  </AppCard>

                  {safeProduct.medicineDetails?.qa && (
                    <>
                      <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                        Frequently Asked Questions
                      </AppHeading>
                      <AppCard variant="default" rounded="lg" bordered shadow="none" sx={{ p: 1.25, bgcolor: "var(--app-color-surface)" }}>
                        <div className="flex gap-2 items-start p-1.5 rounded-lg bg-surface-alt/40 border border-border">
                          <FiHelpCircle className="text-primary text-[16px] shrink-0 mt-0.5" />
                          <div className="text-[12px] leading-relaxed text-text font-medium whitespace-pre-line">
                            {safeProduct.medicineDetails.qa}
                          </div>
                        </div>
                      </AppCard>
                    </>
                  )}

                  <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                    Physiological Safety Profile
                  </AppHeading>
                  <AppCard variant="default" rounded="lg" bordered shadow="none" sx={{ p: 1.25, bgcolor: "var(--app-color-surface)" }}>
                    <AppStack direction="column" gap={1}>
                      <SafetyAdviceRow
                        label="Liver Interaction"
                        text={safeProduct.medicineDetails?.interactions?.liver}
                        severity={safeProduct.medicineDetails?.interactions?.liver ? "danger" : "neutral"}
                      />
                      <SafetyAdviceRow
                        label="Kidney Interaction"
                        text={safeProduct.medicineDetails?.interactions?.kidney}
                        severity={safeProduct.medicineDetails?.interactions?.kidney ? "warning" : "neutral"}
                      />
                      <SafetyAdviceRow
                        label="Pregnancy Warning"
                        text={safeProduct.medicineDetails?.interactions?.pregnancy}
                        severity={safeProduct.medicineDetails?.interactions?.pregnancy ? "danger" : "neutral"}
                      />
                      <SafetyAdviceRow
                        label="Lactation Warning"
                        text={safeProduct.medicineDetails?.interactions?.lactation}
                        severity={safeProduct.medicineDetails?.interactions?.lactation ? "warning" : "neutral"}
                      />
                    </AppStack>
                  </AppCard>
                </AppStack>
              )}
            </AppStack>
          )}

          {currentTab === "packaging_pricing" && (
            <AppStack direction="column" gap={1.5}>
              <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                Packaging Information
              </AppHeading>
              
              <AppCard variant="default" rounded="lg" bordered shadow="none" sx={{ p: 1.25, bgcolor: "var(--app-color-surface)" }}>
                <AppStack direction="column" gap={0.5}>
                  <InfoRow
                    label="Primary Pack"
                    icon={<FiBox />}
                    value={safeProduct.packagingInformation?.primaryPack || "Blister"}
                  />
                  <InfoRow
                    label="Pack Size"
                    icon={<FiList />}
                    value={safeProduct.packagingInformation?.packSize || "10 x 10 Tablets"}
                  />
                  <InfoRow
                    label="Unit Type"
                    icon={<FiHash />}
                    value={safeProduct.packagingInformation?.unitType || "Strip"}
                  />
                  <InfoRow
                    label="Units per Box"
                    icon={<FiDatabase />}
                    value={safeProduct.packagingInformation?.unitsPerBox || "10 Strips"}
                  />
                </AppStack>
              </AppCard>

              {/* Related Products Grid List */}
              {safeProduct.relatedProducts && safeProduct.relatedProducts.length > 0 && (
                <>
                  <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                    Related Products
                  </AppHeading>
                  <div className="grid grid-cols-2 gap-2">
                    {safeProduct.relatedProducts.map((item) => (
                      <AppCard
                        key={item._id}
                        variant="default"
                        rounded="lg"
                        bordered
                        shadow="none"
                        sx={{ p: 1, bgcolor: "var(--app-color-surface)", display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-alt text-text-muted text-[15px] border border-border">
                          <FiBox />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[11px] font-bold text-text truncate leading-tight">
                            {item.name}
                          </span>
                          <span className="block text-[9.5px] text-text-muted font-medium mt-0.5">
                            {item.productForm} &bull; {item.strength}
                          </span>
                        </div>
                      </AppCard>
                    ))}
                  </div>
                </>
              )}
            </AppStack>
          )}

          {currentTab === "availability" && (
            <AppStack direction="column" gap={1.5}>
              <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                Workspace Usage Summary
              </AppHeading>
              
              <AppCard variant="default" rounded="lg" bordered shadow="none" sx={{ p: 1.25, bgcolor: "var(--app-color-surface)" }}>
                <AppStack direction="column" gap={1.25}>
                  <UsageItem
                    label="Total Workspaces Using"
                    value={safeProduct.workspaceUsage?.totalWorkspaces || "1,245"}
                    color="success"
                  />
                  <UsageItem
                    label="Total Branches Using"
                    value={safeProduct.workspaceUsage?.totalBranches || "3,876"}
                    color="primary"
                  />
                  <UsageItem
                    label="Total Sales (30 Days)"
                    value={safeProduct.workspaceUsage?.totalSales || "45,230 Units"}
                    color="warning"
                  />
                  <UsageItem
                    label="Total Stock"
                    value={safeProduct.workspaceUsage?.totalStock || "1,28,560 Units"}
                    color="info"
                  />
                </AppStack>
              </AppCard>
            </AppStack>
          )}

          {currentTab === "history" && (
            <AppStack direction="column" gap={1.5}>
              <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                System Audit Trail
              </AppHeading>
              
              <AppCard variant="default" rounded="lg" bordered shadow="none" sx={{ p: 1.25, bgcolor: "var(--app-color-surface)" }}>
                <AppStack direction="column" gap={0.5}>
                  <InfoRow
                    label="Availability"
                    icon={<FiGlobe />}
                    value="Global"
                  />
                  <InfoRow
                    label="Listed On"
                    icon={<FiCalendar />}
                    value="12 Mar 2018"
                  />
                  <InfoRow
                    label="Last Updated"
                    icon={<FiClock />}
                    value="28 May 2024, 04:32 PM"
                  />
                  <InfoRow
                    label="Updated By"
                    icon={<FiUser />}
                    value="System Admin"
                  />
                </AppStack>
              </AppCard>
            </AppStack>
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
          startIcon={<FiList />}
          sx={actionBtnRightSx}
        >
          View in Inventory
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

const UsageItem = ({ label, value, color }) => (
  <AppStack direction="row" align="center" justify="space-between" sx={{ py: 0.5 }}>
    <AppStack direction="row" align="center" gap={1}>
      <span className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: `var(--app-color-${color})` }} />
      <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontSize: "12.5px", fontWeight: 555 }}>
        {label}
      </AppText>
    </AppStack>
    <AppText variant="body2" weight={750} sx={{ color: "var(--app-color-text)", fontSize: "14px" }}>
      {value}
    </AppText>
  </AppStack>
);

const ClinicalBlock = ({ icon, title, text }) => {
  if (!text) return null;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[12px] font-bold text-text">
        <span className="text-primary text-[14px] flex items-center">{icon}</span>
        <span>{title}</span>
      </div>
      <p className="text-[11.5px] leading-relaxed text-text-muted pl-5 font-medium">
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
    <div className="rounded-lg border border-border bg-surface p-2.5 space-y-1 select-none">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-text">{label}</span>
        <span
          className={`text-[8.5px] font-extrabold uppercase px-1 py-0.5 rounded border ${badgeColors}`}
        >
          {severity === "neutral" ? "Information" : severity}
        </span>
      </div>
      <p className="text-[11px] leading-normal text-text-muted font-medium">
        {text || "No structural restrictions documented for this formulation index profile parameters."}
      </p>
    </div>
  );
};

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
  bgcolor: "#e8f7ec",
  color: "#0faf59",
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
  bgcolor: "#eff6ff",
  color: "var(--app-color-primary)",
  border: "1px solid #bfdbfe",
  "& .MuiButton-startIcon": { mr: 0.4, fontSize: "11px" },
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
  bgcolor: "#eff6ff",
  border: "1px solid #dbeafe",
};

const infoBannerTitleSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#1e3a8a",
};

const infoBannerDescSx = {
  mt: 0.5,
  fontSize: "11px",
  color: "#1e40af",
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
  borderTop: "1px solid var(--app-color-divider)",
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

export default GlobalProductDetailsMobilePage;
