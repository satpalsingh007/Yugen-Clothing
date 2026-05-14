import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ No token → redirect to login
  if (!token) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedAdminRoute;