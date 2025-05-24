import { useOrderStore } from "@/hooks/use-new-order";

const PaymentProcessor = () => {
  const { setCheckoutStep, setPaymentIntentId, setOrderStatus } =
    useOrderStore();

  const handlePaymentComplete = () => {
    // Simulate payment completion
    setPaymentIntentId("pi_" + Math.random().toString(36).substr(2, 9));
    setOrderStatus("Paid");
    setCheckoutStep(4);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <p className="text-gray-600 mb-6">Please enter your payment details.</p>
      {/* Payment form would go here */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCheckoutStep(2)}
          className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePaymentComplete}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentProcessor;
