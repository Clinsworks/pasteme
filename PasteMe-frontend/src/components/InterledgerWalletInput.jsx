import "./InterledgerWalletInput.css";

const walletPrefix = "https://ilp.interledger-test.dev/";

function getWalletName(walletAddress) {
  if (!walletAddress) return "";

  try {
    const url = new URL(walletAddress);
    const segment = url.pathname.split("/").filter(Boolean).pop();
    return segment ? decodeURIComponent(segment) : "";
  } catch {
    return walletAddress;
  }
}

function buildWalletAddress(walletName) {
  const name = walletName.trim();
  return name ? `${walletPrefix}${encodeURIComponent(name)}` : "";
}

export default function InterledgerWalletInput({
  id,
  name,
  value,
  onChange,
  placeholder = "your-name",
  className = "",
}) {
  return (
    <div className={`wallet-username-control ${className}`.trim()}>
      <span id={`${id}-prefix`} className="wallet-username-prefix">{walletPrefix}</span>
      <input
        id={id}
        name={name}
        className="wallet-username-input"
        type="text"
        value={getWalletName(value)}
        onChange={(event) => onChange(buildWalletAddress(event.target.value))}
        placeholder={placeholder}
        aria-describedby={`${id}-prefix`}
        autoComplete="off"
        spellCheck="false"
        required
      />
    </div>
  );
}
