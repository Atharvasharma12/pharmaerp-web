import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiInfo,
  FiChevronRight,
} from "react-icons/fi";
import { BiBuildingHouse, BiSortAlt2 } from "react-icons/bi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppSearchInput,
  AppStack,
  AppTablePagination,
  AppTag,
  AppText,
  AppSelect,
  AppDialog,
  AppIconButton,
} from "@/components";

const ManufacturerMasterMobilePage = ({
  products = [],
  filters,
  hasFilteredProducts,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handlePageChange,
  handlePageSizeChange,
  currentPage,
  pageSize = 10,
  totalProducts = 0,
}) => {
  const shouldRenderPagination = hasFilteredProducts && totalProducts > 0;
  const [showFilters, setShowFilters] = useState(false);

  // Dialog Local States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);

  const handleRowClick = (m) => {
    setSelectedManufacturer(m);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedManufacturer(null);
  };

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Header Block */}
        <AppBox sx={headerWrapperSx}>
          <AppHeading level={1} weight={700} sx={pageTitleSx}>
            Manufacturer Catalog
          </AppHeading>
          <AppText variant="body2" sx={pageSubtitleSx}>
            Inspect global platform manufacturers linked across inventories.
          </AppText>
        </AppBox>

        {/* Search Row */}
        <AppBox sx={searchWrapperSx}>
          <AppStack direction="row" align="center" gap={1}>
            <AppSearchInput
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by manufacturer name..."
              clearable
              onClear={() => handleSearchChange("")}
              size="large"
              variant="bordered"
              rounded="md"
              sx={searchBarSx}
              inputSx={searchInputSx}
            />
          </AppStack>
        </AppBox>

        {/* Filter and Sort Action Row */}
        <AppBox sx={filterActionRowSx}>
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiFilter />}
            onClick={() => setShowFilters(!showFilters)}
            sx={filterToggleBtnSx}
          >
            {showFilters ? "Hide Filters" : "Filter"}
          </AppButton>

          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<BiSortAlt2 className="text-[14px]" />}
            endIcon={<FiChevronRight className="rotate-90 text-[14px]" />}
            sx={sortBtnSx}
          >
            Sort: Default
          </AppButton>
        </AppBox>

        {/* Expandable Mobile Filter Panel */}
        {showFilters && (
          <AppBox sx={mobileFilterPanelSx}>
            <AppStack direction="column" gap={1.5}>
              <div>
                <AppText variant="body2" sx={filterLabelSx}>
                  Status
                </AppText>
                <AppSelect
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  options={[
                    { label: "All Statuses", value: "all" },
                    { label: "Active Only", value: "true" },
                    { label: "Inactive Only", value: "false" },
                  ]}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  sx={selectSx}
                  inputSx={filterInputSx}
                />
              </div>
              {Object.values(filters).some(
                (val) => val !== "all" && val !== "",
              ) && (
                <AppButton
                  variant="text"
                  colorVariant="primary"
                  onClick={handleClearFilters}
                  sx={{ alignSelf: "flex-start", fontSize: "12px", p: 0 }}
                >
                  Clear All Applied Filters
                </AppButton>
              )}
            </AppStack>
          </AppBox>
        )}

        {/* Ledger List */}
        <AppBox sx={listingListWrapperSx}>
          {!hasFilteredProducts ? (
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
                sx={{ py: 4, width: "100%" }}
              >
                <FiSearch className="text-[28px] text-text-muted/60" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{ m: 0, fontSize: "13px", width: "100%" }}
                >
                  No matching entries found
                </AppHeading>
                <AppText
                  variant="body2"
                  align="center"
                  sx={emptyStateSubTextSx}
                >
                  Modify your keywords or reset status selection dropdowns.
                </AppText>
                <AppButton
                  variant="text"
                  colorVariant="primary"
                  onClick={handleClearFilters}
                >
                  Reset Parameters
                </AppButton>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1.2}>
              {products.map((m) => (
                <AppCard
                  key={m._id}
                  variant="default"
                  rounded="lg"
                  bordered={false}
                  shadow="sm"
                  padding="none"
                  onClick={() => handleRowClick(m)}
                  sx={productCardSx}
                >
                  <AppStack direction="row" align="center" gap={1.5}>
                    {/* Left Icon block */}
                    <AppBox sx={avatarFrameSx}>
                      <BiBuildingHouse className="text-[24px]" />
                    </AppBox>

                    {/* Center Content Block */}
                    <AppBox sx={{ minWidth: 0, flex: 1 }}>
                      <AppHeading level={3} weight={700} sx={productTitleSx}>
                        {m.displayName}
                      </AppHeading>
                      <AppText variant="body2" sx={productPackSx}>
                        {m.displayManufacturer}
                      </AppText>
                    </AppBox>

                    {/* Right Info Badge Frame */}
                    <AppStack
                      direction="column"
                      align="flex-end"
                      gap={0.5}
                      sx={rightActionColSx}
                    >
                      <AppTag
                        label="Global"
                        variant="soft"
                        colorVariant="primary"
                        rounded="md"
                        sx={manufacturerTagSx}
                      />
                      <AppText variant="body2" sx={productTypeValueSx}>
                        {m.displayStatus}
                      </AppText>
                    </AppStack>
                  </AppStack>
                </AppCard>
              ))}

              {/* Global Scope Informational Banner */}
              <AppCard
                variant="default"
                rounded="lg"
                bordered={false}
                shadow="none"
                padding="md"
                sx={scopeBannerSx}
              >
                <AppStack direction="row" align="flex-start" gap={1.5}>
                  <BiBuildingHouse className="text-[28px] text-success" />
                  <AppBox>
                    <AppHeading level={3} weight={700} sx={scopeTitleSx}>
                      Global Scope Data
                    </AppHeading>
                    <AppText variant="body2" sx={scopeTextSx}>
                      These entries represent global administrative master
                      values. Modifications are read-only within tenant
                      workspace environments.
                    </AppText>
                  </AppBox>
                </AppStack>
              </AppCard>
            </AppStack>
          )}
        </AppBox>

        {shouldRenderPagination && (
          <AppBox sx={paginationFooterWrapperSx}>
            <AppTablePagination
              page={currentPage}
              pageSize={pageSize}
              totalItems={totalProducts}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageSize={false}
              showSummary={true}
              compact={true}
              size="small"
              align="center"
              rounded="md"
              sx={{ textAlign: "center", alignItems: "center" }}
              summarySx={{ textAlign: "center", width: "100%", mb: 0.5 }}
              paginationSx={{
                justifyContent: "center",
                width: "100%",
                "& .MuiPagination-ul": { justifyContent: "center" },
              }}
            />
          </AppBox>
        )}
      </AppBox>

      {/* ──────────────────────────────────────────────────────── */}
      {/* DETAIL OVERLAY MODAL                                    */}
      {/* ──────────────────────────────────────────────────────── */}
      <AppDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        rounded="lg"
        disableHeader={true}
        DialogProps={{ title: null, header: null }}
        sx={dialogOverrideSx}
      >
        <AppBox sx={dialogContentWrapperSx}>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <AppStack direction="row" align="center" gap={1}>
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FiInfo className="text-[15px]" />
              </span>
              <AppHeading level={2} weight={750} sx={dialogTitleSx}>
                Manufacturer Summary
              </AppHeading>
            </AppStack>
            <AppIconButton
              icon={<FiX />}
              variant="text"
              colorVariant="neutral"
              size="small"
              onClick={handleCloseDialog}
            />
          </div>

          {selectedManufacturer && (
            <div className="mt-4 space-y-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Manufacturer Name
                </span>
                <AppHeading level={3} weight={700} sx={dialogValueCodeSx}>
                  {selectedManufacturer.displayName}
                </AppHeading>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Official Registry Description
                </span>
                <AppText variant="body2" sx={dialogDescTextSx}>
                  {selectedManufacturer.description ||
                    "No classification description provided for this manufacturer master record."}
                </AppText>
              </div>

              <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-text-muted">
                    Catalog Status
                  </span>
                  <div className="mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11.5px] font-bold capitalize ${selectedManufacturer.displayStatus === "active" ? "text-success" : "text-text-muted"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${selectedManufacturer.displayStatus === "active" ? "bg-success" : "bg-text-muted"}`}
                      />
                      {selectedManufacturer.displayStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-text-muted">
                    Record Scope
                  </span>
                  <AppText
                    variant="body2"
                    sx={{ fontSize: "11.5px", fontWeight: 650, mt: 0.5 }}
                  >
                    {selectedManufacturer.displayAvailability} System
                  </AppText>
                </div>
              </div>
            </div>
          )}
        </AppBox>
      </AppDialog>
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
  pt: 2,
  pb: 1,
  px: 0,
};

