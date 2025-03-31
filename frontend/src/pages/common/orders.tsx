import React from "react";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Layout from "@/components/common/layout";
import Navbar from "@/components/common/navbar";
import OrderCard from "@/components/common/order-card";
import { useProfile } from "@/hooks/use-profile";

const OrdersPage: React.FC = () => {
  // Get orders from the profile state
  const orders = useProfile((state) => state.orders);
  const isLoading = useProfile((state) => state.isLoading);

  return (
    <Layout>
      <Header />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You don't have any orders yet.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Shopping
            </button>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default OrdersPage;
