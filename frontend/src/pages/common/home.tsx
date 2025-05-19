import Banner from "@/components/common/banner";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Layout from "@/components/common/layout";
import Navbar from "@/components/common/navbar";
import ProductGrid from "@/components/shop/product-grid";
import { mockBannerData } from "@/mock/banner-mock";
import { useProductsSearch } from "@/hooks/use-product"; 
import { useMemo } from "react";
import { ISearchParams } from "@/types/product";

const Home = () => {
// Stabilize parameters for useProductsSearch with memos
  const newestParams = useMemo((): ISearchParams => ({ sortBy: "newest", limit: 9 }), []);
  const popularParams = useMemo((): ISearchParams => ({ sortBy: "popular", limit: 9 }), []);

  // Fetch 9 newest products
  const {
    data: newArrivalsData,
    isLoading: newArrivalsLoading,
    error: newArrivalsError, // This is the actual error object
    isError: newArrivalsIsError, // React Query also provides a boolean isError flag
  } = useProductsSearch(newestParams);

  // Fetch 9 most popular products
  const {
    data: popularProductsData,
    isLoading: popularProductsLoading,
    error: popularProductsError,
    isError: popularProductsIsError, 
  } = useProductsSearch(popularParams);

  // Extract the products from the response data
  const newArrivals = newArrivalsData?.data || [];
  const popularProducts = popularProductsData?.data || [];

  //for debugging
  console.log('Home component render cycle');
  console.log('New Arrivals - Loading:', newArrivalsLoading, 'Error:', newArrivalsIsError, 'Data:', newArrivalsData);
  console.log('Popular Products - Loading:', popularProductsLoading, 'Error:', popularProductsIsError, 'Data:', popularProductsData);

  //todo add real banner data
  return (
    <>
      <Layout>
        <Header />
        <Navbar />
        <Banner bannerData={mockBannerData} />
        <br />

        {/* New Arrivals Section */}
        <ProductGrid
          products={newArrivals}
          title="New Arrivals"
          seeMoreLink="/products?sortBy=newest"
          isLoading={newArrivalsLoading}
          error={newArrivalsError}
        />

        {/* Most Popular Section */}
        <ProductGrid
          products={popularProducts}
          title="Most Popular"
          seeMoreLink="/products?sortBy=popular"
          isLoading={popularProductsLoading}
          error={popularProductsError}
        />

        <Footer />
      </Layout>
    </>
  );
};

export default Home;
