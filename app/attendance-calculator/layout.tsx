import { generateSEO, generateCalculatorJsonLD } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Free Attendance Calculator",
  description: "Calculate your attendance percentage instantly. Find out how many classes you can miss or need to attend to reach 75% attendance.",
  path: "/attendance-calculator",
  keywords: ["attendance calculator", "attendance percentage", "class attendance", "75% attendance"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = generateCalculatorJsonLD(
    "Attendance Calculator",
    "Calculate college attendance percentage and find how many classes to attend",
    "https://studenthub.app/attendance-calculator"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
