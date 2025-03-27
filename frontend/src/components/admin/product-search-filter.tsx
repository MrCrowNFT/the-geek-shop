import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IProductAdmin } from "@/types/product";

interface ProductFilterProps {
  products: IProductAdmin[];
  onFilteredProducts: (filteredProducts: IProductAdmin[]) => void;
}

type SortOption = "newest" | "oldest" | "price-low" | "price-high";
type AvailabilityFilter = "all" | "in-stock" | "out-of-stock";

const ProductFilter: React.FC<ProductFilterProps> = ({
  products,
  onFilteredProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");
  const [hasDiscount, setHasDiscount] = useState(false);

  useEffect(() => {
    let filteredProducts = products;

    // Search filter
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.priceTag >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.priceTag <= parseFloat(maxPrice)
      );
    }

    // Availability filter
    if (availabilityFilter === "in-stock") {
      filteredProducts = filteredProducts.filter(
        (product) => product.isAvailable
      );
    } else if (availabilityFilter === "out-of-stock") {
      filteredProducts = filteredProducts.filter(
        (product) => !product.isAvailable
      );
    }

    // Discount filter
    if (hasDiscount) {
      filteredProducts = filteredProducts.filter(
        (product) => product.discount && product.discount.status
      );
    }

    // Sorting
    switch (sortOption) {
      case "newest":
        filteredProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filteredProducts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "price-low":
        filteredProducts.sort((a, b) => a.priceTag - b.priceTag);
        break;
      case "price-high":
        filteredProducts.sort((a, b) => b.priceTag - a.priceTag);
        break;
    }

    onFilteredProducts(filteredProducts);
  }, [
    searchTerm,
    minPrice,
    maxPrice,
    sortOption,
    availabilityFilter,
    hasDiscount,
    products,
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Price Range Inputs */}
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-24"
        />
        <Input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-24"
        />
      </div>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setSortOption("newest")}
            className={sortOption === "newest" ? "bg-gray-100" : ""}
          >
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortOption("oldest")}
            className={sortOption === "oldest" ? "bg-gray-100" : ""}
          >
            Oldest First
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortOption("price-low")}
            className={sortOption === "price-low" ? "bg-gray-100" : ""}
          >
            Price: Low to High
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortOption("price-high")}
            className={sortOption === "price-high" ? "bg-gray-100" : ""}
          >
            Price: High to Low
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Availability Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Availability
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Availability</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setAvailabilityFilter("all")}
            className={availabilityFilter === "all" ? "bg-gray-100" : ""}
          >
            All Products
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setAvailabilityFilter("in-stock")}
            className={availabilityFilter === "in-stock" ? "bg-gray-100" : ""}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            In Stock
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setAvailabilityFilter("out-of-stock")}
            className={
              availabilityFilter === "out-of-stock" ? "bg-gray-100" : ""
            }
          >
            <XCircle className="mr-2 h-4 w-4 text-red-500" />
            Out of Stock
          </DropdownMenuItem>

          {/* Discount Checkbox */}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discount"
                checked={hasDiscount}
                onCheckedChange={() => setHasDiscount(!hasDiscount)}
              />
              <Label htmlFor="discount">On Discount</Label>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProductFilter;
