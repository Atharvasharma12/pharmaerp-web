import { useMemo } from "react";
import {
  FiChevronLeft,
  FiInfo,
  FiDownload,
  FiList,
  FiActivity,
  FiTag,
} from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi2";
import { BiCategory, BiBuildingHouse, BiCalendar } from "react-icons/bi";

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
} from "@/components";

const GlobalProductDetailsMobilePage = ({
  product,
  currentTab,
  handleTabChange,
  handleBack,
}) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Pricing" },
    { id: "inventory", label: "Inventory" },
    { id: "classifications", label: "Classifications" },
    { id: "auditLog", label: "Audit Log" },
  ];

  if (!product) return null;

  return (
    <section className="w-full bg-bg pb-20">
      <AppBox sx={containerSx}>
        {/* Header Navigation */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" gap={1.5}>
            <AppIconButton
              icon={<FiChevronLeft />}
              variant="text"
              colorVariant="neutral"
              size="small"
              onClick={handleBack}
              sx={{ color: "var(--app-color-text)", ml: -1 }}
            />
            <AppHeading level={3} weight={700} sx={headerTitleSx}>
              Global Products
            </AppHeading>
          </AppStack>
        </AppBox>

        {/* Product Meta Identity Block */}
        <AppBox sx={productIdentityWrapperSx}>
          <AppCard
            variant="default"
            rounded="xl"
            bordered
            shadow="sm"
            padding="md"
            sx={identityCardSx}
          >
            <AppStack direction="row" align="flex-start" gap={1.5}>
              <AppBox sx={avatarFrameLgSx}>
                <img src="/pill-icon.png" alt="Product" className="w-8 h-8 opacity-60" onError={(e) => { e.target.style.display='none' }} />
                <HiOutlineCube className="text-[28px] absolute" />
              </AppBox>

              <AppBox sx={{ minWidth: 0, flex: 1 }}>
                <AppStack direction="row" align="center" justify="space-between" gap={1}>
                  <AppHeading level={2} weight={800} sx={productTitleSx}>
                    {product.displayName}
                  </AppHeading>
                  <AppTag
                    label="GLOBAL"
                    variant="soft"
                    colorVariant="primary"
                    rounded="md"
                    startIcon={<HiOutlineCube />}
                    sx={globalTagSx}
                  />
                </AppStack>
                
                <AppBox sx={{ mt: 0.5 }}>
                  <AppStatusBadge
                    status="active"
                    label="Active"
                    variant="soft"
                    size="small"
                    rounded="sm"
                    colorVariant="success"
                    sx={statusBadgeSx}
                  />
                </AppBox>

                <AppText variant="body2" sx={productSkuSx}>
                  {product.displayCode}
                </AppText>
                <AppText variant="body2" sx={productTypeSx}>
                  {product.displayCategory} • {product.packagingInformation?.unitType || "Tablet"}
                </AppText>
              </AppBox>
            </AppStack>

            {/* Alert Box */}
            <AppBox sx={alertBoxSx}>
              <AppStack direction="row" align="flex-start" gap={1}>
                <FiInfo className="text-primary mt-0.5 text-[14px]" />
                <AppBox>
                  <AppText variant="body2" weight={700} sx={alertTitleSx}>
                    This is a global product.
                  </AppText>
                  <AppText variant="body2" sx={alertDescSx}>
                    You can view product details. Editing, deleting or creating duplicates is not allowed.
                  </AppText>
                </AppBox>
              </AppStack>
            </AppBox>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-divider">
              <AppStack direction="column" align="center" gap={0.5}>
                <HiOutlineCube className="text-[18px] text-success" />
                <AppText variant="body2" sx={microStatTitleSx}>Product Type</AppText>
                <AppText variant="body2" weight={700} sx={microStatValueSx}>{product.displayType}</AppText>
              </AppStack>
              <AppStack direction="column" align="center" gap={0.5}>
                <FiTag className="text-[18px] text-success" />
                <AppText variant="body2" sx={microStatTitleSx}>Unit</AppText>
                <AppText variant="body2" weight={700} sx={microStatValueSx}>{product.packagingInformation?.unitType}</AppText>
              </AppStack>
              <AppStack direction="column" align="center" gap={0.5}>
                <BiBuildingHouse className="text-[18px] text-success" />
                <AppText variant="body2" sx={microStatTitleSx}>Manufacturer</AppText>
                <AppText variant="body2" weight={700} sx={microStatValueSx} align="center">{product.displayMarketer.split(" ")[0]}</AppText>
              </AppStack>
              <AppStack direction="column" align="center" gap={0.5}>
                <BiCalendar className="text-[18px] text-success" />
                <AppText variant="body2" sx={microStatTitleSx}>Created On</AppText>
                <AppText variant="body2" weight={700} sx={microStatValueSx}>10 Jan 2024</AppText>
              </AppStack>
            </div>
          </AppCard>
        </AppBox>

        {/* Scrollable Tabs Row */}
        <AppBox sx={tabsScrollWrapperSx}>
          <AppStack direction="row" align="center" gap={2.5} sx={tabsInnerSx}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={[
                  "relative pb-2.5 text-[13px] font-bold transition-colors whitespace-nowrap",
                  currentTab === tab.id
                    ? "text-success"
                    : "text-text-muted hover:text-text",
                ].join(" ")}
              >
                {tab.label}
                {currentTab === tab.id && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-success rounded-t-full" />
                )}
              </button>
            ))}
          </AppStack>
        </AppBox>

        {/* Content Section based on Tab */}
        <AppBox sx={contentWrapperSx}>
          {currentTab === "overview" && (
            <AppStack direction="column" gap={1.5}>
              <AppHeading level={3} weight={800} sx={sectionTitleSx}>
                Basic Information
              </AppHeading>

              <AppStack direction="column" gap={1.2} sx={{ mt: 1 }}>
                <InfoRow label="Generic Name" icon={<FiTag />} value={product.displayComposition || "Paracetamol"} />
                <InfoRow label="SKU" icon={<FiList />} value={product.displayCode} />
                <InfoRow label="Strength" icon={<HiOutlineCube />} value={product.packagingInformation?.unitsPerBox || "500 mg"} />
                <InfoRow label="Dosage Form" icon={<FiBox />} value={product.packagingInformation?.unitType || "Tablet"} />
                <InfoRow label="Unit" icon={<FiActivity />} value={product.packagingInformation?.unitType || "Tablet"} />
                
                <div className="grid grid-cols-[110px_10px_minmax(0,1fr)] gap-1 py-1">
                  <AppStack direction="row" align="center" gap={0.75}>
                    <FiTag className="text-[13px] text-text-muted" />
                    <AppText variant="body2" sx={infoLabelSx}>Status</AppText>
                  </AppStack>
                  <AppText variant="body2" sx={infoColonSx}>:</AppText>
                  <AppStatusBadge
                    status="active"
                    label="Active"
                    variant="soft"
                    size="small"
                    rounded="sm"
                    colorVariant="success"
                    sx={{ width: "fit-content", height: 20, fontSize: "10px", px: 1, fontWeight: 700 }}
                  />
                </div>

                <div className="grid grid-cols-[110px_10px_minmax(0,1fr)] gap-1 py-1">
                  <AppStack direction="row" align="flex-start" gap={0.75} sx={{ mt: 0.25 }}>
                    <FiList className="text-[13px] text-text-muted" />
                    <AppText variant="body2" sx={infoLabelSx}>Description</AppText>
                  </AppStack>
                  <AppText variant="body2" sx={infoColonSx}>:</AppText>
                  <AppBox>
                    <AppText variant="body2" sx={infoValueSx}>
                      Pain reliever and fever reducer. Used to treat mild to moderate pain.
                    </AppText>
                    <button type="button" className="text-[11px] font-bold text-success flex items-center gap-1 mt-1 justify-end w-full">
                      See More <FiChevronRight className="rotate-90" />
                    </button>
                  </AppBox>
                </div>
              </AppStack>

              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="md"
                sx={manufacturerCardSx}
              >
                <AppHeading level={3} weight={800} sx={manufacturerTitleSx}>
                  Manufacturer Information
                </AppHeading>
                
                <AppStack direction="column" gap={1.2} sx={{ mt: 1.5 }}>
                  <InfoRow label="Manufacturer" icon={<BiBuildingHouse />} value={product.displayMarketer || "MedLife Pharma Pvt. Ltd."} />
                  <InfoRow label="Country" icon={<BiBuildingHouse />} value="India" />
                </AppStack>
              </AppCard>
            </AppStack>
          )}

          {currentTab !== "overview" && (
            <AppBox sx={{ py: 6, textAlign: "center" }}>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)" }}>
                {tabs.find((t) => t.id === currentTab)?.label} content is displayed here.
              </AppText>
            </AppBox>
          )}
        </AppBox>
      </AppBox>

      {/* Fixed Bottom Action Bar */}
      <AppBox sx={bottomActionBarSx}>
        <AppButton
          variant="outlined"
          colorVariant="neutral"
          size="large"
          rounded="lg"
          startIcon={<FiDownload />}
          sx={actionBtnLeftSx}
        >
          Export Details
        </AppButton>
        <AppButton
          variant="contained"
          colorVariant="success"
          size="large"
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

