import { useState } from "react";
import { FiArrowLeft, FiSave, FiAlertCircle } from "react-icons/fi";
import { AppText, AppInput, AppSelect } from "@/components";

const CreateBankDepositSlipMobilePage = ({
  formData,
  denominations,
  totalAmount,
  bankAccounts,
  cashAccounts,
  cashAccountOptions = [],
  bankAccountOptions = [],
  selectedCashAccount,
  availableDenominationsMap,
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
  const [activeTab, setActiveTab] = useState("details");
  const accountCashTotal = selectedCashAccount?.denominationBalance?.totalBalance ?? 0;

  return (
    <div className="h-full flex flex-col bg-surface-alt">
      <div className="flex-none px-4 py-4 bg-surface border-b border-border shadow-sm z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-text hover:bg-surface-alt rounded-lg transition"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <AppText variant="h6" className="font-bold text-text leading-tight">
                New Deposit Slip
              </AppText>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || totalAmount <= 0}
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full disabled:opacity-60 shadow-md"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSave size={16} />
            )}
          </button>
        </div>

        <div className="flex bg-surface-alt rounded-lg p-1 border border-border">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-1.5 text-[13px] font-bold rounded-md transition ${
              activeTab === "details" ? "bg-surface shadow-sm text-text" : "text-text-muted"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("denominations")}
            className={`flex-1 py-1.5 text-[13px] font-bold rounded-md transition flex items-center justify-center gap-1.5 ${
              activeTab === "denominations" ? "bg-surface shadow-sm text-text" : "text-text-muted"
            }`}
          >
            Denominations
            {formErrors.totalAmount && activeTab !== "denominations" && (
              <span className="w-2 h-2 rounded-full bg-danger"></span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24">
        <div className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-danger-soft text-danger rounded-xl text-[13px] flex items-start gap-2 shadow-sm">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">{error}</div>
              <button onClick={clearFeedback} className="font-bold p-1">&times;</button>
            </div>
          )}

          {activeTab === "details" ? (
            <div className="flex flex-col gap-4">
              <div className="bg-surface rounded-xl p-4 shadow-sm border border-border flex flex-col gap-4">
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

              <div className="bg-surface rounded-xl p-4 shadow-sm border border-border flex flex-col gap-4">
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
                    <div className="mt-1 px-2.5 py-1 bg-surface-alt rounded-lg border border-border text-[11px] flex items-center justify-between">
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

              <div className="bg-surface rounded-xl p-4 shadow-sm border border-border flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-text">Narration (Optional)</label>
                <textarea
                  value={formData.narration}
                  onChange={(e) => handleChange("narration", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Any extra details..."
                  className="w-full text-[14px] bg-surface-alt border border-border rounded-xl p-3 outline-none focus:border-primary transition min-h-[100px] resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-xl p-4 shadow-sm border border-border flex flex-col gap-3">
              {selectedCashAccount && (
                <div className="p-3 bg-surface-alt rounded-xl border border-border flex items-center justify-between text-[12px]">
                  <div>
                    <span className="text-text-muted block text-[11px]">Cash in Account</span>
                    <span className="font-bold text-text font-mono text-[14px]">
                      ₹{accountCashTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleFillAllAvailable}
                      disabled={isSubmitting}
                      className="px-2.5 py-1 bg-primary text-white text-[11px] font-bold rounded-lg"
                    >
                      Fill All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      disabled={isSubmitting}
                      className="px-2 py-1 border border-border text-text text-[11px] font-medium rounded-lg"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {formErrors.totalAmount && (
                <div className="p-2.5 bg-danger-soft text-danger text-[12px] font-medium rounded-xl flex items-center gap-1.5">
                  <FiAlertCircle size={14} className="flex-shrink-0" />
                  <span>{formErrors.totalAmount}</span>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-12 gap-2 pb-2 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-border">
                  <div className="col-span-3">Note</div>
                  <div className="col-span-3 text-center">In A/c</div>
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
                      className={`grid grid-cols-12 gap-2 items-center py-1.5 px-1 rounded-lg ${
                        isExceeded ? "bg-danger-soft/40 border border-danger/30" : ""
                      }`}
                    >
                      <div className="col-span-3 text-[14px] font-bold text-text font-mono">
                        ₹{item.denomination}
                      </div>
                      <div className="col-span-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleSetMaxForDenom && handleSetMaxForDenom(item.denomination)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            availableQty > 0
                              ? "bg-surface-alt border border-border text-text"
                              : "text-text-muted/40"
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
                          className={`w-full border rounded-lg px-1 py-1.5 text-center text-[13px] font-bold font-mono focus:border-primary outline-none ${
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
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-bold text-text-muted">Total Amount</span>
          <span className="text-[20px] font-black text-primary">
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || totalAmount <= 0}
          className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-[15px] font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-md"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          {isSubmitting ? "Saving..." : "Save Slip"}
        </button>
      </div>
    </div>
  );
};

export default CreateBankDepositSlipMobilePage;
