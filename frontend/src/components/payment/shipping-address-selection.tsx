import { useOrderStore } from "@/hooks/use-new-order";

const ShippingAddressSelection = () => {
  const { selectedShippingId, setShippingAddress, setCheckoutStep } =
    useOrderStore();

  //todo need to import the shipping addresses into from the user state, as well as the add shipping method

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Select Shipping Address</h2>
      <div className="space-y-4 mb-6"></div>
      <div className="flex justify-between">
        <button
          onClick={() => setCheckoutStep(1)}
          className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCheckoutStep(3)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={!selectedShippingId}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default ShippingAddressSelection;
