import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import CreateCampaign from "./pages/CreCamp/CreCamp";
import CampaignPreview from "./pages/CampaignPrev/CampaignPrev";
import Published from "./pages/Published/Published";
import PublicCampaign from "./pages/Public/Public";
import SupporterCheckout from "./pages/Checkout/Checkout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { useAuth } from "./context/AuthContext";

function GuestOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p role="status">Checking your account...</p>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Pages available without a PasteMe account */}
      <Route path="/" element={<Landing />} />
      <Route path="/c/:campaignId" element={<PublicCampaign />} />
      <Route path="/c/:campaignId/donate" element={<SupporterCheckout />} />

      {/* Account entry and recovery */}
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />

      {/* Creator workspace */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/create-campaign" element={<Navigate to="/create" replace />} />
        <Route path="/campaign-preview" element={<CampaignPreview />} />
        <Route path="/campaign-published/:campaignId" element={<Published />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
