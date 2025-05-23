export interface IShipping {
  _id: string;
  user: string; //not sure if i need the whole user and order object from here
  orders: string[]; //leaving it as string for now
  name: string;
  phone: string;
  run: string;
  address: string;
  region: string;
  indications?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateShippingPayload {
  name: string;
  phone: string;
  run: string;
  address: string;
  region: string;
  indications?: string;
}

export interface IShippingAddresses {
  addresses: IShipping[];
}

export interface IShippingInfoCardProps {
  shipping: IShipping;
}
