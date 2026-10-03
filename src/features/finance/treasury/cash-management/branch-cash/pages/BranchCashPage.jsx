import React, { useEffect } from "react";
import { AppHeading, AppText, AppCard, AppButton } from "@/components";
import { useBranchCash } from "../hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";
import { RefreshCw, Banknote, Snowflake, AlertCircle, Plus, ArrowDown, ArrowUp } from "lucide-react";
import InitializeBranchCashModal from "../components/InitializeBranchCashModal";
import DepositModal from "../components/DepositModal";
import WithdrawModal from "../components/WithdrawModal";

/**
 * Compute total from denomination array.
 * denomination × quantity for every entry.
 */
const sumDenominations = (denominations = []) =>
  (denominations || []).reduce(
    (s, d) => s + (Number(d.denomination) || 0) * (Number(d.quantity) || 0),
    0,
  );

const formatINR = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const DenominationRow = ({ denomination, quantity }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
    <span className="text-sm text-text-muted font-mono">
      ₹{denomination} × {quantity}
    </span>
    <span className="text-sm font-semibold font-mono text-text tabular-nums">
      {formatINR(denomination * quantity)}
    </span>
  </div>
);

const BranchCashPage = () => {
  const { currentBranch } = useBranch();
  const { currentBranchCash, fetchBranchCash, fetchStatus, error } = useBranchCash();
  const [isInitModalOpen, setIsInitModalOpen] = React.useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = React.useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);

  useEffect(() => {
    if (currentBranch?._id) {
      fetchBranchCash(currentBranch._id);
    }
  }, [currentBranch?._id, fetchBranchCash]);

  const isLoading = fetchStatus === "loading";

  // Always derive totals from denomination sums — never trust a scalar field
  const runningDenominations =
    currentBranchCash?.denominationBalance?.runningDenominations || [];
  const frozenDenominations =
    currentBranchCash?.denominationBalance?.frozenDenominations || [];

  const runningTotal = sumDenominations(runningDenominations);
  const frozenTotal = sumDenominations(frozenDenominations);
  const grandTotal = runningTotal + frozenTotal;

  return (
    <div className="p-6 bg-bg min-h-[calc(100vh-60px)] space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <AppHeading level={3}>Branch Cash</AppHeading>
          <AppText className="text-text-muted mt-0.5">
            Overview of Running and Frozen cash in{" "}
            <span className="font-semibold text-text">
              {currentBranch?.name || "the branch"}
            </span>
          </AppText>
          {grandTotal > 0 && (
            <div className="mt-1 text-xs text-text-muted">
              Grand total:{" "}
              <span className="font-bold text-text">{formatINR(grandTotal)}</span>
              <span className="ml-1.5 text-[10px] font-mono text-success bg-success/10 px-1.5 py-0.5 rounded">
                DENOMINATION-VERIFIED
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {currentBranchCash && (
            <>
              <AppButton
                variant="outline"
                onClick={() => setIsDepositModalOpen(true)}
                disabled={isLoading}
                icon={<ArrowDown className="w-4 h-4 text-success" />}
              >
                Deposit
              </AppButton>
              <AppButton
                variant="outline"
                onClick={() => setIsWithdrawModalOpen(true)}
                disabled={isLoading}
                icon={<ArrowUp className="w-4 h-4 text-danger" />}
              >
                Withdraw
              </AppButton>
            </>
          )}
          <AppButton
            variant="outline"
            onClick={() => currentBranch?._id && fetchBranchCash(currentBranch._id)}
            disabled={isLoading}
            icon={<RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />}
          >
            Refresh
          </AppButton>
        </div>
      </div>

      {isLoading && !currentBranchCash ? (
        <div className="p-10 flex justify-center">
          <AppText>Loading branch cash details...</AppText>
        </div>
      ) : currentBranchCash ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── Running Cash ── */}
          <AppCard className="p-0 overflow-hidden border-l-4 border-l-success">
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-success" />
                  <AppHeading level={4} className="text-text">
                    Running Cash
                  </AppHeading>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentBranchCash?.currentShiftId ? 'bg-success/10 text-success border-success/20' : 'bg-surface-alt text-text-muted border-border'}`}>
                  {currentBranchCash?.currentShiftId ? "Active" : "Shift Closed"}
                </span>
              </div>
              <AppText className="text-text-muted text-sm">
                Cash available for daily operations like shift exchanges and transactions.
              </AppText>

              <div className="mt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                  Total (from denominations)
                </div>
                <div className="text-3xl font-black text-success font-mono tabular-nums">
                  {formatINR(runningTotal)}
                </div>
              </div>
            </div>

            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
                Denomination Breakdown
              </p>
              {runningDenominations.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {runningDenominations.map((d) => (
                    <DenominationRow
                      key={d.denomination}
                      denomination={d.denomination}
                      quantity={d.quantity}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-text-muted italic py-2">
                  <AlertCircle className="w-4 h-4" />
                  No denominations on record
                </div>
              )}
            </div>
          </AppCard>

          {/* ── Frozen Cash ── */}
          <AppCard className="p-0 overflow-hidden border-l-4 border-l-amber-400">
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-amber-500" />
                  <AppHeading level={4} className="text-text">
                    Frozen Cash (Reserve)
                  </AppHeading>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-400/30">
                  Locked
                </span>
              </div>
              <AppText className="text-text-muted text-sm">
                Cash reserved from closed shifts. Cannot be used in active shifts — available only for bank deposit.
              </AppText>

              <div className="mt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                  Total (from denominations)
                </div>
                <div className="text-3xl font-black text-amber-600 font-mono tabular-nums">
                  {formatINR(frozenTotal)}
                </div>
              </div>
            </div>

            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
                Denomination Breakdown
              </p>
              {frozenDenominations.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {frozenDenominations.map((d) => (
                    <DenominationRow
                      key={d.denomination}
                      denomination={d.denomination}
                      quantity={d.quantity}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-text-muted italic py-2">
                  <AlertCircle className="w-4 h-4" />
                  No frozen denominations
                </div>
              )}
            </div>
          </AppCard>
        </div>
      ) : (
        <AppCard className="p-10 flex flex-col items-center justify-center min-h-[300px]">
          <AppText className="mb-4 text-text-muted">
            No cash records found for this branch. The branch cash might not be initialized yet.
          </AppText>
          <AppButton 
            onClick={() => setIsInitModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Initialize Branch Cash
          </AppButton>
        </AppCard>
      )}

      {/* Modals */}
      <InitializeBranchCashModal
        isOpen={isInitModalOpen}
        onClose={() => {
          setIsInitModalOpen(false);
          if (currentBranch?._id) fetchBranchCash(currentBranch._id);
        }}
      />
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />
    </div>
  );
};

export default BranchCashPage;
