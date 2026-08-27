"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { reorderQuotes, toggleQuoteFavorite, updateQuoteDiaryNote } from "@/lib/actions";
import type { FavoriteQuote } from "@/lib/quotes";

// Dra-och-släpp-omordning av sparade citat, med upp/ner-pilar kvar som
// snabbare/tillgänglig fallback (tangentbord, finjustering ett steg i
// taget). Ersätter den tidigare rena knapp-lösningen — med många citat
// blev det för segt att flytta långt genom att klicka en pil upprepade
// gånger, se användarfeedback 2026-08-27.
//
// Bara DROP omordnar listan (inte redan under själva dragningen) — enklare
// att resonera kring och undviker stale closures mitt i en dragning; den
// hovrade raden får istället en tydlig kant som "här släpper du"-signal.
export function QuoteList({ quotes: initialQuotes }: { quotes: FavoriteQuote[] }) {
  const [quotes, setQuotes] = useState(initialQuotes);
  // Synkar om servern skickar nya props (t.ex. efter revalidatePath från
  // en annan flik/session). Justerar state UNDER rendering istället för i
  // en useEffect (Reacts rekommenderade mönster för att spegla en prop —
  // undviker en extra effekt-cascade-rendering, se react-hooks/set-state-in-effect).
  const [prevInitialQuotes, setPrevInitialQuotes] = useState(initialQuotes);
  if (initialQuotes !== prevInitialQuotes) {
    setPrevInitialQuotes(initialQuotes);
    setQuotes(initialQuotes);
  }
  const [isPending, startTransition] = useTransition();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function persistOrder(next: FavoriteQuote[]) {
    setQuotes(next);
    startTransition(async () => {
      await reorderQuotes(next.map((q) => ({ kind: q.kind, id: q.id })));
    });
  }

  function moveByOne(index: number, direction: "up" | "down") {
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= quotes.length) return;
    const next = [...quotes];
    [next[index], next[swapIdx]] = [next[swapIdx], next[index]];
    persistOrder(next);
  }

  function handleDragStart(e: React.DragEvent<HTMLLIElement>, index: number) {
    // Begränsa vad som faktiskt startar en dragning till greppikonen —
    // annars triggas drag av klick på länkar/textarea inuti kortet.
    const target = e.target as HTMLElement;
    if (!target.closest("[data-drag-handle]")) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index)); // krävs av Firefox för att tillåta drag
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent<HTMLLIElement>, index: number) {
    e.preventDefault(); // krävs för att tillåta drop överhuvudtaget
    if (dragIndex === null) return;
    if (overIndex !== index) setOverIndex(index);
  }

  function handleDrop(e: React.DragEvent<HTMLLIElement>, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...quotes];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    persistOrder(next);
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleRemove(kind: FavoriteQuote["kind"], id: string) {
    setQuotes((prev) => prev.filter((q) => !(q.kind === kind && q.id === id)));
    startTransition(async () => {
      await toggleQuoteFavorite(kind, id, false);
    });
  }

  return (
    <ol className="space-y-5">
      {quotes.map((q, i) => (
        <li
          key={`${q.kind}-${q.id}`}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
          className={`flex gap-3 rounded-xl border bg-[var(--link-bg)] p-5 shadow-sm transition ${
            dragIndex === i
              ? "border-[var(--link-border)] opacity-40"
              : overIndex === i && dragIndex !== null
                ? "border-[var(--link)] ring-2 ring-[var(--link)]"
                : "border-[var(--link-border)]"
          }`}
        >
          <div className="flex shrink-0 flex-col items-center gap-2">
            <span
              data-drag-handle
              title="Dra för att flytta"
              aria-hidden
              className="flex h-7 w-7 cursor-grab items-center justify-center rounded-md text-[var(--text-faint)] transition hover:bg-[var(--border-soft)] hover:text-[var(--text-muted)] active:cursor-grabbing"
            >
              ⠿
            </span>
            <span className="font-serif text-lg text-[var(--text-faint)] tabular-nums">{i + 1}</span>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                disabled={i === 0 || isPending}
                onClick={() => moveByOne(i, "up")}
                aria-label="Flytta upp"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] text-xs text-[var(--text-muted)] transition hover:border-[var(--link)] hover:text-[var(--link)] disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === quotes.length - 1 || isPending}
                onClick={() => moveByOne(i, "down")}
                aria-label="Flytta ner"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] text-xs text-[var(--text-muted)] transition hover:border-[var(--link)] hover:text-[var(--link)] disabled:opacity-30"
              >
                ↓
              </button>
            </div>
          </div>
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
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleRemove(q.kind, q.id)}
                className="w-fit rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-faint)] transition hover:border-red-300 hover:text-red-500"
              >
                Ta bort ★
              </button>
              <textarea
                defaultValue={q.diaryNote ?? ""}
                placeholder="Din egen kommentar till det här citatet…"
                rows={2}
                onBlur={(e) => {
                  const val = e.target.value;
                  startTransition(async () => {
                    await updateQuoteDiaryNote(q.kind, q.id, val);
                  });
                }}
                className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--link)] focus:outline-none"
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
