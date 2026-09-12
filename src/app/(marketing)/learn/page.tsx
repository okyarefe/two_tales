import type { Metadata } from "next";
import Link from "next/link";

import DemoCta from "@/components/demo/demo-cta";
import {
  getAvailableTargetLanguages,
  getAvailableTopics,
  buildDemoSlug,
} from "@/data/demo-stories";

export const metadata: Metadata = {
  title: "Free bilingual sample stories",
  description:
    "Read complete bilingual stories in Spanish, French, German and Turkish — side by side with English, at B1 level. No account needed.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Free bilingual sample stories | TwoTales",
    description:
      "Complete bilingual stories in Spanish, French, German and Turkish. No account needed.",
    url: "/learn",
  },
};

/**
 * Index of the demo pool, grouped by language.
 *
 * Static by construction — everything here comes from bundled data, so this is
 * pre-rendered and fully present for crawlers. It is also the internal-linking
 * hub that lets search engines reach every story page from one place.
 */
export default function LearnIndexPage() {
  const languages = getAvailableTargetLanguages();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          Sample stories, free to read
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Every story below is written twice — once in English, once in the
          language you are learning — lined up sentence by sentence. No account,
          no card. Read one and see whether this is how you want to learn.
        </p>
      </header>

      {languages.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sample stories are on their way.
        </p>
      ) : (
        <div className="space-y-10">
          {languages.map((language) => {
            const topics = getAvailableTopics(language);

            return (
              <section key={language}>
                <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
                  English → {language}
                </h2>

                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {topics.map((topic) => (
                    <li key={topic.id}>
                      <Link
                        href={`/learn/${buildDemoSlug(language, topic.id)}`}
                        className="flex h-full items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
                      >
                        <span className="text-xl" aria-hidden>
                          {topic.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {topic.title}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {topic.label}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-14">
        <DemoCta />
      </div>
    </div>
  );
}
