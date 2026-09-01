// src/features/branch/pages/mobile/BranchesMobilePage.jsx

import { useMemo } from "react";
import {
  FiGitBranch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiMoreHorizontal,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiCalendar,
  FiMail,
  FiPhone,
  FiEye,
  FiEdit2,
  FiSettings,
  FiTrash2,
  FiMapPin,
} from "react-icons/fi";

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

const statusColorMap = {
  active: "success",
  inactive: "neutral",
  suspended: "danger",
};

const BranchesMobilePage = ({
  branches = [],
  filters,
  statusOptions = [],
  companyOptions = [],
  totalBranches = 0,
  filteredBranchesCount = 0,
  hasFilteredBranches,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleCreateBranch,
  handleViewBranch,
  handleEditBranch,
  handleOpenSettings,
  handleDeleteBranch,
}) => {
  const shouldRenderPagination = hasFilteredBranches && totalBranches > 10;

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Expanded Width Page Title Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Branches
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                Manage all branches across your companies.
              </AppText>
            </AppBox>

            <PermissionGate permission="branch:create">
              <AppButton
                variant="contained"
                colorVariant="success"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleCreateBranch}
                sx={addBranchBtnSx}
              >
                Add Branch
              </AppButton>
            </PermissionGate>
          </AppStack>
        </AppBox>

        {/* Max Width Filter Layout Row */}
        <AppBox sx={filterSectionSx}>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <AppSearchInput
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search branches..."
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
            Total Branches: {totalBranches}
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
          {!hasFilteredBranches ? (
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
                  Refine keywords or reset dropdown properties to inspect
                  workspace targets.
                </AppText>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1}>
              {branches.map((branch) => (
                <AppCard
                  key={branch._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  onClick={() => handleViewBranch(branch)}
                  sx={branchListingItemCardSx}
                >
                  {/* Top Segment: Row Information Blocks */}
                  <AppStack
                    direction="row"
                    align="flex-start"
                    justify="space-between"
                    gap={1}
                  >
                    <AppStack direction="row" align="center" gap={1}>
                      <AppBox sx={avatarIconFrameSx}>
                        <FiGitBranch />
                      </AppBox>

                      <AppBox sx={{ minWidth: 0 }}>
                        <AppHeading
                          level={2}
                          weight={800}
                          sx={branchCardTitleTextSx}
                        >
                          {branch.displayName}
                        </AppHeading>
                        {branch.displayCompany && (
                          <AppText variant="body2" sx={branchCardSubTextSx}>
                            {branch.displayCompany}
                          </AppText>
                        )}
                        <AppStack
                          direction="column"
                          gap={0.1}
                          sx={{ mt: 0.35 }}
                        >
                          {branch.email && (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <FiMail className="text-[10.5px] text-text-muted shrink-0" />
                              <AppText variant="body2" sx={branchContactTextSx}>
                                {branch.email}
                              </AppText>
                            </div>
                          )}
                          {branch.phones?.mobile && (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <FiPhone className="text-[10.5px] text-text-muted shrink-0" />
                              <AppText variant="body2" sx={branchContactTextSx}>
                                {branch.phones.mobile}
                              </AppText>
                            </div>
                          )}
                        </AppStack>
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
                        status={branch.displayStatus}
                        label={branch.displayStatus || ""}
                        variant="soft"
                        size="small"
                        rounded="md"
                        colorVariant={
                          statusColorMap[branch.displayStatus] || "neutral"
                        }
                        sx={statusBadgeOverrideSx}
                      />
                      <RowActionDropdownTrigger
                        branch={branch}
                        onView={handleViewBranch}
                        onEdit={handleEditBranch}
                        onSettings={handleOpenSettings}
                        onDelete={handleDeleteBranch}
                      />
                    </AppStack>
                  </AppStack>

                  <div className="w-full h-[1px] bg-divider my-2" />

                  {/* Bottom Segment: Location Tags & Meta Cells */}
                  <AppStack
                    direction="row"
                    align="center"
                    justify="space-between"
                    gap={1}
                  >
                    <AppStack
                      direction="row"
                      align="center"
                      gap={0.4}
                      sx={locationMetaFrameSx}
                    >
                      <FiMapPin className="text-[11px] shrink-0" />
                      <AppText variant="body2" sx={locationSummaryTextSx}>
                        {branch.locationSummary ||
                          branch.addressLine1 ||
                          "No location configured"}
                      </AppText>
                    </AppStack>

                    <AppStack direction="row" align="center" gap={1.2}>
                      <AppStack
                        direction="row"
                        align="center"
                        gap={0.4}
                        sx={inlineMetaMetricFrameSx}
                      >
                        <FiUsers className="text-[12px]" />
                        <AppText
                          variant="body2"
                          weight={600}
                          sx={inlineMetaValueTextSx}
                        >
                          {branch.staffCount} members
                        </AppText>
                      </AppStack>

                      <AppStack
                        direction="row"
                        align="center"
                        gap={0.4}
                        sx={inlineMetaMetricFrameSx}
                      >
                        <FiCalendar className="text-[12px]" />
                        <AppText
                          variant="body2"
                          weight={600}
                          sx={inlineMetaValueTextSx}
                        >
                          {branch.displayCreatedAt || "Just now"}
                        </AppText>
                      </AppStack>
                    </AppStack>
                  </AppStack>
                </AppCard>
              ))}
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
              Showing 1 to {filteredBranchesCount} of {totalBranches} branches
            </AppText>
          </AppBox>
        )}
      </AppBox>
    </section>
  );
};

// Action Trigger Menu containing strict isolation bubble preventions
const RowActionDropdownTrigger = ({
  branch,
  onView,
  onEdit,
  onSettings,
  onDelete,
}) => {
  const menuConfigItems = [
    {
      id: "view",
      label: "View Location",
      icon: <FiEye />,
      onClick: () => onView?.(branch),
    },
    {
      id: "edit",
      label: "Edit Site Details",
      icon: <FiEdit2 />,
      onClick: () => onEdit?.(branch),
    },
    {
      id: "settings",
      label: "Module Sync",
      icon: <FiSettings />,
      onClick: () => onSettings?.(branch),
    },
    { id: "divider_row", type: "divider" },
    {
      id: "remove",
      label: "Delete Branch",
      icon: <FiTrash2 />,
      danger: true,
      disabled: Boolean(branch?.isPrimary),
      onClick: () => onDelete?.(branch),
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

/* Style Tokens Configuration Dictionary */
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

const addBranchBtnSx = {
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

const branchListingItemCardSx = {
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
  fontSize: "17px",
  flexShrink: 0,
  bgcolor: "var(--app-color-success-soft)",
  color: "var(--app-color-success)",
};

const branchCardTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const branchCardSubTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-primary)",
  fontWeight: 650,
  mt: 0.1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const branchContactTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
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

const locationMetaFrameSx = {
  minWidth: 0,
  flex: 1,
  color: "var(--app-color-text-muted)",
};

const locationSummaryTextSx = {
  fontSize: "10.5px",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
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

export default BranchesMobilePage;
