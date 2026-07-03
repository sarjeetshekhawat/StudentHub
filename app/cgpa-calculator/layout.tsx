import { generateSEO, generateCalculatorJsonLD } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Free CGPA Calculator",
  description: "Calculate your CGPA (Cumulative Grade Point Average) across all semesters. Enter semester GPAs and credit hours for instant results.",
  path: "/cgpa-calculator",
  keywords: ["CGPA calculator", "cumulative GPA", "semester GPA", "college CGPA"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = generateCalculatorJsonLD(
    "CGPA Calculator",
    "Free online CGPA calculator — compute cumulative GPA across all semesters",
    "https://studenthub.app/cgpa-calculator"
  );
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
