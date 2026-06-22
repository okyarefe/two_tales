'use server';

import { createHash } from 'crypto';
import { generateSpeech } from '@/services/openai/generateSpeech';
import { openAIConfig } from '@/services/openai/config';
import { createClient } from '@/lib/supabase/server';
import { getCachedAudioUrl, uploadAudio } from '@/lib/supabase/queries/audio';
import type { ActionResult } from '@/types';

interface TtsResult {
  url: string;
  cached: boolean;
}

export async function getOrCreateSpeech(
  text: string,
  voice?: string,
): Promise<ActionResult<TtsResult>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'You must be signed in to play audio' };
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return { success: false, error: 'Text is required' };
    }

    const useVoice = voice ?? openAIConfig.tts.voice;
    const model = openAIConfig.models.TTS_MODEL;

    const hash = createHash('sha256')
      .update(`${model}:${useVoice}:${trimmed}`)
      .digest('hex');

    const cachedUrl = await getCachedAudioUrl(user.id, hash);
    if (cachedUrl) {
      // console.log(
      //   `[TTS] Cache HIT — user=${user.id} hash=${hash} chars=${trimmed.length}`
      // );
      return { success: true, data: { url: cachedUrl, cached: true } };
    }

    // console.log(
    //   `[TTS] Cache MISS — user=${user.id} hash=${hash} chars=${trimmed.length}`
    // );

    const { buffer } = await generateSpeech({
      text: trimmed,
      voice: useVoice,
    });

    const url = await uploadAudio(user.id, hash, buffer);

    // console.log(
    //   `[TTS] Generated & cached — user=${user.id} hash=${hash} ~cost=$${estimatedCostUsd.toFixed(5)}`
    // );

    return { success: true, data: { url, cached: false } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate speech';
    console.error('[TTS] Error:', message);
    return { success: false, error: message };
  }
}
