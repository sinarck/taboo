const siteOrigin = (import.meta.env.VITE_SITE_URL ?? "https://taboo.aadisanghvi.com").replace(
  /\/+$/,
  "",
);

export const siteMetadata = {
  origin: siteOrigin,
  name: "Taboo",
  shortTitle: "Taboo",
  title: "Play Taboo Online | Free Party Word Game",
  socialTitle: "Play Taboo Online",
  tagline: "Free browser-based forbidden word party game",
  description:
    "Play Taboo online for free in your browser. Split into teams, describe the card, avoid the five forbidden words, and race the timer at parties or game night.",
  shortDescription:
    "Free online Taboo game with team scoring, timers, skips, and forbidden word cards.",
  themeColorLight: "#fafafa",
  themeColorDark: "#0a0a0a",
  locale: "en_US",
  language: "en",
  category: "game",
  lastModified: "2026-06-22",
  keywords: [
    "taboo",
    "taboo game",
    "play taboo",
    "taboo online",
    "play taboo online",
    "free taboo game",
    "online taboo",
    "word game",
    "party game",
    "guessing game",
    "team game",
    "family game",
    "forbidden words",
    "word card game",
    "browser game",
    "taboo cards",
  ],
  socialImage: {
    path: "/og-image.png",
    alt: "Taboo online party word game",
    width: 1200,
    height: 630,
    type: "image/png",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
} as const;

export const absoluteUrl = (path = "/") =>
  path.startsWith("http")
    ? path
    : `${siteMetadata.origin}${path.startsWith("/") ? path : `/${path}`}`;

export const formatTitle = (page?: string) =>
  page ? `${page} | ${siteMetadata.name}` : siteMetadata.title;
