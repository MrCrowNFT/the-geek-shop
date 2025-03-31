import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./product-card";
import { IProductGridProps } from "@/types/product";

//todo update the see more link
const ProductGrid: React.FC<IProductGridProps> = ({
  products,
  title,
  seeMoreLink,
  maxDisplay = 9,
}) => {
  // Take only up to maxDisplay products
  const displayProducts = products.slice(0, maxDisplay);

  return (
    <div className="w-full py-8">
      <div className="mx-[7%] max-w-full py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Product Cards */}
          {displayProducts.map((product) => (
            <ProductCard product={product} />
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
