import Banner from "@/components/banner";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Layout from "@/components/layout";
import Navbar from "@/components/navbar";

import ProductGrid from "@/components/product-grid";
import { mockBannerData } from "@/mock/banner-mock";
import { mockProducts } from "@/mock/products-mock";

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
        <Footer />
      </Layout>
    </>
  );
};

export default Home;
