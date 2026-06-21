import {
  FiArrowRight,
  FiSearch,
  FiInfo,
  FiFileText,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { HiOutlineCube, HiOutlineBeaker } from "react-icons/hi2";
import { BiBuildingHouse, BiRuler } from "react-icons/bi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppSearchInput,
  AppStack,
  AppText,
} from "@/components";

const moduleIcons = {
  globalProducts: <HiOutlineCube className="text-[22px]" />,
  workspaceProducts: <HiOutlineCube className="text-[22px]" />,
  hsnMaster: <FiFileText className="text-[22px]" />,
  manufacturerMaster: <BiBuildingHouse className="text-[22px]" />,
  uomMaster: <BiRuler className="text-[22px]" />,
  categoryMaster: <FiTag className="text-[22px]" />,
  productFormMaster: <HiOutlineBeaker className="text-[22px]" />,
  saltMaster: <HiOutlineBeaker className="text-[22px]" />,
};

const overviewColors = {
  globalProducts: { bg: "#f5f3ff", text: "#8b5cf6" },
  workspaceProducts: { bg: "#f0fdf4", text: "#16a34a" },
  hsnMaster: { bg: "#eff6ff", text: "#2563eb" },
  manufacturerMaster: { bg: "#fff7ed", text: "#ea580c" },
  uomMaster: { bg: "#f0fdfa", text: "#0d9488" },
  categoryMaster: { bg: "#fff1f2", text: "#e11d48" },
  productFormMaster: { bg: "#f0f9ff", text: "#0284c7" },
  saltMaster: { bg: "#fdf2f8", text: "#db2777" },
};

const getStatIcon = (id) => {
  if (id === "workspaceProducts" || id === "manufacturerMaster") {
    return <FiUsers className="text-[14px] text-text-muted/80" />;
  }
  return <HiOutlineCube className="text-[14px] text-text-muted/80" />;
};

const CatalogDesktopPage = ({
  catalogModules = [],
  searchQuery = "",
  setSearchQuery,
  isLoading,
  handleRefresh,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between">
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard" },
              { label: "Catalog", current: true },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* Header Block */}
        <div className="mt-2.5">
          <AppHeading level={1} weight={700} sx={pageTitleSx}>
            Catalog
          </AppHeading>
          <AppText variant="body2" sx={pageSubtitleSx}>
            Browse and view all master data and reference catalogs used across the system. These catalogs are read-only.
          </AppText>
        </div>

        {/* Search Input Bar */}
        <div className="mt-5 max-w-[380px]">
          <AppSearchInput
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            clearable
            onClear={() => setSearchQuery("")}
            size="small"
            variant="bordered"
            rounded="md"
            sx={searchSx}
            inputSx={searchInputSx}
          />
        </div>

        {/* Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {catalogModules.map((item) => {
            const colors = overviewColors[item.id] || { bg: "#f8fafc", text: "#64748b" };
            return (
              <AppCard
                key={item.id}
                variant="default"
                rounded="xl"
                bordered
                shadow="sm"
                padding="md"
                sx={catalogCardSx}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-start gap-4">
                    {/* Left Icon box */}
                    <AppBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: colors.bg,
                        color: colors.text,
                        flexShrink: 0,
                      }}
                    >
                      {moduleIcons[item.id] || <HiOutlineCube />}
                    </AppBox>

                    {/* Right column with title and description */}
                    <div className="flex flex-col min-w-0">
                      <AppHeading level={3} weight={700} sx={cardTitleSx}>
                        {item.title}
                      </AppHeading>
                      <AppText variant="body2" sx={cardDescSx}>
                        {item.description}
                      </AppText>
                    </div>
                  </div>

                  {/* Bottom metrics and Action button */}
                  <div className="mt-4">
                    {/* Stat Count Badge Row (Centered) */}
                    <div className="flex justify-center items-center gap-1.5 text-[12px] font-semibold text-text-muted">
                      {getStatIcon(item.id)}
                      <span>{item.countText}</span>
                    </div>

                    {/* Navigation button */}
                    <AppButton
                      variant="outlined"
                      colorVariant="neutral"
                      fullWidth
                      onClick={item.onClick}
                      endIcon={<FiArrowRight />}
                      sx={viewCatalogBtnSx}
                    >
                      View Catalog
                    </AppButton>
                  </div>
                </div>
              </AppCard>
            );
          })}
        </div>

        {/* Bottom Alert Banner */}
        <div className="mt-8 flex items-center gap-3.5 rounded-lg border border-border bg-info-soft/30 px-4 py-3.5 text-[13px] text-info">
          <FiInfo className="text-[18px] shrink-0 text-info" />
          <span className="font-medium">
            Catalogs are read-only. To create or manage data, please use the respective modules.
          </span>
        </div>
      </div>
    </section>
  );
};

// Styles
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageTitleSx = {
  m: 0,
  fontSize: "25px",
  lineHeight: 1.15,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const searchSx = { width: "100%" };
const searchInputSx = {
  height: 36,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const catalogCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "all 0.2s ease",
  p: 1.5,
  minHeight: 180,
  "&:hover": {
    boxShadow: "var(--app-shadow-md)",
    borderColor: "var(--app-color-primary)",
  },
};

const cardTitleSx = {
  m: 0,
  fontSize: "15px",
  color: "var(--app-color-text)",
};

const cardDescSx = {
  mt: 0.5,
  fontSize: "12px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const viewCatalogBtnSx = {
  mt: 2.5,
  height: 32,
  fontSize: "11.5px",
  fontWeight: 700,
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
  transition: "all 0.15s ease",
  "&:hover": {
    borderColor: "var(--app-color-primary)",
    color: "var(--app-color-primary)",
    bgcolor: "var(--app-color-primary-soft)",
  },
};

export default CatalogDesktopPage;
