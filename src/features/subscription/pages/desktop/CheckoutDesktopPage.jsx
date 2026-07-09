import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiChevronRight,
  FiCheck,
  FiPlus,
  FiMinus,
  FiLock,
  FiCreditCard,
  FiLayers,
  FiCheckCircle,
  FiShield,
  FiRotateCcw,
  FiPhoneCall,
  FiHelpCircle
} from "react-icons/fi";
import { AppButton } from "@/components";

const CheckoutDesktopPage = ({
  selectedPlan,
  billingCycle,
  setBillingCycle,
  seatQuantity,
  setSeatQuantity,
  paymentMethod,
  setPaymentMethod,
  cardDetails,
  setCardDetails,
  currentWorkspace,
  isSubmitting,
  errorMessage,
  onChangePlan,
  onPaySecurely,
}) => {
  if (!selectedPlan) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-sm text-text-muted">Loading checkout details...</span>
      </div>
    );
  }

  // Calculate pricing values
  const basePrice = selectedPlan.pricePerUser;
  const cyclePrice = billingCycle === "yearly" ? Math.round(basePrice * 0.8) : basePrice;
  const subtotal = cyclePrice * seatQuantity;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
          <span>Dashboard</span>
          <FiChevronRight />
          <span>Subscription</span>
          <FiChevronRight />
          <span className="hover:underline cursor-pointer" onClick={onChangePlan}>Upgrade Plan</span>
          <FiChevronRight />
          <span className="text-text font-medium">Checkout</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Checkout</h1>
        <p className="text-text-muted mt-1 text-sm">
          Review your order and complete your subscription.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-error-soft border border-error/20 text-error p-4 rounded-xl text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Forms (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Plan & Billing Details */}
          <div className="bg-surface border border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-surface text-xs font-bold">
                1
              </span>
              <h2 className="text-sm font-bold text-text">Plan & Billing Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Selected Plan view */}
              <div className="border border-divider rounded-xl p-4 flex gap-4 items-start bg-bg/50">
                <div className="p-2.5 bg-primary-soft rounded-lg text-primary shrink-0">
                  <FiLayers className="text-lg" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-text capitalize">
                    {selectedPlan.name} Plan
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 leading-normal">
                    {selectedPlan.description || "Ideal for growing setups."}
                  </p>
                  <button
                    onClick={onChangePlan}
                    className="text-[11px] font-bold text-primary mt-3 hover:underline"
                  >
                    Change Plan
                  </button>
                </div>
              </div>

              {/* Billing Cycle select options */}
              <div className="space-y-3">
                {/* Monthly selector */}
                <div
                  onClick={() => setBillingCycle("monthly")}
                  className={[
                    "flex items-center justify-between border rounded-xl p-4 cursor-pointer transition",
                    billingCycle === "monthly" ? "border-primary bg-primary-soft/10" : "border-divider hover:border-text-muted"
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span className={[
                      "flex h-4 w-4 items-center justify-center rounded-full border text-[8px]",
                      billingCycle === "monthly" ? "border-primary bg-primary text-surface" : "border-divider"
                    ].join(" ")}>
                      {billingCycle === "monthly" && <FiCheck />}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-text block">Monthly</span>
                      <span className="text-[10px] text-text-muted mt-0.5 block">
                        ₹{basePrice} / user / month
                      </span>
                    </div>
                  </div>
                </div>

                {/* Yearly selector */}
                <div
                  onClick={() => setBillingCycle("yearly")}
                  className={[
                    "flex items-center justify-between border rounded-xl p-4 cursor-pointer transition",
                    billingCycle === "yearly" ? "border-primary bg-primary-soft/10" : "border-divider hover:border-text-muted"
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span className={[
                      "flex h-4 w-4 items-center justify-center rounded-full border text-[8px]",
                      billingCycle === "yearly" ? "border-primary bg-primary text-surface" : "border-divider"
                    ].join(" ")}>
                      {billingCycle === "yearly" && <FiCheck />}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-text flex items-center gap-1.5">
                        Yearly
                        <span className="bg-primary/10 text-primary text-[8px] font-bold px-1 rounded">
                          Save 20%
                        </span>
                      </span>
                      <span className="text-[10px] text-text-muted mt-0.5 block">
                        ₹{Math.round(basePrice * 0.8 * 12)} / user / year
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Workspace & User Details */}
          <div className="bg-surface border border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-surface text-xs font-bold">
                2
              </span>
              <h2 className="text-sm font-bold text-text">Workspace & User Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Workspace display */}
              <div className="border border-divider rounded-xl p-4 flex justify-between items-center bg-bg/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 bg-surface rounded-lg border border-divider flex items-center justify-center shrink-0">
                    <img src="/erp-mini-logo.png" className="h-5 w-5 object-contain" alt="mini logo" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-text truncate">
                      {currentWorkspace?.name || "Active Workspace"}
                    </span>
                    <span className="block text-[10px] text-text-muted mt-0.5">
                      Current Workspace
                    </span>
                  </div>
                </div>
              </div>

              {/* Number of Users selector */}
              <div>
                <div className="flex items-center border border-divider rounded-xl p-1 bg-surface-hover w-full max-w-[240px]">
                  <button
                    onClick={() => seatQuantity > 1 && setSeatQuantity(seatQuantity - 1)}
                    className="h-8 w-8 flex items-center justify-center text-text-muted hover:text-text rounded-lg hover:bg-surface transition shrink-0"
                  >
                    <FiMinus />
                  </button>
                  <span className="flex-1 text-center text-xs font-bold text-text">
                    {seatQuantity} Users
                  </span>
                  <button
                    onClick={() => setSeatQuantity(seatQuantity + 1)}
                    className="h-8 w-8 flex items-center justify-center text-text-muted hover:text-text rounded-lg hover:bg-surface transition shrink-0"
                  >
                    <FiPlus />
                  </button>
                </div>
                <p className="text-[10px] text-text-muted mt-2">
                  ₹{cyclePrice} × {seatQuantity} users / {billingCycle === "yearly" ? "year" : "month"}
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Information */}
          <div className="bg-surface border border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-surface text-xs font-bold">
                3
              </span>
              <h2 className="text-sm font-bold text-text">Payment Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
              {/* Payment Methods tabs */}
              <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto border-b md:border-b-0 md:border-r border-divider pb-3 md:pb-0 md:pr-4">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={[
                    "px-4 py-2.5 rounded-lg text-xs font-bold transition text-left whitespace-nowrap w-full flex items-center gap-2",
                    paymentMethod === "card" ? "bg-primary-soft text-primary" : "text-text-muted hover:bg-surface-hover"
                  ].join(" ")}
                >
                  <FiCreditCard />
                  Card
                </button>
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={[
                    "px-4 py-2.5 rounded-lg text-xs font-bold transition text-left whitespace-nowrap w-full flex items-center gap-2",
                    paymentMethod === "upi" ? "bg-primary-soft text-primary" : "text-text-muted hover:bg-surface-hover"
                  ].join(" ")}
                >
                  <FiCheckCircle />
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod("net_banking")}
                  className={[
                    "px-4 py-2.5 rounded-lg text-xs font-bold transition text-left whitespace-nowrap w-full flex items-center gap-2",
                    paymentMethod === "net_banking" ? "bg-primary-soft text-primary" : "text-text-muted hover:bg-surface-hover"
                  ].join(" ")}
                >
                  <FiLayers />
                  Net Banking
                </button>
              </div>

              {/* Form Content */}
              <div className="md:col-span-3 space-y-4">
                {paymentMethod === "card" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-text mb-1.5">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full bg-bg border border-divider rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:border-primary focus:outline-hidden"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-60">
                          <span className="text-[10px] font-extrabold text-text">VISA</span>
                          <span className="text-[10px] font-extrabold text-primary">MC</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-text mb-1.5">Card Holder Name</label>
                      <input
                        type="text"
                        name="cardHolderName"
                        value={cardDetails.cardHolderName}
                        onChange={handleCardChange}
                        placeholder="Enter card holder name"
                        className="w-full bg-bg border border-divider rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:border-primary focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-text mb-1.5">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM / YY"
                          className="w-full bg-bg border border-divider rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:border-primary focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-text mb-1.5">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          className="w-full bg-bg border border-divider rounded-xl px-4 py-2.5 text-xs text-text placeholder-text-muted focus:border-primary focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-text-muted">
                    {paymentMethod.toUpperCase()} integration will open securely on click checkout.
                  </div>
                )}

                <div className="flex items-center gap-2 text-[10px] text-text-muted mt-2">
                  <FiLock className="text-primary text-xs shrink-0" />
                  <span>Your payment information is secure and encrypted.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-surface border border-divider rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-text">Order Summary</h2>

            {/* Plan Card */}
            <div className="bg-primary-soft/50 border border-primary/10 rounded-xl p-4 flex justify-between items-start">
              <div className="flex gap-3">
                <div className="p-2.5 bg-surface rounded-lg text-primary border border-divider shrink-0">
                  <FiLayers className="text-lg" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-text capitalize">
                    {selectedPlan.name} Plan
                  </span>
                  <span className="block text-[10px] text-text-muted mt-0.5">
                    ₹{cyclePrice} / user / month
                  </span>
                </div>
              </div>
              {selectedPlan.type === "starter" && (
                <span className="bg-primary text-surface text-[8px] font-bold px-1.5 py-0.5 rounded">
                  Most Popular
                </span>
              )}
            </div>

            {/* Invoicing Breakdown */}
            <div className="space-y-3 text-xs border-b border-divider/40 pb-4">
              <div className="flex justify-between text-text-muted">
                <span>Plan Price</span>
                <span>₹{cyclePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Users</span>
                <span>{seatQuantity}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span className="flex items-center gap-1">
                  GST (18%)
                  <FiHelpCircle className="text-text-muted text-[10px]" />
                </span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-text">Total ({billingCycle === "yearly" ? "Yearly" : "Monthly"})</span>
              <span className="text-2xl font-black text-primary">
                ₹{total.toLocaleString("en-IN")}.00
              </span>
            </div>

            {/* Guarantee */}
            <div className="flex items-start gap-2.5 bg-bg/60 border border-divider rounded-xl p-3 text-[10px] text-text-muted leading-relaxed">
              <FiCheckCircle className="text-primary text-sm shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-text block">14-Day Money Back Guarantee</span>
                Not satisfied? Get a full refund within 14 days of your purchase.
              </div>
            </div>

            {/* What's Included */}
            <div className="space-y-2 border-t border-divider/40 pt-4">
              <span className="block text-[11px] font-bold text-text">What's Included?</span>
              <div className="space-y-1.5 pt-1.5">
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <FiCheck className="text-primary" />
                  <span>{selectedPlan.limits?.maxCompanies} Companies</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <FiCheck className="text-primary" />
                  <span>{selectedPlan.limits?.maxBranches} Branches</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <FiCheck className="text-primary" />
                  <span>{selectedPlan.limits?.maxUsers} Users</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <AppButton
                fullWidth
                variant="contained"
                colorVariant="primary"
                rounded="xl"
                onClick={onPaySecurely}
                disabled={isSubmitting}
                sx={{
                  py: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {isSubmitting ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}.00 Securely`}
              </AppButton>
              <p className="text-[10px] text-text-muted text-center mt-3 leading-normal">
                By proceeding, you agree to our{" "}
                <a href="#/terms" className="text-primary hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout badges footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-divider">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-surface border border-divider rounded-xl text-primary text-lg">
            <FiLock />
          </div>
          <div>
            <span className="block text-xs font-bold text-text">Secure Payment</span>
            <span className="block text-[10px] text-text-muted mt-0.5">Your payment is 100% secure</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-surface border border-divider rounded-xl text-primary text-lg">
            <FiShield />
          </div>
          <div>
            <span className="block text-xs font-bold text-text">Instant Activation</span>
            <span className="block text-[10px] text-text-muted mt-0.5">Plan activated immediately</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-surface border border-divider rounded-xl text-primary text-lg">
            <FiRotateCcw />
          </div>
          <div>
            <span className="block text-xs font-bold text-text">Cancel Anytime</span>
            <span className="block text-[10px] text-text-muted mt-0.5">No lock-in. Cancel anytime</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-surface border border-divider rounded-xl text-primary text-lg">
            <FiPhoneCall />
          </div>
          <div>
            <span className="block text-xs font-bold text-text">24/7 Support</span>
            <span className="block text-[10px] text-text-muted mt-0.5">We're here to help</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDesktopPage;
