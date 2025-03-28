import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { IProductAdmin, IUpdateProductPayload } from "@/types/product";
import {
  useFetchAdminProductById,
  useUpdateProduct,
} from "@/hooks/use-product";

const AdminProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const {
    data: product,
    isLoading,
    error,
  } = useFetchAdminProductById(productId || "");
  const updateProductMutation = useUpdateProduct();

  // Form state
  const [formData, setFormData] = useState<IUpdateProductPayload>({});

  // Handle input changes
  const handleInputChange = (
    field: keyof IUpdateProductPayload,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle total cost changes
  const handleTotalCostChange = (field: "cost" | "shipping", value: number) => {
    setFormData((prev) => ({
      ...prev,
      total_cost: {
        ...prev.total_cost,
        [field]: value,
      },
    }));
  };

  // Handle discount changes
  const handleDiscountChange = (
    field: "amount" | "status",
    value: number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      discount: {
        ...prev.discount,
        [field]: value,
      },
    }));
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId) {
      updateProductMutation.mutate({
        id: productId,
        data: formData,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>No product found</div>;

  const adminProduct = product as IProductAdmin;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Product Details:{adminProduct.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="grid gap-4 py-4">
                  {/* Name */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={adminProduct.name}
                      className="col-span-3"
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </div>

                  {/* Price */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priceTag" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="priceTag"
                      type="number"
                      defaultValue={adminProduct.priceTag}
                      className="col-span-3"
                      onChange={(e) =>
                        handleInputChange(
                          "priceTag",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>

                  {/* SKU */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      defaultValue={adminProduct.sku}
                      className="col-span-3"
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                    />
                  </div>

                  {/* Availability */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isAvailable" className="text-right">
                      Available
                    </Label>
                    <Switch
                      id="isAvailable"
                      checked={formData.isAvailable ?? adminProduct.isAvailable}
                      onCheckedChange={(checked) =>
                        handleInputChange("isAvailable", checked)
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="grid gap-4 py-4">
                  {/* Total Cost */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Product Cost</Label>
                    <Input
                      type="number"
                      defaultValue={adminProduct.total_cost.cost}
                      className="col-span-1"
                      onChange={(e) =>
                        handleTotalCostChange(
                          "cost",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                    <Label className="text-right">Shipping Cost</Label>
                    <Input
                      type="number"
                      defaultValue={adminProduct.total_cost.shipping}
                      className="col-span-1"
                      onChange={(e) =>
                        handleTotalCostChange(
                          "shipping",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>

                  {/* Discount */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="discountStatus" className="text-right">
                      Discount
                    </Label>
                    <Switch
                      id="discountStatus"
                      checked={
                        formData.discount?.status ??
                        adminProduct.discount.status
                      }
                      onCheckedChange={(checked) =>
                        handleDiscountChange("status", checked)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Discount Amount"
                      defaultValue={adminProduct.discount.amount}
                      className="col-span-2"
                      onChange={(e) =>
                        handleDiscountChange(
                          "amount",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      defaultValue={adminProduct.description}
                      className="col-span-3 border rounded p-2"
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </div>

                  {/* Categories */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Categories</Label>
                    <Select
                      defaultValue={product.categories[0]?._id}
                      onValueChange={(value) =>
                        handleInputChange("categories", [value])
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-4" />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={Object.keys(formData).length === 0}
              >
                Update Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductDetail;