const InfoRow = ({ label, icon, value }) => (
  <div className="grid grid-cols-[110px_10px_minmax(0,1fr)] items-center gap-1 py-1">
    <AppStack direction="row" align="center" gap={0.75}>
      <span className="text-[13px] text-text-muted">{icon}</span>
      <AppText variant="body2" sx={infoLabelSx}>{label}</AppText>
    </AppStack>
    <AppText variant="body2" sx={infoColonSx}>:</AppText>
    <AppText variant="body2" weight={600} sx={infoValueSx}>{value}</AppText>
  </div>
);

const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 1.5,
};

const headerTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-success)",
};

const productIdentityWrapperSx = {
  px: 0.5,
  pb: 1,
};

const identityCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  borderWidth: 0,
  borderBottomWidth: "1px",
  borderRadius: 0,
  boxShadow: "none",
  px: 1.5,
  py: 1.5,
};

const avatarFrameLgSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 64,
  height: 64,
  borderRadius: "12px",
  bgcolor: "color-mix(in_srgb, var(--app-color-success) 10%, transparent)",
  color: "var(--app-color-success)",
  flexShrink: 0,
  position: "relative",
};

const productTitleSx = {
  m: 0,
  fontSize: "16px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const globalTagSx = {
  height: 20,
  fontSize: "9px",
  fontWeight: 800,
  px: 0.8,
  "& .MuiButton-startIcon": { mr: 0.5, fontSize: "12px" },
};

const statusBadgeSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 750,
  px: 0.8,
};

const productSkuSx = {
  mt: 0.75,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.2,
};

const productTypeSx = {
  mt: 0.25,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.2,
};

const alertBoxSx = {
  mt: 2,
  p: 1.25,
  borderRadius: "8px",
  bgcolor: "color-mix(in_srgb, var(--app-color-primary) 8%, transparent)",
  border: "1px solid color-mix(in_srgb, var(--app-color-primary) 20%, transparent)",
};

const alertTitleSx = {
  fontSize: "11.5px",
  color: "var(--app-color-primary)",
};

const alertDescSx = {
  mt: 0.25,
  fontSize: "10.5px",
  color: "color-mix(in_srgb, var(--app-color-primary) 80%, var(--app-color-text))",
  lineHeight: "15px",
};

const microStatTitleSx = {
  fontSize: "9px",
  color: "var(--app-color-text-muted)",
  whiteSpace: "nowrap",
};

const microStatValueSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text)",
};

const tabsScrollWrapperSx = {
  borderBottom: "1px solid var(--app-color-divider)",
  overflowX: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
  px: 1.5,
  pt: 1.5,
};

const tabsInnerSx = {
  minWidth: "max-content",
};

const contentWrapperSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface-alt)",
  minHeight: "40vh",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

const infoLabelSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const infoColonSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  textAlign: "center",
};

const infoValueSx = {
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const manufacturerCardSx = {
  mt: 1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const manufacturerTitleSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-primary)",
};

const bottomActionBarSx = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  borderTop: "1px solid var(--app-color-divider)",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 1.5,
  zIndex: 50,
};

const actionBtnLeftSx = {
  height: 42,
  fontSize: "12.5px",
  fontWeight: 750,
};

const actionBtnRightSx = {
  height: 42,
  fontSize: "12.5px",
  fontWeight: 750,
};

export default GlobalProductDetailsMobilePage;
