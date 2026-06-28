import React, { useMemo } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

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
  { label: "Draft Vouchers (Saved)", value: "DRAFT" },
  { label: "Post Directly to Ledger", value: "POSTED" },
];

const CreateJournalVoucherDesktopPage = ({
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
      { label: "Choose Ledger Account...", value: "" },
      ...accounts.map((acc) => ({
        label: `${acc.accountCode} — ${acc.accountName}`,
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
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Create Journal Voucher"
          subtitle="Manually allocate double-entry ledger adjustment postings."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Journal Vouchers", onClick: handleCancel },
                { label: "Create Voucher", current: true },
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
          {/* Server/Submit Errors */}
          {serverError && (
            <div className="p-3 bg-danger-soft text-danger text-[12.5px] font-semibold rounded-md flex items-center justify-between">
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

          {/* Header parameters card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={cardSx}
          >
            <div className="px-5 py-3.5 border-b border-border">
              <AppHeading level={3} weight={700} sx={cardTitleSx}>
                Voucher Header Parameters
              </AppHeading>
            </div>

            <div className="p-5 grid grid-cols-4 gap-5">
              {/* Date */}
              <AppInput
                type="date"
                label="Voucher Date"
                name="voucherDate"
                value={formData.voucherDate}
                onChange={(e) => handleFieldChange("voucherDate", e.target.value)}
                required
                error={Boolean(formErrors.voucherDate)}
                helperText={formErrors.voucherDate || "Transaction booking date"}
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Type */}
              <AppSelect
                label="Voucher Posting Type"
                name="voucherType"
                value={formData.voucherType}
                onChange={(e) => handleFieldChange("voucherType", e.target.value)}
                options={typeOptions}
                size="medium"
                variant="bordered"
                rounded="md"
                required
                labelSx={labelSx}
                sx={selectFieldSx}
                inputSx={selectInputSx}
                helperText="Select the type of adjustment voucher"
              />

              {/* Reference */}
              <AppInput
                label="Reference Number (Optional)"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={(e) => handleFieldChange("referenceNumber", e.target.value)}
                placeholder="e.g. JV-109283"
                helperText="Physical document index code"
                labelSx={labelSx}
                inputSx={inputSx}
              />

              {/* Status */}
              <AppSelect
                label="Ledger Action Status"
                name="status"
                value={formData.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                options={statusOptions}
                size="medium"
                variant="bordered"
                rounded="md"
                required
                labelSx={labelSx}
                sx={selectFieldSx}
                inputSx={selectInputSx}
                helperText="Whether to draft or post immediately"
              />
            </div>

            {/* Narration */}
            <div className="px-5 pb-5">
              <AppInput
                label="Voucher Narration / Header Notes (Optional)"
                name="narration"
                value={formData.narration}
                onChange={(e) => handleFieldChange("narration", e.target.value)}
                placeholder="Brief summary describing ledger adjustments..."
                multiline
                rows={2}
                labelSx={labelSx}
                inputSx={{ ...inputSx, height: "auto" }}
              />
            </div>
          </AppCard>

          {/* Ledger Double-Entry Lines spreadsheet */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={cardSx}
          >
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <AppHeading level={3} weight={700} sx={cardTitleSx}>
                Double-Entry Posting Ledger lines
              </AppHeading>

              <AppButton
                type="button"
                variant="outlined"
                colorVariant="primary"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleAddLine}
                sx={{ height: 30, fontSize: "11px" }}
              >
                Add Line Row
              </AppButton>
            </div>

            {/* Form Validation Errors for lines */}
            {formErrors.lines && (
              <div className="mx-5 mt-4 p-3 bg-danger-soft text-danger text-[12px] font-bold rounded-md">
                {formErrors.lines}
              </div>
            )}

            {/* Lines Table */}
            <div className="overflow-x-auto w-full relative">
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/5 text-text-muted font-bold">
                    <th className="py-2.5 px-4 w-[40px] text-center font-bold">#</th>
                    <th className="py-2.5 px-4 min-w-[300px] font-bold">Ledger Account Selection</th>
                    <th className="py-2.5 px-4 w-[160px] font-bold">Debit Amount ($)</th>
                    <th className="py-2.5 px-4 w-[160px] font-bold">Credit Amount ($)</th>
                    <th className="py-2.5 px-4 min-w-[200px] font-bold">Line Description / Memo</th>
                    <th className="py-2.5 px-4 w-[50px] text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.lines.map((line, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-surface-hover/10 transition">
                      <td className="py-2.5 px-4 text-center font-semibold text-text-muted">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-4">
                        <AppSelect
                          name={`lines.${idx}.accountId`}
                          value={line.accountId}
                          onChange={(e) => handleLineChange(idx, "accountId", e.target.value)}
                          options={accountOptions}
                          size="small"
                          variant="bordered"
                          rounded="md"
                          sx={{ width: "100%" }}
                          inputSx={{ height: 32, fontSize: "12px", bgcolor: "var(--app-color-surface)" }}
                        />
                      </td>

                      <td className="py-2.5 px-4">
                        <AppInput
                          type="number"
                          step="0.01"
                          name={`lines.${idx}.debit`}
                          value={line.debit || ""}
                          onChange={(e) => handleLineChange(idx, "debit", e.target.value)}
                          placeholder="0.00"
                          inputSx={{ height: 32, fontSize: "12px", bgcolor: "var(--app-color-surface)" }}
                        />
                      </td>

                      <td className="py-2.5 px-4">
                        <AppInput
                          type="number"
                          step="0.01"
                          name={`lines.${idx}.credit`}
                          value={line.credit || ""}
                          onChange={(e) => handleLineChange(idx, "credit", e.target.value)}
                          placeholder="0.00"
                          inputSx={{ height: 32, fontSize: "12px", bgcolor: "var(--app-color-surface)" }}
                        />
                      </td>

                      <td className="py-2.5 px-4">
                        <AppInput
                          name={`lines.${idx}.narration`}
                          value={line.narration}
                          onChange={(e) => handleLineChange(idx, "narration", e.target.value)}
                          placeholder="Entry memo note..."
                          inputSx={{ height: 32, fontSize: "12px", bgcolor: "var(--app-color-surface)" }}
                        />
                      </td>

                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={formData.lines.length <= 2}
                          onClick={() => handleRemoveLine(idx)}
                          className={`p-1.5 rounded transition ${
                            formData.lines.length <= 2
                              ? "text-text-muted/30 cursor-not-allowed"
                              : "text-text-muted hover:text-danger hover:bg-danger-soft/10 cursor-pointer"
                          }`}
                          title="Remove line"
                        >
                          <FiTrash2 className="text-[13px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* running totals summation bar */}
            <div className="p-4 bg-surface-alt/10 border-t border-border flex flex-wrap items-center justify-between gap-4">
              {/* Balanced alert status */}
              <div className="flex items-center gap-2">
                {totals.isBalanced ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ebfbee] text-[#2b8a3e] border border-[#c3fae8] rounded-md text-[11.5px] font-bold">
                    <FiCheckCircle />
                    <span>Double-Entry Balanced</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#fff5f5] text-[#fa5252] border border-[#ffc9c9] rounded-md text-[11.5px] font-bold">
                    <FiAlertTriangle />
                    <span>
                      {totals.debitSum === 0
                        ? "Enter Ledger Postings"
                        : `Imbalanced: Difference is ${formatCurrency(totals.difference)}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Sum totals display */}
              <div className="flex items-center gap-6 text-[13px] font-extrabold text-text">
                <div>
                  <span className="text-text-muted font-normal text-[11px] block text-right">Total Debit:</span>
                  <span className="text-[#2b8a3e] text-[15px]">{formatCurrency(totals.debitSum)}</span>
                </div>
                <div>
                  <span className="text-text-muted font-normal text-[11px] block text-right">Total Credit:</span>
                  <span className="text-[#e64980] text-[15px]">{formatCurrency(totals.creditSum)}</span>
                </div>
              </div>
            </div>
          </AppCard>

          {/* Form Actions Footer */}
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
              disabled={isLoading}
              sx={actionBtnSx}
            >
              Create Journal Voucher
            </AppButton>
          </div>
        </form>
      </div>
    </section>
  );
};

// Style configurations
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
  overflow: "hidden",
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
  height: 35,
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

export default CreateJournalVoucherDesktopPage;
