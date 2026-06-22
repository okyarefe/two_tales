import {
  Target,
  MessageSquare,
  BookOpen,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    color: "text-accent",
    bg: "bg-accent/10",
    ring: "group-hover:ring-accent/30",
    title: "Side-by-Side Story Creation",
    description:
      "Pick a topic, level (A1–C2), and grammar point. We generate a bilingual story you can read side by side — glance across whenever a sentence trips you up.",
  },
  {
    icon: Target,
    color: "text-marigold-600",
    bg: "bg-marigold-100",
    ring: "group-hover:ring-marigold-500/40",
    title: "Auto-Generated Quizzes",
    description:
      "Every story comes with a comprehension quiz tailored to its content, so you can prove you actually got it.",
  },
  {
    icon: Layers,
    color: "text-accent",
    bg: "bg-accent/10",
    ring: "group-hover:ring-accent/30",
    title: "Flashcards for Practice",
    description:
      "Lock in vocabulary and grammar with flashcards generated from the words and phrases in your stories.",
  },
  {
    icon: MessageSquare,
    color: "text-forest-600",
    bg: "bg-forest-100",
    ring: "group-hover:ring-forest-500/40",
    title: "AI Writing Feedback",
    description:
      "Translate a story into your target language and get instant AI feedback on grammar, word choice, and tone.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative px-6 py-24">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-vellum-100 to-transparent" />

      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-display text-foreground mb-4">
            Everything you need to{" "}
            <span className="font-serif italic text-accent">
              learn faster
            </span>
          </h2>
          <p className="text-subtitle">
            Stories, practice, and feedback — the full loop in one place.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div
                className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${f.bg} ring-1 ring-transparent ${f.ring} transition-all duration-300`}
              >
                <f.icon className={`h-7 w-7 ${f.color}`} />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2.5">
                {f.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
