import { prisma } from "@/lib/prisma";

// --- Poäng --------------------------------------------------------------
// Enkel, transparent poängmodell: 10 poäng per avklarad berättelse, +10
// bonus om den har verifierat Peterson-innehåll (segment eller citat) —
// eftersom hela poängen med appen är att följa Jordans genomgång, inte
// bara bocka av bibeltext. +5 för varje markerad "extra viktig".
export const POINTS_PER_STORY = 10;
export const POINTS_PETERSON_BONUS = 10;
export const POINTS_PER_FAVORITE = 5;

export type StoryStat = {
  id: string;
  title: string;
  slug: string;
  bookSlug: string;
  bookName: string;
  corpusSlug: string;
  corpusName: string;
  corpusKind: string;
  seriesSlug: string | null;
  seriesTitle: string | null;
  hasPetersonContent: boolean;
  completed: boolean;
  completedAt: Date | null;
  favorite: boolean;
};

export type GroupStat = {
  slug: string;
  name: string;
  completed: number;
  total: number;
  // Bara satt för byBook — vägen till bokens sida (/{corpusSlug}/{slug}).
  // bySeries/byCorpus behöver den inte (byCorpus ÄR redan corpus-sluggen).
  corpusSlug?: string;
};

export type GamificationStats = {
  stories: StoryStat[];
  totalStories: number;
  totalCompleted: number;
  totalFavorites: number;
  petersonTotal: number;
  petersonCompleted: number;
  points: number;
  byBook: GroupStat[];
  bySeries: GroupStat[];
  byCorpus: GroupStat[];
};

export async function getGamificationStats(): Promise<GamificationStats> {
  const rows = await prisma.story.findMany({
    include: {
      book: { include: { corpus: true } },
      petersonSegments: { select: { id: true } },
      progress: true,
    },
    orderBy: [{ book: { order: "asc" } }, { orderInBook: "asc" }],
  });

  const stories: StoryStat[] = rows.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    bookSlug: s.book.slug,
    bookName: s.book.name,
    corpusSlug: s.book.corpus.slug,
    corpusName: s.book.corpus.name,
    corpusKind: s.book.corpus.kind,
    seriesSlug: s.seriesSlug,
    seriesTitle: s.seriesTitle,
    hasPetersonContent: s.petersonSegments.length > 0 || !!s.quote,
    completed: !!s.progress?.completedAt,
    completedAt: s.progress?.completedAt ?? null,
    favorite: !!s.progress?.isFavorite,
  }));

  const totalStories = stories.length;
  const totalCompleted = stories.filter((s) => s.completed).length;
  const totalFavorites = stories.filter((s) => s.favorite).length;
  const petersonStories = stories.filter((s) => s.hasPetersonContent);
  const petersonTotal = petersonStories.length;
  const petersonCompleted = petersonStories.filter((s) => s.completed).length;

  const points =
    totalCompleted * POINTS_PER_STORY +
    stories.filter((s) => s.completed && s.hasPetersonContent).length * POINTS_PETERSON_BONUS +
    totalFavorites * POINTS_PER_FAVORITE;

  const byBook = groupBy(stories, (s) => s.bookSlug, (s) => s.bookName, (s) => s.corpusSlug);
  const bySeries = groupBy(
    stories.filter((s) => s.seriesSlug),
    (s) => `${s.bookSlug}:${s.seriesSlug}`,
    (s) => s.seriesTitle ?? s.seriesSlug ?? "",
  );
  const byCorpus = groupBy(stories, (s) => s.corpusSlug, (s) => s.corpusName);

  return {
    stories,
    totalStories,
    totalCompleted,
    totalFavorites,
    petersonTotal,
    petersonCompleted,
    points,
    byBook,
    bySeries,
    byCorpus,
  };
}

function groupBy(
  stories: StoryStat[],
  keyFn: (s: StoryStat) => string,
  nameFn: (s: StoryStat) => string,
  corpusSlugFn?: (s: StoryStat) => string,
): GroupStat[] {
  const map = new Map<string, GroupStat>();
  for (const s of stories) {
    const key = keyFn(s);
    const existing =
      map.get(key) ??
      { slug: key, name: nameFn(s), completed: 0, total: 0, corpusSlug: corpusSlugFn?.(s) };
    existing.total += 1;
    if (s.completed) existing.completed += 1;
    map.set(key, existing);
  }
  return [...map.values()];
}

// --- Emblem ---------------------------------------------------------------
export type Badge = {
  slug: string;
  name: string;
  description: string;
  emoji: string;
  isEarned: (s: GamificationStats) => boolean;
  /** 0–1, för progress-visning även på olåsta emblem */
  progress: (s: GamificationStats) => number;
};

