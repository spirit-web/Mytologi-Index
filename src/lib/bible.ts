// Hämtar bibeltext on-demand från bible-api.com (World English Bible,
// public domain) — vi lagrar aldrig själva versstexten i databasen, se
// README "Viktig avgränsning: upphovsrätt".

export type BibleVerse = {
  chapter: number;
  verse: number;
  text: string;
};

export type BiblePassage = {
  reference: string;
  translationName: string;
  verses: BibleVerse[];
  // Satt när hela berättelsen spänner över fler än en kapitelgräns —
  // bible-api.com tillåter bara ranges inom en enda kapitelgräns, så vi
  // visar startkapitlet som smakprov och länkar vidare för resten.
  truncated?: { fullRangeLabel: string; externalUrl: string };
};

type ParsedRef = { book: string; chapter: number; verse: number };

function parseRef(ref: string): ParsedRef | null {
  const m = ref.match(/^(.*?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  return { book: m[1], chapter: Number(m[2]), verse: Number(m[3]) };
}

function externalReadUrl(book: string, startChapter: number, endChapter: number) {
  const range = startChapter === endChapter ? `${book} ${startChapter}` : `${book} ${startChapter}-${endChapter}`;
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(range)}&version=WEB`;
}

async function fetchFromApi(apiRef: string) {
  const url = `https://bible-api.com/${encodeURIComponent(apiRef)}?translation=web`;
  const res = await fetch(url, {
    // Bibeltexten ändras aldrig — cacha länge lokalt.
    next: { revalidate: 60 * 60 * 24 * 30 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.verses?.length) return null;
  return data as {
    reference: string;
    translation_name: string;
    verses: Array<{ chapter: number; verse: number; text: string }>;
  };
}

export async function fetchBiblePassage(
  startRef: string,
  endRef: string
): Promise<BiblePassage | null> {
  const start = parseRef(startRef);
  const end = parseRef(endRef);
  if (!start || !end) return null;

  try {
    // bible-api.com tillåter ranges över högst EN kapitelgräns (t.ex.
    // "John 3:16-4:1" funkar, "John 3:16-5:1" gör det inte). Berättelser
    // som spänner över fler kapitel (Noa: 6–9, Josef: 37–45) hämtas som
    // startkapitlet, med länk vidare för resten.
    const spansTooManyChapters = end.chapter - start.chapter > 1;

    const apiRef = spansTooManyChapters
      ? `${start.book} ${start.chapter}`
      : start.chapter === end.chapter
        ? `${start.book} ${start.chapter}:${start.verse}-${end.verse}`
        : `${start.book} ${start.chapter}:${start.verse}-${end.chapter}:${end.verse}`;

    const data = await fetchFromApi(apiRef);
    if (!data) return null;

    const passage: BiblePassage = {
      reference: data.reference,
      translationName: data.translation_name,
      verses: data.verses.map((v) => ({ chapter: v.chapter, verse: v.verse, text: v.text.trim() })),
    };

    if (spansTooManyChapters) {
      passage.truncated = {
        fullRangeLabel: `${start.book} ${start.chapter}–${end.chapter}`,
        externalUrl: externalReadUrl(start.book, start.chapter, end.chapter),
      };
    }

    return passage;
  } catch {
    return null;
  }
}
