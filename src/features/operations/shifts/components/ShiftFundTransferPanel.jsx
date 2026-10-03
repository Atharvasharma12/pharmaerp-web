import React from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

/**
 * Displays fund transfers (withdrawals & deposits) that occurred during a shift.
 * Both are relative to the shift's system-default cash account:
 *   - Withdrawal: money LEFT the cash partition (from branch cash)
 *   - Deposit:    money ENTERED the cash partition (to branch cash)
 */
export const ShiftFundTransferPanel = ({
  withdrawals = [],
  deposits = [],
  totalWithdrawals = 0,
  totalDeposits = 0,
}) => {
  const hasAny = withdrawals.length > 0 || deposits.length > 0;

  if (!hasAny) {
    return (
      <p className="text-xs text-text-muted italic py-1">
        No fund transfers recorded during this shift.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Withdrawals ── */}
      {withdrawals.length > 0 && (
        <div>
          <h5 className="text-[11px] font-bold uppercase tracking-widest text-error mb-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Withdrawals ({withdrawals.length})
          </h5>
          <div className="space-y-1.5">
            {withdrawals.map((w) => (
              <div
                key={String(w._id)}
                className="flex justify-between items-start text-xs bg-error/5 border border-error/15 rounded-lg px-3 py-2"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <div className="font-medium text-text">
                    Withdrawal {w.source ? `(from ${w.source === 'running' ? 'Running Cash' : w.source === 'frozen' ? 'Frozen Reserve' : w.source})` : ''}
                  </div>
                  {w.narration && (
                    <div className="text-text-muted mt-0.5">— {w.narration}</div>
                  )}
                  <div className="text-[10px] text-text-muted mt-0.5">
                    {w.createdBy && `By: ${w.createdBy}`}
                  </div>
                </div>
                <span className="font-bold text-error shrink-0 tabular-nums">
                  −{fmt(w.amount)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-bold text-error mt-2 px-1">
            <span>Total Withdrawals</span>
            <span className="tabular-nums">−{fmt(totalWithdrawals)}</span>
          </div>
        </div>
      )}

      {/* ── Deposits ── */}
      {deposits.length > 0 && (
        <div>
          <h5 className="text-[11px] font-bold uppercase tracking-widest text-success mb-2 flex items-center gap-1">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Deposits ({deposits.length})
          </h5>
          <div className="space-y-1.5">
            {deposits.map((d) => (
              <div
                key={String(d._id)}
                className="flex justify-between items-start text-xs bg-success/5 border border-success/15 rounded-lg px-3 py-2"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <div className="font-medium text-text">
                    Deposit (to Running Cash)
                  </div>
                  {d.narration && (
                    <div className="text-text-muted mt-0.5">— {d.narration}</div>
                  )}
                  <div className="text-[10px] text-text-muted mt-0.5">
                    {d.createdBy && `By: ${d.createdBy}`}
                  </div>
                </div>
                <span className="font-bold text-success shrink-0 tabular-nums">
                  +{fmt(d.amount)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-bold text-success mt-2 px-1">
            <span>Total Deposits</span>
            <span className="tabular-nums">+{fmt(totalDeposits)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
