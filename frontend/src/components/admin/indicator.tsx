import React from "react";

// Define the props interface
interface IndicatorProps {
  parameter: string;
  amount: number;
  icon: React.ReactNode;
}

const Indicator = ({ parameter, amount, icon }: IndicatorProps) => {
  return (
    <div className=" rounded-lg shadow p-3 flex justify-between items-start h-full">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium">{parameter}</span>
        <span className="text-xl font-bold mt-1">
          {amount.toLocaleString()}
        </span>
      </div>
      <div className="text-gray-400">{icon}</div>
    </div>
  );
};
export default Indicator;
