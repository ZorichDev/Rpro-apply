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
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/destinations/:code" element={<DestinationPage />} />
      <Route path="/institutions" element={<InstitutionsPage />} />
      <Route path="/vendors" element={<VendorsPage />} />
      <Route path="/recruitment-partners" element={<RecruitmentPartnersPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/orders/callback" element={<OrderCallback />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route path="/student" element={<StudentDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.INSTITUTION]} />}>
        <Route path="/institution" element={<InstitutionDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.VENDOR]} />}>
        <Route path="/vendor" element={<VendorDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.RECRUITMENT_PARTNER]} />}>
        <Route path="/partner" element={<PartnerDashboard />} />
      </Route>
    </Routes>
  );
}
