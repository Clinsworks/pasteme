import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    const language = localStorage.getItem("pasteme_language") || "en";
    const message = {
      en: "Checking your account...",
      pcm: "We dey check your account...",
      yo: "A ń ṣàyẹ̀wò àkáǹtì rẹ...",
    }[language] || "Checking your account...";

    return (
      <div className="app-route-loading" role="status">
        <Icon name="loader" size={20} />
        <span>{message}</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  return <Outlet />;
}
