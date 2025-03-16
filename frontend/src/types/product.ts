import type { Categories } from "./category";

export interface Product {
  id: string | number;
  name: string;
  price: number;
  isAvailable: boolean;
  images: string[];
  description: string;
  categories: Categories;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductGridProps {
  products: Product[];
  title: string;
  seeMoreLink: string;
  maxDisplay?: number;
}

export interface ProductPageProps {
  product: Product;
  relatedProducts: Product[];
}
