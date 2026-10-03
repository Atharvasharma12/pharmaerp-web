// src/features/global-products/pages/desktop/GlobalProductsDesktopPage.jsx

import { useMemo } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiShield,
} from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi2";
import { BiCategory, BiBuildingHouse } from "react-icons/bi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppHeading,
  AppIconButton,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatCard,
  AppStatusBadge,
  AppTable,
  AppTableSkeleton,
  AppTag,
  AppText,
} from "@/components";

const statIcons = {
  total_products: <HiOutlineCube />,
  categories: <BiCategory />,
  manufacturers: <BiBuildingHouse />,
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const GlobalProductsDesktopPage = ({
  products = [],
  dashboardStats = [],
  filters,
  activeFilterChips = [],
  categoryOptions = [],
  dosageFormOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalProducts = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,

  hasProducts,
  hasFilteredProducts,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
  handleRefresh,
  handleBackToCatalog,
  handlePageChange,
  handlePageSizeChange,
  handleViewProductDetails,
  handleExportCatalog,
  handleViewImportHistory,
  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasProducts;

  const columns = [
    {
      id: "productName",
      key: "displayName",
      label: "Product Name",
      minWidth: 250,
      render: (_, product) => (
        <div className="flex items-center gap-3 min-w-0 h-full">
          <div className="flex items-center justify-center shrink-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-alt border border-border">
              <HiOutlineCube className="text-[16px] text-text-muted" />
            </span>
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            <AppHeading level={3} weight={700} sx={productNameSx}>
              {product?.displayName || "-"}
            </AppHeading>
            {product?.packagingDetail && (
              <AppText variant="body2" sx={productSubtitleSx}>
                {product.packagingDetail}
              </AppText>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "sku",
      key: "displaySku",
      label: "SKU",
      minWidth: 95,
      render: (_, product) => (
        <AppText variant="body2" sx={tableValueSx}>
          {product?.displaySku || "-"}
        </AppText>
      ),
    },
    {
      id: "category",
      key: "displayCategory",
      label: "Category",
      minWidth: 120,
      render: (_, product) => (
        <AppTag
          label={product?.displayCategory || "-"}
          variant="soft"
          colorVariant="primary"
          rounded="md"
          sx={tagSx}
        />
      ),
    },
    {
      id: "manufacturer",
      key: "displayManufacturer",
      label: "Manufacturer",
      minWidth: 190,
      render: (_, product) => (
        <AppText variant="body2" sx={descriptionSx}>
          {product?.displayManufacturer || "-"}
        </AppText>
      ),
    },
    {
      id: "dosageForm",
      key: "displayDosageForm",
      label: "Dosage Form",
      minWidth: 110,
      render: (_, product) => (
        <AppText variant="body2" sx={tableValueMutedSx}>
          {product?.displayDosageForm || "-"}
        </AppText>
      ),
    },
    {
      id: "strength",
      key: "displayStrength",
      label: "Strength",
      minWidth: 100,
      render: (_, product) => (
        <AppText variant="body2" sx={tableValueMutedSx}>
          {product?.displayStrength || "-"}
        </AppText>
      ),
    },
    {
      id: "status",
      key: "displayStatus",
      label: "Status",
      width: 100,
      render: (_, product) => (
        <AppStatusBadge
          status={product?.displayStatus || "inactive"}
          label={product?.displayStatus || "inactive"}
          variant="soft"
          size="small"
          rounded="md"
          colorVariant={statusColorMap[product?.displayStatus] || "neutral"}
          sx={statusBadgeSx}
        />
      ),
    },
    {
      id: "availability",
      key: "displayAvailability",
      label: "Availability",
      width: 100,
      render: (_, product) => (
        <AppText variant="body2" sx={tableValueMutedSx}>
          {product?.displayAvailability || "Global"}
        </AppText>
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 70,
      render: (_, product) => (
        <AppIconButton
          icon={<FiEye />}
          variant="text"
          colorVariant="neutral"
          size="small"
          rounded="md"
          onClick={() => handleViewProductDetails(product)}
          sx={actionButtonSx}
        />
      ),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <AppBox
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={pageHeaderSx}
        >
          <AppBox sx={pageHeaderContentSx}>
            <AppHeading level={1} weight={650}>
              Global Products
            </AppHeading>
            <AppText variant="body2" sx={pageHeaderSubtitleSx}>
              These products are globally available for all workspaces. You can
              view and use them in your workspace.
            </AppText>
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard", href: "/" },
                { label: "Catalog", href: "/catalog" },
                { label: "Global Products", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          </AppBox>

          <AppStack
            direction="row"
            align="center"
            justify="flex-end"
            gap={1.1}
            sx={{ flexShrink: 0 }}
          >
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiArrowLeft />}
              onClick={handleBackToCatalog}
              sx={secondaryButtonSx}
            >
              Back
            </AppButton>
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiRefreshCw />}
              onClick={handleRefresh}
              loading={isLoading}
              disabled={isLoading}
              sx={secondaryButtonSx}
            >
              Refresh
            </AppButton>
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiDownload />}
              onClick={handleExportCatalog}
              sx={secondaryButtonSx}
            >
              Export
            </AppButton>
            <AppButton
              type="button"
              variant="contained"
              colorVariant="primary"
              rounded="md"
              size="small"
              onClick={handleViewImportHistory}
              sx={primaryButtonSx}
            >
              Import History
            </AppButton>
          </AppStack>
        </AppBox>

        <StatsGrid stats={dashboardStats} />

        {error && !hasError ? (
          <AppAlert
            severity="error"
            variant="soft"
            title="Something went wrong"
            closable
            onClose={handleRefresh}
            sx={alertSx}
          >
            {error}
          </AppAlert>
        ) : null}

        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={tableCardSx}
        >
          <TableToolbar
            filters={filters}
            activeFilterChips={activeFilterChips}
            categoryOptions={categoryOptions}
            dosageFormOptions={dosageFormOptions}
            handleFilterChange={handleFilterChange}
            handleSearchChange={handleSearchChange}
            handleRemoveFilter={handleRemoveFilter}
            handleClearFilters={handleClearFilters}
          />

          {hasError ? (
            <AppErrorState
              title="Unable to load global catalog"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          ) : showInitialSkeleton ? (
            <AppTableSkeleton rows={8} columns={9} showHeader={false} />
          ) : !hasProducts ? (
            <AppEmptyState
              title="No products listed"
              description="The master global product catalog is currently empty."
              icon={<HiOutlineCube />}
              size="page"
              sx={stateSx}
            />
          ) : !hasFilteredProducts ? (
            <AppEmptyState
              title="No matching products found"
              description="Try changing your search or filters."
              icon={<FiSearch />}
              action={
                <AppButton
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : (
            <AppTable
              columns={columns}
              rows={products}
              getRowId={(row) => row._id}
              dense
              bordered={false}
              rounded={false}
              hover
              stickyHeader
              minWidth={1150}
              maxHeight="calc(100vh - 340px)"
              sx={tableSx}
              headSx={tableHeadSx}
              cellSx={tableCellSx}
            />
          )}

          {hasProducts && totalProducts > 10 ? (
            <TableFooter
              totalProducts={totalProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          ) : null}
        </AppCard>
      </div>
    </section>
  );
};

const TopToast = ({ message, onClose }) => (
  <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-32px)] max-w-md -translate-x-1/2">
    <AppAlert
      severity="success"
      variant="filled"
      title={message}
      closable
      onClose={onClose}
      sx={toastSx}
    />
  </div>
);

const StatsGrid = ({ stats }) => (
  <div className="mt-4 grid grid-cols-3 gap-3">
    {stats.map((stat) => (
      <AppStatCard
        key={stat.id}
        title={stat.title}
        value={stat.value}
        subtitle={stat.description}
        icon={statIcons[stat.id] || <HiOutlineCube />}
        colorVariant={stat.colorVariant}
        variant="default"
        sx={statCardSx}
        iconSx={statIconSx}
      />
    ))}
  </div>
);

const TableToolbar = ({
  filters,
  activeFilterChips,
  categoryOptions,
  dosageFormOptions,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3.5 py-3">
    <div className="grid grid-cols-[minmax(0,1fr)_128px_128px_128px_104px] items-center gap-3">
      <AppSearchInput
        name="search"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search products by name or SKU..."
        clearable
        onClear={() => handleSearchChange("")}
        size="small"
        variant="bordered"
        rounded="md"
        sx={searchSx}
        inputSx={filterInputSx}
      />

      <AppSelect
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
        options={categoryOptions}
        size="small"
        variant="bordered"
        rounded="md"
        sx={selectSx}
        inputSx={filterInputSx}
      />

      <AppSelect
        name="manufacturer"
        value={filters.manufacturer}
        onChange={handleFilterChange}
        options={[{ label: "All Marketers", value: "all" }]}
        size="small"
        variant="bordered"
        rounded="md"
        sx={selectSx}
        inputSx={filterInputSx}
      />

      <AppSelect
        name="productForm"
        value={filters.productForm}
        onChange={handleFilterChange}
        options={dosageFormOptions}
        size="small"
        variant="bordered"
        rounded="md"
        sx={selectSx}
        inputSx={filterInputSx}
      />

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        startIcon={<FiSearch />}
        sx={filterButtonSx}
      >
        Filters
      </AppButton>
    </div>

    {activeFilterChips.length ? (
      <AppStack direction="row" align="center" gap={0.7} sx={chipsRowSx}>
        {activeFilterChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => handleRemoveFilter(chip.key)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-alt px-2 py-1 text-[11px] font-semibold text-text-muted transition hover:bg-surface-hover"
          >
            {chip.label}
          </button>
        ))}

        <button
          type="button"
          onClick={handleClearFilters}
          className="text-[11px] font-semibold text-primary"
        >
          Clear all
        </button>
      </AppStack>
    ) : null}
  </div>
);

const TableFooter = ({
  totalProducts,
  currentPage,
  totalPages,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalProducts);

  return (
    <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
      <AppText variant="body2" sx={footerTextSx}>
        Showing {startEntry} to {endEntry} of {totalProducts} products
      </AppText>

      <AppStack direction="row" align="center" gap={1}>
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="neutral"
          rounded="md"
          size="small"
          endIcon={<FiChevronRight className="rotate-90" />}
          sx={pageSizeButtonSx}
        >
          {pageSize} per page
        </AppButton>

        <AppIconButton
          icon={<FiChevronLeft />}
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />

        <span className="flex h-[31px] min-w-[31px] items-center justify-center rounded-md bg-primary px-2 text-[12px] font-bold text-text-inverse">
          {currentPage}
        </span>

        <AppIconButton
          icon={<FiChevronRight />}
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </AppStack>
    </div>
  );
};

const pageHeaderSx = { width: "100%" };
const pageHeaderSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "25px",
    lineHeight: 1.15,
    letterSpacing: "-0.45px",
    color: "var(--app-color-text)",
  },
};

const breadcrumbSx = { mt: 1 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const primaryButtonSx = {
  height: 36,
  px: 1.6,
  fontSize: "12px",
  fontWeight: 700,
};
const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const alertSx = { mt: 3 };
const statCardSx = {
  minHeight: 88,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  p: 1.5,
  "& p:first-of-type": { fontSize: "11px" },
  "& h1, & h2, & h3, & h4": { fontSize: "18px" },
  "& p:last-of-type": { fontSize: "11px" },
};
const statIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "11px",
  "& svg": { fontSize: 19 },
};

const tableCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  "& > div": { minWidth: 0 },
};

const searchSx = { width: "100%" };
const selectSx = { width: "100%" };
const filterInputSx = {
  height: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};
const filterButtonSx = {
  height: 36,
  px: 1.25,
  fontSize: "12px",
  fontWeight: 650,
};
const chipsRowSx = { mt: 1.2, flexWrap: "wrap" };

const tableSx = {
  "& .MuiTableContainer-root": {
    borderRadius: 0,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": { display: "none" },
  },
};
const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
  "& .MuiTableCell-root": {
    fontSize: "11.2px",
    fontWeight: 750,
    color: "var(--app-color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
};
const tableCellSx = {
  py: 1.2,
  fontSize: "12px",
  borderColor: "var(--app-color-border)",
};
const tableValueSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};
const tableValueMutedSx = {
  fontSize: "12px",
  fontWeight: 550,
  color: "var(--app-color-text-muted)",
};

const productNameSx = {
  m: 0,
  maxWidth: 210,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};
const productSubtitleSx = {
  mt: 0.3,
  maxWidth: 250,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const tagSx = {
  width: "fit-content",
  height: 22,
  px: 0.8,
  fontSize: "10.5px",
  fontWeight: 700,
};
const descriptionSx = {
  maxWidth: 230,
  fontSize: "11.5px",
  lineHeight: "18px",
  color: "var(--app-color-text)",
};
const statusBadgeSx = {
  width: "fit-content",
  height: 22,
  px: 1.5,
  fontSize: "10.5px",
  fontWeight: 700,
  textTransform: "capitalize",
};
const actionButtonSx = { color: "var(--app-color-text-muted)" };

const footerTextSx = { fontSize: "12px", color: "var(--app-color-text-muted)" };
const pageSizeButtonSx = {
  height: 34,
  minWidth: 122,
  px: 1.2,
  fontSize: "12px",
  fontWeight: 600,
};
const stateSx = { minHeight: 430 };
const toastSx = { boxShadow: "var(--app-shadow-lg)" };

export default GlobalProductsDesktopPage;
