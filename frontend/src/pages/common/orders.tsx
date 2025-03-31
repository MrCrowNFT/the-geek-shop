import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Layout from "@/components/common/layout";
import Navbar from "@/components/common/navbar";
import OrderCard from "@/components/common/order-card";


const OrdersPage = () => {
  //todo get the orders from the profile

  return (
    <Layout>
        <Header />
        <Navbar />
    <div className="space-y-2">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
    <Footer />
      </Layout>
  );
};

export default OrdersPage;
