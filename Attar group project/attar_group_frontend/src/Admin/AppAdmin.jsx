import { Routes, Route } from "react-router-dom";
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./components/UserManagement";
import ShopManagement from "./components/ShopManagement";
import CategoriesManagement from "./components/CategoriesManagement";
import ProductManagement from "./components/ProductManagement";
import OrderManagement from "./components/OrderManagement";
import DeliveryManagement from "./components/DeliveryManagement";
import PaymentManagement from "./components/PaymentManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function AppAdmin() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Wrap all protected pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shops"
        element={
          <ProtectedRoute>
            <ShopManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery"
        element={
          <ProtectedRoute>
            <DeliveryManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppAdmin;
