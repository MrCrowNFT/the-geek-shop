import { useState, useEffect } from "react";
import { useOrderStore } from "@/hooks/use-new-order";
import { useProfile } from "@/hooks/use-profile";
import { useCart } from "@/hooks/use-cart";
import { CheckCircle, XCircle, Loader2, Home, ShoppingCart } from "lucide-react";

const OrderComplete = () => {
  const { currentOrder, resetOrder } = useOrderStore();
  const { updateOrderToPaid } = useProfile();
  const { clearCart } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOrderPayment = async () => {
      // Check if we have an order ID
      if (!currentOrder?._id) {
        setError("Order ID not found. Please try again.");
        setIsProcessing(false);
        resetOrder(); // Clear order state on error
        return;
      }

      try {
        // Call API to update order to paid
        const success = await updateOrderToPaid(currentOrder._id);
        
        if (success) {
          // Payment successful
          setPaymentSuccess(true);
          // Clear both cart and order state
          clearCart();
          resetOrder();
        } else {
          // Payment failed
          setError("Failed to process payment. Please contact support.");
          // Clear only order state, keep cart
          resetOrder();
        }
      } catch (err) {
        // Handle unexpected errors
        setError(
          err instanceof Error 
            ? err.message 
            : "An unexpected error occurred. Please contact support."
        );
        // Clear only order state, keep cart
        resetOrder();
      } finally {
        setIsProcessing(false);
      }
    };

    processOrderPayment();
  }, [currentOrder?._id, updateOrderToPaid, clearCart, resetOrder]);

  // Loading state
  if (isProcessing) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Processing Your Order</h2>
        <p className="text-gray-600 mb-4">
          Please wait while we confirm your payment and finalize your order...
        </p>
        <div className="text-sm text-gray-500">
          Order ID: {currentOrder?._id || "Generating..."}
        </div>
      </div>
    );
  }

  // Success state
  if (paymentSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Order Complete!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase! Your payment has been processed successfully.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>Order ID:</strong> {currentOrder?._id}
          </p>
          <p className="text-sm text-green-700 mt-1">
            You will receive an email confirmation shortly with your order details.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
          >
            <Home size={16} />
            Return to Home
          </a>
          <a
            href="/orders"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors flex items-center gap-2 justify-center"
          >
            View My Orders
          </a>
        </div>
      </div>
    );
  }

  // Error/Failure state
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Processing Failed</h2>
      <p className="text-gray-600 mb-4">
        We encountered an issue while processing your payment.
      </p>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-800 mb-2">
          <strong>Error:</strong> {error}
        </p>
        <p className="text-sm text-red-700">
          Your items are still in your cart. Please try again or contact our support team.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/cart"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
        >
          <ShoppingCart size={16} />
          Return to Cart
        </a>
        <a
          href="/"
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors flex items-center gap-2 justify-center"
        >
          <Home size={16} />
          Return to Home
        </a>
        <a
          href="/support"
          className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition-colors flex items-center gap-2 justify-center"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default OrderComplete;