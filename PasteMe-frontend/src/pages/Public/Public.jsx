
import { useEffect, useMemo, useState } from "react";
import { getCategoryLabel } from "../../lib/categoryLabels";
import { useNavigate, useParams } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo";
import Icon from "../../components/Icon";
import { getPublishedCampaign } from "../../lib/campaignStore";
import { copyText } from "../../lib/clipboard";
import { formatMoney } from "../../lib/money";
import "./Public.css";

const translations = {
  en: {
    live: "LIVE CAMPAIGN",
    raised: "raised",
    goal: "Goal",
    supporters: "supporters",
    deadline: "Deadline",
    open: "Open-ended",
    story: "THE STORY",
    donate: "Make a contribution",
    share: "Share campaign",
    copy: "Copy link",
    copied: "Link copied!",
    copyFailed: "Could not copy link",
    shareMessage: "Support this campaign on PasteMe.",
    contributions: "Every contribution makes a difference.",
    noAccountNote: "No PasteMe account needed. Contribute directly from checkout.",
    noGoal: "No fundraising goal set",
    by: "Started by",
    university: "University",
    
    notFound: "Campaign not found",
    notFoundText: "This campaign may be unavailable or may not have been published.",
    home: "Back to PasteMe",
    loading: "Loading campaign...",
    viewGoal: "Fundraising goal",
    coverLine: "YOUR STORY. YOUR IMPACT.",
    footerLine: "Every story deserves a chance.",
    ended: "CAMPAIGN ENDED",
    campaignEnded: "Campaign ended",
    campaignEndedMessage: "This campaign has reached its deadline. Contributions are closed.",
  },

  pcm: {
    live: "CAMPAIGN DEY LIVE",
    raised: "don enter",
    goal: "Target",
    supporters: "people don support",
    deadline: "Deadline",
    open: "No fixed deadline",
    story: "THE STORY",
    donate: "Contribute",
    share: "Share campaign",
    copy: "Copy link",
    copied: "Don copy!",
    copyFailed: "Copy no work",
    shareMessage: "Support this campaign for PasteMe.",
    contributions: "Every contribution get meaning.",
    noAccountNote: "You no need PasteMe account. Contribute straight from checkout.",
    noGoal: "No fundraising target set",
    by: "Started by",
    university: "University",
    
    notFound: "We no fit find this campaign",
    notFoundText: "This campaign fit no dey available or dem never publish am.",
    home: "Go back to PasteMe",
    loading: "Campaign dey load...",
    viewGoal: "Fundraising target",
    coverLine: "YOUR STORY. YOUR IMPACT.",
    footerLine: "Every story get a chance.",
    ended: "CAMPAIGN DON END",
    campaignEnded: "Campaign don end",
    campaignEndedMessage: "This campaign don reach deadline. Contribution don close.",
  },

  yo: {
    live: "ÌPOLONGO Ń LỌ LỌ́WỌ́",
    raised: "owó tí a ti gbà",
    goal: "Àfojúsùn",
    supporters: "àwọn olùrànlọ́wọ́",
    deadline: "Ọjọ́ ìparí",
    open: "Kò ní ọjọ́ ìparí",
    story: "ÌTÀN ÌPOLONGO",
    donate: "Ṣètọrẹ",
    share: "Pín ìpolongo",
    copy: "Da ìjápọ̀ kọ",
    copied: "A ti da ìjápọ̀ kọ!",
    copyFailed: "A kò lè da ìjápọ̀ kọ",
    shareMessage: "Ṣètìlẹ́yìn fún ìpolongo yìí ní PasteMe.",
    contributions: "Gbogbo ìrànlọ́wọ́ ní ìtumọ̀.",
    noAccountNote: "O kò nílò àkáǹtì PasteMe. O lè ṣètọrẹ tààrà láti ojú ìsanwó.",
    noGoal: "A kò yan àfojúsùn owó",
    by: "Ẹni tó bẹ̀rẹ̀ rẹ̀",
    university: "Ilé-ẹ̀kọ́ gíga",
    
    notFound: "A kò rí ìpolongo yìí",
    notFoundText: "Ó ṣeé ṣe kí ìpolongo yìí kò sí mọ́ tàbí kí a kò tíì tẹ̀ ẹ jáde.",
    home: "Padà sí PasteMe",
    loading: "A ń ṣí ìpolongo...",
    viewGoal: "Àfojúsùn ìkójọ owó",
    coverLine: "ÌTÀN RẸ. IPA RẸ.",
    footerLine: "Gbogbo ìtàn yẹ fún àǹfààní.",
    ended: "ÌPOLONGO TI PARÍ",
    campaignEnded: "Ìpolongo ti parí",
    campaignEndedMessage: "Ìpolongo yìí ti dé ọjọ́ ìparí rẹ. A ti dá ìtọrẹ dúró.",
  },
};


