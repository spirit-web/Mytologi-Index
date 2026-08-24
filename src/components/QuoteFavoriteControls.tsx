"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleQuoteFavorite, updateQuoteDiaryNote } from "@/lib/actions";
import type { QuoteKind } from "@/lib/quotes";

// Liten stjärna + dagbokskommentar-fält som sitter under varje enskilt
// Peterson-citat (segment-citat, versnotering, eller Story.quote för
// framework-böcker). Se src/lib/quotes.ts för kind-resonemanget.
export function QuoteFavoriteControls({
  kind,
  id,
  initialFavorite,
  initialDiaryNote,
}: {
  kind: QuoteKind;
  id: string;
  initialFavorite: boolean;
  initialDiaryNote: string | null;
}) {
  const [, startTransition] = useTransition();
  const [favorite, setOptimisticFavorite] = useOptimistic(initialFavorite);
  const [showNote, setShowNote] = useState(!!initialDiaryNote);

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const next = !favorite;
            startTransition(async () => {
              setOptimisticFavorite(next);
              await toggleQuoteFavorite(kind, id, next);
            });
            if (next) setShowNote(true);
          }}
          aria-pressed={favorite}
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition ${
            favorite
              ? "border-[var(--link-border)] bg-[var(--link-bg)] text-[var(--link)]"
              : "border-[var(--border)] text-[var(--text-faint)] hover:border-[var(--link)] hover:text-[var(--link)]"
          }`}
        >
          <span aria-hidden>{favorite ? "★" : "☆"}</span>
          {favorite ? "Sparat citat" : "Spara citat"}
        </button>
        {favorite && !showNote && (
          <button
            type="button"
            onClick={() => setShowNote(true)}
            className="text-xs text-[var(--text-faint)] underline underline-offset-2 hover:text-[var(--text-muted)]"
          >
            + dagbokskommentar
          </button>
        )}
      </div>
      {favorite && showNote && (
        <textarea
          defaultValue={initialDiaryNote ?? ""}
          placeholder="Din egen kommentar till det här citatet…"
          rows={2}
          onBlur={(e) => {
            const val = e.target.value;
            startTransition(async () => {
              await updateQuoteDiaryNote(kind, id, val);
            });
          }}
          className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-xs text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--link)] focus:outline-none"
        />
      )}
    </div>
  );
}
