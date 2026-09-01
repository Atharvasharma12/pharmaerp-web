// src/features/company/pages/mobile/CompaniesMobilePage.jsx

import { useMemo } from "react";
import {
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiMoreHorizontal,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiCalendar,
  FiHeart,
  FiActivity,
  FiEye,
  FiEdit2,
  FiSettings,
  FiTrash2,
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

const companyIconMap = {
  proprietorship: <FiBriefcase />,
  partnership: <FiUsers />,
  llp: <FiActivity />,
  private_limited: <FiBriefcase />,
  public_limited: <FiBriefcase />,
  other: <FiBriefcase />,
  pharmacy: <FiBriefcase />,
  healthcare: <FiActivity />,
  distribution: <FiBriefcase />,
  laboratory: <FiActivity />,
  wellness: <FiHeart />,
  retail: <FiBriefcase />,
};

const companyColorMap = {
  proprietorship: "primary",
  partnership: "info",
  llp: "warning",
  private_limited: "success",
  public_limited: "purple",
  other: "neutral",
  pharmacy: "primary",
  healthcare: "purple",
  distribution: "warning",
  laboratory: "success",
  wellness: "error",
  retail: "info",
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
  suspended: "danger",
};

const CompaniesMobilePage = ({
  companies = [],
  filters,
  statusOptions = [],
  companyTypeOptions = [],
  totalCompanies = 0,
  filteredCompaniesCount = 0,
  hasFilteredCompanies,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleCreateCompany,
  handleViewCompany,
  handleEditCompany,
  handleOpenSettings,
  handleDeleteCompany,
}) => {
  const resolveTargetSignature = (typeStr = "", nameStr = "") => {
    const normalizedName = nameStr.toLowerCase();
    if (normalizedName.includes("pharmacy")) return "pharmacy";
    if (normalizedName.includes("healthcare")) return "healthcare";
    if (normalizedName.includes("distribution")) return "distribution";
    if (
      normalizedName.includes("labs") ||
      normalizedName.includes("laboratory")
    )
      return "laboratory";
    if (normalizedName.includes("wellness")) return "wellness";
    if (normalizedName.includes("retail")) return "retail";
    return typeStr.toLowerCase() || "other";
  };

  const shouldRenderPagination = hasFilteredCompanies && totalCompanies > 10;

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
                Companies
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                Manage all companies in your workspace.
              </AppText>
            </AppBox>

            <PermissionGate permission="company:create">
              <AppButton
                variant="contained"
                colorVariant="success"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleCreateCompany}
                sx={addCompanyBtnSx}
              >
                Add Company
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
              placeholder="Search by name, email or phone..."
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
              options={statusOptions}
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
              options={companyTypeOptions}
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
            Total Companies: {totalCompanies}
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
          {!hasFilteredCompanies ? (
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
              {companies.map((company) => {
                const targetKey = resolveTargetSignature(
                  company.type,
                  company.displayName,
                );
                const contextualIcon = companyIconMap[targetKey] || (
                  <FiBriefcase />
                );
                const contextualColor = companyColorMap[targetKey] || "primary";

                return (
                  <AppCard
                    key={company._id}
                    variant="default"
                    rounded="lg"
                    bordered
                    shadow="none"
                    padding="none"
                    onClick={() => handleViewCompany(company)}
                    sx={companyListingItemCardSx}
                  >
                    {/* Top Segment: Row Information Blocks */}
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
                            bgcolor: `var(--app-color-${contextualColor}-soft)`,
                            color: `var(--app-color-${contextualColor})`,
                          }}
                        >
                          {contextualIcon}
                        </AppBox>

                        <AppBox sx={{ minWidth: 0 }}>
                          <AppHeading
                            level={2}
                            weight={800}
                            sx={companyCardTitleTextSx}
                          >
                            {company.displayName}
                          </AppHeading>
                          <AppText variant="body2" sx={companyCardSubTextSx}>
                            {company.displayEmail || "no-email@workspace.com"}
                          </AppText>
                          <AppText variant="body2" sx={companyCardPhoneTextSx}>
                            {company.displayPhone ||
                              company.phones?.mobile ||
                              "-"}
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
                          status={company.status}
                          label={company.status || ""}
                          variant="soft"
                          size="small"
                          rounded="md"
                          colorVariant={
                            statusColorMap[company.status] || "neutral"
                          }
                          sx={statusBadgeOverrideSx}
                        />
                        <RowActionDropdownTrigger
                          company={company}
                          onView={handleViewCompany}
                          onEdit={handleEditCompany}
                          onSettings={handleOpenSettings}
                          onDelete={handleDeleteCompany}
                        />
                      </AppStack>
                    </AppStack>

                    <div className="w-full h-[1px] bg-divider my-2" />

                    {/* Bottom Segment: Tags & Inline Indicators */}
                    <AppStack
                      direction="row"
                      align="center"
                      justify="space-between"
                      gap={1}
                    >
                      <AppTag
                        label={company.displayType || "Other"}
                        variant="soft"
                        colorVariant={contextualColor}
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
                          <FiUsers className="text-[12px]" />
                          <AppText
                            variant="body2"
                            weight={600}
                            sx={inlineMetaValueTextSx}
                          >
                            {company.memberCount || company.membersCount || 0}{" "}
                            members
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
                            {company.displayCreatedAt || "Just now"}
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
              Showing 1 to {filteredCompaniesCount} of {totalCompanies}{" "}
              companies
            </AppText>
          </AppBox>
        )}
      </AppBox>
    </section>
  );
};

// Dropdown Action Trigger Menu component featuring multiple layers of event cancellation safeguards
const RowActionDropdownTrigger = ({
  company,
  onView,
  onEdit,
  onSettings,
  onDelete,
}) => {
  const menuConfigItems = [
    {
      id: "view",
      label: "View Details",
      icon: <FiEye />,
      onClick: () => onView?.(company),
    },
    {
      id: "edit",
      label: "Edit Company",
      icon: <FiEdit2 />,
      onClick: () => onEdit?.(company),
    },
    {
      id: "settings",
      label: "Module Settings",
      icon: <FiSettings />,
      onClick: () => onSettings?.(company),
    },
    { id: "divider_row", type: "divider" },
    {
      id: "remove",
      label: "Remove Profile",
      icon: <FiTrash2 />,
      danger: true,
      onClick: () => onDelete?.(company),
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

const addCompanyBtnSx = {
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

const companyListingItemCardSx = {
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

const companyCardTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const companyCardSubTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  mt: 0.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const companyCardPhoneTextSx = {
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

export default CompaniesMobilePage;
