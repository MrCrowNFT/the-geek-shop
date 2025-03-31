import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { IProductUser } from "@/types/product";
import ProductCard from "@/components/shop/product-card";

const WishlistPage: React.FC = () => {
  const { wishlist, isLoading } = useProfile((state) => ({
    wishlist: state.wishlist,
    isLoading: state.isLoading,
  }));

  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    // Check if wishlist is empty after loading
    if (!isLoading && wishlist.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [wishlist, isLoading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Wishlist</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : isEmpty ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Browse our catalog and add items you love to your wishlist
          </p>
          <a
            href="/products"
            className="inline-block px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Explore Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {wishlist.map((product: IProductUser) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
