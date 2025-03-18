import React from "react";
import { Link } from "react-router-dom";
import { IProductAdmin } from "@/types/product";

interface ProductListProps {
  products: IProductAdmin[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
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
            {products.map((product) => (
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
                        {product.discount.amout}% off
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
