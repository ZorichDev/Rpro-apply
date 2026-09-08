import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import { ROLES } from "shared";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Onboarding from "./pages/Onboarding";
import OrderCallback from "./pages/orders/OrderCallback";
import DestinationPage from "./pages/marketing/DestinationPage";
import InstitutionsPage from "./pages/marketing/InstitutionsPage";
import VendorsPage from "./pages/marketing/VendorsPage";
import RecruitmentPartnersPage from "./pages/marketing/RecruitmentPartnersPage";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import InstitutionDashboard from "./pages/dashboards/InstitutionDashboard";
import VendorDashboard from "./pages/dashboards/VendorDashboard";
import PartnerDashboard from "./pages/dashboards/PartnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/verify-email/:token", element: _jsx(VerifyEmail, {}) }), _jsx(Route, { path: "/forgot-password", element: _jsx(ForgotPassword, {}) }), _jsx(Route, { path: "/reset-password/:token", element: _jsx(ResetPassword, {}) }), _jsx(Route, { path: "/destinations/:code", element: _jsx(DestinationPage, {}) }), _jsx(Route, { path: "/institutions", element: _jsx(InstitutionsPage, {}) }), _jsx(Route, { path: "/vendors", element: _jsx(VendorsPage, {}) }), _jsx(Route, { path: "/recruitment-partners", element: _jsx(RecruitmentPartnersPage, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/onboarding", element: _jsx(Onboarding, {}) }), _jsx(Route, { path: "/orders/callback", element: _jsx(OrderCallback, {}) })] }), _jsx(Route, { element: _jsx(ProtectedRoute, { allowedRoles: [ROLES.STUDENT] }), children: _jsx(Route, { path: "/student", element: _jsx(StudentDashboard, {}) }) }), _jsx(Route, { element: _jsx(ProtectedRoute, { allowedRoles: [ROLES.INSTITUTION] }), children: _jsx(Route, { path: "/institution", element: _jsx(InstitutionDashboard, {}) }) }), _jsx(Route, { element: _jsx(ProtectedRoute, { allowedRoles: [ROLES.VENDOR] }), children: _jsx(Route, { path: "/vendor", element: _jsx(VendorDashboard, {}) }) }), _jsx(Route, { element: _jsx(ProtectedRoute, { allowedRoles: [ROLES.RECRUITMENT_PARTNER] }), children: _jsx(Route, { path: "/partner", element: _jsx(PartnerDashboard, {}) }) })] }));
}
