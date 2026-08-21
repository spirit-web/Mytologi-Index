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
  // Satt om en eller flera kapitel-delhämtningar misslyckades (t.ex.
  // tillfälligt nätverksfel) — visar vad vi ändå fick med.
  partial?: boolean;
};

type ParsedRef = { book: string; chapter: number; verse: number };

function parseRef(ref: string): ParsedRef | null {
  const m = ref.match(/^(.*?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  return { book: m[1], chapter: Number(m[2]), verse: Number(m[3]) };
}

// Extern länk till en fullständig bibelläsare för exakt samma referens —
// visas alltid bredvid texten, oavsett om vi lyckades hämta den själva.
export function externalBibleUrl(startRef: string, endRef: string): string {
  const start = parseRef(startRef);
  const end = parseRef(endRef);
  const range =
    start && end
      ? start.chapter === end.chapter
        ? `${start.book} ${start.chapter}:${start.verse}-${end.verse}`
        : `${start.book} ${start.chapter}-${end.chapter}`
      : `${startRef}-${endRef}`;
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(range)}&version=WEB`;
}

async function fetchChapter(book: string, chapter: number) {
  const url = `https://bible-api.com/${encodeURIComponent(`${book} ${chapter}`)}?translation=web`;
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
    // bible-api.com tillåter bara en hel kapitel-referens eller en range
    // inom EN kapitelgräns per anrop — så för berättelser som spänner
    // över flera kapitel (Noa: 6–9, Josef: 37–45) hämtar vi varje kapitel
    // för sig och klipper bort verserna utanför start/slut, och slår sen
    // ihop allt till en sammanhängande text.
    const chapters: Array<{ chapter: number; verse: number; text: string }> = [];
    let translationName = "";
    let anySucceeded = false;
    let anyFailed = false;

    for (let ch = start.chapter; ch <= end.chapter; ch++) {
      const data = await fetchChapter(start.book, ch);
      if (!data) {
        anyFailed = true;
        continue;
      }
      anySucceeded = true;
      translationName = data.translation_name;
      for (const v of data.verses) {
        if (ch === start.chapter && v.verse < start.verse) continue;
        if (ch === end.chapter && v.verse > end.verse) continue;
        chapters.push(v);
      }
    }

    if (!anySucceeded) return null;

    return {
      reference:
        start.chapter === end.chapter
          ? `${start.book} ${start.chapter}:${start.verse}-${end.verse}`
          : `${start.book} ${start.chapter}:${start.verse}-${end.chapter}:${end.verse}`,
      translationName,
      verses: chapters.map((v) => ({ chapter: v.chapter, verse: v.verse, text: v.text.trim() })),
      partial: anyFailed,
    };
  } catch {
    return null;
  }
}
