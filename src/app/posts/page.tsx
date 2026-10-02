import type { Metadata } from "next";
import Link from "next/link";
import { POST_SAMPLE, POST_STRESS } from "@/lib/posts";
import PostsPreview from "@/components/posts/PostsPreview";
import { gujFontVars } from "../gujFonts";
import "../posts.css";

export const metadata: Metadata = {
  title: "Festival Posts for your Business — Shubh Cards",
  description: "Festival greeting posts with your business details, sized for Instagram, Facebook and WhatsApp Status.",
};

const FILLS = [
  { id: "", label: "Sample details" },
  { id: "long", label: "Very long text" },
  { id: "min", label: "Only name + phone" },
];

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ fill?: string }> }) {
  const { fill = "" } = await searchParams;
  const stress = POST_STRESS[fill];
  return (
    <main className={`ps-page ${gujFontVars}`}>
      <div className="ps-top">
        <Link href="/">← All designs</Link>
      </div>
      <header className="ps-head">
        <h1>Festival Posts for your Business</h1>
        <p>Festival greetings with your shop’s name, logo and numbers, ready for Instagram, Facebook and WhatsApp Status.</p>
        {process.env.NODE_ENV !== "production" && (
          <nav className="ps-tools" aria-label="Test data">
            {FILLS.map((f) => (
              <Link key={f.id} href={f.id ? `/posts?fill=${f.id}` : "/posts"} className={fill === f.id ? "on" : ""}>
                {f.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <PostsPreview brand={stress?.brand ?? POST_SAMPLE} text={stress?.text} />
    </main>
  );
}
