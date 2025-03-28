import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/common/home";
import ProductPage from "./pages/common/product";
import Login from "./pages/common/login";
import Signup from "./pages/common/signup";
import Dashboard from "./pages/admin/dashboard";
import OrderDetailsPage from "./pages/admin/order";
import Search from "./pages/common/search";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/*User */}
        <Route path="/home/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/signup/" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        {/*Admin */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/order/:orderId" element={<OrderDetailsPage />} />
        <Route path="/admin/product/:productId" />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
