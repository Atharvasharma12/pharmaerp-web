import React, { useMemo } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
} from "@/components";
import { formatCurrency } from "@/utils";

const typeOptions = [
  { label: "Journal Voucher (JV)", value: "JOURNAL" },
  { label: "Payment Voucher (PV)", value: "PAYMENT" },
  { label: "Receipt Voucher (RV)", value: "RECEIPT" },
  { label: "Contra Voucher (CV)", value: "CONTRA" },
  { label: "Purchase Voucher", value: "PURCHASE" },
  { label: "Sale Voucher", value: "SALE" },
  { label: "Opening Balance (OB)", value: "OPENING_BALANCE" },
];

const statusOptions = [
  { label: "Draft Voucher (Saved)", value: "DRAFT" },
  { label: "Post Directly to Ledger", value: "POSTED" },
];

const CreateJournalVoucherMobilePage = ({
  formData,
  formErrors = {},
  accounts = [],
  isLoading = false,
  handleFieldChange,
  handleLineChange,
  handleAddLine,
  handleRemoveLine,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
}) => {
  const accountOptions = useMemo(() => {
    return [
      { label: "Choose Account...", value: "" },
      ...accounts.map((acc) => ({
        label: `${acc.accountCode} - ${acc.accountName}`,
        value: acc._id,
      })),
    ];
  }, [accounts]);

  // Calculate Running Totals
  const totals = useMemo(() => {
    let debitSum = 0;
    let creditSum = 0;
    formData.lines.forEach((line) => {
      debitSum += parseFloat(line.debit) || 0;
      creditSum += parseFloat(line.credit) || 0;
    });
    const difference = Math.abs(debitSum - creditSum);
    const isBalanced = debitSum > 0 && difference < 0.009;
    return { debitSum, creditSum, difference, isBalanced };
  }, [formData.lines]);

  return (
    <section className="w-full bg-bg pb-20">
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
              onClick={handleCancel}
              sx={actionHeaderIconBtnSx}
            />
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Create Voucher
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Post adjustments to ledger accounts
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Content stack */}
        <div className="px-0 space-y-4">
          {/* Server Error / Submit Errors */}
          {serverError && (
            <div className="mx-4 p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md flex justify-between items-center">
              <span>{serverError}</span>
              <button
                type="button"
                onClick={clearError}
                className="text-danger font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {formErrors.submit && (
            <div className="mx-4 p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md">
              {formErrors.submit}
            </div>
          )}

          {/* Form parameters card */}
          <AppCard
            variant="default"
            rounded="none"
            bordered
            shadow="none"
            padding="none"
            sx={formCardSx}
          >
            <div className="p-3.5 border-b border-border">
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Voucher Header
              </AppHeading>
            </div>

            <div className="p-3.5 space-y-3.5">
              {/* Date */}
              <AppInput
                type="date"
                label="Voucher Date"
                name="voucherDate"
                value={formData.voucherDate}
                onChange={(e) => handleFieldChange("voucherDate", e.target.value)}
                required
                error={Boolean(formErrors.voucherDate)}
                helperText={formErrors.voucherDate}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Type */}
              <AppSelect
                label="Voucher Type"
                name="voucherType"
                value={formData.voucherType}
                onChange={(e) => handleFieldChange("voucherType", e.target.value)}
                options={typeOptions}
                size="small"
                variant="bordered"
                rounded="md"
                required
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Reference */}
              <AppInput
                label="Reference Number (Optional)"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={(e) => handleFieldChange("referenceNumber", e.target.value)}
                placeholder="e.g. JV-109283"
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Status */}
              <AppSelect
                label="Post Status"
                name="status"
                value={formData.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                options={statusOptions}
                size="small"
                variant="bordered"
                rounded="md"
                required
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Narration */}
              <AppInput
                label="Voucher Narration (Optional)"
                name="narration"
                value={formData.narration}
                onChange={(e) => handleFieldChange("narration", e.target.value)}
                placeholder="Adjustment description..."
                multiline
                rows={2}
                labelSx={labelSx}
                inputSx={{ ...inputSx, height: "auto" }}
              />
            </div>
          </AppCard>

          {/* Posting ledger lines */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-4">
              <AppHeading level={3} weight={700} sx={{ m: 0, fontSize: "12.5px", color: "var(--app-color-text)" }}>
                Ledger Entries
              </AppHeading>
              <button
                type="button"
                onClick={handleAddLine}
                className="px-2.5 py-1 text-[11px] font-bold text-primary bg-primary-soft hover:bg-primary-soft/80 rounded transition"
              >
                + Add Row
              </button>
            </div>

            {formErrors.lines && (
              <div className="mx-4 p-3 bg-danger-soft text-danger text-[11.5px] font-bold rounded-md">
                {formErrors.lines}
              </div>
            )}

            {formData.lines.map((line, idx) => (
              <AppCard
                key={idx}
                variant="default"
                rounded="none"
                bordered
                shadow="none"
                padding="none"
                sx={formCardSx}
              >
                <div className="p-3.5 border-b border-border flex items-center justify-between">
                  <span className="font-bold text-[11.5px] text-text-muted">Line Item #{idx + 1}</span>
                  <button
                    type="button"
                    disabled={formData.lines.length <= 2}
                    onClick={() => handleRemoveLine(idx)}
                    className={`p-1 text-text-muted hover:text-danger rounded transition ${
                      formData.lines.length <= 2 ? "opacity-30 cursor-not-allowed" : ""
                    }`}
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="p-3.5 space-y-3.5">
                  {/* Account Select */}
                  <AppSelect
                    label="Account"
                    name={`lines.${idx}.accountId`}
                    value={line.accountId}
                    onChange={(e) => handleLineChange(idx, "accountId", e.target.value)}
                    options={accountOptions}
                    size="small"
                    variant="bordered"
                    rounded="md"
                    inputSx={compactFilterInputSx}
                    labelSx={labelSx}
                  />

                  {/* Debit / Credit row */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <AppInput
                      type="number"
                      step="0.01"
                      label="Debit ($)"
                      name={`lines.${idx}.debit`}
                      value={line.debit || ""}
                      onChange={(e) => handleLineChange(idx, "debit", e.target.value)}
                      placeholder="0.00"
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />

                    <AppInput
                      type="number"
                      step="0.01"
                      label="Credit ($)"
                      name={`lines.${idx}.credit`}
                      value={line.credit || ""}
                      onChange={(e) => handleLineChange(idx, "credit", e.target.value)}
                      placeholder="0.00"
                      labelSx={labelSx}
                      inputSx={inputSx}
                    />
                  </div>

                  {/* Line Memo */}
                  <AppInput
                    label="Line Memo (Optional)"
                    name={`lines.${idx}.narration`}
                    value={line.narration}
                    onChange={(e) => handleLineChange(idx, "narration", e.target.value)}
                    placeholder="Memo notes..."
                    labelSx={labelSx}
                    inputSx={inputSx}
                  />
                </div>
              </AppCard>
            ))}
          </div>
        </div>

        {/* running totals summation fixed footer */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3.5 flex flex-col gap-2.5 shadow-lg max-w-[460px] mx-auto w-full">
          <div className="flex justify-between items-center text-[12.5px]">
            {totals.isBalanced ? (
              <div className="inline-flex items-center gap-1 text-[#2b8a3e] font-bold">
                <FiCheckCircle />
                <span>Balanced</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 text-[#fa5252] font-bold">
                <FiAlertTriangle />
                <span>Imbalanced</span>
              </div>
            )}

            <div className="flex gap-4 font-extrabold text-[12px]">
              <div>
                <span className="text-text-muted font-normal text-[10px] block">Debit:</span>
                <span className="text-[#2b8a3e]">{formatCurrency(totals.debitSum)}</span>
              </div>
              <div>
                <span className="text-text-muted font-normal text-[10px] block">Credit:</span>
                <span className="text-[#e64980]">{formatCurrency(totals.creditSum)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full pt-1">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 py-2 text-[12px] font-bold border border-border bg-surface rounded-md text-text hover:bg-surface-hover/20 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="flex-1 py-2 text-[12px] font-bold bg-primary text-surface rounded-md hover:bg-primary-hover transition"
            >
              {isLoading ? "Saving..." : "Create Voucher"}
            </button>
          </div>
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
  px: 0,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 2,
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

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const labelSx = {
  fontSize: "11.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  mb: 0.5,
};

const inputSx = {
  minHeight: 35,
  fontSize: "12.0px",
  bgcolor: "var(--app-color-surface)",
};

export default CreateJournalVoucherMobilePage;
