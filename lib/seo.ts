import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://studenthub.app";

export function generateSEO({
  title,
  description,
  path,
  keywords = [],
  ogImage = "/og-default.png",
}: SEOProps): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | StudentHub`;

  return {
    title: fullTitle,
    description,
    keywords: ["student", "calculator", "study", ...keywords],
    authors: [{ name: "StudentHub" }],
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "StudentHub",
      images: [{ url: `${BASE_URL}${ogImage}`, width: 1200, height: 630, alt: title }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${BASE_URL}${ogImage}`],
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export function generateCalculatorJsonLD(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "EducationalApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
  };
}
