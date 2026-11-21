
import { useEffect, useMemo, useState } from "react";
import { getCategoryLabel } from "../../lib/categoryLabels";
import { useNavigate, useParams } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo";
import Icon from "../../components/Icon";
import { getOwnerCampaign } from "../../lib/campaignStore";
import { copyText } from "../../lib/clipboard";
import { formatMoney } from "../../lib/money";
import QRCode from "qrcode";
import "./Published.css";

const translations = {
  en: {
    eyebrow: "CAMPAIGN PUBLISHED",
    title: "Your story is ready to travel.",
    subtitle:
      "Your campaign is live. Share your link or QR code and invite people to be part of your story.",
    live: "LIVE CAMPAIGN",
    details: "CAMPAIGN DETAILS",
    raised: "raised so far",
    goal: "fundraising goal",
    noGoal: "No goal set", by: "Started by", university: "University",
    deadline: "CAMPAIGN DEADLINE",
    openEnded: "Open-ended",
    contributions: "contributions",
    shareTitle: "Let your story reach further.",
    shareSubtitle:
      "Share your campaign link or let someone scan your QR code.",
    linkLabel: "YOUR CAMPAIGN LINK",
    copy: "Copy campaign link",
    copied: "Copied!",
    copyError: "Copy failed. Select the link above to copy it.",
    share: "Share campaign",
    download: "Download QR code",
    view: "View public campaign",
    notice:
      "Anyone can view this page. People will sign in or create a free account before contributing.",
    authoredNote:
      "Your campaign title and story remain in the language you wrote them in. This selector translates the PasteMe interface.",
    newCampaign: "Create another campaign",
    notFound: "We couldn't find this campaign.",
    notFoundSubtitle:
      "This campaign may not have been published or may no longer be available.",
    create: "Create a campaign",
    generating: "Generating QR code...",
    qrError: "Unable to generate QR code.",
    shareMessage: "Take a look at my campaign on PasteMe.",
    category: "Category",
    dashboard: "Dashboard",
    editCampaign: "Edit campaign",
    nextStep: "YOUR NEXT STEP",
    scanOpen: "SCAN TO OPEN",
    scanCaption: "One scan brings people to your story.",
    loading: "Loading campaign...",
  },

  pcm: {
    eyebrow: "CAMPAIGN DON PUBLISH",
    title: "Your story don ready to waka.",
    subtitle:
      "Your campaign don go live. Share your link or QR code make people fit join your story.",
    live: "CAMPAIGN DEY LIVE",
    details: "CAMPAIGN DETAILS",
    raised: "Money wey don enter",
    goal: "Money wey you dey target",
    noGoal: "No target set", by: "Started by", university: "University",
    deadline: "CAMPAIGN DEADLINE",
    openEnded: "No fixed deadline",
    contributions: "people don contribute",
    shareTitle: "Make your story reach more people.",
    shareSubtitle:
      "Share your campaign link or make person scan your QR code.",
    linkLabel: "YOUR CAMPAIGN LINK",
    copy: "Copy campaign link",
    copied: "Don copy!",
    copyError: "Copy no work. Select the link above and copy am.",
    share: "Share campaign",
    download: "Download QR code",
    view: "See public campaign",
    notice:
      "Anybody fit view this page. People go log in or create free account before dem contribute.",
    authoredNote:
      "Your campaign title and story go remain the language wey you write am. This selector dey translate only PasteMe interface.",
    newCampaign: "Create another campaign",
    notFound: "We no fit find this campaign.",
    notFoundSubtitle:
      "E fit never publish or e no dey available again.",
    create: "Create campaign",
    generating: "QR code dey generate...",
    qrError: "QR code no fit generate.",
    shareMessage: "Check my campaign for PasteMe.",
    category: "Category",
    dashboard: "Dashboard",
    editCampaign: "Edit campaign",
    nextStep: "WETIN TO DO NEXT",
    scanOpen: "SCAN AM TO OPEN",
    scanCaption: "One scan go carry people reach your story.",
    loading: "Campaign dey load...",
  },

  yo: {
    eyebrow: "A TI TẸ ÌPOLONGO RẸ JÁDE",
    title: "Ìtàn rẹ ti ṣetán láti dé ọ̀dọ̀ àwọn ènìyàn.",
    subtitle:
      "Ìpolongo rẹ ti wà lórí ayélujára. Pín ìjápọ̀ tàbí kóòdù QR rẹ kí àwọn ènìyàn lè kópa.",
    live: "ÌPOLONGO TÍ Ó Ń LỌ LỌ́WỌ́",
    details: "ÀLÀYÉ ÌPOLONGO",
    raised: "owó tí a ti gbà",
    goal: "àfojúsùn owó",
    noGoal: "Kò sí àfojúsùn", by: "Ẹni tó bẹ̀rẹ̀ rẹ̀", university: "Ilé-ẹ̀kọ́ gíga",
    deadline: "ỌJỌ́ ÌPARÍ ÌPOLONGO",
    openEnded: "Kò ní ọjọ́ ìparí",
    contributions: "ìrànlọ́wọ́",
    shareTitle: "Jẹ́ kí ìtàn rẹ dé ọ̀dọ̀ púpọ̀ sí i.",
    shareSubtitle:
      "Pín ìjápọ̀ ìpolongo rẹ tàbí jẹ́ kí ẹnikan ṣàyẹ̀wò kóòdù QR rẹ.",
    linkLabel: "ÌJÁPỌ̀ ÌPOLONGO RẸ",
    copy: "Da ìjápọ̀ kọ",
    copied: "A ti da á kọ!",
    copyError: "A kò lè da á kọ. Yan ìjápọ̀ tó wà lókè kí o sì da á kọ.",
    share: "Pín ìpolongo",
    download: "Ṣe igbasilẹ kóòdù QR",
    view: "Wo ojú ìwé ìpolongo",
    notice:
      "Ẹnikẹ́ni lè wo ojú ìwé yìí. Àwọn ènìyàn yóò wọlé tàbí ṣẹ̀dá àkáǹtì ọ̀fẹ́ kí wọ́n tó ṣètọrẹ.",
    authoredNote:
      "Àkọlé àti ìtàn ìpolongo rẹ yóò dúró ní èdè tí o fi kọ wọ́n. Aṣàyàn yìí ń túmọ̀ àfihàn PasteMe nìkan.",
    newCampaign: "Ṣẹ̀dá ìpolongo míì",
    notFound: "A kò rí ìpolongo yìí.",
    notFoundSubtitle:
      "Ó ṣeé ṣe kí a kò tíì tẹ̀ ẹ jáde tàbí pé kò sí mọ́.",
    create: "Ṣẹ̀dá ìpolongo",
    generating: "A ń ṣẹ̀dá kóòdù QR...",
    qrError: "A kò lè ṣẹ̀dá kóòdù QR.",
    shareMessage: "Wò ó, ìpolongo mi wà ní PasteMe.",
    category: "Ẹ̀ka",
    dashboard: "Ojú ìṣàkóso",
    editCampaign: "Ṣàtúnṣe ìpolongo",
    nextStep: "ÌGBÉSẸ̀ TÓ KAN",
    scanOpen: "ṢÀYẸ̀WÒ LÁTI ṢÍ I",
    scanCaption: "Ṣàyẹ̀wò ẹ̀ẹ̀kan láti dé ibi ìtàn rẹ.",
    loading: "A ń ṣí ìpolongo...",
  },
};


