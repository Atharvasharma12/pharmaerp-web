import { FiArrowLeft, FiSave, FiAlertCircle } from "react-icons/fi";
import { AppText, AppInput, AppSelect } from "@/components";

const CreateBankDepositSlipDesktopPage = ({
  formData,
  denominations,
  totalAmount,
  bankAccounts,
  cashAccounts,
  cashAccountOptions = [],
  bankAccountOptions = [],
  selectedCashAccount,
  availableDenominationsMap,
  currentBranch,
  isSubmitting,
  formErrors,
  error,
  handleChange,
  handleCashAccountChange,
  handleDenominationChange,
  handleFillAllAvailable,
  handleClearAll,
  handleSetMaxForDenom,
  handleSubmit,
  handleBack,
  clearFeedback,
}) => {
  const accountCashTotal = selectedCashAccount?.denominationBalance?.totalBalance ?? 0;

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-none px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-text-muted hover:text-text hover:bg-surface-alt rounded-lg transition"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <AppText variant="h6" className="font-bold text-text leading-tight">
              Create Bank Deposit Slip
            </AppText>
            <AppText variant="body2" className="text-text-muted mt-0.5">
              {currentBranch?.name ? `Branch: ${currentBranch.name}` : "Record cash deposit to bank"}
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
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-[13px] font-bold transition flex items-center gap-2 disabled:opacity-60"
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

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-[1060px] mx-auto flex gap-6">
          <div className="flex-1 flex flex-col gap-6">
            {error && (
              <div className="p-3 bg-danger-soft text-danger border border-danger/20 rounded-lg text-[13px] flex items-start gap-2">
                <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                <div className="flex-1">{error}</div>
                <button onClick={clearFeedback} className="font-bold">&times;</button>
              </div>
            )}
            
            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
              <AppText variant="subtitle2" className="font-bold text-text mb-4 pb-2 border-b border-border">
                General Details
              </AppText>
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
                {formData.dayClosingId ? (
                  <div>
                    <label className="text-[12px] font-medium text-text mb-1 block">Linked Day Closing</label>
                    <div className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-[13px] text-text font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success"></span>
                      Day Closing ID: {formData.dayClosingId}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
              <AppText variant="subtitle2" className="font-bold text-text mb-4 pb-2 border-b border-border">
                Account Details
              </AppText>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <AppSelect
                    label="From Cash Account"
                    value={formData.fromCashAccountId}
                    onChange={(e) => handleCashAccountChange ? handleCashAccountChange(e.target.value) : handleChange("fromCashAccountId", e.target.value)}
                    options={cashAccountOptions}
                    placeholder="Choose cash account..."
                    error={formErrors.fromCashAccountId}
                    disabled={isSubmitting}
                    required
                  />
                  {selectedCashAccount && (
                    <div className="mt-1.5 px-2 py-1 bg-surface-alt rounded-md border border-border/60 text-[11px] flex items-center justify-between">
                      <span className="text-text-muted">Available in Account:</span>
                      <span className="font-bold text-success font-mono">
                        ₹{accountCashTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
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
                  placeholder="e.g. MG Road Branch"
                  value={formData.bankBranchName}
                  onChange={(e) => handleChange("bankBranchName", e.target.value)}
                  disabled={isSubmitting}
                />
                <AppInput
                  label="Deposit Bag Reference (Optional)"
                  placeholder="Bag No / Tag ID"
                  value={formData.depositBagReference}
                  onChange={(e) => handleChange("depositBagReference", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
              <AppText variant="subtitle2" className="font-bold text-text mb-4 pb-2 border-b border-border">
                Additional Info
              </AppText>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-text">Narration (Optional)</label>
                <textarea
                  value={formData.narration}
                  onChange={(e) => handleChange("narration", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Any extra details about this deposit..."
                  className="w-full text-[13px] bg-surface-alt border border-border rounded-lg p-3 outline-none focus:border-primary transition min-h-[80px] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="w-[430px] flex-none">
            <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-h-[660px]">
              <div className="p-4 border-b border-border bg-surface-alt flex items-center justify-between">
                <div>
                  <AppText variant="subtitle2" className="font-bold text-text">
                    Denominations
                  </AppText>
                  <p className="text-[11px] text-text-muted">
                    {selectedCashAccount ? "Breakdown of cash in bag" : "Select cash account first"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleFillAllAvailable}
                    disabled={!selectedCashAccount || isSubmitting}
                    className="text-[11px] font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded transition disabled:opacity-40"
                    title="Fill all notes available in register"
                  >
                    Fill All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={isSubmitting}
                    className="text-[11px] font-medium text-text-muted hover:bg-surface px-2 py-1 rounded transition disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {selectedCashAccount && (
                <div className="px-4 py-2 bg-primary/5 border-b border-border flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">Account Balance:</span>
                  <span className="font-bold text-text font-mono text-[12px]">
                    ₹{accountCashTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              
              <div className="flex-1 overflow-auto p-4 flex flex-col gap-2">
                <div className="grid grid-cols-12 gap-2 px-2 pb-2 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-border">
                  <div className="col-span-3">Note</div>
                  <div className="col-span-3 text-center">Available</div>
                  <div className="col-span-3 text-center">Deposit</div>
                  <div className="col-span-3 text-right">Subtotal</div>
                </div>
                
                {denominations.map((item, index) => {
                  const availableQty = availableDenominationsMap?.get(item.denomination) || 0;
                  const isExceeded = (item.quantity || 0) > availableQty;
                  const subtotal = item.denomination * (item.quantity || 0);

                  return (
                    <div
                      key={item.denomination}
                      className={`grid grid-cols-12 gap-2 items-center px-2 py-1 rounded-lg transition ${
                        isExceeded ? "bg-danger-soft/40 border border-danger/30" : "hover:bg-surface-alt/40"
                      }`}
                    >
                      <div className="col-span-3 text-[13px] font-bold text-text font-mono flex items-center gap-0.5">
                        <span className="text-[10px] text-text-muted">₹</span>
                        {item.denomination}
                      </div>
                      <div className="col-span-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleSetMaxForDenom && handleSetMaxForDenom(item.denomination)}
                          title={`Click to deposit all ${availableQty} notes`}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                            availableQty > 0
                              ? "bg-surface border border-border text-text hover:border-primary hover:text-primary cursor-pointer shadow-2xs"
                              : "text-text-muted/50 bg-transparent cursor-default"
                          }`}
                        >
                          {availableQty}
                        </button>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          max={availableQty}
                          value={item.quantity === 0 ? "" : item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            handleDenominationChange(index, isNaN(val) ? 0 : val);
                          }}
                          disabled={isSubmitting}
                          placeholder="0"
                          className={`w-full border rounded-md px-1.5 py-1 text-center text-[13px] font-bold font-mono focus:border-primary outline-none transition ${
                            isExceeded
                              ? "border-danger text-danger bg-danger-soft/30"
                              : "border-border bg-surface text-text"
                          }`}
                        />
                      </div>
                      <div className="col-span-3 text-right text-[13px] text-text font-mono font-bold">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border bg-primary/5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-text">Total Deposit</span>
                  <span className="text-[18px] font-black text-primary font-mono">
                    ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {formErrors.totalAmount && (
                  <div className="text-[11px] text-danger font-medium flex items-center gap-1.5 pt-1 border-t border-danger/20">
                    <FiAlertCircle size={13} className="flex-shrink-0" />
                    <span>{formErrors.totalAmount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBankDepositSlipDesktopPage;
