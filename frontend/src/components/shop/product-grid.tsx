import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./product-card";
import { IProductGridProps } from "@/types/product";

const ProductGrid: React.FC<IProductGridProps> = ({
  products,
  title,
  seeMoreLink,
  maxDisplay = 9,
  isLoading = false,
  error = null
}) => {
  // Skeleton loader component for loading state
  const SkeletonCard = () => (
    <div className="w-72 h-[500px] border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
      <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="w-full py-8">
        <div className="mx-[7%] max-w-full py-8">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Failed to load products. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="mx-[7%] max-w-full py-8">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: maxDisplay }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="mx-[7%] max-w-full py-8">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-600">No products available at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  // Take only up to maxDisplay products
  const displayProducts = products.slice(0, maxDisplay);

  return (
    <div className="w-full py-8">
      <div className="mx-[7%] max-w-full py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Product Cards */}
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

          {/* See More Card */}
          <Link
            to={seeMoreLink}
            className="w-72 h-[500px] border border-gray-200 rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out cursor-pointer bg-white hover:transform hover:-translate-y-2 hover:shadow-xl flex flex-col items-center justify-center"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">See More</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;