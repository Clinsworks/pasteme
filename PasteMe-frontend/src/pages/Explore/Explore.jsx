import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import BrandLogo from "../../components/BrandLogo";
import PasteMeNav from "../../components/PasteMeNav";
import PasteCard from "../../components/PasteCard";
import { useAuth } from "../../context/AuthContext";
import { listDiscoverablePastes } from "../../lib/discoveryStore";
import "./Explore.css";

const Cloudee = lazy(() => import("../../components/CloudeeAvatar"));

const translations = {
  en: {
    home: "Home", explore: "Explore Pastes", how: "How it works", signIn: "Sign in", signUp: "Get started", dashboard: "My dashboard", start: "Start a Paste", language: "Language", install: "Install app",
    eyebrow: "THE STUDENT COMMUNITY", title: "Find a Paste worth showing up for.", subtitle: "See what students are raising money for, read their stories and find a way to help. No account is needed to contribute.",
    searchLabel: "Search Pastes", searchPlaceholder: "Try tuition, textbooks, rent or a name...", filterLabel: "Browse by need", sortLabel: "Sort by", newest: "Newest", supported: "Most supported", closest: "Closest to goal", all: "All Pastes", results: "Pastes to explore", found: "results", loading: "Finding Pastes...", retry: "Try again", loadErrorTitle: "We couldn't load the Pastes just now.", loadErrorText: "Give it another try in a moment. Your search will still be here.", emptyTitle: "No Pastes here just yet.", emptyText: "Try a different search or category. New stories will show up here as students share them.", reset: "Clear filters", noGoal: "No goal set", raised: "raised so far", goal: "Goal", funded: "funded", supporters: "supporters", view: "View Paste", contribute: "Contribute", by: "By", untitled: "Untitled Paste", communityMember: "PasteMe community", progress: "Fundraising progress", footer: "A little help can go a long way.", categories: { tuition: "Tuition", accommodation: "Accommodation", medical: "Medical", materials: "Academic materials", emergency: "Emergency", education: "Education", community: "Community", business: "Business" },
  },
  pcm: {
    home: "Home", explore: "Explore Pastes", how: "How e dey work", signIn: "Log in", signUp: "Get started", dashboard: "My dashboard", start: "Start a Paste", language: "Language", install: "Install app",
    eyebrow: "OUR STUDENT COMMUNITY", title: "Find one Paste wey you fit support.", subtitle: "See wetin students dey raise money for, read their stories and find how you fit help. You no need account to contribute.",
    searchLabel: "Search Pastes", searchPlaceholder: "Try tuition, textbooks, rent or name...", filterLabel: "Browse by need", sortLabel: "Arrange by", newest: "Newest", supported: "People don support am", closest: "Near target", all: "All Pastes", results: "Pastes to explore", found: "results", loading: "We dey find Pastes...", retry: "Try again", loadErrorTitle: "We no fit load the Pastes now.", loadErrorText: "Try again small time. Your search go still dey here.", emptyTitle: "No Paste dey here yet.", emptyText: "Try another search or category. New stories go show as students share them.", reset: "Clear filters", noGoal: "No target set", raised: "money wey don enter", goal: "Target", funded: "don fund", supporters: "supporters", view: "See Paste", contribute: "Contribute", by: "By", untitled: "Untitled Paste", communityMember: "PasteMe community", progress: "Fundraising progress", footer: "Small help fit go far.", categories: { tuition: "Tuition", accommodation: "Accommodation", medical: "Health", materials: "School materials", emergency: "Emergency", education: "Education", community: "Community", business: "Business" },
  },
  yo: {
    home: "Ilé", explore: "Ṣàwárí Pastes", how: "Bí ó ṣe ń ṣiṣẹ́", signIn: "Wọlé", signUp: "Bẹ̀rẹ̀", dashboard: "Ojú ìṣàkóso mi", start: "Bẹ̀rẹ̀ Paste", language: "Èdè", install: "Fi app sori ẹrọ",
    eyebrow: "ÀWÙJỌ AKẸ́KỌ̀Ọ́ WA", title: "Rí Paste kan tí o lè ṣe àtìlẹ́yìn fún.", subtitle: "Wo ohun tí àwọn akẹ́kọ̀ọ́ ń kó owó jọ fún, ka ìtàn wọn, kí o sì wá ọ̀nà láti ràn wọ́n lọ́wọ́. O kò nílò àkáǹtì láti ṣètọrẹ.",
    searchLabel: "Ṣàwárí Pastes", searchPlaceholder: "Wá owó ilé ẹ̀kọ́, ìwé, ilé tàbí orúkọ...", filterLabel: "Yan ohun tí o fẹ́ ṣètìlẹ́yìn fún", sortLabel: "Tò lẹ́sẹẹsẹ", newest: "Tuntun jù", supported: "Àwọn tó gba ìrànlọ́wọ́ jù", closest: "Tó sún mọ́ àfojúsùn", all: "Gbogbo Pastes", results: "Pastes láti ṣàwárí", found: "àbájáde", loading: "A ń wá Pastes...", retry: "Tún gbìyànjú", loadErrorTitle: "A kò lè ṣí àwọn Pastes báyìí.", loadErrorText: "Jọ̀wọ́ tún gbìyànjú lẹ́yìn ìgbà díẹ̀.", emptyTitle: "Kò sí Paste níbí síbẹ̀.", emptyText: "Gbìyànjú àwárí tàbí ẹ̀ka mìíràn. Àwọn ìtàn tuntun yóò hàn bí àwọn akẹ́kọ̀ọ́ ṣe ń pín wọn.", reset: "Pa gbogbo àlẹ̀mọ́ rẹ́", noGoal: "Kò sí àfojúsùn", raised: "owó tí a ti gbà", goal: "Àfojúsùn", funded: "ti kún", supporters: "olùrànlọ́wọ́", view: "Wo Paste", contribute: "Ṣètọrẹ", by: "Láti ọ̀dọ̀", untitled: "Paste tí kò ní àkọlé", communityMember: "Àwùjọ PasteMe", progress: "Ìlọsíwájú ìkójọ owó", footer: "Ìrànlọ́wọ́ díẹ̀ lè ṣe púpọ̀.", categories: { tuition: "Owó ilé ẹ̀kọ́", accommodation: "Ibugbe", medical: "Ìlera", materials: "Ohun èlò ẹ̀kọ́", emergency: "Pajawiri", education: "Ẹ̀kọ́", community: "Àwùjọ", business: "Iṣòwò" },
  },
};

