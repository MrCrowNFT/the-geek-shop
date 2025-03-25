import { IOrder } from "./order";

export interface ITracking {
  _id: string;
  order: string | IOrder;
  carrier: string;
  trackingNumber: number;
  estimatedDelivery?: Date;
}

export interface ITrackingInfoProps {
  tracking?: ITracking;
  onAddTracking?: (trackingInfo: Omit<ITracking, "_id" | "order">) => void;
}
