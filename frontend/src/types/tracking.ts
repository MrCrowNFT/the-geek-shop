import { IOrder } from "./order";

export interface ITracking {
  tracking_number: number;
  order: string | IOrder;
}
