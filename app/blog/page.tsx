import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog – Student Tips & Study Guides | StudentHub",
  description: "Read expert study tips, GPA guides, attendance strategies, and exam preparation advice for students.",
};

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: string;
}

function getPostMetas(): PostMeta[] {
  const dir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || "",
        tags: data.tags || [],
        readTime: data.readTime || "5 min read",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function BlogPage() {
  const posts = getPostMetas();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-medium text-[var(--color-primary)] mb-4">
            📚 Student Blog
          </div>
          <h1 className="text-4xl font-bold mb-3">Study Tips & Guides</h1>
          <p className="text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Expert advice on improving attendance, calculating GPA, and acing your exams.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-[var(--color-muted-foreground)] py-20">No posts yet — check back soon!</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 hover:shadow-md hover:border-[var(--color-primary)]/40 transition-all"
              >
                <div className="flex gap-2 mb-3 flex-wrap">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2.5 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-bold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                  <span>📅 {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  <span>·</span>
                  <span>⏱️ {post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
