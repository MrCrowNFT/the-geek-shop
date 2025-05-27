import { useCart } from "@/hooks/use-cart";
import { useOrderStore } from "@/hooks/use-new-order";
import { IProductUser } from "@/types/product";

const OrderConfirmation = () => {
  const { items: cartItems } = useCart();
  const { initializeOrder, setCheckoutStep } = useOrderStore();

  // Calculate individual product price (considering discount)
  const getProductPrice = (product: IProductUser) => {
    if (product.discount.status) {
      return (
        product.priceTag - (product.priceTag * product.discount.amount) / 100
      );
    }
    return product.priceTag;
  };

  // Calculate total for all items
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = getProductPrice(item);
      return total + price * item.quantity;
    }, 0);
  };

  // Handle order confirmation
  const handleConfirmOrder = () => {
    // Transform cart items to order items format
    const orderItems = cartItems.map((item) => ({
      quantity: item.quantity,
      product: item,
    }));

    // Initialize the order in the order store
    initializeOrder(orderItems);

    // Move to next step
    setCheckoutStep(2);
  };

  // Show message if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600">
          Add some items to your cart to proceed with checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Confirm Your Order</h2>
      <p className="text-gray-600 mb-6">
        Please review your items before proceeding.
      </p>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => {
          const itemPrice = getProductPrice(item);
          const itemTotal = itemPrice * item.quantity;

          return (
            <div
              key={item._id}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.images[0] || "/placeholder-image.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <div className="text-sm text-gray-600">
                  <p>SKU: {item.sku}</p>
                  {item.discount.status && (
                    <p className="text-green-600">
                      {item.discount.amount}% discount applied
                    </p>
                  )}
                </div>
              </div>

              {/* Price and Quantity */}
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  {item.discount.status && (
                    <span className="text-sm text-gray-500 line-through">
                      ${item.priceTag.toFixed(2)}
                    </span>
                  )}
                  <span className="font-medium">${itemPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="font-bold text-lg">${itemTotal.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg">Subtotal ({cartItems.length} items):</span>
          <span className="text-lg font-bold">
            ${calculateTotal().toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Shipping costs will be calculated in the next step
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Cart
        </button>

        <button
          onClick={handleConfirmOrder}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
        >
          Continue to Shipping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
