import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function BookPage({
  params,
}: {
  params: Promise<{ corpus: string; book: string }>;
}) {
  const { corpus: corpusSlug, book: bookSlug } = await params;

  const book = await prisma.book.findFirst({
    where: { slug: bookSlug, corpus: { slug: corpusSlug } },
    include: {
      corpus: true,
      stories: {
        orderBy: { orderInBook: "asc" },
        include: {
          characters: { include: { character: true } },
          themes: { include: { theme: true } },
        },
      },
    },
  });

  if (!book) notFound();

  // Gruppera: standalone-berättelser vs. cykler (seriesSlug).
  const standalone = book.stories.filter((s) => !s.seriesSlug);
  const seriesMap = new Map<string, typeof book.stories>();
  for (const s of book.stories) {
    if (!s.seriesSlug) continue;
    const list = seriesMap.get(s.seriesSlug) ?? [];
    list.push(s);
    seriesMap.set(s.seriesSlug, list);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-stone-400 hover:text-stone-600">
        ← {book.corpus.name}
      </Link>
      <h1 className="mt-2 mb-1 text-3xl font-semibold tracking-tight text-stone-900">
        {book.name}
      </h1>
      <p className="mb-10 text-sm text-stone-500">
        {standalone.length} enskilda berättelser · {seriesMap.size} berättelsecykler
        ({[...seriesMap.values()].reduce((n, l) => n + l.length, 0)} avsnitt)
      </p>

      {seriesMap.size > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-stone-400">
            Berättelsecykler
          </h2>
          <div className="space-y-4">
            {[...seriesMap.entries()].map(([slug, list]) => (
              <div key={slug} className="rounded-lg border border-stone-200 p-4">
                <h3 className="mb-2 font-medium text-stone-800">
                  {list[0].seriesTitle ?? slug}
                </h3>
                <ol className="space-y-1">
                  {list
                    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
                    .map((s) => (
                      <li key={s.id}>
                        <StoryRow book={book} story={s} />
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      )}

      {standalone.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-stone-400">
            Enskilda berättelser
          </h2>
          <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200">
            {standalone.map((s) => (
              <li key={s.id}>
                <StoryRow book={book} story={s} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function StoryRow({
  book,
  story,
}: {
  book: { slug: string; corpus: { slug: string } };
  story: {
    id: string;
    slug: string;
    title: string;
    startRef: string;
    endRef: string;
    characters: { character: { name: string } }[];
    themes: { theme: { name: string } }[];
  };
}) {
  return (
    <Link
      href={`/${book.corpus.slug}/${book.slug}/${story.slug}`}
      className="flex flex-col gap-1 px-5 py-4 transition hover:bg-stone-50"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-stone-800">{story.title}</span>
        <span className="text-xs text-stone-400">
          {story.startRef}
          {story.endRef !== story.startRef ? `–${story.endRef.replace(/^.*?(\d)/, "$1")}` : ""}
        </span>
      </div>
      {(story.characters.length > 0 || story.themes.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {story.characters.map((c) => (
            <span
              key={c.character.name}
              className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
            >
              {c.character.name}
            </span>
          ))}
          {story.themes.map((t) => (
            <span
              key={t.theme.name}
              className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700"
            >
              {t.theme.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
