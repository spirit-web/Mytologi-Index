import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Historisk tvärverk-tidslinje (Fas 67, direkt användarönskemål): till
// skillnad från /tidslinje (läsordning INOM varje bok/korpus) visar den
// här sidan NÄR böckerna/verken tros ha uppkommit, över samma skala,
// oavsett tradition — så man kan se t.ex. att Gilgamesh-eposet är äldre
// än hela Bibeln, eller att Koranen och Talmud är ungefär samtida.
//
// approxYearStart/End är en sorterbar, medvetet FÖRENKLAD komplettering
// till varje boks fritext-writtenEstimate (se schema.prisma-kommentar) —
// bara böcker som har fått ett värde visas.
const CORPUS_COLORS: Record<string, string> = {
  bible: "#8a6d3b",
  "maps-of-meaning": "#4a6fa5",
  influences: "#7a5c8e",
  "other-scriptures": "#3f8f6d",
};

function formatYear(y: number) {
  return y < 0 ? `${Math.abs(y)} f.Kr.` : `${y} e.Kr.`;
}

export default async function HistoriskTidslinjePage() {
  const books = await prisma.book.findMany({
    where: { approxYearStart: { not: null } },
    include: {
      corpus: true,
      stories: {
        include: {
          petersonSegments: { select: { id: true } },
          referencesAsTarget: { select: { videoId: true, bookSourceRef: true } },
          characters: { include: { character: true } },
        },
      },
    },
    orderBy: { approxYearStart: "asc" },
  });

  const minYear = -2500;
  const maxYear = 2030;
  const span = maxYear - minYear;

  const rows = books.map((book) => {
    const start = book.approxYearStart!;
    const end = book.approxYearEnd ?? start;
    const hasPeterson = book.stories.some((s) => {
      const hasOwnQuote = !!s.quote && book.corpus.slug !== "influences";
      const hasRef = s.referencesAsTarget.some((r) => r.videoId || r.bookSourceRef);
      return s.petersonSegments.length > 0 || hasOwnQuote || hasRef;
    });
    // "Central karaktär" = förekommer i minst 2 av bokens berättelser,
    // eller om ingen gör det: den enda/de få som finns (grov men enkel
    // approximation — inget separat viktnings-fält i schemat).
    const charCounts = new Map<string, { name: string; slug: string; count: number }>();
    for (const s of book.stories) {
      for (const c of s.characters) {
        const cur = charCounts.get(c.character.slug) ?? { name: c.character.name, slug: c.character.slug, count: 0 };
        cur.count++;
        charCounts.set(c.character.slug, cur);
      }
    }
    const central = [...charCounts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const leftPct = ((start - minYear) / span) * 100;
    const widthPct = Math.max(((end - start) / span) * 100, 0.4);

    return { book, start, end, hasPeterson, central, leftPct, widthPct };
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
      >
        ← Berättelseindex
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        Historisk tidslinje
      </h1>
      <p className="mb-4 text-sm text-[var(--text-muted)]">
        Alla verk över samma tidsskala — {formatYear(minYear)} till idag — oavsett tradition. Detta
        är en förenklad, sorterbar uppskattning för placering på skalan; se varje boks egen sida för
        den fullständiga, mer nyanserade dateringsdiskussionen.
      </p>
      <div className="mb-8 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
        {Object.entries(CORPUS_COLORS).map(([slug, color]) => {
          const name = books.find((b) => b.corpus.slug === slug)?.corpus.name;
          if (!name) return null;
          return (
            <span key={slug} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden />
              {name}
            </span>
          );
        })}
        <span className="flex items-center gap-1.5">
          <span aria-hidden>👁</span> = Jordan har kommenterat något i boken
        </span>
      </div>

      <div className="space-y-2">
        {rows.map(({ book, start, end, hasPeterson, central, leftPct, widthPct }) => (
          <Link
            key={book.id}
            href={`/${book.corpus.slug}/${book.slug}`}
            className="group block rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 shadow-sm transition hover:border-[var(--accent-border)]"
          >
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <span className="font-serif text-sm font-medium text-[var(--text)] group-hover:text-[var(--accent)]">
                {hasPeterson && <span aria-hidden>👁 </span>}
                {book.name}
              </span>
              <span className="text-xs tabular-nums text-[var(--text-faint)]">
                {formatYear(start)}
                {end !== start ? `–${formatYear(end)}` : ""}
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--border-soft)]">
              <div
                className="absolute top-0 h-full rounded-full"
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  background: CORPUS_COLORS[book.corpus.slug] ?? "var(--accent)",
                }}
              />
            </div>
            {central.length > 0 && (
              <p className="mt-1.5 text-xs text-[var(--text-faint)]">
                Centrala karaktärer: {central.map((c) => c.name).join(", ")}
              </p>
            )}
          </Link>
        ))}
      </div>

      {books.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">Inga böcker har fått en historisk datering än.</p>
      )}
    </main>
  );
}
