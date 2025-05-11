import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/CustomerHome";
import ProductPage from "./pages/ProductPage";
import ProductDetailsPage from "./components/ProductDetails";
import CartPage from "./components/Cart";
import CheckoutPage from "./components/Checkout";
import Header from "./components/Header";
// import ThankYouPage from "./components/ThankYouPage"; // Optional: A page to display after order placement
import { CartProvider } from "../context/cartContext";

function AppCustomer() {
  return (
    <>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* <Route path="/thank-you" element={<ThankYouPage />} /> Optional */}
        </Routes>
      </CartProvider>
    </>
  );
}

export default AppCustomer;
