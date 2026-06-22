import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogs, getBlogBySlug } from "../blog-data";
import { fetchPexelsImage } from "@/lib/pexels";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found | TwoTales",
    };
  }

  return {
    title: `${blog.title} | TwoTales`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
    },
  };
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const image = await fetchPexelsImage(blog.imageQuery);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          href="/blogs"
          className="inline-flex items-center text-accent hover:text-brick-700 font-semibold mb-8 transition-colors"
        >
          ← Back to Blog
        </Link>

        {/* Article Container */}
        <article className="bg-card rounded-xl shadow-2xl overflow-hidden border-t-4 border-t-accent">
          {/* Hero Image */}
          <div className="relative w-full aspect-[16/9] bg-gray-100">
            <Image
              src={image.src}
              fill
              alt={image.alt}
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          <div className="bg-gradient-to-r from-accent/5 to-transparent p-6 sm:p-12 border-b border-border">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 text-sm font-bold text-vellum-50 bg-gradient-to-r from-accent to-brick-700 rounded-full shadow-md">
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="font-semibold text-gray-700">
                  {blog.author}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <time dateTime={blog.date} className="text-gray-600">
                  {new Date(blog.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-gray-600">{blog.readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-12">
            {/* Content */}
            <div className="max-w-none text-gray-700 leading-relaxed">
              {blog.content.split("\n").map((paragraph, index) => {
                // Handle headings
                if (paragraph.startsWith("## ")) {
                  return (
                    <div key={index} className="mt-10 mb-6">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 relative">
                        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-accent/60 rounded-full"></span>
                        <span className="pl-5">
                          {paragraph.replace("## ", "")}
                        </span>
                      </h2>
                    </div>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3
                      key={index}
                      className="text-lg font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                // Skip empty paragraphs
                if (!paragraph.trim()) {
                  return <div key={index} className="h-4" />;
                }
                // Check if paragraph looks like a key insight
                const isKeyInsight =
                  paragraph.includes("?") &&
                  (paragraph.length < 150 || paragraph.split(" ").length < 25);

                // Regular paragraphs
                return (
                  <p
                    key={index}
                    className={`mb-5 leading-8 ${
                      isKeyInsight
                        ? "border-l-3 border-l-accent/60 pl-4 text-gray-700 italic"
                        : "text-gray-700"
                    }`}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Pexels attribution */}
            {image.photographer && (
              <p className="mt-12 text-xs text-gray-400 border-t border-border pt-4">
                Hero photo by{" "}
                <a
                  href={image.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {image.photographer}
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
                .
              </p>
            )}
          </div>
        </article>

        {/* Related Posts or CTA */}
        <div className="mt-16 bg-gradient-to-r from-accent to-brick-700 rounded-xl p-10 text-center shadow-xl text-vellum-50">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to transform your language learning?
            </h3>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Stop waiting until you&apos;re fluent. Start reading about what
              you love today with TwoTales AI.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-vellum-50 text-accent font-bold rounded-lg hover:bg-vellum-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
