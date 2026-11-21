import { useEffect, useMemo, useState } from "react";
import { getCategoryLabel } from "../../lib/categoryLabels";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/Icon";
import BrandLogo from "../../components/BrandLogo";
import InterledgerWalletInput from "../../components/InterledgerWalletInput";
import { getCampaignWalletAsset } from "../../lib/campaignStore";
import "./CreCramp.css";

const STEPS = 6;

const categories = [
  "Tuition",
  "Accommodation",
  "Academic Materials",
  "Emergency",
  "Animals",
  "Business",
  "Community",
  "Competitions",
  "Creative",
  "Education",
  "Emergencies",
  "Environment",
  "Events",
  "Faith",
  "Family",
  "Funerals & Memorials",
  "Medical",
  "Monthly Bills",
  "Newlyweds",
  "Other",
  "Sports",
  "Travel",
  "Ukraine Relief",
  "Volunteer",
  "Wishes",
];

const countries = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Canada",
  "Other",
];

const countryCurrencies = {
  Nigeria: "NGN",
  Ghana: "GHS",
  Kenya: "KES",
  "South Africa": "ZAR",
  "United Kingdom": "GBP",
  "United States": "USD",
  Canada: "CAD",
};


const translations = {
  en: {
    creating: "Creating a fundraiser",
    dashboard: "Dashboard",
    saveExit: "Save & exit",
    signIn: "Sign in",
    stepOf: "of",
    stepOneLeftTitle: "Tell us who you're raising funds for.",
    stepOneLeftText: "This helps us understand who will benefit from your fundraiser.",
    stepTwoLeftTitle: "Let's begin your fundraising journey.",
    stepTwoLeftText: "We're here to guide you every step of the way.",
    stepThreeLeftTitle: "Give your fundraiser a name.",
    stepThreeLeftText: "A clear title and honest story help people understand why this matters.",
    stepFourLeftTitle: "Set a goal worth working toward.",
    stepFourLeftText: "Choose a target that reflects what you need and a timeline that works for you.",
    stepFiveLeftTitle: "Bring your story to life.",
    stepFiveLeftText: "A thoughtful cover image helps people recognise and remember your fundraiser.",
    stepSixLeftTitle: "Where should contributions go?",
    stepSixLeftText: "Connect the receiving wallet that will collect contributions for this fundraiser.",
    brandFoot: "YOUR STORY. YOUR IMPACT.",
    helpNote: "Made for meaningful causes.",
    helpText: "Your story deserves a place to be heard.",
    stepOneTitle: "Who are you fundraising for?",
    stepOneSubtitle: "Choose the person or organisation this fundraiser is for.",
    yourself: "Yourself",
    yourselfText: "You're raising funds for your own needs or a personal goal.",
    someoneElse: "Someone else",
    someoneElseText: "You're raising funds on behalf of another person or family.",
    charity: "A charity or organisation",
    charityText: "You're raising funds for a nonprofit, community group or organisation.",
    stepTwoTitle: "Where will the funds go?",
    stepTwoSubtitle: "Choose the country where the fundraiser is based and what best describes your cause.",
    country: "Country",
    postalCode: "Postal code",
    postalPlaceholder: "Enter postal code",
    university: "University",
    universityPlaceholder: "e.g. University of Lagos",
    universityHelp: "Optional. Add your school so people can find student fundraisers from their campus.",
    categoryQuestion: "What best describes why you're fundraising?",
    stepThreeTitle: "Tell people what this is about.",
    stepThreeSubtitle: "Give your fundraiser a clear title and explain why it matters.",
    campaignTitle: "Fundraiser title",
    titlePlaceholder: "Give your fundraiser a name",
    story: "Your story",
    storyPlaceholder: "What are you raising funds for? Why does it matter? How will the funds help?",
    characters: "characters",
    stepFourTitle: "How much are you hoping to raise?",
    stepFourSubtitle: "You can set a goal if you have one in mind. No goal? That's okay too. Choose when your fundraiser should end.",
    goal: "Fundraising goal",
    goalOptional: "Optional",
    goalOptionalHelp: "You can start without a fixed target and add one later.",
    noGoal: "No goal set",
    deadline: "End date",
    chooseDate: "Choose an end date",
    openEnded: "Keep this fundraiser open-ended",
    openEndedHelp: "The fundraiser stays open until you decide to close it.",
    stepFiveTitle: "Add a cover image.",
    stepFiveSubtitle: "Help people connect with your cause. A cover image is optional.",
    coverLabel: "Fundraiser cover",
    uploadTitle: "Choose an image to upload",
    uploadHelp: "PNG, JPG or WEBP · Up to 1 MB",
    changeImage: "Choose another image",
    removeImage: "Remove image",
    imageOptional: "You can continue without an image.",
    stepSixTitle: "Where should contributions be received?",
    stepSixSubtitle: "Enter the wallet name that will receive contributions. The URL prefix is already provided.",
    wallet: "Receiving wallet name",
    walletPlaceholder: "your-name",
    walletHelp: "The URL prefix is fixed. Enter only the name after the slash.",
    walletPrivacy: "This address is used for receiving contributions and should not be displayed on your public fundraiser page.",
    walletChecking: "Checking wallet details...",
    continue: "Continue",
    back: "Back",
    preview: "Continue to preview",
    requiredChoice: "Choose who you're fundraising for to continue.",
    requiredCategory: "Choose a fundraising category to continue.",
    requiredDetails: "Add a title and story before continuing.",
    requiredGoal: "Enter a fundraising goal greater than zero.",
    requiredDeadline: "Choose an end date or make this fundraiser open-ended.",
    deadlinePast: "The end date must be today or a future date.",
    invalidImage: "Choose a valid image file.",
    imageLarge: "Choose an image smaller than 1 MB.",
    imageRead: "The image could not be loaded. Try another file.",
    invalidWallet: "Enter a valid receiving wallet name.",
    walletRequired: "Add your receiving wallet name to continue.",
    walletCurrencyError: "We couldn't verify the receiving wallet's currency. Check the URL and try again.",
    otherCurrency: "The currency used for the fundraiser is determined by your receiving wallet.",
    saved: "Your progress is saved in this browser while you create your fundraiser.",
  },
  pcm: {
    creating: "You dey create fundraiser",
    dashboard: "Dashboard",
    saveExit: "Save & exit",
    signIn: "Sign in",
    stepOf: "of",
    stepOneLeftTitle: "Tell us who you dey raise money for.",
    stepOneLeftText: "This go help us understand who go benefit from your fundraiser.",
    stepTwoLeftTitle: "Make we start your fundraising journey.",
    stepTwoLeftText: "We dey guide you through every step.",
    stepThreeLeftTitle: "Give your fundraiser a name.",
    stepThreeLeftText: "Good title and clear story go help people understand why e matter.",
    stepFourLeftTitle: "Set a target wey make sense.",
    stepFourLeftText: "Choose the amount wey you need and when you wan end the fundraiser.",
    stepFiveLeftTitle: "Make your story come alive.",
    stepFiveLeftText: "Good cover picture go help people remember your fundraiser.",
    stepSixLeftTitle: "Where the contributions go reach?",
    stepSixLeftText: "Connect the wallet wey go receive the contributions.",
    brandFoot: "YOUR STORY. YOUR IMPACT.",
    helpNote: "For causes wey matter.",
    helpText: "Your story deserve make people hear am.",
    stepOneTitle: "Who you dey raise money for?",
    stepOneSubtitle: "Choose the person or organisation wey this fundraiser dey for.",
    yourself: "Myself",
    yourselfText: "You dey raise money for your own needs or personal goal.",
    someoneElse: "Another person",
    someoneElseText: "You dey raise money for another person or family.",
    charity: "Charity or organisation",
    charityText: "You dey raise money for nonprofit, community group or organisation.",
    stepTwoTitle: "Where the money go reach?",
    stepTwoSubtitle: "Choose the country and the category wey describe your cause.",
    country: "Country",
    postalCode: "Postal code",
    postalPlaceholder: "Enter postal code",
    university: "University",
    universityPlaceholder: "e.g. University of Lagos",
    universityHelp: "No compulsory. Add your school make people fit find student fundraisers from your campus.",
    categoryQuestion: "Which one best describe wetin you dey raise money for?",
    stepThreeTitle: "Tell people wetin this one dey about.",
    stepThreeSubtitle: "Give your fundraiser clear title and explain why e matter.",
    campaignTitle: "Fundraiser title",
    titlePlaceholder: "Give your fundraiser name",
    story: "Your story",
    storyPlaceholder: "Wetin you dey raise money for? Why e matter? How the money go help?",
    characters: "characters",
    stepFourTitle: "How much you dey hope to raise?",
    stepFourSubtitle: "You fit set target if you get one. If you no get target yet, no wahala. Choose when the fundraiser go end.",
    goal: "Fundraising target",
    goalOptional: "No compulsory",
    goalOptionalHelp: "You fit start without fixed target and add one later.",
    noGoal: "No target set",
    deadline: "End date",
    chooseDate: "Choose end date",
    openEnded: "Make this fundraiser no get end date",
    openEndedHelp: "The fundraiser go remain open until you decide to close am.",
    stepFiveTitle: "Add cover picture.",
    stepFiveSubtitle: "Help people connect with your cause. Cover picture no compulsory.",
    coverLabel: "Fundraiser cover",
    uploadTitle: "Choose picture to upload",
    uploadHelp: "PNG, JPG or WEBP · Up to 1 MB",
    changeImage: "Choose another picture",
    removeImage: "Remove picture",
    imageOptional: "You fit continue without picture.",
    stepSixTitle: "Where contributions go reach?",
    stepSixSubtitle: "Enter the wallet name wey go receive contributions. The URL prefix don already dey there.",
    wallet: "Receiving wallet name",
    walletPlaceholder: "your-name",
    walletHelp: "The URL prefix don already dey there. Enter only the name after the slash.",
    walletPrivacy: "This address na for receiving contributions. E no suppose show for your public fundraiser page.",
    walletChecking: "We dey check wallet details...",
    continue: "Continue",
    back: "Back",
    preview: "Continue to preview",
    requiredChoice: "Choose who you dey raise money for make you continue.",
    requiredCategory: "Choose fundraising category make you continue.",
    requiredDetails: "Add title and story before you continue.",
    requiredGoal: "Enter fundraising target wey pass zero.",
    requiredDeadline: "Choose end date or make the fundraiser open-ended.",
    deadlinePast: "The end date must be today or future date.",
    invalidImage: "Choose correct image file.",
    imageLarge: "Choose picture wey small pass 1 MB.",
    imageRead: "Picture no fit load. Try another file.",
    invalidWallet: "Enter correct receiving wallet name.",
    walletRequired: "Add your receiving wallet name make you continue.",
    walletCurrencyError: "We no fit check the wallet currency. Check the URL and try again.",
    otherCurrency: "The fundraiser currency go depend on the receiving wallet.",
    saved: "Your progress dey save for this browser as you dey create the fundraiser.",
  },
  yo: {
    creating: "Ṣíṣẹ̀dá ìpolongo ìkójọ owó",
    dashboard: "Ojú ìṣàkóso",
    saveExit: "Fi pamọ́ kí o sì jáde",
    signIn: "Wọlé",
    stepOf: "nínú",
    stepOneLeftTitle: "Sọ ẹni tí o ń kó owó jọ fún.",
    stepOneLeftText: "Èyí yóò ràn wá lọ́wọ́ láti mọ ẹni tí yóò jàǹfààní nínú ìpolongo rẹ.",
    stepTwoLeftTitle: "Ẹ jẹ́ ká bẹ̀rẹ̀ ìrìnàjò ìkójọ owó rẹ.",
    stepTwoLeftText: "A wà níbí láti tọ́ ọ sọ́nà ní gbogbo ìgbésẹ̀.",
    stepThreeLeftTitle: "Fún ìpolongo rẹ ní àkọlé.",
    stepThreeLeftText: "Àkọlé tó ṣe kedere àti ìtàn tó dára yóò jẹ́ kí àwọn ènìyàn lóye ìdí rẹ.",
    stepFourLeftTitle: "Yan àfojúsùn tó yẹ.",
    stepFourLeftText: "Yan iye owó tí o nílò àti àkókò tí o fẹ́ parí ìpolongo náà.",
    stepFiveLeftTitle: "Jẹ́ kí ìtàn rẹ yè ní ojú àwọn ènìyàn.",
    stepFiveLeftText: "Àwòrán ìborí tó dára yóò ran àwọn ènìyàn lọ́wọ́ láti rántí ìpolongo rẹ.",
    stepSixLeftTitle: "Níbo ni a ó ti gba owó ìrànlọ́wọ́?",
    stepSixLeftText: "So àpò owó ìgbàwọlé tí yóò gba àwọn ìrànlọ́wọ́ pọ̀ mọ́ ìpolongo rẹ.",
    brandFoot: "ÌTÀN RẸ. IPA RẸ.",
    helpNote: "A ṣe é fún àwọn ohun tó ṣe pàtàkì.",
    helpText: "Ó yẹ kí àwọn ènìyàn gbọ́ ìtàn rẹ.",
    stepOneTitle: "Ta ni o ń kó owó jọ fún?",
    stepOneSubtitle: "Yan ẹni tàbí àjọ tí ìpolongo yìí jẹ́ fún.",
    yourself: "Ìwọ fúnra rẹ",
    yourselfText: "O ń kó owó jọ fún àìní tàbí ète tìrẹ.",
    someoneElse: "Ẹlòmíràn",
    someoneElseText: "O ń kó owó jọ fún ẹlòmíràn tàbí ìdílé kan.",
    charity: "Àjọ ìrànlọ́wọ́",
    charityText: "O ń kó owó jọ fún àjọ àìní èrè tàbí àwùjọ kan.",
    stepTwoTitle: "Níbo ni owó náà yóò lọ?",
    stepTwoSubtitle: "Yan orílẹ̀-èdè àti ẹ̀ka tó ṣàpèjúwe ohun tí o ń kó owó jọ fún.",
    country: "Orílẹ̀-èdè",
    postalCode: "Kóòdù ìpínlẹ̀ ìfiṣẹ́ lẹ́tà",
    postalPlaceholder: "Tẹ kóòdù ìpínlẹ̀",
    university: "Ilé-ẹ̀kọ́ gíga",
    universityPlaceholder: "Fún àpẹẹrẹ, University of Lagos",
    universityHelp: "Kò pọndandan. Fi ilé-ẹ̀kọ́ rẹ kún un kí àwọn ènìyàn lè rí àwọn Paste láti ilé-ẹ̀kọ́ rẹ.",
    categoryQuestion: "Kí ni ó ṣàpèjúwe ìdí tí o fi ń kó owó jọ?",
    stepThreeTitle: "Sọ fún àwọn ènìyàn ohun tí èyí jẹ́ nípa rẹ̀.",
    stepThreeSubtitle: "Fún ìpolongo rẹ ní àkọlé tó ṣe kedere, kí o sì ṣàlàyé ìdí rẹ.",
    campaignTitle: "Àkọlé ìpolongo",
    titlePlaceholder: "Fún ìpolongo rẹ ní orúkọ",
    story: "Ìtàn rẹ",
    storyPlaceholder: "Kí ni o ń kó owó jọ fún? Kí ló dé tí ó fi ṣe pàtàkì? Báwo ni owó náà yóò ṣe ràn ọ́ lọ́wọ́?",
    characters: "ààmì ọ̀rọ̀",
    stepFourTitle: "Iye owó mélòó ni o fẹ́ kó jọ?",
    stepFourSubtitle: "O lè yan àfojúsùn bí o bá ti mọ iye rẹ. Bí o kò bá tíì mọ̀, kò burú. Yan ọjọ́ tí ìpolongo náà yóò parí.",
    goal: "Àfojúsùn owó",
    goalOptional: "Kò pọndandan",
    goalOptionalHelp: "O lè bẹ̀rẹ̀ láìsí àfojúsùn pàtó, kí o sì fi kún un lẹ́yìn náà.",
    noGoal: "Kò sí àfojúsùn",
    deadline: "Ọjọ́ ìparí",
    chooseDate: "Yan ọjọ́ ìparí",
    openEnded: "Jẹ́ kí ìpolongo yìí má ní ọjọ́ ìparí",
    openEndedHelp: "Ìpolongo náà yóò máa lọ títí tí o fi pinnu láti dá a dúró.",
    stepFiveTitle: "Fi àwòrán ìborí kún un.",
    stepFiveSubtitle: "Ràn àwọn ènìyàn lọ́wọ́ láti ní ìbáṣepọ̀ pẹ̀lú ohun tí o ń ṣe. Àwòrán kò pọndandan.",
    coverLabel: "Àwòrán ìborí ìpolongo",
    uploadTitle: "Yan àwòrán láti gbé sókè",
    uploadHelp: "PNG, JPG tàbí WEBP · Kò ju 1 MB lọ",
    changeImage: "Yan àwòrán mìíràn",
    removeImage: "Yọ àwòrán kúrò",
    imageOptional: "O lè tẹ̀síwájú láìsí àwòrán.",
    stepSixTitle: "Níbo ni a ó ti gba owó ìrànlọ́wọ́?",
    stepSixSubtitle: "Tẹ orúkọ àpò owó tí yóò gba ìrànlọ́wọ́. A ti fi ìbẹ̀rẹ̀ URL síbẹ̀.",
    wallet: "Orúkọ àpò owó ìgbàwọlé",
    walletPlaceholder: "orúkọ-rẹ",
    walletHelp: "Ìbẹ̀rẹ̀ URL ti wà níbí. Tẹ orúkọ àpò owó rẹ lẹ́yìn àmì /.",
    walletPrivacy: "A máa lo àdírẹ́sì yìí láti gba ìrànlọ́wọ́. A kò gbọ́dọ̀ fi hàn lójú ìwé ìpolongo gbogbogbò rẹ.",
    walletChecking: "A ń ṣàyẹ̀wò àlàyé àpò owó...",
    continue: "Tẹ̀síwájú",
    back: "Padà",
    preview: "Tẹ̀síwájú sí àyẹ̀wò",
    requiredChoice: "Yan ẹni tí o ń kó owó jọ fún kí o tó tẹ̀síwájú.",
    requiredCategory: "Yan ẹ̀ka ìpolongo kí o tó tẹ̀síwájú.",
    requiredDetails: "Fi àkọlé àti ìtàn kún un kí o tó tẹ̀síwájú.",
    requiredGoal: "Tẹ àfojúsùn owó tó ju òdo lọ.",
    requiredDeadline: "Yan ọjọ́ ìparí tàbí jẹ́ kí ìpolongo náà má ní ọjọ́ ìparí.",
    deadlinePast: "Ọjọ́ ìparí gbọ́dọ̀ jẹ́ ti òní tàbí ọjọ́ iwájú.",
    invalidImage: "Yan fáìlì àwòrán tó tọ́.",
    imageLarge: "Yan àwòrán tó kéré sí 1 MB.",
    imageRead: "A kò lè ṣí àwòrán náà. Gbìyànjú fáìlì mìíràn.",
    invalidWallet: "Tẹ orúkọ àpò owó ìgbàwọlé tó tọ́.",
    walletRequired: "Tẹ orúkọ àpò owó ìgbàwọlé rẹ kí o tó tẹ̀síwájú.",
    walletCurrencyError: "A kò lè jẹ́rìí owó àpò ìgbàwọlé. Ṣàyẹ̀wò URL kí o sì tún gbìyànjú.",
    otherCurrency: "Owó tí ìpolongo yóò lò dá lórí àpò owó ìgbàwọlé rẹ.",
    saved: "A ń fi ìlọsíwájú rẹ pamọ́ sínú ẹ̀rọ aṣàwákiri yìí bí o ṣe ń ṣẹ̀dá ìpolongo.",
  },
};

