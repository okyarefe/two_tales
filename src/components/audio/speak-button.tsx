"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrCreateSpeech } from "@/actions/tts";

interface SpeakButtonProps {
  text: string;
  voice?: string;
  className?: string;
}

type Status = "idle" | "loading" | "playing" | "paused" | "ended";

export function SpeakButton({ text, voice, className }: SpeakButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cachedUrlRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  function attachListeners(audio: HTMLAudioElement) {
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("ended", () => {
      setStatus("ended");
      setCurrentTime(audio.duration);
    });
    audio.addEventListener("error", () => {
      setError("Failed to play audio");
      setStatus("idle");
    });
  }

  async function ensureAudio(): Promise<HTMLAudioElement | null> {
    if (audioRef.current && cachedUrlRef.current) return audioRef.current;

    setStatus("loading");
    const result = await getOrCreateSpeech(text, voice);

    if (!isMountedRef.current) return null;

    if (!result.success) {
      setError(result.error);
      setStatus("idle");
      return null;
    }

    const audio = new Audio(result.data.url);
    attachListeners(audio);
    audioRef.current = audio;
    cachedUrlRef.current = result.data.url;
    return audio;
  }

  async function handlePlayPause() {
    setError(null);

    if (status === "playing") {
      audioRef.current?.pause();
      setStatus("paused");
      return;
    }

    const audio = await ensureAudio();
    if (!audio || !isMountedRef.current) {
      audio?.pause();
      return;
    }

    if (status === "ended") audio.currentTime = 0;
    await audio.play();
    if (!isMountedRef.current) {
      audio.pause();
      return;
    }
    setStatus("playing");
  }

  async function handleRestart() {
    setError(null);
    const audio = await ensureAudio();
    if (!audio || !isMountedRef.current) {
      audio?.pause();
      return;
    }
    audio.currentTime = 0;
    await audio.play();
    if (!isMountedRef.current) {
      audio.pause();
      return;
    }
    setStatus("playing");
  }

  const showPause = status === "playing";
  const isLoading = status === "loading";
  const restartDisabled = !cachedUrlRef.current || isLoading;

  return (
    <div
      className={`flex items-center gap-2 ${className ?? ""}`}
      title={error ?? undefined}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handlePlayPause}
        disabled={isLoading}
        aria-label={showPause ? "Pause" : "Play"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : showPause ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleRestart}
        disabled={restartDisabled}
        aria-label="Restart"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      <span className="text-xs tabular-nums text-muted-foreground min-w-[72px]">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
