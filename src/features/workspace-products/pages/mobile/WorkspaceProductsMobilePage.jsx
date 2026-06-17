// src/features/workspace-products/pages/mobile/WorkspaceProductsMobilePage.jsx

import { useMemo } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiMoreHorizontal,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiUpload,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi2";
import { BiCheckShield, BiXCircle } from "react-icons/bi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppMenu,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
} from "@/components";

const statIcons = {
  total_products: <HiOutlineCube />,
  active_products: <BiCheckShield />,
  inactive_products: <BiXCircle />,
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const WorkspaceProductsMobilePage = ({
  products = [],
  dashboardStats = [],
  filters,
  productTypeOptions = [],
  totalProducts = 0,
  hasFilteredProducts,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleRefresh,
  handleCreateProduct,
  handleViewProductDetails,
  handleEditProduct,
  handleDeleteProduct,
  handleImportWorkspaceProducts,
}) => {
  const shouldRenderPagination = hasFilteredProducts && totalProducts > 10;

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Expanded Width Title Header Section */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Custom Products
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                Workspace local product modifications.
              </AppText>
            </AppBox>

            <AppStack
              direction="row"
              align="center"
              gap={0.5}
              sx={{ flexShrink: 0 }}
            >
              <AppIconButton
                icon={<FiRefreshCw />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleRefresh}
                sx={actionHeaderIconBtnSx}
              />
              <AppIconButton
                icon={<FiUpload />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleImportWorkspaceProducts}
                sx={actionHeaderIconBtnSx}
              />
              <AppButton
                variant="contained"
                colorVariant="success"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleCreateProduct}
                sx={addBtnSx}
              >
                Create
              </AppButton>
            </AppStack>
          </AppStack>
        </AppBox>

        {/* High-Density Stats Grid Row */}
        <AppBox sx={statsGridWrapperSx}>
          <div className="grid grid-cols-3 gap-1.5">
            {dashboardStats.map((stat) => (
              <AppCard
                key={stat.id}
                variant="default"
                rounded="md"
                bordered
                shadow="none"
                padding="none"
                sx={compactStatCardSx}
              >
                <AppStack direction="row" align="center" gap={0.5}>
                  <AppBox
                    sx={{
                      ...compactStatIconSx,
                      bgcolor: `var(--app-color-${stat.colorVariant}-soft)`,
                      color: `var(--app-color-${stat.colorVariant})`,
                    }}
                  >
                    {statIcons[stat.id] || <HiOutlineCube />}
                  </AppBox>
                  <AppBox sx={{ minWidth: 0 }}>
                    <AppHeading level={3} weight={800} sx={compactStatValueSx}>
                      {stat.value}
                    </AppHeading>
                    <AppText variant="body2" sx={compactStatTitleSx}>
                      {stat.title.split(" ")[0]}
                    </AppText>
                  </AppBox>
                </AppStack>
              </AppCard>
            ))}
          </div>
        </AppBox>

        {/* Filter Selection Panel */}
        <AppBox sx={filterSectionSx}>
          <div className="grid grid-cols-1 gap-2">
            <AppSearchInput
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search custom catalog by name..."
              clearable
              onClear={() => handleSearchChange("")}
              size="small"
              variant="bordered"
              rounded="md"
              sx={searchBarSx}
              inputSx={inputOverrideSx}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <AppSelect
              name="productType"
              value={filters.productType}
              onChange={handleFilterChange}
              options={productTypeOptions}
              size="small"
              variant="bordered"
              rounded="md"
              sx={selectInputSx}
              inputSx={inputOverrideSx}
            />
            <AppSelect
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={statusOptions}
              size="small"
              variant="bordered"
              rounded="md"
              sx={selectInputSx}
              inputSx={inputOverrideSx}
            />
          </div>
        </AppBox>

        {/* Edge-Aligned Counter Info Bar */}
        <AppBox sx={metaActionRowSx}>
          <AppText variant="body2" weight={700} sx={countLabelTextSx}>
            Showing {products.length} of {totalProducts} Products
          </AppText>
          <AppButton
            variant="text"
            colorVariant="neutral"
            size="small"
            startIcon={<FiRefreshCw />}
            onClick={handleClearFilters}
            sx={resetTextLinkSx}
          >
            Reset
          </AppButton>
        </AppBox>

        {/* High-Density Stream Listing */}
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
                  Refine keywords or reset filter choices to load targets.
                </AppText>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1}>
              {products.map((product) => (
                <AppCard
                  key={product._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  onClick={() => handleViewProductDetails(product)}
                  sx={listingItemCardSx}
                >
                  <AppStack
                    direction="row"
                    align="flex-start"
                    justify="space-between"
                    gap={1}
                  >
                    <AppStack direction="row" align="center" gap={1}>
                      <AppBox sx={avatarFrameSx}>
                        <HiOutlineCube />
                      </AppBox>

                      <AppBox sx={{ minWidth: 0 }}>
                        <AppHeading level={2} weight={800} sx={cardTitleTextSx}>
                          {product.displayName}
                        </AppHeading>
                        <AppText variant="body2" sx={cardSubTextSx}>
                          SKU: {product.displaySku} ·{" "}
                          {product.displayManufacturer}
                        </AppText>
                        {(product.displayDosageForm !== "-" ||
                          product.displayStrength !== "-") && (
                          <AppText variant="body2" sx={cardFormTextSx}>
                            {product.displayDosageForm} ·{" "}
                            {product.displayStrength}
                          </AppText>
                        )}
                      </AppBox>
                    </AppStack>

                    <AppStack
                      direction="row"
                      align="center"
                      gap={0.25}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <AppStatusBadge
                        status={product.displayStatus}
                        label={product.displayStatus || ""}
                        variant="soft"
                        size="small"
                        rounded="md"
                        colorVariant={
                          statusColorMap[product.displayStatus] || "neutral"
                        }
                        sx={statusBadgeOverrideSx}
                      />
                      <RowActionDropdownTrigger
                        product={product}
                        onView={handleViewProductDetails}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                      />
                    </AppStack>
                  </AppStack>

                  <div className="w-full h-[1px] bg-divider my-2" />

                  <AppStack
                    direction="row"
                    align="center"
                    justify="space-between"
                    gap={1}
                  >
                    <AppTag
                      label={product.displayCategory}
                      variant="soft"
                      colorVariant="purple"
                      rounded="sm"
                      sx={typeTagOverrideSx}
                    />
                    <AppText variant="body2" sx={sourceLabelSx}>
                      {product.displayAvailability}
                    </AppText>
                  </AppStack>
                </AppCard>
              ))}
            </AppStack>
          )}
        </AppBox>

        {/* Intelligent Pagination Section */}
        {shouldRenderPagination && (
          <AppBox sx={paginationFooterWrapperSx}>
            <AppStack
              direction="row"
              align="center"
              justify="space-between"
              gap={1}
            >
              <AppSelect
                name="pageSizeSelect"
                value="10"
                options={[{ label: "10 per page", value: "10" }]}
                size="small"
                variant="bordered"
                rounded="md"
                sx={pageSizeSelectSx}
                inputSx={paginationInputBoxOverrideSx}
              />

              <AppStack direction="row" align="center" gap={0.5}>
                <AppIconButton
                  icon={<FiChevronLeft />}
                  variant="outlined"
                  colorVariant="neutral"
                  size="small"
                  rounded="md"
                  disabled
                  sx={paginationArrowBtnSx}
                />
                <span className="flex h-[30px] min-w-[30px] items-center justify-center rounded-md bg-primary text-[11.5px] font-bold text-text-inverse shadow-sm">
                  1
                </span>
                <AppIconButton
                  icon={<FiChevronRight />}
                  variant="outlined"
                  colorVariant="neutral"
                  size="small"
                  rounded="md"
                  disabled={totalProducts <= 10}
                  sx={paginationArrowBtnSx}
                />
              </AppStack>
            </AppStack>
          </AppBox>
        )}
      </AppBox>
    </section>
  );
};

