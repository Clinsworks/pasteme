import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo";
import brandMark from "../../assets/logo.svg";
import Icon from "../../components/Icon";
import InstallAppButton from "../../components/InstallAppButton";
import PasteCard from "../../components/PasteCard";
import { useAuth } from "../../context/AuthContext";
import { getCommunityHighlights, getCommunityImpact, listDiscoverablePastes } from "../../lib/discoveryStore";
import { formatMoney } from "../../lib/money";
import "./Landing.css";

const Cloudee = lazy(() => import("../../components/CloudeeAvatar"));

const copy = {
  en: {
    how: "How it works", why: "Why PasteMe", faqNav: "FAQs", login: "Sign in", signup: "Get started", openMenu: "Open navigation", closeMenu: "Close navigation", visualProgressLabel: "Sample campaign progress",
    language: "Language", installApp: "Install app", eyebrow: "Fundraising, made easier",
    heroTitle: "Big things happen when", heroAccent: "we show up.",
    heroText: "Discover students who need a hand, read their stories and find a way to help. Got something of your own to make happen? Start a Paste and bring your people along.",
    start: "Start a fundraiser", seeHow: "See how it works",
    supporterNote: "Browse freely. No PasteMe account is needed to contribute.",
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
      ["Receive contributions", "People choose an amount and authorize payment through a compatible wallet. No PasteMe account is needed."],
    ],
    whyEyebrow: "Made for real life", whyTitle: "Less time figuring things out. More time getting support.",
    whyText: "A fundraiser should be easy to find, easy to understand, and straightforward to support. PasteMe brings those pieces together.",
    createCampaign: "Create your campaign",
    benefits: [
      ["Your own fundraising page", "Give your cause a dedicated page where people can understand what you're raising money for."],
      ["QR-powered sharing", "Make your campaign easy to access from posters, social media, events, and printed materials."],
      ["An account for creators", "Use a PasteMe account to create fundraisers; supporters can contribute without signing in."],
      ["Transparent payment status", "Campaign progress should reflect contributions that have been confirmed by the payment provider."],
    ],
    faqEyebrow: "Good questions", faqTitle: "Before you get started.",
    faqText: "Here are a few things worth knowing about how PasteMe works.",
    faqs: [
      ["What is PasteMe?", "PasteMe helps people create fundraising pages, share them through a unique link or QR code, and receive contributions through compatible digital wallets."],
      ["Do I need an account to support someone?", "No. Open any public Paste, choose Contribute, and go straight to checkout. You authorize payment with your compatible wallet."],
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
    navHome: "Home", navExplore: "Explore Pastes", dashboard: "Dashboard", startPaste: "Start a Paste", explorePastes: "Explore Pastes", exploreSubtitle: "See what students are working towards. Maybe there's a story you can help move forward.",
    impactEyebrow: "LOOK WHAT WE CAN DO TOGETHER", impactTitle: "Little bits of help add up.", impactText: "As the community grows, we'll share the real difference people are making here.", totalContributed: "Total contributed", studentsHelped: "Students helped", activePastes: "Active Pastes", contributors: "Contributors", impactEmpty: "Community numbers will show here as confirmed activity comes in.", impactUnavailable: "Community numbers are not loading right now.", featuredUnavailable: "We could not load Pastes right now.", highlightsUnavailable: "Community highlights are not loading right now.", retry: "Try again",
    featuredEyebrow: "A PLACE TO START", featuredTitle: "A few stories from the community.", featuredText: "Take a look around. Someone's story might be one you can help with.", viewAllPastes: "See all Pastes", noFeatured: "No active Pastes to show just yet. Check back as students share their stories.",
    highlightsEyebrow: "GOOD THINGS HAPPEN HERE", highlightsTitle: "People showing up for people.", topContributors: "Community supporters", contributorPeriod: "Based on confirmed contributions in the last 30 days.", recentMilestones: "Recent milestones", anonymousSupporter: "A community member", noLeaders: "Supporter highlights will appear here as contributions are confirmed.", noMilestones: "Milestones will show here when a Paste reaches a meaningful goal.", milestoneReached: "reached",
    cardBy: "By", cardView: "View Paste", cardContribute: "Contribute", cardRaised: "raised so far", cardGoal: "Goal", cardNoGoal: "No goal set", cardFunded: "funded", cardSupporters: "supporters", cardUntitled: "Untitled Paste", cardProgress: "Fundraising progress",

  },
  pcm: {
    how: "How e dey work", why: "Why PasteMe", faqNav: "FAQs", login: "Log in", signup: "Get started", openMenu: "Open navigation", closeMenu: "Close navigation", visualProgressLabel: "Sample campaign progress",
    language: "Language", installApp: "Install app", eyebrow: "Fundraising don easier",
    heroTitle: "Big things fit happen when", heroAccent: "we show up.",
    heroText: "Find students wey need small support, read their stories and see how you fit help. You get your own thing wey you wan make happen? Start a Paste and bring your people along.",
    start: "Start fundraiser", seeHow: "See how e dey work",
    supporterNote: "Browse freely. You no need PasteMe account to contribute.",
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
      ["Receive contributions", "People choose amount and authorize payment through compatible wallet. Dem no need PasteMe account."],
    ],
    whyEyebrow: "Made for sharing", whyTitle: "Make people focus on your cause, no be wahala.",
    whyText: "Fundraising suppose easy to find, understand and support. PasteMe bring everything together.",
    createCampaign: "Create your campaign",
    benefits: [
      ["Your own fundraising page", "Give your cause one page wey people fit understand wetin you dey raise money for."],
      ["QR-powered sharing", "Make people access your campaign from posters, social media, events and printed materials."],
      ["Account na for creators", "Use PasteMe account to create fundraiser; supporters fit contribute without login."],
      ["Clear payment status", "Campaign progress suppose show only contributions wey payment provider don confirm."],
    ],
    faqEyebrow: "Good questions", faqTitle: "Before you start.",
    faqText: "See some things wey you suppose know about how PasteMe dey work.",
    faqs: [
      ["Wetin be PasteMe?", "PasteMe help people create fundraising pages, share with link or QR code, and receive contributions through compatible digital wallets."],
      ["I need account to support person?", "No. Open any public Paste, choose Contribute, and go straight to checkout. Authorize payment with your compatible wallet."],
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
    navHome: "Home", navExplore: "Explore Pastes", dashboard: "Dashboard", startPaste: "Start a Paste", explorePastes: "Explore Pastes", exploreSubtitle: "See wetin students dey work towards. Maybe na one story you fit help move forward.",
    impactEyebrow: "SEE WETIN WE FIT DO TOGETHER", impactTitle: "Small-small help fit add up.", impactText: "As the community dey grow, we go show the real difference wey people dey make here.", totalContributed: "Total money wey people don give", studentsHelped: "Students wey get help", activePastes: "Pastes wey dey active", contributors: "People wey contribute", impactEmpty: "Community numbers go show here as confirmed activity dey enter.", impactUnavailable: "We no fit load community numbers now.", featuredUnavailable: "We no fit load Pastes now.", highlightsUnavailable: "Community highlights no fit load now.", retry: "Try again",
    featuredEyebrow: "MAKE WE START HERE", featuredTitle: "Some stories from the community.", featuredText: "Look around first. You fit see one story wey you fit help.", viewAllPastes: "See all Pastes", noFeatured: "No active Paste dey here yet. Check back as students share their stories.",
    highlightsEyebrow: "GOOD THINGS DEY HAPPEN HERE", highlightsTitle: "People dey show up for people.", topContributors: "People wey support others", contributorPeriod: "Based on confirmed contributions for the last 30 days.", recentMilestones: "Recent milestones", anonymousSupporter: "One person for the community", noLeaders: "Supporter highlights go show as contributions dey confirm.", noMilestones: "Milestones go show when one Paste reach important target.", milestoneReached: "don reach",
    cardBy: "By", cardView: "See Paste", cardContribute: "Contribute", cardRaised: "money wey don enter", cardGoal: "Target", cardNoGoal: "No target set", cardFunded: "don fund", cardSupporters: "supporters", cardUntitled: "Untitled Paste", cardProgress: "Fundraising progress",

  },
  yo: {
    how: "Bí ó ṣe ń ṣiṣẹ́", why: "Ìdí PasteMe", faqNav: "Ìbéèrè", login: "Wọlé", signup: "Bẹ̀rẹ̀", openMenu: "Ṣí àkójọ", closeMenu: "Pa àkójọ", visualProgressLabel: "Ìlọsíwájú àpẹẹrẹ ìpolongo",
    language: "Èdè", installApp: "Fi app sori ẹrọ", eyebrow: "A mú ìkójọ owó rọrùn",
    heroTitle: "Ohun ńlá máa ń ṣẹlẹ̀ nígbà tí", heroAccent: "a bá fọwọ́sowọ́pọ̀.",
    heroText: "Ṣàwárí àwọn akẹ́kọ̀ọ́ tó nílò ìrànlọ́wọ́, ka ìtàn wọn kí o sì rí ọ̀nà láti ràn wọ́n lọ́wọ́. Ṣé o tún ní ohun tí o fẹ́ ṣe? Ṣẹ̀dá Paste rẹ kí o sì pe àwọn ènìyàn rẹ láti kópa.",
    start: "Bẹ̀rẹ̀ ìkójọ owó", seeHow: "Wo bí ó ṣe ń ṣiṣẹ́",
    supporterNote: "O lè ṣàwárí láìwọlé, kí o sì ṣètọrẹ láìní àkáǹtì PasteMe.",
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
      ["Gba ìtọrẹ", "Àwọn ènìyàn yóò yan iye owó, kí wọ́n sì fọwọ́ sí ìsanwó pẹ̀lú àpò owó tó bá mu. Àkáǹtì PasteMe kò pọndandan."],
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
      ["Ṣé mo nílò àkáǹtì láti ṣètọrẹ?", "Rárá. Ṣí Paste gbogbogbò, yan Ṣètọrẹ, kí o sì lọ tààrà sí ojú ìsanwó. Fọwọ́ sí ìsanwó pẹ̀lú àpò owó tó bá mu."],
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
    navHome: "Ilé", navExplore: "Ṣàwárí Pastes", dashboard: "Ojú ìṣàkóso", startPaste: "Bẹ̀rẹ̀ Paste", explorePastes: "Ṣàwárí Pastes", exploreSubtitle: "Wo ohun tí àwọn akẹ́kọ̀ọ́ ń ṣiṣẹ́ lé lórí. Ó ṣeé ṣe kí ìtàn kan wà tí o lè ràn lọ́wọ́.",
    impactEyebrow: "WO OHUN TÍ A LÈ ṢE PAPỌ̀", impactTitle: "Ìrànlọ́wọ́ kékeré máa ń pọ̀ sí i.", impactText: "Bí àwùjọ ṣe ń dàgbà, a ó fi ipa gidi tí àwọn ènìyàn ń ní hàn.", totalContributed: "Àpapọ̀ owó ìtọrẹ", studentsHelped: "Àwọn akẹ́kọ̀ọ́ tí a ràn lọ́wọ́", activePastes: "Pastes tó ń ṣiṣẹ́", contributors: "Àwọn olùrànlọ́wọ́", impactEmpty: "Àwọn nọ́ńbà àwùjọ yóò hàn níbí bí a ṣe ń gba ìtọrẹ tí a ti jẹ́rìí.", impactUnavailable: "A kò lè ṣí àwọn nọ́ńbà àwùjọ báyìí.", featuredUnavailable: "A kò lè ṣí àwọn Paste báyìí.", highlightsUnavailable: "A kò lè ṣí àkójọ àwọn tó ń ṣe àtìlẹ́yìn báyìí.", retry: "Tún gbìyànjú",
    featuredEyebrow: "IBI TÍ A TI LÈ BẸ̀RẸ̀", featuredTitle: "Àwọn ìtàn díẹ̀ láti inú àwùjọ.", featuredText: "Wo àwọn ìpolongo. Ó ṣeé ṣe kí ìtàn kan wà tí o lè ràn lọ́wọ́.", viewAllPastes: "Wo gbogbo Pastes", noFeatured: "Kò sí Paste tó ń ṣiṣẹ́ láti fi hàn síbẹ̀. Padà wá bí àwọn akẹ́kọ̀ọ́ ṣe ń pín ìtàn wọn.",
    highlightsEyebrow: "OHUN RERE Ń ṢẸLẸ̀ NÍBÍ", highlightsTitle: "Àwọn ènìyàn ń ran ara wọn lọ́wọ́.", topContributors: "Àwọn tó ń ṣe àtìlẹ́yìn", contributorPeriod: "Lórí àwọn ìtọrẹ tí a ti jẹ́rìí ní ọjọ́ 30 tó kọjá.", recentMilestones: "Àwọn ìpele tuntun", anonymousSupporter: "Ẹnìkan nínú àwùjọ", noLeaders: "Àwọn olùrànlọ́wọ́ yóò hàn níbí bí a ṣe ń jẹ́rìí ìtọrẹ.", noMilestones: "Àwọn ìpele yóò hàn nígbà tí Paste bá dé àfojúsùn pàtàkì kan.", milestoneReached: "ti dé",
    cardBy: "Láti ọ̀dọ̀", cardView: "Wo Paste", cardContribute: "Ṣètọrẹ", cardRaised: "owó tí a ti gbà", cardGoal: "Àfojúsùn", cardNoGoal: "Kò sí àfojúsùn", cardFunded: "ti kún", cardSupporters: "olùrànlọ́wọ́", cardUntitled: "Paste tí kò ní àkọlé", cardProgress: "Ìlọsíwájú ìkójọ owó",

  },
};
 
