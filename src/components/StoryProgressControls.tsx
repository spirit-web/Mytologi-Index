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
    <div className="mb-6 flex flex-wrap items-center gap-3">
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
            ? "border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)]"
            : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        }`}
        aria-pressed={completed}
      >
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] leading-none ${
            completed
              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
              : "border-[var(--text-faint)]"
          }`}
        >
          {completed ? "✓" : ""}
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
