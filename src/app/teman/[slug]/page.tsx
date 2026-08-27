import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const theme = await prisma.theme.findUnique({
    where: { slug },
    include: {
      stories: {
        include: { story: { include: { book: { include: { corpus: true } } } } },
      },
      parallels: true,
    },
  });

  if (!theme) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/teman"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
      >
        ← Teman
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        {theme.name}
      </h1>
      <p className="mb-10 text-sm text-[var(--text-muted)]">
        {theme.stories.length} {theme.stories.length === 1 ? "berättelse" : "berättelser"}
        {theme.parallels.length > 0 &&
          ` · ${theme.parallels.length} tvärtext-jämförelse${theme.parallels.length === 1 ? "" : "r"}`}
      </p>

      <ul className="divide-y divide-[var(--border-soft)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
        {theme.stories.map((s) => (
          <li key={s.storyId}>
            <Link
              href={`/${s.story.book.corpus.slug}/${s.story.book.slug}/${s.story.slug}`}
              className="flex items-center justify-between px-5 py-4 transition hover:bg-[var(--accent-bg)]"
            >
              <span className="font-medium text-[var(--text)]">{s.story.title}</span>
              <span className="text-xs text-[var(--text-faint)]">{s.story.book.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
