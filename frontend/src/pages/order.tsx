import React from "react";
import { IOrderDetails } from "@/types/order";
import OrderProductsList from "@/components/admin/order-products";
import UserInfoCard from "@/components/common/user-card";
import ShippingInfoCard from "@/components/common/shipping-card";
import OrderTracking from "@/components/admin/add-tracking-button";
import { IProductAdmin } from "@/types/product";
import { IShipping } from "@/types/shipping";

//TODO: Need to add this to the router and handle api calls

const OrderDetailsPage: React.FC<IOrderDetails> = ({ order }) => {
  //Here comes a bunch of type checking because typescript was being difficult
  // Ensure type safety for user
  const user = typeof order.user === "string" ? null : order.user;

  // Type guard and type assertion for products
  const safeProducts = order.products
    .map((product) => {
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
      (product): product is { id: IProductAdmin; quantity: number } =>
        product !== null
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

        {/* User Card (1/3 width) */}
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
