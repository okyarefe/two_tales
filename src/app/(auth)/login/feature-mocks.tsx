import { Check, Sparkles, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   1. Story Creator — large hero block
   Mock of the actual create-a-story form
   ───────────────────────────────────────────────────────── */
export function StoryCreatorMock() {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const grammar = ["Past tense", "Conditional", "Subjunctive", "Future"];

  return (
    <div className="relative w-full">
      {/* Form card */}
      <div className="rounded-2xl border border-border bg-white shadow-sm p-5 space-y-5">
        {/* Topic input */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Topic
          </label>
          <div className="mt-1.5 flex items-center justify-between rounded-xl border border-border bg-vellum-50 px-3.5 py-2.5">
            <span className="text-[14px] text-foreground/90">Hiking the Andes</span>
            <span className="h-4 w-px bg-accent animate-pulse" aria-hidden />
          </div>
        </div>

        {/* Level pills */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Level
          </label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {levels.map((l) => {
              const active = l === "B1";
              return (
                <span
                  key={l}
                  className={
                    active
                      ? "inline-flex items-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/30 px-3 py-1 text-[12px] font-semibold"
                      : "inline-flex items-center rounded-full bg-secondary text-muted-foreground px-3 py-1 text-[12px] font-medium"
                  }
                >
                  {l}
                </span>
              );
            })}
          </div>
        </div>

        {/* Grammar pills */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Grammar focus
          </label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {grammar.map((g) => {
              const active = g === "Past tense";
              return (
                <span
                  key={g}
                  className={
                    active
                      ? "inline-flex items-center rounded-full bg-forest-100 text-forest-700 ring-1 ring-forest-500/40 px-3 py-1 text-[12px] font-semibold"
                      : "inline-flex items-center rounded-full bg-secondary text-muted-foreground px-3 py-1 text-[12px] font-medium"
                  }
                >
                  {g}
                </span>
              );
            })}
          </div>
        </div>

        {/* Generate button */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-accent to-brick-700 text-vellum-50 px-4 py-3 text-[14px] font-semibold shadow-md shadow-accent/30 cursor-default"
        >
          <Sparkles className="w-4 h-4" />
          Generate story
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   2. Side-by-Side Reading — top right small
   ───────────────────────────────────────────────────────── */
export function ReadingMock() {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm p-4">
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="inline-flex items-center rounded-full bg-forest-100 text-forest-700 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide">
          EN
        </span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="inline-flex items-center rounded-full bg-accent/10 text-accent px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide">
          ES
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 text-[12px] leading-relaxed">
        <div className="space-y-1.5 text-foreground/85">
          <p>
            The fox <span className="bg-forest-100 text-forest-700 rounded px-1 font-medium">crossed</span> the lake.
          </p>
          <p>The ice was thin.</p>
        </div>
        <div className="space-y-1.5 text-foreground/85">
          <p>
            El zorro <span className="bg-forest-100 text-forest-700 rounded px-1 font-medium">cruzó</span> el lago.
          </p>
          <p>El hielo era fino.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   3. Quiz — bottom right small
   ───────────────────────────────────────────────────────── */
export function QuizMock() {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm p-4">
      <p className="text-[12px] text-foreground/85 mb-3 leading-snug">
        Why did the fox stop on the ice?
      </p>
      <div className="space-y-1.5">
        {[
          { t: "He was tired", state: "idle" as const },
          { t: "He heard it crack", state: "correct" as const },
          { t: "He saw a frog", state: "idle" as const },
        ].map((o) => (
          <div
            key={o.t}
            className={
              o.state === "correct"
                ? "flex items-center justify-between rounded-lg bg-forest-100 ring-1 ring-forest-500/40 px-3 py-1.5 text-[12px] font-semibold text-forest-700"
                : "flex items-center justify-between rounded-lg bg-secondary px-3 py-1.5 text-[12px] text-foreground/70"
            }
          >
            <span>{o.t}</span>
            {o.state === "correct" && (
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   4. Flashcards — bottom left medium
   Stacked card peek effect
   ───────────────────────────────────────────────────────── */
export function FlashcardMock() {
  return (
    <div className="relative w-full max-w-xs mx-auto h-[180px]">
      {/* Back card */}
      <div className="absolute inset-0 translate-x-4 translate-y-3 rotate-[4deg] rounded-2xl border border-border bg-accent/5 shadow-sm" />
      {/* Middle card */}
      <div className="absolute inset-0 translate-x-2 translate-y-1.5 rotate-[2deg] rounded-2xl border border-border bg-accent/5 shadow-sm" />
      {/* Front card */}
      <div className="absolute inset-0 rounded-2xl border border-border bg-white shadow-md p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
            Verb · Past
          </span>
          <span className="text-[10px] text-muted-foreground">3 / 12</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="font-serif text-2xl font-semibold text-foreground">
            cruzó
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            tap to reveal
          </p>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>← again</span>
          <span>got it →</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   5. AI Feedback — bottom right medium
   Inline annotated correction
   ───────────────────────────────────────────────────────── */
export function FeedbackMock() {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center rounded-full bg-vellum-100 text-ink-700 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide">
          Your translation
        </span>
      </div>

      <div className="font-serif text-[15px] leading-relaxed text-foreground/85">
        Yo{" "}
        <span className="relative inline-block">
          <span className="line-through text-destructive decoration-destructive decoration-2">
            soy ido
          </span>
        </span>{" "}
        al mercado ayer.
      </div>

      <div className="rounded-xl bg-forest-100/60 border border-forest-500/30 p-3 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Check className="w-3 h-3 text-forest-700" strokeWidth={3} />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-forest-700">
            Suggestion
          </span>
        </div>
        <p className="font-serif text-[14px] text-foreground/90">
          Yo <span className="font-semibold text-forest-700">fui</span> al mercado ayer.
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Use preterite for completed past actions — &quot;ir&quot; is irregular.
        </p>
      </div>
    </div>
  );
}
