
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getPublishedCampaign } from "../../lib/campaignStore";
import { apiRequest } from "../../lib/api";
import { formatMoney } from "../../lib/money";
import "./Checkout.css";

const translations = {
  en: {
    live: "SECURE CONTRIBUTION",
    eyebrow: "MAKE A DIFFERENCE",
    title: "Your support can make this happen.",
    subtitle: "Choose an amount and become part of this story.",
    amount: "Choose your contribution",
    custom: "Enter another amount",
    wallet: "Your wallet address",
    walletHelp: "Your wallet can use a different currency. Your wallet provider will show the converted amount before you approve.",
    walletWarning: "Never enter your wallet password or secret keys here.",
    continue: "Get payment quote",
    quoteTitle: "Review your contribution",
    receive: "Campaign receives",
    total: "Total from your wallet",
    quoteExpiry: "Quote expires",
    authorize: "Continue to wallet",
    back: "Go back",
    processing: "Preparing your payment...",
    redirecting: "Taking you to your wallet...",
    secure: "Your payment is authorized through your wallet provider.",
    noSignup: "No PasteMe account is required.",
    success: "Your contribution is confirmed.",
    successText: "Thank you for being part of this story.",
    pending: "Your payment is still being confirmed.",
    pendingText: "Please check again shortly. Do not submit another payment.",
    failed: "We couldn't confirm this payment.",
    failedText: "Your campaign total has not been updated.",
    retry: "Check payment status",
    viewCampaign: "Return to campaign",
    titleNotFound: "Campaign not found",
    notFound: "This campaign is unavailable.",
    loading: "Loading checkout...",
    required: "Please enter a valid amount and wallet URL.",
    invalidWallet: "Enter a valid HTTPS Open Payments wallet address.",
    quoteError: "We couldn't prepare a payment quote. Please try again.",
    authorizationError: "We couldn't start wallet authorization.",
    amountError: "Enter an amount greater than zero.",
    summary: "CAMPAIGN",
    story: "Supporting",
    chooseLanguage: "Language",
    checkStatus: "Checking payment...",
    quoteReady: "Quote ready",
    quoteExpired: "This quote may have expired. Request a new one.",
    secureNote: "Your payment details are processed securely.",
    customPlaceholder: "Enter amount in the campaign currency",
    minimum: "Enter a valid contribution amount.",
    walletLabel: "Open Payments wallet URL",
    refresh: "Refresh status",
    home: "Back to PasteMe",
    campaignEnded: "This campaign has ended.",
    campaignEndedMessage: "This campaign has reached its deadline. Contributions are closed.",
  },

  pcm: {
    live: "SECURE CONTRIBUTION",
    eyebrow: "MAKE A DIFFERENCE",
    title: "Your support fit make am happen.",
    subtitle: "Choose how much you wan give and join this story.",
    amount: "Choose how much you wan contribute",
    custom: "Enter another amount",
    wallet: "Your wallet address",
    walletHelp: "Your wallet fit use another currency. Your wallet provider go show the converted amount before you approve.",
    walletWarning: "No enter your wallet password or secret keys here.",
    continue: "Get payment quote",
    quoteTitle: "Check your contribution",
    receive: "Campaign go receive",
    total: "Total wey go comot your wallet",
    quoteExpiry: "Quote go expire",
    authorize: "Continue to wallet",
    back: "Go back",
    processing: "We dey prepare your payment...",
    redirecting: "We dey take you go your wallet...",
    secure: "Your wallet provider go ask you to approve the payment.",
    noSignup: "You no need PasteMe account.",
    success: "Your contribution don confirm.",
    successText: "Thank you say you join this story.",
    pending: "We still dey confirm your payment.",
    pendingText: "Check again shortly. No send another payment.",
    failed: "We no fit confirm this payment.",
    failedText: "We never update the campaign total.",
    retry: "Check payment status",
    viewCampaign: "Go back to campaign",
    titleNotFound: "We no find this campaign",
    notFound: "This campaign no dey available.",
    loading: "Checkout dey load...",
    required: "Enter correct amount and wallet URL.",
    invalidWallet: "Enter correct HTTPS Open Payments wallet address.",
    quoteError: "We no fit prepare payment quote. Try again.",
    authorizationError: "We no fit start wallet authorization.",
    amountError: "Enter amount wey pass zero.",
    summary: "CAMPAIGN",
    story: "You dey support",
    chooseLanguage: "Language",
    checkStatus: "We dey check payment...",
    quoteReady: "Quote don ready",
    quoteExpired: "This quote fit don expire. Request another one.",
    secureNote: "We go process your payment details securely.",
    customPlaceholder: "Enter amount in the campaign currency",
    minimum: "Enter correct contribution amount.",
    walletLabel: "Open Payments wallet URL",
    refresh: "Refresh status",
    home: "Back to PasteMe",
    campaignEnded: "This campaign don end.",
    campaignEndedMessage: "This campaign don reach deadline. Contribution don close.",
  },

  yo: {
    live: "ÀṢETẸ́LẸ̀ ÌṢÈTỌRẸ́",
    eyebrow: "ṢE ÀTÚNMỌ̀",
    title: "Ìrànlọ́wọ́ rẹ lè mú èyí ṣẹ.",
    subtitle: "Yan iye owó tí o fẹ́ fi ṣe ìrànlọ́wọ́.",
    amount: "Yan iye owó ìrànlọ́wọ́ rẹ",
    custom: "Tẹ iye owó mìíràn",
    wallet: "Àdírẹ́sì àpò owó rẹ",
    walletHelp: "Àpò owó rẹ lè lo owó oríṣiríṣi; olùpèsè rẹ yóò fi iye tí a yí padà hàn kí o tó fọwọ́ sí i.",
    walletWarning: "Má ṣe tẹ ọ̀rọ̀ aṣínà tàbí kọ́kọ́rọ́ àṣírí rẹ síbí.",
    continue: "Gba ìṣirò owó",
    quoteTitle: "Ṣàyẹ̀wò ìrànlọ́wọ́ rẹ",
    receive: "Owó tí ìpolongo yóò gbà",
    total: "Àpapọ̀ owó láti inú àpò rẹ",
    quoteExpiry: "Àkókò tí ìṣirò yóò fi parí",
    authorize: "Tẹ̀síwájú sí àpò owó rẹ",
    back: "Padà",
    processing: "A ń pèsè ìsanwó rẹ...",
    redirecting: "A ń gbé ọ lọ sí àpò owó rẹ...",
    secure: "Olùpèsè àpò owó rẹ yóò béèrè ìfọwọ́sí rẹ.",
    noSignup: "O kò nílò àkáǹtì PasteMe.",
    success: "A ti jẹ́rìí ìrànlọ́wọ́ rẹ.",
    successText: "Ẹ ṣé fún jíjẹ́ ọ̀kan lára ìtàn yìí.",
    pending: "A ṣì ń jẹ́rìí ìsanwó rẹ.",
    pendingText: "Jọ̀wọ́ tún yẹ̀ wò lẹ́yìn ìgbà díẹ̀. Má ṣe san owó lẹ́ẹ̀kansi.",
    failed: "A kò lè jẹ́rìí ìsanwó yìí.",
    failedText: "A kò tíì ṣe àtúnṣe iye owó ìpolongo.",
    retry: "Ṣàyẹ̀wò ipò ìsanwó",
    viewCampaign: "Padà sí ìpolongo",
    titleNotFound: "A kò rí ìpolongo yìí",
    notFound: "Ìpolongo yìí kò sí ní báyìí.",
    loading: "A ń ṣí ojú ìwé ìsanwó...",
    required: "Tẹ iye owó àti ìjápọ̀ àpò owó tó pé.",
    invalidWallet: "Tẹ ìjápọ̀ àpò owó Open Payments HTTPS tó tọ́.",
    quoteError: "A kò lè gba ìṣirò owó. Jọ̀wọ́ tún gbìyànjú.",
    authorizationError: "A kò lè bẹ̀rẹ̀ ìfọwọ́sí àpò owó.",
    amountError: "Tẹ iye owó tó ju òdo lọ.",
    summary: "ÌPOLONGO",
    story: "Ìwọ ń ṣètìlẹ́yìn fún",
    chooseLanguage: "Èdè",
    checkStatus: "A ń ṣàyẹ̀wò ìsanwó...",
    quoteReady: "Ìṣirò ti ṣetán",
    quoteExpired: "Ó ṣeé ṣe kí àkókò ìṣirò yìí ti parí. Gba tuntun.",
    secureNote: "A ó dáàbò bo àlàyé ìsanwó rẹ.",
    customPlaceholder: "Tẹ iye owó ní owó ìpolongo",
    minimum: "Tẹ iye owó tó tọ́.",
    walletLabel: "Ìjápọ̀ àpò owó Open Payments",
    refresh: "Tún ṣàyẹ̀wò ipò",
    home: "Padà sí PasteMe",
    campaignEnded: "Ìpolongo yìí ti parí.",
    campaignEndedMessage: "Ìpolongo yìí ti dé ọjọ́ ìparí rẹ. A ti dá ìtọrẹ dúró.",
  },
};

