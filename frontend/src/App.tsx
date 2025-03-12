import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/home";
import ProductPage from "./pages/product";
import { mockProduct, mockProducts } from "./mock/products-mock";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route
          path="/product/"
          element={
            <ProductPage product={mockProduct} relatedProducts={mockProducts} />
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
