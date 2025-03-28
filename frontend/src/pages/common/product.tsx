import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/common/header";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import Slider from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import ProductGrid from "@/components/shop/product-grid";
import { useCart } from "@/hooks/use-cart";
import Layout from "@/components/common/layout";
import { useFetchProductById, useProductsSearch } from "@/hooks/use-product";
import { IProductUser } from "@/types/product";

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [productCounter, setProductCounter] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Fetch product details
  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
  } = useFetchProductById(productId!);

  // Fetching related products based on the product's first category
  const relatedProductsSearch = useProductsSearch({
    categories: product?.categories?.[0]?._id,
    limit: 4,
    page: 1,
  });

  // Zustand cart hook
  const addToCart = useCart((state) => state.addToCart);

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
    if (!product || !product.isAvailable) return;

    // Add the product to cart with the selected quantity
    for (let i = 0; i < productCounter; i++) {
      addToCart(product);
    }

    // Show the "Added to Cart" message
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Calculate sale price if discount is active
  const calculateFinalPrice = (product: IProductUser) => {
    if (product.discount.status) {
      return (
        product.priceTag - (product.priceTag * product.discount.amount) / 100
      );
    }
    return product.priceTag;
  };

  // Generate the "See More" link with category query
  const seeMoreLink = product?.categories?.[0]?._id
    ? `/search?category=${product.categories[0]._id}`
    : "/search";

  // Loading and error states
  if (isProductLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen justify-center items-center">
          <div className="animate-pulse text-lg">
            Loading product details...
          </div>
        </div>
      </Layout>
    );
  }

  if (productError || !product) {
    return (
      <Layout>
        <div className="flex min-h-screen justify-center items-center">
          <div className="text-red-500 text-lg">
            Error loading product. Please try again later.
          </div>
        </div>
      </Layout>
    );
  }

  // Split description for bullet points
  const descriptionPoints = product.description.split("-");

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProductsSearch.data?.data
    ? relatedProductsSearch.data.data.filter((p) => p._id !== product._id)
    : [];

  return (
    <Layout>
      <div className="flex min-h-screen flex-col">
        <Header />
        <Navbar />

        <main className="flex-grow max-w-full py-8">
          {/* Product details section */}
          <div className="mx-[7%] max-w-full flex flex-col gap-8 lg:flex-row mb-16">
            {/* Product image slider */}
            <div className="h-[500px] w-full lg:h-[600px] lg:w-1/2 xl:h-[650px] rounded-xl overflow-hidden shadow-lg">
              <Slider
                images={product.images}
                autoSlide={true}
                autoSlideInterval={5000}
              />
            </div>

            {/* Product information */}
            <div className="flex w-full flex-col space-y-6 lg:w-1/2 lg:pl-10">
              {/* Product header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.categories.map((category) => (
                    <Badge
                      key={category._id}
                      variant="outline"
                      className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4">
                  {product.discount.status ? (
                    <>
                      <span className="text-2xl font-semibold text-indigo-600">
                        ${calculateFinalPrice(product).toFixed(2)}
                      </span>
                      <span className="text-lg line-through text-gray-400">
                        ${product.priceTag.toFixed(2)}
                      </span>
                      <Badge className="bg-red-100 text-red-600 border-red-200">
                        {product.discount.amount}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-2xl font-semibold text-indigo-600">
                      ${product.priceTag.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Availability status */}
              <div className="flex items-center">
                <span
                  className={`inline-block h-3 w-3 rounded-full ${
                    product.isAvailable ? "bg-green-500" : "bg-red-500"
                  } mr-2`}
                ></span>
                <span
                  className={`text-sm ${
                    product.isAvailable ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {product.isAvailable ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Product description */}
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="pt-6">
                  <h3 className="mb-4 text-lg font-medium text-gray-700">
                    Description
                  </h3>
                  <ul className="list-inside list-disc space-y-2 text-gray-600">
                    {descriptionPoints
                      .filter((point) => point.trim().length > 0)
                      .map((point, index) => (
                        <li key={index} className="text-sm md:text-base">
                          {point.trim()}
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Quantity selector and add to cart */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="mr-4 text-gray-700">Quantity:</span>
                  <div className="flex items-center rounded-lg border border-gray-300">
                    <button
                      onClick={removeProduct}
                      disabled={!product.isAvailable}
                      className="flex h-10 w-10 items-center justify-center rounded-l-lg border-r border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="flex h-10 w-16 items-center justify-center bg-white text-gray-700">
                      {productCounter}
                    </span>
                    <button
                      onClick={addProduct}
                      disabled={!product.isAvailable}
                      className="flex h-10 w-10 items-center justify-center rounded-r-lg border-l border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className={`flex w-full items-center justify-center rounded-lg px-6 py-3 text-white transition-all ${
                    !product.isAvailable
                      ? "bg-gray-400 cursor-not-allowed"
                      : addedToCart
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {!product.isAvailable
                    ? "Out of Stock"
                    : addedToCart
                    ? "Added to Cart!"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>

          {/* Related products section */}
          {filteredRelatedProducts.length > 0 && (
            <div className="max-w-full">
              <ProductGrid
                products={filteredRelatedProducts}
                title="Related Products"
                seeMoreLink={seeMoreLink}
              />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </Layout>
  );
};

export default ProductPage;
