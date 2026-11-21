import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import Icon from "../components/Icon";
import "./Auth.css";

const translations = {
  en: {
    login: "Welcome back.",
    signup: "Let's get started.",
    loginSubtitle: "Log in to continue your journey with PasteMe.",
    signupSubtitle: "Create an account and give your ideas a place to grow.",
    brandLogin: "Good stories deserve to continue.",
    brandSignup: "Every meaningful change starts with a story.",
    brandDescription:
      "Bring your ideas to life, share your story and make meaningful things happen.",
    name: "Full name",
    email: "Email address",
    password: "Password",
    confirm: "Confirm password",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Enter your password",
    confirmPlaceholder: "Enter your password again",
    loginButton: "Log in",
    signupButton: "Create account",
    loginPrompt: "Already have an account?",
    signupPrompt: "New to PasteMe?",
    loginLink: "Log in",
    signupLink: "Create an account",
    passwordHint: "Use at least 8 characters.",
    mismatch: "Your passwords do not match.",
    demoNotice: "Your account is protected by PasteMe's secure sign-in service.",
    footer: "Made for meaningful causes.",
    language: "Language",
    loginEyebrow: "WELCOME BACK",
    signupEyebrow: "JOIN PASTEME",
    loginAside: "Your stories. Your impact.",
    signupAside: "Start something meaningful.",
    required: "Please complete all required fields.",
    wait: "Just a moment...", showPassword: "Show password", hidePassword: "Hide password",
    forgot: "Forgot password?",
  },

  pcm: {
    login: "You don come back.",
    signup: "Make we get started.",
    loginSubtitle: "Log in make you continue your journey with PasteMe.",
    signupSubtitle: "Create account make your ideas fit grow.",
    brandLogin: "Your story fit still move forward.",
    brandSignup: "Every big change dey start with one story.",
    brandDescription:
      "Bring your idea come life, share your story, and make people join you.",
    name: "Your full name",
    email: "Email address",
    password: "Password",
    confirm: "Confirm password",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Enter your password",
    confirmPlaceholder: "Enter your password again",
    loginButton: "Log in",
    signupButton: "Create account",
    loginPrompt: "You don already get account?",
    signupPrompt: "You new to PasteMe?",
    loginLink: "Log in",
    signupLink: "Create account",
    passwordHint: "Use at least 8 characters.",
    mismatch: "The passwords no match.",
    demoNotice: "PasteMe go protect your account with secure sign-in.",
    footer: "For causes wey matter.",
    language: "Language",
    loginEyebrow: "YOU DON COME BACK",
    signupEyebrow: "JOIN PASTEME",
    loginAside: "Your stories. Your impact.",
    signupAside: "Start something meaningful.",
    required: "Abeg complete all the required fields.",
    wait: "Just small moment...", showPassword: "Show password", hidePassword: "Hide password",
    forgot: "You forget password?",
  },

  yo: {
    login: "Ẹ káàbọ̀ padà.",
    signup: "Ẹ jẹ́ ká bẹ̀rẹ̀.",
    loginSubtitle: "Wọlé láti tẹ̀síwájú pẹ̀lú PasteMe.",
    signupSubtitle: "Ṣẹ̀dá àkáǹtì kí àwọn èrò rẹ lè dàgbà.",
    brandLogin: "Ó yẹ kí ìtàn rere máa bá a lọ.",
    brandSignup: "Gbogbo ìyípadà rere bẹ̀rẹ̀ pẹ̀lú ìtàn kan.",
    brandDescription:
      "Mú àwọn èrò rẹ ṣẹ, pín ìtàn rẹ, kí o sì ṣe àwọn ohun tó ní ìtumọ̀.",
    name: "Orúkọ kíkún",
    email: "Àdírẹ́sì ímeèlì",
    password: "Ọ̀rọ̀ aṣínà",
    confirm: "Jẹ́rìísí ọ̀rọ̀ aṣínà",
    namePlaceholder: "Tẹ orúkọ rẹ kíkún",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Tẹ ọ̀rọ̀ aṣínà rẹ",
    confirmPlaceholder: "Tẹ ọ̀rọ̀ aṣínà rẹ lẹ́ẹ̀kan sí i",
    loginButton: "Wọlé",
    signupButton: "Ṣẹ̀dá àkáǹtì",
    loginPrompt: "Ṣé o ti ní àkáǹtì tẹ́lẹ̀?",
    signupPrompt: "Ṣé o ṣẹ̀ṣẹ̀ dé PasteMe?",
    loginLink: "Wọlé",
    signupLink: "Ṣẹ̀dá àkáǹtì",
    passwordHint: "Lo ó kéré tán lẹ́tà àti nọ́ńbà mẹ́jọ.",
    mismatch: "Àwọn ọ̀rọ̀ aṣínà rẹ kò bá ara wọn mu.",
    demoNotice: "PasteMe yóò dáàbò bo àkáǹtì rẹ pẹ̀lú ìwọlé tó ní ààbò.",
    footer: "A ṣe é fún àwọn ohun tó ní ìtumọ̀.",
    language: "Èdè",
    loginEyebrow: "Ẹ KÁÀBỌ̀ PADÀ",
    signupEyebrow: "DARAPỌ̀ PẸ̀LÚ PASTEME",
    loginAside: "Ìtàn rẹ. Ipa rẹ.",
    signupAside: "Bẹ̀rẹ̀ ohun tó ní ìtumọ̀.",
    required: "Jọ̀wọ́ kún gbogbo àlàyé tó yẹ.",
    wait: "Ẹ dúró díẹ̀...", showPassword: "Fi ọ̀rọ̀ aṣínà hàn", hidePassword: "Fi ọ̀rọ̀ aṣínà pamọ́",
    forgot: "Ṣé o gbàgbé ọ̀rọ̀ aṣínà rẹ?",
  },
};



