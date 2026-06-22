// src/features/parties/customers/pages/mobile/CustomersMobilePage.jsx

import { useMemo } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiMoreHorizontal,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiCreditCard,
  FiPhone,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { LuStore } from "react-icons/lu";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

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

const typeColorMap = {
  retail: "success",
  wholesale: "primary",
  hospital: "purple",
  clinic: "warning",
  corporate: "info",
  other: "neutral",
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
  blocked: "danger",
};

const getCategoryIcon = (type = "") => {
  const normType = String(type).toLowerCase();
  if (normType === "hospital") {
    return <HiOutlineBuildingOffice2 />;
  }
  return <LuStore />;
};

const CustomersMobilePage = ({
  customers = [],
  stats,
  filters,
  totalCustomers = 0,
  filteredCustomersCount = 0,
  hasFilteredCustomers,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleCreateCustomer,
  handleViewCustomer,
  handleEditCustomer,
  handleDeleteCustomer,
}) => {
  const shouldRenderPagination = hasFilteredCustomers && totalCustomers > 10;

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
                Customers
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                View and manage all your customer records.
              </AppText>
            </AppBox>

            <AppButton
              variant="contained"
              colorVariant="success"
              size="small"
              rounded="md"
              startIcon={<FiPlus />}
              onClick={handleCreateCustomer}
              sx={addCustomerBtnSx}
            >
              Add Customer
            </AppButton>
          </AppStack>
        </AppBox>

        {/* Filter bar options */}
        <AppBox sx={filterSectionSx}>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <AppSearchInput
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search customers..."
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
              Filters
            </AppButton>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <AppSelect
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={[
                { label: "Status: All", value: "all" },
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
            <AppSelect
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              options={[
                { label: "Type: All", value: "all" },
                { label: "Retail", value: "retail" },
                { label: "Wholesale", value: "wholesale" },
                { label: "Hospital", value: "hospital" },
                { label: "Clinic", value: "clinic" },
                { label: "Corporate", value: "corporate" },
              ]}
              size="small"
              variant="bordered"
              rounded="md"
              sx={selectInputSx}
              inputSx={inputOverrideSx}
            />
          </div>
        </AppBox>

        {/* Grey Counter Action Bar */}
        <AppBox sx={metaActionRowSx}>
          <AppText variant="body2" weight={700} sx={countLabelTextSx}>
            Total Customers: {totalCustomers}
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

        {/* Listing Stream cards */}
        <AppBox sx={listingListWrapperSx}>
          {!hasFilteredCustomers ? (
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
              {customers.map((cust) => {
                const normType = String(cust.customerType || cust.type).toLowerCase();
                const colorVariant = typeColorMap[normType] || "primary";

                return (
                  <AppCard
                    key={cust.id}
                    variant="default"
                    rounded="lg"
                    bordered
                    shadow="none"
                    padding="none"
                    onClick={() => handleViewCustomer(cust)}
                    sx={customerListingItemCardSx}
                  >
                    {/* Top Segment: Row Info */}
                    <AppStack
                      direction="row"
                      align="flex-start"
                      justify="space-between"
                      gap={1}
                    >
                      <AppStack direction="row" align="center" gap={1}>
                        <AppBox
                          sx={{
                            ...avatarIconFrameSx,
                            bgcolor: `var(--app-color-${colorVariant}-soft)`,
                            color: `var(--app-color-${colorVariant})`,
                          }}
                        >
                          {getCategoryIcon(cust.customerType || cust.type)}
                        </AppBox>

                        <AppBox sx={{ minWidth: 0 }}>
                          <AppHeading
                            level={2}
                            weight={800}
                            sx={customerCardTitleTextSx}
                          >
                            {cust.displayName}
                          </AppHeading>
                          <AppText variant="body2" sx={customerCardSubTextSx}>
                            {cust.displayCode || cust.code}
                          </AppText>
                          <AppText variant="body2" sx={customerCardPhoneTextSx}>
                            {cust.displayMobile || "-"}
                          </AppText>
                        </AppBox>
                      </AppStack>

                      {/* Right aligned status and dropdown action */}
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
                          status={String(cust.displayStatus).toLowerCase()}
                          label={cust.displayStatus || ""}
                          variant="soft"
                          size="small"
                          rounded="md"
                          colorVariant={
                            statusColorMap[String(cust.displayStatus).toLowerCase()] || "neutral"
                          }
                          sx={statusBadgeOverrideSx}
                        />
                        <RowActionDropdownTrigger
                          customer={cust}
                          onView={handleViewCustomer}
                          onEdit={handleEditCustomer}
                          onDelete={handleDeleteCustomer}
                        />
                      </AppStack>
                    </AppStack>

                    <div className="w-full h-[1px] bg-divider my-2" />

                    {/* Bottom Segment: Type Tag & Credit Limit */}
                    <AppStack
                      direction="row"
                      align="center"
                      justify="space-between"
                      gap={1}
                    >
                      <AppTag
                        label={cust.displayType || "Retail"}
                        variant="soft"
                        colorVariant={colorVariant}
                        rounded="sm"
                        sx={categoryTagOverrideSx}
                      />

                      <AppStack direction="row" align="center" gap={1.2}>
                        <AppStack
                          direction="row"
                          align="center"
                          gap={0.4}
                          sx={inlineMetaMetricFrameSx}
                        >
                          <FiCreditCard className="text-[12px]" />
                          <AppText
                            variant="body2"
                            weight={600}
                            sx={inlineMetaValueTextSx}
                          >
                            ₹ {cust.displayCreditLimit.toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })} Limit
                          </AppText>
                        </AppStack>

                        <AppStack
                          direction="row"
                          align="center"
                          gap={0.4}
                          sx={inlineMetaMetricFrameSx}
                        >
                          <FiPhone className="text-[12px]" />
                          <AppText
                            variant="body2"
                            weight={600}
                            sx={inlineMetaValueTextSx}
                          >
                            {cust.displayMobile ? "Mobile" : "No contact"}
                          </AppText>
                        </AppStack>
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
                <span className="flex h-[30px] min-w-[30px] items-center justify-center rounded-md border border-border bg-surface text-[11.5px] font-bold text-text transition active:bg-surface-active">
                  2
                </span>
                <AppIconButton
                  icon={<FiChevronRight />}
                  variant="outlined"
                  colorVariant="neutral"
                  size="small"
                  rounded="md"
                  sx={paginationArrowBtnSx}
                />
              </AppStack>
            </AppStack>

            <AppText variant="body2" align="center" sx={paginationCountLabelSx}>
              Showing 1 to {filteredCustomersCount} of {totalCustomers} customers
            </AppText>
          </AppBox>
        )}
      </AppBox>
    </section>
  );
};

const RowActionDropdownTrigger = ({
  customer,
  onView,
  onEdit,
  onDelete,
}) => {
  const menuConfigItems = [
    {
      id: "view",
      label: "View Details",
      icon: <FiEye />,
      onClick: () => onView?.(customer),
    },
    {
      id: "edit",
      label: "Edit Customer",
      icon: <FiEdit2 />,
      onClick: () => onEdit?.(customer),
    },
    { id: "divider_row", type: "divider" },
    {
      id: "remove",
      label: "Remove Profile",
      icon: <FiTrash2 />,
      danger: true,
      onClick: () => onDelete?.(customer),
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
  pt: 1.5,
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

const addCustomerBtnSx = {
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

const filterSectionSx = {
  px: 0.5,
  pb: 1.25,
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

const selectInputSx = {
  width: "100%",
};

const inputOverrideSx = {
  height: 35,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const metaActionRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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
  "& .MuiButton-startIcon": {
    marginRight: "3px",
    fontSize: "10.5px",
  },
};

const listingListWrapperSx = {
  px: 0.5,
  py: 1.25,
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

const customerListingItemCardSx = {
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

const customerCardTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const customerCardSubTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  mt: 0.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const customerCardPhoneTextSx = {
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

const categoryTagOverrideSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 700,
  px: 1,
  textTransform: "capitalize",
};

const inlineMetaMetricFrameSx = {
  color: "var(--app-color-text-muted)",
};

const inlineMetaValueTextSx = {
  fontSize: "10px",
  lineHeight: 1,
};

const paginationFooterWrapperSx = {
  px: 0.5,
  pt: 1.25,
  pb: 2,
  borderTop: "1px solid var(--app-color-divider)",
};

const pageSizeSelectSx = {
  width: 112,
};

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

const paginationCountLabelSx = {
  mt: 1,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

export default CustomersMobilePage;
