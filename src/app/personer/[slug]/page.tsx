import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const character = await prisma.character.findUnique({
    where: { slug },
    include: {
      appearances: {
        include: { story: { include: { book: { include: { corpus: true } } } } },
      },
      references: {
        include: {
          story: { include: { book: { include: { corpus: true } } } },
          video: { include: { series: true } },
        },
      },
    },
  });

  if (!character) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/personer"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
      >
        ← Personer
      </Link>
      <div className="mt-2 mb-8 flex items-center gap-4">
        {character.portraitPath && (
          <Image
            src={character.portraitPath}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-full border border-[var(--border)] object-cover"
          />
        )}
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
          {character.name}
        </h1>
      </div>

      {character.appearances.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--text-faint)]">
            Förekommer i {character.appearances.length}{" "}
            {character.appearances.length === 1 ? "berättelse" : "berättelser"}
          </h2>
          <ul className="divide-y divide-[var(--border-soft)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-sm">
            {character.appearances.map((a) => (
              <li key={a.storyId}>
                <Link
                  href={`/${a.story.book.corpus.slug}/${a.story.book.slug}/${a.story.slug}`}
                  className="flex items-center justify-between px-5 py-3.5 transition hover:bg-[var(--accent-bg)]"
                >
                  <span className="font-medium text-[var(--text)]">{a.story.title}</span>
                  <span className="text-xs text-[var(--text-faint)]">{a.story.book.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {character.references.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--accent)]">
            Peterson refererar till {character.name} ({character.references.length})
          </h2>
          <ul className="space-y-3">
            {character.references.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-bg)] p-4 text-sm"
              >
                <p className="mb-1 font-medium text-[var(--text)]">
                  {r.story ? (
                    <Link
                      href={`/${r.story.book.corpus.slug}/${r.story.book.slug}/${r.story.slug}`}
                      className="underline decoration-[var(--accent-border)] underline-offset-2"
                    >
                      {r.story.title}
                    </Link>
                  ) : (
                    // Fristående referens (t.ex. ett podcastavsnitt) utan
                    // koppling till en specifik story eller bokreferens —
                    // videolänken nedan räcker själv som källangivelse.
                    r.bookSourceRef
                  )}
                  {r.video && (
                    <>
                      {r.story || r.bookSourceRef ? " · " : ""}
                      <a
                        href={`https://youtube.com/watch?v=${r.video.youtubeId}${r.atSec ? `&t=${r.atSec}s` : ""}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--accent)] underline decoration-[var(--accent-border)] underline-offset-2"
                      >
                        {r.video.title}
                      </a>
                    </>
                  )}
                </p>
                {r.work && (
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                    Verk: {r.work}
                  </p>
                )}
                <p className="text-[var(--text-muted)]">{r.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {character.appearances.length === 0 && character.references.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">Inget kopplat till {character.name} ännu.</p>
      )}
    </main>
  );
}