export default function PublicCampaign() {
  const { campaignId } = useParams();
  const [renderedAt] = useState(() => Date.now());
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(Boolean(campaignId));
  const [error, setError] = useState(!campaignId);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("pasteme_language") || "en";
  });

  const t = translations[language] || translations.en;

  const campaignUrl = useMemo(() => {
    if (!campaignId) return "";

    return `${window.location.origin}/c/${encodeURIComponent(campaignId)}`;
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) return undefined;

    const controller = new AbortController();

    async function loadCampaign() {
      try {
        const publicCampaign = await getPublishedCampaign(campaignId, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (
          String(publicCampaign.id) !== String(campaignId) ||
          publicCampaign.status !== "published"
        ) {
          throw new Error("Campaign is not available.");
        }

        if (!controller.signal.aborted) {
          setCampaign(publicCampaign);
          setError(false);
        }
      } catch (requestError) {
        if (requestError.name === "AbortError") return;
        console.error("Campaign retrieval failed:", requestError);
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadCampaign();
    return () => controller.abort();
  }, [campaignId]);

  const handleLanguageChange = (e) => {
    const selected = e.target.value;

    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  };

  const handleCopy = async () => {
    setCopied(false);
    setCopyError(false);
    try {
      await copyText(campaignUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyError(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: t.shareMessage,
          url: campaignUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <main className="public-state">
        <div className="public-loading-mark">p.</div>
        <p>{t.loading}</p>
      </main>
    );
  }

  if (error || !campaign) {
    return (
      <main className="public-state">
        <BrandLogo className="public-logo" />

        <h1>{t.notFound}</h1>
        <p>{t.notFoundText}</p>

        <button
          className="public-primary-button"
          onClick={() => navigate("/")}
        >
          {t.home}
        </button>
      </main>
    );
  }

  const target = Number(campaign.target) || 0;
  const hasGoal = campaign.target !== null && campaign.target !== undefined && campaign.target !== "" && target > 0;
  const raised = Number(campaign.raised) || 0;

  const progress = hasGoal
    ? Math.min((raised / target) * 100, 100)
    : 0;
  const creatorName = campaign.creator?.displayName || campaign.creator?.name || campaign.creatorName || campaign.owner?.name || "";
  const university = campaign.university || campaign.creatorUniversity || campaign.creator?.university || campaign.owner?.university || "";

  const category =
    getCategoryLabel(campaign.category, language);

  const deadline = campaign.openEnded
    ? t.open
    : campaign.deadline
      ? new Date(campaign.deadline).toLocaleDateString(
          language === "yo" ? "yo-NG" : "en-NG",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "—";

  const contributorCount = Number(campaign.contributors) || 0;
  const campaignEnded = Boolean(
    !campaign.openEnded &&
    campaign.deadline &&
    new Date(`${campaign.deadline}T23:59:59`).getTime() < renderedAt
  );

  return (
    <main className="public-page">

      {/* NAVIGATION */}
      <nav className="public-nav">
        <BrandLogo className="public-logo" />

        <div className="public-nav-right">

          <div className="public-live">
            <span />
            {t.live}
          </div>

          <div className="public-language">
            <Icon name="globe" size={16} />
            <select
              value={language}
              onChange={handleLanguageChange}
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="pcm">Pidgin</option>
              <option value="yo">Yorùbá</option>
            </select>
          </div>

        </div>
      </nav>

      {/* HERO */}
      <section className="public-hero">

        <div className="public-hero-image">
          {campaign.coverImage ? (
            <img
              src={campaign.coverImage}
              alt={campaign.title}
            />
          ) : (
            <div className="public-image-placeholder">
              <Icon name="heart-handshake" size={32} />
              <p>{t.coverLine}</p>
            </div>
          )}
        </div>

        <div className="public-hero-overlay" />

        <div className="public-hero-content">
          <span className="public-category">{category}</span>
          <h1>{campaign.title}</h1>
          {(creatorName || university) && (
            <div className="public-creator-meta">
              {creatorName && <span>{t.by} {creatorName}</span>}
              {university && <span><Icon name="map-pin" size={13} />{university}</span>}
            </div>
          )}

          <div className="public-hero-meta">
            <span className="public-live"><i /> {campaignEnded ? t.ended : t.live}</span>
          </div>
        </div>

      </section>

      {/* MAIN CONTENT */}
      <section className="public-layout">

        {/* STORY */}
        <article className="public-story-section">

          <span className="public-eyebrow">{t.story}</span>

          <div className="public-story-text">
            {campaign.story}
          </div>

          <div className="public-story-bottom">
            <Icon name="heart-handshake" size={18} />
            <p>{t.contributions}</p>
          </div>

        </article>

        {/* DONATION PANEL */}
        <aside className="public-donation-card">

          <div className="public-raised-label">{t.raised}</div>

          <div className="public-raised-amount">
            {formatMoney(raised, campaign.currency, campaign.assetScale)}
          </div>

          {hasGoal ? (
            <>
              <div className="public-goal-row">
                <span>{t.viewGoal}</span>
                <strong>{formatMoney(target, campaign.currency, campaign.assetScale)}</strong>
              </div>
              <div
                className="public-progress-track"
                role="progressbar"
                aria-label={t.viewGoal}
                aria-valuenow={Math.round(progress)}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div className="public-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="public-progress-info">
                <strong>{Math.round(progress)}%</strong>
                <span>{contributorCount} {t.supporters}</span>
              </div>
            </>
          ) : (
            <div className="public-no-goal-note">
              <span>{t.noGoal}</span>
              <strong>{contributorCount} {t.supporters}</strong>
            </div>
          )}

          <div className="public-donation-divider" />

          <div className="public-deadline">
            <span>{t.deadline}</span>
            <strong>{deadline}</strong>
          </div>

          {campaignEnded && (
            <p className="public-campaign-ended" role="status">
              {t.campaignEndedMessage}
            </p>
          )}

          <button
            className="public-donate-button"
            disabled={campaignEnded}
            onClick={() =>
              navigate(`/c/${encodeURIComponent(campaign.id)}/donate`)
            }
          >
            {campaignEnded ? t.campaignEnded : t.donate}
            {!campaignEnded && <Icon name="arrow-up-right" size={17} />}
          </button>

          <p className="public-no-account">
            <Icon name="check-circle" size={15} />
            {t.noAccountNote}
          </p>

          <button
            className="public-share-button"
            onClick={handleShare}
          >
            <Icon name="share" size={16} /> {t.share}
          </button>

          <button
            className="public-copy-button"
            onClick={handleCopy}
          >
            {copied ? t.copied : t.copy}
          </button>
          {copyError && <p className="public-copy-error" role="alert">{t.copyFailed}</p>}

        </aside>

      </section>

      {/* FOOTER */}
      <footer className="public-footer">
        <BrandLogo className="public-footer-logo" />
        <p>{t.footerLine}</p>
      </footer>

    </main>
  );
}
