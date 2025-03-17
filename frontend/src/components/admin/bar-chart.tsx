import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "January", amount: 186 },
  { date: "February", amount: 305 },
  { date: "March", amount: 237 },
  { date: "April", amount: 73 },
  { date: "May", amount: 209 },
  { date: "June", amount: 214 },
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export const SalesChart: React.FC = () => {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="date" fill="var(--color-amount)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
