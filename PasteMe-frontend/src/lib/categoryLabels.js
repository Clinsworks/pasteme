const categoryNames = {
  Animals: { en: "Animals", pcm: "Animals", yo: "Ẹranko" },
  Business: { en: "Business", pcm: "Business", yo: "Iṣòwò" },
  Community: { en: "Community", pcm: "Community", yo: "Àwùjọ" },
  Competitions: { en: "Competitions", pcm: "Competitions", yo: "Ìdíje" },
  Creative: { en: "Creative", pcm: "Creative", yo: "Ìṣẹ̀dá" },
  Education: { en: "Education", pcm: "Education", yo: "Ẹ̀kọ́" },
  Emergencies: { en: "Emergencies", pcm: "Emergency", yo: "Pajawiri" },
  Environment: { en: "Environment", pcm: "Environment", yo: "Àyíká" },
  Events: { en: "Events", pcm: "Events", yo: "Ìṣẹ̀lẹ̀" },
  Faith: { en: "Faith", pcm: "Faith", yo: "Ìgbàgbọ́" },
  Family: { en: "Family", pcm: "Family", yo: "Ẹbí" },
  "Funerals & Memorials": { en: "Funerals & Memorials", pcm: "Funerals & Memorials", yo: "Ìsìnkú àti Ìrántí" },
  Medical: { en: "Medical", pcm: "Health", yo: "Ìlera" },
  "Monthly Bills": { en: "Monthly Bills", pcm: "Monthly Bills", yo: "Owó Oṣooṣù" },
  Newlyweds: { en: "Newlyweds", pcm: "Newlyweds", yo: "Àwọn Tó Ṣẹ̀ṣẹ̀ Ṣègbéyàwó" },
  Other: { en: "Other", pcm: "Other", yo: "Òmíràn" },
  Sports: { en: "Sports", pcm: "Sports", yo: "Eré Ìdárayá" },
  Travel: { en: "Travel", pcm: "Travel", yo: "Ìrìn-àjò" },
  "Ukraine Relief": { en: "Ukraine Relief", pcm: "Ukraine Relief", yo: "Ìrànlọ́wọ́ Ukraine" },
  Volunteer: { en: "Volunteer", pcm: "Volunteer", yo: "Yíyọ̀ǹda" },
  Wishes: { en: "Wishes", pcm: "Wishes", yo: "Àwọn Ìfẹ́-ọkàn" },
  // Legacy category support for previously created campaigns.
  Personal: { en: "Personal", pcm: "Personal", yo: "Ti ara ẹni" },
};

export function getCategoryLabel(category, language = "en") {
  if (!category) return "";
  return categoryNames[category]?.[language] || categoryNames[category]?.en || category;
}
