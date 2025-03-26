import { IProductUser, IProductAdmin } from "@/types/product";
import ImageA from "@/assets/ImageA.png";
import ImageB from "@/assets/ImageB.png";
import ImageC from "@/assets/ImageC.png";
import ImageD from "@/assets/ImageD.png";
import type {  ICategory } from "@/types/category";

const mockCategories: ICategory[]= [
    {
      _id: "cat1",
      name: "Figurine",
      description: "Gadgets and devices",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "cat2",
      name: "JJK",
      description: "Apparel and accessories",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]


export const mockProducts: IProductUser[] = [
  {
    _id: "1",
    name: "Product 1",
    priceTag: 19.99,
    description: "Description 1",
    images: [ImageA, ImageB],
    discount: { amount: 5, status: true },
    sku: "SKU001",
    isAvailable: true,
    categories: mockCategories,
    likesCount: 10,
    salesCount: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    name: "Product 2",
    priceTag: 29.99,
    description: "Description 2",
    images: [ImageB, ImageA],
    discount: { amount: 0, status: false },
    sku: "SKU002",
    isAvailable: false,
    categories: mockCategories,
    likesCount: 20,
    salesCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    name: "Product 3",
    priceTag: 39.99,
    description: "Description 3",
    images: [ImageC, ImageB],
    discount: { amount: 10, status: true },
    sku: "SKU003",
    isAvailable: true,
    categories: mockCategories,
    likesCount: 30,
    salesCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "4",
    name: "Product 4",
    priceTag: 49.99,
    description: "Description 4",
    images: [ImageD, ImageC],
    discount: { amount: 5, status: true },
    sku: "SKU004",
    isAvailable: false,
    categories: mockCategories,
    likesCount: 40,
    salesCount: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "5",
    name: "Product 5",
    priceTag: 59.99,
    description: "Description 5",
    images: [ImageA, ImageD],
    discount: { amount: 0, status: false },
    sku: "SKU005",
    isAvailable: true,
    categories: mockCategories,
    likesCount: 25,
    salesCount: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "6",
    name: "Product 6",
    priceTag: 69.99,
    description: "Description 6",
    images: [ImageA, ImageB],
    discount: { amount: 8, status: true },
    sku: "SKU006",
    isAvailable: true,
    categories: mockCategories,
    likesCount: 15,
    salesCount: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "7",
    name: "Product 7",
    priceTag: 79.99,
    description: "Description 7",
    images: [ImageB, ImageA],
    discount: { amount: 12, status: true },
    sku: "SKU007",
    isAvailable: false,
    categories: mockCategories,
    likesCount: 35,
    salesCount: 22,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "8",
    name: "Product 8",
    priceTag: 89.99,
    description: "Description 8",
    images: [ImageC, ImageB],
    discount: { amount: 15, status: true },
    sku: "SKU008",
    isAvailable: true,
    categories: mockCategories,
    likesCount: 45,
    salesCount: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "9",
    name: "Product 9",
    priceTag: 99.99,
    description: "Description 9",
    images: [ImageA, ImageD],
    discount: { amount: 20, status: true },
    sku: "SKU009",
    isAvailable: true,
    categories: mockCategories,
    likesCount: 50,
    salesCount: 35,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

//this is just an example, the total cost is set on the database, from which, the price tag
// is evaluated but not set, basically it sets a minimun that it can be, but it can got bigger,
export const mockProductsAdmin: IProductAdmin[] = mockProducts.map(
  (product) => ({
    ...product,
    total_cost: product.priceTag * 0.6, // Example calculation: assuming 60% of priceTag is cost
  })
);

export const mockProduct: IProductUser = {
  _id: "1",
  name: "Premium Handcrafted Product",
  priceTag: 19.99,
  description:
    "pariatur ea consequat deserunt occaecat Lorem irure Lorem tempor - dolor elit velit dolor proident ipsum est anim velit voluptate aliqua exercitation - laboris quis elit magna ea amet excepteur amet minim cupidatat irure commodo nulla",
  images: [ImageA, ImageB, ImageC, ImageD],
  discount: { amount: 10, status: true },
  sku: "SKU_PREMIUM",
  isAvailable: true,
  categories: mockCategories,
  likesCount: 50,
  salesCount: 25,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProductAdmin: IProductAdmin = {
  ...mockProduct,
  total_cost: mockProduct.priceTag * 0.6, // Example calculation
};
