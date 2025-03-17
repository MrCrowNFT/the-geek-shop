import React, { useState } from "react";
import { IOrder } from "@/types/order";
import SalesTable from "./sales-table";
import OrderSearchFilter from "./order-search-filter";
import { mockOrders } from "@/mock/orders-mock";

interface OrderManagementProps {
  orders?: IOrder[];
}

const OrderManagement: React.FC<OrderManagementProps> = ({ orders }) => {
  // Trying to solve the input
  const allOrders = orders || mockOrders;

  // State to hold filtered orders
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>(allOrders);

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
