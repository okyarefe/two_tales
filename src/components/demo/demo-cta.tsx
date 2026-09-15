import GoogleSignInButton from "@/components/google-signin-button";

/**
 * The conversion moment.
 *
 * Every demo story ends here. The visitor has just read a complete story for
 * free, so the ask is framed as the natural next step — the same thing, but
 * about their own subject — rather than as a gate they hit on arrival.
 *
 * `topicLabel` names what they just read so the contrast with "your own topic"
 * is concrete. Omit it on pages that aren't a single story.
 */
export default function DemoCta({ topicLabel }: { topicLabel?: string }) {
  return (
    <section className="rounded-3xl bg-lavender-100/60 px-6 py-8 text-center sm:px-10">
      <h2 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {topicLabel
          ? `That one was about ${topicLabel.toLowerCase()}.`
          : "These are just samples."}
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Your next one can be about anything you want — your job, your favourite
        show, the thing you actually think about all day. Pick the language and
        level, and it is written for you in seconds.
      </p>

      <div className="mt-6 flex justify-center">
        <GoogleSignInButton
          variant="learn"
          showTextOnXs
          className="h-14 rounded-2xl px-7 text-lg font-semibold bg-accent text-accent-foreground shadow-action transition-all duration-200 hover:bg-lavender-600 hover:shadow-action-hover hover:-translate-y-0.5"
        >
          Write my own story — free
        </GoogleSignInButton>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Free credits to start. No card needed.
      </p>
    </section>
  );
}
