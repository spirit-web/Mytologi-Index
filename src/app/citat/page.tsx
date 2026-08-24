import Image from "next/image";
import Link from "next/link";
import { getFavoriteQuotes } from "@/lib/quotes";
import { QuoteRankControls } from "@/components/QuoteRankControls";

// "Jordan-sidan" — alla citat/förklaringstexter användaren stjärnmärkt,
// i EN gemensam rangordnad lista tvärs över hela appen (Bibeln, Maps of
// Meaning, 12 Rules for Life, ...). Se src/lib/quotes.ts.
export default async function CitatPage() {
  const quotes = await getFavoriteQuotes();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-[var(--text-faint)] transition hover:text-[var(--text)]">
        ← Berättelseindex
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        Dina sparade citat
      </h1>
      <p className="mb-10 text-sm text-[var(--text-muted)]">
        {quotes.length} citat sparade — flytta upp/ner för att rangordna, skriv en egen kommentar
        under respektive citat.
      </p>

      {quotes.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          Inga citat sparade ännu — klicka på "☆ Spara citat" under ett Peterson-citat på valfri
          berättelsesida för att lägga till det här.
        </p>
      ) : (
        <ol className="space-y-5">
          {quotes.map((q, i) => (
            <li
              key={`${q.kind}-${q.id}`}
              className="flex gap-4 rounded-xl border border-[var(--link-border)] bg-[var(--link-bg)] p-5 shadow-sm"
            >
              <span className="mt-1 shrink-0 font-serif text-lg text-[var(--text-faint)] tabular-nums">
                {i + 1}
              </span>
              {q.thumbnailPath && (
                <Link href={`/${q.corpusSlug}/${q.bookSlug}/${q.storySlug}`} className="shrink-0">
                  <Image
                    src={q.thumbnailPath}
                    alt=""
                    width={72}
                    height={54}
                    className="h-[54px] w-[72px] rounded-md border border-[var(--border)] object-cover"
                  />
                </Link>
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <Link
                    href={`/${q.corpusSlug}/${q.bookSlug}/${q.storySlug}`}
                    className="font-medium text-[var(--text)] underline decoration-[var(--link-border)] underline-offset-2 hover:text-[var(--link)]"
                  >
                    {q.storyTitle}
                  </Link>
                  <span className="text-xs text-[var(--text-faint)]">
                    {q.bookName} · {q.reference}
                  </span>
                </div>
                <blockquote className="mb-2 font-serif italic leading-relaxed text-[var(--text)]">
                  "{q.quote}"
                </blockquote>
                {q.explanation && (
                  <p className="mb-3 text-sm leading-relaxed text-[var(--text-muted)]">{q.explanation}</p>
                )}
                <QuoteRankControls
                  kind={q.kind}
                  id={q.id}
                  isFirst={i === 0}
                  isLast={i === quotes.length - 1}
                  diaryNote={q.diaryNote}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
