import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./component/user";
import LoginPage from "./page/login";
import ForgotPasswordPage from "./page/forgot-password";
import SuccessForgotPasswordPage from "./page/success-forgot-password";
import DashboardPage from "./page/dashboard";
import ProfilePage from "./page/profile";
import ChangePasswordPage from "./page/change-password";
import ManagementAdminPage from "./page/management-admin/management-admin";
import ProtectedRoutes from "./component/protectedRoute";
import { AuthContextProvider } from "./component/shared/AuthContext";
import AddAdminPage from "./page/management-admin/add-admin";
import EditAdminPage from "./page/management-admin/edit-admin";
import UtterancePage from "./page/utterance/utterance";
import AddUtterancePage from "./page/utterance/add_utterance";
import EditUtterancePage from "./page/utterance/edit-utterance";
import ActionPage from "./page/action/action";
import AddActionPage from "./page/action/add-action";
import AddActionReqBodyPage from "./page/action/add-req-body";
import EditActionPage from "./page/action/edit-action";
import EditActionReqBodyPage from "./page/action/edit-req-body";
import IntentPage from "./page/intent/intent";
import AddIntentPage from "./page/intent/intent-add";
import EditIntentPage from "./page/intent/intent-edit";
import DetailActionPage from "./page/action/detail-action/detail-action";
import AddActionDetailPage from "./page/action/detail-action/add-detail-action";
import UpdateActionDetailPage from "./page/action/detail-action/update-detail-action";

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
            <Route exact path="/admin" element={<ManagementAdminPage />} />
            <Route exact path="/admin/add" element={<AddAdminPage />} />
            <Route exact path="/admin/edit/:id" element={<EditAdminPage />} />
            <Route exact path="/utterance" element={<UtterancePage />} />
            <Route exact path="/utterance/add" element={<AddUtterancePage />} />
            <Route
              exact
              path="/utterance/edit/:id"
              element={<EditUtterancePage />}
            />
            <Route exact path="/action" element={<ActionPage />} />
            <Route exact path="/action/add" element={<AddActionPage />} />
            <Route
              exact
              path="/action/edit/:id/req/:method/add"
              element={<AddActionReqBodyPage />}
            />
            <Route exact path="/action/edit/:id" element={<EditActionPage />} />
            <Route
              exact
              path="/action/edit/:id/req/:method"
              element={<EditActionReqBodyPage />}
            />
            <Route
              exact
              path="/action/:id/detail"
              element={<DetailActionPage />}
            />
            <Route
              exact
              path="/action/:id/detail/add"
              element={<AddActionDetailPage />}
            />
            <Route
              exact
              path="/action/:id/detail/edit/:dataId"
              element={<UpdateActionDetailPage />}
            />
            <Route exact path="/intent" element={<IntentPage />} />
            <Route exact path="/intent/add" element={<AddIntentPage />} />
            <Route exact path="/intent/edit/:id" element={<EditIntentPage />} />
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
