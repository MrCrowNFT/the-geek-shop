import  { useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useOrderStore } from "@/hooks/use-new-order";
import ShippingInfoCard from "@/components/common/shipping-card";
import AddShippingAddress from "@/components/common/add-shipping-address";
import { Check } from "lucide-react";

const ShippingAddressSelection = () => {
  const { shipping: shippingAddresses } = useProfile();
  const { setShippingAddress, setCheckoutStep, selectedShippingId } =
    useOrderStore();
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(
    selectedShippingId
  );

  // Handle shipping address selection
  const handleSelectShipping = (shippingId: string) => {
    setLocalSelectedId(shippingId);
  };

  // Handle confirmation and proceed to next step
  const handleConfirmShipping = () => {
    if (localSelectedId) {
      // Update the order with selected shipping address
      setShippingAddress(localSelectedId);
      // Move to next step (payment processing)
      setCheckoutStep(3);
    }
  };

  // Handle going back to previous step
  const handleGoBack = () => {
    setCheckoutStep(1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Select Shipping Address</h2>
      <p className="text-gray-600 mb-6">
        Choose where you want your order to be delivered.
      </p>

      {/* Show message if no shipping addresses */}
      {shippingAddresses.length === 0 && (
        <div className="text-center py-8 mb-6">
          <p className="text-gray-500 mb-4">
            You don't have any shipping addresses yet.
          </p>
          <p className="text-sm text-gray-400">
            Please add a shipping address to continue with your order.
          </p>
        </div>
      )}

      {/* Shipping Addresses Grid */}
      {shippingAddresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {shippingAddresses.map((shipping) => (
            <div
              key={shipping._id}
              className={`relative cursor-pointer transition-all duration-200 ${
                localSelectedId === shipping._id
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handleSelectShipping(shipping._id)}
            >
              {/* Selection Indicator */}
              {localSelectedId === shipping._id && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                </div>
              )}

              {/* Shipping Card */}
              <div
                className={`h-full ${
                  localSelectedId === shipping._id
                    ? "opacity-100"
                    : "opacity-90"
                }`}
              >
                <ShippingInfoCard shipping={shipping} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Shipping Address */}
      <div className="mb-6">
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Add New Address</h3>
          <AddShippingAddress />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          onClick={handleGoBack}
          className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
        >
          ← Back to Order Review
        </button>

        <button
          onClick={handleConfirmShipping}
          disabled={!localSelectedId}
          className={`px-6 py-2 rounded font-semibold transition-colors ${
            localSelectedId
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Payment
        </button>
      </div>

      {/* Helper Text */}
      {shippingAddresses.length > 0 && !localSelectedId && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please select a shipping address to continue.
          </p>
        </div>
      )}

      {/* Selected Address Summary */}
      {localSelectedId && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Shipping address selected. Click "Continue to Payment" to proceed.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressSelection;
