import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { gameRules } from "@/config/rules";
import { siteMetadata } from "@/config/site";

const TabooGame = lazy(() =>
  import("@/components/taboo-game").then((module) => ({ default: module.TabooGame })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: siteMetadata.title },
      { name: "description", content: siteMetadata.description },
      { name: "keywords", content: siteMetadata.keywords.join(", ") },
      { property: "og:title", content: siteMetadata.socialTitle },
      { property: "og:description", content: siteMetadata.description },
      { property: "og:url", content: siteMetadata.origin },
      { name: "twitter:title", content: siteMetadata.socialTitle },
      { name: "twitter:description", content: siteMetadata.description },
      { name: "twitter:url", content: siteMetadata.origin },
    ],
    links: [{ rel: "canonical", href: siteMetadata.origin }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <ClientOnly fallback={<SeoGameShell />}>
      <Suspense fallback={null}>
        <TabooGame />
      </Suspense>
    </ClientOnly>
  );
}

function SeoGameShell() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-dvh max-w-2xl flex-col px-6 pt-12 pb-8 lg:max-w-3xl lg:py-8"
    >
      <header className="mb-10 flex items-center justify-between lg:mb-8">
        <h1 className="text-base font-semibold tracking-tight">{siteMetadata.name}</h1>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-12">
        <section aria-label="Scoreboard">
          <ul className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6 sm:gap-x-14">
            {["Team 1", "Team 2"].map((team, index) => (
              <li key={team} className="text-center">
                <p className={index === 0 ? "section-label text-foreground" : "section-label"}>
                  {team}
                </p>
                <p className="mt-1 text-5xl font-bold tabular tracking-tight sm:text-6xl">0</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-8">
          <div className="w-full rounded-xl border border-border bg-muted/30 p-5">
            <h2 className="section-label mb-4">How to play</h2>
            <ol className="space-y-3.5">
              {gameRules.map((rule, index) => (
                <li key={rule.title} className="flex items-start gap-3">
                  <span
                    className="tabular mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-border bg-muted/40 text-muted-foreground text-xs font-medium"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div className="space-y-0.5 leading-snug">
                    <p className="text-sm font-medium text-foreground">{rule.title}</p>
                    <p className="text-sm text-muted-foreground">{rule.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex justify-center">
            <button className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-primary-foreground text-sm font-medium">
              Start round
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
