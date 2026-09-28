import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIAlert,
} from "@/components/ui";
import { updateShiftStatus, listShifts } from "../store/shiftThunk";
import { API_STATUS } from "@/constants";
import { apiClient } from "@/services";
import useCashAccount from "@/features/finance/treasury/cash-management/cash-accounts/hooks/useCashAccount";
import { FileText, IndianRupee, QrCode } from "lucide-react";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

export const CloseShiftDialog = ({ isOpen, onClose, shift }) => {
  const dispatch = useDispatch();
  const { updateShiftStatusStatus, error } = useSelector(
    (state) => state.shift,
  );

  const [note, setNote] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Denominations State
  const [counts, setCounts] = useState(
    DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {}),
  );

  const totalAmount = useMemo(() => {
    return DENOMINATIONS.reduce((sum, note) => {
      const cnt = Number(counts[note]) || 0;
      return sum + cnt * note;
    }, 0);
  }, [counts]);

  const { cashAccounts, getCashAccounts } = useCashAccount();

  const defaultCashAccount = useMemo(() => {
    return (
      cashAccounts?.find((ca) => ca.isPrimary) || cashAccounts?.[0] || null
    );
  }, [cashAccounts]);

  useEffect(() => {
    if (isOpen) {
      getCashAccounts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && defaultCashAccount?.denominationBalance?.denominations) {
      const initialCounts = {};
      const expectedDenoms = defaultCashAccount.denominationBalance.denominations;
      DENOMINATIONS.forEach((note) => {
        const found = expectedDenoms.find((d) => Number(d.denomination) === note);
        initialCounts[note] = found && found.quantity > 0 ? found.quantity : "";
      });
      setCounts(initialCounts);
    } else if (!isOpen) {
      setCounts(DENOMINATIONS.reduce((acc, note) => ({ ...acc, [note]: "" }), {}));
      setNote("");
    }
  }, [isOpen, defaultCashAccount]);

  useEffect(() => {
    if (isOpen && shift?._id) {
      setLoading(true);
      apiClient
        .get(`/operations/shifts/${shift._id}/summary`)
        .then((res) => setSummary(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSummary(null);
    }
  }, [isOpen, shift]);

  const handleLockShift = async () => {
    const closingDenominations = DENOMINATIONS.map((note) => ({
      denomination: note,
      count: Number(counts[note]) || 0,
      amount: (Number(counts[note]) || 0) * note,
    })).filter((d) => d.count > 0);

    try {
      await dispatch(
        updateShiftStatus({
          id: shift._id,
          payload: {
            status: "closed",
            actualClosingCashAmount: totalAmount,
            closingDenominations,
            note,
          },
        }),
      ).unwrap();
      dispatch(listShifts());
      onClose();
    } catch (e) {
      // handled by redux
    }
  };

  const handleCountChange = (note, val) => {
    setCounts((prev) => ({ ...prev, [note]: val }));
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="xl">
      <UIModalHeader>
        <UIModalTitle>Lock Shift: {shift?.shiftNo}</UIModalTitle>
      </UIModalHeader>
      <UIModalBody className="max-h-[75vh] overflow-y-auto">
        {loading ? (
          <div className="py-10 text-center text-text-muted">
            Loading shift data...
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {error && (
              <UIAlert intent="danger" title="Error" description={error} />
            )}

            <div className="bg-error/10 p-4 rounded-lg border border-error/20 mb-4 text-error">
              <h4 className="text-sm font-semibold mb-1">Confirm Shift Lock</h4>
              <p className="text-xs">
                Locking this shift will finalize all transactions. You will not
                be able to perform further billing under this shift.
              </p>
            </div>

            {summary && (
              <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <h4 className="text-xs font-semibold flex items-center gap-2 mb-2 text-text-muted">
                    <FileText className="w-3 h-3" /> Operations Totals
                  </h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total Invoices</span>
                    <span className="font-medium">{summary.invoiceCount}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted pl-2">↳ Cash Invoices</span>
                    <span className="font-medium text-text-muted">{summary.cashInvoiceCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted pl-2">↳ UPI Invoices</span>
                    <span className="font-medium text-text-muted">{summary.paymentQrCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1 mt-2">
                    <span>Net Sales</span>
                    <span className="font-medium text-success">
                      ₹{summary.netSales}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Returns</span>
                    <span className="font-medium">{summary.returnCount}</span>
                  </div>
                </div>

                <div className="bg-surface-secondary p-3 rounded-lg border border-border">
                  <h4 className="text-xs font-semibold flex items-center gap-2 mb-2 text-text-muted">
                    <QrCode className="w-3 h-3" /> Payments
                  </h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span>UPI/QR Txns</span>
                    <span className="font-medium">
                      {summary.paymentQrCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>QR Total</span>
                    <span className="font-medium text-primary">
                      ₹{summary.qrNet}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2 border-t border-border pt-1">
                    <span>Expected Cash</span>
                    <span className="font-bold">
                      ₹{summary.expectedClosingCashAmount || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4 space-y-3">
              <h4 className="text-sm font-semibold border-b border-border pb-1">
                Cash Drawer Reconciliation
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-secondary border border-border rounded-lg p-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">
                    1. Opening Cash
                  </p>
                  <p className="text-lg font-mono">
                    ₹{summary?.openingFloatAmount || 0}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1">
                    Starting drawer balance
                  </p>
                </div>
                <div className="bg-surface-secondary border border-border rounded-lg p-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">
                    2. System Expected
                  </p>
                  <p className="text-lg font-mono text-primary">
                    ₹{summary?.expectedClosingCashAmount || 0}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1">
                    Opening + Cash Sales
                  </p>
                </div>
                <div
                  className={`border rounded-lg p-3 ${totalAmount === (summary?.expectedClosingCashAmount || 0) ? "bg-success-soft border-success/30" : "bg-warning-soft border-warning/30"}`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-1">
                      3. Actual Counted
                    </p>
                    {summary &&
                      totalAmount -
                        (summary?.expectedClosingCashAmount || 0) !==
                        0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${totalAmount - summary.expectedClosingCashAmount < 0 ? "bg-error/10 text-error" : "bg-success/10 text-success"}`}
                        >
                          Diff:{" "}
                          {totalAmount - summary.expectedClosingCashAmount > 0
                            ? "+"
                            : ""}
                          ₹{totalAmount - summary.expectedClosingCashAmount}
                        </span>
                      )}
                  </div>
                  <p className="text-lg font-mono font-bold">₹{totalAmount}</p>
                  <p className="text-[10px] text-text-muted mt-1">
                    Calculated from grid below
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-2">
              {/* 1. Opening Denominations */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-2 border-b border-border pb-1">
                  1. Opening
                </h4>
                <div className="space-y-1">
                  {DENOMINATIONS.map((note) => {
                    const count =
                      shift?.openingDenominations?.find(
                        (d) => Number(d.denomination) === note,
                      )?.count || 0;
                    return (
                      <div
                        key={note}
                        className="flex justify-between items-center text-xs p-1 rounded bg-surface-secondary/50"
                      >
                        <span className="font-medium text-text-muted">
                          ₹{note}
                        </span>
                        <span className="text-text-muted text-[10px]">×</span>
                        <span className="font-mono text-text">{count}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center text-xs p-1 rounded bg-surface-alt font-bold mt-2 pt-2 border-t border-border">
                    <span>Total</span>
                    <span>₹{summary?.openingFloatAmount || 0}</span>
                  </div>
                </div>
              </div>

              {/* 2. System Expected Denominations */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2 border-b border-border pb-1">
                  2. Expected
                </h4>
                <div className="space-y-1">
                  {DENOMINATIONS.map((note) => {
                    const expectedCount =
                      defaultCashAccount?.denominationBalance?.denominations?.find(
                        (d) => Number(d.denomination) === note,
                      )?.quantity || 0;
                    return (
                      <div
                        key={note}
                        className="flex justify-between items-center text-xs p-1 rounded bg-primary-soft/30"
                      >
                        <span className="font-medium text-text-muted">
                          ₹{note}
                        </span>
                        <span className="text-primary text-[10px]">×</span>
                        <span className="font-mono font-bold text-primary">
                          {expectedCount}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center text-xs p-1 rounded bg-primary-soft/50 font-bold text-primary mt-2 pt-2 border-t border-primary/20">
                    <span>Total</span>
                    <span>₹{defaultCashAccount?.denominationBalance?.totalBalance || 0}</span>
                  </div>
                </div>
              </div>

              {/* 3. Actual Counted */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-text mb-2 border-b border-border pb-1">
                  3. Actual
                </h4>
                <div className="space-y-1">
                  {DENOMINATIONS.map((note) => (
                    <div key={note} className="flex items-center gap-1 p-0.5">
                      <span className="text-xs font-medium text-text-muted w-8 text-right">
                        ₹{note}
                      </span>
                      <span className="text-text-muted text-[10px] mx-0.5">
                        ×
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={counts[note]}
                        onChange={(e) =>
                          handleCountChange(note, e.target.value)
                        }
                        className="flex-1 min-w-0 bg-surface-secondary border border-border rounded text-text font-mono text-xs p-1 text-center focus:border-primary outline-none"
                        placeholder="0"
                      />
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs p-1 rounded bg-surface-secondary font-bold mt-2 pt-2 border-t border-border">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text mb-1">
                Closing Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg text-text focus:ring-1 focus:ring-primary focus:border-primary p-2 transition-all outline-none"
                placeholder="Any discrepancies or remarks about cash variation..."
                rows={2}
              />
            </div>
          </div>
        )}
      </UIModalBody>
      <UIModalFooter>
        <UIButton variant="ghost" onClick={onClose}>
          Cancel
        </UIButton>
        <UIButton
          variant="primary"
          onClick={handleLockShift}
          isLoading={updateShiftStatusStatus === API_STATUS.LOADING}
        >
          Confirm & Lock Shift
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};
