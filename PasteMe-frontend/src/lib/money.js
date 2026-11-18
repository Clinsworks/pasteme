export function formatMoney(value, currency = "NGN", assetScale = 2, locale = "en-NG") {
  const amount = Number(value) || 0;
  const fractionDigits = Number.isInteger(assetScale) && assetScale >= 0 && assetScale <= 9
    ? assetScale
    : 2;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(locale, { maximumFractionDigits: fractionDigits })}`;
  }
}
