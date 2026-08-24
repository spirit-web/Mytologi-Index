import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Kronologisk (= kanonisk läsordning, se kommentar nedan) tidslinje över
// ALLA berättelser i alla korpusar/böcker, grupperat med böckerna som
// överskrifter. Syftet (enligt användaren): se i vilken ordning de olika
// bibelböckerna kommer, när/av vem de tros vara skrivna, och — genom att
// scanna avklarad/stjärnmärkt/Peterson-status radvis — om man "hoppat"
// mellan berättelser och lämnat luckor i sin egen läsning.
export default async function TidslinjePage() {
  const corpora = await prisma.corpus.findMany({
    orderBy: { name: "asc" },
    include: {
      books: {
        orderBy: { order: "asc" },
        include: {
          stories: {
            orderBy: { orderInBook: "asc" },
            include: { progress: true, petersonSegments: { select: { id: true } } },
          },
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-[var(--text-faint)] transition hover:text-[var(--text)]">
        ← Berättelseindex
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        Tidslinje
      </h1>
      <p className="mb-10 text-sm text-[var(--text-muted)]">
        Böckerna i kanonisk läsordning, berättelserna i den ordning de förekommer inom respektive
        bok. Detta är läsordning, inte ett påstående om exakt historisk skrivordning — se
        skrivtids-uppskattningen under varje bok.
      </p>

      {corpora.map((corpus) => (
        <section key={corpus.id} className="mb-12">
          <h2 className="mb-4 font-serif text-2xl font-semibold text-[var(--text)]">{corpus.name}</h2>
          <div className="space-y-8">
            {corpus.books.map((book) => {
              const completed = book.stories.filter((s) => s.progress?.completedAt).length;
              return (
                <div key={book.id}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
                    <Link
                      href={`/${corpus.slug}/${book.slug}`}
                      className="font-serif text-lg font-medium text-[var(--text)] hover:text-[var(--accent)]"
                    >
                      {book.name}
                    </Link>
                    <span className="text-xs tabular-nums text-[var(--text-faint)]">
                      {completed}/{book.stories.length} avklarade
                    </span>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-[var(--text-faint)]">
                    {book.writtenEstimate && <>Skriven: {book.writtenEstimate}</>}
                    {book.writtenEstimate && book.authorship && " · "}
                    {book.authorship}
                  </p>
                  <ol className="divide-y divide-[var(--border-soft)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
                    {book.stories.map((s) => {
                      const completedRow = !!s.progress?.completedAt;
                      const favorite = !!s.progress?.isFavorite;
                      const tier = s.petersonSegments.length > 0 || !!s.quote ? 1 : s.isWellKnown ? 2 : 3;
                      return (
                        <li key={s.id}>
                          <Link
                            href={`/${corpus.slug}/${book.slug}/${s.slug}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-[var(--accent-bg)]"
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                completedRow ? "border-[var(--success)] bg-[var(--success)]" : "border-[var(--text-faint)]"
                              }`}
                              aria-hidden
                            >
                              {completedRow && (
                                <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 text-white" fill="none">
                                  <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            {favorite && <span className="shrink-0 text-[var(--link)]" aria-hidden>★</span>}
                            {tier === 1 && (
                              <Image
                                src="/images/badges/jordan-peterson-badge.png"
                                alt=""
                                width={16}
                                height={16}
                                className="h-4 w-4 shrink-0 rounded-full"
                              />
                            )}
                            {tier === 2 && (
                              <span className="shrink-0 text-sm text-[var(--accent)]" aria-hidden>★</span>
                            )}
                            <span className="min-w-0 flex-1 truncate text-[var(--text)]">{s.title}</span>
                            <span className="shrink-0 text-xs text-[var(--text-faint)]">
                              {s.startRef}
                              {s.endRef !== s.startRef ? `–${s.endRef.replace(/^.*?(\d)/, "$1")}` : ""}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