export default function CampaignPublished() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  const campaignUrl = useMemo(() => {
    if (!campaign?.id) return "";

    return `${window.location.origin}/c/${encodeURIComponent(
      campaign.id
    )}`;
  }, [campaign]);

  const [qrState, setQrState] = useState({
    campaignUrl: "",
    dataUrl: "",
    error: false,
  });
  const qrCode = qrState.campaignUrl === campaignUrl ? qrState.dataUrl : "";
  const qrError = qrState.campaignUrl === campaignUrl && qrState.error;
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("pasteme_language") || "en";
  });

  const t = translations[language] || translations.en;

  useEffect(() => {
    let active = true;
    getOwnerCampaign(campaignId)
      .then((result) => {
        if (active) setCampaign(result);
      })
      .catch((error) => {
        console.error("Could not load campaign:", error);
        if (active) setCampaign(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [campaignId]);

  // Generate campaign QR code.
  useEffect(() => {
    if (!campaignUrl) return undefined;

    let cancelled = false;

    QRCode.toDataURL(campaignUrl, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#302B32",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (!cancelled) {
          setQrState({ campaignUrl, dataUrl: url, error: false });
        }
      })
      .catch((error) => {
        console.error("QR generation failed:", error);
        if (!cancelled) {
          setQrState({ campaignUrl, dataUrl: "", error: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [campaignUrl]);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    setLanguage(selectedLanguage);
    localStorage.setItem("pasteme_language", selectedLanguage);
  };

  const handleCopyLink = async () => {
    setCopied(false);
    setCopyFailed(false);

    try {
      await copyText(campaignUrl);
      setCopied(true);

      window.setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error("Copy failed:", error);
      setCopyFailed(true);
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
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Native sharing failed:", error);
      }
    }

    handleCopyLink();
  };

  const handleNewCampaign = () => {
    navigate("/create");
  };

  const handleEditCampaign = () => {
    navigate("/create", { state: { campaign } });
  };

  const handleViewCampaign = () => {
    navigate(`/c/${encodeURIComponent(campaign.id)}`);
  };

  if (loading) {
    return (
      <main className="published-empty">
        <nav className="published-nav">
          <BrandLogo to="/dashboard" className="published-logo" />
        </nav>
        <div className="empty-content">
          <p role="status">{t.loading}</p>
        </div>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="published-empty">
        <nav className="published-nav">
          <BrandLogo to="/dashboard" className="published-logo" />

          <LanguageSelector
            language={language}
            onChange={handleLanguageChange}
          />
        </nav>

        <div className="empty-content">
          <div className="empty-icon">?</div>
          <h1>{t.notFound}</h1>
          <p>{t.notFoundSubtitle}</p>

          <button
            className="published-primary"
            onClick={handleNewCampaign}
          >
            {t.create}
          </button>
        </div>
      </main>
    );
  }

  const goalValue = Number(campaign.target);
  const hasGoal = campaign.target !== null
    && campaign.target !== undefined
    && campaign.target !== ""
    && Number.isFinite(goalValue)
    && goalValue > 0;
  const progress = hasGoal
    ? Math.min(((Number(campaign.raised) || 0) / goalValue) * 100, 100)
    : 0;
  const creatorName = campaign.creator?.displayName || campaign.creator?.name || campaign.creatorName || campaign.owner?.displayName || campaign.owner?.name || "";
  const university = campaign.university || campaign.creatorUniversity || campaign.creator?.university || campaign.owner?.university || "";

  const category =
    getCategoryLabel(campaign.category, language);

  const deadline = campaign.openEnded
    ? t.openEnded
    : campaign.deadline
      ? new Date(campaign.deadline).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  return (
    <main className="published-page">

      {/* NAVIGATION */}
      <nav className="published-nav">

        <BrandLogo to="/dashboard" className="published-logo" />

        <div className="published-nav-right">
          <button
            type="button"
            className="published-dashboard-link"
            onClick={() => navigate("/dashboard")}
          >
            {t.dashboard}
          </button>
          <button
            type="button"
            className="published-dashboard-link"
            onClick={handleEditCampaign}
          >
            {t.editCampaign}
          </button>

          <div className="published-live">
            <span />
            {t.live}
          </div>

          <LanguageSelector
            language={language}
            onChange={handleLanguageChange}
          />

        </div>
      </nav>

      <section className="published-layout">

        {/* LEFT SIDE */}
        <section className="published-content">

          <div className="published-success-label">
            <span className="success-sparkle"><Icon name="sparkles" size={18} /></span>
            {t.eyebrow}
          </div>

          <div className="published-hero">
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          {/* CAMPAIGN SUMMARY */}
          <article className="published-campaign-card">

            <div className="published-card-top">
              <span>{t.details}</span>
              <span className="published-card-status">
                <i />
                {t.live}
              </span>
            </div>

            <div className="published-cover">
              {campaign.coverImage ? (
                <img src={campaign.coverImage} alt="Campaign cover" />
              ) : (
                <div className="published-cover-decoration">
                  <Icon name="heart-handshake" size={28} />
                  <span>paste me.</span>
                </div>
              )}
            </div>

            <div className="published-card-body">

              <span className="published-category">
                {category}
              </span>

              <h2>{campaign.title}</h2>

              {(creatorName || university) && (
                <div className="published-creator-meta">
                  {creatorName && <span>{t.by} {creatorName}</span>}
                  {university && <span><Icon name="map-pin" size={13} />{university}</span>}
                </div>
              )}

              <p className="published-story">
                {campaign.story}
              </p>

              <div className="published-funding">

                <div className="published-funding-top">
                  <div>
                    <strong>
                      {formatMoney(campaign.raised, campaign.currency, campaign.assetScale)}
                    </strong>
                    <span>{t.raised}</span>
                  </div>

                  <div className="published-goal">
                    <strong>
                      {hasGoal ? formatMoney(goalValue, campaign.currency, campaign.assetScale) : t.noGoal}
                    </strong>
                    <span>{t.goal}</span>
                  </div>
                </div>

                {hasGoal ? (
                  <>
                    <div className="published-progress" role="progressbar" aria-label={t.goal} aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100">
                      <div style={{ width: `${progress}%` }} />
                    </div>
                    <div className="published-funding-bottom">
                      <span>{Math.round(progress)}%</span>
                      <span>{campaign.contributors || 0} {t.contributions}</span>
                    </div>
                  </>
                ) : (
                  <div className="published-funding-bottom published-no-goal-bottom">
                    <span>{campaign.contributors || 0} {t.contributions}</span>
                  </div>
                )}

              </div>

              <div className="published-deadline">
                <span>{t.deadline}</span>
                <strong>{deadline}</strong>
              </div>

            </div>

          </article>

          <p className="published-original-note">
            <Icon name="info" size={16} />
            {t.authoredNote}
          </p>

        </section>

        {/* RIGHT SIDE */}
        <aside className="published-share-panel">

          <div className="share-panel-heading">
            <span className="share-panel-eyebrow">
              {t.nextStep}
            </span>

            <h2>{t.shareTitle}</h2>
            <p>{t.shareSubtitle}</p>
          </div>

          {/* QR CODE */}
          <div className="published-qr-container">

            <div className="published-qr-heading">
              <span>PASTEME</span>
              <span>{t.scanOpen}</span>
            </div>

            <div className="published-qr-image">
              {qrCode ? (
                <img src={qrCode} alt="Campaign QR code" />
              ) : (
                <div className="qr-placeholder">
                  {qrError ? (
                    <span>!</span>
                  ) : (
                    <span className="qr-loading"><Icon name="loader" size={24} /></span>
                  )}
                </div>
              )}
            </div>

            <div className="published-qr-caption">
              <Icon name="scan-line" size={15} />
              <p>{t.scanCaption}</p>
            </div>

          </div>

          {/* CAMPAIGN URL */}
          <div className="published-link-section">

            <label>{t.linkLabel}</label>

            <div className="published-link-field">
              <input
                type="text"
                value={campaignUrl}
                readOnly
                aria-label={t.linkLabel}
                onFocus={(e) => e.target.select()}
              />

              <button
                type="button"
                onClick={handleCopyLink}
                aria-label={t.copy}
              >
                <Icon name="copy" size={17} />
              </button>
            </div>

            {copied && (
              <p className="copy-feedback">{t.copied}</p>
            )}

            {copyFailed && (
              <p className="copy-feedback copy-error">
                {t.copyError}
              </p>
            )}

          </div>

          {/* ACTIONS */}
          <div className="published-actions">

            <button
              type="button"
              className="published-primary"
              onClick={handleCopyLink}
            >
              {copied ? t.copied : t.copy}
              <Icon name="arrow-up-right" size={16} />
            </button>

            <button
              type="button"
              className="published-secondary"
              onClick={handleShare}
            >
              <Icon name="share" size={16} />
              {t.share}
            </button>

            <a
              href={qrCode || undefined}
              download={`pasteme-${campaign.id}-qr.png`}
              className={`published-download ${
                !qrCode ? "download-disabled" : ""
              }`}
              aria-disabled={!qrCode}
              onClick={(e) => {
                if (!qrCode) e.preventDefault();
              }}
            >
              <Icon name="download" size={16} />
              {qrError ? t.qrError : t.download}
            </a>

            <button
              type="button"
              className="published-view"
              onClick={handleViewCampaign}
            >
              {t.view} <Icon name="arrow-right" size={15} />
            </button>

          </div>

          <div className="published-notice">
            <Icon name="info" size={16} />
            <p>{t.notice}</p>
          </div>

        </aside>

      </section>

      <footer className="published-footer">
        <BrandLogo className="published-footer-logo" />
        <button onClick={handleNewCampaign}>
          {t.newCampaign} <Icon name="arrow-up-right" size={15} />
        </button>
      </footer>

    </main>
  );
}

function LanguageSelector({ language, onChange }) {
  return (
    <div className="language-selector">
      <span className="language-icon"><Icon name="globe" size={16} /></span>

      <select
        aria-label="Select language"
        value={language}
        onChange={onChange}
      >
        <option value="en">English</option>
        <option value="pcm">Pidgin</option>
        <option value="yo">Yorùbá</option>
      </select>

      <span className="language-chevron"><Icon name="chevron-down" size={13} /></span>
    </div>
  );
}
