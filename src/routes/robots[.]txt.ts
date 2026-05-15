import { createFileRoute } from "@tanstack/react-router";
import { siteMetadata } from "@/config/site";

// Served as `/robots.txt`. The `[.]` in the file name is TanStack Router's
// escape for a literal dot inside a path segment.
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const body = [
          "User-agent: *",
          "Allow: /",
          "",
          `Sitemap: ${siteMetadata.origin}/sitemap.xml`,
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
