import { prisma } from "@/lib/prisma";

// --- Poäng --------------------------------------------------------------
// Enkel, transparent poängmodell: 10 poäng per avklarad berättelse, +10
// bonus om den har verifierat Peterson-innehåll (segment eller citat) —
// eftersom hela poängen med appen är att följa Jordans genomgång, inte
// bara bocka av bibeltext. +5 för varje markerad "extra viktig".
export const POINTS_PER_STORY = 10;
export const POINTS_PETERSON_BONUS = 10;
export const POINTS_PER_FAVORITE = 5;

// --- Karaktärsstatistik ---------------------------------------------------
// Globalt (inte per bok) — en karaktär som Mose eller Elia kan förekomma
// i flera böcker (Exodus, Matteus), och "hur långt har jag kommit med den
// här personen" är mer meningsfullt räknat över hela appen än bara den
// bok man råkar stå på. Används både för karaktärsremsan under "Om boken"
// på bok-sidan och för karaktärsemblemen på framsteg-sidan.
export type CharacterStat = {
  slug: string;
  name: string;
  portraitPath: string | null;
  completed: number;
  total: number;
};

export async function getCharacterStats(): Promise<CharacterStat[]> {
  const characters = await prisma.character.findMany({
    include: {
      appearances: { include: { story: { include: { progress: true } } } },
      // Fångar upp personer/verk Peterson REFERERAR till (Nietzsche,
      // Jung, Disney-filmer, m.fl.) — särskilt viktigt för framework-
      // böckerna (Maps of Meaning, 12 Rules for Life, ...) som annars
      // saknar riktiga StoryCharacter-kopplingar helt. Bara Reference-
      // rader med en satt storyId räknas (annars går det inte att koppla
      // till en avklarningsbar berättelse) — se README.
      references: { include: { story: { include: { progress: true } } } },
    },
  });
  return characters
    .map((c) => {
      // Union av story-ID:n dels via StoryCharacter (är en karaktär I
      // berättelsen), dels via Reference (Peterson refererar till
      // personen i samband med en story) — samma karaktär ska bara
      // räknas en gång per story oavsett vilken koppling det är.
      const storyProgress = new Map<string, boolean>();
      for (const a of c.appearances) storyProgress.set(a.storyId, !!a.story.progress?.completedAt);
      for (const r of c.references) {
        if (r.storyId) storyProgress.set(r.storyId, !!r.story?.progress?.completedAt);
      }
      return {
        slug: c.slug,
        name: c.name,
        portraitPath: c.portraitPath,
        total: storyProgress.size,
        completed: [...storyProgress.values()].filter(Boolean).length,
      };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "sv"));
}

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