export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";

  const navigate = useNavigate();
  const location = useLocation();

  const [language, setLanguage] = useState(
    () => localStorage.getItem("pasteme_language") || "en"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const t = translations[language] || translations.en;

  const { signIn, signUp } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleLanguageChange = (e) => {
    const selected = e.target.value;

    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const email = formData.email.trim().toLowerCase();

      if (isSignup) {
        if (formData.password !== formData.confirmPassword) {
          setError(t.mismatch);
          return;
        }

        await signUp({ name: formData.name, email, password: formData.password });
      } else {
        await signIn({ email, password: formData.password });
      }

      const previousPage = location.state?.from;
      const destination =
        typeof previousPage === "string"
          ? previousPage
          : previousPage?.pathname
            ? `${previousPage.pathname}${previousPage.search || ""}${previousPage.hash || ""}`
            : "/dashboard";

      navigate(destination, { replace: true });
    } catch (submitError) {
      setError(submitError.message || t.required);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={isSignup ? "auth-page auth-page-signup" : "auth-page"}>

      {/* LEFT BRAND SECTION */}
      <section className="auth-visual">

        <BrandLogo className="auth-logo" />

        <div className="auth-decoration decoration-one" />
        <div className="auth-decoration decoration-two" />

        <div className="auth-visual-content">

          <span className="auth-visual-eyebrow">
            {isSignup ? t.signupAside : t.loginAside}
          </span>

          <h1>
            {isSignup ? t.brandSignup : t.brandLogin}
          </h1>

          <p>{t.brandDescription}</p>

          <div className="auth-visual-mark">
            {/* <Icon name="sparkles" size={18} /> */}
            {/* <span>YOUR STORY. YOUR IMPACT.</span> */}
          </div>

        </div>

        <div className="auth-visual-footer">
          {t.footer}
        </div>

      </section>

      {/* RIGHT FORM SECTION */}
      <section className="auth-form-section">

        <div className="auth-topbar">

          <span className="auth-topbar-label">
            PASTEME ACCOUNT
          </span>

          <div className="auth-language">
            <Icon name="globe" size={16} />

            <select
              value={language}
              onChange={handleLanguageChange}
              aria-label={t.language}
            >
              <option value="en">English</option>
              <option value="pcm">Pidgin</option>
              <option value="yo">Yorùbá</option>
            </select>
          </div>

        </div>

        <div className="auth-form-container">

          <span className="auth-form-eyebrow">
            {isSignup ? t.signupEyebrow : t.loginEyebrow}
          </span>

          <h2>{isSignup ? t.signup : t.login}</h2>

          <p className="auth-form-subtitle">
            {isSignup ? t.signupSubtitle : t.loginSubtitle}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">

            {isSignup && (
              <div className="auth-field">
                <label htmlFor="auth-name">{t.name}</label>

                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  autoComplete="name"
                  maxLength={80}
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="auth-email">{t.email}</label>

              <input
                id="auth-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.emailPlaceholder}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">{t.password}</label>

              <div className="auth-password-wrapper">

                <input
                  id="auth-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.passwordPlaceholder}
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  minLength={isSignup ? 8 : undefined}
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size={17} />
                </button>

              </div>

              {isSignup && (
                <small className="auth-field-hint">
                  {t.passwordHint}
                </small>
              )}
            </div>

            {!isSignup && (
              <div className="auth-forgot-row">
                <Link to="/forgot-password">{t.forgot}</Link>
              </div>
            )}

            {isSignup && (
              <div className="auth-field">
                <label htmlFor="auth-confirm">
                  {t.confirm}
                </label>

                <input
                  id="auth-confirm"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t.confirmPlaceholder}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            )}

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? t.wait : isSignup ? t.signupButton : t.loginButton}
              <Icon name="arrow-up-right" size={16} />
            </button>

          </form>

          <div className="auth-switch">

            <span>
              {isSignup ? t.loginPrompt : t.signupPrompt}
            </span>

            <Link to={isSignup ? "/login" : "/signup"}>
              {isSignup ? t.loginLink : t.signupLink}
            </Link>

          </div>

          <div className="auth-demo-note">
            <Icon name="shield-check" size={17} />
            <p>{t.demoNotice}</p>
          </div>

        </div>

        <footer className="auth-footer">
          <BrandLogo className="auth-footer-logo" />
          <span>{t.footer}</span>
        </footer>

      </section>

    </main>
  );
}
