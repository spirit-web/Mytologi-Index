"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getFavoriteQuotes, type QuoteKind } from "@/lib/quotes";

// Server Actions för läsframsteg (StoryProgress). Anropas från små
// klient-komponenter (checkbox/stjärna) på story-sidan. Ingen
// inloggning/userId — se schema.prisma-kommentar om varför.

export async function toggleStoryCompleted(storyId: string, nextCompleted: boolean) {
  await prisma.storyProgress.upsert({
    where: { storyId },
    update: { completedAt: nextCompleted ? new Date() : null },
    create: { storyId, completedAt: nextCompleted ? new Date() : null },
  });
  revalidatePath("/", "layout");
}

export async function toggleStoryFavorite(storyId: string, nextFavorite: boolean) {
  await prisma.storyProgress.upsert({
    where: { storyId },
    update: { isFavorite: nextFavorite },
    create: { storyId, isFavorite: nextFavorite },
  });
  revalidatePath("/", "layout");
}

// --- Citat-stjärnmärkning, dagbokskommentarer, rangordning --------------
// Se src/lib/quotes.ts för resonemang bakom kind-parametern (story /
// segment / verse — tre olika modeller kan bära ett "citat").

async function setQuoteFields(
  kind: QuoteKind,
  id: string,
  data: { quoteIsFavorite?: boolean; quoteRank?: number | null; diaryNote?: string | null },
) {
  if (kind === "story") await prisma.story.update({ where: { id }, data });
  else if (kind === "segment") await prisma.petersonSegment.update({ where: { id }, data });
  else await prisma.verseCommentary.update({ where: { id }, data });
}

async function getNextQuoteRank(): Promise<number> {
  const [s, p, v] = await Promise.all([
    prisma.story.aggregate({ _max: { quoteRank: true } }),
    prisma.petersonSegment.aggregate({ _max: { quoteRank: true } }),
    prisma.verseCommentary.aggregate({ _max: { quoteRank: true } }),
  ]);
  return Math.max(s._max.quoteRank ?? 0, p._max.quoteRank ?? 0, v._max.quoteRank ?? 0) + 1;
}

export async function toggleQuoteFavorite(kind: QuoteKind, id: string, nextFavorite: boolean) {
  const quoteRank = nextFavorite ? await getNextQuoteRank() : null;
  await setQuoteFields(kind, id, { quoteIsFavorite: nextFavorite, quoteRank });
  revalidatePath("/", "layout");
}

export async function updateQuoteDiaryNote(kind: QuoteKind, id: string, note: string) {
  await setQuoteFields(kind, id, { diaryNote: note.trim() === "" ? null : note });
  revalidatePath("/citat");
}

export async function moveQuoteRank(kind: QuoteKind, id: string, direction: "up" | "down") {
  const all = await getFavoriteQuotes(); // redan sorterad efter rank
  const idx = all.findIndex((q) => q.kind === kind && q.id === id);
  if (idx === -1) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return;
  const a = all[idx];
  const b = all[swapIdx];
  await Promise.all([setQuoteFields(a.kind, a.id, { quoteRank: b.rank }), setQuoteFields(b.kind, b.id, { quoteRank: a.rank })]);
  revalidatePath("/citat");
}