const bookBadge = (bookSlug: string, name: string, description: string, emoji: string): Badge => ({
  slug: `book-${bookSlug}`,
  name,
  description,
  emoji,
  isEarned: (s) => {
    const g = s.byBook.find((b) => b.slug === bookSlug);
    return !!g && g.total > 0 && g.completed === g.total;
  },
  progress: (s) => {
    const g = s.byBook.find((b) => b.slug === bookSlug);
    return g && g.total > 0 ? g.completed / g.total : 0;
  },
});

const seriesBadge = (
  seriesKey: string,
  name: string,
  description: string,
  emoji: string,
): Badge => ({
  slug: `series-${seriesKey}`,
  name,
  description,
  emoji,
  isEarned: (s) => {
    const g = s.bySeries.find((b) => b.slug === seriesKey);
    return !!g && g.total > 0 && g.completed === g.total;
  },
  progress: (s) => {
    const g = s.bySeries.find((b) => b.slug === seriesKey);
    return g && g.total > 0 ? g.completed / g.total : 0;
  },
});

export const BADGES: Badge[] = [
  {
    slug: "first-step",
    name: "Första steget",
    description: "Klarmarkera din första berättelse.",
    emoji: "🌱",
    isEarned: (s) => s.totalCompleted >= 1,
    progress: (s) => Math.min(1, s.totalCompleted / 1),
  },
  {
    slug: "curious-5",
    name: "Nyfiken själ",
    description: "Klarmarkera 5 berättelser.",
    emoji: "🔍",
    isEarned: (s) => s.totalCompleted >= 5,
    progress: (s) => Math.min(1, s.totalCompleted / 5),
  },
  {
    slug: "devoted-25",
    name: "Hängiven läsare",
    description: "Klarmarkera 25 berättelser.",
    emoji: "📖",
    isEarned: (s) => s.totalCompleted >= 25,
    progress: (s) => Math.min(1, s.totalCompleted / 25),
  },
  {
    slug: "wanderer-50",
    name: "Bibelvandrare",
    description: "Klarmarkera 50 berättelser.",
    emoji: "🥾",
    isEarned: (s) => s.totalCompleted >= 50,
    progress: (s) => Math.min(1, s.totalCompleted / 50),
  },
  bookBadge("genesis", "Genesis-mästare", "Klarmarkera alla berättelser i Första Moseboken.", "🌍"),
  bookBadge("exodus", "Exodus-mästare", "Klarmarkera alla berättelser i Andra Moseboken.", "🔥"),
  bookBadge("matthew", "Matteus-mästare", "Klarmarkera alla berättelser i Matteusevangeliet.", "✝️"),
  bookBadge(
    "maps-of-meaning-2017",
    "Maps of Meaning — invigd",
    "Klarmarkera alla 12 föreläsningar i Maps of Meaning.",
    "🗺️",
  ),
  bookBadge("12-rules-for-life", "12 regler bemästrade", "Klarmarkera alla 12 regler för livet.", "📏"),
  bookBadge(
    "we-who-wrestle-with-god",
    "Brottas med Gud",
    "Klarmarkera alla 9 kapitel i We Who Wrestle with God.",
    "🤼",
  ),
  bookBadge(
    "beyond-order",
    "Bortom ordningen",
    "Klarmarkera alla 12 regler i Beyond Order.",
    "🌀",
  ),
  seriesBadge("genesis:jacob", "Jakob-cykeln klar", "Klarmarkera alla berättelser i Jakob-cykeln.", "🪜"),
  seriesBadge(
    "genesis:abraham",
    "Abraham-cykeln klar",
    "Klarmarkera alla berättelser i Abraham-cykeln.",
    "⭐",
  ),
  seriesBadge("genesis:noah", "Noa-cykeln klar", "Klarmarkera alla berättelser i Noa-cykeln.", "🌊",),
  {
    slug: "collector-5",
    name: "Samlare",
    description: "Markera 5 berättelser som extra viktiga.",
    emoji: "⭐",
    isEarned: (s) => s.totalFavorites >= 5,
    progress: (s) => Math.min(1, s.totalFavorites / 5),
  },
  {
    slug: "peterson-halfway",
    name: "Halvvägs med Jordan",
    description: "Klarmarkera hälften av alla berättelser som har Peterson-innehåll.",
    emoji: "🎧",
    isEarned: (s) => s.petersonTotal > 0 && s.petersonCompleted / s.petersonTotal >= 0.5,
    progress: (s) => (s.petersonTotal > 0 ? s.petersonCompleted / s.petersonTotal / 0.5 : 0),
  },
  {
    slug: "whole-bible",
    name: "Hela Bibeln",
    description: "Klarmarkera alla berättelser i Bibel-korpusen.",
    emoji: "👑",
    isEarned: (s) => {
      const g = s.byCorpus.find((b) => b.slug === "bible");
      return !!g && g.total > 0 && g.completed === g.total;
    },
    progress: (s) => {
      const g = s.byCorpus.find((b) => b.slug === "bible");
      return g && g.total > 0 ? g.completed / g.total : 0;
    },
  },
];
