
import { useEffect, useMemo, useState } from "react";
import { getCategoryLabel } from "../../lib/categoryLabels";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo";
import Icon from "../../components/Icon";
import InstallAppButton from "../../components/InstallAppButton";
import { useAuth } from "../../context/AuthContext";
import { deleteCampaign, listCampaigns } from "../../lib/campaignStore";
import { copyText } from "../../lib/clipboard";
import { formatMoney } from "../../lib/money";
import "./Dashboard.css";

const translations = {
  en: {
    eyebrow: "CREATOR SPACE",
    title: "Your impact, at a glance.",
    subtitle: "Welcome back. Here's how your campaigns are doing.",
    newCampaign: "Create campaign",
    overview: "OVERVIEW",
    totalRaised: "Total raised",
    campaigns: "Published campaigns",
    supporters: "Total supporters",
    myCampaigns: "Your campaigns",
    campaignDescription: "Manage and follow your fundraising campaigns.",
    published: "Published",
    view: "View campaign",
    copy: "Copy link",
    copied: "Copied!",
    copyFailed: "Could not copy the campaign link.",
    goal: "Goal",
    raised: "raised",
    contributors: "supporters",
    noCampaigns: "Your story starts here.",
    noCampaignsText:
      "You haven't published any campaigns yet. Create your first campaign and give your idea a place to grow.",
    createFirst: "Create your first campaign",
    quickTitle: "Have another idea?",
    quickText:
      "Every meaningful change starts somewhere. Give your next idea a chance.",
    quickAction: "Start a campaign",
    noData: "Your campaign activity will appear here.",
    home: "Home",
    dashboard: "Dashboard",
    language: "Language",
    publishedOn: "Published",
    viewAll: "YOUR FUNDRAISING ACTIVITY",
    edit: "Edit details",
    manage: "Share & QR",
    logout: "Log out",
    totalAcross: "Across your published campaigns",
    delete: "Delete",
    deleteConfirm: "Archive this campaign? It will be removed from public listings.",
    deleteError: "This campaign could not be deleted.",
    installApp: "Install app",
    campaignLoadError: "Campaigns could not be loaded. Please refresh the page.",
  },

  pcm: {
    eyebrow: "CREATOR SPACE",
    title: "See how your impact dey go.",
    subtitle: "Welcome back. See how your campaigns dey perform.",
    newCampaign: "Create campaign",
    overview: "OVERVIEW",
    totalRaised: "Total money wey enter",
    campaigns: "Published campaigns",
    supporters: "Total supporters",
    myCampaigns: "Your campaigns",
    campaignDescription: "Manage and follow your fundraising campaigns.",
    published: "E don publish",
    view: "See campaign",
    copy: "Copy link",
    copied: "Don copy!",
    copyFailed: "We no fit copy the campaign link.",
    goal: "Target",
    raised: "don enter",
    contributors: "supporters",
    noCampaigns: "Your story start here.",
    noCampaignsText:
      "You never publish any campaign. Create your first campaign make your idea fit grow.",
    createFirst: "Create your first campaign",
    quickTitle: "You get another idea?",
    quickText:
      "Every meaningful change get somewhere e start. Give your next idea chance.",
    quickAction: "Start campaign",
    noData: "Your campaign activity go show here.",
    home: "Home",
    dashboard: "Dashboard",
    language: "Language",
    publishedOn: "Published",
    viewAll: "YOUR FUNDRAISING ACTIVITY",
    edit: "Edit details",
    manage: "Share & QR",
    logout: "Log out",
    totalAcross: "Across your campaigns wey don publish",
    delete: "Delete",
    deleteConfirm: "You wan archive this campaign? E go comot from public listings.",
    deleteError: "We no fit delete this campaign.",
    installApp: "Install app",
    campaignLoadError: "We no fit load campaigns. Refresh the page and try again.",
  },

  yo: {
    eyebrow: "OJÚ ÌṢÀKÓSO OLÙṢẸ̀DÁ",
    title: "Wo ipa tí o ń ní.",
    subtitle: "Ẹ káàbọ̀ padà. Ẹ wo bí àwọn ìpolongo yín ṣe ń lọ.",
    newCampaign: "Ṣẹ̀dá ìpolongo",
    overview: "ÀKÓJỌ ÌṢÀKÓSO",
    totalRaised: "Àpapọ̀ owó tí a gbà",
    campaigns: "Àwọn ìpolongo tí a tẹ̀ jáde",
    supporters: "Àpapọ̀ àwọn olùrànlọ́wọ́",
    myCampaigns: "Àwọn ìpolongo rẹ",
    campaignDescription: "Ṣàkóso àwọn ìpolongo ìkójọ owó rẹ.",
    published: "A ti tẹ̀ jáde",
    view: "Wo ìpolongo",
    copy: "Da ìjápọ̀ kọ",
    copied: "A ti da á kọ!",
    copyFailed: "A kò lè da ìjápọ̀ ìpolongo kọ.",
    goal: "Àfojúsùn",
    raised: "owó tí a ti gbà",
    contributors: "olùrànlọ́wọ́",
    noCampaigns: "Ìtàn rẹ bẹ̀rẹ̀ níbí.",
    noCampaignsText:
      "O kò tíì tẹ ìpolongo kankan jáde. Ṣẹ̀dá ìpolongo àkọ́kọ́ rẹ kí èrò rẹ lè dàgbà.",
    createFirst: "Ṣẹ̀dá ìpolongo àkọ́kọ́ rẹ",
    quickTitle: "Ṣé o ní èrò mìíràn?",
    quickText:
      "Gbogbo ìyípadà tó ní ìtumọ̀ ní ibi tí ó ti bẹ̀rẹ̀. Fún èrò tuntun rẹ ní àǹfààní.",
    quickAction: "Bẹ̀rẹ̀ ìpolongo",
    noData: "Ìṣe àwọn ìpolongo rẹ yóò hàn níbí.",
    home: "Ilé",
    dashboard: "Ojú ìṣàkóso",
    language: "Èdè",
    publishedOn: "Ọjọ́ ìtẹ̀jáde",
    viewAll: "ÌṢE ÌKÓJỌ OWÓ RẸ",
    edit: "Ṣàtúnṣe àlàyé",
    manage: "Pín àti QR",
    logout: "Jáde",
    totalAcross: "Láti inú gbogbo ìpolongo rẹ",
    delete: "Pa rẹ́",
    deleteConfirm: "Ṣé o fẹ́ fi ìpolongo yìí pamọ́? A ó yọ ọ́ kúrò nínú ojú àwọn ènìyàn.",
    deleteError: "A kò lè pa ìpolongo yìí rẹ́.",
    installApp: "Fi app sori ẹrọ",
    campaignLoadError: "A kò lè ṣí àwọn ìpolongo rẹ. Tún ojú ìwé ṣe kí o sì tún gbìyànjú.",
  },
};


