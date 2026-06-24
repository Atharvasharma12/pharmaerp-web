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
  AppStatusBadge,
} from "@/components";

import { BANK_ACCOUNT_TYPE } from "../../constants/bankAccount.constant";

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const typeColorMap = {
  CURRENT: "primary",
  SAVINGS: "success",
  OVERDRAFT: "warning",
  CASH_CREDIT: "purple",
};

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
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const shouldRenderPagination = hasFilteredAccounts && totalAccounts > 0;

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
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Header Block */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between">
            <AppBox>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Bank Accounts
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Manage all your bank accounts in one place.
              </AppText>
            </AppBox>
            <AppIconButton
              icon={<FiPlus />}
              variant="filled"
              colorVariant="success"
              size="medium"
              rounded="full"
              onClick={handleAddAccount}
              sx={addAccountBtnSx}
            />
          </AppStack>
        </AppBox>

        {/* Search Row */}
        <AppBox sx={searchWrapperSx}>
          <AppSearchInput
            name="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search bank accounts by name, code..."
            clearable
            onClear={() => handleSearchChange("")}
            size="large"
            variant="bordered"
            rounded="md"
            sx={searchBarSx}
            inputSx={searchInputSx}
          />
        </AppBox>

        {/* Filter Trigger Row */}
        <AppBox sx={filterActionRowSx}>
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiFilter />}
            onClick={() => setShowFilters(!showFilters)}
            sx={filterToggleBtnSx}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </AppButton>

          <AppText variant="body2" sx={accountCountTextSx}>
            {totalAccounts} Accounts found
          </AppText>
        </AppBox>

        {/* Expandable local filters */}
        {showFilters && (
          <AppCard variant="default" rounded="md" bordered sx={filtersCardSx}>
            <AppStack direction="column" gap={1.5}>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-text-muted uppercase">Account Type</label>
                <select
                  name="accountType"
                  value={filters.accountType}
                  onChange={handleFilterChange}
                  className="w-full h-9 px-2 text-[12.5px] border border-border rounded-md bg-surface"
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
                  className="w-full h-9 px-2 text-[12.5px] border border-border rounded-md bg-surface"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <AppButton
                variant="text"
                colorVariant="primary"
                onClick={handleClearFilters}
                sx={{ alignSelf: "flex-end", fontSize: "11.5px", p: 0.5 }}
              >
                Clear All Filters
              </AppButton>
            </AppStack>
          </AppCard>
        )}

        {/* Bank Account Cards List */}
        <AppBox sx={listingListWrapperSx}>
          {!hasFilteredAccounts ? (
            <AppCard variant="default" rounded="md" bordered padding="md" sx={emptyCardContainerSx}>
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
                  bordered={false}
                  shadow="sm"
                  padding="none"
                  sx={accountCardSx}
                >
                  {/* Top segment with Bank logo and title info */}
                  <AppStack direction="row" align="flex-start" gap={1.2}>
                    <BankLogo bankName={account.displayBank} />

                    <AppBox sx={{ minWidth: 0, flex: 1 }}>
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

                      {/* Account details */}
                      <AppStack direction="row" align="center" gap={1.5} sx={{ mt: 1 }}>
                        <div className="flex items-center gap-1">
                          <AppText variant="body2" sx={accountNumSx}>
                            {account.displayAccountNumber}
                          </AppText>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyNumber(account.displayAccountNumber, account._id);
                            }}
                            className="text-text-muted hover:text-primary transition p-1 hover:bg-surface-hover rounded cursor-pointer"
                          >
                            {copiedId === account._id ? (
                              <FiCheck className="text-[11px] text-success" />
                            ) : (
                              <FiCopy className="text-[11px]" />
                            )}
                          </button>
                        </div>
                      </AppStack>

                      {/* Balance section */}
                      <div className="mt-2.5">
                        <span className="text-[11px] text-text-muted">Balance: </span>
                        <span className="text-[13px] font-bold text-text">
                          ₹ {account.balance?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </AppBox>

                    <AppStack direction="column" align="flex-end" gap={0.5} sx={{ flexShrink: 0 }}>
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${account.displayStatus === "active" ? "bg-success" : "bg-danger"}`}></span>
                        <span
                          className={`text-[10px] font-bold capitalize ${
                            account.displayStatus === "active" ? "text-success" : "text-danger"
                          }`}
                        >
                          {account.displayStatus}
                        </span>
                      </div>
                      <AppTag
                        label={account.displayType}
                        variant="soft"
                        colorVariant={account.accountType === "SAVINGS" ? "success" : "primary"}
                        rounded="md"
                        sx={typeTagSx}
                      />
                    </AppStack>
                  </AppStack>

                  {/* Actions segment at the bottom of the card */}
                  <div className="flex items-center justify-between border-t border-border mt-3.5 pt-2.5">
                    <div>
                      {account.displayIfsc && (
                        <span className="text-[10px] font-mono text-text-muted bg-surface-alt px-1.5 py-0.5 rounded border border-border">
                          IFSC: {account.displayIfsc}
                        </span>
                      )}
                    </div>
                    <AppStack direction="row" gap={1} align="center">
                      {!account.isPrimary && (
                        <AppIconButton
                          icon={<FiStar className="text-[14px]" />}
                          variant="text"
                          colorVariant="warning"
                          size="small"
                          rounded="md"
                          onClick={() => handleSetPrimary(account)}
                        />
                      )}
                      <AppIconButton
                        icon={<FiEye className="text-[14px]" />}
                        variant="text"
                        colorVariant="neutral"
                        size="small"
                        rounded="md"
                        onClick={() => handleViewDetails(account)}
                      />
                      <AppIconButton
                        icon={<FiEdit2 className="text-[14px]" />}
                        variant="text"
                        colorVariant="neutral"
                        size="small"
                        rounded="md"
                        onClick={() => handleEditAccount(account)}
                      />
                      <AppIconButton
                        icon={<FiTrash2 className="text-[14px]" />}
                        variant="text"
                        colorVariant="danger"
                        size="small"
                        rounded="md"
                        onClick={() => handleDeleteAccount(account)}
                      />
                    </AppStack>
                  </div>
                </AppCard>
              ))}
            </AppStack>
          )}
        </AppBox>

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
      </AppBox>
    </section>
  );
};

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
  pb: 1,
  px: 0,
};

const pageTitleSx = {
  m: 0,
  fontSize: "19px",
  color: "var(--app-color-text)",
  letterSpacing: "-0.3px",
};

const pageSubtitleSx = {
  mt: 0.5,
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const addAccountBtnSx = {
  boxShadow: "var(--app-shadow-md)",
  bgcolor: "#00b85c",
  color: "white",
  "&:hover": { bgcolor: "#009e4f" },
};

const searchWrapperSx = {
  px: 0,
  py: 1,
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

const filterActionRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 0,
  py: 1.5,
};

const filterToggleBtnSx = {
  height: 36,
  px: 1.5,
  fontSize: "12.5px",
  fontWeight: 600,
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const accountCountTextSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const filtersCardSx = {
  p: 1.5,
  mb: 2.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
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

const accountCardSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  border: "none",
  boxShadow: "0 2px 8px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
  },
};

const accountTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 160,
};

const branchTextSx = {
  mt: 0.25,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 220,
};

const accountNumSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  fontFamily: "monospace",
  color: "var(--app-color-text)",
};

const statusBadgeSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 1,
  textTransform: "capitalize",
};

const typeTagSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 1,
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

export default BankAccountsMobilePage;
