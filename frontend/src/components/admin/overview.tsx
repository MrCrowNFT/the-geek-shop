import { SalesChart } from "./bar-chart";
import Indicator from "./indicator";
import SalesTable from "./sales-table";
import { mockOrders } from "@/mock/orders-mock";
import { processData } from "@/helper/overview.helper";
import { OverviewProps } from "@/types/overview";

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
        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Sales Overview</h2>
          <SalesChart salesData={salesSummary} />
        </div>

        {/*Table */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
          {/*only the top 10 orders*/}
          <SalesTable ordersData={mockOrders} limit={10} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
