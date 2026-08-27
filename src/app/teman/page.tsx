import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TemanPage() {
  const themes = await prisma.theme.findMany({
    include: { _count: { select: { stories: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
      >
        ← Berättelseindex
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        Teman
      </h1>
      <p className="mb-10 max-w-xl text-sm text-[var(--text-muted)]">
        Återkommande teman — både bibliska (t.ex. uppoffring) och sådana
        Peterson ofta återvänder till (t.ex. kaos & ordning) — tvärs över
        alla böcker.
      </p>

      <ul className="divide-y divide-[var(--border-soft)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
        {themes.map((t) => (
          <li key={t.id}>
            <Link
              href={`/teman/${t.slug}`}
              className="flex items-center justify-between px-5 py-4 transition hover:bg-[var(--accent-bg)]"
            >
              <span className="font-medium text-[var(--text)]">{t.name}</span>
              <span className="text-sm text-[var(--text-faint)]">
                {t._count.stories} {t._count.stories === 1 ? "berättelse" : "berättelser"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
