import { useState } from "react";
import Header from "@/components/header";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Slider from "@/components/ui/slider";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import ProductGrid from "@/components/product-grid";
import { ProductPageProps } from "@/types/product";

const ProductPage: React.FC<ProductPageProps> = ({
  product,
  relatedProducts,
}) => {
  const [productCounter, setProductCounter] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const addProduct = (): void => {
    setProductCounter(productCounter + 1);
  };

  const removeProduct = (): void => {
    if (productCounter <= 1) {
      setProductCounter(1);
    } else {
      setProductCounter(productCounter - 1);
    }
  };

  const handleAddToCart = (): void => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    // In a real application, you would add the product to cart here
  };

  // Split description for bullet points
  const descriptionPoints = product.description.split("-");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Navbar />

      <main className="flex-grow max-w-full py-8">
        {/* Product details section */}
        <div className="mx-[7%] max-w-full flex flex-col gap-8 lg:flex-row mb-16">
          {/* Product image slider */}
          <div className="h-[600px] w-full lg:h-[600px] lg:w-1/2 xl:h-[900px]">
            <Slider
              images={product.images}
              autoSlide={true}
              autoSlideInterval={5000}
            />
          </div>

          {/* Product information */}
          <div className="flex w-full flex-col space-y-6 lg:w-1/2 lg:pl-10">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-800">
                {product.name}
              </h1>
              <h2 className="text-2xl font-semibold text-indigo-600">
                ${product.price.toFixed(2)}
              </h2>
            </div>

            {/* Product description */}
            <div className="border-y border-gray-200 py-6">
              <h3 className="mb-4 text-lg font-medium text-gray-700">
                Description
              </h3>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                {descriptionPoints.map((point, index) => (
                  <li key={index} className="text-sm md:text-base">
                    {point.trim()}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity selector and add to cart */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="mr-4 text-gray-700">Quantity:</span>
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button
                    onClick={removeProduct}
                    className="flex h-10 w-10 items-center justify-center rounded-l-lg border-r border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="flex h-10 w-16 items-center justify-center bg-white text-gray-700">
                    {productCounter}
                  </span>
                  <button
                    onClick={addProduct}
                    className="flex h-10 w-10 items-center justify-center rounded-r-lg border-l border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex w-full items-center justify-center rounded-lg px-6 py-3 text-white transition-all ${
                  addedToCart
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>

            {/* Additional info like shipping, returns, etc. */}
            <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-sm">
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Free shipping</span>
                <span className="ml-auto">on orders over $50</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Free returns</span>
                <span className="ml-auto">within 30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products section */}
        <div className="max-w-full">
          <ProductGrid
            products={relatedProducts.slice()}
            title="Related Products"
            seeMoreLink="/products/new"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
