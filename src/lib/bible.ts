// Bibeltext: 1917 års kyrkobibel (svenska, upphovsrättsfri — se README
// "Bibeltextkälla"). Data extraherad ur Språkbankens ordannoterade
// bibel1917-korpus (CC-BY-4.0, https://spraakbanken.gu.se/en/resources/bibel1917)
// och normaliserad ("HERREN"/"Herren" → "Gud", enligt användarens önskemål)
// i förväg — se scriptet i den chatt-session som skapade filerna, loggat
// i README. Ligger som statiska JSON-filer i src/data/bible-sv-1917/,
// EN gång per bok, indexerad kapitel → vers → text. Vi lagrar alltså
// bibeltexten själva (till skillnad från tidigare, då vi hämtade engelsk
// text on-demand från en extern API) — okej eftersom 1917 års översättning
// är fri från upphovsrätt, se README.
import genesisData from "@/data/bible-sv-1917/genesis.json";
import exodusData from "@/data/bible-sv-1917/exodus.json";
import matthewData from "@/data/bible-sv-1917/matthew.json";
import lukeData from "@/data/bible-sv-1917/luke.json";

export type BibleVerse = {
  chapter: number;
  verse: number;
  text: string;
};

export type BiblePassage = {
  reference: string;
  translationName: string;
  verses: BibleVerse[];
  // Satt om en eller flera efterfrågade verser saknas i vår lokala data
  // (t.ex. om Story-referensen pekar utanför vad som extraherats än).
  partial?: boolean;
};

type ParsedRef = { book: string; chapter: number; verse: number };

function parseRef(ref: string): ParsedRef | null {
  const m = ref.match(/^(.*?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  return { book: m[1], chapter: Number(m[2]), verse: Number(m[3]) };
}

// Story.startRef/endRef skrivs med engelska boknamn (t.ex. "Genesis",
// "Matthew") av historiska skäl (matchade tidigare en engelsk bibel-API).
// Denna karta pekar dem mot rätt lokal datafil + svenskt visningsnamn.
const BOOKS: Record<string, { data: Record<string, Record<string, string>>; svenskt: string }> = {
  Genesis: { data: genesisData as Record<string, Record<string, string>>, svenskt: "Första Moseboken" },
  Exodus: { data: exodusData as Record<string, Record<string, string>>, svenskt: "Andra Moseboken" },
  Matthew: { data: matthewData as Record<string, Record<string, string>>, svenskt: "Matteusevangeliet" },
  Luke: { data: lukeData as Record<string, Record<string, string>>, svenskt: "Lukasevangeliet" },
};

// Extern länk till en fullständig, fri bibelläsare för samma översättning
// — visas alltid bredvid texten som referens/dubbelkoll.
export function externalBibleUrl(startRef: string, endRef: string): string {
  const start = parseRef(startRef);
  const book = start ? BOOKS[start.book] : undefined;
  if (!book) return "https://www.bibeln.se/1917-ars-kyrkobibel";
  // Ingen pålitlig djuplänknings-URL hittad för 1917 års text hos någon
  // fri källa — länkar till den allmänna infosidan om översättningen.
  return "https://www.bibeln.se/1917-ars-kyrkobibel";
}

// Räknar ord i en sträng — delar bara på whitespace, ingen försök att
// hantera bindestreck/skiljetecken specialfall. Räcker gott för att
// avgöra "lång eller kort berättelse", vilket är hela poängen.
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\s+/).length;
}

export async function fetchBiblePassage(
  startRef: string,
  endRef: string
): Promise<BiblePassage | null> {
  const start = parseRef(startRef);
  const end = parseRef(endRef);
  if (!start || !end) return null;

  const book = BOOKS[start.book];
  if (!book) return null;

  const verses: BibleVerse[] = [];
  let anyFound = false;
  let anyMissing = false;

  for (let ch = start.chapter; ch <= end.chapter; ch++) {
    const chapterData = book.data[String(ch)];
    if (!chapterData) {
      anyMissing = true;
      continue;
    }
    const verseNums = Object.keys(chapterData)
      .map(Number)
      .sort((a, b) => a - b);
    for (const vNum of verseNums) {
      if (ch === start.chapter && vNum < start.verse) continue;
      if (ch === end.chapter && vNum > end.verse) continue;
      verses.push({ chapter: ch, verse: vNum, text: chapterData[String(vNum)] });
      anyFound = true;
    }
  }

  if (!anyFound) return null;

  return {
    reference:
      start.chapter === end.chapter
        ? `${book.svenskt} ${start.chapter}:${start.verse}-${end.verse}`
        : `${book.svenskt} ${start.chapter}:${start.verse}-${end.chapter}:${end.verse}`,
    translationName: "1917 års kyrkobibel",
    verses,
    partial: anyMissing,
  };
}
