import type { Metadata } from "next";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import styles from "./layout.module.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TwoTales",
    template: "%s | TwoTales",
  },
  description:
    "TwoTales helps you learn languages with AI-generated, interactive stories and quizzes.",
  applicationName: "TwoTales",
  keywords: [
    "language learning",
    "AI",
    "stories",
    "quizzes",
    "vocabulary",
    "grammar",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "TwoTales",
    title: "TwoTales — AI Language Learning",
    description:
      "Learn languages with interactive AI stories, personalized practice, and quizzes.",
  },
  twitter: {
    card: "summary",
    title: "TwoTales — AI Language Learning",
    description:
      "Learn languages with interactive AI stories, personalized practice, and quizzes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TwoTales",
              url: siteUrl,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "TwoTales",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/stories?query={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${sourceSerif.variable} ${inter.variable} ${jetbrainsMono.variable} font-serif tt-paper`}
      >
        <div className={`h-full flex flex-col ${styles.landscapeRow}`}>
          {children}
        </div>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
