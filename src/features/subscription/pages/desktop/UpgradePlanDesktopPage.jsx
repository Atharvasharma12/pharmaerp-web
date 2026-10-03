import React from "react";
import { NavLink } from "react-router-dom";
import { FiCheck, FiX, FiShield, FiChevronRight } from "react-icons/fi";
import { AppButton } from "@/components";
import { ROUTES } from "@/constants";

const UpgradePlanDesktopPage = ({
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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Find currently selected plan details
  const selectedPlan = activePlans.find((p) => p._id === selectedPlanId);

  // Helper to calculate price based on billing cycle (Yearly gets 20% off)
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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <span>Dashboard</span>
            <FiChevronRight />
            <span>Subscription</span>
            <FiChevronRight />
            <span className="text-text font-medium">Upgrade Plan</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">Upgrade Your Plan</h1>
          <p className="text-text-muted mt-1 text-sm">
            Choose the perfect plan for your business needs. Upgrade anytime, downgrade at your next billing cycle.
          </p>
        </div>

        {/* Info Banner */}
        <div className="flex items-center gap-3 bg-primary-soft/40 border border-primary/10 rounded-xl px-4 py-3 text-sm text-primary max-w-sm">
          <FiShield className="text-lg shrink-0" />
          <span className="font-medium text-xs leading-normal">
            All plans include 14-day money back guarantee
          </span>
        </div>
      </div>

      {/* Billing Cycle Selector */}
      <div className="flex flex-col items-center gap-2">
        <div className="inline-flex rounded-xl bg-surface-hover p-1 border border-divider">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={[
              "px-6 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
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
              "px-6 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
              billingCycle === "yearly"
                ? "bg-surface text-primary shadow-sm"
                : "text-text-muted hover:text-text",
            ].join(" ")}
          >
            Yearly
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
              Save 20%
            </span>
          </button>
        </div>
        <p className="text-[11px] text-text-muted mt-1">
          All prices are in INR and excluding applicable taxes.
        </p>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                "relative flex flex-col justify-between rounded-2xl border bg-surface p-6 transition-all duration-200 shadow-sm",
                isCurrent
                  ? "opacity-60 cursor-not-allowed border-divider"
                  : isSelected
                  ? "border-primary ring-2 ring-primary/10 cursor-pointer"
                  : "border-divider hover:border-text-muted cursor-pointer",
                plan.type === "starter" ? "relative" : "",
              ].join(" ")}
            >
              {plan.type === "starter" && currentPlanType === "free" && (
                <span className="absolute -top-3 right-4 bg-primary text-surface text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <div>
                {/* Plan Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-text capitalize">{plan.name}</h3>
                  <p className="text-xs text-text-muted mt-1 leading-normal">
                    {plan.description || `Perfect for ${plan.name} setups.`}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-text">₹{price}</span>
                  <span className="text-xs text-text-muted">/ user / month</span>
                </div>

                {/* Selector Button */}
                <div className="mb-6">
                  {isCurrent ? (
                    <AppButton
                      fullWidth
                      variant="tonal"
                      disabled
                      sx={{ py: "8px", textTransform: "none", fontSize: "12px", fontWeight: 700 }}
                    >
                      Current Plan
                    </AppButton>
                  ) : plan.type === "free" ? (
                    <AppButton
                      fullWidth
                      variant="outlined"
                      disabled
                      sx={{ py: "8px", textTransform: "none", fontSize: "12px", fontWeight: 700 }}
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
                      sx={{ py: "8px", textTransform: "none", fontSize: "12px", fontWeight: 700 }}
                    >
                      {isSelected ? "Selected" : `Upgrade to ${plan.name}`}
                    </AppButton>
                  )}
                </div>

                {/* Features Checkbox */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-text">
                    <FiCheck className="text-primary text-base shrink-0" />
                    <span>{limits.maxCompanies} {limits.maxCompanies === 1 ? "Company" : "Companies"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-text">
                    <FiCheck className="text-primary text-base shrink-0" />
                    <span>{limits.maxBranches} {limits.maxBranches === 1 ? "Branch" : "Branches"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-text">
                    <FiCheck className="text-primary text-base shrink-0" />
                    <span>{limits.maxUsers} {limits.maxUsers === 1 ? "User" : "Users"}</span>
                  </div>
                  {plan.modules?.length > 0 && (
                    <div className="flex items-center gap-2.5 text-xs text-text">
                      <FiCheck className="text-primary text-base shrink-0" />
                      <span>
                        {plan.type === "enterprise" ? "All Modules" : "Core Modules"}
                      </span>
                    </div>
                  )}
                  {plan.features?.prioritySupport && (
                    <div className="flex items-center gap-2.5 text-xs text-text">
                      <FiCheck className="text-primary text-base shrink-0" />
                      <span>Priority Support</span>
                    </div>
                  )}
                  {plan.features?.customBranding && (
                    <div className="flex items-center gap-2.5 text-xs text-text">
                      <FiCheck className="text-primary text-base shrink-0" />
                      <span>Custom Branding</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="bg-surface border border-divider rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-text mb-6">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-divider">
                <th className="pb-4 font-semibold text-text-muted">Features & Limits</th>
                {activePlans.map((plan) => (
                  <th key={plan._id} className="pb-4 font-bold text-text text-center capitalize">
                    {plan.name}
                    {plan.type === currentPlanType && (
                      <span className="block text-[10px] text-primary font-medium mt-0.5">
                        (Current Plan)
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-divider/40">
              {/* Companies */}
              <tr>
                <td className="py-3 text-text font-medium">Companies</td>
                {activePlans.map((plan) => (
                  <td key={plan._id} className="py-3 text-center text-text">
                    {plan.limits?.maxCompanies || 1}
                  </td>
                ))}
              </tr>

              {/* Branches */}
              <tr>
                <td className="py-3 text-text font-medium">Branches</td>
                {activePlans.map((plan) => (
                  <td key={plan._id} className="py-3 text-center text-text">
                    {plan.limits?.maxBranches || 1}
                  </td>
                ))}
              </tr>

              {/* Users */}
              <tr>
                <td className="py-3 text-text font-medium">Users</td>
                {activePlans.map((plan) => (
                  <td key={plan._id} className="py-3 text-center text-text">
                    {plan.limits?.maxUsers || 1}
                  </td>
                ))}
              </tr>

              {/* Modules Access */}
              <tr>
                <td className="py-3 text-text font-medium">Modules Access</td>
                {activePlans.map((plan) => (
                  <td key={plan._id} className="py-3 text-center text-text">
                    {plan.type === "free"
                      ? "Limited"
                      : plan.type === "starter"
                      ? "Core Modules"
                      : plan.type === "business"
                      ? "All Core Modules"
                      : "All Modules"}
                  </td>
                ))}
              </tr>

              {/* Custom Branding */}
              <tr>
                <td className="py-3 text-text font-medium">Custom Branding</td>
                {activePlans.map((plan) => (
                  <td key={plan._id} className="py-3 text-center">
                    {plan.features?.customBranding ? (
                      <FiCheck className="text-primary mx-auto text-base" />
                    ) : (
                      <FiX className="text-text-muted mx-auto text-base" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Priority Support */}
              <tr>
                <td className="py-3 text-text font-medium">Priority Support</td>
                {activePlans.map((plan) => (
                  <td key={plan._id} className="py-3 text-center">
                    {plan.features?.prioritySupport ? (
                      <FiCheck className="text-primary mx-auto text-base" />
                    ) : (
                      <FiX className="text-text-muted mx-auto text-base" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Reports Access */}
              <tr>
                <td className="py-3 text-text font-medium">Reports Access</td>
                {activePlans.map((plan) => (
                  <td key={plan._id} className="py-3 text-center text-text">
                    {plan.type === "free"
                      ? "Basic"
                      : plan.type === "starter"
                      ? "Standard"
                      : "Advanced"}
                  </td>
                ))}
              </tr>

              {/* Data Export */}
              <tr>
                <td className="py-3 text-text font-medium">Data Export</td>
                {activePlans.map((plan) => (
                  <td key={plan._id} className="py-3 text-center">
                    {plan.type !== "free" && plan.type !== "starter" ? (
                      <FiCheck className="text-primary mx-auto text-base" />
                    ) : (
                      <FiX className="text-text-muted mx-auto text-base" />
                    )}
                  </td>
                ))}
              </tr>

              {/* API Access */}
              <tr>
                <td className="py-3 text-text font-medium">API Access</td>
                {activePlans.map((plan) => (
                  <td key={plan._id} className="py-3 text-center">
                    {plan.type === "enterprise" ? (
                      <FiCheck className="text-primary mx-auto text-base" />
                    ) : (
                      <FiX className="text-text-muted mx-auto text-base" />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Summary Card */}
      {selectedPlan && selectedPlan.type !== "free" && (
        <div className="bg-primary-soft/50 border border-primary/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-surface rounded-xl border border-divider text-primary shrink-0">
              <FiShield className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-text text-sm">Secure & Hassle Free</h3>
              <p className="text-text-muted text-xs mt-0.5">
                Your payment is secure. Upgrade or downgrade your plan at any time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-end md:self-auto">
            <div className="text-right">
              <span className="block text-[11px] text-text-muted">Due Today</span>
              <span className="block text-2xl font-black text-text">
                ₹{getBilledAmount(selectedPlan).toLocaleString("en-IN")}.00
              </span>
              <span className="block text-[10px] text-text-muted mt-0.5">
                + applicable taxes (billed {billingCycle})
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <AppButton
                variant="contained"
                colorVariant="primary"
                rounded="xl"
                onClick={onProceedToCheckout}
                sx={{
                  px: 4,
                  py: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Proceed to Checkout →
              </AppButton>
              <span className="text-[10px] text-text-muted">You can cancel anytime</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradePlanDesktopPage;
