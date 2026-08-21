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
};

// Bygger en bible-api.com-referens av två egna referensfält, t.ex.
// startRef="Genesis 4:1", endRef="Genesis 4:16" -> "Genesis 4:1-16"
// (eller "Genesis 28:10-Genesis 32:32" om de spänner över flera kapitel).
function toApiRef(startRef: string, endRef: string): string {
  const parse = (ref: string) => {
    const m = ref.match(/^(.*?)\s+(\d+):(\d+)$/);
    if (!m) return null;
    return { book: m[1], chapter: Number(m[2]), verse: Number(m[3]) };
  };

  const start = parse(startRef);
  const end = parse(endRef);
  if (!start || !end) return `${startRef}-${endRef}`;

  if (start.book === end.book && start.chapter === end.chapter) {
    return `${start.book} ${start.chapter}:${start.verse}-${end.verse}`;
  }
  return `${start.book} ${start.chapter}:${start.verse}-${end.chapter}:${end.verse}`;
}

export async function fetchBiblePassage(
  startRef: string,
  endRef: string
): Promise<BiblePassage | null> {
  const apiRef = toApiRef(startRef, endRef);
  const url = `https://bible-api.com/${encodeURIComponent(apiRef)}?translation=web`;

  try {
    const res = await fetch(url, {
      // Bibeltexten ändras aldrig — cacha länge lokalt.
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.verses?.length) return null;

    return {
      reference: data.reference as string,
      translationName: data.translation_name as string,
      verses: (data.verses as Array<{ chapter: number; verse: number; text: string }>).map(
        (v) => ({ chapter: v.chapter, verse: v.verse, text: v.text.trim() })
      ),
    };
  } catch {
    return null;
  }
}
