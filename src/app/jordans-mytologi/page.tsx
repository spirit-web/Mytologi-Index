import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// "Jordans Mytologi" (Fas 67, direkt användarönskemål): en samlingssida
// över de tvärtext-kopplingar (Parallel-modellen, se schema.prisma) där
// Jordan Peterson kopplar ihop karaktärer/berättelser från OLIKA
// traditioner — antingen för att de liknar varandra, säger samma sak
// på olika sätt, eller bygger på varandra historiskt. Skiljer sig från
// den enskilda story-sidans "Samma karaktär i andra traditioner"-ruta
// (Fas 66, en enskild delad PERSON) genom att fokusera på delade TEMAN/
// MÖNSTER mellan olika berättelser, inte bara samma namngivna figur.
export default async function JordansmytologiPage() {
  const parallels = await prisma.parallel.findMany({
    include: {
      theme: true,
      stories: {
        include: {
          story: { include: { book: { include: { corpus: true } }, characters: { include: { character: true } } } },
        },
      },
    },
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
        Jordans Mytologi
      </h1>
      <p className="mb-10 text-sm text-[var(--text-muted)]">
        Berättelser och karaktärer från olika traditioner som Jordan Peterson kopplar ihop — för att
        de liknar varandra, säger samma sak på olika sätt, eller bygger på varandra. Se varje enskild
        berättelses egen sida för en markering när exakt samma NAMNGIVNA person förekommer i flera
        traditioner.
      </p>

      <div className="space-y-8">
        {parallels.map((p) => (
          <section
            key={p.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-sm"
          >
            <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-serif text-xl font-semibold text-[var(--text)]">{p.title}</h2>
              {p.theme && (
                <Link
                  href={`/teman/${p.theme.slug}`}
                  className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-2.5 py-0.5 text-xs text-[var(--accent)] transition hover:bg-[var(--accent-border)]"
                >
                  #{p.theme.name}
                </Link>
              )}
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[var(--text-muted)]">{p.description}</p>
            {p.quote && (
              <blockquote className="mb-4 flex items-start gap-2 border-l-2 border-[var(--accent-border)] pl-4 font-serif text-[1rem] italic leading-relaxed text-[var(--text)]">
                <Image
                  src="/images/badges/jordan-peterson-badge.png"
                  alt=""
                  width={20}
                  height={20}
                  className="mt-1 h-5 w-5 shrink-0 rounded-full"
                />
                "{p.quote}"
              </blockquote>
            )}
            <ul className="space-y-2.5">
              {p.stories.map((ps) => (
                <li key={ps.storyId} className="rounded-lg border border-[var(--border-soft)] px-4 py-3">
                  <Link
                    href={`/${ps.story.book.corpus.slug}/${ps.story.book.slug}/${ps.story.slug}`}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm font-medium text-[var(--text)] hover:text-[var(--accent)]"
                  >
                    <span>{ps.story.title}</span>
                    <span className="text-xs font-normal text-[var(--text-faint)]">
                      {ps.story.book.corpus.name} · {ps.story.book.name}
                    </span>
                  </Link>
                  {ps.note && (
                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{ps.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {parallels.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">Inga tvärtext-kopplingar inlagda än.</p>
      )}
    </main>
  );
}
