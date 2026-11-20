import { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import Icon from "../components/Icon";
import "./NotFound.css";

const copy = {
  en: {
    eyebrow: "PAGE NOT FOUND",
    title: "This page took a different path.",
    description: "The page may have moved, or the link may be incorrect.",
    action: "Return to PasteMe",
    language: "Language",
  },
  pcm: {
    eyebrow: "PAGE NO DEY",
    title: "This page don waka another road.",
    description: "The page fit don move, or the link no correct.",
    action: "Go back to PasteMe",
    language: "Language",
  },
  yo: {
    eyebrow: "OJÚ ÌWÉ KÒ SÍ",
    title: "Ojú ìwé yìí ti gba ọ̀nà mìíràn.",
    description: "Ó ṣeé ṣe kí ojú ìwé náà ti yí padà tàbí kí ìjápọ̀ náà kò tọ́.",
    action: "Padà sí PasteMe",
    language: "Èdè",
  },
};

export default function NotFound() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("pasteme_language") || "en"
  );
  const t = copy[language] || copy.en;

  function handleLanguageChange(event) {
    const selected = event.target.value;
    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  }

  return (
    <main className="not-found-page">
      <BrandLogo className="not-found-logo" />

      <label className="not-found-language">
        <span className="sr-only">{t.language}</span>
        <select value={language} onChange={handleLanguageChange} aria-label={t.language}>
          <option value="en">English</option>
          <option value="pcm">Pidgin</option>
          <option value="yo">Yorùbá</option>
        </select>
      </label>

      <span className="not-found-code" aria-hidden="true">404</span>
      <span className="not-found-eyebrow">{t.eyebrow}</span>
      <h1>{t.title}</h1>
      <p>{t.description}</p>
      <Link to="/" className="not-found-button">
        {t.action} <Icon name="arrow-up-right" size={16} />
      </Link>
    </main>
  );
}
