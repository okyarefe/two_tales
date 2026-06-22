import { CheckCircle2, Sparkles } from "lucide-react";

export default function StoryPreview() {
  return (
    <div className="relative w-full max-w-md lg:max-w-lg animate-float">
      {/* Glow behind the card */}
      <div className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-3xl bg-gradient-to-br from-accent/25 to-forest-500/25 blur-2xl" />

      {/* Card frame */}
      <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-md p-5 shadow-xl shadow-ink-700/10">
        {/* Top meta row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-accent/10 text-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              B1
            </span>
            <span className="inline-flex items-center rounded-full bg-forest-100 text-forest-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              Past tense
            </span>
            <span className="text-[10px] text-muted-foreground">
              · 2 min read
            </span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-accent" />
        </div>

        {/* Title row */}
        <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-border">
          <h3 className="font-serif text-base font-semibold text-foreground leading-tight">
            The Fox and the Frozen Lake
          </h3>
          <h3 className="font-serif text-base font-semibold text-accent leading-tight">
            El zorro y el lago helado
          </h3>
        </div>

        {/* Bilingual body */}
        <div className="grid grid-cols-2 gap-3 text-[13px] leading-relaxed">
          <div className="space-y-2 text-foreground/85">
            <p>
              At dusk, the fox <em className="not-italic font-semibold text-accent">crossed</em> the frozen lake.
            </p>
            <p>
              He <em className="not-italic font-semibold text-accent">heard</em> the ice crack beneath his paws.
            </p>
            <p>
              He <em className="not-italic font-semibold text-accent">stopped</em>, took a breath, and kept going.
            </p>
          </div>
          <div className="space-y-2 text-foreground/85">
            <p>
              Al atardecer, el zorro <em className="not-italic font-semibold text-accent">cruzó</em> el lago helado.
            </p>
            <p>
              <em className="not-italic font-semibold text-accent">Oyó</em> el hielo crujir bajo sus patas.
            </p>
            <p>
              Se <em className="not-italic font-semibold text-accent">detuvo</em>, respiró y continuó.
            </p>
          </div>
        </div>

        {/* Footer pill row */}
        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-forest-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Quiz ready · 5 questions
          </span>
          <span className="text-muted-foreground">Generated in 6s</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4 tracking-wide">
        Every story is generated for you — pick the topic, level, and grammar.
      </p>
    </div>
  );
}
