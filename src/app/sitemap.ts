import type { MetadataRoute } from "next";
import { blogs } from "./(marketing)/blogs/blog-data";
import { getAllDemoStories } from "@/data/demo-stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // One entry per pre-generated demo story. These are the long-tail landing
  // pages ("learn Spanish through football"), so they carry real priority.
  const demoStoryRoutes: MetadataRoute.Sitemap = getAllDemoStories().map(
    (story) => ({
      url: `${baseUrl}/learn/${story.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...blogRoutes, ...demoStoryRoutes];
}
