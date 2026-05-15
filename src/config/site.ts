export const siteMetadata = {
  origin: import.meta.env.VITE_SITE_URL ?? "https://taboo.aadisanghvi.com",
  name: "Taboo",
  shortTitle: "Taboo",
  title: "Taboo",
  socialTitle: "Taboo",
  tagline: "The forbidden word party game",
  description:
    "Play Taboo online. Get your team to guess the word on the card without using any of the five forbidden words. Built for parties, family nights, and the office.",
  shortDescription: "Play Taboo online. Guess the word without using the five forbidden words.",
  themeColorLight: "#fafafa",
  themeColorDark: "#0a0a0a",
  locale: "en_US",
  category: "game",
  keywords: [
    "taboo",
    "taboo game",
    "play taboo",
    "taboo online",
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
    alt: "Taboo — the forbidden word party game",
    width: 1200,
    height: 630,
    type: "image/png",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
} as const;

export const formatTitle = (page?: string) =>
  page ? `${page} | ${siteMetadata.name}` : siteMetadata.title;
