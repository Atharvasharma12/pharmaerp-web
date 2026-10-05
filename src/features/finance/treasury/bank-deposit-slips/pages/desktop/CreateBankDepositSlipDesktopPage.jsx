import { FiArrowLeft, FiSave, FiAlertCircle, FiLock, FiInfo } from "react-icons/fi";
import { Snowflake, Building2, CreditCard, Tag, FileText } from "lucide-react";
import { AppText, AppInput, AppSelect } from "@/components";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const CreateBankDepositSlipDesktopPage = ({
  formData,
  denominations,
  totalAmount,
  bankAccountOptions = [],
  availableDenominationsMap,
  currentBranch,
  frozenCash,
  isSubmitting,
  formErrors,
  error,
  handleChange,
  handleDenominationChange,
  handleFillAllAvailable,
  handleClearAll,
  handleSetMaxForDenom,
  handleSubmit,
  handleBack,
  clearFeedback,
}) => {
  const utilizationPct =
    frozenCash > 0 ? Math.min(100, (totalAmount / frozenCash) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* ── Top bar ── */}
      <div className="flex-none px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-text-muted hover:text-text hover:bg-surface-alt rounded-lg transition"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <AppText variant="h6" className="font-bold text-text leading-tight">
                Create Bank Deposit Slip
              </AppText>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                <Snowflake size={10} />
                From Frozen Reserve
              </span>
            </div>
            <AppText variant="body2" className="text-text-muted mt-0.5">
              {currentBranch?.name
                ? `Branch: ${currentBranch.name}`
                : "Transfer frozen reserved cash to bank"}
            </AppText>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-4 py-2 border border-border rounded-lg text-[13px] font-medium text-text bg-surface hover:bg-surface-alt transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || totalAmount <= 0}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-[13px] font-bold transition flex items-center gap-2 disabled:opacity-60 shadow-sm"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSave size={16} />
            )}
            {isSubmitting ? "Saving..." : "Save Slip"}
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-[1100px] mx-auto">
          {/* Error */}
          {error && (
            <div className="mb-5 p-3 bg-danger-soft text-danger border border-danger/20 rounded-lg text-[13px] flex items-start gap-2">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">{error}</div>
              <button onClick={clearFeedback} className="font-bold">
                &times;
              </button>
            </div>
          )}

          {/* Frozen reserve banner */}
          <div className="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <FiLock className="text-amber-600 dark:text-amber-400" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Frozen Reserve Balance
              </p>
              <p className="text-[11px] text-amber-700/70 dark:text-amber-400/70 mt-0.5">
                Only frozen (locked) cash from the branch can be deposited to the bank via this slip.
              </p>
              {/* Progress bar */}
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-amber-200 dark:bg-amber-500/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${utilizationPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                  ₹{(frozenCash || 0).toLocaleString("en-IN")} available
                </span>
              </div>
            </div>
            <div className="text-right ml-2 flex-shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600/70 dark:text-amber-400/60">
                Depositing
              </p>
              <p className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
                ₹{totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            {/* LEFT: Form */}
            <div className="flex-1 flex flex-col gap-5">
              {/* General */}
              <section className="bg-surface border border-border rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <FileText size={14} className="text-text-muted" />
                  <AppText variant="subtitle2" className="font-bold text-text">
                    Slip Details
                  </AppText>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                  <AppInput
                    label="Slip Date"
                    type="date"
                    value={formData.slipDate}
                    onChange={(e) => handleChange("slipDate", e.target.value)}
                    error={formErrors.slipDate}
                    disabled={isSubmitting}
                    required
                  />
                  {formData.businessDayId ? (
                    <div>
                      <label className="text-[12px] font-medium text-text mb-1 block">
                        Linked Business Day
                      </label>
                      <div className="px-3 py-2 bg-success-soft border border-success/20 rounded-lg text-[13px] text-success font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        Business Day ID: {String(formData.businessDayId).slice(-6)}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              {/* Account Details */}
              <section className="bg-surface border border-border rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <Building2 size={14} className="text-text-muted" />
                  <AppText variant="subtitle2" className="font-bold text-text">
                    Account Details
                  </AppText>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                  {/* Source — frozen reserve */}
                  <div>
                    <label className="text-[12px] font-medium text-text mb-1 block">
                      Source (Frozen Reserve)
                    </label>
                    <div className="px-3 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg text-[13px] flex items-center gap-2 cursor-not-allowed">
                      <Snowflake size={13} className="text-amber-500 flex-shrink-0" />
                      <span className="font-medium text-amber-800 dark:text-amber-300">
                        Branch Cash — Frozen Reserve
                      </span>
                      {currentBranch?.name && (
                        <span className="ml-auto text-[11px] text-amber-600/70 font-mono">
                          {currentBranch.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Destination bank */}
                  <AppSelect
                    label="To Bank Account"
                    value={formData.toBankAccountId}
                    onChange={(e) => handleChange("toBankAccountId", e.target.value)}
                    options={bankAccountOptions}
                    placeholder="Choose bank account..."
                    error={formErrors.toBankAccountId}
                    disabled={isSubmitting}
                    required
                  />

                  <AppInput
                    label="Bank Branch Name (Optional)"
                    placeholder="e.g. HDFC Bank, MG Road Branch"
                    value={formData.bankBranchName}
                    onChange={(e) => handleChange("bankBranchName", e.target.value)}
                    disabled={isSubmitting}
                  />
                  <AppInput
                    label="Deposit Bag Reference (Optional)"
                    placeholder="Bag No / Tag ID / Seal No"
                    value={formData.depositBagReference}
                    onChange={(e) =>
                      handleChange("depositBagReference", e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </section>

              {/* Narration */}
              <section className="bg-surface border border-border rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                  <Tag size={14} className="text-text-muted" />
                  <AppText variant="subtitle2" className="font-bold text-text">
                    Additional Info
                  </AppText>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-text">
                    Narration (Optional)
                  </label>
                  <textarea
                    value={formData.narration}
                    onChange={(e) => handleChange("narration", e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Additional notes about this deposit..."
                    className="w-full text-[13px] bg-surface-alt border border-border rounded-lg p-3 outline-none focus:border-primary transition min-h-[80px] resize-none text-text"
                  />
                </div>
              </section>

              {/* Info hint */}
              <div className="flex items-start gap-2 text-[11px] text-text-muted p-3 bg-surface-alt/50 rounded-lg border border-border/60">
                <FiInfo size={13} className="mt-0.5 flex-shrink-0" />
                <span>
                  A <strong>CONTRA journal entry</strong> will be posted automatically:{" "}
                  <em>Branch Cash (Frozen) Cr → Cash in Transit Dr</em>. When you confirm
                  deposit, a second entry posts: <em>Cash in Transit Cr → Bank A/c Dr</em>.
                </span>
              </div>
            </div>

            {/* RIGHT: Denominations */}
            <div className="w-[420px] flex-none">
              <div className="bg-surface border border-border rounded-xl shadow-xs overflow-hidden sticky top-6">
                {/* Header */}
                <div className="p-4 border-b border-border bg-surface-alt flex items-center justify-between">
                  <div>
                    <AppText variant="subtitle2" className="font-bold text-text">
                      Denomination Breakdown
                    </AppText>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Select frozen notes to deposit
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleFillAllAvailable}
                      disabled={isSubmitting}
                      className="text-[11px] font-bold text-primary hover:bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 transition disabled:opacity-40"
                      title="Fill all frozen notes available"
                    >
                      Fill All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      disabled={isSubmitting}
                      className="text-[11px] font-medium text-text-muted hover:bg-surface px-2 py-1 rounded-lg border border-border transition disabled:opacity-40"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Reserve balance */}
                <div className="px-4 py-2 bg-amber-50/60 dark:bg-amber-500/5 border-b border-border flex items-center justify-between text-[11px]">
                  <span className="text-text-muted font-medium flex items-center gap-1">
                    <FiLock size={11} />
                    Frozen Reserve:
                  </span>
                  <span className="font-black text-amber-700 dark:text-amber-400 font-mono text-[13px]">
                    ₹{(frozenCash || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border bg-surface-alt/30">
                  <div className="col-span-3">Note</div>
                  <div className="col-span-3 text-center">Available</div>
                  <div className="col-span-3 text-center">Deposit</div>
                  <div className="col-span-3 text-right">Subtotal</div>
                </div>

                {/* Denomination rows */}
                <div className="overflow-auto max-h-[380px]">
                  {denominations.map((item, index) => {
                    const availableQty =
                      availableDenominationsMap?.get(item.denomination) || 0;
                    const isExceeded = (item.quantity || 0) > availableQty;
                    const subtotal = item.denomination * (item.quantity || 0);
                    const isLargeNote = item.denomination >= 100;

                    return (
                      <div
                        key={item.denomination}
                        className={`grid grid-cols-12 gap-2 items-center px-4 py-1.5 border-b border-border/40 transition ${
                          isExceeded
                            ? "bg-danger-soft/40 border-danger/30"
                            : isLargeNote
                            ? "hover:bg-amber-50/40 dark:hover:bg-amber-500/5"
                            : "hover:bg-surface-alt/40"
                        }`}
                      >
                        <div className="col-span-3 flex items-center gap-1">
                          <span
                            className={`text-[13px] font-black font-mono ${
                              isLargeNote ? "text-amber-700 dark:text-amber-400" : "text-text"
                            }`}
                          >
                            ₹{item.denomination}
                          </span>
                        </div>
                        <div className="col-span-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleSetMaxForDenom &&
                              handleSetMaxForDenom(item.denomination)
                            }
                            title={`Deposit all ${availableQty} notes`}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                              availableQty > 0
                                ? "bg-surface border border-border text-text hover:border-amber-400 hover:text-amber-600 cursor-pointer shadow-2xs"
                                : "text-text-muted cursor-not-allowed opacity-40"
                            }`}
                          >
                            {availableQty}
                          </button>
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            value={item.quantity === 0 ? "" : item.quantity}
                            onChange={(e) =>
                              handleDenominationChange(
                                index,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            disabled={isSubmitting}
                            placeholder="0"
                            className={`w-full text-center font-mono text-[13px] border rounded-lg py-1 outline-none transition ${
                              isExceeded
                                ? "border-danger focus:border-danger bg-danger-soft/50 text-danger"
                                : "border-border focus:border-primary bg-surface"
                            }`}
                          />
                        </div>
                        <div className="col-span-3 text-right text-[13px] font-bold font-mono">
                          {subtotal > 0 ? (
                            <span className="text-text">₹{subtotal}</span>
                          ) : (
                            <span className="text-text-muted/40">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total footer */}
                <div className="p-4 bg-surface-alt border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                      Total Deposit
                    </span>
                    {formErrors.amount && (
                      <span className="text-[11px] text-danger font-medium">
                        {formErrors.amount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-2xl font-black font-mono ${
                      totalAmount > 0 ? "text-primary" : "text-text-muted"
                    }`}
                  >
                    ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBankDepositSlipDesktopPage;
