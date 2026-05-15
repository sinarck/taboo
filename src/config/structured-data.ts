import { siteMetadata } from "@/config/site";

const ogImageUrl = `${siteMetadata.origin}${siteMetadata.socialImage.path}`;

// JSON-LD blocks for the homepage. Two graphs: WebSite for sitelinks
// search-box eligibility, plus a combined Game/WebApplication entry so
// crawlers can classify the experience as a multiplayer party game.
export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMetadata.name,
    url: siteMetadata.origin,
    description: siteMetadata.description,
    inLanguage: "en",
  },
  {
    "@context": "https://schema.org",
    "@type": ["Game", "WebApplication"],
    name: siteMetadata.name,
    alternateName: "Taboo Online",
    description: siteMetadata.description,
    url: siteMetadata.origin,
    image: ogImageUrl,
    applicationCategory: "GameApplication",
    applicationSubCategory: "Party Game",
    genre: ["Party", "Word", "Family"],
    gamePlatform: "Web Browser",
    numberOfPlayers: {
      "@type": "QuantitativeValue",
      minValue: 2,
      maxValue: 16,
    },
    playMode: "MultiPlayer",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Works on modern browsers.",
    inLanguage: "en",
  },
];
