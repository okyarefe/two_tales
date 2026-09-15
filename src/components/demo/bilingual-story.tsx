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
    <article className="rounded-3xl bg-card shadow-lg">
      <header className="border-b border-border px-6 py-5 sm:px-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge>
            {story.level}
          </Badge>
          <Badge variant="secondary">{story.topicLabel}</Badge>
          <span className="text-xs text-muted-foreground">
            {story.baseLanguage} → {story.targetLanguage}
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
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
        <span className="text-xs font-semibold uppercase tracking-wide text-blush-700">
          {story.targetLanguage}
        </span>
      </div>

      <div className="divide-y divide-border/60">
        {story.sentences.map((pair, index) => (
          <div
            key={index}
            className="grid gap-0 border-b border-border/60 last:border-b-0 sm:px-0 md:grid-cols-2"
          >
            {/* Each language gets its own wash so both texts can stay in
                ink — coloured body text was failing contrast. */}
            <p className="tt-lang-a px-6 py-4 text-[15px] leading-relaxed text-foreground sm:px-8">
              {pair.base}
            </p>
            <p className="tt-lang-b px-6 py-4 text-[15px] leading-relaxed text-foreground sm:px-8">
              {pair.target}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
