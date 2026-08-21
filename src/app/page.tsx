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
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Berättelseindex
        </h1>
        <p className="mt-2 text-stone-500">
          Bibelns och andra centrala texters berättelser, med Jordan
          Petersons djupdykningar som guide där de finns.
        </p>
      </header>

      <div className="space-y-10">
        {corpora.map((corpus) => (
          <section key={corpus.id}>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-stone-400">
              {corpus.name}
            </h2>
            <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200">
              {corpus.books.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/${corpus.slug}/${book.slug}`}
                    className="flex items-center justify-between px-5 py-4 transition hover:bg-stone-50"
                  >
                    <span className="font-medium text-stone-800">{book.name}</span>
                    <span className="text-sm text-stone-400">
                      {book._count.stories} {book._count.stories === 1 ? "berättelse" : "berättelser"}
                    </span>
                  </Link>
                </li>
              ))}
              {corpus.books.length === 0 && (
                <li className="px-5 py-4 text-sm text-stone-400">
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
