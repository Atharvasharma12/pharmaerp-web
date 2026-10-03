import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks";
import { ROUTES } from "@/constants";
import usePlan from "@/features/subscription/plans/hooks/usePlan";
import useSubscription from "@/features/subscription/subscriptions/hooks/useSubscription";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import { CheckoutDesktopPage } from "./desktop";
import { CheckoutMobilePage } from "./mobile";

const CheckoutPage = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const { activePlans, getActivePlans } = usePlan();
  const { currentWorkspaceSubscription, upgradeSubscription, upgradeSubscriptionStatus } = useSubscription();
  const { currentWorkspace } = useWorkspace();

  // Load state passed from Upgrade Plan page
  const initialPlanId = location.state?.planId;
  const initialBillingCycle = location.state?.billingCycle || "monthly";

  const [billingCycle, setBillingCycle] = useState(initialBillingCycle);
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [seatQuantity, setSeatQuantity] = useState(5); // Default to 5 to match screenshot
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch active plans if not loaded
  useEffect(() => {
    if (activePlans?.length === 0) {
      getActivePlans().catch((err) => console.error(err));
    }
  }, [activePlans, getActivePlans]);

  // Handle plan auto-selection fallback on refresh
  useEffect(() => {
    if (activePlans?.length > 0 && !selectedPlanId) {
      const starterPlan = activePlans.find((p) => p.type === "starter");
      if (starterPlan) {
        setSelectedPlanId(starterPlan._id);
      }
    }
  }, [activePlans, selectedPlanId]);

  const selectedCard = activePlans.find((p) => p._id === selectedPlanId);

  // Redirect back to upgrade plans if no valid plan selected
  const handleChangePlan = () => {
    navigate(ROUTES.UPGRADE_PLAN);
  };

  const handlePaySecurely = async () => {
    if (!selectedPlanId) return;
    if (!currentWorkspaceSubscription?._id) {
      setErrorMessage("No active subscription session found for this workspace.");
      return;
    }

    // Card validations if method is card
    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber || !cardDetails.cardHolderName || !cardDetails.expiryDate || !cardDetails.cvv) {
        setErrorMessage("Please fill in all card details.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = {
        subscriptionId: currentWorkspaceSubscription._id,
        newPlanId: selectedPlanId,
        billingCycle,
        seatQuantity,
      };

      await upgradeSubscription(payload);

      // On success, redirect to dashboard with success message
      navigate(ROUTES.DASHBOARD, {
        state: {
          showUpgradeSuccessToast: true,
        },
      });
    } catch (err) {
      setErrorMessage(typeof err === "string" ? err : "Checkout processing failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageProps = {
    selectedPlan: selectedCard,
    billingCycle,
    setBillingCycle,
    seatQuantity,
    setSeatQuantity,
    paymentMethod,
    setPaymentMethod,
    cardDetails,
    setCardDetails,
    currentWorkspace,
    isSubmitting: isSubmitting || upgradeSubscriptionStatus === "loading",
    errorMessage,
    onChangePlan: handleChangePlan,
    onPaySecurely: handlePaySecurely,
  };

  return isMobile ? (
    <CheckoutMobilePage {...pageProps} />
  ) : (
    <CheckoutDesktopPage {...pageProps} />
  );
};

export default CheckoutPage;
