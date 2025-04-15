import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/common/home";
import ProductPage from "./pages/common/product";
import Login from "./pages/common/login";
import Signup from "./pages/common/signup";
import Dashboard from "./pages/admin/dashboard";
import OrderDetailsPage from "./pages/admin/order";
import Search from "./pages/common/search";
import AdminProductPage from "./pages/admin/product";
import OrdersPage from "./pages/common/orders";
import ProfilePage from "./pages/common/profile";
import WishlistPage from "./pages/common/wishlist";
import ProtectedAdminRoute from "./components/admin/admin-popup";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/*User */}
        <Route path="/home/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        {/*Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/order/:orderId"
          element={
            <ProtectedAdminRoute>
              <OrderDetailsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/product/:productId"
          element={
            <ProtectedAdminRoute>
              <AdminProductPage />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
