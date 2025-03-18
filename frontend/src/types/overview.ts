import { JSX} from "react";
import { IOrder } from "./order";

export interface IndicatorProps {
  parameter: string;
  amount: number;
  icon: JSX.Element;
};


export interface OverviewProps {
  orders: IOrder[];
}

