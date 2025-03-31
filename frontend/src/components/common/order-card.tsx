import { IOrder } from "@/types/order";

interface OrderCardProps {
  order: IOrder;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  // Destructure the necessary properties from the order
  const { products, paid_amount, status } = order;

  // Get the first product from the products array
  const firstProduct = products[0];

  // Get the product information - handle both string IDs and product objects
  const productName =
    typeof firstProduct.id === "string"
      ? "Product information loading..."
      : firstProduct.id.name;

  // Get the image URL - handle both string IDs and product objects
  const imageUrl =
    typeof firstProduct.id === "string"
      ? "/api/placeholder/80/80"
      : "images" in firstProduct.id &&
        firstProduct.id.images &&
        firstProduct.id.images.length > 0
      ? firstProduct.id.images[0]
      : "/api/placeholder/80/80";

  // Status color mapping
  const statusColorMap: Record<IOrder["status"], string> = {
    Pending: "bg-yellow-500",
    Paid: "bg-green-500",
    OnRoute: "bg-blue-500",
    Delivered: "bg-purple-500",
    Cancelled: "bg-red-500",
  };

  return (
    <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white mb-2">
      {/* Product Image */}
      <div className="flex-shrink-0 mr-4">
        <img
          src={imageUrl}
          alt={productName}
          className="w-20 h-20 object-cover rounded-md"
        />
      </div>

      {/* Order Details */}
      <div className="flex-grow">
        <h3 className="font-medium text-gray-800 truncate">{productName}</h3>
        <p className="text-gray-600 text-sm">
          Total: ${paid_amount.toFixed(2)}
        </p>
      </div>

      {/* Order Status */}
      <div className="flex items-center">
        <div
          className={`w-3 h-3 rounded-full ${statusColorMap[status]} mr-2`}
        ></div>
        <span className="text-sm font-medium text-gray-700">{status}</span>
      </div>
    </div>
  );
};

export default OrderCard;
