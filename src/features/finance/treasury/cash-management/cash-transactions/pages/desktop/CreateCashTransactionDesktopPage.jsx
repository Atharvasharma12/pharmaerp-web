import React, { useMemo } from "react";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppText,
} from "@/components";

const typeOptions = [
  { label: "Choose Transaction Type...", value: "" },
  { label: "Cash Inward (CASH_IN)", value: "CASH_IN" },
  { label: "Cash Outward (CASH_OUT)", value: "CASH_OUT" },
  { label: "Direct Cash Expense (EXPENSE)", value: "EXPENSE" },
  { label: "Petty Cash Voucher (PETTY_CASH)", value: "PETTY_CASH" },
  { label: "Other Cash Posting (OTHER)", value: "OTHER" },
];

const directionOptions = [
  { label: "Choose Flow Direction...", value: "" },
  { label: "Inward Flow (Credit - Bal Increases)", value: "CREDIT" },
  { label: "Outward Flow (Debit - Bal Decreases)", value: "DEBIT" },
];

const statusOptions = [
  { label: "Save as Draft Transaction", value: "DRAFT" },
  { label: "Post Directly to General Ledger", value: "POSTED" },
];

const CreateCashTransactionDesktopPage = ({
  formData,
  formErrors = {},
  cashAccounts = [],
  accounts = [],
  isLoading = false,
  handleFieldChange,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
}) => {
  const cashAccountOptions = useMemo(() => {
    return [
      { label: "Select Cash Register...", value: "" },
      ...cashAccounts.map((c) => ({
        label: `${c.accountName} (${c.currency || "USD"})`,
        value: c._id,
      })),
    ];
  }, [cashAccounts]);

  const accountOptions = useMemo(() => {
    return [
      { label: "Select Ledger Account...", value: "" },
      ...accounts.map((acc) => ({
        label: `${acc.accountCode} — ${acc.accountName}`,
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

  // Check if direction is auto-resolved/immutable
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
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1000px]">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              Record Cash Transaction
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              Manually post direct cash receipts, petty cash vouchers, expense
              payouts, or drawer transfers.
            </AppText>
          </div>
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard" },
              { label: "Finance & Accounting" },
              { label: "Treasury" },
              { label: "Cash Transactions", onClick: handleCancel },
              { label: "New Transaction", current: true },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Server / Validation Errors */}
          {serverError && (
            <div className="p-3 bg-danger-soft text-danger text-[12.5px] font-semibold rounded-md flex justify-between items-center">
              <span>{serverError}</span>
              <button
                type="button"
                onClick={clearError}
                className="text-danger hover:underline font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {formErrors.submit && (
            <div className="p-3 bg-danger-soft text-danger text-[12.5px] font-semibold rounded-md">
              {formErrors.submit}
            </div>
          )}

          {/* Form Fields Card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={cardSx}
          >
            <div className="px-5 py-4 border-b border-border">
              <AppHeading level={3} weight={700} sx={cardTitleSx}>
                Transaction Details
              </AppHeading>
            </div>

            <div className="p-5 grid grid-cols-2 gap-5">
              {/* Date */}
              <AppInput
                type="date"
                label="Transaction Date"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={(e) =>
                  handleFieldChange("transactionDate", e.target.value)
                }
                required
                disabled={isLoading}
                error={Boolean(formErrors.transactionDate)}
                helperText={formErrors.transactionDate}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Cash Register */}
              <AppSelect
                label="Cash Account Register"
                name="cashAccountId"
                value={formData.cashAccountId}
                onChange={(e) =>
                  handleFieldChange("cashAccountId", e.target.value)
                }
                options={cashAccountOptions}
                size="medium"
                variant="bordered"
                rounded="md"
                required
                disabled={isLoading}
                error={Boolean(formErrors.cashAccountId)}
                helperText={formErrors.cashAccountId}
                labelSx={labelSx}
                sx={selectFieldSx}
                inputSx={selectInputSx}
              />

              {/* Transaction Type */}
              <AppSelect
                label="Transaction Type"
                name="transactionType"
                value={formData.transactionType}
                onChange={(e) =>
                  handleFieldChange("transactionType", e.target.value)
                }
                options={typeOptions}
                size="medium"
                variant="bordered"
                rounded="md"
                required
                disabled={isLoading}
                error={Boolean(formErrors.transactionType)}
                helperText={formErrors.transactionType}
                labelSx={labelSx}
                sx={selectFieldSx}
                inputSx={selectInputSx}
              />

              {/* Flow Direction */}
              <AppSelect
                label="Flow Direction"
                name="direction"
                value={formData.direction}
                onChange={(e) => handleFieldChange("direction", e.target.value)}
                options={directionOptions}
                size="medium"
                variant="bordered"
                rounded="md"
                required
                disabled={isDirectionLocked || isLoading}
                error={Boolean(formErrors.direction)}
                helperText={
                  isDirectionLocked
                    ? "Auto-resolved based on selected transaction type"
                    : formErrors.direction
                }
                labelSx={labelSx}
                sx={selectFieldSx}
                inputSx={selectInputSx}
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
                label="Reference Number / Voucher Number (Optional)"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={(e) =>
                  handleFieldChange("referenceNumber", e.target.value)
                }
                placeholder="e.g. REC-19823"
                disabled={isLoading}
                error={Boolean(formErrors.referenceNumber)}
                helperText={formErrors.referenceNumber}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Post Status */}
              <AppSelect
                label="Ledger Posting Status"
                name="status"
                value={formData.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                options={statusOptions}
                size="medium"
                variant="bordered"
                rounded="md"
                required
                disabled={isLoading}
                error={Boolean(formErrors.status)}
                helperText={formErrors.status}
                labelSx={labelSx}
                sx={selectFieldSx}
                inputSx={selectInputSx}
              />

              {/* Counterparty Account - Conditional */}
              <AppBox sx={{ gridColumn: "span 2" }}>
                {isCounterpartyRequired ? (
                  <AppSelect
                    label="Offset Counterparty Ledger Account"
                    name="counterpartyAccountId"
                    value={formData.counterpartyAccountId}
                    onChange={(e) =>
                      handleFieldChange("counterpartyAccountId", e.target.value)
                    }
                    options={accountOptions}
                    size="medium"
                    variant="bordered"
                    rounded="md"
                    required
                    disabled={isLoading}
                    error={Boolean(formErrors.counterpartyAccountId)}
                    helperText={
                      formErrors.counterpartyAccountId ||
                      "Select the Customer, Supplier, or Expense ledger account offset."
                    }
                    labelSx={labelSx}
                    sx={selectFieldSx}
                    inputSx={selectInputSx}
                  />
                ) : (
                  <div className="p-3 bg-surface-alt/40 border border-border rounded-md text-[11.8px] leading-relaxed text-text-muted">
                    <span className="font-bold text-text block mb-0.5">
                      Offset Account Resolved Automatically
                    </span>
                    The system will automatically direct this transaction to the
                    default{" "}
                    <strong>
                      {formData.transactionType === "EXPENSE"
                        ? "Cash Expenses"
                        : "Petty Cash Expenses"}
                    </strong>{" "}
                    system account. No manual offset allocation is required.
                  </div>
                )}
              </AppBox>

              {/* Narration */}
              <AppBox sx={{ gridColumn: "span 2" }}>
                <AppInput
                  label="Narration / Public Description (Optional)"
                  name="narration"
                  value={formData.narration}
                  onChange={(e) =>
                    handleFieldChange("narration", e.target.value)
                  }
                  placeholder="Record additional audit details or transfer description..."
                  multiline
                  rows={2}
                  disabled={isLoading}
                  error={Boolean(formErrors.narration)}
                  helperText={formErrors.narration}
                  labelSx={labelSx}
                  inputSx={{ ...inputSx, height: "auto" }}
                />
              </AppBox>
            </div>
          </AppCard>

          {/* Form Action Controls */}
          <div className="flex items-center justify-between">
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              onClick={handleCancel}
              disabled={isLoading}
              sx={actionBtnSx}
            >
              Cancel
            </AppButton>

            <AppButton
              type="submit"
              variant="contained"
              colorVariant="primary"
              rounded="md"
              size="small"
              loading={isLoading}
              sx={actionBtnSx}
            >
              Record Transaction
            </AppButton>
          </div>
        </form>
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

const pageTitleSx = {
  m: 0,
  fontSize: "23px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.5,
  fontSize: "13px",
  color: "var(--app-color-text-muted)",
};

const cardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const cardTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

const selectFieldSx = {
  width: "100%",
};

const selectInputSx = {
  height: 38,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
};

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

const labelSx = {
  fontSize: "12.5px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const inputSx = {
  minHeight: 38,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
};

export default CreateCashTransactionDesktopPage;
