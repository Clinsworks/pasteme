import { useState } from "react";
import { Link } from "react-router-dom";
import InstallAppButton from "../../components/InstallAppButton";
import "./Landing.css";

const copy = {
  en: {
    how: "How it works", why: "Why PasteMe", faqNav: "FAQs", login: "Sign in", signup: "Get started",
    language: "Language", installApp: "Install app", eyebrow: "Fundraising, made easier",
    heroTitle: "A little help can go", heroAccent: "a long way.",
    heroText: "Turn your cause into a fundraising page people can support. Share one link or QR code, and make it easier for your community to contribute.",
    start: "Start a fundraiser", seeHow: "See how it works",
    supporterNote: "Supporters can contribute without creating a PasteMe account.",
    visualShare: "Easy to share", visualShareSub: "One link. One QR.",
    visualType: "A COMMUNITY CAMPAIGN", visualStatus: "ACTIVE CAMPAIGN",
    visualTitle: "Help a dream take shape.", visualText: "Every contribution brings us one step closer.",
    visualOf: "of 1,000,000", visualFunded: "funded", visualView: "View campaign",
    visualSimple: "Simple contributions", visualNoAccount: "No PasteMe account needed",
    qrCaption: "CAMPAIGN QR PREVIEW", qrScan: "Scan to view campaign",
    trust: ["Easy campaign sharing", "QR-powered access", "Payment status transparency"],
    howEyebrow: "Simple by design", howTitle: "Three steps. One less barrier to giving.",
    howText: "From creating your campaign to receiving support, PasteMe keeps the process straightforward.",
    steps: [
      ["Create your fundraiser", "Tell your story, set a goal, and connect your compatible receiving wallet."],
      ["Share your page", "Get a unique campaign link and QR code. Share them with your community."],
      ["Receive contributions", "Supporters open your page, choose an amount, and complete payment through their wallet."],
    ],
    whyEyebrow: "Made for sharing", whyTitle: "Let people focus on your cause, not the process.",
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
    ctaEyebrow: "Your next step starts here", ctaTitle: "Your story deserves to be heard.",
    ctaText: "Create your campaign, share it with your community, and make it easier for people to support your cause.",
    ctaButton: "Start a fundraiser", footerDescription: "Making it easier to bring people together around a cause.",
    explore: "Explore", getStarted: "Get started", footerHow: "How it works", footerWhy: "Why PasteMe", footerFaq: "FAQs",
    footerCreate: "Create a campaign", footerLogin: "Creator sign in", footerBottom: "Built to make giving easier.",
  },
  pcm: {
    how: "How e dey work", why: "Why PasteMe", faqNav: "FAQs", login: "Log in", signup: "Get started",
    language: "Language", installApp: "Install app", eyebrow: "Fundraising don easier",
    heroTitle: "Small help fit go", heroAccent: "long way.",
    heroText: "Turn your cause to fundraising page wey people fit support. Share one link or QR code make your community fit contribute easily.",
    start: "Start fundraiser", seeHow: "See how e dey work",
    supporterNote: "People fit contribute without creating PasteMe account.",
    visualShare: "Easy to share", visualShareSub: "One link. One QR.",
    visualType: "COMMUNITY CAMPAIGN", visualStatus: "CAMPAIGN DEY ACTIVE",
    visualTitle: "Help make one dream happen.", visualText: "Every contribution dey bring us closer.",
    visualOf: "of 1,000,000", visualFunded: "don fund", visualView: "See campaign",
    visualSimple: "Easy contributions", visualNoAccount: "No PasteMe account needed",
    qrCaption: "CAMPAIGN QR PREVIEW", qrScan: "Scan am to see campaign",
    trust: ["Easy campaign sharing", "QR code access", "Clear payment status"],
    howEyebrow: "Simple by design", howTitle: "Three steps. Make giving easy.",
    howText: "From creating campaign to receiving support, PasteMe make the process straightforward.",
    steps: [
      ["Create your fundraiser", "Tell your story, set your target, and connect your receiving wallet."],
      ["Share your page", "Get campaign link and QR code wey you fit share with your community."],
      ["Receive contributions", "People go open your page, choose amount, and pay through their wallet."],
    ],
    whyEyebrow: "Made for sharing", whyTitle: "Make people focus on your cause, no be the process.",
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
    ctaEyebrow: "Your next step starts here", ctaTitle: "Your story deserve make people hear am.",
    ctaText: "Create your campaign, share am with your community, and make people fit support your cause easily.",
    ctaButton: "Start fundraiser", footerDescription: "We dey make am easy for people to join around one cause.",
    explore: "Explore", getStarted: "Get started", footerHow: "How e dey work", footerWhy: "Why PasteMe", footerFaq: "FAQs",
    footerCreate: "Create campaign", footerLogin: "Creator login", footerBottom: "Built to make giving easier.",
  },
  yo: {
    how: "Bí ó ṣe ń ṣiṣẹ́", why: "Ìdí PasteMe", faqNav: "Ìbéèrè", login: "Wọlé", signup: "Bẹ̀rẹ̀",
    language: "Èdè", installApp: "Fi app sori ẹrọ", eyebrow: "A mú ìkójọ owó rọrùn",
    heroTitle: "Ìrànlọ́wọ́ díẹ̀ lè lọ", heroAccent: "jìnnà.",
    heroText: "Yí ohun tó ṣe pàtàkì sí ọ padà sí ojú ìkójọ owó tí àwọn ènìyàn lè ṣe àtìlẹ́yìn fún. Pín ìjápọ̀ kan tàbí kóòdù QR kí àwùjọ rẹ lè ṣètọrẹ.",
    start: "Bẹ̀rẹ̀ ìkójọ owó", seeHow: "Wo bí ó ṣe ń ṣiṣẹ́",
    supporterNote: "Àwọn olùrànlọ́wọ́ lè ṣètọrẹ láìní àkáǹtì PasteMe.",
    visualShare: "Ó rọrùn láti pín", visualShareSub: "Ìjápọ̀ kan. QR kan.",
    visualType: "ÌPOLONGO ÀWÙJỌ", visualStatus: "ÌPOLONGO Ń LỌ LỌ́WỌ́",
    visualTitle: "Ran àlá kan lọ́wọ́ láti ṣẹ. ", visualText: "Gbogbo ìrànlọ́wọ́ mú wa sún mọ́ àfojúsùn.",
    visualOf: "nínú 1,000,000", visualFunded: "ti kún", visualView: "Wo ìpolongo",
    visualSimple: "Ìtọrẹ rọrùn", visualNoAccount: "Kò nílò àkáǹtì PasteMe",
    qrCaption: "ÀFÍHÀN KÓÒDÙ QR", qrScan: "Ṣàyẹ̀wò láti wo ìpolongo",
    trust: ["Pípin ìpolongo rọrùn", "Wíwọlé pẹ̀lú QR", "Ipò ìsanwó tó ṣe kedere"],
    howEyebrow: "A ṣe é ní ọ̀nà tó rọrùn", howTitle: "Ìgbésẹ̀ mẹ́ta. Ìdènà díẹ̀ sí ìtọrẹ.",
    howText: "Láti ṣíṣe ìpolongo sí gbígba ìrànlọ́wọ́, PasteMe mú gbogbo ìgbésẹ̀ rọrùn.",
    steps: [
      ["Ṣẹ̀dá ìpolongo rẹ", "Sọ ìtàn rẹ, yan àfojúsùn owó, kí o sì so àpò owó ìgbàwọlé pọ̀."],
      ["Pín ojú ìwé rẹ", "Gba ìjápọ̀ àti kóòdù QR pàtàkì, kí o sì pín wọn pẹ̀lú àwùjọ rẹ."],
      ["Gba ìtọrẹ", "Àwọn ènìyàn yóò ṣí ojú ìwé rẹ, yan iye owó, kí wọ́n sì san án nípasẹ̀ àpò owó wọn."],
    ],
    whyEyebrow: "A ṣe é fún pípin", whyTitle: "Jẹ́ kí àwọn ènìyàn dojú kọ ohun tó ṣe pàtàkì, kì í ṣe ìlànà náà.",
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
    ctaEyebrow: "Ìgbésẹ̀ rẹ tó kàn bẹ̀rẹ̀ níbí", ctaTitle: "Ó yẹ kí àwọn ènìyàn gbọ́ ìtàn rẹ.",
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
    <header className="navbar">
      <div className="container navbar-inner">
        <Link className="brand" to="/" aria-label="PasteMe home">
          <span className="brand-mark">P</span>
          <span>PasteMe<span className="brand-period">.</span></span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
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
              {t.signup} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function QRPreview({ t }) {
  // Decorative matrix for the landing-page illustration only.
  const matrix = [
    "111111100101111", "100000101101001", "101110100101101",
    "101110101001101", "101110100111101", "100000101000001",
    "111111101010111", "000000001101000", "110101111010101",
    "011010001101110", "101101110010011", "100011001111010",
    "111111101001101", "100000101110010", "111111101011111",
  ];

  return (
    <div className="qr-preview">
      <div className="qr-matrix" aria-hidden="true">
        {matrix.join("").split("").map((cell, index) => (
          <span key={index} className={cell === "1" ? "qr-cell filled" : "qr-cell"} />
        ))}
      </div>
      <span className="qr-caption">{t.qrCaption}</span>
      <span className="qr-scan">{t.qrScan}</span>
    </div>
  );
}

function HeroVisual({ t }) {
  return (
    <div className="hero-visual" aria-label="Illustration of a PasteMe fundraising campaign">
      <div className="visual-orbit orbit-one" />
      <div className="visual-orbit orbit-two" />

      <div className="floating-note note-top">
        <span className="note-icon">↗</span>
        <span><strong>{t.visualShare}</strong><small>{t.visualShareSub}</small></span>
      </div>

      <div className="campaign-phone">
        <div className="phone-top">
          <span className="phone-brand">PasteMe.</span>
          <span className="phone-menu">•••</span>
        </div>
        <div className="campaign-image">
          <div className="image-sun" />
          <div className="image-hill hill-back" />
          <div className="image-hill hill-front" />
          <span className="image-label">{t.visualType}</span>
        </div>
        <div className="phone-content">
          <span className="campaign-status">● {t.visualStatus}</span>
          <h3>{t.visualTitle}</h3>
          <p>{t.visualText}</p>
          <div className="progress-label"><strong>620,000</strong><span>{t.visualOf}</span></div>
          <div className="progress-track" role="progressbar" aria-label="Campaign funding preview" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"><span /></div>
          <div className="phone-footer"><span>62% {t.visualFunded}</span><span>{t.visualView} ↗</span></div>
        </div>
      </div>

      <div className="floating-qr"><QRPreview t={t} /></div>

      <div className="floating-note note-bottom">
        <span className="success-icon">✓</span>
        <span><strong>{t.visualSimple}</strong><small>{t.visualNoAccount}</small></span>
      </div>
    </div>
  );
}

function Hero({ t }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.heroTitle} <span>{t.heroAccent}</span></h1>
          <p className="hero-description">{t.heroText}</p>
          <div className="hero-actions">
            <Link to="/create" className="primary-button">{t.start} <span aria-hidden="true">↗</span></Link>
            <a href="#how-it-works" className="secondary-button">{t.seeHow} <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-note"><span className="hero-note-dot" />{t.supporterNote}</div>
        </div>
        <HeroVisual t={t} />
      </div>
    </section>
  );
}

