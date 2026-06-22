import { absoluteUrl, siteMetadata } from "@/config/site";

const ogImageUrl = absoluteUrl(siteMetadata.socialImage.path);

const websiteId = `${siteMetadata.origin}/#website`;
const webpageId = `${siteMetadata.origin}/#webpage`;
const appId = `${siteMetadata.origin}/#webapp`;
const imageId = `${ogImageUrl}#primaryimage`;

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: siteMetadata.name,
      alternateName: "Taboo Online",
      url: siteMetadata.origin,
      description: siteMetadata.description,
      inLanguage: siteMetadata.language,
    },
    {
      "@type": "WebPage",
      "@id": webpageId,
      url: siteMetadata.origin,
      name: siteMetadata.title,
      description: siteMetadata.description,
      dateModified: siteMetadata.lastModified,
      isPartOf: {
        "@id": websiteId,
      },
      primaryImageOfPage: {
        "@id": imageId,
      },
      mainEntity: {
        "@id": appId,
      },
      inLanguage: siteMetadata.language,
    },
    {
      "@type": "ImageObject",
      "@id": imageId,
      url: ogImageUrl,
      contentUrl: ogImageUrl,
      width: siteMetadata.socialImage.width,
      height: siteMetadata.socialImage.height,
      caption: siteMetadata.socialImage.alt,
      inLanguage: siteMetadata.language,
    },
    {
      "@type": ["WebApplication", "Game"],
      "@id": appId,
      name: siteMetadata.name,
      alternateName: ["Taboo Online", "Free Taboo Game"],
      description: siteMetadata.description,
      url: siteMetadata.origin,
      image: {
        "@id": imageId,
      },
      applicationCategory: "GameApplication",
      applicationSubCategory: "Party Game",
      genre: ["Party", "Word", "Family"],
      gamePlatform: "Web Browser",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Works on modern browsers.",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      audience: {
        "@type": "PeopleAudience",
        suggestedMinAge: 8,
      },
      numberOfPlayers: {
        "@type": "QuantitativeValue",
        minValue: 2,
      },
      playMode: "MultiPlayer",
      inLanguage: siteMetadata.language,
    },
  ],
} as const;
