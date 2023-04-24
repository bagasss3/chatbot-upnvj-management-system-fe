import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./component/user";
import LoginPage from "./page/login";
import ForgotPasswordPage from "./page/forgot-password";
import SuccessForgotPasswordPage from "./page/success-forgot-password";
import DashboardPage from "./page/dashboard";
import ProfilePage from "./page/profile";
import ChangePasswordPage from "./page/change-password";
import ProtectedRoutes from "./component/protectedRoute";
import { AuthContextProvider } from "./component/shared/AuthContext";

const RouterPage = () => {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route exact path="/" element={<DashboardPage />} />
            <Route exact path="/profile" element={<ProfilePage />} />
            <Route
              exact
              path="/profile/change-password"
              element={<ChangePasswordPage />}
            />
          </Route>
          <Route path="/user" element={<User />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/forgot-password/success"
            element={<SuccessForgotPasswordPage />}
          />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
};
export default RouterPage;
