import { useMemo, useState } from "react";
import { FiSearch, FiFilter, FiChevronRight } from "react-icons/fi";
import { FaPrescription } from "react-icons/fa";
import { HiOutlineCube } from "react-icons/hi2";
import { BiSortAlt2 } from "react-icons/bi";

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
  AppMenu,
} from "@/components";

const GlobalProductsMobilePage = ({
  products = [],
  filters,
  hasFilteredProducts,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handlePageChange,
  handlePageSizeChange,
  handleViewProductDetails,
  currentPage,
  pageSize = 10,
  totalProducts = 0,
  totalPages,
}) => {
  const shouldRenderPagination = hasFilteredProducts && totalProducts > 0;

  // Local state to toggle filter row visibility (matching the 'Filter' button logic in typical mobile apps)
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Header Block */}
        <AppBox sx={headerWrapperSx}>
          <AppHeading level={1} weight={700} sx={pageTitleSx}>
            Global Products
          </AppHeading>
          <AppText variant="body2" sx={pageSubtitleSx}>
            Manage products available globally across workspaces.
          </AppText>
        </AppBox>

        {/* Search Row */}
        <AppBox sx={searchWrapperSx}>
          <AppStack direction="row" align="center" gap={1}>
            <AppSearchInput
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search global products..."
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
            Filter
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
            Sort: Newest First
          </AppButton>
        </AppBox>

        {/* Product Cards List */}
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
                  No products found
                </AppHeading>
                <AppText
                  variant="body2"
                  align="center"
                  sx={emptyStateSubTextSx}
                >
                  Refine keywords or filters to inspect master global catalog.
                </AppText>
                {filters.search && (
                  <AppButton
                    variant="text"
                    colorVariant="primary"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </AppButton>
                )}
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1.2}>
              {products.map((product) => {
                const nameString =
                  product.displayName || product.name || "Paracetamol";
                const defaultGenericName = nameString.includes(" ")
                  ? nameString.split(" ")[0]
                  : nameString;

                const isMedicine =
                  product.productType?.toLowerCase() === "medicine";

                return (
                  <AppCard
                    key={product._id}
                    variant="default"
                    rounded="lg"
                    bordered={false}
                    shadow="sm"
                    padding="none"
                    onClick={() => handleViewProductDetails(product)}
                    sx={productCardSx}
                  >
                    <AppStack direction="row" align="center" gap={1.5}>
                      {/* Left Avatar block */}
                      <AppBox sx={avatarFrameSx}>
                        <HiOutlineCube className="text-[24px]" />
                      </AppBox>

                      {/* Center Info Block */}
                      <AppBox sx={{ minWidth: 0, flex: 1 }}>
                        <AppHeading level={3} weight={700} sx={productTitleSx}>
                          {product.displayName}
                        </AppHeading>
                        <AppText variant="body2" sx={productPackSx}>
                          Pack Qty: {product.pack || "10 x 10 Tablets"}
                        </AppText>
                        <AppText variant="body2" sx={productCategorySx}>
                          {product.displayCategory} •{" "}
                          {product.displayDosageForm}
                        </AppText>
                      </AppBox>

                      {/* Right Info Block (Manufacturer + Product Type + Composition) */}
                      <AppStack
                        direction="column"
                        align="flex-start"
                        gap={0.5}
                        sx={{
                          pl: 1.5,
                          borderLeft:
                            "1px solid color-mix(in_srgb, var(--app-color-border) 60%, transparent)",
                          minWidth: { xs: 90, sm: 110 },
                          maxWidth: { xs: 100, sm: 125 },
                          flexShrink: 0,
                        }}
                      >
                        <AppStack direction="row" align="center" gap={0.5}>
                          <AppTag
                            label={product.displayManufacturer || "Unknown"}
                            variant="soft"
                            colorVariant="primary"
                            rounded="md"
                            sx={manufacturerTagSx}
                          />
                          {isMedicine &&
                            product.medicineDetails?.prescriptionRequired?.toLowerCase() ===
                              "yes" && (
                              <AppBox
                                sx={rxBadgeSx}
                                title="Prescription Required"
                              >
                                <FaPrescription />
                              </AppBox>
                            )}
                        </AppStack>
                        <AppText variant="body2" sx={productTypeValueSx}>
                          {isMedicine ? "Medicine" : "OTC"}
                        </AppText>
                        {isMedicine ? (
                          <AppText
                            variant="body2"
                            sx={productCompositionSxRight}
                          >
                            {product.medicineDetails?.composition ||
                              defaultGenericName}
                          </AppText>
                        ) : (
                          <AppText
                            variant="body2"
                            sx={productCompositionSxRight}
                          >
                            {product.otcDetails?.type || "OTC"}
                          </AppText>
                        )}
                      </AppStack>
                    </AppStack>
                  </AppCard>
                );
              })}

              {/* Global Scope Informational Banner matching the 'Workspace Scope' style */}
              <AppCard
                variant="default"
                rounded="lg"
                bordered={false}
                shadow="none"
                padding="md"
                sx={scopeBannerSx}
              >
                <AppStack direction="row" align="flex-start" gap={1.5}>
                  <HiOutlineCube className="text-[28px] text-success" />
                  <AppBox>
                    <AppHeading level={3} weight={700} sx={scopeTitleSx}>
                      Global Scope
                    </AppHeading>
                    <AppText variant="body2" sx={scopeTextSx}>
                      These products are globally available. You can view them,
                      but editing requires global privileges.
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
              showFirstLast={false}
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
    </section>
  );
};

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
  pt: 1,
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
  py: 1.5,
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
  width: 46,
  height: 46,
  borderRadius: "10px",
  bgcolor: "color-mix(in_srgb, var(--app-color-success) 10%, transparent)",
  color: "var(--app-color-success)",
  flexShrink: 0,
};

const productTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 160,
};

const productPackSx = {
  mt: 0.25,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

const productCategorySx = {
  mt: 0.5,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

const manufacturerTagSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 0.8,
  maxWidth: 80,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const productTypeValueSx = {
  fontSize: "9px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  lineHeight: 1.2,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const rxBadgeSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 20,
  borderRadius: "6px",
  bgcolor: "color-mix(in_srgb, var(--app-color-error) 10%, transparent)",
  color: "var(--app-color-error)",
  fontSize: "11px",
  flexShrink: 0,
};

const productCompositionSxRight = {
  mt: 0.25,
  fontSize: "9px",
  color: "var(--app-color-text-muted)",
  textAlign: "left",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100%",
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

export default GlobalProductsMobilePage;
