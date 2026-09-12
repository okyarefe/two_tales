import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BilingualStory from "@/components/demo/bilingual-story";
import DemoCta from "@/components/demo/demo-cta";
import { getAllDemoStories, getDemoStoryBySlug } from "@/data/demo-stories";
import type { DemoStory } from "@/data/demo-stories/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-render every demo story at build time.
 *
 * The pool is static, so these pages cost nothing to serve and are in the HTML
 * a crawler receives — which is the entire reason they exist as routes rather
 * than as state inside the landing page.
 */
export async function generateStaticParams() {
  return getAllDemoStories().map((story) => ({ slug: story.slug }));
}

export const dynamicParams = false;

function buildDescription(story: DemoStory): string {
  return `A free ${story.level} bilingual story about ${story.topicLabel.toLowerCase()}, written in ${story.baseLanguage} and ${story.targetLanguage} side by side. Read it without signing up.`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getDemoStoryBySlug(slug);

  if (!story) return { title: "Story not found" };

  const title = `Learn ${story.targetLanguage} through ${story.topicLabel.toLowerCase()} — a free bilingual story`;
  const description = buildDescription(story);
  const url = `/learn/${story.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function DemoStoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = getDemoStoryBySlug(slug);

  if (!story) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/learn"
        className="mb-6 inline-flex items-center text-sm font-semibold text-accent transition-colors hover:text-brick-700"
      >
        ← All sample stories
      </Link>

      <BilingualStory story={story} />

      <div className="mt-10">
        <DemoCta topicLabel={story.topicLabel} />
      </div>
    </div>
  );
}
