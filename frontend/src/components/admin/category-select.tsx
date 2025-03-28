import React, { useState } from "react";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ICategory } from "@/types/category";
import { useFetchCategories } from "@/hooks/use-category";

interface CategorySelectionProps {
  existingCategories?: ICategory[]; // Optional existing categories because this will be use for create and update
  onCategoryChange: (categories: string[]) => void; // Callback for category updates
  label?: string; 
  className?: string; 
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  existingCategories = [], // Default to empty array in 
  onCategoryChange,
  label = "Categories",
  className = "",
}) => {
  const { data: allCategories, isLoading } = useFetchCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    existingCategories.map((cat) => cat._id)
  );

  // Filter categories based on search term
  const filteredCategories =
    allCategories?.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        // Exclude already selected categories
        !selectedCategories.includes(category._id)
    ) || [];

  // Remove a category
  const handleRemoveCategory = (categoryId: string) => {
    const newCategories = selectedCategories.filter((id) => id !== categoryId);
    setSelectedCategories(newCategories);
    onCategoryChange(newCategories);
  };

  // Add a category
  const handleAddCategory = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      const newCategories = [...selectedCategories, categoryId];
      setSelectedCategories(newCategories);
      onCategoryChange(newCategories);
    }
  };

  if (isLoading) return <div>Loading categories...</div>;

  return (
    <div className={`grid grid-cols-4 items-center gap-4 ${className}`}>
      <Label className="text-right">{label}</Label>
      <div className="col-span-3 space-y-2">
        {/* Existing Categories Labels */}
        {existingCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {existingCategories.map((category) => (
              <Badge
                key={category._id}
                variant="secondary"
                className="flex items-center"
              >
                {category.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => handleRemoveCategory(category._id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Search Input */}
        <Input
          placeholder="Search categories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        {/* Category Select */}
        <Select onValueChange={handleAddCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Add Category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-center text-muted-foreground">
                No categories found
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
