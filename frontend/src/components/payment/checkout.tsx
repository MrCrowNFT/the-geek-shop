import { useEffect } from "react";
import { useOrderStore } from "@/hooks/use-new-order";
import OrderConfirmation from "./order-confirmation";

// These components will be implemented later
//import OrderConfirmation from "./OrderConfirmation";
//import ShippingAddressSelection from "./ShippingAddressSelection";
//import PaymentProcessor from "./PaymentProcessor";
//import OrderComplete from "./OrderComplete";

// Stepper component for tracking checkout progress




const OrderComplete = () => {
  const { currentOrder, resetOrder } = useOrderStore();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Order Complete!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order ID is:{" "}
        {currentOrder?._id || "Processing"}
      </p>
      <button
        onClick={resetOrder}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Return to Shop
      </button>
    </div>
  );
};

// Stepper component for tracking checkout progress
const CheckoutStepper = ({ currentStep }) => {
  const steps = ["Confirm Order", "Shipping", "Payment", "Complete"];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index + 1 === currentStep
                  ? "bg-blue-600 text-white"
                  : index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1 < currentStep ? "✓" : index + 1}
            </div>
            <span
              className={`mt-2 text-sm ${
                index + 1 === currentStep
                  ? "font-medium text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 relative">
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
        <div
          className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

const CheckoutContainer = () => {
  // Use more store values and actions directly from the zustand store
  const {
    checkoutStep,
    currentOrder,
    resetOrder,
    calculateTotal,
    availableShippingAddresses,
    selectedShippingId,
  } = useOrderStore();

  // Reset order on unmount
  useEffect(() => {
    return () => {
      // Uncomment if you want to reset the order when the component unmounts
      // resetOrder();
    };
  }, [resetOrder]);

  // For debugging - you can remove this in production
  useEffect(() => {
    console.log("Current order state:", currentOrder);
    console.log("Current checkout step:", checkoutStep);
    console.log("Order total:", calculateTotal());
  }, [currentOrder, checkoutStep, calculateTotal]);

  // Render the appropriate step
  const renderCheckoutStep = () => {
    switch (checkoutStep) {
      case 1:
        return <OrderConfirmation />;
      case 2:
        return <ShippingAddressSelection />;
      case 3:
        return <PaymentProcessor />;
      case 4:
        return <OrderComplete />;
      default:
        return <OrderConfirmation />;
    }
  };

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-xl text-gray-600">
          No active order. Please add items to your cart first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="font-bold text-lg mb-2">Order Summary</h2>
        <div className="flex justify-between">
          <span>Total:</span>
          <span className="font-bold">${calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      <CheckoutStepper currentStep={checkoutStep} />

      {renderCheckoutStep()}
    </div>
  );
};

export default CheckoutContainer;
