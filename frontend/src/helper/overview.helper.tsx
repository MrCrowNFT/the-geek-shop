import { IOrder } from "@/types/order";
import { IndicatorProps } from "@/types/overview";
import { CreditCard, DollarSign, UsersRound } from "lucide-react";

function analyzeOrders(orders: IOrder[]) {
  const sortedOrders = orders.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const totalOrders = sortedOrders.length;

  const totalRevenue = sortedOrders.reduce(
    (sum, order) => sum + order.paid_amount,
    0
  );

  const uniqueUsers = new Set(sortedOrders.map((order) => order.user)).size;

  return { sortedOrders, totalOrders, totalRevenue, uniqueUsers };
}

function indicatorsDataProcess(
  totalOrders: number,
  totalRevenue: number,
  uniqueUsers: number
) {
  const totalSales: IndicatorProps = {
    parameter: "Total Sales",
    amount: totalOrders,
    icon: <CreditCard />,
  };
  const totalAmount: IndicatorProps = {
    parameter: "Total Revenue",
    amount: totalRevenue,
    icon: <DollarSign />,
  };
  const Users: IndicatorProps = {
    parameter: "Users",
    amount: uniqueUsers,
    icon: <UsersRound />,
  };

  return { totalSales, totalAmount, Users };
}

function getSalesSummary(orders: IOrder[]) {
  const result: { date: string; sales: number; totalAmount: number }[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split("T")[0]; // Format YYYY-MM-DD

    const dailyOrders = orders.filter(
      (order) => order.createdAt.toISOString().split("T")[0] === dateString
    );

    const totalSales = dailyOrders.length;
    const totalAmount = dailyOrders.reduce(
      (sum, order) => sum + order.paid_amount,
      0
    );
    result.push({ date: dateString, sales: totalSales, totalAmount });
  }

  return result;
}

export function processData(orders: IOrder[]) {
  const { sortedOrders, totalOrders, totalRevenue, uniqueUsers } =
    analyzeOrders(orders);
  const indicatorsData = indicatorsDataProcess(
    totalOrders,
    totalRevenue,
    uniqueUsers
  );
  const salesSummary = getSalesSummary(sortedOrders);

  return { indicatorsData, salesSummary };
}
