import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/home";
import User from "./component/user";
import LoginPage from "./page/login";
import ForgotPasswordPage from "./page/forgot-password";
import SuccessForgotPasswordPage from "./page/success-forgot-password";

const RouterPage = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/forgot-password/success"
          element={<SuccessForgotPasswordPage />}
        />
      </Routes>
    </Router>
  );
};
export default RouterPage;
