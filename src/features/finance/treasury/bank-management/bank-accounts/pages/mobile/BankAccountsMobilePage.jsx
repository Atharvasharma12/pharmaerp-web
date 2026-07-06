import { useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiPlus,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiMoreVertical,
} from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";

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
  AppIconButton,
  AppMenu,
} from "@/components";

import { BANK_ACCOUNT_TYPE } from "../../constants/bankAccount.constant";

// Dynamic CSS-based Bank Brand Logos
const BankLogo = ({ bankName }) => {
  const name = String(bankName || "").toLowerCase();
  
  if (name.includes("hdfc")) {
    return (
      <div className="w-10 h-10 rounded-lg bg-[#1d4f91] border border-border flex items-center justify-center text-white font-extrabold text-[9px] shrink-0 select-none shadow-sm">
        <span className="tracking-tighter">HDFC</span>
      </div>
    );
  }
  if (name.includes("icici")) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#ff7a00] border border-[#d65f00] flex items-center justify-center text-white font-extrabold text-[13px] shrink-0 select-none shadow-sm relative">
        <span className="italic font-serif leading-none mt-[-1px]">i</span>
      </div>
    );
  }
  if (name.includes("axis")) {
    return (
      <div className="w-10 h-10 rounded-lg bg-[#971a43] border border-border flex items-center justify-center text-white font-bold text-[9px] shrink-0 select-none shadow-sm">
        <span>AXIS</span>
      </div>
    );
  }
  if (name.includes("state") || name.includes("sbi")) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#00a3e0] border border-border flex items-center justify-center shrink-0 select-none shadow-sm relative">
        <div className="w-4 h-4 rounded-full bg-[#00a3e0] border-[2.5px] border-white flex items-center justify-center relative">
          <div className="absolute w-[2.5px] h-[7px] bg-white bottom-[-5px] left-[3px]"></div>
        </div>
      </div>
    );
  }
  if (name.includes("yes")) {
    return (
      <div className="w-10 h-10 rounded-lg bg-[#004b93] border border-border flex items-center justify-center text-white font-extrabold text-[9px] shrink-0 select-none shadow-sm">
        <span>YES</span>
      </div>
    );
  }
  if (name.includes("kotak")) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#0039a6] border border-[#ea1c24] flex items-center justify-center text-white font-extrabold text-[12px] shrink-0 select-none shadow-sm">
        <span className="text-[#ea1c24] font-sans">k</span>
      </div>
    );
  }
  if (name.includes("canara")) {
    return (
      <div className="w-10 h-10 rounded-md bg-[#00a3e0] border border-border flex items-center justify-center text-[#ffd100] font-extrabold text-[8px] shrink-0 select-none shadow-sm">
        <span className="tracking-tighter">CNB</span>
      </div>
    );
  }
  if (name.includes("baroda") || name.includes("bob")) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#f05a28] border border-border flex items-center justify-center text-white font-extrabold text-[10px] shrink-0 select-none shadow-sm">
        <span>BOB</span>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-surface-alt border border-border flex items-center justify-center text-text-muted font-bold text-[11px] shrink-0 shadow-sm">
      <LuBuilding2 className="text-[18px]" />
    </div>
  );
};

