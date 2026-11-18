import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import "./Auth.css";

const copy = {
  en: {
    eyebrow: "ACCOUNT RECOVERY",
    title: "Forgot your password?",
    subtitle: "Enter the email connected to your PasteMe account.",
    email: "Email address",
    placeholder: "you@example.com",
    submit: "Continue",
    back: "Back to login",
    note: "Password recovery is unavailable until an email delivery service is configured.",
    notice: "If email delivery is configured, recovery instructions will be sent if this address has an account.",
    error: "Password recovery is not available until email delivery is configured.",
    submitted: "Recovery is not connected yet",
    brand: "Your story is worth coming back to.",
    brandText: "Keep your campaigns and the people supporting them close.",
  },
  pcm: {
    eyebrow: "ACCOUNT RECOVERY",
    title: "You forget your password?",
    subtitle: "Enter the email wey you use for your PasteMe account.",
    email: "Email address",
    placeholder: "you@example.com",
    submit: "Continue",
    back: "Go back to login",
    note: "Password recovery is unavailable until an email delivery service is configured.",
    notice: "If email delivery is configured, recovery instructions will be sent if this address has an account.",
    error: "Password recovery is not available until email delivery is configured.",
    submitted: "Recovery never connect yet",
    brand: "Your story dey worth coming back to.",
    brandText: "Keep your campaigns and the people wey support am close.",
  },
  yo: {
    eyebrow: "ÌPADÀ SÍ ÀKÁǸTÌ",
    title: "Ṣé o gbàgbé ọ̀rọ̀ aṣínà rẹ?",
    subtitle: "Tẹ ímeèlì tó so mọ́ àkáǹtì PasteMe rẹ.",
    email: "Àdírẹ́sì ímeèlì",
    placeholder: "you@example.com",
    submit: "Tẹ̀síwájú",
    back: "Padà sí ìwọlé",
    note: "Password recovery is unavailable until an email delivery service is configured.",
    notice: "If email delivery is configured, recovery instructions will be sent if this address has an account.",
    error: "Password recovery is not available until email delivery is configured.",
    submitted: "A kò tíì so iṣẹ́ ìpadàbọ̀ pọ̀ mọ́ ọn",
    brand: "Ó yẹ kí o lè padà sí ìtàn rẹ.",
    brandText: "Pa àwọn ìpolongo rẹ àti àwọn olùrànlọ́wọ́ rẹ mọ́ra.",
  },
};

export default function ForgotPassword() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("pasteme_language") || "en"
  );
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const t = copy[language] || copy.en;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message || t.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link to="/" className="auth-logo">paste<span>me</span><i>.</i></Link>
        <div className="auth-decoration decoration-one" />
        <div className="auth-decoration decoration-two" />
        <div className="auth-visual-content">
          <span className="auth-visual-eyebrow">PASTEME ACCOUNT</span>
          <h1>{t.brand}</h1>
          <p>{t.brandText}</p>
          <div className="auth-visual-mark"><span>✳</span><span>YOUR STORY. YOUR IMPACT.</span></div>
        </div>
        <div className="auth-visual-footer">Made for meaningful causes.</div>
      </section>

      <section className="auth-form-section">
        <div className="auth-topbar">
          <span className="auth-topbar-label">{t.eyebrow}</span>
          <div className="auth-language">
            <span>文</span>
            <select
              value={language}
              aria-label="Language"
              onChange={(event) => {
                setLanguage(event.target.value);
                localStorage.setItem("pasteme_language", event.target.value);
              }}
            >
              <option value="en">English</option>
              <option value="pcm">Pidgin</option>
              <option value="yo">Yorùbá</option>
            </select>
          </div>
        </div>

        <div className="auth-form-container">
          <span className="auth-form-eyebrow">{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p className="auth-form-subtitle">{t.subtitle}</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="recovery-email">{t.email}</label>
              <input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t.placeholder}
                autoComplete="email"
                required
              />
            </div>
            {submitted && <p className="auth-error" role="status">{t.notice}</p>}
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={submitted || submitting}>
              {submitting ? "Please wait..." : submitted ? t.submitted : t.submit}<span>↗</span>
            </button>
          </form>

          <div className="auth-demo-note"><span>✳</span><p>{t.note}</p></div>
          <div className="auth-switch"><Link to="/login">{t.back}</Link></div>
        </div>

        <footer className="auth-footer">
          <span>paste<span>me</span>.</span>
          <span>Made for meaningful causes.</span>
        </footer>
      </section>
    </main>
  );
}