const pageTitleSx = {
  m: 0,
  fontSize: "19px",
  color: "var(--app-color-text)",
  letterSpacing: "-0.3px",
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

const filterActionRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 0,
  py: 1,
};

const filterToggleBtnSx = {
  height: 36,
  px: 1.5,
  fontSize: "12.5px",
  fontWeight: 600,
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const sortBtnSx = {
  height: 36,
  px: 1.5,
  fontSize: "12.5px",
  fontWeight: 600,
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const mobileFilterPanelSx = {
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  borderRadius: "8px",
  p: 2,
  mt: 0.5,
  mb: 1.5,
};

const filterLabelSx = {
  fontSize: "11px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const selectSx = { width: "100%" };
const filterInputSx = {
  height: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const listingListWrapperSx = {
  px: 0,
  py: 1,
};

const emptyCardContainerSx = {
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  width: "100%",
};

const emptyStateSubTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  px: 2,
  textAlign: "center",
  width: "100%",
  mb: 1,
};

const productCardSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  boxShadow:
    "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
  },
};

const avatarFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: "10px",
  bgcolor: "color-mix(in_srgb, var(--app-color-primary) 10%, transparent)",
  color: "var(--app-color-primary)",
  flexShrink: 0,
};

const productTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 180,
};

const productPackSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 180,
};

