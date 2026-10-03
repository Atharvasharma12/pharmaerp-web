import React from "react";
import { FiCheck, FiShield, FiChevronRight } from "react-icons/fi";
import { AppButton } from "@/components";

const UpgradePlanMobilePage = ({
  activePlans,
  loading,
  currentWorkspaceSubscription,
  currentPlanType,
  billingCycle,
  setBillingCycle,
  selectedPlanId,
  setSelectedPlanId,
  onProceedToCheckout,
}) => {
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const selectedPlan = activePlans.find((p) => p._id === selectedPlanId);

  const getPlanPrice = (plan) => {
    if (!plan) return 0;
    if (plan.type === "free") return 0;
    const basePrice = plan.pricePerUser;
    return billingCycle === "yearly" ? Math.round(basePrice * 0.8) : basePrice;
  };

  const getBilledAmount = (plan) => {
    if (!plan) return 0;
    const monthlyPrice = getPlanPrice(plan);
    return billingCycle === "yearly" ? monthlyPrice * 12 : monthlyPrice;
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-bg text-text pb-32">
      {/* Header Info */}
      <div className="p-4 bg-surface border-b border-divider">
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
          <span>Dashboard</span>
          <FiChevronRight />
          <span>Subscription</span>
          <FiChevronRight />
          <span className="text-text font-medium">Upgrade Plan</span>
        </div>
        <h1 className="text-xl font-black tracking-tight text-text">Upgrade Your Plan</h1>
        <p className="text-[11px] text-text-muted mt-0.5 leading-normal">
          Choose the perfect plan for your business needs. Upgrade anytime, downgrade at your next billing cycle.
        </p>

        {/* Guarantee Info Banner */}
        <div className="mt-3 flex items-center gap-2 bg-primary-soft/50 border border-primary/10 rounded-lg p-2.5 text-primary">
          <FiShield className="text-base shrink-0" />
          <span className="text-[10px] font-bold leading-normal">
            All plans include 14-day money back guarantee
          </span>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="p-4 flex flex-col items-center gap-2 border-b border-divider bg-surface/50">
        <div className="inline-flex rounded-lg bg-surface-hover p-0.5 border border-divider w-full max-w-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={[
              "flex-1 py-1.5 rounded-md text-xs font-bold transition-all duration-200",
              billingCycle === "monthly"
                ? "bg-surface text-primary shadow-sm"
                : "text-text-muted hover:text-text",
            ].join(" ")}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={[
              "flex-1 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1",
              billingCycle === "yearly"
                ? "bg-surface text-primary shadow-sm"
                : "text-text-muted hover:text-text",
            ].join(" ")}
          >
            Yearly
            <span className="bg-primary/10 text-primary text-[8px] font-bold px-1 rounded">
              Save 20%
            </span>
          </button>
        </div>
        <span className="text-[10px] text-text-muted">
          Prices exclude applicable taxes. Billed {billingCycle}.
        </span>
      </div>

      {/* Vertical list of Plans */}
      <div className="p-4 space-y-4">
        {activePlans.map((plan) => {
          const isCurrent = plan.type === currentPlanType;
          const isSelected = plan._id === selectedPlanId;
          const price = getPlanPrice(plan);
          const limits = plan.limits || {};

          return (
            <div
              key={plan._id}
              onClick={() => !isCurrent && plan.type !== "free" && setSelectedPlanId(plan._id)}
              className={[
                "relative rounded-xl border p-4 bg-surface transition-all duration-200 shadow-xs",
                isCurrent
                  ? "opacity-60 cursor-not-allowed border-divider"
                  : isSelected
                  ? "border-primary ring-2 ring-primary/5 cursor-pointer"
                  : "border-divider hover:border-text-muted cursor-pointer",
              ].join(" ")}
            >
              {plan.type === "starter" && currentPlanType === "free" && (
                <span className="absolute top-3 right-3 bg-primary text-surface text-[8px] font-bold px-1.5 py-0.5 rounded">
                  Most Popular
                </span>
              )}

              {/* Title & Price */}
              <div className="flex justify-between items-start gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-text capitalize">{plan.name}</h3>
                  <p className="text-[10px] text-text-muted mt-0.5 max-w-[180px] leading-normal">
                    {plan.description || `For scale ${plan.name} operations.`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-text">₹{price}</span>
                  <span className="block text-[9px] text-text-muted">/user/mo</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mb-3">
                {isCurrent ? (
                  <AppButton
                    fullWidth
                    variant="tonal"
                    disabled
                    sx={{ py: "6px", textTransform: "none", fontSize: "11px", fontWeight: 700 }}
                  >
                    Current Plan
                  </AppButton>
                ) : plan.type === "free" ? (
                  <AppButton
                    fullWidth
                    variant="outlined"
                    disabled
                    sx={{ py: "6px", textTransform: "none", fontSize: "11px", fontWeight: 700 }}
                  >
                    Included
                  </AppButton>
                ) : (
                  <AppButton
                    fullWidth
                    variant={isSelected ? "contained" : "outlined"}
                    colorVariant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId(plan._id);
                    }}
                    sx={{ py: "6px", textTransform: "none", fontSize: "11px", fontWeight: 700 }}
                  >
                    {isSelected ? "Selected" : `Upgrade to ${plan.name}`}
                  </AppButton>
                )}
              </div>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 border-t border-divider/40 pt-3">
                <div className="flex items-center gap-1.5 text-[10px] text-text">
                  <FiCheck className="text-primary text-xs shrink-0" />
                  <span className="truncate">{limits.maxCompanies} {limits.maxCompanies === 1 ? "Company" : "Companies"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-text">
                  <FiCheck className="text-primary text-xs shrink-0" />
                  <span className="truncate">{limits.maxBranches} {limits.maxBranches === 1 ? "Branch" : "Branches"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-text">
                  <FiCheck className="text-primary text-xs shrink-0" />
                  <span className="truncate">{limits.maxUsers} {limits.maxUsers === 1 ? "User" : "Users"}</span>
                </div>
                {plan.modules?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-text">
                    <FiCheck className="text-primary text-xs shrink-0" />
                    <span className="truncate">
                      {plan.type === "enterprise" ? "All Modules" : "Core Modules"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Sticky Checkout Footer */}
      {selectedPlan && selectedPlan.type !== "free" && (
        <div className="fixed bottom-14 left-0 right-0 z-20 bg-surface border-t border-divider p-4 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FiShield className="text-primary text-base shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-text">Secure & Hassle Free</h4>
                <p className="text-[9px] text-text-muted leading-none mt-0.5">Upgrade or cancel anytime</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-text-muted block">Due Today</span>
              <span className="text-lg font-black text-text block">
                ₹{getBilledAmount(selectedPlan).toLocaleString("en-IN")}.00
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <AppButton
              fullWidth
              variant="contained"
              colorVariant="primary"
              rounded="lg"
              onClick={onProceedToCheckout}
              sx={{
                py: "8px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Proceed to Checkout →
            </AppButton>
            <span className="text-[9px] text-text-muted">Prices exclude applicable taxes.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradePlanMobilePage;
