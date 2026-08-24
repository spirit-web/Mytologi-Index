import { prisma } from "@/lib/prisma";

// Ett "citat" i appen kan komma från tre olika ställen, beroende på hur
// djupt just den berättelsen är annoterad:
//   - Story.quote      — framework-böcker utan video (12 Rules for Life)
//   - PetersonSegment.quote — ett video-citat utan versuppdelning
//   - VerseCommentary.quote — ett citat kopplat till en specifik vers
// Stjärnmarkering/rank/dagbokskommentar ligger som egna fält direkt på
// alla tre modeller (se schema.prisma) snarare än i en gemensam tabell,
// för att slippa en polymorf relation i SQLite. `quoteRank` delas som en
// EN gemensam sorteringsnyckel över alla tre — /citat-sidan visar dem
// tillsammans i en enda rangordnad lista.
export type QuoteKind = "story" | "segment" | "verse";

export type FavoriteQuote = {
  kind: QuoteKind;
  id: string;
  quote: string;
  explanation: string;
  diaryNote: string | null;
  rank: number;
  storyId: string;
  storyTitle: string;
  storySlug: string;
  bookSlug: string;
  bookName: string;
  corpusSlug: string;
  reference: string; // t.ex. "Genesis 2:8" eller "Regel 6" eller videotitel
  thumbnailPath: string | null;
};

type StoryWithImages = {
  id: string;
  title: string;
  slug: string;
  startRef: string;
  thumbnailOrder: number | null;
  book: { slug: string; name: string; corpus: { slug: string } };
  images: { order: number; path: string }[];
};

function pickThumb(story: StoryWithImages): string | null {
  const order = story.thumbnailOrder ?? 1;
  return story.images.find((i) => i.order === order)?.path ?? story.images[0]?.path ?? null;
}

const storyInclude = {
  book: { include: { corpus: true } },
  images: { orderBy: { order: "asc" as const } },
};

export async function getFavoriteQuotes(): Promise<FavoriteQuote[]> {
  const [stories, segments, verses] = await Promise.all([
    prisma.story.findMany({
      where: { quoteIsFavorite: true, quote: { not: null } },
      include: storyInclude,
    }),
    prisma.petersonSegment.findMany({
      where: { quoteIsFavorite: true, quote: { not: null } },
      include: { story: { include: storyInclude }, video: true },
    }),
    prisma.verseCommentary.findMany({
      where: { quoteIsFavorite: true },
      include: { segment: { include: { story: { include: storyInclude }, video: true } } },
    }),
  ]);

  const items: FavoriteQuote[] = [];

  for (const s of stories) {
    items.push({
      kind: "story",
      id: s.id,
      quote: s.quote ?? "",
      explanation: s.summary ?? "",
      diaryNote: s.diaryNote,
      rank: s.quoteRank ?? 0,
      storyId: s.id,
      storyTitle: s.title,
      storySlug: s.slug,
      bookSlug: s.book.slug,
      bookName: s.book.name,
      corpusSlug: s.book.corpus.slug,
      reference: s.startRef,
      thumbnailPath: pickThumb(s as StoryWithImages),
    });
  }

  for (const seg of segments) {
    const story = seg.story;
    items.push({
      kind: "segment",
      id: seg.id,
      quote: seg.quote ?? "",
      explanation: seg.keyPoints ?? "",
      diaryNote: seg.diaryNote,
      rank: seg.quoteRank ?? 0,
      storyId: story.id,
      storyTitle: story.title,
      storySlug: story.slug,
      bookSlug: story.book.slug,
      bookName: story.book.name,
      corpusSlug: story.book.corpus.slug,
      reference: seg.video.title,
      thumbnailPath: pickThumb(story as StoryWithImages),
    });
  }

  for (const v of verses) {
    const story = v.segment.story;
    items.push({
      kind: "verse",
      id: v.id,
      quote: v.quote,
      explanation: v.summary,
      diaryNote: v.diaryNote,
      rank: v.quoteRank ?? 0,
      storyId: story.id,
      storyTitle: story.title,
      storySlug: story.slug,
      bookSlug: story.book.slug,
      bookName: story.book.name,
      corpusSlug: story.book.corpus.slug,
      reference: `${story.startRef.split(" ")[0]} ${v.chapter}:${v.verse}${v.verseEnd ? `–${v.verseEnd}` : ""}`,
      thumbnailPath: pickThumb(story as StoryWithImages),
    });
  }

  items.sort((a, b) => a.rank - b.rank);
  return items;
}

// Räknar stjärnmärkta citat PER STORY — visas bredvid "Markera som
// extra viktig" högst upp på story-sidan. Tar en redan hämtad story
// (med relationer) snarare än att fråga databasen igen.
export function countFavoriteQuotesForStory(story: {
  quoteIsFavorite?: boolean;
  petersonSegments: Array<{
    quoteIsFavorite?: boolean;
    verseNotes: Array<{ quoteIsFavorite?: boolean }>;
  }>;
}): number {
  let n = story.quoteIsFavorite ? 1 : 0;
  for (const seg of story.petersonSegments) {
    if (seg.quoteIsFavorite) n += 1;
    for (const v of seg.verseNotes) if (v.quoteIsFavorite) n += 1;
  }
  return n;
}
