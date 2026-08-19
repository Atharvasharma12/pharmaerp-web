// src/features/workspace/pages/mobile/WorkspaceInvitationsMobilePage.jsx

import { useMemo } from "react";
import {
  FiSend,
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCopy,
  FiUserPlus,
  FiUsers,
  FiCalendar,
  FiMail,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppSelect,
  AppSearchInput,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
} from "@/components";

const statIcons = {
  total: <FiSend />,
  pending: <FiClock />,
  accepted: <FiCheckCircle />,
  expired: <FiXCircle />,
};

const statusColorMap = {
  pending: "warning",
  accepted: "success",
  cancelled: "neutral",
  expired: "error",
};

const WorkspaceInvitationsMobilePage = ({
  workspace,
  invitations = [],
  stats = [],
  filters,
  statusOptions = [],
  totalInvitations = 0,
  filteredInvitationsCount = 0,
  hasFilteredInvitations,
  copiedId,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handleRefresh,
  handleInviteMember,
  handleViewMembers,
  handleCancelInvitation,
  handleResendInvitation,
  handleCopyLink,
}) => {
  const shouldRenderPagination =
    hasFilteredInvitations && totalInvitations > 10;

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
                Invitations
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                {workspace?.name || "Workspace Invites"}
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
                onClick={handleViewMembers}
                sx={headerSecondaryBtnSx}
              >
                Members
              </AppButton>
              <AppButton
                variant="contained"
                colorVariant="success"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleInviteMember}
                sx={addInviteBtnSx}
              >
                Invite
              </AppButton>
            </AppStack>
          </AppStack>
        </AppBox>

        {/* High-Density Compact Horizontal Metrics Grid */}
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
                    {statIcons[stat.id] || <FiSend />}
                  </AppBox>
                  <AppBox sx={{ minWidth: 0 }}>
                    <AppHeading level={2} weight={800} sx={compactStatValueSx}>
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
              placeholder="Search email, role, inviter..."
              clearable
              onClear={() => handleSearchChange("")}
              size="small"
              variant="bordered"
              rounded="md"
              sx={searchBarSx}
              inputSx={inputOverrideSx}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 mt-2">
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
            Showing {filteredInvitationsCount} of {totalInvitations} Invitations
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
          {!hasFilteredInvitations ? (
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
                  No invitations found
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
              {invitations.map((invitation) => {
                const initials = String(invitation?.displayEmail || "I")
                  .trim()
                  .charAt(0)
                  .toUpperCase();

                return (
                  <AppCard
                    key={invitation._id}
                    variant="default"
                    rounded="lg"
                    bordered
                    shadow="none"
                    padding="none"
                    sx={invitationListingItemCardSx}
                  >
                    {/* Top Segment: Core Identity Fields Layout Block */}
                    <AppStack
                      direction="row"
                      align="flex-start"
                      justify="space-between"
                      gap={1}
                    >
                      <AppStack direction="row" align="center" gap={1}>
                        <AppBox sx={avatarFrameSx}>{initials || "I"}</AppBox>

                        <AppBox sx={{ minWidth: 0 }}>
                          <AppHeading
                            level={2}
                            weight={800}
                            sx={inviteCardTitleTextSx}
                          >
                            {invitation.displayEmail}
                          </AppHeading>
                          <AppText variant="body2" sx={inviteCardSubTextSx}>
                            Invited by: {invitation.displayInvitedBy}
                          </AppText>
                          <AppText variant="body2" sx={inviteCardDateTextSx}>
                            Expires: {invitation.displayExpiresAt}
                          </AppText>
                        </AppBox>
                      </AppStack>

                      {/* Explicit propagation cancellation wrappers on interactive action elements */}
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
                          status={invitation.effectiveStatus}
                          label={invitation.effectiveStatus || "pending"}
                          variant="soft"
                          size="small"
                          rounded="md"
                          colorVariant={
                            statusColorMap[invitation.effectiveStatus] ||
                            "neutral"
                          }
                          sx={statusBadgeOverrideSx}
                        />

                        {invitation.effectiveStatus === "pending" && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              title="Resend Email"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleResendInvitation?.(invitation);
                              }}
                              className="p-1 rounded text-text-muted hover:text-primary transition"
                            >
                              <FiRefreshCw className="text-xs" />
                            </button>

                            <button
                              type="button"
                              title="Copy Link"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleCopyLink?.(invitation);
                              }}
                              className="p-1 rounded text-text-muted hover:text-primary transition"
                            >
                              {copiedId === invitation._id ? (
                                <FiCheck className="text-xs text-emerald-500" />
                              ) : (
                                <FiCopy className="text-xs" />
                              )}
                            </button>

                            <AppIconButton
                              icon={<FiXCircle />}
                              variant="text"
                              colorVariant="error"
                              size="small"
                              rounded="md"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleCancelInvitation(invitation);
                              }}
                              sx={cancelBtnOverrideSx}
                            />
                          </div>
                        )}
                      </AppStack>
                    </AppStack>

                    <div className="w-full h-[1px] bg-divider my-2" />

                    {/* Bottom Segment: Workspace Context Meta Badges */}
                    <AppStack
                      direction="row"
                      align="center"
                      justify="space-between"
                      gap={1}
                    >
                      <div className="flex items-center gap-1">
                        <AppTag
                          label={invitation.displayRole || "Staff"}
                          variant="soft"
                          colorVariant="primary"
                          rounded="sm"
                          sx={roleTagOverrideSx}
                        />
                        <AppTag
                          label={invitation.storeFootprint || "Workspace"}
                          variant="soft"
                          colorVariant={
                            invitation.accessAllBranches
                              ? "success"
                              : invitation.branchAccess?.length > 0
                                ? "primary"
                                : "neutral"
                          }
                          rounded="sm"
                          sx={roleTagOverrideSx}
                        />
                      </div>

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
                            Sent {invitation.displayCreatedAt || "-"}
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
                  disabled={totalInvitations <= 10}
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

/* Architectural Style Definitions Dictionary mapping structural parameters */
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

const addInviteBtnSx = {
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
  fontWeight: 650,
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

const invitationListingItemCardSx = {
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
  fontSize: "12.5px",
  fontWeight: 750,
  flexShrink: 0,
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
};

const inviteCardTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const inviteCardSubTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  mt: 0.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const inviteCardDateTextSx = {
  fontSize: "10.5px",
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

const cancelBtnOverrideSx = {
  p: 0,
  ml: 0.25,
  color: "var(--app-color-error)",
  "& svg": {
    fontSize: "16px",
  },
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

export default WorkspaceInvitationsMobilePage;
