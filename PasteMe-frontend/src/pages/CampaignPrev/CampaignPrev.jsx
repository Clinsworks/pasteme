import { useMemo, useState } from "react";
import { getCategoryLabel } from "../../lib/categoryLabels";
import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { saveCampaign } from "../../lib/campaignStore";
import { formatMoney } from "../../lib/money";
import "./CampaignPrev.css";


const translations = {
  en: {
    navPreview: "Campaign preview", editCampaign: "Edit campaign", publicPreview: "PUBLIC CAMPAIGN PAGE",
    previewTitle: "Here's how your story will look.", previewSubtitle: "This is what people will see when they open your campaign.",
    cover: "Your campaign cover", raised: "raised so far", goal: "fundraising goal", noGoal: "No goal set", funded: "funded", contributions: "contributions", by: "Started by", university: "University",
    deadline: "CAMPAIGN DEADLINE", deadlineLabel: "Deadline", openEnded: "Open-ended", noDeadline: "Not specified",
    footnote: "Your story is the heart of this campaign. Make sure every detail is accurate before publishing.",
    almost: "ALMOST THERE", readyTitle: "Ready to share your story?", readyText: "Take a moment to make sure everything is in place.",
    titleLabel: "Campaign title", categoryLabel: "Campaign category", goalLabel: "Fundraising goal", storyLabel: "Campaign story", added: "Added",
    reminder: "Once published, your campaign will have a shareable page and QR code.", publish: "Publish campaign", publishing: "Publishing...", save: "Save campaign changes", edit: "Make changes",
    terms: "By publishing, you confirm that your campaign information is accurate.", emptyTitle: "No campaign to preview", emptyText: "Create a campaign before accessing its preview.", create: "Create campaign",
    error: "Some campaign details are missing. Go back and complete the form.", deadlineError: "Choose a campaign deadline or make the campaign open-ended.", publishError: "Unable to publish campaign. Please try again.", dashboard: "Dashboard", deadlineExpired: "The end date don pass. Choose a future date or make the fundraiser open-ended.",
  },
  pcm: {
    navPreview: "Campaign preview", editCampaign: "Edit campaign", publicPreview: "PUBLIC CAMPAIGN PAGE",
    previewTitle: "See how your story go look.", previewSubtitle: "Na this people go see when dem open your campaign.",
    cover: "Your campaign cover", raised: "don enter", goal: "fundraising target", noGoal: "No target set", funded: "don fund", contributions: "contributions", by: "Started by", university: "University",
    deadline: "CAMPAIGN DEADLINE", deadlineLabel: "Deadline", openEnded: "No fixed deadline", noDeadline: "No deadline yet",
    footnote: "Your story na the heart of this campaign. Check say every detail correct before you publish.",
    almost: "E DON NEAR", readyTitle: "You ready to share your story?", readyText: "Check say everything dey correct before you publish.",
    titleLabel: "Campaign title", categoryLabel: "Campaign category", goalLabel: "Fundraising target", storyLabel: "Campaign story", added: "Don add am",
    reminder: "When you publish, your campaign go get link and QR code wey you fit share.", publish: "Publish campaign", publishing: "E dey publish...", save: "Save campaign changes", edit: "Make changes",
    terms: "When you publish, you confirm say your campaign information correct.", emptyTitle: "No campaign to preview", emptyText: "Create campaign before you open preview.", create: "Create campaign",
    error: "Some campaign details no complete. Go back fill the form.", deadlineError: "Choose deadline or make campaign open-ended.", publishError: "We no fit publish campaign. Try again.", dashboard: "Dashboard", deadlineExpired: "The end date don pass. Choose a future date or make the fundraiser open-ended.",
  },
  yo: {
    navPreview: "Àyẹ̀wò ìpolongo", editCampaign: "Ṣàtúnṣe ìpolongo", publicPreview: "OJÚ ÌPOLONGO FÚN GBOGBO ÈNÌYÀN",
    previewTitle: "Báyìí ni ìtàn rẹ yóò ṣe rí.", previewSubtitle: "Èyí ni ohun tí àwọn ènìyàn yóò rí nígbà tí wọ́n bá ṣí ìpolongo rẹ.",
    cover: "Àwòrán ìborí ìpolongo", raised: "owó tí a ti gbà", goal: "àfojúsùn owó", noGoal: "Kò sí àfojúsùn", funded: "ti kún", contributions: "ìrànlọ́wọ́", by: "Ẹni tó bẹ̀rẹ̀ rẹ̀", university: "Ilé-ẹ̀kọ́ gíga",
    deadline: "ỌJỌ́ ÌPARÍ ÌPOLONGO", deadlineLabel: "Ọjọ́ ìparí", openEnded: "Kò ní ọjọ́ ìparí", noDeadline: "A kò sọ ọjọ́ ìparí",
    footnote: "Ìtàn rẹ ni ọkàn ìpolongo yìí. Jẹ́rìísí pé gbogbo àlàyé tọ́ kí o tó tẹ̀ ẹ jáde.",
    almost: "Ó TI FẸ́RẸ̀ PARÍ", readyTitle: "Ṣé o ti ṣetán láti pín ìtàn rẹ?", readyText: "Ṣàyẹ̀wò gbogbo àlàyé kí o tó tẹ̀ ẹ jáde.",
    titleLabel: "Àkọlé ìpolongo", categoryLabel: "Ẹ̀ka ìpolongo", goalLabel: "Àfojúsùn owó", storyLabel: "Ìtàn ìpolongo", added: "A ti fi kún un",
    reminder: "Lẹ́yìn ìtẹ̀jáde, ìpolongo rẹ yóò ní ìjápọ̀ àti kóòdù QR tí o lè pín.", publish: "Tẹ ìpolongo jáde", publishing: "A ń tẹ̀ ẹ jáde...", save: "Fi àwọn àyípadà pamọ́", edit: "Ṣe àtúnṣe",
    terms: "Nípa títẹ̀jáde, o jẹ́rìísí pé àlàyé ìpolongo rẹ tọ́.", emptyTitle: "Kò sí ìpolongo fún àyẹ̀wò", emptyText: "Ṣẹ̀dá ìpolongo kí o tó lè ṣàyẹ̀wò rẹ.", create: "Ṣẹ̀dá ìpolongo",
    error: "Àwọn àlàyé kan kò sí. Padà kí o sì kún fọ́ọ̀mù náà.", deadlineError: "Yan ọjọ́ ìparí tàbí ṣe ìpolongo tí kò ní ọjọ́ ìparí.", publishError: "A kò lè tẹ ìpolongo jáde. Jọ̀wọ́ tún gbìyànjú.", deadlineExpired: "Ọjọ́ ìparí yìí ti kọjá. Yan ọjọ́ iwájú tàbí ṣe ìpolongo tí kò ní ọjọ́ ìparí.", dashboard: "Ojú ìṣàkóso",
  },
};



