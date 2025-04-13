import Banner from "@/components/common/banner";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Layout from "@/components/common/layout";
import Navbar from "@/components/common/navbar";
import ProductGrid from "@/components/shop/product-grid";
import { mockBannerData } from "@/mock/banner-mock";
import { useProductsSearch } from "@/hooks/use-product"; // Import your hook

const Home = () => {
  // Fetch 9 newest products
  const {
    data: newArrivalsData,
    isLoading: newArrivalsLoading,
    error: newArrivalsError,
  } = useProductsSearch({
    sortBy: "newest",
    limit: 9,
  });

  // Fetch 9 most popular products
  const {
    data: popularProductsData,
    isLoading: popularProductsLoading,
    error: popularProductsError,
  } = useProductsSearch({
    sortBy: "popular",
    limit: 9,
  });

  // Extract the products from the response data
  const newArrivals = newArrivalsData?.data || [];
  const popularProducts = popularProductsData?.data || [];

  //todo add rel banner data
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