function TrustStrip({ t }) {
  const icons = ["↗", "▦", "✓"];
  return (
    <section className="trust-strip">
      <div className="container trust-inner">
        {t.trust.map((label, index) => (
          <div className="trust-item" key={label}><span>{icons[index]}</span>{label}</div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks({ t }) {
  const icons = ["✳", "↗", "♡"];
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
              <div className="step-top"><span className="step-icon">{icons[index]}</span><span className="step-number">0{index + 1}</span></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyPasteMe({ t }) {
  return (
    <section className="section why-section" id="why-pasteme">
      <div className="container why-grid">
        <div className="why-copy">
          <span className="eyebrow">{t.whyEyebrow}</span>
          <h2>{t.whyTitle}</h2>
          <p>{t.whyText}</p>
          <Link to="/create" className="text-link">{t.createCampaign} <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="benefit-grid">
          {t.benefits.map(([title, description], index) => (
            <article className="benefit-card" key={title}>
              <span className="benefit-icon">{["▤", "▦", "→", "✓"][index]}</span>
              <h3>{title}</h3><p>{description}</p>
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
              <summary><span>{question}</span><span className="faq-plus" aria-hidden="true">+</span></summary>
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
        <Link to="/create" className="cta-light-button">{t.ctaButton} <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link className="brand" to="/"><span className="brand-mark">P</span><span>PasteMe<span className="brand-period">.</span></span></Link>
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