const BankAccountsMobilePage = ({
  accounts = [],
  dashboardStats = [],
  filters,
  hasAccounts,
  hasFilteredAccounts,
  handleFilterChange,
  handleSearchChange,
  handleClearFilters,
  handlePageChange,
  handlePageSizeChange,
  currentPage,
  pageSize = 10,
  totalAccounts = 0,
  totalPages,
  handleAddAccount,
  handleEditAccount,
  handleViewDetails,
  handleSetPrimary,
  handleDeleteAccount,
  handleRefresh,
  isLoading = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const shouldRenderPagination = hasFilteredAccounts && totalAccounts > pageSize;

  const handleCopyNumber = (accountNumber, id) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Paged accounts calculations
  const pagedAccounts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return accounts.slice(start, start + pageSize);
  }, [accounts, currentPage, pageSize]);

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Header Block */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between">
            <AppBox sx={{ minWidth: 0, flex: 1, pr: 1.5 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Bank Accounts
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Manage all your bank accounts in one place
              </AppText>
            </AppBox>
            <AppStack direction="row" gap={1} align="center">
              <AppIconButton
                icon={<FiRefreshCw className={isLoading ? "animate-spin" : ""} />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleRefresh}
                disabled={isLoading}
                sx={refreshMobileBtnSx}
              />
              <AppIconButton
                icon={<FiPlus />}
                variant="filled"
                colorVariant="success"
                size="small"
                rounded="md"
                onClick={handleAddAccount}
                sx={addAccountBtnSx}
              />
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Search & Filter Row */}
        <AppBox sx={searchFilterRowSx}>
          <AppBox sx={{ flex: 1, minWidth: 0 }}>
            <AppSearchInput
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search bank accounts..."
              clearable
              onClear={() => handleSearchChange("")}
              size="large"
              variant="bordered"
              rounded="md"
              sx={searchBarSx}
              inputSx={searchInputSx}
            />
          </AppBox>

          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="medium"
            rounded="md"
            startIcon={<FiFilter />}
            onClick={() => setShowFilters(!showFilters)}
            sx={filterBtnSx}
          >
            Filter
          </AppButton>
        </AppBox>

        {/* Expandable local filters */}
        {showFilters && (
          <div className="px-0 mb-3">
            <AppCard variant="default" rounded="md" bordered padding="none" sx={filtersCardSx}>
              <div className="p-3.5 space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-text-muted uppercase">Account Type</label>
                  <select
                    name="accountType"
                    value={filters.accountType}
                    onChange={handleFilterChange}
                    className="w-full h-[36px] px-2 text-[12.5px] border border-border rounded-md bg-surface text-text"
                  >
                    <option value="all">All Types</option>
                    {Object.values(BANK_ACCOUNT_TYPE).map((t) => (
                      <option key={t} value={t}>
                        {t === "CURRENT" ? "Current Account" : t === "SAVINGS" ? "Savings Account" : t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-text-muted uppercase">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full h-[36px] px-2 text-[12.5px] border border-border rounded-md bg-surface text-text"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </AppCard>
          </div>
        )}

        {/* Bank Account Cards List */}
        <div className="px-0">
          {!hasFilteredAccounts ? (
            <AppCard variant="default" rounded="lg" bordered padding="md" sx={emptyCardContainerSx}>
              <AppStack direction="column" align="center" justify="center" gap={1} sx={{ py: 4, width: "100%" }}>
                <FiSearch className="text-[28px] text-text-muted/60" />
                <AppHeading level={3} weight={700} align="center" sx={{ m: 0, fontSize: "13px", width: "100%" }}>
                  No accounts found
                </AppHeading>
                <AppText variant="body2" align="center" sx={emptyStateSubTextSx}>
                  Refine keywords or filters to inspect bank account catalog.
                </AppText>
                {(filters.search || filters.accountType !== "all" || filters.status !== "all") && (
                  <AppButton variant="text" colorVariant="primary" onClick={handleClearFilters}>
                    Clear Filters
                  </AppButton>
                )}
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1.2}>
              {pagedAccounts.map((account) => (
                <AppCard
                  key={account._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="sm"
                  padding="none"
                  sx={accountCardSx}
                >
                  <AppStack direction="row" align="center" gap={1.5} justify="space-between" sx={{ width: "100%", p: 1.5 }}>
                    {/* Left Info Block */}
                    <AppStack
                      direction="row"
                      align="center"
                      gap={1.5}
                      sx={{ minWidth: 0, flex: 1, cursor: "pointer" }}
                      onClick={() => handleViewDetails(account)}
                    >
                      <BankLogo bankName={account.displayBank} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <AppHeading level={3} weight={700} sx={accountTitleSx}>
                            {account.displayName}
                          </AppHeading>
                          {account.isPrimary && (
                            <span className="inline-flex items-center rounded bg-[#e6fcf5] px-1.5 py-0.2 text-[8px] font-bold text-[#0ca678] uppercase tracking-wide">
                              Primary
                            </span>
                          )}
                        </div>
                        <AppText variant="body2" sx={branchTextSx}>
                          {account.displayBank} • {account.displayBranch}
                        </AppText>
                      </div>
                    </AppStack>

                    {/* Right Stack */}
                    <AppStack direction="row" align="center" gap={1} sx={{ flexShrink: 0 }}>
                      <AppStack
                        direction="column"
                        align="flex-end"
                        gap={0.5}
                        sx={rightMetadataStackSx}
                      >
                        <span className="text-[9.5px] text-text-muted block">Balance</span>
                        <span className="text-[12.5px] font-extrabold text-text block mt-0.5">
                          ₹{account.balance?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </AppStack>

                      {/* Dropdown Action Menu */}
                      <AppMenu
                        triggerIcon={<FiMoreVertical />}
                        items={[
                          !account.isPrimary && {
                            label: "Set as Primary",
                            icon: <FiStar className="text-warning" />,
                            onClick: (e) => {
                              e.stopPropagation();
                              handleSetPrimary(account);
                            },
                          },
                          {
                            label: "View Details",
                            icon: <FiEye />,
                            onClick: (e) => {
                              e.stopPropagation();
                              handleViewDetails(account);
                            },
                          },
                          {
                            label: "Edit Account",
                            icon: <FiEdit2 />,
                            onClick: (e) => {
                              e.stopPropagation();
                              handleEditAccount(account);
                            },
                          },
                          {
                            label: "Delete Account",
                            icon: <FiTrash2 />,
                            danger: true,
                            onClick: (e) => {
                              e.stopPropagation();
                              handleDeleteAccount(account);
                            },
                          },
                        ].filter(Boolean)}
                        triggerProps={{
                          size: "small",
                          sx: {
                            color: "var(--app-color-text-muted)",
                            backgroundColor: "transparent",
                            border: "none",
                            p: 0.5,
                            minWidth: 0,
                            "&:hover": {
                              backgroundColor: "var(--app-color-surface-hover, #f1f5f9)",
                            },
                          },
                        }}
                      />
                    </AppStack>
                  </AppStack>

                  {/* Mid Info Grid Section */}
                  <div className="px-3.5 pb-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] border-t border-dashed border-border/80 pt-3">
                    <div>
                      <span className="text-text-muted block font-semibold">Account No.</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="font-mono font-bold text-text">{account.displayAccountNumber}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyNumber(account.displayAccountNumber, account._id);
                          }}
                          className="text-text-muted hover:text-primary transition p-0.5 hover:bg-surface-hover rounded cursor-pointer"
                        >
                          {copiedId === account._id ? (
                            <FiCheck className="text-[10px] text-success" />
                          ) : (
                            <FiCopy className="text-[10px]" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-text-muted block font-semibold">IFSC Code</span>
                      <span className="font-mono font-bold text-text block mt-0.5">
                        {account.displayIfsc || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-text-muted block font-semibold">Registered Mobile</span>
                      <span className="font-semibold text-text block mt-0.5">
                        {account.registeredMobile || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-text-muted block font-semibold">Account Type</span>
                      <div className="mt-0.5">
                        <AppTag
                          label={account.displayType}
                          variant="soft"
                          colorVariant={account.accountType === "SAVINGS" ? "success" : "primary"}
                          rounded="md"
                          sx={typeTagSx}
                        />
                      </div>
                    </div>
                  </div>
                </AppCard>
              ))}
            </AppStack>
          )}
        </div>

        {/* Conditional Pagination Footer */}
        {shouldRenderPagination && (
          <AppBox sx={paginationFooterWrapperSx}>
            <AppTablePagination
              page={currentPage}
              pageSize={pageSize}
              totalItems={totalAccounts}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageSize={false}
              showSummary={true}
              showFirstLast={false}
              compact={true}
              size="small"
              align="center"
              rounded="md"
              sx={{
                width: "100%",
                justifyContent: "center !important",
                alignItems: "center",
                textAlign: "center",
                "& .MuiPagination-root": {
                  display: "flex !important",
                  justifyContent: "center !important",
                  width: "100%",
                },
                "& .MuiPagination-ul": {
                  justifyContent: "center !important",
                  width: "100%",
                },
              }}
              summarySx={{
                textAlign: "center",
                width: "100%",
                mb: 0.5,
              }}
              paginationSx={{
                display: "flex !important",
                justifyContent: "center !important",
                alignItems: "center",
                width: "100%",
                "& .MuiPagination-ul": {
                  justifyContent: "center !important",
                  width: "100%",
                },
              }}
            />
          </AppBox>
        )}
      </AppBox>
    </section>
  );
};

// MUI style configurations
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

const refreshMobileBtnSx = {
  height: 36,
  width: 36,
  minWidth: 36,
  p: 0,
};

const addAccountBtnSx = {
  height: 36,
  width: 36,
  minWidth: 36,
  p: 0,
};

const searchFilterRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 0,
  py: 0.5,
};

const filterBtnSx = {
  height: 42,
  px: 2,
  fontSize: "13px",
  fontWeight: 650,
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  flexShrink: 0,
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

const accountCardSx = {
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  boxShadow:
    "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
  },
};

const accountTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 160,
};

const branchTextSx = {
  mt: 0.25,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

const rightMetadataStackSx = {
  pl: 1.5,
  borderLeft:
    "1px solid color-mix(in_srgb, var(--app-color-border) 60%, transparent)",
  minWidth: { xs: 85, sm: 100 },
  maxWidth: { xs: 100, sm: 120 },
  flexShrink: 0,
};

const typeTagSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 1,
  textTransform: "uppercase",
};

const paginationFooterWrapperSx = {
  px: 0,
  pt: 2,
  pb: 2,
  borderTop: "1px solid var(--app-color-divider)",
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": {
    width: "100%",
    display: "flex !important",
    justifyContent: "center !important",
    alignItems: "center",
    "& .MuiPagination-ul": {
      justifyContent: "center !important",
    },
    "& .MuiPagination-root": {
      display: "flex !important",
      justifyContent: "center !important",
    },
  },
};

const filtersCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

export default BankAccountsMobilePage;
