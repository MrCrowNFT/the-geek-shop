import { useOrderStore } from "@/hooks/use-new-order";

//todo neeed to get the get the order details from the shopping cart
const OrderConfirmation = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Confirm Your Order</h2>
    <p className="text-gray-600 mb-6">
      Please review your items before proceeding.
    </p>
    {/* Order details would go here */}
    <div className="mt-4 flex justify-end">
      <button
        onClick={() => useOrderStore.getState().setCheckoutStep(2)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Continue to Shipping
      </button>
    </div>
  </div>
);

export default OrderConfirmation;
