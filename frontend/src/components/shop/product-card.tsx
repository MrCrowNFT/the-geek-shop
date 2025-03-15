import { useState } from "react";
import {  ProductCardProps } from "@/types/product";
import { useCart } from "@/hooks/use-cart";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [hovering, setHovering] = useState(false);

  // Zustand cart hook
  const addToCart = useCart((state) => state.addToCart);

  return (
    <div
      className="w-72 h-[500px] border border-gray-200 rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out cursor-pointer bg-white hover:transform hover:-translate-y-2 hover:shadow-xl"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Product Image Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hovering ? "opacity-0" : "opacity-100"
          }`}
          src={product.images[0]}
          alt={product.name}
        />
        {product.images[1] && (
          <a href={`/product/${product.id}`} className="block w-full h-full">
            <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                hovering ? "opacity-100" : "opacity-0"
              }`}
              src={product.images[1]}
              alt={`${product.name} - hover`}
            />
          </a>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-4 text-center">
        <a href={`/product/${product.id}`} className="block group">
          <h2 className="text-lg font-bold my-2 text-gray-800 group-hover:text-gray-600 transition-colors duration-200">
            {product.name}
          </h2>
          <p className="text-base text-gray-600 mb-4">
            ${product.price.toFixed(2)}
          </p>
        </a>
        <button
          onClick={() => addToCart(product)}
          className={`w-full py-2 px-4  font-bold rounded transition-all duration-300 transform cursor-pointer ${
            hovering ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          } hover:bg-gray-500`}
        >
          Add to cart →
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
