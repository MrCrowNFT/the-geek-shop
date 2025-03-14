import Banner from "@/components/banner";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Navbar from "@/components/navbar";

import ProductGrid from "@/components/product-grid";
import { mockBannerData } from "@/mock/banner-mock";
import { mockProducts } from "@/mock/products-mock";

const Home = () => {
  return (
    <>
      <Header />
      <Navbar/>
      <Banner bannerData={mockBannerData}/>
      <br />
      
      {/* New Arrivals Section */}
      <ProductGrid 
          products={mockProducts.slice().reverse()} 
          title="New Arrivals" 
          seeMoreLink="/products/new" 
        />
      <Footer />
    </>
  );
};

export default Home;