const RowActionDropdownTrigger = ({ product, onView, onEdit, onDelete }) => {
  const menuConfigItems = [
    {
      id: "view",
      label: "View Details",
      icon: <FiEye />,
      onClick: () => onView?.(product),
    },
    {
      id: "edit",
      label: "Edit Product",
      icon: <FiEdit2 />,
      onClick: () => onEdit?.(product),
    },
    { id: "divider_row", type: "divider" },
    {
      id: "delete",
      label: "Delete Product",
      icon: <FiTrash2 />,
      danger: true,
      onClick: () => onDelete?.(product),
    },
  ];

  return (
    <AppMenu
      trigger={
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="inline-flex h-7 w-7 items-center justify-center border-0 bg-transparent p-0 text-text-muted transition hover:text-text focus:outline-none"
        >
          <FiMoreHorizontal className="text-[17px]" />
        </button>
      }
      triggerProps={{
        onClick: (e) => {
          e.stopPropagation();
          e.preventDefault();
        },
      }}
      items={menuConfigItems}
      dense
      minWidth={165}
    />
  );
};

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
const headerWrapperSx = { pt: 1.5, pb: 1, px: 0.5 };
const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};
const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};
const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};
const addBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 750,
  px: 1.2,
  boxShadow: "var(--app-shadow-xs)",
  "& .MuiButton-startIcon": { marginRight: "4px", fontSize: "12px" },
};

