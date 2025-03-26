import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/home";
import ProductPage from "./pages/product";
import { mockProduct, mockProducts } from "./mock/products-mock";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import OrderDetailsPage from "./pages/order";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/home/" element={<Home />} />
        <Route
          path="/product/"
          element={
            <ProductPage product={mockProduct} relatedProducts={mockProducts} />
          }
        />
        <Route path="/login/" element={<Login />} />
        <Route path="/signup/" element={<Signup />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/order/:orderId" element={<OrderDetailsPage/>} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
