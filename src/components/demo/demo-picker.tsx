"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import GoogleSignInButton from "@/components/google-signin-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * A topic the visitor can read immediately, already generated.
 * Kept deliberately flat so the server can pass it across the client boundary.
 */
export interface DemoPickerTopic {
  id: string;
  label: string;
  icon: string;
  slug: string;
}

export interface DemoPickerProps {
  languages: string[];
  /** Language -> topics that actually have a generated story. */
  topicsByLanguage: Record<string, DemoPickerTopic[]>;
  /** Language selected on first paint. Falls back to the first available. */
  defaultLanguage?: string;
}

/**
 * The "try it before signing up" control on the landing page.
 *
 * Mirrors the real generator's shape — pick a language, pick a subject — but
 * resolves to a story from the pre-generated pool, so a logged-out visitor
 * reads real output without an account and without costing an API call.
 *
 * Typing a custom topic is the intended upgrade path: the pool cannot answer it,
 * and that is exactly the moment the product's actual promise ("anything you can
 * think of") becomes worth signing in for.
 */
export default function DemoPicker({
  languages,
  topicsByLanguage,
  defaultLanguage,
}: DemoPickerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [language, setLanguage] = useState(
    defaultLanguage ?? languages[0] ?? "",
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState("");

  const topics = useMemo(
    () => topicsByLanguage[language] ?? [],
    [topicsByLanguage, language],
  );

  const hasCustomTopic = customTopic.trim().length > 0;
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);

  // Switching language invalidates the current pick — the same topic may not
  // exist in the new language, and a stale selection would route to a 404.
  function handleLanguageChange(next: string) {
    setLanguage(next);
    setSelectedTopicId(null);
  }

  function handleTopicSelect(topicId: string) {
    setSelectedTopicId(topicId);
    setCustomTopic("");
  }

  function handleRead() {
    if (!selectedTopic) return;
    startTransition(() => router.push(`/learn/${selectedTopic.slug}`));
  }

  if (languages.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-xl shadow-ink-700/10 backdrop-blur-md sm:p-6">
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
          Read a real one first
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          No account, no card. Pick a language and something you like.
        </p>
      </div>

      {/* Language */}
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        I&apos;m learning
      </label>
      <select
        value={language}
        onChange={(event) => handleLanguageChange(event.target.value)}
        className="mb-5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      {/* Topics */}
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        About
      </span>
      <div className="mb-5 flex flex-wrap gap-2">
        {topics.map((topic) => {
          const isSelected = topic.id === selectedTopicId;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleTopicSelect(topic.id)}
              aria-pressed={isSelected}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all ${
                isSelected
                  ? "border-accent bg-accent text-vellum-50 shadow-sm"
                  : "border-border bg-background text-foreground hover:border-accent/60 hover:bg-accent/5"
              }`}
            >
              <span aria-hidden>{topic.icon}</span>
              {topic.label}
            </button>
          );
        })}
      </div>

      {/* Custom topic — the upgrade path */}
      <label
        htmlFor="demo-custom-topic"
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        Or something of your own
      </label>
      <Input
        id="demo-custom-topic"
        value={customTopic}
        onChange={(event) => {
          setCustomTopic(event.target.value);
          if (event.target.value) setSelectedTopicId(null);
        }}
        placeholder="sushi restaurants in Tokyo, Formula 1, my job interview…"
        className="mb-5"
      />

      {/* Action — swaps to sign-in once they ask for something the pool can't serve */}
      {hasCustomTopic ? (
        <div className="space-y-2">
          <GoogleSignInButton
            variant="learn"
            showTextOnXs
            className="h-12 w-full rounded-xl text-base font-semibold bg-accent text-accent-foreground shadow-action transition-all duration-200 hover:bg-lavender-600 hover:shadow-action-hover"
          >
            Write this one for me — free
          </GoogleSignInButton>
          <p className="text-center text-xs text-muted-foreground">
            Nobody has written “{customTopic.trim()}” yet. Sign in and it is
            yours in seconds.
          </p>
        </div>
      ) : (
        <Button
          type="button"
          onClick={handleRead}
          disabled={!selectedTopic || isPending}
          className="h-12 w-full rounded-xl text-base font-semibold bg-accent text-accent-foreground shadow-action transition-all duration-200 hover:bg-lavender-600 hover:shadow-action-hover disabled:opacity-50 disabled:shadow-none"
        >
          {isPending
            ? "Opening…"
            : selectedTopic
              ? `Read the ${selectedTopic.label.toLowerCase()} story →`
              : "Pick something above"}
        </Button>
      )}
    </div>
  );
}
