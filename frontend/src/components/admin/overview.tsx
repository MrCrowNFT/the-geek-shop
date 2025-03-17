import { SalesChart } from "./bar-chart";
import Indicator from "./indicator";
import SalesTable from "./sales-table";

const Overview: React.FC = () => {
  return (
    <>
      <div>
        <Indicator />
        <Indicator />
        <Indicator />
      </div>
      <div>
        <SalesTable />
        <SalesChart />
      </div>
    </>
  );
};

export default Overview;
