export const siteMetadata = {
  origin: import.meta.env.VITE_SITE_URL ?? "https://taboo.aadisanghvi.com",
  name: "Taboo",
  title: "Taboo",
  description:
    "Play Taboo online with friends. Describe the word on the card without using any of the forbidden words. Free, fast, and built for the table.",
  themeColorLight: "#fafafa",
  themeColorDark: "#0a0a0a",
  locale: "en_US",
  category: "game",
  keywords: [
    "taboo",
    "word game",
    "party game",
    "guessing game",
    "online taboo",
    "play taboo",
    "forbidden words",
  ],
  socialImage: {
    path: "/og-image.png",
    alt: "Taboo — the forbidden word party game",
    width: 1200,
    height: 630,
    type: "image/png",
  },
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
} as const

export const formatTitle = (page?: string) =>
  page ? `${page} | ${siteMetadata.name}` : siteMetadata.title
