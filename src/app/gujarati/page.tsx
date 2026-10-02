import type { Metadata } from "next";
import Link from "next/link";
import { GUJ_STRESS } from "@/lib/gujarati";
import GujStudio from "@/components/gujarati/GujStudio";
import { gujFontVars } from "../gujFonts";
import "../gujarati.css";

export const metadata: Metadata = {
  title: "ગુજરાતી Visiting Cards — Shubh Cards",
  description: "Single-side Gujarati business cards, print-ready. Fill your details once and see them on every design.",
};

const FILLS = [
  { id: "", label: "Sample details" },
  { id: "long", label: "Very long text" },
  { id: "min", label: "Only name + phone" },
  { id: "team", label: "3 people, 4 numbers" },
];

export default async function GujaratiPage({ searchParams }: { searchParams: Promise<{ fill?: string }> }) {
  const { fill = "" } = await searchParams;
  const stress = GUJ_STRESS[fill];
  return (
    <main className={`gj-page ${gujFontVars}`}>
      <div className="gj-top">
        <Link href="/">← All designs</Link>
      </div>
      <header className="gj-head">
        <h1>ગુજરાતી વિઝિટિંગ કાર્ડ</h1>
        <p>
          Single-side visiting cards in Gujarati and mixed Gujarati–English, print-ready at 3.5 × 2 in. Fill in your details, tick “Apply to all” and see your
          card in every design.
        </p>
        {/* stress-test data for development only */}
        {process.env.NODE_ENV !== "production" && (
          <nav className="gj-tools" aria-label="Test data">
            {FILLS.map((f) => (
              <Link key={f.id} href={f.id ? `/gujarati?fill=${f.id}` : "/gujarati"} className={fill === f.id ? "on" : ""}>
                {f.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <GujStudio key={fill} preset={stress} />
    </main>
  );
}
