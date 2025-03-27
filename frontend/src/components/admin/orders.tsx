import React, { useEffect, useState } from "react";
import { IOrder } from "@/types/order";
import SalesTable from "./sales-table";
import OrderSearchFilter from "./order-search-filter";
import { Loader2 } from "lucide-react";
import { useFetchAllOrders } from "@/hooks/use-order";

const OrderManagement: React.FC = () => {
  // fetch all orders hook
  const { data: ordersData, isLoading, error } = useFetchAllOrders();

  // State to hold filtered orders
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

  // need this to handle undefined
  useEffect(() => {
    // only set filteredOrders if ordersData exists and is not empty
    if (ordersData && ordersData.length > 0) {
      setFilteredOrders(ordersData);
    } else {
      // ensure filteredOrders is always an array, even if no data
      setFilteredOrders([]);
    }
  }, [ordersData]);

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
        orders={filteredOrders}
        onFilteredOrdersChange={setFilteredOrders}
      />
      <SalesTable ordersData={filteredOrders} />
    </div>
  );
};

export default OrderManagement;
