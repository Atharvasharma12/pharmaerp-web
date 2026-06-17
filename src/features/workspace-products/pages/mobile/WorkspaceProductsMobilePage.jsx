// src/features/workspace-products/pages/mobile/WorkspaceProductsMobilePage.jsx

import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiPlus,
  FiMoreVertical,
  FiEye,
  FiEdit3,
} from "react-icons/fi";
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

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const WorkspaceProductsMobilePage = ({
  products = [],
  filters,
  hasFilteredProducts,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handlePageChange,
  handlePageSizeChange,
  handleViewProductDetails,
  handleCreateProduct,
  handleEditProduct,
  currentPage,
  pageSize = 10,
  totalProducts = 0,
  totalPages,
}) => {
  const shouldRenderPagination = hasFilteredProducts && totalProducts > 0;
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="w-full bg-bg">
      {/* Root Container flush inside the global app shell layout */}
      <AppBox sx={containerSx}>
        {/* Title block with main "+ Add Product" button in green */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" sx={{ width: "100%" }}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Workspace Products
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Manage products within your workspace
              </AppText>
            </AppBox>
            <AppButton
              variant="contained"
              colorVariant="success"
              rounded="md"
              startIcon={<FiPlus />}
              onClick={handleCreateProduct}
              sx={greenAddProductBtnSx}
            >
              Add Product
            </AppButton>
          </AppStack>
        </AppBox>

        {/* Search Input (Full Width) */}
        <AppBox sx={searchWrapperSx}>
          <AppSearchInput
            name="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            clearable
            onClear={() => handleSearchChange("")}
            size="large"
            variant="bordered"
            rounded="md"
            sx={searchBarSx}
            inputSx={searchInputSx}
          />
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
                  No custom products found
                </AppHeading>
                <AppText
                  variant="body2"
                  align="center"
                  sx={emptyStateSubTextSx}
                >
                  Refine keywords or filters to inspect workspace catalog.
                </AppText>
                {(filters.search ||
                  filters.productType !== "all" ||
                  filters.status !== "all") && (
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
                return (
                  <AppCard
                    key={product._id}
                    variant="default"
                    rounded="lg"
                    bordered={false}
                    shadow="sm"
                    padding="none"
                    sx={productCardSx}
                  >
                    <AppStack direction="row" align="center" gap={1.5} justify="space-between" sx={{ width: "100%" }}>
                      <AppStack
                        direction="row"
                        align="center"
                        gap={1.5}
                        sx={{ minWidth: 0, flex: 1, cursor: "pointer" }}
                        onClick={() => handleViewProductDetails(product)}
                      >
                        {/* Left Icon/Avatar Frame */}
                        <AppBox sx={avatarFrameSx}>
                          <HiOutlineCube className="text-[24px]" />
                        </AppBox>

                        {/* Center Info Block - Core Workspace Fields */}
                        <AppBox sx={{ minWidth: 0, flex: 1 }}>
                          <AppHeading level={3} weight={700} sx={productTitleSx}>
                            {product.displayName}
                          </AppHeading>
                          <AppText variant="body2" sx={productPackSx}>
                            Pack Qty: {product.pack || "-"}{" "}
                            {product.qty ? `(${product.qty})` : ""}
                          </AppText>
                          <AppText variant="body2" sx={productCategorySx}>
                            {product.displayCategory} •{" "}
                            {product.displayDosageForm}
                          </AppText>
                        </AppBox>
                      </AppStack>

                      {/* Right stack containing status/tags and Action dropdown menu */}
                      <AppStack direction="row" align="center" gap={1} sx={{ flexShrink: 0 }}>
                        <AppStack
                          direction="column"
                          align="flex-end"
                          gap={0.5}
                          sx={rightMetadataStackSx}
                        >
                          <AppTag
                            label={product.displayStatus || "inactive"}
                            variant="soft"
                            size="small"
                            rounded="md"
                            colorVariant={
                              statusColorMap[product.displayStatus] || "neutral"
                            }
                            sx={statusBadgeSx}
                          />

                          <AppText variant="body2" sx={hsnCodeTextSx}>
                            HSN: {product.HsnMaster?.code || "-"}
                          </AppText>
                        </AppStack>

                        {/* Dropdown Menu Action Button */}
                        <AppMenu
                          triggerIcon={<FiMoreVertical />}
                          items={[
                            {
                              label: "View Details",
                              icon: <FiEye />,
                              onClick: (e) => {
                                e.stopPropagation();
                                handleViewProductDetails(product);
                              },
                            },
                            {
                              label: "Edit Product",
                              icon: <FiEdit3 />,
                              onClick: (e) => {
                                e.stopPropagation();
                                handleEditProduct(product);
                              },
                            },
                          ]}
                          triggerProps={{
                            size: "small",
                            sx: {
                              color: "var(--app-color-text-muted)",
                              backgroundColor: "transparent",
                              border: "none",
                              p: 0.5,
                              minWidth: 0,
                              "&:hover": {
                                backgroundColor: "var(--app-color-surface-hover, #f1f5f9)",
                              },
                            },
                          }}
                        />
                      </AppStack>
                    </AppStack>
                  </AppCard>
                );
              })}

              {/* Workspace Scope Informational Banner */}
              <AppCard
                variant="default"
                rounded="lg"
                bordered={false}
                shadow="none"
                padding="md"
                sx={scopeBannerSx}
              >
                <AppStack direction="row" align="flex-start" gap={1.5}>
                  <HiOutlineCube className="text-[28px] text-primary" />
                  <AppBox>
                    <AppHeading level={3} weight={700} sx={scopeTitleSx}>
                      Workspace Scope
                    </AppHeading>
                    <AppText variant="body2" sx={scopeTextSx}>
                      These custom products are isolated strictly to this
                      workspace catalog. Downstream modules link them directly
                      using unified reference keys.
                    </AppText>
                  </AppBox>
                </AppStack>
              </AppCard>
            </AppStack>
          )}
        </AppBox>

        {/* Pagination Block */}
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

// ----------------------------------------------------------------------
// Tokenized Design System Dictionaries (sx Objects)
// ----------------------------------------------------------------------

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
  pb: 1.5,
  px: 0,
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  fontWeight: 800,
  color: "var(--app-color-text)",
  letterSpacing: "-0.5px",
};

const pageSubtitleSx = {
  mt: 0.4,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const greenAddProductBtnSx = {
  height: 36,
  px: 1.6,
  fontSize: "11.5px",
  fontWeight: 750,
  bgcolor: "var(--app-color-success, #10b981)",
  color: "var(--app-color-text-inverse, #ffffff)",
  "&:hover": {
    bgcolor: "color-mix(in_srgb, var(--app-color-success) 90%, black)",
  },
  boxShadow: "none",
  flexShrink: 0,
};

const searchWrapperSx = {
  px: 0,
  py: 0.5,
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
  py: 1.2,
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
  border: "none",
  boxShadow:
    "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
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
  bgcolor: "color-mix(in_srgb, var(--app-color-primary) 10%, transparent)",
  color: "var(--app-color-primary)",
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

const rightMetadataStackSx = {
  pl: 1.5,
  borderLeft:
    "1px solid color-mix(in_srgb, var(--app-color-border) 60%, transparent)",
  minWidth: { xs: 75, sm: 90 },
  maxWidth: { xs: 90, sm: 110 },
  flexShrink: 0,
};

const statusBadgeSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 1,
  textTransform: "capitalize",
};

const hsnCodeTextSx = {
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
    "color-mix(in_srgb, var(--app-color-primary) 4%, var(--app-color-surface))",
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

export default WorkspaceProductsMobilePage;
