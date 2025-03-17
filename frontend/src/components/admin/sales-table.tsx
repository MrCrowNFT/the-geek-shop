import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Truck, Package, XCircle } from "lucide-react";
import { IOrder } from "@/types/order";
import { IUser } from "@/types/user";

interface SalesTableProps {
  ordersData: IOrder[];
}

const SalesTable: React.FC<SalesTableProps> = ({ ordersData }) => {
  const formatDate = (dateString: Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (username: string): string => {
    return username.slice(0, 2).toUpperCase();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:px-6 pb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersData.map((order: IOrder) => {
                // handle user which might be a string or IUser, so that ts does not complain
                const userObj =
                  typeof order.user === "string"
                    ? { username: "User", profile_pic: "" }
                    : (order.user as IUser);

                return (
                  <TableRow key={order._id}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={userObj.profile_pic}
                          alt={userObj.username}
                        />
                        <AvatarFallback>
                          {getInitials(userObj.username)}
                        </AvatarFallback>
                      </Avatar>
                      {userObj.username}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order._id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                          order.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "OnRoute"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Delivered"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800" // Fallback styling
                        }`}
                      >
                        {order.status === "Paid" && (
                          <CheckCircle size={12} className="stroke-green-800" />
                        )}
                        {order.status === "Pending" && (
                          <Clock size={12} className="stroke-yellow-800" />
                        )}
                        {order.status === "OnRoute" && (
                          <Truck size={12} className="stroke-blue-800" />
                        )}
                        {order.status === "Delivered" && (
                          <Package size={12} className="stroke-purple-800" />
                        )}
                        {order.status === "Cancelled" && (
                          <XCircle size={12} className="stroke-red-800" />
                        )}
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.paid_amount)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesTable;
