import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { AdBanner } from "@/components/ads/AdBanner";

interface Props {
  params: Promise<{ slug: string }>;
}

function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.frontmatter.title} | StudentHub Blog`,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { frontmatter, content } = post;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] mb-8 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <AdBanner position="top" className="mb-8" />

        <div className="flex gap-2 mb-4 flex-wrap">
          {(frontmatter.tags || []).map((tag: string) => (
            <span key={tag} className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2.5 py-1 rounded-full font-medium">{tag}</span>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-4 leading-tight">{frontmatter.title}</h1>
        <div className="flex items-center gap-3 text-sm text-[var(--color-muted-foreground)] mb-8">
          <span>{new Date(frontmatter.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span>{frontmatter.readTime}</span>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[var(--color-primary)] prose-code:text-[var(--color-primary)]">
          <MDXRemote source={content} />
        </div>

        <AdBanner position="bottom" className="mt-12" />

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/50 p-8 text-center">
          <h3 className="font-bold text-xl mb-2">Track your attendance & GPA for free</h3>
          <p className="text-[var(--color-muted-foreground)] text-sm mb-4">Join thousands of students using StudentHub to manage their academics.</p>
          <Link href="/register" className="inline-block rounded-xl gradient-hero px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
            Get started free →
          </Link>
        </div>
      </div>
    </div>
  );
}
