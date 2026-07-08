'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';
// react hooks
import FormButton from '../common/form-button';
import { Button } from '../ui/button';
import { useState } from 'react';
import { languages, languageLevels, grammarTopics } from '@/constants';
import { language } from '@/types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useUser } from '@/contexts/user-context';
import StoryGenerationOverlay, {
  GenerationStatus,
} from './story-generation-overlay';

export default function TopicCreateForm() {
  const t = useTranslations('CreateStory');
  const { userData } = useUser();
  const baseLanguage = userData?.nativeLanguage ?? 'English';
  const targetLanguages = languages.filter((lang) => lang !== baseLanguage);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<language>();
  const [selectedLanguageLevel, setSelectedLanguageLevel] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const router = useRouter();
  const [formState, setFormState] = useState<{
    errors: Record<string, string[]>;
    success?: boolean;
  }>({ errors: {} });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== 'idle') return;

    const formData = new FormData(event.currentTarget);

    try {
      setStatus('generating');
      const res = await fetch('/api/stories', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setFormState(data);

      if (data.success === true) {
        setStatus('success');
        // Let the success state of the overlay play before navigating
        await new Promise((resolve) => setTimeout(resolve, 1200));
        resetFormInputs();
        setPopoverOpen(false);
        setStatus('idle');
        router.push('/stories');
      } else {
        setStatus('idle');
        if (data.errors && data.errors._form) {
          toast.error(data.errors._form.join(', '), {
            position: 'top-center',
            style: {
              backgroundColor: 'white',
              color: 'red',
              borderColor: 'red',
            },
          });
        }
      }
    } catch (err) {
      setStatus('idle');
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message, {
        position: 'top-center',
        style: { backgroundColor: 'white', color: 'red', borderColor: 'red' },
      });
    }
  }

  function resetFormInputs() {
    setTitle('');
    setPrompt('');
    setSelectedLanguage(undefined);
    setSelectedLanguageLevel('');
    setSelectedTopic('');
  }

  const isGenerating = status !== 'idle';

  return (
    <>
      <StoryGenerationOverlay status={status} />
      <Popover
      open={popoverOpen}
      onOpenChange={(open) => {
        // Keep the popover open while a story is being generated
        if (!open && isGenerating) return;
        setPopoverOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="accent">
          {' '}
          <Plus className="w-4 h-4 mr-2" />
          {t('trigger')}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4 p-4">
            <h3>{t('heading')}</h3>
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger
                    className={`w-full p-2 border rounded-md text-left ${
                      formState.errors.language
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedLanguage || t('languagePlaceholder')}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    collisionPadding={8}
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    <DropdownMenuLabel>{t('languagesLabel')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {targetLanguages.map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onSelect={() => setSelectedLanguage(lang)}
                      >
                        {lang}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {selectedLanguage && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t('pairHint', {
                      base: baseLanguage,
                      target: selectedLanguage,
                    })}
                  </p>
                )}
                {!isGenerating && formState.errors.language && (
                  <p className="mt-1 text-sm text-red-600">
                    {formState.errors.language.join(', ')}
                  </p>
                )}
                <input
                  type="hidden"
                  name="language"
                  value={selectedLanguage || ''}
                />
              </div>
              <div className="w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger
                    className={`w-full p-2 border rounded-md text-left ${
                      formState.errors.languageLevel
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedLanguageLevel || t('levelPlaceholder')}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    collisionPadding={8}
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    <DropdownMenuLabel>{t('levelsLabel')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {languageLevels.map((langLevel) => (
                      <DropdownMenuItem
                        key={langLevel}
                        onSelect={() => setSelectedLanguageLevel(langLevel)}
                      >
                        <span className="font-semibold">{langLevel}</span>
                        <span className="text-xs">
                          {t(`level${langLevel.replace('/', '')}`)}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {!isGenerating && formState.errors.languageLevel && (
                  <p className="mt-1 text-sm text-red-600">
                    {formState.errors.languageLevel.join(', ')}
                  </p>
                )}
                <input
                  type="hidden"
                  name="languageLevel"
                  value={selectedLanguageLevel || ''}
                />
              </div>
              <div className="w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger
                    className={`w-full p-2 border rounded-md text-left ${
                      formState.errors.topic
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedTopic || t('topicPlaceholder')}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    collisionPadding={8}
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    <DropdownMenuLabel>{t('topicsLabel')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {grammarTopics.map((topic) => (
                      <DropdownMenuItem
                        key={topic}
                        onSelect={() => setSelectedTopic(topic)}
                      >
                        {topic}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {!isGenerating && formState.errors.topic && (
                  <p className="mt-1 text-sm text-red-600">
                    {formState.errors.topic.join(', ')}
                  </p>
                )}
                <input type="hidden" name="topic" value={selectedTopic || ''} />
              </div>
            </div>

            <Input
              name="title"
              placeholder={t('titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Input>
            {!isGenerating && formState.errors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600">
                {formState.errors.title.join(', ')}
              </p>
            )}
            <Textarea
              name="prompt"
              placeholder={t('promptPlaceholder')}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></Textarea>
            {!isGenerating && formState.errors.prompt && (
              <p id="description-error" className="mt-1 text-sm text-red-600">
                {formState.errors.prompt.join(', ')}
              </p>
            )}
            {!isGenerating && formState.errors._form ? (
              <div className="p-2 bg-red-200 border border-red-400 rounded text-center">
                {formState.errors._form.join(', ')}
              </div>
            ) : null}
            <FormButton isLoading={isGenerating} loadingText={t('generating')}>
              {t('submit')}
            </FormButton>
          </div>
        </form>
      </PopoverContent>
      </Popover>
    </>
  );
}
