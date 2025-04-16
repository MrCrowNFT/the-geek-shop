import React from "react";
import { useFetchCategories } from "@/hooks/use-category";
import { ICategory } from "@/types/category";

const CategoriesList: React.FC = () => {
  const { data: categories, isLoading, isError, error } = useFetchCategories();

  if (isLoading) {
    return <div className="p-4 text-center">Loading categories...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500 text-center">
        Error loading categories: {(error as Error).message}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <div className="p-4 text-center">No categories found.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category: ICategory) => (
          <div
            key={category._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h3 className="font-semibold text-lg">{category.name}</h3>
            {category.description && (
              <p className="text-gray-600 mt-2">{category.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(category.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
