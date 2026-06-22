import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { blogs } from "./blog-data";
import { fetchPexelsImage } from "@/lib/pexels";

export const metadata: Metadata = {
  title: "Blog | TwoTales",
  description:
    "Read our latest articles on language learning, AI, and personal growth.",
  openGraph: {
    title: "Blog | TwoTales",
    description:
      "Read our latest articles on language learning, AI, and personal growth.",
    type: "website",
  },
};

export default async function BlogsPage() {
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const blogsWithImages = await Promise.all(
    sortedBlogs.map(async (blog) => ({
      ...blog,
      image: await fetchPexelsImage(blog.imageQuery),
    })),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-600">
            Insights on language learning, AI-powered storytelling, and making
            education accessible.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="space-y-8">
          {blogsWithImages.map((blog, index) => (
            <article
              key={blog.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <Link href={`/blogs/${blog.slug}`} className="block">
                <div className="relative w-full aspect-[16/9] bg-gray-100">
                  <Image
                    src={blog.image.src}
                    fill
                    alt={blog.image.alt}
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </Link>

              <div className="p-6 sm:p-8">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                    {blog.category}
                  </span>
                </div>

                {/* Title */}
                <Link href={`/blogs/${blog.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-600 text-base mb-4">{blog.excerpt}</p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>{blog.author}</span>
                  <span>•</span>
                  <time dateTime={blog.date}>
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>•</span>
                  <span>{blog.readTime} min read</span>
                </div>

                {/* Read More Link */}
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-block mt-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                >
                  Read More →
                </Link>

                {/* Pexels attribution */}
                {blog.image.photographer && (
                  <p className="mt-4 text-xs text-gray-400">
                    Photo by{" "}
                    <a
                      href={blog.image.photographerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {blog.image.photographer}
                    </a>{" "}
                    on{" "}
                    <a
                      href="https://www.pexels.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Pexels
                    </a>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {blogsWithImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
