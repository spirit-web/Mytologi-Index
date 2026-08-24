"use client";

import { useTransition } from "react";
import { moveQuoteRank, toggleQuoteFavorite, updateQuoteDiaryNote } from "@/lib/actions";
import type { QuoteKind } from "@/lib/quotes";

// Upp/ner-pilar för att manuellt rangordna sparade citat på /citat-
// sidan, plus avmarkera och redigera dagbokskommentar. Enkla knappar
// istället för drag-and-drop — samma resultat (manuell numerisk
// rangordning), mycket enklare att göra tillförlitligt.
export function QuoteRankControls({
  kind,
  id,
  isFirst,
  isLast,
  diaryNote,
}: {
  kind: QuoteKind;
  id: string;
  isFirst: boolean;
  isLast: boolean;
  diaryNote: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={isFirst || isPending}
          onClick={() => startTransition(async () => { await moveQuoteRank(kind, id, "up"); })}
          aria-label="Flytta upp"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition hover:border-[var(--link)] hover:text-[var(--link)] disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={isLast || isPending}
          onClick={() => startTransition(async () => { await moveQuoteRank(kind, id, "down"); })}
          aria-label="Flytta ner"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition hover:border-[var(--link)] hover:text-[var(--link)] disabled:opacity-30"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => startTransition(async () => { await toggleQuoteFavorite(kind, id, false); })}
          className="ml-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-faint)] transition hover:border-red-300 hover:text-red-500"
        >
          Ta bort ★
        </button>
      </div>
      <textarea
        defaultValue={diaryNote ?? ""}
        placeholder="Din egen kommentar till det här citatet…"
        rows={2}
        onBlur={(e) => {
          const val = e.target.value;
          startTransition(async () => {
            await updateQuoteDiaryNote(kind, id, val);
          });
        }}
        className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--link)] focus:outline-none"
      />
    </div>
  );
}