function getSavedDraft(email) {
  try {
    const key = `pasteme_campaign_draft:${email?.toLowerCase() || "guest"}`;
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

export default function CampaignPreview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [language, setLanguage] = useState(() => localStorage.getItem("pasteme_language") || "en");
  const t = translations[language] || translations.en;

  const campaign = useMemo(
    () => location.state?.campaign || getSavedDraft(user?.email),
    [location.state, user?.email]
  );

  const goalValue = Number(campaign?.target);
  const hasGoal = campaign?.target !== null
    && campaign?.target !== undefined
    && campaign?.target !== ""
    && Number.isFinite(goalValue)
    && goalValue > 0;
  const progress = hasGoal
    ? Math.min(((Number(campaign.raised) || 0) / goalValue) * 100, 100)
    : 0;
  const category = getCategoryLabel(campaign?.category, language);

  const handleLanguageChange = (event) => {
    const selected = event.target.value;
    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  };

  const handleEdit = () => {
    if (!campaign) return;
    navigate("/create", { state: { campaign } });
  };

  const handlePublish = async () => {
    if (!campaign || !user?.email || publishing) return;

    setPublishError("");

    const rawGoal = String(campaign.target ?? "").trim();
    const goalIsInvalid = rawGoal !== "" && (!Number.isFinite(Number(rawGoal)) || Number(rawGoal) <= 0);
    if (!campaign.title?.trim() || !campaign.category || !campaign.story?.trim() || goalIsInvalid) {
      setPublishError(t.error);
      return;
    }

    if (!campaign.openEnded && !campaign.deadline) {
      setPublishError(t.deadlineError);
      return;
    }

    if (
      !campaign.openEnded &&
      campaign.deadline &&
      new Date(`${campaign.deadline}T23:59:59`).getTime() < Date.now()
    ) {
      setPublishError(t.deadlineExpired);
      return;
    }

    setPublishing(true);

    try {
      const campaignInput = { ...campaign };
      delete campaignInput.creatorId;
      delete campaignInput.ownerEmail;
      delete campaignInput.raised;
      delete campaignInput.contributors;
      delete campaignInput.status;
      delete campaignInput.publishedAt;
      delete campaignInput.updatedAt;
      delete campaignInput.receivingWallet;
      delete campaignInput.incomingPaymentUrl;

      const savedCampaign = await saveCampaign(campaignInput);
      sessionStorage.removeItem(`pasteme_campaign_draft:${user.email.toLowerCase()}`);

      navigate(`/campaign-published/${encodeURIComponent(savedCampaign.id)}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Publishing failed:", error);
      setPublishError(error.message || t.publishError);
    } finally {
      setPublishing(false);
    }
  };

  if (!campaign) {
    return (
      <main className="preview-empty">
        <h2>{t.emptyTitle}</h2>
        <p>{t.emptyText}</p>
        <button onClick={() => navigate("/create")}>{t.create}</button>
      </main>
    );
  }

  const deadline = campaign.openEnded
    ? t.openEnded
    : campaign.deadline
      ? new Date(`${campaign.deadline}T00:00:00`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : t.noDeadline;

  return (
    <main className="preview-page">
      <nav className="preview-nav">
        <BrandLogo to="/dashboard" className="preview-logo" />
        <div className="preview-nav-center">
          <span className="preview-status-dot" /> {t.navPreview}
        </div>
        <div className="preview-nav-actions">
          <select className="preview-language-select" value={language} onChange={handleLanguageChange} aria-label="Language">
            <option value="en">English</option>
            <option value="pcm">Pidgin</option>
            <option value="yo">Yorùbá</option>
          </select>
          <button className="preview-exit" type="button" onClick={handleEdit}><Icon name="arrow-left" size={17} /> {t.editCampaign}</button>
        </div>
      </nav>

      <section className="preview-layout">
        <section className="preview-main">
          <div className="preview-heading">
            <span className="preview-eyebrow">{t.publicPreview}</span>
            <h1>{t.previewTitle}</h1>
            <p>{t.previewSubtitle}</p>
          </div>

          <article className="public-campaign-card">
            <div className="campaign-cover">
              {campaign.coverImage ? (
                <img src={campaign.coverImage} alt="Campaign cover" />
              ) : (
                <div className="cover-placeholder">
                  <Icon name="image" size={25} />
                  <p>{t.cover}</p>
                </div>
              )}
            </div>

            <div className="public-campaign-content">
              <span className="campaign-category">{category}</span>
              <h2>{campaign.title}</h2>
              {(user?.displayName || user?.name || campaign.university) && (
                <div className="preview-creator-meta">
                  {(user?.displayName || user?.name) && <span>{t.by} {user.displayName || user.name}</span>}
                  {campaign.university && <span><Icon name="map-pin" size={13} />{campaign.university}</span>}
                </div>
              )}
              <p className="campaign-story">{campaign.story}</p>

              <div className="campaign-funding">
                <div className="funding-numbers">
                  <div>
                    <strong>{formatMoney(campaign.raised || 0, campaign.currency, campaign.assetScale)}</strong>
                    <span>{t.raised}</span>
                  </div>
                  <div className="funding-target">
                    <strong>{hasGoal ? formatMoney(goalValue, campaign.currency, campaign.assetScale) : t.noGoal}</strong>
                    <span>{t.goal}</span>
                  </div>
                </div>
                {hasGoal ? (
                  <>
                    <div className="funding-track" role="progressbar" aria-label={t.goal} aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100">
                      <div className="funding-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="funding-footer">
                      <span>{Math.round(progress)}% {t.funded}</span>
                      <span>{campaign.contributors || 0} {t.contributions}</span>
                    </div>
                  </>
                ) : (
                  <div className="funding-footer funding-no-goal">
                    <span>{campaign.contributors || 0} {t.contributions}</span>
                  </div>
                )}
              </div>

              <div className="campaign-deadline">
                <span>{t.deadline}</span>
                <strong>{deadline}</strong>
              </div>
            </div>
          </article>

          <div className="preview-footnote">
            <Icon name="info" size={17} />
            {t.footnote}
          </div>
        </section>

        <aside className="publish-panel">
          <div className="publish-panel-heading">
            <span className="preview-eyebrow">{t.almost}</span>
            <h2>{t.readyTitle}</h2>
            <p>{t.readyText}</p>
          </div>

          <div className="publish-checklist">
            <div className="checklist-item">
              <span className="check-icon"><Icon name="check" size={15} /></span>
              <div><strong>{t.titleLabel}</strong><span>{campaign.title}</span></div>
            </div>
            <div className="checklist-item">
              <span className="check-icon"><Icon name="check" size={15} /></span>
              <div><strong>{t.categoryLabel}</strong><span>{category}</span></div>
            </div>
            <div className="checklist-item">
              <span className="check-icon"><Icon name="check" size={15} /></span>
              <div><strong>{t.goalLabel}</strong><span>{hasGoal ? formatMoney(goalValue, campaign.currency, campaign.assetScale) : t.noGoal}</span></div>
            </div>
            <div className="checklist-item">
              <span className="check-icon"><Icon name="check" size={15} /></span>
              <div><strong>{t.storyLabel}</strong><span>{t.added}</span></div>
            </div>
            <div className="checklist-item">
              <span className="check-icon"><Icon name="check" size={15} /></span>
              <div><strong>{t.deadlineLabel}</strong><span>{deadline}</span></div>
            </div>
          </div>

          <div className="publish-reminder">
            <Icon name="qr-code" size={18} />
            <p>{t.reminder}</p>
          </div>

          {publishError && <p className="publish-error" role="alert">{publishError}</p>}

          <button className="publish-button" type="button" onClick={handlePublish} disabled={publishing}>
            {publishing ? t.publishing : campaign.id ? t.save : t.publish}
            <Icon name="arrow-up-right" size={17} />
          </button>

          <button className="back-edit-button" type="button" onClick={handleEdit}>
            {t.edit}
          </button>

          <p className="publish-terms">{t.terms}</p>
        </aside>
      </section>
    </main>
  );
}
