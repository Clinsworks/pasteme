import Icon from "./Icon";
import { useEffect, useState } from "react";

export default function InstallAppButton({ label = "Install app" }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    const isStandalone = window.matchMedia?.("(display-mode: standalone)").matches;
    return Boolean(isStandalone || window.navigator.standalone === true);
  });

  useEffect(() => {

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch (error) {
      console.warn("PasteMe installation prompt was dismissed or unavailable:", error);
    } finally {
      setInstallPrompt(null);
    }
  };

  if (installed || !installPrompt) return null;

  return (
    <button className="install-app-button" type="button" onClick={handleInstall}>
      <Icon name="download" size={16} />
      {label}
    </button>
  );
}
