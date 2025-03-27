import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/common/header";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import Slider from "@/components/ui/slider";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import ProductGrid from "@/components/shop/product-grid";
import { useCart } from "@/hooks/use-cart";
import Layout from "@/components/common/layout";
import { useFetchProductById, useProductsSearch } from "@/hooks/use-product";

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

  //todo: the "see more" link should redirect to the search page with the category as query
  // fetching related products based on the product's first category
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
    if (!product) return;

    // Add the product to cart with the selected quantity
    for (let i = 0; i < productCounter; i++) {
      addToCart(product);
    }

    // Show the "Added to Cart" message
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Generate the "See More" link with category query by putting the id of the category on url
  const seeMoreLink = product?.categories?.[0]?._id
    ? `/search?category=${product.categories[0]._id}`
    : "/search";

  // loading and error states
  if (isProductLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen justify-center items-center">
          Loading product...
        </div>
      </Layout>
    );
  }

  if (productError || !product) {
    return (
      <Layout>
        <div className="flex min-h-screen justify-center items-center">
          Error loading product. Please try again later.
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
                  ${product.priceTag.toFixed(2)}
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
