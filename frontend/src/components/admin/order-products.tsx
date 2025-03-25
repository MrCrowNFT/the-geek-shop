import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IOrderProductsListProps, IProductAdmin } from "@/types/product";

const OrderProductsList: React.FC<IOrderProductsListProps> = ({
  products,
  paidAmount,
}) => {
  // Helper function to get first image or fallback
  const getFirstImage = (product: IProductAdmin) => {
    return product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder-image.png";
  };

  // Calculate total earnings
  const calculateEarnings = (product: IProductAdmin, quantity: number) => {
    const sellingPrice = product.priceTag;
    const costPrice = product.total_cost;
    const earnings = (sellingPrice - costPrice) * quantity;
    return earnings;
  };

  // Calculate total order earnings
  const totalEarnings = products.reduce((total, item) => {
    if (typeof item.id !== "string") {
      return total + calculateEarnings(item.id, item.quantity);
    }
    return total;
  }, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((item, index) => {
          // Ensure the product is not a string ID
          if (typeof item.id === "string") return null;

          const product = item.id;
          const paidForProduct = product.priceTag * item.quantity;
          const earnings = calculateEarnings(product, item.quantity);

          return (
            <div
              key={index}
              className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
            >
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={getFirstImage(product)}
                  alt={product.name}
                  className="object-cover"
                />
                <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </div>
              </div>
              <div className="text-right">
                <div>
                  <span className="font-medium">Price:</span> $
                  {product.priceTag.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Paid:</span> $
                  {paidForProduct.toFixed(2)}
                </div>
                <div className="text-green-600">
                  <span className="font-medium">Earnings:</span> $
                  {earnings.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <span className="font-bold">Total Paid:</span>
        <div>
          <span className="font-bold mr-4">${paidAmount.toFixed(2)}</span>
          <span className="text-green-600 font-bold">
            Earnings: ${totalEarnings.toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderProductsList;
