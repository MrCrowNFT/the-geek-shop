import Banner from "@/components/common/banner";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Layout from "@/components/common/layout";
import Navbar from "@/components/common/navbar";

import ProductGrid from "@/components/shop/product-grid";
import { mockBannerData } from "@/mock/banner-mock";
import { mockProducts } from "@/mock/products-mock";

//todo add most search request 
const Home = () => {
  return (
    <>
      <Layout>
        <Header />
        <Navbar />
        <Banner bannerData={mockBannerData} />
        <br />

        {/* New Arrivals Section */}
        <ProductGrid
          products={mockProducts.slice().reverse()}
          title="New Arrivals"
          seeMoreLink="/products/new"
        />
        <ProductGrid
          products={mockProducts.slice().reverse()}
          title="Most Popular"
          seeMoreLink="/products/new"
        />
        <Footer />
      </Layout>
    </>
  );
};

export default Home;
