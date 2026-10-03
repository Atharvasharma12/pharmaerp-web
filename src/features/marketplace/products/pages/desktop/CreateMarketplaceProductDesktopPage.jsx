// src/features/marketplace/products/pages/desktop/CreateMarketplaceProductDesktopPage.jsx

import React from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiShoppingBag,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi2";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppEmptyState,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppTable,
  AppTableSkeleton,
  AppTag,
  AppText,
  AppSwitch,
  PageHeader,
  PageRightSidebar,
  HELP_SUPPORT_CARD,
  AppSearchInput,
} from "@/components";

const CreateMarketplaceProductDesktopPage = ({
  globalProducts = [],
  totalProducts = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  isLoading = false,
  isSubmitting = false,
  error = null,
  message = null,
  selectedStoreId,
  setSelectedStoreId,
  storeOptions = [],
  searchQuery,
  handleSearchChange,
  handlePageChange,
  handlePageSizeChange,
  productToEnable,
  formData,
  handleFormChange,
  handleOpenEnableModal,
  handleCloseEnableModal,
  handleSaveEnableProduct,
  handleCancel,
  clearError,
  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && globalProducts.length === 0;

  const columns = [
    {
      id: "productName",
      key: "globalProductId.name",
      label: "Global Product Name",
      minWidth: 250,
      render: (_, pricingRecord) => {
        const product = pricingRecord?.globalProductId || {};
        return (
          <div className="flex items-center gap-3 min-w-0 h-full">
            <div className="flex items-center justify-center shrink-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-alt border border-border">
                <HiOutlineCube className="text-[16px] text-text-muted" />
              </span>
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <AppHeading level={3} weight={700} sx={productNameSx}>
                {product?.name || "-"}
              </AppHeading>
              {product?.marketer && (
                <AppText variant="body2" sx={productSubtitleSx}>
                  Marketer: {product.marketer}
                </AppText>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "sku",
      key: "globalProductId.globalProductCode",
      label: "SKU / Code",
      minWidth: 120,
      render: (_, pricingRecord) => {
        const product = pricingRecord?.globalProductId || {};
        return (
          <AppText variant="body2" sx={tableValueSx}>
            {product?.globalProductCode || "-"}
          </AppText>
        );
      },
    },
    {
      id: "productType",
      key: "globalProductId.productType",
      label: "Category",
      minWidth: 120,
      render: (_, pricingRecord) => {
        const product = pricingRecord?.globalProductId || {};
        return (
          <AppTag
            label={product?.productType || "Medicine"}
            variant="soft"
            colorVariant="purple"
            rounded="md"
            sx={tagSx}
          />
        );
      },
    },
    {
      id: "pricingInfo",
      key: "customerPrice",
      label: "Pricing Details",
      minWidth: 160,
      render: (_, pricingRecord) => (
        <div className="flex flex-col">
          <AppText
            variant="body2"
            sx={tableValueSx}
            className="text-success-dark"
          >
            Sell Price: ₹{pricingRecord?.customerPrice || "0.00"}
          </AppText>
          <AppText size="xs" color="muted">
            MRP: ₹{pricingRecord?.mrp || "0.00"} • Settlement: ₹
            {pricingRecord?.partnerSettlementPrice || "0.00"}
          </AppText>
        </div>
      ),
    },
    {
      id: "pack",
      key: "globalProductId.pack",
      label: "Packaging",
      minWidth: 100,
      render: (_, pricingRecord) => {
        const product = pricingRecord?.globalProductId || {};
        return (
          <AppText variant="body2" sx={tableValueMutedSx}>
            {product?.pack || "-"}
          </AppText>
        );
      },
    },
    {
      id: "actions",
      key: "actions",
      label: "Action",
      align: "right",
      width: 120,
      render: (_, pricingRecord) => {
        if (pricingRecord.isEnabled) {
          return (
            <AppTag
              label="Enabled"
              variant="soft"
              colorVariant="success"
              rounded="md"
              sx={tagSx}
            />
          );
        }
        return (
          <AppButton
            size="xs"
            variant="contained"
            colorVariant="success"
            startIcon={<FiPlus />}
            onClick={() => handleOpenEnableModal(pricingRecord)}
          >
            Enable
          </AppButton>
        );
      },
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page Header */}
        <PageHeader
          title="Enable Store Products"
          subtitle="Select global catalog products to list and sell online on your digital store."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Marketplace Products", onClick: handleCancel },
                { label: "Enable Products", current: true },
              ]}
            />
          }
          actions={
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiArrowLeft />}
              onClick={handleCancel}
              sx={secondaryButtonSx}
            >
              Back to Catalog
            </AppButton>
          }
        />

        {error && (
          <AppAlert
            severity="error"
            variant="soft"
            closable
            onClose={clearError}
            className="mt-3"
          >
            {error}
          </AppAlert>
        )}

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_290px] items-start gap-5">
          {/* Main Card with Global Products */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={tableCardSx}
          >
            {/* Store Selection & Search Toolbar */}
            <div className="border-b border-border px-3.5 py-3">
              <div className="grid grid-cols-[200px_minmax(0,1fr)] items-center gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text mb-1">
                    Select Target Storefront *
                  </label>
                  <AppSelect
                    value={selectedStoreId}
                    onChange={(e) => setSelectedStoreId(e.target.value)}
                    options={storeOptions}
                    size="small"
                    variant="bordered"
                    rounded="md"
                    sx={selectSx}
                    inputSx={filterInputSx}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text mb-1">
                    Search Global Catalog (Pricing Master)
                  </label>
                  <AppSearchInput
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search medicines by name or SKU..."
                    clearable
                    onClear={() => handleSearchChange("")}
                    size="small"
                    variant="bordered"
                    rounded="md"
                    sx={searchSx}
                    inputSx={filterInputSx}
                  />
                </div>
              </div>
            </div>

            {/* List Table */}
            {showInitialSkeleton ? (
              <AppTableSkeleton rows={8} columns={6} showHeader={false} />
            ) : globalProducts.length === 0 ? (
              <AppEmptyState
                title="No catalog products found"
                description="Try refining your search keyword."
                icon={<HiOutlineCube />}
                size="page"
                sx={stateSx}
              />
            ) : (
              <AppTable
                columns={columns}
                rows={globalProducts}
                getRowId={(row) => row._id}
                dense
                bordered={false}
                rounded={false}
                hover
                stickyHeader
                minWidth={1000}
                maxHeight="calc(100vh - 340px)"
                sx={tableSx}
                headSx={tableHeadSx}
                cellSx={tableCellSx}
              />
            )}

            {globalProducts.length > 0 && totalProducts > 10 ? (
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

          {/* Right Setup Panel */}
          <div className="space-y-4">
            <AppCard
              bordered
              shadow="sm"
              rounded="lg"
              sx={{ p: 2.5, spaceY: 3 }}
            >
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <FiInfo className="text-primary text-base" />
                <AppHeading level={3} sx={guideTitleSx}>
                  Selling Guidelines
                </AppHeading>
              </div>

              <div className="space-y-2.5 text-[11.5px] text-text-muted leading-relaxed pt-1">
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="text-success text-[13px] shrink-0 mt-0.5" />
                  <span>
                    Enabling a global product makes it active on your online
                    storefront catalog immediately.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="text-success text-[13px] shrink-0 mt-0.5" />
                  <span>
                    Configure featured status to highlight high-demand items on
                    your store homepage.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="text-success text-[13px] shrink-0 mt-0.5" />
                  <span>
                    Only products with active Platform Pricing are shown and can
                    be sold online.
                  </span>
                </div>
              </div>
            </AppCard>

            <PageRightSidebar cards={[HELP_SUPPORT_CARD]} />
          </div>
        </div>
      </div>

      {/* Enable Product Form Dialog Backdrop & Modal (Simple, no blur) */}
      {productToEnable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.6)] px-4">
          <AppCard className="w-full max-w-lg p-5 space-y-4 bg-surface border border-border shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <AppStack direction="row" align="center" gap={1.2}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary text-[18px]">
                  <FiShoppingBag />
                </div>
                <div className="min-w-0">
                  <AppHeading level={2} sx={modalTitleSx}>
                    Configure Online Product
                  </AppHeading>
                  <AppText variant="body2" sx={modalSubtitleSx}>
                    {productToEnable.globalProductId?.name}
                  </AppText>
                </div>
              </AppStack>
            </div>

            <div className="space-y-4 py-1">
              <div>
                <label className="block text-[11.5px] font-semibold text-text mb-1.5">
                  Storefront Visibility
                </label>
                <AppSelect
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleFormChange}
                  options={[
                    { label: "Visible (Default)", value: "VISIBLE" },
                    { label: "Hidden", value: "HIDDEN" },
                    { label: "Search Only", value: "SEARCH_ONLY" },
                  ]}
                  size="small"
                  variant="bordered"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-text mb-1.5">
                  Prescription Requirements
                </label>
                <AppSelect
                  name="prescriptionRequired"
                  value={formData.prescriptionRequired}
                  onChange={handleFormChange}
                  options={[
                    {
                      label: "Rx Prescription Not Required",
                      value: "NOT_REQUIRED",
                    },
                    { label: "Rx Prescription Required", value: "REQUIRED" },
                  ]}
                  size="small"
                  variant="bordered"
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-surface-alt border border-border rounded-lg">
                <div>
                  <AppText
                    variant="body2"
                    className="font-semibold text-text text-[12px]"
                  >
                    Featured Online Product
                  </AppText>
                  <AppText size="xs" color="muted">
                    Display prominently in homepage recommendations
                  </AppText>
                </div>
                <AppSwitch
                  checked={formData.isFeatured}
                  onChange={(checked) =>
                    handleFormChange({
                      target: {
                        name: "isFeatured",
                        value: checked,
                        type: "checkbox",
                        checked,
                      },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-text mb-1.5">
                  Sort Order Rank
                </label>
                <AppInput
                  name="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={handleFormChange}
                  size="small"
                  variant="bordered"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                size="small"
                onClick={handleCloseEnableModal}
                disabled={isSubmitting}
              >
                Cancel
              </AppButton>
              <AppButton
                type="button"
                variant="contained"
                colorVariant="success"
                size="small"
                onClick={handleSaveEnableProduct}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Enable Product
              </AppButton>
            </div>
          </AppCard>
        </div>
      )}
    </section>
  );
};

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

const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const guideTitleSx = {
  m: 0,
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const tableCardSx = {
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const filterInputSx = {
  minHeight: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const searchSx = { width: "100%" };
const selectSx = { width: "100%" };

const productNameSx = {
  m: 0,
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const productSubtitleSx = {
  mt: 0.2,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const tableValueSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const tableValueMutedSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const tagSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 750,
  px: 1,
};

const footerTextSx = { fontSize: "12px", color: "var(--app-color-text-muted)" };

const pageSizeButtonSx = {
  height: 32,
  minWidth: 128,
  justifyContent: "space-between",
  px: 1.2,
  fontSize: "12px",
  fontWeight: 650,
};

const tableSx = { border: "none" };
const tableHeadSx = { bgcolor: "var(--app-color-surface-alt)" };
const tableCellSx = { py: 1.5, px: 2 };
const stateSx = { minHeight: 360 };

const modalTitleSx = {
  m: 0,
  fontSize: "14.5px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const modalSubtitleSx = {
  mt: 0.15,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

export default CreateMarketplaceProductDesktopPage;
