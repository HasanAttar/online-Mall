import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../../services/auth"

const ProtectedRoute = ({ children }) => {
  const token = getToken();

  return token ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
