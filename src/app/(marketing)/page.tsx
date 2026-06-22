import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserData } from "@/actions/user-data";
import HeroSection from "@/app/(auth)/login/hero-section";
import FeaturesSection from "@/app/(auth)/login/features-section";
import Footer from "@/app/(auth)/login/footer";

export const metadata: Metadata = {
  title: "TwoTales — Learn Languages with AI Bilingual Stories",
  description:
    "Create AI-generated bilingual stories on any topic, at your level, with built-in quizzes, flashcards, and listening practice. Start learning for free.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TwoTales — Learn Languages with AI Bilingual Stories",
    description:
      "AI bilingual stories on any topic, with built-in quizzes, flashcards, and listening practice.",
    url: "/",
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const userId = data.user?.id;
  const userFromSupabase = userId ? await getUserData(userId) : null;

  if (userFromSupabase) {
    redirect("/dashboard");
  }

  const { next } = await searchParams;
  const fromCredits = next === "/credits";

  return (
    <div className="min-h-full bg-background overflow-x-hidden">
      <HeroSection fromCredits={fromCredits} />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
