import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import ScrollReveal from "./components/ScrollReveal";
import { useAuth } from "./context/AuthContext";
import Icon from "./components/Icon";

function GuestOnly({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const language = localStorage.getItem("pasteme_language") || "en";
  const loadingText = {
    en: "Checking your account...",
    pcm: "We dey check your account...",
    yo: "A ń ṣàyẹ̀wò àkáǹtì rẹ...",
  }[language] || "Checking your account...";
  if (loading) return <div className="app-route-loading" role="status"><Icon name="loader" size={20} /><span>{loadingText}</span></div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <ScrollReveal key={location.pathname} />
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
