import { generateSEO, generateCalculatorJsonLD } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Free GPA Calculator",
  description: "Calculate your GPA online for free. Add subjects, credits, and grades to compute your Grade Point Average on a 4.0 scale instantly.",
  path: "/gpa-calculator",
  keywords: ["GPA calculator", "grade point average", "college GPA", "semester GPA"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = generateCalculatorJsonLD(
    "GPA Calculator",
    "Free online GPA calculator with unlimited subjects and 4.0 scale support",
    "https://studenthub.app/gpa-calculator"
  );
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
