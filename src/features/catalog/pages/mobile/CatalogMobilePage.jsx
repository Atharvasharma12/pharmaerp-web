import {
  FiArrowRight,
  FiChevronRight,
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
  AppCard,
  AppHeading,
  AppSearchInput,
  AppStack,
  AppText,
} from "@/components";

const moduleIcons = {
  globalProducts: <HiOutlineCube className="text-[20px]" />,
  workspaceProducts: <HiOutlineCube className="text-[20px]" />,
  hsnMaster: <FiFileText className="text-[20px]" />,
  manufacturerMaster: <BiBuildingHouse className="text-[20px]" />,
  uomMaster: <BiRuler className="text-[20px]" />,
  categoryMaster: <FiTag className="text-[20px]" />,
  productFormMaster: <HiOutlineBeaker className="text-[20px]" />,
};

const overviewColors = {
  globalProducts: { bg: "#f5f3ff", text: "#8b5cf6" },
  workspaceProducts: { bg: "#f0fdf4", text: "#16a34a" },
  hsnMaster: { bg: "#eff6ff", text: "#2563eb" },
  manufacturerMaster: { bg: "#fff7ed", text: "#ea580c" },
  uomMaster: { bg: "#f0fdfa", text: "#0d9488" },
  categoryMaster: { bg: "#fff1f2", text: "#e11d48" },
  productFormMaster: { bg: "#f0f9ff", text: "#0284c7" },
};

const getStatIcon = (id) => {
  if (id === "workspaceProducts" || id === "manufacturerMaster") {
    return <FiUsers className="text-[13px] text-text-muted/80" />;
  }
  return <HiOutlineCube className="text-[13px] text-text-muted/80" />;
};

const CatalogMobilePage = ({
  catalogModules = [],
  searchQuery = "",
  setSearchQuery,
  isLoading,
  handleRefresh,
}) => {
  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Header Block */}
        <AppBox sx={headerWrapperSx}>
          <AppHeading level={1} weight={700} sx={pageTitleSx}>
            Catalog
          </AppHeading>
          <AppText variant="body2" sx={pageSubtitleSx}>
            Browse and view all master data and reference catalogs used across the system. These catalogs are read-only.
          </AppText>
        </AppBox>

        {/* Search Row */}
        <AppBox sx={searchWrapperSx}>
          <AppSearchInput
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            clearable
            onClear={() => setSearchQuery("")}
            size="large"
            variant="bordered"
            rounded="md"
            sx={searchBarSx}
            inputSx={searchInputSx}
          />
        </AppBox>

        {/* Catalog Modules vertical list */}
        <AppBox sx={sectionWrapperSx}>
          <AppStack direction="column" gap={1.2}>
            {catalogModules.map((item) => {
              const colors = overviewColors[item.id] || { bg: "#f8fafc", text: "#64748b" };
              return (
                <AppCard
                  key={item.id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="sm"
                  padding="none"
                  onClick={item.onClick}
                  sx={overviewRowItemCardSx}
                >
                  <AppStack
                    direction="row"
                    align="center"
                    justify="space-between"
                    gap={1}
                  >
                    <AppStack
                      direction="row"
                      align="flex-start"
                      gap={1.2}
                      sx={{ minWidth: 0, flex: 1 }}
                    >
                      {/* Left color icon block */}
                      <AppBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 42,
                          height: 42,
                          borderRadius: "10px",
                          bgcolor: colors.bg,
                          color: colors.text,
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        {moduleIcons[item.id] || <HiOutlineCube />}
                      </AppBox>

                      {/* Center block */}
                      <AppBox sx={{ minWidth: 0, flex: 1 }}>
                        <AppHeading level={3} weight={700} sx={moduleTitleTextSx}>
                          {item.title}
                        </AppHeading>
                        <AppText variant="body2" sx={moduleDescTextSx}>
                          {item.description}
                        </AppText>

                        {/* Stats indicator count */}
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-text-muted">
                          {getStatIcon(item.id)}
                          <span>{item.countText}</span>
                        </div>
                      </AppBox>
                    </AppStack>

                    {/* Right chevron navigation indicator */}
                    <FiChevronRight className="text-[18px] text-text-muted/60 shrink-0" />
                  </AppStack>
                </AppCard>
              );
            })}
          </AppStack>
        </AppBox>

        {/* Bottom Alert Banner */}
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-info-soft/30 px-3 py-3 text-[12px] text-info leading-relaxed">
          <FiInfo className="text-[16px] shrink-0 text-info mt-0.5" />
          <span className="font-medium">
            Catalogs are read-only. To create or manage data, please use the respective modules.
          </span>
        </div>
      </AppBox>
    </section>
  );
};

// Styles
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

const headerWrapperSx = {
  pt: 2.5,
  pb: 1,
  px: 0,
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.5,
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  lineHeight: "16px",
};

const searchWrapperSx = {
  px: 0,
  py: 1,
};

const searchBarSx = {
  width: "100%",
  boxShadow: "none",
};

const searchInputSx = {
  height: 42,
  fontSize: "13px",
  bgcolor: "var(--app-color-surface)",
};

const sectionWrapperSx = {
  px: 0,
  py: 2.5,
};

const overviewRowItemCardSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
    bgcolor: "var(--app-color-surface-hover)",
  },
};

const moduleTitleTextSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

const moduleDescTextSx = {
  mt: 0.4,
  fontSize: "11.5px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

export default CatalogMobilePage;
