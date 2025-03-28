import React from "react";
import { useParams } from "react-router-dom";
import { IProductAdmin } from "@/types/product";
import { IShipping } from "@/types/shipping";
import OrderProductsList from "@/components/admin/order-products";
import UserInfoCard from "@/components/common/user-card";
import ShippingInfoCard from "@/components/common/shipping-card";
import OrderTracking from "@/components/admin/add-tracking-button";
import { Loader2 } from "lucide-react";
import { useFetchOrderById } from "@/hooks/use-order";
import { IOrder } from "@/types/order";

const OrderDetailsPage: React.FC = () => {
  // Extract id from URL params
  const { orderId } = useParams<{ orderId: string }>();

  // Use hook to fetch order details
  const { data: order, isLoading, error } = useFetchOrderById(orderId || "");

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error loading order details. Please try again.
      </div>
    );
  }
  //Here comes a bunch of type checking so that typescript doesn't complain
  // Ensure type safety for user
  const user = typeof order.user === "string" ? null : order.user;

  // Explicitly type the input parameter and use a type guard
  const safeProducts = order.products
    .map((product: IOrder["products"][number]) => {
      // if product.id is a string, we can't use it, so we'll filter it out
      if (typeof product.id === "string") {
        return null;
      }
      return {
        id: product.id as IProductAdmin,
        quantity: product.quantity,
      };
    })
    .filter(
      (
        product: { id: IProductAdmin | string; quantity: number } | null
      ): product is { id: IProductAdmin; quantity: number } => product !== null
    );

  // Type assertion for shipping
  const shipping =
    typeof order.shipping === "string" ? null : (order.shipping as IShipping);

  // Type assertion for tracking
  const tracking =
    typeof order.tracking === "string" ? undefined : order.tracking;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex space-x-6">
        {/* Products List */}
        <div className="w-2/3">
          <OrderProductsList
            products={safeProducts}
            paidAmount={order.paid_amount}
          />
        </div>

        {/* User Card*/}
        <div className="w-1/3">{user && <UserInfoCard user={user} />}</div>
      </div>

      {/* Shipping Information */}
      {shipping && <ShippingInfoCard shipping={shipping} />}

      {/* Tracking Information */}
      <OrderTracking
        tracking={tracking}
        onAddTracking={(trackingInfo) => {
          // TODO: add the api call for the tracking info
          console.log("Add Tracking:", trackingInfo);
        }}
      />
    </div>
  );
};

export default OrderDetailsPage;
