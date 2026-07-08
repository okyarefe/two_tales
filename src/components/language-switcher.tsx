'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages } from '@/constants';
import { setUserLanguage } from '@/actions/user-data';
import { languageFromLocale, LANGUAGE_ENDONYMS } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Nav');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentLanguage = languageFromLocale(locale);

  function handleSelect(language: string) {
    if (language === currentLanguage || isPending) return;
    startTransition(async () => {
      const result = await setUserLanguage(language);
      if (result.success) {
        // Re-render server components in the newly selected locale.
        router.refresh();
      }
    });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        disabled={isPending}
        aria-label={t('changeLanguage')}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-ink-700 hover:bg-secondary hover:text-accent transition-colors disabled:opacity-50"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {LANGUAGE_ENDONYMS[currentLanguage] ?? currentLanguage}
        </span>
        <ChevronDown className="w-3 h-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language}
            onSelect={() => handleSelect(language)}
            className={language === currentLanguage ? 'font-semibold text-accent' : ''}
          >
            {LANGUAGE_ENDONYMS[language] ?? language}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
