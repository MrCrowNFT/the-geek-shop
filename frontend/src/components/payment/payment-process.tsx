import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useOrderStore } from "@/hooks/use-new-order";
import { createPaymentIntent, dollarsToCents } from "@/services/stripe";
import {
  CreditCard,
  Loader2,
  AlertCircle,
  Lock,
  CheckCircle,
} from "lucide-react";

const PaymentProcessing = () => {
  const stripe = useStripe();
  const elements = useElements();

  const { currentOrder, setCheckoutStep, setPaymentIntentId, calculateTotal } =
    useOrderStore();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Standard shipping cost (should match the one from OrderCreationPending)
  const SHIPPING_COST = 5.0;
  const totalAmount = calculateTotal() + SHIPPING_COST;

  // Create payment intent when component mounts
  useEffect(() => {
    if (!currentOrder) return;

    const initializePayment = async () => {
      setIsCreatingIntent(true);
      setError(null);

      try {
        const amountInCents = dollarsToCents(totalAmount);
        const response = await createPaymentIntent(amountInCents, "usd");

        setClientSecret(response.clientSecret);

        // Store payment intent ID in order state if available
        if (response.clientSecret) {
          const paymentIntentId = response.clientSecret.split("_secret_")[0];
          setPaymentIntentId(paymentIntentId);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize payment"
        );
        console.error("Payment intent creation error:", err);
      } finally {
        setIsCreatingIntent(false);
      }
    };

    initializePayment();
  }, [currentOrder, totalAmount, setPaymentIntentId]);

  // Handle actual payment processing with Stripe
  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) {
      setError("Stripe is not properly initialized");
      return;
    }

    setIsProcessingPayment(true);
    setError(null);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        // Payment failed
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        // Payment succeeded
        setPaymentSuccess(true);
        // Move to success step after a brief delay
        setTimeout(() => {
          setCheckoutStep(5);
        }, 1500);
      } else {
        setError("Payment was not completed. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle going back
  const handleGoBack = () => {
    setCheckoutStep(3);
  };

  // Show loading state while creating payment intent
  if (isCreatingIntent) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <Loader2 className="animate-spin mx-auto mb-4" size={32} />
        <h2 className="text-xl font-bold mb-2">Initializing Payment</h2>
        <p className="text-gray-600">Setting up secure payment processing...</p>
      </div>
    );
  }

  // Show error if payment intent creation failed
  if (error && !clientSecret) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Payment Setup Failed
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
          >
            ← Back to Order Review
          </button>

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          {paymentSuccess ? (
            <CheckCircle className="text-green-500" size={48} />
          ) : (
            <CreditCard className="text-blue-500" size={48} />
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {paymentSuccess ? "Payment Successful!" : "Complete Your Payment"}
        </h2>

        <p className="text-gray-600">
          {paymentSuccess
            ? "Your payment has been processed successfully. Redirecting..."
            : "Enter your payment details to complete your order"}
        </p>
      </div>

      {/* Payment Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${SHIPPING_COST.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {!paymentSuccess && clientSecret && (
        <>
          {/* Stripe Payment Element */}
          <div className="mb-6 p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-gray-500" size={16} />
              <span className="text-sm text-gray-500">Secure Payment</span>
            </div>

            <PaymentElement
              options={{
                layout: "tabs",
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-500" size={16} />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}
        </>
      )}

      {!paymentSuccess && (
        <div className="flex justify-between items-center pt-4 border-t">
          <button
            onClick={handleGoBack}
            disabled={isProcessingPayment}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            ← Back to Order Review
          </button>

          <button
            onClick={handlePayment}
            disabled={!clientSecret || isProcessingPayment}
            className={`px-6 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${
              isProcessingPayment || !clientSecret
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock size={16} />
                Pay ${totalAmount.toFixed(2)}
              </>
            )}
          </button>
        </div>
      )}

      {!paymentSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Secure Payment:</strong> Your payment is processed securely
            through Stripe. Your card information is never stored on our
            servers.
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock size={12} />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
};

export default PaymentProcessing;
