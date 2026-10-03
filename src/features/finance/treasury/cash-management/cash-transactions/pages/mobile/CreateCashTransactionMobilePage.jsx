import React, { useMemo } from "react";
import { FiArrowLeft } from "react-icons/fi";

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

const typeOptions = [
  { label: "Choose Type...", value: "" },
  { label: "Cash Inward", value: "CASH_IN" },
  { label: "Cash Outward", value: "CASH_OUT" },
  { label: "Direct Cash Expense", value: "EXPENSE" },
  { label: "Petty Cash Voucher", value: "PETTY_CASH" },
  { label: "Other Cash Posting", value: "OTHER" },
];

const directionOptions = [
  { label: "Choose Direction...", value: "" },
  { label: "Inward (Credit)", value: "CREDIT" },
  { label: "Outward (Debit)", value: "DEBIT" },
];

const statusOptions = [
  { label: "Save as Draft", value: "DRAFT" },
  { label: "Post directly", value: "POSTED" },
];

const CreateCashTransactionMobilePage = ({
  formData,
  formErrors = {},
  denominations = [],
  physicalTotal = 0,
  isLoading = false,
  partitionOptions = [],
  accounts = [],
  handleFieldChange,
  handleQtyChange,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
  selectedCashAccount,
}) => {


  const accountOptions = useMemo(() => {
    return [
      { label: "Select Ledger Account...", value: "" },
      ...accounts.map((acc) => ({
        label: `${acc.accountCode} - ${acc.accountName}`,
        value: acc._id,
      })),
    ];
  }, [accounts]);

  // Determine if counterparty input is required
  const isCounterpartyRequired = useMemo(() => {
    if (!formData.transactionType) return true;
    return (
      formData.transactionType !== "EXPENSE" &&
      formData.transactionType !== "PETTY_CASH"
    );
  }, [formData.transactionType]);

  // Check if direction is locked
  const isDirectionLocked = useMemo(() => {
    const type = formData.transactionType;
    return (
      type === "CASH_IN" ||
      type === "CASH_OUT" ||
      type === "EXPENSE" ||
      type === "PETTY_CASH"
    );
  }, [formData.transactionType]);

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
                New Transaction
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Post deposits, petty cash, or expenses
              </AppText>
            </AppBox>
          </AppStack>
        </AppBox>

        {/* Content stack */}
        <div className="px-0 space-y-4">
          {/* Server / Validation Errors */}
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
                Voucher Information
              </AppHeading>
            </div>

            <div className="p-3.5 space-y-3.5">
              {/* Date */}
              <AppInput
                type="date"
                label="Transaction Date"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={(e) => handleFieldChange("transactionDate", e.target.value)}
                required
                disabled={isLoading}
                error={Boolean(formErrors.transactionDate)}
                helperText={formErrors.transactionDate}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Partition */}
              <AppSelect
                label="Cash Partition"
                name="partition"
                value={formData.partition}
                onChange={(e) => handleFieldChange("partition", e.target.value)}
                options={partitionOptions}
                size="small"
                variant="bordered"
                rounded="md"
                required
                disabled={isLoading}
                error={Boolean(formErrors.partition)}
                helperText={formErrors.partition}
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Transaction Type */}
              <AppSelect
                label="Transaction Type"
                name="transactionType"
                value={formData.transactionType}
                onChange={(e) => handleFieldChange("transactionType", e.target.value)}
                options={typeOptions}
                size="small"
                variant="bordered"
                rounded="md"
                required
                disabled={isLoading}
                error={Boolean(formErrors.transactionType)}
                helperText={formErrors.transactionType}
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Flow Direction */}
              <AppSelect
                label="Flow Direction"
                name="direction"
                value={formData.direction}
                onChange={(e) => handleFieldChange("direction", e.target.value)}
                options={directionOptions}
                size="small"
                variant="bordered"
                rounded="md"
                required
                disabled={isDirectionLocked || isLoading}
                error={Boolean(formErrors.direction)}
                helperText={
                  isDirectionLocked
                    ? "Auto-resolved based on selected type"
                    : formErrors.direction
                }
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Amount */}
              <AppInput
                type="number"
                step="0.01"
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={(e) => handleFieldChange("amount", e.target.value)}
                placeholder="0.00"
                required
                disabled={isLoading}
                error={Boolean(formErrors.amount)}
                helperText={formErrors.amount}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Reference */}
              <AppInput
                label="Reference / Voucher (Optional)"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={(e) => handleFieldChange("referenceNumber", e.target.value)}
                placeholder="e.g. PV-10298"
                disabled={isLoading}
                error={Boolean(formErrors.referenceNumber)}
                helperText={formErrors.referenceNumber}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Post Status */}
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
                disabled={isLoading}
                error={Boolean(formErrors.status)}
                helperText={formErrors.status}
                inputSx={compactFilterInputSx}
                labelSx={labelSx}
              />

              {/* Offset Counterparty Ledger Account */}
              <div>
                {isCounterpartyRequired ? (
                  <AppSelect
                    label="Counterparty Offset Account"
                    name="counterpartyAccountId"
                    value={formData.counterpartyAccountId}
                    onChange={(e) => handleFieldChange("counterpartyAccountId", e.target.value)}
                    options={accountOptions}
                    size="small"
                    variant="bordered"
                    rounded="md"
                    required
                    disabled={isLoading}
                    error={Boolean(formErrors.counterpartyAccountId)}
                    helperText={formErrors.counterpartyAccountId}
                    inputSx={compactFilterInputSx}
                    labelSx={labelSx}
                  />
                ) : (
                  <div className="p-3 bg-surface-alt/40 border border-border rounded-md text-[11px] leading-relaxed text-text-muted">
                    <span className="font-bold text-text block">Offset Account Resolved Automatically</span>
                    Directs to Default{" "}
                    {formData.transactionType === "EXPENSE"
                      ? "Cash Expenses"
                      : "Petty Cash Expenses"}{" "}
                    account.
                  </div>
                )}
              </div>

              {/* Optional Denomination breakdown for cash transactions */}
              {selectedCashAccount && (
                <div className="border border-border rounded-md overflow-hidden bg-surface-alt/5 text-[11.5px] mt-2">
                  <div className="px-3 py-2 border-b border-border bg-surface-alt/10 flex flex-col gap-1">
                    <span className="font-bold text-text">
                      Cash Denomination Breakdown (Optional)
                    </span>
                    {formErrors.denominations ? (
                      <span className="text-[11px] text-danger font-semibold">
                        {formErrors.denominations}
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-muted">
                        Ensure total matches transaction amount: ₹ {Number(formData.amount || 0).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <div className="p-2 space-y-2">
                    {denominations.map((d) => {
                      const subTotal = d.denomination * d.quantity;
                      const availableDenomList = formData.partition === "frozen" 
                        ? selectedCashAccount?.balance?.frozenDenominations 
                        : selectedCashAccount?.balance?.runningDenominations;
                      const availableDenom = availableDenomList?.find(
                        (ad) => ad.denomination === d.denomination
                      );
                      const availableQty = availableDenom ? availableDenom.quantity : 0;
                      return (
                        <div key={d.denomination} className="flex flex-col py-1 border-b border-border/40 last:border-b-0 gap-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-text font-mono w-[60px]">
                              ₹ {d.denomination}
                            </span>
                            <span className="text-text-muted font-mono">
                              ×
                            </span>
                            <input
                              type="number"
                              min="0"
                              max={formData.direction === "DEBIT" ? availableQty : undefined}
                              value={d.quantity || ""}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                if (formData.direction === "DEBIT" && val > availableQty) {
                                  handleQtyChange(d.denomination, availableQty);
                                } else {
                                  handleQtyChange(d.denomination, e.target.value);
                                }
                              }}
                              placeholder="0"
                              className="w-[70px] px-1.5 py-0.5 border border-border rounded bg-surface text-text font-bold font-mono text-center focus:outline-none focus:border-primary"
                            />
                            <span className="font-extrabold text-text font-mono w-[100px] text-right">
                              ₹ {subTotal.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="text-[9.5px] text-text-muted font-semibold text-right">
                            Available: {availableQty} notes (₹{(availableQty * d.denomination).toLocaleString("en-IN")})
                          </div>
                        </div>
                      );
                    })}
                    <div className="bg-surface-alt/10 p-2 rounded flex justify-between items-center font-bold text-text mt-2">
                      <span>Total Value:</span>
                      <span className={`font-black font-mono text-[13px] ${
                        formData.amount && physicalTotal !== Number(formData.amount) && physicalTotal > 0 ? "text-danger" : "text-text"
                      }`}>
                        ₹ {physicalTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Narration */}
              <AppInput
                label="Narration (Optional)"
                name="narration"
                value={formData.narration}
                onChange={(e) => handleFieldChange("narration", e.target.value)}
                placeholder="Brief description..."
                multiline
                rows={2}
                disabled={isLoading}
                labelSx={labelSx}
                inputSx={{ ...inputSx, height: "auto" }}
              />
            </div>
          </AppCard>
        </div>

        {/* mobile fixed footer actions panel */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border p-3 flex gap-2.5 shadow-lg max-w-[460px] mx-auto w-full">
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
            {isLoading ? "Saving..." : "Record Transaction"}
          </button>
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

export default CreateCashTransactionMobilePage;