const countryOptions = countries.map((country) => ({
  value: country,
  label: country,
}));

const emptyCampaign = {
  fundraisingFor: "",
  country: "Nigeria",
  postalCode: "",
  university: "",
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

function getInitialCampaign(locationState, draftKey) {
  if (locationState?.campaign) {
    return { ...emptyCampaign, ...locationState.campaign };
  }

  try {
    const savedDraft = sessionStorage.getItem(draftKey);
    return savedDraft
      ? { ...emptyCampaign, ...JSON.parse(savedDraft) }
      : emptyCampaign;
  } catch {
    return emptyCampaign;
  }
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const draftKey = `pasteme_campaign_draft:${user?.email?.toLowerCase() || "guest"}`;
  const [language, setLanguage] = useState(
    () => localStorage.getItem("pasteme_language") || "en"
  );
  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState(() =>
    getInitialCampaign(location.state, draftKey)
  );
  const [currentStep, setCurrentStep] = useState(
    () => (location.state?.campaign ? STEPS : 1)
  );
  const [formError, setFormError] = useState("");
  const [imageError, setImageError] = useState("");
  const [resolvingWallet, setResolvingWallet] = useState(false);

  const progress = (currentStep / STEPS) * 100;
  const currencyLabel = formData.currency || countryCurrencies[formData.country] || "NGN";

  const leftCopy = useMemo(() => {
    const copyByStep = {
      1: [t.stepOneLeftTitle, t.stepOneLeftText],
      2: [t.stepTwoLeftTitle, t.stepTwoLeftText],
      3: [t.stepThreeLeftTitle, t.stepThreeLeftText],
      4: [t.stepFourLeftTitle, t.stepFourLeftText],
      5: [t.stepFiveLeftTitle, t.stepFiveLeftText],
      6: [t.stepSixLeftTitle, t.stepSixLeftText],
    };
    return copyByStep[currentStep] || copyByStep[1];
  }, [currentStep, t]);

  // Persist only the non-sensitive draft fields in this browser.
  useEffect(() => {
    const safeDraft = { ...formData };
    delete safeDraft.walletAddress;

    try {
      sessionStorage.setItem(draftKey, JSON.stringify(safeDraft));
    } catch (error) {
      console.warn("Could not save the fundraiser draft:", error);
    }
  }, [formData, draftKey]);

  const handleLanguageChange = (event) => {
    const selected = event.target.value;
    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormError("");
  };

  const handleSelect = (name, value) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
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
      setFormData((previous) => ({
        ...previous,
        coverImage: String(reader.result || ""),
      }));
    };
    reader.onerror = () => setImageError(t.imageRead);
    reader.readAsDataURL(file);
  };

  const validateCurrentStep = () => {
    if (currentStep === 1 && !formData.fundraisingFor) {
      setFormError(t.requiredChoice);
      return false;
    }

    if (currentStep === 2 && (!formData.country || !formData.category)) {
      setFormError(t.requiredCategory);
      return false;
    }

    if (currentStep === 3 && (!formData.title.trim() || !formData.story.trim())) {
      setFormError(t.requiredDetails);
      return false;
    }

    if (currentStep === 4) {
      const rawTarget = String(formData.target ?? "").trim();
      if (rawTarget) {
        const target = Number(rawTarget);
        if (!Number.isFinite(target) || target <= 0) {
          setFormError(t.requiredGoal);
          return false;
        }
      }
      if (!formData.openEnded && !formData.deadline) {
        setFormError(t.requiredDeadline);
        return false;
      }
      if (formData.deadline && !formData.openEnded) {
        const selectedDate = new Date(`${formData.deadline}T23:59:59`);
        if (Number.isNaN(selectedDate.getTime()) || selectedDate < new Date()) {
          setFormError(t.deadlinePast);
          return false;
        }
      }
    }

    return true;
  };

  const handleContinue = async () => {
    setFormError("");

    if (!validateCurrentStep()) return;

    if (currentStep < STEPS) {
      setCurrentStep((step) => Math.min(step + 1, STEPS));
      return;
    }

    if (!formData.walletAddress.trim()) {
      setFormError(t.walletRequired);
      return;
    }

    let walletUrl;
    try {
      walletUrl = new URL(formData.walletAddress.trim());
      if (walletUrl.protocol !== "https:") throw new Error("HTTPS required");
    } catch {
      setFormError(t.invalidWallet);
      return;
    }

    setResolvingWallet(true);
    try {
      const walletAsset = await getCampaignWalletAsset(walletUrl.href);
      const rawTarget = String(formData.target ?? "").trim();
      const target = rawTarget ? Number(rawTarget) : null;

      const draft = {
        ...formData,
        title: formData.title.trim(),
        story: formData.story.trim(),
        university: formData.university?.trim() || "",
        target: target === null ? null : String(target),
        walletAddress: walletUrl.href,
        currency: walletAsset.currency,
        assetScale: walletAsset.assetScale,
        creatorId: user?.id,
        ownerEmail: user?.email?.toLowerCase(),
      };

      // Never persist the receiving wallet URL in browser draft storage.
      const safeDraft = { ...draft };
      delete safeDraft.walletAddress;
      try {
        sessionStorage.setItem(draftKey, JSON.stringify(safeDraft));
      } catch (storageError) {
        console.warn("Could not persist this draft:", storageError);
      }

      navigate("/campaign-preview", {
        state: { campaign: draft },
      });
    } catch (error) {
      console.error("Wallet lookup failed:", error);
      setFormError(error.message || t.walletCurrencyError);
    } finally {
      setResolvingWallet(false);
    }
  };

  const handleBack = () => {
    setFormError("");
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
      return;
    }
    navigate("/dashboard");
  };

  const stepCanContinue = (() => {
    if (currentStep === 1) return Boolean(formData.fundraisingFor);
    if (currentStep === 2) return Boolean(formData.country && formData.category);
    if (currentStep === 3) return Boolean(formData.title.trim() && formData.story.trim());
    if (currentStep === 4) {
      const rawTarget = String(formData.target ?? "").trim();
      const targetOkay = !rawTarget || (Number.isFinite(Number(rawTarget)) && Number(rawTarget) > 0);
      return targetOkay && (formData.openEnded || formData.deadline);
    }
    if (currentStep === 6) return Boolean(formData.walletAddress.trim());
    return true;
  })();

  const renderStepOne = () => {
    const choices = [
      {
        value: "yourself",
        title: t.yourself,
        description: t.yourselfText,
        icon: "user",
      },
      {
        value: "someone-else",
        title: t.someoneElse,
        description: t.someoneElseText,
        icon: "users",
      },
      {
        value: "charity",
        title: t.charity,
        description: t.charityText,
        icon: "building",
      },
    ];

    return (
      <div className="create-step-content create-choice-step">
        <div className="create-step-heading">
          <h2>{t.stepOneTitle}</h2>
          <p>{t.stepOneSubtitle}</p>
        </div>

        <div className="create-choice-list" role="group" aria-label={t.stepOneTitle}>
          {choices.map((choice) => {
            const selected = formData.fundraisingFor === choice.value;
            return (
              <button
                type="button"
                key={choice.value}
                className={`create-choice-card${selected ? " is-selected" : ""}`}
                onClick={() => handleSelect("fundraisingFor", choice.value)}
                aria-pressed={selected}
              >
                <span className="create-choice-icon" aria-hidden="true"><Icon name={choice.icon} size={22} /></span>
                <span className="create-choice-copy">
                  <strong>{choice.title}</strong>
                  <small>{choice.description}</small>
                </span>
                <span className="create-choice-radio" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStepTwo = () => (
    <div className="create-step-content">
      <div className="create-step-heading">
        <h2>{t.stepTwoTitle}</h2>
        <p>{t.stepTwoSubtitle}</p>
      </div>

      <div className="create-location-row">
        <div className="create-field create-country-field">
          <label htmlFor="country">{t.country}</label>
          <select id="country" name="country" value={formData.country} onChange={handleChange}>
            {countryOptions.map((country) => (
              <option key={country.value} value={country.value}>{country.label}</option>
            ))}
          </select>
        </div>
        <div className="create-field">
          <label htmlFor="postalCode">{t.postalCode}</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder={t.postalPlaceholder}
            autoComplete="postal-code"
            maxLength={16}
          />
        </div>
      </div>

      <div className="create-field create-university-field">
        <label htmlFor="university">{t.university} <span className="create-optional-label">{t.optional}</span></label>
        <input
          id="university"
          name="university"
          type="text"
          value={formData.university || ""}
          onChange={handleChange}
          placeholder={t.universityPlaceholder}
          maxLength={120}
          autoComplete="organization"
        />
        <small className="create-field-meta">{t.universityHelp}</small>
      </div>

      <div className="create-category-block">
        <h3>{t.categoryQuestion}</h3>
        <div className="create-category-chips" role="group" aria-label={t.categoryQuestion}>
          {categories.map((category) => {
            const selected = formData.category === category;
            const label = getCategoryLabel(category, language);
            return (
              <button
                type="button"
                key={category}
                className={`create-category-chip${selected ? " is-selected" : ""}`}
                onClick={() => handleSelect("category", category)}
                aria-pressed={selected}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="create-step-content create-fields-step">
      <div className="create-step-heading">
        <h2>{t.stepThreeTitle}</h2>
        <p>{t.stepThreeSubtitle}</p>
      </div>

      <div className="create-field">
        <label htmlFor="title">{t.campaignTitle}</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder={t.titlePlaceholder}
          maxLength={80}
          autoComplete="off"
        />
        <small className="create-field-meta">{formData.title.length}/80</small>
      </div>

      <div className="create-field">
        <label htmlFor="story">{t.story}</label>
        <textarea
          id="story"
          name="story"
          value={formData.story}
          onChange={handleChange}
          placeholder={t.storyPlaceholder}
          maxLength={1500}
          rows={7}
        />
        <small className="create-field-meta">{formData.story.length}/1500 {t.characters}</small>
      </div>

      <div className="create-selected-category">
        <span>{t.categoryQuestion}</span>
        <strong>{getCategoryLabel(formData.category, language)}</strong>
      </div>
    </div>
  );

  const renderStepFour = () => (
    <div className="create-step-content create-fields-step">
      <div className="create-step-heading">
        <h2>{t.stepFourTitle}</h2>
        <p>{t.stepFourSubtitle}</p>
      </div>

      <div className="create-field">
        <label htmlFor="target">{t.goal} <span className="create-optional-label">{t.goalOptional}</span></label>
        <div className="create-amount-input">
          <span>{currencyLabel}</span>
          <input
            id="target"
            name="target"
            type="number"
            min="1"
            step="1"
            value={formData.target}
            onChange={handleChange}
            placeholder="e.g. 500,000"
          />
        </div>
        <small className="create-field-meta">{t.goalOptionalHelp} {t.otherCurrency}</small>
      </div>

      <div className="create-field create-deadline-field">
        <label htmlFor="deadline">{t.deadline}</label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          disabled={formData.openEnded}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <label className="create-open-ended">
        <input
          type="checkbox"
          name="openEnded"
          checked={formData.openEnded}
          onChange={handleChange}
        />
        <span className="create-custom-checkbox" aria-hidden="true" />
        <span className="create-open-copy">
          <strong>{t.openEnded}</strong>
          <small>{t.openEndedHelp}</small>
        </span>
      </label>
    </div>
  );

  const renderStepFive = () => (
    <div className="create-step-content create-fields-step">
      <div className="create-step-heading">
        <h2>{t.stepFiveTitle}</h2>
        <p>{t.stepFiveSubtitle}</p>
      </div>

      <div className={`create-upload-zone${formData.coverImage ? " has-image" : ""}`}>
        {formData.coverImage ? (
          <div className="create-upload-preview">
            <img src={formData.coverImage} alt="Fundraiser cover preview" />
            <div className="create-upload-preview-actions">
              <label htmlFor="coverImageInput" className="create-upload-change">{t.changeImage}</label>
              <button
                type="button"
                className="create-upload-remove"
                onClick={() => setFormData((previous) => ({ ...previous, coverImage: "" }))}
              >
                {t.removeImage}
              </button>
            </div>
          </div>
        ) : (
          <label htmlFor="coverImageInput" className="create-upload-prompt">
            <span className="create-upload-icon" aria-hidden="true"><Icon name="image-plus" size={24} /></span>
            <strong>{t.uploadTitle}</strong>
            <small>{t.uploadHelp}</small>
          </label>
        )}
        <input
          id="coverImageInput"
          className="create-file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleCoverChange}
        />
      </div>

      {imageError && <p className="create-inline-error" role="alert">{imageError}</p>}
      <p className="create-optional-note">{t.imageOptional}</p>
    </div>
  );

  const renderStepSix = () => (
    <div className="create-step-content create-fields-step">
      <div className="create-step-heading">
        <h2>{t.stepSixTitle}</h2>
        <p>{t.stepSixSubtitle}</p>
      </div>

      <div className="create-field">
        <label htmlFor="walletAddress">{t.wallet}</label>
        <InterledgerWalletInput
          id="walletAddress"
          name="walletAddress"
          className="create-wallet-username-control"
          value={formData.walletAddress}
          onChange={(walletAddress) => setFormData((previous) => ({ ...previous, walletAddress }))}
          placeholder={t.walletPlaceholder}
        />
        <small className="create-field-meta">{t.walletHelp}</small>
      </div>

      <div className="create-wallet-notice">
        <Icon name="shield-check" size={20} />
        <p>{t.walletPrivacy}</p>
      </div>

      <div className="create-final-summary">
        <span>{formData.title || t.campaignTitle}</span>
        <strong>{formData.category ? (getCategoryLabel(formData.category, language)) : "—"}</strong>
        <strong>{formData.target ? `${Number(formData.target).toLocaleString()} ${currencyLabel}` : t.noGoal}</strong>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStepOne();
      case 2: return renderStepTwo();
      case 3: return renderStepThree();
      case 4: return renderStepFour();
      case 5: return renderStepFive();
      case 6: return renderStepSix();
      default: return renderStepOne();
    }
  };

  return (
    <main className="create-page create-wizard">
      <aside className="create-intro">
        <BrandLogo to="/dashboard" className="create-brand" />

        <div className="create-intro-content">
          <div className="create-step-counter">
            <span>{currentStep}</span> {t.stepOf} {STEPS}
          </div>
          <div className="create-side-progress" aria-label={`Step ${currentStep} of ${STEPS}`}>
            {Array.from({ length: STEPS }, (_, index) => (
              <span key={index} className={index < currentStep ? "is-complete" : ""} />
            ))}
          </div>
          <h1>{leftCopy[0]}</h1>
          <p>{leftCopy[1]}</p>
        </div>

        <div className="create-intro-footer">
          <span className="create-intro-sparkle"><Icon name="sparkles" size={0} /></span>
          <span>{t.brandFoot}</span>
        </div>
      </aside>

      <section className="create-right-panel">
        <header className="create-topbar">
          <span className="create-topbar-label">{t.creating}</span>
          <div className="create-topbar-actions">
            <select
              className="create-language-select"
              value={language}
              onChange={handleLanguageChange}
              aria-label="Language"
            >
              <option value="en">English</option>
              <option value="pcm">Pidgin</option>
              <option value="yo">Yorùbá</option>
            </select>
            <Link to="/dashboard" className="create-dashboard-link">{t.saveExit}</Link>
          </div>
        </header>

        <div className="create-main-scroll">
          <div className="create-step-shell" key={currentStep}>
            {renderCurrentStep()}
            {formError && <p className="create-inline-error" role="alert">{formError}</p>}
          </div>
        </div>

        <footer className="create-action-footer">
          <div className="create-footer-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="create-action-row">
            <button
              type="button"
              className="create-back-button"
              onClick={handleBack}
              aria-label={currentStep === 1 ? t.dashboard : t.back}
            >
              <Icon name="arrow-left" size={18} />
              <small>{currentStep === 1 ? t.dashboard : t.back}</small>
            </button>

            <div className="create-action-right">
              <span className="create-save-hint">{t.saved}</span>
              <button
                type="button"
                className="create-continue-button"
                onClick={handleContinue}
                disabled={resolvingWallet || !stepCanContinue}
              >
                {resolvingWallet ? t.walletChecking : currentStep === STEPS ? t.preview : t.continue}
                <Icon name="arrow-right" size={18} />
              </button>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
