import React, { useMemo } from "react";
import { FiArrowLeft, FiPlus } from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
  PageHeader,
} from "@/components";

const typeOptions = [
  { label: "Choose Transaction Type...", value: "" },
  { label: "Deposit Cash", value: "DEPOSIT" },
  { label: "Withdrawal Cash", value: "WITHDRAWAL" },
  { label: "NEFT Transfer", value: "NEFT" },
  { label: "RTGS Transfer", value: "RTGS" },
  { label: "IMPS Transfer", value: "IMPS" },
  { label: "UPI Payment", value: "UPI" },
  { label: "Cheque Clearing", value: "CHEQUE" },
  { label: "Bank Charges / Fees", value: "BANK_CHARGES" },
  { label: "Interest Income", value: "INTEREST" },
  { label: "Other Transaction", value: "OTHER" },
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

const CreateBankTransactionDesktopPage = ({
  formData,
  formErrors = {},
  bankAccounts = [],
  accounts = [],
  isLoading = false,
  handleFieldChange,
  handleCancel,
  handleSubmit,
  serverError,
  clearError,
}) => {
  const bankAccountOptions = useMemo(() => {
    return [
      { label: "Select Bank Account...", value: "" },
      ...bankAccounts.map((b) => ({
        label: `${b.bankName || b.accountName || "Bank"} — *${String(b.accountNumber || "").slice(-4)} (${b.currency || "USD"})`,
        value: b._id,
      })),
    ];
  }, [bankAccounts]);

  const accountOptions = useMemo(() => {
    return [
      { label: "Select Ledger Account...", value: "" },
      ...accounts.map((acc) => ({
        label: `${acc.accountCode} — ${acc.accountName}`,
        value: acc._id,
      })),
    ];
  }, [accounts]);

  // Determine if counterparty input is required based on type
  const isCounterpartyRequired = useMemo(() => {
    if (!formData.transactionType) return true; // Default view is visible
    return (
      formData.transactionType !== "BANK_CHARGES" &&
      formData.transactionType !== "INTEREST"
    );
  }, [formData.transactionType]);

  // Check if direction is auto-resolved/immutable
  const isDirectionLocked = useMemo(() => {
    const type = formData.transactionType;
    return (
      type === "DEPOSIT" ||
      type === "WITHDRAWAL" ||
      type === "BANK_CHARGES" ||
      type === "INTEREST"
    );
  }, [formData.transactionType]);

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1000px]">
        {/* Page Header */}
        <PageHeader
          title="Record Bank Transaction"
          subtitle="Manually post direct deposits, bank fees, withdrawals, and bank transfers to accounts."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Bank Transactions", onClick: handleCancel },
                { label: "New Transaction", current: true },
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
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={cardSx}>
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
                onChange={(e) => handleFieldChange("transactionDate", e.target.value)}
                required
                disabled={isLoading}
                error={Boolean(formErrors.transactionDate)}
                helperText={formErrors.transactionDate}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Bank Account */}
              <AppSelect
                label="Bank Account"
                name="bankAccountId"
                value={formData.bankAccountId}
                onChange={(e) => handleFieldChange("bankAccountId", e.target.value)}
                options={bankAccountOptions}
                size="medium"
                variant="bordered"
                rounded="md"
                required
                disabled={isLoading}
                error={Boolean(formErrors.bankAccountId)}
                helperText={formErrors.bankAccountId}
                labelSx={labelSx}
                sx={selectFieldSx}
                inputSx={selectInputSx}
              />

              {/* Transaction Type */}
              <AppSelect
                label="Transaction Type"
                name="transactionType"
                value={formData.transactionType}
                onChange={(e) => handleFieldChange("transactionType", e.target.value)}
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

              {/* Reference number */}
              <AppInput
                label="Reference Number / UTR / Cheque (Optional)"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={(e) => handleFieldChange("referenceNumber", e.target.value)}
                placeholder="e.g. UTR-9823901"
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
                    onChange={(e) => handleFieldChange("counterpartyAccountId", e.target.value)}
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
                    <span className="font-bold text-text block mb-0.5">Offset Account Resolved Automatically</span>
                    The system will automatically direct this transaction to the default{" "}
                    <strong>
                      {formData.transactionType === "BANK_CHARGES"
                        ? "Bank Charges Expense"
                        : "Bank Interest Income"}
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
                  onChange={(e) => handleFieldChange("narration", e.target.value)}
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

export default CreateBankTransactionDesktopPage;
