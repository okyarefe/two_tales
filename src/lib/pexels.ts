import "server-only";
import { cache } from "react";

export interface PexelsImage {
  src: string;
  width: number;
  height: number;
  photographer: string;
  photographerUrl: string;
  alt: string;
}

const FALLBACK: PexelsImage = {
  src: "/story-picture.png",
  width: 1200,
  height: 800,
  photographer: "",
  photographerUrl: "",
  alt: "",
};

export const fetchPexelsImage = cache(
  async (query: string): Promise<PexelsImage> => {
    const apiKey = process.env.PEXELS_APIKEY;
    if (!apiKey) {
      console.warn("[pexels] PEXELS_APIKEY not set — using fallback image");
      return { ...FALLBACK, alt: query };
    }

    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query,
      )}&per_page=1&orientation=landscape`;

      const response = await fetch(url, {
        headers: { Authorization: apiKey },
        next: { revalidate: 60 * 60 * 24 * 30 }, // 30-day cache
      });

      if (!response.ok) {
        throw new Error(`Pexels API ${response.status}`);
      }

      const data = await response.json();
      const photo = data.photos?.[0];
      if (!photo) {
        return { ...FALLBACK, alt: query };
      }

      return {
        src: photo.src.large,
        width: photo.width,
        height: photo.height,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        alt: photo.alt || query,
      };
    } catch (error) {
      console.error("[pexels] fetch failed:", error);
      return { ...FALLBACK, alt: query };
    }
  },
);
