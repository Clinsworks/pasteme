import { useEffect } from "react";

// Small, dependency-free reveal system shared by all PasteMe pages.
// Elements remain visible by default; the reveal class is only applied when
// IntersectionObserver is available and the visitor has not requested reduced motion.
const REVEAL_SELECTORS = [
  ".hero-copy",
  ".hero-visual",
  ".trust-item",
  ".section-heading",
  ".step-card",
  ".why-copy",
  ".benefit-card",
  ".faq-item",
  ".final-cta-inner",
  ".footer-main",
  ".auth-visual-content",
  ".auth-form-container",
  ".dashboard-header",
  ".dashboard-overview",
  ".dashboard-stat-card",
  ".dashboard-campaigns-section",
  ".dashboard-campaign-card",
  ".dashboard-empty",
  ".dashboard-quick-create",
  ".create-intro-content",
  ".create-step-shell",
  ".preview-heading",
  ".public-campaign-card",
  ".preview-footnote",
  ".publish-panel",
  ".published-hero",
  ".published-campaign-card",
  ".published-share-panel",
  ".public-hero-content",
  ".public-story-section",
  ".public-donation-card",
  ".checkout-campaign",
  ".checkout-card",
  ".checkout-status-panel",
  ".not-found-content",
].join(",");

export default function ScrollReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches ?? false;

    if (reduceMotion || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -36px 0px",
      }
    );

    const observed = new WeakSet();

    const registerRevealElements = () => {
      document.querySelectorAll(REVEAL_SELECTORS).forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.classList.add("pm-reveal");
        observer.observe(element);
      });
    };

    registerRevealElements();

    // Some pages populate campaign cards after local data/API retrieval.
    // Watch for those additions so dynamically rendered elements also reveal.
    const mutationObserver = new MutationObserver(registerRevealElements);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
