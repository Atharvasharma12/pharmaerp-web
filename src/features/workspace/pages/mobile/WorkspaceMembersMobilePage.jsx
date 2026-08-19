import {
  FiUsers,
  FiUserCheck,
  FiClock,
  FiShield,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiPlus,
  FiMoreHorizontal,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUserMinus,
  FiMapPin,
  FiKey,
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
} from "@/components";

const statusColorMap = {
  active: "success",
  inactive: "neutral",
  suspended: "error",
};

const statIcons = {
  total: <FiUsers />,
  active: <FiUserCheck />,
  inactive: <FiClock />,
  suspended: <FiShield />,
};

const WorkspaceMembersMobilePage = ({
  workspace,
  members = [],
  stats = [],
  filters,
  statusOptions = [],
  roleOptions = [],
  totalMembers = 0,
  filteredMembersCount = 0,
  hasFilteredMembers,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleRefresh,
  handleInviteMember,
  handleViewInvitations,
  handleChangeMemberStatus,
  handleRemoveMember,
  handleManageAccess,
  handleOpenResetPassword,
}) => {
  const shouldRenderPagination = hasFilteredMembers && totalMembers > 10;

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
                Members
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                {workspace?.name || "Manage your team roster"}
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
                onClick={handleViewInvitations}
                sx={headerSecondaryBtnSx}
              >
                Invitations
              </AppButton>
              <AppButton
                variant="contained"
                colorVariant="success"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleInviteMember}
                sx={addMemberBtnSx}
              >
                Invite
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
                      {stat.title}
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
              placeholder="Search members by name, email or status..."
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
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              options={roleOptions}
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
            Showing {filteredMembersCount} of {totalMembers} Members
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
          {!hasFilteredMembers ? (
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
              {members.map((member) => {
                const initials = String(member?.displayName || "M")
                  .trim()
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("");

                return (
                  <AppCard
                    key={member._id}
                    variant="default"
                    rounded="lg"
                    bordered
                    shadow="none"
                    padding="none"
                    sx={memberListingItemCardSx}
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
                          <AppStack direction="row" align="center" gap={0.5}>
                            <AppHeading
                              level={2}
                              weight={800}
                              sx={memberCardTitleTextSx}
                            >
                              {member.displayName}
                            </AppHeading>
                          </AppStack>
                          <AppText variant="body2" sx={memberCardSubTextSx}>
                            {member.displayEmail}
                          </AppText>
                          {member.displayPhone &&
                            member.displayPhone !== "-" && (
                              <AppText
                                variant="body2"
                                sx={memberCardPhoneTextSx}
                              >
                                {member.displayPhone}
                              </AppText>
                            )}
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
                          status={member.status}
                          label={member.status || "inactive"}
                          variant="soft"
                          size="small"
                          rounded="md"
                          colorVariant={
                            statusColorMap[member.status] || "neutral"
                          }
                          sx={statusBadgeOverrideSx}
                        />
                        <RowActionDropdownTrigger
                          member={member}
                          onChangeStatus={handleChangeMemberStatus}
                          onRemove={handleRemoveMember}
                          onManageAccess={handleManageAccess}
                          onResetPassword={handleOpenResetPassword}
                        />
                      </AppStack>
                    </AppStack>

                    <div className="w-full h-[1px] bg-divider my-2" />

                    {/* Bottom Segment: Roles & Joined Indicators */}
                    <AppStack
                      direction="row"
                      align="center"
                      justify="space-between"
                      gap={1}
                    >
                      <AppTag
                        label={member.displayRole || "Staff"}
                        variant="soft"
                        colorVariant={member.isOwner ? "warning" : "primary"}
                        rounded="sm"
                        sx={roleTagOverrideSx}
                      />

                      <AppStack direction="row" align="center" gap={1}>
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
                            Joined {member.displayJoinedAt || "-"}
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
                  disabled={totalMembers <= 10}
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

const RowActionDropdownTrigger = ({
  member,
  onChangeStatus,
  onRemove,
  onManageAccess,
  onResetPassword,
}) => {
  const isOwner = Boolean(member?.isOwner);

  const menuConfigItems = [
    {
      id: "access",
      label: "Store & Role Access",
      icon: <FiMapPin />,
      disabled: isOwner,
      onClick: () => onManageAccess?.(member),
    },
    {
      id: "reset-password",
      label: "Reset Password / PIN",
      icon: <FiKey />,
      disabled: isOwner,
      onClick: () => onResetPassword?.(member),
    },
    { id: "divider_access", type: "divider" },
    {
      id: "active",
      label: "Mark Active",
      icon: <FiUserCheck />,
      disabled: isOwner || member?.status === "active",
      onClick: () => onChangeStatus?.(member, "active"),
    },
    {
      id: "inactive",
      label: "Mark Inactive",
      icon: <FiClock />,
      disabled: isOwner || member?.status === "inactive",
      onClick: () => onChangeStatus?.(member, "inactive"),
    },
    {
      id: "suspended",
      label: "Suspend Member",
      icon: <FiShield />,
      disabled: isOwner || member?.status === "suspended",
      onClick: () => onChangeStatus?.(member, "suspended"),
    },
    { id: "divider_row", type: "divider" },
    {
      id: "remove",
      label: "Remove Member",
      icon: <FiUserMinus />,
      danger: true,
      disabled: isOwner,
      onClick: () => onRemove?.(member),
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

const addMemberBtnSx = {
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

const memberListingItemCardSx = {
  p: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
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

const memberCardTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const memberCardSubTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  mt: 0.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const memberCardPhoneTextSx = {
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

export default WorkspaceMembersMobilePage;
