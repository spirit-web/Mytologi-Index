import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const corpora = await prisma.corpus.findMany({
    include: {
      books: {
        orderBy: { order: "asc" },
        include: { _count: { select: { stories: true } } },
      },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
          Berättelseindex
        </h1>
        <p className="mt-3 max-w-xl text-[var(--text-muted)]">
          Bibelns och andra centrala texters berättelser, med Jordan
          Petersons djupdykningar som guide där de finns.
        </p>
      </header>

      <div className="space-y-10">
        {corpora.map((corpus) => (
          <section key={corpus.id}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
                {corpus.name}
              </h2>
              <span className="text-xs uppercase tracking-wide text-[var(--text-faint)]">
                {corpus.kind === "framework" ? "Ramverk" : "Källtext"}
              </span>
            </div>
            <ul className="divide-y divide-[var(--border-soft)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
              {corpus.books.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/${corpus.slug}/${book.slug}`}
                    className="flex items-center justify-between px-5 py-4 transition hover:bg-[var(--accent-bg)]"
                  >
                    <span className="font-medium text-[var(--text)]">{book.name}</span>
                    <span className="text-sm text-[var(--text-faint)]">
                      {book._count.stories} {book._count.stories === 1 ? "berättelse" : "berättelser"}
                    </span>
                  </Link>
                </li>
              ))}
              {corpus.books.length === 0 && (
                <li className="px-5 py-4 text-sm text-[var(--text-faint)]">
                  Inga böcker inlagda ännu.
                </li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
