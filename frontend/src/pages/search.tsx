import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Layout from "@/components/common/layout";
import Navbar from "@/components/common/navbar";
import ProductCard from "@/components/shop/product-card";
import { ISeachProps } from "@/types/product";

const Search: React.FC<ISeachProps> = ({ products }) => {
  return (
    <>
      <Layout>
        <Header />
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export default Search;