function Navbar({ t, language, onLanguageChange, isAuthenticated }) {
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
          <Link to="/" onClick={closeMenu}>{t.navHome}</Link>
          {/* <Link to="/explore" onClick={closeMenu}>{t.navExplore}</Link> */}
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
            {isAuthenticated ? (
              <Link className="sign-in" to="/dashboard" onClick={closeMenu}>{t.dashboard}</Link>
            ) : (
              <Link className="sign-in" to="/login" onClick={closeMenu}>{t.login}</Link>
            )}
            <Link className="primary-button nav-cta" to={isAuthenticated ? "/create" : "/signup"} onClick={closeMenu}>
              {isAuthenticated ? t.startPaste : t.signup} <Icon name="arrow-up-right" size={16} />
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

function Hero({ t, isAuthenticated }) {
  return (
    <section className="hero hero-editorial landing-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow"><span className="eyebrow-spark">✳</span>{t.eyebrow}</span>
          <h1>{t.heroTitle} <em>{t.heroAccent}</em></h1>
          <p className="hero-description">{t.heroText}</p>
          <div className="hero-actions">
            <Link to="/explore" className="primary-button">{t.explorePastes} <Icon name="arrow-up-right" size={16} /></Link>
            <Link to={isAuthenticated ? "/create" : "/signup"} className="secondary-button">{t.startPaste} <Icon name="plus" size={16} /></Link>
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
    <section className="trust-strip landing-section" aria-label="PasteMe benefits">
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

function impactTotal(impact) {
  const totals = Array.isArray(impact?.totalsByCurrency) ? impact.totalsByCurrency : [];
  if (totals.length) {
    return totals.map((item) => formatMoney(item.amount ?? item.value, item.currency || "NGN", item.assetScale)).join(" · ");
  }
  if (impact?.totalContributed && typeof impact.totalContributed === "object") {
    const item = impact.totalContributed;
    return formatMoney(item.amount ?? item.value, item.currency || "NGN", item.assetScale);
  }
  return impact?.totalContributed != null
    ? formatMoney(impact.totalContributed, impact.currency || "NGN", impact.assetScale)
    : "—";
}

function CommunityImpact({ t, impact, loading, error, onRetry }) {
  const hasImpactData = Boolean(
    (Array.isArray(impact?.totalsByCurrency) && impact.totalsByCurrency.length) ||
    impact?.totalContributed != null ||
    impact?.studentsHelped != null ||
    impact?.activePastes != null ||
    impact?.contributors != null
  );
  const stats = [
    { icon: "wallet", label: t.totalContributed, value: loading ? "···" : impactTotal(impact) },
    { icon: "graduation-cap", label: t.studentsHelped, value: loading || impact?.studentsHelped == null ? "—" : Number(impact.studentsHelped).toLocaleString() },
    { icon: "megaphone", label: t.activePastes, value: loading || impact?.activePastes == null ? "—" : Number(impact.activePastes).toLocaleString() },
    { icon: "users", label: t.contributors, value: loading || impact?.contributors == null ? "—" : Number(impact.contributors).toLocaleString() },
  ];

  return (
    <section className="section community-impact-section landing-section">
      <div className="container">
        <div className="community-impact-heading">
          <div>
            <span className="eyebrow">{t.impactEyebrow}</span>
            <h2>{t.impactTitle}</h2>
            <p>{t.impactText}</p>
          </div>
          <span className="community-impact-mark"><Icon name="heart-handshake" size={27} /></span>
        </div>
        <div className="community-impact-grid">
          {stats.map((stat) => (
            <article className="community-impact-stat" key={stat.label}>
              <span className="community-impact-icon"><Icon name={stat.icon} size={20} /></span>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
        {!loading && error ? (
          <p className="community-impact-note community-data-error">
            {t.impactUnavailable} <button type="button" onClick={onRetry}>{t.retry}</button>
          </p>
        ) : !loading && !hasImpactData ? (
          <p className="community-impact-note">{t.impactEmpty}</p>
        ) : null}
      </div>
    </section>
  );
}

function pasteCardLabels(t) {
  return {
    by: t.cardBy,
    view: t.cardView,
    contribute: t.cardContribute,
    raised: t.cardRaised,
    goal: t.cardGoal,
    noGoal: t.cardNoGoal,
    funded: t.cardFunded,
    supporters: t.cardSupporters,
    untitled: t.cardUntitled,
    progress: t.cardProgress,
  };
}

function FeaturedPastes({ t, pastes, loading, error, onRetry }) {
  return (
    <section className="section featured-pastes-section landing-section" id="explore-pastes">
      <div className="container">
        <div className="featured-pastes-heading">
          <div className="section-heading">
            <span className="eyebrow">{t.featuredEyebrow}</span>
            <h2>{t.featuredTitle}</h2>
            <p>{t.featuredText}</p>
          </div>
          <Link className="featured-view-all" to="/explore">{t.viewAllPastes}<Icon name="arrow-up-right" size={16} /></Link>
        </div>
        {loading ? (
          <div className="featured-paste-skeletons" aria-label={t.loading}>
            {[0, 1, 2].map((item) => <div className="featured-paste-skeleton" key={item} />)}
          </div>
        ) : error ? (
          <div className="featured-pastes-empty featured-pastes-error">
            <Icon name="cloud-off" size={22} />
            <p>{t.featuredUnavailable}</p>
            <button type="button" onClick={onRetry}>{t.retry}</button>
          </div>
        ) : pastes.length ? (
          <div className="featured-paste-grid">
            {pastes.slice(0, 3).map((paste) => (
              <PasteCard key={paste.id || paste._id} paste={paste} language={t.languageCode || "en"} labels={pasteCardLabels(t)} />
            ))}
          </div>
        ) : (
          <div className="featured-pastes-empty"><Icon name="heart-handshake" size={22} /><p>{t.noFeatured}</p><Link to="/explore">{t.viewAllPastes}<Icon name="arrow-up-right" size={14} /></Link></div>
        )}
      </div>
    </section>
  );
}

function CommunityHighlights({ t, highlights, loading, error, onRetry }) {
  const contributors = Array.isArray(highlights?.topContributors) ? highlights.topContributors.slice(0, 3) : [];
  const milestones = Array.isArray(highlights?.recentMilestones) ? highlights.recentMilestones.slice(0, 3) : [];

  return (
    <section className="section community-highlights-section landing-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{t.highlightsEyebrow}</span>
          <h2>{t.highlightsTitle}</h2>
        </div>
        <div className="community-highlights-grid">
          <article className="community-highlight-panel">
            <div className="community-highlight-title"><Icon name="users" size={19} /><div><h3>{t.topContributors}</h3><small className="community-period-note">{t.contributorPeriod}</small></div></div>
            {loading ? <p className="community-highlight-empty">{t.loading}</p> : error ? (
              <p className="community-highlight-empty community-data-error">{t.highlightsUnavailable} <button type="button" onClick={onRetry}>{t.retry}</button></p>
            ) : contributors.length ? (
              <ol className="community-leader-list">
                {contributors.map((person, index) => {
                  const anonymous = Boolean(person.anonymous || person.isAnonymous);
                  const name = anonymous ? t.anonymousSupporter : (person.displayName || person.name || t.anonymousSupporter);
                  const amount = person.contributionTotal ?? person.totalContributed;
                  return <li key={`${name}-${index}`}><span className="community-leader-rank">0{index + 1}</span><span className="community-leader-name">{name}</span>{!anonymous && amount != null && <strong>{formatMoney(amount, person.currency || "NGN", person.assetScale)}</strong>}</li>;
                })}
              </ol>
            ) : <p className="community-highlight-empty">{t.noLeaders}</p>}
          </article>

          <article className="community-highlight-panel milestone-panel">
            <div className="community-highlight-title"><Icon name="flag" size={19} /><h3>{t.recentMilestones}</h3></div>
            {loading ? <p className="community-highlight-empty">{t.loading}</p> : error ? (
              <p className="community-highlight-empty community-data-error">{t.highlightsUnavailable} <button type="button" onClick={onRetry}>{t.retry}</button></p>
            ) : milestones.length ? (
              <ul className="community-milestone-list">
                {milestones.map((milestone, index) => (
                  <li key={`${milestone.campaignId || milestone.id || milestone.campaignTitle}-${index}`}>
                    <span className="community-milestone-mark"><Icon name="check" size={15} /></span>
                    <span>
                      <strong>
                        {milestone.campaignId ? (
                          <Link className="community-milestone-link" to={`/c/${encodeURIComponent(milestone.campaignId)}`}>
                            {milestone.campaignTitle || milestone.title || t.featuredTitle}
                          </Link>
                        ) : (milestone.campaignTitle || milestone.title || t.featuredTitle)}
                      </strong>
                      <small>{Math.round(Number(milestone.progressPercent ?? milestone.progress) || 0)}% {t.milestoneReached}</small>
                    </span>
                  </li>
                ))}
              </ul>
            ) : <p className="community-highlight-empty">{t.noMilestones}</p>}
          </article>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ t }) {
  const icons = ["file-text", "qr-code", "heart-handshake"];
  return (
    <section className="section how-section landing-section" id="how-it-works">
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

function WhyPasteMe({ t, isAuthenticated }) {
  const benefitIcons = ["file-text", "qr-code", "users", "shield-check"];
  return (
    <section className="section why-section landing-section" id="why-pasteme">
      <div className="container why-grid">
        <div className="why-copy">
          <span className="eyebrow">{t.whyEyebrow}</span>
          <h2>{t.whyTitle}</h2>
          <p>{t.whyText}</p>
          <Link to={isAuthenticated ? "/create" : "/signup"} className="text-link">{t.createCampaign} <Icon name="arrow-up-right" size={16} /></Link>
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
    <section className="section faq-section landing-section" id="faq">
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

function FinalCTA({ t, isAuthenticated }) {
  return (
    <section className="final-cta landing-section">
      <div className="container final-cta-inner">
        <div className="final-cta-copy">
          <span className="eyebrow">{t.ctaEyebrow}</span>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
        </div>
        <div className="final-cta-avatar">
          <Suspense fallback={null}>
            <Cloudee
              className="final-cta-avatar-image"
              state="idle"
              size={170}
              ariaLabel="Cloudee, the PasteMe mascot"
            />
          </Suspense>
        </div>
        <Link to={isAuthenticated ? "/create" : "/signup"} className="cta-light-button">{t.ctaButton} <Icon name="arrow-up-right" size={16} /></Link>
      </div>
    </section>
  );
}

function Footer({ t, isAuthenticated }) {
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
            <Link to="/explore">{t.navExplore}</Link>
            <a href="#how-it-works">{t.footerHow}</a>
            <a href="#why-pasteme">{t.footerWhy}</a>
            <a href="#faq">{t.footerFaq}</a>
          </div>
          <div>
            <strong>{t.getStarted}</strong>
            <Link to={isAuthenticated ? "/create" : "/signup"}>{t.footerCreate}</Link>
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
  const { isAuthenticated } = useAuth();
  const [featuredPastes, setFeaturedPastes] = useState([]);
  const [impact, setImpact] = useState(null);
  const [highlights, setHighlights] = useState(null);
  const [discoveryLoading, setDiscoveryLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);
  const [impactError, setImpactError] = useState(false);
  const [highlightsError, setHighlightsError] = useState(false);
  const [discoveryRetry, setDiscoveryRetry] = useState(0);
  const retryDiscovery = () => setDiscoveryRetry((value) => value + 1);
  const t = { ...(copy[language] || copy.en), languageCode: language };

  useEffect(() => {
    const controller = new AbortController();
    setDiscoveryLoading(true);
    setFeaturedError(false);
    setImpactError(false);
    setHighlightsError(false);
    Promise.allSettled([
      listDiscoverablePastes({ limit: 3, signal: controller.signal }),
      getCommunityImpact({ signal: controller.signal }),
      getCommunityHighlights({ signal: controller.signal }),
    ]).then(([pastesResult, impactResult, highlightsResult]) => {
      if (controller.signal.aborted) return;
      if (pastesResult.status === "fulfilled") {
        setFeaturedPastes(pastesResult.value.filter((paste) => {
          if (paste.status && paste.status !== "published" && paste.status !== "active") return false;
          if (paste.openEnded || !paste.deadline) return true;
          return new Date(`${paste.deadline}T23:59:59`).getTime() >= Date.now();
        }));
      } else {
        setFeaturedError(true);
      }
      if (impactResult.status === "fulfilled") setImpact(impactResult.value);
      else setImpactError(true);
      if (highlightsResult.status === "fulfilled") setHighlights(highlightsResult.value);
      else setHighlightsError(true);
    }).finally(() => {
      if (!controller.signal.aborted) setDiscoveryLoading(false);
    });
    return () => controller.abort();
  }, [discoveryRetry]);

  const handleLanguageChange = (event) => {
    const selected = event.target.value;
    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  };

  return (
    <div className="landing-page">
      <Navbar t={t} language={language} onLanguageChange={handleLanguageChange} isAuthenticated={isAuthenticated} />
      <main>
        <Hero t={t} isAuthenticated={isAuthenticated} />
        <TrustStrip t={t} />
        <CommunityImpact t={t} impact={impact} loading={discoveryLoading} error={impactError} onRetry={retryDiscovery} />
        <FeaturedPastes t={t} pastes={featuredPastes} loading={discoveryLoading} error={featuredError} onRetry={retryDiscovery} />
        <CommunityHighlights t={t} highlights={highlights} loading={discoveryLoading} error={highlightsError} onRetry={retryDiscovery} />
        <HowItWorks t={t} />
        <WhyPasteMe t={t} isAuthenticated={isAuthenticated} />
        <FAQ t={t} />
        <FinalCTA t={t} isAuthenticated={isAuthenticated} />
      </main>
      <Footer t={t} isAuthenticated={isAuthenticated} />
    </div>
  );
}
