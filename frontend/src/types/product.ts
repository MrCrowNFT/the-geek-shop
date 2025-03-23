import type { ICategory } from "./category";

//the one for the user shall not include businnes parameters
//those should only be accesible to the admin
export interface IProductUser {
  _id: string;
  name: string;
  priceTag: number;
  discount: {
    amout: number;
    status: boolean;
  };
  sku: string;
  isAvailable: boolean;
  images: string[];
  description: string;
  categories: ICategory[];
  likesCount: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

//this one is for the admin on the dashboard
export interface IProductAdmin extends IProductUser {
  total_cost: number;
}

export interface ProductCardProps {
  product: IProductUser;
}

export interface ProductGridProps {
  products: IProductUser[];
  title: string;
  seeMoreLink: string;
  maxDisplay?: number;
}

export interface ProductPageProps {
  product: IProductUser;
  relatedProducts: IProductUser[];
}
