
import { useEffect, useState } from "react";
import "./CreCramp.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCampaignWalletAsset } from "../../lib/campaignStore";

const categories = [
  "Education",
  "Medical",
  "Community",
  "Personal",
  "Business",
  "Other",
];

const translations = {
  en: {
    creating: "Creating a campaign", dashboard: "Dashboard", introTag: "YOUR NEXT CHAPTER STARTS HERE",
    hero1: "Every great", hero2: "story starts", hero3: "with a", heroAccent: "little help.",
    introText: "Turn your idea into something people can believe in. Create a campaign, share your story, and let people be part of making it happen.",
    noteTitle: "Made for meaningful causes.", noteText: "Your story deserves a place to be heard.",
    campaignDetails: "CAMPAIGN DETAILS", formTitle: "Let's get started.", formSubtitle: "Tell us a little about what you're raising for.",
    title: "Campaign title", titlePlaceholder: "Give your campaign a name", cover: "Campaign cover image", optional: "Optional",
    category: "Category", chooseCategory: "Select a category", story: "Your story", storyPlaceholder: "What are you raising funds for? Why does it matter?",
    goal: "Fundraising goal", deadline: "Deadline", openEnded: "Keep this campaign open-ended", wallet: "Receiving wallet",
    walletHelp: "Where your contributions will be received", walletLabel: "Open Payments wallet address URL", walletPlaceholder: "https://...",
    walletPrivate: "Your receiving wallet is stored securely and only used to receive contributions.", continue: "Continue to preview", terms: "By continuing, you agree to PasteMe's terms of service.",
    invalidImage: "Choose an image file.", imageLarge: "Please choose an image smaller than 1 MB.", imageRead: "The image could not be loaded. Try another file.", removeImage: "Remove image",
    required: "Complete the campaign title, category and story.", invalidGoal: "Enter a fundraising goal greater than zero.", deadlineRequired: "Choose a deadline or select an open-ended campaign.",
    deadlinePast: "The campaign deadline must be in the future.", invalidWallet: "Enter a valid HTTPS receiving wallet URL.", walletRequired: "Add an HTTPS Open Payments receiving wallet before publishing.",
    walletChecking: "Checking wallet currency...", walletCurrencyError: "Unable to verify the receiving wallet currency.",
  },
  pcm: {
    creating: "You dey create campaign", dashboard: "Dashboard", introTag: "YOUR NEXT CHAPTER STARTS HERE",
    hero1: "Every great", hero2: "story dey start", hero3: "with small", heroAccent: "help.",
    introText: "Turn your idea to something wey people fit believe. Create campaign, share your story, make people join you.",
    noteTitle: "For causes wey matter.", noteText: "Your story deserve make people hear am.",
    campaignDetails: "CAMPAIGN DETAILS", formTitle: "Make we start.", formSubtitle: "Tell us wetin you dey raise money for.",
    title: "Campaign title", titlePlaceholder: "Give your campaign name", cover: "Campaign cover image", optional: "Optional",
    category: "Category", chooseCategory: "Choose category", story: "Your story", storyPlaceholder: "Wetin you dey raise money for? Why e matter?",
    goal: "Fundraising target", deadline: "Deadline", openEnded: "Make this campaign no get deadline", wallet: "Receiving wallet",
    walletHelp: "Where people go send contributions", walletLabel: "Open Payments wallet address URL", walletPlaceholder: "https://...",
    walletPrivate: "Your receiving wallet is stored securely and only used to receive contributions.", continue: "Continue to preview", terms: "By continuing, you agree to PasteMe terms.",
    invalidImage: "Choose image file.", imageLarge: "Choose image wey small pass 1 MB.", imageRead: "Image no fit load. Try another one.", removeImage: "Remove image",
    required: "Complete campaign title, category and story.", invalidGoal: "Enter fundraising target wey pass zero.", deadlineRequired: "Choose deadline or select open-ended campaign.",
    deadlinePast: "Campaign deadline must dey future.", invalidWallet: "Enter correct HTTPS receiving wallet URL.", walletRequired: "Add an HTTPS Open Payments receiving wallet before publishing.",
    walletChecking: "We dey check wallet currency...", walletCurrencyError: "We no fit verify the receiving wallet currency.",
  },
  yo: {
    creating: "Ṣíṣẹ̀dá ìpolongo", dashboard: "Ojú ìṣàkóso", introTag: "ÌGBÉSẸ̀ TÍ Ó TỌ̀ WÁ BẸ̀RẸ̀ NÍBÍ",
    hero1: "Gbogbo ìtàn rere", hero2: "máa ń bẹ̀rẹ̀", hero3: "pẹ̀lú", heroAccent: "ìrànlọ́wọ́ díẹ̀.",
    introText: "Yí èrò rẹ padà sí ohun tí àwọn ènìyàn lè gbàgbọ́. Ṣẹ̀dá ìpolongo, pín ìtàn rẹ, kí àwọn ènìyàn lè kópa.",
    noteTitle: "A ṣe é fún àwọn ohun tó ṣe pàtàkì.", noteText: "Ó yẹ kí àwọn ènìyàn gbọ́ ìtàn rẹ.",
    campaignDetails: "ÀLÀYÉ ÌPOLONGO", formTitle: "Ẹ jẹ́ ká bẹ̀rẹ̀.", formSubtitle: "Sọ díẹ̀ nípa ohun tí o fẹ́ kó owó jọ fún.",
    title: "Àkọlé ìpolongo", titlePlaceholder: "Fún ìpolongo rẹ ní orúkọ", cover: "Àwòrán ìborí ìpolongo", optional: "Kò pọndandan",
    category: "Ẹ̀ka", chooseCategory: "Yan ẹ̀ka kan", story: "Ìtàn rẹ", storyPlaceholder: "Kí ni o ń kó owó jọ fún? Kí ló dé tí ó fi ṣe pàtàkì?",
    goal: "Àfojúsùn owó", deadline: "Ọjọ́ ìparí", openEnded: "Jẹ́ kí ìpolongo yìí má ní ọjọ́ ìparí", wallet: "Àpò owó ìgbàwọlé",
    walletHelp: "Ibi tí a ó ti gba owó ìrànlọ́wọ́ rẹ", walletLabel: "Open Payments wallet address URL", walletPlaceholder: "https://...",
    walletPrivate: "Your receiving wallet is stored securely and only used to receive contributions.", continue: "Tẹ̀síwájú sí àyẹ̀wò", terms: "Nípa títẹ̀síwájú, o gbà sí àwọn òfin PasteMe.",
    invalidImage: "Yan fáìlì àwòrán kan.", imageLarge: "Jọ̀wọ́ yan àwòrán tó kéré sí 1 MB.", imageRead: "A kò lè ṣí àwòrán yìí. Gbìyànjú òmíràn.", removeImage: "Yọ àwòrán kúrò",
    required: "Kún àkọlé, ẹ̀ka àti ìtàn ìpolongo náà.", invalidGoal: "Tẹ àfojúsùn owó tó ju òdo lọ.", deadlineRequired: "Yan ọjọ́ ìparí tàbí yan ìpolongo tí kò ní ọjọ́ ìparí.",
    deadlinePast: "Ọjọ́ ìparí ìpolongo gbọ́dọ̀ jẹ́ ọjọ́ iwájú.", invalidWallet: "Tẹ URL àpò owó HTTPS tó tọ́.", walletRequired: "Add an HTTPS Open Payments receiving wallet before publishing.",
    walletChecking: "A ń ṣàyẹ̀wò owó àpò rẹ...", walletCurrencyError: "A kò lè jẹ́rìí owó àpò ìgbàwọlé.",
  },
};

