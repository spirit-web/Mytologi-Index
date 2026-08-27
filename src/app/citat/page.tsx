import Link from "next/link";
import { getFavoriteQuotes } from "@/lib/quotes";
import { QuoteList } from "@/components/QuoteList";

// "Jordan-sidan" — alla citat/förklaringstexter användaren stjärnmärkt,
// i EN gemensam rangordnad lista tvärs över hela appen (Bibeln, Maps of
// Meaning, 12 Rules for Life, ...). Se src/lib/quotes.ts.
export default async function CitatPage() {
  const quotes = await getFavoriteQuotes();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] shadow-sm transition hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
      >
        ← Berättelseindex
      </Link>
      <h1 className="mt-2 mb-1 font-serif text-4xl font-semibold tracking-tight text-[var(--text)]">
        Dina sparade citat
      </h1>
      <p className="mb-10 text-sm text-[var(--text-muted)]">
        {quotes.length} citat sparade — dra i <span aria-hidden>⠿</span> för att flytta ett citat
        (eller använd pilarna för ett steg i taget), skriv en egen kommentar under respektive citat.
      </p>

      {quotes.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          Inga citat sparade ännu — klicka på "☆ Spara citat" under ett Peterson-citat på valfri
          berättelsesida för att lägga till det här.
        </p>
      ) : (
        <QuoteList quotes={quotes} />
      )}
    </main>
  );
}
