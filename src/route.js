import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/home";
import User from "./component/user";
import LoginPage from "./page/login";

const RouterPage = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};
export default RouterPage;
