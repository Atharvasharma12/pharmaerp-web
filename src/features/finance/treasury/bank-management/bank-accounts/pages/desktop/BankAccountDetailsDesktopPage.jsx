import React from "react";
import {
  FiArrowLeft,
  FiEdit2,
  FiRefreshCw,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
  PageHeader,
} from "@/components";

// Dynamic CSS-based Bank Brand Logos
const BankLogo = ({ bankName }) => {
  const name = String(bankName || "").toLowerCase();

  if (name.includes("hdfc")) {
    return (
      <div className="w-12 h-12 rounded-lg bg-[#1d4f91] border border-border flex items-center justify-center text-white font-extrabold text-[12px] shrink-0 select-none shadow-sm">
        <span className="tracking-tighter">HDFC</span>
      </div>
    );
  }
  if (name.includes("icici")) {
    return (
      <div className="w-12 h-12 rounded-full bg-[#ff7a00] border border-[#d65f00] flex items-center justify-center text-white font-extrabold text-[16px] shrink-0 select-none shadow-sm relative">
        <span className="italic font-serif leading-none mt-[-1px]">i</span>
      </div>
    );
  }
  if (name.includes("axis")) {
    return (
      <div className="w-12 h-12 rounded-lg bg-[#971a43] border border-border flex items-center justify-center text-white font-bold text-[12px] shrink-0 select-none shadow-sm">
        <span>AXIS</span>
      </div>
    );
  }
  if (name.includes("state") || name.includes("sbi")) {
    return (
      <div className="w-12 h-12 rounded-full bg-[#00a3e0] border border-border flex items-center justify-center shrink-0 select-none shadow-sm relative">
        <div className="w-5 h-5 rounded-full bg-[#00a3e0] border-[2.5px] border-white flex items-center justify-center relative">
          <div className="absolute w-[2.5px] h-[9px] bg-white bottom-[-6px] left-[5px]"></div>
        </div>
      </div>
    );
  }
  if (name.includes("yes")) {
    return (
      <div className="w-12 h-12 rounded-lg bg-[#004b93] border border-border flex items-center justify-center text-white font-extrabold text-[12px] shrink-0 select-none shadow-sm">
        <span>YES</span>
      </div>
    );
  }
  if (name.includes("kotak")) {
    return (
      <div className="w-12 h-12 rounded-full bg-[#0039a6] border border-[#ea1c24] flex items-center justify-center text-white font-extrabold text-[16px] shrink-0 select-none shadow-sm">
        <span className="text-[#ea1c24] font-sans">k</span>
      </div>
    );
  }
  if (name.includes("canara")) {
    return (
      <div className="w-12 h-12 rounded-lg bg-[#00a3e0] border border-border flex items-center justify-center text-[#ffd100] font-extrabold text-[11px] shrink-0 select-none shadow-sm">
        <span className="tracking-tighter">CNB</span>
      </div>
    );
  }
  if (name.includes("baroda") || name.includes("bob")) {
    return (
      <div className="w-12 h-12 rounded-full bg-[#f05a28] border border-border flex items-center justify-center text-white font-extrabold text-[14px] shrink-0 select-none shadow-sm">
        <span>BOB</span>
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-lg bg-surface-alt border border-border flex items-center justify-center text-text-muted font-bold shrink-0 shadow-sm">
      <LuBuilding2 className="text-[24px]" />
    </div>
  );
};

const BankAccountDetailsDesktopPage = ({
  account,
  isLoading = false,
  hasError = false,
  error,
  handleBack,
  handleEdit,
  handleRefresh,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5 flex items-center justify-center">
        <AppText
          variant="body1"
          sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}
        >
          Loading bank account details...
        </AppText>
      </section>
    );
  }

  if (hasError || !account) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
        <div className="mx-auto w-full max-w-[1200px] text-center py-10">
          <AppHeading
            level={2}
            weight={700}
            sx={{ color: "var(--app-color-text)" }}
          >
            Loading Bank Account
          </AppHeading>
          <AppText
            variant="body1"
            sx={{ color: "var(--app-color-danger)", mt: 1 }}
          >
            {error || "Bank account not found or has been deleted."}
          </AppText>
          <AppButton
            variant="contained"
            colorVariant="primary"
            onClick={handleBack}
            sx={{ mt: 3 }}
          >
            Back to Bank Accounts
          </AppButton>
        </div>
      </section>
    );
  }

  const resolvedBankName =
    account.bank ||
    account.bankMasterId?.bankName ||
    account.bankMasterId?.name ||
    "Bank Account";

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page Header */}
        <PageHeader
          title={account.accountName}
          subtitle={`Details for corporate bank account: ${account.accountNumber}`}
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Bank Accounts", onClick: handleBack },
                { label: account.accountName, current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Toolbar */}
        <div className="mt-4 flex items-center justify-between">
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            sx={actionBtnSx}
          >
            Back
          </AppButton>

          <AppStack direction="row" gap={1.5} align="center">
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiRefreshCw />}
              onClick={handleRefresh}
              sx={actionBtnSx}
            >
              Refresh
            </AppButton>
            <AppButton
              type="button"
              variant="filled"
              colorVariant="primary"
              rounded="md"
              size="small"
              startIcon={<FiEdit2 />}
              onClick={handleEdit}
              sx={editBtnSx}
            >
              Edit Details
            </AppButton>
          </AppStack>
        </div>

        {/* Main Details Panel */}
        <div className="mt-5 grid grid-cols-3 gap-5">
          {/* Left card: Core Identity & Balances */}
          <div className="col-span-1 space-y-5">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={leftCardSx}
            >
              <div className="flex flex-col items-center text-center p-4">
                <BankLogo bankName={resolvedBankName} />
                <AppHeading level={2} weight={700} sx={titleSx}>
                  {account.accountName}
                </AppHeading>
                <div className="mt-2 flex items-center gap-1.5 flex-wrap justify-center">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase border ${
                      String(account.accountType).toUpperCase() === "SAVINGS"
                        ? "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]"
                        : "bg-[#e7f5ff] text-[#1c7ed6] border-[#d0ebff]"
                    }`}
                  >
                    {account.accountType === "CURRENT"
                      ? "Current"
                      : account.accountType === "SAVINGS"
                        ? "Savings"
                        : account.accountType}
                  </span>
                  {account.isPrimary && (
                    <span className="inline-flex items-center rounded bg-[#e6fcf5] px-2 py-0.5 text-[10.5px] font-bold text-[#0ca678] uppercase tracking-wide">
                      Primary
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase border ${
                      account.isActive !== false
                        ? "bg-success-soft text-success border-success/30"
                        : "bg-danger-soft text-danger border-danger/30"
                    }`}
                  >
                    {account.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="border-t border-border p-4 text-center">
                <span className="text-[12px] text-text-muted block">
                  Available Balance
                </span>
                <span className="text-[24px] font-extrabold text-text block mt-1">
                  ₹{" "}
                  {account.balance?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0.00"}
                </span>
              </div>
            </AppCard>
          </div>

          {/* Right card: Comprehensive Details */}
          <div className="col-span-2 space-y-5">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={rightCardSx}
            >
              <div className="px-5 py-4 border-b border-border">
                <AppHeading level={3} weight={700} sx={cardTitleSx}>
                  Bank Account Metadata
                </AppHeading>
              </div>

              <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-5 text-[13px]">
                <div>
                  <span className="text-text-muted block font-semibold">
                    Bank Name
                  </span>
                  <span className="font-semibold text-text block mt-1">
                    {resolvedBankName}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block font-semibold">
                    Account Number
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-mono font-bold text-text text-[13.5px]">
                      {account.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(account.accountNumber)}
                      className="text-text-muted hover:text-primary transition p-1 hover:bg-surface-hover rounded cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copied ? (
                        <FiCheck className="text-[14px] text-success" />
                      ) : (
                        <FiCopy className="text-[14px]" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-text-muted block font-semibold">
                    IFSC Code
                  </span>
                  <span className="font-mono font-bold text-text block mt-1 uppercase text-[13.5px]">
                    {account.ifscCode || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block font-semibold">
                    Branch Name
                  </span>
                  <span className="font-semibold text-text block mt-1">
                    {account.branchName || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block font-semibold">
                    Registered Mobile
                  </span>
                  <span className="font-semibold text-text block mt-1">
                    {account.registeredMobile || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-text-muted block font-semibold">
                    Mapped General Ledger
                  </span>
                  <span className="font-bold text-primary block mt-1">
                    {account.ledgerAccountId?.accountCode
                      ? `[${account.ledgerAccountId.accountCode}] ${account.ledgerAccountId.accountName}`
                      : "-"}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-text-muted block font-semibold">
                    Branch Address
                  </span>
                  <span className="text-text block mt-1 leading-relaxed">
                    {account.branchAddress || "-"}
                  </span>
                </div>
              </div>
            </AppCard>
          </div>
        </div>
      </div>
    </section>
  );
};

// Styling variables
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  cursor: "pointer",
  "&:hover": { color: "var(--app-color-primary)" },
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "23px",
    lineHeight: 1.15,
    letterSpacing: "-0.4px",
    color: "var(--app-color-text)",
  },
};

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

const editBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
  bgcolor: "var(--app-color-primary)",
  "&:hover": { bgcolor: "var(--app-color-primary-hover)" },
};

const leftCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  height: "100%",
};

const rightCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const titleSx = {
  m: 0,
  mt: 2,
  fontSize: "16px",
  color: "var(--app-color-text)",
};

const cardTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

export default BankAccountDetailsDesktopPage;
