import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl, siteMetadata } from "@/config/site";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => {
        const body = [
          `# ${siteMetadata.name}`,
          "",
          `> ${siteMetadata.shortDescription}`,
          "",
          `${siteMetadata.name} is a free browser-based party word game. Players split into teams, describe a card's main word, avoid the forbidden words, and score points before the timer runs out.`,
          "",
          "## Primary URLs",
          "",
          `- [Play ${siteMetadata.name}](${siteMetadata.origin}): Canonical homepage and playable game.`,
          `- [Sitemap](${absoluteUrl("/sitemap.xml")}): XML sitemap for indexable URLs.`,
          `- [Robots](${absoluteUrl("/robots.txt")}): Crawler access policy.`,
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
