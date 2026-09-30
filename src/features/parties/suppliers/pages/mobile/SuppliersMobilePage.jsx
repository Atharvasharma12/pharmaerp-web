// src/features/parties/suppliers/pages/mobile/SuppliersMobilePage.jsx

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiFilter,
  FiMoreVertical,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiInfo,
} from "react-icons/fi";
import { LuStore } from "react-icons/lu";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { BiSortAlt2 } from "react-icons/bi";

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
  PermissionGate,
} from "@/components";

const typeColorMap = {
  manufacturer: "purple",
  distributor: "success",
  wholesaler: "primary",
  local_vendor: "warning",
  other: "neutral",
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
  blocked: "danger",
};

const getCategoryIcon = (type = "") => {
  const normType = String(type).toLowerCase();
  if (normType === "manufacturer") {
    return <HiOutlineBuildingOffice2 />;
  }
  return <LuStore />;
};

const SuppliersMobilePage = ({
  suppliers = [],
  stats,
  filters,
  totalSuppliers = 0,
  filteredSuppliersCount = 0,
  hasFilteredSuppliers,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleCreateSupplier,
  handleViewSupplier,
  handleEditSupplier,
  handleDeleteSupplier,
  handleRefresh,
  isLoading,
  
  currentPage = 1,
  pageSize = 12,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalSuppliers / pageSize) || 1;
  const shouldRenderPagination = hasFilteredSuppliers && totalPages > 1;
  const navigate = useNavigate();

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>

        {/* Header Block */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Suppliers
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                View and manage all your supplier records.
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
                loading={isLoading}
                disabled={isLoading}
                sx={actionHeaderIconBtnSx}
              />
              <PermissionGate permission="supplier:create">
                <AppButton
                  variant="contained"
                  colorVariant="success"
                  size="small"
                  rounded="md"
                  startIcon={<FiPlus />}
                  onClick={handleCreateSupplier}
                  sx={addSupplierBtnSx}
                >
                  Add
                </AppButton>
              </PermissionGate>
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Filter bar options */}
        <AppBox sx={filterSectionSx}>
          <div className="grid grid-cols-[1fr_auto_auto] gap-2">
            <AppSearchInput
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search suppliers..."
              clearable
              onClear={() => handleSearchChange("")}
              size="small"
              variant="bordered"
              rounded="md"
              sx={searchBarSx}
              inputSx={inputOverrideSx}
            />
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              startIcon={<FiFilter />}
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
              endIcon={<FiChevronDown className="text-[12px]" />}
              sx={sortBtnSx}
            >
              Sort
            </AppButton>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <AppSelect
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              options={[
                { label: "Supplier Type", value: "all" },
                { label: "Manufacturer", value: "manufacturer" },
                { label: "Distributor", value: "distributor" },
                { label: "Wholesaler", value: "wholesaler" },
                { label: "Local Vendor", value: "local_vendor" },
                { label: "Other", value: "other" },
              ]}
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
              options={[
                { label: "Status", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Blocked", value: "blocked" },
              ]}
              size="small"
              variant="bordered"
              rounded="md"
              sx={selectInputSx}
              inputSx={inputOverrideSx}
            />
          </div>
        </AppBox>

        {/* Showing label row */}
        <AppBox sx={showingLabelWrapperSx}>
          <AppText variant="body2" sx={showingLabelTextSx}>
            Showing 1 to {filteredSuppliersCount} of {totalSuppliers} suppliers
          </AppText>
        </AppBox>

        {/* Listing Stream cards */}
        <AppBox sx={listingListWrapperSx}>
          {!hasFilteredSuppliers ? (
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
                  No match found
                </AppHeading>
                <AppText
                  variant="body2"
                  align="center"
                  sx={emptyStateSubTextSx}
                >
                  Refine keywords or reset dropdown properties to inspect workspace targets.
                </AppText>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1}>
              {suppliers.map((sup) => {
                const normType = String(sup.supplierType || sup.type).toLowerCase();
                const colorVariant = typeColorMap[normType] || "primary";

                return (
                  <AppCard
                    key={sup.id}
                    variant="default"
                    rounded="lg"
                    bordered
                    shadow="none"
                    padding="none"
                    onClick={() => handleViewSupplier(sup)}
                    sx={supplierListingItemCardSx}
                  >
                    <AppStack
                      direction="row"
                      align="center"
                      justify="space-between"
                      gap={1.2}
                      fullWidth
                    >
                      {/* Left: Icon box */}
                      <AppBox
                        sx={{
                          ...avatarIconFrameSx,
                          bgcolor: `var(--app-color-${colorVariant}-soft)`,
                          color: `var(--app-color-${colorVariant})`,
                        }}
                      >
                        {getCategoryIcon(sup.supplierType || sup.type)}
                      </AppBox>

                      {/* Middle Grid: Name & Phone (Line 1), Code/Type & Status (Line 2) */}
                      <div className="grid grid-cols-[1.25fr_1fr] gap-x-2 gap-y-0.5 items-center flex-1 min-w-0">
                        {/* Line 1 Col 1: Supplier Name */}
                        <AppHeading
                          level={3}
                          weight={750}
                          sx={{
                            ...supplierCardTitleTextSx,
                            fontSize: "12.5px",
                            lineHeight: 1.25,
                            color: "var(--app-color-text)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            m: 0,
                          }}
                        >
                          {sup.displayName}
                        </AppHeading>

                        {/* Line 1 Col 2: Phone number */}
                        <AppText
                          variant="body2"
                          weight={600}
                          sx={{
                            ...supplierCardPhoneTextSx,
                            fontSize: "11px",
                            color: "var(--app-color-text-muted)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            m: 0,
                          }}
                        >
                          {sup.displayMobile || "-"}
                        </AppText>

                        {/* Line 2 Col 1: Code and Type Tag */}
                        <AppStack direction="row" align="center" gap={1} sx={{ minWidth: 0 }}>
                          <AppText
                            variant="caption"
                            weight={700}
                            sx={{
                              ...supplierCardSubTextSx,
                              fontSize: "10.5px",
                              color: "var(--app-color-text-muted)",
                              whiteSpace: "nowrap",
                              m: 0,
                            }}
                          >
                            {sup.displayCode || sup.supplierCode || "-"}
                          </AppText>
                          <AppTag
                            label={sup.displayType || "Distributor"}
                            variant="soft"
                            colorVariant={colorVariant}
                            rounded="sm"
                            sx={{
                              ...categoryTagOverrideSx,
                              height: 16,
                              fontSize: "8.5px",
                              fontWeight: 700,
                              px: 0.6,
                              textTransform: "capitalize",
                            }}
                          />
                        </AppStack>

                        {/* Line 2 Col 2: Status badge */}
                        <AppBox sx={{ display: "inline-flex" }}>
                          <AppStatusBadge
                            status={String(sup.displayStatus).toLowerCase()}
                            label={sup.displayStatus || ""}
                            variant="soft"
                            size="small"
                            rounded="md"
                            colorVariant={
                              statusColorMap[String(sup.displayStatus).toLowerCase()] || "neutral"
                            }
                            sx={{
                              ...statusBadgeOverrideSx,
                              height: 18,
                              fontSize: "9px",
                              fontWeight: 750,
                              px: 0.8,
                              textTransform: "capitalize",
                            }}
                          />
                        </AppBox>
                      </div>

                      {/* Right: Action Buttons (Eye and Dropdown) */}
                      <AppStack
                        direction="row"
                        align="center"
                        gap={0.5}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        sx={{ flexShrink: 0 }}
                      >
                        <AppIconButton
                          icon={<FiEye />}
                          variant="text"
                          colorVariant="neutral"
                          size="small"
                          rounded="md"
                          onClick={() => handleViewSupplier(sup)}
                          sx={{
                            color: "var(--app-color-text-muted)",
                            padding: "4px",
                            minWidth: "auto",
                            "& svg": { fontSize: 16 }
                          }}
                        />
                        <RowActionDropdownTrigger
                          supplier={sup}
                          onView={handleViewSupplier}
                          onEdit={handleEditSupplier}
                          onDelete={handleDeleteSupplier}
                        />
                      </AppStack>
                    </AppStack>
                  </AppCard>
                );
              })}
            </AppStack>
          )}
        </AppBox>

        {/* Mobile Pagination */}
        {shouldRenderPagination && (
          <AppBox sx={paginationFooterWrapperSx}>
            <AppStack
              direction="row"
              align="center"
              justify="space-between"
              sx={{ width: "100%", px: 1 }}
            >
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                startIcon={<FiChevronLeft />}
              >
                Prev
              </AppButton>
              <AppText variant="caption" weight={600} color="muted">
                Page {currentPage} of {totalPages}
              </AppText>
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                endIcon={<FiChevronRight />}
              >
                Next
              </AppButton>
            </AppStack>
          </AppBox>
        )}

        {/* Bottom Read-Only Info Banner */}
        <AppBox sx={infoBannerSx}>
          <AppStack direction="row" align="center" gap={1.2}>
            <FiInfo className="text-[18px] text-blue-600 flex-shrink-0" />
            <AppText variant="body2" sx={infoBannerTextSx}>
              You can view supplier details by clicking on the eye icon.
              All actions are read-only in this version.
            </AppText>
          </AppStack>
        </AppBox>
      </AppBox>
    </section>
  );
};

