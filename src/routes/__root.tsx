/// <reference types="vite/client" />

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { VercelAnalytics } from "@/components/vercel-analytics"
import { siteMetadata } from "@/config/site"
import appCss from "../styles.css?url"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Game",
  name: siteMetadata.name,
  description: siteMetadata.description,
  url: siteMetadata.origin,
  image: `${siteMetadata.origin}${siteMetadata.socialImage.path}`,
  applicationCategory: "GameApplication",
  genre: "Party",
  numberOfPlayers: { "@type": "QuantitativeValue", minValue: 2, maxValue: 8 },
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1",
      },
      { title: siteMetadata.title },
      { name: "description", content: siteMetadata.description },
      { name: "keywords", content: siteMetadata.keywords.join(", ") },
      { name: "robots", content: siteMetadata.robots },
      { name: "author", content: siteMetadata.name },
      { name: "application-name", content: siteMetadata.name },
      { name: "apple-mobile-web-app-title", content: siteMetadata.name },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "format-detection", content: "telephone=no" },
      { name: "color-scheme", content: "light dark" },
      {
        name: "theme-color",
        content: siteMetadata.themeColorLight,
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: siteMetadata.themeColorDark,
        media: "(prefers-color-scheme: dark)",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteMetadata.name },
      { property: "og:locale", content: siteMetadata.locale },
      { property: "og:title", content: siteMetadata.title },
      { property: "og:description", content: siteMetadata.description },
      { property: "og:url", content: siteMetadata.origin },
      {
        property: "og:image",
        content: `${siteMetadata.origin}${siteMetadata.socialImage.path}`,
      },
      { property: "og:image:width", content: String(siteMetadata.socialImage.width) },
      { property: "og:image:height", content: String(siteMetadata.socialImage.height) },
      { property: "og:image:alt", content: siteMetadata.socialImage.alt },
      { property: "og:image:type", content: siteMetadata.socialImage.type },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteMetadata.title },
      { name: "twitter:description", content: siteMetadata.description },
      {
        name: "twitter:image",
        content: `${siteMetadata.origin}${siteMetadata.socialImage.path}`,
      },
      { name: "twitter:image:alt", content: siteMetadata.socialImage.alt },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: siteMetadata.origin },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en" className="dark bg-background">
      <head>
        <HeadContent />
      </head>
      <body className="relative min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          Skip to main content
        </a>
        <div className="relative isolate min-h-svh">
          <Outlet />
        </div>
        <VercelAnalytics />
        <Scripts />
      </body>
    </html>
  )
}
