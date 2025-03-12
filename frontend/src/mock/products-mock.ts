import { Product } from "@/types/card";
import ImageA from "@/assets/ImageA.png";
import ImageB from "@/assets/ImageB.png";
import ImageC from "@/assets/ImageC.png";
import ImageD from "@/assets/ImageD.png";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 19.99,
    description: "Description 1",
    images: [ImageA, ImageB],
  },
  {
    id: 2,
    name: "Product 2",
    price: 29.99,
    description: "Description 2",
    images: [ImageB, ImageA],
  },
  {
    id: 3,
    name: "Product 3",
    price: 29.99,
    description: "Description 3",
    images: [ImageC, ImageB],
  },
  {
    id: 4,
    name: "Product 4",
    price: 49.99,
    description: "Description 4",
    images: [ImageD, ImageC],
  },
  {
    id: 5,
    name: "Product 5",
    price: 59.99,
    description: "Description 5",
    images: [ImageA, ImageD],
  },
  {
    id: 6,
    name: "Product 6",
    price: 69.99,
    description: "Description 6",
    images: [ImageA, ImageB],
  },
  {
    id: 7,
    name: "Product 7",
    price: 79.99,
    description: "Description 7",
    images: [ImageB, ImageA],
  },
  {
    id: 8,
    name: "Product 8",
    price: 89.99,
    description: "Description 8",
    images: [ImageC, ImageB],
  },
  {
    id: 9,
    name: "Product 9",
    price: 99.99,
    description: "Description 9",
    images: [ImageA, ImageD],
  },
  {
    id: 10,
    name: "Product 10",
    price: 109.99,
    description: "Description 10",
    images: [ImageB, ImageC],
  },
  {
    id: 11,
    name: "Product 11",
    price: 119.99,
    description: "Description 11",
    images: [ImageD, ImageA],
  },
  {
    id: 12,
    name: "Product 12",
    price: 129.99,
    description: "Description 12",
    images: [ImageC, ImageD],
  },
];