const formatDate = (date, language = "en") => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  const locale = language === "yo" ? "yo-NG" : "en-NG";
  return parsed.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Creator";

  const [campaigns, setCampaigns] = useState([]);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("pasteme_language") || "en"
  );
  const [copiedId, setCopiedId] = useState(null);
  const [copyErrorId, setCopyErrorId] = useState(null);
  const [campaignError, setCampaignError] = useState("");
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  const t = translations[language] || translations.en;

  useEffect(() => {
    let active = true;
    listCampaigns()
      .then((result) => {
        if (active) {
          setCampaigns(result);
          setCampaignError("");
        }
      })
      .catch((error) => {
        console.error("Could not load campaigns:", error);
        if (active) setCampaignError(t.campaignLoadError);
      })
      .finally(() => {
        if (active) setCampaignsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t.campaignLoadError]);

  const overview = useMemo(() => {
    const raisedByCurrency = new Map();
    let totalSupporters = 0;
    for (const campaign of campaigns) {
      const currency = campaign.currency || "NGN";
      const assetScale = Number.isInteger(campaign.assetScale) ? campaign.assetScale : 2;
      const key = `${currency}:${assetScale}`;
      const total = raisedByCurrency.get(key) || { currency, assetScale, amount: 0 };
      total.amount += Number(campaign.raised) || 0;
      raisedByCurrency.set(key, total);
      totalSupporters += Number(campaign.contributors) || 0;
    }
    return {
      raisedByCurrency: [...raisedByCurrency.values()],
      totalSupporters,
    };
  }, [campaigns]);

  const sortedCampaigns = useMemo(() => {
    return [...campaigns].sort(
      (a, b) =>
        new Date(b.publishedAt || 0) -
        new Date(a.publishedAt || 0)
    );
  }, [campaigns]);

  const handleLanguageChange = (e) => {
    const selected = e.target.value;

    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  };

  const handleNewCampaign = () => {
    navigate("/create");
  };

  const handleViewCampaign = (id) => {
    navigate(`/c/${encodeURIComponent(id)}`);
  };

  const handleEditCampaign = (campaign) => {
    navigate("/create", { state: { campaign } });
  };

  const handleManageCampaign = (id) => {
    navigate(`/campaign-published/${encodeURIComponent(id)}`);
  };

  const handleDeleteCampaign = async (campaign) => {
    const confirmed = window.confirm(t.deleteConfirm);
    if (!confirmed) return;

    try {
      await deleteCampaign(campaign.id);
      setCampaigns(await listCampaigns());
      setCampaignError("");
    } catch (error) {
      console.error("Could not delete campaign:", error);
      setCampaignError(t.deleteError);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Could not log out:", error);
      setCampaignError(error.message);
    }
  };

  const handleCopyLink = async (id) => {
    const url = `${window.location.origin}/c/${encodeURIComponent(id)}`;

    setCopiedId(null);
    setCopyErrorId(null);

    try {
      await copyText(url);
      setCopiedId(id);

      window.setTimeout(() => {
        setCopiedId((current) => current === id ? null : current);
      }, 2500);
    } catch (error) {
      console.error("Copy failed:", error);
      setCopyErrorId(id);
    }
  };

  return (
    <main className="dashboard-page">

      {/* NAVIGATION */}
      <nav className="dashboard-nav">

        <BrandLogo to="/dashboard" className="dashboard-logo" />

        <div className="dashboard-nav-center">
          <span className="dashboard-nav-active">
            {t.dashboard}
          </span>
        </div>

        <div className="dashboard-nav-right">

          <InstallAppButton label={t.installApp} />

          <div className="dashboard-language">
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

          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span className="dashboard-user-name">{firstName}</span>
          </div>

          <button className="dashboard-logout" type="button" onClick={handleLogout}>
            {t.logout} <Icon name="log-out" size={16} />
          </button>

        </div>

      </nav>

      <div className="dashboard-container">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <span className="dashboard-eyebrow">{t.eyebrow}</span>
            <h1>{firstName}, {t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          <button
            className="dashboard-create-button"
            onClick={handleNewCampaign}
          >
            <Icon name="plus" size={17} />
            {t.newCampaign}
          </button>

        </header>

        {/* OVERVIEW */}
        <section className="dashboard-overview">

          <div className="dashboard-section-heading">
            <span>{t.overview}</span>
            <span className="dashboard-overview-indicator">
              <Icon name="sparkles" size={14} /> {t.viewAll}
            </span>
          </div>

          <div className="dashboard-stats">

            <article className="dashboard-stat-card stat-plum">
              <div className="stat-icon"><Icon name="wallet" size={19} /></div>
              <span>{t.totalRaised}</span>
              <strong>
                {overview.raisedByCurrency.length
                  ? overview.raisedByCurrency
                      .map(({ amount, currency, assetScale }) => formatMoney(amount, currency, assetScale))
                      .join(" · ")
                  : formatMoney(0)}
              </strong>
              <small>{t.totalAcross}</small>
            </article>

            <article className="dashboard-stat-card stat-sage">
              <div className="stat-icon"><Icon name="megaphone" size={19} /></div>
              <span>{t.campaigns}</span>
              <strong>{campaigns.length.toString().padStart(2, "0")}</strong>
              <small>{t.published}</small>
            </article>

            <article className="dashboard-stat-card stat-ivory">
              <div className="stat-icon"><Icon name="users" size={19} /></div>
              <span>{t.supporters}</span>
              <strong>{overview.totalSupporters.toLocaleString("en-NG")}</strong>
              <small>{t.totalAcross}</small>
            </article>

          </div>

        </section>

        {/* CAMPAIGNS */}
        <section className="dashboard-campaigns-section">
          {campaignError && <p className="campaign-copy-error" role="alert">{campaignError}</p>}

          <div className="dashboard-section-heading campaign-heading">
            <div>
              <h2>{t.myCampaigns}</h2>
              <p>{t.campaignDescription}</p>
            </div>

            <span className="campaign-count">
              {campaigns.length.toString().padStart(2, "0")}
            </span>
          </div>

          {campaignsLoading ? (
            <p role="status">{t.noData}</p>
          ) : sortedCampaigns.length === 0 ? (

            <div className="dashboard-empty">

              <div className="empty-decoration">
                <Icon name="sparkles" size={25} />
              </div>

              <h3>{t.noCampaigns}</h3>

              <p>{t.noCampaignsText}</p>

              <button
                className="dashboard-create-button"
                onClick={handleNewCampaign}
              >
                {t.createFirst}
                <Icon name="arrow-up-right" size={15} />
              </button>

            </div>

          ) : (

            <div className="dashboard-campaign-list">

              {sortedCampaigns.map((campaign) => {

                const target = Number(campaign.target) || 0;
                const raised = Number(campaign.raised) || 0;

                const progress = target > 0
                  ? Math.min((raised / target) * 100, 100)
                  : 0;

                const campaignTitle =
                  campaign.title || "Untitled campaign";

                return (
                  <article
                    className="dashboard-campaign-card"
                    key={campaign.id}
                  >

                    <div className="campaign-card-main">

                      <div className="campaign-card-image">
                        {campaign.coverImage ? (
                          <img
                            src={campaign.coverImage}
                            alt=""
                          />
                        ) : (
                          <Icon name="heart-handshake" size={24} />
                        )}
                      </div>

                      <div className="campaign-card-details">

                        <div className="campaign-card-title-row">
                          <h3>{campaignTitle}</h3>

                          <span className="campaign-published-status">
                            <i />
                            {t.published}
                          </span>
                        </div>

                        <span className="campaign-card-category">
                          {getCategoryLabel(campaign.category || "Other", language)}
                        </span>

                        <div className="campaign-card-progress">

                          <div className="campaign-card-progress-top">
                            <strong>{formatMoney(raised, campaign.currency, campaign.assetScale)}</strong>
                            <span>
                              {t.goal}: {formatMoney(target, campaign.currency, campaign.assetScale)}
                            </span>
                          </div>

                          <div className="campaign-progress-track">
                            <div
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="campaign-progress-bottom">
                            <span>{Math.round(progress)}% {t.raised}</span>
                            <span>
                              {Number(campaign.contributors) || 0} {t.contributors}
                            </span>
                          </div>

                        </div>

                        <small className="campaign-published-date">
                          {t.publishedOn}: {formatDate(campaign.publishedAt, language)}
                        </small>

                      </div>

                    </div>

                    <div className="campaign-card-actions">

                      <button
                        className="campaign-view-button"
                        onClick={() => handleViewCampaign(campaign.id)}
                      >
                        {t.view}
                        <Icon name="arrow-up-right" size={15} />
                      </button>

                      <button
                        className="campaign-copy-button"
                        onClick={() => handleCopyLink(campaign.id)}
                      >
                        {copiedId === campaign.id ? t.copied : t.copy}
                      </button>

                      <button
                        className="campaign-copy-button"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        {t.edit}
                      </button>

                      <button
                        className="campaign-copy-button"
                        onClick={() => handleManageCampaign(campaign.id)}
                      >
                        {t.manage}
                      </button>

                      <button
                        className="campaign-delete-button"
                        onClick={() => handleDeleteCampaign(campaign)}
                      >
                        {t.delete}
                      </button>

                      {copyErrorId === campaign.id && (
                        <small className="campaign-copy-error">
                          {t.copyFailed}
                        </small>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

        {/* QUICK CREATE */}
        {campaigns.length > 0 && (
          <section className="dashboard-quick-create">

            <div className="quick-create-decoration"><Icon name="sparkles" size={22} /></div>

            <div className="quick-create-content">
              <h2>{t.quickTitle}</h2>
              <p>{t.quickText}</p>
            </div>

            <button
              onClick={handleNewCampaign}
              className="quick-create-button"
            >
              {t.quickAction}
              <Icon name="arrow-up-right" size={16} />
            </button>

          </section>
        )}

      </div>

      <footer className="dashboard-footer">
        <span>paste<span>me</span>.</span>
        <span>Made for meaningful causes.</span>
      </footer>

    </main>
  );
}
