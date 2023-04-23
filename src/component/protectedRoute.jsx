import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

function ProtectedRoutes() {
  const refreshToken = Cookies.get("refreshToken");

  return refreshToken ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
