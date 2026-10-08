import React, { useState, useEffect, useMemo } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIInput,
  UIButton,
  UIAlert,
  UIKeyValueList,
  UIBadge,
  UISkeleton,
} from "@/components/ui";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const INITIAL_COUNTS = {
  500: 0,
  200: 0,
  100: 0,
  50: 0,
  20: 0,
  10: 0,
  5: 0,
  2: 0,
  1: 0,
};

export function CashDenominationDialog({
  isOpen,
  onClose,
  mode = "create",
  entityId = null,
  denomData = null,
  onSubmitCreate,
  onFetchById,
  onSuccess,
}) {
  const [counts, setCounts] = useState(INITIAL_COUNTS);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [details, setDetails] = useState(denomData);

  useEffect(() => {
    if (!isOpen) {
      setCounts(INITIAL_COUNTS);
      setNotes("");
      setServerError(null);
      setDetails(null);
      return;
    }

    if (mode === "view") {
      if (denomData) {
        setDetails(denomData);
      } else if (entityId && onFetchById) {
        setIsFetching(true);
        setServerError(null);
        onFetchById(entityId)
          .then((data) => setDetails(data))
          .catch((err) => setServerError(typeof err === "string" ? err : "Failed to load denomination details."))
          .finally(() => setIsFetching(false));
      }
    }
  }, [isOpen, mode, entityId, denomData, onFetchById]);

  const totalAmount = useMemo(() => {
    return DENOMINATIONS.reduce((sum, denom) => {
      const qty = parseInt(counts[denom]) || 0;
      return sum + denom * qty;
    }, 0);
  }, [counts]);

  const handleQtyChange = (denom, qty) => {
    const cleanQty = Math.max(0, parseInt(qty) || 0);
    setCounts((prev) => ({ ...prev, [denom]: cleanQty }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (totalAmount <= 0) {
      setServerError("Please enter at least one denomination count.");
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const denominationsList = DENOMINATIONS.map((denom) => ({
      denomination: denom,
      quantity: counts[denom] || 0,
    })).filter((d) => d.quantity > 0);

    const payload = {
      denominations: denominationsList,
      totalAmount,
      notes: notes.trim() || undefined,
    };

    try {
      await onSubmitCreate(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(typeof err === "string" ? err : "Failed to record cash denomination.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isView = mode === "view";
  const title = isView ? "Cash Denomination Details" : "Count Cash Denominations";
  const subtitle = isView
    ? "View breakdown of physical currency notes."
    : "Enter note counts for physical cash reconciliation.";

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="md" mobileSheet>
      <UIModalHeader>
        <UIModalTitle>{title}</UIModalTitle>
        <UIModalDescription>{subtitle}</UIModalDescription>
      </UIModalHeader>

      <UIModalBody>
        {isFetching && <UISkeleton rows={6} />}

        {serverError && !isFetching && (
          <UIAlert variant="error" onDismiss={() => setServerError(null)}>
            {serverError}
          </UIAlert>
        )}

        {/* VIEW MODE */}
        {isView && !isFetching && details && (
          <div className="space-y-4">
            <div className="p-4 bg-surface-alt rounded-2xl border border-border text-center space-y-1">
              <p className="text-xs text-text-muted font-medium">Total Physical Cash Count</p>
              <p className="text-2xl font-bold text-primary font-mono">
                ₹ {(details.totalAmount || details.amount || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <UIKeyValueList
              items={[
                {
                  label: "Entry Date",
                  value: details.createdAt
                    ? new Date(details.createdAt).toLocaleString("en-IN")
                    : "N/A",
                },
                {
                  label: "Status",
                  value: (
                    <UIBadge variant={details.status === "CANCELLED" ? "danger" : "success"}>
                      {details.status || "CONFIRMED"}
                    </UIBadge>
                  ),
                },
                { label: "Notes", value: details.notes || "N/A" },
              ]}
            />

            {/* Note counts breakdown table */}
            <div className="mt-4 border border-border rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-alt text-text-muted uppercase font-bold border-b border-border">
                  <tr>
                    <th className="p-2.5">Denomination</th>
                    <th className="p-2.5 text-center">Count</th>
                    <th className="p-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(details.denominations || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-semibold text-text">₹ {item.denomination} Note</td>
                      <td className="p-2.5 text-center font-mono font-bold">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-text">
                        ₹ {(item.denomination * item.quantity).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CREATE MODE */}
        {!isView && (
          <form id="cash-denom-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="border border-border rounded-2xl p-4 bg-surface-alt/40 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-text-muted uppercase">Denomination</span>
                <span className="text-xs font-bold text-text-muted uppercase">Count</span>
                <span className="text-xs font-bold text-text-muted uppercase">Subtotal</span>
              </div>

              {DENOMINATIONS.map((denom) => {
                const qty = counts[denom];
                const subtotal = denom * (parseInt(qty) || 0);
                return (
                  <div key={denom} className="grid grid-cols-[100px_1fr_100px] items-center gap-3">
                    <span className="text-sm font-bold text-text font-mono">₹ {denom} Note</span>
                    <UIInput
                      type="number"
                      min="0"
                      placeholder="0"
                      value={qty || ""}
                      onChange={(e) => handleQtyChange(denom, e.target.value)}
                    />
                    <span className="text-sm font-bold text-right font-mono text-text">
                      ₹ {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-alt rounded-xl border border-border">
              <span className="text-sm font-bold text-text">Total Cash Amount</span>
              <span className="text-xl font-bold font-mono text-primary">
                ₹ {totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <UIInput
              label="Remarks / Notes (Optional)"
              placeholder="e.g. End of day till count"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </form>
        )}
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="outline" onClick={onClose} disabled={isSubmitting}>
          {isView ? "Close" : "Cancel"}
        </UIButton>

        {!isView && (
          <UIButton
            variant="primary"
            type="submit"
            form="cash-denom-form"
            isLoading={isSubmitting}
          >
            Save Denomination Count
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
}

export default CashDenominationDialog;
