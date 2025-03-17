import { SalesChart } from "./bar-chart";
import Indicator from "./indicator";
import SalesTable from "./sales-table";
import { mockOrders } from "@/mock/orders-mock";
import { IndicatorProps } from "@/types/overview";
import { IOrder } from "@/types/order";
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

    const totalSales = dailyOrders.length ;
    const totalAmount =
      dailyOrders.reduce((sum, order) => sum + order.paid_amount, 0) ; 
    result.push({ date: dateString, sales: totalSales, totalAmount });
  }

  return result;
}

function processData(orders: IOrder[]) {
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

interface OverviewProps {
  orders: IOrder[];
}

const Overview = (orders: OverviewProps) => {
  const { indicatorsData, salesSummary } = processData(orders.orders);

  return (
    <div className="flex flex-col gap-6">
      {/* Indicators Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Indicator {...indicatorsData.totalSales} />
        <Indicator {...indicatorsData.Users} />
        <Indicator {...indicatorsData.totalAmount} />
      </div>

      {/* Chart and Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Sales Overview</h2>
          <SalesChart salesData={salesSummary} />
        </div>

        {/* Right column: Table */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
          <SalesTable ordersData={mockOrders} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
