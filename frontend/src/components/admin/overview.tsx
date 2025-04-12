import { SalesChart } from "./bar-chart";
import Indicator from "./indicator";
import SalesTable from "./sales-table";
import { processData } from "@/helper/overview.helper";
import { useFetchAllOrders } from "@/hooks/use-order";
import { Loader2 } from "lucide-react";

const Overview = () => {
  const { data: ordersData, isLoading, error } = useFetchAllOrders();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // Error state
  if (error || !ordersData) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error loading overview data. Please try again.
      </div>
    );
  }

  // Process data safely
  const { indicatorsData, salesSummary } = processData(ordersData || []);

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
          <SalesTable ordersData={ordersData || []} limit={10} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
