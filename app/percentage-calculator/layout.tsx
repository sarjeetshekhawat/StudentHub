import { generateSEO, generateCalculatorJsonLD } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Free Percentage Calculator",
  description: "Calculate your exam percentage and grade instantly. Enter marks obtained and total marks to see your percentage with a grading scale reference.",
  path: "/percentage-calculator",
  keywords: ["percentage calculator", "marks to percentage", "exam percentage", "grade calculator"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = generateCalculatorJsonLD(
    "Percentage Calculator",
    "Free online percentage calculator — convert marks to percentage and find your grade",
    "https://studenthub.app/percentage-calculator"
  );
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
