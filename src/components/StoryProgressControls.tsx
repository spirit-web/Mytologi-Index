"use client";

import { useOptimistic, useTransition } from "react";
import { toggleStoryCompleted, toggleStoryFavorite } from "@/lib/actions";

export function StoryProgressControls({
  storyId,
  initialCompleted,
  initialFavorite,
}: {
  storyId: string;
  initialCompleted: boolean;
  initialFavorite: boolean;
}) {
  const [, startTransition] = useTransition();
  const [completed, setOptimisticCompleted] = useOptimistic(initialCompleted);
  const [favorite, setOptimisticFavorite] = useOptimistic(initialFavorite);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => {
          const next = !completed;
          startTransition(async () => {
            setOptimisticCompleted(next);
            await toggleStoryCompleted(storyId, next);
          });
        }}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
          completed
            ? "border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success)]"
            : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--success)] hover:text-[var(--success)]"
        }`}
        aria-pressed={completed}
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
            completed
              ? "border-[var(--success)] bg-[var(--success)]"
              : "border-[var(--text-faint)]"
          }`}
        >
          {completed && (
            // Egen SVG istället för Unicode-tecknet "✓" — vissa
            // typsnitt/OS renderar det som en färgad emoji-glyf som
            // ignorerar text-färg, vilket gjorde bocken svart även med
            // text-white satt. SVG med currentColor är alltid pålitlig.
            <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 text-white" fill="none" aria-hidden>
              <path
                d="M3 8.5L6.2 11.5L13 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {completed ? "Klarmarkerad" : "Markera som klar"}
      </button>

      <button
        type="button"
        onClick={() => {
          const next = !favorite;
          startTransition(async () => {
            setOptimisticFavorite(next);
            await toggleStoryFavorite(storyId, next);
          });
        }}
        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
          favorite
            ? "border-[var(--link-border)] bg-[var(--link-bg)] text-[var(--link)]"
            : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--link)] hover:text-[var(--link)]"
        }`}
        aria-pressed={favorite}
      >
        <span aria-hidden>{favorite ? "★" : "☆"}</span>
        {favorite ? "Extra viktig" : "Markera som extra viktig"}
      </button>
    </div>
  );
}
