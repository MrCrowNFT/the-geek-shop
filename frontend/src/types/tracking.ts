import { IOrder } from "./order";

export interface ITracking {
  order: string | IOrder;
  carrier: string;
  trackingNumber: number;
  estimatedDelivery?: Date;
}
