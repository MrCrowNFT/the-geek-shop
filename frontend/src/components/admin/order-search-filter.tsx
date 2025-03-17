import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FilterX } from "lucide-react";
import { IOrder } from "@/types/order";
import { IUser } from "@/types/user";

interface OrderSearchFilterProps {
  orders: IOrder[];
  onFilteredOrdersChange: (filteredOrders: IOrder[]) => void;
}

const OrderSearchFilter: React.FC<OrderSearchFilterProps> = ({
  orders,
  onFilteredOrdersChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Changed from empty string to "all"
  const [sortBy, setSortBy] = useState<string>("newest");

  // All possible statuses for dropdown
  const allStatuses = ["Paid", "Pending", "OnRoute", "Delivered", "Cancelled"];

  useEffect(() => {
    // Apply filters and sorting whenever dependencies change
    const filtered = applyFilters(orders, searchTerm, statusFilter, sortBy);
    onFilteredOrdersChange(filtered);
  }, [orders, searchTerm, statusFilter, sortBy, onFilteredOrdersChange]);

  // Helper function to safely extract username from order
  const extractUsername = (orderUser: string | IUser): string => {
    if (typeof orderUser === "string") {
      return orderUser.toLowerCase();
    } else {
      return orderUser.username.toLowerCase();
    }
  };

  const applyFilters = (
    orderList: IOrder[],
    search: string,
    status: string,
    sort: string
  ): IOrder[] => {
    // First apply search filter
    let result = orderList.filter((order) => {
      const searchLower = search.toLowerCase();
      const orderId = order._id.toLowerCase();

      //  extract username using the helper function
      const username = extractUsername(order.user);

      return (
        orderId.includes(searchLower) ||
        username.includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower)
      );
    });

    // apply status filter if selected (not "all")
    if (status !== "all") {
      result = result.filter((order) => order.status === status);
    }

    // apply sorting
    if (sort === "newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sort === "oldest") {
      result = [...result].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sort === "highest") {
      result = [...result].sort((a, b) => b.paid_amount - a.paid_amount);
    } else if (sort === "lowest") {
      result = [...result].sort((a, b) => a.paid_amount - b.paid_amount);
    }

    return result;
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all"); //has to be all otherwise error
    setSortBy("newest");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search input */}
        <div className="md:col-span-6 lg:col-span-5">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search order"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Status filter */}
        <div className="md:col-span-3 lg:col-span-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {allStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort options */}
        <div className="md:col-span-3 lg:col-span-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset button */}
        <div className="md:col-span-12 lg:col-span-2 flex justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-1"
          >
            <FilterX size={16} />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSearchFilter;
