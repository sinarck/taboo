import { createFileRoute } from "@tanstack/react-router";
import { siteMetadata } from "@/config/site";

type SitemapEntry = {
  readonly path: string;
  readonly changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  readonly priority?: number;
};

const entries: readonly SitemapEntry[] = [{ path: "/", changefreq: "monthly", priority: 1.0 }];

// Served as `/sitemap.xml`. Built from `entries` above so adding a route is
// a one-line change. Lastmod uses build/request time which is good enough
// for a single-page game; bump this manually if a static asset changes
// in a way crawlers should re-fetch.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const lastmod = new Date().toISOString();
        const urls = entries
          .map((entry) => {
            const loc = `${siteMetadata.origin}${entry.path}`;
            const lines = [
              "  <url>",
              `    <loc>${loc}</loc>`,
              `    <lastmod>${lastmod}</lastmod>`,
              entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
              entry.priority !== undefined
                ? `    <priority>${entry.priority.toFixed(1)}</priority>`
                : null,
              "  </url>",
            ].filter(Boolean);
            return lines.join("\n");
          })
          .join("\n");

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
