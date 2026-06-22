import StoryPreview from '@/app/(auth)/login/story-preview';
import GoogleSignInButton from '@/components/google-signin-button';
import { Sparkles, ShoppingBag, Check, ListChecks, Layers, Headphones } from 'lucide-react';

export default function HeroSection({
  fromCredits = false,
}: {
  fromCredits?: boolean;
}) {
  return (
    <section className="relative flex items-center overflow-hidden pt-6 pb-16 lg:pt-8 lg:pb-20">
      {/* Animated blob background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-accent/30 opacity-40 blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-forest-500/30 opacity-35 blur-[90px] animate-blob animation-delay-2000" />
        <div className="absolute top-[35%] right-[15%] w-[30%] h-[30%] rounded-full bg-marigold-500/30 opacity-30 blur-[80px] animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — copy */}
          <div className="max-w-xl">
            {fromCredits && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 shadow-sm">
                <ShoppingBag className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Sign in below to complete your purchase.
                </span>
              </div>
            )}

            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-card/70 backdrop-blur-sm px-4 py-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold tracking-wide uppercase text-accent">
                AI bilingual stories
              </span>
            </div> */}

            {/* Headline — gets room to breathe */}
            <h1 className="text-hero-sm text-foreground leading-tight">
              Learn a new language with bilingual stories about{' '}
              <span className="font-serif italic text-accent">
                anything you can think of.
              </span>
            </h1>

            {/* Sub — feature list, modern + bookish */}
            <ul className="mt-6 space-y-2.5 max-w-md">
              <li className="flex items-center gap-3 text-base text-foreground">
                <ListChecks className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                <span>Built-in quizzes</span>
              </li>
              <li className="flex items-center gap-3 text-base text-foreground">
                <Layers className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                <span>Flashcards</span>
              </li>
              <li className="flex items-center gap-3 text-base text-foreground">
                <Headphones className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                <span>Listening practice</span>
              </li>
              <li className="flex items-center gap-3 text-base text-foreground">
                <Sparkles className="w-4 h-4 text-accent shrink-0" strokeWidth={2} />
                <span>AI feedback</span>
              </li>
            </ul>

            {/* CTA + microtext — kept as a tight unit */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <GoogleSignInButton
                variant="learn"
                showTextOnXs
                className="group h-16 px-6 text-2xl md:text-xl font-semibold rounded-xl shadow-lg shadow-accent/40 bg-gradient-to-b from-accent to-brick-700 text-vellum-50 transition-all duration-200 hover:shadow-xl hover:shadow-accent/50 hover:-translate-y-0.5 hover:from-brick-700 hover:to-brick-700"
              >
                <span className="inline-flex items-center gap-2">
                  Start learning for free
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </GoogleSignInButton>

              <span className="inline-flex items-center gap-1.5 text-base font-medium text-forest-700">
                <Check className="w-4 h-4" strokeWidth={2.75} />
                No credit card is required
              </span>
            </div>
          </div>

          {/* Right — three-beat mantra + preview */}
          <div className="flex flex-col items-center lg:items-end gap-6">
            <div className="text-center lg:text-right space-y-1">
              <p className="text-foreground text-xl lg:text-2xl font-medium mb-1">
                Create stories on
              </p>
              <p className="font-serif italic text-accent text-3xl lg:text-4xl leading-tight">
                Any topic.
              </p>
              <p className="font-serif italic text-accent text-3xl lg:text-4xl leading-tight">
                Any grammar point.
              </p>
              <p className="font-serif italic text-accent text-3xl lg:text-4xl leading-tight">
                Any time.
              </p>
            </div>
            <StoryPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
