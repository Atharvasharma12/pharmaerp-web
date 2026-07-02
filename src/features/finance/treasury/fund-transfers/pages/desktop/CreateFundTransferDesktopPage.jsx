import React from "react";
import { FiArrowLeft, FiSave } from "react-icons/fi";

import {
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

const accountTypeOptions = [
  { label: "Bank Account", value: "BANK" },
  { label: "Cash Register / Vault", value: "CASH" },
];

const CreateFundTransferDesktopPage = ({
  formData,
  formErrors,
  sourceOptions = [],
  destinationOptions = [],
  fromDenominations = [],
  toDenominations = [],
  fromPhysicalTotal = 0,
  toPhysicalTotal = 0,
  handleFromQtyChange,
  handleToQtyChange,
  isSubmitting = false,
  error,
  message,
  clearFeedback,
  handleInputChange,
  handleSubmit,
  handleCancel,
  selectedFromCashAccount,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[800px]">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              New Fund Transfer
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              Transfer balances between cash books and bank accounts.
            </AppText>
          </div>
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard" },
              { label: "Finance" },
              { label: "Fund Transfers", onClick: handleCancel },
              { label: "Create", current: true },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* Feedback Alert */}
        {(error || message) && (
          <div
            className={`mt-4 p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
              error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
            }`}
          >
            <span>{error || message}</span>
            <button
              onClick={clearFeedback}
              className={`font-bold hover:underline ${error ? "text-danger" : "text-success"}`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form Card */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          className="mt-5"
          sx={cardSx}
        >
          <form onSubmit={handleSubmit} className="p-5 space-y-6">
            {/* General Fields */}
            <div className="grid grid-cols-2 gap-4">
              <AppInput
                type="date"
                label="Transfer Date"
                name="transferDate"
                value={formData.transferDate}
                onChange={(e) => handleInputChange("transferDate", e.target.value)}
                error={Boolean(formErrors.transferDate)}
                errorText={formErrors.transferDate}
                required
              />

              <AppInput
                type="number"
                step="0.01"
                label="Transfer Amount"
                name="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                error={Boolean(formErrors.amount)}
                errorText={formErrors.amount}
                required
              />
            </div>

            {/* Source Account Fields */}
            <div className="border-t border-border pt-4">
              <span className="text-[11px] font-extrabold uppercase text-text-muted tracking-wider block mb-3">
                Source (Transfer From)
              </span>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <AppSelect
                    label="Account Type"
                    name="fromAccountType"
                    value={formData.fromAccountType}
                    onChange={(e) => handleInputChange("fromAccountType", e.target.value)}
                    options={accountTypeOptions}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <AppSelect
                    label="Select Source Account"
                    name="fromAccountId"
                    value={formData.fromAccountId}
                    onChange={(e) => handleInputChange("fromAccountId", e.target.value)}
                    options={sourceOptions}
                    placeholder="Choose account..."
                    error={Boolean(formErrors.fromAccountId)}
                    errorText={formErrors.fromAccountId}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Destination Account Fields */}
            <div className="border-t border-border pt-4">
              <span className="text-[11px] font-extrabold uppercase text-text-muted tracking-wider block mb-3">
                Destination (Transfer To)
              </span>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <AppSelect
                    label="Account Type"
                    name="toAccountType"
                    value={formData.toAccountType}
                    onChange={(e) => handleInputChange("toAccountType", e.target.value)}
                    options={accountTypeOptions}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <AppSelect
                    label="Select Destination Account"
                    name="toAccountId"
                    value={formData.toAccountId}
                    onChange={(e) => handleInputChange("toAccountId", e.target.value)}
                    options={destinationOptions}
                    placeholder="Choose account..."
                    error={Boolean(formErrors.toAccountId)}
                    errorText={formErrors.toAccountId}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Denomination Sheets for Cash sides */}
            {((formData.fromAccountType === "CASH" && formData.fromAccountId) || (formData.toAccountType === "CASH" && formData.toAccountId)) ? (
              <div className="border-t border-border pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* From CASH Denominations */}
                  {formData.fromAccountType === "CASH" && formData.fromAccountId && (
                    <div className="border border-border rounded-md overflow-hidden bg-surface-alt/5 col-span-2 md:col-span-1">
                      <div className="px-3 py-2 border-b border-border bg-surface-alt/10 flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-text">
                          Source Chest Denominations (Optional)
                        </span>
                        {formErrors.fromDenominations && (
                          <span className="text-[11.5px] text-danger font-semibold">
                            {formErrors.fromDenominations}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <table className="w-full text-left border-collapse text-[11.5px]">
                          <thead>
                            <tr className="border-b border-border text-text-muted">
                              <th className="py-1 px-2 font-semibold">Denom</th>
                              <th className="py-1 px-2 font-semibold">Available</th>
                              <th className="py-1 px-2 font-semibold text-center">×</th>
                              <th className="py-1 px-2 font-semibold">Qty</th>
                              <th className="py-1 px-2 font-semibold text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fromDenominations.map((d) => {
                              const subTotal = d.denomination * d.quantity;
                              const availableDenom = selectedFromCashAccount?.denominationBalance?.denominations?.find(
                                (ad) => ad.denomination === d.denomination
                              );
                              const availableQty = availableDenom ? availableDenom.quantity : 0;
                              return (
                                <tr key={d.denomination} className="border-b border-border/40 hover:bg-surface-hover/10 transition">
                                  <td className="py-1 px-2 font-bold text-text font-mono">₹{d.denomination}</td>
                                  <td className="py-1 px-2 text-text-muted font-mono text-[10.5px]">
                                    {availableQty}
                                  </td>
                                  <td className="py-1 px-2 text-center text-text-muted font-mono">×</td>
                                  <td className="py-1 px-2">
                                    <input
                                      type="number"
                                      min="0"
                                      max={availableQty}
                                      value={d.quantity || ""}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        if (val > availableQty) {
                                          handleFromQtyChange(d.denomination, availableQty);
                                        } else {
                                          handleFromQtyChange(d.denomination, e.target.value);
                                        }
                                      }}
                                      placeholder="0"
                                      className="w-[70px] px-1.5 py-0.2 text-[11.5px] border border-border rounded bg-surface text-text font-bold font-mono text-center focus:outline-none focus:border-primary"
                                    />
                                  </td>
                                  <td className="py-1 px-2 text-right font-extrabold text-text font-mono">₹{subTotal.toLocaleString("en-IN")}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="bg-surface-alt/10 font-bold">
                              <td colSpan="4" className="py-1.5 px-2 text-[12px] text-text font-bold">Total:</td>
                              <td className={`py-1.5 px-2 text-right font-black font-mono ${
                                formData.amount && fromPhysicalTotal !== Number(formData.amount) && fromPhysicalTotal > 0 ? "text-danger" : "text-text"
                              }`}>₹{fromPhysicalTotal.toLocaleString("en-IN")}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* To CASH Denominations */}
                  {formData.toAccountType === "CASH" && formData.toAccountId && (
                    <div className="border border-border rounded-md overflow-hidden bg-surface-alt/5 col-span-2 md:col-span-1">
                      <div className="px-3 py-2 border-b border-border bg-surface-alt/10 flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-text">
                          Destination Chest Denominations (Optional)
                        </span>
                        {formErrors.toDenominations && (
                          <span className="text-[11.5px] text-danger font-semibold">
                            {formErrors.toDenominations}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <table className="w-full text-left border-collapse text-[11.5px]">
                          <thead>
                            <tr className="border-b border-border text-text-muted">
                              <th className="py-1 px-2 font-semibold">Denom</th>
                              <th className="py-1 px-2 font-semibold text-center">×</th>
                              <th className="py-1 px-2 font-semibold">Qty</th>
                              <th className="py-1 px-2 font-semibold text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {toDenominations.map((d) => {
                              const subTotal = d.denomination * d.quantity;
                              return (
                                <tr key={d.denomination} className="border-b border-border/40 hover:bg-surface-hover/10 transition">
                                  <td className="py-1 px-2 font-bold text-text font-mono">₹{d.denomination}</td>
                                  <td className="py-1 px-2 text-center text-text-muted font-mono">×</td>
                                  <td className="py-1 px-2">
                                    <input
                                      type="number"
                                      min="0"
                                      value={d.quantity || ""}
                                      onChange={(e) => handleToQtyChange(d.denomination, e.target.value)}
                                      placeholder="0"
                                      className="w-[70px] px-1.5 py-0.2 text-[11.5px] border border-border rounded bg-surface text-text font-bold font-mono text-center focus:outline-none focus:border-primary"
                                    />
                                  </td>
                                  <td className="py-1 px-2 text-right font-extrabold text-text font-mono">₹{subTotal.toLocaleString("en-IN")}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="bg-surface-alt/10 font-bold">
                              <td colSpan="3" className="py-1.5 px-2 text-[12px] text-text font-bold">Total:</td>
                              <td className={`py-1.5 px-2 text-right font-black font-mono ${
                                formData.amount && toPhysicalTotal !== Number(formData.amount) && toPhysicalTotal > 0 ? "text-danger" : "text-text"
                              }`}>₹{toPhysicalTotal.toLocaleString("en-IN")}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Notes & Audit */}
            <div className="border-t border-border pt-4 grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <AppInput
                  label="Reference / Slip Number"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
                  placeholder="e.g. TXN-9842"
                />
              </div>

              <div className="col-span-2">
                <AppInput
                  label="Narration / Description"
                  name="narration"
                  value={formData.narration}
                  onChange={(e) => handleInputChange("narration", e.target.value)}
                  placeholder="Record additional information regarding this transfer..."
                  multiline
                  minRows={2}
                />
              </div>
            </div>

            {/* Submit Control Footer */}
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                startIcon={<FiArrowLeft />}
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={actionBtnSx}
              >
                Cancel
              </AppButton>

              <AppButton
                type="submit"
                variant="contained"
                colorVariant="primary"
                size="small"
                rounded="md"
                startIcon={<FiSave />}
                disabled={isSubmitting}
                loading={isSubmitting}
                sx={actionBtnSx}
              >
                Post Transfer
              </AppButton>
            </div>
          </form>
        </AppCard>
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

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

export default CreateFundTransferDesktopPage;
