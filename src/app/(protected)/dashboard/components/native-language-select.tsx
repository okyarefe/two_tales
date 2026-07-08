'use client';

import { useState, useTransition } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { languages } from '@/constants';
import { updateNativeLanguage } from '@/actions/user-data';
import { useUser } from '@/contexts/user-context';

interface NativeLanguageSelectProps {
  initialLanguage: string;
}

export function NativeLanguageSelect({
  initialLanguage,
}: NativeLanguageSelectProps) {
  const [current, setCurrent] = useState(initialLanguage);
  const [isPending, startTransition] = useTransition();
  const { refreshUserData } = useUser();

  function handleSelect(lang: string) {
    if (lang === current || isPending) return;

    startTransition(async () => {
      const result = await updateNativeLanguage(lang);
      if (result.success) {
        setCurrent(lang);
        toast.success(
          `Language updated — new stories will pair ${lang} with the language you're learning`,
        );
        await refreshUserData();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 justify-center sm:justify-start">
      <Languages className="size-3" />
      <span>I speak</span>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          disabled={isPending}
          className="inline-flex items-center gap-0.5 font-medium text-slate-600 hover:text-accent transition-colors disabled:opacity-50"
        >
          {current}
          <ChevronDown className="size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>I speak…</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languages.map((lang) => (
            <DropdownMenuItem key={lang} onSelect={() => handleSelect(lang)}>
              {lang}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