const categoryLabels = {
  Education: { en: "Education", pcm: "Education", yo: "Ẹ̀kọ́" },
  Medical: { en: "Medical", pcm: "Health", yo: "Ìlera" },
  Community: { en: "Community", pcm: "Community", yo: "Àwùjọ" },
  Personal: { en: "Personal", pcm: "Personal", yo: "Ti ara ẹni" },
  Business: { en: "Business", pcm: "Business", yo: "Iṣòwò" },
  Other: { en: "Other", pcm: "Other", yo: "Òmíràn" },
};


export default function CreateCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [language, setLanguage] = useState(() => localStorage.getItem("pasteme_language") || "en");
  const t = translations[language] || translations.en;

  const draftKey = `pasteme_campaign_draft:${user?.email?.toLowerCase() || "guest"}`;

  const emptyCampaign = {
  title: "",
  category: "",
  story: "",
  target: "",
  deadline: "",
  openEnded: false,
  walletAddress: "",
  currency: "",
  assetScale: 2,
  coverImage: "",
};

const [formData, setFormData] = useState(() => {
  // Prioritize campaign data returned from the Preview page.
  if (location.state?.campaign) {
    return {
      ...emptyCampaign,
      ...location.state.campaign,
    };
  }

  // Restore the public campaign draft after a page refresh.
  try {
    const savedDraft = sessionStorage.getItem(
      draftKey
    );

    return savedDraft
      ? {
          ...emptyCampaign,
          ...JSON.parse(savedDraft),
        }
      : emptyCampaign;
  } catch {
    return emptyCampaign;
  }
});

  // Keep a creator-specific draft so refreshing the page does not erase work.
  // Receiving wallet details are excluded from browser storage.
  useEffect(() => {
    const safeDraft = { ...formData };
    delete safeDraft.walletAddress;
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(safeDraft));
    } catch (error) {
      console.warn("Could not save the campaign draft in this browser:", error);
    }
  }, [formData, draftKey]);

  const [showWallet, setShowWallet] = useState(true);
  const [formError, setFormError] = useState("");
  const [imageError, setImageError] = useState("");
  const [resolvingWallet, setResolvingWallet] = useState(false);

  const handleLanguageChange = (event) => {
    const selected = event.target.value;
    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormError("");
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError(t.invalidImage);
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setImageError(t.imageLarge);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, coverImage: String(reader.result) }));
    };
    reader.onerror = () => setImageError(t.imageRead);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const target = Number(formData.target);
    if (!formData.title.trim() || !formData.category || !formData.story.trim()) {
      setFormError(t.required);
      return;
    }

    if (!Number.isFinite(target) || target <= 0) {
      setFormError(t.invalidGoal);
      return;
    }

    if (!formData.openEnded && !formData.deadline) {
      setFormError(t.deadlineRequired);
      return;
    }

    if (formData.deadline && !formData.openEnded) {
      const selectedDate = new Date(`${formData.deadline}T23:59:59`);
      if (selectedDate < new Date()) {
        setFormError(t.deadlinePast);
        return;
      }
    }

    if (!formData.walletAddress.trim()) {
      setFormError(t.walletRequired);
      setShowWallet(true);
      return;
    }

    if (formData.walletAddress.trim()) {
      try {
        const walletUrl = new URL(formData.walletAddress.trim());
        if (walletUrl.protocol !== "https:") throw new Error("HTTPS required");
      } catch {
        setFormError(t.invalidWallet);
        return;
      }
    }

    setResolvingWallet(true);
    let walletAsset;
    try {
      walletAsset = await getCampaignWalletAsset(formData.walletAddress.trim());
    } catch (error) {
      setFormError(error.message || t.walletCurrencyError);
      setResolvingWallet(false);
      return;
    }
    setResolvingWallet(false);

    const draft = {
      ...formData,
      title: formData.title.trim(),
      story: formData.story.trim(),
      target: String(target),
      currency: walletAsset.currency,
      assetScale: walletAsset.assetScale,
      creatorId: user?.id,
      ownerEmail: user?.email?.toLowerCase(),
    };

    // The wallet URL stays in navigation memory and is never written to
    // public campaign storage or the local draft persisted in sessionStorage.
    const safeDraft = { ...draft };
    delete safeDraft.walletAddress;
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(safeDraft));
    } catch (storageError) {
      // Navigation state still carries this draft for the current flow.
      console.warn("Could not persist this draft in the browser:", storageError);
    }

    navigate("/campaign-preview", {
      state: { campaign: draft },
    });
  };

  return (
    <main className="create-page">
      <nav className="create-nav">
        <Link to="/dashboard" className="create-logo">
          paste<span>me</span>
          <i>.</i>
        </Link>

        <div className="create-nav-right">
          <span>{t.creating}</span>
          <select className="create-language-select" value={language} onChange={handleLanguageChange} aria-label="Language">
            <option value="en">English</option>
            <option value="pcm">Pidgin</option>
            <option value="yo">Yorùbá</option>
          </select>
          <div className="creator-avatar" aria-label={user?.name || "Creator"}>
            {(user?.name || "C").trim().charAt(0).toUpperCase()}
          </div>
          <button type="button" className="create-dashboard-link" onClick={() => navigate("/dashboard")}>
            {t.dashboard}
          </button>
        </div>
      </nav>

      <section className="create-layout">

        {/* LEFT CONTENT */}
        <aside className="create-intro">

          <div className="intro-tag">
            <span className="intro-dot" />
            {t.introTag}
          </div>

          <div className="intro-content">
            <h1>
              {t.hero1}
              <br />
              {t.hero2}
              <br />
              {t.hero3} <span>{t.heroAccent}</span>
            </h1>

            <p>
              {t.introText}
            </p>
          </div>

          <div className="create-note">
            <div className="note-icon">✳</div>
            <div>
              <strong>{t.noteTitle}</strong>
              <span>
                {t.noteText}
              </span>
            </div>
          </div>

          <div className="intro-footer">
            <span>01 — CREATE</span>
            <span>02 — SHARE</span>
            <span>03 — MAKE IT HAPPEN</span>
          </div>

        </aside>

        {/* RIGHT FORM */}
        <section className="create-form-section">

          <div className="form-heading">
            <div>
              <span className="form-eyebrow">{t.campaignDetails}</span>
              <h2>{t.formTitle}</h2>
              <p>{t.formSubtitle}</p>
            </div>

            <span className="form-step">01 / 01</span>
          </div>

          <form onSubmit={handleSubmit} className="campaign-form">

            <div className="form-group">
              <label htmlFor="title">{t.title}</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder={t.titlePlaceholder}
                value={formData.title}
                onChange={handleChange}
                maxLength={80}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverImageInput">{t.cover} <span className="optional-label">{t.optional}</span></label>
              <input
                id="coverImageInput"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleCoverChange}
              />
              {imageError && <small className="create-error">{imageError}</small>}
              {formData.coverImage && (
                <div className="create-cover-preview">
                  <img src={formData.coverImage} alt="Campaign cover preview" />
                  <button type="button" onClick={() => setFormData((prev) => ({ ...prev, coverImage: "" }))}>{t.removeImage}</button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">{t.category}</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">{t.chooseCategory}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]?.[language] || category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="story">{t.story}</label>
              <textarea
                id="story"
                name="story"
                placeholder={t.storyPlaceholder}
                value={formData.story}
                onChange={handleChange}
                maxLength={1500}
                rows={3}
                required
              />
              <span className="character-count">
                {formData.story.length}/1500
              </span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="target">
                  {t.goal}{formData.currency ? ` (${formData.currency})` : ""}
                </label>
                <div className="input-with-prefix">
                <span>{formData.currency || "¤"}</span>
                  <input
                    id="target"
                    name="target"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 500,000"
                    value={formData.target}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="deadline">{t.deadline}</label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  disabled={formData.openEnded}
                  required={!formData.openEnded}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <label className="open-ended-option">
              <input
                type="checkbox"
                name="openEnded"
                checked={formData.openEnded}
                onChange={handleChange}
              />
              <span>{t.openEnded}</span>
            </label>

            <div className="wallet-section">
              <button
                type="button"
                className="wallet-toggle"
                onClick={() => setShowWallet(!showWallet)}
              >
                <span>
                  <strong>{t.wallet}</strong>
                  <small>{t.walletHelp}</small>
                </span>
                <span>{showWallet ? "−" : "+"}</span>
              </button>

              {showWallet && (
                <div className="form-group wallet-input">
                  <label htmlFor="walletAddress">
                    {t.walletLabel}
                  </label>
                  <input
                    id="walletAddress"
                    name="walletAddress"
                    type="url"
                    placeholder={t.walletPlaceholder}
                    value={formData.walletAddress}
                    onChange={handleChange}
                    required
                  />
                  <small>
                    {t.walletPrivate}
                  </small>
                </div>
              )}
            </div>

            {formError && <p className="create-error" role="alert">{formError}</p>}

            <button type="submit" className="create-submit" disabled={resolvingWallet}>
              {resolvingWallet ? t.walletChecking : t.continue}
              <span>↗</span>
            </button>

            <p className="form-disclaimer">
              {t.terms}
            </p>

          </form>
        </section>

      </section>
    </main>
  );
}