// --- Bok- och cykel-emblem: HÄRLEDDA, inte hårdkodade -------------------
// Ett emblem per bok och ett per berättelsecykel (seriesSlug-grupp)
// genereras automatiskt från stats.byBook/bySeries, se getDynamicBadges()
// nedan — inte en statisk lista här. Det betyder att en ny bok (Lukas,
// Koranen, ...) eller en ny cykel (t.ex. en Mose- eller Josef-cykel)
// automatiskt får ett eget emblem så fort den seedas, utan att någon
// kod behöver ändras — direkt önskemål från användaren 2026-08-25.
//
// De två kartorna nedan är HELT VALFRIA finputsningar (emoji + ett
// finare namn) för några kända favoriter — saknas en bok/cykel här får
// den bara en vettig generisk ikon/namn istället, aldrig inget emblem
// alls. Lägg gärna till en rad här när en ny bok känns värd en egen
// ikon, men det är aldrig ett krav för att emblemet ska dyka upp.
const BOOK_BADGE_STYLE: Record<string, { emoji: string; name: string }> = {
  genesis: { emoji: "🌍", name: "Genesis-mästare" },
  exodus: { emoji: "🔥", name: "Exodus-mästare" },
  matthew: { emoji: "✝️", name: "Matteus-mästare" },
  luke: { emoji: "📖", name: "Lukas-mästare" },
  "maps-of-meaning-2017": { emoji: "🗺️", name: "Maps of Meaning — invigd" },
  "12-rules-for-life": { emoji: "📏", name: "12 regler bemästrade" },
  "we-who-wrestle-with-god": { emoji: "🤼", name: "Brottas med Gud" },
  "beyond-order": { emoji: "🌀", name: "Bortom ordningen" },
  // NY 2026-08-28, se README Fas 56: resten av Bibel-böckerna saknade
  // finputsning (fick bara generisk 📖 + "{namn} klar") — kompletterat
  // för alla, inte bara böckerna från den här sessionen.
  mark: { emoji: "⚡", name: "Markus-mästare" },
  john: { emoji: "💡", name: "Johannes-mästare" },
  jonah: { emoji: "🐋", name: "Jona-mästare" },
  ruth: { emoji: "🌾", name: "Rut-mästare" },
  esther: { emoji: "👑", name: "Ester-mästare" },
  daniel: { emoji: "🦁", name: "Daniel-mästare" },
  "1-samuel": { emoji: "🎯", name: "Första Samuelsboken-mästare" },
  leviticus: { emoji: "🕯️", name: "Tredje Moseboken-mästare" },
  deuteronomy: { emoji: "📜", name: "Femte Moseboken-mästare" },
  job: { emoji: "⚖️", name: "Job-mästare" },
  "song-of-songs": { emoji: "🌹", name: "Höga Visan-mästare" },
  jeremiah: { emoji: "🪣", name: "Jeremia-mästare" },
  joshua: { emoji: "📯", name: "Josua-mästare" },
  "2-samuel": { emoji: "🏹", name: "Andra Samuelsboken-mästare" },
  "1-kings": { emoji: "🏛️", name: "Första Konungaboken-mästare" },
  numbers: { emoji: "🐍", name: "Numeri-mästare" },
  judges: { emoji: "⚔️", name: "Domarboken-mästare" },
  "2-kings": { emoji: "🌪️", name: "Andra Konungaboken-mästare" },
  nehemiah: { emoji: "🧱", name: "Nehemja-mästare" },
  acts: { emoji: "🕊️", name: "Apostlagärningarna-mästare" },
};
const SERIES_BADGE_STYLE: Record<string, { emoji: string }> = {
  "genesis:jacob": { emoji: "🪜" },
  "genesis:abraham": { emoji: "⭐" },
  "genesis:noah": { emoji: "🌊" },
};
const DEFAULT_BOOK_EMOJI = "📖";
const DEFAULT_SERIES_EMOJI = "🔗";

// Bygger ett emblem per bok (stats.byBook) och ett per cykel
// (stats.bySeries) — anropas med redan hämtad stats (se framsteg-sidan)
// så att listan alltid speglar exakt vilka böcker/cykler som finns i
// databasen just nu, oavsett hur många fler som läggs till framöver.
export function getDynamicBadges(stats: GamificationStats): Badge[] {
  const bookBadges: Badge[] = stats.byBook.map((b) => {
    const style = BOOK_BADGE_STYLE[b.slug];
    return {
      slug: `book-${b.slug}`,
      name: style?.name ?? `${b.name} klar`,
      description: `Klarmarkera alla berättelser i ${b.name}.`,
      emoji: style?.emoji ?? DEFAULT_BOOK_EMOJI,
      isEarned: () => b.total > 0 && b.completed === b.total,
      progress: () => (b.total > 0 ? b.completed / b.total : 0),
    };
  });
  const seriesBadges: Badge[] = stats.bySeries.map((b) => {
    const style = SERIES_BADGE_STYLE[b.slug];
    return {
      slug: `series-${b.slug}`,
      name: `${b.name} klar`,
      description: `Klarmarkera alla berättelser i ${b.name}.`,
      emoji: style?.emoji ?? DEFAULT_SERIES_EMOJI,
      isEarned: () => b.total > 0 && b.completed === b.total,
      progress: () => (b.total > 0 ? b.completed / b.total : 0),
    };
  });
  return [...bookBadges, ...seriesBadges];
}

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
  // Bok- och cykel-emblem genereras INTE här längre — se
  // getDynamicBadges() ovan, som bygger ett emblem per bok/cykel direkt
  // från databasen. Bara de bok-/cykel-oberoende emblemen nedan.
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
