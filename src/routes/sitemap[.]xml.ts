import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl, siteMetadata } from "@/config/site";

type SitemapEntry = {
  readonly path: string;
  readonly changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  readonly lastmod?: string;
  readonly priority?: number;
};

const entries: readonly SitemapEntry[] = [{ path: "/", changefreq: "monthly", priority: 1.0 }];

// Served as `/sitemap.xml`. Built from `entries` above so adding a route is
// a one-line change.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = entries
          .map((entry) => {
            const loc = absoluteUrl(entry.path);
            const lines = [
              "  <url>",
              `    <loc>${escapeXml(loc)}</loc>`,
              `    <lastmod>${entry.lastmod ?? siteMetadata.lastModified}</lastmod>`,
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

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
