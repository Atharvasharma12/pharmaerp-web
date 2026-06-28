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
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";

// Dynamic CSS-based Bank Brand Logos
const BankLogo = ({ bankName }) => {
  const name = String(bankName || "").toLowerCase();
  
  if (name.includes("hdfc")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#1d4f91] border border-border flex items-center justify-center text-white font-extrabold text-[10px] shrink-0 select-none shadow-sm">
        <span className="tracking-tighter">HDFC</span>
      </div>
    );
  }
  if (name.includes("icici")) {
    return (
      <div className="w-11 h-11 rounded-full bg-[#ff7a00] border border-[#d65f00] flex items-center justify-center text-white font-extrabold text-[14px] shrink-0 select-none shadow-sm relative">
        <span className="italic font-serif leading-none mt-[-1px]">i</span>
      </div>
    );
  }
  if (name.includes("axis")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#971a43] border border-border flex items-center justify-center text-white font-bold text-[10px] shrink-0 select-none shadow-sm">
        <span>AXIS</span>
      </div>
    );
  }
  if (name.includes("state") || name.includes("sbi")) {
    return (
      <div className="w-11 h-11 rounded-full bg-[#00a3e0] border border-border flex items-center justify-center shrink-0 select-none shadow-sm relative">
        <div className="w-4 h-4 rounded-full bg-[#00a3e0] border-[2.5px] border-white flex items-center justify-center relative">
          <div className="absolute w-[2.5px] h-[8px] bg-white bottom-[-5px] left-[4px]"></div>
        </div>
      </div>
    );
  }
  if (name.includes("yes")) {
    return (
      <div className="w-11 h-11 rounded-lg bg-[#004b93] border border-border flex items-center justify-center text-white font-extrabold text-[10px] shrink-0 select-none shadow-sm">
        <span>YES</span>
      </div>
    );
  }
  if (name.includes("kotak")) {
    return (
      <div className="w-11 h-11 rounded-full bg-[#0039a6] border border-[#ea1c24] flex items-center justify-center text-white font-extrabold text-[14px] shrink-0 select-none shadow-sm">
        <span className="text-[#ea1c24] font-sans">k</span>
      </div>
    );
  }
  return (
    <div className="w-11 h-11 rounded-lg bg-surface-alt border border-border flex items-center justify-center text-text-muted font-bold shrink-0 shadow-sm">
      <LuBuilding2 className="text-[20px]" />
    </div>
  );
};

const BankAccountDetailsMobilePage = ({
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
      <section className="w-full bg-bg py-8 flex items-center justify-center">
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Loading bank details...
        </AppText>
      </section>
    );
  }

  if (hasError || !account) {
    return (
      <section className="w-full bg-bg px-4 py-8 text-center">
        <AppHeading level={2} weight={700} sx={{ fontSize: "16px", color: "var(--app-color-text)" }}>
           Loading Bank Account
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-danger)", mt: 1 }}>
          {error || "Bank account details could not be found."}
        </AppText>
        <AppIconButton
          icon={<FiArrowLeft />}
          variant="filled"
          colorVariant="primary"
          onClick={handleBack}
          sx={{ mt: 3, mx: "auto" }}
        />
      </section>
    );
  }

  const resolvedBankName =
    account.bank ||
    account.bankMasterId?.bankName ||
    account.bankMasterId?.name ||
    "Bank Account";

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" gap={1} justify="space-between">
            <AppStack direction="row" align="center" gap={1} sx={{ minWidth: 0, flex: 1 }}>
              <AppIconButton
                icon={<FiArrowLeft />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleBack}
                sx={actionHeaderIconBtnSx}
              />
              <AppBox sx={{ minWidth: 0, flex: 1 }}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {account.accountName}
                </AppHeading>
                <AppText variant="body2" sx={pageSubtitleSx}>
                  Account detail report
                </AppText>
              </AppBox>
            </AppStack>

            <AppStack direction="row" gap={0.8} align="center">
              <AppIconButton
                icon={<FiRefreshCw />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleRefresh}
                sx={actionHeaderIconBtnSx}
              />
              <AppIconButton
                icon={<FiEdit2 />}
                variant="filled"
                colorVariant="primary"
                size="small"
                rounded="md"
                onClick={handleEdit}
                sx={editMobileBtnSx}
              />
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Content cards stack */}
        <div className="px-2 space-y-4">
          {/* Overview Balance Card */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
            <div className="p-4 flex items-center gap-3">
              <BankLogo bankName={resolvedBankName} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 flex-wrap">
                  <AppHeading level={2} weight={700} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                    {account.accountName}
                  </AppHeading>
                  {account.isPrimary && (
                    <span className="inline-flex items-center rounded bg-[#e6fcf5] px-1.5 py-0.2 text-[8px] font-bold text-[#0ca678] uppercase tracking-wide">
                      Primary
                    </span>
                  )}
                </div>
                <AppText variant="body2" sx={{ fontSize: "11px", color: "var(--app-color-text-muted)", mt: 0.25 }}>
                  {resolvedBankName} • {account.accountType}
                </AppText>
              </div>
            </div>

            <div className="border-t border-border/60 p-4 bg-surface-alt/5 rounded-b-lg">
              <span className="text-[10px] text-text-muted block">Available Balance</span>
              <span className="text-[18px] font-extrabold text-text block mt-0.5">
                ₹ {account.balance?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
              </span>
            </div>
          </AppCard>

          {/* Account Details Card */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
            <div className="p-3.5 border-b border-border">
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Metadata Details
              </AppHeading>
            </div>

            <div className="p-3.5 space-y-3.5 text-[12px]">
              <div>
                <span className="text-text-muted block font-semibold">Account Number</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-bold text-text text-[12.5px]">
                    {account.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(account.accountNumber)}
                    className="text-text-muted hover:text-primary transition p-0.5 hover:bg-surface-hover rounded cursor-pointer"
                  >
                    {copied ? (
                      <FiCheck className="text-[12px] text-success" />
                    ) : (
                      <FiCopy className="text-[12px]" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">IFSC Code</span>
                <span className="font-mono font-bold text-text block mt-0.5 uppercase text-[12.5px]">
                  {account.ifscCode || "-"}
                </span>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">Branch Name</span>
                <span className="font-semibold text-text block mt-0.5">
                  {account.branchName || "-"}
                </span>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">Registered Mobile</span>
                <span className="font-semibold text-text block mt-0.5">
                  {account.registeredMobile || "-"}
                </span>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">Account Status</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${account.isActive !== false ? "bg-success" : "bg-danger"}`}></span>
                  <span
                    className={`text-[11px] font-bold capitalize ${
                      account.isActive !== false ? "text-success" : "text-danger"
                    }`}
                  >
                    {account.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">Mapped General Ledger</span>
                <span className="font-bold text-primary block mt-0.5">
                  {account.ledgerAccountId?.accountCode
                    ? `[${account.ledgerAccountId.accountCode}] ${account.ledgerAccountId.accountName}`
                    : "-"}
                </span>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">Branch Address</span>
                <span className="text-text block mt-0.5 leading-relaxed text-[11.5px]">
                  {account.branchAddress || "-"}
                </span>
              </div>
            </div>
          </AppCard>
        </div>
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
  px: 0.5,
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
  fontSize: "17.5px",
  lineHeight: 1.15,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 180,
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

const editMobileBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  bgcolor: "var(--app-color-primary)",
  color: "white",
  "&:hover": { bgcolor: "var(--app-color-primary-hover)" },
};

const formCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const cardTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

export default BankAccountDetailsMobilePage;
