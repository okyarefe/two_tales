-- Base-language support: stories are no longer always English-based.
-- users.native_language: the language the user already speaks (story base).
-- stories.base_language: the language the story's "english_version" column
-- is actually written in. Defaults keep all existing rows/users on English.

ALTER TABLE "public"."users"
  ADD COLUMN IF NOT EXISTS "native_language" text NOT NULL DEFAULT 'English';

ALTER TABLE "public"."stories"
  ADD COLUMN IF NOT EXISTS "base_language" text NOT NULL DEFAULT 'English';

COMMENT ON COLUMN "public"."stories"."base_language" IS 'Language of english_version (historical column name); the language the user already speaks.';
