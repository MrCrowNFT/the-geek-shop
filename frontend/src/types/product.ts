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
  total_cost: {
    cost: number;
    shipping: number;
  };
}

export interface ProductCardProps {
  product: IProductUser;
}

export interface IProductGridProps {
  products: IProductUser[];
  title: string;
  seeMoreLink: string;
  maxDisplay?: number;
  isLoading?: boolean;
  error?: unknown;
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
  images: File[]; 
  description?: string;
  category: string[]; 
}

//todo need to update this as well for aws s3 
// Type for update product payload, the same as above but all optional
export interface IUpdateProductPayload {
  name?: string;
  priceTag?: number;
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
  categories?: string[];
}

// Type for search params
export interface ISearchParams {
  categories?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?:
    | "newest"
    | "oldest"
    | "likes"
    | "no-likes"
    | "popular"
    | "unpopular"
    | "bestselling";
}

export interface IOrderProductsListProps {
  products: Array<{
    id: string | IProductAdmin;
    quantity: number;
  }>;
  paidAmount: number;
}
