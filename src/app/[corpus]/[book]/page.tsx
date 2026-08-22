import Image from "next/image";
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
          images: { where: { order: 1 }, take: 1 },
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
      <Link
        href="/"
        className="text-sm text-[var(--text-faint)] transition hover:text-[var(--text)]"
      >
        ← {book.corpus.name}
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        {book.name}
      </h1>
      <p className="mb-10 text-sm text-[var(--text-muted)]">
        {standalone.length} enskilda berättelser · {seriesMap.size} berättelsecykler
        ({[...seriesMap.values()].reduce((n, l) => n + l.length, 0)} avsnitt)
      </p>

      {seriesMap.size > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Berättelsecykler
          </h2>
          <div className="space-y-4">
            {[...seriesMap.entries()].map(([slug, list]) => (
              <div
                key={slug}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 shadow-sm"
              >
                <h3 className="mb-2 font-serif text-lg font-medium text-[var(--text)]">
                  {list[0].seriesTitle ?? slug}
                </h3>
                <ol className="divide-y divide-[var(--border-soft)]">
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
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Enskilda berättelser
          </h2>
          <ul className="divide-y divide-[var(--border-soft)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
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
    images: { path: string }[];
  };
}) {
  return (
    <Link
      href={`/${book.corpus.slug}/${book.slug}/${story.slug}`}
      className="flex items-center gap-3 px-5 py-4 transition hover:bg-[var(--accent-bg)]"
    >
      {story.images[0] && (
        <Image
          src={story.images[0].path}
          alt=""
          width={56}
          height={42}
          className="h-[42px] w-14 shrink-0 rounded-md border border-[var(--border)] object-cover"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-[var(--text)]">{story.title}</span>
          <span className="shrink-0 text-xs text-[var(--text-faint)]">
            {story.startRef}
            {story.endRef !== story.startRef ? `–${story.endRef.replace(/^.*?(\d)/, "$1")}` : ""}
          </span>
        </div>
        {(story.characters.length > 0 || story.themes.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {story.characters.map((c) => (
              <span
                key={c.character.name}
                className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
              >
                {c.character.name}
              </span>
            ))}
            {story.themes.map((t) => (
              <span
                key={t.theme.name}
                className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-2 py-0.5 text-xs text-[var(--accent)]"
              >
                {t.theme.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
