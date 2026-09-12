import StoryPreview from "@/app/(auth)/login/story-preview";
import {
  buildDemoSlug,
  getAvailableTargetLanguages,
  getAvailableTopics,
} from "@/data/demo-stories";

import DemoPicker, { type DemoPickerTopic } from "./demo-picker";

/**
 * Server-side adapter between the demo data layer and the client picker.
 *
 * Keeps `DemoPicker` free of data imports so the landing page ships only the
 * catalog (a few dozen tiny objects) to the browser rather than the full text of
 * every story.
 *
 * Falls back to the static story card when the pool is empty — that is the state
 * of the repo before `scripts/generate-demo-stories.ts` has been run, and the
 * landing page must not render a dead control in the meantime.
 */
export default function DemoPickerSection() {
  const languages = getAvailableTargetLanguages();

  if (languages.length === 0) return <StoryPreview />;

  const topicsByLanguage = Object.fromEntries(
    languages.map((language) => [
      language,
      getAvailableTopics(language).map<DemoPickerTopic>((topic) => ({
        id: topic.id,
        label: topic.label,
        icon: topic.icon,
        slug: buildDemoSlug(language, topic.id),
      })),
    ]),
  );

  return (
    <DemoPicker languages={languages} topicsByLanguage={topicsByLanguage} />
  );
}
