import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import Icon from "./Icon";
import InstallAppButton from "./InstallAppButton";
import "./PasteMeNav.css";

/**
 * Shared navigation for PasteMe's authenticated and discovery spaces.
 * This component only handles presentation and client-side navigation.
 */
export default function PasteMeNav({
  activePage,
  isAuthenticated = false,
  userName = "",
  language = "en",
  onLanguageChange,
  onLogout,
  labels,
}) {
  const firstName = userName.trim().split(/\s+/)[0] || "Creator";
  const initial = firstName.charAt(0).toUpperCase();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const accountButtonRef = useRef(null);

  useEffect(() => {
    if (!accountMenuOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
        accountButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountMenuOpen]);

  const handleLogout = () => {
    setAccountMenuOpen(false);
    onLogout?.();
  };

  return (
    <header className="pasteme-nav-shell">
      <div className="pasteme-nav-inner">
        <BrandLogo to="/" className="pasteme-nav-brand" />

        <nav className="pasteme-nav-links" aria-label="Main navigation">
          <Link className={`pasteme-nav-link${activePage === "home" ? " is-active" : ""}`} to="/">
            {labels.home}
          </Link>
          <Link className={`pasteme-nav-link${activePage === "explore" ? " is-active" : ""}`} to="/explore">
            {labels.explore}
          </Link>
          <Link className="pasteme-nav-link" to="/#how-it-works">
            {labels.how}
          </Link>
          {isAuthenticated ? (
            <Link className={`pasteme-nav-link${activePage === "dashboard" ? " is-active" : ""}`} to="/dashboard">
              {labels.dashboard}
            </Link>
          ) : null}
        </nav>

        <div className="pasteme-nav-actions">
          <div className="pasteme-nav-install">
            <InstallAppButton label={labels.install} />
          </div>

          <label className="pasteme-language-control">
            <Icon name="globe" size={15} />
            <span className="sr-only">{labels.language}</span>
            <select value={language} onChange={onLanguageChange} aria-label={labels.language}>
              <option value="en">English</option>
              <option value="pcm">Pidgin</option>
              <option value="yo">Yorùbá</option>
            </select>
          </label>

          {isAuthenticated ? (
            <div className="pasteme-nav-account" ref={accountMenuRef}>
              <button
                ref={accountButtonRef}
                className="pasteme-nav-user"
                type="button"
                aria-label={`${labels.signedInAs || "Signed in as"} ${firstName}`}
                aria-haspopup="true"
                aria-expanded={accountMenuOpen}
                aria-controls="pasteme-account-menu"
                onClick={() => setAccountMenuOpen((open) => !open)}
              >
                <span className="pasteme-nav-avatar" aria-hidden="true">{initial}</span>
                <span className="pasteme-nav-user-name">{firstName}</span>
                <span className={`pasteme-nav-chevron${accountMenuOpen ? " is-open" : ""}`} aria-hidden="true" />
              </button>
              <div
                id="pasteme-account-menu"
                className="pasteme-nav-account-menu"
                role="group"
                aria-label={labels.signedInAs || "Account options"}
                hidden={!accountMenuOpen}
              >
                <button type="button" onClick={handleLogout}>
                  <span>{labels.logout}</span>
                  <Icon name="log-out" size={15} />
                </button>
              </div>
            </div>
          ) : (
            <Link className="pasteme-nav-signin" to="/login">{labels.signIn}</Link>
          )}

          <Link className="pasteme-nav-cta" to={isAuthenticated ? "/create" : "/signup"}>
            <span>{labels.start}</span>
            <Icon name="arrow-up-right" size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
