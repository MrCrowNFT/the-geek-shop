import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SalesSummaryData {
  date: string;
  sales: number;
  totalAmount: number;
}

// props for the SalesChart component
interface SalesChartProps {
  salesData: SalesSummaryData[];
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#2563eb",
  },
  totalAmount: {
    label: "Revenue",
    color: "#10b981",
  },
} satisfies ChartConfig;

export const SalesChart: React.FC<SalesChartProps> = ({ salesData }) => {
  // Reverse the data to show oldest to newest (left to right)
  const formattedData = [...salesData].reverse();

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={formattedData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })
          }
        />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="totalAmount"
          fill="var(--color-totalAmount)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};
