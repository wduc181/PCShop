import { Toaster } from "sonner"
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProductsByCategory from "./pages/ProductsByCategory";
import ProductsByBrand from "./pages/ProductsByBrand";

function App() {
  return (
    <>
      <Toaster />

      <BrowserRouter>
        <Routes>

          <Route
            path='/' 
            element={<HomePage />}
          />

          <Route
            path="/users/auth"
            element={<AuthPage />}
          />
          <Route
            path="/category/:categoryName"
            element={<ProductsByCategory />}
          />
          <Route
            path="/brand/:brandName"
            element={<ProductsByBrand />}
          />

          <Route
            path='/*' 
            element={<NotFound />}
          />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
