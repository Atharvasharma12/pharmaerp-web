// src/features/marketplace/products/pages/mobile/CreateMarketplaceProductMobilePage.jsx

import React from "react";
import {
  FiSearch,
  FiChevronRight,
  FiPlus,
  FiShoppingBag,
  FiArrowLeft,
} from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi2";

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
  AppInput,
  AppSwitch,
  AppIconButton,
} from "@/components";

const CreateMarketplaceProductMobilePage = ({
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
  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Header Block with Back button */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" gap={1.2}>
            <AppIconButton
              icon={<FiArrowLeft />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleCancel}
            />
            <div className="min-w-0">
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Enable Products
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                List products for online storefront orders
              </AppText>
            </div>
          </AppStack>
        </AppBox>

        {/* Store storefront target dropdown */}
        <AppBox sx={{ px: 0, pb: 1.5 }}>
          <label className="block text-[11px] font-semibold text-text mb-1">
            Target Storefront *
          </label>
          <AppSelect
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            options={storeOptions}
            size="small"
            variant="bordered"
            rounded="md"
            className="w-full"
            inputSx={searchInputSx}
          />
        </AppBox>

        {/* Search Input */}
        <AppBox sx={searchWrapperSx}>
          <AppSearchInput
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search global medicines..."
            clearable
            onClear={() => handleSearchChange("")}
            size="large"
            variant="bordered"
            rounded="md"
            sx={searchBarSx}
            inputSx={searchInputSx}
          />
        </AppBox>

        {/* Cards Stream */}
        <AppBox sx={listingListWrapperSx}>
          {globalProducts.length === 0 ? (
            <AppCard variant="default" rounded="md" bordered padding="md" sx={emptyCardContainerSx}>
              <AppStack direction="column" align="center" justify="center" gap={1} sx={{ py: 4, width: "100%" }}>
                <FiSearch className="text-[28px] text-text-muted/60" />
                <AppHeading level={3} weight={700} align="center" sx={{ m: 0, fontSize: "13px", width: "100%" }}>
                  No global products found
                </AppHeading>
                <AppText variant="body2" align="center" sx={emptyStateSubTextSx}>
                  Refine keywords to search platform catalog.
                </AppText>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1.2}>
              {globalProducts.map((pricingRecord) => {
                const product = pricingRecord.globalProductId || {};
                return (
                  <AppCard
                    key={pricingRecord._id}
                    variant="default"
                    rounded="lg"
                    bordered={false}
                    shadow="sm"
                    padding="none"
                    sx={productCardSx}
                  >
                    <AppStack direction="row" align="center" gap={1.5} justify="space-between" sx={{ width: "100%" }}>
                      <AppStack direction="row" align="center" gap={1.5} sx={{ minWidth: 0, flex: 1 }}>
                        <AppBox sx={avatarFrameSx}>
                          <HiOutlineCube className="text-[24px]" />
                        </AppBox>

                        <AppBox sx={{ minWidth: 0, flex: 1 }}>
                          <AppHeading level={3} weight={700} sx={productTitleSx}>
                            {product.name}
                          </AppHeading>
                          <AppText variant="body2" sx={productPackSx} className="text-success font-semibold">
                            Sell Price: ₹{pricingRecord.customerPrice || "0.00"} (MRP: ₹{pricingRecord.mrp || "0.00"})
                          </AppText>
                          <AppText variant="body2" sx={productCategorySx}>
                            {product.productType || "Medicine"} • {product.pack || "-"}
                          </AppText>
                        </AppBox>
                      </AppStack>

                      {pricingRecord.isEnabled ? (
                        <AppTag
                          label="Enabled"
                          variant="soft"
                          colorVariant="success"
                          rounded="md"
                          sx={statusBadgeSx}
                        />
                      ) : (
                        <AppButton
                          size="small"
                          variant="contained"
                          colorVariant="success"
                          onClick={() => handleOpenEnableModal(pricingRecord)}
                          sx={{ flexShrink: 0 }}
                        >
                          Enable
                        </AppButton>
                      )}
                    </AppStack>
                  </AppCard>
                );
              })}
            </AppStack>
          )}
        </AppBox>
      </AppBox>

      {/* Pagination Block */}
      {globalProducts.length > 0 && totalProducts > 10 && (
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

      {/* Configuration Sheet Modal (Simple, no blur) */}
      {productToEnable && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(15,23,42,0.6)]">
          <AppCard className="w-full rounded-t-2xl p-5 space-y-4 bg-surface border-t border-border shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <AppHeading level={2} sx={modalTitleSx}>
                  Configure Online Listing
                </AppHeading>
                <AppText variant="body2" sx={modalSubtitleSx}>
                  {productToEnable.globalProductId?.name}
                </AppText>
              </div>
            </div>

            <div className="space-y-3.5 py-1">
              <div>
                <label className="block text-[11px] font-semibold text-text mb-1">
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
                <label className="block text-[11px] font-semibold text-text mb-1">
                  Prescription Requirements
                </label>
                <AppSelect
                  name="prescriptionRequired"
                  value={formData.prescriptionRequired}
                  onChange={handleFormChange}
                  options={[
                    { label: "Rx Prescription Not Required", value: "NOT_REQUIRED" },
                    { label: "Rx Prescription Required", value: "REQUIRED" },
                  ]}
                  size="small"
                  variant="bordered"
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between p-2 bg-surface-alt border border-border rounded-lg">
                <div>
                  <AppText variant="body2" className="font-semibold text-text text-[11.5px]">
                    Featured Online Product
                  </AppText>
                  <AppText size="xs" color="muted">
                    Show on homepage recommendations
                  </AppText>
                </div>
                <AppSwitch
                  checked={formData.isFeatured}
                  onChange={(checked) =>
                    handleFormChange({ target: { name: "isFeatured", value: checked, type: "checkbox", checked } })
                  }
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text mb-1">
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

            <div className="flex gap-2 pt-3 border-t border-border">
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="neutral"
                className="flex-1"
                onClick={handleCloseEnableModal}
                disabled={isSubmitting}
              >
                Cancel
              </AppButton>
              <AppButton
                type="button"
                variant="contained"
                colorVariant="success"
                className="flex-1"
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

/* Tokenized Design System Dictionaries */
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
  boxShadow: "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
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

const modalTitleSx = {
  m: 0,
  fontSize: "14px",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const modalSubtitleSx = {
  mt: 0.15,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const statusBadgeSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 1,
  textTransform: "capitalize",
};

export default CreateMarketplaceProductMobilePage;
