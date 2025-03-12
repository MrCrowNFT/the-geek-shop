export interface Product {
  id: string | number;
  name: string;
  price: number;
  description: string;
  images: string[];
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
