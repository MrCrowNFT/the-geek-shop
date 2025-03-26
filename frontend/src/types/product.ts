import type { ICategory } from "./category";

//the one for the user shall not include businnes parameters
//those should only be accesible to the admin
export interface IProductUser {
  _id: string;
  name: string;
  priceTag: number;
  discount: {
    amount: number;
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

//api calls interfaces

export interface IPaginatedResponse {
  success: boolean;
  data: IProductUser[];
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    productsPerPage: number;
  };
}

export interface ICreateProductPayload {
  name: string;
  priceTag: number;
  total_cost: {
    cost: number;
    shipping: number;
  };
  discount?: {
    amount: number;
    status: boolean;
  };
  sku?: string;
  isAvailable: boolean;
  images: string;
  description?: string;
  categories: ICategory[] | string[]; 
}

// Type for update product payload
export interface IUpdateProductPayload {
  name?: string;
  total_cost?: {
    cost?: number;
    shipping?: number;
  };
  discount?: {
    amount?: number;
    status?: boolean;
  };
  sku?: string;
  isAvailable?: boolean;
  images?: string;
  description?: string;
  category?: string[];
}

// Type for search params
export interface ISearchParams {
  categories?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface IOrderProductsListProps {
  products: Array<{
    id: string | IProductAdmin;
    quantity: number;
  }>;
  paidAmount: number;
}

