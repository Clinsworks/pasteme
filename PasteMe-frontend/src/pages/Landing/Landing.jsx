import { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo";
import brandMark from "../../assets/logo.png";
import Icon from "../../components/Icon";
import InstallAppButton from "../../components/InstallAppButton";
import "./Landing.css";

const copy = {
  en: {
    how: "How it works", why: "Why PasteMe", faqNav: "FAQs", login: "Sign in", signup: "Get started", openMenu: "Open navigation", closeMenu: "Close navigation", visualProgressLabel: "Sample campaign progress",
    language: "Language", installApp: "Install app", eyebrow: "Fundraising, made easier",
    heroTitle: "Big things happen when", heroAccent: "we show up.",
    heroText: "Got something important you want to make happen? Start a fundraiser, share one link or QR code, and let the people who care help you move it forward.",
    start: "Start a fundraiser", seeHow: "See how it works",
    supporterNote: "No account needed to support someone.",
    visualShare: "Easy to share", visualShareSub: "One link. One QR.",
    visualType: "A COMMUNITY CAMPAIGN", visualStatus: "SAMPLE CAMPAIGN", visualMessage: "ONE COMMUNITY. MANY HANDS.", visualIndex: "PASTEME / SAMPLE 01", visualMadeFor: "MADE TO BE SHARED", bottomOne: "YOUR STORY", bottomTwo: "YOUR PEOPLE", bottomThree: "YOUR IMPACT",
    visualTitle: "Help a dream take shape.", visualText: "Every contribution brings us one step closer.",
    visualOf: "of 1,000,000", visualFunded: "funded", visualView: "View campaign",
    visualSimple: "Straightforward giving", visualNoAccount: "A few steps, no fuss",
    qrCaption: "CAMPAIGN QR PREVIEW", qrScan: "Scan to view campaign",
    trust: ["Easy campaign sharing", "QR-powered access", "Payment status transparency"],
    howEyebrow: "No long story", howTitle: "Three simple steps. That’s it.",
    howText: "From creating your campaign to receiving support, PasteMe keeps the process straightforward.",
    steps: [
      ["Create your fundraiser", "Tell your story, set a goal, and connect your compatible receiving wallet."],
      ["Share your page", "Get a unique campaign link and QR code. Share them with your community."],
      ["Receive contributions", "Supporters open your page, choose an amount, and complete payment through their wallet."],
    ],
    whyEyebrow: "Made for real life", whyTitle: "Less time figuring things out. More time getting support.",
    whyText: "A fundraiser should be easy to find, easy to understand, and straightforward to support. PasteMe brings those pieces together.",
    createCampaign: "Create your campaign",
    benefits: [
      ["Your own fundraising page", "Give your cause a dedicated page where people can understand what you're raising money for."],
      ["QR-powered sharing", "Make your campaign easy to access from posters, social media, events, and printed materials."],
      ["No supporter registration", "Supporters can access a campaign directly without creating a PasteMe account."],
      ["Transparent payment status", "Campaign progress should reflect contributions that have been confirmed by the payment provider."],
    ],
    faqEyebrow: "Good questions", faqTitle: "Before you get started.",
    faqText: "Here are a few things worth knowing about how PasteMe works.",
    faqs: [
      ["What is PasteMe?", "PasteMe helps people create fundraising pages, share them through a unique link or QR code, and receive contributions through compatible digital wallets."],
      ["Do supporters need a PasteMe account?", "No. Supporters can open a public campaign page directly and proceed to checkout without registering for PasteMe."],
      ["How does the QR code work?", "Each campaign gets a QR code that points to its public fundraising page. Scanning it takes supporters directly to that campaign."],
      ["Does PasteMe hold the money?", "PasteMe is designed to facilitate payments through the connected payment infrastructure rather than act as a wallet or hold supporter funds. The actual payment flow depends on the supported wallet and provider."],
      ["Are all campaigns independently verified?", "A connected wallet does not automatically mean that a campaign or its claims have been independently verified. PasteMe should clearly distinguish wallet connection from campaign verification."],
      ["Are there payment fees?", "Any applicable fees, currency conversions, and payment details should be shown using the actual payment provider's quote before the supporter authorizes a contribution."],
    ],
    ctaEyebrow: "Whenever you’re ready", ctaTitle: "You’ve got a reason. Let’s get people behind it.",
    ctaText: "Create your campaign, share it with your community, and make it easier for people to support your cause.",
    ctaButton: "Start a fundraiser", footerDescription: "Making it easier to bring people together around a cause.",
    explore: "Explore", getStarted: "Get started", footerHow: "How it works", footerWhy: "Why PasteMe", footerFaq: "FAQs",
    footerCreate: "Create a campaign", footerLogin: "Creator sign in", footerBottom: "Built to make giving easier.",
  },
  pcm: {
    how: "How e dey work", why: "Why PasteMe", faqNav: "FAQs", login: "Log in", signup: "Get started", openMenu: "Open navigation", closeMenu: "Close navigation", visualProgressLabel: "Sample campaign progress",
    language: "Language", installApp: "Install app", eyebrow: "Fundraising don easier",
    heroTitle: "Big things fit happen when", heroAccent: "we show up.",
    heroText: "You get something important wey you wan make happen? Start fundraiser, share one link or QR code, make people wey care fit support you.",
    start: "Start fundraiser", seeHow: "See how e dey work",
    supporterNote: "People fit contribute without creating PasteMe account.",
    visualShare: "Easy to share", visualShareSub: "One link. One QR.",
    visualType: "COMMUNITY CAMPAIGN", visualStatus: "SAMPLE CAMPAIGN", visualMessage: "PLENTY PEOPLE. ONE CAUSE.", visualIndex: "PASTEME / SAMPLE 01", visualMadeFor: "DEM FIT SHARE AM", bottomOne: "YOUR STORY", bottomTwo: "YOUR PEOPLE", bottomThree: "YOUR IMPACT",
    visualTitle: "Help make one dream happen.", visualText: "Every contribution dey bring us closer.",
    visualOf: "of 1,000,000", visualFunded: "don fund", visualView: "See campaign",
    visualSimple: "Easy to contribute", visualNoAccount: "No plenty steps",
    qrCaption: "CAMPAIGN QR PREVIEW", qrScan: "Scan am to see campaign",
    trust: ["Easy campaign sharing", "QR code access", "Clear payment status"],
    howEyebrow: "Simple by design", howTitle: "Three simple steps. Na so.",
    howText: "From creating campaign to receiving support, PasteMe make the process straightforward.",
    steps: [
      ["Create your fundraiser", "Tell your story, set your target, and connect your receiving wallet."],
      ["Share your page", "Get campaign link and QR code wey you fit share with your community."],
      ["Receive contributions", "People go open your page, choose amount, and pay through their wallet."],
    ],
    whyEyebrow: "Made for sharing", whyTitle: "Make people focus on your cause, no be wahala.",
    whyText: "Fundraising suppose easy to find, understand and support. PasteMe bring everything together.",
    createCampaign: "Create your campaign",
    benefits: [
      ["Your own fundraising page", "Give your cause one page wey people fit understand wetin you dey raise money for."],
      ["QR-powered sharing", "Make people access your campaign from posters, social media, events and printed materials."],
      ["No supporter registration", "People fit open campaign directly without creating PasteMe account."],
      ["Clear payment status", "Campaign progress suppose show only contributions wey payment provider don confirm."],
    ],
    faqEyebrow: "Good questions", faqTitle: "Before you start.",
    faqText: "See some things wey you suppose know about how PasteMe dey work.",
    faqs: [
      ["Wetin be PasteMe?", "PasteMe help people create fundraising pages, share with link or QR code, and receive contributions through compatible digital wallets."],
      ["Supporters need PasteMe account?", "No. Supporters fit open public campaign page directly and go checkout without registering for PasteMe."],
      ["How QR code dey work?", "Every campaign get QR code wey point to the public fundraising page. When person scan am, e go open that campaign."],
      ["PasteMe dey hold the money?", "PasteMe dey help payments pass through the connected payment infrastructure. E no be wallet and no suppose hold supporter money."],
      ["Dem verify every campaign?", "Connecting wallet no mean say the campaign or wetin e claim don get independent verification."],
      ["Payment get fees?", "Any fees and currency conversion suppose show for the real payment provider quote before supporter approve payment."],
    ],
    ctaEyebrow: "Whenever you’re ready", ctaTitle: "You get your reason. Make we get people behind am.",
    ctaText: "Create your campaign, share am with your community, and make people fit support your cause easily.",
    ctaButton: "Start fundraiser", footerDescription: "We dey make am easy for people to join around one cause.",
    explore: "Explore", getStarted: "Get started", footerHow: "How e dey work", footerWhy: "Why PasteMe", footerFaq: "FAQs",
    footerCreate: "Create campaign", footerLogin: "Creator login", footerBottom: "Built to make giving easier.",
  },
  yo: {
    how: "Bí ó ṣe ń ṣiṣẹ́", why: "Ìdí PasteMe", faqNav: "Ìbéèrè", login: "Wọlé", signup: "Bẹ̀rẹ̀", openMenu: "Ṣí àkójọ", closeMenu: "Pa àkójọ", visualProgressLabel: "Ìlọsíwájú àpẹẹrẹ ìpolongo",
    language: "Èdè", installApp: "Fi app sori ẹrọ", eyebrow: "A mú ìkójọ owó rọrùn",
    heroTitle: "Ohun ńlá máa ń ṣẹlẹ̀ nígbà tí", heroAccent: "a bá fọwọ́sowọ́pọ̀.",
    heroText: "Ṣé ohun pàtàkì kan wà tí o fẹ́ ṣe? Bẹ̀rẹ̀ ìkójọ owó, pín ìjápọ̀ kan tàbí kóòdù QR, kí àwọn tó bìkítà lè ràn ọ́ lọ́wọ́.",
    start: "Bẹ̀rẹ̀ ìkójọ owó", seeHow: "Wo bí ó ṣe ń ṣiṣẹ́",
    supporterNote: "Àwọn olùrànlọ́wọ́ lè ṣètọrẹ láìní àkáǹtì PasteMe.",
    visualShare: "Ó rọrùn láti pín", visualShareSub: "Ìjápọ̀ kan. QR kan.",
    visualType: "ÌPOLONGO ÀWÙJỌ", visualStatus: "ÀFÍHÀN ÌPOLONGO", visualMessage: "Ọ̀PỌ̀ ÀWỌN ÈNÌYÀN. OHUN TÓ ṢE PÀTÀKÌ KAN.", visualIndex: "PASTEME / ÀPẸẸRẸ 01", visualMadeFor: "A ṢE É FÚN PÍPIN", bottomOne: "ÌTÀN RẸ", bottomTwo: "ÀWÙJỌ RẸ", bottomThree: "IPA RẸ",
    visualTitle: "Ran àlá kan lọ́wọ́ láti ṣẹ. ", visualText: "Gbogbo ìrànlọ́wọ́ mú wa sún mọ́ àfojúsùn.",
    visualOf: "nínú 1,000,000", visualFunded: "ti kún", visualView: "Wo ìpolongo",
    visualSimple: "Ìtọrẹ tó rọrùn", visualNoAccount: "Kò ní ìgbésẹ̀ púpọ̀",
    qrCaption: "ÀFÍHÀN KÓÒDÙ QR", qrScan: "Ṣàyẹ̀wò láti wo ìpolongo",
    trust: ["Pípin ìpolongo rọrùn", "Wíwọlé pẹ̀lú QR", "Ipò ìsanwó tó ṣe kedere"],
    howEyebrow: "A ṣe é ní ọ̀nà tó rọrùn", howTitle: "Ìgbésẹ̀ mẹ́ta péré. Ó rọrùn bẹ́ẹ̀.",
    howText: "Láti ṣíṣe ìpolongo sí gbígba ìrànlọ́wọ́, PasteMe mú gbogbo ìgbésẹ̀ rọrùn.",
    steps: [
      ["Ṣẹ̀dá ìpolongo rẹ", "Sọ ìtàn rẹ, yan àfojúsùn owó, kí o sì so àpò owó ìgbàwọlé pọ̀."],
      ["Pín ojú ìwé rẹ", "Gba ìjápọ̀ àti kóòdù QR pàtàkì, kí o sì pín wọn pẹ̀lú àwùjọ rẹ."],
      ["Gba ìtọrẹ", "Àwọn ènìyàn yóò ṣí ojú ìwé rẹ, yan iye owó, kí wọ́n sì san án nípasẹ̀ àpò owó wọn."],
    ],
    whyEyebrow: "A ṣe é fún gbogbo ènìyàn", whyTitle: "Kí àwọn ènìyàn dojú kọ ohun tó ṣe pàtàkì, kì í ṣe ìṣòro ìlànà.",
    whyText: "Ó yẹ kí ìkójọ owó rọrùn láti rí, lóye àti láti ṣe àtìlẹ́yìn fún. PasteMe so gbogbo rẹ̀ pọ̀.",
    createCampaign: "Ṣẹ̀dá ìpolongo rẹ",
    benefits: [
      ["Ojú ìpolongo tirẹ", "Fún ohun tó ṣe pàtàkì fún ọ ní ojú ìwé pàtàkì tí àwọn ènìyàn ti lè mọ ohun tí o ń kó owó jọ fún."],
      ["Pípin pẹ̀lú QR", "Jẹ́ kí ó rọrùn láti rí ìpolongo rẹ lórí ìwé ìpolówó, àwùjọ lórí ayélujára àti àwọn ìṣẹ̀lẹ̀."],
      ["Kò nílò ìforúkọsílẹ̀ olùrànlọ́wọ́", "Àwọn olùrànlọ́wọ́ lè ṣí ìpolongo tààrà láìṣẹ̀dá àkáǹtì PasteMe."],
      ["Ipò ìsanwó tó ṣe kedere", "Ìlọsíwájú ìpolongo yẹ kí ó fi ìtọrẹ tí olùpèsè ìsanwó ti jẹ́rìí hàn."],
    ],
    faqEyebrow: "Àwọn ìbéèrè tó dára", faqTitle: "Kí o tó bẹ̀rẹ̀.",
    faqText: "Àwọn ohun díẹ̀ tí ó yẹ kí o mọ̀ nípa bí PasteMe ṣe ń ṣiṣẹ́.",
    faqs: [
      ["Kí ni PasteMe?", "PasteMe ń ran àwọn ènìyàn lọ́wọ́ láti ṣẹ̀dá ojú ìkójọ owó, pín wọn pẹ̀lú ìjápọ̀ tàbí kóòdù QR, kí wọ́n sì gba ìtọrẹ nípasẹ̀ àpò owó tó bá mu."],
      ["Ṣé àwọn olùrànlọ́wọ́ nílò àkáǹtì PasteMe?", "Rárá. Wọ́n lè ṣí ojú ìpolongo gbogbo ènìyàn tààrà kí wọ́n sì lọ sí ibi ìsanwó láìforúkọsílẹ̀."],
      ["Báwo ni kóòdù QR ṣe ń ṣiṣẹ́?", "Gbogbo ìpolongo ní kóòdù QR tó ń darí sí ojú ìpolongo rẹ. Ṣíṣàyẹ̀wò rẹ̀ yóò ṣí ìpolongo náà."],
      ["Ṣé PasteMe ń tọ́jú owó náà?", "A ṣe PasteMe láti ràn àwọn ìsanwó lọ́wọ́ nípasẹ̀ ètò ìsanwó tó sopọ̀, kì í ṣe láti ṣiṣẹ́ bí àpò owó tàbí tọ́jú owó olùrànlọ́wọ́."],
      ["Ṣé a ń fìdí gbogbo ìpolongo múlẹ̀?", "Pípọ̀ àpò owó mọ́ ọn kò túmọ̀ sí pé a ti ṣàyẹ̀wò ìpolongo tàbí gbogbo ohun tí ó sọ lọ́nà òmìnira."],
      ["Ṣé owó iṣẹ́ ìsanwó wà?", "Gbogbo owó iṣẹ́ àti ìyípadà owó yẹ kí ó hàn nínú ìṣirò gidi ti olùpèsè ìsanwó kí olùrànlọ́wọ́ tó fọwọ́ sí ìsanwó."],
    ],
    ctaEyebrow: "Nígbà tí o bá ti ṣetán", ctaTitle: "O ní ohun tó ṣe pàtàkì. Ẹ jẹ́ ká pe àwọn ènìyàn láti kópa.",
    ctaText: "Ṣẹ̀dá ìpolongo rẹ, pín í pẹ̀lú àwùjọ rẹ, kí ó sì rọrùn fún àwọn ènìyàn láti ṣe àtìlẹ́yìn fún ọ.",
    ctaButton: "Bẹ̀rẹ̀ ìkójọ owó", footerDescription: "A ń mú kí ó rọrùn fún àwọn ènìyàn láti kóra jọ fún ohun tó ṣe pàtàkì.",
    explore: "Ṣàwárí", getStarted: "Bẹ̀rẹ̀", footerHow: "Bí ó ṣe ń ṣiṣẹ́", footerWhy: "Ìdí PasteMe", footerFaq: "Ìbéèrè",
    footerCreate: "Ṣẹ̀dá ìpolongo", footerLogin: "Wíwọlé olùṣẹ̀dá", footerBottom: "A ṣe é láti mú ìtọrẹ rọrùn.",
  },
};
 
function Navbar({ t, language, onLanguageChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar landing-navbar">
      <div className="container navbar-inner">
        <BrandLogo className="brand" />

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={menuOpen}
          aria-controls="landing-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>

        <nav id="landing-navigation" className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#how-it-works" onClick={closeMenu}>{t.how}</a>
          <a href="#why-pasteme" onClick={closeMenu}>{t.why}</a>
          <a href="#faq" onClick={closeMenu}>{t.faqNav}</a>
          <div className="nav-actions">
            <InstallAppButton label={t.installApp} />
            <label className="landing-language">
              <span className="sr-only">{t.language}</span>
              <select value={language} onChange={onLanguageChange} aria-label={t.language}>
                <option value="en">English</option>
                <option value="pcm">Pidgin</option>
                <option value="yo">Yorùbá</option>
              </select>
            </label>
            <Link className="sign-in" to="/login" onClick={closeMenu}>{t.login}</Link>
            <Link className="primary-button nav-cta" to="/signup" onClick={closeMenu}>
              {t.signup} <Icon name="arrow-up-right" size={16} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function HeroVisual({ t }) {
  return (
    <div className="hero-visual" aria-label="An example of a PasteMe campaign page and sharing tools">
      <div className="hero-art-backdrop" aria-hidden="true">
        <span className="art-backdrop-line line-one" />
        <span className="art-backdrop-line line-two" />
        <span className="art-backdrop-dot dot-one" />
        <span className="art-backdrop-dot dot-two" />
      </div>

      <div className="hero-art-index" aria-hidden="true">
        <span>{t.visualIndex}</span>
        <span>{t.visualMadeFor}</span>
      </div>

      <article className="hero-campaign-card">
        <div className="hero-campaign-topline">
          <span className="hero-campaign-kicker">{t.visualType}</span>
          <span className="hero-sample-label">{t.visualStatus}</span>
        </div>

        <div className="hero-campaign-art">
          <div className="hero-art-shape shape-left" />
          <div className="hero-art-shape shape-right" />
          <div className="hero-art-sun" />
          <div className="hero-art-brandmark">
            <span className="hero-mini-brand"><img src={brandMark} alt="" /><span>PasteMe</span></span>
          </div>
          <div className="hero-art-message">
            <span>{t.visualMessage}</span>
            <strong>{t.visualTitle}</strong>
          </div>
          <div className="hero-art-caption">{t.visualText}</div>
        </div>

        <div className="hero-campaign-bottom">
          <div className="hero-fundraising-label">
            <span>₦620,000</span>
            <small>{t.visualOf}</small>
          </div>
          <div className="hero-campaign-progress" role="progressbar" aria-label={t.visualProgressLabel} aria-valuenow={62} aria-valuemin={0} aria-valuemax={100}>
            <span />
          </div>
          <div className="hero-campaign-meta">
            <span>62% {t.visualFunded}</span>
            <span>{t.visualView} <Icon name="arrow-up-right" size={13} /></span>
          </div>
        </div>
      </article>

      <div className="hero-floating-card hero-share-card">
        <span className="hero-floating-icon"><Icon name="qr-code" size={21} /></span>
        <span><strong>{t.visualShare}</strong><small>{t.visualShareSub}</small></span>
      </div>

      <div className="hero-floating-card hero-support-card">
        <span className="hero-floating-icon sage-icon"><Icon name="heart-handshake" size={20} /></span>
        <span><strong>{t.visualSimple}</strong><small>{t.visualNoAccount}</small></span>
      </div>

      
    </div>
  );
}

function Hero({ t }) {
  return (
    <section className="hero hero-editorial">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow"><span className="eyebrow-spark">✳</span>{t.eyebrow}</span>
          <h1>{t.heroTitle} <em>{t.heroAccent}</em></h1>
          <p className="hero-description">{t.heroText}</p>
          <div className="hero-actions">
            <Link to="/create" className="primary-button">{t.start} <Icon name="arrow-up-right" size={16} /></Link>
            <a href="#how-it-works" className="secondary-button">{t.seeHow} <Icon name="arrow-down" size={16} /></a>
          </div>
          <div className="hero-note"><span className="hero-note-dot" />{t.supporterNote}</div>
          
        </div>
        <HeroVisual t={t} />
      </div>
      <div className="hero-bottom-rule" aria-hidden="true"><span>{t.bottomOne}</span><span>{t.bottomTwo}</span><span>{t.bottomThree}</span></div>
    </section>
  );
}

function TrustStrip({ t }) {
  const icons = ["share", "qr-code", "check-circle"];
  return (
    <section className="trust-strip" aria-label="PasteMe benefits">
      <div className="container trust-inner">
        {t.trust.map((label, index) => (
          <div className="trust-item" key={label}>
            <span><Icon name={icons[index]} size={18} /></span>{label}
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks({ t }) {
  const icons = ["file-text", "qr-code", "heart-handshake"];
  return (
    <section className="section how-section" id="how-it-works">
      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow">{t.howEyebrow}</span>
          <h2>{t.howTitle}</h2>
          <p>{t.howText}</p>
        </div>
        <div className="steps-grid">
          {t.steps.map(([title, description], index) => (
            <article className="step-card" key={title}>
              <div className="step-top">
                <span className="step-icon"><Icon name={icons[index]} size={22} /></span>
                <span className="step-number">0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="step-bottom-mark" aria-hidden="true"><Icon name="arrow-up-right" size={17} /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyPasteMe({ t }) {
  const benefitIcons = ["file-text", "qr-code", "users", "shield-check"];
  return (
    <section className="section why-section" id="why-pasteme">
      <div className="container why-grid">
        <div className="why-copy">
          <span className="eyebrow">{t.whyEyebrow}</span>
          <h2>{t.whyTitle}</h2>
          <p>{t.whyText}</p>
          <Link to="/create" className="text-link">{t.createCampaign} <Icon name="arrow-up-right" size={16} /></Link>
        </div>
        <div className="benefit-grid">
          {t.benefits.map(([title, description], index) => (
            <article className="benefit-card" key={title}>
              <span className="benefit-icon"><Icon name={benefitIcons[index]} size={21} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ({ t }) {
  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-grid">
        <div className="section-heading">
          <span className="eyebrow">{t.faqEyebrow}</span>
          <h2>{t.faqTitle}</h2>
          <p>{t.faqText}</p>
        </div>
        <div className="faq-list">
          {t.faqs.map(([question, answer]) => (
            <details className="faq-item" key={question}>
              <summary><span>{question}</span><span className="faq-plus" aria-hidden="true"><Icon name="plus" size={16} /></span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ t }) {
  return (
    <section className="final-cta">
      <div className="container final-cta-inner">
        <div>
          <span className="eyebrow">{t.ctaEyebrow}</span>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
        </div>
        <Link to="/create" className="cta-light-button">{t.ctaButton} <Icon name="arrow-up-right" size={16} /></Link>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <BrandLogo className="brand" />
          <p>{t.footerDescription}</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>{t.explore}</strong>
            <a href="#how-it-works">{t.footerHow}</a>
            <a href="#why-pasteme">{t.footerWhy}</a>
            <a href="#faq">{t.footerFaq}</a>
          </div>
          <div>
            <strong>{t.getStarted}</strong>
            <Link to="/create">{t.footerCreate}</Link>
            <Link to="/login">{t.footerLogin}</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} PasteMe. All rights reserved.</span>
        <span>{t.footerBottom}</span>
      </div>
    </footer>
  );
}

export default function Landing() {
  const [language, setLanguage] = useState(() => localStorage.getItem("pasteme_language") || "en");
  const t = copy[language] || copy.en;

  const handleLanguageChange = (event) => {
    const selected = event.target.value;
    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  };

  return (
    <>
      <Navbar t={t} language={language} onLanguageChange={handleLanguageChange} />
      <main>
        <Hero t={t} />
        <TrustStrip t={t} />
        <HowItWorks t={t} />
        <WhyPasteMe t={t} />
        <FAQ t={t} />
        <FinalCTA t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
