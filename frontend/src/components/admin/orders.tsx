import React, { useState } from "react";
import { IOrder } from "@/types/order";
import SalesTable from "./sales-table";
import OrderSearchFilter from "./order-search-filter";
import { Loader2 } from "lucide-react";
import { useFetchAllOrders } from "@/hooks/use-order";

const OrderManagement: React.FC = () => {
  // fetch all orders hook
  const { data: ordersData, isLoading, error } = useFetchAllOrders();
  const allOrders = ordersData?.orders ;

  // State to hold filtered orders
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>(allOrders);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error loading orders. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <OrderSearchFilter
        orders={allOrders}
        onFilteredOrdersChange={setFilteredOrders}
      />
      <SalesTable ordersData={filteredOrders} />
    </div>
  );
};

export default OrderManagement;
