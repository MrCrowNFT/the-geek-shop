import React, { useState } from "react";
import { useOrderStore } from "@/hooks/use-new-order";
import { useProfile } from "@/hooks/use-profile";
import { useCart } from "@/hooks/use-cart";
import { ICreateOrderPayload } from "@/types/order";
import { Package, MapPin, CreditCard, Loader2 } from "lucide-react";

const OrderCreationPending = () => {
  const { 
    currentOrder, 
    selectedShippingId, 
    setCheckoutStep, 
    setOrderStatus,
    setOrderId
  } = useOrderStore();
  
  const { createOrder, shipping: shippingAddresses, isLoading } = useProfile();
  const { items: cartItems } = useCart();
  
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Standard shipping price -> should be moved to env later
  const SHIPPING_COST = 5.00;

  // Get selected shipping address details
  const selectedShipping = shippingAddresses.find(
    addr => addr._id === selectedShippingId
  );

  // Calculate totals
  const subtotal = currentOrder?.paid_amount || 0;
  const totalWithShipping = subtotal + SHIPPING_COST;

  // Get product details from cart for display
  const getOrderItems = () => {
    if (!currentOrder?.products) return [];
    
    return currentOrder.products.map(orderProduct => {
      const cartItem = cartItems.find(item => item._id === orderProduct.id);
      return {
        ...orderProduct,
        productDetails: cartItem
      };
    });
  };

  const orderItems = getOrderItems();

  // Handle order creation
  const handleCreateOrder = async () => {
    if (!currentOrder || !selectedShippingId) {
      setError("Missing order or shipping information");
      return;
    }

    setIsCreatingOrder(true);
    setError(null);

    try {
      // Prepare order payload for API
      const orderPayload: ICreateOrderPayload = {
        products: currentOrder.products,
        shipping: selectedShippingId,
        paid_amount: totalWithShipping
      };

      const success = await createOrder(orderPayload);

      if (success) {
        // Update order status to pending in our state
        setOrderStatus("Pending");
        
        // Move to next step (payment processing)
        setCheckoutStep(4);
      } else {
        setError("Failed to create order. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while creating the order.");
      console.error("Order creation error:", err);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Handle going back
  const handleGoBack = () => {
    setCheckoutStep(2);
  };

  // Show loading if we don't have the required data
  if (!currentOrder || !selectedShipping) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <Loader2 className="animate-spin mx-auto mb-4" size={32} />
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Review & Create Order</h2>
      <p className="text-gray-600 mb-6">
        Please review your complete order details before proceeding to payment.
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Order Items Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="text-gray-600" size={20} />
          <h3 className="text-lg font-semibold">Order Items</h3>
        </div>
        
        <div className="space-y-3">
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {item.productDetails && (
                  <img
                    src={item.productDetails.images[0] || '/placeholder-image.jpg'}
                    alt={item.productDetails.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">
                    {item.productDetails?.name || 'Product'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
              {item.productDetails && (
                <div className="text-right">
                  <p className="font-medium">
                    ${((item.productDetails.discount.status 
                      ? item.productDetails.priceTag - (item.productDetails.priceTag * item.productDetails.discount.amount) / 100
                      : item.productDetails.priceTag) * item.quantity).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-gray-600" size={20} />
          <h3 className="text-lg font-semibold">Shipping Address</h3>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Name:</span> {selectedShipping.name}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {selectedShipping.phone}
            </div>
            <div>
              <span className="font-medium">RUN:</span> {selectedShipping.run}
            </div>
            <div>
              <span className="font-medium">Region:</span> {selectedShipping.region}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Address:</span> {selectedShipping.address}
            </div>
            {selectedShipping.indications && (
              <div className="md:col-span-2">
                <span className="font-medium">Instructions:</span> {selectedShipping.indications}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="text-gray-600" size={20} />
          <h3 className="text-lg font-semibold">Order Summary</h3>
        </div>
        
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${SHIPPING_COST.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${totalWithShipping.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          onClick={handleGoBack}
          disabled={isCreatingOrder}
          className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          ← Back to Shipping
        </button>

        <button
          onClick={handleCreateOrder}
          disabled={isCreatingOrder || isLoading}
          className={`px-6 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${
            isCreatingOrder || isLoading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isCreatingOrder ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Creating Order...
            </>
          ) : (
            "Create Order & Proceed to Payment"
          )}
        </button>
      </div>

      {/* Terms Notice */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          By clicking "Create Order & Proceed to Payment", you agree to create a pending order 
          that will be processed once payment is completed.
        </p>
      </div>
    </div>
  );
};

export default OrderCreationPending;