const categoryFilters = ["all", "tuition", "accommodation", "medical", "materials", "emergency", "education", "community", "business"];

function isActivePaste(paste) {
  if (paste.status && paste.status !== "published" && paste.status !== "active") return false;
  if (paste.openEnded || !paste.deadline) return true;
  const end = new Date(`${paste.deadline}T23:59:59`).getTime();
  return Number.isNaN(end) || end >= Date.now();
}

function matchesCategory(paste, category) {
  if (category === "all") return true;
  const rawCategory = String(paste.category || "").toLowerCase();
  const text = `${paste.title || ""} ${paste.story || ""} ${paste.shortDescription || ""} ${paste.subcategory || ""}`.toLowerCase();
  const exact = {
    tuition: ["tuition", "school fees", "school fee", "acceptance fee", "exam fee"],
    accommodation: ["accommodation", "hostel", "rent", "room", "housing"],
    medical: ["medical", "health", "hospital", "treatment", "surgery", "medicine"],
    materials: ["textbook", "textbooks", "school materials", "academic materials", "stationery", "course materials", "laptop"],
    emergency: ["emergency", "urgent", "accident", "fire", "crisis"],
    education: ["education", "tuition", "school", "academic", "textbook", "fees"],
    community: ["community", "department", "hostel project", "student group"],
    business: ["business", "shop", "startup", "small business"],
  };
  const directCategories = {
    tuition: ["tuition"],
    accommodation: ["accommodation"],
    medical: ["medical"],
    materials: ["academic materials", "materials"],
    emergency: ["emergency", "emergencies"],
    education: ["education"],
    community: ["community"],
    business: ["business"],
  };
  if ((directCategories[category] || []).includes(rawCategory)) return true;
  return (exact[category] || []).some((term) => text.includes(term));
}