const quickAmounts = [500, 1000, 2500, 5000];

function formatPaymentAmount(amount) {
  if (!amount || amount.value == null) return "—";

  const scale = Number(amount.assetScale) || 0;
  const value = Number(amount.value) / Math.pow(10, scale);
  const currency = amount.assetCode || "Unknown";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: scale,
      maximumFractionDigits: scale,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString("en-NG")}`;
  }
}


export default function SupporterCheckout() {
  const { campaignId } = useParams();
  const [renderedAt] = useState(() => Date.now());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [language, setLanguage] = useState(
    () => localStorage.getItem("pasteme_language") || "en"
  );
  const t = translations[language] || translations.en;

  const returnedIntentId = searchParams.get("paymentIntentId");
  const isReturning = searchParams.get("payment") === "return";
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(Boolean(campaignId));
  const [campaignUnavailable, setCampaignUnavailable] = useState(!campaignId);

  const [amount, setAmount] = useState("1000");
  const [customAmount, setCustomAmount] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [step, setStep] = useState(returnedIntentId && isReturning ? "checking" : "form");
  const [quote, setQuote] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(
    returnedIntentId && isReturning ? returnedIntentId : ""
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const amountValue = Number(amount);
  const campaignEnded = Boolean(
    campaign &&
    !campaign.openEnded &&
    campaign.deadline &&
    new Date(`${campaign.deadline}T23:59:59`).getTime() < renderedAt
  );

  useEffect(() => {
    if (!campaignId) return undefined;

    const controller = new AbortController();

    async function loadCampaign() {
      try {
        const result = await getPublishedCampaign(campaignId, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (
          String(result.id) !== String(campaignId) ||
          result.status !== "published"
        ) {
          throw new Error("Campaign unavailable.");
        }

        if (!controller.signal.aborted) {
          setCampaign(result);
          setCampaignUnavailable(false);
        }
      } catch (loadError) {
        if (loadError.name === "AbortError") return;
        console.error("Checkout campaign retrieval failed:", loadError);
        if (!controller.signal.aborted) setCampaignUnavailable(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadCampaign();
    return () => controller.abort();
  }, [campaignId]);

  // Verify a returned payment intent with the API. This does not trust query
  // parameters as proof of payment; only the API's verified status is shown.
  useEffect(() => {
    if (!returnedIntentId || !isReturning) return undefined;

    let stopped = false;
    let timer;
    const startedAt = Date.now();

    async function checkStatus() {
      try {
        const data = await apiRequest(
          `/api/payments/${encodeURIComponent(returnedIntentId)}/status`,
          { cache: "no-store" }
        );
        if (stopped) return;

        if (data.status === "settled") {
          setStep("success");
          return;
        }

        if (data.status === "failed") {
          setStep("failed");
          return;
        }

        if (Date.now() - startedAt < 90000) {
          timer = window.setTimeout(checkStatus, 3000);
        } else {
          setStep("pending");
        }
      } catch (statusError) {
        if (stopped) return;
        setError(statusError.message || t.checkStatus);
        setStep("pending");
      }
    }

    checkStatus();

    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [returnedIntentId, isReturning, t.checkStatus]);

  function handleLanguageChange(event) {
    const selected = event.target.value;
    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  }

  function handleSelectAmount(value) {
    setCustomAmount(false);
    setAmount(String(value));
    setQuote(null);
    setError("");
  }

  function handleCustomAmount() {
    setCustomAmount(true);
    setAmount("");
    setQuote(null);
    setError("");
  }

  // Request a quote from PasteMe's backend.
  async function handleGetQuote(event) {
    event.preventDefault();
    setError("");

    if (campaignEnded) {
      setError(t.campaignEndedMessage);
      return;
    }

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setError(t.amountError);
      return;
    }

    let walletUrl;

    try {
      walletUrl = new URL(walletAddress.trim());
      if (walletUrl.protocol !== "https:") throw new Error("HTTPS required");
    } catch {
      setError(t.invalidWallet);
      return;
    }

    setBusy(true);

    try {
      const data = await apiRequest("/api/payments/quote", {
        method: "POST",
        body: JSON.stringify({
          campaignId,
          senderWalletAddress: walletUrl.href,
          amount: amountValue,
        }),
      });

      if (!data.paymentIntentId || !data.quote) {
        throw new Error("Invalid quote response from server.");
      }

      setPaymentIntentId(data.paymentIntentId);
      setQuote(data.quote);
      setStep("quote");
    } catch (err) {
      console.error("Quote request failed:", err);
      setError(err.message || t.quoteError);
    } finally {
      setBusy(false);
    }
  }

  // Ask the backend to initiate an interactive Open Payments grant.
  async function handleAuthorize() {
    if (!paymentIntentId || !quote) return;
    if (campaignEnded) {
      setError(t.campaignEndedMessage);
      return;
    }

    if (quote.expiresAt && new Date(quote.expiresAt).getTime() <= Date.now()) {
      setError(t.quoteExpired);
      return;
    }

    setBusy(true);
    setError("");

    try {
      const data = await apiRequest(
        `/api/payments/${encodeURIComponent(paymentIntentId)}/authorize`,
        { method: "POST", body: JSON.stringify({}) }
      );

      if (!data.authorizationUrl) {
        throw new Error("Missing authorization URL.");
      }

      const destination = new URL(data.authorizationUrl);

      if (destination.protocol !== "https:") {
        throw new Error("The wallet authorization URL must use HTTPS.");
      }

      // The wallet provider handles the user's authorization.
      window.location.assign(destination.href);
    } catch (err) {
      console.error("Authorization failed:", err);
      setError(err.message || t.authorizationError);
      setBusy(false);
    }
  }

  async function handleRefreshStatus() {
    if (!paymentIntentId) return;
    setBusy(true);
    setError("");

    try {
      const data = await apiRequest(
        `/api/payments/${encodeURIComponent(paymentIntentId)}/status`,
        { cache: "no-store" }
      );

      if (data.status === "settled") {
        setStep("success");
      } else if (data.status === "failed") {
        setStep("failed");
      } else {
        setStep("pending");
      }
    } catch (err) {
      setError(err.message || t.checkStatus);
    } finally {
      setBusy(false);
    }
  }

  function handleBackToForm() {
    setQuote(null);
    setPaymentIntentId("");
    setStep("form");
    setError("");
  }

  function handleReturnToCampaign() {
    navigate(`/c/${encodeURIComponent(campaignId)}`);
  }

  if (loading) {
    return (
      <main className="checkout-state">
        <span className="checkout-state-logo">p.</span>
        <p>{t.loading}</p>
      </main>
    );
  }

  if (campaignUnavailable || !campaign) {
    return (
      <main className="checkout-state">
        <span className="checkout-state-logo">p.</span>
        <h1>{t.titleNotFound}</h1>
        <p>{t.notFound}</p>
        <button onClick={() => navigate("/")}>{t.home}</button>
      </main>
    );
  }

  const raised = Number(campaign.raised) || 0;
  const goal = Number(campaign.target) || 0;

  return (
    <main className="checkout-page">

      {/* NAVIGATION */}
      <nav className="checkout-nav">
        <Link to="/" className="checkout-logo">
          paste<span>me</span><i>.</i>
        </Link>

        <div className="checkout-nav-right">
          <span className="checkout-secure-label">
            <span>✳</span> {t.live}
          </span>

          <div className="checkout-language">
            <span>文</span>
            <select
              value={language}
              onChange={handleLanguageChange}
              aria-label={t.chooseLanguage}
            >
              <option value="en">English</option>
              <option value="pcm">Pidgin</option>
              <option value="yo">Yorùbá</option>
            </select>
          </div>
        </div>
      </nav>

      <section className="checkout-layout">

        {/* LEFT: CAMPAIGN SUMMARY */}
        <aside className="checkout-campaign">

          <span className="checkout-eyebrow">{t.summary}</span>

          <div className="checkout-campaign-art">
            {campaign.coverImage ? (
              <img src={campaign.coverImage} alt="" />
            ) : (
              <div className="checkout-art-placeholder">
                <span>✳</span>
                <small>PASTEME</small>
              </div>
            )}
          </div>

          <span className="checkout-category">
            {campaign.category}
          </span>

          <h1>{campaign.title}</h1>

          <span className="checkout-support-label">{t.story}</span>
          <p className="checkout-campaign-story">{campaign.story}</p>

          <div className="checkout-campaign-progress">
            <div>
              <strong>{formatMoney(raised, campaign.currency, campaign.assetScale)}</strong>
              <span>{t.receive}</span>
            </div>

            <div className="checkout-campaign-goal">
              <strong>{formatMoney(goal, campaign.currency, campaign.assetScale)}</strong>
              <span>{t.viewGoal || "Goal"}</span>
            </div>
          </div>

          <div className="checkout-progress-track">
            <div
              style={{
                width: `${goal > 0 ? Math.min((raised / goal) * 100, 100) : 0}%`,
              }}
            />
          </div>

          <button
            type="button"
            className="checkout-return-link"
            onClick={handleReturnToCampaign}
          >
            ← {t.viewCampaign}
          </button>

        </aside>

        {/* RIGHT: CHECKOUT */}
        <section className="checkout-card">

          {step === "form" && (
            <>
              <div className="checkout-heading">
                <span className="checkout-eyebrow">{t.eyebrow}</span>
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
              </div>

              <form onSubmit={handleGetQuote}>

                {campaignEnded && (
                  <p className="checkout-error" role="status">
                    {t.campaignEndedMessage}
                  </p>
                )}

                <div className="checkout-field">
                  <label>{t.amount}</label>

                  <div className="checkout-amount-grid">
                    {quickAmounts.map((value) => (
                      <button
                        type="button"
                        key={value}
                        className={
                          !customAmount && amount === String(value)
                            ? "amount-option selected"
                            : "amount-option"
                        }
                        onClick={() => handleSelectAmount(value)}
                      >
                        {formatMoney(value, campaign.currency, campaign.assetScale)}
                      </button>
                    ))}

                    <button
                      type="button"
                      className={
                        customAmount
                          ? "amount-option selected"
                          : "amount-option"
                      }
                      onClick={handleCustomAmount}
                    >
                      {t.custom}
                    </button>
                  </div>

                  {customAmount && (
                    <div className="checkout-custom-amount">
                      <span>{campaign.currency}</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={t.customPlaceholder}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="checkout-field">
                  <label htmlFor="senderWallet">
                    {t.walletLabel}
                  </label>

                  <input
                    id="senderWallet"
                    className="checkout-wallet-input"
                    type="url"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="https://wallet.example.com/you"
                    autoComplete="off"
                    spellCheck="false"
                    required
                  />

                  <small>{t.walletHelp}</small>
                </div>

                <div className="checkout-wallet-warning">
                  <span>!</span>
                  <p>{t.walletWarning}</p>
                </div>

                {error && (
                  <p className="checkout-error" role="alert">{error}</p>
                )}

                <button
                  type="submit"
                  className="checkout-primary"
                  disabled={busy || campaignEnded}
                >
                  {campaignEnded ? t.campaignEnded : busy ? t.processing : t.continue}
                  <span>↗</span>
                </button>

                <div className="checkout-trust-note">
                  <span>✓</span>
                  {t.noSignup}
                </div>

              </form>
            </>
          )}

          {step === "quote" && quote && (
            <div className="checkout-quote">

              <span className="checkout-eyebrow">{t.quoteReady}</span>
              <h2>{t.quoteTitle}</h2>

              <div className="quote-amount-box">
                <span>{t.receive}</span>
                <strong>
                  {formatPaymentAmount(quote.receiveAmount)}
                </strong>
              </div>

              <div className="quote-row">
                <span>{t.total}</span>
                <strong>
                  {formatPaymentAmount(quote.debitAmount)}
                </strong>
              </div>

              {quote.expiresAt && (
                <div className="quote-row quote-expiry">
                  <span>{t.quoteExpiry}</span>
                  <strong>
                    {new Date(quote.expiresAt).toLocaleTimeString(
                      "en-NG",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </strong>
                </div>
              )}

              <div className="quote-security-note">
                <span>✳</span>
                <p>{t.secure}</p>
              </div>

              {error && (
                <p className="checkout-error" role="alert">{error}</p>
              )}

              <button
                type="button"
                className="checkout-primary"
                onClick={handleAuthorize}
                disabled={busy}
              >
                {busy ? t.redirecting : t.authorize}
                <span>↗</span>
              </button>

              <button
                type="button"
                className="checkout-back"
                onClick={handleBackToForm}
                disabled={busy}
              >
                ← {t.back}
              </button>

            </div>
          )}

          {step === "checking" && (
            <StatusPanel
              icon="◌"
              title={t.checkStatus}
              description={t.pendingText}
              busy
            />
          )}

          {step === "success" && (
            <StatusPanel
              icon="✓"
              title={t.success}
              description={t.successText}
              success
              buttonText={t.viewCampaign}
              onClick={handleReturnToCampaign}
            />
          )}

          {step === "pending" && (
            <StatusPanel
              icon="◷"
              title={t.pending}
              description={t.pendingText}
              buttonText={busy ? t.checkStatus : t.retry}
              onClick={handleRefreshStatus}
              disabled={busy}
              error={error}
            />
          )}

          {step === "failed" && (
            <StatusPanel
              icon="!"
              title={t.failed}
              description={t.failedText}
              error
              buttonText={t.viewCampaign}
              onClick={handleReturnToCampaign}
            />
          )}

          <div className="checkout-card-footer">
            <span>paste<span>me</span>.</span>
            <small>{t.secureNote}</small>
          </div>

        </section>

      </section>
    </main>
  );
}

function StatusPanel({
  icon,
  title,
  description,
  success,
  error,
  busy,
  buttonText,
  onClick,
  disabled,
}) {
  return (
    <div className="checkout-status-panel">
      <div
        className={`checkout-status-icon ${
          success ? "success" : error ? "failure" : ""
        } ${busy ? "spinning" : ""}`}
      >
        {icon}
      </div>

      <h2>{title}</h2>
      <p>{description}</p>

      {error && typeof error === "string" && (
        <p className="checkout-error">{error}</p>
      )}

      {buttonText && onClick && (
        <button
          type="button"
          className="checkout-primary"
          onClick={onClick}
          disabled={disabled}
        >
          {buttonText}
          <span>↗</span>
        </button>
      )}
    </div>
  );
}