const statsGridWrapperSx = { px: 0.5, pb: 1.25 };
const compactStatCardSx = {
  p: 0.65,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};
const compactStatIconSx = {
  display: "flex",
  alignItems: "center",
  justifycontent: "center",
  width: 24,
  height: 24,
  borderRadius: "6px",
  fontSize: "12px",
  flexShrink: 0,
};
const compactStatValueSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1,
  color: "var(--app-color-text)",
};
const compactStatTitleSx = {
  fontSize: "9px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
  lineHeight: 1,
  mt: 0.1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const filterSectionSx = { px: 0.5, pb: 1.25 };
const searchBarSx = { width: "100%" };
const selectInputSx = { width: "100%" };
const inputOverrideSx = {
  height: 35,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const metaActionRowSx = {
  display: "flex",
  alignItems: "center",
  justifycontent: "space-between",
  px: 0.5,
  py: 0.75,
  borderTop: "1px solid var(--app-color-divider)",
  borderBottom: "1px solid var(--app-color-divider)",
  bgcolor: "var(--app-color-surface-alt)",
};
const countLabelTextSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};
const resetTextLinkSx = {
  p: 0,
  minWidth: "auto",
  height: "auto",
  fontSize: "11px",
  fontWeight: 750,
  color: "var(--app-color-text)",
  "& .MuiButton-startIcon": { marginRight: "3px", fontSize: "10.5px" },
};

const listingListWrapperSx = {
  px: 0.5,
  py: 1.25,
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 25%, transparent)",
  overflowY: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none", width: 0, height: 0 },
};
const emptyCardContainerSx = {
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  width: "100%",
};
const emptyStateSubTextSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  px: 2,
  textAlign: "center",
  width: "100%",
};

const listingItemCardSx = {
  p: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  cursor: "pointer",
};
const avatarFrameSx = {
  display: "flex",
  alignItems: "center",
  justifycontent: "center",
  width: 36,
  height: 36,
  borderRadius: "50%",
  fontSize: "15px",
  flexShrink: 0,
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
};
const cardTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};
const cardSubTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  mt: 0.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const cardFormTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  mt: 0.05,
};

const statusBadgeOverrideSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 750,
  px: 1,
  textTransform: "capitalize",
};
const typeTagOverrideSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 750,
  px: 1,
};
const sourceLabelSx = {
  fontSize: "10px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const paginationFooterWrapperSx = {
  px: 0.5,
  pt: 1.25,
  pb: 2,
  borderTop: "1px solid var(--app-color-divider)",
};
const pageSizeSelectSx = { width: 112 };
const paginationInputBoxOverrideSx = {
  height: 30,
  fontSize: "11px",
  bgcolor: "var(--app-color-surface)",
};
const paginationArrowBtnSx = {
  height: 30,
  width: 30,
  minWidth: 30,
  borderColor: "var(--app-color-border)",
};

export default WorkspaceProductsMobilePage;
