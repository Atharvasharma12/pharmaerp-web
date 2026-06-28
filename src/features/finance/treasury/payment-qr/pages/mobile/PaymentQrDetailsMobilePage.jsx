import React from "react";
import { FiArrowLeft, FiEdit2, FiRefreshCw, FiCopy } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";

const PaymentQrDetailsMobilePage = ({
  paymentQr,
  isLoading = false,
  hasError = false,
  error,
  handleBack,
  handleEdit,
  handleRefresh,
}) => {
  if (isLoading) {
    return (
      <section className="w-full bg-bg py-8 flex items-center justify-center">
        <AppText
          variant="body2"
          sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}
        >
          Loading Payment QR details...
        </AppText>
      </section>
    );
  }

  if (hasError || !paymentQr) {
    return (
      <section className="w-full bg-bg px-4 py-8 text-center">
        <AppHeading
          level={2}
          weight={700}
          sx={{ fontSize: "16px", color: "var(--app-color-text)" }}
        >
          Loading Payment QR
        </AppHeading>
        <AppText
          variant="body2"
          sx={{ color: "var(--app-color-danger)", mt: 1 }}
        >
          {error || "Payment QR details could not be found."}
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

  const handleCopyUpiId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(paymentQr.upiId);
    alert(`Copied UPI ID: ${paymentQr.upiId}`);
  };

  const getProviderTag = (provider) => {
    const raw = String(provider || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";
    if (raw === "GPAY") bg = "bg-[#e8f0fe] text-[#1a73e8] border-[#adcdfc]";
    else if (raw === "PHONEPE")
      bg = "bg-[#f3e8ff] text-[#7c3aed] border-[#ddd6fe]";
    else if (raw === "PAYTM")
      bg = "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]";
    else if (raw === "BHIM")
      bg = "bg-[#ccfbf1] text-[#0d9488] border-[#99f6e4]";
    else if (raw === "RAZORPAY")
      bg = "bg-[#e0e7ff] text-[#4f46e5] border-[#c7d2fe]";
    else if (raw === "CASHFREE")
      bg = "bg-[#ffedd5] text-[#ea580c] border-[#fed7aa]";

    return (
      <span
        className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase border ${bg}`}
      >
        {raw}
      </span>
    );
  };

  const isActive = String(paymentQr.status || "").toUpperCase() === "ACTIVE";

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            gap={1}
            justify="space-between"
          >
            <AppStack
              direction="row"
              align="center"
              gap={1}
              sx={{ minWidth: 0, flex: 1 }}
            >
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
                  {paymentQr.label || "QR Details"}
                </AppHeading>
                <AppText variant="body2" sx={pageSubtitleSx}>
                  UPI receiver configuration
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

        {/* Content stack */}
        <div className="px-2 space-y-4">
          {/* QR visual Preview card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={formCardSx}
          >
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center text-text border border-border/40 shrink-0 shadow-xs">
                <LuQrCode className="text-[20px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <AppHeading
                    level={2}
                    weight={700}
                    sx={{
                      m: 0,
                      fontSize: "14px",
                      color: "var(--app-color-text)",
                    }}
                  >
                    {paymentQr.label || "UPI QR Register"}
                  </AppHeading>
                  {getProviderTag(paymentQr.provider)}
                  {paymentQr.isPrimary && (
                    <span className="inline-flex items-center rounded bg-[#fff9db] px-1.5 py-0.2 text-[8px] font-bold text-[#f08c00] uppercase tracking-wide">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-success" : "bg-danger"}`}
                  ></span>
                  <span
                    className={`text-[10px] font-bold capitalize ${isActive ? "text-success" : "text-danger"}`}
                  >
                    {String(paymentQr.status || "").toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual QR Image Preview */}
            <div className="border-t border-border/60 p-4 bg-surface-alt/5 flex justify-center">
              <div className="w-[160px] h-[160px] bg-white border border-border/60 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-xs">
                {paymentQr.qrImageUrl ? (
                  <img
                    src={paymentQr.qrImageUrl}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-text-muted/40">
                    <LuQrCode className="text-[65px]" />
                    <span className="text-[9px] text-text-muted mt-1 font-semibold">
                      Image Not Set
                    </span>
                  </div>
                )}
              </div>
            </div>
          </AppCard>

          {/* Metadata Card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={formCardSx}
          >
            <div className="p-3.5 border-b border-border">
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Metadata Details
              </AppHeading>
            </div>

            <div className="p-3.5 space-y-3.5 text-[12px]">
              <div>
                <span className="text-text-muted block font-semibold">
                  UPI ID / Address
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-bold text-text block break-all">
                    {paymentQr.upiId}
                  </span>
                  <button
                    onClick={handleCopyUpiId}
                    className="p-1 text-text-muted hover:text-primary rounded hover:bg-surface-hover/20 cursor-pointer"
                  >
                    <FiCopy className="text-[10px]" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">
                  Linked Settlement Bank
                </span>
                {paymentQr.bankAccountId ? (
                  <span className="font-bold text-primary block mt-0.5 leading-relaxed break-words">
                    {paymentQr.bankAccountId.bankName} - A/C:{" "}
                    {paymentQr.bankAccountId.accountNumber}
                  </span>
                ) : (
                  <span className="font-semibold text-text block mt-0.5">
                    -
                  </span>
                )}
              </div>

              {paymentQr.qrImageUrl && (
                <div>
                  <span className="text-text-muted block font-semibold">
                    QR Code Image Link
                  </span>
                  <a
                    href={paymentQr.qrImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-primary hover:underline block mt-0.5 break-all text-[11px]"
                  >
                    {paymentQr.qrImageUrl}
                  </a>
                </div>
              )}
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
  maxWidth: 160,
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

export default PaymentQrDetailsMobilePage;
