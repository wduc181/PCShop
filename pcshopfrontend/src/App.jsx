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
import CategoriesPage from "./pages/Admin/CategoriesPage";
import UsersPage from "./pages/Admin/UsersPage";
import BrandsPage from "./pages/Admin/BrandPage";
import OrdersHistoryPage from "./pages/Admin/OrderHistoryPage";
import ProductsPage from "./pages/Admin/ProductsPage";
import AOrdersPage from "./pages/Admin/AOrdersPage";

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

          
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/brands" element={<BrandsPage />} />
          <Route path="/admin/order-history" element={<OrdersHistoryPage />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/orders" element={<AOrdersPage />} />

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
