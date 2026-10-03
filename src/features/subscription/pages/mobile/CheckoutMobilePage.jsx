import React from "react";
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
  FiHelpCircle
} from "react-icons/fi";
import { AppButton } from "@/components";

const CheckoutMobilePage = ({
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
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-xs text-text-muted">Loading checkout...</span>
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
    <div className="w-full flex flex-col min-h-screen bg-bg text-text pb-36">
      {/* Header Info */}
      <div className="p-4 bg-surface border-b border-divider">
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
          <span>Dashboard</span>
          <FiChevronRight />
          <span>Subscription</span>
          <FiChevronRight />
          <span onClick={onChangePlan} className="cursor-pointer">Upgrade Plan</span>
          <FiChevronRight />
          <span className="text-text font-medium">Checkout</span>
        </div>
        <h1 className="text-xl font-black tracking-tight text-text">Checkout</h1>
        <p className="text-[11px] text-text-muted mt-0.5 leading-normal">
          Review your order and complete your subscription.
        </p>
      </div>

      {errorMessage && (
        <div className="m-4 bg-error-soft border border-error/20 text-error p-3 rounded-lg text-[11px] font-bold">
          {errorMessage}
        </div>
      )}

      {/* Steps List */}
      <div className="p-4 space-y-4">
        {/* Step 1: Plan & Billing Details */}
        <div className="bg-surface border border-divider rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-surface text-[10px] font-bold">
              1
            </span>
            <h2 className="text-xs font-bold text-text">Plan & Billing Details</h2>
          </div>

          {/* Selected Plan Details */}
          <div className="border border-divider rounded-lg p-3 flex gap-3 items-start bg-bg/50">
            <div className="p-2 bg-primary-soft rounded-lg text-primary shrink-0">
              <FiLayers className="text-base" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-text capitalize">{selectedPlan.name} Plan</h3>
              <p className="text-[10px] text-text-muted mt-0.5 leading-normal">
                {selectedPlan.description || "Ideal for small setups."}
              </p>
              <button
                onClick={onChangePlan}
                className="text-[10px] font-bold text-primary mt-2 block hover:underline"
              >
                Change Plan
              </button>
            </div>
          </div>

          {/* Billing Cycle Selection */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Monthly */}
            <div
              onClick={() => setBillingCycle("monthly")}
              className={[
                "flex items-center gap-2 border rounded-lg p-2.5 cursor-pointer transition",
                billingCycle === "monthly" ? "border-primary bg-primary-soft/5" : "border-divider"
              ].join(" ")}
            >
              <span className={[
                "flex h-3 w-3 items-center justify-center rounded-full border text-[7px]",
                billingCycle === "monthly" ? "border-primary bg-primary text-surface" : "border-divider"
              ].join(" ")}>
                {billingCycle === "monthly" && <FiCheck />}
              </span>
              <div>
                <span className="text-[10px] font-bold text-text block">Monthly</span>
                <span className="text-[8px] text-text-muted mt-0.5 block">₹{basePrice}/mo</span>
              </div>
            </div>

            {/* Yearly */}
            <div
              onClick={() => setBillingCycle("yearly")}
              className={[
                "flex items-center gap-2 border rounded-lg p-2.5 cursor-pointer transition",
                billingCycle === "yearly" ? "border-primary bg-primary-soft/5" : "border-divider"
              ].join(" ")}
            >
              <span className={[
                "flex h-3 w-3 items-center justify-center rounded-full border text-[7px]",
                billingCycle === "yearly" ? "border-primary bg-primary text-surface" : "border-divider"
              ].join(" ")}>
                {billingCycle === "yearly" && <FiCheck />}
              </span>
              <div>
                <span className="text-[10px] font-bold text-text block">Yearly</span>
                <span className="text-[8px] text-text-muted mt-0.5 block">₹{Math.round(basePrice * 0.8 * 12)}/yr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Workspace & User Details */}
        <div className="bg-surface border border-divider rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-surface text-[10px] font-bold">
              2
            </span>
            <h2 className="text-xs font-bold text-text">Workspace & User Details</h2>
          </div>

          <div className="space-y-3">
            <div className="border border-divider rounded-lg p-3 bg-bg/50 flex items-center gap-3">
              <div className="h-7 w-7 bg-surface rounded border border-divider flex items-center justify-center shrink-0">
                <img src="/erp-mini-logo.png" className="h-4.5 w-4.5 object-contain" alt="mini logo" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-text truncate">
                  {currentWorkspace?.name || "Active Workspace"}
                </span>
                <span className="block text-[9px] text-text-muted leading-none mt-0.5">
                  Current Workspace
                </span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-text mb-1">Number of Users</span>
              <div className="flex items-center border border-divider rounded-lg p-0.5 bg-surface-hover w-full max-w-[200px]">
                <button
                  onClick={() => seatQuantity > 1 && setSeatQuantity(seatQuantity - 1)}
                  className="h-7 w-7 flex items-center justify-center text-text-muted hover:text-text rounded-md hover:bg-surface transition shrink-0"
                >
                  <FiMinus />
                </button>
                <span className="flex-1 text-center text-xs font-bold text-text">
                  {seatQuantity} Users
                </span>
                <button
                  onClick={() => setSeatQuantity(seatQuantity + 1)}
                  className="h-7 w-7 flex items-center justify-center text-text-muted hover:text-text rounded-md hover:bg-surface transition shrink-0"
                >
                  <FiPlus />
                </button>
              </div>
              <span className="block text-[9px] text-text-muted mt-1.5">
                ₹{cyclePrice} × {seatQuantity} users / {billingCycle === "yearly" ? "year" : "month"}
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: Payment Information */}
        <div className="bg-surface border border-divider rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-surface text-[10px] font-bold">
              3
            </span>
            <h2 className="text-xs font-bold text-text">Payment Information</h2>
          </div>

          {/* Payment Tabs Selector */}
          <div className="flex gap-1.5 border-b border-divider pb-2 overflow-x-auto">
            <button
              onClick={() => setPaymentMethod("card")}
              className={[
                "px-3 py-1.5 rounded-md text-[10px] font-bold transition flex items-center gap-1.5",
                paymentMethod === "card" ? "bg-primary-soft text-primary" : "text-text-muted hover:bg-surface-hover"
              ].join(" ")}
            >
              <FiCreditCard />
              Card
            </button>
            <button
              onClick={() => setPaymentMethod("upi")}
              className={[
                "px-3 py-1.5 rounded-md text-[10px] font-bold transition flex items-center gap-1.5",
                paymentMethod === "upi" ? "bg-primary-soft text-primary" : "text-text-muted hover:bg-surface-hover"
              ].join(" ")}
            >
              <FiCheckCircle />
              UPI
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {paymentMethod === "card" ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-text mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-bg border border-divider rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text mb-1">Card Holder Name</label>
                  <input
                    type="text"
                    name="cardHolderName"
                    value={cardDetails.cardHolderName}
                    onChange={handleCardChange}
                    placeholder="Enter card holder name"
                    className="w-full bg-bg border border-divider rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-text mb-1">Expiry</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardChange}
                      placeholder="MM / YY"
                      className="w-full bg-bg border border-divider rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted focus:border-primary focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      className="w-full bg-bg border border-divider rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-[10px] text-text-muted">
                {paymentMethod.toUpperCase()} integrations open securely upon checkout.
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
              <FiLock className="text-primary shrink-0" />
              <span>Secure & encrypted transactions.</span>
            </div>
          </div>
        </div>

        {/* Order Summary breakdown */}
        <div className="bg-surface border border-divider rounded-xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-text">Order Summary</h2>

          <div className="space-y-2 text-[11px] border-b border-divider/40 pb-3">
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
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-text">Total</span>
            <span className="text-xl font-black text-primary">
              ₹{total.toLocaleString("en-IN")}.00
            </span>
          </div>

          <div className="flex items-start gap-2 bg-bg/50 border border-divider rounded-lg p-2.5 text-[9px] text-text-muted leading-relaxed">
            <FiShield className="text-primary text-xs shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-text block">14-Day Guarantee</span>
              Not satisfied? Get a full refund within 14 days of purchase.
            </div>
          </div>
        </div>
      </div>

      {/* Floating Checkout Button Footer */}
      <div className="fixed bottom-14 left-0 right-0 z-20 bg-surface border-t border-divider p-4 shadow-lg flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <FiLock className="text-primary text-xs" />
            <span className="text-[10px] text-text-muted font-medium">Billed {billingCycle}</span>
          </div>
          <span className="text-xs font-black text-text">
            Total: ₹{total.toLocaleString("en-IN")}.00
          </span>
        </div>

        <AppButton
          fullWidth
          variant="contained"
          colorVariant="primary"
          rounded="lg"
          onClick={onPaySecurely}
          disabled={isSubmitting}
          sx={{
            py: "8px",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {isSubmitting ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}.00 Securely`}
        </AppButton>
        <span className="text-[8px] text-text-muted text-center block">
          By billing, you agree to our Terms and Privacy policies.
        </span>
      </div>
    </div>
  );
};

export default CheckoutMobilePage;
