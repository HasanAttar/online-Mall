import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/CustomerHome";
import ProductPage from "./pages/ProductPage";
import ProductDetailsPage from "./components/ProductDetails";
import CartPage from "./components/Cart";
import CheckoutPage from "./components/CheckOutPage";
import Header from "./components/Header";
// import ThankYouPage from "./components/ThankYouPage"; // Optional: A page to display after order placement
import { CartProvider } from "../context/cartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      <ToastContainer position="bottom-right" autoClose={3000} />

    </>
  );
}

export default AppCustomer;