const RowActionDropdownTrigger = ({
  supplier,
  onView,
  onEdit,
  onDelete,
}) => {
  const menuConfigItems = [
    {
      id: "view",
      label: "View Details",
      icon: <FiEye />,
      onClick: () => onView?.(supplier),
    },
    {
      id: "edit",
      label: "Edit Supplier",
      icon: <FiEdit2 />,
      onClick: () => onEdit?.(supplier),
    },
    { id: "divider_row", type: "divider" },
    {
      id: "remove",
      label: "Remove Profile",
      icon: <FiTrash2 />,
      danger: true,
      onClick: () => onDelete?.(supplier),
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
          <FiMoreVertical className="text-[17px]" />
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

/* Style Definitions */
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
  pb: 1.25,
  px: 0.5,
};

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

const addSupplierBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 750,
  px: 1.2,
  boxShadow: "var(--app-shadow-xs)",
  "& .MuiButton-startIcon": {
    marginRight: "4px",
    fontSize: "12px",
  },
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const filterSectionSx = {
  px: 0.5,
  pb: 1,
};

const searchBarSx = {
  width: "100%",
};

const filterToggleBtnSx = {
  height: 35,
  fontSize: "11.5px",
  fontWeight: 650,
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
  px: 1.2,
  "& .MuiButton-startIcon": {
    marginRight: "4px",
    fontSize: "12px",
  },
};

const sortBtnSx = {
  height: 35,
  fontSize: "11.5px",
  fontWeight: 650,
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
  px: 1.2,
  "& .MuiButton-startIcon": {
    marginRight: "4px",
    fontSize: "12px",
  },
};

const selectInputSx = {
  width: "100%",
};

const inputOverrideSx = {
  height: 35,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const inlineAddSupplierBtnSx = {
  height: 35,
  fontSize: "11px",
  fontWeight: 750,
  bgcolor: "var(--app-color-success, #10b981)",
  color: "var(--app-color-text-inverse, #ffffff)",
  px: 1,
  boxShadow: "none",
  textTransform: "none",
  whiteSpace: "nowrap",
  "& .MuiButton-startIcon": {
    marginRight: "4px",
    fontSize: "12px",
  },
  "&:hover": {
    bgcolor: "color-mix(in_srgb, var(--app-color-success) 90%, black)",
  },
};

const showingLabelWrapperSx = {
  px: 0.5,
  pt: 0.5,
  pb: 1,
};

const showingLabelTextSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
  fontWeight: 500,
};

const listingListWrapperSx = {
  px: 0.5,
  py: 1,
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 25%, transparent)",
  overflowY: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
    width: 0,
    height: 0,
  },
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

const supplierListingItemCardSx = {
  p: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  cursor: "pointer",
  transition: "background-color 0.1s ease",
  "&:hover": {
    bgcolor: "var(--app-color-surface)",
  },
};

const avatarIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: "8px",
  fontSize: "16px",
  flexShrink: 0,
};

const supplierCardTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const supplierCardSubTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const supplierCardPhoneTextSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const statusBadgeOverrideSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 750,
  px: 0.8,
  textTransform: "capitalize",
};

const categoryTagOverrideSx = {
  height: 16,
  fontSize: "8.5px",
  fontWeight: 700,
  px: 0.6,
  textTransform: "capitalize",
};

const paginationFooterWrapperSx = {
  px: 0.5,
  pt: 2,
  pb: 2,
  borderTop: "1px solid var(--app-color-divider)",
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const paginationArrowBtnSx = {
  height: 30,
  width: 30,
  minWidth: 30,
  borderColor: "var(--app-color-border)",
};

const infoBannerSx = {
  mt: 1.5,
  mb: 3,
  mx: 0.5,
  p: 1.2,
  borderRadius: "8px",
  bgcolor: "#eff6ff",
  border: "1px solid #dbeafe",
};

const infoBannerTextSx = {
  fontSize: "11px",
  color: "#1e40af",
  lineHeight: 1.4,
  fontWeight: 500,
};

export default SuppliersMobilePage;
