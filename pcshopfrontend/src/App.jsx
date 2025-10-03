import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProductsByCategory from "./pages/ProductsByCategoryPage";
import ProductsByBrand from "./pages/ProductsByBrandPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

function App() {
  return (
    <>
      <Toaster />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/users/auth" element={<AuthPage />} />

          <Route
            path="/category/:categoryName"
            element={<ProductsByCategory />}
          />

          <Route path="/brand/:brandName" element={<ProductsByBrand />} />

          <Route path="/cart-items*" element={<CartPage />} />

          {/* Orders */}
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