const rightActionColSx = {
  pl: 1.5,
  borderLeft:
    "1px solid color-mix(in_srgb, var(--app-color-border) 60%, transparent)",
  minWidth: 90,
  maxWidth: 110,
  flexShrink: 0,
};

const manufacturerTagSx = {
  height: 20,
  fontSize: "9px",
  fontWeight: 750,
  px: 0.8,
  width: "fit-content",
};

const productTypeValueSx = {
  fontSize: "9px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  lineHeight: 1.2,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const scopeBannerSx = {
  mt: 1,
  mb: 2,
  bgcolor:
    "color-mix(in_srgb, var(--app-color-success) 4%, var(--app-color-surface))",
};

const scopeTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const scopeTextSx = {
  mt: 0.5,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.4,
};

const paginationFooterWrapperSx = {
  px: 0,
  pt: 2,
  pb: 2,
  borderTop: "1px solid var(--app-color-divider)",
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": { width: "100%" },
};

const dialogOverrideSx = {
  "& .MuiDialog-paper": {
    mx: 2,
    width: "calc(100% - 32px)",
  },
};
const dialogContentWrapperSx = {
  p: 2,
  bgcolor: "var(--app-color-surface)",
};
const dialogTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};
const dialogValueCodeSx = {
  m: 0,
  fontSize: "18px",
  color: "var(--app-color-text)",
  letterSpacing: "-0.2px",
  mt: 0.15,
};
const dialogDescTextSx = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
  mt: 0.3,
};

export default ManufacturerMasterMobilePage;
