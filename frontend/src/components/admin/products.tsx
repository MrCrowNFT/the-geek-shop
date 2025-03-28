import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFetchAdminProducts } from "@/hooks/use-product";
import ProductFilter from "./product-search-filter";
import { IProductAdmin } from "@/types/product";
import NewProductButton from "./new-product-button";

//todo add the new produt button
const ProductList: React.FC = () => {
  const { data: products, isLoading, isError } = useFetchAdminProducts();
  const [filteredProducts, setFilteredProducts] = useState<IProductAdmin[]>([]);

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (isError || !products || products.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">No products available</p>
        <div className="mt-4 flex justify-center">
          <NewProductButton />
        </div>
      </div>
    );
  }

  // filtered products if available, otherwise original products
  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <NewProductButton />
      </div>
      {/* ProductFilter */}
      <ProductFilter
        products={products}
        onFilteredProducts={setFilteredProducts}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Availability</th>
              <th className="p-3 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map((product) => (
              <tr
                key={product._id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  (window.location.href = `/admin/product/${product._id}`)
                }
              >
                <td className="p-3">
                  <Link to={`/admin/product/${product._id}`} className="block">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        No image
                      </div>
                    )}
                  </Link>
                </td>
                <td className="p-3 font-medium">
                  <Link
                    to={`/admin/product/${product._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      product.isAvailable ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={product.isAvailable ? "Available" : "Not Available"}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {product.isAvailable ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      ${product.priceTag.toFixed(2)}
                    </span>
                    {product.discount && product.discount.status && (
                      <span className="text-sm text-green-600">
                        {product.discount.amount}% off
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
