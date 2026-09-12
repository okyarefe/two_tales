import { Badge } from "@/components/ui/badge";
import type { DemoStory } from "@/data/demo-stories/types";

/**
 * Renders a demo story as aligned sentence pairs.
 *
 * Presentational and server-rendered — the whole point of the demo pool is that
 * a logged-out visitor gets real text in the initial HTML, which is also what
 * makes these pages indexable.
 *
 * Layout: two columns on desktop, stacked pairs on mobile. Pairing happens per
 * sentence rather than per column so the two languages stay lined up no matter
 * how much longer one sentence renders than its counterpart.
 */
export default function BilingualStory({ story }: { story: DemoStory }) {
  return (
    <article className="rounded-2xl border border-border bg-card/90 shadow-xl shadow-ink-700/10">
      <header className="border-b border-border px-6 py-5 sm:px-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge className="bg-accent/10 text-accent hover:bg-accent/10">
            {story.level}
          </Badge>
          <Badge variant="secondary">{story.topicLabel}</Badge>
          <span className="text-xs text-muted-foreground">
            {story.baseLanguage} → {story.targetLanguage}
          </span>
        </div>

        <h1 className="font-serif text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          {story.title}
        </h1>
      </header>

      {/* Column labels — desktop only; on mobile each sentence is already
          visually grouped with its translation. */}
      <div
        className="hidden grid-cols-2 gap-6 border-b border-border px-6 py-3 sm:px-8 md:grid"
        aria-hidden
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {story.baseLanguage}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          {story.targetLanguage}
        </span>
      </div>

      <div className="divide-y divide-border/60">
        {story.sentences.map((pair, index) => (
          <div
            key={index}
            className="grid gap-2 px-6 py-4 transition-colors hover:bg-accent/5 sm:px-8 md:grid-cols-2 md:gap-6"
          >
            <p className="text-[15px] leading-relaxed text-foreground/85">
              {pair.base}
            </p>
            <p className="font-serif text-[15px] leading-relaxed text-accent">
              {pair.target}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
