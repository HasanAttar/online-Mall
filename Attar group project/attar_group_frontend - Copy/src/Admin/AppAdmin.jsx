import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./components/UserManagement";
import ShopManagement from "./components/ShopManagement";
import CategoriesManagement from "./components/CategoriesManagement";
import ProductManagement from "./components/ProductManagement";
import OrderManagement from "./components/OrderManagement";
import DeliveryManagement from "./components/DeliveryManagement";
import PaymentManagement from "./components/PaymentManagement";

function AppAdmin() {
  return (
    
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard/" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/shops" element={<ShopManagement />} />
        <Route path="/categories" element={<CategoriesManagement />} />
        <Route path="/products" element={<ProductManagement/>}/>
        <Route path="/orders" element={<OrderManagement/>}/>
        <Route path="/delivery" element={<DeliveryManagement/>}/>
        <Route path="/payment" element={<PaymentManagement/>}/>





      </Routes>
    
  );
}

export default AppAdmin;
