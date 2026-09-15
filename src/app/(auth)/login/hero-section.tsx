import DemoPickerSection from '@/components/demo/demo-picker-section';
import GoogleSignInButton from '@/components/google-signin-button';
import {
  Sparkles,
  ShoppingBag,
  Check,
  ListChecks,
  Layers,
  Headphones,
} from 'lucide-react';

const features = [
  { icon: ListChecks, label: 'Built-in quizzes', tint: 'bg-lavender-100 text-lavender-700' },
  { icon: Layers, label: 'Flashcards', tint: 'bg-blush-100 text-blush-700' },
  { icon: Headphones, label: 'Listening practice', tint: 'bg-mint-100 text-mint-700' },
  { icon: Sparkles, label: 'AI feedback', tint: 'bg-sand-100 text-sand-700' },
];

export default function HeroSection({
  fromCredits = false,
}: {
  fromCredits?: boolean;
}) {
  return (
    <section className="relative flex items-center overflow-hidden pt-6 pb-16 lg:pt-8 lg:pb-20">
      {/* Soft pastel washes. Flat, low-opacity circles — no hard edges,
          and they drift rather than pulse. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute top-[-18%] right-[-8%] w-[42%] h-[42%] rounded-full bg-sand-500/40 animate-drift" />
        <div className="absolute top-[32%] right-[14%] w-[24%] h-[24%] rounded-full bg-blush-500/25 animate-drift animation-delay-2000" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[34%] h-[34%] rounded-full bg-mint-500/20 animate-drift animation-delay-4000" />
      </div>

      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — copy */}
          <div className="max-w-xl">
            {fromCredits && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-lavender-100 px-4 py-2.5">
                <ShoppingBag className="w-4 h-4 text-lavender-700 shrink-0" />
                <span className="text-sm font-semibold text-lavender-700">
                  Sign in below to complete your purchase.
                </span>
              </div>
            )}

            <h1 className="text-hero-sm text-foreground">
              Learn a new language with bilingual stories about{' '}
              <span className="text-accent">anything you can think of.</span>
            </h1>

            <ul className="mt-8 space-y-3.5 max-w-md">
              {features.map(({ icon: Icon, label, tint }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-base font-medium text-foreground"
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${tint}`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2.2} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            {/* CTA + microtext — kept as a tight unit */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <GoogleSignInButton
                variant="learn"
                showTextOnXs
                className="group h-16 px-8 text-xl font-semibold rounded-2xl bg-accent text-accent-foreground shadow-action transition-all duration-200 hover:bg-lavender-600 hover:shadow-action-hover hover:-translate-y-0.5"
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

              <span className="inline-flex items-center gap-2 text-base font-medium text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-mint-500/45">
                  <Check className="w-3 h-3 text-mint-700" strokeWidth={3.2} />
                </span>
                No credit card is required
              </span>
            </div>
          </div>

          {/* Right — three-beat mantra + preview */}
          <div className="flex flex-col items-center lg:items-end gap-6">
            <div className="text-center lg:text-right space-y-1">
              <p className="text-muted-foreground text-xl lg:text-2xl font-medium mb-1">
                Create stories on
              </p>
              <p className="font-display text-foreground text-3xl lg:text-4xl font-semibold leading-tight tracking-tight">
                Any topic.
              </p>
              <p className="font-display text-accent text-3xl lg:text-4xl font-semibold leading-tight tracking-tight">
                Any grammar point.
              </p>
              <p className="font-display text-foreground text-3xl lg:text-4xl font-semibold leading-tight tracking-tight">
                Any time.
              </p>
            </div>
            <DemoPickerSection />
          </div>
        </div>
      </div>
    </section>
  );
}