export default function Explore() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [language, setLanguage] = useState(() => localStorage.getItem("pasteme_language") || "en");
  const [pastes, setPastes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const t = translations[language] || translations.en;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    listDiscoverablePastes({ limit: 100, signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setPastes(result.filter(isActivePaste));
        }
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        console.error("Could not load discovery feed:", requestError);
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [retryKey]);

  const filteredPastes = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = pastes.filter((paste) => {
      if (!matchesCategory(paste, category)) return false;
      if (!query) return true;
      const creator = paste.creator?.displayName || paste.creator?.name || paste.creatorName || "";
      const university = paste.university || paste.creatorUniversity || paste.creator?.university || "";
      return `${paste.title || ""} ${paste.story || ""} ${paste.shortDescription || ""} ${paste.category || ""} ${creator} ${university}`.toLowerCase().includes(query);
    });

    return filtered.sort((a, b) => {
      if (sort === "supported") return (Number(b.contributors) || 0) - (Number(a.contributors) || 0);
      if (sort === "closest") {
        const aGoal = Number(a.target) > 0;
        const bGoal = Number(b.target) > 0;
        if (aGoal !== bGoal) return aGoal ? -1 : 1;
        const aProgress = aGoal ? (Number(a.raised) || 0) / Number(a.target) : -1;
        const bProgress = bGoal ? (Number(b.raised) || 0) / Number(b.target) : -1;
        return bProgress - aProgress;
      }
      return new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0);
    });
  }, [pastes, search, category, sort]);

  const handleLanguageChange = (event) => {
    const selected = event.target.value;
    setLanguage(selected);
    localStorage.setItem("pasteme_language", selected);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (logoutError) {
      console.error("Could not log out:", logoutError);
    }
  };

  return (
    <main className="explore-page">

      <PasteMeNav
        activePage="explore"
        isAuthenticated={isAuthenticated}
        userName={user?.name || ""}
        language={language}
        onLanguageChange={handleLanguageChange}
        onLogout={handleLogout}
        labels={{
          dashboard: t.dashboard,
          signIn: t.signIn,
          start: t.start,
          language: t.language,
          install: t.install,
          logout: t.logout || "Log out",
        }}
      />
      <section className="explore-intro">
        <div className="container explore-intro-inner">
          <div className="explore-intro-copy">
            <span className="eyebrow"><Icon name="users" size={15} />{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          <div className="explore-intro-aside">
            <div className="explore-intro-avatar">
              <Suspense fallback={null}>
                <Cloudee
                  className="explore-intro-avatar-image"
                  state="idle"
                  size={150}
                  ariaLabel="Cloudee, the PasteMe mascot"
                />
              </Suspense>
            </div>
            <div className="explore-intro-note">
              <span className="explore-note-mark"><Icon name="heart-handshake" size={24} /></span>
              <span>{t.footer}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="explore-content container">
        <div className="explore-controls">
          <label className="explore-search">
            <Icon name="search" size={19} />
            <span className="sr-only">{t.searchLabel}</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} />
            {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><Icon name="close" size={16} /></button>}
          </label>
          <label className="explore-sort">
            <span>{t.sortLabel}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">{t.newest}</option>
              <option value="supported">{t.supported}</option>
              <option value="closest">{t.closest}</option>
            </select>
          </label>
        </div>

        <div className="explore-filter-heading"><span>{t.filterLabel}</span><button type="button" onClick={() => { setCategory("all"); setSearch(""); }}>{t.reset}</button></div>
        <div className="explore-category-filters" role="group" aria-label={t.filterLabel}>
          {categoryFilters.map((value) => (
            <button key={value} type="button" className={category === value ? "is-active" : ""} aria-pressed={category === value} onClick={() => setCategory(value)}>
              {t.categories[value] || t.all}
            </button>
          ))}
        </div>

        <div className="explore-results-heading">
          <div>
            <h2>{t.results}</h2>
            {!loading && !error && <span>{filteredPastes.length} {t.found}</span>}
          </div>
        </div>

        {loading ? (
          <div className="explore-state" role="status"><Icon name="loader" size={24} /><p>{t.loading}</p></div>
        ) : error ? (
          <div className="explore-state explore-error-state">
            <Icon name="cloud-off" size={27} />
            <h3>{t.loadErrorTitle}</h3>
            <p>{t.loadErrorText}</p>
            <button type="button" onClick={() => setRetryKey((value) => value + 1)}>{t.retry}</button>
          </div>
        ) : filteredPastes.length ? (
          <div className="explore-paste-grid">
            {filteredPastes.map((paste) => (
              <PasteCard key={paste.id || paste._id} paste={paste} language={language} labels={{ ...t, progress: t.progress || t.goal }} />
            ))}
          </div>
        ) : (
          <div className="explore-state">
            <Icon name="search" size={27} />
            <h3>{t.emptyTitle}</h3>
            <p>{t.emptyText}</p>
            {(search || category !== "all") && <button type="button" onClick={() => { setSearch(""); setCategory("all"); }}>{t.reset}</button>}
          </div>
        )}
      </section>

      <footer className="explore-footer">
        <BrandLogo to="/" />
        <span>{t.footer}</span>
      </footer>
    </main>
  );
}
