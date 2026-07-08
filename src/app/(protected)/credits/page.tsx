import React, { Suspense } from 'react';
import { CalendarX, Infinity as InfinityIcon, ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getPlans } from '@/actions/lemon';
import { PricingCards } from './components/pricing-cards';
import { PricingCardsSkeleton } from './components/pricing-cards-skeleton';

export const metadata = {
  title: 'Credits & Pricing - TwoTales',
  description: 'Purchase credits or upgrade your plan to unlock more features.',
};

// ISR: Revalidate once per day (86400 seconds)
export const revalidate = 86400;

export default async function GetCreditsPage() {
  // Use cached plans from database for instant loading
  const plansPromise = getPlans();
  const t = await getTranslations('Credits');

  const guarantees = [
    {
      icon: CalendarX,
      title: t('guarantee1Title'),
      description: t('guarantee1Body'),
    },
    {
      icon: InfinityIcon,
      title: t('guarantee2Title'),
      description: t('guarantee2Body'),
    },
    {
      icon: ShieldCheck,
      title: t('guarantee3Title'),
      description: t('guarantee3Body'),
    },
  ];

  return (
    <div className="py-12" style={{ scrollbarGutter: 'stable' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-14 max-w-3xl mx-auto text-center">
          <span className="tt-eyebrow">{t('eyebrow')}</span>
          <h1 className="text-display mt-4 text-foreground">
            {t('headingMain')}{' '}
            <span className="font-serif italic text-accent">
              {t('headingAccent')}
            </span>
          </h1>
          <p className="text-subtitle mt-5 max-w-xl mx-auto">{t('subtitle')}</p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            {guarantees.map((g) => (
              <div
                key={g.title}
                className="rounded-xl border border-border bg-card p-4 flex items-start gap-3"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <g.icon className="w-4 h-4 text-accent" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {g.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {g.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-8 grid-cols-1 md:grid-cols-3 items-stretch">
          <Suspense fallback={<PricingCardsSkeleton />}>
            <PricingCards plansPromise={plansPromise} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
