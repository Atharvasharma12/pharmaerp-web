import React from "react";
import {
  FiArrowRight,
  FiFileText,
  FiGitBranch,
  FiLayers,
  FiXCircle,
  FiRefreshCw,
  FiChevronRight,
  FiMoreHorizontal,
  FiEye,
  FiPlus,
  FiArrowLeft,
  FiEdit2,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppText,
  AppMenu,
} from "@/components";

// Map stats color/icon variants
const statIcons = {
  totalGroups: <FiGitBranch />,
  totalAccounts: <FiFileText />,
  rootGroups: <FiLayers />,
  inactiveAccounts: <FiXCircle />,
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const AccountGroupsMobilePage = ({
  accountGroups = [],
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  handlePageChange,
  handlePageSizeChange,
  stats = {},
  filters = {},
  statusOptions = [],
  isLoading = false,
  handleFilterChange,
  handleCreateGroup,
  handleViewGroup,
  handleEditGroup,
  handleRefresh,
  handleBackToCOA,
}) => {
  // Translate stats for the mobile 2x2 cards
  const mobileStats = [
    {
      id: "totalGroups",
      title: "Total Groups",
      value: String(stats.totalGroups || 0),
      description: "Active Groups",
      colorVariant: "success",
    },
    {
      id: "totalAccounts",
      title: "Total Accounts",
      value: String(stats.totalAccounts || 0),
      description: "Active Accounts",
      colorVariant: "info",
    },
    {
      id: "rootGroups",
      title: "Root Groups",
      value: String(stats.rootGroups || 0),
      description: "Top Level",
      colorVariant: "warning",
    },
    {
      id: "inactiveAccounts",
      title: "Under Groups",
      value: String(stats.underGroups || 0),
      description: "Sub Groups",
      colorVariant: "danger",
    },
  ];

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" gap={1}>
            <AppIconButton
              icon={<FiArrowLeft />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleBackToCOA}
              sx={actionHeaderIconBtnSx}
            />
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Account Groups
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                View and manage account groups
              </AppText>
            </AppBox>

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
          </AppStack>
        </AppBox>

        {/* 2x2 High-Density Stats Grid */}
        <AppBox sx={statsGridWrapperSx}>
          <div className="grid grid-cols-2 gap-2">
            {mobileStats.map((stat) => (
              <AppCard
                key={stat.id}
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={compactStatCardSx}
              >
                <AppStack direction="row" align="center" gap={0.85} sx={{ width: "100%" }}>
                  <AppBox
                    sx={{
                      ...compactStatIconSx,
                      bgcolor: `var(--app-color-${stat.colorVariant}-soft)`,
                      color: `var(--app-color-${stat.colorVariant})`,
                    }}
                  >
                    {statIcons[stat.id] || <FiLayers />}
                  </AppBox>
                  <AppBox sx={{ minWidth: 0, flex: 1 }}>
                    <AppText variant="body2" sx={compactStatTitleSx}>
                      {stat.title}
                    </AppText>
                    <AppHeading level={3} weight={600} sx={compactStatValueSx}>
                      {stat.value}
                    </AppHeading>
                    <AppText variant="body2" sx={compactStatDescSx}>
                      {stat.description}
                    </AppText>
                  </AppBox>
                </AppStack>
              </AppCard>
            ))}
          </div>
        </AppBox>

        {/* List Section */}
        <div className="space-y-4 px-1.5 pb-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={tableCardSx}
          >
            {/* Filter toolbar */}
            <div className="p-3 border-b border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <AppHeading level={2} weight={700} sx={cardTitleSx}>
                  Groups List
                </AppHeading>
                <AppIconButton
                  icon={<FiPlus />}
                  variant="contained"
                  colorVariant="success"
                  size="small"
                  rounded="md"
                  onClick={handleCreateGroup}
                  sx={compactAddBtnSx}
                />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <AppSearchInput
                  name="search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search groups..."
                  clearable
                  onClear={() => handleFilterChange("search", "")}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                />
                <AppSelect
                  name="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  options={statusOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  sx={{ width: 100 }}
                  inputSx={compactFilterInputSx}
                />
              </div>
            </div>

            {/* Scrollable Compact Table */}
            <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="min-w-[500px] w-full border-collapse text-left text-[11px] font-medium text-text">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/50 text-[9.5px] font-bold text-text-muted uppercase">
                    <th className="py-2 px-3">Group Name</th>
                    <th className="py-2 px-2">Group Code</th>
                    <th className="py-2 px-2">Level</th>
                    <th className="py-2 px-2">Accounts</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {accountGroups.map((row) => (
                    <tr key={row._id} className="hover:bg-surface-hover/30 transition">
                      <td className="py-2 px-3 font-semibold text-text">
                        {row.name}
                      </td>
                      <td className="py-2 px-2 text-text-muted">{row.code}</td>
                      <td className="py-2 px-2 text-text">{row.level}</td>
                      <td className="py-2 px-2 text-text">{row.accountsCount}</td>
                      <td className="py-2 px-2">
                        <AppStatusBadge
                          status={row.status}
                          label={row.status}
                          variant="soft"
                          size="small"
                          rounded="sm"
                          colorVariant={statusColorMap[row.status] || "neutral"}
                          sx={tableStatusBadgeSx}
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex justify-end gap-1">
                          <AppMenu
                            trigger={
                              <button
                                type="button"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-transparent text-text-muted hover:text-text focus:outline-none"
                              >
                                <FiMoreHorizontal className="text-[14px]" />
                              </button>
                            }
                            items={[
                              { id: "view", label: "View Details", icon: <FiEye />, onClick: () => handleViewGroup(row._id) },
                              { id: "edit", label: "Edit Group", icon: <FiEdit2 />, onClick: () => handleEditGroup(row._id) },
                            ]}
                            dense
                            minWidth={130}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Conditional pagination footer: hide if 10 or fewer rows */}
            {totalCount > 10 && (
              <div className="p-3 border-t border-border flex items-center justify-between text-[10.5px] text-text-muted font-semibold">
                <span>Showing {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} groups</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`px-2 py-0.5 border border-border rounded bg-surface-alt ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-hover transition'}`}
                  >
                    Prev
                  </button>
                  <span className="px-1.5 py-0.5">{currentPage}</span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`px-2 py-0.5 border border-border rounded bg-surface-alt ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-hover transition'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </AppCard>
        </div>
      </AppBox>
    </section>
  );
};

// Layout style configuration (MUI box sx mapping)
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
  fontSize: "18.5px",
  lineHeight: 1.15,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const statsGridWrapperSx = {
  px: 0.5,
  pb: 1.25,
};

const compactStatCardSx = {
  p: 1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};

const compactStatIconSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "50%",
  fontSize: "13px",
  flexShrink: 0,
};

const compactStatTitleSx = {
  m: 0,
  fontSize: "9.2px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
};

const compactStatValueSx = {
  m: 0,
  fontSize: "11.5px",
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const compactStatDescSx = {
  m: 0,
  fontSize: "8.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const tableCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const cardTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const tableStatusBadgeSx = {
  height: 18,
  px: 1.1,
  fontSize: "8.5px",
  fontWeight: 700,
  textTransform: "capitalize",
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11px",
  bgcolor: "var(--app-color-surface)",
};

const compactAddBtnSx = {
  height: 28,
  width: 28,
  minWidth: 28,
  p: 0,
  bgcolor: "var(--app-color-success)",
  color: "var(--app-color-surface)",
  "& svg": { fontSize: "14px" },
  "&:hover": {
    bgcolor: "color-mix(in srgb, var(--app-color-success) 85%, black)",
  },
};

const actionIconButtonSx = {
  p: 0,
  height: 22,
  width: 22,
  minWidth: 22,
  bgcolor: "transparent",
  border: "none",
  boxShadow: "none",
  color: "var(--app-color-text-muted)",
  "&:hover": {
    bgcolor: "var(--app-color-surface-hover)",
    color: "var(--app-color-text)",
  },
};

export default AccountGroupsMobilePage;
