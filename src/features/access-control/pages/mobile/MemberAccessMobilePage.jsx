// src/features/access-control/pages/mobile/MemberAccessMobilePage.jsx

import { useMemo } from "react";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiPlus,
  FiMoreHorizontal,
  FiMail,
  FiPhone,
  FiCalendar,
  FiSliders,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiEye,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

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
  total: <FiUsers />,
  active: <HiOutlineBuildingOffice2 />,
  companies: <HiOutlineBuildingOffice2 />,
  branches: <LuStore />,
};

const roleColorMap = {
  Pharmacist: "success",
  Manager: "info",
  Cashier: "purple",
  "Store Incharge": "warning",
  Accountant: "cyan",
  "Delivery Boy": "purple",
  Owner: "warning",
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const MemberAccessMobilePage = ({
  accessList = [],
  stats = [],
  filters,
  statusOptions = [],
  companyOptions = [],
  branchOptions = [],
  accessOptions = [],
  totalAccessRecords = 0,
  filteredAccessRecordsCount = 0,
  hasFilteredAccessRecords,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleRefresh,
  handleAssignAccess,
  handleAssignRole,
  handleEditAccess,
}) => {
  const shouldRenderPagination =
    hasFilteredAccessRecords && totalAccessRecords > 10;

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Expanded Width Page Title Header Section */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Member Access
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                Manage entity access visibility rosters.
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
              <AppButton
                variant="outlined"
                colorVariant="primary"
                size="small"
                rounded="md"
                onClick={handleAssignRole}
                sx={headerSecondaryBtnSx}
              >
                Assign Role
              </AppButton>
              <AppButton
                variant="contained"
                colorVariant="success"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleAssignAccess}
                sx={addAccessBtnSx}
              >
                Assign
              </AppButton>
            </AppStack>
          </AppStack>
        </AppBox>

        {/* High-Density Compact Stats Grid Section */}
        <AppBox sx={statsGridWrapperSx}>
          <div className="grid grid-cols-4 gap-1.5">
            {stats.map((stat) => (
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
                    {statIcons[stat.id] || <FiUsers />}
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

        {/* Max Width Filter Layout Row */}
        <AppBox sx={filterSectionSx}>
          <div className="grid grid-cols-1 gap-2">
            <AppSearchInput
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search members by name, email or role..."
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
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              options={companyOptions}
              size="small"
              variant="bordered"
              rounded="md"
              sx={selectInputSx}
              inputSx={inputOverrideSx}
            />
            <AppSelect
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              options={branchOptions}
              size="small"
              variant="bordered"
              rounded="md"
              sx={selectInputSx}
              inputSx={inputOverrideSx}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <AppSelect
              name="access"
              value={filters.access}
              onChange={handleFilterChange}
              options={accessOptions}
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

        {/* Edge-Aligned Counter Actions Bar */}
        <AppBox sx={metaActionRowSx}>
          <AppText variant="body2" weight={700} sx={countLabelTextSx}>
            Showing {filteredAccessRecordsCount} of {totalAccessRecords} Members
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

        {/* High Density Main Listing Stream */}
        <AppBox sx={listingListWrapperSx}>
          {!hasFilteredAccessRecords ? (
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
                  No members found
                </AppHeading>
                <AppText
                  variant="body2"
                  align="center"
                  sx={emptyStateSubTextSx}
                >
                  Refine keywords or reset dropdown properties to inspect
                  workspace targets.
                </AppText>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1}>
              {accessList.map((access) => {
                const initials = String(access?.displayName || "M")
                  .trim()
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("");

                return (
                  <AppCard
                    key={access._id}
                    variant="default"
                    rounded="lg"
                    bordered
                    shadow="none"
                    padding="none"
                    onClick={() => handleEditAccess(access)}
                    sx={accessListingItemCardSx}
                  >
                    {/* Top Segment: Row Identity Blocks */}
                    <AppStack
                      direction="row"
                      align="flex-start"
                      justify="space-between"
                      gap={1}
                    >
                      <AppStack direction="row" align="center" gap={1}>
                        <AppBox sx={avatarFrameSx}>{initials || "M"}</AppBox>

                        <AppBox sx={{ minWidth: 0 }}>
                          <AppHeading
                            level={2}
                            weight={800}
                            sx={accessCardTitleTextSx}
                          >
                            {access.displayName}
                          </AppHeading>
                          <AppText variant="body2" sx={accessCardSubTextSx}>
                            {access.displayEmail}
                          </AppText>
                          <AppText variant="body2" sx={accessCardMetaTextSx}>
                            Updated: {access.displayUpdatedAt} by{" "}
                            {access.updatedBy}
                          </AppText>
                        </AppBox>
                      </AppStack>

                      {/* Wraps actions explicitly to isolate click bubbles */}
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
                          status={access.displayStatus}
                          label={
                            access.displayStatus === "active"
                              ? "Active"
                              : "Inactive"
                          }
                          variant="soft"
                          size="small"
                          rounded="md"
                          colorVariant={
                            statusColorMap[access.displayStatus] || "neutral"
                          }
                          sx={statusBadgeOverrideSx}
                        />
                        <RowActionDropdownTrigger
                          access={access}
                          onEdit={handleEditAccess}
                        />
                      </AppStack>
                    </AppStack>

                    <div className="w-full h-[1px] bg-divider my-2" />

                    {/* Bottom Segment: Entity Access Tags & Indicators */}
                    <AppStack
                      direction="row"
                      align="center"
                      justify="space-between"
                      gap={1}
                    >
                      <AppTag
                        label={access.displayRole || "Staff"}
                        variant="soft"
                        colorVariant={
                          roleColorMap[access.displayRole] || "primary"
                        }
                        rounded="sm"
                        sx={roleTagOverrideSx}
                      />

                      <AppStack direction="row" align="center" gap={1.2}>
                        <AppStack
                          direction="row"
                          align="center"
                          gap={0.4}
                          sx={inlineMetaMetricFrameSx}
                        >
                          <HiOutlineBuildingOffice2 className="text-[12px]" />
                          <AppText
                            variant="body2"
                            weight={600}
                            sx={inlineMetaValueTextSx}
                          >
                            {access.companyAccessLabel}
                          </AppText>
                        </AppStack>

                        <AppStack
                          direction="row"
                          align="center"
                          gap={0.4}
                          sx={inlineMetaMetricFrameSx}
                        >
                          <LuStore className="text-[12px]" />
                          <AppText
                            variant="body2"
                            weight={600}
                            sx={inlineMetaValueTextSx}
                          >
                            {access.branchAccessLabel}
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

        {/* Intelligent Conditional Pagination Module */}
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
                  disabled={totalAccessRecords <= 10}
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

// Isolated Dropdown Action Trigger Menu component featuring event cancellation safeguards
const RowActionDropdownTrigger = ({ access, onEdit }) => {
  const menuConfigItems = [
    {
      id: "view",
      label: "View Details",
      icon: <FiEye />,
      onClick: () => onEdit?.(access),
    },
    {
      id: "edit",
      label: "Edit Access",
      icon: <FiEdit2 />,
      disabled: !access?.canEdit,
      onClick: () => onEdit?.(access),
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

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
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

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};
const headerSecondaryBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 700,
  px: 1.1,
  borderColor: "var(--app-color-border-strong)",
  color: "var(--app-color-text)",
};

const addAccessBtnSx = {
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

const statsGridWrapperSx = {
  px: 0.5,
  pb: 1.25,
};

const compactStatCardSx = {
  p: 0.65,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};

const compactStatIconSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const filterSectionSx = {
  px: 0.5,
  pb: 1.25,
};

const searchBarSx = {
  width: "100%",
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

const accessListingItemCardSx = {
  p: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  cursor: "pointer",
  transition: "background-color 0.1s ease",
};

const avatarFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: "50%",
  fontSize: "11.5px",
  fontWeight: 750,
  flexShrink: 0,
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
};

const accessCardTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const accessCardSubTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  mt: 0.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const accessCardMetaTextSx = {
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
  mt: 0.05,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const statusBadgeOverrideSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 750,
  px: 1,
  textTransform: "capitalize",
};

const roleTagOverrideSx = {
  height: 18,
  fontSize: "9px",
  fontWeight: 750,
  px: 1,
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

export default MemberAccessMobilePage;
