import { createClient } from "@/lib/supabase/server";
import { openAIConfig } from "@/services/openai/config";

const BUCKET = openAIConfig.tts.bucket;
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

export async function getCachedAudioUrl(
  userId: string,
  hash: string
): Promise<string | null> {
  const supabase = await createClient();
  const filename = `${hash}.mp3`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(userId, { search: filename, limit: 1 });

  if (error) {
    throw new Error(`Failed to check audio cache: ${error.message}`);
  }

  const exists = data?.some((file) => file.name === filename);
  if (!exists) return null;

  return getSignedUrl(`${userId}/${filename}`);
}

export async function uploadAudio(
  userId: string,
  hash: string,
  buffer: Buffer
): Promise<string> {
  const supabase = await createClient();
  const path = `${userId}/${hash}.mp3`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: "audio/mpeg",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload audio: ${error.message}`);
  }

  return getSignedUrl(path);
}

async function getSignedUrl(path: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data) {
    throw new Error(
      `Failed to create signed URL: ${error?.message ?? "unknown"}`
    );
  }
  return data.signedUrl;
}
