import { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import Icon from "../components/Icon";
import { apiRequest } from "../lib/api";
import "./Auth.css";

const copy = {
  en: {
    eyebrow: "ACCOUNT RECOVERY",
    brandEyebrow: "PASTEME ACCOUNT",
    brandMark: "YOUR STORY. YOUR IMPACT.",
    language: "Language",
    wait: "Just a moment...",
    title: "Forgot your password?",
    subtitle: "Enter the email connected to your PasteMe account.",
    email: "Email address",
    placeholder: "you@example.com",
    submit: "Continue",
    back: "Back to login",
    note: "If this email is linked to an account, we’ll send you instructions to reset your password.",
    notice: "Check your inbox for the next step. If you don’t see an email, check your spam folder too.",
    error: "We couldn’t send a reset link just now. Please try again.",
    submitted: "If there is an account with this email, we have sent the next steps.",
    brand: "Your story is worth coming back to.",
    brandText: "Keep your campaigns and the people supporting them close.",
    footer: "Made for meaningful causes.",
  },
  pcm: {
    eyebrow: "YOU FORGET PASSWORD?",
    brandEyebrow: "PASTEME ACCOUNT",
    brandMark: "YOUR STORY. YOUR IMPACT.",
    language: "Language",
    wait: "Just small moment...",
    title: "You forget your password?",
    subtitle: "Enter the email wey you use for your PasteMe account.",
    email: "Email address",
    placeholder: "you@example.com",
    submit: "Continue",
    back: "Go back to login",
    note: "If this email dey linked to an account, we go send you steps to reset your password.",
    notice: "Check your inbox. If you no see the email, check your spam folder too.",
    error: "We no fit send a reset link now. Abeg try again.",
    submitted: "If this email get account, we don send the next steps.",
    brand: "Your story dey worth coming back to.",
    brandText: "Keep your campaigns and the people wey support am close.",
    footer: "For causes wey matter.",
  },
  yo: {
    eyebrow: "ÌPADÀ SÍ ÀKÁǸTÌ",
    brandEyebrow: "ÀKÁǸTÌ PASTEME",
    brandMark: "ÌTÀN RẸ. IPA RẸ.",
    language: "Èdè",
    wait: "Ẹ dúró díẹ̀...",
    title: "Ṣé o gbàgbé ọ̀rọ̀ aṣínà rẹ?",
    subtitle: "Tẹ ímeèlì tó so mọ́ àkáǹtì PasteMe rẹ.",
    email: "Àdírẹ́sì ímeèlì",
    placeholder: "you@example.com",
    submit: "Tẹ̀síwájú",
    back: "Padà sí ìwọlé",
    note: "Tí ímeèlì yìí bá so mọ́ àkáǹtì kan, a ó fi ìtọ́sọ́nà ránṣẹ́ sí ọ láti tún ọ̀rọ̀ aṣínà rẹ ṣe.",
    notice: "Ṣàyẹ̀wò inbox rẹ. Tí o kò bá rí í, tún wo inú spam folder.",
    error: "A kò lè fi ìjápọ̀ tuntun ránṣẹ́ báyìí. Jọ̀wọ́ tún gbìyànjú.",
    submitted: "Tí ímeèlì yìí bá ní àkáǹtì, a ti fi àwọn ìgbésẹ̀ tó kàn ránṣẹ́.",
    brand: "Ó yẹ kí o lè padà sí ìtàn rẹ.",
    brandText: "Pa àwọn ìpolongo rẹ àti àwọn olùrànlọ́wọ́ rẹ mọ́ra.",
    footer: "A ṣe é fún àwọn ohun tó ṣe pàtàkì.",
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
      console.error("Password recovery request failed:", requestError);
      setError(t.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <BrandLogo className="auth-logo" />
        <div className="auth-decoration decoration-one" />
        <div className="auth-decoration decoration-two" />
        <div className="auth-visual-content">
          <span className="auth-visual-eyebrow">{t.brandEyebrow}</span>
          <h1>{t.brand}</h1>
          <p>{t.brandText}</p>
          <div className="auth-visual-mark"><Icon name="sparkles" size={18} /><span>{t.brandMark}</span></div>
        </div>
        <div className="auth-visual-footer">{t.footer}</div>
      </section>

      <section className="auth-form-section">
        <div className="auth-topbar">
          <span className="auth-topbar-label">{t.eyebrow}</span>
          <div className="auth-language">
            <Icon name="globe" size={16} />
            <select
              value={language}
              aria-label={t.language}
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
              {submitting ? t.wait : submitted ? t.submitted : t.submit}<Icon name="arrow-up-right" size={16} />
            </button>
          </form>

          <div className="auth-demo-note"><Icon name="info" size={16} /><p>{t.note}</p></div>
          <div className="auth-switch"><Link to="/login">{t.back}</Link></div>
        </div>

        <footer className="auth-footer">
          <BrandLogo className="auth-footer-logo" />
          <span>{t.footer}</span>
        </footer>
      </section>
    </main>
  );
}
