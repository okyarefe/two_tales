import { openAiClient } from './client';
import { openAIConfig } from './config';

interface GenerateSpeechProps {
  text: string;
  voice?: string;
}

interface GenerateSpeechResult {
  buffer: Buffer;
  chars: number;
  estimatedTokens: number;
  estimatedCostUsd: number;
}

export async function generateSpeech({
  text,
  voice = openAIConfig.tts.voice,
}: GenerateSpeechProps): Promise<GenerateSpeechResult> {
  const chars = text.length;
  const estimatedTokens = Math.ceil(chars / 4);
  const estimatedCostUsd =
    (estimatedTokens / 1_000_000) * openAIConfig.tts.pricePerMillionInputTokens;

  // console.log(
  //   `[TTS] Calling OpenAI — model=${openAIConfig.models.TTS_MODEL} voice=${voice} chars=${chars} ~tokens=${estimatedTokens} ~cost=$${estimatedCostUsd.toFixed(5)}`,
  // );

  try {
    const response = await openAiClient.audio.speech.create({
      model: openAIConfig.models.TTS_MODEL,
      voice,
      input: text,
      // response_format: openAIConfig.tts.format,
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return { buffer, chars, estimatedTokens, estimatedCostUsd };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Speech generation failed: ${error.message}`);
    }
    throw new Error('Speech generation failed with unknown error');
  }
}
